import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ count: usersCount }, { data: listingRows }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("listings").select("type").eq("status", "active"),
  ]);

  const stats = {
    users: usersCount ?? 0,
    spaces: listingRows?.filter((l) => l.type === "have_space").length ?? 0,
    advertisers: listingRows?.filter((l) => l.type === "want_to_advertise").length ?? 0,
    agencies: listingRows?.filter((l) => l.type === "offer_service").length ?? 0,
  };

  return <HomeClient stats={stats} />;
}
