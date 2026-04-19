import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ShapeEnum = z.enum(["DKL", "DKR", "DL", "DR", "Fest", "Kipp"]);

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email(),
  phone: z.string().trim().max(80).optional(),
  message: z.string().trim().max(5000).optional(),
});

const InquirySchema = z.object({
  article_slug: z.string().trim().min(1),
  width_mm: z.number().int().min(200).max(4000),
  height_mm: z.number().int().min(200).max(4000),
  group_external_id: z.number().int().positive(),
  shape_code: ShapeEnum,
  variant_external_id: z.number().int().positive().optional(),
  selected_addition_variant_external_ids: z.array(z.number().int().positive()).optional(),
  total_price_cents: z.number().int().nonnegative().optional(),
  contact: ContactSchema,
});

const ListQuerySchema = z.object({
  status: z
    .enum(["new", "contacted", "quoted", "converted_to_order", "won", "lost"])
    .optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
});

const STATUS_VALUES = ["new", "contacted", "quoted", "converted_to_order", "won", "lost"] as const;

// ============================================================
// POST — public (create lead)
// ============================================================
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = InquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const d = parsed.data;
  const supabase = getServerSupabase();

  // Resolve article_slug -> article_id
  const { data: article, error: artErr } = await supabase
    .from("articles")
    .select("id, name, slug")
    .eq("slug", d.article_slug)
    .maybeSingle();
  if (artErr) {
    return NextResponse.json({ error: "Database error", detail: artErr.message }, { status: 500 });
  }
  if (!article) {
    return NextResponse.json(
      { error: `Unknown article_slug: ${d.article_slug}` },
      { status: 404 }
    );
  }

  const configuration = {
    article_slug: d.article_slug,
    shape_code: d.shape_code,
    group_external_id: d.group_external_id,
    variant_external_id: d.variant_external_id ?? null,
    selected_addition_variant_external_ids: d.selected_addition_variant_external_ids ?? [],
    submitted_total_price_cents: d.total_price_cents ?? null,
  };

  const { data: inserted, error: insErr } = await supabase
    .from("inquiries")
    .insert({
      article_id: article.id,
      width_mm: d.width_mm,
      height_mm: d.height_mm,
      shape: d.shape_code,
      group_external_id: d.group_external_id,
      contact_name: d.contact.name,
      contact_email: d.contact.email,
      contact_phone: d.contact.phone ?? null,
      message: d.contact.message ?? null,
      total_price_cents: d.total_price_cents ?? null,
      configuration,
      status: "new",
    })
    .select("id, created_at, status")
    .single();

  if (insErr) {
    return NextResponse.json(
      { error: "Database error", detail: insErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      id: inserted.id,
      created_at: inserted.created_at,
      status: inserted.status,
      article: { id: article.id, slug: article.slug, name: article.name },
    },
    { status: 201 }
  );
}

// ============================================================
// GET — admin (list)
// ============================================================
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const url = new URL(req.url);
  const parsed = ListQuerySchema.safeParse({
    status: url.searchParams.get("status") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const supabase = getServerSupabase();
  let q = supabase
    .from("inquiries")
    .select(
      "id, created_at, status, article_id, width_mm, height_mm, shape, group_external_id, contact_name, contact_email, contact_phone, total_price_cents, message"
    )
    .order("created_at", { ascending: false })
    .limit(parsed.data.limit ?? 100);
  if (parsed.data.status) q = q.eq("status", parsed.data.status);

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: "Database error", detail: error.message }, { status: 500 });
  }

  return NextResponse.json({
    count: data?.length ?? 0,
    status_filter: parsed.data.status ?? null,
    allowed_statuses: STATUS_VALUES,
    results: data ?? [],
  });
}
