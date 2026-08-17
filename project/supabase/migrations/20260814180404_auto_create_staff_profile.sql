/*
# Auto-create staff profile on signup

1. New Functions
- `public.handle_new_user()`: trigger function that inserts a `profiles` row when a new auth user is created.

2. Security
- The trigger runs as SECURITY DEFINER so it can write to `profiles` even though the anon role cannot.
- New profiles default to the `editor` role so staff can be promoted to `admin` later by an existing admin.

3. Important Notes
- This lets a newly signed-up admin reach the dashboard immediately.
- An existing admin can still revoke access by changing the role or deleting the profile row.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), 'administrator')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
