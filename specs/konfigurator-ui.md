# Konfigurator-UI — Design-Spec (Phase 1c / §7 Schritt 7)

**Datum:** 2026-04-19
**Scope:** UI-Layer für `/konfigurator` + `/fenster-ausmessen`, Kreativ-Variante
**Grundlagen:**
- [`konfigurator-db.md`](./konfigurator-db.md) §7 Schritt 7 + §12
- [`konfigurator-api.md`](./konfigurator-api.md) (Datenquelle)
- [`konfigurator-ux-research.md`](./konfigurator-ux-research.md) (v1, 5 Wettbewerber)
- [`konfigurator-ux-research-v2.md`](./konfigurator-ux-research-v2.md) (v2, Tiefenanalyse)
- Branding: `src/app/globals.css` (Primary `#009fe3`, Secondary `#3d66ae`, Accent `#15779b`, Poppins/Lato, `bg-brand-gradient`, `clip-diagonal`)

---

## 1. Ziel und USP-Claim

> "**Gib uns deine Maße. Wir zeigen dir 6 passende Profile mit transparentem Preis.**"

Die umgekehrte Flow-Reihenfolge (Maße → Profile) ist unser Differenzierer (v1 §Zusammenfassung). Der Mini-Rechner Rohbau → Bestellmaß ist unser zweiter Differenzierer (v2 §1).

---

## 2. User-Journey — Primary Flow

Fünf Haupt-Schritte auf einer Seite (Stepped Single-Page, nicht mehrseitiger Wizard):

| # | Schritt | Input | Auswahl persistiert als |
|---|---------|-------|--------------------------|
| 1 | **Maße & Aufteilung** | Breite (400–2800 mm), Höhe (400–3000 mm), Group-Id (1–15 aus 13 Varianten). Button „Ausmess-Guide öffnen" → Drawer. | `width`, `height`, `groupExternalId` |
| 2 | **Öffnungsart pro Flügel** | Shape-Matrix (via `shapeConfiguration`). Für jede Zelle: DKL/DKR/DL/DR/Fest/Kipp. | `shapes: string[][]` |
| 3 | **Profil wählen** | Kartenliste aller 6 matchenden Profile mit Live-Preis, Uw, Bautiefe. Filter-Chips: Brand, Sort (Preis ↑ / Uw ↓). | `articleSlug` |
| 4 | **Konfigurieren** | Farbvariante (innen/außen, 2-spaltig Swatch-Grid), Additions (Rollladen, Schallschutz, …, je als Accordion). | `variantExternalId`, `selectedAdditionVariantExternalIds` |
| 5 | **Anfrage** | Kontakt-Form (Name, Mail, Tel, Nachricht) + Zusammenfassung + Preview. CTA: „Unverbindliches Angebot anfordern". Sekundär: „Konfiguration per Mail speichern". | POST `/api/v1/inquiries` |

**Progress-Bar** oben klebend (alle Breakpoints), zeigt alle 5 Schritte. Rückwärts springen erlaubt, vorwärts nur wenn aktueller Schritt valide.

### 2.1 Alternative Flows

- **Direkt-Einstieg vom Katalog**: Nutzer klickt in `/katalog` auf ein Profil → `?article=…` pre-selected Schritt 3, Rest leer. Nutzer muss Maße nachreichen.
- **Tiefer Einstieg vom Ausmess-Guide**: Mini-Rechner-Ergebnis wird per State-Sharing (Zustand-Store) übernommen → Schritt 1 pre-filled.
- **Deep-Link per URL**: `/konfigurator?w=1200&h=1400&group=1&shapes=DKL,DKR` → startet auf Schritt 3, Schritte 1+2 vorbelegt. Query-Params als Single Source of Truth (zustand syncht mit URL).
- **Sondermaß-Fallback**: wenn `w` oder `h` außerhalb `rangeSizes` → roter Hinweis + Swap-Button „Als Sonderanfrage stellen" → öffnet Schritt 5 direkt mit `configuration.nonStandardSize: true`.

---

## 3. Komponenten-Architektur

### 3.1 Seiten

- `src/app/konfigurator/page.tsx` — Server Component, lädt via Route Handler `/api/v1/init` (nur Brands / Groups / Shapes / rangeSizes). Rendert `<KonfiguratorShell>` Client Component.
- `src/app/fenster-ausmessen/page.tsx` — Server Component, SSG-tauglich (reiner Content). Rendert statische MDX-like Sections + `<MiniRechner>` als Client Island.

### 3.2 Komponenten-Baum

```
src/components/konfigurator/
├── konfigurator-shell.tsx              # Client, lädt init, hält Provider, koordiniert Layout (Desktop 2-col vs Mobile 1-col + BottomSheet)
├── store.ts                            # Zustand-Store (persistiert in localStorage + URL-sync)
├── progress-bar.tsx                    # Sticky top, 5 Steps, aktiv/done/disabled, klickbar rückwärts
├── steps/
│   ├── step-masse.tsx                  # Width/Height Input + GroupSelector + Button "Ausmess-Guide"
│   ├── step-oeffnungsart.tsx           # Shape-Matrix pro Flügel
│   ├── step-profil.tsx                 # Artikel-Liste via `/api/v1/articles`
│   ├── step-konfiguration.tsx          # Variants + Additions via `/api/v1/articles/:slug`
│   └── step-anfrage.tsx                # Form + POST `/api/v1/inquiries`
├── group-selector.tsx                  # 13 Thumbnail-Cards (Name + Preview-Icon)
├── shape-picker.tsx                    # Pro Flügel: 6 Icon-Buttons (Fest/DKL/DKR/DL/DR/Kipp)
├── window-preview/                     # SVG-Preview
│   ├── window-preview.tsx              # Compose: rendert shapeConfiguration × shapes
│   ├── shape-primitives.tsx            # 6 SVGs: Fest/DKL/DKR/DL/DR/Kipp
│   └── frame.tsx                       # Outer Rahmen, Pfosten-Linien
├── article-card.tsx                    # Step-3 Liste-Eintrag
├── variant-picker.tsx                  # Step-4 Farb-Swatches (Außen/Innen)
├── additions-accordion.tsx             # Step-4 Rollladen etc.
├── summary-sidebar.tsx                 # Desktop Sidebar rechts (Preview + Preis + CTA)
├── mobile-bottom-sheet.tsx             # Mobile-Variante (vaul Drawer, 3 Snap-Points)
├── sticky-cta-bar.tsx                  # Mobile-only, 56 px, unten klebend
└── inquiry-form.tsx                    # Step 5, Zod-validated

src/components/ausmess-guide/
├── mini-rechner.tsx                    # Client: Breite/Höhe Inputs, Altbau/Neubau, Farbe Toggles, Live-Ergebnis
├── guide-content.tsx                   # Alle Kapitel (§3.4 der v2) als React-Components, re-use als Page + Drawer
├── guide-drawer.tsx                    # Wrapper: rendert <guide-content /> in shadcn Sheet/Drawer
├── einbauluft-table.tsx                # Daten aus v2 §3.2
├── glossar.tsx                         # 6 Begriffe
└── illustrations/                      # SVG-Assets (Altbau, Neubau, Rollladen-Integration etc.)
```

### 3.3 Hilfs-Module

```
src/lib/
├── konfigurator-api.ts    # Thin Fetcher für /api/v1/* mit React Query
├── konfigurator-types.ts  # TS-Types für API-Responses (shared Client+Server)
└── measure-math.ts        # Rohbau→Bestellmaß-Rechnung (pure, unit-tested)
```

### 3.4 Shared-UI (falls noch nicht da, aus shadcn installieren)

- `drawer` (vaul) — für Ausmess-Drawer + Mobile Bottom Sheet
- `sheet` — ggf. als Alternative auf Desktop
- `accordion` — Additions
- `progress` / custom Stepper — Progress-Bar
- `badge`, `card`, `button`, `input`, `label`, `toggle-group`, `radio-group` — Standard

---

## 4. State-Management-Strategie

### 4.1 Konfigurator-State — `zustand`

```ts
// store.ts
type ConfigState = {
  step: 1 | 2 | 3 | 4 | 5;
  width: number | null;
  height: number | null;
  groupExternalId: number | null;
  shapes: string[][] | null;          // [["Fest"]] oder [["Fest"],["DKL","DKR"]]
  articleSlug: string | null;
  variantExternalId: number | null;
  selectedAdditionVariantExternalIds: number[];
  contact: { name; email; phone?; message? } | null;

  // Actions
  setMasse(w: number, h: number, group: number): void;
  setShapes(s: string[][]): void;
  chooseArticle(slug: string): void;
  chooseVariant(id: number): void;
  toggleAddition(id: number): void;
  setStep(s: 1|2|3|4|5): void;
  reset(): void;
};
```

**Persistence:** `zustand/middleware/persist` → localStorage (`key: pf-konfigurator-v1`). TTL 24 h.

**URL-Sync:** eigener Middleware-Hook schreibt relevante Felder (`w, h, group, shapes, article`) in Query-Params via `router.replace()`, debounced 300 ms. Beim Mount: URL hat Priorität vor localStorage.

### 4.2 API-Daten — `@tanstack/react-query`

- `useInit()` → `/api/v1/init` (stale-while-revalidate, 5 min)
- `useArticles({ w, h, group, shapes, brand })` → List, refetch bei State-Änderung
- `useArticle(slug, { w, h, group })` → Detail
- `useInquiryMutation()` → POST

Begründung React Query statt SWR: Mutations-Support (POST) + Optimistic Updates + DevTools. ~14 KB gzipped.

### 4.3 Mini-Rechner-State — lokal

Eigener `useState` im `<MiniRechner>`, keine globale Store-Abhängigkeit. „Ins Konfigurator-Maß übernehmen"-Button ruft `useConfigStore.getState().setMasse(w, h, group=1)` auf und navigiert zu `/konfigurator#schritt-2` (Maß-Step komplett, Shape-Step ist nächster).

---

## 5. Layout und Wireframes

### 5.1 Desktop (≥ lg / 1024 px) — 2-Spalten

```
┌──────────────────────────────────────────────────────────────┐
│ Header (bestehend)                                            │
├──────────────────────────────────────────────────────────────┤
│ Progress-Bar (sticky, 64 px):                                 │
│   ① Maße ─── ② Öffnung ─── ③ Profil ─── ④ Config ─── ⑤ Anfrage│
├──────────────────────────────────────────────┬───────────────┤
│                                              │               │
│   AKTIVER STEP                               │  SIDEBAR      │
│   (max-w: 760 px, zentriert)                 │  (360 px)     │
│                                              │  sticky       │
│                                              │               │
│   Schritt 1 — Maße & Aufteilung              │  ┌─────────┐  │
│                                              │  │ SVG-    │  │
│   Rohbaumaß Breite:     ┌──────┐ mm          │  │ Preview │  │
│   Rohbaumaß Höhe:       ┌──────┐ mm          │  │         │  │
│   [Unsicher? Ausmess-Guide öffnen →]         │  └─────────┘  │
│                                              │               │
│   Aufteilung wählen (13 Varianten):          │  ab 184,28 €  │
│   [1] Einflügelig     [2] Zweiflügelig       │  Richtpreis   │
│   [3] Dreiflügelig    [6] 1+Oberlicht        │               │
│   ...                                        │  1200 × 1400  │
│                                              │  Einflügelig  │
│   [Weiter zu Öffnungsart →]                  │  ─────────    │
│                                              │  [Angebot     │
│                                              │   anfordern]  │
│                                              │               │
└──────────────────────────────────────────────┴───────────────┘
Footer (bestehend)
```

- Sidebar 360 px, sticky `top-20`, zeigt:
  - SVG-Preview mit animierten Shape-Updates
  - Zentraler Preis mit Label „ab X €" (solange Profil nicht gewählt) / „Richtpreis: X €" (nach Profil-Wahl, interpolated → mit Info-Badge)
  - Zusammenfassung (Maße, Group, Profil, Variant)
  - CTA-Button „Unverbindliches Angebot anfordern" (führt zu Schritt 5)

### 5.2 Tablet (md, 768–1023 px) — 2-Spalten kompakt

Sidebar auf 280 px, SVG-Preview kleiner (max-height 220 px). Ansonsten identisch.

### 5.3 Mobile (< md, < 768 px) — 1-Spalte + Bottom-Sheet

```
┌──────────────────────────┐
│ Header                   │
├──────────────────────────┤
│ Progress-Bar (sticky)    │
│ ● ─ ○ ─ ○ ─ ○ ─ ○         │
├──────────────────────────┤
│                          │
│ AKTIVER STEP             │
│ (Full width, padding 16) │
│                          │
│ Schritt 1                │
│ Maße & Aufteilung        │
│                          │
│ Breite:  [    ] mm       │
│ Höhe:    [    ] mm       │
│ [Ausmess-Guide öffnen →] │
│                          │
│ Aufteilung:              │
│ ┌────┐┌────┐             │
│ │ 1  ││ 2  │             │
│ └────┘└────┘             │
│ ┌────┐┌────┐             │
│ │ 3  ││ 6  │             │
│ └────┘└────┘             │
│                          │
│ [ Weiter → ]             │
│                          │
│ ... Scroll-Puffer        │
├──────────────────────────┤
│ Sticky-CTA-Bar (56 px)   │
│ ab 184 €  [Angebot ▲]    │
└──────────────────────────┘
```

**Sticky-CTA-Bar** unten klebend. Klick auf „Angebot" öffnet das **Bottom-Sheet** (vaul Drawer) mit 3 Snap-Points:

- **Peek (72 px)**: Preis + Profil-Name + Drag-Handle
- **Half (40 vh)**: + SVG-Preview + Konfig-Summary
- **Full (90 vh)**: + Properties-Tabelle + großer „Angebot anfordern"-Button (führt zu Schritt 5)

Close-Button oben rechts explizit (NN/Group-Empfehlung v2 §2.2).

### 5.4 Key Screen — Schritt 3 (Profil-Liste, USP-Moment)

Desktop 2-Spalten. Main-Content:

```
Schritt 3 — Passende Profile für 1200 × 1400 mm, Einflügelig

Filter: [□ Salamander] [□ Aluplast] [□ Gealan]  Sort: [Preis ↑▼] [Uw ↓]

┌────────────────────────────────────────────────────────────┐
│ [Logo] Salamander Streamline 76           [ab 39 €]       │
│        Uw 0,97  │  76 mm  │  5 Kammern  │  2-fach          │
│        [bild]                     [ Auswählen → ]          │
├────────────────────────────────────────────────────────────┤
│ [Logo] Aluplast Ideal 4000                [ab 45 €]  ★BEST │
│        Uw 0,76  │  70 mm  │  5 Kammern  │  2-fach          │
│        [bild]                     [ Auswählen → ]          │
├────────────────────────────────────────────────────────────┤
...
```

Der „★BEST"-Badge als kleine Empfehlung: das günstigste Profil mit Uw < 0,8 W/m²K (3-fach Verglasung default).

### 5.5 Mini-Rechner — Wireframe

Auf `/fenster-ausmessen` oberhalb der H2-Sektionen:

```
┌───────────────────────────────────────────────────────────┐
│ Mini-Rechner: Rohbaumaß → Bestellmaß                       │
│                                                            │
│ Altbau  [ ● ]  Neubau                                      │
│ Weiß    [ ● ]  Farbig                                      │
│                                                            │
│  Rohbaumaß Breite             Rohbaumaß Höhe              │
│  ┌──────────────┐             ┌──────────────┐             │
│  │    1 260     │             │    1 460     │             │
│  └──────────────┘ mm          └──────────────┘ mm          │
│   [icon]                      [icon]                       │
│                                                            │
│  Abzüge:                                                   │
│   • Einbauluft (2× 20 mm)                   – 40 mm B      │
│   • Einbauluft (2× 20 mm)                   – 40 mm H      │
│   • Fensterbankleiste (optional) [□]        – 30 mm H      │
│   • Rollladen-Aufsatzkasten (optional) [□]  – … mm H       │
│                                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                │
│  Ihr Bestellmaß: 1 220 × 1 420 mm                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                │
│                                                            │
│  [ Maße in Konfigurator übernehmen → ]                     │
└───────────────────────────────────────────────────────────┘
```

---

## 6. Design-Entscheidungen mit Begründung

### 6.1 Umgekehrter Flow (Maße zuerst)

**Entscheidung:** Maße + Aufteilung in Schritt 1, Profil erst Schritt 3.
**Begründung:** v1 §Zusammenfassung. Unser Wert ist Preis-Vergleich über alle 6 Profile — das funktioniert nur wenn Maße stehen. Maße sind technisch Voraussetzung für den Preis-Lookup.

### 6.2 Preview als Client-SVG, nicht qlein-Proxy

**Entscheidung:** Eigene React-Komponenten mit 6 Shape-Primitives + 13 Group-Layouts via CSS-Grid.
**Begründung:** v2 §4.2. Keine Laufzeit-Abhängigkeit von qlein (widerspricht DB-§5.1 "Uptime nicht garantiert"). ~1 Tag Aufwand. Animierbar.

### 6.3 Mobile via Nonmodal Bottom-Sheet (vaul / shadcn Drawer)

**Entscheidung:** 3 Snap-Points (Peek/Half/Full), ergänzt durch Sticky-CTA-Bar (56 px) unten.
**Begründung:** v2 §2. NN/Group + Shopify-Best-Practice. 8–15 % Conversion-Lift möglich. shadcn/vaul ist stack-nativ, keine neue Dependency.

### 6.4 Ausmess-Guide an zwei Orten mit geteiltem Content

**Entscheidung:** `/fenster-ausmessen` als Seite (SEO) + identische `<GuideContent />` als Drawer-Wrapper im Konfigurator. Der Mini-Rechner ist auf beiden sichtbar.
**Begründung:** v1 §Take-Away + v2 §5.2. SEO-Single-Source ohne Content-Duplikation. State-Sharing für Maße via zustand.

### 6.5 State in Zustand + React Query, URL als Source of Truth für Shareable-Config

**Entscheidung:** Zustand für Konfigurator-State, React Query für API-Daten, URL-Params-Sync mit 300 ms debounce.
**Begründung:** Zustand ist minimal (1 KB), SSR-sicher. React Query bietet Mutations + DevTools. URL-Sync macht Konfigurationen teilbar („Schick mir den Link" — Lead-Magnet).

### 6.6 Preis-Label: „ab X €" und „Richtpreis"

**Entscheidung:** Vor Profil-Wahl „ab X €" (niedrigster matchender Preis). Nach Profil-Wahl „Richtpreis: X €" mit Info-Badge bei `interpolated: true`.
**Begründung:** v2 §7. „ab X €" ist Branchenstandard, Nutzer-vertraut. „Richtpreis" ist Lead-Funnel-konform (ehrlich, nicht bindend). Unser Backend liefert `base_price_cents` mit `interpolated: boolean` — das zeigen wir transparent als Tooltip.

### 6.7 Haupt-CTA: „Unverbindliches Angebot anfordern"

**Entscheidung:** Primärer CTA-Text in allen drei Sichten (Sidebar, BottomSheet, Sticky-Bar, Step-5-Button).
**Begründung:** Branchenüblich (Neuffer: „Kostenloses Angebot innerhalb 48h"), Lead-Funnel-signalisiert, verzichtet auf Vertrags-Komm. Ergänzt mit Label „Antwort innerhalb 48 Stunden" in Schritt 5 als Vertrauensbaustein.

### 6.8 Sekundär-Aktion: „Konfiguration per Mail speichern"

**Entscheidung:** In Step 4 (nach Profil-Wahl) + Step 5 (neben Haupt-CTA) als Text-Link sichtbar. Öffnet Minimal-Form (nur Email) → POST `/api/v1/inquiries?type=saved` ODER (Phase 1d) ohne Backend nur Mailto-Link mit serialisierter URL.
**Begründung:** v2 §5.3, v1 §Take-Away. Soft-Conversion. Lead-Capture ohne Commitment.
**Anmerkung:** Backend für `type=saved` ist kein Phase-1c-Scope (Mail in Schritt 8). Für Phase 1c: nur Mailto-Link mit Deep-Link-URL. Später bequemer Button.

### 6.9 Fallback-Pattern bei Sondergröße

**Entscheidung:** Client-seitiger Check bei Maß-Eingabe gegen `rangeSizes` (aus `/api/v1/init`). Wenn außerhalb: roter Hint + Button „Als Sonderanfrage stellen" → Step 5 mit `nonStandardSize: true`.
**Begründung:** v2 §5.3 + v1 §Dos. Verhindert Frust durch „geht nicht"-Meldung erst am Ende.

### 6.10 „★BEST"-Badge in Profil-Liste

**Entscheidung:** Liste wird clientseitig annotiert: das günstigste Profil mit Uw < 0,8 W/m²K bekommt ein Label „Beste Empfehlung".
**Begründung:** Entscheidungs-Hilfe ohne Zwang. Reduziert Choice-Paralyse. Transparente Logik: „günstigstes Profil das 3-fach verglast / EnEV-tauglich".

### 6.11 Rangepicker NICHT, nur Numberinput + Preset-Buttons

**Entscheidung:** Kein Slider. Stattdessen: Number-Input mit `inputmode="numeric"` + „Schnellwahl"-Buttons (800 / 1200 / 1500 / 1800 mm) unterhalb der Felder.
**Begründung:** Slider mit 400–2800 mm Range und 1 mm Präzision ist UX-mäßig schlecht (zu viele Steps). Zahleneingabe ist präziser, Preset-Buttons helfen den häufigsten Größen. Mobile-Keyboard passt.

---

## 7. Error-/Empty-/Loading-States

| State | Wo | UI |
|---|---|---|
| Größe außerhalb `rangeSizes` | Step 1 | Roter Border + Hint „Maximal 2800 × 3000 mm. Größere Formate als Sonderanfrage." |
| Keine matchenden Artikel | Step 3 | Empty-State-Card „Für diese Kombination haben wir aktuell kein Standard-Profil. Sprechen Sie uns direkt an." + CTA Step 5 |
| `interpolated: true` | Sidebar + Step 3 | Kleines Info-Badge „Richtpreis interpoliert ± 5 %" |
| `warning` aus API (Fallback-Preispunkt) | Sidebar | Tooltip „Preis aus Nachbargröße geschätzt" |
| API-Call fehlgeschlagen (Artikel-Detail) | Step 4 | Retry-Button + Hinweis „Verbindung prüfen oder Support kontaktieren" |
| POST `/api/v1/inquiries` 500 | Step 5 | Toast „Konnte nicht senden. Bitte prüfe deine Verbindung." + Retry |
| Loading beim Step-Wechsel (Artikel-List) | Step 3 | Skeleton-Cards (6 Stück) |
| Loading Sidebar-Preis | Sidebar | Shimmer auf „ab X €" |
| Lokalstate-Hydration vor SSR | überall | Progress-Bar und leerer Content, Skeleton auf Step 1 |

---

## 8. Accessibility und Tastatur

- **Tastatur:** Tab-Reihenfolge folgt Flow. Enter in Maß-Input → springt zu nächstem Feld. Pfeiltasten in `shape-picker` und `group-selector` (radio-group Pattern).
- **Screenreader:** Progress-Bar mit `aria-current="step"`. SVG-Preview mit `aria-label` (z.B. „Zweiflügeliges Fenster mit Fest und Dreh-Kipp-Rechts").
- **Farbkontrast:** Primary `#009fe3` auf Weiß: 3.5:1 → nicht für kleine Schrift. Body-Text bleibt `#3f3f3f` auf Weiß (11:1). CTAs als Primary-Button mit weißem Text (4.8:1).
- **Focus-Ring:** `--ring: #009fe3` (bereits definiert), 2 px, sichtbar auf allen Interaktions-Elementen.
- **`inputmode="numeric" pattern="[0-9]*"`** auf Maß-Feldern für Mobile-Keyboard.
- **Reduced Motion:** SVG-Shape-Transitions respektieren `prefers-reduced-motion`.

---

## 9. Content — Ausmess-Guide (`/fenster-ausmessen`)

Struktur nach v2 §3.4:

1. **Hero** — H1 „Fenster ausmessen — so bestimmen Sie das korrekte Bestellmaß", Teaser.
2. **Mini-Rechner** — direkt oberhalb des Fold (Component `<MiniRechner />`).
3. **Vorbereitung & Werkzeug** — 3 Icons (Zollstock / Papier / Libelle) + Kurz-Text.
4. **Skizze & Öffnungsrichtung** — SVG (Dreieck-Konvention), Perspektive „von innen".
5. **Altbau messen** — 3 Substeps, je SVG + Kurz-Text.
6. **Neubau messen** — 2 Substeps.
7. **Einbauluft-Tabelle** — Tabelle aus v2 §3.2 (Weiß vs. Farbig, nach Fenstergröße).
8. **Sonderfall Rollladen** — SVG (Aufsatzkasten auf Rahmen), Höhen-Addition-Erklärung.
9. **Sonderfall Fensterbank-Anschlussprofil** — 10/25/30/40/50 mm Standard-Profile.
10. **Glossar** — 6 Begriffe (Aufmaß, Gesamtmaß, Fenstermaß, Rohbaumaß, Bestellmaß, Einbauluft).
11. **PDF-Download + CTA zum Konfigurator** — eigene Card am Seitenende.

**Länge:** ~1200–1500 Wörter. Sticky-TOC-Sidebar auf Desktop (4+ Anker-Links).

**Meta:**
- Page-Title: „Fenster ausmessen — Schritt-für-Schritt-Anleitung für Altbau & Neubau | Passende-Fenster"
- Meta-Description: „Fenster richtig ausmessen ✓ Altbau und Neubau ✓ Rohbaumaß ➜ Bestellmaß ✓ Einbauluft-Tabelle ✓ interaktiver Mini-Rechner"
- Schema.org: `HowTo` JSON-LD mit 5 Steps (Vorbereitung → Skizze → Breite → Höhe → Abzüge).

---

## 10. Measure-Math — die Kern-Bibliothek

Pure Funktionen in `src/lib/measure-math.ts`, unit-testable:

```ts
export type MassInput = {
  rawWidth: number;   // mm
  rawHeight: number;  // mm
  building: 'altbau' | 'neubau';
  color: 'weiss' | 'farbig';
  withFensterbankLeiste: boolean;
  fensterbankLeisteHeightMm?: number;  // default 30
  withRollladenAufsatz: boolean;
  rollladenAufsatzHeightMm?: number;   // default 180
};

export type MassOutput = {
  orderWidth: number;
  orderHeight: number;
  deductions: Array<{ label: string; amountMm: number; axis: 'B' | 'H' }>;
  clampedToRange: boolean;
};

export function computeOrderMeasure(input: MassInput): MassOutput;
```

**Einbauluft-Lookup** nach v2 §3.2. Tabelle als Const, Lookup nach größter Dimension:

```ts
const EINBAULUFT: Record<'weiss'|'farbig', Array<[maxMm: number, mm: number]>> = {
  weiss:  [[1000, 10], [2000, 15], [3000, 20]],
  farbig: [[1000, 15], [2000, 20], [3000, 25]],
};
```

**Unit-Tests (Jest/Vitest — entscheiden wir bei Implementation):**
- Altbau weiß, 1260 × 1460 → 1220 × 1420 (−2×20 pro Achse)
- Neubau farbig, 2100 × 2500 → 2050 × 2450 (−2×25 pro Achse wegen >2000)
- Mit Fensterbankleiste 30 → Höhe −30
- Mit Rollladen 180 → Höhe −180
- Alles außerhalb `rangeSizes` → `clampedToRange: true`

---

## 11. Implementation-Reihenfolge (nachgelagerter Plan)

Phase 1c kann in 5 Meilensteinen gebaut werden (jeweils eigener Commit):

1. **Foundation** — Zustand-Store + React-Query-Provider + `api-client.ts` + `measure-math.ts` + Unit-Tests.
2. **Preview-SVG-Komponenten** — 6 Shape-Primitives + Frame + Compose via `shapeConfiguration`.
3. **Konfigurator-Skeleton** — 5 Steps als Gerüst, Progress-Bar, Sidebar/BottomSheet-Layout (Desktop + Mobile).
4. **Ausmess-Guide** — Seite `/fenster-ausmessen` + Mini-Rechner + Drawer-Wrapper.
5. **Polish** — Loading/Error-States, Accessibility, SEO-Meta, Schema.org-JSON-LD, Lighthouse-Pass.

Jeder Meilenstein testbar im Browser. Commits im Stil der DB-Commits (95cf08a, 5e033a4).

---

## 12. Scope-Grenzen (explizit nicht in 1c)

- **Kein Mail-Versand** — POST `/api/v1/inquiries` landet in DB, Notification-Mail ist Schritt 8 (Phase 1d).
- **Kein Warenkorb / Kauf** — Phase 4.
- **Kein Admin-UI** — API-Routes existieren, UI später.
- **Keine Schema-Migration** — Follow-ups aus DB-§12.1 bleiben offen.
- **Kein echter PDF-Generator** — statisches PDF in `/public/aufmasshilfe-passende-fenster.pdf`, einmal mit Figma designen (kann separat liegen).
- **Keine 360°-Rendering-Integration** — der bestehende `konfigurator`-Section auf der Startseite bleibt wie er ist oder verlinkt zur neuen `/konfigurator`-Route.

---

## 13. Offene Entscheidungen — Rückfrage an Chris

Die folgenden Punkte habe ich basierend auf der Research vorentschieden. Jede kann durch ein kurzes „Punkt X: Alternative Y" geändert werden:

1. **Step-Count** → Empfehlung: 5 Schritte (Maße&Aufteilung / Öffnungsart / Profil / Konfig / Anfrage). Alternative: 6 mit separiertem „Brand-Filter" als eigener Step. **Gewählt: 5.**
2. **Preis-Label** → Empfehlung: „ab X €" / „Richtpreis" mit Info-Badge. Alternative: „Ihr Preis voraussichtlich". **Gewählt: Richtpreis.**
3. **CTA-Copy** → Empfehlung: „Unverbindliches Angebot anfordern" + Label „Antwort in 48 Stunden". Alternative: „Jetzt Angebot einholen" / „Angebot in 48 h". **Gewählt: Unverbindliches Angebot anfordern.**
4. **State-Lib** → Empfehlung: Zustand + React Query. Alternativen: nur React Context, Jotai, Redux Toolkit. **Gewählt: Zustand + React Query.**
5. **Preview-Tech** → Empfehlung: Client-SVG. Alternative: qlein-Image-Generator proxyen. **Gewählt: Client-SVG.**
6. **Mobile-Pattern** → Empfehlung: Nonmodal Bottom-Sheet (vaul / shadcn Drawer) + Sticky-CTA-Bar. Alternative: Collapsible-Accordion. **Gewählt: Bottom-Sheet.**
7. **Input-Pattern Maße** → Empfehlung: Number-Input + Preset-Buttons. Alternative: Slider + Input. **Gewählt: Number-Input + Presets.**
8. **Best-Badge-Logik** → Empfehlung: günstigstes Profil mit Uw < 0,8. Alternative: günstigstes überhaupt / manuelle Setting pro Brand. **Gewählt: Preis bei Uw < 0,8.**
9. **Sondermaß-Flow** → Empfehlung: Inline-Warning + Switch zu Schritt-5 mit Flag. Alternative: Hartes Blocken. **Gewählt: Warning + Switch.**
10. **Konfig-per-Mail-speichern** → Empfehlung: Mailto-Link mit Deep-Link-URL (ohne Backend). Alternative: eigener Inquiry-Typ, eigenes Feld im DB. **Gewählt: Mailto-Link (MVP).**

Zusätzlich zwei Produktfragen, die aus DB-§4.3 offen sind und auch in die UI durchschlagen:

11. **Streamline 76** behalten / umbenennen / durch greenEvolution 76 Flex ersetzen? *(betrifft Text in Profil-Karten — wenn behalten, müssen wir den höheren Uw-Wert nicht weglügen.)* **Vorschlag:** Behalten, aber UI-Text „Für Sanierungen und einfache Modernisierung" setzen, damit der Uw-Unterschied kontextualisiert ist.
12. **Alu / Holz im Konfigurator** Scope 1c? *(qlein hat diese nicht, Eko-Okna wäre separater Import.)* **Vorschlag:** Raus aus 1c. Stattdessen auf `/katalog` + Lead-Formular-Anker verweisen. Im Profil-Listen-Footer Link „Alu- oder Holz-Fenster gewünscht?" → Step 5 mit vorbelegtem Material-Request.
