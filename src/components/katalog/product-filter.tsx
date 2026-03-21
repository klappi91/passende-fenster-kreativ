"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/katalog";

interface ProductFilterProps {
  products: Product[];
  onFilter: (filtered: Product[]) => void;
}

export default function ProductFilter({ products, onFilter }: ProductFilterProps) {
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    for (const p of products) {
      for (const tag of p.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
    return [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [products]);

  const toggleTag = (tag: string) => {
    const next = new Set(activeTags);
    if (next.has(tag)) {
      next.delete(tag);
    } else {
      next.add(tag);
    }
    setActiveTags(next);

    if (next.size === 0) {
      onFilter(products);
    } else {
      onFilter(
        products.filter((p) => p.tags.some((t) => next.has(t)))
      );
    }
  };

  const clearFilter = () => {
    setActiveTags(new Set());
    onFilter(products);
  };

  if (allTags.length <= 1) return null;

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button
        onClick={clearFilter}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          activeTags.size === 0
            ? "bg-[var(--brand-primary)] text-white"
            : "border border-[var(--border)] text-[var(--brand-text)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
        }`}
      >
        Alle
      </button>
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTags.has(tag)
              ? "bg-[var(--brand-primary)] text-white"
              : "border border-[var(--border)] text-[var(--brand-text)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
