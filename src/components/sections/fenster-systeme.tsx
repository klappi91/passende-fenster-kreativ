"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts, getProductPath } from "@/lib/katalog";
import type { Product } from "@/lib/katalog";

const featured = getFeaturedProducts(6);

const clipVariants = [
  "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  "polygon(0 0, 100% 0, 100% 92%, 0 100%)",
  "polygon(0 0, 100% 4%, 100% 100%, 0 96%)",
  "polygon(0 0, 100% 0, 96% 100%, 0 100%)",
  "polygon(4% 0, 100% 0, 100% 100%, 0 100%)",
];

function GradientPlaceholder() {
  return (
    <div
      className="absolute inset-0 opacity-20"
      style={{
        background:
          "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
      }}
    />
  );
}

function ProductCard({
  product,
  className,
  index,
}: {
  product: Product;
  className?: string;
  index: number;
}) {
  const hasImage = !!product.images.thumbnail;
  const brand = product.tags[0] || product.category_path[2] || "";

  return (
    <Link
      href={getProductPath(product)}
      className={`group relative block overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--brand-primary)]/15 ${className || ""}`}
      data-animate="fade-up"
      style={{
        transform: "perspective(800px) rotateY(0deg) rotateX(0deg)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform =
          "perspective(800px) rotateY(-2deg) rotateX(1deg) scale(1.03)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform =
          "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
      }}
    >
      {/* Image or gradient background */}
      <div
        className="relative h-full min-h-[280px] overflow-hidden"
        style={{
          clipPath: hasImage
            ? clipVariants[index % clipVariants.length]
            : undefined,
        }}
      >
        {hasImage ? (
          <Image
            src={product.images.thumbnail}
            alt={`${brand} ${product.name}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <GradientPlaceholder />
        )}

        {/* Overlay gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: hasImage
              ? "linear-gradient(to top, rgba(43,43,43,0.9) 0%, rgba(43,43,43,0.5) 40%, transparent 70%)"
              : "linear-gradient(to top, rgba(43,43,43,0.95) 0%, rgba(43,43,43,0.4) 50%, rgba(43,43,43,0.15) 100%)",
          }}
        />
      </div>

      {/* Brand badge */}
      {brand && (
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-block rounded-full bg-[var(--brand-primary)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[var(--brand-primary)]/30">
            {brand}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <h3
          className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl"
          style={{
            marginLeft: "-2px",
            textShadow: "0 2px 12px rgba(0,0,0,0.4)",
          }}
        >
          {product.name}
        </h3>
        <p
          className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {product.description?.slice(0, 120)}
          {product.description && product.description.length > 120 ? "..." : ""}
        </p>

        {/* Accent line */}
        <div
          className="mt-4 h-0.5 w-12 origin-left transition-all duration-500 group-hover:w-24"
          style={{
            background:
              "linear-gradient(to right, var(--brand-primary), var(--brand-secondary))",
          }}
        />
      </div>

      {/* Decorative corner element */}
      <div
        className="absolute top-0 right-0 h-20 w-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(225deg, var(--brand-primary) 0%, transparent 70%)",
          borderRadius: "0 1rem 0 0",
        }}
      />
    </Link>
  );
}

export default function FensterSysteme() {
  return (
    <section
      id="fenster-systeme"
      className="relative overflow-hidden bg-white py-24 sm:py-32"
    >
      {/* Subtle background decoration */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-96 w-96 opacity-5"
        style={{
          background:
            "radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="mb-16 max-w-3xl sm:mb-20">
          <h2 className="heading-section text-balance">
            Unsere{" "}
            <span className="text-gradient">Fenster-Systeme</span>
          </h2>
          <p
            className="mt-4 text-lg text-[var(--brand-text)]/70 sm:text-xl"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Profile von führenden Herstellern für höchste Qualität
          </p>
        </div>

        {/* Creative asymmetric grid */}
        <div className="grid auto-rows-[320px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[380px]">
          {/* First product — featured large, spans 2 cols on lg */}
          {featured[0] && (
            <div className="sm:col-span-2 lg:row-span-1">
              <ProductCard
                product={featured[0]}
                className="h-full"
                index={0}
              />
            </div>
          )}

          {/* Second product */}
          {featured[1] && (
            <div className="lg:row-span-1">
              <ProductCard
                product={featured[1]}
                className="h-full"
                index={1}
              />
            </div>
          )}

          {/* Third product — tall on lg */}
          {featured[2] && (
            <div className="lg:row-span-2">
              <ProductCard
                product={featured[2]}
                className="h-full"
                index={2}
              />
            </div>
          )}

          {/* Fourth product */}
          {featured[3] && (
            <div className="lg:row-span-1">
              <ProductCard
                product={featured[3]}
                className="h-full"
                index={3}
              />
            </div>
          )}

          {/* Fifth product */}
          {featured[4] && (
            <div className="lg:row-span-1">
              <ProductCard
                product={featured[4]}
                className="h-full"
                index={4}
              />
            </div>
          )}

          {/* Sixth product (new) */}
          {featured[5] && (
            <div className="sm:col-span-2 lg:col-span-1 lg:row-span-1">
              <ProductCard
                product={featured[5]}
                className="h-full"
                index={5}
              />
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center sm:mt-20">
          <Link
            href="/katalog"
            className="group/cta inline-flex items-center gap-3 rounded-xl bg-brand-gradient px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/25 transition-all duration-300 hover:gap-5 hover:shadow-xl hover:shadow-[var(--brand-primary)]/35"
          >
            Alle Produkte im Katalog
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
