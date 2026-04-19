import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabase/server";
import { storagePathToPublicUrl } from "@/lib/storage";
import { interpolatePrice, type PricePoint } from "@/lib/price-interpolation";

export const dynamic = "force-dynamic";

const OptionalPriceQuery = z.object({
  w: z.coerce.number().int().optional(),
  h: z.coerce.number().int().optional(),
  group: z.coerce.number().int().optional(),
});

export async function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const url = new URL(req.url);
  const optParsed = OptionalPriceQuery.safeParse({
    w: url.searchParams.get("w") ?? undefined,
    h: url.searchParams.get("h") ?? undefined,
    group: url.searchParams.get("group") ?? undefined,
  });
  if (!optParsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: optParsed.error.issues },
      { status: 400 }
    );
  }

  const supabase = getServerSupabase();

  // Article + brand
  const { data: article, error: artErr } = await supabase
    .from("articles")
    .select(
      "id, external_id, name, slug, uw_value, profile_depth, description, datasheet_url, brand_id"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (artErr) {
    return NextResponse.json({ error: "Database error", detail: artErr.message }, { status: 500 });
  }
  if (!article) {
    return NextResponse.json({ error: `Article not found: ${slug}` }, { status: 404 });
  }

  const articleId = article.id;

  const [
    brandRes,
    mappingsRes,
    propsRes,
    imagesRes,
    additionsRes,
    categoriesRes,
    additionVariantsRes,
    variantsRes,
    variantPvRes,
    additionVariantPvRes,
    propertyValuesRes,
    propertiesRes,
  ] = await Promise.all([
    supabase.from("brands").select("id, external_id, name, slug, logo_url").eq("id", article.brand_id).maybeSingle(),
    supabase
      .from("article_group_mappings")
      .select("group_id, qlein_article_id")
      .eq("article_id", articleId),
    supabase
      .from("article_properties")
      .select("short_name, name, value, unit, icon, is_main, sort_order, external_id")
      .eq("article_id", articleId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("article_images")
      .select("id, storage_path, source_url, type, sort_order, metadata")
      .eq("article_id", articleId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("article_additions")
      .select(
        "id, external_id, category_id, name, type_name, image_storage_path, price_cents, is_default, sort_order"
      )
      .eq("article_id", articleId)
      .order("category_id", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true }),
    supabase
      .from("addition_categories")
      .select("id, code, name, sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("article_addition_variants")
      .select("id, external_id, addition_id, price_cents, price_old_cents, is_default"),
    supabase
      .from("article_variants")
      .select("id, external_id, price_cents, is_default")
      .eq("article_id", articleId),
    supabase
      .from("article_variant_property_values")
      .select("variant_id, property_value_id, position"),
    supabase
      .from("article_addition_variant_property_values")
      .select("addition_variant_id, property_value_id, position"),
    supabase
      .from("property_values")
      .select("id, external_id, property_id, name, short_name, value, value_code, image_storage_path, position"),
    supabase.from("properties").select("id, external_id, name, short_name"),
  ]);

  for (const r of [
    brandRes,
    mappingsRes,
    propsRes,
    imagesRes,
    additionsRes,
    categoriesRes,
    additionVariantsRes,
    variantsRes,
    variantPvRes,
    additionVariantPvRes,
    propertyValuesRes,
    propertiesRes,
  ]) {
    if (r.error) {
      return NextResponse.json(
        { error: "Database error", detail: r.error.message },
        { status: 500 }
      );
    }
  }

  // Groups for this article
  const groupIds = (mappingsRes.data ?? []).map((m) => m.group_id);
  const groupsRes = groupIds.length
    ? await supabase
        .from("groups")
        .select("id, external_id, name, category, shape_configuration, sort_order")
        .in("id", groupIds)
    : { data: [], error: null as null | { message: string } };
  if (groupsRes.error) {
    return NextResponse.json(
      { error: "Database error", detail: groupsRes.error.message },
      { status: 500 }
    );
  }
  const qleinByGroup = new Map(
    (mappingsRes.data ?? []).map((m) => [m.group_id, m.qlein_article_id])
  );

  const brand = brandRes.data;
  const categoriesById = new Map((categoriesRes.data ?? []).map((c) => [c.id, c]));
  const propertyValuesById = new Map((propertyValuesRes.data ?? []).map((pv) => [pv.id, pv]));
  const propertiesById = new Map((propertiesRes.data ?? []).map((p) => [p.id, p]));

  // Group addition variants by addition_id
  const additionVariantsByAddition = new Map<
    number,
    Array<{
      id: number;
      external_id: number;
      price_cents: number | null;
      price_old_cents: number | null;
      is_default: boolean | null;
      property_values: Array<{
        property_id: number | null;
        property_name: string | null;
        property_short_name: string | null;
        value_id: number;
        name: string;
        value: string;
        value_code: string | null;
        position: number | null;
        image: string | null;
      }>;
    }>
  >();
  const avPvByVariant = new Map<number, typeof additionVariantPvRes.data>();
  for (const row of additionVariantPvRes.data ?? []) {
    if (!avPvByVariant.has(row.addition_variant_id))
      avPvByVariant.set(row.addition_variant_id, []);
    avPvByVariant.get(row.addition_variant_id)!.push(row);
  }
  for (const av of additionVariantsRes.data ?? []) {
    const pvs = (avPvByVariant.get(av.id) ?? [])
      .slice()
      .sort((x, y) => (x.position ?? 0) - (y.position ?? 0))
      .map((link) => {
        const pv = propertyValuesById.get(link.property_value_id);
        if (!pv) return null;
        const prop = pv.property_id ? propertiesById.get(pv.property_id) : null;
        return {
          property_id: pv.property_id ?? null,
          property_name: prop?.name ?? null,
          property_short_name: prop?.short_name ?? null,
          value_id: pv.id,
          name: pv.name,
          value: pv.value,
          value_code: pv.value_code,
          position: link.position ?? pv.position,
          image: storagePathToPublicUrl(pv.image_storage_path),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    if (!additionVariantsByAddition.has(av.addition_id))
      additionVariantsByAddition.set(av.addition_id, []);
    additionVariantsByAddition.get(av.addition_id)!.push({
      id: av.id,
      external_id: av.external_id,
      price_cents: av.price_cents,
      price_old_cents: av.price_old_cents,
      is_default: av.is_default,
      property_values: pvs,
    });
  }

  // Build additions keyed by category code
  const additionsByCategoryCode: Record<
    string,
    {
      category: { id: number; code: string; name: string | null; sort_order: number | null };
      options: Array<{
        id: number;
        external_id: number;
        name: string;
        type_name: string | null;
        image: string | null;
        is_default: boolean | null;
        price_cents: number | null;
        sort_order: number | null;
        variants: ReturnType<typeof additionVariantsByAddition.get> extends undefined
          ? never
          : NonNullable<ReturnType<typeof additionVariantsByAddition.get>>;
      }>;
    }
  > = {};
  for (const add of additionsRes.data ?? []) {
    const cat = categoriesById.get(add.category_id);
    if (!cat) continue;
    if (!additionsByCategoryCode[cat.code]) {
      additionsByCategoryCode[cat.code] = { category: cat, options: [] };
    }
    additionsByCategoryCode[cat.code].options.push({
      id: add.id,
      external_id: add.external_id,
      name: add.name,
      type_name: add.type_name,
      image: storagePathToPublicUrl(add.image_storage_path),
      is_default: add.is_default,
      price_cents: add.price_cents,
      sort_order: add.sort_order,
      variants: additionVariantsByAddition.get(add.id) ?? [],
    });
  }

  // Article variants (colour combos etc.)
  const vpvByVariant = new Map<number, typeof variantPvRes.data>();
  for (const row of variantPvRes.data ?? []) {
    if (!vpvByVariant.has(row.variant_id)) vpvByVariant.set(row.variant_id, []);
    vpvByVariant.get(row.variant_id)!.push(row);
  }
  const variants = (variantsRes.data ?? []).map((v) => {
    const pvs = (vpvByVariant.get(v.id) ?? [])
      .slice()
      .sort((x, y) => (x.position ?? 0) - (y.position ?? 0))
      .map((link) => {
        const pv = propertyValuesById.get(link.property_value_id);
        if (!pv) return null;
        const prop = pv.property_id ? propertiesById.get(pv.property_id) : null;
        return {
          property_id: pv.property_id ?? null,
          property_name: prop?.name ?? null,
          property_short_name: prop?.short_name ?? null,
          value_id: pv.id,
          name: pv.name,
          value: pv.value,
          value_code: pv.value_code,
          position: link.position ?? pv.position,
          image: storagePathToPublicUrl(pv.image_storage_path),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    return {
      id: v.id,
      external_id: v.external_id,
      price_cents: v.price_cents,
      is_default: v.is_default,
      property_values: pvs,
    };
  });

  // Images -> public URLs
  const images = (imagesRes.data ?? []).map((img) => ({
    id: img.id,
    url: storagePathToPublicUrl(img.storage_path),
    source_url: img.source_url,
    type: img.type,
    sort_order: img.sort_order,
    metadata: img.metadata,
  }));

  // Groups
  const groups = (groupsRes.data ?? []).map((g) => ({
    id: g.id,
    external_id: g.external_id,
    name: g.name,
    category: g.category,
    shape_configuration: g.shape_configuration,
    sort_order: g.sort_order,
    qlein_article_id: qleinByGroup.get(g.id) ?? null,
  }));

  // Optional price lookup
  let price: {
    w: number;
    h: number;
    group: number;
    base_price_cents: number;
    base_price_eur: number;
    interpolated: boolean;
    warning?: string;
  } | null = null;
  if (optParsed.data.w && optParsed.data.h && optParsed.data.group) {
    const { data: targetGroup } = await supabase
      .from("groups")
      .select("id")
      .eq("external_id", optParsed.data.group)
      .maybeSingle();
    if (targetGroup) {
      const { data: points } = await supabase
        .from("article_price_points")
        .select("width_mm, height_mm, base_price_cents")
        .eq("article_id", articleId)
        .eq("group_id", targetGroup.id);
      const result = interpolatePrice(
        (points ?? []) as PricePoint[],
        optParsed.data.w,
        optParsed.data.h
      );
      if (result) {
        price = {
          w: optParsed.data.w,
          h: optParsed.data.h,
          group: optParsed.data.group,
          base_price_cents: result.base_price_cents,
          base_price_eur: result.base_price_eur,
          interpolated: result.interpolated,
          warning: result.warning,
        };
      }
    }
  }

  return NextResponse.json({
    id: article.id,
    external_id: article.external_id,
    name: article.name,
    slug: article.slug,
    uw_value: article.uw_value !== null ? Number(article.uw_value) : null,
    profile_depth: article.profile_depth,
    description: article.description,
    datasheet_url: article.datasheet_url,
    brand: brand
      ? {
          id: brand.id,
          external_id: brand.external_id,
          name: brand.name,
          slug: brand.slug,
          logo_url: storagePathToPublicUrl(brand.logo_url),
        }
      : null,
    groups,
    properties: propsRes.data ?? [],
    images,
    additions: additionsByCategoryCode,
    variants,
    price,
  });
}
