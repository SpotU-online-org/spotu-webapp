import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const VALID_ROLES = ["advertiser", "space_owner", "agency"] as const;

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=missing_code", origin)
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      new URL("/auth/login?error=auth_failed", origin)
    );
  }

  // Determine role to apply:
  // 1. Cookie set before OAuth redirect (takes priority)
  // 2. User metadata passed during email signup
  const cookieRole = request.cookies.get("spotu_pending_role")?.value;
  const metaRole = data.user.user_metadata?.role as string | undefined;
  const role = (
    cookieRole && VALID_ROLES.includes(cookieRole as (typeof VALID_ROLES)[number])
      ? cookieRole
      : metaRole && VALID_ROLES.includes(metaRole as (typeof VALID_ROLES)[number])
        ? metaRole
        : null
  ) as (typeof VALID_ROLES)[number] | null;

  if (role) {
    await supabase
      .from("profiles")
      .update({ type: role })
      .eq("id", data.user.id);
  }

  const response = NextResponse.redirect(new URL(next, origin));

  // Clear the pending role cookie
  if (cookieRole) {
    response.cookies.delete("spotu_pending_role");
  }

  return response;
}
