# Konfigurator-Image-Pipeline — Phase 1d

**Datum:** 2026-04-19
**Status:** Scope freigegeben, Implementation in naechster Session
**Voraussetzung:** Phase 1c abgeschlossen (Commit `63c937f`)

## 1. Ausgangslage

Die Konfigurator-UI aus Phase 1c funktioniert End-to-End, aber die visuelle Darstellung ist unter dem Level des bestehenden qlein-Konfigurators:

| Element | Ist-Zustand | Soll-Zustand |
|---|---|---|
| Profil-Bilder (Step 3) | 2 Bilder via qlein-Sync | +1 hochwertiges Katalog-Thumbnail pro Profil |
| Addition-Bilder | 5 Rollladen-Bilder sichtbar, Rest fehlt | Jede Option + ggf. Varianten mit Bild |
| Farb-Varianten (100 pro Profil) | Grauer Leer-Swatch, kein Bild | Farb-Sample-Bild aus WP-Katalog |
| Live-Fenster-Preview | Client-SVG nur Shapes, keine Farbe | SVG mit Farb-Fill der gewaehlten Variant |
| 360°-Rotations-Viewer | — | Optional-Premium: 19-Frame-Sequenz pro Profil |

**Chris-Feedback 2026-04-19 wörtlich:** „Ich sehe da keine Bilder. Dann gibt es doch unterschiedliche Farben. Wo kommt denn das alles her? Also es ist absolut nicht auf dem Stand vom Konfigurator, den es ersetzen soll."

**Was Phase 1c uebersehen hat:** Die fuer den visuellen Stand benoetigten Bilder sind **bereits lokal heruntergeladen** in `~/projects/passende-fenster-scraper/output/` (2,6 GB, 15.671 Bilder, 10.369 Farbsamples, 19-Frame-360°-Sets fuer 369 Produkte). Die Spec-Zeile in `konfigurator-db.md §2.1` „nicht identisch mit den Konfigurator-Bildern" hatte irrefuehrend dazu gefuehrt, diese Quelle zu ignorieren — gemeint war nur „andere URL-Pfade", nicht „andere Motive".

## 2. Scope

**Drin:**
1. Mapping-Script qlein-Artikel → WP-Katalog-Produkt (Fuzzy-Matching ueber Name + Hersteller)
2. Mapping-Script qlein-Variant-value_code → WP-Farbsample (URL-Pattern + RAL-Fallback)
3. Image-Upload-Script: relevante Bilder aus `~/projects/passende-fenster-scraper/output/` nach Supabase Storage
4. DB-Migration `0003_wp_images.sql` — Pfade in `article_images`, `property_values.image_storage_path`, `article_additions.image_storage_path`
5. UI-Fix Step 4: Accordion flach → Category-Header + Toggle-Liste (wie besprochen in Chris-Feedback 2026-04-19)
6. UI-Fix Step 4: Addition-Bilder in Toggle-Rows rendern
7. UI-Fix Step 4: Farb-Swatches gross (mind. 64 × 48 px) mit Name + RAL-Code

**Optional-Premium:**
8. 360°-Viewer in Step 3 / Sidebar (falls in `src/components/katalog/` bereits existiert, wiederverwenden)
9. Live-Farb-Fill im Fenster-SVG-Preview (Aussenrahmen + Innenrahmen separat)

**Nicht drin (Phase 1e):**
- Mail-Notification bei Inquiry-POST (Schritt 8)
- Sanity-Checks + Launch (Schritt 9)
- Alu/Holz-Lead-Seiten

## 3. Daten-Inventar

### 3.1 WP-Scraper-Output

```
~/projects/passende-fenster-scraper/output/
├── data.json                (4,2 MB, 1.224 Produkte)
├── fenster/pvc-fenster/
│   ├── bluevolution-82-35-mm/  (19 frames + 46 colors)
│   ├── bluevolution-82-60-mm/  (19 frames + 46 colors)
│   ├── bluevolution-82-aluschale/
│   ├── ideal-4000-{40,65,70,102,122,142,162}-mm/  (19 frames + 62 colors jeweils)
│   ├── ideal-4000-aluschale/
│   ├── ideal-8000/ + ideal-8000-aluschale/
│   ├── s9000-{35,65}-mm/ + s9000-s9000-{ad,md}/ (34 colors)
│   ├── greenevolution-flex-{35,65}-mm-{2d,3d}/  (46 colors)  ← fuer spaeteren Austausch Streamline 76
│   └── ekosun-{6-nl, 70}/
├── fenster/aluminiumfenster/  (13 Serien — Phase-1e-relevant)
├── fenster/holzfenster/  (5 Serien — Phase-1e)
├── fensterabdeckungen/
│   ├── vorbaurolllaeden/sk45/
│   ├── aufsatzrolllaeden/{cleverbox, roka-top-2, elite-xt}/
│   ├── screen-rolllaeden/heroal-vs-z/
│   └── fensterlaeden/
└── data.json
```

### 3.2 data.json Produkt-Schema

```json
{
  "name": "BluEvolution 82 35 mm",
  "slug": "bluevolution-82-35-mm",
  "url": "https://passende-fenster.de/bluevolution-82-35-mm/",
  "category_path": ["fenster", "pvc-fenster", "bluevolution-82"],
  "specs": ["Uw bis 0,77", "Bautiefe 82 mm", ...],
  "description": "...",
  "tags": ["...", ...],
  "images": {
    "thumbnail": "https://passende-fenster.de/wp-content/uploads/.../1-250.jpg",
    "360_frames": ["https://...", ...],      // meistens 19 frames
    "colors": ["https://...", ...],           // 34-62 Samples
    "other": []
  }
}
```

### 3.3 Supabase — Ist-Zustand Phase 1c

- **article_images** (8 Zeilen — zu wenig): article-type + thumbnail-type Bilder
- **article_additions.image_storage_path** (5 Zeilen haben Bilder, Rest NULL)
- **property_values.image_storage_path** (74 Zeilen — KEINE haben Bilder)

### 3.4 Mapping-Hypothesen qlein ↔ WP-Slug

| qlein-Artikel (DB) | WP-Slug-Kandidat | Bestaetigung |
|---|---|---|
| BluEvolution 82 | `bluevolution-82-35-mm` (primary) + `-60-mm` + `-aluschale` | ✅ direkter Name-Match |
| BluEvolution 92 | ❓ — im Scraper nicht direkt aufgefuehrt | Manuell pruefen: `greenevolution-flex-*` wurde als Ersatz diskutiert |
| Aluplast 4000 | `ideal-4000-*` (6 Bautiefen) | ✅ Aluplast=Marke, Ideal=Serie (siehe DB-Spec §4.2) |
| Aluplast 8000 | `ideal-8000` / `ideal-8000-aluschale` | ✅ |
| Gealan S 9000 | `s9000-35-mm` / `-65-mm` / `s9000-s9000-{ad,md}` | ✅ |
| Streamline 76 | ❌ kein direkter Match | Chris plant Austausch durch greenEvolution 76 Flex (siehe `konfigurator-db.md §10.1`). Fuer 1d: Fallback auf generisches Bild oder `greenevolution-flex-*`-Bilder als Ersatz-Darstellung. |

## 4. Implementation-Plan

### Schritt 1 — Mapping-Analyse + Script-Framework (~1 h)

`scripts/wp-image-matcher.py`:
- Laedt `data.json` und die 6 qlein-Artikel aus Supabase
- Fuzzy-matcht Namen (rapidfuzz oder einfacher Ratio)
- Fuer Mehrfach-Matches (z.B. 6 `ideal-4000-*`-Bautiefen): primaeres Produkt ist das ohne Bautiefen-Suffix oder das „default" (groesste Variante?). Chris-Entscheidung bei Unklarheit.
- Output: `scripts/seeds/0003_wp_image_mapping.json` mit `{ qlein_article_slug, wp_slug, thumbnail_url, color_urls[], frames_url[] }`

### Schritt 2 — Farb-Mapping (~1 h)

`scripts/wp-color-matcher.py`:
- Analysiert die URL-Patterns der `colors[]`-Listen
- Erwartung: Dateinamen enthalten entweder RAL-Codes, Farbnamen oder Indizes
- Matcht qlein-`property_values.value_code` gegen diese Patterns
- Bei Unklarheit: Index-basiertes Mapping (Farb-Reihenfolge ist zwischen Produkten konsistent bei gleicher Marke — das muss empirisch gepruefte werden)
- Output: `scripts/seeds/0003_wp_color_mapping.json` mit `{ property_value_id, wp_color_url }`

### Schritt 3 — Image-Upload (~30 min)

`scripts/wp-image-upload.py`:
- Liest Mapping-JSONs
- Findet lokale Files (URL-Pfad → `output/`-Dateipfad — braucht Pfad-Rekonstruktion aus `slug` + `category_path`)
- Uploaded nach Supabase Storage:
  - Thumbnails → `products/wp/{article_slug}-thumb.jpg`
  - Additions → `additions/wp/{option_external_id}.jpg`
  - Farbsamples → `variants/wp/{property_value_external_id}.jpg`
  - 360°-Frames → `products/wp/360/{article_slug}/{frame_idx}.jpg`
- Idempotent (skip bei 409 Conflict)

### Schritt 4 — DB-Migration (~15 min)

`supabase/migrations/0003_wp_images.sql`:
- Insert in `article_images` fuer neue Thumbnails + 360°-Frames (Type „thumbnail" bzw. „360_frame")
- Update `article_additions.image_storage_path` fuer matched Options
- Update `property_values.image_storage_path` fuer matched Farben

### Schritt 5 — UI-Refactor Step 4 (~2 h)

`src/components/konfigurator/steps/step-konfiguration.tsx`:
- **Additions flach statt Accordion:** Category als `<h4>` + Text, darunter Toggle-Liste. Kein `<Accordion>` mehr.
  - 1-Option-Category (z.B. „Fensterfalzluefter") → ein Toggle mit Category-Name als Label
  - Multi-Option-Category (z.B. „Rollladen" mit 6 Typen) → Header + Liste von Toggles, Radio-Verhalten (nur ein Rollladen gleichzeitig aktiv)
  - Option-mit-Varianten (z.B. „Randverbund" mit 4 Typen) → Header + Chip-Picker
  - Bilder links neben Toggle-Label (48 × 48 px), Preis rechts
- **VariantPicker neu designen:** Swatch 64 × 48 px (Aussen-Rand + Innen-Rand als zwei halbe Teile), RAL-Code unter Swatch, scroll-snap horizontal, erstes Ladevolumen 12 Swatches mit „Weitere laden"-Button

### Schritt 6 — Live-Farb-Fill im SVG (Optional, ~2-3 h)

`src/components/konfigurator/window-preview/window-preview.tsx`:
- Neuer Prop `outerColor?: string`, `innerColor?: string` (CSS-Farbe oder RAL-Hex)
- Rahmen-Rect bekommt `fill={outerColor}` und einen inneren 2px-Rect mit `fill={innerColor}`
- Bei gewaehlter Variant wird die Farbe aus `property_values` extrahiert und uebergeben
- RAL-Code → Hex-Map als Konstante in `src/lib/ral-colors.ts` (~30 haeufige Farben als Start)

### Schritt 7 — 360°-Viewer (Optional-Premium, ~2 h)

Pruefen ob `src/components/katalog/` bereits einen 360°-Viewer enthaelt (Commit `3bfd5e3`).
- Falls ja: als `<Window360Viewer frames={...} />` wiederverwenden, in Step 3 Profil-Detail oder Sidebar einbinden
- Falls nein: einfacher Drag-to-Rotate via `useState` + Mouse/Touch-Events

## 5. Erwartete Delivery

Nach Phase 1d:
- Jede der 6 PVC-Profile hat mind. 1 hochwertiges Thumbnail in Step 3
- Jede Addition-Option hat ein Bild (auch die 6 Rollladen-Typen, Schallschutz, etc.)
- Jede Farbvariante hat ein Swatch-Bild (oder zumindest einen RAL-Hex-Fallback)
- Step 4 ohne Accordion, direkt scannbar, alle Optionen sichtbar
- Optional: 360°-Viewer und Live-Farb-Preview

**Erwarteter Aufwand:** 1-2 Arbeitstage (mit Optional 2).

## 6. Session-Start-Hinweise

Beim Session-Start fuer Phase 1d:
1. Dieses Spec lesen + `konfigurator-db.md §12` (Fortschritt) pruefen
2. Memory `~/.claude/projects/-home-chris-projects-relaunch-passende-fenster-passende-fenster-kreativ/memory/MEMORY.md` laden
3. Vault-Artikel `projects/passende-fenster/concepts/wp-scraper-bildbestand.md` lesen
4. `python3 -c 'import json; d=json.load(open("/home/chris/projects/passende-fenster-scraper/output/data.json")); print(d["total_products"])'` als Sanity-Check
5. Mit Schritt 1 anfangen (Mapping-Analyse)

## 7. Sources

- `~/projects/passende-fenster-scraper/output/data.json` (1.224 Produkte, 15.671 Bilder)
- `konfigurator-db.md §2.1` (irrefuehrende Zeile, die zur Fehlinterpretation fuehrte)
- `konfigurator-db.md §4.2` (Aluplast → Ideal Mapping)
- Chris-Feedback-Session 2026-04-19 (Transcript im Claude-Verlauf)
- Obsidian-Vault: `projects/passende-fenster/concepts/wp-scraper-bildbestand.md`
