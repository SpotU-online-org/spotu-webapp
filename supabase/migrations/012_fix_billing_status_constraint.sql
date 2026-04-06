-- Migration 012: fix billing_status check constraint
-- The original constraint in 007 was missing 'pioneer' and 'pending_payment',
-- causing inserts/updates with those values to fail silently (falling back to default 'trial').

-- 1. Drop the old constraint
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_billing_status_check;

-- 2. Add corrected constraint with all valid values
ALTER TABLE listings
  ADD CONSTRAINT listings_billing_status_check
  CHECK (billing_status IN (
    'pending_payment',
    'trial',
    'active',
    'past_due',
    'paused',
    'cancelled',
    'pioneer'
  ));

-- 3. Fix any pioneer-eligible listings that were incorrectly set to 'trial'
--    (users with user_number <= 100 whose free year has not expired yet)
UPDATE listings
SET
  billing_status = 'pioneer',
  status         = 'active',
  trial_ends_at  = NULL,
  paid_until     = NULL
WHERE user_id IN (
  SELECT id FROM profiles
  WHERE user_number <= 100
    AND user_number != 9999
    AND created_at > now() - interval '365 days'
)
AND billing_status IN ('trial', 'active', 'pending_payment');
