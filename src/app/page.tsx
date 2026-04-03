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
      color: "text-indigo",
      bg: "bg-indigo/10",
      borderHover: "hover:border-indigo/30",
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

  return (
    <div className="bg-[#0B0F1A] text-white">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <AnimatedGrid />
          <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
                </span>
                {t("hero.badge")}
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                {t("hero.title.1")}{" "}
                <span className="bg-gradient-to-r from-indigo to-coral bg-clip-text text-transparent">
                  {t("hero.title.2")}
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-400 sm:text-xl">
                {t("hero.description")}
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <LinkButton href="/auth/register" size="lg" className="px-6">
                  {t("hero.cta.primary")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </LinkButton>
                <LinkButton
                  href="/feed"
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white px-6"
                >
                  {t("hero.cta.secondary")}
                </LinkButton>
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("roles.title")}
              </h2>
              <p className="mt-4 text-slate-400">
                {t("roles.description")}
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ROLES.map((role) => (
                <div
                  key={role.title}
                  className={`group relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all ${role.borderHover} hover:bg-white/[0.06]`}
                >
                  <div className={`inline-flex rounded-xl ${role.bg} p-3`}>
                    <role.icon className={`h-6 w-6 ${role.color}`} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{role.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {role.description}
                  </p>
                  <Link
                    href={role.href}
                    className={`mt-6 inline-flex items-center text-sm font-medium ${role.color} hover:underline`}
                  >
                    {role.cta}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative py-20 sm:py-28">
          <div className="absolute inset-0 bg-white/[0.02]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("steps.title")}
              </h2>
              <p className="mt-4 text-slate-400">
                {t("steps.description")}
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo text-white">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="mt-4 block text-xs font-bold uppercase tracking-wider text-indigo">
                    Paso {step.step}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("features.title")}
              </h2>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo/10">
                    <feature.icon className="h-5 w-5 text-indigo" />
                  </div>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo/20 via-indigo/10 to-coral/20" />
          <div className="absolute inset-0 bg-[#0B0F1A]/60" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              {t("cta.description")}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <LinkButton
                href="/auth/register"
                size="lg"
                className="px-6"
              >
                {t("cta.primary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
              <LinkButton
                href="/feed"
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white px-6"
              >
                {t("cta.secondary")}
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
