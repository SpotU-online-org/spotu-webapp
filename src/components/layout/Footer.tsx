"use client";

import Link from "next/link";
import { SpotULogo } from "./SpotULogo";
import { useI18n } from "./LanguageToggle";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border/60 bg-card/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <SpotULogo variant="horizontal" width={100} height={30} />
            <p className="text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("footer.platform")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/feed"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.explore_spaces")}
                </Link>
              </li>
              <li>
                <Link
                  href="/publish"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.publish")}
                </Link>
              </li>
              <li>
                <Link
                  href="/feed?type=agency"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.find_agencies")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.about")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SpotU. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
