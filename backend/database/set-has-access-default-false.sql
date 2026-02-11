-- Set default value for users.has_access to false (only subscribed users can access).
-- Run this against your existing schema. Existing rows are unchanged; only new inserts get the new default.

ALTER TABLE public.users
  ALTER COLUMN has_access SET DEFAULT false;

-- Optional: To update existing users to have no access (uncomment if desired):
-- UPDATE public.users SET has_access = false WHERE has_access IS NULL;
