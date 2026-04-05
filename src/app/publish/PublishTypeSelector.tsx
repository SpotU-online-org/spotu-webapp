"use client";

import { useState } from "react";
import { MapPin, Briefcase, Megaphone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { linkButtonVariants } from "@/components/ui/link-button";
import { PublishForm } from "./PublishForm";

type Role = "advertiser" | "space_owner" | "agency";

const ROLE_CONFIG: Record<Role, {
  label: string;
  description: string;
  price: string;
  Icon: React.ElementType;
  color: string;
  border: string;
  bg: string;
}> = {
  space_owner: {
    label: "Espacio publicitario",
    description: "Publica tu pantalla LED, valla, sitio web, podcast u otro medio.",
    price: "$4.99 USD/mes",
    Icon: MapPin,
    color: "text-[oklch(0.702_0.183_56.823)]",
    border: "border-[oklch(0.702_0.183_56.823)]",
    bg: "bg-[oklch(0.702_0.183_56.823)]/5",
  },
  agency: {
    label: "Agencia de marketing",
    description: "Muestra tus servicios de pauta, diseño, digital y más.",
    price: "$9.99 USD/mes",
    Icon: Briefcase,
    color: "text-[oklch(0.696_0.17_162.48)]",
    border: "border-[oklch(0.696_0.17_162.48)]",
    bg: "bg-[oklch(0.696_0.17_162.48)]/5",
  },
  advertiser: {
    label: "Solicitud de anunciante",
    description: "Publica qué tipo de espacios o servicios estás buscando.",
    price: "$4.99 USD/mes",
    Icon: Megaphone,
    color: "text-primary",
    border: "border-primary",
    bg: "bg-primary/5",
  },
};

type Props = {
  userId: string;
  userTypes: Role[];
  defaultWhatsapp?: string | null;
  defaultEmail?: string | null;
};

export function PublishTypeSelector({ userId, userTypes, defaultWhatsapp, defaultEmail }: Props) {
  const [selected, setSelected] = useState<Role | null>(null);

  if (selected) {
    return (
      <PublishForm
        userId={userId}
        profileType={selected}
        defaultWhatsapp={defaultWhatsapp}
        defaultEmail={defaultEmail}
      />
    );
  }

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-bold text-foreground">¿Qué tipo de publicación quieres crear?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          El tipo de publicación determina los campos y el precio mensual.
        </p>

        <div className="mt-6 space-y-3">
          {userTypes.map((role) => {
            const cfg = ROLE_CONFIG[role];
            if (!cfg) return null;
            const { label, description, price, Icon, color, border, bg } = cfg;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelected(role)}
                className={cn(
                  "w-full rounded-xl border-2 p-4 text-left transition-all hover:shadow-sm group",
                  "border-border hover:border-opacity-60",
                  `hover:${border} hover:${bg}`
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("mt-0.5 rounded-lg p-2", bg)}>
                    <Icon className={cn("h-4 w-4", color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{label}</p>
                      <span className={cn("text-xs font-medium shrink-0", color)}>{price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 group-hover:text-foreground transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Tu primera publicación en SpotU es gratis por 30 días (requiere método de pago para el auto-cobro).
          Las publicaciones de agencia cuestan $9.99/mes; las demás, $4.99/mes.
        </p>
      </div>
    </div>
  );
}
