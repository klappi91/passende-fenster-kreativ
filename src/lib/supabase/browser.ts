import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db-types";

/**
 * Browser-side Supabase client using the ANON key.
 * Safe to import from client components. Not currently used by API-routes.
 */
let _client: SupabaseClient<Database> | null = null;

export function getBrowserSupabase(): SupabaseClient<Database> {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing in environment"
    );
  }
  _client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
