import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum – Café Koch Aichach" },
      { name: "description", content: "Impressum gemäß §5 TMG – Café Koch, Stadtplatz 17, 86551 Aichach." },
    ],
  }),
  component: Impressum,
});

function Impressum() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6">
        <p className="uppercase tracking-[0.3em] text-xs text-accent mb-4">Rechtliches</p>
        <h1 className="font-display text-5xl text-espresso mb-12">Impressum</h1>

        <div className="space-y-10 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-espresso mb-3">Angaben gemäß § 5 TMG</h2>
            <p>
              Café Koch<br />
              Inhaber: Gerhard Granvogl<br />
              Stadtplatz 17<br />
              86551 Aichach
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-espresso mb-3">Kontakt</h2>
            <p>
              Telefon: 08251 / 2580<br />
              Telefax: 08251 / 82998<br />
              E-Mail: info@cafe-koch.de
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-espresso mb-3">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              <span className="font-medium">DE352155747</span> (Cafe-Koch OHG)
            </p>
          </section>


          <section>
            <h2 className="font-display text-2xl text-espresso mb-3">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p>
              Gerhard Granvogl<br />
              Stadtplatz 17<br />
              86551 Aichach
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-espresso mb-3">Haftungsausschluss</h2>
            <p>
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              können wir jedoch keine Gewähr übernehmen. Für Inhalte externer
              Links sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
