import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/listings/ListingCard";
import { linkButtonVariants } from "@/components/ui/link-button";
import { FeedFilters } from "./FeedFilters";
import Link from "next/link";
import { ALL_COUNTRIES } from "@/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explorar publicaciones",
  description:
    "Descubre espacios publicitarios, agencias de marketing y solicitudes de anunciantes en SpotU.",
};

type PageProps = {
  searchParams: Promise<{
    type?: string;
    country?: string;
    city?: string;
    space_type?: string;
    q?: string;
  }>;
};

const VALID_TYPES = ["have_space", "want_to_advertise", "offer_service"] as const;
const FILTER_TABS = [
  { value: "all", label: "Todos" },
  { value: "have_space", label: "Espacios" },
  { value: "want_to_advertise", label: "Solicitudes" },
  { value: "offer_service", label: "Agencias" },
] as const;

export default async function FeedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const typeFilter = VALID_TYPES.includes(params.type as (typeof VALID_TYPES)[number])
    ? (params.type as (typeof VALID_TYPES)[number])
    : "all";
  const countryFilter = params.country ?? "";
  const cityFilter = params.city?.trim() ?? "";
  const spaceTypeFilter = params.space_type ?? "";
  const searchQuery = params.q?.trim() ?? "";

  const supabase = await createClient();

  // Fetch distinct countries from active listings for the filter dropdown
  const { data: countryRows } = await supabase
    .from("listings")
    .select("location_country, location_countries")
    .eq("status", "active");

  const activeCountryCodes = [...new Set(
    (countryRows ?? []).flatMap((r) => {
      const codes: string[] = [];
      if (Array.isArray(r.location_countries) && r.location_countries.length > 0) {
        codes.push(...r.location_countries);
      } else if (r.location_country) {
        codes.push(r.location_country);
      }
      return codes;
    }).filter(Boolean)
  )] as string[];
  const availableCountries = ALL_COUNTRIES.filter((c) => activeCountryCodes.includes(c.value));

  let query = supabase
    .from("listings")
    .select(`
      id, type, title, description,
      location_city, location_state, location_country,
      is_remote, price_min, price_max, price_period, price_text,
      images, views_count, space_type, industry, tags,
      is_boosted, boost_ends_at, user_id,
      profiles!inner(display_name, avatar_url)
    `)
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(48);

  if (typeFilter !== "all") query = query.eq("type", typeFilter);
  if (countryFilter) {
    query = query.or(`location_countries.cs.{${countryFilter}},location_country.eq.${countryFilter}`);
  }
  if (cityFilter) query = query.ilike("location_city", `%${cityFilter}%`);
  if (spaceTypeFilter) query = query.eq("space_type", spaceTypeFilter);
  if (searchQuery) {
    // Search title, description (full-text) and tags array
    query = query.or(
      `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery.toLowerCase()}}`
    );
  }

  const { data: rawListings, error } = await query;

  // Log error server-side but show empty state to users (avoids confusing error messages)
  if (error) console.error("[feed] Supabase error:", error.message);

  // Sort: active boosts (is_boosted AND boost_ends_at in the future) first
  const now = Date.now();
  const listings = rawListings
    ? [...rawListings].sort((a, b) => {
        const aActive = !!(a.is_boosted && a.boost_ends_at && new Date(a.boost_ends_at).getTime() > now);
        const bActive = !!(b.is_boosted && b.boost_ends_at && new Date(b.boost_ends_at).getTime() > now);
        if (aActive === bActive) return 0;
        return aActive ? -1 : 1;
      })
    : null;

  const hasFilters = typeFilter !== "all" || countryFilter || cityFilter || spaceTypeFilter || searchQuery;

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

            {/* Type tabs */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {FILTER_TABS.map((tab) => {
                const href =
                  tab.value === "all"
                    ? buildHref({ ...params, type: undefined })
                    : buildHref({ ...params, type: tab.value });
                const active = tab.value === typeFilter || (tab.value === "all" && typeFilter === "all");
                return (
                  <Link
                    key={tab.value}
                    href={href}
                    className={
                      active
                        ? linkButtonVariants({ size: "sm" }) + " shrink-0"
                        : linkButtonVariants({ variant: "outline", size: "sm" }) + " shrink-0"
                    }
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            {/* Secondary filters */}
            <FeedFilters
              currentCountry={countryFilter}
              currentCity={cityFilter}
              currentSpaceType={spaceTypeFilter}
              currentType={typeFilter}
              availableCountries={availableCountries}
              currentSearch={searchQuery}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {(!listings || listings.length === 0) && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {hasFilters ? "Sin resultados para estos filtros" : "Aún no hay publicaciones"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {hasFilters
                  ? "Prueba ajustando los filtros o explora todas las publicaciones."
                  : "Sé el primero en publicar en SpotU."}
              </p>
              <div className="mt-6 flex gap-3">
                {hasFilters && (
                  <Link
                    href="/feed"
                    className={linkButtonVariants({ variant: "outline", size: "lg" })}
                  >
                    Ver todos
                  </Link>
                )}
                <Link
                  href="/auth/register"
                  className={linkButtonVariants({ size: "lg" })}
                >
                  Publicar ahora
                </Link>
              </div>
            </div>
          )}

          {listings && listings.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => {
                const isBoosted = !!(listing.is_boosted && listing.boost_ends_at && new Date(listing.boost_ends_at).getTime() > now);
                return (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    type={listing.type as "want_to_advertise" | "have_space" | "offer_service"}
                    title={listing.title}
                    description={listing.description}
                    locationCity={listing.location_city}
                    locationState={listing.location_state}
                    locationCountry={listing.location_country ?? ""}
                    isRemote={listing.is_remote ?? false}
                    priceMin={listing.price_min}
                    priceMax={listing.price_max}
                    pricePeriod={listing.price_period}
                    priceText={listing.price_text}
                    images={listing.images ?? []}
                    viewsCount={listing.views_count ?? 0}
                    isBoosted={isBoosted}
                    authorName={(listing.profiles as unknown as { display_name: string | null } | null)?.display_name ?? undefined}
                    authorAvatar={(listing.profiles as unknown as { avatar_url: string | null } | null)?.avatar_url ?? null}
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

function buildHref(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) query.set(k, v);
  }
  const qs = query.toString();
  return qs ? `/feed?${qs}` : "/feed";
}
