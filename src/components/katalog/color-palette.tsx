"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { ColorSwatch } from "@/lib/katalog";

interface ColorPaletteProps {
  colors: ColorSwatch[];
}

const INITIAL_DISPLAY = 20;

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<ColorSwatch | null>(null);

  const displayed = showAll ? colors : colors.slice(0, INITIAL_DISPLAY);
  const hasMore = colors.length > INITIAL_DISPLAY;

  const closeModal = useCallback(() => setSelected(null), []);

  if (colors.length === 0) return null;

  return (
    <div>
      <h2 className="heading-sub mb-6">
        Verfügbare Farben{" "}
        <span className="text-base font-normal text-[var(--brand-text)]/50">
          ({colors.length})
        </span>
      </h2>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {displayed.map((color) => (
          <button
            key={color.code}
            onClick={() => setSelected(color)}
            className="group/swatch flex flex-col items-center gap-1.5"
            title={color.note || color.code}
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-lg ring-2 ring-transparent transition-all group-hover/swatch:scale-105 group-hover/swatch:ring-[var(--brand-primary)]">
              <Image
                src={color.url}
                alt={color.code}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            </div>
            <span className="text-[10px] leading-tight text-[var(--brand-text)]/60">
              {color.code}
            </span>
          </button>
        ))}
      </div>

      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
        >
          Alle {colors.length} Farben anzeigen
        </button>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
          onKeyDown={(e) => e.key === "Escape" && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-label={`Farbe ${selected.code}`}
        >
          <div
            className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-[var(--brand-text)]/50 transition-colors hover:bg-[var(--brand-light)] hover:text-[var(--brand-text)]"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
              <Image
                src={selected.url}
                alt={selected.code}
                fill
                className="object-cover"
                sizes="400px"
                unoptimized
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-lg font-bold text-[var(--brand-heading)]">
                {selected.code}
              </p>
              {selected.note && (
                <p className="mt-1 text-sm text-[var(--brand-text)]/60">
                  {selected.note}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
