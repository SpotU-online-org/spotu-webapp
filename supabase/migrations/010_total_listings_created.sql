-- Migration 010: Track total listings ever created per user
-- This prevents re-granting the 30-day trial if a user deletes their first listing

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS total_listings_created INTEGER NOT NULL DEFAULT 0;

-- Back-fill: count ALL listings ever (including deleted) is not possible,
-- so we count current listings per user as baseline.
-- This is conservative: existing users who deleted their first listing
-- will start from their current count (worst case they get one more trial).
UPDATE public.profiles p
SET total_listings_created = (
  SELECT COUNT(*)::INTEGER
  FROM public.listings l
  WHERE l.user_id = p.id
);

-- Trigger function: increment counter on every new listing INSERT
CREATE OR REPLACE FUNCTION increment_total_listings_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET total_listings_created = total_listings_created + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Attach trigger to listings table
DROP TRIGGER IF EXISTS trg_increment_listings_created ON public.listings;
CREATE TRIGGER trg_increment_listings_created
  AFTER INSERT ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION increment_total_listings_created();
