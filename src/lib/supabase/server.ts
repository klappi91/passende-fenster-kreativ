import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db-types";

/**
 * Server-side Supabase client using the SECRET key (RLS-Bypass).
 * NEVER import this from client components.
 */
let _client: SupabaseClient<Database> | null = null;

export function getServerSupabase(): SupabaseClient<Database> {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SECRET_KEY missing in environment (.env.local)"
    );
  }
  _client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
