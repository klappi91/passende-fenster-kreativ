import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScrollAnimations from "@/components/scroll-animations";
import CategoryHero from "@/components/katalog/category-hero";
import CategoryView from "./category-view";
import ProductDetail from "@/components/katalog/product-detail";
import {
  resolveSlugPath,
  getAllStaticPaths,
  humanizeSlug,
} from "@/lib/katalog";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const paths = getAllStaticPaths();
  return paths.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveSlugPath(slug);

  if (!resolved) {
    return { title: "Nicht gefunden – Passende-Fenster.de" };
  }

  if (resolved.type === "category") {
    return {
      title: `${resolved.node.label} – Produktkatalog – Passende-Fenster.de`,
      description: `${resolved.node.productCount} Produkte in der Kategorie ${resolved.node.label}. Entdecken Sie unser Sortiment.`,
    };
  }

  return {
    title: `${resolved.product.name} – Passende-Fenster.de`,
    description: resolved.product.description?.slice(0, 160) || `${resolved.product.name} – Details und Konfiguration`,
  };
}

export default async function KatalogSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolveSlugPath(slug);

  if (!resolved) notFound();

  if (resolved.type === "category") {
    const node = resolved.node;
    const subtitle =
      node.children.length > 0
        ? `${node.children.length} Unterkategorien`
        : `${node.products.length} Produkte`;

    return (
      <main id="main">
        <ScrollAnimations />
        <CategoryHero
          title={node.label}
          subtitle={subtitle}
          segments={resolved.breadcrumbs}
          productCount={node.productCount}
        />
        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
          <CategoryView node={node} />
        </section>
      </main>
    );
  }

  // Product detail
  const product = resolved.product;
  const breadcrumbSegments = [...product.category_path, product.slug];

  return (
    <main id="main">
      <ScrollAnimations />
      <CategoryHero
        title={product.name}
        subtitle={product.tags.join(" · ") || undefined}
        segments={breadcrumbSegments}
      />
      <ProductDetail product={product} />
    </main>
  );
}
