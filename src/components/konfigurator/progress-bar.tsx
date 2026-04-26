"use client";

import { useConfigStore, type StepId } from "./store";
import { Check } from "lucide-react";

const STEPS: Array<{ id: StepId; label: string }> = [
  { id: 1, label: "Maße" },
  { id: 2, label: "Öffnung" },
  { id: 3, label: "Profil" },
  { id: 4, label: "Konfig" },
  { id: 5, label: "Anfrage" },
];

export function ProgressBar() {
  const { step, setStep, width, height, groupExternalId, shapes, articleSlug } =
    useConfigStore();

  const isStepDone = (id: StepId): boolean => {
    if (id === 1) return Boolean(width && height && groupExternalId);
    if (id === 2) return Boolean(shapes && shapes.flat().every(Boolean));
    if (id === 3) return Boolean(articleSlug);
    if (id === 4) return step > 4;
    return false;
  };

  const isClickable = (id: StepId): boolean => {
    if (id === step) return false;
    if (id < step) return true;
    // Future steps: nur klickbar wenn alle vorherigen erledigt sind
    for (let s = 1 as StepId; s < id; s = (s + 1) as StepId) {
      if (!isStepDone(s)) return false;
    }
    return true;
  };

  return (
    <nav
      aria-label="Konfigurator-Fortschritt"
      className="sticky top-16 z-30 w-full border-b border-[var(--border)] bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        {STEPS.map((s, idx) => {
          const done = isStepDone(s.id);
          const active = step === s.id;
          const clickable = isClickable(s.id);

          return (
            <div
              key={s.id}
              className="flex flex-1 items-center last:flex-initial"
              aria-current={active ? "step" : undefined}
            >
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && setStep(s.id)}
                className={`group relative inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--konfig-stroke)] focus-visible:ring-offset-2 ${
                  clickable ? "cursor-pointer" : active ? "cursor-default" : "cursor-not-allowed"
                }`}
                aria-label={`Schritt ${s.id}: ${s.label}${done ? " (erledigt)" : ""}`}
              >
                {/* Dot */}
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                    active
                      ? "bg-brand-gradient text-white shadow-md ring-4 ring-[var(--konfig-stroke)]/20"
                      : done
                      ? "bg-[var(--konfig-step-done)] text-white"
                      : "bg-[var(--konfig-step-idle)] text-[var(--muted-foreground)]"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {done && !active ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    s.id
                  )}
                </span>
                <span
                  className={`hidden text-xs font-medium transition sm:inline ${
                    active
                      ? "text-[var(--brand-heading)]"
                      : done
                      ? "text-[var(--brand-text)]"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {s.label}
                </span>
              </button>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <span
                  className={`mx-2 h-[2px] flex-1 rounded-full transition-colors ${
                    done ? "bg-[var(--konfig-step-done)]" : "bg-[var(--konfig-step-idle)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
