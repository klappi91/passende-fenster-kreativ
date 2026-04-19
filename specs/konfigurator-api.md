# Konfigurator-API — Implementierungsplan (Schritt 6)

**Datum:** 2026-04-19
**Scope:** `src/app/api/v1/*` — Phase 1b (Schritt 6 aus `konfigurator-db.md` §7)
**Framework:** Next.js 16 App-Router, Route-Handlers (`route.ts`)

## Datei-Struktur

```
src/
├── lib/
│   ├── db-types.ts                # MCP-generiert (Supabase)
│   ├── supabase/
│   │   ├── server.ts              # Server-Client (Secret Key, RLS-Bypass)
│   │   └── browser.ts             # Browser-Client (Anon Key) — für spätere UI
│   ├── storage.ts                 # storage-path → public-URL helper
│   ├── price-interpolation.ts     # bilineare Interpolation
│   └── auth.ts                    # x-admin-token Check
└── app/api/v1/
    ├── init/
    │   └── route.ts                     # GET
    ├── articles/
    │   ├── route.ts                     # GET list
    │   └── [slug]/
    │       ├── route.ts                 # GET detail
    │       └── price/
    │           └── route.ts             # GET price
    └── inquiries/
        ├── route.ts                     # POST (public) + GET (admin list)
        └── [id]/
            └── route.ts                 # GET (admin) + PATCH (admin)
```

## Dependencies

- `@supabase/supabase-js` — PostgREST-Client
- `zod` — Validierung

## Typen aus DB (relevant)

- `articles` — id, external_id, brand_id, name, slug, uw_value, profile_depth
- `brands` — id, external_id, name, slug, logo_url
- `groups` — id, **external_id** (wichtig: das ist der qlein-Wert den die UI/Spec `group` nennt), name, category, shape_configuration
- `shapes` — id, code, name
- `article_group_mappings` — article_id ↔ group_id (many:many, qlein_article_id)
- `article_price_points` — article_id, **group_id** (FK → groups.id), width_mm, height_mm, base_price_cents  — Raster 200 mm
- `article_properties` — article_id, short_name, name, value, unit, icon, is_main, sort_order
- `addition_categories` — id, code, name, sort_order
- `article_additions` — article_id, category_id, external_id, name, type_name, image_storage_path, price_cents, is_default
- `article_addition_variants` — addition_id, external_id, price_cents, is_default
- `article_addition_variant_property_values` — addition_variant_id ↔ property_value_id (position)
- `article_variants` — article_id, external_id, price_cents, is_default
- `article_variant_property_values` — variant_id ↔ property_value_id (position)
- `properties` / `property_values` — Farben, Materialien
- `article_images` — article_id, storage_path, source_url, type, sort_order
- `inquiries` — configuration (jsonb), article_id, width_mm, height_mm, shape, group_external_id, contact_*, total_price_cents, status

## Group-ID-Mapping — WICHTIG

Die Spec und die UI benutzen `group` als **external_id** (1, 2, 3, 6, 7, 8, ...) weil das die qlein-Semantik ist. In der DB ist der FK zu `groups.id` (1..13, intern). Also: jeder Route, die `group` als Query bekommt, muss zuerst `groups.external_id` → `groups.id` auflösen.

## Preis-Lookup (bilineare Interpolation)

- Raster: 200 mm, von 400 bis 2000/2400 bzw. 2400/3000 je nach Group.
- Für `(w, h)` mit `w` nicht auf Raster: finde `w0 = floor(w/200)*200`, `w1 = w0+200`. Clamp an Min/Max.
- Dasselbe für h.
- Lade alle 4 Eckpunkte `(w0,h0), (w1,h0), (w0,h1), (w1,h1)` aus `article_price_points`.
- Falls einzelne Eckpunkte fehlen → nimm die nächsten verfügbaren (sortiere nach |Δw|+|Δh|), setze `warning: true`.
- Wenn überhaupt kein Punkt vorliegt → `404 { error: "No price data for article/group" }`.
- Bilineare Formel:
  ```
  tx = (w - w0)/(w1 - w0) if w0!=w1 else 0
  ty = (h - h0)/(h1 - h0) if h0!=h1 else 0
  p = p00*(1-tx)*(1-ty) + p10*tx*(1-ty) + p01*(1-tx)*ty + p11*tx*ty
  ```
- Rückgabe `base_price_cents` (gerundet) + `base_price_eur` (÷100, 2 Nachkommastellen) + `interpolated: boolean` (true wenn `w` oder `h` nicht auf Raster). Zusätzlich `warning?: string` falls Fallback nötig.

## Route-Signaturen

### GET `/api/v1/init`

Public. Gibt Stammdaten zurück.

Response:
```ts
{
  brands: Array<{ id: number; external_id: number; name: string; slug: string; logo_url: string | null }>,
  shapes: Array<{ id: number; code: string; name: string }>,
  groups: Array<{ id: number; external_id: number; name: string; category: number; shape_configuration: { height: number; shapes: number }[]; sort_order: number }>,
  rangeSizes: { minWidth: 400, maxWidth: 2800, minHeight: 400, maxHeight: 3000 },
  addition_categories: Array<{ id; code; name; sort_order }>
}
```

`logo_url` wird als public-Storage-URL zurückgegeben wenn der Pfad nicht schon absolut ist. Brands haben aktuell `back_public/images/brand/...` → dort liegen die Bilder im `brands/` Bucket (laut Plan — mit Prefix `back_public/images/brand/...`).

**Hinweis:** Laut Spec §12 wurden 39 Bilder nach Storage gespiegelt. Der Pfad in der DB ist derselbe relative Pfad wie qlein (`back_public/images/...`). Wir setzen `NEXT_PUBLIC_SUPABASE_URL/storage/v1/object/public/<bucket>/<path>` zusammen, wobei der `<bucket>` anhand des Path-Segments bestimmt wird:

- `back_public/images/brand/...` → bucket `brands`
- `back_public/images/article/...` → bucket `products`
- `back_public/images/addition/...` → bucket `additions`
- Sonst → bucket `variants` (property_values)

`rangeSizes` ist hart aus Spec §3.5 — nicht in DB.

### GET `/api/v1/articles?w=&h=&group=&shapes[]=&brand[]=`

Public. Query:
- `w` (int, required): 400–2800
- `h` (int, required): 400–3000
- `group` (int, required): groups.external_id (1,2,3,6..15)
- `shapes[]` (array, optional): shape codes (akzeptiert, aktuell kein Filter da `article_shapes` leer)
- `brand[]` (array, optional): brand external_ids

Logik:
1. Resolve group.external_id → group.id
2. Lade alle article_ids mit mapping auf diese group
3. Filter optional nach brand_ids (über `articles.brand_id → brands.external_id`)
4. Für jedes Article: Preis-Lookup bei (w, h, group_id)
5. Response sortiert nach Preis aufsteigend

Response:
```ts
{
  query: { w, h, group, shapes, brand },
  count: number,
  results: Array<{
    id: number,
    slug: string,
    name: string,
    brand: { id, external_id, name, slug, logo_url },
    uw_value: number|null,
    profile_depth: number|null,
    main_properties: Array<{ short_name, value, unit }>, // is_main=true
    image: string | null, // erste article_images.storage_path als public URL
    base_price_cents: number,
    base_price_eur: number,
    interpolated: boolean,
    warning?: string
  }>
}
```

### GET `/api/v1/articles/:slug`

Public. Optional Query `w`, `h`, `group` für Preis.

Response:
```ts
{
  id, external_id, name, slug, uw_value, profile_depth, description,
  brand: { id, external_id, name, slug, logo_url },
  groups: Array<{ id, external_id, name, qlein_article_id }>, // aus article_group_mappings
  properties: Array<{ short_name, name, value, unit, icon, is_main, sort_order }>,
  images: Array<{ url, sort_order, type }>,
  additions: {
    [category_code]: {
      category: { id, code, name, sort_order },
      options: Array<{
        id, external_id, name, type_name, image, is_default, price_cents, sort_order,
        variants: Array<{ id, external_id, price_cents, is_default, property_values: [...] }>
      }>
    }
  },
  variants: Array<{
    id, external_id, price_cents, is_default,
    property_values: Array<{ property_id, property_name, property_short_name, value, value_code, name, position, image }>
  }>,
  price?: { w, h, group, base_price_cents, base_price_eur, interpolated, warning? } // nur wenn w,h,group gegeben
}
```

### GET `/api/v1/articles/:slug/price?w=&h=&group=`

Public. Alle drei Parameter required.

Response: `{ article_slug, w, h, group, base_price_cents, base_price_eur, interpolated, warning? }` oder 404 wenn Artikel/Preisraster fehlt.

### POST `/api/v1/inquiries`

Public. Body (Zod):
```ts
{
  article_slug: string,
  width_mm: int (400..2800),
  height_mm: int (400..3000),
  group_external_id: int,
  shape_code: string (enum ["DKL","DKR","DL","DR","Fest","Kipp"]),
  variant_external_id?: int,
  selected_addition_variant_external_ids?: int[],
  total_price_cents?: int,
  contact: { name: string min1, email: email, phone?: string, message?: string }
}
```

Logik:
- Resolve article_slug → article_id
- Schreibe in `inquiries`: article_id, width_mm, height_mm, shape, group_external_id, contact_name, contact_email, contact_phone, message, total_price_cents, configuration (JSONB mit variant_external_id, selected_addition_variant_external_ids, shape_code).
- Status default `new`
- Response 201 mit `{ id, created_at, status }`

Error: 400 `{ error, issues: [...] }` bei Zod-Fehler, 404 wenn Artikel unbekannt.

### Admin-Routes

Auth-Middleware via `lib/auth.ts`: Header `x-admin-token` gegen `process.env.ADMIN_API_TOKEN`. Fehlt/falsch → 401.

- `GET /api/v1/inquiries` — Liste, optional `?status=new`. Sortiert desc nach `created_at`. Max 100.
- `GET /api/v1/inquiries/:id` — Detail inkl. article+configuration.
- `PATCH /api/v1/inquiries/:id` — Zod: `{ status?: enum[...], message?: string }` (message → nicht in Schema, also Feld `admin_note`? — **Spec sagt "Status/Notiz ändern"**. Die Tabelle hat kein `admin_note` Feld. Ich patche in `configuration.admin_note` über JSONB-Merge, weil Schema-Änderung außerhalb Scope liegt.)

## Zod-Schemas

In `lib/schemas.ts` (oder inline in Routes). Nur bei POST/PATCH, GET validiert Query via `z.coerce.number()` etc.

## Test-Plan (Smoke)

Dev-Server via `pnpm dev` (Port 3000). curl-Tests:

1. `curl -s localhost:3000/api/v1/init | jq '.brands | length'` → 3
2. `curl -s 'localhost:3000/api/v1/articles?w=1200&h=1400&group=1' | jq '.results | length'` → 6 (alle 6 Profile haben group=1)
3. `curl -s 'localhost:3000/api/v1/articles/streamline-76' | jq '{name, additions: (.additions | keys), variants: (.variants | length)}'` → Streamline 76
4. `curl -s 'localhost:3000/api/v1/articles/streamline-76/price?w=1100&h=1350&group=1' | jq` → interpolierter Preis
5. `curl -s -X POST localhost:3000/api/v1/inquiries -H 'content-type: application/json' -d '{...}' | jq` → id
6. `curl -s localhost:3000/api/v1/inquiries` → 401
7. `curl -s localhost:3000/api/v1/inquiries -H 'x-admin-token: $TOKEN'` → Liste
8. `curl -s -X PATCH localhost:3000/api/v1/inquiries/1 -H 'x-admin-token: $TOKEN' -d '{"status":"contacted"}' -H 'content-type: application/json'` → ok

## Offene Randfälle

- `article_shapes` ist leer — `shapes[]`-Filter ist daher no-op. Annehmen aber nicht filtern. OK, alle Profile unterstützen alle Shapes laut §3.5.
- `article_dimensions` hat 6 Einträge — wir können daraus Min/Max pro Artikel liefern falls die `rangeSizes` zu grob ist. Für diesen Step nicht nötig — rangeSizes reicht, Interpolation macht Clamping.
- Preis außerhalb Raster → Clamp auf Randwert + `warning`.
- Storage-Bucket-Routing hart-codiert per Prefix. Ausreichend für jetzige Daten.
