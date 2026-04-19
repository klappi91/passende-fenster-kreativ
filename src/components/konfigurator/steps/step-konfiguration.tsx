"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useConfigStore } from "../store";
import { useArticle } from "@/lib/konfigurator-api";
import type {
  InitResponse,
  ArticleDetailResponse,
  ArticleVariant,
  AdditionOption,
  AdditionVariant,
} from "@/lib/konfigurator-types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertCircle } from "lucide-react";

export function StepKonfiguration({ init: _init }: { init: InitResponse }) {
  void _init;
  const {
    articleSlug,
    width,
    height,
    groupExternalId,
    variantExternalId,
    selectedAdditionVariantExternalIds,
    setVariantExternalId,
    toggleAdditionVariant,
    setStep,
  } = useConfigStore();

  const article = useArticle(articleSlug, {
    w: width,
    h: height,
    groupExternalId,
  });

  if (article.isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-10 w-96 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (article.isError || !article.data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <AlertCircle className="h-8 w-8 text-[var(--destructive)]" />
        <p className="mt-2 text-sm text-[var(--destructive)]">
          Profil-Detail konnte nicht geladen werden.
        </p>
        <button
          onClick={() => setStep(3)}
          className="mt-4 text-sm font-medium text-[var(--brand-primary)] underline"
        >
          Zurück zur Profil-Auswahl
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-12">
      <p className="heading-price-label">Schritt 4 von 5</p>
      <h2 className="heading-konfig-step mt-2">{article.data.name} konfigurieren</h2>
      <p className="text-caption mt-2 max-w-xl">
        {article.data.brand?.name} · Uw {article.data.uw_value?.toFixed(2)} W/m²K · {article.data.profile_depth} mm Bautiefe
      </p>

      {/* Variants — Farben */}
      <VariantPicker
        article={article.data}
        selectedId={variantExternalId}
        onSelect={setVariantExternalId}
      />

      {/* Additions — Rollladen, Schallschutz etc. */}
      <AdditionsAccordion
        article={article.data}
        selectedIds={selectedAdditionVariantExternalIds}
        onToggle={toggleAdditionVariant}
      />

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--brand-primary)]"
        >
          ← Zurück
        </button>
        <button
          type="button"
          onClick={() => setStep(5)}
          className="bg-brand-gradient konfig-animate inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
        >
          Angebot anfordern →
        </button>
      </div>
    </div>
  );
}

function VariantPicker({
  article,
  selectedId,
  onSelect,
}: {
  article: ArticleDetailResponse;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}) {
  // Farbvarianten gruppieren: nach Außenfarbe / Innenfarbe / etc.
  // Einfachheits-MVP: flache Liste; Grouping später verbessern.
  const variants = article.variants;

  const colorByVariant = useMemo(() => {
    return variants.map((v) => {
      const outer = v.property_values.find(
        (pv) => pv.property_short_name === "color" && pv.position === 2
      );
      const inner = v.property_values.find(
        (pv) => pv.property_short_name === "color" && pv.position === 1
      );
      return {
        variant: v,
        outer,
        inner,
      };
    });
  }, [variants]);

  if (!variants.length) {
    return null;
  }

  return (
    <section className="mt-10">
      <h3 className="heading-sub" style={{ fontFamily: "var(--font-display)" }}>
        Farbe wählen
      </h3>
      <p className="text-caption mt-1">
        Außen- und Innenfarbe. {variants.length} Varianten verfügbar.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {colorByVariant.slice(0, 24).map(({ variant, outer, inner }) => (
          <VariantButton
            key={variant.id}
            variant={variant}
            outerName={outer?.value ?? ""}
            innerName={inner?.value ?? ""}
            outerImage={outer?.image ?? null}
            innerImage={inner?.image ?? null}
            active={variant.external_id === selectedId}
            onClick={() => onSelect(variant.external_id)}
          />
        ))}
      </div>
      {variants.length > 24 && (
        <p className="mt-3 text-xs text-[var(--muted-foreground)]">
          Weitere {variants.length - 24} Varianten auf Anfrage.
        </p>
      )}
    </section>
  );
}

function VariantButton({
  variant,
  outerName,
  innerName,
  outerImage,
  innerImage,
  active,
  onClick,
}: {
  variant: ArticleVariant;
  outerName: string;
  innerName: string;
  outerImage: string | null;
  innerImage: string | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`konfig-animate flex items-center gap-3 rounded-xl border-2 bg-white p-3 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--konfig-stroke)] focus-visible:ring-offset-2 ${
        active
          ? "border-[var(--konfig-stroke)] shadow-md"
          : "border-[var(--border)] hover:border-[var(--konfig-stroke-muted)]"
      }`}
      aria-pressed={active}
    >
      <div className="flex shrink-0 overflow-hidden rounded-lg border border-black/10">
        <div
          className="h-10 w-5 bg-cover bg-center"
          style={{
            backgroundImage: outerImage ? `url(${outerImage})` : undefined,
            backgroundColor: outerImage ? undefined : "#fafbfc",
          }}
          aria-label={`Außen ${outerName}`}
        />
        <div
          className="h-10 w-5 bg-cover bg-center"
          style={{
            backgroundImage: innerImage ? `url(${innerImage})` : undefined,
            backgroundColor: innerImage ? undefined : "#ffffff",
          }}
          aria-label={`Innen ${innerName}`}
        />
      </div>
      <div className="min-w-0 text-left">
        <p className="truncate text-xs font-medium text-[var(--brand-heading)]">
          {outerName || "—"}
        </p>
        <p className="truncate text-[10px] text-[var(--muted-foreground)]">
          innen {innerName || "—"}
        </p>
      </div>
      {variant.price_cents !== null && variant.price_cents > 0 && (
        <span className="ml-auto shrink-0 text-xs font-semibold text-[var(--brand-primary)]">
          +{Math.round(variant.price_cents / 100)} €
        </span>
      )}
    </button>
  );
}

function AdditionsAccordion({
  article,
  selectedIds,
  onToggle,
}: {
  article: ArticleDetailResponse;
  selectedIds: number[];
  onToggle: (externalId: number) => void;
}) {
  const categories = Object.values(article.additions).sort(
    (a, b) => (a.category.sort_order ?? 0) - (b.category.sort_order ?? 0)
  );

  if (!categories.length) return null;

  return (
    <section className="mt-10">
      <h3 className="heading-sub" style={{ fontFamily: "var(--font-display)" }}>
        Zubehör & Extras
      </h3>
      <p className="text-caption mt-1">Optional — erweitern dein Fenster nach Bedarf.</p>

      <Accordion multiple className="mt-4 space-y-2">
        {categories.map(({ category, options }) => {
          const selectedInCategory = countSelectedInCategory(options, selectedIds);
          return (
            <AccordionItem
              key={category.id}
              value={`cat-${category.id}`}
              className="rounded-xl border border-[var(--border)] bg-white"
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-semibold text-[var(--brand-heading)]">
                    {category.name ?? category.code}
                  </span>
                  {selectedInCategory > 0 && (
                    <span className="mr-2 rounded-full bg-[var(--konfig-stroke)] px-2 py-0.5 text-xs font-medium text-white">
                      {selectedInCategory} gewählt
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  {options.map((option) => (
                    <AdditionOptionRow
                      key={option.id}
                      option={option}
                      selectedIds={selectedIds}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}

function AdditionOptionRow({
  option,
  selectedIds,
  onToggle,
}: {
  option: AdditionOption;
  selectedIds: number[];
  onToggle: (id: number) => void;
}) {
  const variants = option.variants;

  // Option ohne Sub-Varianten: Die Option selbst ist die wählbare Einheit.
  // Wir nehmen option.external_id als Toggle-ID (qlein-IDs sind zwischen
  // article_additions und article_addition_variants disjoint).
  if (variants.length === 0) {
    const active =
      option.external_id !== null && selectedIds.includes(option.external_id);
    return (
      <AdditionToggle
        name={option.name}
        priceCents={option.price_cents}
        image={option.image}
        active={active}
        onToggle={() =>
          option.external_id !== null && onToggle(option.external_id)
        }
      />
    );
  }

  // Mehrere Varianten: Option als Header + Varianten-Chips.
  // Klick auf die Option selbst schaltet sie an/aus (wie ein Checkbox-Toggle);
  // Varianten-Chips wählen die Ausprägung (max. eine aktiv wird clientseitig
  // nicht erzwungen — die UI macht nur das Tracking).
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-3">
      <p className="mb-2 text-sm font-semibold text-[var(--brand-heading)]">
        {option.name}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {variants.map((v) => {
          const active =
            v.external_id !== null && selectedIds.includes(v.external_id);
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => v.external_id !== null && onToggle(v.external_id)}
              className={`konfig-animate rounded-full border-2 px-3 py-1 text-xs font-medium transition ${
                active
                  ? "border-[var(--konfig-stroke)] bg-[var(--konfig-chip-idle-bg)] text-[var(--brand-heading)]"
                  : "border-[var(--border)] bg-white text-[var(--brand-text)] hover:border-[var(--konfig-stroke-muted)]"
              }`}
              aria-pressed={active}
            >
              {variantLabel(v)}
              {v.price_cents !== null && v.price_cents > 0 && (
                <span className="ml-1 font-semibold text-[var(--brand-primary)]">
                  +{Math.round(v.price_cents / 100)} €
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AdditionToggle({
  name,
  priceCents,
  image,
  active,
  onToggle,
}: {
  name: string;
  priceCents: number | null;
  image: string | null;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`konfig-animate flex w-full items-center gap-3 rounded-xl border-2 bg-white p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--konfig-stroke)] ${
        active
          ? "border-[var(--konfig-stroke)]"
          : "border-[var(--border)] hover:border-[var(--konfig-stroke-muted)]"
      }`}
      aria-pressed={active}
    >
      {image && (
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--konfig-chip-idle-bg)]">
          <Image
            src={image}
            alt=""
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <span className="flex-1 text-sm font-medium">{name}</span>
      {priceCents !== null && priceCents > 0 && (
        <span className="text-sm font-semibold text-[var(--brand-primary)]">
          +{Math.round(priceCents / 100)} €
        </span>
      )}
      <span
        className={`h-5 w-5 rounded-md border-2 transition ${
          active
            ? "border-[var(--konfig-stroke)] bg-[var(--konfig-stroke)]"
            : "border-[var(--border)]"
        }`}
      >
        {active && (
          <svg viewBox="0 0 20 20" fill="white" className="h-full w-full p-0.5">
            <path d="M7.5 13.5L3.5 9.5l1-1 3 3 8-8 1 1z" />
          </svg>
        )}
      </span>
    </button>
  );
}

function variantLabel(v: AdditionVariant): string {
  const first = v.property_values[0];
  return first?.value ?? `Variante ${v.external_id ?? v.id}`;
}

function countSelectedInCategory(
  options: AdditionOption[],
  selectedIds: number[]
): number {
  let n = 0;
  for (const o of options) {
    if (o.variants.length === 0) {
      if (o.external_id !== null && selectedIds.includes(o.external_id)) n++;
    } else {
      for (const v of o.variants) {
        if (v.external_id !== null && selectedIds.includes(v.external_id)) n++;
      }
    }
  }
  return n;
}
