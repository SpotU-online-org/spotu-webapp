"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Props = { listingId: string; initialFavorited?: boolean };

export function FavoriteButton({ listingId, initialFavorited = false }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [checked, setChecked] = useState(initialFavorited);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);
      if (checked) return; // server already provided accurate initial state
      supabase
        .from("favorites")
        .select("listing_id")
        .eq("user_id", data.user.id)
        .eq("listing_id", listingId)
        .maybeSingle()
        .then(({ data: fav }) => {
          setFavorited(!!fav);
          setChecked(true);
        });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  async function toggle() {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }
    setLoading(true);
    const supabase = createClient();
    if (favorited) {
      await supabase.from("favorites").delete().eq("listing_id", listingId).eq("user_id", userId);
      setFavorited(false);
    } else {
      await supabase.from("favorites").insert({ listing_id: listingId, user_id: userId });
      setFavorited(true);
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      title={favorited ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
        favorited
          ? "border-amber-300 bg-amber-50 text-amber-600 hover:bg-amber-100"
          : "border-border bg-card text-muted-foreground hover:border-amber-300 hover:text-amber-500"
      )}
    >
      <Star className={cn("h-3.5 w-3.5 transition-all", favorited && "fill-current")} />
      {favorited ? "Guardado" : "Guardar"}
    </button>
  );
}
