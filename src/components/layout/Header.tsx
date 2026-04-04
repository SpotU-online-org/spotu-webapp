"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, Menu, X } from "lucide-react";
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo — fixed size, never shrinks */}
        <Link href="/" className="flex items-center shrink-0" onClick={() => setMobileOpen(false)}>
          <SpotULogo variant="horizontal" width={120} height={36} className="w-[120px] h-[36px] object-contain" />
        </Link>

        {/* Desktop nav */}
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

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageToggle />

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            <div className="mx-1.5 h-5 w-px bg-border" />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className={cn(
                    linkButtonVariants({ variant: "ghost", size: "default" }),
                    "gap-2 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Mi cuenta</span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border bg-card shadow-lg overflow-hidden">
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                        Dashboard
                      </Link>
                      <Link href="/publish" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                        {t("nav.publish")}
                      </Link>
                      <Link href="/profile/edit" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                        Mi perfil
                      </Link>
                      <div className="border-t" />
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors">
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
                <Link href="/auth/register" className={cn(linkButtonVariants({ size: "default" }))}>
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={cn(
              linkButtonVariants({ variant: "ghost", size: "default" }),
              "md:hidden p-2 text-muted-foreground hover:text-foreground"
            )}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-background/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 top-full z-50 border-b bg-background shadow-lg md:hidden">
            <nav className="mx-auto max-w-7xl flex flex-col px-4 py-3 gap-0.5">
              <Link
                href="/feed"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {t("nav.explore")}
              </Link>

              {user ? (
                <>
                  <Link href="/publish" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    {t("nav.publish")}
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/profile/edit" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Mi perfil
                  </Link>
                  <div className="my-1 border-t" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <div className="my-1 border-t" />
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className={cn(linkButtonVariants({ size: "default" }), "mx-4 my-2 justify-center")}
                  >
                    {t("nav.register")}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
