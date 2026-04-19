"use client";

// Compose-Komponente für die Fenster-Live-Preview.
// Rendert einen äußeren Rahmen und darin ein CSS-Grid nach
// group.shape_configuration (Reihen mit jeweils n Flügeln).
// Jede Zelle enthält ein SHAPE-Primitive aus shapes[row][cell].

import type { ShapeCode, ShapeRow } from "@/lib/konfigurator-types";
import { SHAPE_COMPONENTS, SHAPE_LABELS } from "./shape-primitives";

type WindowPreviewProps = {
  shapeConfiguration: ShapeRow[] | null;
  shapes: ShapeCode[][] | null;
  /** Breite in mm, nur fuer Aspekt — optional */
  widthMm?: number | null;
  /** Hoehe in mm, nur fuer Aspekt — optional */
  heightMm?: number | null;
  /** Tailwind className fuer die aeussere Huelle */
  className?: string;
  /** Innere SVG-Groesse. Default: fuellt Container. */
  maxHeight?: number;
};

export function WindowPreview({
  shapeConfiguration,
  shapes,
  widthMm,
  heightMm,
  className,
  maxHeight = 220,
}: WindowPreviewProps) {
  const rows = shapeConfiguration ?? [];
  const totalHeight = rows.reduce((sum, r) => sum + r.height, 0) || 100;

  // Aspect-Ratio: wenn Maße bekannt, nutze sie; sonst 4:3.
  const aspectRatio = widthMm && heightMm ? widthMm / heightMm : 4 / 3;

  // Boxdimensionen
  const containerWidth = Math.min(320, maxHeight * aspectRatio);
  const containerHeight = Math.min(maxHeight, containerWidth / aspectRatio);

  if (!rows.length) {
    return (
      <div
        className={className}
        style={{
          width: containerWidth,
          height: containerHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--konfig-stroke-muted)",
          fontSize: "0.75rem",
        }}
      >
        Aufteilung wählen →
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: containerWidth,
        height: containerHeight,
        position: "relative",
      }}
      aria-label={describeAriaLabel(rows, shapes)}
      role="img"
    >
      {/* Aeusserer Rahmen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "2px solid currentColor",
          borderRadius: 3,
          color: "var(--konfig-stroke)",
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,159,227,0.03), transparent 70%)",
        }}
      />

      {/* Grid der Shapes */}
      <div
        style={{
          position: "absolute",
          inset: 6,
          display: "grid",
          gridTemplateRows: rows
            .map((r) => `${(r.height / totalHeight) * 100}fr`)
            .join(" "),
          gap: 2,
          color: "var(--konfig-stroke)",
        }}
      >
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${row.shapes}, 1fr)`,
              gap: 2,
            }}
          >
            {Array.from({ length: row.shapes }).map((_, cellIdx) => {
              const code = shapes?.[rowIdx]?.[cellIdx] ?? null;
              const Component = code ? SHAPE_COMPONENTS[code] : null;
              return (
                <div
                  key={cellIdx}
                  style={{
                    border: "1.5px solid currentColor",
                    borderRadius: 2,
                    color: code ? "var(--konfig-stroke)" : "var(--konfig-stroke-muted)",
                    overflow: "hidden",
                    transition:
                      "color 260ms cubic-bezier(0.2, 0.9, 0.3, 1.1)",
                  }}
                  className="konfig-animate"
                >
                  {Component && (
                    <Component className="h-full w-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function describeAriaLabel(rows: ShapeRow[], shapes: ShapeCode[][] | null) {
  if (!shapes) {
    const total = rows.reduce((s, r) => s + r.shapes, 0);
    return `Fenster-Vorschau mit ${total} Flügel${total === 1 ? "" : "n"}`;
  }
  const parts: string[] = [];
  shapes.forEach((row, rowIdx) => {
    row.forEach((code, cellIdx) => {
      parts.push(
        `Reihe ${rowIdx + 1} Flügel ${cellIdx + 1}: ${SHAPE_LABELS[code] ?? code}`
      );
    });
  });
  return `Fenster-Vorschau. ${parts.join(", ")}.`;
}

/**
 * Miniatur-Variante für Group-Selector Cards. Zeigt nur den Umriss
 * nach shape_configuration, ohne spezifische Shapes.
 */
export function GroupMiniature({
  shapeConfiguration,
  active = false,
  className,
}: {
  shapeConfiguration: ShapeRow[];
  active?: boolean;
  className?: string;
}) {
  const totalHeight = shapeConfiguration.reduce((s, r) => s + r.height, 0) || 100;

  return (
    <div
      className={className}
      style={{
        width: 96,
        height: 72,
        position: "relative",
        color: active ? "var(--konfig-stroke)" : "var(--konfig-stroke-muted)",
        transition: "color 200ms ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1.5px solid currentColor",
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 3,
          display: "grid",
          gridTemplateRows: shapeConfiguration
            .map((r) => `${(r.height / totalHeight) * 100}fr`)
            .join(" "),
          gap: 1,
        }}
      >
        {shapeConfiguration.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${row.shapes}, 1fr)`,
              gap: 1,
            }}
          >
            {Array.from({ length: row.shapes }).map((_, cellIdx) => (
              <div
                key={cellIdx}
                style={{
                  border: "1px solid currentColor",
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
