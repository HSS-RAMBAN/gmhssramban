/*
# Create school_quotes table

1. New Tables
- `school_quotes`
  - `id` (uuid, primary key)
  - `quote` (text, not null) — the inspirational quote text
  - `author` (text) — author/source attribution
  - `featured` (boolean, default false) — whether this is the featured quote shown on homepage
  - `sort_order` (int, default 0) — display ordering
  - `published` (boolean, default false) — whether the quote is visible to public
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `school_quotes`.
- Public (anon + authenticated) can read published quotes.
- Only authenticated staff can insert, update, delete.
*/

CREATE TABLE IF NOT EXISTS school_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE school_quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_quotes" ON school_quotes;
CREATE POLICY "anon_select_quotes" ON school_quotes
  FOR SELECT TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "staff_insert_quotes" ON school_quotes;
CREATE POLICY "staff_insert_quotes" ON school_quotes
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff_update_quotes" ON school_quotes;
CREATE POLICY "staff_update_quotes" ON school_quotes
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff_delete_quotes" ON school_quotes;
CREATE POLICY "staff_delete_quotes" ON school_quotes
  FOR DELETE TO authenticated USING (true);
