import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProfileEditForm } from "./ProfileEditForm";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, company_name, bio, website, phone, whatsapp, email_contact, city, country, type, types, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/login");

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Mi perfil</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Actualiza tu información pública y tipo de cuenta.
            </p>
          </div>
          <ProfileEditForm userId={user.id} profile={profile} />
        </div>
      </main>
      <Footer />
    </>
  );
}
