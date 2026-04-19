// Pure Berechnung Rohbau -> Bestellmaß.
// Quelle: specs/konfigurator-ux-research-v2.md §3.2, specs/konfigurator-ui.md §10.
//
// Einbauluft-Werte gelten pro Seite (also 2x pro Achse abziehen).
// Fensterbankleiste-Standard 30 mm, Rollladen-Aufsatz 180 mm (einfaches Default,
// in der Praxis profil-abhängig).

export type Building = "altbau" | "neubau";
export type ColorMode = "weiss" | "farbig";

export type MassInput = {
  rawWidth: number;
  rawHeight: number;
  building: Building;
  color: ColorMode;
  withFensterbankLeiste: boolean;
  fensterbankLeisteHeightMm?: number; // default 30
  withRollladenAufsatz: boolean;
  rollladenAufsatzHeightMm?: number; // default 180
};

export type Deduction = {
  label: string;
  amountMm: number;
  axis: "B" | "H";
};

export type MassOutput = {
  orderWidth: number;
  orderHeight: number;
  deductions: Deduction[];
  clampedToRange: boolean;
  einbauluftPerSideMm: number;
};

// Tabelle (größte Element-Dimension -> Einbauluft pro Seite in mm)
const EINBAULUFT: Record<ColorMode, Array<[maxMm: number, mm: number]>> = {
  weiss: [
    [1000, 10],
    [2000, 15],
    [3000, 20],
  ],
  farbig: [
    [1000, 15],
    [2000, 20],
    [3000, 25],
  ],
};

export function lookupEinbauluft(longestSideMm: number, color: ColorMode): number {
  const table = EINBAULUFT[color];
  for (const [threshold, mm] of table) {
    if (longestSideMm <= threshold) return mm;
  }
  // over 3000 mm: nimm größten definierten Wert
  return table[table.length - 1][1];
}

export const RANGE = {
  minWidth: 400,
  maxWidth: 2800,
  minHeight: 400,
  maxHeight: 3000,
} as const;

export function computeOrderMeasure(input: MassInput): MassOutput {
  const {
    rawWidth,
    rawHeight,
    building,
    color,
    withFensterbankLeiste,
    fensterbankLeisteHeightMm = 30,
    withRollladenAufsatz,
    rollladenAufsatzHeightMm = 180,
  } = input;

  const longest = Math.max(rawWidth, rawHeight);
  const einbauluftPerSide = lookupEinbauluft(longest, color);

  const deductions: Deduction[] = [];

  // Einbauluft pro Seite x 2 (beide Seiten pro Achse)
  const einbauluftTotalPerAxis = einbauluftPerSide * 2;
  deductions.push({
    label: `Einbauluft (2 × ${einbauluftPerSide} mm, ${color})`,
    amountMm: einbauluftTotalPerAxis,
    axis: "B",
  });
  deductions.push({
    label: `Einbauluft (2 × ${einbauluftPerSide} mm, ${color})`,
    amountMm: einbauluftTotalPerAxis,
    axis: "H",
  });

  let orderWidth = rawWidth - einbauluftTotalPerAxis;
  let orderHeight = rawHeight - einbauluftTotalPerAxis;

  if (withFensterbankLeiste) {
    deductions.push({
      label: "Fensterbankleiste",
      amountMm: fensterbankLeisteHeightMm,
      axis: "H",
    });
    orderHeight -= fensterbankLeisteHeightMm;
  }

  if (withRollladenAufsatz) {
    deductions.push({
      label: "Rollladen-Aufsatzkasten",
      amountMm: rollladenAufsatzHeightMm,
      axis: "H",
    });
    orderHeight -= rollladenAufsatzHeightMm;
  }

  // Altbau: derselbe Rechenweg. Der Unterschied liegt im Ausgangsmaß
  // (Rahmenaußenmaß bei Altbau vs. Maueröffnung bei Neubau) — die UI
  // beschreibt das im Guide. Die Mathematik ist gleich.
  void building;

  // Clamp und range-flag
  const clampedToRange =
    orderWidth < RANGE.minWidth ||
    orderWidth > RANGE.maxWidth ||
    orderHeight < RANGE.minHeight ||
    orderHeight > RANGE.maxHeight;

  orderWidth = Math.max(RANGE.minWidth, Math.min(RANGE.maxWidth, orderWidth));
  orderHeight = Math.max(RANGE.minHeight, Math.min(RANGE.maxHeight, orderHeight));

  return {
    orderWidth,
    orderHeight,
    deductions,
    clampedToRange,
    einbauluftPerSideMm: einbauluftPerSide,
  };
}
