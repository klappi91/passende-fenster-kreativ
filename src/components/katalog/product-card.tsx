"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  thumbnail?: string;
  href: string;
  badge?: string;
  productCount?: number;
  description?: string;
  className?: string;
  index: number;
}

const clipVariants = [
  "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  "polygon(0 0, 100% 0, 100% 92%, 0 100%)",
  "polygon(0 0, 100% 4%, 100% 100%, 0 96%)",
  "polygon(0 0, 100% 0, 96% 100%, 0 100%)",
  "polygon(4% 0, 100% 0, 100% 100%, 0 100%)",
];

export default function ProductCard({
  name,
  thumbnail,
  href,
  badge,
  productCount,
  description,
  className,
  index,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--brand-primary)]/15 ${className || ""}`}
      data-animate="fade-up"
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
      {/* Image or gradient background */}
      <div
        className="relative h-full min-h-[280px] overflow-hidden"
        style={{
          clipPath: thumbnail ? clipVariants[index % clipVariants.length] : undefined,
        }}
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: thumbnail
              ? "linear-gradient(to top, rgba(43,43,43,0.9) 0%, rgba(43,43,43,0.5) 40%, transparent 70%)"
              : "linear-gradient(to top, rgba(43,43,43,0.95) 0%, rgba(43,43,43,0.4) 50%, rgba(43,43,43,0.15) 100%)",
          }}
        />
      </div>

      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-block rounded-full bg-[var(--brand-primary)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[var(--brand-primary)]/30">
            {badge}
          </span>
        </div>
      )}

      {/* Product count badge */}
      {productCount !== undefined && (
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {productCount} {productCount === 1 ? "Produkt" : "Produkte"}
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
          {name}
        </h3>

        {description && (
          <p
            className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {description}
          </p>
        )}

        {/* Accent line */}
        <div
          className="mt-4 h-0.5 w-12 origin-left transition-all duration-500 group-hover:w-24"
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
  );
}
