"use client";

import { useState } from "react";
import { Loader2, Zap, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { linkButtonVariants } from "@/components/ui/link-button";
import { useToast } from "@/components/ui/toast";
import { getBoostPriceDisplay } from "@/lib/stripe";

type Props = {
  listingId: string;
  listingType: string;
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

export function BillingActions({ listingId, listingType, billingStatus, trialEndsAt, paidUntil, boostEndsAt }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const boostPrice = getBoostPriceDisplay(listingType);

  async function startBoost() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, mode: "boost" }),
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
      setLoading(false);
    }
  }

  const trialDays = daysLeft(trialEndsAt);
  const paidDays = daysLeft(paidUntil);
  const boostDays = daysLeft(boostEndsAt);

  // Pioneer — free subscription, but boost is still purchasable
  if (billingStatus === "pioneer") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-emerald-600 font-medium">Pionero ✓ Gratis</span>
        {boostDays === 0 ? (
          <button
            onClick={startBoost}
            disabled={loading}
            title="Aparece primero en el feed durante 7 días"
            className={cn(linkButtonVariants({ variant: "outline", size: "sm" }), "gap-1.5 text-xs h-7 border-amber-300 text-amber-700 hover:bg-amber-50")}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
            Boost — {boostPrice}
          </button>
        ) : (
          <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
            <Zap className="h-3 w-3 fill-current" />
            Boost activo {boostDays}d más
          </span>
        )}
      </div>
    );
  }

  // Pending payment — listing was just created, user needs to activate via "Activar" in menu
  if (billingStatus === "pending_payment") {
    return (
      <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
        <Clock className="h-3.5 w-3.5" />
        Activa para publicar
      </span>
    );
  }

  // Trial — card saved, not yet charged
  if (billingStatus === "trial") {
    return (
      <span className={cn(
        "flex items-center gap-1 text-xs font-medium",
        trialDays <= 5 ? "text-destructive" : trialDays <= 10 ? "text-amber-600" : "text-muted-foreground"
      )}>
        {trialDays <= 5 && <AlertTriangle className="h-3.5 w-3.5" />}
        {trialDays > 0 ? `Trial · ${trialDays}d restantes` : "Trial vencido"}
      </span>
    );
  }

  // Active subscription — show boost options
  if (billingStatus === "active") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {paidDays > 0 && paidDays <= 7 && (
          <span className="text-xs text-amber-600 font-medium">Renueva en {paidDays}d</span>
        )}
        {boostDays === 0 ? (
          <button
            onClick={startBoost}
            disabled={loading}
            title="Aparece primero en el feed durante 7 días"
            className={cn(linkButtonVariants({ variant: "outline", size: "sm" }), "gap-1.5 text-xs h-7 border-amber-300 text-amber-700 hover:bg-amber-50")}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
            Boost — {boostPrice}
          </button>
        ) : (
          <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
            <Zap className="h-3 w-3 fill-current" />
            Boost activo {boostDays}d más
          </span>
        )}
      </div>
    );
  }

  // Past due — payment failed
  if (billingStatus === "past_due") {
    return (
      <span className="flex items-center gap-1 text-xs text-destructive font-medium">
        <AlertTriangle className="h-3.5 w-3.5" />
        Pago fallido
      </span>
    );
  }

  // Cancelled / paused (Stripe subscription ended) — user reactivates via kebab menu
  if (billingStatus === "cancelled" || billingStatus === "paused") {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
        Cancelada — activa desde ⋯
      </span>
    );
  }

  return null;
}
