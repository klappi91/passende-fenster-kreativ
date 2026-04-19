#!/usr/bin/env python3
"""
Apply SQL seed chunks to Supabase via the admin_exec_sql RPC function.
Uses the Secret Key from .env.local (no direct Postgres connection needed).

Usage: python3 scripts/apply-seed.py [chunk-glob]
       (default: scripts/seeds/chunks/0001_qlein_data_*.sql)
"""
import glob
import json
import os
import pathlib
import sys
import time
import urllib.request
import urllib.error

ROOT = pathlib.Path(__file__).resolve().parents[1]


def load_env() -> dict[str, str]:
    env = {}
    path = ROOT / ".env.local"
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip()
    return env


def rpc_exec(url: str, key: str, sql: str) -> None:
    req = urllib.request.Request(
        f"{url}/rest/v1/rpc/admin_exec_sql",
        data=json.dumps({"sql": sql}).encode("utf-8"),
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        r.read()


def main() -> int:
    env = load_env()
    url = env["SUPABASE_URL"]
    key = env["SUPABASE_SECRET_KEY"]

    pattern = sys.argv[1] if len(sys.argv) > 1 else "scripts/seeds/chunks/0001_qlein_data_*.sql"
    chunks = sorted(glob.glob(str(ROOT / pattern)))
    if not chunks:
        print(f"no chunks found: {pattern}", file=sys.stderr)
        return 1

    for path in chunks:
        sql = pathlib.Path(path).read_text()
        size_kb = len(sql.encode("utf-8")) / 1024
        t0 = time.time()
        try:
            rpc_exec(url, key, sql)
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            print(f"FAIL  {pathlib.Path(path).name}  {size_kb:.1f} KB  HTTP {e.code}: {body}", file=sys.stderr)
            return 2
        dt = time.time() - t0
        print(f"ok    {pathlib.Path(path).name}  {size_kb:.1f} KB  {dt:.2f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
