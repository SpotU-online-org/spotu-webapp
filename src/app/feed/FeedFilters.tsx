"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Search, X } from "lucide-react";
import { SPACE_CATEGORIES } from "@/constants";

type Country = { value: string; label: string };

type FeedFiltersProps = {
  currentCountry: string;
  currentCity: string;
  currentSpaceType: string;
  currentType: string;
  availableCountries: Country[];
  currentSearch: string;
};

function FiltersInner({ currentCountry, currentCity, currentSpaceType, currentType, availableCountries, currentSearch }: FeedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(currentSearch);

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/feed?${params.toString()}`);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    update("q", searchInput.trim());
  }

  function clearSearch() {
    setSearchInput("");
    update("q", "");
  }

  const selectCls =
    "rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors min-w-0";

  const showSpaceType = currentType !== "offer_service";

  return (
    <div className="mt-4 space-y-3">
      {/* Keyword search bar */}
      <form onSubmit={submitSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por palabras clave, título o descripción..."
            className="w-full rounded-lg border bg-background pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="rounded-lg border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Other filters */}
      <div className="flex flex-wrap gap-3">
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

        <input
          type="text"
          value={currentCity}
          onChange={(e) => update("city", e.target.value)}
          placeholder="Ciudad..."
          className={selectCls + " w-36"}
          aria-label="Filtrar por ciudad"
        />

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
