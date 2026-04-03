import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, MessageCircle, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { linkButtonVariants } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  active:  { label: "Activa",   color: "bg-emerald-100 text-emerald-700" },
  paused:  { label: "Pausada",  color: "bg-amber-100 text-amber-700" },
  draft:   { label: "Borrador", color: "bg-muted text-muted-foreground" },
  expired: { label: "Expirada", color: "bg-destructive/10 text-destructive" },
} as const;

const TYPE_LABELS = {
  have_space: "Espacio publicitario",
  offer_service: "Agencia de marketing",
  want_to_advertise: "Solicitud de anunciante",
} as const;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: listings }] = await Promise.all([
    supabase.from("profiles").select("display_name, type, confirmed_interactions_count").eq("id", user.id).single(),
    supabase.from("listings")
      .select("id, type, title, status, views_count, contacts_count, created_at, is_featured")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
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
              <p className="mt-1 text-sm text-muted-foreground capitalize">
                Cuenta: <span className="font-medium text-foreground">{profile.type?.replace("_", " ")}</span>
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
              { label: "Publicaciones activas", value: activeCount, icon: null },
              { label: "Vistas totales", value: totalViews, icon: Eye },
              { label: "Contactos totales", value: totalContacts, icon: MessageCircle },
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

            {(!listings || listings.length === 0) ? (
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
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                        <th className="px-5 py-3 text-left font-medium">Publicación</th>
                        <th className="px-5 py-3 text-left font-medium">Estado</th>
                        <th className="px-5 py-3 text-right font-medium">Vistas</th>
                        <th className="px-5 py-3 text-right font-medium">Contactos</th>
                        <th className="px-5 py-3 text-right font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {listings.map((l) => {
                        const status = STATUS_CONFIG[l.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.draft;
                        return (
                          <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-5 py-4">
                              <Link href={`/listing/${l.id}`} className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                                {l.title}
                              </Link>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {TYPE_LABELS[l.type as keyof typeof TYPE_LABELS] ?? l.type}
                                {l.is_featured && (
                                  <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-700">
                                    Destacada
                                  </span>
                                )}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", status.color)}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right font-medium text-foreground">
                              {l.views_count ?? 0}
                            </td>
                            <td className="px-5 py-4 text-right font-medium text-foreground">
                              {l.contacts_count ?? 0}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <Link
                                href={`/listing/${l.id}/edit`}
                                className={cn(linkButtonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-xs")}
                              >
                                <Pencil className="h-3 w-3" /> Editar
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
