"use client";

import { useState } from "react";
import { Loader2, Zap, CreditCard, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { linkButtonVariants } from "@/components/ui/link-button";
import { useToast } from "@/components/ui/toast";

type Props = {
  listingId: string;
  billingStatus: string;
  trialEndsAt: string | null;
  paidUntil: string | null;
  isBoosted: boolean;
  boostEndsAt: string | null;
};

function daysLeft(dateStr: string | null): number {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function BillingActions({ listingId, billingStatus, trialEndsAt, paidUntil, isBoosted, boostEndsAt }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<"sub" | "boost" | null>(null);

  async function startCheckout(mode: "subscription" | "boost") {
    setLoading(mode === "subscription" ? "sub" : "boost");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, mode }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast("No se pudo iniciar el pago. Intenta de nuevo.", "error");
      }
    } catch {
      toast("Error de conexión. Intenta de nuevo.", "error");
    } finally {
      setLoading(null);
    }
  }

  const trialDays = daysLeft(trialEndsAt);
  const paidDays = daysLeft(paidUntil);
  const boostDays = daysLeft(boostEndsAt);

  if (billingStatus === "trial") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {trialDays <= 7 && trialDays > 0 && (
          <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
            <AlertTriangle className="h-3.5 w-3.5" />
            Trial vence en {trialDays}d
          </span>
        )}
        {trialDays === 0 && (
          <span className="flex items-center gap-1 text-xs text-destructive font-medium">
            <AlertTriangle className="h-3.5 w-3.5" />
            Trial vencido
          </span>
        )}
        <button
          onClick={() => startCheckout("subscription")}
          disabled={loading !== null}
          className={cn(linkButtonVariants({ size: "sm" }), "gap-1.5 text-xs h-7")}
        >
          {loading === "sub" ? <Loader2 className="h-3 w-3 animate-spin" /> : <CreditCard className="h-3 w-3" />}
          Activar — $4.99/mes
        </button>
      </div>
    );
  }

  if (billingStatus === "active") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {paidDays <= 7 && (
          <span className="text-xs text-amber-600 font-medium">Renueva en {paidDays}d</span>
        )}
        {!isBoosted && (
          <button
            onClick={() => startCheckout("boost")}
            disabled={loading !== null}
            className={cn(linkButtonVariants({ variant: "outline", size: "sm" }), "gap-1.5 text-xs h-7 border-amber-300 text-amber-700 hover:bg-amber-50")}
          >
            {loading === "boost" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
            Boost — $2.99/sem
          </button>
        )}
        {isBoosted && boostDays > 0 && (
          <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
            <Zap className="h-3 w-3 fill-current" />
            Destacada {boostDays}d más
          </span>
        )}
      </div>
    );
  }

  if (billingStatus === "past_due") {
    return (
      <button
        onClick={() => startCheckout("subscription")}
        disabled={loading !== null}
        className={cn(linkButtonVariants({ size: "sm" }), "gap-1.5 text-xs h-7 bg-destructive hover:bg-destructive/90")}
      >
        {loading === "sub" ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertTriangle className="h-3 w-3" />}
        Pago pendiente
      </button>
    );
  }

  if (billingStatus === "cancelled") {
    return (
      <button
        onClick={() => startCheckout("subscription")}
        disabled={loading !== null}
        className={cn(linkButtonVariants({ size: "sm" }), "gap-1.5 text-xs h-7")}
      >
        {loading === "sub" ? <Loader2 className="h-3 w-3 animate-spin" /> : <CreditCard className="h-3 w-3" />}
        Reactivar — $4.99/mes
      </button>
    );
  }

  return null;
}
