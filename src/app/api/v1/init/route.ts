import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { storagePathToPublicUrl } from "@/lib/storage";

// qlein ranges are fixed by the upstream API and not stored in DB.
// Source: specs/konfigurator-db.md §3.5
const RANGE_SIZES = { minWidth: 400, maxWidth: 2800, minHeight: 400, maxHeight: 3000 };

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getServerSupabase();

  const [brandsRes, shapesRes, groupsRes, categoriesRes] = await Promise.all([
    supabase.from("brands").select("id, external_id, name, slug, logo_url").order("id"),
    supabase.from("shapes").select("id, code, name").order("id"),
    supabase
      .from("groups")
      .select("id, external_id, name, category, shape_configuration, sort_order")
      .order("sort_order", { ascending: true })
      .order("external_id", { ascending: true }),
    supabase
      .from("addition_categories")
      .select("id, code, name, sort_order")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true }),
  ]);

  for (const res of [brandsRes, shapesRes, groupsRes, categoriesRes]) {
    if (res.error) {
      return NextResponse.json(
        { error: "Database error", detail: res.error.message },
        { status: 500 }
      );
    }
  }

  const brands = (brandsRes.data ?? []).map((b) => ({
    id: b.id,
    external_id: b.external_id,
    name: b.name,
    slug: b.slug,
    logo_url: storagePathToPublicUrl(b.logo_url),
  }));

  return NextResponse.json({
    brands,
    shapes: shapesRes.data ?? [],
    groups: groupsRes.data ?? [],
    addition_categories: categoriesRes.data ?? [],
    rangeSizes: RANGE_SIZES,
  });
}
