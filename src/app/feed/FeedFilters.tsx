"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SPACE_CATEGORIES, MARKETS } from "@/constants";

type FeedFiltersProps = {
  currentCountry: string;
  currentCity: string;
  currentSpaceType: string;
  currentType: string;
};

function FiltersInner({ currentCountry, currentCity, currentSpaceType, currentType }: FeedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/feed?${params.toString()}`);
  }

  const selectCls =
    "rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors min-w-0";

  // Only show space_type filter for spaces and advertiser searches (not agencies)
  const showSpaceType = currentType !== "offer_service";

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {/* Country */}
      <select
        value={currentCountry}
        onChange={(e) => update("country", e.target.value)}
        className={selectCls}
        aria-label="Filtrar por país"
      >
        <option value="">Todos los países</option>
        {MARKETS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      {/* City */}
      <input
        type="text"
        value={currentCity}
        onChange={(e) => update("city", e.target.value)}
        placeholder="Ciudad..."
        className={selectCls + " w-36"}
        aria-label="Filtrar por ciudad"
      />

      {/* Space type */}
      {showSpaceType && (
        <select
          value={currentSpaceType}
          onChange={(e) => update("space_type", e.target.value)}
          className={selectCls}
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {SPACE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export function FeedFilters(props: FeedFiltersProps) {
  return (
    <Suspense fallback={null}>
      <FiltersInner {...props} />
    </Suspense>
  );
}
