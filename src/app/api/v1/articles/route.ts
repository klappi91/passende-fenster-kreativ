import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabase/server";
import { storagePathToPublicUrl } from "@/lib/storage";
import { interpolatePrice, type PricePoint } from "@/lib/price-interpolation";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  w: z.coerce.number().int().min(100).max(5000),
  h: z.coerce.number().int().min(100).max(5000),
  group: z.coerce.number().int().positive(),
  shapes: z.array(z.string()).optional(),
  brand: z.array(z.coerce.number().int().positive()).optional(),
});

function parseQuery(url: URL) {
  // Next.js' URLSearchParams only returns the first value for .get; we want multi-value.
  const shapes = url.searchParams.getAll("shapes[]").concat(url.searchParams.getAll("shapes"));
  const brand = url.searchParams.getAll("brand[]").concat(url.searchParams.getAll("brand"));
  return QuerySchema.safeParse({
    w: url.searchParams.get("w"),
    h: url.searchParams.get("h"),
    group: url.searchParams.get("group"),
    shapes: shapes.length ? shapes : undefined,
    brand: brand.length ? brand : undefined,
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = parseQuery(url);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { w, h, group: groupExternalId, shapes, brand: brandExternalIds } = parsed.data;
  const supabase = getServerSupabase();

  // Resolve group.external_id -> group.id
  const { data: groupRow, error: groupErr } = await supabase
    .from("groups")
    .select("id, external_id, name")
    .eq("external_id", groupExternalId)
    .maybeSingle();
  if (groupErr) {
    return NextResponse.json({ error: "Database error", detail: groupErr.message }, { status: 500 });
  }
  if (!groupRow) {
    return NextResponse.json(
      { error: `Unknown group external_id ${groupExternalId}` },
      { status: 404 }
    );
  }
  const groupId = groupRow.id;

  // Articles mapped to this group
  const { data: mappings, error: mapErr } = await supabase
    .from("article_group_mappings")
    .select("article_id, qlein_article_id")
    .eq("group_id", groupId);
  if (mapErr) {
    return NextResponse.json({ error: "Database error", detail: mapErr.message }, { status: 500 });
  }
  const articleIds = (mappings ?? []).map((m) => m.article_id);
  if (!articleIds.length) {
    return NextResponse.json({
      query: { w, h, group: groupExternalId, shapes: shapes ?? [], brand: brandExternalIds ?? [] },
      group: { id: groupRow.id, external_id: groupRow.external_id, name: groupRow.name },
      count: 0,
      results: [],
    });
  }

  // Load articles, brands, properties (main), first image, all price points in one go
  const articlesQuery = supabase
    .from("articles")
    .select(
      "id, external_id, name, slug, uw_value, profile_depth, description, brand_id"
    )
    .in("id", articleIds);
  const brandsQuery = supabase.from("brands").select("id, external_id, name, slug, logo_url");
  const propsQuery = supabase
    .from("article_properties")
    .select("article_id, short_name, name, value, unit, icon, is_main, sort_order")
    .in("article_id", articleIds);
  const imagesQuery = supabase
    .from("article_images")
    .select("article_id, storage_path, sort_order, type")
    .in("article_id", articleIds)
    .in("type", ["article", "thumbnail"])
    .order("sort_order", { ascending: true });
  const pricesQuery = supabase
    .from("article_price_points")
    .select("article_id, width_mm, height_mm, base_price_cents")
    .in("article_id", articleIds)
    .eq("group_id", groupId);

  const [articlesRes, brandsRes, propsRes, imagesRes, pricesRes] = await Promise.all([
    articlesQuery,
    brandsQuery,
    propsQuery,
    imagesQuery,
    pricesQuery,
  ]);
  for (const r of [articlesRes, brandsRes, propsRes, imagesRes, pricesRes]) {
    if (r.error) {
      return NextResponse.json(
        { error: "Database error", detail: r.error.message },
        { status: 500 }
      );
    }
  }

  const brandsById = new Map((brandsRes.data ?? []).map((b) => [b.id, b]));
  const propsByArticle = new Map<number, typeof propsRes.data>();
  for (const p of propsRes.data ?? []) {
    if (!propsByArticle.has(p.article_id)) propsByArticle.set(p.article_id, []);
    propsByArticle.get(p.article_id)!.push(p);
  }
  type ImageRow = NonNullable<typeof imagesRes.data>[number];
  const imageByArticle = new Map<number, ImageRow>();
  for (const img of imagesRes.data ?? []) {
    if (img.article_id && !imageByArticle.has(img.article_id)) imageByArticle.set(img.article_id, img);
  }
  const pricesByArticle = new Map<number, PricePoint[]>();
  for (const pp of pricesRes.data ?? []) {
    if (!pricesByArticle.has(pp.article_id)) pricesByArticle.set(pp.article_id, []);
    pricesByArticle.get(pp.article_id)!.push({
      width_mm: pp.width_mm,
      height_mm: pp.height_mm,
      base_price_cents: pp.base_price_cents,
    });
  }
  const qleinIdByArticle = new Map((mappings ?? []).map((m) => [m.article_id, m.qlein_article_id]));

  // Build results
  const brandFilter = brandExternalIds && brandExternalIds.length ? new Set(brandExternalIds) : null;

  type ResultRow = {
    id: number;
    slug: string;
    name: string;
    external_id: number | null;
    qlein_article_id: number | null;
    uw_value: number | null;
    profile_depth: number | null;
    brand: {
      id: number;
      external_id: number | null;
      name: string;
      slug: string;
      logo_url: string | null;
    } | null;
    main_properties: Array<{ short_name: string; name: string; value: string; unit: string | null; icon: string | null }>;
    image: string | null;
    base_price_cents: number;
    base_price_eur: number;
    interpolated: boolean;
    warning?: string;
  };

  const results: ResultRow[] = [];
  for (const a of articlesRes.data ?? []) {
    const brand = brandsById.get(a.brand_id) ?? null;
    if (brandFilter && (!brand || brand.external_id === null || !brandFilter.has(brand.external_id))) {
      continue;
    }
    const points = pricesByArticle.get(a.id) ?? [];
    const price = interpolatePrice(points, w, h);
    if (!price) continue; // no price data → skip

    const props = (propsByArticle.get(a.id) ?? [])
      .slice()
      .sort((x, y) => (x.sort_order ?? 0) - (y.sort_order ?? 0));
    const mainProps = props
      .filter((p) => p.is_main)
      .map((p) => ({ short_name: p.short_name, name: p.name, value: p.value, unit: p.unit, icon: p.icon }));
    // If nothing is marked main (only Uw is typically main), include Uw as fallback first highlight
    const highlights = mainProps.length
      ? mainProps
      : props
          .filter((p) => p.short_name === "Uw")
          .map((p) => ({ short_name: p.short_name, name: p.name, value: p.value, unit: p.unit, icon: p.icon }));

    const img = imageByArticle.get(a.id) ?? null;
    results.push({
      id: a.id,
      slug: a.slug,
      name: a.name,
      external_id: a.external_id,
      qlein_article_id: qleinIdByArticle.get(a.id) ?? null,
      uw_value: a.uw_value !== null ? Number(a.uw_value) : null,
      profile_depth: a.profile_depth,
      brand: brand
        ? {
            id: brand.id,
            external_id: brand.external_id,
            name: brand.name,
            slug: brand.slug,
            logo_url: storagePathToPublicUrl(brand.logo_url),
          }
        : null,
      main_properties: highlights,
      image: img ? storagePathToPublicUrl(img.storage_path) : null,
      base_price_cents: price.base_price_cents,
      base_price_eur: price.base_price_eur,
      interpolated: price.interpolated,
      warning: price.warning,
    });
  }

  results.sort((a, b) => a.base_price_cents - b.base_price_cents);

  return NextResponse.json({
    query: { w, h, group: groupExternalId, shapes: shapes ?? [], brand: brandExternalIds ?? [] },
    group: { id: groupRow.id, external_id: groupRow.external_id, name: groupRow.name },
    count: results.length,
    results,
  });
}
