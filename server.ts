import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OpeningHour = {
  id: string;
  sort_order: number;
  day_label: string;
  hours_label: string;
  is_muted: boolean;
};

export type NewsItem = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  starts_on: string | null;
  ends_on: string | null;
  created_at: string;
};

export type SiteSetting = {
  key: string;
  value: string | null;
  image_url: string | null;
};

export const DEFAULT_OPENING_HOURS: Omit<OpeningHour, "id">[] = [
  { sort_order: 1, day_label: "Montag", hours_label: "Ruhetag", is_muted: true },
  { sort_order: 2, day_label: "Dienstag – Donnerstag", hours_label: "09:00 – 18:00", is_muted: false },
  { sort_order: 3, day_label: "Freitag", hours_label: "09:00 – 18:00", is_muted: false },
  { sort_order: 4, day_label: "Samstag", hours_label: "09:00 – 17:00", is_muted: false },
  { sort_order: 5, day_label: "Sonn- & Feiertage", hours_label: "13:30 – 17:30", is_muted: false },
];

export const DEFAULT_SETTINGS: Record<string, string> = {
  hero_eyebrow: "Konditorei · Café · Aichach · seit September 1679",
  hero_title_lead: "Ein Stück Geschichte.",
  hero_title_accent: "Frisch serviert.",
  hero_subtitle:
    "Hausgemachte Kuchen, feine Pralinen und ein warmes Frühstück – seit über drei Jahrhunderten am Aichacher Stadtplatz, geführt in der 10. Familiengeneration.",
  about_p1:
    "Das heutige Café Koch am Aichacher Stadtplatz 17 blickt auf eine lange Geschichte zurück. Bereits 1644 übergab der Bierbrauer Georg Oefele sein im 30-jährigen Krieg verschontes Anwesen an seinen Schwiegersohn – den Ahnherrn der heutigen Besitzer.",
  about_p2:
    "September 1679 brachte Anna Maria Schmaus das Haus als Heiratsgut in die Ehe mit Johann Baptist Koch ein – das Geburtsjahr des Café Koch. Heute führen Gerhard Granvogl, Konditor- und Pralinenmeister, und seine Frau Ingrid das Haus in der zehnten Familiengeneration.",
  about_p3:
    "Mit dem letzten großen Umbau 1990 erhielt das Café sein heutiges, gemütliches Erscheinungsbild – warm, einladend und mit Platz für rund 100 Gäste inklusive Wintergarten.",
  mittagstisch_price: "13,80 €",
  oeffnungs_hinweis: "",
};

export const EDITABLE_KEYS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "hero_eyebrow", label: "Hero – Eyebrow" },
  { key: "hero_title_lead", label: "Hero – Überschrift (1. Teil)" },
  { key: "hero_title_accent", label: "Hero – Überschrift (Akzent)" },
  { key: "hero_subtitle", label: "Hero – Untertitel", multiline: true },
  { key: "about_p1", label: "Über uns – Absatz 1", multiline: true },
  { key: "about_p2", label: "Über uns – Absatz 2", multiline: true },
  { key: "about_p3", label: "Über uns – Absatz 3", multiline: true },
  { key: "mittagstisch_price", label: "Mittagstisch – Preis" },
  { key: "oeffnungs_hinweis", label: "Hinweis bei Öffnungszeiten", multiline: true },
];

export function useOpeningHours() {
  return useQuery({
    queryKey: ["opening_hours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opening_hours")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as OpeningHour[];
    },
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      const map: Record<string, SiteSetting> = {};
      (data as SiteSetting[]).forEach((s) => (map[s.key] = s));
      return map;
    },
  });
}

export function useNews(includeUnpublished = false) {
  return useQuery({
    queryKey: ["news", includeUnpublished],
    queryFn: async () => {
      let q = supabase.from("news").select("*").order("created_at", { ascending: false });
      if (!includeUnpublished) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return data as NewsItem[];
    },
  });
}

export function getSetting(
  map: Record<string, SiteSetting> | undefined,
  key: string,
): string {
  return map?.[key]?.value ?? DEFAULT_SETTINGS[key] ?? "";
}

export function getSettingImage(
  map: Record<string, SiteSetting> | undefined,
  key: string,
): string | null {
  return map?.[key]?.image_url ?? null;
}
