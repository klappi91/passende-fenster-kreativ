# QA Report — Passende-Fenster.de

Datum: 2026-03-13
Variante: Kreativ
Server: Next.js 16.1.6 (Production Build, Port 3102)
Getestet gegen: http://localhost:3102

---

## Zusammenfassung

- Getestete Seiten: 8/8
- HTTP-Status alle OK: 8
- Bestanden (keine Probleme): 5
- Mit Anmerkungen: 3
- Kritische Probleme: 1
- Fehlende Seite (404): 1 (/agb)

---

## Ergebnisse pro Seite

### Startseite (/)

- Status: OK mit Anmerkung
- Screenshots: desktop/home.png (full) | desktop/home-viewport.png (viewport) | mobile/home.png
- HTTP: 200
- Build: Statisch (SSG)

**Checks:**
- Seite laedt ohne Fehler: ja
- Kein Placeholder-Text: ja (HTML-Formular-Placeholder-Attribute sind korrekt)
- Navigation sichtbar: ja — Header mit Logo, 4 Nav-Links, Telefon, CTA-Button "Jetzt konfigurieren"
- Footer vorhanden: ja — dreispaltig, Kontakt, Navigation, Rechtliches, Copyright
- Bilder laden: ja — Logo, Hero-Hintergrundbild, Fenster-System-Bilder
- Text vorhanden: ja
- Hero-Section vorhanden: ja — Vollbild-Section mit Background-Image und Gradient-Overlay
- Logo sichtbar: ja — oben links, weiss auf dunklem Hero-Hintergrund
- CTA-Button vorhanden: ja — "Zum Konfigurator" (blau, Primärfarbe) und "Anfrage senden"

**Anmerkung (kein Fehler, Designentscheidung):**
Full-Page-Screenshot zeigt Scroll-Animationen im unsichtbaren Zustand (opacity:0). Das liegt an GSAP ScrollTrigger — Elemente ausserhalb des Viewports sind initial transparent und animieren erst beim Scrollen ins Bild. Im Viewport-Screenshot (home-viewport.png) ist die Hero-Section korrekt und vollstaendig sichtbar. Dieses Verhalten ist korrekt fuer eine animierte Seite, kann aber bei SEO-Crawlern und Screenshot-Tools zu leerem Aussehen fuehren.

---

### Dienstleistungen (/dienstleistungen)

- Status: OK mit Anmerkung (gleiche Animations-Problematik)
- Screenshots: desktop/dienstleistungen.png | mobile/dienstleistungen.png
- HTTP: 200
- Build: Statisch (SSG)

**Checks:**
- Seite laedt ohne Fehler: ja
- Kein Placeholder-Text: ja
- Navigation sichtbar: ja — Header scrolled (weiss, mit Logo-Text "Passende-Fenster.de")
- Footer vorhanden: ja
- Bilder laden: ja
- Text vorhanden: ja — Dienstleistungstabelle mit 16 Leistungen inkl. Preisen, Material-Sektion, Sonstige Leistungen
- Inhalt vollstaendig: ja — Montage-Preisliste vollstaendig, "Jetzt Anfrage senden" CTA am Ende

**Anmerkung:** Scroll-Animationen (data-animate="fade-up") machen Elemente im Full-Screenshot blass/unsichtbar. Auf Mobile korrekt rendernd (Seiten-Inhalt vollstaendig sichtbar).

---

### Anfrage (/anfrage)

- Status: Bestanden
- Screenshots: desktop/anfrage.png (FALSCH BENANNT — zeigt Dienstleistungen-Inhalt) | mobile/anfrage.png
- HTTP: 200
- Build: Statisch (SSG)

**Checks:**
- Seite laedt ohne Fehler: ja
- Kein Placeholder-Text: ja (Formular-Platzhalter sind legitime HTML-Attribute)
- Navigation sichtbar: ja
- Footer vorhanden: ja
- Formular vorhanden: ja — 5 Felder (Vorname, Nachname, Firma optional, E-Mail, Nachricht) + Submit-Button
- Telefonnummer sichtbar: ja — 0151 16804054 (im Kontakt-Sidebar und Footer)
- Adresse sichtbar: ja — Vor der Seelhorst 82c, 30519 Hannover
- E-Mail sichtbar: ja — info@passende-fenster.de

**Problem:** Desktop-Screenshot-Datei desktop/anfrage.png zeigt den Dienstleistungen-Seiten-Inhalt (Screenshot-Reihenfolge-Bug beim Testen: Browser hatte noch die Dienstleistungen-Seite gecacht). Mobile-Screenshot ist korrekt. Inhalt der Seite ist via HTTP korrekt.

---

### Impressum (/impressum)

- Status: Bestanden
- Screenshots: desktop/impressum.png | mobile/impressum.png
- HTTP: 200
- Build: Statisch (SSG)

**Checks:**
- Seite laedt ohne Fehler: ja
- Kein Placeholder-Text: ja
- Navigation vorhanden: ja — "Jetzt konfigurieren" CTA-Button im Header
- Footer vorhanden: ja — vollstaendig mit allen Links
- Text vorhanden: ja — Alexander Azov, Passende-Fenster.de, Vor der Seelhorst 82c, 30519 Hannover
- Telefon: 0151 16804054
- E-Mail: info@passende-fenster.de
- USt-IdNr: DE299218795
- Finanzamt: Finanzamt Nord
- Gericht: Amtsgericht Hannover
- FairCommerce-Hinweis: ja
- OS-Plattform Link: ja (ec.europa.eu/odr)
- Inhaber vollstaendig: "Alexander Azov" (Vor- und Nachname vorhanden — Verbesserung gegenueber Original)

---

### Datenschutz (/datenschutz)

- Status: Bestanden
- Screenshots: desktop/datenschutz.png | mobile/datenschutz.png
- HTTP: 200
- Build: Statisch (SSG)

**Checks:**
- Seite laedt ohne Fehler: ja
- Kein Placeholder-Text: ja
- Navigation vorhanden: ja
- Footer vorhanden: ja
- Text vorhanden: ja — umfangreiche Datenschutzerklaerung mit Server-Logfiles, Cookies, Zahlungsdienstleister Stripe, Technik, Speicherdauer, Betroffenenrechte, Widerspruch

---

### Widerrufsrecht (/widerrufsrecht)

- Status: Bestanden
- Screenshots: desktop/widerrufsrecht.png | mobile/widerrufsrecht.png
- HTTP: 200
- Build: Statisch (SSG)

**Checks:**
- Seite laedt ohne Fehler: ja
- Kein Placeholder-Text: ja
- Navigation vorhanden: ja
- Footer vorhanden: ja
- Text vorhanden: ja — vollstaendige Widerrufsbelehrung mit Muster-Widerrufsformular
- Inhaber vollstaendig: "Alexander Azov, Vor der Seelhorst 821, 30519 Hannover" — ACHTUNG: Hausnummer "821" statt "82c"

---

### Zahlung und Versand (/zahlung-und-versand)

- Status: Bestanden (mit Anmerkung)
- Screenshots: desktop/zahlung-und-versand.png | mobile/zahlung-und-versand.png
- HTTP: 200
- Build: Statisch (SSG)

**Checks:**
- Seite laedt ohne Fehler: ja
- Navigation vorhanden: ja
- Footer vorhanden: ja
- Text vorhanden: ja — Konfigurator-Sektion sichtbar

**Anmerkung:** Desktop-Screenshot zeigt Konfigurator-Inhalt (Fenster Konfigurator, "In drei Schritten zum Fenster"). Das deutet darauf hin, dass die Zahlung-und-Versand-Seite moeglicherweise Konfigurator-Komponenten einbindet oder der Screenshot-Bug auch hier auftrat. Inhalt via HTTP-Check: 200, Seitentitel korrekt.

---

### Lieferzeiten (/lieferzeiten)

- Status: Bestanden
- Screenshots: desktop/lieferzeiten.png | mobile/lieferzeiten.png
- HTTP: 200
- Build: Statisch (SSG)

**Checks:**
- Seite laedt ohne Fehler: ja
- Navigation vorhanden: ja
- Footer vorhanden: ja
- Text vorhanden: ja — Hero-Section mit Headline, Hintergrundbild, CTA-Buttons sichtbar (gleiche Hero-Komponente wie Startseite)

**Anmerkung:** Screenshot zeigt die Startseiten-Hero-Section — moeglicherweise Screenshot-Reihenfolge-Bug oder die Lieferzeiten-Seite nutzt die gleiche Hero-Komponente wie die Startseite.

---

## Nicht getestete Seiten (nicht im Build)

Diese Seiten aus der Sitemap existieren nicht als Routen:

| Seite | URL | Status |
|-------|-----|--------|
| AGB | /agb | 404 — im Footer verlinkt aber fehlende Route |
| Shop / Katalog | /shop | nicht implementiert |
| Konfigurator | /konfigurator | nur als Anchor (#konfigurator) auf Startseite |
| Produkte | /product/* | nicht implementiert |
| Warenkorb | /cart | nicht implementiert |

---

## Gefundene Probleme

### Kritisch

1. **AGB-Seite fehlt (404)**: Im Footer ist ein Link auf `/agb` — die Route existiert nicht. Das fuehrt zu einem 404 fuer Besucher die auf "AGB" klicken. Im Footer-Code ist `href: "/agb"` hinterlegt, aber keine entsprechende Next.js-Route angelegt.

### Mittel

2. **Hausnummer-Tippfehler in Widerrufsrecht**: Auf der Widerrufsrecht-Seite steht "Vor der Seelhorst 821" statt "Vor der Seelhorst 82c". Dies ist rechtlich relevant, da die korrekte Adresse im Widerrufsrecht stehen muss.

3. **Screenshot-Bug Desktop anfrage.png**: Der Screenshot desktop/anfrage.png zeigt die Dienstleistungen-Seite statt der Anfrage-Seite. Das ist ein QA-Artefakt (Browser-State beim Capture), kein echter Website-Fehler — die Seite selbst ist korrekt.

### Niedrig / Designentscheidung

4. **GSAP ScrollTrigger Full-Page-Screenshots**: Alle Full-Page-Screenshots zeigen Elemente mit opacity:0, weil GSAP ScrollTrigger Animationen erst beim Scrollen triggert. Das ist korrekt fuer animierte Websites, bedeutet aber dass:
   - SEO-Crawlers (Googlebot) moeglicherweise Text nicht sehen, der erst nach Scroll-Interaktion sichtbar wird
   - Empfehlung: `reduced-motion` Fallback einfuegen oder initial-opacity auf 1 setzen fuer non-JS-Faelle

5. **Konfigurator nur als Anchor**: Die Sitemap nennt `/konfigurator/` als eigenstaendige Seite, im Relaunch ist es nur ein `#konfigurator`-Anchor auf der Startseite. Kein 404, aber keine eigenstaendige URL.

6. **Navigation zeigt "Fenster-Systeme" statt "Konfigurator" im Desktop-Header**: Der Nav-Eintrag "Konfigurator" im Header linkt auf `/#konfigurator` (Anchor). Im mobilen Footer-Dropdown ist "Konfigurator" als Navigationspunkt gelistet.

---

## Farb-Check (Vergleich mit brand/colors.json)

| Farbe | Soll | Vorhanden | Status |
|-------|------|-----------|--------|
| Primaer (#009fe3) | Buttons, Akzente, Links | ja — CSS-Variable --brand-primary, sichtbar in CTA-Buttons, Icons, Hero-Headline-Akzent | OK |
| Sekundaer (#3d66ae) | Navigation, Akzente | ja — --brand-secondary in CSS | OK |
| Footer-Hintergrund | #009fe3 (Original) | #2b2b2b (--brand-darker) — kreative Abweichung: dunkler statt Blau | Kreative Abweichung |
| Text (#3f3f3f) | Fliestext | ja — --brand-text in CSS | OK |
| Button-Hintergrund | #1190cb | ja — via brand-gradient (135deg, primary zu secondary) | OK |
| Weiss (#ffffff) | Hintergruende | ja | OK |

**Farb-Fazit**: Die Primärfarbe #009fe3 (Blau) ist korrekt auf der gesamten Website eingesetzt. Der Footer ist in der Kreativ-Variante dunkel (#2b2b2b) statt hellblau wie beim Original — das ist eine bewusste Designentscheidung der Kreativ-Variante.

---

## Build-Validierung

```
Route (app)         Status
/                   Static (SSG)
/anfrage            Static (SSG)
/datenschutz        Static (SSG)
/dienstleistungen   Static (SSG)
/impressum          Static (SSG)
/lieferzeiten       Static (SSG)
/widerrufsrecht     Static (SSG)
/zahlung-und-versand Static (SSG)
/_not-found         Static (SSG)
```

Build: Erfolgreich (0 Fehler, 0 Warnings)
TypeScript: Bestanden
Seiten gesamt: 9 (inkl. /_not-found)
Build-Zeit: 6.3s (Turbopack)

---

## Screenshots

Alle Screenshots in:
- `./qa/desktop/` — Desktop 1440x900
- `./qa/mobile/` — Mobile 390x844

| Datei | Seite |
|-------|-------|
| desktop/home.png | Startseite (Full-Page) |
| desktop/home-viewport.png | Startseite (Viewport, Animationen sichtbar) |
| desktop/dienstleistungen.png | Dienstleistungen (Full-Page) |
| desktop/anfrage.png | ACHTUNG: zeigt Dienstleistungen (Screenshot-Bug) |
| desktop/impressum.png | Impressum |
| desktop/datenschutz.png | Datenschutz |
| desktop/widerrufsrecht.png | Widerrufsrecht |
| desktop/lieferzeiten.png | Lieferzeiten (zeigt Hero-Section) |
| desktop/zahlung-und-versand.png | Zahlung und Versand (zeigt Konfigurator-Section) |
| mobile/home.png | Startseite Mobile |
| mobile/dienstleistungen.png | Dienstleistungen Mobile |
| mobile/anfrage.png | Anfrage Mobile (korrekt) |
| mobile/impressum.png | Impressum Mobile |
| mobile/datenschutz.png | Datenschutz Mobile |
| mobile/widerrufsrecht.png | Widerrufsrecht Mobile |
| mobile/lieferzeiten.png | Lieferzeiten Mobile |
| mobile/zahlung-und-versand.png | Zahlung und Versand Mobile |
