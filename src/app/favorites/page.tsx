import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/listings/ListingCard";
import { linkButtonVariants } from "@/components/ui/link-button";
import Link from "next/link";
import { Star } from "lucide-react";

export const metadata = { title: "Mis favoritos — SpotU" };

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/favorites");

  const { data: favRows } = await supabase
    .from("favorites")
    .select("listing_id, listings(id, type, title, description, location_city, location_state, location_country, is_remote, price_min, price_max, price_period, price_text, images)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  type FavListing = { id: string; type: string; title: string; description: string; location_city: string | null; location_state: string | null; location_country: string | null; is_remote: boolean | null; price_min: number | null; price_max: number | null; price_period: string | null; price_text: string | null; images: string[] | null };
  const listings = (favRows ?? [])
    .map((row) => row.listings as unknown as FavListing | null)
    .filter((l): l is FavListing => l !== null);

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Mis favoritos</h1>
            {listings.length > 0 && (
              <span className="text-sm text-muted-foreground">({listings.length})</span>
            )}
          </div>

          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-20 text-center">
              <Star className="h-10 w-10 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-foreground">Aún no tienes publicaciones guardadas</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Guarda publicaciones que te interesen con el botón ♡ en cada una.
              </p>
              <Link href="/feed" className={linkButtonVariants({ size: "lg" }) + " mt-6"}>
                Explorar publicaciones
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((l) => (
                <ListingCard
                  key={l.id}
                  id={l.id}
                  type={l.type as "want_to_advertise" | "have_space" | "offer_service"}
                  title={l.title}
                  description={l.description}
                  locationCity={l.location_city}
                  locationState={l.location_state}
                  locationCountry={l.location_country}
                  isRemote={l.is_remote}
                  priceMin={l.price_min}
                  priceMax={l.price_max}
                  pricePeriod={l.price_period}
                  priceText={l.price_text}
                  images={Array.isArray(l.images) ? l.images : []}
                  viewsCount={0}
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
