import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#ueber", label: "Über uns" },
  { href: "#speisen", label: "Speisen" },
  { href: "#mittagstisch", label: "Mittagstisch" },
  { href: "#galerie", label: "Galerie" },
  { href: "#oeffnungszeiten", label: "Öffnungszeiten" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl tracking-wide text-espresso">Café Koch</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
            seit September 1679 · Aichach
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-foreground/80 hover:text-accent transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            className="text-sm px-5 py-2 rounded-full bg-primary text-primary-foreground hover:bg-accent transition-colors"
          >
            Reservieren
          </a>
        </nav>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border mt-3">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base text-foreground/80"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#kontakt"
              onClick={() => setOpen(false)}
              className="text-sm text-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground"
            >
              Reservieren
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
