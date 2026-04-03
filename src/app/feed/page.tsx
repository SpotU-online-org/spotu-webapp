import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/listings/ListingCard";
import { linkButtonVariants } from "@/components/ui/link-button";
import Link from "next/link";

type FilterType = "all" | "have_space" | "want_to_advertise" | "offer_service";

type PageProps = {
  searchParams: Promise<{ type?: string }>;
};

const FILTER_TABS = [
  { value: "all", label: "Todos" },
  { value: "have_space", label: "Espacios" },
  { value: "want_to_advertise", label: "Solicitudes" },
  { value: "offer_service", label: "Agencias" },
] as const;

export default async function FeedPage({ searchParams }: PageProps) {
  const { type } = await searchParams;
  const filter: FilterType =
    type && ["have_space", "want_to_advertise", "offer_service"].includes(type)
      ? (type as FilterType)
      : "all";

  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select(`
      id, type, title, description,
      location_city, location_state, location_country,
      is_remote, price_min, price_max, price_period, price_text,
      images, views_count, status,
      profile:profiles(display_name)
    `)
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(48);

  if (filter !== "all") {
    query = query.eq("type", filter);
  }

  const { data: listings, error } = await query;

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Page header */}
        <div className="border-b bg-card/60">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Explorar publicaciones
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Descubre espacios publicitarios, agencias y solicitudes de anunciantes.
            </p>

            {/* Filter tabs */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {FILTER_TABS.map((tab) => (
                <Link
                  key={tab.value}
                  href={tab.value === "all" ? "/feed" : `/feed?type=${tab.value}`}
                  className={
                    filter === tab.value
                      ? linkButtonVariants({ size: "sm" }) + " shrink-0"
                      : linkButtonVariants({ variant: "outline", size: "sm" }) + " shrink-0"
                  }
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              Hubo un error al cargar las publicaciones. Intenta recargar la página.
            </div>
          )}

          {!error && listings && listings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-semibold text-foreground">
                No hay publicaciones aún
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Sé el primero en publicar en esta categoría.
              </p>
              <Link
                href="/auth/register"
                className={linkButtonVariants({ size: "lg" }) + " mt-6"}
              >
                Publicar ahora
              </Link>
            </div>
          )}

          {!error && listings && listings.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => {
                const profile = Array.isArray(listing.profile)
                  ? listing.profile[0]
                  : listing.profile;
                return (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    type={listing.type as "want_to_advertise" | "have_space" | "offer_service"}
                    title={listing.title}
                    description={listing.description}
                    locationCity={listing.location_city}
                    locationState={listing.location_state}
                    locationCountry={listing.location_country}
                    isRemote={listing.is_remote}
                    priceMin={listing.price_min}
                    priceMax={listing.price_max}
                    pricePeriod={listing.price_period}
                    priceText={listing.price_text}
                    images={listing.images ?? []}
                    viewsCount={listing.views_count ?? 0}
                    authorName={profile?.display_name ?? "SpotU user"}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
