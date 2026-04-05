"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Filter } from "lucide-react";
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

const BILLING_LABELS: Record<string, string> = {
  pioneer: "Pionero",
  trial: "Trial",
  active: "Activa",
  past_due: "Pago pendiente",
  paused: "Pausada",
  cancelled: "Cancelada",
  pending_payment: "Pendiente",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getExpiryLabel(l: DashboardListing): { text: string; urgent: boolean } {
  const bs = l.billing_status ?? "trial";
  if (bs === "pioneer") return { text: "1 año gratis", urgent: false };
  if (bs === "active" && l.paid_until) {
    const d = new Date(l.paid_until);
    const daysLeft = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return { text: formatDate(l.paid_until), urgent: daysLeft <= 7 };
  }
  if (bs === "trial" || bs === "pending_payment") {
    const trialEnd = new Date(new Date(l.created_at).getTime() + 30 * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) return { text: "Trial vencido", urgent: true };
    return { text: formatDate(trialEnd.toISOString()), urgent: daysLeft <= 7 };
  }
  if (bs === "paused" || bs === "cancelled") return { text: "—", urgent: false };
  return { text: "—", urgent: false };
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

const selectCls =
  "rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors";

export function DashboardListings({ listings }: { listings: DashboardListing[] }) {
  const [modalId, setModalId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filtered = listings.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (typeFilter !== "all" && l.type !== typeFilter) return false;
    if (search.trim() && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
        <>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span>Filtrar:</span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título..."
              className={selectCls + " w-44 py-1.5 text-xs"}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={selectCls + " py-1.5 text-xs"}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="paused">Pausadas</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={selectCls + " py-1.5 text-xs"}
            >
              <option value="all">Todos los tipos</option>
              <option value="have_space">Espacio publicitario</option>
              <option value="offer_service">Agencia</option>
              <option value="want_to_advertise">Solicitud de anunciante</option>
            </select>
            {(statusFilter !== "all" || typeFilter !== "all" || search) && (
              <button
                onClick={() => { setStatusFilter("all"); setTypeFilter("all"); setSearch(""); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Limpiar
              </button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} de {listings.length}
            </span>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <div className="max-h-[560px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b bg-muted/60 backdrop-blur-sm text-xs text-muted-foreground">
                      <th className="px-5 py-3 text-left font-medium">Publicación</th>
                      <th className="px-5 py-3 text-left font-medium">Estado</th>
                      <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Creada</th>
                      <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Vence / Renueva</th>
                      <th className="px-5 py-3 text-left font-medium hidden md:table-cell">Facturación</th>
                      <th className="px-5 py-3 text-right font-medium hidden sm:table-cell">Vistas</th>
                      <th className="px-5 py-3 text-right font-medium hidden lg:table-cell">Contactos</th>
                      <th className="px-5 py-3 text-right font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted-foreground">
                          No hay publicaciones que coincidan con los filtros.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((l) => {
                        const status =
                          STATUS_CONFIG[l.status as keyof typeof STATUS_CONFIG] ??
                          STATUS_CONFIG.draft;
                        const expiry = getExpiryLabel(l);
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
                                {l.is_boosted && (
                                  <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-700">
                                    ⚡ Boost
                                  </span>
                                )}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", status.color)}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                              {formatDate(l.created_at)}
                            </td>
                            <td className="px-4 py-4 text-xs hidden lg:table-cell whitespace-nowrap">
                              <span className={expiry.urgent ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                                {expiry.text}
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
                                <ListingActions
                                  listingId={l.id}
                                  status={l.status}
                                  billingStatus={l.billing_status ?? "trial"}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
