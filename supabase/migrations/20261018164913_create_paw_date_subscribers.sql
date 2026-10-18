/*
# Create paw_date_subscribers table

1. New Tables
- `paw_date_subscribers` — stores email addresses from visitors who want "paw-date" (fundraising and community cat) email updates.
  - `id` (uuid, primary key, auto-generated)
  - `email` (text, not null, unique — one subscription per email)
  - `created_at` (timestamp, defaults to now)

2. Security
- RLS enabled on `paw_date_subscribers`.
- INSERT policy for anon + authenticated: anyone (including visitors not signed in) can subscribe.
- No SELECT policy for anon/authenticated: subscriber emails are private; only the project owner can view them through the database dashboard (privileged access bypasses RLS).

3. Notes
- Single-tenant, no ownership columns — subscriptions are not user-owned data.
- Unique constraint on email prevents duplicate subscriptions; the UI treats a duplicate as an existing subscription.
*/

CREATE TABLE IF NOT EXISTS paw_date_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE paw_date_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_can_subscribe" ON paw_date_subscribers;
CREATE POLICY "anyone_can_subscribe"
ON paw_date_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (true);
