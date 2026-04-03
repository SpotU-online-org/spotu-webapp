import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/dashboard", "/publish", "/settings", "/profile/edit"];
// Routes only for unauthenticated users (redirect logged-in users away)
const AUTH_ONLY_PATHS = ["/auth/login", "/auth/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh session first
  const response = await updateSession(request);

  // Check auth state for protected / auth-only routes
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected || isAuthOnly) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (isProtected && !user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthOnly && user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|logos/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
