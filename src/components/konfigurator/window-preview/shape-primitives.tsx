// 6 Shape-Primitives als inline-SVGs nach DIN-1356-Konvention.
// Perspektive: von innen auf das Fenster blickend.
// Konvention: Dreieck-Spitze zeigt zur Drehachse / zum Scharnier.
//   - DL (Dreh-Links): Spitze links (Scharnier links, Griff rechts)
//   - DR (Dreh-Rechts): Spitze rechts
//   - Kipp: Spitze unten (Scharnier unten, oben öffnend)
//   - DKL / DKR: Kombination aus DL/DR + Kipp-Dreieck übereinander
//   - Fest: nur Rahmen

import type { ShapeCode } from "@/lib/konfigurator-types";

type Props = {
  className?: string;
  strokeClassName?: string;
  active?: boolean;
};

const BOX = { x: 2, y: 2, w: 44, h: 44 } as const;
const CENTER = { x: BOX.x + BOX.w / 2, y: BOX.y + BOX.h / 2 } as const;
const TL = { x: BOX.x, y: BOX.y };
const TR = { x: BOX.x + BOX.w, y: BOX.y };
const BL = { x: BOX.x, y: BOX.y + BOX.h };
const BR = { x: BOX.x + BOX.w, y: BOX.y + BOX.h };

function Frame({ rounded = true }: { rounded?: boolean }) {
  return (
    <rect
      x={BOX.x}
      y={BOX.y}
      width={BOX.w}
      height={BOX.h}
      rx={rounded ? 1.5 : 0}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  );
}

export function ShapeFest(props: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={props.className}
      style={{ color: "currentColor" }}
      aria-label="Festes Element"
    >
      <Frame />
    </svg>
  );
}

// DL: Dreieck-Spitze links
export function ShapeDL(props: Props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className} aria-label="Dreh links">
      <Frame />
      <polyline
        points={`${TR.x},${TR.y} ${BOX.x},${CENTER.y} ${BR.x},${BR.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// DR: Dreieck-Spitze rechts
export function ShapeDR(props: Props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className} aria-label="Dreh rechts">
      <Frame />
      <polyline
        points={`${TL.x},${TL.y} ${BR.x},${CENTER.y} ${BL.x},${BL.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Kipp: Dreieck-Spitze unten-mittig
export function ShapeKipp(props: Props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className} aria-label="Kipp">
      <Frame />
      <polyline
        points={`${TL.x},${TL.y} ${CENTER.x},${BR.y} ${TR.x},${TR.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// DKL: DL + Kipp
export function ShapeDKL(props: Props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className} aria-label="Dreh-Kipp links">
      <Frame />
      <polyline
        points={`${TR.x},${TR.y} ${BOX.x},${CENTER.y} ${BR.x},${BR.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline
        points={`${TL.x},${TL.y} ${CENTER.x},${BR.y} ${TR.x},${TR.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

// DKR: DR + Kipp
export function ShapeDKR(props: Props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className} aria-label="Dreh-Kipp rechts">
      <Frame />
      <polyline
        points={`${TL.x},${TL.y} ${BR.x},${CENTER.y} ${BL.x},${BL.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline
        points={`${TL.x},${TL.y} ${CENTER.x},${BR.y} ${TR.x},${TR.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export const SHAPE_COMPONENTS: Record<
  ShapeCode,
  (props: Props) => React.ReactElement
> = {
  Fest: ShapeFest,
  DL: ShapeDL,
  DR: ShapeDR,
  Kipp: ShapeKipp,
  DKL: ShapeDKL,
  DKR: ShapeDKR,
};

export const SHAPE_LABELS: Record<ShapeCode, string> = {
  Fest: "Fest",
  DL: "Dreh Links",
  DR: "Dreh Rechts",
  Kipp: "Kipp",
  DKL: "Dreh-Kipp Links",
  DKR: "Dreh-Kipp Rechts",
};

export const SHAPE_DESCRIPTIONS: Record<ShapeCode, string> = {
  Fest: "Festverglast, nicht öffenbar",
  DL: "Scharnier links, Griff rechts",
  DR: "Scharnier rechts, Griff links",
  Kipp: "Kippt oben nach innen",
  DKL: "Dreht nach links, kippt oben",
  DKR: "Dreht nach rechts, kippt oben",
};
