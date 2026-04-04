"use client";

import { useEffect, useState } from "react";
import {
  X, MapPin, Briefcase, Megaphone, MessageCircle, Mail, ExternalLink,
  Loader2, Eye, Phone,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { linkButtonVariants } from "@/components/ui/link-button";

const SPACE_TYPE_LABELS: Record<string, string> = {
  billboard: "Valla publicitaria",
  led_screen: "Pantalla LED",
  sports_venue: "Recinto deportivo",
  social_media: "Red social",
  website: "Sitio web",
  app: "App móvil",
  print: "Impreso",
  radio: "Radio",
  podcast: "Podcast",
  other: "Otro",
};

const PERIOD_LABELS: Record<string, string> = {
  day: "día", week: "semana", month: "mes", campaign: "campaña",
};

const TYPE_CONFIG = {
  have_space: { label: "Espacio publicitario", Icon: MapPin, color: "text-[oklch(0.702_0.183_56.823)]", bg: "bg-[oklch(0.702_0.183_56.823)]/10" },
  want_to_advertise: { label: "Solicitud de anunciante", Icon: Megaphone, color: "text-primary", bg: "bg-primary/10" },
  offer_service: { label: "Agencia de marketing", Icon: Briefcase, color: "text-[oklch(0.696_0.17_162.48)]", bg: "bg-[oklch(0.696_0.17_162.48)]/10" },
} as const;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Activa", color: "bg-emerald-100 text-emerald-700" },
  paused: { label: "Pausada", color: "bg-amber-100 text-amber-700" },
  draft: { label: "Borrador", color: "bg-muted text-muted-foreground" },
  expired: { label: "Expirada", color: "bg-destructive/10 text-destructive" },
};

type Listing = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string;
  space_type: string | null;
  space_medium: string | null;
  services: string[] | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  is_remote: boolean | null;
  audience_size: string | null;
  availability: string | null;
  industry: string | null;
  price_min: number | null;
  price_max: number | null;
  price_period: string | null;
  price_text: string | null;
  whatsapp: string | null;
  phone: string | null;
  email_contact: string | null;
  website_url: string | null;
  images: string[] | null;
  status: string;
  is_featured: boolean | null;
  views_count: number | null;
};
type Profile = { display_name: string | null; company_name: string | null; is_verified: boolean | null };

export function ListingModal({
  listingId,
  onClose,
}: {
  listingId: string | null;
  onClose: () => void;
}) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!listingId) {
      setListing(null);
      setProfile(null);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .single()
      .then(async ({ data: l }) => {
        setListing(l);
        if (l?.user_id) {
          const { data: p } = await supabase
            .from("profiles")
            .select("display_name, company_name, is_verified")
            .eq("id", l.user_id as string)
            .single();
          setProfile(p);
        }
        setLoading(false);
      });
  }, [listingId]);

  useEffect(() => {
    if (!listingId) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [listingId, onClose]);

  useEffect(() => {
    document.body.style.overflow = listingId ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [listingId]);

  if (!listingId) return null;

  const config = listing
    ? (TYPE_CONFIG[listing.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.have_space)
    : null;

  const statusCfg = listing
    ? (STATUS_CONFIG[listing.status as string] ?? STATUS_CONFIG.draft)
    : null;

  const price = (() => {
    if (!listing) return null;
    if (listing.price_text) return listing.price_text as string;
    if (!listing.price_min && !listing.price_max) return null;
    const p = listing.price_period ? `/${PERIOD_LABELS[listing.price_period as string] ?? listing.price_period}` : "";
    if (listing.price_min && listing.price_max)
      return `$${Number(listing.price_min).toLocaleString()} – $${Number(listing.price_max).toLocaleString()} USD${p}`;
    if (listing.price_min) return `Desde $${Number(listing.price_min).toLocaleString()} USD${p}`;
    return `Hasta $${Number(listing.price_max).toLocaleString()} USD${p}`;
  })();

  const whatsappUrl = listing?.whatsapp
    ? `https://wa.me/${String(listing.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, vi tu publicación "${listing.title}" en SpotU y me interesa contactarte.`)}`
    : null;

  const callNumber = listing?.whatsapp || listing?.phone
    ? String(listing.whatsapp || listing.phone).replace(/\s/g, "")
    : null;

  const emailUrl = listing?.email_contact
    ? `mailto:${listing.email_contact}?subject=${encodeURIComponent(`Contacto desde SpotU — ${listing.title}`)}`
    : null;

  const websiteUrl = listing?.website_url
    ? (String(listing.website_url).startsWith("http://") || String(listing.website_url).startsWith("https://")
        ? String(listing.website_url)
        : `https://${listing.website_url}`)
    : null;

  const location = listing?.is_remote
    ? "Remoto / Digital"
    : [listing?.location_city, listing?.location_state, listing?.location_country]
        .filter(Boolean)
        .join(", ") || null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/75 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={cn(
          "relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto",
          "rounded-2xl border bg-card shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-background/80 text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !listing ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No se pudo cargar la publicación.
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Image */}
            {Array.isArray(listing.images) && (listing.images as string[]).length > 0 && (
              <div className="overflow-hidden rounded-xl border bg-muted aspect-[16/9] -mx-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(listing.images as string[])[0]}
                  alt={listing.title as string}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {config && (
                  <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.bg, config.color)}>
                    <config.Icon className="h-3.5 w-3.5" />
                    {config.label}
                  </div>
                )}
                {listing.status !== "active" && statusCfg && (
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusCfg.color)}>
                    {statusCfg.label}
                  </span>
                )}
                {!!listing.is_featured && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Destacado
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-foreground leading-snug">
                {listing.title as string}
              </h2>
              {listing.views_count != null && (
                <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  {listing.views_count as number} vistas
                </div>
              )}
            </div>

            {/* Price */}
            {price && (
              <div className="rounded-xl border bg-muted/30 px-4 py-3">
                <p className="text-xs text-muted-foreground mb-0.5">Precio</p>
                <p className="text-lg font-bold text-primary">{price}</p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Descripción
              </h3>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {listing.description as string}
              </p>
            </div>

            {/* Details */}
            {(listing.space_type || listing.space_medium || location ||
              listing.audience_size || listing.availability || listing.industry ||
              (Array.isArray(listing.services) && (listing.services as string[]).length > 0)) && (
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Detalles
                </h3>
                <dl className="grid gap-2.5 sm:grid-cols-2">
                  {listing.space_type && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Tipo</dt>
                      <dd className="text-sm font-medium text-foreground">
                        {SPACE_TYPE_LABELS[listing.space_type as string] ?? listing.space_type as string}
                      </dd>
                    </div>
                  )}
                  {listing.space_medium && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Medio</dt>
                      <dd className="text-sm font-medium text-foreground">
                        {listing.space_medium === "physical" ? "Físico" : "Digital"}
                      </dd>
                    </div>
                  )}
                  {location && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Ubicación</dt>
                      <dd className="text-sm font-medium text-foreground">{location}</dd>
                    </div>
                  )}
                  {listing.audience_size && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Audiencia</dt>
                      <dd className="text-sm font-medium text-foreground">{listing.audience_size as string}</dd>
                    </div>
                  )}
                  {listing.availability && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Disponibilidad</dt>
                      <dd className="text-sm font-medium text-foreground">{listing.availability as string}</dd>
                    </div>
                  )}
                  {listing.industry && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Industria</dt>
                      <dd className="text-sm font-medium text-foreground">{listing.industry as string}</dd>
                    </div>
                  )}
                  {Array.isArray(listing.services) && (listing.services as string[]).length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-muted-foreground mb-1.5">Servicios</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {(listing.services as string[]).map((s) => (
                          <span key={s} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                            {s}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Contact */}
            <div className="border-t pt-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Contactar</h3>
              <div className="flex flex-col gap-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      linkButtonVariants({ size: "default" }),
                      "w-full gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] border-transparent"
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contactar por WhatsApp
                  </a>
                )}
                {callNumber && (
                  <a
                    href={`tel:${callNumber}`}
                    className={cn(linkButtonVariants({ variant: "outline", size: "default" }), "w-full gap-2.5")}
                  >
                    <Phone className="h-4 w-4" />
                    Llamar
                  </a>
                )}
                {emailUrl && (
                  <a
                    href={emailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(linkButtonVariants({ variant: "outline", size: "default" }), "w-full gap-2.5")}
                  >
                    <Mail className="h-4 w-4" />
                    Enviar correo
                  </a>
                )}
                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {listing.website_url as string}
                  </a>
                )}
                {!whatsappUrl && !callNumber && !emailUrl && (
                  <p className="text-sm text-muted-foreground">Sin datos de contacto.</p>
                )}
              </div>
            </div>

            {/* Publisher */}
            {profile && (
              <a
                href={`/profile/${listing.user_id}`}
                className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary uppercase">
                  {profile.display_name?.[0] ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {profile.display_name}
                  </p>
                  {profile.company_name && (
                    <p className="text-xs text-muted-foreground truncate">{profile.company_name}</p>
                  )}
                </div>
                {profile.is_verified && (
                  <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    ✓ Verificado
                  </span>
                )}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
