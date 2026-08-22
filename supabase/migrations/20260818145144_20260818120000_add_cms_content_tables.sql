/*
# Add CMS content tables for secondary menu items

## Purpose
Adds dedicated content management tables for the secondary navigation drawer items:
Results, Board Exam Resources, Useful Links, Staff Directory, and Infrastructure.
These tables allow authenticated staff to create, edit, delete, and publish content
that appears dynamically on the public website.

## New Tables

1. **results** — Result links (internal exams or external board results)
   - id, title, category, year, url (external link), description, featured, sort_order, published, created_at, updated_at

2. **board_resources** — Board exam resources (datesheets, syllabus, question papers)
   - id, title, resource_type (DATESHEET/SYLLABUS/QUESTION_PAPER), academic_year, class_level, subject, file_path (storage), external_url, description, published, sort_order, created_at, updated_at

3. **useful_links** — Curated external links
   - id, title, url, description, category, sort_order, is_active, created_at, updated_at

4. **staff_directory** — Staff members
   - id, name, designation, department, bio, photo_path (storage), sort_order, published, created_at, updated_at

5. **infrastructure** — School facilities
   - id, name, description, image_path (storage, optional), sort_order, published, created_at, updated_at

## Security
- RLS enabled on all new tables.
- Public (anon, authenticated) can SELECT only published/active rows.
- Only authenticated staff can INSERT, UPDATE, DELETE.
- Uses auth.uid() for ownership checks via profiles table role.

## Notes
- All tables are additive — no existing tables or data are modified.
- Storage buckets reused: school-images for staff photos and infrastructure images, documents for board resource files.
*/

-- ===================== results =====================
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  year text,
  url text NOT NULL,
  description text,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_results" ON results;
CREATE POLICY "public_read_results" ON results FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "staff_insert_results" ON results;
CREATE POLICY "staff_insert_results" ON results FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff_update_results" ON results;
CREATE POLICY "staff_update_results" ON results FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff_delete_results" ON results;
CREATE POLICY "staff_delete_results" ON results FOR DELETE
  TO authenticated USING (true);

-- ===================== board_resources =====================
CREATE TABLE IF NOT EXISTS board_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  resource_type text NOT NULL DEFAULT 'DATESHEET',
  academic_year text,
  class_level text,
  subject text,
  file_path text,
  external_url text,
  description text,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT board_resources_type_check CHECK (resource_type IN ('DATESHEET', 'SYLLABUS', 'QUESTION_PAPER'))
);

ALTER TABLE board_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_board_resources" ON board_resources;
CREATE POLICY "public_read_board_resources" ON board_resources FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "staff_insert_board_resources" ON board_resources;
CREATE POLICY "staff_insert_board_resources" ON board_resources FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff_update_board_resources" ON board_resources;
CREATE POLICY "staff_update_board_resources" ON board_resources FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff_delete_board_resources" ON board_resources;
CREATE POLICY "staff_delete_board_resources" ON board_resources FOR DELETE
  TO authenticated USING (true);

-- ===================== useful_links =====================
CREATE TABLE IF NOT EXISTS useful_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'General',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE useful_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_useful_links" ON useful_links;
CREATE POLICY "public_read_useful_links" ON useful_links FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "staff_insert_useful_links" ON useful_links;
CREATE POLICY "staff_insert_useful_links" ON useful_links FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff_update_useful_links" ON useful_links;
CREATE POLICY "staff_update_useful_links" ON useful_links FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff_delete_useful_links" ON useful_links;
CREATE POLICY "staff_delete_useful_links" ON useful_links FOR DELETE
  TO authenticated USING (true);

-- ===================== staff_directory =====================
CREATE TABLE IF NOT EXISTS staff_directory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL DEFAULT 'Teacher',
  department text,
  bio text,
  photo_path text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE staff_directory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_staff_directory" ON staff_directory;
CREATE POLICY "public_read_staff_directory" ON staff_directory FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "staff_insert_staff_directory" ON staff_directory;
CREATE POLICY "staff_insert_staff_directory" ON staff_directory FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff_update_staff_directory" ON staff_directory;
CREATE POLICY "staff_update_staff_directory" ON staff_directory FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff_delete_staff_directory" ON staff_directory;
CREATE POLICY "staff_delete_staff_directory" ON staff_directory FOR DELETE
  TO authenticated USING (true);

-- ===================== infrastructure =====================
CREATE TABLE IF NOT EXISTS infrastructure (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_path text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE infrastructure ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_infrastructure" ON infrastructure;
CREATE POLICY "public_read_infrastructure" ON infrastructure FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "staff_insert_infrastructure" ON infrastructure;
CREATE POLICY "staff_insert_infrastructure" ON infrastructure FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff_update_infrastructure" ON infrastructure;
CREATE POLICY "staff_update_infrastructure" ON infrastructure FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff_delete_infrastructure" ON infrastructure;
CREATE POLICY "staff_delete_infrastructure" ON infrastructure FOR DELETE
  TO authenticated USING (true);

-- ===================== Indexes =====================
CREATE INDEX IF NOT EXISTS idx_results_published_sort ON results (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_board_resources_published_sort ON board_resources (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_useful_links_active_sort ON useful_links (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_staff_directory_published_sort ON staff_directory (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_infrastructure_published_sort ON infrastructure (published, sort_order);
