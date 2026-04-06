import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Delete all listings (images stay in storage, acceptable for MVP)
  await supabase.from("listings").delete().eq("user_id", user.id);

  // 2. Delete favorites
  await supabase.from("favorites").delete().eq("user_id", user.id);

  // 3. Delete closed interactions
  await supabase.from("closed_interactions").delete().or(`provider_id.eq.${user.id},client_id.eq.${user.id}`);

  // 4. Delete profile
  await supabase.from("profiles").delete().eq("id", user.id);

  // 5. Delete auth user — requires service role key
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[delete-account] Failed to delete auth user:", error.message);
    return NextResponse.json({ error: "Could not delete auth user" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
