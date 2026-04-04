import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, MessageCircle, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { linkButtonVariants } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";
import { DashboardListings } from "./DashboardListings";
import { ListingCard } from "@/components/listings/ListingCard";

const PROFILE_TYPE_LABELS: Record<string, string> = {
  advertiser: "Anunciante",
  space_owner: "Espacio publicitario",
  agency: "Agencia de marketing",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: listings }, { data: favRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, type, confirmed_interactions_count")
      .eq("id", user.id)
      .single(),
    supabase
      .from("listings")
      .select("id, type, title, status, views_count, contacts_count, created_at, is_featured")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("favorites")
      .select("listing_id, listings(id, type, title, description, location_city, location_state, location_country, is_remote, price_min, price_max, price_period, price_text, images)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  if (!profile) redirect("/auth/login");

  const totalViews = listings?.reduce((s, l) => s + (l.views_count ?? 0), 0) ?? 0;
  const totalContacts = listings?.reduce((s, l) => s + (l.contacts_count ?? 0), 0) ?? 0;
  const activeCount = listings?.filter((l) => l.status === "active").length ?? 0;

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Hola, {profile.display_name} 👋
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Cuenta:{" "}
                <span className="font-medium text-foreground">
                  {PROFILE_TYPE_LABELS[profile.type ?? ""] ?? profile.type}
                </span>
              </p>
            </div>
            <Link
              href="/publish"
              className={cn(linkButtonVariants({ size: "default" }), "gap-2 shrink-0")}
            >
              <Plus className="h-4 w-4" />
              Nueva publicación
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Publicaciones activas", value: activeCount, Icon: null },
              { label: "Vistas totales", value: totalViews, Icon: Eye },
              { label: "Contactos totales", value: totalContacts, Icon: MessageCircle },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border bg-card p-5">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1.5 text-3xl font-bold tracking-tight text-foreground">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Listings */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Mis publicaciones</h2>
            <DashboardListings listings={listings ?? []} />
          </div>

          {/* Favorites */}
          {favRows && favRows.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <h2 className="text-lg font-semibold text-foreground">Mis favoritos</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {favRows.map((row) => {
                  const l = row.listings as unknown as {
                    id: string; type: string; title: string; description: string;
                    location_city: string | null; location_state: string | null;
                    location_country: string | null; is_remote: boolean | null;
                    price_min: number | null; price_max: number | null;
                    price_period: string | null; price_text: string | null;
                    images: string[] | null;
                  } | null;
                  if (!l) return null;
                  return (
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
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
