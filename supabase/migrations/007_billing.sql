-- ============================================================================
-- SpotU — Migración 007: Billing fields
-- ============================================================================

-- Listings billing
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS billing_status TEXT DEFAULT 'trial'
    CHECK (billing_status IN ('trial', 'active', 'past_due', 'paused', 'cancelled')),
  ADD COLUMN IF NOT EXISTS trial_ends_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS paid_until       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
  ADD COLUMN IF NOT EXISTS is_boosted       BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS boost_ends_at    TIMESTAMPTZ;

-- Set trial_ends_at = created_at + 30 days for existing listings
UPDATE public.listings
  SET trial_ends_at = created_at + INTERVAL '30 days'
  WHERE trial_ends_at IS NULL;

-- Profiles: Stripe customer id
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
