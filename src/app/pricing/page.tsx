"use client";

import Link from "next/link";
import { Check, Zap, Star, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/components/layout/LanguageToggle";
import { linkButtonVariants } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

// ─── Plan data ────────────────────────────────────────────────────────────────

function usePlans() {
  const { t } = useI18n();
  return [
    {
      key: "spaces",
      name: t("pricing.plan.spaces.name"),
      desc: t("pricing.plan.spaces.desc"),
      price: "4.99",
      boostPrice: "2.99",
      highlight: false,
      features: [
        t("pricing.feature.listing"),
        t("pricing.feature.contacts"),
        t("pricing.feature.stats"),
        t("pricing.feature.boost"),
        t("pricing.feature.multi"),
        t("pricing.feature.nocommission"),
        t("pricing.feature.pause"),
      ],
    },
    {
      key: "agency",
      name: t("pricing.plan.agency.name"),
      desc: t("pricing.plan.agency.desc"),
      price: "9.99",
      boostPrice: "4.99",
      highlight: true,
      features: [
        t("pricing.feature.listing"),
        t("pricing.feature.contacts"),
        t("pricing.feature.stats"),
        t("pricing.feature.boost_agency"),
        t("pricing.feature.multi_agency"),
        t("pricing.feature.nocommission"),
        t("pricing.feature.pause"),
      ],
    },
  ];
}

function useFaqs() {
  const { t } = useI18n();
  return [
    { q: t("pricing.faq.1.q"), a: t("pricing.faq.1.a") },
    { q: t("pricing.faq.2.q"), a: t("pricing.faq.2.a") },
    { q: t("pricing.faq.3.q"), a: t("pricing.faq.3.a") },
    { q: t("pricing.faq.4.q"), a: t("pricing.faq.4.a") },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        <span>{q}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const { t } = useI18n();
  const plans = usePlans();
  const faqs = useFaqs();

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">

        {/* ── Hero ── */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              {t("pricing.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("pricing.title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {t("pricing.subtitle")}
            </p>
          </div>
        </section>

        {/* ── Plans ── */}
        <section className="pb-20 sm:pb-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

            {/* Section label */}
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("pricing.per_listing")}
            </p>

            <div className="grid gap-6 sm:grid-cols-3">

              {/* ── Free card ── */}
              <div className="flex flex-col rounded-2xl border-2 border-border bg-card p-7 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("pricing.plan.free.name")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {t("pricing.plan.free.desc")}
                </p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-5xl font-bold tracking-tight text-foreground">$0</span>
                  <span className="mb-1 text-sm text-muted-foreground">/ always</span>
                </div>
                <div className="mt-3 h-6" />{/* spacer aligns CTA with paid cards */}
                <Link
                  href="/auth/register"
                  className={cn(linkButtonVariants({ variant: "outline", size: "default" }), "mt-7 w-full justify-center")}
                >
                  {t("pricing.plan.free.cta")}
                </Link>
                <ul className="mt-8 space-y-3">
                  {[
                    t("pricing.feature.free.explore"),
                    t("pricing.feature.free.profiles"),
                    t("pricing.feature.free.favorites"),
                    t("pricing.feature.free.contact"),
                    t("pricing.feature.free.search"),
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Paid plans ── */}
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={cn(
                    "flex flex-col rounded-2xl border-2 bg-card p-7 shadow-sm transition-shadow hover:shadow-md",
                    plan.highlight ? "border-primary" : "border-border"
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {plan.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {plan.desc}
                  </p>

                  <div className="mt-6 flex items-end gap-1">
                    <span className="text-sm font-medium text-muted-foreground">USD</span>
                    <span className="text-5xl font-bold tracking-tight text-foreground">
                      ${plan.price}
                    </span>
                    <span className="mb-1 text-sm text-muted-foreground">/{t("pricing.monthly")}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      <Check className="h-3 w-3" />
                      {t("pricing.free_trial")}
                    </span>
                    <span className="text-xs text-muted-foreground self-center">
                      {t("pricing.free_trial_note")}
                    </span>
                  </div>

                  <Link
                    href="/auth/register"
                    className={cn(
                      plan.highlight
                        ? linkButtonVariants({ size: "default" })
                        : linkButtonVariants({ variant: "outline", size: "default" }),
                      "mt-7 w-full justify-center"
                    )}
                  >
                    {t("pricing.cta")}
                  </Link>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Second listing note */}
            <p className="mt-5 text-center text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{t("pricing.immediate")}</span>
              {" · "}
              {t("pricing.immediate_note")}
            </p>
          </div>
        </section>

        {/* ── Boost ── */}
        <section className="bg-card/60 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border bg-card p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                  <Zap className="h-5 w-5 fill-amber-400 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{t("pricing.boost_title")}</h2>
              </div>
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground leading-relaxed">
                {t("pricing.boost_desc")}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-background p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("pricing.boost_spaces")}
                  </p>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="text-3xl font-bold text-foreground">$2.99</span>
                    <span className="mb-0.5 text-sm text-muted-foreground">USD/{t("pricing.week")}</span>
                  </div>
                </div>
                <div className="rounded-xl border bg-background p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("pricing.boost_agencies")}
                  </p>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="text-3xl font-bold text-foreground">$4.99</span>
                    <span className="mb-0.5 text-sm text-muted-foreground">USD/{t("pricing.week")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pioneer ── */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-background to-background p-8 sm:p-10">
              {/* Decorative star */}
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-amber-100/60" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                  <Star className="h-7 w-7 fill-amber-400 text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-foreground">{t("pricing.pioneer_title")}</h2>
                    <span className="rounded-full bg-amber-200 px-3 py-0.5 text-xs font-semibold text-amber-800">
                      {t("pricing.pioneer_spots")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                    {t("pricing.pioneer_desc")}
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="rounded-xl border-2 border-amber-300 bg-white px-6 py-4 text-center">
                    <p className="text-3xl font-bold text-amber-600">$0</p>
                    <p className="text-xs text-amber-700 font-medium">1 año · All inclusive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-card/60 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center">{t("pricing.faq_title")}</h2>
            <div className="mt-8 rounded-2xl border bg-card px-6">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-foreground">
              {t("cta.title.line1")}{" "}
              <span className="text-primary">{t("cta.title.free")}</span>
              {t("cta.title.line2.suffix")}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">{t("cta.description")}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/auth/register" className={cn(linkButtonVariants({ size: "lg" }), "justify-center")}>
                {t("pricing.cta")}
              </Link>
              <Link href="/feed" className={cn(linkButtonVariants({ variant: "outline", size: "lg" }), "justify-center")}>
                {t("cta.secondary")}
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
