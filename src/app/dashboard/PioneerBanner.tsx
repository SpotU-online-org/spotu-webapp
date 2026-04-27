"use client";

import { useEffect, useState } from "react";
import { Star, CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { linkButtonVariants } from "@/components/ui/link-button";

type Props = {
  pioneerExpiresAt: string; // ISO — profiles.created_at + 1 year
};

function timeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours, total: diff };
}

export function PioneerBanner({ pioneerExpiresAt }: Props) {
  const [remaining, setRemaining] = useState(() => timeLeft(pioneerExpiresAt));
  const [loadingPortal, setLoadingPortal] = useState(false);

  // Recompute every minute
  useEffect(() => {
    const id = setInterval(() => setRemaining(timeLeft(pioneerExpiresAt)), 60_000);
    return () => clearInterval(id);
  }, [pioneerExpiresAt]);

  async function openPortal() {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoadingPortal(false);
    }
  }

  // Pioneer year expired
  if (!remaining) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Star className="h-5 w-5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Tu año como usuario pionero ha concluido</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Gracias por ser parte de los primeros 250 en SpotU. Agrega un método de pago para mantener tus publicaciones activas.
            </p>
          </div>
        </div>
        <button
          onClick={openPortal}
          disabled={loadingPortal}
          className={cn(linkButtonVariants({ size: "sm" }), "gap-2 shrink-0")}
        >
          {loadingPortal ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
          Agregar método de pago
        </button>
      </div>
    );
  }

  const urgency = remaining.days <= 30;

  return (
    <div className={cn(
      "rounded-2xl border px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
      urgency
        ? "border-amber-200 bg-amber-50"
        : "border-primary/20 bg-primary/5"
    )}>
      <div className="flex items-start gap-3">
        <Star className={cn("h-5 w-5 shrink-0 mt-0.5 fill-current", urgency ? "text-amber-500" : "text-primary")} />
        <div>
          <p className={cn("text-sm font-semibold", urgency ? "text-amber-900" : "text-primary")}>
            Usuario Pionero SpotU ·{" "}
            <span className="font-bold">
              {remaining.days > 0
                ? `${remaining.days} días ${remaining.hours}h restantes`
                : `${remaining.hours}h restantes`}
            </span>
          </p>
          <p className={cn("text-xs mt-0.5", urgency ? "text-amber-700" : "text-primary/70")}>
            {urgency
              ? "Tu período gratuito está por vencer. Pronto se solicitará un método de pago."
              : "Como uno de los primeros 250 usuarios, todas tus publicaciones activas son gratuitas durante 1 año."}
          </p>
        </div>
      </div>

      {/* Countdown visual */}
      <div className={cn(
        "flex items-center gap-2 text-xs font-mono font-bold shrink-0 px-3 py-1.5 rounded-lg",
        urgency ? "bg-amber-100 text-amber-800" : "bg-primary/10 text-primary"
      )}>
        {remaining.days}d {String(remaining.hours).padStart(2, "0")}h
      </div>
    </div>
  );
}
