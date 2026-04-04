import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_code", origin));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/auth/login?error=auth_failed", origin));
  }

  const cookieRole = request.cookies.get("spotu_pending_role")?.value;
  const metaRole = data.user.user_metadata?.role as string | undefined;
  const VALID_ROLES = ["advertiser", "space_owner", "agency"] as const;
  type ValidRole = (typeof VALID_ROLES)[number];

  const role = (
    cookieRole && VALID_ROLES.includes(cookieRole as ValidRole) ? cookieRole as ValidRole
    : metaRole && VALID_ROLES.includes(metaRole as ValidRole) ? metaRole as ValidRole
    : null
  );

  // Check if this is a new user who needs to select their role
  const { data: profile } = await supabase
    .from("profiles")
    .select("setup_completed, type")
    .eq("id", data.user.id)
    .single();

  const response = NextResponse.redirect(new URL(next, origin));
  if (cookieRole) response.cookies.delete("spotu_pending_role");

  // Apply role if provided
  if (role) {
    await supabase
      .from("profiles")
      .update({ type: role, types: [role], setup_completed: true })
      .eq("id", data.user.id);
    return response;
  }

  // New Google user without role → send to setup
  if (!profile?.setup_completed) {
    return NextResponse.redirect(new URL("/auth/setup", origin));
  }

  return response;
}
