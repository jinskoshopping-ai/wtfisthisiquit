import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone, Mail, Coffee, Cake, Wine, Sparkles, Megaphone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import tortenImg from "@/assets/cafe-torten.png";
import pralinenImg from "@/assets/cafe-pralinen.png";
import barImg from "@/assets/cafe-bar.png";
import storefrontImg from "@/assets/cafe-storefront.png";
import pralinenTablettImg from "@/assets/cafe-pralinen-tablett.png";
import herztorteImg from "@/assets/cafe-herztorte.png";
import marzipanImg from "@/assets/cafe-marzipan-schweinchen.png";
import hochzeitstorteImg from "@/assets/cafe-hochzeitstorte.png";
import beerentorteImg from "@/assets/cafe-beerentorte.png";
import {
  useOpeningHours, useNews, useSiteSettings,
  getSetting, getSettingImage, DEFAULT_OPENING_HOURS,
} from "@/lib/site-data";
const heroImgDefault = tortenImg;


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Café Koch Aichach – Konditorei & Café seit September 1679" },
      {
        name: "description",
        content:
          "Café Koch in Aichach: Traditionshaus seit September 1679 mit hausgemachten Kuchen, Torten und Pralinen. Frühstück, gemütliches Café und Konditorei am Stadtplatz 17.",
      },
      { property: "og:title", content: "Café Koch Aichach – Konditorei seit September 1679" },
      { property: "og:description", content: "Hausgemachte Kuchen, Torten und Pralinen im Aichacher Traditionscafé." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const oeffnungszeiten = [
  { tag: "Montag", zeit: "Ruhetag", muted: true },
  { tag: "Dienstag – Donnerstag", zeit: "09:00 – 18:00" },
  { tag: "Freitag", zeit: "09:00 – 18:00" },
  { tag: "Samstag", zeit: "09:00 – 17:00" },
  { tag: "Sonn- & Feiertage", zeit: "13:30 – 17:30" },
];

const fruehstueck = [
  { name: "Kleines Frühstück", preis: "9,20 €" },
  { name: "Französisches Frühstück", preis: "6,50 €" },
  { name: "Vegetarisches Frühstück", preis: "12,00 €" },
  { name: "Business-Frühstück", preis: "12,20 €" },
  { name: "Schlemmer-Frühstück", preis: "13,20 €" },
  { name: "Fitness-Frühstück", preis: "13,80 €" },
];

const kategorien = [
  { icon: Coffee, title: "Frühstück", text: "Fünf liebevoll komponierte Frühstücksvarianten – ein warmer Start in den Tag." },
  { icon: Cake, title: "Kuchen & Torten", text: "Alle Kuchen und Torten stammen aus eigener Konditorei – Klassiker und Eigenkreationen." },
  { icon: Sparkles, title: "Pralinen", text: "Handgefertigte Pralinen, darunter der berühmte Sisi-Taler. Auch als Geschenk verpackt." },
  { icon: Wine, title: "Whiskyshop", text: "Im Ladengeschäft erwartet Sie ein exquisiter Whiskyshop mit zahlreichen Raritäten." },
];

function Index() {
  const { data: settings } = useSiteSettings();
  const { data: ohData } = useOpeningHours();
  const { data: news } = useNews(false);
  const heroImg = getSettingImage(settings, "hero_image") ?? heroImgDefault;
  const aboutImg = getSettingImage(settings, "about_image") ?? storefrontImg;
  const oeffnungszeitenLive = (ohData && ohData.length > 0 ? ohData : DEFAULT_OPENING_HOURS).map((o) => ({
    tag: o.day_label, zeit: o.hours_label, muted: o.is_muted,
  }));
  const hinweis = getSetting(settings, "oeffnungs_hinweis");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <motion.img
          src={heroImg}

          alt="Café Koch Innenraum mit Kuchen und Torten"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/40 via-espresso/30 to-espresso/70" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-24 md:pb-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-cream/80 uppercase tracking-[0.35em] text-xs md:text-sm mb-6"
          >
            Konditorei · Café · Aichach · seit September 1679
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-cream max-w-4xl leading-[1.05]"
          >
            Ein Stück Geschichte. <em className="text-accent not-italic">Frisch serviert.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="text-cream/85 text-base md:text-lg mt-8 max-w-xl leading-relaxed"
          >
            Hausgemachte Kuchen, feine Pralinen und ein warmes Frühstück –
            seit über drei Jahrhunderten am Aichacher Stadtplatz, geführt in
            der 10. Familiengeneration.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.8 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <a
              href="#speisen"
              className="px-7 py-3.5 rounded-full bg-cream text-espresso text-sm font-medium hover:bg-accent hover:text-cream transition-colors"
            >
              Speisekarte ansehen
            </a>
            <a
              href="#kontakt"
              className="px-7 py-3.5 rounded-full border border-cream/40 text-cream text-sm font-medium hover:bg-cream hover:text-espresso transition-colors"
            >
              Reservierung
            </a>
          </motion.div>
        </div>
      </section>

      {/* ÜBER UNS */}
      <section id="ueber" className="py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img src={aboutImg} alt="Café Koch Eingang am Stadtplatz Aichach" className="w-full h-full object-cover" loading="lazy" />

              <div className="absolute -bottom-6 -right-6 bg-accent text-cream px-6 py-5 rounded-xl shadow-lg">
                <div className="font-display text-3xl leading-none">10.</div>
                <div className="text-[11px] uppercase tracking-[0.2em] mt-1">Generation</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="uppercase tracking-[0.3em] text-xs text-accent mb-5">Über uns</p>
            <h2 className="font-display text-4xl md:text-5xl text-espresso leading-tight">
              Ein Traditionshaus seit <em className="not-italic text-accent">September 1679</em>.
            </h2>
            <div className="mt-8 space-y-5 text-foreground/75 leading-relaxed">
              <p>
                Das heutige Café Koch am Aichacher Stadtplatz 17 blickt auf eine
                lange Geschichte zurück. Bereits 1644 übergab der Bierbrauer
                Georg Oefele sein im 30‑jährigen Krieg verschontes Anwesen an
                seinen Schwiegersohn – den Ahnherrn der heutigen Besitzer.
              </p>
              <p>
                September 1679 brachte Anna Maria Schmaus das Haus als Heiratsgut in die
                Ehe mit Johann Baptist Koch ein – das Geburtsjahr des Café Koch.
                Heute führen Gerhard Granvogl, Konditor- und Pralinenmeister,
                und seine Frau Ingrid das Haus in der zehnten Familiengeneration.
              </p>
              <p>
                Mit dem letzten großen Umbau 1990 erhielt das Café sein heutiges,
                gemütliches Erscheinungsbild – warm, einladend und mit Platz für
                rund 100 Gäste inklusive Wintergarten.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* KATEGORIEN */}
      <section className="py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="uppercase tracking-[0.3em] text-xs text-accent mb-4">Unsere Spezialitäten</p>
              <h2 className="font-display text-4xl md:text-5xl text-espresso">Aus eigener Konditorei</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kategorien.map((k, i) => (
              <Reveal key={k.title} delay={i * 0.08}>
                <div className="group h-full bg-card border border-border/60 rounded-2xl p-8 hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-cream transition-colors">
                    <k.icon size={20} />
                  </div>
                  <h3 className="font-display text-2xl text-espresso mt-6">{k.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed mt-3">{k.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SPEISEN */}
      <section id="speisen" className="py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="uppercase tracking-[0.3em] text-xs text-accent mb-4">Speisekarte</p>
              <h2 className="font-display text-4xl md:text-5xl text-espresso">Frühstück mit Vielfalt</h2>
              <p className="text-foreground/70 mt-5 leading-relaxed">
                Fünf liebevoll zusammengestellte Frühstücksvariationen – für jeden
                Geschmack das Richtige. Alle Preise pro Person.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
              <ul className="divide-y divide-border">
                {fruehstueck.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-6 py-5">
                    <span className="font-display text-xl md:text-2xl text-espresso">{item.name}</span>
                    <span className="flex-1 border-b border-dotted border-border/80 translate-y-[-4px]" />
                    <span className="font-medium text-foreground tabular-nums">{item.preis}</span>
                  </li>
                ))}
              </ul>
              <p className="text-center text-xs text-muted-foreground mt-10 italic">
                Zusätzlich finden Sie täglich wechselnde Kuchen, Torten und kleine
                Snacks in unserem Café – fragen Sie gerne unser Servicepersonal.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MITTAGSTISCH */}
      <section id="mittagstisch" className="py-20 bg-secondary/40">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="uppercase tracking-[0.3em] text-xs text-accent mb-4">Tagesempfehlung</p>
              <h2 className="font-display text-4xl md:text-5xl text-espresso">Mittagstisch</h2>
              <p className="text-foreground/70 mt-5 leading-relaxed">
                Täglich wechselnde, hausgemachte Gerichte – frisch zubereitet und herzhaft.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm max-w-xl mx-auto">
              <div className="flex items-baseline justify-between gap-6 py-5">
                <span className="font-display text-xl md:text-2xl text-espresso">Tagesmenü</span>
                <span className="flex-1 border-b border-dotted border-border/80 translate-y-[-4px]" />
                <span className="font-medium text-foreground tabular-nums">13,80 €</span>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-10 italic">
                Bitte erfragen Sie das aktuelle Tagesangebot bei unserem Servicepersonal.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GALERIE */}
      <section id="galerie" className="py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="uppercase tracking-[0.3em] text-xs text-accent mb-4">Galerie</p>
              <h2 className="font-display text-4xl md:text-5xl text-espresso">Einblicke in unser Haus</h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { src: tortenImg, alt: "Hausgemachte Torten" },
              { src: pralinenImg, alt: "Pralinenauswahl im Ladengeschäft" },
              { src: barImg, alt: "Café Koch Bar" },
              { src: pralinenTablettImg, alt: "Hausgemachte Pralinen auf dem Tablett" },
              { src: herztorteImg, alt: "Herztorte mit rosa Buttercreme" },
              { src: hochzeitstorteImg, alt: "Mehrstöckige Hochzeitstorte" },
              { src: marzipanImg, alt: "Marzipan-Glücksschweinchen" },
              { src: beerentorteImg, alt: "Number-Cake mit frischen Beeren" },
            ].map((img, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="group overflow-hidden rounded-2xl aspect-[4/5]">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AKTUELLES */}
      {news && news.length > 0 && (
        <section id="aktuelles" className="py-16 bg-accent/5">
          <div className="max-w-4xl mx-auto px-6">
            <Reveal>
              <div className="text-center mb-10">
                <p className="uppercase tracking-[0.3em] text-xs text-accent mb-4">Aktuelles</p>
                <h2 className="font-display text-3xl md:text-4xl text-espresso">Neuigkeiten aus dem Café</h2>
              </div>
            </Reveal>
            <div className="space-y-4">
              {news.map((n) => (
                <Reveal key={n.id}>
                  <div className="bg-card border border-border rounded-2xl p-6 flex gap-4">
                    <Megaphone className="text-accent flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h3 className="font-display text-xl text-espresso">{n.title}</h3>
                      {n.body && <p className="text-sm text-foreground/75 leading-relaxed mt-2 whitespace-pre-wrap">{n.body}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ÖFFNUNGSZEITEN */}
      <section id="oeffnungszeiten" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <p className="uppercase tracking-[0.3em] text-xs text-accent mb-4">Öffnungszeiten</p>
              <h2 className="font-display text-4xl md:text-5xl text-espresso">Wann wir für Sie da sind</h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              <ul>
                {oeffnungszeitenLive.map((d, i) => (
                  <li
                    key={d.tag}
                    className={`flex items-center justify-between gap-4 px-8 py-5 ${
                      i !== oeffnungszeitenLive.length - 1 ? "border-b border-border" : ""
                    } ${d.muted ? "bg-secondary/40" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <Clock size={16} className="text-accent" />
                      <span className="font-medium text-espresso">{d.tag}</span>
                    </div>
                    <span className={d.muted ? "text-muted-foreground italic" : "text-foreground tabular-nums"}>
                      {d.zeit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {hinweis && (
              <p className="text-center text-sm text-muted-foreground mt-6 italic">{hinweis}</p>
            )}
          </Reveal>
        </div>
      </section>


      {/* KONTAKT */}
      <section id="kontakt" className="py-24 md:py-32 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          <Reveal>
            <p className="uppercase tracking-[0.3em] text-xs text-accent mb-4">Kontakt</p>
            <h2 className="font-display text-4xl md:text-5xl text-espresso leading-tight">
              Besuchen Sie uns am Stadtplatz.
            </h2>
            <p className="mt-6 text-foreground/75 leading-relaxed max-w-md">
              Wir freuen uns auf Ihren Besuch. Für Gruppen, Reisebusse oder
              besondere Anlässe bitten wir um rechtzeitige Reservierung.
            </p>

            <div className="mt-10 space-y-5">
              <ContactRow icon={MapPin} title="Adresse" lines={["Café Koch", "Stadtplatz 17", "86551 Aichach"]} />
              <ContactRow icon={Phone} title="Telefon" lines={["08251 / 2580"]} href="tel:+4982512580" />
              <ContactRow icon={Mail} title="E-Mail" lines={["info@cafe-koch.de"]} href="mailto:info@cafe-koch.de" />
            </div>

            <a
              href="tel:+4982512580"
              className="inline-flex mt-10 px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-accent transition-colors"
            >
              Jetzt reservieren
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl overflow-hidden border border-border shadow-sm aspect-[4/5] md:aspect-auto md:h-[560px]">
              <iframe
                title="Café Koch auf Google Maps"
                src="https://www.google.com/maps?q=Stadtplatz+17,+86551+Aichach&output=embed"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactRow({
  icon: Icon,
  title,
  lines,
  href,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  lines: string[];
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
        <div className="mt-1 text-espresso leading-relaxed">
          {lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:opacity-80 transition-opacity">
      {content}
    </a>
  ) : (
    content
  );
}
