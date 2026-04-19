/**
 * Converts a storage_path (e.g. "back_public/images/article/1/abc.png") into an
 * absolute public URL pointing at the correct Supabase Storage bucket.
 *
 * The DB keeps the *original qlein* relative path. The images themselves were
 * mirrored into Supabase Storage during Phase 1a using the same path structure
 * but split across buckets by kind (see specs/konfigurator-db.md §6.6).
 *
 * Returns null if input is null/empty.
 */
export function storagePathToPublicUrl(
  storagePath: string | null | undefined
): string | null {
  if (!storagePath) return null;

  // Pre-hashed absolute URLs just pass through
  if (/^https?:\/\//.test(storagePath)) return storagePath;

  const baseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ""
  ).replace(/\/+$/, "");
  if (!baseUrl) return null;

  const bucket = bucketForPath(storagePath);
  // Keep the original relative path as the object key inside the bucket.
  return `${baseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
}

function bucketForPath(path: string): string {
  if (path.includes("/images/brand/")) return "brands";
  if (path.includes("/images/article/")) return "products";
  if (path.includes("/images/addition/")) return "additions";
  // property values / colour swatches / anything else
  return "variants";
}
