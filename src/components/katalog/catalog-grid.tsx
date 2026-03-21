"use client";

import ProductCard from "./product-card";
import type { CategoryNode, Product } from "@/lib/katalog";
import { getCategoryPath, getProductPath } from "@/lib/katalog";

type GridItem =
  | { type: "category"; node: CategoryNode }
  | { type: "product"; product: Product };

interface CatalogGridProps {
  items: GridItem[];
}

export default function CatalogGrid({ items }: CatalogGridProps) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-[var(--brand-text)]/60">
          Keine Produkte in dieser Kategorie.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid auto-rows-[320px] grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[380px] lg:grid-cols-3"
      data-animate="stagger"
    >
      {items.map((item, i) => {
        const isFirst = i === 0 && items.length >= 4;
        const isTall = i === 2 && items.length >= 5;

        const wrapperClassName = [
          isFirst ? "sm:col-span-2 lg:row-span-1" : "",
          isTall ? "lg:row-span-2" : "",
        ]
          .filter(Boolean)
          .join(" ");

        if (item.type === "category") {
          const node = item.node;
          return (
            <div key={node.fullPath.join("/")} className={wrapperClassName}>
              <ProductCard
                name={node.label}
                thumbnail={node.thumbnail}
                href={getCategoryPath(node)}
                productCount={node.productCount}
                className="h-full"
                index={i}
              />
            </div>
          );
        }

        const product = item.product;
        return (
          <div key={product.slug} className={wrapperClassName}>
            <ProductCard
              name={product.name}
              thumbnail={product.images.thumbnail}
              href={getProductPath(product)}
              badge={product.tags[0]}
              description={product.description?.slice(0, 100)}
              className="h-full"
              index={i}
            />
          </div>
        );
      })}
    </div>
  );
}
