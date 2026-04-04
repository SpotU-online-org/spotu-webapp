"use client";

import Link from "next/link";
import {
  Megaphone,
  MapPin,
  Briefcase,
  Search,
  MousePointerClick,
  Handshake,
  ArrowRight,
  Zap,
  Eye,
  Shield,
  Gift,
} from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnimatedGrid } from "@/components/layout/AnimatedGrid";
import { RevealOnScroll } from "@/components/layout/RevealOnScroll";
import { useI18n } from "@/components/layout/LanguageToggle";

type Stats = {
  users: number;
  spaces: number;
  advertisers: number;
  agencies: number;
};

export function HomeClient({ stats }: { stats: Stats }) {
  const { t } = useI18n();

  const ROLES = [
    {
      icon: Megaphone,
      title: t("roles.advertisers.title"),
      description: t("roles.advertisers.description"),
      cta: t("roles.advertisers.cta"),
      href: "/feed",
      color: "text-primary",
      bg: "bg-primary/10",
      borderHover: "hover:border-primary/30",
    },
    {
      icon: MapPin,
      title: t("roles.spaces.title"),
      description: t("roles.spaces.description"),
      cta: t("roles.spaces.cta"),
      href: "/auth/register",
      color: "text-coral",
      bg: "bg-coral/10",
      borderHover: "hover:border-coral/30",
    },
    {
      icon: Briefcase,
      title: t("roles.agencies.title"),
      description: t("roles.agencies.description"),
      cta: t("roles.agencies.cta"),
      href: "/auth/register",
      color: "text-emerald",
      bg: "bg-emerald/10",
      borderHover: "hover:border-emerald/30",
    },
  ];

  const STEPS = [
    {
      icon: Search,
      step: "01",
      title: t("steps.1.title"),
      description: t("steps.1.description"),
    },
    {
      icon: MousePointerClick,
      step: "02",
      title: t("steps.2.title"),
      description: t("steps.2.description"),
    },
    {
      icon: Handshake,
      step: "03",
      title: t("steps.3.title"),
      description: t("steps.3.description"),
    },
  ];

  const FEATURES = [
    {
      icon: Zap,
      title: t("features.1.title"),
      description: t("features.1.description"),
    },
    {
      icon: Eye,
      title: t("features.2.title"),
      description: t("features.2.description"),
    },
    {
      icon: Shield,
      title: t("features.3.title"),
      description: t("features.3.description"),
    },
  ];

  const STATS = [
    { value: stats.users, label: "Usuarios registrados" },
    { value: stats.spaces, label: "Espacios publicitarios" },
    { value: stats.advertisers, label: "Solicitudes de anunciantes" },
    { value: stats.agencies, label: "Agencias de marketing" },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ===================== HERO ===================== */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          <AnimatedGrid />

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            {/* Floating decorative shapes */}
            <div className="absolute top-16 left-6 hidden sm:block animate-float opacity-[0.18]">
              <div className="h-14 w-14 rounded-2xl border-2 border-primary/50 rotate-12" />
            </div>
            <div className="absolute bottom-24 right-10 hidden sm:block animate-float-slow opacity-[0.15]">
              <div className="h-10 w-16 rounded-xl border-2 border-coral/50 -rotate-6" />
            </div>
            <div className="absolute top-1/3 right-6 hidden md:block animate-float opacity-[0.13] [animation-delay:2s]">
              <Megaphone className="h-9 w-9 text-primary" />
            </div>
            <div className="absolute bottom-1/3 left-10 hidden md:block animate-float-slow opacity-[0.12] [animation-delay:1s]">
              <MapPin className="h-7 w-7 text-coral" />
            </div>

            <div className="mx-auto max-w-3xl text-center">
              {/* Single early-access badge */}
              <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-50 px-4 py-1.5 text-sm text-amber-700">
                <Gift className="h-3.5 w-3.5 shrink-0" />
                Los primeros 100 usuarios obtienen 1 año gratis de acceso completo
              </div>

              {/* Title */}
              <h1 className="animate-fade-in-up delay-100 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
                {t("hero.title.1")}{" "}
                <span className="bg-gradient-to-r from-primary to-coral bg-clip-text text-transparent animate-gradient">
                  {t("hero.title.2")}
                </span>
              </h1>

              {/* Description */}
              <p className="animate-fade-in-up delay-200 mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
                {t("hero.description")}
              </p>

              {/* CTAs */}
              <div className="animate-fade-in-up delay-300 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <LinkButton href="/auth/register" size="lg" className="w-full sm:w-auto px-8 h-12 text-base">
                  {t("hero.cta.primary")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
                </LinkButton>
                <LinkButton
                  href="/feed"
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 h-12 text-base"
                >
                  {t("hero.cta.secondary")}
                </LinkButton>
              </div>

              {/* Stats row */}
              {STATS.some((s) => s.value > 0) && (
                <div className="animate-fade-in-up delay-400 mt-12 grid grid-cols-2 gap-6 border-t border-border/40 pt-10 sm:grid-cols-4">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-bold text-foreground tabular-nums">
                        {stat.value > 0 ? `${stat.value}+` : "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===================== ROLES ===================== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Left-aligned header */}
            <RevealOnScroll className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("roles.title")}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t("roles.description")}
              </p>
            </RevealOnScroll>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ROLES.map((role, i) => (
                <RevealOnScroll key={role.title} delay={i * 100}>
                  <div
                    className={`group relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${role.borderHover} h-full`}
                  >
                    <div className={`inline-flex rounded-xl ${role.bg} p-3`}>
                      <role.icon className={`h-6 w-6 ${role.color}`} />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">{role.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {role.description}
                    </p>
                    <Link
                      href={role.href}
                      className={`mt-6 inline-flex items-center text-sm font-medium ${role.color} hover:underline transition-colors`}
                    >
                      {role.cta}
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== HOW IT WORKS ===================== */}
        <section className="py-20 sm:py-28 bg-card/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RevealOnScroll className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("steps.title")}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t("steps.description")}
              </p>
            </RevealOnScroll>

            {/* Desktop: 3 cols with connector | Mobile: vertical timeline */}
            <div className="mt-14 hidden sm:grid sm:grid-cols-3 sm:gap-10">
              {STEPS.map((step, i) => (
                <RevealOnScroll key={step.step} delay={i * 120} className="relative">
                  {i < STEPS.length - 1 && (
                    <div className="absolute top-4 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-border/70" />
                  )}
                  <div className="flex flex-col">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/50 bg-background text-xs font-mono font-bold text-primary">
                      {step.step}
                    </div>
                    <h3 className="mt-5 font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            {/* Mobile vertical timeline */}
            <div className="mt-10 sm:hidden">
              {STEPS.map((step, i) => (
                <RevealOnScroll key={step.step} delay={i * 120}>
                  <div className="relative flex gap-5 pb-9 last:pb-0">
                    {i < STEPS.length - 1 && (
                      <div className="absolute left-3.5 top-8 bottom-0 w-px bg-border/60" />
                    )}
                    <div className="relative shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-primary/50 bg-background text-xs font-mono font-bold text-primary">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== FEATURES ===================== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Left-aligned header */}
            <RevealOnScroll className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("features.title")}
              </h2>
            </RevealOnScroll>

            {/* Left-aligned feature rows instead of centered cards */}
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <RevealOnScroll key={feature.title} delay={i * 100}>
                  <div className="flex gap-4">
                    <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CTA ===================== */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-indigo" />

          <RevealOnScroll direction="none" className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              {t("cta.title.line1")}
              <br />
              {t("cta.title.line2.prefix")}
              <span className="relative whitespace-nowrap">
                {t("cta.title.free")}
                {/* Elegant wavy underline */}
                <svg
                  className="absolute -bottom-1 left-0 w-full overflow-visible"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0,5 Q25,1 50,5 Q75,9 100,5"
                    stroke="rgba(251,191,36,0.65)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {t("cta.title.line2.suffix")}
            </h2>
            <p className="mt-6 text-lg text-white/80">
              {t("cta.description")}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <LinkButton
                href="/auth/register"
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 h-12 text-base shadow-lg shadow-black/10"
              >
                {t("cta.primary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
              <LinkButton
                href="/feed"
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white px-8 h-12 text-base"
              >
                {t("cta.secondary")}
              </LinkButton>
            </div>
          </RevealOnScroll>
        </section>
      </main>
      <Footer />
    </>
  );
}
