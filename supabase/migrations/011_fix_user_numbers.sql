-- Migration 011: Re-number users to fill gaps from deleted accounts
-- Run this any time a user is deleted and user_number has gaps.
-- Safe to run multiple times: only updates based on created_at order.

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS new_number
  FROM public.profiles
)
UPDATE public.profiles p
SET user_number = n.new_number
FROM numbered n
WHERE p.id = n.id;

-- Reset the sequence to continue from max + 1
SELECT setval(
  'profiles_user_number_seq',
  COALESCE((SELECT MAX(user_number) FROM public.profiles), 0) + 1,
  false
);
