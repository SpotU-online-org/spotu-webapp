import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://spotu.online";

  const supabase = await createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("id, updated_at")
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(1000);

  const listingUrls: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
    url: `${base}/listing/${l.id}`,
    lastModified: new Date(l.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/feed`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/auth/register`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/auth/login`, changeFrequency: "monthly", priority: 0.4 },
    ...listingUrls,
  ];
}
