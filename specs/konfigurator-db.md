# Konfigurator + Datenbank — Spec

**Datum:** 2026-04-19
**Status:** Phase 1 ready for implementation (nach Live-API-Analyse am 2026-04-19)
**Scope:** Strategische Spec für alle 3 Varianten (kreativ / minimal / professionell)

## Änderungshistorie

- **2026-04-19 (v2):** API-Live-Analyse eingearbeitet. Korrekturen in §3 (API-Syntax, Preis-Semantik, article-Endpoint), neue Abschnitte §4 (Produktsortiment), §6 (erweitertes Schema), §9 (Phase 2 Watchdog als eigene Spec).
- **2026-04-19 (v1):** Recherche-Fassung. Viele API-Details waren Mutmaßungen — siehe [qlein-api-findings.md](./qlein-api-findings.md) für den Audit.

---

## 1. Ausgangslage

Passende-Fenster bekommt einen Relaunch (3 Varianten in `passende-fenster-{kreativ,minimal,professionell}/`). Geplant ist ein **User-Konfigurator** mit Maß-Eingabe, der passende Fenster vorschlägt (PVC, versch. Öffnungsarten).

**Ursprungsfragen der Recherche:**
- Haben wir alle nötigen Daten (Bilder, Maße, Specs) aus dem bestehenden Scrape?
- Müssen wir ins Hersteller-Backend oder reicht die Alt-Site?

**Antwort nach Recherche:**
- Der lokale Scrape (`passende-fenster-scraper/`) liefert Katalog-Bilder, aber **nicht** die Konfigurator-Bilder.
- Die **qlein-API** (`admin.passende-fenster.de`) ist die autoritative Datenquelle für alle 6 konfigurierbaren Profile. Daten sind aktuell, Bilder sind separat zu ziehen.
- Das **Eko-Okna-Händlerbackend** (eko4u.com) ist für Phase 1 nicht erforderlich. Für Phase 2 (Watchdog, Sortiments-Erweiterung) siehe [`eko4u-watchdog.md`](./eko4u-watchdog.md).

---

## 2. Findings — Alt-Site `passende-fenster.de`

### 2.1 Bilder

- `passende-fenster-scraper/output/` enthält **15.671 Bilder** (2,6 GB, strukturiert nach `fenster/`, `fensterabdeckungen/`, `tore/`, `tueren/`) — **Katalog-Bilder aus `wp-content/uploads/`**
- **Achtung:** Diese Bilder sind **nicht identisch** mit den Konfigurator-Bildern (die liegen auf `admin.passende-fenster.de/back_public/`). Siehe §3.9.
- `scraped-data/` im Relaunch-Projekt enthält Brand-Assets und Seiten-HTML
- `passende-fenster-kreativ/public/images/` hat 16 Assets (Logos + Hero-Background). Alle Produktbilder werden remote geladen.

### 2.2 Technische Specs im Katalog (WordPress)

- 167 Fenster im Katalog (WP-CMS), davon PVC 55 + Alu 42 + Holz 70
- Specs sind **unstrukturiert** (Freitext-Listen)
- 131 (78 %) haben `Bautiefe`/`Einbautiefe`, nur 3 haben `max H × B`, **0** haben strukturierte U-Werte
- **Fazit:** Der Katalog reicht als **Showroom**, aber **nicht als Datenbasis für einen Maß-Konfigurator**.

### 2.3 Existierender Konfigurator (versteckt)

- `https://passende-fenster.de/konfigurator/` (WP-Seite) mit iframe zu `configurator.passende-fenster.de` (React SPA, Create-React-App, Oct 2023)
- **Nicht im Hauptmenü verlinkt**. Nur via Sitemap auffindbar.

### 2.4 WooCommerce-Status

- Installiert (Plugin 10.0.6) aber **ohne Produkte** — Passende-Fenster ist ein **Lead-Generation-Business**, kein E-Commerce-Shop.

### 2.5 Sicherheits-Hinweis (unverändert offen)

- Symfony-Backend `admin.passende-fenster.de` läuft im **Debug-Modus** — `/_profiler/` ist öffentlich erreichbar, leaked Stacktraces und interne Pfade. Sollte dem Kunden gemeldet werden.

---

## 3. qlein-API — Live-Analyse (2026-04-19)

### 3.1 Anbieter

- Entwickelt von **Qlein** (qlein.dev/qlein.de), deutsche Software-Agentur.
- **Kein SaaS** — Custom-Build für Passende-Fenster. Andere Qlein-Kunden: ViPiBaX, tierhygiene24.de, ZFS, SaxxTec, advecs, conzeptplus (keine Fensterbranche).
- **Wichtig:** Daten/Preise werden von Passende-Fenster selbst im Qlein-Admin gepflegt → die API ist **aktuell**, solange passende-fenster den Vertrag mit Qlein hat.

### 3.2 Infrastruktur

- Host: `admin.passende-fenster.de` (Hetzner, 116.202.106.126)
- Stack: Symfony (PHP) + nginx 1.21.1
- React-Frontend auf `configurator.passende-fenster.de` (Last-Modified Oct 2023)

### 3.3 API-Endpoints (VERIFIZIERT)

Alle gegen `https://admin.passende-fenster.de`.

| Methode | Pfad | Zweck | Auth |
|---------|------|-------|------|
| GET | `/api/configurator/1/initstate` | Stammdaten (Brands, Groups, Shapes, rangeSizes) | public |
| GET | `/api/configurator/1/search?inputs=<JSON>` | Artikel-Suche mit Filtern, liefert Basispreise | public |
| GET | `/api/configurator/1/article/{id}/{width}/{height}` | Artikel-Details inkl. Properties, Additions, Variants, Images | public |
| GET | `/api/configurator/configurator_product_state/{id}` | Gespeicherter Konfig-Stand | public |
| POST | `/api/configurator/configurator_product_state_changed/{id}` | Config-Update | public |
| POST | `/api/configurator/add_to_cart` | WooCommerce-Cart (→ passende-fenster.de/cart/) | public |
| GET | `/api/image_generator/window/…` | Live-Preview-Bild (dynamisch) | public |

### 3.4 CORS / Auth

- `Access-Control-Allow-Origin: *`
- **Keine Auth** für GET-Endpoints — aus jedem Frontend nutzbar.

### 3.5 `initstate` — Stammdaten

```json
{
  "groupCategories": [
    {"id": 1, "name": "Einflügelig"},
    {"id": 2, "name": "Zweiflügelig"},
    {"id": 3, "name": "Dreiflügelig"}
  ],
  "groups": [
    {"id": 1, "name": "Einflügelig", "groupCategoryId": 1,
     "shapeConfiguration": [{"height": 100, "shapes": 1}]},
    {"id": 2, "name": "Zweiflügelig", "groupCategoryId": 2,
     "shapeConfiguration": [{"height": 100, "shapes": 2}]},
    {"id": 3, "name": "Dreiflügelig", "groupCategoryId": 3,
     "shapeConfiguration": [{"height": 100, "shapes": 3}]},
    {"id": 6, "name": "Einflügelig mit Oberlicht", "shapeConfiguration": [{"height": 30, "shapes": 1}, {"height": 70, "shapes": 1}]},
    // ... IDs 7, 8, 9, 10, 11, 12, 13, 14, 15 (insgesamt 13 Varianten)
  ],
  "brands": [
    {"id": 1, "name": "Salamander", "image": "back_public/images/brand/63761195426a2.png"},
    {"id": 2, "name": "Aluplast",   "image": "back_public/images/brand/637610b249c57.png"},
    {"id": 3, "name": "Gealan",     "image": "back_public/images/brand/6376111d4846a.png"}
  ],
  "shapes": ["DKL", "DKR", "DL", "DR", "Fest", "Kipp"],
  "rangeSizes": {"minWidth": 400, "maxWidth": 2800, "minHeight": 400, "maxHeight": 3000}
}
```

### 3.6 `search` — korrekte Syntax (WICHTIG — Korrektur zur v1-Spec)

**Request-Syntax:** `inputs` ist ein **JSON-stringifiziertes Objekt als einzelner Query-Parameter**. **Nicht** Bracket-Syntax.

```http
GET /api/configurator/1/search?inputs=<URL-encoded JSON>

Payload-Schema:
{
  "width":    400-2800,        // mm, int
  "height":   400-3000,        // mm, int
  "minPrice": null | int,      // null zulässig — nicht 0!
  "maxPrice": null | int,      // null zulässig
  "group":    int,             // initstate.groups[].id
  "shapes":   [[...]],         // 2D-Array: [Reihen × Flügel]
  "brands":   []               // [] = alle; sonst initstate.brands[].id-Array
}
```

**`shapes` ist ein 2D-Array**, eine Reihe pro Element aus `group.shapeConfiguration`:

- Einflügelig (group=1): `[["Fest"]]`
- Zweiflügelig (group=2): `[["Fest","Fest"]]`
- Zweiflügelig mit Oberlicht (group=8): `[["Fest"],["DKL","DKR"]]` (Reihe 1: Oberlicht, Reihe 2: zwei Flügel)

**Response:**
```json
{
  "results": [
    {
      "id": 23,                 // qlein-Artikel-ID (eindeutig je Group!)
      "brandId": 1,
      "name": "Streamline 76",
      "basePrice": 75.20,       // Gesamtpreis dieser Konfiguration
      "price": 75.20,           // identisch mit basePrice in der Regel
      "properties": [
        {"name": "...", "shortName": "Uw", "value": "0,97", "unit": "W/(qm K)", "main": true},
        // ...
      ],
      "shapesConfiguration": []
    }
  ]
}
```

**Preis-Semantik:** `search.basePrice` ist der **Gesamtpreis** in EUR (Standard weiß/weiß, keine Additions). Die im article-Endpoint enthaltenen `variants[].price`-Werte sind **Aufpreise** der Variante, nicht der Gesamtpreis.

**Endkundenpreis = `search.basePrice` + gewählte `variants[].price` + ausgewählte `additions[].price`.**

### 3.7 `article/{id}/{width}/{height}` (NEU — v1-Spec hatte nur `/article/{id}`)

**Drei Path-Parameter**, nicht einer. `id` = Artikel-ID aus search, `width/height` = in mm.

**Response-Struktur:**

```json
{
  "id": 60,
  "images": [
    "back_public/images/article/1/639c5776db0bf.png",  // Relative URL zu admin.passende-fenster.de
    "back_public/images/article/1/639c57808c9ff.png"
  ],
  "longDescription": null,                              // meist leer
  "properties": [                                       // 4-5 Specs
    {"name": "Bautiefe", "shortName": "Bautiefe", "value": "92", "unit": "mm", "icon": "icon", "main": false},
    {"name": "Kammerzahl", "shortName": "Kammerzahl", "value": "6", "unit": "", "icon": "slat"},
    {"name": "Verglasung", "shortName": "Verglasung", "value": "2", "unit": "- fach", "icon": "window-frame"},
    {"name": "Bestmöglicher Wärmedurchgangskoeffizient", "shortName": "Uw", "value": "0,73", "unit": "W/(qm K)", "main": true},
    {"name": "Dichtung", "shortName": "Dichtung", "value": "3", "unit": ""}
  ],
  "additions": {                                        // 9 Kategorien von Zusatz-Optionen
    "rollladen": [
      {"id": 12, "name": "Vorbaurolllade Aluprof SK 45", "typeName": "Rollladen", "price": 145, "selected": false, "image": "back_public/images/addition/..."},
      // 5 weitere Rollladen-Varianten
    ],
    "sound_insulation": [...],
    "fensterfalzlüfter": [...],
    "Mounting_holes": [...],
    "security_glazing": [...],
    "security_level": [...],
    "edge_bond": [...],
    "structural_glass": [...],
    "frame_widening": [...]
  },
  "variants": [                                         // bis zu ~219 Farb-/Ausstattungs-Kombis pro Artikel
    {
      "id": 129,
      "price": 18,                                      // Aufpreis vs. Standard
      "selected": false,
      "propertyValues": [
        {"id": 6, "name": "Außenfarbe", "shortName": "color", "value": "Anthrazitgrau", "valueCode": "anthraciteGray7016", "position": 2},
        {"id": 15, "name": "Innenfarbe", "shortName": "color", "value": "Verkehrsweiß", "valueCode": "white9016", "position": 1}
        // ggf. weitere (Griff-Farbe etc.)
      ]
    }
    // ...
  ]
}
```

### 3.8 Preis-Mechanik

**Preise sind degressiv** — nicht per Formel berechenbar:

| Profil | 600×800 mm | 1200×1500 mm | 2000×2500 mm |
|---|---:|---:|---:|
| Streamline 76 (variant[0]) | 22 € / 45,8 €/m² | 39 € / 21,7 €/m² | 79 € / 15,8 €/m² |

→ Preise müssen entweder **pro Call von der API geholt** werden oder **im Raster** vorab gescrapt werden.

### 3.9 Bild-Lokalisierung

- Article-Images: Strings wie `back_public/images/article/1/639c5776db0bf.png` → absolute URL: `https://admin.passende-fenster.de/back_public/images/article/1/639c5776db0bf.png`
- Brand-Logos: `back_public/images/brand/{hash}.png` (aus `initstate.brands[].image`)
- Addition-Images: `back_public/images/addition/{hash}.png`
- **Content-Type:** PNG, typisch 100-300 KB
- **Access:** `Access-Control-Allow-Origin: *`, kein Auth
- **Nicht identisch** mit den lokal gescrapten `passende-fenster-scraper/output/`-Bildern (anderer CDN-Pfad, andere Bytes). → Konfigurator-Bilder müssen frisch von `admin.passende-fenster.de` geholt und nach Supabase Storage gespiegelt werden.

### 3.10 Lieferzeit — NICHT in der API

Die im Frontend angezeigte Lieferzeit („ca. 2-6 Wochen") kommt **nicht aus der qlein-API**. Sie liegt als Matrix auf der statischen WordPress-Seite `https://passende-fenster.de/lieferzeiten/`:

| Konfiguration | Lieferzeit |
|---|---|
| Kunststoff, weiß | 2–5 Wochen |
| Kunststoff, anthrazit | 3–6 Wochen |
| Kunststoff, andere Farben | 4–6 Wochen |
| Mit Schallschutz / RS2 etc. | 3–6 Wochen |

→ Für den Relaunch als eigene Config-Tabelle (4 Zeilen) in Supabase; Matching via Außenfarbe + Addition-Selektion.

---

## 4. Produktsortiment (NEU — nach Live-Analyse)

### 4.1 6 Profile im qlein-Konfigurator

| # | Hersteller | Profil-Serie | Uw (W/m²K) | Bautiefe | Kammern | Verglasung | Dichtungen |
|---|------------|--------------|-----------:|---------:|--------:|-----------:|-----------:|
| 1 | Salamander | **Streamline 76** | 0,97 | 76 mm | 5 | 2-fach | 2 |
| 2 | Salamander | **BluEvolution 82** | 0,77 | 82 mm | 6 | 3-fach | 3 |
| 3 | Salamander | **BluEvolution 92** | 0,73 | 92 mm | 6 | (API-Lücke → 3-fach laut eko4u) | 3 |
| 4 | Aluplast   | **Aluplast 4000** | 0,76 | 70 mm | 5 | 2-fach | (API-Lücke) |
| 5 | Aluplast   | **Aluplast 8000** | 0,67 | 85 mm | 6 | 3-fach | (API-Lücke) |
| 6 | Gealan     | **Gealan S 9000** | 0,73 | 82,5 mm | 6 | 3/4-fach | 3 |

**Alle 6 sind PVC.** Der qlein-Konfigurator kennt keine Alu- oder Holz-Fenster.

**Bestätigte Spec-Lücken in der qlein-API**, die aus eko4u/Eko-Okna-Texten ergänzbar sind:
- BluE 92 Verglasung: **3-fach** (bestätigt aus eko4u)
- Aluplast 4000 Dichtungen: offen
- Aluplast 8000 Dichtungen: offen (laut Eko-Okna-Text: 3 Dichtungen)

### 4.2 Mapping qlein → eko4u (Eko-Okna)

| qlein-Name | eko4u-Name | Status |
|---|---|---|
| Streamline 76 | `SL76.zip` in PVC-ZIP-Liste vorhanden | Auslauf-/Nebenprodukt — nicht im Haupt-Salamander-Menü, aber als Profil verfügbar |
| BluEvolution 82 | **BluEvolution 82** | 1:1 |
| BluEvolution 92 | **BluEvolution 92** | 1:1 |
| Aluplast 4000 | **Ideal 4000** (70 mm) | wahrscheinlich 1:1, Detail-Specs noch zu bestätigen |
| Aluplast 8000 | **Ideal 8000** (85 mm, 6 Kammern, 3 Dichtungen) | 1:1 bestätigt |
| Gealan S 9000 | **S9000.zip** | 1:1 |

### 4.3 Offene Produkt-Entscheidungen (für Kunden passende-fenster.de)

- [ ] **Streamline 76 behalten oder durch greenEvolution 76 Flex ersetzen?** (greenEvolution hat deutlich bessere Werte: Uw 0,74 statt 0,97, 3-fach Verglasung statt 2-fach)
- [ ] **Alu-Fenster im Relaunch?** Eko-Okna hat 55+ Alu-Serien (MB-86, Decalu, Schüco, Cortizo, MasterLine, …). qlein kennt 0. Optionen: (a) Alu-Fenster nicht anbieten, (b) als Lead-Formular („Anfrage senden"), (c) als Text-Katalog ohne Konfigurator, (d) mit Konfigurator (aufwändig).
- [ ] **Holz-Fenster im Relaunch?** Alte WP-Site zeigt 70 Holz-Artikel. Aktuelles Lieferfähig-Status unbekannt.
- [ ] **Erweitertes PVC-Sortiment?** Eko-Okna hat 45+ PVC-Profile. qlein-Konfigurator zeigt nur 6. Erweiterung möglich, aber Datenpflege-Aufwand steigt massiv.

---

## 5. Strategische Entscheidung: Eigene Datenbank

### 5.1 Warum nicht die qlein-API live nutzen

- **Uptime nicht garantiert** — Symfony-Backend im Debug-Modus signalisiert „abandoned" (Last-Modified Oct 2023)
- **Rechtlich unklar** — API gehört PF + Qlein, nicht unserem Relaunch-Projekt
- **Abhängigkeit** — wenn PF den Vertrag mit Qlein kündigt, ist unsere Seite sofort kaputt
- **Geschwindigkeit** — Live-API-Call pro Konfiguration > lokaler Lookup
- **Kontrolle** — wir wollen Preise selber pflegen und Brands erweitern können

### 5.2 Warum Supabase (PostgreSQL)

- Passt zum bevorzugten Stack (Next.js + Supabase + shadcn)
- Relationen sauber abbildbar (Brand × Shape × Group × Article × Properties × Additions × Variants)
- Auto-REST-API via PostgREST → Agent-First-Prinzip erfüllt
- Admin-Dashboard out-of-the-box → Kunde kann Preise selbst pflegen
- Storage für die Bilder (5 GB Free Tier reicht)
- Row Level Security verfügbar
- Future-proof für Kauf-Erweiterung (Phase 4, siehe §8)

### 5.3 Projekt-Setup

- **Supabase-Projekt:** `passende-fenster` (ref: `fvafvfhdrbziivlbuuqn`), eu-central-1, angelegt 2026-04-19
- **Initiale Migration `0001_initial_schema`** bereits gepusht — aber Schema ist zu schmal (siehe §6), muss vor Import mit Migration `0002_full_schema` erweitert werden.

---

## 6. Datenbank-Schema

### 6.1 Status

**`0001_initial_schema` ist live** im Supabase-Projekt, aber zu knapp — nur Basis-Tabellen. Für den qlein-Datenimport muss **Migration `0002_full_schema`** folgen, die Properties, Additions, Variants und Bilder-mit-Storage-Paths ergänzt.

### 6.2 Schema Phase 1 — Ziel-Zustand

```sql
-- ============================================================
-- Stammdaten (teilweise in 0001 vorhanden, erweitern in 0002)
-- ============================================================

-- brands, shapes bleiben wie in 0001
-- groups erweitern:
alter table groups
  add column if not exists category_id int,        -- 1, 2, 3 aus groupCategories
  add column if not exists group_category_name text;

-- ============================================================
-- Produkte — überarbeitet
-- ============================================================

-- articles: EIN Profil-Typ pro Brand, unabhängig von Group
-- (qlein hat pro Group eine eigene article-ID — wir normalisieren das)
alter table articles
  drop column if exists base_price_cents;          -- Preis hängt von Size ab, nicht auf article

-- N:M qlein-Artikel-IDs → unser Profil (weil qlein pro Group eine ID führt)
create table article_group_mappings (
  id                bigserial primary key,
  article_id        bigint not null references articles(id) on delete cascade,
  group_id          bigint not null references groups(id) on delete cascade,
  qlein_article_id  int unique not null,            -- z.B. 23 (Streamline 76 @ Einflügelig)
  created_at        timestamptz default now()
);

-- Properties (Bautiefe, Kammerzahl, Verglasung, Uw, Dichtung)
create table article_properties (
  id              bigserial primary key,
  article_id      bigint not null references articles(id) on delete cascade,
  short_name      text not null,                    -- Uw, Bautiefe, ...
  name            text not null,                    -- „Bestmöglicher Wärmedurchgangskoeffizient"
  value           text not null,                    -- „0,73"
  unit            text,                             -- „W/(qm K)"
  icon            text,                             -- „thermometer-full"
  is_main         bool default false,               -- hervorhebbar in UI
  sort_order      int default 0,
  unique (article_id, short_name)
);

-- Additions (Rollladen, Schallschutz, etc.) — je Artikel eine Liste von Zusatz-Kategorien
create table addition_categories (
  id         bigserial primary key,
  code       text unique not null,                  -- rollladen, sound_insulation, ...
  name       text not null,                         -- „Rollladen"
  sort_order int default 0
);

create table article_additions (
  id                  bigserial primary key,
  article_id          bigint not null references articles(id) on delete cascade,
  category_id         bigint not null references addition_categories(id),
  external_id         int,                          -- qlein addition.id
  name                text not null,                -- „Vorbaurolllade Aluprof SK 45"
  type_name           text,                         -- „Rollladen"
  price_cents         int,                          -- Aufpreis in Cent
  image_storage_path  text,                         -- Storage-Pfad nach Import
  is_default          bool default false,           -- selected=true in qlein
  sort_order          int default 0
);

-- Property-Values (Farben, Materialien etc. — für variants)
create table property_values (
  id            bigserial primary key,
  external_id   int,                                -- qlein propertyValue.id
  name          text not null,                      -- „Außenfarbe"
  short_name    text not null,                      -- „color"
  value         text not null,                      -- „Anthrazitgrau"
  value_code    text,                               -- „anthraciteGray7016" (RAL-basiert)
  image_storage_path text,
  unique (external_id)
);

-- Variants (Farb-/Ausstattungs-Kombinationen pro Artikel)
create table article_variants (
  id             bigserial primary key,
  article_id     bigint not null references articles(id) on delete cascade,
  external_id    int unique,                        -- qlein variant.id
  price_cents    int,                               -- Aufpreis vs. Basispreis
  is_default     bool default false,                -- selected=true in qlein
  created_at     timestamptz default now()
);

create table article_variant_property_values (
  variant_id         bigint not null references article_variants(id) on delete cascade,
  property_value_id  bigint not null references property_values(id),
  position           int,
  primary key (variant_id, property_value_id)
);

-- Bilder (Artikel-Bilder, Brand-Logos, Addition-Icons)
-- ersetzt die alte images-Tabelle aus 0001
drop table if exists images cascade;

create table article_images (
  id              bigserial primary key,
  article_id      bigint references articles(id) on delete cascade,
  storage_path    text not null,                    -- Pfad in Supabase Storage
  source_url      text,                             -- Original-URL bei admin.passende-fenster.de
  type            text not null check (type in ('article', 'variant', '360_frame', 'thumbnail')),
  sort_order      int default 0,
  metadata        jsonb
);

-- Preis-Raster: Preis pro (Artikel × Group × Width × Height)
-- Aus search.basePrice gesammelt im Scraping-Raster (z.B. 100mm-Schritte)
create table article_price_points (
  id           bigserial primary key,
  article_id   bigint not null references articles(id) on delete cascade,
  group_id     bigint not null references groups(id),
  width_mm     int not null,
  height_mm    int not null,
  base_price_cents int not null,                    -- Gesamtpreis dieser Standard-Konfiguration
  scraped_at   timestamptz default now(),
  unique (article_id, group_id, width_mm, height_mm)
);

create index article_price_points_lookup_idx
  on article_price_points(article_id, group_id, width_mm, height_mm);

-- Lieferzeit-Matrix (aus /lieferzeiten/ WP-Seite)
create table delivery_time_rules (
  id              bigserial primary key,
  description     text not null,                    -- „Kunststoff, weiß"
  match_criteria  jsonb not null,                   -- {material: "PVC", color: "white", extras: []}
  weeks_min       int not null,
  weeks_max       int not null,
  sort_order      int default 0
);
```

### 6.3 inquiries / orders / payments / invoices

**Unverändert wie in `0001_initial_schema`.** Phase-4-Tabellen bleiben leer, bis `ENABLE_PURCHASE=true`.

### 6.4 API-Design (Agent-First)

Alle Endpoints als REST-JSON, parallel nutzbar von Frontend, Agenten, Skills und externen Tools.

**Phase 1 — Konfigurator + Lead-Flow**

| Methode | Pfad | Zweck | Auth |
|---------|------|-------|------|
| GET | `/api/v1/init` | Brands, Shapes, Groups, rangeSizes | public |
| GET | `/api/v1/articles` | Artikel-Liste (Query: width, height, shape, groupId, brandIds) → liefert matchende Artikel + Preise aus `article_price_points` | public |
| GET | `/api/v1/articles/:slug` | Artikel-Detail inkl. Properties, Additions, Variants, Bilder | public |
| GET | `/api/v1/articles/:slug/price?width=...&height=...&group=...` | Preis für konkrete Konfig (Lookup + Interpolation) | public |
| POST | `/api/v1/inquiries` | Anfrage anlegen | public |
| GET | `/api/v1/inquiries/:id` | Anfrage abrufen | admin |
| PATCH | `/api/v1/inquiries/:id` | Status/Notiz ändern | admin |
| GET | `/api/v1/inquiries` | Anfragen listen | admin |

**Phase-4-Endpoints** (orders, payments, webhooks) bleiben als Stubs mit `503 Feature Disabled`.

### 6.5 Agent-Skills auf der API (Phase 1)

Skills unter `~/.claude/skills/pf-*/`:

- `pf-quote` — Konfiguration einlesen, Preis berechnen, Angebot erstellen
- `pf-inquiry-status` — Anfrage-Liste, Filter nach Status/Datum
- `pf-inquiry-followup` — Mail an Kunde (nutzt imap-smtp-email Skill)
- `pf-katalog-search` — Artikel-Suche per CLI für Telefonberatung

### 6.6 Storage-Buckets

- `products/` — Artikel-Bilder (article_images.storage_path)
- `brands/` — Brand-Logos
- `additions/` — Rollladen-/Schallschutz-Icons
- `variants/` — Farb-Samples (wenn qlein welche liefert)

Buckets müssen via Supabase Management-API erstellt werden (nicht per SQL-Migration).

---

## 7. Implementation Plan Phase 1

### Schritt 1 — Schema erweitern (`0002_full_schema.sql`)

Migration schreiben + pushen (§6.2). Dauer: ~30 min.

### Schritt 2 — Storage-Buckets anlegen

Via Supabase Management-API: `products/`, `brands/`, `additions/`, `variants/`. Dauer: 5 min.

### Schritt 3 — qlein-Scraper bauen (`scripts/qlein-scraper.py`)

- **initstate** → `brands`, `shapes`, `groups`
- **search-Raster** für alle 6 Profile × 3 Haupt-Groups (1, 2, 3) × Standardgrößen → alle qlein-article-IDs sammeln (insgesamt ~18 IDs), `article_group_mappings` befüllen
- **article/{id}/{w}/{h}** für jede qlein-article-ID bei mittlerer Größe (z.B. 1200×1400) → `articles`, `article_properties`, `addition_categories`, `article_additions`, `property_values`, `article_variants`, `article_variant_property_values`, `article_images` (nur Storage-Pfade speichern, Bytes separat)
- **Preis-Raster** — für jedes Artikel×Group 200mm-Schritte von 400–2800 × 400–3000 → `article_price_points` (6 Profile × 3 Groups × ~120 Size-Punkte ≈ 2160 API-Calls, ~20 Min)

Dauer: ~4 h Coden + ~30 Min Laufzeit.

### Schritt 4 — Image-Sync (`scripts/qlein-image-sync.py`)

Für jeden `storage_path` in `article_images`, `brands.logo_url`, `article_additions.image_storage_path`, `property_values.image_storage_path`:
1. Absolut-URL konstruieren: `https://admin.passende-fenster.de/{storage_path}`
2. Download
3. Upload nach Supabase Storage mit gleichem Pfad
4. DB-Eintrag bleibt mit dem Pfad (jetzt relativ zum Storage-Bucket)

Dauer: 1–2 h Coden + variabel Laufzeit (Anzahl Bilder × ~1 s).

### Schritt 5 — Lieferzeit-Tabelle seeden

4 Zeilen manuell aus der `/lieferzeiten/`-Matrix (§3.10). Entscheidung: einfaches `match_criteria`-JSON oder komplexes Rule-System. Für 4 Regeln reicht JSON.

### Schritt 6 — API-Routes (Next.js)

- `/api/v1/init`
- `/api/v1/articles?…`
- `/api/v1/articles/:slug`
- `/api/v1/articles/:slug/price?…`
- `/api/v1/inquiries` (POST)

Dauer: ~6 h.

### Schritt 7 — Konfigurator-UI (Variante Kreativ)

- Maß-Eingabe (Width/Height mit Validierung gegen rangeSizes)
- Group-Wahl (13 Varianten mit Preview-Icons)
- Shape-Wahl pro Flügel
- Brand-Filter
- Result-Liste sortiert nach Preis oder Uw
- Detail-View mit Farb-Auswahl (Variants) und Additions
- CTA: „Angebot anfordern" → `inquiries`-Form

Dauer: ~2–3 Tage.

### Schritt 8 — E-Mail-Notification bei neuer Anfrage

Resend oder Supabase Edge Function, mailt an `info@passende-fenster.de` (zu bestätigen mit Kunde).

### Schritt 9 — Sanity-Checks

- Preise aus Supabase matchen mit qlein-API-Live-Werten?
- Bilder rendern korrekt?
- Inquiry-Flow funktioniert?

---

## 8. Phase 4 — Kauf-Option (unverändert vs. v1)

Schema-Stubs (orders, payments, invoices) sind bereits in `0001_initial_schema` angelegt. Inaktiv bis `ENABLE_PURCHASE=true`. Details siehe v1-Spec Abschnitt 9 — bleiben gleich.

---

## 9. Phase 2 — eko4u-Watchdog (NEU)

Automatisierte Überwachung des Eko-Okna-Händlerbackends (eko4u.com) auf Sortiments- und Spec-Änderungen. Details in eigener Spec:

→ **[specs/eko4u-watchdog.md](./eko4u-watchdog.md)**

Aktivierung **nach Phase-1-Launch**. Ziel: Telegram-Alerts bei Änderungen, manuelle Freigabe in DB.

---

## 10. Offene Fragen / Entscheidungen

- [ ] **Streamline 76 vs. greenEvolution 76 Flex** — Kundenentscheidung (siehe §4.3).
- [ ] **Alu- / Holz-Fenster** im Relaunch-Scope? (§4.3)
- [ ] **Preis-Raster-Granularität** — 100 mm oder 200 mm? (Trade-off: Interpolationsgenauigkeit vs. Scrape-Aufwand). Empfehlung: 200 mm + lineare Interpolation auf dem Client.
- [ ] **Lead-Flow** — Anfragen an `info@passende-fenster.de` oder eigene Adresse?
- [ ] **Debug-Modus melden** — Kunde informieren, dass `admin.passende-fenster.de/_profiler/` öffentlich ist.
- [ ] **Live-Sync** — regelmäßiger Re-Scrape von qlein während PF den Vertrag mit Qlein hält? Empfehlung: wöchentlicher Cron, Delta-Upsert.
- [ ] **Bild-Lizenz** — dürfen wir die qlein-/Eko-Okna-Bilder mirrorn oder brauchen wir eigene Renderings? (Wahrscheinlich OK im Rahmen des PF-Auftrags, aber formell mit Kunde klären.)

---

## 11. Nächste Schritte (priorisiert)

1. **Schema-Migration `0002_full_schema.sql` schreiben + pushen**
2. **Storage-Buckets anlegen**
3. **qlein-Scraper bauen und ausführen**
4. **Image-Sync ausführen**
5. **Lieferzeit-Tabelle seeden**
6. **API-Routes + Konfigurator-UI**
7. **Sanity-Check + Launch**

Implementierung in eigener Session (ohne Kontext-Ballast der Recherche).

---

## 12. Fortschritt

### 12.1 Abgeschlossen (Stand 2026-04-19)

**Phase 1a — Backend-Kern (§7 Schritt 1-5):** ✅ komplett
**Phase 1b — API-Routes (§7 Schritt 6):** ✅ komplett (Commit `5e033a4`)
**UX-Recherche (Vorarbeit Schritt 7):** ✅ komplett — siehe [`konfigurator-ux-research.md`](./konfigurator-ux-research.md)

- **Schema-Migrations** (Supabase `fvafvfhdrbziivlbuuqn`):
  - `0001_initial_schema` — Basis-Tabellen
  - `0002_full_schema` — Properties, Property-Values (mit `property_id`-FK), Addition-Categories, Article-Additions mit eigenen Addition-Variants (bis zu 41 pro Addition — **neu entdeckt in Live-API, nicht in v2-Spec §6.2**), Article-Variants, Price-Points, Delivery-Rules
  - Schema-Korrekturen vs. v2-Spec sind in den Migration-Kommentaren dokumentiert
- **Storage-Buckets** angelegt (public-read): `products`, `brands`, `additions`, `variants`
- **qlein-Scraper** (`scripts/qlein-scraper.py`) — stdlib-only, cached unter `scripts/.cache/`, idempotent. Emittiert:
  - `scripts/seeds/0001_qlein_data.sql` (402 KB single-file seed)
  - `scripts/seeds/chunks/0001_qlein_data_{001..009}.sql` (für MCP-Payload-Limit)
  - `scripts/seeds/manifest.json` (39 Bild-Einträge)
- **Apply-Seed** (`scripts/apply-seed.py`) — lädt Chunks per Supabase Secret-Key via RPC `admin_exec_sql` (temporäre Function, nur für Import-Phase). Alle 9 Chunks laufen in <1 s durch.
- **Image-Sync** (`scripts/qlein-image-sync.py`) — 39 Bilder von `admin.passende-fenster.de` nach Supabase Storage. Idempotent (skip bei 409).
- **Lieferzeit-Regeln** (4 Zeilen) aus §3.10 seedet.

**DB-Stand nach Import:**

| Tabelle | Zeilen |
|---|---:|
| brands / shapes / groups | 3 / 6 / 13 |
| articles / article_group_mappings | 6 / 18 |
| article_properties | 29 |
| properties / property_values | 10 / 74 |
| addition_categories | 9 |
| article_additions / _variants / _pv | 85 / 416 / 652 |
| article_variants / _pv | 719 / 1438 |
| article_images (DB-Referenzen) | 8 |
| Storage-Objekte (products/brands/additions/variants) | 8 / 3 / 5 / 23 = 39 |
| article_price_points (Raster 200 mm) | 2442 |
| delivery_time_rules | 4 |

**API-Oberfläche nach Schritt 6:**

| Methode | Pfad | Zweck |
|---|---|---|
| GET | `/api/v1/init` | Stammdaten (brands, shapes, groups, rangeSizes) |
| GET | `/api/v1/articles?w=&h=&group=&brand[]=&shapes[]=` | Artikel-Liste mit Preis (bilinear interpoliert) |
| GET | `/api/v1/articles/:slug` | Detail (properties, additions+variants, article-variants, images) |
| GET | `/api/v1/articles/:slug/price?w=&h=&group=` | Einzelpreis-Lookup |
| POST | `/api/v1/inquiries` | Lead anlegen (public) |
| GET | `/api/v1/inquiries` | Admin-Liste (`x-admin-token`) |
| GET/PATCH | `/api/v1/inquiries/:id` | Admin-Detail/Update |

**Neue Libs:** `src/lib/supabase/{server,browser}.ts`, `src/lib/storage.ts` (Storage-URLs), `src/lib/price-interpolation.ts`, `src/lib/auth.ts`, `src/lib/db-types.ts` (MCP-generiert). Dependencies: `@supabase/supabase-js`, `zod`.

**Credentials:** `.env.local` liegt lokal (gitignored). `SUPABASE_SECRET_KEY` und `ADMIN_API_TOKEN` werden vor Live-Gang rotiert.

**Follow-ups / Tech-Debt aus Schritt 6:**

1. `admin_note` im PATCH landet in `inquiries.configuration.admin_notes[]` (JSONB, append-only), weil die Tabelle keine dedizierte Spalte hat. **TODO:** Migration `0003_inquiries_admin_notes` — eigene `admin_notes` Tabelle oder Spalte.
2. `shapes[]`-Query-Parameter wird akzeptiert, aber nicht DB-seitig angewendet (alle 6 Profile unterstützen alle Shapes; `article_shapes` ist leer). UI darf ihn trotzdem mitschicken — wird in `query`-Feld zurückgespiegelt. **TODO bei Sortimentserweiterung:** `article_shapes` pflegen + Filter aktivieren.
3. **Image-Sync-Lücke:** Nur 39 Bilder gemirrort (aus dem Standard-Artikel-Call bei 1200×1400). Viele Article-Variants haben keine eigenen Bilder in Storage → Response liefert entweder `image: null` oder eine URL auf `back_public/…` die 404 liefern kann. **TODO:** Image-Sync so erweitern, dass er alle distinct `image`-URLs aus `properties.image`, `variants.propertyValues[].image` und weiteren article/{id}/{w}/{h}-Responses erfasst.

### 12.2 Offen (nächste Session)

**Phase 1c — UX-Design + Konfigurator-UI (§7 Schritt 7):**

Grundlage bilden drei Dokumente:
- `specs/konfigurator-ux-research.md` — 5 Wettbewerber analysiert, Take-Aways
- `specs/konfigurator-api.md` — API-Details für den UI-Layer
- `specs/konfigurator-db.md` §7 / §10 — Scope-Grenzen, offene Produktfragen

**Kern-Empfehlungen aus der Recherche:**

- **Unser USP = umgekehrte Reihenfolge.** Alle Wettbewerber fragen zuerst das Profil, dann die Maße. Wir machen es andersrum: **Maße + Flügel + Öffnungsarten → matchende Profile im Preis-/Uw-Vergleich**. Dadurch wird die Liste der 6 Profile zum entscheidenden Mehrwert-Moment.
- **Ausmess-Tutorial als eigenständige SEO-Seite + Modal-Einbindung im Konfigurator.** Differenzierungs-Chance: interaktiver Mini-Rechner "Rohbaumaß → Bestellmaß", State-Sharing mit dem Konfigurator. Pflicht-Inhalte: Altbau-vs-Neubau, Messpunkte, Einbauluft-Tabelle, Fensterbank, Rollladen, Glossar.
- **Stepped Single-Page-Layout mit Sticky Live-Preview + Live-Preis.** Mobile: Preview als Floating-Bottom-Sheet. Nicht mehrseitiger Wizard.
- **Lead-Funnel (nicht Warenkorb).** CTA: „Angebot anfordern". Optional: „Konfiguration per Mail" als Soft-Conversion.

**Konkrete Aufgaben Schritt 7:**

1. **UX-Flow finalisieren** — Brainstorm (siehe Start-Prompt unten). Output: `specs/konfigurator-ui.md` mit Wireframes, Komponenten-Baum, States.
2. **Design-Richtung** — Kreativ-Variante mit `frontend-design`-Skill (Farben, Typo, Mood innerhalb der bestehenden Marke).
3. **Konfigurator-Seite** — `src/app/konfigurator/page.tsx` + Komponenten. Verbraucht die API aus Schritt 6.
4. **Ausmess-Guide-Seite** — `src/app/fenster-ausmessen/page.tsx` (SEO-Slug). Inkl. Mini-Rechner als Client-Component.
5. **Modal-Einbindung** des Guide-Contents im Konfigurator (gleiche Komponenten, Drawer-View).

**Phase 1d — Mail + Sanity (§7 Schritt 8-9):** bewusst nicht im Scope der nächsten Session. Erst nach UI-Rollout.

### 12.3 Architektur-Entscheidungen

- **Secret-Key-only Setup.** Kein direktes Postgres (psycopg2) — alle Schreibzugriffe gehen über PostgREST + temporäre `admin_exec_sql`-RPC oder Supabase MCP. Vorteil: reproduzierbar per Seed-Datei, commitbar.
- **Preis-Raster 200 mm** + bilineare Interpolation (`src/lib/price-interpolation.ts`). ~2400 Preispunkte, deckt 400–2800 mm × 400–3000 mm ab. Für Re-Scrape auf 100 mm: `PRICE_STEP = 100` in `qlein-scraper.py`.
- **Seed-Workflow**: `scripts/qlein-scraper.py` → commitbares `.sql` + `manifest.json`; `scripts/apply-seed.py` applyt. Re-Run für Preisupdates geplant wöchentlich (Cron, siehe §10 offene Fragen).
- **API-First, keine UI-Duplikate.** Alle Daten sind via `/api/v1/*` zugänglich. Agents und Frontend nutzen dieselbe Oberfläche.
- **Admin-Auth als Stub.** `x-admin-token`-Header gegen `ADMIN_API_TOKEN`-ENV. Vor Launch durch echtes Login ablösen.
- **UX-Differenzierung durch umgekehrte Flow-Reihenfolge** (Maße zuerst, Profil-Vergleich danach). Begründung in `konfigurator-ux-research.md`.

---

## 13. Referenzen

- **Live-API-Audit:** [`qlein-api-findings.md`](./qlein-api-findings.md)
- **Phase-2-Spec:** [`eko4u-watchdog.md`](./eko4u-watchdog.md)
- **Scraper (Katalog-Bilder):** `../passende-fenster-scraper/scrape.py` + `output/data.json`
- **Alt-Konfigurator-UI:** `https://passende-fenster.de/konfigurator/` (iframe zu `configurator.passende-fenster.de`)
- **qlein-API-Backend:** `https://admin.passende-fenster.de/api/configurator/1/*`
- **qlein-Agentur:** https://qlein.de (Kontakt nur bei Lizenzfragen)
- **Eko-Okna Händler-Plattform:** `https://eko4u.com` (Login erforderlich) / `https://benefit.ekookna.com` (Wissenszone)
- **Supabase-Projekt:** `passende-fenster`, ref `fvafvfhdrbziivlbuuqn`, eu-central-1
- **Relaunch-Varianten:** `passende-fenster-{kreativ,minimal,professionell}/`
