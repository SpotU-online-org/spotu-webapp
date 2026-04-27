import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { pioneerExpiredEmailHtml } from "@/lib/emails/pioneer-expired";
import { PIONEER_THRESHOLD } from "@/lib/stripe";

// Called daily by Vercel Cron (see vercel.json)
// Finds pioneer users whose free year has expired, pauses their listings, and emails them.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Find pioneer profiles whose year has expired (and are not the test admin account)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const { data: expiredPioneers, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name")
    .lte("user_number", PIONEER_THRESHOLD)
    .neq("user_number", 9999)
    .lte("created_at", oneYearAgo.toISOString());

  if (profilesError || !expiredPioneers?.length) {
    return NextResponse.json({ processed: 0 });
  }

  const pioneerIds = expiredPioneers.map((p) => p.id);

  // Find their active pioneer listings
  const { data: listings } = await supabase
    .from("listings")
    .select("id, user_id")
    .in("user_id", pioneerIds)
    .eq("billing_status", "pioneer");

  const listingIds = listings?.map((l) => l.id) ?? [];

  if (listingIds.length > 0) {
    await supabase
      .from("listings")
      .update({ billing_status: "cancelled", status: "paused" })
      .in("id", listingIds);
  }

  // Send expiry email to each affected pioneer
  const resend = getResend();
  const emailPromises = expiredPioneers.map(async (pioneer) => {
    // Fetch email from auth.users via the service-role client
    const { data: userData } = await supabase.auth.admin.getUserById(pioneer.id);
    const email = userData?.user?.email;
    if (!email) return;

    const name = (pioneer.display_name as string | null) ?? "";
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Tu año pionero en SpotU ha concluido",
      html: pioneerExpiredEmailHtml(name),
    });
  });

  await Promise.allSettled(emailPromises);

  return NextResponse.json({
    processed: expiredPioneers.length,
    listingsPaused: listingIds.length,
  });
}
