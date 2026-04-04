"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { linkButtonVariants } from "@/components/ui/link-button";
import { useI18n } from "@/components/layout/LanguageToggle";

const ERROR_MAP: Record<string, string> = {
  auth_failed: "El enlace de confirmación expiró o es inválido. Intenta iniciar sesión.",
  missing_code: "Hubo un problema con la autenticación. Intenta de nuevo.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError ? (ERROR_MAP[urlError] ?? "Ocurrió un error. Intenta de nuevo.") : null
  );

  async function handleEmailLogin() {
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(translateError(signInError.message));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

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
    if (msg.includes("Invalid login credentials")) return "Correo o contraseña incorrectos.";
    if (msg.includes("Email not confirmed")) return "Confirma tu correo antes de iniciar sesión.";
    if (msg.includes("Too many requests")) return "Demasiados intentos. Espera unos minutos.";
    return "Ocurrió un error. Intenta de nuevo.";
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("auth.login.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth.login.subtitle")}
        </p>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleLogin}
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
              onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
              placeholder={t("auth.email_ph")}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                {t("auth.password")}
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("auth.forgot_password")}
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                placeholder={t("auth.login.password_ph")}
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
          onClick={handleEmailLogin}
          disabled={loading || !email.trim() || !password}
          className={cn(
            linkButtonVariants({ size: "lg" }),
            "mt-5 w-full h-11",
            (loading || !email.trim() || !password) && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.login.submit")}
        </button>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {t("auth.login.no_account")}{" "}
          <Link href="/auth/register" className="font-medium text-primary hover:underline">
            {t("auth.login.register_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md rounded-2xl border bg-card p-8" />}>
      <LoginForm />
    </Suspense>
  );
}
