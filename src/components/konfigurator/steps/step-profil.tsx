"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useConfigStore } from "../store";
import { useArticles } from "@/lib/konfigurator-api";
import type { InitResponse, ArticleListItem } from "@/lib/konfigurator-types";
import { AlertCircle, Info } from "lucide-react";

type SortMode = "price-asc" | "uw-asc";

export function StepProfil({ init }: { init: InitResponse }) {
  const {
    width,
    height,
    groupExternalId,
    articleSlug,
    setArticleSlug,
    setStep,
    setMaterialRequest,
  } = useConfigStore();

  const [brandFilter, setBrandFilter] = useState<number[]>([]);
  const [sort, setSort] = useState<SortMode>("uw-asc");

  const articles = useArticles({
    w: width,
    h: height,
    groupExternalId,
    brandExternalIds: brandFilter.length ? brandFilter : undefined,
  });

  const sortedResults = useMemo(() => {
    if (!articles.data?.results) return [];
    const list = [...articles.data.results];
    if (sort === "price-asc") {
      list.sort((a, b) => a.base_price_cents - b.base_price_cents);
    } else {
      list.sort(
        (a, b) => (a.uw_value ?? Infinity) - (b.uw_value ?? Infinity)
      );
    }
    return list;
  }, [articles.data, sort]);

  // Best-Empfehlung: günstigstes Profil mit Uw < 0.8
  const bestRecommendedId = useMemo(() => {
    if (!articles.data?.results) return null;
    const cheap = [...articles.data.results]
      .filter((a) => a.uw_value !== null && a.uw_value < 0.8)
      .sort((a, b) => a.base_price_cents - b.base_price_cents);
    return cheap[0]?.id ?? null;
  }, [articles.data]);

  const toggleBrand = (id: number) => {
    setBrandFilter((b) =>
      b.includes(id) ? b.filter((x) => x !== id) : [...b, id]
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-12">
      <p className="heading-price-label">Schritt 3 von 5</p>
      <h2 className="heading-konfig-step mt-2">
        Passende Profile
        {articles.data && <span className="text-[var(--muted-foreground)]"> ({articles.data.count})</span>}
      </h2>
      <p className="text-caption mt-2 max-w-xl">
        Alle Profile, die zu Ihren Maßen ({width} × {height} mm,{" "}
        {articles.data?.group.name}) passen — sortiert nach{" "}
        {sort === "uw-asc" ? "Wärmedämmung" : "Preis"}.
      </p>

      {/* Filter + Sort */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-caption">Hersteller:</span>
        {init.brands.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => b.external_id !== null && toggleBrand(b.external_id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              b.external_id !== null && brandFilter.includes(b.external_id)
                ? "border-[var(--konfig-stroke)] bg-[var(--konfig-chip-idle-bg)] text-[var(--brand-heading)]"
                : "border-[var(--border)] bg-white text-[var(--brand-text)] hover:border-[var(--konfig-stroke-muted)]"
            }`}
          >
            {b.name}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-caption">Sortieren:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="rounded-lg border border-[var(--border)] bg-white px-2 py-1 text-xs font-medium"
          >
            <option value="uw-asc">Wärmedämmung (beste zuerst)</option>
            <option value="price-asc">Preis (niedrigster zuerst)</option>
          </select>
        </div>
      </div>

      {/* Liste */}
      <div className="mt-6 space-y-3">
        {articles.isLoading && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
            ))}
          </>
        )}

        {articles.isError && (
          <div className="rounded-2xl border-2 border-[var(--destructive)]/30 bg-white p-6">
            <AlertCircle className="mb-2 h-5 w-5 text-[var(--destructive)]" />
            <p className="text-sm text-[var(--destructive)]">
              Profile konnten nicht geladen werden:{" "}
              {articles.error instanceof Error
                ? articles.error.message
                : "Verbindung prüfen"}
            </p>
            <button
              onClick={() => articles.refetch()}
              className="mt-3 text-sm font-medium text-[var(--brand-primary)] underline"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {!articles.isLoading && sortedResults.length === 0 && (
          <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center">
            <p className="text-caption">
              Kein Standard-Profil für diese Kombination. Sonderanfrage stellen
              — wir erstellen ein individuelles Angebot.
            </p>
            <button
              onClick={() => setStep(5)}
              className="mt-4 rounded-full border-2 border-[var(--brand-primary)] px-6 py-2 text-sm font-semibold text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5"
            >
              Zur Sonderanfrage
            </button>
          </div>
        )}

        {sortedResults.map((a) => (
          <ArticleCard
            key={a.id}
            article={a}
            active={a.slug === articleSlug}
            isBest={a.id === bestRecommendedId}
            onSelect={() => setArticleSlug(a.slug)}
          />
        ))}

        {/* Alu/Holz-Lead-Link */}
        {!articles.isLoading && sortedResults.length > 0 && (
          <div className="mt-8 rounded-xl bg-[var(--konfig-chip-idle-bg)] p-4">
            <p className="text-caption">
              Nicht das Richtige dabei?{" "}
              <button
                type="button"
                onClick={() => {
                  setMaterialRequest("alu");
                  setStep(5);
                }}
                className="font-medium text-[var(--brand-primary)] underline"
              >
                Alu-Fenster
              </button>{" "}
              und{" "}
              <button
                type="button"
                onClick={() => {
                  setMaterialRequest("holz");
                  setStep(5);
                }}
                className="font-medium text-[var(--brand-primary)] underline"
              >
                Holz-Fenster
              </button>{" "}
              auf Anfrage.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--brand-primary)]"
        >
          ← Zurück
        </button>
        <button
          type="button"
          disabled={!articleSlug}
          onClick={() => setStep(4)}
          className="bg-brand-gradient konfig-animate inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          Weiter zur Konfiguration →
        </button>
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  active,
  isBest,
  onSelect,
}: {
  article: ArticleListItem;
  active: boolean;
  isBest: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`konfig-animate group relative flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--konfig-stroke)] focus-visible:ring-offset-2 ${
        active
          ? "border-[var(--konfig-stroke)] shadow-xl"
          : "border-[var(--border)] shadow-sm"
      }`}
      aria-pressed={active}
    >
      {isBest && (
        <span className="bg-brand-gradient absolute -top-2 left-5 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow">
          ★ Beste Empfehlung
        </span>
      )}

      {/* Brand-Logo */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--konfig-chip-idle-bg)]">
        {article.brand?.logo_url ? (
          <Image
            src={article.brand.logo_url}
            alt={article.brand.name}
            width={40}
            height={40}
            className="h-auto max-h-10 w-auto max-w-10 object-contain"
          />
        ) : (
          <span className="text-xs font-bold">
            {article.brand?.name?.[0] ?? "?"}
          </span>
        )}
      </div>

      {/* Name + Properties */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[var(--muted-foreground)]">
          {article.brand?.name}
        </p>
        <h3
          className="truncate text-base font-bold text-[var(--brand-heading)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {article.name}
        </h3>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[var(--muted-foreground)]">
          {article.uw_value !== null && (
            <span>Uw {article.uw_value.toFixed(2)} W/m²K</span>
          )}
          {article.profile_depth && <span>{article.profile_depth} mm Bautiefe</span>}
          {article.main_properties
            .filter((p) => p.short_name !== "Uw")
            .slice(0, 2)
            .map((p) => (
              <span key={p.short_name}>
                {p.value}
                {p.unit ? ` ${p.unit}` : ""}
              </span>
            ))}
        </div>
      </div>

      {/* Preis */}
      <div className="shrink-0 text-right">
        <p className="heading-price-label text-[10px]">ab</p>
        <p
          className="text-2xl font-bold text-[var(--konfig-price)]"
          style={{
            fontFamily: "var(--font-display)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(article.base_price_eur)} €
        </p>
        {article.interpolated && (
          <p className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] text-[var(--muted-foreground)]">
            <Info className="h-3 w-3" /> ≈
          </p>
        )}
      </div>
    </button>
  );
}
