-- ============================================================================
-- SpotU — Migración 003: Multi-rol y setup de cuenta
-- ============================================================================

-- Multi-rol: usuarios pueden tener varios tipos de cuenta
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS types TEXT[] DEFAULT ARRAY['advertiser']::TEXT[];

-- Flag para saber si el usuario completó la selección de rol
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT FALSE;

-- Backfill: usuarios existentes ya tienen tipo explícito → marcar como completados
UPDATE public.profiles
SET
  types = ARRAY[type]::TEXT[],
  setup_completed = TRUE
WHERE type IS NOT NULL;

-- Índice GIN para búsqueda en arrays
CREATE INDEX IF NOT EXISTS idx_profiles_types ON public.profiles USING GIN(types);

-- Función increment_views (para ViewTracker)
CREATE OR REPLACE FUNCTION public.increment_views(listing_id UUID)
RETURNS void AS $$
  UPDATE public.listings
  SET views_count = views_count + 1
  WHERE id = listing_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================================
-- FIN MIGRACIÓN 003
-- ============================================================================
