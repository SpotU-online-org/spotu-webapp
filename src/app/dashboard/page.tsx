import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, type")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl text-center py-24">
        <h1 className="text-3xl font-bold text-foreground">
          ¡Hola, {profile?.display_name ?? user.email}!
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tu cuenta está activa. El dashboard completo viene pronto.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Tipo de cuenta:{" "}
          <span className="font-medium text-primary capitalize">{profile?.type ?? "–"}</span>
        </p>
      </div>
    </div>
  );
}
