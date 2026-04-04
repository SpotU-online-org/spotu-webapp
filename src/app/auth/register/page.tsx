"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Megaphone, MapPin, Briefcase, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { linkButtonVariants } from "@/components/ui/link-button";
import { useI18n } from "@/components/layout/LanguageToggle";

type Role = "advertiser" | "space_owner" | "agency";

const ROLES = [
  {
    value: "advertiser" as Role,
    icon: Megaphone,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    ring: "ring-primary/20",
  },
  {
    value: "space_owner" as Role,
    icon: MapPin,
    color: "text-[oklch(0.702_0.183_56.823)]",
    bg: "bg-[oklch(0.702_0.183_56.823)]/10",
    border: "border-[oklch(0.702_0.183_56.823)]/30",
    ring: "ring-[oklch(0.702_0.183_56.823)]/20",
  },
  {
    value: "agency" as Role,
    icon: Briefcase,
    color: "text-[oklch(0.696_0.17_162.48)]",
    bg: "bg-[oklch(0.696_0.17_162.48)]/10",
    border: "border-[oklch(0.696_0.17_162.48)]/30",
    ring: "ring-[oklch(0.696_0.17_162.48)]/20",
  },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRole = ROLES.find((r) => r.value === role);

  async function handleEmailSignUp() {
    if (!role || !name.trim() || !email.trim() || !password) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: name.trim(), role },
        emailRedirectTo: `${location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (signUpError) {
      setError(translateError(signUpError.message));
      setLoading(false);
      return;
    }

    // If session is returned immediately (email confirmation disabled)
    if (data.session && data.user) {
      await supabase
        .from("profiles")
        .update({ type: role, display_name: name.trim() })
        .eq("id", data.user.id);
      router.push("/dashboard");
      return;
    }

    // Email confirmation required
    router.push("/auth/confirm");
  }

  async function handleGoogleSignUp() {
    if (!role) return;
    setLoading(true);
    setError(null);

    // Store role in cookie for 5 minutes (survives the OAuth redirect)
    document.cookie = `spotu_pending_role=${role}; path=/; max-age=300; SameSite=Lax`;

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (oauthError) {
      setError(translateError(oauthError.message));
      setLoading(false);
    }
  }

  function translateError(msg: string): string {
    if (msg.includes("already registered")) return "Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?";
    if (msg.includes("Password should be")) return "La contraseña debe tener al menos 6 caracteres.";
    if (msg.includes("Invalid email")) return "El correo electrónico no es válido.";
    return "Ocurrió un error. Intenta de nuevo.";
  }

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
            step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            1
          </div>
          <span className={cn("text-sm font-medium", step >= 1 ? "text-foreground" : "text-muted-foreground")}>
            {t("auth.register.step1")}
          </span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
            step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            2
          </div>
          <span className={cn("text-sm font-medium", step >= 2 ? "text-foreground" : "text-muted-foreground")}>
            {t("auth.register.step2")}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        {/* ── STEP 1: Role selection ── */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t("auth.register.how")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("auth.register.pick_role")}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    "group flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                    role === r.value
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
                    "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    role === r.value ? `border-transparent ${r.bg}` : "border-border"
                  )}>
                    {role === r.value && (
                      <div className={cn("h-2.5 w-2.5 rounded-full", r.color.replace("text-", "bg-"))} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!role}
              onClick={() => setStep(2)}
              className={cn(
                linkButtonVariants({ size: "lg" }),
                "mt-6 w-full h-11",
                !role && "opacity-50 cursor-not-allowed"
              )}
            >
              {t("auth.register.continue")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {t("auth.register.already")}{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                {t("auth.register.login_link")}
              </Link>
            </p>
          </>
        )}

        {/* ── STEP 2: Account form ── */}
        {step === 2 && (
          <>
            <button
              type="button"
              onClick={() => { setStep(1); setError(null); }}
              className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("auth.register.change_role")}
              {selectedRole && (
                <span className={cn("ml-1 font-medium", selectedRole.color)}>
                  ({t(`role.${selectedRole.value}.title`)})
                </span>
              )}
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t("auth.register.create_title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("auth.register.create_subtitle")}
            </p>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className={cn(
                linkButtonVariants({ variant: "outline", size: "lg" }),
                "mt-6 w-full h-11 gap-3"
              )}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              {t("auth.google")}
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">{t("auth.or_email")}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("auth.register.name")}
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.register.name_ph")}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("auth.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.email_ph")}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("auth.register.password_ph")}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleEmailSignUp}
              disabled={loading || !name.trim() || !email.trim() || password.length < 6}
              className={cn(
                linkButtonVariants({ size: "lg" }),
                "mt-5 w-full h-11",
                (loading || !name.trim() || !email.trim() || password.length < 6) && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.register.submit")}
            </button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              {t("auth.register.terms_pre")}{" "}
              <Link href="/terms" className="underline hover:text-foreground transition-colors">
                {t("auth.register.terms_link")}
              </Link>{" "}
              {t("auth.register.and")}{" "}
              <Link href="/privacy" className="underline hover:text-foreground transition-colors">
                {t("auth.register.privacy_link")}
              </Link>
              .
            </p>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t("auth.register.already")}{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                {t("auth.register.login_link")}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
