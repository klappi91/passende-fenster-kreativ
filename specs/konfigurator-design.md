# Konfigurator-Design — Richtung Kreativ

**Datum:** 2026-04-19
**Zweck:** Design-Tokens und visuelle Leitplanken für `/konfigurator` und `/fenster-ausmessen`. Erweitert die bestehende Marke (siehe `src/app/globals.css`, `src/components/sections/*`), nicht ein neuer Stil.

---

## 1. Designkonzept — „Atelier + Blueprint"

Der bestehende Brand-Look ist *extrovertiert-energetisch*: dunkler Hero mit Bild, Gradient-Sektionen (Konfigurator-Teaser, Anfrage-Form), große Typografie, weiße Glassmorphism-Cards auf Gradient. Perfekt für Landing-Storytelling.

**Für das Konfigurator-Tool kehren wir die Gewichte um:**
- Hauptfläche **ruhig, weiß-dominiert, technisch-präzise**. Der Nutzer muss entscheiden, nicht unterhalten werden.
- **SVG-Preview** (Shape-Rendering, siehe konfigurator-ui.md §6.2) wird das zentrale Bild-Element. Stil: Technische Zeichnung / Blueprint — Primary-Blau Stroke, feine Linien, diskrete Grid-Hinweise im Hintergrund.
- **Brand-Gradient** bleibt reserviert für *Erfolg-Momente*: Progress-Fill, aktive Step-Dots, Haupt-CTA-Button, Preis-Box bei finaler Konfig.
- **Preis als typografisches Ereignis**: Poppins 800 in clamp(2.5rem, 5vw, 4rem). Keine kleine Sidebar-Zeile, sondern Headline-Artifact.
- **Diskrete Markenabsender**: eine einzelne Clip-Diagonal-Akzentlinie über dem Progress, Brand-Gradient-Dot am aktiven Step, Gradient-Badge „★ Beste Empfehlung" in der Profile-Liste.

Die Spannung entsteht aus der Komposition: ruhige Leinwand + punktgenaue Farb-Ereignisse.

---

## 2. Farb-System (Konfigurator-Extension)

Alle Tokens aus `globals.css` bleiben. Ergänzend für Konfigurator-States:

```css
/* zu ergänzen in @layer base oder als Konfigurator-Scope */
:root {
  /* Konfigurator-Blueprint-Palette */
  --konfig-canvas: #fafbfc;              /* fast-weiß, leicht cool — Main-Background */
  --konfig-grid: rgba(0, 159, 227, 0.04);/* Subtile Gitter-Textur im Preview */
  --konfig-stroke: #009fe3;              /* Preview-SVG-Stroke */
  --konfig-stroke-muted: #cfe7f5;        /* nicht-aktiv Shape */
  --konfig-price: #212934;               /* Preis-Darkness, eine Spur tiefer als --brand-heading */

  /* Semantische States */
  --konfig-step-done: #15779b;           /* Accent als erledigt-Indikator */
  --konfig-step-active: #009fe3;         /* Primary */
  --konfig-step-idle: #e2e2e2;           /* Border */

  /* Chips / Selections */
  --konfig-chip-idle-bg: #f2f8fc;        /* bestehendes --brand-light */
  --konfig-chip-hover-bg: #e2ecf6;
  --konfig-chip-active-bg: #009fe3;
  --konfig-chip-active-fg: #ffffff;
}
```

### 2.1 Farbgebrauch-Regeln

| Element | Farbe | Begründung |
|---|---|---|
| Main-Background Konfigurator | `--konfig-canvas` (#fafbfc) | Ruhig, nicht pure-white — atmet weniger steril |
| Sidebar-Background | `#ffffff` | Stärker als Canvas, rahmt ein ohne harten Border |
| Step-Card (aktiver Step) | `#ffffff` mit leichtem `shadow-xl` | Hebt sich elegant ab |
| Step-Card (inaktiv) | transparent | kein visuelles Gewicht |
| SVG-Preview Stroke | `var(--konfig-stroke)` | Markensignal + technischer Look |
| Preview-Hintergrund | subtile `radial-gradient` rgba(0,159,227,0.03) | Atmosphäre ohne Ablenkung |
| Progress-Bar aktiver Abschnitt | `bg-brand-gradient` | erhalt Brand-Moment |
| Progress-Bar erledigt | `--konfig-step-done` (#15779b) | Accent = Geschichte |
| Progress-Bar kommend | `--konfig-step-idle` (#e2e2e2) | neutral |
| Haupt-CTA „Angebot anfordern" | `bg-brand-gradient`, `text-white`, `rounded-full` | identisch zur bestehenden Seite |
| Sekundär-CTA | weißer Grund, 2 px `--brand-primary` border, primary Text | |
| Preis-Display | `--konfig-price` (fast schwarz) | maximaler Kontrast, das IST die Aussage |
| Error-State (Sondergröße) | `--destructive` (#ef4444) | Standard |

---

## 3. Typografie-System

Fonts bleiben: **Poppins** (display) + **Lato** (sans). Keine neuen Fonts.

### 3.1 Neue Display-Klassen für Konfigurator

Ergänzend zu `heading-display`, `heading-section`, `heading-sub`:

```css
.heading-konfig-step {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.15;
  color: var(--brand-heading);
}

.heading-price {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--konfig-price);
  font-variant-numeric: tabular-nums;  /* Zahlen gleich breit — wichtig für Animation */
}

.heading-price-label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.text-measure {
  font-family: var(--font-display);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
}

.text-caption {
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  line-height: 1.5;
}
```

### 3.2 Hierarchie je Screen

| Ebene | Beispiel | Klasse |
|---|---|---|
| Seiten-Headline | „Fenster konfigurieren" | `heading-section` |
| Step-Headline | „Maße & Aufteilung" | `heading-konfig-step` |
| Preis-Display | „184 €" | `heading-price` |
| Preis-Label darüber | „RICHTPREIS" | `heading-price-label` |
| Maße-Anzeige | „1 200 × 1 400 mm" | `text-measure` |
| Property-Spec | „Uw 0,73 W/m²K" | `text-measure text-sm` |
| Caption / Hint | „von innen nach außen blickend" | `text-caption` |
| Body | Fließtext im Guide | `font-sans text-base leading-relaxed` |

### 3.3 Zahlen-Animation

Für den Preis bei Konfig-Änderung: CSS-Transition `transform` + `opacity` bei Wechsel. Bei größeren Sprüngen (Variant gewählt → Preis ändert sich um > 10 %): kurzer Scale-Bounce (0.95 → 1.05 → 1) über 260 ms. Wichtig: `tabular-nums` damit die Zahl nicht „springt" während Animation.

---

## 4. Komponenten-Styling-Regeln

### 4.1 Progress-Bar

```
 ●═══════●═══════◐───────○───────○
 Maße    Öffnung   PROFIL   Config   Anfrage
```

- Dots: 14 px Durchmesser, `--konfig-step-done` für erledigt (check-icon innen), `bg-brand-gradient` + weiße Pulse-Ring für aktiv, `--konfig-step-idle` für künftig.
- Linie zwischen Dots: 2 px hoch, erledigte Teile in `--konfig-step-done`, aktueller Teil als `bg-brand-gradient` (Animation: Fill von 0 % auf 100 % beim Betreten des Steps).
- Labels unter den Dots: Lato, 0.75rem, bold beim aktiven Step, muted bei anderen.
- Sticky `top-16` (unter dem Header), height 64 px, weißer BG mit 95 % opacity + `backdrop-blur-md`.
- Klickbar rückwärts (erledigte Steps), Cursor `pointer` + Hover-Scale 1.05 am Dot.

### 4.2 Step-Card (die „Leinwand" pro Step)

- Außen: `max-w-3xl mx-auto py-8 px-6 sm:px-10`.
- Innen: **keine Card-Box**. Freier Inhalt auf Canvas-Background.
- Eröffnet mit `heading-konfig-step`, darunter 1-Satz-Caption („Gib die Außen-Maße der Maueröffnung ein.").
- Content-Block.
- Unten: Button-Reihe `← Zurück` (ghost) und `Weiter →` (primary, rounded-full, bg-brand-gradient).

### 4.3 Group-Selector (13 Varianten in Schritt 1)

Grid 3×n auf Desktop, 2×n auf Mobile. Jede Kachel:

```
┌─────────────────┐
│   ┌───────┐     │    Miniaturansicht als SVG (120×96 px)
│   │   ▣   │     │    "Einflügelig"
│   └───────┘     │    Preis-Range "ab 29 €"  (optional, wenn Maß schon da)
│   Einflügelig   │
│   ab 29 €       │
└─────────────────┘
```

- Idle: weißer BG, 1 px `--border`, `rounded-2xl`, `p-4`.
- Hover: `shadow-md`, `scale-[1.02]`, 1 px `--konfig-stroke-muted`.
- Active: 2 px `--konfig-stroke`, `shadow-lg`, Mini-SVG-Stroke wechselt von muted auf primary.
- Transition 200 ms `ease-out`.

### 4.4 Shape-Picker (Schritt 2)

Pro Flügel wird ein Picker gezeigt. 6 Shapes (Fest/DKL/DKR/DL/DR/Kipp) als Icon-Buttons:

- `size 56×56 px`, SVG-Shape im Primary-Blau 2 px Stroke, weißer BG.
- Idle: border 1 px `--border`.
- Hover: border 1 px `--konfig-stroke`, Background `--konfig-chip-idle-bg`.
- Active: border 2 px `--konfig-stroke`, Background `--konfig-chip-idle-bg`, check-Overlay oben rechts.
- Tap-Target min 44 px (Active-State erweitert um 2 px Ring).

Wenn zwei oder mehr Flügel, werden sie nebeneinander gezeigt (Bezeichnung „Flügel links", „Flügel rechts" / bei 3: „links / Mitte / rechts").

### 4.5 Profile-Card (Schritt 3 — USP-Moment)

```
┌───────────────────────────────────────────────────────────────┐
│ ┌───┐   Salamander                              ab            │
│ │ S │   BluEvolution 82                         ━━━━━━━━━━━  │
│ └───┘                                           149 €   ★BEST │
│                                                               │
│ Uw 0,77 W/m²K  │  82 mm  │  6 Kammern  │  3-fach              │
│                                                               │
│ [Fensterbild]                      [ Auswählen → ]            │
└───────────────────────────────────────────────────────────────┘
```

- Layout: Grid oder Flex mit Brand-Logo links (40×40), Titel-Area Mitte-oben, Preis rechts-oben (heading-price variant in `text-3xl`).
- Property-Leiste mit Bullet-Separatoren, Lato `text-sm`, `--muted-foreground`.
- „★BEST"-Badge: Brand-Gradient-Pill, white Text, font-display 0.7rem, `tracking-widest`.
- Aktiv (nach Klick): 2 px `--konfig-stroke` border, `shadow-xl`, weißer BG bleibt.
- Hover: `shadow-lg`, `translate-y-[-2px]`, 300 ms.

### 4.6 Variant-Picker (Schritt 4, Farb-Swatches)

Zwei Reihen: „Außen" und „Innen". Pro Reihe: scrollbare horizontale Liste von Swatches.

- Swatch: 48×48 `rounded-xl`, Farbe als `background-color`. Border 1 px rgba(0,0,0,0.08).
- Aktiv: 3 px `--konfig-stroke` border + 2 px weißer Innen-Ring.
- Darunter: `text-xs` Farbname, visible only bei Hover/Active (tooltip-artig).
- Scroll-Snap: `scroll-snap-type: x mandatory`.

### 4.7 Sidebar-Preview (Desktop, rechts)

```
╔══════════════════════╗
║                      ║
║   ┌────────────┐     ║      SVG-Preview
║   │            │     ║      (300×220 min)
║   │    ▣   ▣   │     ║
║   │            │     ║
║   └────────────┘     ║
║                      ║
║   1 200 × 1 400 mm   ║      text-measure, muted
║                      ║
║   RICHTPREIS         ║      heading-price-label
║                      ║
║   184 €              ║      heading-price
║   (interpoliert)     ║      text-caption
║                      ║
║   Einflügelig        ║      Konfig-Summary
║   Salamander BluE82  ║      Toggle für Detail
║   ▸ Anthrazit 7016   ║
║                      ║
║   ┌─────────────┐    ║
║   │ Angebot →   │    ║      primary, rounded-full
║   └─────────────┘    ║
║                      ║
║   Oder per Mail →    ║      text-link, klein
║                      ║
╚══════════════════════╝
```

- `width 360 px`, sticky `top-20`, `max-h-[calc(100vh-5rem)]`, `overflow-y-auto no-scrollbar`.
- `bg-white`, border-left 1 px `--border`, padding 24 px.
- Preview-Box: `rounded-xl`, `bg-[var(--konfig-canvas)]`, radial-gradient-overlay im Background.

### 4.8 Mobile-Bottom-Sheet

- vaul Drawer, 3 Snap-Points.
- Peek-Zustand (72 px): Drag-Handle 32 px oben, darunter Flexrow „ab 184 € | BluEvolution 82 | ▲".
- Half-Zustand: + SVG-Preview (kompakt 240×160) + Maße.
- Full-Zustand: + Property-Tabelle + CTA.
- Background weiß, `rounded-t-3xl`, `shadow-[0_-8px_32px_rgba(0,0,0,0.12)]`.

### 4.9 Mini-Rechner (Ausmess-Seite)

- Eigener Container auf `bg-brand-gradient`, white Text, rounded-3xl, p-8.
- Auf weißem Content-Background deutlich abgesetzt.
- Inputs: weißer BG, große Zahlen-Eingabe (Poppins 800 2rem), mm-Suffix in Lato.
- Abzüge: jede Zeile als Chip mit minus-Icon.
- Ergebnis-Box unten: invertiert (weißer BG, dunkler Text), heading-price-Style für das Ergebnis.
- CTA: weißer Button mit Primary-Text „→ Maße übernehmen".

---

## 5. Motion-Patterns

Wir nutzen die bereits vorhandenen Utilities:

- `gsap` für den ersten Seiten-Auftritt (wie Hero):
  - Staggered fade-up für Progress + Step-Headline + Content (je 80 ms delay).
- `data-animate` Hooks (wie auf anderen Sections) für scroll-reveal bei `/fenster-ausmessen` Long-Scroll-Content.
- Shape-Transitions im Preview-SVG: CSS `transition: all 260ms cubic-bezier(0.2, 0.9, 0.3, 1.1)` — das leichte Overshoot gibt einen angenehmen „Snap".
- Preis-Wechsel: `transition: transform 260ms` mit Key-Animation bei > 10 % Delta (Scale-Bounce).
- Step-Wechsel: Exit-Animation `translate-x-8 opacity-0` → Enter `translate-x-0 opacity-100`, 320 ms.
- Drawer (Ausmess-Guide, Bottom-Sheet): vaul default motion.

Alle Motions respektieren `prefers-reduced-motion: reduce` → sofortiger Wechsel ohne Transition.

---

## 6. Icon-Library und Illustrationen

### 6.1 Icons

- **lucide-react** (bereits via shadcn vorhanden) für UI-Icons: Check, X, ChevronDown, ChevronLeft, ChevronRight, Info, AlertCircle, Ruler, Phone.
- Stroke-width **1.75** (konsistent mit bestehendem Usp-Icon-Style).

### 6.2 Shape-SVG-Primitives (eigen)

6 Komponenten in `src/components/konfigurator/window-preview/shape-primitives.tsx`. Jeweils inline-SVG mit `currentColor` als Stroke, parent-color-bestimmt. Beispiel-Skelett:

```tsx
export function ShapeDKL({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="4" y="4" width="40" height="40" rx="1" />
      {/* Dreh-Symbol: Diagonale von unten-links nach oben-rechts */}
      <path d="M4 44 L44 4" />
      {/* Kipp-Symbol: Horizontale Linie oben */}
      <path d="M8 8 L40 8" />
      {/* Griff rechts mittig */}
      <circle cx="42" cy="24" r="1.5" fill="currentColor" />
    </svg>
  );
}
```

Alle sechs Shapes als matching Paar (DKL/DKR, DL/DR) sauber gespiegelt. 1-2 Stunden Arbeit für das Set.

### 6.3 Illustrationen für Ausmess-Guide

Hand-gezeichneter Blueprint-Look, Primary-Blau Stroke, minimal. Acht Motive:
1. Altbau-Fenster-Aufriss mit Mess-Pfeilen
2. Neubau-Maueröffnung mit Mess-Pfeilen
3. Öffnungsrichtung-Perspektive (Blick von innen)
4. Fensterbank-Anschlussprofil Detail
5. Rollladen-Aufsatzkasten Detail
6. Skizzen-Konvention (Dreieck-Griff)
7. Einbauluft-Illustration (Mauerstein + Fensterrahmen + Lücke)
8. Diagonal-Kontrollmaß

Erstellung in Figma, dann per SVGR als React-Komponenten. Alternativ: `<img src="/images/guide/…svg" />` — einfacher. Schätzung 2-3 Tage für saubere Illustrationen, je nach verfügbaren Ressourcen. **Fallback für 1c:** generische Iconographie (Ruler, Square, Home) aus lucide, bis Illustrationen nachgezogen werden.

---

## 7. Key-Screen 1 — Desktop Schritt 1 (Komponenten-Skelett)

Working code, in Tailwind + React. Kann als Startpunkt für die Implementation adaptiert werden. State-Handling deutet auf den Store aus `konfigurator-ui.md` §4.1.

```tsx
// src/components/konfigurator/steps/step-masse.tsx (Skelett)
"use client";

import { useConfigStore } from "../store";
import { GroupSelector } from "../group-selector";
import { GuideDrawer } from "@/components/ausmess-guide/guide-drawer";
import { Ruler } from "lucide-react";

export function StepMasse() {
  const { width, height, groupExternalId, setMasse, setStep } = useConfigStore();

  const canAdvance = width && height && groupExternalId;

  return (
    <div className="mx-auto max-w-3xl py-8 px-6 sm:px-10">
      <h2 className="heading-konfig-step mb-2">Maße & Aufteilung</h2>
      <p className="text-caption max-w-xl">
        Gib die Außenmaße des geplanten Fensters ein — das Bestellmaß inklusive Einbauluft.
        Unsicher? Nutze den Ausmess-Guide.
      </p>

      {/* Maß-Eingabe */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <MeasureInput
          label="Breite"
          value={width}
          min={400}
          max={2800}
          onChange={(v) => setMasse(v, height ?? 0, groupExternalId ?? 1)}
        />
        <MeasureInput
          label="Höhe"
          value={height}
          min={400}
          max={3000}
          onChange={(v) => setMasse(width ?? 0, v, groupExternalId ?? 1)}
        />
      </div>

      {/* Preset-Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[800, 1000, 1200, 1500, 1800].map((v) => (
          <button
            key={v}
            onClick={() => setMasse(v, height ?? v, groupExternalId ?? 1)}
            className="rounded-full bg-[var(--konfig-chip-idle-bg)] px-3 py-1 text-xs font-medium text-[var(--brand-text)] hover:bg-[var(--konfig-chip-hover-bg)] transition"
          >
            {v} × {v}
          </button>
        ))}
      </div>

      {/* Guide-Drawer Trigger */}
      <GuideDrawer>
        <button className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-primary)] hover:underline">
          <Ruler className="h-4 w-4" />
          Unsicher beim Ausmessen? Ausmess-Guide öffnen →
        </button>
      </GuideDrawer>

      {/* Aufteilung */}
      <div className="mt-12">
        <h3 className="heading-sub mb-4">Aufteilung wählen</h3>
        <GroupSelector />
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between">
        <div /> {/* kein Back auf Step 1 */}
        <button
          disabled={!canAdvance}
          onClick={() => setStep(2)}
          className="bg-brand-gradient inline-flex items-center rounded-full px-8 py-3 text-sm font-semibold text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105"
        >
          Weiter zu Öffnungsart →
        </button>
      </div>
    </div>
  );
}

function MeasureInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number | null;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const outOfRange = value !== null && (value < min || value > max);

  return (
    <label className="block">
      <span className="heading-price-label mb-2 block">{label}</span>
      <div
        className={`relative rounded-xl border-2 bg-white transition ${
          outOfRange
            ? "border-[var(--destructive)]"
            : value
            ? "border-[var(--konfig-stroke)]"
            : "border-[var(--border)]"
        }`}
      >
        <input
          type="number"
          inputMode="numeric"
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0"
          className="w-full bg-transparent px-5 py-4 text-3xl font-bold outline-none text-measure"
          style={{ fontFamily: "var(--font-display)" }}
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">
          mm
        </span>
      </div>
      {outOfRange && (
        <p className="mt-1 text-xs text-[var(--destructive)]">
          Außerhalb Standardmaß ({min}–{max} mm) — Sonderanfrage nötig.
        </p>
      )}
    </label>
  );
}
```

---

## 8. Key-Screen 2 — Sidebar-Preview (Komponenten-Skelett)

```tsx
// src/components/konfigurator/summary-sidebar.tsx (Skelett)
"use client";

import { useConfigStore } from "./store";
import { WindowPreview } from "./window-preview/window-preview";
import { usePrice } from "@/lib/konfigurator-api";
import Link from "next/link";

export function SummarySidebar() {
  const { width, height, groupExternalId, shapes, articleSlug } = useConfigStore();
  const price = usePrice({ articleSlug, w: width, h: height, group: groupExternalId });

  return (
    <aside className="sticky top-20 hidden w-[360px] shrink-0 border-l border-[var(--border)] bg-white p-6 lg:block">
      {/* Preview */}
      <div className="relative mb-6 flex h-[220px] items-center justify-center rounded-xl bg-[var(--konfig-canvas)] p-4">
        <div
          className="absolute inset-0 rounded-xl opacity-60"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,159,227,0.06), transparent 70%)",
          }}
        />
        <div className="relative">
          <WindowPreview
            groupExternalId={groupExternalId}
            shapes={shapes}
            color="var(--konfig-stroke)"
          />
        </div>
      </div>

      {/* Maße */}
      <p className="text-measure text-sm text-[var(--muted-foreground)]">
        {width && height ? `${width} × ${height} mm` : "Noch keine Maße"}
      </p>

      {/* Preis */}
      <div className="mt-4">
        <p className="heading-price-label">
          {articleSlug ? "Richtpreis" : "ab"}
        </p>
        <p className="heading-price mt-1">
          {price.isLoading ? (
            <span className="inline-block h-[1em] w-32 animate-pulse rounded bg-gray-200" />
          ) : price.data ? (
            `${Math.round(price.data.base_price_eur)} €`
          ) : (
            "—"
          )}
        </p>
        {price.data?.interpolated && (
          <p className="text-caption mt-1">
            ≈ Richtpreis interpoliert zwischen gelisteten Größen
          </p>
        )}
      </div>

      {/* Konfig-Summary */}
      <div className="mt-6 space-y-1 border-t border-[var(--border)] pt-4 text-sm">
        {groupExternalId && (
          <p className="text-[var(--brand-text)]">
            <span className="text-[var(--muted-foreground)]">Aufteilung:</span> Gruppe {groupExternalId}
          </p>
        )}
        {articleSlug && (
          <p className="text-[var(--brand-text)]">
            <span className="text-[var(--muted-foreground)]">Profil:</span> {articleSlug}
          </p>
        )}
      </div>

      {/* CTA */}
      <Link
        href="#schritt-5"
        className="bg-brand-gradient mt-6 flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:scale-[1.02]"
      >
        Unverbindliches Angebot anfordern →
      </Link>

      <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
        Antwort innerhalb 48 Stunden
      </p>

      <button className="mt-4 block w-full text-center text-xs text-[var(--brand-primary)] underline-offset-2 hover:underline">
        Oder: Konfiguration per Mail speichern
      </button>
    </aside>
  );
}
```

---

## 9. Key-Screen 3 — Mini-Rechner (Komponenten-Skelett)

```tsx
// src/components/ausmess-guide/mini-rechner.tsx (Skelett)
"use client";

import { useState, useMemo } from "react";
import { computeOrderMeasure } from "@/lib/measure-math";
import { ArrowRight, Minus } from "lucide-react";
import Link from "next/link";

export function MiniRechner() {
  const [rawWidth, setRawWidth] = useState<number>(1260);
  const [rawHeight, setRawHeight] = useState<number>(1460);
  const [building, setBuilding] = useState<"altbau" | "neubau">("altbau");
  const [color, setColor] = useState<"weiss" | "farbig">("weiss");
  const [withLeiste, setWithLeiste] = useState(false);
  const [withRollladen, setWithRollladen] = useState(false);

  const result = useMemo(
    () =>
      computeOrderMeasure({
        rawWidth,
        rawHeight,
        building,
        color,
        withFensterbankLeiste: withLeiste,
        withRollladenAufsatz: withRollladen,
      }),
    [rawWidth, rawHeight, building, color, withLeiste, withRollladen]
  );

  return (
    <section className="bg-brand-gradient relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl sm:p-12">
      {/* dekorative Kreise wie im bestehenden Konfigurator-Teaser */}
      <div
        className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-10"
        style={{ backgroundColor: "#ffffff" }}
      />
      <div
        className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full opacity-10"
        style={{ backgroundColor: "#ffffff" }}
      />

      <div className="relative">
        <p className="heading-price-label text-white/70">Interaktiv</p>
        <h2 className="heading-sub mt-1 text-white">
          Rohbaumaß → Bestellmaß
        </h2>
        <p className="mt-2 text-white/80 text-sm max-w-md">
          Gib deine Maueröffnungs-Maße ein. Wir berechnen das Bestellmaß sofort —
          transparent und mit allen Abzügen.
        </p>

        {/* Modus-Toggles */}
        <div className="mt-6 flex flex-wrap gap-4">
          <ToggleGroup
            value={building}
            onChange={setBuilding}
            options={[
              { value: "altbau", label: "Altbau" },
              { value: "neubau", label: "Neubau" },
            ]}
          />
          <ToggleGroup
            value={color}
            onChange={setColor}
            options={[
              { value: "weiss", label: "Weiß" },
              { value: "farbig", label: "Farbig" },
            ]}
          />
        </div>

        {/* Eingabe */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LargeNumberInput label="Rohbau Breite" value={rawWidth} onChange={setRawWidth} />
          <LargeNumberInput label="Rohbau Höhe" value={rawHeight} onChange={setRawHeight} />
        </div>

        {/* Optionale Zuschläge */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <CheckChip label="Fensterbankleiste (−30 mm Höhe)" checked={withLeiste} onChange={setWithLeiste} />
          <CheckChip label="Rollladen-Aufsatz (−180 mm Höhe)" checked={withRollladen} onChange={setWithRollladen} />
        </div>

        {/* Abzüge */}
        <div className="mt-6 space-y-1">
          {result.deductions.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-white/75">
              <Minus className="h-3 w-3" />
              <span>{d.label}: − {d.amountMm} mm {d.axis}</span>
            </div>
          ))}
        </div>

        {/* Ergebnis */}
        <div className="mt-6 rounded-2xl bg-white px-6 py-5 shadow-md">
          <p className="heading-price-label">Ihr Bestellmaß</p>
          <p className="heading-price mt-1 text-[var(--konfig-price)]">
            {result.orderWidth} × {result.orderHeight} <span className="text-2xl font-semibold text-[var(--muted-foreground)]">mm</span>
          </p>
        </div>

        {/* Übernahme-CTA */}
        <Link
          href={`/konfigurator?w=${result.orderWidth}&h=${result.orderHeight}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-primary)] shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          Maße in Konfigurator übernehmen
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

// Sub-Components (ToggleGroup, LargeNumberInput, CheckChip) — siehe full Implementation
```

---

## 10. Globale CSS-Ergänzungen

Zu `src/app/globals.css` ergänzen (kompakt):

```css
:root {
  --konfig-canvas: #fafbfc;
  --konfig-grid: rgba(0, 159, 227, 0.04);
  --konfig-stroke: #009fe3;
  --konfig-stroke-muted: #cfe7f5;
  --konfig-price: #212934;
  --konfig-step-done: #15779b;
  --konfig-step-active: #009fe3;
  --konfig-step-idle: #e2e2e2;
  --konfig-chip-idle-bg: #f2f8fc;
  --konfig-chip-hover-bg: #e2ecf6;
  --konfig-chip-active-bg: #009fe3;
  --konfig-chip-active-fg: #ffffff;
}

.heading-konfig-step {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.15;
  color: var(--brand-heading);
}

.heading-price {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--konfig-price);
  font-variant-numeric: tabular-nums;
}

.heading-price-label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.text-measure {
  font-family: var(--font-display);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
}

.text-caption {
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  line-height: 1.5;
}

@media (prefers-reduced-motion: reduce) {
  .konfig-animate {
    transition: none !important;
    animation: none !important;
  }
}
```

---

## 11. Schritt-Checkliste Implementation

Für den Implementation-Schritt (§4 im Ursprungs-Prompt):

1. Globale CSS-Ergänzungen in `globals.css` (§10).
2. shadcn components nachinstallieren sofern fehlend: `drawer`, `accordion`, `toggle-group`, `radio-group`. (`sheet` ist schon da, siehe header.tsx.)
3. Dependencies hinzufügen: `zustand`, `@tanstack/react-query`.
4. Fünf Meilenstein-Commits in der Reihenfolge aus konfigurator-ui.md §11.

---

## 12. Konsistenz-Check zur bestehenden Marke

| Bereich | bestehend | Konfigurator (neu) | Konflikt? |
|---|---|---|---|
| Font-Family | Poppins / Lato | identisch | nein |
| Primary-Farbe | `#009fe3` | identisch | nein |
| CTA-Style | `bg-brand-gradient` rounded-full | identisch | nein |
| Card-Style | `rounded-2xl shadow-md hover:shadow-xl` | identisch (Profile-Card) | nein |
| Background | Hero dunkel, USP light, Konfigurator-Teaser gradient | Canvas `#fafbfc`, Mini-Rechner gradient | nein — Konfigurator-Tool braucht ruhige Fläche, Mini-Rechner behält die Energie |
| Animation | GSAP + `data-animate` | zusätzlich shape-transitions + price-bounce | nein — erweitert |
| Clip-paths | `clip-diagonal` im Hero | diskret als Progress-Bar-Dekor möglich | optional |

Kein Konflikt. Der Konfigurator liest wie das „nächste Kapitel" der Seite, nicht wie ein Fremdkörper.

---

## 13. Was bewusst weggelassen

- **Keine neuen Fonts** — Poppins/Lato reichen, sind charakterstark genug.
- **Keine Dark-Mode-Variante** — die bestehende Seite hat keine, wir ziehen nicht vor.
- **Kein 3D-Fenster-Rendering** — SVG reicht, 3D wäre over-engineered und unzuverlässig auf Mobile.
- **Keine Maskottchen / Illustrationen mit Personen** — nicht im Brand-Look der bestehenden Seite, würde dissonant wirken.
- **Kein heroisches Intro-Video** — der Konfigurator ist ein Werkzeug, kein Produkt-Drama.
