import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dienstleistungen – Passende-Fenster.de",
  description:
    "Professionelle Montage von Fenstern, Türen, Rollläden und Raffstores. Preisliste für alle Dienstleistungen.",
};

const services = [
  {
    category: "Montage",
    items: [
      {
        name: "Fenster Montage Neubau (Fassade)",
        includes: "Schrauben und Schaum",
        calculation: "Je Lfm. oder pro Stunde",
        price: "30 bzw. 35 EUR",
      },
      {
        name: "Fenster-Montage (Verblender/Klinker)",
        includes: "Schrauben, Konsole und Schaum",
        calculation: "Je Lfm. oder pro Stunde",
        price: "37 bzw. 40 EUR",
      },
      {
        name: "Aufbaurollladen Montage",
        includes: "Bis 2M pro Stück",
        calculation: "Ab 2M Breite Preis anfragen",
        price: "40 EUR",
      },
      {
        name: "Aufsatzrollladen Montage",
        includes: "Bis 2M pro Stück",
        calculation: "Ab 2M Breite Preis anfragen",
        price: "50 EUR",
      },
      {
        name: "Raffstore Montage",
        includes: "Bis 2M pro Stück",
        calculation: "Ab 2M Breite Preis anfragen",
        price: "80 EUR",
      },
      {
        name: "Schiebetür Montage",
        includes: "",
        calculation: "Pauschal oder pro Stunde",
        price: "Pauschal bzw. 35 EUR",
      },
      {
        name: "Eingangstür Montage",
        includes: "",
        calculation: "Pauschal oder pro Stunde",
        price: "Pauschal bzw. 35 EUR",
      },
    ],
  },
  {
    category: "Material & Abdichtung",
    items: [
      {
        name: "Fensterband (Dichtband)",
        includes: "Innen und Außen",
        calculation: "Je Lfm.",
        price: "6 EUR",
      },
      {
        name: "Silikon",
        includes: "Weiß/Transparent",
        calculation: "Je Lfm.",
        price: "5 EUR",
      },
      {
        name: "Leisten (Weiß)",
        includes: "20/30/40/50/60",
        calculation: "Je Lfm.",
        price: "4 EUR",
      },
      {
        name: "Leisten (Wunschfarbe)",
        includes: "",
        calculation: "",
        price: "Preis auf Anfrage",
      },
      {
        name: "Kompriband/Fugendichtband",
        includes: "10/2 oder 10/3",
        calculation: "Je Lfm.",
        price: "4 EUR",
      },
      {
        name: "Terrassentür/Eingangstür Abdichten",
        includes: "EPDM Folie 250mm",
        calculation: "Je Lfm.",
        price: "20 EUR",
      },
    ],
  },
  {
    category: "Sonstige Leistungen",
    items: [
      {
        name: "Fenster Demontage",
        includes: "",
        calculation: "Je Lfm.",
        price: "10 EUR",
      },
      {
        name: "Entsorgung",
        includes: "",
        calculation: "",
        price: "Pauschal",
      },
      {
        name: "Fenster abladen und sortieren",
        includes: "",
        calculation: "Pro Stunde",
        price: "30 EUR",
      },
      {
        name: "Fahrtkosten ab 50km",
        includes: "Ab 50km",
        calculation: "Für jede Fahrt",
        price: "65 EUR",
      },
      {
        name: "Fenster Aufmaß",
        includes: "",
        calculation: "Pro Stunde",
        price: "35 EUR",
      },
    ],
  },
];

export default function DienstleistungenPage() {
  return (
    <main className="pt-28 pb-20">
      {/* Hero area */}
      <section className="bg-[var(--brand-darker)] text-white py-16 mb-16">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="heading-section text-white mb-4">
            Dienstleistungen
          </h1>
          <p className="text-xl text-white/70 max-w-2xl">
            Professionelle Montage von Fenstern, Türen, Rollläden und
            Raffstores — alles aus einer Hand.
          </p>
          <p className="mt-4 text-sm text-white/50">Preisliste 2022 — Alle Preise zzgl. MwSt.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        {services.map((group) => (
          <div key={group.category} className="mb-16">
            <h2
              className="heading-sub mb-8 pb-4 border-b-2"
              style={{ borderColor: "var(--brand-primary)" }}
            >
              {group.category}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="group rounded-xl border border-[var(--border)] p-6 transition-all hover:shadow-lg hover:border-[var(--brand-primary)]/30"
                >
                  <h3 className="font-display font-semibold text-lg mb-3 text-[var(--brand-heading)]">
                    {item.name}
                  </h3>
                  {item.includes && (
                    <p className="text-sm text-[var(--muted-foreground)] mb-1">
                      Inkl. {item.includes}
                    </p>
                  )}
                  {item.calculation && (
                    <p className="text-sm text-[var(--muted-foreground)] mb-3">
                      {item.calculation}
                    </p>
                  )}
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <Link
            href="/anfrage"
            className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Jetzt Anfrage senden
          </Link>
        </div>
      </div>
    </main>
  );
}
