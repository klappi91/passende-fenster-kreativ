"use client";

import { useState } from "react";
import CatalogGrid from "@/components/katalog/catalog-grid";
import ProductFilter from "@/components/katalog/product-filter";
import type { CategoryNode, Product } from "@/lib/katalog";

interface CategoryViewProps {
  node: CategoryNode;
}

export default function CategoryView({ node }: CategoryViewProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(
    node.products
  );

  const hasSubcategories = node.children.length > 0;
  const hasProducts = node.products.length > 0;
  const showFilter = hasProducts && !hasSubcategories && node.products.length > 5;

  // Build grid items
  const items = hasSubcategories
    ? node.children.map((child) => ({
        type: "category" as const,
        node: child,
      }))
    : filteredProducts.map((product) => ({
        type: "product" as const,
        product,
      }));

  return (
    <>
      {showFilter && (
        <ProductFilter
          products={node.products}
          onFilter={setFilteredProducts}
        />
      )}
      <CatalogGrid items={items} />
    </>
  );
}
