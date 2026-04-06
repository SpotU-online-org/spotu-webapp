"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, MapPin, Briefcase, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { linkButtonVariants } from "@/components/ui/link-button";
import { useI18n } from "@/components/layout/LanguageToggle";

const ROLES = [
  {
    value: "advertiser" as const,
    icon: Megaphone,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    ring: "ring-primary/20",
  },
  {
    value: "space_owner" as const,
    icon: MapPin,
    color: "text-[oklch(0.702_0.183_56.823)]",
    bg: "bg-[oklch(0.702_0.183_56.823)]/10",
    border: "border-[oklch(0.702_0.183_56.823)]/30",
    ring: "ring-[oklch(0.702_0.183_56.823)]/20",
  },
  {
    value: "agency" as const,
    icon: Briefcase,
    color: "text-[oklch(0.696_0.17_162.48)]",
    bg: "bg-[oklch(0.696_0.17_162.48)]/10",
    border: "border-[oklch(0.696_0.17_162.48)]/30",
    ring: "ring-[oklch(0.696_0.17_162.48)]/20",
  },
] as const;

type Role = (typeof ROLES)[number]["value"];

export default function SetupPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [selected, setSelected] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(role: Role) {
    setSelected((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  async function handleContinue() {
    if (selected.length === 0) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }

    const primaryType = selected[0];
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ type: primaryType, types: selected, setup_completed: true })
      .eq("id", user.id);

    if (updateError) {
      setError("Hubo un error. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    // Fire-and-forget welcome email for new Google users
    fetch("/api/email/welcome", { method: "POST" }).catch(() => {});

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-lg">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("auth.setup.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth.setup.subtitle")}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {ROLES.map((r) => {
            const active = selected.includes(r.value);
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => toggle(r.value)}
                className={cn(
                  "group flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                  active
                    ? `${r.border} bg-card ring-2 ${r.ring} shadow-sm`
                    : "border-border hover:border-border/80 hover:bg-muted/40"
                )}
              >
                <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", r.bg)}>
                  <r.icon className={cn("h-5 w-5", r.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{t(`role.${r.value}.title`)}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{t(`role.${r.value}.desc`)}</p>
                </div>
                <div className={cn(
                  "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                  active ? `border-transparent bg-primary` : "border-border"
                )}>
                  {active && <Check className="h-3 w-3 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleContinue}
          disabled={selected.length === 0 || loading}
          className={cn(
            linkButtonVariants({ size: "lg" }),
            "mt-6 w-full h-11",
            (selected.length === 0 || loading) && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.setup.continue")}
        </button>
      </div>
    </div>
  );
}
