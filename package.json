
CREATE SCHEMA IF NOT EXISTS private;

-- Recreate has_role in private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM public;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon;
-- ^ Needed because RLS policies that reference it run as the querying role.
-- It lives in `private` schema (not exposed via PostgREST), so direct API calls are impossible.

-- Update policies to use private.has_role
DROP POLICY IF EXISTS "admins can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "admins can delete site settings" ON public.site_settings;
CREATE POLICY "admins can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can delete site settings" ON public.site_settings FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins can insert opening hours" ON public.opening_hours;
DROP POLICY IF EXISTS "admins can update opening hours" ON public.opening_hours;
DROP POLICY IF EXISTS "admins can delete opening hours" ON public.opening_hours;
CREATE POLICY "admins can insert opening hours" ON public.opening_hours FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can update opening hours" ON public.opening_hours FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can delete opening hours" ON public.opening_hours FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "anyone can read published news" ON public.news;
DROP POLICY IF EXISTS "admins can insert news" ON public.news;
DROP POLICY IF EXISTS "admins can update news" ON public.news;
DROP POLICY IF EXISTS "admins can delete news" ON public.news;
CREATE POLICY "anyone can read published news" ON public.news FOR SELECT TO anon, authenticated USING (published = true OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can insert news" ON public.news FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can update news" ON public.news FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can delete news" ON public.news FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins can list site-images" ON storage.objects;
DROP POLICY IF EXISTS "admins upload site-images" ON storage.objects;
DROP POLICY IF EXISTS "admins update site-images" ON storage.objects;
DROP POLICY IF EXISTS "admins delete site-images" ON storage.objects;
CREATE POLICY "admins can list site-images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins upload site-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update site-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete site-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'));

-- Drop the now-unused public.has_role
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- Same treatment for the signup trigger function
CREATE OR REPLACE FUNCTION private.handle_new_user_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email = 'info@cafe-koch.de' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION private.handle_new_user_admin() FROM public;

DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION private.handle_new_user_admin();

DROP FUNCTION IF EXISTS public.handle_new_user_admin();
