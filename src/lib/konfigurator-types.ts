// Client-Types für den Konfigurator. Spiegeln die Responses der /api/v1/* Routes.
// Quellenrouten: src/app/api/v1/{init,articles,articles/[slug],articles/[slug]/price,inquiries}/*

export type Brand = {
  id: number;
  external_id: number | null;
  name: string;
  slug: string;
  logo_url: string | null;
};

export type Shape = {
  id: number;
  code: string; // "DKL" | "DKR" | "DL" | "DR" | "Fest" | "Kipp"
  name: string;
};

export type ShapeRow = { height: number; shapes: number };

export type Group = {
  id: number;
  external_id: number | null;
  name: string;
  category: number | null;
  shape_configuration: ShapeRow[];
  sort_order: number | null;
};

export type AdditionCategory = {
  id: number;
  code: string;
  name: string | null;
  sort_order: number | null;
};

export type RangeSizes = {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
};

export type InitResponse = {
  brands: Brand[];
  shapes: Shape[];
  groups: Group[];
  addition_categories: AdditionCategory[];
  rangeSizes: RangeSizes;
};

export type ArticleListItem = {
  id: number;
  slug: string;
  name: string;
  external_id: number | null;
  qlein_article_id: number | null;
  uw_value: number | null;
  profile_depth: number | null;
  brand: Brand | null;
  main_properties: Array<{
    short_name: string;
    name: string;
    value: string;
    unit: string | null;
    icon: string | null;
  }>;
  image: string | null;
  base_price_cents: number;
  base_price_eur: number;
  interpolated: boolean;
  warning?: string;
};

export type ArticleListResponse = {
  query: {
    w: number;
    h: number;
    group: number;
    shapes: string[];
    brand: number[];
  };
  group: { id: number; external_id: number | null; name: string };
  count: number;
  results: ArticleListItem[];
};

export type PropertyValue = {
  id: number;
  property_id: number;
  property_name: string;
  property_short_name: string;
  value: string;
  value_code: string | null;
  name: string | null;
  position: number | null;
  image: string | null;
};

export type ArticleVariant = {
  id: number;
  external_id: number | null;
  price_cents: number | null;
  is_default: boolean;
  property_values: PropertyValue[];
};

export type AdditionVariant = {
  id: number;
  external_id: number | null;
  price_cents: number | null;
  is_default: boolean;
  property_values: PropertyValue[];
};

export type AdditionOption = {
  id: number;
  external_id: number | null;
  name: string;
  type_name: string | null;
  image: string | null;
  is_default: boolean;
  price_cents: number | null;
  sort_order: number | null;
  variants: AdditionVariant[];
};

export type ArticleAdditions = Record<
  string,
  {
    category: AdditionCategory;
    options: AdditionOption[];
  }
>;

export type ArticleDetailResponse = {
  id: number;
  external_id: number | null;
  name: string;
  slug: string;
  uw_value: number | null;
  profile_depth: number | null;
  description: string | null;
  brand: Brand | null;
  groups: Array<{
    id: number;
    external_id: number | null;
    name: string;
    qlein_article_id: number | null;
  }>;
  properties: Array<{
    short_name: string;
    name: string;
    value: string;
    unit: string | null;
    icon: string | null;
    is_main: boolean;
    sort_order: number | null;
  }>;
  images: Array<{ url: string; sort_order: number | null; type: string }>;
  additions: ArticleAdditions;
  variants: ArticleVariant[];
  price?: PriceResponse;
};

export type PriceResponse = {
  w?: number;
  h?: number;
  group?: number;
  article_slug?: string;
  base_price_cents: number;
  base_price_eur: number;
  interpolated: boolean;
  warning?: string;
};

export type InquiryInput = {
  article_slug: string;
  width_mm: number;
  height_mm: number;
  group_external_id: number;
  shape_code: string;
  variant_external_id?: number;
  selected_addition_variant_external_ids?: number[];
  total_price_cents?: number;
  contact: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  };
};

export type InquiryCreatedResponse = {
  id: number;
  created_at: string;
  status: string;
};

export const SHAPE_CODES = ["Fest", "DKL", "DKR", "DL", "DR", "Kipp"] as const;
export type ShapeCode = (typeof SHAPE_CODES)[number];
