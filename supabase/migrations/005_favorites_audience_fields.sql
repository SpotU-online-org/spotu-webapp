-- ============================================================================
-- SpotU — Migración 005: Favoritos + campos de audiencia en listings
-- ============================================================================

-- 1. Tabla de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, listing_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Campos de audiencia en listings
-- Para space_owner: descripción del público que recibe el espacio
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS audience_demographics TEXT;

-- Para advertiser: descripción del público objetivo que busca
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS target_audience TEXT;
