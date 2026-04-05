"use client";

import { useState } from "react";
import { Loader2, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { linkButtonVariants } from "@/components/ui/link-button";
import { useToast } from "@/components/ui/toast";

export function PortalButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function open() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast("No se pudo abrir el portal de facturación.", "error");
      }
    } catch {
      toast("Error de conexión.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={open}
      disabled={loading}
      className={cn(linkButtonVariants({ variant: "outline", size: "default" }), "gap-2 shrink-0")}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ReceiptText className="h-4 w-4" />}
      Mis suscripciones
    </button>
  );
}
