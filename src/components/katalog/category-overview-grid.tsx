"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CategoryNode } from "@/lib/katalog";
import { getCategoryPath } from "@/lib/katalog";

interface CategoryOverviewGridProps {
  categories: CategoryNode[];
  descriptions: Record<string, string>;
}

export default function CategoryOverviewGrid({
  categories,
  descriptions,
}: CategoryOverviewGridProps) {
  return (
    <div
      className="grid auto-rows-[320px] grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[400px]"
      data-animate="stagger"
    >
      {categories.map((cat, i) => (
        <Link
          key={cat.slug}
          href={getCategoryPath(cat)}
          className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--brand-primary)]/15 ${
            i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
          }`}
          style={{
            transform: "perspective(800px) rotateY(0deg) rotateX(0deg)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "perspective(800px) rotateY(-2deg) rotateX(1deg) scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
          }}
        >
          {/* Background image */}
          {cat.thumbnail ? (
            <Image
              src={cat.thumbnail}
              alt={cat.label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
              }}
            />
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(43,43,43,0.95) 0%, rgba(43,43,43,0.5) 50%, transparent 80%)",
            }}
          />

          {/* Product count badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {cat.productCount} Produkte
            </span>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
            <h2
              className="font-display text-3xl font-bold text-white sm:text-4xl"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
            >
              {cat.label}
            </h2>

            <p
              className="mt-2 text-sm text-white/70 sm:text-base"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {descriptions[cat.slug] || ""}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-primary)] transition-all group-hover:gap-3">
              Entdecken
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>

            {/* Accent line */}
            <div
              className="mt-3 h-0.5 w-12 origin-left transition-all duration-500 group-hover:w-24"
              style={{
                background:
                  "linear-gradient(to right, var(--brand-primary), var(--brand-secondary))",
              }}
            />
          </div>

          {/* Decorative corner */}
          <div
            className="absolute top-0 right-0 h-20 w-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(225deg, var(--brand-primary) 0%, transparent 70%)",
              borderRadius: "0 1rem 0 0",
            }}
          />
        </Link>
      ))}
    </div>
  );
}
