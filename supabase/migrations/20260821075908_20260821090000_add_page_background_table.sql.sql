/*
# Add Page Background table

1. New Tables
- `page_background`
  - `id` (uuid, primary key)
  - `image_path` (text, not null) — storage path or URL for the background image
  - `label` (text, nullable) — optional descriptive label for the admin
  - `is_active` (boolean, default true) — whether this background is currently displayed
  - `sort_order` (int, default 0) — ordering
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Purpose
- Stores customizable background image(s) shown behind site pages.
- Admin can upload, activate/deactivate, and reorder backgrounds.

3. Security
- Enable RLS on `page_background`.
- SELECT: anon + authenticated (public content, visible to all visitors).
- INSERT/UPDATE/DELETE: authenticated only (staff-only management).
*/

CREATE TABLE IF NOT EXISTS page_background (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path text NOT NULL,
  label text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_background ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_page_background" ON page_background;
CREATE POLICY "anon_select_page_background" ON page_background FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_page_background" ON page_background;
CREATE POLICY "auth_insert_page_background" ON page_background FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_page_background" ON page_background;
CREATE POLICY "auth_update_page_background" ON page_background FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_page_background" ON page_background;
CREATE POLICY "auth_delete_page_background" ON page_background FOR DELETE
  TO authenticated USING (true);
