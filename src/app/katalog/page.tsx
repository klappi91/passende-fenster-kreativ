import type { Metadata } from "next";
import ScrollAnimations from "@/components/scroll-animations";
import CategoryOverviewGrid from "@/components/katalog/category-overview-grid";
import { getMainCategories } from "@/lib/katalog";

export const metadata: Metadata = {
  title: "Produktkatalog – Passende-Fenster.de",
  description:
    "Entdecken Sie unser komplettes Sortiment: Fenster, Türen, Tore und Fensterabdeckungen von führenden Herstellern.",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  fenster: "PVC-, Aluminium- und Holzfenster von führenden Herstellern",
  tueren: "Außentüren in Aluminium, PVC und Holz",
  tore: "Garagen-Sektionaltore für jeden Bedarf",
  fensterabdeckungen: "Rollladen, Fensterläden und Screen-Systeme",
};

export default function KatalogPage() {
  const categories = getMainCategories();

  return (
    <>
      <ScrollAnimations />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--brand-darker)] pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div
          className="pointer-events-none absolute top-0 right-0 h-full w-1/2 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at top right, var(--brand-primary) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h1 className="heading-section text-white" data-animate="fade-up">
            Unser <em style={{ color: 'var(--brand-primary)', fontStyle: 'italic', fontWeight: 500 }}>Produktkatalog</em>
          </h1>
          <p
            className="mt-4 max-w-2xl text-lg text-white/70 sm:text-xl"
            style={{ fontFamily: "var(--font-sans)" }}
            data-animate="fade-up"
          >
            Über 1.200 Produkte von führenden europäischen Herstellern — Fenster,
            Türen, Tore und mehr.
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24 lg:px-12">
        <CategoryOverviewGrid
          categories={categories}
          descriptions={CATEGORY_DESCRIPTIONS}
        />
      </section>
    </>
  );
}
