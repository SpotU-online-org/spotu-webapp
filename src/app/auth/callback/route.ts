import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { welcomeEmailHtml } from "@/lib/emails/welcome";
import { NextRequest, NextResponse } from "next/server";

const VALID_ROLES = ["advertiser", "space_owner", "agency"] as const;
type ValidRole = (typeof VALID_ROLES)[number];

function isValidRole(r: string): r is ValidRole {
  return VALID_ROLES.includes(r as ValidRole);
}

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

  // --- Resolve primary role ---
  const cookieRole = request.cookies.get("spotu_pending_role")?.value;
  const metaRole = data.user.user_metadata?.role as string | undefined;
  const role: ValidRole | null =
    cookieRole && isValidRole(cookieRole) ? cookieRole
    : metaRole && isValidRole(metaRole) ? metaRole
    : null;

  // --- Resolve types array ---
  const cookieTypesRaw = request.cookies.get("spotu_pending_types")?.value;
  const metaTypes = data.user.user_metadata?.types;

  let types: ValidRole[] = [];
  if (cookieTypesRaw) {
    types = cookieTypesRaw.split(",").filter(isValidRole) as ValidRole[];
  } else if (Array.isArray(metaTypes)) {
    types = (metaTypes as string[]).filter(isValidRole) as ValidRole[];
  }

  // Fall back: if types is empty but we have a role, use that
  if (types.length === 0 && role) types = [role];

  const primaryRole = types[0] ?? role;

  // Check if this is a new user who needs to select their role
  const { data: profile } = await supabase
    .from("profiles")
    .select("setup_completed, type, display_name")
    .eq("id", data.user.id)
    .single();

  const isNewUser = !profile?.setup_completed;

  const response = NextResponse.redirect(new URL(next, origin));
  if (cookieRole) response.cookies.delete("spotu_pending_role");
  if (cookieTypesRaw) response.cookies.delete("spotu_pending_types");

  if (primaryRole) {
    await supabase
      .from("profiles")
      .update({ type: primaryRole, types, setup_completed: true })
      .eq("id", data.user.id);

    // Send welcome email to new users
    if (isNewUser && data.user.email) {
      const name = (profile?.display_name as string | null) ?? data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? "";
      getResend().emails.send({
        from: FROM_EMAIL,
        to: data.user.email,
        subject: "¡Bienvenido a SpotU!",
        html: welcomeEmailHtml(name as string),
      }).catch(() => { /* fire-and-forget, don't block redirect */ });
    }

    return response;
  }

  // New Google user without role → send to setup
  if (!profile?.setup_completed) {
    return NextResponse.redirect(new URL("/auth/setup", origin));
  }

  return response;
}
