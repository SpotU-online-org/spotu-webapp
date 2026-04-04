"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SPACE_CATEGORIES } from "@/constants";

type Country = { value: string; label: string };

type FeedFiltersProps = {
  currentCountry: string;
  currentCity: string;
  currentSpaceType: string;
  currentType: string;
  availableCountries: Country[];
};

function FiltersInner({ currentCountry, currentCity, currentSpaceType, currentType, availableCountries }: FeedFiltersProps) {
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

  const showSpaceType = currentType !== "offer_service";

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {/* Country — only show if there are active listings with countries */}
      {availableCountries.length > 0 && (
        <select
          value={currentCountry}
          onChange={(e) => update("country", e.target.value)}
          className={selectCls}
          aria-label="Filtrar por país"
        >
          <option value="">Todos los países</option>
          {availableCountries.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      )}

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
