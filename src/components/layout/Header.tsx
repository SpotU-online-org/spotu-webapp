"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { SpotULogo } from "./SpotULogo";
import { LanguageToggle, useI18n } from "./LanguageToggle";
import { linkButtonVariants } from "@/components/ui/link-button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Header() {
  const { t } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <SpotULogo variant="horizontal" width={140} height={42} />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/feed"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.explore")}
          </Link>
          {user && (
            <Link
              href="/publish"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.publish")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />

          <div className="mx-1.5 h-5 w-px bg-border" />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className={cn(
                  linkButtonVariants({ variant: "ghost", size: "default" }),
                  "gap-2 text-muted-foreground hover:text-foreground"
                )}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Mi cuenta</span>
              </button>

              {menuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  {/* Dropdown */}
                  <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border bg-card shadow-lg overflow-hidden">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/publish"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      {t("nav.publish")}
                    </Link>
                    <div className="border-t" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(
                  linkButtonVariants({ variant: "ghost", size: "default" }),
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/auth/register"
                className={cn(linkButtonVariants({ size: "default" }))}
              >
                {t("nav.register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
