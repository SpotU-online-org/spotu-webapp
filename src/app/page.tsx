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
} from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnimatedGrid } from "@/components/layout/AnimatedGrid";
import { RevealOnScroll } from "@/components/layout/RevealOnScroll";
import { useI18n } from "@/components/layout/LanguageToggle";

export default function HomePage() {
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
      ring: "group-hover:ring-primary/10",
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
      ring: "group-hover:ring-coral/10",
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
      ring: "group-hover:ring-emerald/10",
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

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ===================== HERO ===================== */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          <AnimatedGrid />

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
                </span>
                {t("hero.badge")}
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
                <LinkButton href="/auth/register" size="lg" className="px-8 h-12 text-base">
                  {t("hero.cta.primary")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
                </LinkButton>
                <LinkButton
                  href="/feed"
                  size="lg"
                  variant="outline"
                  className="px-8 h-12 text-base"
                >
                  {t("hero.cta.secondary")}
                </LinkButton>
              </div>
            </div>

            {/* Floating decorative elements — advertising motifs */}
            <div className="absolute top-16 left-8 hidden lg:block animate-float opacity-20">
              <div className="h-16 w-16 rounded-2xl border-2 border-primary/40 rotate-12" />
            </div>
            <div className="absolute bottom-20 right-12 hidden lg:block animate-float-slow opacity-15">
              <div className="h-12 w-20 rounded-xl border-2 border-coral/40 -rotate-6" />
            </div>
            <div className="absolute top-1/3 right-8 hidden lg:block animate-float opacity-10 [animation-delay:2s]">
              <Megaphone className="h-10 w-10 text-primary" />
            </div>
            <div className="absolute bottom-1/3 left-12 hidden lg:block animate-float-slow opacity-10 [animation-delay:1s]">
              <MapPin className="h-8 w-8 text-coral" />
            </div>
          </div>
        </section>

        {/* ===================== ROLES ===================== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RevealOnScroll className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("roles.title")}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t("roles.description")}
              </p>
            </RevealOnScroll>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ROLES.map((role, i) => (
                <RevealOnScroll key={role.title} delay={i * 100}>
                  <div
                    className={`group relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${role.borderHover} h-full`}
                  >
                    <div className={`inline-flex rounded-xl ${role.bg} p-3 transition-transform duration-300 group-hover:scale-110`}>
                      <role.icon className={`h-6 w-6 ${role.color}`} />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">{role.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
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

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <RevealOnScroll key={step.step} delay={i * 120} className="relative text-center group">
                  {/* Connector line between steps */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden sm:block absolute top-7 left-[calc(50%+36px)] w-[calc(100%-72px)] h-px bg-gradient-to-r from-border to-transparent" />
                  )}

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="mt-4 block text-xs font-bold uppercase tracking-wider text-primary">
                    {t("steps.prefix")} {step.step}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== FEATURES ===================== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RevealOnScroll className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("features.title")}
              </h2>
            </RevealOnScroll>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <RevealOnScroll key={feature.title} delay={i * 100}>
                  <div className="group flex flex-col items-center text-center rounded-2xl border border-transparent p-8 transition-all duration-300 hover:border-border hover:bg-card hover:shadow-sm h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:shadow-md group-hover:shadow-primary/20">
                      <feature.icon className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CTA ===================== */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-indigo" />
          <div className="absolute inset-0 opacity-10">
            <div
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
              className="h-full w-full"
            />
          </div>

          <RevealOnScroll direction="none" className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              {t("cta.title.line1")}{" "}
              <span className="inline-block rounded-lg bg-white/15 px-3 py-1 text-white backdrop-blur-sm ring-1 ring-white/20">
                {t("cta.title.free")}
              </span>
              <br />
              {t("cta.title.line2")}
            </h2>
            <p className="mt-6 text-lg text-white/80">
              {t("cta.description")}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <LinkButton
                href="/auth/register"
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 px-8 h-12 text-base shadow-lg shadow-black/10"
              >
                {t("cta.primary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
              <LinkButton
                href="/feed"
                size="lg"
                variant="outline"
                className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white px-8 h-12 text-base"
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
