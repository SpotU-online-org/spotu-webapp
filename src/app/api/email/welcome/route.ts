import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { welcomeEmailHtml } from "@/lib/emails/welcome";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ ok: false }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const name = (profile?.display_name as string | null) ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? "";

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: user.email,
    subject: "¡Bienvenido a SpotU!",
    html: welcomeEmailHtml(name),
  });

  return NextResponse.json({ ok: true });
}
