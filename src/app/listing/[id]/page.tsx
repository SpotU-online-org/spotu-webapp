import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Globe, MessageCircle, Mail, ExternalLink, Eye, ArrowLeft, Briefcase, Megaphone, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { linkButtonVariants } from "@/components/ui/link-button";
import { ViewTracker } from "./ViewTracker";
import { ListingImageCarousel } from "@/components/listings/ListingImageCarousel";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("title, description, images")
    .eq("id", id)
    .single();
  if (!data) return { title: "Publicación no encontrada" };
  return {
    title: data.title,
    description: data.description?.slice(0, 160),
    openGraph: {
      title: data.title,
      description: data.description?.slice(0, 160),
      images: data.images?.[0] ? [{ url: data.images[0] }] : [],
    },
  };
}

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
  have_space: { label: "Espacio publicitario", Icon: MapPin, color: "text-[oklch(0.702_0.183_56.823)]" },
  want_to_advertise: { label: "Solicitud de anunciante", Icon: Megaphone, color: "text-primary" },
  offer_service: { label: "Agencia de marketing", Icon: Briefcase, color: "text-[oklch(0.696_0.17_162.48)]" },
} as const;

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Separate queries — profile join failure won't kill the listing display
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !listing) {
    console.error("[listing/id] query error:", error?.message);
    notFound();
  }

  // RLS already gates access; show 404 for non-active listings unless owner
  const { data: { user } } = await supabase.auth.getUser();
  if (listing.status !== "active" && listing.user_id !== user?.id) {
    notFound();
  }

  // Fetch profile separately — resilient to schema changes
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, company_name, avatar_url, is_verified, confirmed_interactions_count")
    .eq("id", listing.user_id)
    .single();

  const config = TYPE_CONFIG[listing.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.have_space;

  const location = listing.is_remote
    ? "Remoto / Digital"
    : [listing.location_city, listing.location_state, listing.location_country].filter(Boolean).join(", ");

  const price = (() => {
    if (listing.price_text) return listing.price_text;
    if (!listing.price_min && !listing.price_max) return null;
    const p = listing.price_period ? `/${PERIOD_LABELS[listing.price_period] ?? listing.price_period}` : "";
    if (listing.price_min && listing.price_max)
      return `$${Number(listing.price_min).toLocaleString()} – $${Number(listing.price_max).toLocaleString()} USD${p}`;
    if (listing.price_min) return `Desde $${Number(listing.price_min).toLocaleString()} USD${p}`;
    return `Hasta $${Number(listing.price_max).toLocaleString()} USD${p}`;
  })();

  const whatsappUrl = listing.whatsapp
    ? `https://wa.me/${listing.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, vi tu publicación "${listing.title}" en SpotU y me interesa contactarte.`)}`
    : null;

  const emailUrl = listing.email_contact
    ? `mailto:${listing.email_contact}?subject=${encodeURIComponent(`Contacto desde SpotU — ${listing.title}`)}`
    : null;

  const callNumber = listing.whatsapp || listing.phone
    ? String(listing.whatsapp || listing.phone).replace(/\s/g, "")
    : null;

  const websiteUrl = listing.website_url
    ? (listing.website_url.startsWith("http://") || listing.website_url.startsWith("https://")
        ? listing.website_url
        : `https://${listing.website_url}`)
    : null;

  const images: string[] = Array.isArray(listing.images) ? listing.images : [];

  return (
    <>
      <Header />
      <ViewTracker listingId={id} />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/feed" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver al feed
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* ── Main ── */}
            <div className="space-y-6">
              {images.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl border bg-muted aspect-[16/9] group">
                  <ListingImageCarousel images={images} title={listing.title} alwaysShowControls />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <config.Icon className={cn("h-4 w-4", config.color)} />
                  <span className={cn("text-sm font-medium", config.color)}>{config.label}</span>
                  {listing.is_featured && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Destacado</span>
                  )}
                  {listing.status !== "active" && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground capitalize">
                      {listing.status === "paused" ? "Pausada" : listing.status}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{listing.title}</h1>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Descripción</h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{listing.description}</p>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Detalles</h2>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {listing.space_type && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Tipo de espacio</dt>
                      <dd className="font-medium text-foreground">{SPACE_TYPE_LABELS[listing.space_type] ?? listing.space_type}</dd>
                    </div>
                  )}
                  {listing.space_medium && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Medio</dt>
                      <dd className="font-medium text-foreground">{listing.space_medium === "physical" ? "Físico" : "Digital"}</dd>
                    </div>
                  )}
                  {location && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Ubicación</dt>
                      <dd className="font-medium text-foreground">{location}</dd>
                    </div>
                  )}
                  {listing.audience_size && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Audiencia estimada</dt>
                      <dd className="font-medium text-foreground">{listing.audience_size}</dd>
                    </div>
                  )}
                  {listing.availability && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Disponibilidad</dt>
                      <dd className="font-medium text-foreground">{listing.availability}</dd>
                    </div>
                  )}
                  {listing.industry && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Industria</dt>
                      <dd className="font-medium text-foreground">{listing.industry}</dd>
                    </div>
                  )}
                  {listing.services && listing.services.length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-muted-foreground mb-1.5">Servicios</dt>
                      <dd className="flex flex-wrap gap-2">
                        {listing.services.map((s: string) => (
                          <span key={s} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">{s}</span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {listing.coverage_areas && listing.coverage_areas.length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-muted-foreground mb-1.5">Áreas de cobertura</dt>
                      <dd className="flex flex-wrap gap-2">
                        {listing.coverage_areas.map((a: string) => (
                          <span key={a} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">{a}</span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="space-y-5">
              {price && (
                <div className="rounded-2xl border bg-card p-5">
                  <p className="text-xs text-muted-foreground mb-1">Precio</p>
                  <p className="text-xl font-bold text-primary">{price}</p>
                </div>
              )}

              <div className="rounded-2xl border bg-card p-5 space-y-3">
                <h2 className="text-sm font-semibold text-foreground">Contactar</h2>
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className={cn(linkButtonVariants({ size: "lg" }), "w-full gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] border-transparent")}>
                    <MessageCircle className="h-4 w-4" /> Contactar por WhatsApp
                  </a>
                )}
                {callNumber && (
                  <a href={`tel:${callNumber}`}
                    className={cn(linkButtonVariants({ variant: "outline", size: "lg" }), "w-full gap-2.5")}>
                    <Phone className="h-4 w-4" /> Llamar
                  </a>
                )}
                {emailUrl && (
                  <a href={emailUrl} target="_blank" rel="noopener noreferrer"
                    className={cn(linkButtonVariants({ variant: "outline", size: "lg" }), "w-full gap-2.5")}>
                    <Mail className="h-4 w-4" /> Enviar correo
                  </a>
                )}
                {websiteUrl && (
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                    className={cn(linkButtonVariants({ variant: "outline", size: "lg" }), "w-full gap-2.5")}>
                    <ExternalLink className="h-4 w-4" /> Visitar sitio web
                  </a>
                )}
                {!whatsappUrl && !callNumber && !emailUrl && (
                  <p className="text-sm text-muted-foreground">Sin datos de contacto.</p>
                )}
              </div>

              {profile && (
                <div className="rounded-2xl border bg-card p-5">
                  <h2 className="mb-3 text-sm font-semibold text-foreground">Publicado por</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary uppercase">
                      {profile.display_name?.[0] ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{profile.display_name}</p>
                      {profile.company_name && (
                        <p className="text-xs text-muted-foreground truncate">{profile.company_name}</p>
                      )}
                    </div>
                    {profile.is_verified && (
                      <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">✓ Verificado</span>
                    )}
                  </div>
                  {!!profile.confirmed_interactions_count && profile.confirmed_interactions_count > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{profile.confirmed_interactions_count}</span> interacciones confirmadas
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
                <Eye className="h-3.5 w-3.5" />
                {listing.views_count ?? 0} vistas
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
