import { NextResponse } from "next/server";

/**
 * Auth-stub for admin routes. Clients must send `x-admin-token` header matching
 * `process.env.ADMIN_API_TOKEN`. No real user auth yet.
 *
 * Returns `null` on success. Returns a 401 Response on failure — routes should
 * `if (denied) return denied;`
 */
export function requireAdmin(req: Request): NextResponse | null {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_API_TOKEN is not configured on the server" },
      { status: 500 }
    );
  }
  const provided = req.headers.get("x-admin-token");
  if (!provided || provided !== expected) {
    return NextResponse.json(
      { error: "Unauthorized — missing or invalid x-admin-token" },
      { status: 401 }
    );
  }
  return null;
}
