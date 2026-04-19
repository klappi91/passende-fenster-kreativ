"use client";

import { useState, useMemo } from "react";
import { ArrowRight, Minus } from "lucide-react";
import {
  computeOrderMeasure,
  type Building,
  type ColorMode,
} from "@/lib/measure-math";
import { useConfigStore } from "@/components/konfigurator/store";

type Props = {
  /** Wird nach erfolgreicher Übernahme aufgerufen (z.B. um Drawer zu schließen). */
  onApply?: () => void;
  /** Zeigt die Karten-Box um den Rechner herum. Default true. Deaktiviere es
   * wenn der Rechner selbst bereits in einer Gradient-Box eingebettet ist. */
  framed?: boolean;
};

export function MiniRechner({ onApply, framed = true }: Props) {
  const [rawWidth, setRawWidth] = useState<number>(1260);
  const [rawHeight, setRawHeight] = useState<number>(1460);
  const [building, setBuilding] = useState<Building>("altbau");
  const [color, setColor] = useState<ColorMode>("weiss");
  const [withLeiste, setWithLeiste] = useState(false);
  const [withRollladen, setWithRollladen] = useState(false);

  const setMasse = useConfigStore((s) => s.setMasse);

  const result = useMemo(
    () =>
      computeOrderMeasure({
        rawWidth,
        rawHeight,
        building,
        color,
        withFensterbankLeiste: withLeiste,
        withRollladenAufsatz: withRollladen,
      }),
    [rawWidth, rawHeight, building, color, withLeiste, withRollladen]
  );

  const apply = () => {
    setMasse(result.orderWidth, result.orderHeight);
    if (onApply) onApply();
  };

  const content = (
    <div className={framed ? "" : "text-white"}>
      {/* Modus-Toggles */}
      <div className="flex flex-wrap gap-3">
        <ToggleGroup
          value={building}
          onChange={setBuilding}
          options={[
            { value: "altbau", label: "Altbau" },
            { value: "neubau", label: "Neubau" },
          ]}
          light={!framed}
        />
        <ToggleGroup
          value={color}
          onChange={setColor}
          options={[
            { value: "weiss", label: "Weiß" },
            { value: "farbig", label: "Farbig" },
          ]}
          light={!framed}
        />
      </div>

      {/* Maß-Eingaben */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberBox
          label="Rohbau Breite"
          value={rawWidth}
          onChange={setRawWidth}
          light={!framed}
        />
        <NumberBox
          label="Rohbau Höhe"
          value={rawHeight}
          onChange={setRawHeight}
          light={!framed}
        />
      </div>

      {/* Optionale Zuschläge */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <CheckChip
          label="Fensterbankleiste (−30 mm H)"
          checked={withLeiste}
          onChange={setWithLeiste}
          light={!framed}
        />
        <CheckChip
          label="Rollladen-Aufsatz (−180 mm H)"
          checked={withRollladen}
          onChange={setWithRollladen}
          light={!framed}
        />
      </div>

      {/* Abzüge */}
      <div className="mt-5 space-y-1">
        {result.deductions.map((d, i) => (
          <p
            key={i}
            className={`flex items-center gap-2 text-xs ${
              framed ? "text-[var(--muted-foreground)]" : "text-white/75"
            }`}
          >
            <Minus className="h-3 w-3" />
            <span>
              {d.label}: − {d.amountMm} mm {d.axis}
            </span>
          </p>
        ))}
      </div>

      {/* Ergebnis */}
      <div
        className={`mt-5 rounded-2xl ${
          framed
            ? "bg-[var(--konfig-canvas)] ring-1 ring-[var(--border)]"
            : "bg-white"
        } px-5 py-4`}
      >
        <p className="heading-price-label">Ihr Bestellmaß</p>
        <p
          className="heading-price mt-1"
          style={{
            color: "var(--konfig-price)",
          }}
        >
          {result.orderWidth}
          <span className="mx-2 text-[var(--muted-foreground)]">×</span>
          {result.orderHeight}
          <span className="ml-2 text-2xl font-semibold text-[var(--muted-foreground)]">
            mm
          </span>
        </p>
        {result.clampedToRange && (
          <p className="mt-2 text-xs text-[var(--destructive)]">
            Ergebnis liegt außerhalb des Standard-Rasters — Sonderanfrage nötig.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={apply}
        className={`konfig-animate mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-md transition hover:scale-105 hover:shadow-lg ${
          framed
            ? "bg-brand-gradient text-white"
            : "bg-white text-[var(--brand-primary)]"
        }`}
      >
        Maße in Konfigurator übernehmen
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

  if (!framed) {
    return content;
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[var(--border)] sm:p-8">
      <p className="heading-price-label">Interaktiv</p>
      <h2
        className="heading-konfig-step mt-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Rohbaumaß → Bestellmaß
      </h2>
      <p className="text-caption mt-2 max-w-md">
        Gib deine Maueröffnungs-Maße ein. Wir berechnen das Bestellmaß sofort —
        transparent und mit allen Abzügen.
      </p>
      <div className="mt-6">{content}</div>
    </div>
  );
}

// --- Sub-Components ---

function ToggleGroup<T extends string>({
  value,
  onChange,
  options,
  light,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
  light?: boolean;
}) {
  return (
    <div
      className={`inline-flex rounded-full p-1 ${
        light
          ? "bg-white/20 ring-1 ring-white/30"
          : "bg-[var(--konfig-chip-idle-bg)]"
      }`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              active
                ? light
                  ? "bg-white text-[var(--brand-primary)]"
                  : "bg-brand-gradient text-white shadow-sm"
                : light
                ? "text-white/80 hover:text-white"
                : "text-[var(--brand-text)] hover:text-[var(--brand-heading)]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function NumberBox({
  label,
  value,
  onChange,
  light,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  light?: boolean;
}) {
  return (
    <label className="block">
      <span
        className={`mb-1 block text-[10px] font-semibold uppercase tracking-widest ${
          light ? "text-white/70" : "text-[var(--muted-foreground)]"
        }`}
      >
        {label}
      </span>
      <div
        className={`relative rounded-xl border-2 transition focus-within:border-[var(--konfig-stroke)] ${
          light
            ? "border-white/30 bg-white"
            : "border-[var(--border)] bg-white"
        }`}
      >
        <input
          type="number"
          inputMode="numeric"
          min={400}
          max={4000}
          step="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent px-4 py-3 text-2xl font-bold outline-none"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--konfig-price)",
          }}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 select-none text-xs font-medium text-[var(--muted-foreground)]">
          mm
        </span>
      </div>
    </label>
  );
}

function CheckChip({
  label,
  checked,
  onChange,
  light,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        checked
          ? light
            ? "border-white bg-white text-[var(--brand-primary)]"
            : "border-[var(--konfig-stroke)] bg-[var(--konfig-chip-idle-bg)] text-[var(--brand-heading)]"
          : light
          ? "border-white/40 text-white hover:bg-white/10"
          : "border-[var(--border)] text-[var(--brand-text)] hover:border-[var(--konfig-stroke-muted)]"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-sm border-2 ${
          checked
            ? "border-[var(--konfig-stroke)] bg-[var(--konfig-stroke)]"
            : light
            ? "border-white/60"
            : "border-[var(--border)]"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-white">
            <path d="M1.8 5 4 7.2 8.2 3l.8.8L4 8.8 1 5.8z" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}
