-- Migration 009: Add tags (keywords) to listings
-- Max 5 tags per listing for flexible keyword search in feed

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- GIN index for fast array containment queries
CREATE INDEX IF NOT EXISTS idx_listings_tags ON public.listings USING GIN(tags);
