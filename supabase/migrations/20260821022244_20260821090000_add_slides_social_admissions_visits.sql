/*
# Add hero slides, social links, admissions content, visit counter, and gallery event_date

## Purpose
Adds new CMS tables for staff-managed hero slideshow images, social media links,
admissions page content, and a database-backed website visitor counter.
Also adds an optional event_date column to the gallery table for date-aware sorting.

## New Tables

1. **hero_slides** — Staff-managed hero/landing slideshow images
   - id, image_path (storage), caption, sort_order, is_active, created_at, updated_at
   - Staff upload images via dashboard; public site auto-advances through active slides

2. **social_links** — Social media platform links with visibility control
   - id, platform, url, label, icon, sort_order, is_visible, created_at, updated_at
   - Only visible links with valid URLs appear as micro-icons in the header

3. **admissions_content** — Editable admissions page content (single-row)
   - id, intro, prospectus_url, programs_offered, fee_structure, required_documents,
     important_dates, admission_notices, downloadable_forms, instructions, updated_at
   - All text fields are editable by staff; empty fields show appropriate empty states

4. **visit_counter** — Database-backed website visitor counter
   - id (single row), count (bigint), updated_at
   - Incremented via a SECURITY DEFINER function on each page load

## Modified Tables

5. **gallery** — Added optional event_date column (timestamptz, nullable)
   - Used for date-aware gallery sorting (newest first by event date, fallback to created_at)

## Security
- RLS enabled on all new tables.
- hero_slides, social_links, admissions_content: public can SELECT only active/published rows.
- visit_counter: public can SELECT (to display count) but cannot INSERT/UPDATE/DELETE directly.
- A SECURITY DEFINER function `increment_visit()` handles atomic count increment,
  callable by anon role, preventing direct table manipulation.
- Only authenticated staff can INSERT, UPDATE, DELETE on content tables.

## Notes
- All changes are additive — no existing data is modified or lost.
- The gallery event_date column is nullable so existing rows are unaffected.
*/

-- ===================== hero_slides =====================
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_hero_slides" ON hero_slides;
CREATE POLICY "public_read_hero_slides" ON hero_slides
  FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "staff_insert_hero_slides" ON hero_slides;
CREATE POLICY "staff_insert_hero_slides" ON hero_slides
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff_update_hero_slides" ON hero_slides;
CREATE POLICY "staff_update_hero_slides" ON hero_slides
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff_delete_hero_slides" ON hero_slides;
CREATE POLICY "staff_delete_hero_slides" ON hero_slides
  FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_hero_slides_active_sort ON hero_slides (is_active, sort_order);

-- ===================== social_links =====================
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  label text,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_social_links" ON social_links;
CREATE POLICY "public_read_social_links" ON social_links
  FOR SELECT TO anon, authenticated USING (is_visible = true);

DROP POLICY IF EXISTS "staff_insert_social_links" ON social_links;
CREATE POLICY "staff_insert_social_links" ON social_links
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff_update_social_links" ON social_links;
CREATE POLICY "staff_update_social_links" ON social_links
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff_delete_social_links" ON social_links;
CREATE POLICY "staff_delete_social_links" ON social_links
  FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_social_links_visible_sort ON social_links (is_visible, sort_order);

-- ===================== admissions_content =====================
CREATE TABLE IF NOT EXISTS admissions_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intro text,
  prospectus_url text,
  programs_offered text,
  fee_structure text,
  required_documents text,
  important_dates text,
  admission_notices text,
  downloadable_forms text,
  instructions text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admissions_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_admissions" ON admissions_content;
CREATE POLICY "public_read_admissions" ON admissions_content
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "staff_insert_admissions" ON admissions_content;
CREATE POLICY "staff_insert_admissions" ON admissions_content
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff_update_admissions" ON admissions_content;
CREATE POLICY "staff_update_admissions" ON admissions_content
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff_delete_admissions" ON admissions_content;
CREATE POLICY "staff_delete_admissions" ON admissions_content
  FOR DELETE TO authenticated USING (true);

-- ===================== visit_counter =====================
CREATE TABLE IF NOT EXISTS visit_counter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  count bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE visit_counter ENABLE ROW LEVEL SECURITY;

-- Public can read the count but cannot modify it directly
DROP POLICY IF EXISTS "public_read_visit_counter" ON visit_counter;
CREATE POLICY "public_read_visit_counter" ON visit_counter
  FOR SELECT TO anon, authenticated USING (true);

-- No direct INSERT/UPDATE/DELETE policies — only the SECURITY DEFINER function can increment

-- Seed a single row if none exists
INSERT INTO visit_counter (count)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM visit_counter);

-- ===================== SECURITY DEFINER: increment_visit =====================
-- Atomic increment function callable by anon role
CREATE OR REPLACE FUNCTION increment_visit()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count bigint;
BEGIN
  UPDATE visit_counter SET count = count + 1, updated_at = now() RETURNING count INTO new_count;
  IF new_count IS NULL THEN
    INSERT INTO visit_counter (count) VALUES (1) RETURNING count INTO new_count;
  END IF;
  RETURN new_count;
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION increment_visit() TO anon, authenticated;

-- ===================== gallery: add event_date column =====================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery' AND column_name = 'event_date') THEN
    ALTER TABLE gallery ADD COLUMN event_date timestamptz;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_gallery_event_date ON gallery (event_date DESC);
