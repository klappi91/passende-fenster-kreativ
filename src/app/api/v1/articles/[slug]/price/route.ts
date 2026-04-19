import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabase/server";
import { interpolatePrice, type PricePoint } from "@/lib/price-interpolation";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  w: z.coerce.number().int().min(100).max(5000),
  h: z.coerce.number().int().min(100).max(5000),
  group: z.coerce.number().int().positive(),
});

export async function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    w: url.searchParams.get("w"),
    h: url.searchParams.get("h"),
    group: url.searchParams.get("group"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { w, h, group: groupExternalId } = parsed.data;
  const supabase = getServerSupabase();

  const { data: article, error: artErr } = await supabase
    .from("articles")
    .select("id, slug, name")
    .eq("slug", slug)
    .maybeSingle();
  if (artErr) {
    return NextResponse.json({ error: "Database error", detail: artErr.message }, { status: 500 });
  }
  if (!article) {
    return NextResponse.json({ error: `Article not found: ${slug}` }, { status: 404 });
  }

  const { data: group, error: groupErr } = await supabase
    .from("groups")
    .select("id, external_id, name")
    .eq("external_id", groupExternalId)
    .maybeSingle();
  if (groupErr) {
    return NextResponse.json({ error: "Database error", detail: groupErr.message }, { status: 500 });
  }
  if (!group) {
    return NextResponse.json({ error: `Unknown group external_id ${groupExternalId}` }, { status: 404 });
  }

  const { data: points, error: pointsErr } = await supabase
    .from("article_price_points")
    .select("width_mm, height_mm, base_price_cents")
    .eq("article_id", article.id)
    .eq("group_id", group.id);
  if (pointsErr) {
    return NextResponse.json({ error: "Database error", detail: pointsErr.message }, { status: 500 });
  }
  if (!points || !points.length) {
    return NextResponse.json(
      {
        error: `No price data for article "${article.slug}" and group external_id ${groupExternalId}`,
      },
      { status: 404 }
    );
  }

  const result = interpolatePrice(points as PricePoint[], w, h);
  if (!result) {
    return NextResponse.json(
      { error: "Could not interpolate — no usable price points" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    article_slug: article.slug,
    article_id: article.id,
    w,
    h,
    group: groupExternalId,
    base_price_cents: result.base_price_cents,
    base_price_eur: result.base_price_eur,
    interpolated: result.interpolated,
    warning: result.warning,
    used_points: result.used_points,
    clamped: {
      w: result.clamped_w,
      h: result.clamped_h,
    },
  });
}
