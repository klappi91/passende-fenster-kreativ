#!/usr/bin/env python3
"""
qlein-image-sync.py

Idempotent image sync: download images from admin.passende-fenster.de and
upload them into Supabase Storage buckets as specified in scripts/seeds/manifest.json.

Stdlib-only (urllib).
"""

from __future__ import annotations

import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


SUPABASE_URL = "https://fvafvfhdrbziivlbuuqn.supabase.co"
SUPABASE_ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YWZ2ZmhkcmJ6aWl2bGJ1dXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTMwMjgsImV4cCI6MjA5MjE2OTAyOH0."
    "ljomVqgCPB9wlVZ8_PkEbEadSE3cl7SArCByH_9OPUU"
)
SOURCE_BASE = "https://admin.passende-fenster.de"

SCRIPT_DIR = Path(__file__).resolve().parent
MANIFEST_PATH = SCRIPT_DIR / "seeds" / "manifest.json"


def guess_content_type(path: str) -> str:
    ctype, _ = mimetypes.guess_type(path)
    if ctype:
        return ctype
    ext = path.lower().rsplit(".", 1)[-1]
    if ext == "png":
        return "image/png"
    if ext in ("jpg", "jpeg"):
        return "image/jpeg"
    if ext == "webp":
        return "image/webp"
    if ext == "gif":
        return "image/gif"
    return "application/octet-stream"


def download(url: str, timeout: float = 30.0) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "qlein-image-sync/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def upload(bucket: str, key: str, data: bytes, content_type: str) -> tuple[int, str]:
    """Upload to Supabase Storage. Uses x-upsert to be idempotent.

    Returns (http_status, body_text). 409 means object already exists.
    """
    url = f"{SUPABASE_URL}/storage/v1/object/{bucket}/{key}"
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", f"Bearer {SUPABASE_ANON_KEY}")
    req.add_header("apikey", SUPABASE_ANON_KEY)
    req.add_header("Content-Type", content_type)
    # Do NOT upsert by default so we get clean 409 on duplicates (idempotent skip).
    req.add_header("x-upsert", "false")
    try:
        with urllib.request.urlopen(req, timeout=60.0) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode("utf-8", errors="replace")
        except Exception:
            pass
        return e.code, body


def main() -> int:
    if not MANIFEST_PATH.exists():
        print(f"ERROR: manifest not found at {MANIFEST_PATH}", file=sys.stderr)
        return 2

    with MANIFEST_PATH.open("r", encoding="utf-8") as f:
        manifest = json.load(f)

    print(f"[sync] Loaded {len(manifest)} entries from {MANIFEST_PATH}")

    success = 0
    skipped = 0
    failed = 0
    failures: list[str] = []

    for idx, entry in enumerate(manifest, start=1):
        bucket = entry["bucket"]
        key = entry["storage_path"]
        src_url = f"{SOURCE_BASE}/{key}"

        tag = f"[{idx}/{len(manifest)}] {bucket}/{key}"

        # 1) download
        try:
            data = download(src_url)
        except Exception as e:
            msg = f"{tag} DOWNLOAD FAILED: {e!r}"
            print(msg)
            failures.append(msg)
            failed += 1
            time.sleep(0.1)
            continue

        # 2) upload
        ctype = guess_content_type(key)
        try:
            status, body = upload(bucket, key, data, ctype)
        except Exception as e:
            msg = f"{tag} UPLOAD EXCEPTION: {e!r}"
            print(msg)
            failures.append(msg)
            failed += 1
            time.sleep(0.1)
            continue

        if status in (200, 201):
            print(f"{tag} OK ({len(data)} bytes, {ctype})")
            success += 1
        elif status == 409 or "Duplicate" in body or "already exists" in body:
            print(f"{tag} SKIP (already exists)")
            skipped += 1
        else:
            msg = f"{tag} UPLOAD FAILED status={status} body={body[:400]}"
            print(msg)
            failures.append(msg)
            failed += 1

        time.sleep(0.1)

    print("")
    print("============================================================")
    print("SUMMARY")
    print(f"  total  : {len(manifest)}")
    print(f"  success: {success}")
    print(f"  skipped: {skipped}")
    print(f"  failed : {failed}")
    print("============================================================")
    if failures:
        print("")
        print("FAILURES:")
        for f in failures:
            print(f"  - {f}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
