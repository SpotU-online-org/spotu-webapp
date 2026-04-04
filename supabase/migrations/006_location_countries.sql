-- ============================================================================
-- SpotU — Migración 006: location_countries (multi-country per listing)
-- ============================================================================

-- Array de hasta 10 países por publicación (códigos ISO 3166-1 alpha-2)
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS location_countries TEXT[];

-- Backfill: copiar location_country existente al array si existe
UPDATE public.listings
  SET location_countries = ARRAY[location_country]
  WHERE location_country IS NOT NULL
    AND (location_countries IS NULL OR array_length(location_countries, 1) = 0);

-- Índice GIN para filtros rápidos por país en el feed
CREATE INDEX IF NOT EXISTS listings_location_countries_gin
  ON public.listings USING gin(location_countries);
