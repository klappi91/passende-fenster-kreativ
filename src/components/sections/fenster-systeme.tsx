"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Product {
  name: string;
  brand: string;
  description: string;
  image?: string;
  featured?: boolean;
}

const products: Product[] = [
  {
    name: "Synego",
    brand: "Schüco",
    description: "Premium-Profil mit hervorragender Wärmedämmung",
    image: "/images/synego.png",
    featured: true,
  },
  {
    name: "S9000",
    brand: "Gealan",
    description: "Hochleistungsprofil mit 6-Kammer-System",
  },
  {
    name: "Energeto",
    brand: "Aluplast",
    description: "Energieeffizientes Profil für Passivhäuser",
    image: "/images/energeto-neo-program.png",
    featured: true,
  },
  {
    name: "bluEvolution 92",
    brand: "Deceuninck",
    description: "92mm Bautiefe für maximale Isolation",
    image: "/images/bluevolution92-program-deutschland.png",
  },
  {
    name: "Streamline 76",
    brand: "Salamander",
    description: "Schlankes Design mit 76mm Bautiefe",
  },
];

function GradientPlaceholder({ brand }: { brand: string }) {
  // Vary gradient angle per brand for visual diversity
  const gradients: Record<string, string> = {
    Gealan:
      "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 50%, var(--brand-secondary) 100%)",
    Salamander:
      "linear-gradient(225deg, var(--brand-secondary) 0%, var(--brand-accent) 60%, var(--brand-primary) 100%)",
  };

  return (
    <div
      className="absolute inset-0 opacity-20"
      style={{
        background:
          gradients[brand] ||
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
  const hasImage = !!product.image;
  // Alternate clip-path on certain cards for visual variety
  const clipVariants = [
    "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    "polygon(0 0, 100% 0, 100% 92%, 0 100%)",
    "polygon(0 0, 100% 4%, 100% 100%, 0 96%)",
    "polygon(0 0, 100% 0, 96% 100%, 0 100%)",
    "polygon(4% 0, 100% 0, 100% 100%, 0 100%)",
  ];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--brand-primary)]/15 ${className || ""}`}
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
          clipPath: hasImage ? clipVariants[index % clipVariants.length] : undefined,
        }}
      >
        {hasImage ? (
          <Image
            src={product.image!}
            alt={`${product.brand} ${product.name}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <GradientPlaceholder brand={product.brand} />
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

      {/* Brand badge — overlaps top edge of content area */}
      <div className="absolute top-4 left-4 z-20">
        <span className="inline-block rounded-full bg-[var(--brand-primary)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[var(--brand-primary)]/30">
          {product.brand}
        </span>
      </div>

      {/* Content — positioned at bottom, overlapping the card edge */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        {/* Product name — large, breaking out of visual boundary */}
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
          className="mt-2 text-sm leading-relaxed text-white/80"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {product.description}
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
    </div>
  );
}

export default function FensterSysteme() {
  return (
    <section id="fenster-systeme" className="relative overflow-hidden bg-white py-24 sm:py-32">
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
          {/* Schüco Synego — featured large, spans 2 cols on lg */}
          <div className="sm:col-span-2 lg:row-span-1">
            <ProductCard
              product={products[0]}
              className="h-full"
              index={0}
            />
          </div>

          {/* Gealan S9000 — standard */}
          <div className="lg:row-span-1">
            <ProductCard
              product={products[1]}
              className="h-full"
              index={1}
            />
          </div>

          {/* Aluplast Energeto — featured, tall on lg */}
          <div className="lg:row-span-2">
            <ProductCard
              product={products[2]}
              className="h-full"
              index={2}
            />
          </div>

          {/* Deceuninck bluEvolution 92 */}
          <div className="lg:row-span-1">
            <ProductCard
              product={products[3]}
              className="h-full"
              index={3}
            />
          </div>

          {/* Salamander Streamline 76 */}
          <div className="lg:row-span-1">
            <ProductCard
              product={products[4]}
              className="h-full"
              index={4}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center sm:mt-20">
          <a
            href="#konfigurator"
            className="group/cta inline-flex items-center gap-3 rounded-xl bg-brand-gradient px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/25 transition-all duration-300 hover:gap-5 hover:shadow-xl hover:shadow-[var(--brand-primary)]/35"
          >
            Alle Fenster im Konfigurator
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
