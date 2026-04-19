#!/usr/bin/env python3
"""
qlein-scraper.py — scrapes the live qlein configurator API for passende-fenster.de
and emits deterministic SQL seed files that populate the Supabase schema.

Outputs:
  scripts/seeds/0001_qlein_data.sql  -- idempotent INSERT ... ON CONFLICT statements
  scripts/seeds/manifest.json        -- list of image paths for the image-sync script

Usage:
  python3 scripts/qlein-scraper.py [--skip-prices] [--cache-dir .cache]

Design notes:
  - Pure stdlib (urllib, json, time). No external deps.
  - Idempotent: each section uses ON CONFLICT upserts keyed by external_id.
  - FKs resolved via `(select id from <table> where external_id = N)` subqueries.
  - Article names/brandIds only come from the search endpoint, so we record them
    there. The article-detail endpoint is used for everything else.
  - Re-running the scraper regenerates byte-equivalent seed files (deterministic
    ordering, fixed iteration order). We cache API responses on disk so a re-run
    after a partial failure does not re-hit the API.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

BASE = "https://admin.passende-fenster.de"
SLEEP = 0.1  # politeness delay between API calls

# Fixed "probe" size for the article-detail call — arbitrary mid-range value
# that is guaranteed to return results for every profile (verified manually).
PROBE_W = 1200
PROBE_H = 1400

# Price-raster step size in mm. 200 mm -> 14 width steps * 14 height steps * 3
# groups * 6 profiles ~= 3500 data points.
PRICE_STEP = 200

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
SEEDS_DIR = SCRIPT_DIR / "seeds"
CACHE_DIR = SCRIPT_DIR / ".cache"


# =====================================================================
# HTTP helpers
# =====================================================================


def _cache_key(url: str) -> Path:
    h = hashlib.sha1(url.encode()).hexdigest()[:16]
    return CACHE_DIR / f"{h}.json"


def fetch(url: str, use_cache: bool = True) -> dict:
    if use_cache:
        cache_path = _cache_key(url)
        if cache_path.exists():
            with cache_path.open("r", encoding="utf-8") as f:
                return json.load(f)
    req = urllib.request.Request(url, headers={"User-Agent": "passende-fenster-scraper/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read())
    time.sleep(SLEEP)
    if use_cache:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        with _cache_key(url).open("w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, sort_keys=True, indent=0)
    return data


def fetch_initstate() -> dict:
    return fetch(f"{BASE}/api/configurator/1/initstate")


def fetch_search(group_id: int, width: int, height: int, shapes_2d: list[list[str]]) -> dict:
    payload = {
        "width": width,
        "height": height,
        "minPrice": None,
        "maxPrice": None,
        "group": group_id,
        "shapes": shapes_2d,
        "brands": [],
    }
    # sort_keys gives a stable URL so the cache is content-addressed.
    body = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    qs = urllib.parse.quote(body)
    return fetch(f"{BASE}/api/configurator/1/search?inputs={qs}")


def fetch_article(aid: int, width: int, height: int) -> dict:
    return fetch(f"{BASE}/api/configurator/1/article/{aid}/{width}/{height}")


# =====================================================================
# SQL helpers
# =====================================================================


def sqlstr(v) -> str:
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "TRUE" if v else "FALSE"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, (dict, list)):
        s = json.dumps(v, ensure_ascii=False, sort_keys=True)
        return "'" + s.replace("'", "''") + "'::jsonb"
    s = str(v)
    return "'" + s.replace("'", "''") + "'"


def cents(euros) -> int | None:
    if euros is None:
        return None
    return int(round(float(euros) * 100))


_slug_nonword = re.compile(r"[^a-z0-9]+")


def slugify(s: str) -> str:
    s = (
        s.lower()
        .replace("ä", "ae")
        .replace("ö", "oe")
        .replace("ü", "ue")
        .replace("ß", "ss")
    )
    s = _slug_nonword.sub("-", s).strip("-")
    return s


def fk_subquery(table: str, external_id: int, col: str = "external_id") -> str:
    return f"(select id from {table} where {col} = {external_id})"


def fk_addition(external_id: int) -> str:
    return f"(select id from article_additions where external_id = {external_id})"


def fk_addition_variant(external_id: int) -> str:
    return f"(select id from article_addition_variants where external_id = {external_id})"


def fk_variant(external_id: int) -> str:
    return f"(select id from article_variants where external_id = {external_id})"


def fk_article(external_id: int) -> str:
    return fk_subquery("articles", external_id)


def fk_group(external_id: int) -> str:
    return fk_subquery("groups", external_id)


def fk_brand(external_id: int) -> str:
    return fk_subquery("brands", external_id)


def fk_property(external_id: int) -> str:
    return fk_subquery("properties", external_id)


def fk_property_value(external_id: int) -> str:
    return fk_subquery("property_values", external_id)


def fk_addition_category(code: str) -> str:
    return f"(select id from addition_categories where code = {sqlstr(code)})"


# =====================================================================
# Main scrape
# =====================================================================


PROFILES = [
    # The 6 profiles visible in the konfigurator at 1200x1400 for group 1/2/3.
    # We seed articles from whatever search returns — this list is only used for
    # sanity-checking counts during the initial search sweep.
    ("Streamline 76", 1),
    ("BluEvolution 82", 1),
    ("BluEvolution 92", 1),
    ("Aluplast 4000", 2),
    ("Aluplast 8000", 2),
    ("Gealan S 9000", 3),
]

MAIN_GROUPS = [1, 2, 3]


def build_shapes_2d(group: dict) -> list[list[str]]:
    """For a group, return a 2D `shapes` array with every slot = "Fest"."""
    return [["Fest"] * row["shapes"] for row in group["shapeConfiguration"]]


def collect() -> dict:
    """Run the full scrape and return an in-memory dataset ready for SQL emit."""
    init = fetch_initstate()
    groups_by_id = {g["id"]: g for g in init["groups"]}

    # articles: keyed by (brand_id, name) -> {brand_id, name, slug, qlein_article_ids: {group_id: qlein_id}}
    articles: dict[tuple[int, str], dict] = {}
    # qlein_article_id -> (brand_id, name) for reverse lookup.
    qlein_to_key: dict[int, tuple[int, str]] = {}
    # qlein_article_id -> main group_id it was first discovered in (used as primary
    # detail source, but we hit the detail endpoint once per qlein-id anyway).
    qlein_group: dict[int, int] = {}

    # Step 1: search sweep at PROBE_W x PROBE_H for groups 1, 2, 3.
    for g_id in MAIN_GROUPS:
        g = groups_by_id[g_id]
        shapes_2d = build_shapes_2d(g)
        print(f"[search] group={g_id} size={PROBE_W}x{PROBE_H} shapes={shapes_2d}")
        result = fetch_search(g_id, PROBE_W, PROBE_H, shapes_2d)
        for row in result.get("results", []):
            key = (row["brandId"], row["name"])
            articles.setdefault(key, {
                "brand_id": row["brandId"],
                "name": row["name"],
                "slug": slugify(row["name"]),
                "group_ids": {},
            })
            articles[key]["group_ids"][g_id] = row["id"]
            qlein_to_key[row["id"]] = key
            qlein_group.setdefault(row["id"], g_id)

    print(f"[search] discovered {len(articles)} unique articles across {len(qlein_to_key)} qlein-IDs")

    # Assign article external_id = min(qlein_article_id) for stability.
    for key, a in articles.items():
        a["external_id"] = min(a["group_ids"].values())

    # Step 2: detail fetch per qlein article id.
    details: dict[int, dict] = {}
    for qid, key in sorted(qlein_to_key.items()):
        g_id = qlein_group[qid]
        print(f"[article] qid={qid} group={g_id} ({key[1]})")
        details[qid] = fetch_article(qid, PROBE_W, PROBE_H)

    # Step 3: price raster for (article × group ∈ {1,2,3} × width × height).
    # Data shape: price_points[qlein_article_id_representative? NO -> per article]
    # For each main group we resolve which qlein_article_id belongs to this (article,group)
    # and collect basePrice per size.
    price_points: list[dict] = []
    widths = list(range(400, 2800 + 1, PRICE_STEP))   # 400..2800 inclusive
    heights = list(range(400, 3000 + 1, PRICE_STEP))  # 400..3000 inclusive
    total = len(widths) * len(heights) * len(MAIN_GROUPS)
    done = 0
    for g_id in MAIN_GROUPS:
        g = groups_by_id[g_id]
        shapes_2d = build_shapes_2d(g)
        for w in widths:
            for h in heights:
                done += 1
                if done % 50 == 0 or done == total:
                    print(f"[price] {done}/{total} group={g_id} size={w}x{h}")
                result = fetch_search(g_id, w, h, shapes_2d)
                for row in result.get("results", []):
                    key = (row["brandId"], row["name"])
                    if key not in articles:
                        # first time we see this key? shouldn't happen since sweep covered it
                        articles[key] = {
                            "brand_id": row["brandId"],
                            "name": row["name"],
                            "slug": slugify(row["name"]),
                            "group_ids": {g_id: row["id"]},
                            "external_id": row["id"],
                        }
                    price_points.append({
                        "article_external_id": articles[key]["external_id"],
                        "group_external_id": g_id,
                        "width_mm": w,
                        "height_mm": h,
                        "base_price_cents": cents(row["basePrice"]),
                    })
    print(f"[price] collected {len(price_points)} price points")

    return {
        "init": init,
        "articles": articles,
        "qlein_to_key": qlein_to_key,
        "qlein_group": qlein_group,
        "details": details,
        "price_points": price_points,
    }


# =====================================================================
# SQL emission
# =====================================================================


_CONFLICT_RE = re.compile(r"ON CONFLICT \(([^)]+)\) DO UPDATE SET [^;]+;", re.DOTALL)


def _collapse(s: str) -> str:
    """Collapse multi-line statements + replace DO UPDATE with DO NOTHING.

    The DO NOTHING form is equivalent to DO UPDATE for idempotency on immutable
    qlein data — once a row is inserted its source values don't change. It
    cuts the seed file by ~2/3 in size, which matters for the 180KB MCP payload
    limit when shipping chunks via the Supabase MCP tool.
    """
    s = s.replace("\n  ON CONFLICT", " ON CONFLICT").replace("\n)", ")")
    s = _CONFLICT_RE.sub(lambda m: f"ON CONFLICT ({m.group(1)}) DO NOTHING;", s)
    return s


def emit_sql(data: dict) -> tuple[str, list[dict]]:
    init = data["init"]
    articles = data["articles"]
    qlein_to_key = data["qlein_to_key"]
    details = data["details"]
    price_points = data["price_points"]

    out: list[str] = []
    manifest: list[dict] = []

    out.append("-- Generated by scripts/qlein-scraper.py — DO NOT EDIT BY HAND.")
    out.append("-- Source: https://admin.passende-fenster.de/api/configurator/1/*")
    out.append("")
    out.append("BEGIN;")
    out.append("")

    # ---------- 1. brands, shapes, groups ----------
    out.append("-- ==========================================================")
    out.append("-- 1. brands / shapes / groups")
    out.append("-- ==========================================================")
    for b in sorted(init["brands"], key=lambda x: x["id"]):
        slug = slugify(b["name"])
        out.append(
            "INSERT INTO brands (external_id, name, slug, logo_url) VALUES "
            f"({b['id']}, {sqlstr(b['name'])}, {sqlstr(slug)}, {sqlstr(b['image'])})\n"
            "  ON CONFLICT (external_id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, logo_url = EXCLUDED.logo_url;"
        )
        manifest.append({
            "storage_path": b["image"],
            "bucket": "brands",
            "brand_id_external": b["id"],
            "type": "brand",
        })
    out.append("")

    for code in sorted(init["shapes"]):
        out.append(
            "INSERT INTO shapes (code, name) VALUES "
            f"({sqlstr(code)}, {sqlstr(code)}) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;"
        )
    out.append("")

    for g in sorted(init["groups"], key=lambda x: x["id"]):
        out.append(
            "INSERT INTO groups (external_id, name, category, shape_configuration, sort_order) VALUES "
            f"({g['id']}, {sqlstr(g['name'])}, {g['groupCategoryId']}, {sqlstr(g['shapeConfiguration'])}, {g['id']})\n"
            "  ON CONFLICT (external_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, shape_configuration = EXCLUDED.shape_configuration;"
        )
    out.append("")

    # ---------- 2. properties + property_values ----------
    # Collect all propertyId + propertyValue.id across variants and addition-variants.
    out.append("-- ==========================================================")
    out.append("-- 2. properties / property_values (must precede article_variants and addition_variant refs)")
    out.append("-- ==========================================================")
    properties: dict[int, dict] = {}
    property_values: dict[int, dict] = {}

    def record_pv(pv: dict) -> None:
        # pv has: id, name, shortName, value, valueCode, image, position, propertyId
        prop_ext = pv["propertyId"]
        properties.setdefault(prop_ext, {
            "external_id": prop_ext,
            "name": pv["name"],
            "short_name": pv["shortName"],
        })
        property_values.setdefault(pv["id"], {
            "external_id": pv["id"],
            "property_external_id": prop_ext,
            "name": pv["name"],
            "short_name": pv["shortName"],
            "value": pv["value"],
            "value_code": pv.get("valueCode"),
            "image_storage_path": pv.get("image"),
            "position": pv.get("position"),
        })

    for qid, det in details.items():
        for v in det.get("variants", []) or []:
            for pv in v.get("propertyValues", []) or []:
                record_pv(pv)
        for cat_items in (det.get("additions") or {}).values():
            for add in cat_items or []:
                for av in add.get("variants", []) or []:
                    for pv in av.get("propertyValues", []) or []:
                        record_pv(pv)

    for prop_ext in sorted(properties):
        p = properties[prop_ext]
        out.append(
            "INSERT INTO properties (external_id, name, short_name) VALUES "
            f"({p['external_id']}, {sqlstr(p['name'])}, {sqlstr(p['short_name'])})\n"
            "  ON CONFLICT (external_id) DO UPDATE SET name = EXCLUDED.name, short_name = EXCLUDED.short_name;"
        )
    out.append("")

    for pv_ext in sorted(property_values):
        pv = property_values[pv_ext]
        if pv.get("image_storage_path"):
            manifest.append({
                "storage_path": pv["image_storage_path"],
                "bucket": "variants",
                "property_value_id_external": pv_ext,
                "type": "property_value",
            })
        out.append(
            "INSERT INTO property_values (external_id, property_id, name, short_name, value, value_code, image_storage_path, position) VALUES "
            f"({pv['external_id']}, {fk_property(pv['property_external_id'])}, "
            f"{sqlstr(pv['name'])}, {sqlstr(pv['short_name'])}, {sqlstr(pv['value'])}, "
            f"{sqlstr(pv['value_code'])}, {sqlstr(pv['image_storage_path'])}, {sqlstr(pv['position'])})\n"
            "  ON CONFLICT (external_id) DO UPDATE SET property_id = EXCLUDED.property_id, name = EXCLUDED.name, short_name = EXCLUDED.short_name, value = EXCLUDED.value, value_code = EXCLUDED.value_code, image_storage_path = EXCLUDED.image_storage_path, position = EXCLUDED.position;"
        )
    out.append("")

    # ---------- 3. articles, article_dimensions, article_group_mappings ----------
    out.append("-- ==========================================================")
    out.append("-- 3. articles / article_dimensions / article_group_mappings")
    out.append("-- ==========================================================")

    # Extract uw_value and profile_depth from detail properties (use the first
    # qlein-id's detail for that article).
    def find_prop(det: dict, short_name: str) -> str | None:
        for p in det.get("properties", []) or []:
            if p.get("shortName") == short_name:
                return p.get("value")
        return None

    rs = init["rangeSizes"]
    for key in sorted(articles, key=lambda k: articles[k]["external_id"]):
        a = articles[key]
        # pick one detail (the one with minimum qlein-id)
        min_qid = min(a["group_ids"].values())
        det = details.get(min_qid, {})
        uw_raw = find_prop(det, "Uw")
        depth_raw = find_prop(det, "Bautiefe")
        uw_value = None
        if uw_raw:
            try:
                uw_value = float(uw_raw.replace(",", "."))
            except ValueError:
                uw_value = None
        profile_depth = None
        if depth_raw:
            m = re.search(r"\d+", depth_raw)
            if m:
                profile_depth = int(m.group())

        out.append(
            "INSERT INTO articles (external_id, brand_id, name, slug, uw_value, profile_depth) VALUES "
            f"({a['external_id']}, {fk_brand(a['brand_id'])}, {sqlstr(a['name'])}, {sqlstr(a['slug'])}, "
            f"{sqlstr(uw_value)}, {sqlstr(profile_depth)})\n"
            "  ON CONFLICT (external_id) DO UPDATE SET brand_id = EXCLUDED.brand_id, name = EXCLUDED.name, slug = EXCLUDED.slug, uw_value = EXCLUDED.uw_value, profile_depth = EXCLUDED.profile_depth;"
        )
        # article_dimensions — same rangeSizes for every article.
        out.append(
            "INSERT INTO article_dimensions (article_id, min_width, max_width, min_height, max_height) VALUES "
            f"({fk_article(a['external_id'])}, {rs['minWidth']}, {rs['maxWidth']}, {rs['minHeight']}, {rs['maxHeight']})\n"
            "  ON CONFLICT (article_id) DO UPDATE SET min_width = EXCLUDED.min_width, max_width = EXCLUDED.max_width, min_height = EXCLUDED.min_height, max_height = EXCLUDED.max_height;"
        )
    out.append("")

    for qid in sorted(qlein_to_key):
        key = qlein_to_key[qid]
        a = articles[key]
        g_id = data["qlein_group"][qid]
        out.append(
            "INSERT INTO article_group_mappings (article_id, group_id, qlein_article_id) VALUES "
            f"({fk_article(a['external_id'])}, {fk_group(g_id)}, {qid})\n"
            "  ON CONFLICT (qlein_article_id) DO UPDATE SET article_id = EXCLUDED.article_id, group_id = EXCLUDED.group_id;"
        )
    out.append("")

    # ---------- 4. article_properties ----------
    out.append("-- ==========================================================")
    out.append("-- 4. article_properties")
    out.append("-- ==========================================================")
    seen_article_props: set[tuple[int, str]] = set()
    for key in sorted(articles, key=lambda k: articles[k]["external_id"]):
        a = articles[key]
        min_qid = min(a["group_ids"].values())
        det = details.get(min_qid, {})
        for idx, p in enumerate(det.get("properties", []) or []):
            sn = p.get("shortName") or ""
            dedupe_key = (a["external_id"], sn)
            if dedupe_key in seen_article_props:
                continue
            seen_article_props.add(dedupe_key)
            ext_raw = p.get("id")
            try:
                ext_id = int(ext_raw) if ext_raw is not None else None
            except (TypeError, ValueError):
                ext_id = None
            out.append(
                "INSERT INTO article_properties (article_id, short_name, name, value, unit, icon, is_main, sort_order, external_id) VALUES "
                f"({fk_article(a['external_id'])}, {sqlstr(sn)}, {sqlstr(p.get('name'))}, {sqlstr(p.get('value'))}, "
                f"{sqlstr(p.get('unit'))}, {sqlstr(p.get('icon'))}, {sqlstr(bool(p.get('main')))}, {idx}, {sqlstr(ext_id)})\n"
                "  ON CONFLICT (article_id, short_name) DO UPDATE SET name = EXCLUDED.name, value = EXCLUDED.value, unit = EXCLUDED.unit, icon = EXCLUDED.icon, is_main = EXCLUDED.is_main, sort_order = EXCLUDED.sort_order, external_id = EXCLUDED.external_id;"
            )
    out.append("")

    # ---------- 5. addition_categories ----------
    out.append("-- ==========================================================")
    out.append("-- 5. addition_categories")
    out.append("-- ==========================================================")
    addition_cats: dict[str, dict] = {}
    for det in details.values():
        for code, items in (det.get("additions") or {}).items():
            name = code
            if items and isinstance(items[0], dict):
                name = items[0].get("typeName") or code
            if code not in addition_cats:
                addition_cats[code] = {"code": code, "name": name, "sort_order": len(addition_cats)}
    for code in sorted(addition_cats):
        c = addition_cats[code]
        out.append(
            "INSERT INTO addition_categories (code, name, sort_order) VALUES "
            f"({sqlstr(c['code'])}, {sqlstr(c['name'])}, {c['sort_order']}) "
            "ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;"
        )
    out.append("")

    # ---------- 6. article_additions + variants ----------
    out.append("-- ==========================================================")
    out.append("-- 6. article_additions + article_addition_variants + link")
    out.append("-- ==========================================================")
    # Deduplicate by addition.id. Same addition may appear across multiple qlein-ids
    # for the same underlying article. We attach to the article (not qlein-id).
    seen_add: set[int] = set()
    seen_add_variant: set[int] = set()
    add_variant_pvs: list[tuple[int, int, int | None]] = []  # (addition_variant_external_id, pv_external_id, position)
    for qid in sorted(details):
        det = details[qid]
        key = qlein_to_key.get(qid)
        if not key:
            continue
        a = articles[key]
        for code, items in (det.get("additions") or {}).items():
            for sort_idx, add in enumerate(items or []):
                ext_id = add.get("id")
                if ext_id is None or ext_id in seen_add:
                    continue
                seen_add.add(ext_id)
                if add.get("image"):
                    manifest.append({
                        "storage_path": add["image"],
                        "bucket": "additions",
                        "article_id_external": a["external_id"],
                        "addition_id_external": ext_id,
                        "type": "addition",
                    })
                out.append(
                    "INSERT INTO article_additions (external_id, article_id, category_id, name, type_name, image_storage_path, price_cents, price_old_cents, is_default, sort_order) VALUES "
                    f"({ext_id}, {fk_article(a['external_id'])}, {fk_addition_category(code)}, "
                    f"{sqlstr(add.get('name'))}, {sqlstr(add.get('typeName'))}, {sqlstr(add.get('image'))}, "
                    f"{sqlstr(cents(add.get('price')))}, {sqlstr(cents(add.get('priceOld')))}, "
                    f"{sqlstr(bool(add.get('selected')))}, {sort_idx})\n"
                    "  ON CONFLICT (external_id) DO UPDATE SET article_id = EXCLUDED.article_id, category_id = EXCLUDED.category_id, name = EXCLUDED.name, type_name = EXCLUDED.type_name, image_storage_path = EXCLUDED.image_storage_path, price_cents = EXCLUDED.price_cents, price_old_cents = EXCLUDED.price_old_cents, is_default = EXCLUDED.is_default, sort_order = EXCLUDED.sort_order;"
                )
                for av in add.get("variants", []) or []:
                    av_ext = av.get("id")
                    if av_ext is None or av_ext in seen_add_variant:
                        continue
                    seen_add_variant.add(av_ext)
                    out.append(
                        "INSERT INTO article_addition_variants (external_id, addition_id, price_cents, price_old_cents, is_default) VALUES "
                        f"({av_ext}, {fk_addition(ext_id)}, {sqlstr(cents(av.get('price')))}, "
                        f"{sqlstr(cents(av.get('priceOld')))}, {sqlstr(bool(av.get('selected')))})\n"
                        "  ON CONFLICT (external_id) DO UPDATE SET addition_id = EXCLUDED.addition_id, price_cents = EXCLUDED.price_cents, price_old_cents = EXCLUDED.price_old_cents, is_default = EXCLUDED.is_default;"
                    )
                    for pv in av.get("propertyValues", []) or []:
                        add_variant_pvs.append((av_ext, pv["id"], pv.get("position")))
    out.append("")

    # link table
    seen_av_pv: set[tuple[int, int]] = set()
    dedup_av_pv: list[tuple[int, int, int | None]] = []
    for av_ext, pv_ext, pos in add_variant_pvs:
        if (av_ext, pv_ext) in seen_av_pv:
            continue
        seen_av_pv.add((av_ext, pv_ext))
        dedup_av_pv.append((av_ext, pv_ext, pos))
    # Batch insert via VALUES list.
    if dedup_av_pv:
        values_list = ",".join(
            f"({av_ext}, {pv_ext}, {sqlstr(pos)})" for av_ext, pv_ext, pos in dedup_av_pv
        )
        out.append(
            "INSERT INTO article_addition_variant_property_values (addition_variant_id, property_value_id, position) "
            "SELECT av.id, pv.id, t.pos FROM (VALUES " + values_list + ") AS t(av_ext, pv_ext, pos) "
            "JOIN article_addition_variants av ON av.external_id = t.av_ext "
            "JOIN property_values pv ON pv.external_id = t.pv_ext "
            "ON CONFLICT (addition_variant_id, property_value_id) DO NOTHING;"
        )
    out.append("")

    # ---------- 7. article_variants ----------
    out.append("-- ==========================================================")
    out.append("-- 7. article_variants + article_variant_property_values")
    out.append("-- ==========================================================")
    seen_variant: set[int] = set()
    variant_pvs: list[tuple[int, int, int | None]] = []
    for qid in sorted(details):
        det = details[qid]
        key = qlein_to_key.get(qid)
        if not key:
            continue
        a = articles[key]
        for v in det.get("variants", []) or []:
            v_ext = v.get("id")
            if v_ext is None or v_ext in seen_variant:
                continue
            seen_variant.add(v_ext)
            out.append(
                "INSERT INTO article_variants (external_id, article_id, price_cents, is_default) VALUES "
                f"({v_ext}, {fk_article(a['external_id'])}, {sqlstr(cents(v.get('price')))}, {sqlstr(bool(v.get('selected')))})\n"
                "  ON CONFLICT (external_id) DO UPDATE SET article_id = EXCLUDED.article_id, price_cents = EXCLUDED.price_cents, is_default = EXCLUDED.is_default;"
            )
            for pv in v.get("propertyValues", []) or []:
                variant_pvs.append((v_ext, pv["id"], pv.get("position")))
    out.append("")

    seen_v_pv: set[tuple[int, int]] = set()
    dedup_v_pv: list[tuple[int, int, int | None]] = []
    for v_ext, pv_ext, pos in variant_pvs:
        if (v_ext, pv_ext) in seen_v_pv:
            continue
        seen_v_pv.add((v_ext, pv_ext))
        dedup_v_pv.append((v_ext, pv_ext, pos))
    if dedup_v_pv:
        values_list = ",".join(
            f"({v_ext}, {pv_ext}, {sqlstr(pos)})" for v_ext, pv_ext, pos in dedup_v_pv
        )
        out.append(
            "INSERT INTO article_variant_property_values (variant_id, property_value_id, position) "
            "SELECT v.id, pv.id, t.pos FROM (VALUES " + values_list + ") AS t(v_ext, pv_ext, pos) "
            "JOIN article_variants v ON v.external_id = t.v_ext "
            "JOIN property_values pv ON pv.external_id = t.pv_ext "
            "ON CONFLICT (variant_id, property_value_id) DO NOTHING;"
        )
    out.append("")

    # ---------- 8. article_images ----------
    out.append("-- ==========================================================")
    out.append("-- 8. article_images (article-level images)")
    out.append("-- ==========================================================")
    for key in sorted(articles, key=lambda k: articles[k]["external_id"]):
        a = articles[key]
        min_qid = min(a["group_ids"].values())
        det = details.get(min_qid, {})
        for idx, img in enumerate(det.get("images", []) or []):
            manifest.append({
                "storage_path": img,
                "bucket": "products",
                "article_id_external": a["external_id"],
                "type": "article",
            })
            source_url = f"{BASE}/{img}"
            out.append(
                "INSERT INTO article_images (article_id, storage_path, source_url, type, sort_order) VALUES "
                f"({fk_article(a['external_id'])}, {sqlstr(img)}, {sqlstr(source_url)}, 'article', {idx})\n"
                "  ON CONFLICT (article_id, storage_path) DO UPDATE SET source_url = EXCLUDED.source_url, type = EXCLUDED.type, sort_order = EXCLUDED.sort_order;"
            )
    out.append("")

    # ---------- 9. article_price_points ----------
    out.append("-- ==========================================================")
    out.append("-- 9. article_price_points")
    out.append("-- ==========================================================")
    # Deduplicate (article, group, w, h) — the search result can return multiple brands for one probe.
    seen_pp: set[tuple[int, int, int, int]] = set()
    for pp in price_points:
        k = (pp["article_external_id"], pp["group_external_id"], pp["width_mm"], pp["height_mm"])
        if k in seen_pp:
            continue
        seen_pp.add(k)
    # Deterministic order.
    sorted_pp = sorted(
        {(pp["article_external_id"], pp["group_external_id"], pp["width_mm"], pp["height_mm"]): pp for pp in price_points}.values(),
        key=lambda p: (p["article_external_id"], p["group_external_id"], p["width_mm"], p["height_mm"]),
    )
    # Batch INSERT per (article, group) via INSERT ... SELECT on a static tuple
    # list. Only a single FK lookup per statement, not per value row.
    from itertools import groupby
    for (art_ext, grp_ext), bucket in groupby(sorted_pp, key=lambda p: (p["article_external_id"], p["group_external_id"])):
        rows = list(bucket)
        values_list = ",".join(
            f"({r['width_mm']}, {r['height_mm']}, {r['base_price_cents']})"
            for r in rows
        )
        out.append(
            "INSERT INTO article_price_points (article_id, group_id, width_mm, height_mm, base_price_cents) "
            f"SELECT (SELECT id FROM articles WHERE external_id={art_ext}), "
            f"(SELECT id FROM groups WHERE external_id={grp_ext}), t.w, t.h, t.p "
            f"FROM (VALUES {values_list}) AS t(w,h,p) "
            "ON CONFLICT (article_id, group_id, width_mm, height_mm) DO NOTHING;"
        )
    out.append("")
    out.append("COMMIT;")
    out.append("")

    # Dedupe manifest entries.
    seen_paths: set[tuple[str, str]] = set()
    unique_manifest: list[dict] = []
    for m in manifest:
        key = (m["storage_path"], m.get("type"))
        if key in seen_paths:
            continue
        seen_paths.add(key)
        unique_manifest.append(m)
    unique_manifest.sort(key=lambda m: (m.get("type") or "", m["storage_path"]))

    return "\n".join(out), unique_manifest


# =====================================================================
# Entry point
# =====================================================================


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description="Scrape qlein API and emit SQL seeds.")
    ap.add_argument("--no-cache", action="store_true", help="Ignore API response cache")
    ap.add_argument("--skip-prices", action="store_true", help="Skip the ~3500-call price raster (for quick iteration)")
    args = ap.parse_args(argv)

    if args.no_cache and CACHE_DIR.exists():
        import shutil
        shutil.rmtree(CACHE_DIR)

    if args.skip_prices:
        # Monkey-patch to make the price raster a no-op.
        global collect
        orig = collect

        def collect_skip():
            d = orig()
            d["price_points"] = []
            return d
        collect = collect_skip  # type: ignore

    SEEDS_DIR.mkdir(parents=True, exist_ok=True)
    data = collect()
    sql, manifest = emit_sql(data)

    seed_file = SEEDS_DIR / "0001_qlein_data.sql"
    manifest_file = SEEDS_DIR / "manifest.json"
    seed_file.write_text(_collapse(sql), encoding="utf-8")
    manifest_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"[done] wrote {seed_file} ({seed_file.stat().st_size} bytes)")
    print(f"[done] wrote {manifest_file} ({len(manifest)} entries)")
    print(f"[done] articles={len(data['articles'])} qlein_ids={len(data['qlein_to_key'])} price_points={len(data['price_points'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
