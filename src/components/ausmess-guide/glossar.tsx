// 6 Grundbegriffe — angelehnt an fensterblick.de Glossar-Struktur
// (siehe specs/konfigurator-ux-research.md §Seite 5).

const TERMS: Array<{ term: string; definition: string }> = [
  {
    term: "Aufmaß",
    definition:
      "Der komplette Messvorgang: Breite, Höhe und ggf. Tiefe der Maueröffnung bzw. des bestehenden Fensters aufnehmen.",
  },
  {
    term: "Rohbaumaß",
    definition:
      "Die lichte Maueröffnung (Breite × Höhe), bevor Fensterbank und Einbauluft abgezogen werden. Ausgangspunkt der Bestellmaß-Rechnung.",
  },
  {
    term: "Bestellmaß",
    definition:
      "Das fertige Fenstermaß, wie es gefertigt wird. Ergibt sich aus Rohbaumaß minus Einbauluft minus ggf. Fensterbank und Rollladenkasten.",
  },
  {
    term: "Einbauluft",
    definition:
      "Montagespalt zwischen Fensterrahmen und Mauerwerk, läuft umlaufend. Pro Seite 10–25 mm je nach Größe und Farbe. Wichtig für Ausrichten und Dichtung.",
  },
  {
    term: "Gesamtmaß",
    definition:
      "Maße des Fenster-Elements inklusive aller Anbauteile wie Rahmenverbreiterung, Aufsatzrollladen und Fensterbank-Anschlussprofil.",
  },
  {
    term: "Öffnungsrichtung",
    definition:
      "Bezeichnet, in welche Richtung der Flügel öffnet — immer aus Perspektive von innen auf das Fenster blickend. Die Dreieck-Spitze im Schema zeigt auf die Drehachse.",
  },
];

export function Glossar() {
  return (
    <dl className="grid gap-5 sm:grid-cols-2">
      {TERMS.map((t) => (
        <div
          key={t.term}
          className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm"
        >
          <dt
            className="text-base font-bold text-[var(--brand-heading)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.term}
          </dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-[var(--brand-text)]">
            {t.definition}
          </dd>
        </div>
      ))}
    </dl>
  );
}
