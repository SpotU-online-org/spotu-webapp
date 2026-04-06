import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/listings/ListingCard";
import { MapPin, Building2, BadgeCheck, MessageCircle, Mail, Globe } from "lucide-react";
import { linkButtonVariants } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

const ROLE_LABELS: Record<string, string> = {
  advertiser: "Anunciante",
  space_owner: "Espacio publicitario",
  agency: "Agencia de marketing",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("display_name, company_name")
    .eq("id", id)
    .single();
  const name = data?.display_name ?? "Perfil de usuario";
  return { title: `${name} — SpotU` };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: profile }, { data: listings }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "display_name, company_name, bio, website, whatsapp, email_contact, city, country, type, types, is_verified, confirmed_interactions_count, avatar_url"
      )
      .eq("id", id)
      .single(),
    supabase
      .from("listings")
      .select(
        "id, type, title, description, location_city, location_state, location_country, is_remote, price_min, price_max, price_period, price_text, images, views_count"
      )
      .eq("user_id", id)
      .eq("status", "active")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (!profile) notFound();

  const types = (profile.types as string[] | null) ?? ([profile.type].filter(Boolean) as string[]);
  const whatsappUrl = profile.whatsapp
    ? `https://wa.me/${String(profile.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, vi tu perfil en SpotU y me gustaría contactarte.`)}`
    : null;
  const emailUrl = profile.email_contact
    ? `mailto:${profile.email_contact}?subject=${encodeURIComponent("Contacto desde SpotU")}`
    : null;

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Profile header */}
        <div className="border-b bg-card/60">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              {/* Avatar */}
              <div className="shrink-0 h-20 w-20 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary uppercase shadow-sm">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt={profile.display_name ?? ""} className="h-full w-full object-cover" />
                ) : (
                  profile.display_name?.[0] ?? "?"
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground truncate">
                    {profile.display_name}
                  </h1>
                  {profile.is_verified && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verificado
                    </span>
                  )}
                </div>

                {profile.company_name && (
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 shrink-0" />
                    {profile.company_name}
                  </div>
                )}

                {(profile.city || profile.country) && (
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {[profile.city, profile.country].filter(Boolean).join(", ")}
                  </div>
                )}

                {/* Role badges */}
                {types.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {types.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {ROLE_LABELS[t] ?? t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bio */}
                {profile.bio && (
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-prose">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Contact sidebar */}
              <div className="flex flex-col gap-2 sm:min-w-[180px]">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      linkButtonVariants({ size: "default" }),
                      "gap-2 bg-[#25D366] hover:bg-[#20bd5a] border-transparent"
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
                {emailUrl && (
                  <a
                    href={emailUrl}
                    className={cn(linkButtonVariants({ variant: "outline", size: "default" }), "gap-2")}
                  >
                    <Mail className="h-4 w-4" />
                    Correo
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="h-4 w-4 shrink-0" />
                    <span className="truncate">{profile.website}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Publicaciones activas
            {listings && listings.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({listings.length})
              </span>
            )}
          </h2>

          {!listings || listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 text-center">
              <p className="text-sm text-muted-foreground">
                Este usuario no tiene publicaciones activas.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <ListingCard
                  key={l.id}
                  id={l.id}
                  type={l.type as "want_to_advertise" | "have_space" | "offer_service"}
                  title={l.title}
                  description={l.description}
                  locationCity={l.location_city}
                  locationState={l.location_state}
                  locationCountry={l.location_country ?? ""}
                  isRemote={l.is_remote ?? false}
                  priceMin={l.price_min}
                  priceMax={l.price_max}
                  pricePeriod={l.price_period}
                  priceText={l.price_text}
                  images={l.images ?? []}
                  viewsCount={l.views_count ?? 0}
                  authorName={profile.display_name ?? "SpotU user"}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
