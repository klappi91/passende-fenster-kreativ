import type { Metadata } from "next";
import Link from "next/link";
import { MiniRechner } from "@/components/ausmess-guide/mini-rechner";
import {
  GuideContent,
  GuideTOC,
} from "@/components/ausmess-guide/guide-content";

export const metadata: Metadata = {
  title:
    "Fenster ausmessen — Schritt-für-Schritt-Anleitung für Altbau & Neubau | Passende-Fenster",
  description:
    "Fenster richtig ausmessen. Rohbaumaß → Bestellmaß umrechnen mit unserem interaktiven Rechner. Einbauluft-Tabelle, Glossar, Altbau- und Neubau-Anleitung.",
  keywords: [
    "Fenster ausmessen",
    "Rohbaumaß",
    "Bestellmaß",
    "Fenster richtig messen",
    "Einbauluft",
    "Fenster Altbau",
    "Fenster Neubau",
  ],
  openGraph: {
    title: "Fenster ausmessen — einfache Anleitung",
    description:
      "Rohbaumaß → Bestellmaß mit interaktivem Rechner. Alles über Einbauluft, Rollladen und Fensterbank.",
    type: "article",
    locale: "de_DE",
  },
  alternates: {
    canonical: "/fenster-ausmessen",
  },
};

// Schema.org HowTo markup für SEO
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Fenster ausmessen — Rohbaumaß zu Bestellmaß",
  description:
    "Schritt-für-Schritt-Anleitung zum korrekten Ausmessen von Fenstern in Altbau und Neubau.",
  step: [
    {
      "@type": "HowToStep",
      name: "Vorbereitung",
      text: "Zollstock oder Metermaß (mind. 2 m), Papier und Stift bereitlegen. Skizze des Fensters mit Öffnungsrichtung zeichnen.",
    },
    {
      "@type": "HowToStep",
      name: "Breite messen",
      text: "Breite an mindestens zwei Stellen messen (oben und unten). Den kleineren Wert notieren.",
    },
    {
      "@type": "HowToStep",
      name: "Höhe messen",
      text: "Höhe an mindestens zwei Stellen messen (links und rechts). Den kleineren Wert notieren.",
    },
    {
      "@type": "HowToStep",
      name: "Einbauluft abziehen",
      text: "Je nach Fenstergröße und Farbe 10–25 mm pro Seite abziehen (also 2× pro Achse).",
    },
    {
      "@type": "HowToStep",
      name: "Sonderfälle berücksichtigen",
      text: "Fensterbank-Anschlussprofil und Rollladen-Aufsatzkasten ggf. von der Höhe abziehen.",
    },
  ],
};

export default function FensterAusmessenPage() {
  return (
    <main id="main" className="min-h-screen bg-[var(--konfig-canvas)] pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient opacity-95" />
        <div
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white opacity-10"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white opacity-10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center text-white sm:px-10 sm:py-24">
          <p className="heading-price-label text-white/80">Anleitung</p>
          <h1
            className="mt-2 text-balance text-4xl font-bold sm:text-5xl md:text-6xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Fenster ausmessen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            So bestimmst du in wenigen Minuten das korrekte Bestellmaß für dein
            Fenster — für Altbau und Neubau.
          </p>
        </div>
      </header>

      {/* Main content with TOC sidebar */}
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 sm:py-16">
        {/* Mini-Rechner first — above the fold */}
        <section id="mini-rechner" className="mb-16">
          <MiniRechner />
        </section>

        {/* Two-column: TOC + content */}
        <div className="grid gap-10 lg:grid-cols-[200px_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <GuideTOC />
          </div>
          <article>
            <GuideContent />
          </article>
        </div>

        {/* Related */}
        <div className="mt-16 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[var(--border)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="heading-price-label">Weiterlesen</p>
            <h3
              className="mt-1 text-lg font-bold text-[var(--brand-heading)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Profile im Vergleich
            </h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              6 PVC-Profile mit transparentem Preis — Salamander, Aluplast, Gealan.
            </p>
          </div>
          <Link
            href="/konfigurator"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--brand-primary)] transition hover:bg-[var(--brand-primary)]/5"
          >
            Konfigurator öffnen →
          </Link>
        </div>
      </div>
    </main>
  );
}
