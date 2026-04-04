"use client";

import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { SpotULogo } from "./SpotULogo";
import { useI18n } from "./LanguageToggle";

const WHATSAPP_PLACEHOLDER = "https://wa.me/10000000000"; // TODO: reemplazar con número real de SpotU

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border/60 bg-card/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <SpotULogo variant="horizontal" width={130} height={40} />
            <p className="text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
            {/* Contacto SpotU */}
            <div className="space-y-2 pt-1">
              <a
                href="mailto:admin@spotu.online"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                admin@spotu.online
              </a>
              <a
                href={WHATSAPP_PLACEHOLDER}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                {t("footer.whatsapp")}
              </a>
            </div>
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
