#!/usr/bin/env python3
"""Split scripts/seeds/0001_qlein_data.sql into ~40KB chunks for the Supabase MCP
execute_sql RPC (payload limit ~100KB). Each chunk is a complete set of
statements that can be executed standalone.

Usage:
  python3 scripts/split-seed.py
  -> writes scripts/seeds/chunks/0001_qlein_data_{NN}.sql
"""
from __future__ import annotations

from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SEED = SCRIPT_DIR / "seeds" / "0001_qlein_data.sql"
OUT_DIR = SCRIPT_DIR / "seeds" / "chunks"
MAX_BYTES = 45_000


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("*.sql"):
        old.unlink()

    text = SEED.read_text(encoding="utf-8")
    # Statements are ; -terminated but may span multiple lines.
    # We split on ";\n" which is our generator's canonical terminator.
    # Strip BEGIN;/COMMIT; — each chunk is its own transaction.
    body = text
    for sentinel in ("BEGIN;\n", "\nCOMMIT;\n", "\nCOMMIT;"):
        body = body.replace(sentinel, "\n")

    statements: list[str] = []
    buf: list[str] = []
    for line in body.splitlines(keepends=True):
        buf.append(line)
        if line.rstrip().endswith(";") and not line.lstrip().startswith("--"):
            statements.append("".join(buf).strip())
            buf = []
    if buf:
        remainder = "".join(buf).strip()
        if remainder:
            statements.append(remainder)

    chunks: list[str] = []
    cur: list[str] = []
    cur_size = 0
    for stmt in statements:
        stmt_size = len(stmt.encode("utf-8")) + 1
        if cur and cur_size + stmt_size > MAX_BYTES:
            chunks.append("\n".join(cur))
            cur = []
            cur_size = 0
        cur.append(stmt)
        cur_size += stmt_size
    if cur:
        chunks.append("\n".join(cur))

    for i, chunk in enumerate(chunks, start=1):
        out = OUT_DIR / f"0001_qlein_data_{i:03d}.sql"
        out.write_text(chunk + "\n", encoding="utf-8")
    print(f"wrote {len(chunks)} chunks into {OUT_DIR}")


if __name__ == "__main__":
    main()
