import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { Json } from "@/lib/db-types";

export const dynamic = "force-dynamic";

const StatusEnum = z.enum([
  "new",
  "contacted",
  "quoted",
  "converted_to_order",
  "won",
  "lost",
]);

const PatchSchema = z
  .object({
    status: StatusEnum.optional(),
    admin_note: z.string().trim().max(5000).optional(),
  })
  .refine((d) => d.status !== undefined || d.admin_note !== undefined, {
    message: "Provide at least one of: status, admin_note",
  });

async function loadOrNull(id: number) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("inquiries")
    .select(
      "id, created_at, status, article_id, width_mm, height_mm, shape, group_external_id, contact_name, contact_email, contact_phone, message, total_price_cents, configuration"
    )
    .eq("id", id)
    .maybeSingle();
  return { data, error };
}

// ============================================================
// GET — admin (detail)
// ============================================================
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid inquiry id" }, { status: 400 });
  }

  const { data, error } = await loadOrNull(id);
  if (error) {
    return NextResponse.json({ error: "Database error", detail: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: `Inquiry ${id} not found` }, { status: 404 });
  }

  // Join article for convenience
  const supabase = getServerSupabase();
  let article = null as null | { id: number; name: string; slug: string };
  if (data.article_id) {
    const { data: a } = await supabase
      .from("articles")
      .select("id, name, slug")
      .eq("id", data.article_id)
      .maybeSingle();
    article = a ?? null;
  }

  return NextResponse.json({ ...data, article });
}

// ============================================================
// PATCH — admin (update status / admin_note)
//
// `admin_note` is merged into the `configuration` JSONB because the DB schema
// has no dedicated column. The note is stored under
// `configuration.admin_notes` as an append-only array `{at, note}`.
// ============================================================
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid inquiry id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const supabase = getServerSupabase();
  const { data: existing, error: loadErr } = await loadOrNull(id);
  if (loadErr) {
    return NextResponse.json({ error: "Database error", detail: loadErr.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: `Inquiry ${id} not found` }, { status: 404 });
  }

  const updates: {
    status?: string;
    configuration?: Json;
  } = {};

  if (parsed.data.status) updates.status = parsed.data.status;

  if (parsed.data.admin_note !== undefined) {
    const currentConfig =
      existing.configuration && typeof existing.configuration === "object" && !Array.isArray(existing.configuration)
        ? (existing.configuration as Record<string, Json>)
        : ({} as Record<string, Json>);
    const notes = Array.isArray(currentConfig.admin_notes) ? (currentConfig.admin_notes as Json[]) : [];
    updates.configuration = {
      ...currentConfig,
      admin_notes: [...notes, { at: new Date().toISOString(), note: parsed.data.admin_note }],
    } as Json;
  }

  const { data: updated, error: updErr } = await supabase
    .from("inquiries")
    .update(updates)
    .eq("id", id)
    .select(
      "id, created_at, status, article_id, width_mm, height_mm, shape, group_external_id, contact_name, contact_email, contact_phone, message, total_price_cents, configuration"
    )
    .single();
  if (updErr) {
    return NextResponse.json({ error: "Database error", detail: updErr.message }, { status: 500 });
  }

  return NextResponse.json(updated);
}
