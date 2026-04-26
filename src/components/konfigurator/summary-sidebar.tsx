"use client";

import { useConfigStore } from "./store";
import { usePrice } from "@/lib/konfigurator-api";
import { WindowPreview } from "./window-preview/window-preview";
import type { InitResponse } from "@/lib/konfigurator-types";
import { Info } from "lucide-react";

export function SummarySidebar({ init }: { init: InitResponse }) {
  const {
    width,
    height,
    groupExternalId,
    shapes,
    articleSlug,
    variantExternalId,
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
  const interpolated = price.data?.interpolated ?? false;

  return (
    <aside className="sticky top-32 hidden h-[calc(100vh-8rem)] w-[340px] shrink-0 overflow-y-auto border-l border-[var(--border)] bg-white p-6 lg:block">
      {/* Preview */}
      <div className="relative flex h-[220px] items-center justify-center rounded-xl bg-[var(--konfig-canvas)] p-3">
        <WindowPreview
          shapeConfiguration={group?.shape_configuration ?? null}
          shapes={shapes}
          widthMm={width}
          heightMm={height}
        />
      </div>

      {/* Maße */}
      <p className="text-measure mt-5 text-sm text-[var(--muted-foreground)]">
        {width && height ? `${width} × ${height} mm` : "Noch keine Maße"}
      </p>

      {/* Preis */}
      <div className="mt-4">
        <p className="heading-price-label">
          {articleSlug ? "Richtpreis" : "ab"}
        </p>
        <p className="heading-price mt-1 konfig-animate">
          {price.isLoading ? (
            <span className="inline-block h-[0.9em] w-28 animate-pulse rounded bg-muted" />
          ) : priceEur !== null ? (
            <>
              {Math.round(priceEur)}
              <span className="text-3xl"> €</span>
            </>
          ) : (
            <span className="text-2xl text-[var(--muted-foreground)]">
              {width && height && groupExternalId ? "wähle Profil" : "wähle Maße"}
            </span>
          )}
        </p>
        {interpolated && (
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <Info className="h-3 w-3" />
            Richtpreis (zwischen Rasterpunkten interpoliert)
          </p>
        )}
      </div>

      {/* Zusammenfassung */}
      <dl className="mt-5 space-y-1 border-t border-[var(--border)] pt-4 text-xs">
        {group && (
          <SummaryRow label="Aufteilung" value={group.name} />
        )}
        {articleSlug && (
          <SummaryRow label="Profil" value={articleSlug} />
        )}
        {variantExternalId && (
          <SummaryRow label="Variante" value={`ID ${variantExternalId}`} />
        )}
      </dl>

      {/* CTA */}
      <button
        type="button"
        onClick={() => setStep(5)}
        className="bg-brand-gradient konfig-animate mt-6 flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
      >
        Unverbindliches Angebot anfordern →
      </button>

      <p className="mt-2 text-center text-xs text-[var(--muted-foreground)]">
        Antwort innerhalb 48 Stunden
      </p>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-[var(--muted-foreground)]">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium text-[var(--brand-text)]">
        {value}
      </dd>
    </div>
  );
}
