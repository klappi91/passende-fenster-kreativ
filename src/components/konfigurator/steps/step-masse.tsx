"use client";

import { useConfigStore } from "../store";
import type { InitResponse, Group, ShapeCode } from "@/lib/konfigurator-types";
import { GroupMiniature } from "../window-preview/window-preview";
import { GuideDrawer } from "@/components/ausmess-guide/guide-drawer";
import { Ruler, AlertCircle } from "lucide-react";

export function StepMasse({ init }: { init: InitResponse }) {
  const {
    width,
    height,
    groupExternalId,
    setMasse,
    setGroup,
    setStep,
  } = useConfigStore();

  const { minWidth, maxWidth, minHeight, maxHeight } = init.rangeSizes;

  const widthOut = width !== null && (width < minWidth || width > maxWidth);
  const heightOut = height !== null && (height < minHeight || height > maxHeight);
  const sizeOk = width !== null && height !== null && !widthOut && !heightOut;
  const canAdvance = sizeOk && groupExternalId !== null;

  const handleGroupSelect = (g: Group) => {
    // Shape-Template initial mit Festen als Default
    const template: ShapeCode[][] = g.shape_configuration.map((row) =>
      Array.from({ length: row.shapes }, () => "Fest" as const)
    );
    if (g.external_id !== null) {
      setGroup(g.external_id, template);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-12">
      <p className="heading-price-label">Schritt 1 von 5</p>
      <h2 className="heading-konfig-step mt-2">Maße & Aufteilung</h2>
      <p className="text-caption mt-2 max-w-xl">
        Geben Sie die Außenmaße des geplanten Fensters ein (Bestellmaß) und wählen
        Sie die Aufteilung. Unsicher beim Ausmessen? Nutzen Sie den Mess-Guide.
      </p>

      {/* Maß-Eingabe */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <MeasureInput
          label="Breite"
          value={width}
          min={minWidth}
          max={maxWidth}
          onChange={(v) => setMasse(v, height)}
        />
        <MeasureInput
          label="Höhe"
          value={height}
          min={minHeight}
          max={maxHeight}
          onChange={(v) => setMasse(width, v)}
        />
      </div>

      {/* Preset-Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-caption mr-1 pt-1">Schnellwahl:</span>
        {[
          [800, 1000],
          [1000, 1200],
          [1200, 1400],
          [1500, 1400],
          [1800, 2000],
        ].map(([w, h]) => (
          <button
            key={`${w}x${h}`}
            type="button"
            onClick={() => setMasse(w, h)}
            className="rounded-full bg-[var(--konfig-chip-idle-bg)] px-3 py-1 text-xs font-medium text-[var(--brand-text)] transition hover:bg-[var(--konfig-chip-hover-bg)]"
          >
            {w} × {h} mm
          </button>
        ))}
      </div>

      {/* Guide-Drawer-Trigger */}
      <GuideDrawer>
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-primary)] hover:underline"
        >
          <Ruler className="h-4 w-4" />
          Unsicher beim Ausmessen? Mess-Guide öffnen
        </button>
      </GuideDrawer>

      {/* Aufteilung wählen */}
      <section className="mt-12">
        <h3 className="heading-sub" style={{ fontFamily: "var(--font-display)" }}>
          Aufteilung wählen
        </h3>
        <p className="text-caption mt-2">
          Wie soll Ihr Fenster aufgeteilt sein?
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {init.groups.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              active={g.external_id === groupExternalId}
              onSelect={() => handleGroupSelect(g)}
            />
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between gap-3">
        <span className="text-caption">
          {!sizeOk && "Bitte gültige Maße eingeben."}
          {sizeOk && !groupExternalId && "Bitte Aufteilung wählen."}
        </span>
        <button
          type="button"
          disabled={!canAdvance}
          onClick={() => setStep(2)}
          className="bg-brand-gradient konfig-animate inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          Weiter zu Öffnungsart →
        </button>
      </div>
    </div>
  );
}

function MeasureInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number | null;
  min: number;
  max: number;
  onChange: (v: number | null) => void;
}) {
  const outOfRange = value !== null && (value < min || value > max);

  return (
    <label className="block">
      <span className="heading-price-label mb-2 block">{label}</span>
      <div
        className={`relative rounded-xl border-2 bg-white transition ${
          outOfRange
            ? "border-[var(--destructive)]"
            : value
            ? "border-[var(--konfig-stroke)]"
            : "border-[var(--border)]"
        }`}
      >
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step="10"
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? null : Number(v));
          }}
          placeholder="–"
          className="w-full rounded-[8px] bg-transparent px-5 py-4 text-3xl font-bold outline-none placeholder:text-[var(--konfig-stroke-muted)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
          aria-invalid={outOfRange}
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 select-none text-sm font-medium text-[var(--muted-foreground)]">
          mm
        </span>
      </div>
      <p
        className={`mt-1.5 flex items-center gap-1 text-xs ${
          outOfRange
            ? "text-[var(--destructive)]"
            : "text-[var(--muted-foreground)]"
        }`}
      >
        {outOfRange && <AlertCircle className="h-3 w-3" />}
        {outOfRange
          ? `Außerhalb ${min}–${max} mm — Sonderanfrage nötig`
          : `Zulässig: ${min}–${max} mm`}
      </p>
    </label>
  );
}

function GroupCard({
  group,
  active,
  onSelect,
}: {
  group: Group;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`konfig-animate group flex flex-col items-center gap-3 rounded-2xl border-2 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--konfig-stroke)] focus-visible:ring-offset-2 ${
        active
          ? "border-[var(--konfig-stroke)] shadow-lg"
          : "border-[var(--border)] hover:border-[var(--konfig-stroke-muted)]"
      }`}
      aria-pressed={active}
      aria-label={`Aufteilung: ${group.name}`}
    >
      <GroupMiniature shapeConfiguration={group.shape_configuration} active={active} />
      <span
        className={`text-center text-xs font-semibold leading-tight ${
          active ? "text-[var(--brand-heading)]" : "text-[var(--brand-text)]"
        }`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {group.name}
      </span>
    </button>
  );
}
