
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Auto-grant admin to info@cafe-koch.de on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email = 'info@cafe-koch.de' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();

-- Site settings (key/value)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text,
  image_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins can insert site settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can delete site settings" ON public.site_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Opening hours
CREATE TABLE public.opening_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order int NOT NULL DEFAULT 0,
  day_label text NOT NULL,
  hours_label text NOT NULL,
  is_muted boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read opening hours" ON public.opening_hours
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins can insert opening hours" ON public.opening_hours
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can update opening hours" ON public.opening_hours
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can delete opening hours" ON public.opening_hours
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- News / Aktuelles
CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  starts_on date,
  ends_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read published news" ON public.news
  FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can insert news" ON public.news
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can update news" ON public.news
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can delete news" ON public.news
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed opening hours
INSERT INTO public.opening_hours (sort_order, day_label, hours_label, is_muted) VALUES
  (1, 'Montag', 'Ruhetag', true),
  (2, 'Dienstag – Donnerstag', '09:00 – 18:00', false),
  (3, 'Freitag', '09:00 – 18:00', false),
  (4, 'Samstag', '09:00 – 17:00', false),
  (5, 'Sonn- & Feiertage', '13:30 – 17:30', false);

-- Seed text settings
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_eyebrow', 'Konditorei · Café · Aichach · seit September 1679'),
  ('hero_title_lead', 'Ein Stück Geschichte.'),
  ('hero_title_accent', 'Frisch serviert.'),
  ('hero_subtitle', 'Hausgemachte Kuchen, feine Pralinen und ein warmes Frühstück – seit über drei Jahrhunderten am Aichacher Stadtplatz, geführt in der 10. Familiengeneration.'),
  ('about_p1', 'Das heutige Café Koch am Aichacher Stadtplatz 17 blickt auf eine lange Geschichte zurück. Bereits 1644 übergab der Bierbrauer Georg Oefele sein im 30-jährigen Krieg verschontes Anwesen an seinen Schwiegersohn – den Ahnherrn der heutigen Besitzer.'),
  ('about_p2', 'September 1679 brachte Anna Maria Schmaus das Haus als Heiratsgut in die Ehe mit Johann Baptist Koch ein – das Geburtsjahr des Café Koch. Heute führen Gerhard Granvogl, Konditor- und Pralinenmeister, und seine Frau Ingrid das Haus in der zehnten Familiengeneration.'),
  ('about_p3', 'Mit dem letzten großen Umbau 1990 erhielt das Café sein heutiges, gemütliches Erscheinungsbild – warm, einladend und mit Platz für rund 100 Gäste inklusive Wintergarten.'),
  ('mittagstisch_price', '13,80 €'),
  ('oeffnungs_hinweis', 'Hinweis: Donnerstag, 14.05.2026, von 13:30 – 17:30 Uhr geöffnet.');

-- Storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

CREATE POLICY "public read site-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "admins upload site-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update site-images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete site-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
