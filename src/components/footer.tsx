import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

const navLinks = [
  { label: "Fenster-Systeme", href: "/#fenster-systeme" },
  { label: "Dienstleistungen", href: "/dienstleistungen" },
  { label: "Konfigurator", href: "/#konfigurator" },
  { label: "Anfrage", href: "/anfrage" },
];

const legalLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Widerrufsrecht", href: "/widerrufsrecht" },
  { label: "AGB", href: "/agb" },
  { label: "Zahlung und Versand", href: "/zahlung-und-versand" },
  { label: "Lieferzeiten", href: "/lieferzeiten" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--brand-darker)] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Brand Name */}
        <div className="mb-12">
          <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Passende-Fenster.de
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/60">
            Fenster und Türen für jeden Geschmack — Beratung, Konfiguration und
            Montage aus einer Hand.
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* Column 1: Company Info */}
          <div>
            <h3 className="mb-5 font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest text-white/40">
              Kontakt
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <span className="flex items-start gap-3 text-white/80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
                  <span>
                    Vor der Seelhorst 82c
                    <br />
                    30519 Hannover
                  </span>
                </span>
              </li>
              <li>
                <a
                  href="tel:015116804054"
                  className="flex items-center gap-3 text-white/80 transition-colors hover:text-[var(--brand-primary)]"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
                  0151 16804054
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@passende-fenster.de"
                  className="flex items-center gap-3 text-white/80 transition-colors hover:text-[var(--brand-primary)]"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
                  info@passende-fenster.de
                </a>
              </li>
              <li className="pt-2">
                <span className="text-xs text-white/40">
                  Inhaber: Alexander Azov
                </span>
              </li>
              <li>
                <a
                  href="https://azovbau.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-[var(--brand-primary)]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    Baudienstleistungen: azovbau.de
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="mb-5 font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest text-white/40">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-[var(--brand-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="mb-5 font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest text-white/40">
              Rechtliches
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-[var(--brand-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/40 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Passende-Fenster.de — Alle Rechte vorbehalten</p>
          <p>FairCommerce Mitglied seit 2019</p>
        </div>
      </div>
    </footer>
  );
}
