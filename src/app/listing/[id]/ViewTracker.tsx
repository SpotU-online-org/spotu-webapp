"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function ViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    const supabase = createClient();
    // Insert view — the UNIQUE(listing_id, viewer_ip) constraint prevents duplicates
    // IP is handled server-side by Supabase; we pass null and let RLS/functions handle dedup
    supabase
      .from("listing_views")
      .insert({ listing_id: listingId })
      .then(() => {
        // Increment counter
        supabase.rpc("increment_views", { listing_id: listingId }).then(() => {});
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
