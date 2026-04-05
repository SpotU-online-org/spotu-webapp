import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { PublishForm } from "./PublishForm";
import { PublishTypeSelector } from "./PublishTypeSelector";

export const metadata = { title: "Publicar" };

export default async function PublishPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/publish");

  const { data: profile } = await supabase
    .from("profiles")
    .select("type, types, whatsapp, email_contact")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/login");

  const userTypes = (profile.types as string[] | null) ?? [profile.type];
  const isMultiRole = userTypes.length > 1;

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Nueva publicación
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tu primera publicación es <span className="font-semibold text-primary">gratis por 30 días</span>.
            </p>
          </div>

          {isMultiRole ? (
            <PublishTypeSelector
              userId={user.id}
              userTypes={userTypes as ("advertiser" | "space_owner" | "agency")[]}
              defaultWhatsapp={profile.whatsapp}
              defaultEmail={profile.email_contact}
            />
          ) : (
            <PublishForm
              userId={user.id}
              profileType={profile.type as "advertiser" | "space_owner" | "agency"}
              defaultWhatsapp={profile.whatsapp}
              defaultEmail={profile.email_contact}
            />
          )}
        </div>
      </main>
    </>
  );
}
