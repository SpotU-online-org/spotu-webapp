"use client";

import Link from "next/link";
import { SpotULogo } from "./SpotULogo";
import { LanguageToggle, useI18n } from "./LanguageToggle";
import { linkButtonVariants } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <SpotULogo variant="horizontal" width={120} height={36} />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/feed"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.explore")}
          </Link>
          <Link
            href="/publish"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.publish")}
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          {/* Language toggle — visually separated */}
          <LanguageToggle />

          {/* Divider */}
          <div className="mx-2 h-6 w-px bg-border" />

          {/* Auth buttons */}
          <Link
            href="/auth/login"
            className={cn(
              linkButtonVariants({ variant: "ghost", size: "default" })
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
        </div>
      </div>
    </header>
  );
}
