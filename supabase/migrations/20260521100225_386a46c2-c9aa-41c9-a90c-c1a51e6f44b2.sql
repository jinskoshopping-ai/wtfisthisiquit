
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;

DROP POLICY IF EXISTS "public read site-images" ON storage.objects;
CREATE POLICY "admins can list site-images" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
