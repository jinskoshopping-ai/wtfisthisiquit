import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-espresso text-cream/90 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl text-cream">Café Koch</h3>
          <p className="text-sm mt-1 text-cream/60 uppercase tracking-[0.25em]">
            Konditorei · seit September 1679
          </p>
          <p className="text-sm mt-6 max-w-sm leading-relaxed text-cream/70">
            Ein Aichacher Traditionshaus in 10. Familiengeneration. Hausgemachte
            Kuchen, Torten und Pralinen aus eigener Konditorei.
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-cream mb-4">Kontakt</h4>
          <p className="text-sm leading-relaxed text-cream/70">
            Stadtplatz 17<br />
            86551 Aichach<br />
            Tel. 08251 / 2580<br />
            Fax 08251 / 82998
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-cream mb-4">Öffnungszeiten</h4>
          <ul className="text-sm space-y-1 text-cream/70">
            <li>Mo · Ruhetag</li>
            <li>Di – Do · 09–18 Uhr</li>
            <li>Fr · 09–18 Uhr</li>
            <li>Sa · 09–17 Uhr</li>
            <li>So · 13:30–17:30 Uhr</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} Café Koch · Gerhard Granvogl</p>
          <div className="flex gap-6">
            <Link to="/impressum" className="hover:text-cream transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-cream transition-colors">Datenschutz</Link>
          </div>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-cream transition-colors"><Facebook size={16} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-cream transition-colors"><Instagram size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
