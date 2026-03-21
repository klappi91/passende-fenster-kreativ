import Breadcrumbs from "./breadcrumbs";

interface CategoryHeroProps {
  title: string;
  subtitle?: string;
  segments: string[];
  productCount?: number;
}

export default function CategoryHero({
  title,
  subtitle,
  segments,
  productCount,
}: CategoryHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-darker)] py-16 sm:py-20">
      {/* Decorative gradient */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-1/2 opacity-10"
        style={{
          background:
            "radial-gradient(ellipse at top right, var(--brand-primary) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mb-6">
          <Breadcrumbs segments={segments} currentLabel={title} />
        </div>

        <h1 className="heading-section text-white">{title}</h1>

        {subtitle && (
          <p
            className="mt-4 max-w-2xl text-lg text-white/70"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {subtitle}
          </p>
        )}

        {productCount !== undefined && (
          <div className="mt-4">
            <span className="inline-block rounded-full bg-[var(--brand-primary)]/20 px-4 py-1.5 text-sm font-medium text-[var(--brand-primary)]">
              {productCount} {productCount === 1 ? "Produkt" : "Produkte"}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
