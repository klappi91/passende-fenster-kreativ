"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { ChevronUp, X, Info } from "lucide-react";
import { useConfigStore } from "./store";
import { usePrice } from "@/lib/konfigurator-api";
import { WindowPreview } from "./window-preview/window-preview";
import type { InitResponse } from "@/lib/konfigurator-types";

/**
 * Mobile-only Live-Preview als Nonmodal-Bottom-Sheet mit Drag-Handle.
 * Wird unterhalb von lg-Breakpoint angezeigt. Sticky-CTA-Bar unten ruft es auf.
 */
export function MobileBottomSheet({ init }: { init: InitResponse }) {
  const [open, setOpen] = useState(false);
  const {
    width,
    height,
    groupExternalId,
    shapes,
    articleSlug,
    setStep,
  } = useConfigStore();

  const group = init.groups.find((g) => g.external_id === groupExternalId);
  const price = usePrice({
    articleSlug,
    w: width,
    h: height,
    groupExternalId,
  });
  const priceEur = price.data?.base_price_eur ?? null;

  return (
    <>
      {/* Sticky CTA Bar unten */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 border-t border-[var(--border)] bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex flex-1 items-center gap-3 text-left"
          aria-label="Konfigurations-Zusammenfassung öffnen"
        >
          <div
            className="h-10 w-14 shrink-0 rounded-md border border-[var(--border)] bg-[var(--konfig-canvas)]"
            aria-hidden="true"
          >
            <WindowPreview
              shapeConfiguration={group?.shape_configuration ?? null}
              shapes={shapes}
              maxHeight={40}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              {articleSlug ? "Richtpreis" : "ab"}
            </p>
            <p
              className="truncate text-lg font-bold text-[var(--konfig-price)]"
              style={{
                fontFamily: "var(--font-display)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {priceEur !== null ? `${Math.round(priceEur)} €` : "—"}
            </p>
          </div>
          <ChevronUp className="h-5 w-5 text-[var(--muted-foreground)]" />
        </button>

        <button
          type="button"
          onClick={() => setStep(5)}
          className="bg-brand-gradient shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold text-white shadow-md"
        >
          Angebot →
        </button>
      </div>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[90vh] flex-col rounded-t-3xl bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.16)] outline-none">
            <Drawer.Title className="sr-only">Konfigurations-Zusammenfassung</Drawer.Title>
            <Drawer.Description className="sr-only">
              Live-Preview, Preis und Zusammenfassung deiner aktuellen Konfiguration.
            </Drawer.Description>
            <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gray-300" />
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-[var(--muted-foreground)] hover:bg-[var(--konfig-chip-idle-bg)]"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="overflow-y-auto px-5 pb-6 pt-5">
              {/* Preview */}
              <div className="flex h-[220px] items-center justify-center rounded-xl bg-[var(--konfig-canvas)] p-3">
                <WindowPreview
                  shapeConfiguration={group?.shape_configuration ?? null}
                  shapes={shapes}
                  widthMm={width}
                  heightMm={height}
                />
              </div>

              <p className="text-measure mt-4 text-sm text-[var(--muted-foreground)]">
                {width && height ? `${width} × ${height} mm` : "Noch keine Maße"}
              </p>

              <div className="mt-3">
                <p className="heading-price-label">
                  {articleSlug ? "Richtpreis" : "ab"}
                </p>
                <p className="heading-price mt-1">
                  {priceEur !== null ? `${Math.round(priceEur)} €` : "—"}
                </p>
                {price.data?.interpolated && (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <Info className="h-3 w-3" />
                    Richtpreis (interpoliert)
                  </p>
                )}
              </div>

              <dl className="mt-5 space-y-1 border-t border-[var(--border)] pt-4 text-xs">
                {group && (
                  <Row label="Aufteilung" value={group.name} />
                )}
                {articleSlug && <Row label="Profil" value={articleSlug} />}
              </dl>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setStep(5);
                }}
                className="bg-brand-gradient mt-6 flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-white shadow-md"
              >
                Unverbindliches Angebot anfordern →
              </button>
              <p className="mt-2 text-center text-xs text-[var(--muted-foreground)]">
                Antwort innerhalb 48 Stunden
              </p>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-[var(--muted-foreground)]">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium text-[var(--brand-text)]">
        {value}
      </dd>
    </div>
  );
}
