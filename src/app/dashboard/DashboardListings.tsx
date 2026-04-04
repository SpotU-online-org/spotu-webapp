"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { linkButtonVariants } from "@/components/ui/link-button";
import { ListingActions } from "./ListingActions";
import { ListingModal } from "./ListingModal";
import { BillingActions } from "./BillingActions";

export type DashboardListing = {
  id: string;
  type: string;
  title: string;
  status: string;
  views_count: number | null;
  contacts_count: number | null;
  created_at: string;
  is_featured: boolean | null;
  billing_status: string | null;
  trial_ends_at: string | null;
  paid_until: string | null;
  is_boosted: boolean | null;
  boost_ends_at: string | null;
};

const STATUS_CONFIG = {
  active:  { label: "Activa",   color: "bg-emerald-100 text-emerald-700" },
  paused:  { label: "Pausada",  color: "bg-amber-100 text-amber-700" },
  draft:   { label: "Borrador", color: "bg-muted text-muted-foreground" },
  expired: { label: "Expirada", color: "bg-destructive/10 text-destructive" },
} as const;

const TYPE_LABELS: Record<string, string> = {
  have_space: "Espacio publicitario",
  offer_service: "Agencia de marketing",
  want_to_advertise: "Solicitud de anunciante",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function billingCutoff(createdAt: string) {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + 30);
  return d;
}

function NoticeHandler() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const billing = searchParams.get("billing");
    const published = searchParams.get("published");

    const messages: Record<string, [string, "success" | "error" | "info"]> = {
      "1":              ["¡Publicación creada exitosamente!", "success"],
      success:          ["✓ Pago completado. Tu publicación está activa.", "success"],
      boost_success:    ["✓ Boost activado. Tu publicación aparecerá primero por 7 días.", "success"],
      cancelled:        ["Pago cancelado.", "info"],
    };

    const key = published === "1" ? "1" : billing ?? "";
    const [msg, type] = messages[key] ?? [];
    if (msg) toast(msg, type);

    const next = new URLSearchParams(searchParams.toString());
    next.delete("published");
    next.delete("billing");
    const qs = next.toString();
    router.replace(`/dashboard${qs ? `?${qs}` : ""}`, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function DashboardListings({ listings }: { listings: DashboardListing[] }) {
  const [modalId, setModalId] = useState<string | null>(null);

  return (
    <>
      <Suspense>
        <NoticeHandler />
      </Suspense>

      <ListingModal listingId={modalId} onClose={() => setModalId(null)} />

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 text-center">
          <p className="font-medium text-foreground">Aún no tienes publicaciones</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu primera publicación es gratis por 30 días.
          </p>
          <Link
            href="/publish"
            className={cn(linkButtonVariants({ size: "lg" }), "mt-5 gap-2")}
          >
            <Plus className="h-4 w-4" />
            Crear primera publicación
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[560px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b bg-muted/60 backdrop-blur-sm text-xs text-muted-foreground">
                    <th className="px-5 py-3 text-left font-medium">Publicación</th>
                    <th className="px-5 py-3 text-left font-medium">Estado</th>
                    <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Creada</th>
                    <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Vence</th>
                    <th className="px-5 py-3 text-left font-medium hidden md:table-cell">Facturación</th>
                    <th className="px-5 py-3 text-right font-medium hidden sm:table-cell">Vistas</th>
                    <th className="px-5 py-3 text-right font-medium hidden lg:table-cell">Contactos</th>
                    <th className="px-5 py-3 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {listings.map((l) => {
                    const status =
                      STATUS_CONFIG[l.status as keyof typeof STATUS_CONFIG] ??
                      STATUS_CONFIG.draft;
                    const cutoff = billingCutoff(l.created_at);
                    const isExpiringSoon = cutoff.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
                    return (
                      <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setModalId(l.id)}
                            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1 text-left"
                          >
                            {l.title}
                          </button>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {TYPE_LABELS[l.type] ?? l.type}
                            {l.is_featured && (
                              <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-700">
                                Destacada
                              </span>
                            )}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-semibold",
                              status.color
                            )}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                          {formatDate(l.created_at)}
                        </td>
                        <td className="px-4 py-4 text-xs hidden lg:table-cell whitespace-nowrap">
                          <span className={isExpiringSoon ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                            {formatDate(cutoff.toISOString())}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <BillingActions
                            listingId={l.id}
                            listingType={l.type}
                            billingStatus={l.billing_status ?? "trial"}
                            trialEndsAt={l.trial_ends_at}
                            paidUntil={l.paid_until}
                            isBoosted={l.is_boosted ?? false}
                            boostEndsAt={l.boost_ends_at}
                          />
                        </td>
                        <td className="px-5 py-4 text-right font-medium text-foreground hidden sm:table-cell">
                          {l.views_count ?? 0}
                        </td>
                        <td className="px-5 py-4 text-right font-medium text-foreground hidden lg:table-cell">
                          {l.contacts_count ?? 0}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end">
                            <ListingActions listingId={l.id} status={l.status} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
