"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Tag } from "lucide-react";
import type { Product } from "@/lib/katalog";
import Viewer360 from "./viewer-360";
import ColorPalette from "./color-palette";
import SpecList from "./spec-list";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const has360 = product.images["360_frames"].length > 0;
  const hasColors = product.images.colors.length > 0;
  const hasSpecs = product.specs.length > 0;
  const hasThumbnail = !!product.images.thumbnail;

  return (
    <div>
      {/* 360 Viewer */}
      {has360 && (
        <Viewer360
          frames={product.images["360_frames"]}
          productName={product.name}
        />
      )}

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Left column: Image + Description + Specs */}
          <div className={hasColors ? "lg:col-span-3" : "lg:col-span-5"}>
            {/* Thumbnail */}
            {hasThumbnail && !has360 && (
              <div
                className="relative mb-8 aspect-[4/3] w-full overflow-hidden rounded-2xl"
                data-animate="scale-up"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 95%, 0 100%)",
                }}
              >
                <Image
                  src={product.images.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority
                />
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mb-8" data-animate="fade-up">
                <h2 className="heading-sub mb-4">Beschreibung</h2>
                <p
                  className="text-base leading-relaxed text-[var(--brand-text)]/80"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {product.description}
                </p>
              </div>
            )}

            {/* Specs */}
            {hasSpecs && (
              <div data-animate="fade-up">
                <SpecList specs={product.specs} />
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2" data-animate="fade-up">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--brand-text)]/70"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right column: Colors */}
          {hasColors && (
            <div className="lg:col-span-2" data-animate="fade-up">
              <ColorPalette colors={product.images.colors} />
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-between" data-animate="fade-up">
          <Link
            href={`/katalog/${product.category_path.join("/")}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Link>

          <Link
            href="/anfrage"
            className="group bg-brand-gradient inline-flex items-center gap-3 rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/25 transition-shadow duration-300 hover:shadow-xl hover:shadow-[var(--brand-primary)]/35"
          >
            Jetzt anfragen
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
