-- Migration 008: Add user_number for pioneer tracking
-- First 100 users get unlimited free listings

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_number INTEGER;

-- Back-fill existing users in signup order
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
  FROM public.profiles
)
UPDATE public.profiles
SET user_number = numbered.rn
FROM numbered
WHERE public.profiles.id = numbered.id;

-- Create sequence starting after the highest current user_number
DO $$
DECLARE max_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(user_number), 0) INTO max_num FROM public.profiles;
  EXECUTE format('CREATE SEQUENCE IF NOT EXISTS profiles_user_number_seq START WITH %s', max_num + 1);
END $$;

ALTER TABLE public.profiles
  ALTER COLUMN user_number SET DEFAULT nextval('profiles_user_number_seq');

-- Index for fast pioneer checks
CREATE INDEX IF NOT EXISTS idx_profiles_user_number ON public.profiles(user_number);
