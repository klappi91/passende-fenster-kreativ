# qlein-API Findings — Live-Probe vom 2026-04-19

Korrigiert Abweichungen zu `konfigurator-db.md` Abschnitt 3.

## 1. Korrekte Request-Syntax

### `GET /api/configurator/1/search`
`inputs` ist **JSON-stringifiziertes Objekt als einzelner Query-Param**, nicht Bracket-Syntax.

```
GET /api/configurator/1/search?inputs={"width":600,"height":1200,"minPrice":null,"maxPrice":null,"group":2,"shapes":[["Fest","Fest"]],"brands":[]}
```

- `width`, `height`: mm, Integer
- `minPrice`/`maxPrice`: `null` zulaessig (nicht 0!)
- `group`: group.id aus initstate
- `shapes`: **2D-Array** `[[shape-per-fluegel]]` — Reihen × Flügel je nach shapeConfiguration
  - Einflügelig: `[["Fest"]]`
  - Zweiflügelig: `[["Fest","Fest"]]`
  - Zweiflügelig mit Oberlicht: `[["Fest"],["DKL","DKR"]]`
- `brands`: Array mit Brand-IDs, `[]` = alle

### `GET /api/configurator/1/article/{id}/{width}/{height}`
**Drei** Path-Parameter, nicht einer wie in der Spec.

## 2. Response `/article/{id}/{w}/{h}`

Keys: `id`, `images`, `additions`, `longDescription`, `properties`, `variants`

- **`images`** (2 Stück): Strings wie `back_public/images/article/1/639c5776db0bf.png`
  → absolute URL: `https://admin.passende-fenster.de/back_public/images/article/1/639c5776db0bf.png`
  → liefert 200 OK PNG (254 KB)
- **`properties`** (5 Stück): Specs mit `name`, `value`, `unit`, `icon`, `shortName` (Bautiefe, Kammerzahl, Verglasung, Uw, Dichtung)
- **`additions`** (9 Kategorien): Zusatzoptionen mit Pricing — `rollladen`, `sound_insulation`, `edge_bond`, `fensterfalzlüfter`, `Mounting_holes`, `security_glazing`, `security_level`, `structural_glass`, `frame_widening`
  - `rollladen` hat 6 Varianten (Vorbaurollläden mit unterschiedlichen Preisen, z.B. SK 45 = 145 €)
- **`variants`** (100 Stück): Farbkombinationen
  - `propertyValues`: Außenfarbe, Innenfarbe, Griff-Farbe etc. mit `valueCode` (z.B. `anthraciteGray7016`, `white9016`) — RAL-basiert
  - Jede Variante hat eigenen `price`

## 3. Preis-Mechanik

Basispreis pro Variante (erste/Standard):
- Streamline 76 bei 600×800 = 22 € → 45,8 €/m²
- Streamline 76 bei 1200×1500 = 39 € → 21,7 €/m²
- Streamline 76 bei 2000×2500 = 79 € → 15,8 €/m²

**Degressive Preisstaffelung** — nicht linear. Preis muss pro (Artikel × W × H) von der API geholt oder gerastert werden.

## 4. Bild-Lokalisierung

**Wichtig:** Die lokal gescrapten Bilder (`passende-fenster-scraper/output/`) stammen aus `wp-content/uploads/` des Frontends und sind **nicht** identisch mit den Konfigurator-Bildern auf `admin.passende-fenster.de/back_public/`.

Test: `639c5776db0bf.png` (Streamline 76 Article-Bild 1) — nicht in lokalem Scrape.

→ Konfigurator-Bilder müssen separat geholt werden.

## 5. Article-IDs im Sortiment (aus search Zweiflügelig 600×1200)

| ID | Brand | Name            | Uw   | Basispreis |
|----|-------|-----------------|------|------------|
| 31 | 1 Salamander | Streamline 76   | 0,97 | 118,47 € |
|  5 | 1 Salamander | BluEvolution 82 | 0,77 | 149,49 € |
| 60 | 1 Salamander | BluEvolution 92 | 0,73 | 159,24 € |
| 79 | 3 Gealan     | Gealan S 9000   | 0,73 | 149,49 € |
| 32 | 2 Aluplast   | Aluplast 4000   | 0,76 | 118,47 € |
| 49 | 2 Aluplast   | Aluplast 8000   | 0,67 | 166,47 € |

Vermutlich gibt es weitere Artikel, die bei dieser Größe/Shape nicht passen. Vollständige ID-Liste via Raster-Scrape erforderlich.

## 6. Konsequenzen für DB-Schema

Das Schema in `konfigurator-db.md` Abschnitt 5 ist zu knapp. Benoetigt werden:

- `article_properties` (article_id, name, value, unit, icon, short_name, is_main) — 5 pro Artikel
- `article_additions` (Rollladen, Schallschutz etc. mit Pricing) — m:n mit type-Kategorien
- `property_values` / `colors` (RAL-basiert, mit `valueCode` als unique key)
- `article_variants` (article_id, combination-of-property-value-ids, price)
- `price_matrix` ODER `price_rules` mit Raster — Entscheidung je nach Scrape-Umfang

## 7. Brand-Logos

URL-Muster: `back_public/images/brand/{hash}.png`, über `admin.passende-fenster.de` erreichbar. Auch nicht lokal.
