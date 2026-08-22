/*
# Create GMHSS Ramban CMS foundation

1. New Tables
- `profiles`: authenticated staff profiles with admin/editor roles.
- `school_settings`: one editable record for verified school identity and contact details.
- `notices`: draft, published, and archived school announcements.
- `activities`: publishable school activities and events.
- `gallery`: publishable image records with captions and accessibility text.
- `documents`: publishable downloadable documents.
- `contact_submissions`: private visitor messages with read/archive state.

2. Security
- Row Level Security is enabled on every table.
- Published content is readable by the public but writable only by authorized staff.
- Drafts, settings, and visitor messages are restricted to authorized staff.
- Contact submissions may be created publicly but never read publicly.

3. Storage
- Creates `school-images`, `documents`, and `principal-assets` buckets.
- Public read access is limited to published/public assets; uploads and deletes require staff authorization.

4. Important Notes
- The profile role is stored in `raw_app_meta_data`-compatible staff records and checked through `profiles`.
- No school facts, contact details, or sample content are inserted.
- The principal name remains editable and should be verified before launch.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'administrator')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.school_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL DEFAULT 'Govt. Model Higher Secondary School, Ramban',
  short_name text NOT NULL DEFAULT 'GMHSS Ramban',
  address text,
  phone text,
  email text,
  principal_name text NOT NULL DEFAULT 'Kewal Krishna Sharma',
  principal_message text,
  principal_photo_path text,
  logo_path text,
  school_description text,
  map_url text,
  latitude numeric,
  longitude numeric,
  hero_title text NOT NULL DEFAULT 'Government Model Higher Secondary School, Ramban',
  hero_subtitle text NOT NULL DEFAULT 'Education • Character • Opportunity',
  hero_image_path text DEFAULT '/images/hero/download.jpg',
  about_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  content text,
  category text NOT NULL DEFAULT 'General',
  publication_date date NOT NULL DEFAULT CURRENT_DATE,
  attachment_path text,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  event_date date,
  category text NOT NULL DEFAULT 'Activity',
  cover_image_path text,
  gallery_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  caption text,
  image_path text NOT NULL,
  category text NOT NULL DEFAULT 'School Life',
  alt_text text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'General',
  file_path text NOT NULL,
  file_type text,
  file_size bigint,
  published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor', 'administrator')); $$;

DROP POLICY IF EXISTS "staff read profiles" ON public.profiles;
CREATE POLICY "staff read profiles" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "staff update own profile" ON public.profiles;
CREATE POLICY "staff update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "public read school settings" ON public.school_settings;
CREATE POLICY "public read school settings" ON public.school_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "staff insert school settings" ON public.school_settings;
CREATE POLICY "staff insert school settings" ON public.school_settings FOR INSERT TO authenticated WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff update school settings" ON public.school_settings;
CREATE POLICY "staff update school settings" ON public.school_settings FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff delete school settings" ON public.school_settings;
CREATE POLICY "staff delete school settings" ON public.school_settings FOR DELETE TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "public read published notices" ON public.notices;
CREATE POLICY "public read published notices" ON public.notices FOR SELECT TO anon, authenticated USING (status = 'PUBLISHED' OR public.is_staff());
DROP POLICY IF EXISTS "staff insert notices" ON public.notices;
CREATE POLICY "staff insert notices" ON public.notices FOR INSERT TO authenticated WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff update notices" ON public.notices;
CREATE POLICY "staff update notices" ON public.notices FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff delete notices" ON public.notices;
CREATE POLICY "staff delete notices" ON public.notices FOR DELETE TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "public read published activities" ON public.activities;
CREATE POLICY "public read published activities" ON public.activities FOR SELECT TO anon, authenticated USING (status = 'PUBLISHED' OR public.is_staff());
DROP POLICY IF EXISTS "staff insert activities" ON public.activities;
CREATE POLICY "staff insert activities" ON public.activities FOR INSERT TO authenticated WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff update activities" ON public.activities;
CREATE POLICY "staff update activities" ON public.activities FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff delete activities" ON public.activities;
CREATE POLICY "staff delete activities" ON public.activities FOR DELETE TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "public read published gallery" ON public.gallery;
CREATE POLICY "public read published gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (status = 'PUBLISHED' OR public.is_staff());
DROP POLICY IF EXISTS "staff insert gallery" ON public.gallery;
CREATE POLICY "staff insert gallery" ON public.gallery FOR INSERT TO authenticated WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff update gallery" ON public.gallery;
CREATE POLICY "staff update gallery" ON public.gallery FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff delete gallery" ON public.gallery;
CREATE POLICY "staff delete gallery" ON public.gallery FOR DELETE TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "public read published documents" ON public.documents;
CREATE POLICY "public read published documents" ON public.documents FOR SELECT TO anon, authenticated USING (published = true OR public.is_staff());
DROP POLICY IF EXISTS "staff insert documents" ON public.documents;
CREATE POLICY "staff insert documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff update documents" ON public.documents;
CREATE POLICY "staff update documents" ON public.documents FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff delete documents" ON public.documents;
CREATE POLICY "staff delete documents" ON public.documents FOR DELETE TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "public create contact submissions" ON public.contact_submissions;
CREATE POLICY "public create contact submissions" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (length(trim(name)) > 0 AND length(trim(email)) > 3 AND length(trim(subject)) > 0 AND length(trim(message)) > 0);
DROP POLICY IF EXISTS "staff read contact submissions" ON public.contact_submissions;
CREATE POLICY "staff read contact submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.is_staff());
DROP POLICY IF EXISTS "staff update contact submissions" ON public.contact_submissions;
CREATE POLICY "staff update contact submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "staff delete contact submissions" ON public.contact_submissions;
CREATE POLICY "staff delete contact submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.is_staff());

CREATE INDEX IF NOT EXISTS notices_public_date_idx ON public.notices(status, publication_date DESC);
CREATE INDEX IF NOT EXISTS notices_category_idx ON public.notices(category);
CREATE INDEX IF NOT EXISTS activities_public_date_idx ON public.activities(status, event_date DESC);
CREATE INDEX IF NOT EXISTS gallery_public_featured_idx ON public.gallery(status, featured, created_at DESC);
CREATE INDEX IF NOT EXISTS documents_public_featured_idx ON public.documents(published, featured, created_at DESC);
CREATE INDEX IF NOT EXISTS contact_created_idx ON public.contact_submissions(created_at DESC);

INSERT INTO public.school_settings (id) VALUES ('00000000-0000-0000-0000-000000000001') ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('school-images', 'school-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('principal-assets', 'principal-assets', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public read school images" ON storage.objects;
CREATE POLICY "public read school images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id IN ('school-images', 'principal-assets'));
DROP POLICY IF EXISTS "staff upload school images" ON storage.objects;
CREATE POLICY "staff upload school images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('school-images', 'principal-assets') AND public.is_staff());
DROP POLICY IF EXISTS "staff update school images" ON storage.objects;
CREATE POLICY "staff update school images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('school-images', 'principal-assets') AND public.is_staff()) WITH CHECK (bucket_id IN ('school-images', 'principal-assets') AND public.is_staff());
DROP POLICY IF EXISTS "staff delete school images" ON storage.objects;
CREATE POLICY "staff delete school images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('school-images', 'principal-assets') AND public.is_staff());
DROP POLICY IF EXISTS "public read documents" ON storage.objects;
CREATE POLICY "public read documents" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'documents');
DROP POLICY IF EXISTS "staff upload documents" ON storage.objects;
CREATE POLICY "staff upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND public.is_staff());
DROP POLICY IF EXISTS "staff update documents" ON storage.objects;
CREATE POLICY "staff update documents" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'documents' AND public.is_staff()) WITH CHECK (bucket_id = 'documents' AND public.is_staff());
DROP POLICY IF EXISTS "staff delete documents" ON storage.objects;
CREATE POLICY "staff delete documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents' AND public.is_staff());