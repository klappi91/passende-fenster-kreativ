import katalogData from "@/data/katalog.json";

// --- Types ---

export interface ColorSwatch {
  code: string;
  url: string;
  note: string | null;
}

export interface ProductImage {
  thumbnail: string;
  "360_frames": string[];
  colors: ColorSwatch[];
  other: string[];
}

export interface Product {
  name: string;
  slug: string;
  url: string;
  category_path: string[];
  specs: string[];
  description: string;
  tags: string[];
  images: ProductImage;
}

export interface CategoryNode {
  slug: string;
  label: string;
  fullPath: string[];
  productCount: number;
  children: CategoryNode[];
  products: Product[];
  thumbnail?: string;
}

export type ResolvedPath =
  | { type: "category"; node: CategoryNode; breadcrumbs: string[] }
  | { type: "product"; product: Product; breadcrumbs: string[] }
  | null;

// --- Label Mapping ---

const CATEGORY_LABELS: Record<string, string> = {
  fenster: "Fenster",
  tueren: "Türen",
  tore: "Tore",
  fensterabdeckungen: "Fensterabdeckungen",
  "pvc-fenster": "PVC-Fenster",
  aluminiumfenster: "Aluminiumfenster",
  holzfenster: "Holzfenster",
  aussentueren: "Außentüren",
  garagentore: "Garagentore",
  "aufsatzrolllaeden": "Aufsatzrollladen",
  "fensterlaeden": "Fensterläden",
  "screen-rolllaeden": "Screen-Rollladen",
  "vorbaurolllaeden": "Vorbaurollladen",
  "aluminium-tueren": "Aluminium-Türen",
  "pvc-tueren": "PVC-Türen",
  "holztueren": "Holztüren",
  "despiro-tueren": "Despiro-Türen",
  "despiro-retro-line-tueren": "Despiro Retro Line",
  "pvc-modell-tueren": "PVC-Modell-Türen",
  "s9000": "S9000",
  "s8000": "S8000",
  "ideal-4000": "Ideal 4000",
  "ideal-5000": "Ideal 5000",
  "ideal-7000-nl": "Ideal 7000 NL",
  "ideal-8000": "Ideal 8000",
  "ideal-neo": "Ideal Neo",
  "ekosun-6-nl": "Ekosun 6 NL",
  "ekosun-70": "Ekosun 70",
  "bluevolution-82": "bluEvolution 82",
  "greenevolution-flex": "greenEvolution Flex",
  "naturo-68": "Naturo 68",
  "naturo-68-alu": "Naturo 68 Alu",
  "naturo-80": "Naturo 80",
  "naturo-80-alu": "Naturo 80 Alu",
  "naturo-92": "Naturo 92",
  genesis: "Genesis",
  imperial: "Imperial",
  maxlight: "Maxlight",
  entra: "Entra",
  superial: "Superial",
  "slimline-38": "Slimline 38",
  "elite-xt": "Elite XT",
  "mb-60": "MB-60",
  "mb-79n": "MB-79N",
  "mb-86n": "MB-86N",
  "mb-104-passive": "MB-104 Passive",
  "mb-ferroline": "MB-Ferroline",
  "decalu-88-standard": "Decalu 88 Standard",
  "heroal-vs-z": "Heroal VS Z",
  "garagen-sektionaltore": "Garagen-Sektionaltore",
  cleverbox: "CleverBox",
  "roka-top-2": "Roka-Top 2",
  sk45: "SK45",
  "tore-infiniti": "Tore Infiniti",
  "tore-infiniti-thermo": "Tore Infiniti Thermo",
  "gefraeste-paneele": "Gefräste Paneele",
  "gepraegte-ekogreen-paneele": "Geprägte Ekogreen Paneele",
  "overlay-paneele": "Overlay Paneele",
  "innere-fensterlaeden-von-ekogreen": "Innere Fensterläden von Ekogreen",
};

// --- Helpers ---

export function humanizeSlug(slug: string): string {
  if (CATEGORY_LABELS[slug]) return CATEGORY_LABELS[slug];
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function deduplicateSpecs(specs: string[]): string[] {
  return [...new Set(specs)];
}

// --- Data Access ---

const NON_PRODUCT_SLUGS = new Set(["dienstleistungen", "anfrage"]);

let _products: Product[] | null = null;

export function getAllProducts(): Product[] {
  if (_products) return _products;
  _products = (katalogData.products as Product[]).filter(
    (p) => !NON_PRODUCT_SLUGS.has(p.slug) && p.category_path.length > 0
  );
  return _products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

// --- Category Tree ---

let _tree: CategoryNode[] | null = null;

export function getCategoryTree(): CategoryNode[] {
  if (_tree) return _tree;

  const products = getAllProducts();
  const root: CategoryNode[] = [];

  for (const product of products) {
    let currentLevel = root;
    const path: string[] = [];

    for (let i = 0; i < product.category_path.length; i++) {
      const segment = product.category_path[i];
      path.push(segment);

      let node = currentLevel.find((n) => n.slug === segment);
      if (!node) {
        node = {
          slug: segment,
          label: humanizeSlug(segment),
          fullPath: [...path],
          productCount: 0,
          children: [],
          products: [],
        };
        currentLevel.push(node);
      }

      node.productCount++;

      if (i === product.category_path.length - 1) {
        node.products.push(product);
        if (!node.thumbnail && product.images.thumbnail) {
          node.thumbnail = product.images.thumbnail;
        }
      }

      currentLevel = node.children;
    }
  }

  // Propagate thumbnails up: if a node has no thumbnail, use first child's
  function propagateThumbnails(nodes: CategoryNode[]) {
    for (const node of nodes) {
      propagateThumbnails(node.children);
      if (!node.thumbnail) {
        const childWithThumb = node.children.find((c) => c.thumbnail);
        if (childWithThumb) node.thumbnail = childWithThumb.thumbnail;
      }
    }
  }
  propagateThumbnails(root);

  _tree = root;
  return _tree;
}

export function getNodeAtPath(segments: string[]): CategoryNode | undefined {
  const tree = getCategoryTree();
  let currentLevel = tree;
  let node: CategoryNode | undefined;

  for (const segment of segments) {
    node = currentLevel.find((n) => n.slug === segment);
    if (!node) return undefined;
    currentLevel = node.children;
  }

  return node;
}

// --- Routing ---

export function resolveSlugPath(segments: string[]): ResolvedPath {
  // Try as category first
  const categoryNode = getNodeAtPath(segments);
  if (categoryNode && (categoryNode.children.length > 0 || categoryNode.products.length > 1)) {
    return {
      type: "category",
      node: categoryNode,
      breadcrumbs: segments,
    };
  }

  // Try last segment as product slug
  if (segments.length >= 2) {
    const productSlug = segments[segments.length - 1];
    const categorySegments = segments.slice(0, -1);
    const parentNode = getNodeAtPath(categorySegments);

    if (parentNode) {
      const product = parentNode.products.find((p) => p.slug === productSlug);
      if (product) {
        return {
          type: "product",
          product,
          breadcrumbs: segments,
        };
      }
    }
  }

  // Could be a leaf category with products (e.g., a system with variants)
  if (categoryNode && categoryNode.products.length === 1) {
    return {
      type: "product",
      product: categoryNode.products[0],
      breadcrumbs: segments,
    };
  }

  // Try direct slug lookup as fallback
  const product = getProductBySlug(segments[segments.length - 1]);
  if (product) {
    return {
      type: "product",
      product,
      breadcrumbs: segments,
    };
  }

  return null;
}

// --- Static Paths ---

export function getAllStaticPaths(): string[][] {
  const paths: string[][] = [];
  const tree = getCategoryTree();

  function traverse(nodes: CategoryNode[], prefix: string[]) {
    for (const node of nodes) {
      const currentPath = [...prefix, node.slug];
      paths.push(currentPath);

      // Add product detail paths
      for (const product of node.products) {
        const productPath = [...currentPath, product.slug];
        // Only add if different from category path
        if (productPath.join("/") !== currentPath.join("/")) {
          paths.push(productPath);
        }
      }

      traverse(node.children, currentPath);
    }
  }

  traverse(tree, []);
  return paths;
}

// --- Featured Products ---

export function getFeaturedProducts(count: number): Product[] {
  const products = getAllProducts();

  // Prefer products with 360 frames and good thumbnails
  const withFrames = products.filter(
    (p) => p.images["360_frames"].length > 0 && p.images.thumbnail
  );

  // Pick diverse products (different category_path[2] = different systems)
  const seen = new Set<string>();
  const featured: Product[] = [];

  for (const p of withFrames) {
    const system = p.category_path[2] || p.category_path[1] || p.category_path[0];
    if (!seen.has(system)) {
      seen.add(system);
      featured.push(p);
      if (featured.length >= count) break;
    }
  }

  // Fill up if not enough diverse products
  if (featured.length < count) {
    for (const p of withFrames) {
      if (!featured.includes(p)) {
        featured.push(p);
        if (featured.length >= count) break;
      }
    }
  }

  return featured;
}

// --- Utilities ---

export function getProductPath(product: Product): string {
  return `/katalog/${product.category_path.join("/")}/${product.slug}`;
}

export function getCategoryPath(node: CategoryNode): string {
  return `/katalog/${node.fullPath.join("/")}`;
}

export function getMainCategories(): CategoryNode[] {
  return getCategoryTree();
}
