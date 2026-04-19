# UX-Recherche v2: Tiefenanalyse zu vier offenen Fragen

_Datum: 2026-04-19_
_Methode: Brave Search + Firecrawl + WebFetch (gezielt), 12 Seiten angeschaut_
_Voraussetzung: [konfigurator-ux-research.md](./konfigurator-ux-research.md) (v1)_

Diese Datei ergänzt v1 mit konkreteren Referenzen zu vier Themen, zu denen v1 nur Oberflächen-Aussagen traf. Fokus: **konkrete Pattern-Namen und Referenzen**, keine Meinungen.

---

## 1. Interaktiver Mini-Rechner Rohbaumaß → Bestellmaß

### 1.1 Was es in der Branche bereits gibt

**Keine der 5 Fenster-Wettbewerber aus v1 hat einen interaktiven Mini-Rechner.** Alle erklären die Rechnung in Fließtext plus Beispielen. Das bestätigt die v1-Hypothese: hier ist ein echtes Differenzierungs-Fenster.

**Branchennah (Türen):**
- **`tuermassrechner.tueren-albrecht.de`** (PRÜM Türen-Handbuch, Tueren Albrecht): sequenzielles Single-Form.
  Flow: Maueröffnungs-Breite → Maueröffnungs-Höhe → Mauerstärke → Ergebnis (matchende Normmaße als Ampel).
  UX: Pfeile als Navigation zwischen Feldern, pro Feld ein Tipp-Text und eine Illustration, die zeigt welches Maß gemeint ist.
  Schwäche: keine Live-Update, man muss absenden. Ergebnis ist eine Produkt-Match-Liste, nicht ein reiner Rechner.
- **`tuerenhandbuch.tuer.de/.../wandoeffnung-masstabellen/`**: statische Tabellen, Nachschlagewerk, kein Rechner.

**Branchenfremd gesucht, aber nichts Passendes:**
- Parkett-/Bodenrechner (`hermann-luh.de`, `parkettkaiser.de`, `omnicalculator.com`) sind flach: m²-Input → Material-Menge-Output. Kein Mehr-Schritt, keine Abzugslogik. Pattern ist „Kalkulator" nicht „Umrechner".
- `parkett-agentur.de/parkett-raumplaner` — AR/Raum-Foto-Upload. Ganz anderes Paradigma, für uns nicht relevant.

**Plattform-Angebote an Fensterbauer:**
- **`tool-box.io/fenster-rechner/`** verkauft einen Embed-Rechner als SaaS-Modul an Fensterbauer, inkl. „Digitaler Planungstafel". Das zeigt: es gibt genug Nachfrage dass B2B-SaaS dafür existiert. Referenz-Design nicht public sichtbar.

### 1.2 Ableitungen für uns

1. **Unser Mini-Rechner ist originell.** Selbst die Tür-Variante von Albrecht ist sequenziell + submit-basiert, nicht live.
2. **Pattern: Live-Rechner (kein Submit).** Sobald Nutzer „Rohbau-Breite" und „Rohbau-Höhe" eingibt, sofort Bestellmaß rechnen. Alle Abzüge als Chip/Badge sichtbar ("- 20 mm Einbauluft", "- 30 mm Fensterbankleiste") → Transparenz statt Blackbox.
3. **Input-Paar-Layout:** Zwei Spalten (Breite / Höhe) mit je einem Illustrations-Icon und einem Tipp-Link zur vollen Anleitung. Auf Mobile untereinander stapeln.
4. **Zwei Modi im selben UI:** Altbau / Neubau als Toggle. Die Abzüge sind identisch (20 mm × 2 bei Weiß), der Unterschied liegt bei Neubau (Maueröffnung direkt) vs. Altbau (bestehenden Rahmen messen → Stock-Maße). Pflicht: Illustrationen für beide Modi, weil v1 gezeigt hat: alle Wettbewerber trennen das strikt.
5. **Ergebnis-Darstellung:** Große Zahl in mm ("B × H: 1210 × 1310 mm"), daneben „Als Konfigurations-Maß übernehmen" → State-Sharing mit dem Konfigurator.
6. **Sonderfälle als expandierbare Sektionen:** Rollladen-Aufsatzkasten, Fensterbank-Anschlussprofil, Farbige Profile (25 statt 20 mm Abzug wegen thermischer Ausdehnung — siehe §3.3).

---

## 2. Sticky Preview + Live-Preis auf Mobile

### 2.1 Pattern-Landschaft

- **Material Design: Modal Bottom Sheet vs. Nonmodal Bottom Sheet** ([nngroup.com/articles/bottom-sheet](https://www.nngroup.com/articles/bottom-sheet/)).
  Für unseren Case ist **Nonmodal** richtig: der Nutzer soll weiter in den Feldern tippen können, während das Sheet offen ist.
  Modal nur bei „Konfiguration abschließen" / „Angebot anfordern".
- **Expandable Sheet** (drei Höhen-Snap-Points: 56 px collapsed / 40 % peek / 90 % fullscreen). Nutzer kann tief zoomen oder einfach den Preis sehen.
- **shadcn/ui Drawer** (basiert auf `vaul`, https://vaul.emilkowal.ski/) — passt perfekt zu unserem Stack. Support für Snap-Points, Drag-Handle, Scroll-Lock. Wir benutzen shadcn, das Component ist ohne Zusatzarbeit verfügbar.

### 2.2 Schmerzpunkte aus der Review-Landschaft (NN/Group-Zusammenfassung)

| Problem | Lösung bei uns |
|---|---|
| Fehlender Close-Button (nur Swipe) | Explizite X-Button oben rechts + Drag-Handle oben mittig. |
| Gestapelte Sheets → Verwirrung | Kein Stacking — wenn Angebot-Flow öffnet, fährt das Preview-Sheet automatisch ins Collapsed. |
| Zu lange Inhalte im Sheet | Snap-Point-System. Im collapsed: Preis + Profil-Name + CTA. Peek: + Konfig-Summary. Full: komplette Preview-Grafik + Spec-Liste. |
| Verwendung als Seitennavigation | Nein — Bottom-Sheet ist Preview, keine Navi. Navi bleibt in Progress-Bar oben. |

### 2.3 Sticky Add-to-Cart Referenzen

- **easyappsecom.com/guides/sticky-add-to-cart-best-practices** — Shopify-Best-Practice. Empfehlungen:
  - Mindesthöhe 56 px
  - Nah am Daumenpunkt (unteres Drittel)
  - Ein klarer CTA, keine Nebenschauplätze
  - Conversion-Lift 8–15 % bei Mobile-Checkout-Flows wenn sticky

### 2.4 Konkrete Umsetzung bei uns

**Desktop (≥ lg):** Sidebar rechts, sticky, 360 px breit. Inhalt: Preview-SVG oben, darunter Live-Preis (ab / tatsächlich), Konfig-Summary (collapsible), CTA-Button "Angebot anfordern".

**Tablet (md):** Zwei-Spalten beibehalten, Sidebar auf 280 px, Preview-SVG kompakter (220 px hoch).

**Mobile (< md):**
- Oben unter dem Header: **Progress-Bar** (kleben, 48 px hoch, 7 nummerierte Punkte).
- Unten: **Nonmodal Bottom-Sheet** mit 3 Snap-Points:
  - **Peek (collapsed, 72 px)**: Preis groß („ab 184,28 €"), Profil-Name klein, Chevron-Up-Indikator.
  - **Half (40 vh)**: + Preview-SVG + Maße + Konfig-Summary.
  - **Full (90 vh)**: + Properties-Tabelle + „Angebot anfordern"-CTA.
- Wenn Bottom-Sheet im Peek: Haupt-CTA am unteren Rand extra als Sticky-Footer-Bar (56 px, Primary-Button).

---

## 3. Ausmess-Guide-Content

### 3.1 Was die Top-Seiten gemeinsam haben (nach Tiefenanalyse von 6 Guides)

Aus fensterversand, neuffer, fensterhandel, fensterblick, widuro und fertigfenster:

**Pflicht-Themen (alle 6 behandeln es):**
1. Vorbereitung: Werkzeug (Zollstock/Metermaß, Papier, Stift), Skizze mit Öffnungsrichtung und Griff-Position
2. Messung immer an mindestens 2 Punkten pro Dimension, kleinster Wert gewinnt
3. Einbauluft abziehen (Montagespalt)
4. Altbau vs. Neubau (unterschiedliche Ausgangsmaße)
5. Öffnungsrichtung-Konvention: Perspektive „von innen nach außen blickend"
6. Rohbaumaß vs. Bestellmaß als zentrale Begriffsunterscheidung

**Content-Themen in der Mehrheit (4 von 6):**
7. Fensterbank-Anschlussprofil (10/25/30/40/50 mm)
8. Rollladen-Integration (Aufsatz-Kasten vs. Vorbau)

**Content-Themen bei 2–3 Seiten:**
9. Glossar der Grundbegriffe (nur fensterblick macht das explizit sauber)
10. PDF-Download Aufmaßhilfe (fensterversand + neuffer)
11. Video-Einbettung (fensterversand)
12. Fenster-Dreh-Öffnungsrichtungs-Konvention (Dreieck-Spitze = Griff, Neuffer)

### 3.2 Konkrete Einbauluft-Werte (belastbare Tabelle)

Konsens aus widuro, neuffer, fensterblick (alle drei haben Tabellen, Werte variieren ±5 mm):

| Fenstergröße (längste Seite) | Weiß | Farbig / Anthrazit |
|---|---:|---:|
| bis ca. 1.000 mm | 10–15 mm | 15 mm |
| bis ca. 2.000 mm | 15 mm | 20 mm |
| bis ca. 3.000 mm | 20 mm | 25 mm |

**Wichtig:** Werte gelten **pro Seite** (also links + rechts, oben + unten → 2× abziehen für Breite, 2× für Höhe). Begründung „farbig mehr": thermische Ausdehnung von dunklem PVC unter Sonneneinstrahlung.

**Unsere qlein-Profile:**
- Alle 6 Profile sind PVC, Außenfarbe je Variant (Weiß / Anthrazit 7016 / ca. 150 weitere Farben).
- Default-Werte in unserem Rechner: **Weiß: 10 mm < 1 m, 15 mm 1–2 m, 20 mm > 2 m.** **Farbig: 15 mm < 1 m, 20 mm 1–2 m, 25 mm > 2 m.**
- Bei Konfiguration mit farbiger Außenseite in der Variants-Auswahl (schon bekannt aus `article_variants.property_values`): Einbauluft im Rechner automatisch anpassen, als Hinweis bei Eingabe.

### 3.3 Bilder vs. Illustrationen vs. Video — Konversions-Sicht

- **Fensterversand** (Platzhirsch mit strukturiertester Seite): Realfotos + 2 YouTube-Videos. Lange Seite (~2000 Wörter), aber viel Text-Redundanz.
- **Neuffer**: eigene Vektor-Zeichnungen (Grundriss-Skizzen) für jede Messart. Seite kürzer (~800 Wörter), aber mit Tabelle und PDF.
- **fensterblick**: Realfotos mit Zoom-Modal (380 px → 1520 px Lightbox). Sehr dicht, mittlere Länge.

**Konsens (aus mehreren UX-How-To-Studien, verwiesen in v1):** Illustrationen > Realfotos > Video in ROI.

**Für uns, Kreativ-Variante:**
- **Vektor-Zeichnungen (SVG)** als Pflicht für alle Mess-Schritte. Skalierbar, schnell, passend zum kreativen Look (zur Not eigene Hand-gezeichnete Illustrationen im Markenstil, Poppins-Schriftzüge direkt im SVG).
- **Statisches Aufmaß-PDF** zum Download. Einmal mit Figma designen, ~1 Tag.
- **Videos optional, nicht priorisiert.** Können später über YouTube-Embed nachgelegt werden.
- **Interaktiver Mini-Rechner als Kern-Differenzierer** (§1).

### 3.4 Pflicht-Kapitel unserer Seite

Vorgeschlagene H2-Struktur für `/fenster-ausmessen`:

1. **Einstieg** — 3-Satz Intro „Warum richtig messen wichtig ist".
2. **Mini-Rechner Rohbaumaß → Bestellmaß** (oberhalb des Fold, direkt nach H1 — wichtigster Content).
3. **Vorbereitung und Werkzeug** (3 Icons: Zollstock / Papier / Libelle).
4. **Skizze und Öffnungsrichtung** (SVG: Dreieck-Konvention mit Griff).
5. **Fenster ausmessen im Altbau** (3 Substeps + SVG pro Step).
6. **Fenster ausmessen im Neubau** (2 Substeps + SVG).
7. **Einbauluft-Tabelle** (vollständig aus §3.2).
8. **Sonderfall Rollladen** (Aufsatzkasten vs. Vorbau, mit SVG).
9. **Sonderfall Fensterbank-Anschlussprofil** (Standard-Profile 10/25/30/40/50 mm).
10. **Glossar** (6 Begriffe wie fensterblick: Aufmaß, Gesamtmaß, Fenstermaß, Rohbaumaß, Bestellmaß, Einbauluft).
11. **PDF-Download + CTA** zum Konfigurator.

Länge: Ziel ~1200–1500 Wörter. Klar strukturiert, mit TOC als Sticky-Sidebar auf Desktop (so wie v1 an fensterblick lobt).

---

## 4. Multi-Flügel-Preview-Grafik

### 4.1 Was es bei Wettbewerbern gibt

Aus v1 + ergänzend analysiert:

- **fensterhandel.de**: Live-SVG-Schema des Fensters, updatet bei jedem Klick (Innenansicht, 2D). Nur einteilige Darstellung ohne Öffnungsarten-Overlay. Statisch nach Auswahl.
- **fensterversand.com**: Schema-Grafik pro Konfiguration, aber mehr „Aus einem Bild-Pool" als live-gerendert.
- **deutscher-fenstershop.de**: Sidebar-Summary als Text, keine grafische Preview.
- **qlein-eigener Image-Generator:** `https://admin.passende-fenster.de/api/image_generator/window/…` rendert **Bitmap-Previews live**. Wir könnten das proxyen, aber damit sind wir wieder abhängig von qlein (siehe DB-Spec §5.1 — genau das wollten wir vermeiden).

### 4.2 Entscheidung: SVG auf Client, eigene Komponenten

**Argumente pro Client-SVG:**
- Keine qlein-Abhängigkeit in der Laufzeit
- Pfeil-Symbole für Öffnungsrichtungen (DKL/DKR/DL/DR/Fest/Kipp) sind normierte Vektoren, ~20 Codezeilen je Shape
- Responsive von Haus aus (kein Bitmap-Rescale nötig)
- Animationsfähig (CSS transition beim Shape-Wechsel)
- Bündelbar als React-Komponenten, cacheable durch SWR

**Aufwands-Schätzung:**
- 6 Shape-Komponenten (DKL, DKR, DL, DR, Fest, Kipp) als 48×48-SVG-Primitives ≈ 2 h
- 13 Group-Layouts aus `initstate.groups[].shapeConfiguration` als Grid-Template (z.B. group 8 hat 2 Rows: 1 Oberlicht + 2 Flügel) ≈ 3–4 h
- Compose-Komponente `<WindowPreview group={…} shapes={[[…]]} />` — rendert den Rahmen + Pfosten + für jede Zelle das passende Shape-Primitive ≈ 2 h
- Total: **~1 Arbeitstag.**

**Aus `initstate.groups[].shapeConfiguration` lesen wir die Zell-Verteilung:**
```json
[
  { "height": 30, "shapes": 1 },   // Oberlicht mit einem Feld, 30 % Höhe
  { "height": 70, "shapes": 2 }    // Haupt-Reihe mit zwei Feldern, 70 % Höhe
]
```
→ CSS-Grid mit `grid-template-rows: 30% 70%` und innerhalb jeder Zeile `grid-template-columns: repeat(shapes, 1fr)`.

### 4.3 Referenz-Icon-Library

- **`react-svgr`** als Build-Tool, falls wir Vektor-Zeichnungen aus Figma exportieren und als React-Komponenten einsetzen wollen.
- **`lucide-react`** (bereits via shadcn dependencies da?) hat keine Fenster-spezifischen Icons, aber Arrow / Triangle als Primitives für Öffnungsrichtungs-Pfeile.
- **Custom-SVG-Primitives** reicht für unseren Use-Case. Mit Tailwind-Klassen (`stroke-primary`, `fill-muted`) styling direkt im JSX.

### 4.4 Visuelle Pattern-Bibliothek — Zellen-Rendering

**Für jede Shape-Zelle:**
- **Fest**: leere Zelle mit Rahmen.
- **DKL** (Dreh-Kipp-Links): „Y"-Pfeil diagonal nach rechts oben, Griff rechts mittig. Dreieck-Spitze nach rechts bedeutet: Öffnet nach innen, Griff rechts.
- **DKR**: gespiegelt.
- **DL / DR** (Dreh nur): einfacher Diagonal-Pfeil, kein Kipp-Dreieck.
- **Kipp**: horizontaler Pfeil oben, schwenkt unten auf.

Konvention Perspektive: **von innen nach außen** (alle Wettbewerber machen das so). Kardinale Regel aus v1 §3.2.

---

## 5. Bonus: Erkenntnisse außerhalb des Scopes

Drei Beobachtungen, die während der Recherche aufgefallen sind und für spätere Phasen wichtig werden:

### 5.1 Lead-Funnel vs. Shop — Branche spaltet sich

Klar zwei Lager:
- **Shop-Modell**: fensterversand, fensterhandel, deutscher-fenstershop, fenster-sofort → "In den Warenkorb", Kauf auf Rechnung, 3-6 Wochen Lieferung.
- **Lead-Funnel**: Neuffer, die meisten lokalen Fensterbauer, fensterblick.de → "Unverbindliches Angebot in 48h".

PF war historisch **Lead-Funnel**. Das bleibt die Empfehlung für Phase 1 (siehe DB-Spec §8 — Phase 4 Kauf-Option ist Future-Work). Aber: CTA-Copy „**Angebot in 48 Stunden**" ist konkreter und konversionstärker als nur „Angebot anfordern".

### 5.2 Lieferzeit-Kommunikation als USP

fensterversand, fensterhandel und fenster-sofort werben alle mit 3–6 Wochen und Versand gratis ab Warenwert. Wir haben die Lieferzeit-Matrix (4 Zeilen) schon geseedet. **Empfehlung:** Lieferzeit **live im Konfigurator** als Zeile in der Summary-Box anzeigen, updatet mit Farbwahl / Ausstattung.

### 5.3 Fallback bei Sonderkonfiguration (DSI-Pattern)

deutscher-fenstershop macht das vorbildlich: „Konfiguration nicht standardmäßig → individuelles Angebot per Formular". Das ist für uns relevant, weil viele Sondergrößen (> 2.400 mm Breite bei 1-flügelig, oder 1-flügelig > 1.600×1.600 generell) technisch begrenzt sind.

**Empfehlung:** Plausibilitäts-Check am Maß-Input:
- Wenn Größe außerhalb `rangeSizes` (Raster gibt Min/Max) → Inline-Warnhinweis, roten Border am Feld, CTA-Switch zu „Sonderanfrage senden".
- Ergänzen mit `article_dimensions`-Tabelle: Min/Max pro Profil (hatten wir als TODO in Phase 1b §Offene-Randfälle — jetzt ist der Zeitpunkt, das zu ziehen).

---

## 6. Quellen (neu in v2)

| # | Quelle | URL | Zweck |
|---|---|---|---|
| 6 | tueren-albrecht / PRÜM | `tuermassrechner.tueren-albrecht.de` | Sequenzieller Tür-Rechner als nächstliegende Branchenreferenz |
| 7 | tool-box.io | `tool-box.io/fenster-rechner/` | B2B-SaaS-Embed-Rechner für Fensterbauer |
| 8 | fenster-sofort | `fenster-sofort.de/konfigurator/` | REHAU-Profile, CTA "Preis ab X €", Lieferzeit 3-6 Wochen |
| 9 | neuffer (vertieft) | `neuffer.de/fenster-ausmessen.php` | Einbauluft-Tabelle Weiß vs. farbig, 3 Substeps |
| 10 | widuro | `widuro.de/wissen/a/fenster-richtig-ausmessen-anleitung-zum-professionellen-fensteraufmass` | 4-Schritt-Struktur + Diagonal-Verifikation + PDF-Vorlage |
| 11 | fensterblick (vertieft) | `fensterblick.de/fenster-ausmessen.html` | 6-Begriffe-Glossar, Min-Spalt-Tabelle, 4 Merksätze |
| 12 | NN/Group Bottom Sheet | `nngroup.com/articles/bottom-sheet/` | Modal vs. Nonmodal, 4 Design-Fehler |
| 13 | easyappsecom Sticky Add-to-Cart | `easyappsecom.com/guides/sticky-add-to-cart-best-practices` | 8-15 % Conversion-Lift Mobile, Min-Höhe 56 px |
| 14 | shadcn Drawer / vaul | `ui.shadcn.com/docs/components/drawer` | Unser Stack-nativer Bottom-Sheet, Snap-Points-fähig |
| 15 | Smashing Sticky Menus | `smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/` | Sticky-Footer-CTA Pattern-Review |

---

## 7. Zusammenfassung für den Brainstorm (§ nächster Schritt)

Vier klare Entscheidungen, die aus dieser Recherche ableitbar sind und im Brainstorm nur noch bestätigt werden müssen:

1. **Mini-Rechner baut live, sequenziell-frei.** Zwei-Spalten-Input (Breite / Höhe), Modus-Toggle (Altbau / Neubau), Farb-Toggle (Weiß / Farbig), Ergebnis sofort mit Badge-Abzügen. Übernahme-Button in Konfigurator per Client-State (zustand-Store oder URL-Params).
2. **Mobile-Preview via Nonmodal Bottom-Sheet (shadcn Drawer / vaul), 3 Snap-Points.**
3. **Ausmess-Guide als eigenständige Seite `/fenster-ausmessen` + identischer Content als Drawer im Konfigurator.** Content aus gemeinsamem `src/content/ausmess-guide.mdx` (oder `.tsx`-Section-Liste). Gleiche Komponenten werden einmal als Page und einmal im Drawer gerendert.
4. **Preview-Grafik als Client-SVG-Komponenten.** 6 Shape-Primitives + 13 Group-Layouts via CSS-Grid + `shapeConfiguration`-Driven. Kein qlein-Image-Proxy.

Offene Fragen für den Brainstorm:
- Exakte Step-Reihenfolge (v1 empfiehlt Maße zuerst, v2 bestätigt das noch stärker wegen des Mini-Rechners — aber: will der Kunde die ~13 Group-Varianten alle in einem Step oder gesplittet?)
- Preis-Label-Wording: "ab X €" (Branchenstandard) vs. "Ihr Richtpreis" (Lead-Funnel-tauglicher) vs. "So viel zahlen Sie voraussichtlich" (ehrlich, lang)
- „Angebot in 48 Stunden" vs. „Angebot anfordern" als Haupt-CTA?
- Rangepicker für Maße (Slider von 400 bis 2800 mm) ergänzend zum Nummerneingabefeld?
