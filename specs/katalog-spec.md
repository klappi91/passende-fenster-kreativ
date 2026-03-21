# Spec: Produktkatalog & Medien-Integration

## Ausgangslage
- Bestehende "Kreativ"-Landingpage (Next.js 16, GSAP, Framer Motion, shadcn/ui, Tailwind 4)
- Produktdaten komplett gescraped: `~/projects/passende-fenster-scraper/output/data.json`
- 1.224 Produkte, 15.671 Bilder (2.6 GB) lokal vorhanden
- Bisherige Seite zeigt nur 5 hardcoded Produkte in `fenster-systeme.tsx`

## Ziel
Kompletten Produktkatalog mit allen Bildern, Farben und 360-Grad-Ansichten in die neue Website integrieren.

---

## 1. Datenquelle

### data.json einbinden
Die `data.json` wird nach `public/data/katalog.json` kopiert (oder als Build-Zeit-Import genutzt).
Bilder werden nach `public/images/katalog/` kopiert, Ordnerstruktur beibehalten.

### Produkt-Datenstruktur (pro Eintrag)
```json
{
  "name": "Ideal 4000 40 mm",
  "slug": "ideal-4000-40-mm",
  "category_path": ["fenster", "pvc-fenster", "ideal-4000"],
  "specs": ["Einbautiefe 70 mm", "Verglasung bis 41 mm", ...],
  "description": "...",
  "tags": ["aluplast", "PVC", ...],
  "images": {
    "thumbnail": "...",
    "360_frames": ["1.jpg", ..., "19.jpg"],
    "colors": [{"code": "AP-01", "url": "...", "note": null}, ...]
  }
}
```

---

## 2. Seitenstruktur (Neue Routes)

### /katalog (Katalog-Uebersicht)
- 5 Hauptkategorien als grosse Kacheln (wie Original-Seite)
- Fenster, Tueren, Tore, Fensterabdeckungen, Moskitonetze
- Kategorie-Bild + Name + Anzahl Produkte
- Kreativ-Stil: asymmetrisches Grid, Hover-Animationen

### /katalog/[...slug] (Dynamische Kategorie/Produkt-Seiten)
Catch-all Route fuer die gesamte Hierarchie:
- `/katalog/fenster` → Unterkategorien (PVC, Alu, Stahl, Holz)
- `/katalog/fenster/pvc-fenster` → Systeme (Ideal 4000, S9000, ...)
- `/katalog/fenster/pvc-fenster/ideal-4000` → Varianten (40mm, 65mm, ...)
- `/katalog/fenster/pvc-fenster/ideal-4000/ideal-4000-40-mm` → Produktdetail

### Kategorie-Ansicht (Zwischen-Ebenen)
- Grid mit Produkt-/Unterkategorie-Kacheln
- Breadcrumb-Navigation
- Thumbnail-Bild pro Eintrag
- Animated Grid (GSAP stagger)

### Produktdetail-Seite
- **Hero**: Produktname + Thumbnail gross
- **360-Grad-Viewer**: Interaktiver Viewer (Drag zum Drehen, 19 Frames)
- **Technische Daten**: Specs als Feature-Liste mit Icons
- **Farbpalette**: Grid aller verfuegbaren Farben mit Code und Tooltip
- **Beschreibung**: Produkttext
- **Tags**: Klickbare Tags
- **Zurueck-Navigation**: Breadcrumbs + Zurueck-Button

---

## 3. Komponenten

### Neue Komponenten
| Komponente | Zweck |
|-----------|-------|
| `CatalogGrid` | Kategorie-/Produktliste als animiertes Grid |
| `ProductCard` | Kachel fuer Kategorie oder Produkt (Thumbnail, Name, Badge) |
| `ProductDetail` | Komplette Produktdetail-Ansicht |
| `Viewer360` | Interaktiver 360-Grad-Viewer (Drag/Touch) |
| `ColorPalette` | Farbmuster-Grid mit Zoom-Modal |
| `SpecList` | Technische Daten als gestylte Liste |
| `Breadcrumbs` | Navigations-Breadcrumbs fuer Katalog-Hierarchie |
| `ProductFilter` | Optional: Filtern nach Tags/Typ |

### Bestehende Komponenten anpassen
- `fenster-systeme.tsx`: Echte Produkte aus data.json laden statt hardcoded
- `header.tsx`: Katalog-Link in Navigation ergaenzen
- `konfigurator.tsx`: Mit Katalog verlinken

---

## 4. 360-Grad-Viewer (Viewer360)

### Funktionalitaet
- 19 Frames pro Produkt (1.jpg bis 19.jpg)
- Drag horizontal → Frame wechseln (Desktop: Maus, Mobile: Touch)
- Auto-Rotation beim Laden (langsam, stoppt bei Interaktion)
- Preload aller Frames beim Seitenaufruf
- Vollbild-Modus (optional)

### Technisch
- Canvas-basiert oder IMG-Swap
- Kein externer Viewer noetig, einfache Custom-Implementierung
- Bilder liegen lokal unter `public/images/katalog/{cat}/{slug}/360/`

---

## 5. Farbpalette (ColorPalette)

### Darstellung
- Grid mit Farbmuster-Thumbnails (kleine quadratische Vorschau)
- Farbcode als Label (z.B. "AP-01")
- Hinweis wenn vorhanden (z.B. "nur fuer Energeto Neo und Ideal Neo")
- Click → Vergroessertes Bild in Modal/Lightbox
- ~60 Farben pro Produkt typisch

---

## 6. Bilder-Strategie

### Verzeichnisstruktur in public/
```
public/images/katalog/
├── fenster/
│   ├── pvc-fenster/
│   │   ├── ideal-4000/
│   │   │   ├── ideal-4000-40-mm/
│   │   │   │   ├── thumbnail.jpg
│   │   │   │   ├── 360/1.jpg ... 19.jpg
│   │   │   │   └── farben/ap-01.jpg ... ap-122.jpg
```

### Optimierung
- Next.js Image-Komponente fuer automatische Optimierung
- Lazy Loading fuer Farbpalette und Produkt-Grid
- 360-Frames erst bei Viewport-Eintritt preloaden
- Thumbnails: bereits 920x690, gut fuer Web

---

## 7. Statische Generierung (SSG)

Alle Katalog-Seiten werden bei Build-Zeit generiert:

```typescript
// src/app/katalog/[...slug]/page.tsx
export async function generateStaticParams() {
  // Alle moeglichen Pfade aus data.json generieren
}
```

Vorteile:
- Schnelle Ladezeiten (kein Server noetig)
- SEO-optimiert (alle Seiten indexierbar)
- Vercel/Static Hosting moeglich

---

## 8. Design-Richtlinien (Kreativ-Stil)

- Asymmetrisches Grid fuer Produkt-Uebersicht
- GSAP ScrollTrigger fuer Stagger-Reveals beim Scrollen
- Hover-Effekte: 3D-Tilt, Scale, Gradient-Overlay
- Clip-Paths auf Feature-Bildern
- Grosse Headlines (Poppins Display)
- Brand-Gradient als Akzent
- Dark Sections fuer Produktdetails (360-Viewer auf dunklem Hintergrund)
- Smooth Page Transitions zwischen Katalog-Ebenen

---

## 9. Migration der Startseite

Die bestehende `fenster-systeme.tsx` Sektion auf der Startseite wird aktualisiert:
- Statt 5 hardcoded Produkte → 6 Featured-Produkte aus data.json
- "Alle Fenster im Konfigurator" Button → "Zum Katalog" mit Link zu /katalog
- Produkt-Karten verlinken auf echte Detailseiten

---

## 10. Umsetzungsreihenfolge

1. Daten & Bilder in public/ kopieren (Script)
2. Katalog-Daten-Layer (`lib/katalog.ts`) - Lade/Filter-Funktionen
3. `/katalog` Uebersichtsseite
4. `/katalog/[...slug]` dynamische Route (Kategorie + Detail)
5. `Viewer360` Komponente
6. `ColorPalette` Komponente
7. Startseite aktualisieren (echte Produkte)
8. Navigation/Header anpassen
9. SEO-Metadaten pro Seite
10. Performance-Optimierung (Lazy Loading, Image Sizes)
