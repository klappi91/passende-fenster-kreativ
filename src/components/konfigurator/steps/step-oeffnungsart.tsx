"use client";

import { useConfigStore } from "../store";
import type { InitResponse, ShapeCode } from "@/lib/konfigurator-types";
import { SHAPE_CODES } from "@/lib/konfigurator-types";
import {
  SHAPE_COMPONENTS,
  SHAPE_LABELS,
  SHAPE_DESCRIPTIONS,
} from "../window-preview/shape-primitives";

export function StepOeffnungsart({ init }: { init: InitResponse }) {
  const { groupExternalId, shapes, setShapes, setStep } = useConfigStore();

  const group = init.groups.find((g) => g.external_id === groupExternalId);

  if (!group) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-caption">
          Bitte zuerst eine Aufteilung wählen.
        </p>
        <button
          onClick={() => setStep(1)}
          className="mt-4 text-[var(--brand-primary)] underline"
        >
          Zurück zu Schritt 1
        </button>
      </div>
    );
  }

  const rows = group.shape_configuration;
  const totalCells = rows.reduce((s, r) => s + r.shapes, 0);
  const filledCells = shapes
    ? shapes.flat().filter((c): c is ShapeCode => Boolean(c)).length
    : 0;
  const allFilled = filledCells === totalCells;

  const handleSelect = (rowIdx: number, cellIdx: number, code: ShapeCode) => {
    const current: ShapeCode[][] = shapes
      ? shapes.map((r) => r.slice())
      : rows.map((r) => Array.from({ length: r.shapes }, () => "Fest" as const));
    if (!current[rowIdx]) current[rowIdx] = [];
    current[rowIdx][cellIdx] = code;
    setShapes(current);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-12">
      <p className="heading-price-label">Schritt 2 von 5</p>
      <h2 className="heading-konfig-step mt-2">Öffnungsart je Flügel</h2>
      <p className="text-caption mt-2 max-w-xl">
        Wählen Sie für jeden Flügel die Öffnungsrichtung. Perspektive: von innen auf das
        Fenster blickend. Die Dreiecks-Spitze zeigt zur Drehachse.
      </p>

      {rows.map((row, rowIdx) => (
        <section key={rowIdx} className="mt-10">
          {rows.length > 1 && (
            <h3 className="mb-3 text-sm font-semibold text-[var(--brand-heading)]">
              {rows.length === 2 && rowIdx === 0 && row.shapes === 1
                ? "Oberlicht"
                : `Reihe ${rowIdx + 1}`}
            </h3>
          )}
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${Math.min(row.shapes, 3)}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: row.shapes }).map((_, cellIdx) => (
              <div key={cellIdx}>
                <p className="mb-3 text-xs font-medium text-[var(--muted-foreground)]">
                  Flügel {cellIdx + 1}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {SHAPE_CODES.map((code) => {
                    const Comp = SHAPE_COMPONENTS[code];
                    const active = shapes?.[rowIdx]?.[cellIdx] === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelect(rowIdx, cellIdx, code)}
                        className={`konfig-animate group flex flex-col items-center gap-1 rounded-xl border-2 bg-white p-2 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--konfig-stroke)] focus-visible:ring-offset-2 ${
                          active
                            ? "border-[var(--konfig-stroke)] shadow-md"
                            : "border-[var(--border)] hover:border-[var(--konfig-stroke-muted)]"
                        }`}
                        aria-pressed={active}
                        title={SHAPE_DESCRIPTIONS[code]}
                      >
                        <div
                          className="h-12 w-12"
                          style={{
                            color: active
                              ? "var(--konfig-stroke)"
                              : "var(--konfig-stroke-muted)",
                          }}
                        >
                          <Comp className="h-full w-full" />
                        </div>
                        <span
                          className={`text-[10px] font-semibold ${
                            active
                              ? "text-[var(--brand-heading)]"
                              : "text-[var(--muted-foreground)]"
                          }`}
                        >
                          {code}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {shapes?.[rowIdx]?.[cellIdx] && (
                  <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                    {SHAPE_LABELS[shapes[rowIdx][cellIdx]]} —{" "}
                    {SHAPE_DESCRIPTIONS[shapes[rowIdx][cellIdx]]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--brand-primary)]"
        >
          ← Zurück
        </button>
        <button
          type="button"
          disabled={!allFilled}
          onClick={() => setStep(3)}
          className="bg-brand-gradient konfig-animate inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          Weiter zu Profilen →
        </button>
      </div>
    </div>
  );
}
