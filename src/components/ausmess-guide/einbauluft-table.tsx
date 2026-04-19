// Einbauluft-Tabelle aus specs/konfigurator-ux-research-v2.md §3.2.
// Werte gelten pro Seite (beide Seiten pro Achse abziehen).

export function EinbauluftTable() {
  const rows: Array<{ range: string; weiss: string; farbig: string }> = [
    { range: "bis ca. 1.000 mm", weiss: "10 mm", farbig: "15 mm" },
    { range: "bis ca. 2.000 mm", weiss: "15 mm", farbig: "20 mm" },
    { range: "bis ca. 3.000 mm", weiss: "20 mm", farbig: "25 mm" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--konfig-chip-idle-bg)] text-left">
            <th className="px-4 py-3 font-semibold text-[var(--brand-heading)]">
              Elementgröße (längste Seite)
            </th>
            <th className="px-4 py-3 font-semibold text-[var(--brand-heading)]">
              Weiß
            </th>
            <th className="px-4 py-3 font-semibold text-[var(--brand-heading)]">
              Farbig / Anthrazit
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.range}
              className={
                i < rows.length - 1 ? "border-b border-[var(--border)]" : ""
              }
            >
              <td className="px-4 py-3 text-[var(--brand-text)]">{r.range}</td>
              <td className="px-4 py-3 font-medium text-[var(--brand-heading)] text-measure">
                {r.weiss}
              </td>
              <td className="px-4 py-3 font-medium text-[var(--brand-heading)] text-measure">
                {r.farbig}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-[var(--border)] bg-[var(--konfig-canvas)] px-4 py-2 text-xs text-[var(--muted-foreground)]">
        Werte gelten <strong>pro Seite</strong> — also links + rechts bzw. oben
        + unten jeweils abziehen (2× pro Achse). Grund für den Aufschlag bei
        farbigen Profilen: thermische Ausdehnung bei Sonneneinstrahlung.
      </p>
    </div>
  );
}
