import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  EDITABLE_KEYS,
  useOpeningHours,
  useNews,
  useSiteSettings,
  type NewsItem,
  type OpeningHour,
} from "@/lib/site-data";
import { Loader2, LogOut, Plus, Trash2, Save, Upload, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Adminbereich – Café Koch" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const ADMIN_EMAIL = "info@cafe-koch.de";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        checkAdmin(s.user.id, s.user.email);
      } else {
        setIsAdmin(null);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) checkAdmin(data.session.user.id, data.session.user.email);
      else setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkAdmin(userId: string, email?: string) {
    setLoading(true);
    const normalizedEmail = email?.trim().toLowerCase();
    let { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!data && normalizedEmail === ADMIN_EMAIL) {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      const result = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      data = result.data;
    }

    setIsAdmin(!!data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center bg-card border border-border rounded-2xl p-8">
          <h1 className="font-display text-2xl text-espresso">Kein Zugriff</h1>
          <p className="text-sm text-foreground/70 mt-3">
            Dieser Account hat keine Admin-Berechtigung. Nur <strong>{ADMIN_EMAIL}</strong> kann Inhalte bearbeiten.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-6 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm"
          >
            Abmelden
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard email={session.user.email ?? ""} />;
}

// -- Auth screen ------------------------------------------------------------
function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setMsg(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        setMsg("Konto erstellt. Du kannst dich jetzt anmelden.");
        setMode("login");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-sm p-8">
        <p className="uppercase tracking-[0.3em] text-xs text-accent">Café Koch</p>
        <h1 className="font-display text-3xl text-espresso mt-2">Adminbereich</h1>
        <p className="text-sm text-foreground/70 mt-2">
          {mode === "login" ? "Bitte melde dich an, um Inhalte zu bearbeiten." : "Erstelle dein Admin-Konto. Nur die Adresse "}
          {mode === "signup" && <strong>{ADMIN_EMAIL}</strong>}
          {mode === "signup" && " erhält automatisch Admin-Rechte."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="E-Mail">
            <input
              type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </Field>
          <Field label="Passwort">
            <input
              type="password" required minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </Field>

          {err && <p className="text-sm text-destructive">{err}</p>}
          {msg && <p className="text-sm text-accent">{msg}</p>}

          <button
            type="submit" disabled={busy}
            className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-60"
          >
            {busy ? "Bitte warten…" : mode === "login" ? "Anmelden" : "Konto erstellen"}
          </button>
        </form>

        <button
          onClick={() => { setErr(null); setMsg(null); setMode(mode === "login" ? "signup" : "login"); }}
          className="mt-4 text-xs text-foreground/60 hover:text-accent w-full text-center"
        >
          {mode === "login" ? "Noch kein Konto? Konto anlegen" : "Bereits ein Konto? Anmelden"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-foreground/60 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

// -- Dashboard --------------------------------------------------------------
type Tab = "texte" | "oeffnungszeiten" | "aktuelles" | "bilder";

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("aktuelles");

  const tabs: { id: Tab; label: string }[] = [
    { id: "aktuelles", label: "Aktuelles" },
    { id: "oeffnungszeiten", label: "Öffnungszeiten" },
    { id: "texte", label: "Texte" },
    { id: "bilder", label: "Bilder" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Café Koch · Admin</p>
            <h1 className="font-display text-xl text-espresso leading-none mt-1">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-foreground/60">{email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border text-xs hover:bg-secondary transition-colors"
            >
              <LogOut size={14} /> Abmelden
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-3 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 pb-20">
        {tab === "aktuelles" && <NewsEditor />}
        {tab === "oeffnungszeiten" && <OpeningHoursEditor />}
        {tab === "texte" && <TextsEditor />}
        {tab === "bilder" && <ImagesEditor />}
      </main>
    </div>
  );
}

// -- News editor ------------------------------------------------------------
function NewsEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useNews(true);
  const [draft, setDraft] = useState<Partial<NewsItem>>({ title: "", body: "", published: true });
  const [busy, setBusy] = useState(false);

  async function create() {
    if (!draft.title?.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("news").insert({
      title: draft.title, body: draft.body ?? "", published: draft.published ?? true,
    });
    setBusy(false);
    if (!error) {
      setDraft({ title: "", body: "", published: true });
      qc.invalidateQueries({ queryKey: ["news"] });
    } else alert(error.message);
  }
  async function update(item: NewsItem, patch: Partial<NewsItem>) {
    const { error } = await supabase.from("news").update(patch).eq("id", item.id);
    if (error) alert(error.message);
    qc.invalidateQueries({ queryKey: ["news"] });
  }
  async function remove(id: string) {
    if (!confirm("Diesen Eintrag wirklich löschen?")) return;
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) alert(error.message);
    qc.invalidateQueries({ queryKey: ["news"] });
  }

  return (
    <div className="space-y-6">
      <Card title="Neuen Hinweis hinzufügen" description="Z. B. Sonderöffnungszeiten zu Ostern, Weihnachten oder Betriebsurlaub.">
        <div className="space-y-3">
          <Field label="Titel">
            <input
              value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="z. B. Geänderte Öffnungszeiten zu Ostern"
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
            />
          </Field>
          <Field label="Text">
            <textarea
              rows={3} value={draft.body ?? ""} onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              placeholder="Details, z. B. „Am 31.03. von 10–14 Uhr geöffnet."
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.published ?? true}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
            Sofort auf der Webseite veröffentlichen
          </label>
          <button
            onClick={create} disabled={busy || !draft.title?.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm disabled:opacity-60"
          >
            <Plus size={16} /> Hinzufügen
          </button>
        </div>
      </Card>

      <Card title="Bestehende Einträge">
        {isLoading && <p className="text-sm text-foreground/60">Lade…</p>}
        {data && data.length === 0 && <p className="text-sm text-foreground/60">Noch keine Einträge.</p>}
        <ul className="space-y-3">
          {data?.map((n) => (
            <li key={n.id} className="border border-border rounded-xl p-4">
              <input
                value={n.title}
                onBlur={(e) => e.target.value !== n.title && update(n, { title: e.target.value })}
                onChange={(e) => (n.title = e.target.value)}
                className="w-full bg-transparent font-medium text-espresso outline-none"
              />
              <textarea
                rows={2} defaultValue={n.body}
                onBlur={(e) => e.target.value !== n.body && update(n, { body: e.target.value })}
                className="w-full bg-transparent text-sm text-foreground/80 mt-2 outline-none resize-none"
              />
              <div className="flex items-center justify-between gap-3 mt-3">
                <label className="flex items-center gap-2 text-xs text-foreground/70">
                  <input type="checkbox" defaultChecked={n.published}
                    onChange={(e) => update(n, { published: e.target.checked })} />
                  veröffentlicht
                </label>
                <button onClick={() => remove(n.id)}
                  className="inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                  <Trash2 size={13} /> Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// -- Opening hours editor ---------------------------------------------------
function OpeningHoursEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useOpeningHours();

  async function update(row: OpeningHour, patch: Partial<OpeningHour>) {
    const { error } = await supabase.from("opening_hours").update(patch).eq("id", row.id);
    if (error) alert(error.message);
    qc.invalidateQueries({ queryKey: ["opening_hours"] });
  }

  return (
    <Card title="Reguläre Öffnungszeiten" description="Diese Tabelle wird direkt auf der Webseite angezeigt.">
      {isLoading && <p className="text-sm text-foreground/60">Lade…</p>}
      <ul className="space-y-2">
        {data?.map((r) => (
          <li key={r.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center border border-border rounded-xl p-3">
            <input defaultValue={r.day_label}
              onBlur={(e) => e.target.value !== r.day_label && update(r, { day_label: e.target.value })}
              className="bg-transparent px-2 py-1.5 text-sm rounded border border-transparent focus:border-border outline-none" />
            <input defaultValue={r.hours_label}
              onBlur={(e) => e.target.value !== r.hours_label && update(r, { hours_label: e.target.value })}
              className="bg-transparent px-2 py-1.5 text-sm rounded border border-transparent focus:border-border outline-none" />
            <label className="text-xs text-foreground/60 flex items-center gap-1.5 sm:justify-end">
              <input type="checkbox" defaultChecked={r.is_muted}
                onChange={(e) => update(r, { is_muted: e.target.checked })} />
              Ruhetag-Stil
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// -- Texts editor -----------------------------------------------------------
function TextsEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useSiteSettings();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function save(key: string) {
    setSavingKey(key);
    const value = drafts[key] ?? "";
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    setSavingKey(null);
    if (error) alert(error.message);
    else {
      setDrafts((d) => { const c = { ...d }; delete c[key]; return c; });
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    }
  }

  return (
    <Card title="Texte bearbeiten" description="Änderungen erscheinen sofort live auf der Webseite.">
      {isLoading && <p className="text-sm text-foreground/60">Lade…</p>}
      <div className="space-y-4">
        {EDITABLE_KEYS.map(({ key, label, multiline }) => {
          const current = data?.[key]?.value ?? "";
          const value = drafts[key] ?? current;
          const dirty = drafts[key] !== undefined && drafts[key] !== current;
          return (
            <div key={key}>
              <Field label={label}>
                {multiline ? (
                  <textarea
                    rows={3} value={value}
                    onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                  />
                ) : (
                  <input
                    value={value}
                    onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                  />
                )}
              </Field>
              {dirty && (
                <button onClick={() => save(key)} disabled={savingKey === key}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs">
                  <Save size={12} /> {savingKey === key ? "Speichere…" : "Speichern"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// -- Images editor ----------------------------------------------------------
const IMAGE_SLOTS = [
  { key: "hero_image", label: "Hero-Bild (Startseite oben)" },
  { key: "about_image", label: "Bild im Bereich \u201eÜber uns\u201c" },
];

function ImagesEditor() {
  const qc = useQueryClient();
  const { data } = useSiteSettings();
  const [busy, setBusy] = useState<string | null>(null);

  async function upload(key: string, file: File) {
    setBusy(key);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${key}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("site-images").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("site-images").getPublicUrl(path);
      const { error: sErr } = await supabase
        .from("site_settings")
        .upsert({ key, image_url: pub.publicUrl, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (sErr) throw sErr;
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Fehler beim Hochladen");
    } finally { setBusy(null); }
  }

  async function clearImage(key: string) {
    if (!confirm("Bild entfernen und Standardbild verwenden?")) return;
    const { error } = await supabase.from("site_settings")
      .upsert({ key, image_url: null, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) alert(error.message);
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  }

  return (
    <Card title="Bilder austauschen" description="Lade ein neues Bild hoch – es ersetzt das Standardbild auf der Webseite.">
      <div className="space-y-5">
        {IMAGE_SLOTS.map((slot) => {
          const url = data?.[slot.key]?.image_url ?? null;
          return (
            <div key={slot.key} className="border border-border rounded-xl p-4">
              <p className="text-sm font-medium text-espresso">{slot.label}</p>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-40 h-28 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                  {url ? (
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-muted-foreground" size={28} />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm cursor-pointer">
                    <Upload size={14} />
                    {busy === slot.key ? "Lade hoch…" : url ? "Ersetzen" : "Hochladen"}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && upload(slot.key, e.target.files[0])} />
                  </label>
                  {url && (
                    <button onClick={() => clearImage(slot.key)}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-border text-sm text-foreground/70">
                      <Trash2 size={14} /> Entfernen
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-5 sm:p-6">
      <h2 className="font-display text-xl text-espresso">{title}</h2>
      {description && <p className="text-sm text-foreground/65 mt-1">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
