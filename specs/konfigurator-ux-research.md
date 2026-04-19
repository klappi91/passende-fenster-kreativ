# UX-Recherche: Fenster-Konfigurator + Ausmess-Guide
_Recherche-Datum: 2026-04-19_
_Recherche-Methode: Brave Search + Firecrawl/WebFetch, 5 Seiten mit Konfigurator und/oder Ausmess-Tutorial gescrapt_

---

## Zusammenfassung (TL;DR für uns)

**Was die meisten anderen machen:**
- **Konfigurator als "lineare Wizard-Kolonne" mit Live-Sidebar-Preview**: Fast alle (fensterversand, fensterhandel, deutscher-fenstershop) benutzen einen nummerierten Step-Flow (1. Profil → 2. Verglasung → 3. Farbe → 4. Typ → 5. Öffnungsart → 6. Maße → 7-n. Ausstattung), wobei links/oben eine Live-Skizze und der laufende Preis eingeblendet ist. Preview ist sofort sichtbar – noch vor der Maßeingabe – als GIF/SVG-Schema.
- **Reihenfolge: Profil zuerst, Maße mittendrin/spät.** Nur die deutsche Ausnahme ist fensterhandel: Profil → Verglasung → Farbe → Typ → Aufteilung → Öffnung → Maße. fensterversand macht es ähnlich: Material → Profil → Farbe → Typ → Öffnungsart → Größe. **Maße kommen fast nie zuerst** – das ist kontraintuitiv zu unserem naheliegenden Ansatz.
- **Preis ist live und transparent.** Alle zeigen "Ihr Preis" als EUR-Betrag in einer fixen Sidebar, der sich mit jedem Klick aktualisiert. Formulierung meist "ab X €" auf Landing, "Preis: 184,28 €" oder "Nur 165,86 €" im Konfigurator (fensterhandel). Rabatte werden prominent gezeigt (–15%, Mengenstaffel).
- **CTA ist entweder Warenkorb (Shop-Modell) oder "Angebot anfordern" (Lead-Modell).** fensterversand / fensterhandel / deutscher-fenstershop / fensterblick: Warenkorb + Kauf auf Rechnung. Neuffer: "Kostenloses Angebot innerhalb 48h" → klassischer Lead-Funnel. Das zeigt: **beide Modelle sind etabliert** – je nach Positionierung (Direktvertrieb vs. Beratung+Montage).
- **Ausmess-Tutorials sind überall als eigene, SEO-starke Content-Page.** Alle fünf haben `/fenster-ausmessen.*` oder `/fenster-richtig-messen/` als Single-Page-Guide mit H1 "Fenster ausmessen", Schritt-für-Schritt-Anleitung + Bildern + Abzugswerten. fensterversand + Neuffer haben zusätzlich PDF-Download (Aufmaßhilfe). Nur fensterversand und Neuffer verlinken es sichtbar aus dem Konfigurator heraus.

**Wo wir differenzieren können:**
- **Ausmess-Guide als interaktiver Mini-Assistent im Konfigurator** (statt externer Text-Seite). Kein Konkurrent hat das: Alle verlinken nur auf eine statische Anleitungsseite. Ein Modal/Drawer, der je nach Altbau/Neubau/Rollladen-Szenario die richtigen Abzugswerte vorschlägt und diese direkt ins Maß-Feld einträgt ("Rohbaumaß 1260 → Bestellmaß 1240"), wäre neu.
- **Öffnungsart-Preview visualisiert je Flügel.** fensterhandel zeigt nur 3 Öffnungsarten-Icons pauschal, fensterversand hat die Öffnungsart je Flügel aber kein Live-Schema. Unsere Spec (§7) hat 13 Aufteilungsvarianten × 6 Öffnungsarten pro Flügel – wenn wir das sauber als Schema rendern, sind wir visueller als alle.
- **Fehlkonfigurations-Prevention durch Live-Machbarkeits-Check.** fensterhandel schreibt nur warnend "Wir prüfen jedes Element auf technische Machbarkeit" nach dem Absenden. Wir können Min-/Max-Maße pro Profil clientseitig direkt beim Eintippen validieren.

**Klare Empfehlung für unseren Flow:**

Wizard mit 6 sichtbaren Schritten, linear aber mit "Zurück"-Sprung möglich, Live-Preview + Preis-Sidebar ab Schritt 2, Ausmess-Assistent als eingebettetes Modal an Schritt "Maße". Reihenfolge: **1. Maße + Aufteilung (gekoppelt, mit Ausmess-Assistent) → 2. Öffnungsart je Flügel → 3. Hersteller-Filter (optional) → 4. Profil-Liste mit Preisen → 5. Farbe/Verglasung/Rollladen → 6. Angebot anfordern.** Das weicht bewusst von der Branche ab, weil unser Produkt (Profil-Katalog mit Preis-Ranking) den Maß-Flow zwingend VORNE braucht – wir verkaufen nicht "ein Fenster nach Rezept", sondern "das passende Profil für dein Maß".

---

## Seite 1 — fensterversand.com

**URLs:**
- Konfigurator-Landing: `https://www.fensterversand.com/produkt-konfigurator.php`
- Konfigurator-Anleitung/SEO-Hub: `https://www.fensterversand.com/info/anleitungen/fensterkonfigurator.php`
- Ausmess-Tutorial: `https://www.fensterversand.com/info/anleitungen/fenster/ausmessen.php`

### Konfigurator-UX
- **Flow-Typ:** Wizard in sichtbaren Schritten 1-14 (Material → Profil → Dekore/Farben → Fenstertyp/Öffnungsart → Größe → Verglasung → Sprossen → Beschläge → Befestigungslöcher → Fensterbank → Rollladen → Insektenschutz → Rahmenverbreiterungen → Bestellung prüfen).
- **Reihenfolge:** Material zuerst, dann Profil, Maße erst an Position 5 von 14.
- **Preview:** Schema-Bild (2D-Zeichnung) sichtbar ab Schritt "Fenstertyp". Farben werden an einer Referenz-Fensterabbildung sichtbar. Kein echter Realbild-Renderer, sondern Schema-Grafik.
- **Preis-Anzeige:** Landingpage "ab 29 €" für Kunststoff, "ab 84 €" für PVC-Alu usw. (Saisonrabatt –15% auffällig). Im Konfigurator links in Sidebar jederzeit aktuell.
- **Mobile:** Header mit Hamburger, Sidebar wird unter den Konfigurator geklappt (aus HTML-Struktur: Bootstrap-artige Grid-Klassen).
- **CTA:** "In den Warenkorb" (E-Commerce). Lieferung versandkostenfrei ab 1.000 €.

### Ausmess-Tutorial
- **Ort:** Eigene SEO-Seite `/info/anleitungen/fenster/ausmessen.php` plus zusätzlicher Inline-Hinweis im Konfigurator ("unterhalb der Größenangaben"). Auch PDF-Download: `aufmassblatt-fensterversand.pdf`.
- **Inhalte:**
  - Vorbereitungsarbeiten (Materialliste, Werkzeug)
  - Ausmessen bei Sanierung/Altbau mit exakten Abzügen (Breite -20 mm, Höhe -10 mm, Anschlussprofil 25/40/50 mm)
  - Ausmessen im Neubau mit Maueröffnung-Abzug (2 × 20 mm)
  - Konkrete Rechenbeispiele ("1260 mm − 20 mm = 1240 mm Bestellmaß")
  - Zwei YouTube-Videos (2:08 Altbau, 1:17 Neubau) eingebettet
- **Page-Title:** "Fenster ausmessen » Anleitung Fenster richtig messen"
- **H1:** "Fenster ausmessen"
- **Verlinkung aus Konfigurator:** Ja, Inline-Hinweis unterhalb des Maß-Eingabefelds.
- **Visualisierung:** Klassische 2D-Illustrationen (PNG) von Person mit Metermaß, zusätzlich Videos und PDF.

### SEO-Pattern
- **H1:** "Fenster ausmessen" (kurz, Keyword-exakt).
- **H2-Struktur:** "Vorbereitungsarbeiten" / "Ausmessen von Fenstern bei der Sanierung" / "Ausmessen von Fenstern in Neubauten".
- **Content-Länge:** ~2000 Wörter. TYPO3-CMS.
- **Interne Links:** zu Fenster ausbauen, einbauen, einputzen, einstellen → dichtes Themen-Cluster.
- **Breadcrumbs:** Home > Info > Anleitungen > Fenster > Ausmessen.
- **FAQ-Abschnitt:** Nein separat, aber Rechenbeispiele als Infoboxen.
- **Schema-Markup:** Instruction / HowTo (vermutlich – basierend auf `page-type: Instruction` Meta-Tag).

---

## Seite 2 — neuffer.de

**URLs:**
- Fenster-Übersicht (Konfigurator-Einstieg): `https://www.neuffer.de/fenster.php`
- Ausmess-Hub: `https://www.neuffer.de/mess-anleitungen.php`
- Fenster-Tutorial: `https://www.neuffer.de/fenster-ausmessen.php`
- Aufmaß-PDF: `https://www.neuffer.de/sites/de/files/downloads/pdf/aufmasshilfe-fenster.pdf`

### Konfigurator-UX
- **Flow-Typ:** Schritt-für-Schritt Konfigurator (öffnet sich aus Fenster-Produktseite). Nicht vollständig scrapebar ohne JS-Render.
- **Reihenfolge:** Material → Profil → Ausstattung. Maße werden eingegeben, aber der Haupt-CTA ist nicht "Warenkorb" sondern **"Angebot anfordern" → "Kostenloses Angebot innerhalb 48h"**.
- **Preview:** Vorhanden (aus Spec-Erwähnung "Online-Konfigurator" und Produkt-Teaser-Bildern), vermutlich Schema-basiert.
- **Preis-Anzeige:** Im Konfigurator sichtbar ("Fenster-Preise" als eigene Seite). Positionierung eher "Ihr individueller Preis" / Richtpreis als Festpreis.
- **CTA:** **Lead-Funnel** (Kontaktformular, 48h-Angebot-Versprechen). Fertigung ab Stuttgart.

### Ausmess-Tutorial
- **Ort:** Hub-Seite `/mess-anleitungen.php` mit 5 Sub-Seiten (Fenster, Terrassentür, Haustür, Rollladen, Fensterbank). Zusätzlich PDF `aufmasshilfe-fenster.pdf`.
- **Inhalte:**
  - Skizzen anfertigen mit Öffnungsrichtung (Dreieck-Konvention Spitze = Griff/Richtung)
  - Breite messen: Laibung oben/unten, kleiner Wert, minus Einbauluft (sehr strukturierte Tabelle!)
  - Höhe messen: gleiche Logik
  - **Besonderheit: Einbauluft-Tabelle nach Fenstergröße UND Farbe differenziert** (Weiß: 10/15/20 mm, farbig: 15/20/25 mm – wegen thermischer Ausdehnung).
- **Page-Title:** "Fenster ausmessen » Aufmaß korrekt bestimmen"
- **H1:** "Fenster ausmessen"
- **Verlinkung aus Konfigurator:** Ja (Aufmaßhilfe als PDF-Download), zusätzlich eigener Navigationspunkt "Aufmaß nehmen".
- **Visualisierung:** Eigene Zeichnungen (Grundriss-Skizzen) für Breite/Höhe/Öffnungsrichtung, PDF für Zusatzfälle mit Ober-/Unterlicht.

### SEO-Pattern
- **H1:** "Fenster ausmessen"
- **H2:** "Aufmaß korrekt bestimmen im Altbau und Neubau" + Schritt-Überschriften
- **Breadcrumbs:** Startseite > Anleitung zum Fenster ausmessen (flach)
- **Hub-Seite mit 5 Anleitungen:** Fenster/Terrassentür/Haustür/Rollladen/Fensterbank – sehr sauberes Themen-Cluster.
- **Schema:** Hat Rating-Widget ("3 Bewertungen, Ø 4.93" / "5 Bewertungen, Ø 4.84") – AggregateRating Schema.
- **Content-Länge:** Kompakter als fensterversand (~800 Wörter), dafür mit Tabelle.

---

## Seite 3 — fensterhandel.de

**URLs:**
- Konfigurator: `https://www.fensterhandel.de/fensterkonfigurator/`
- Ausmess-Tutorial: `https://www.fensterhandel.de/fenster-richtig-messen/`

### Konfigurator-UX
- **Flow-Typ:** Single-Page-Wizard mit 8 nummerierten Schritten auf einer Seite (scrollbar).
- **Reihenfolge:**
  1. Profil (NovoLife 76 / 76+ / 88 Premium – nur Kömmerling-Profile!)
  2. Verglasung (2-/3-fach, Uw/Ug-Werte sichtbar)
  3. Farben und Dekore (filterbar: Oberfläche/Farbe/Lieferzeit)
  4. Fenstertyp (Fenster/Balkontüre/Schiebeelement)
  5. Ober/-Unterlichte (Ohne/Ober/Unter)
  6. Aufteilung (Einteilig/Zweiteilig/Dreiteilig/Vierteilig)
  7. Öffnungsrichtung (Icons: LDK/RDK/fest, Info "viele weitere Varianten – sprechen Sie uns an")
  8. Maße und Rahmenverbreiterungen (Breite/Höhe in mm, Fensterbankleiste ja/nein, Rahmenverbreiterung oben/unten/links/rechts 0/15/30/60/120 mm)
- **Preview:** Live-SVG/GIF-Schema der Innenansicht dauerhaft oben rechts in Sidebar. Änderungen sofort sichtbar.
- **Preis-Anzeige:** Fett prominent, Listenpreis durchgestrichen, Aktionspreis hervorgehoben ("184,28 € → Nur 165,86 €"). Mengenrabatt-Tabelle (3%-10% je nach Bestellwert) oben eingeblendet.
- **Mobile:** Konfigurator lädt mit "Seite wird geladen" Spinner, responsive.
- **CTA:** "Zu Schritt 2" (zweite Seite dann für Lieferadresse und Warenkorb), Kauf auf Rechnung beworben.

### Ausmess-Tutorial
- **Ort:** Eigene Seite `/fenster-richtig-messen/`
- **Inhalte:**
  - **Unterscheidung Altbau vs. Neubau** (eigene Sektionen)
  - Altbau: Innen-/Außenanschlag erklärt, Fensterbreite je nach Anschlag-Typ, Fensterhöhe, Umgang mit Rollladenkasten
  - Neubau: lichte Höhe/Breite, 3 × Messen + kleinsten Wert, 30 mm Montageluft abziehen
  - **Fensterbank-Hinweis:** "+30 mm Montageluft wegen Fensterbankanschlussprofil"
  - Hinweis auf Öffnungsrichtung
  - Aufmaß-Service: "Wir stellen Kontakt zu Fachmann her" (Upsell)
- **Page-Title:** "So messen Sie richtig - holen Sie sich Ihren Fensterpreis"
- **H1:** "Fenster ausmessen - so geht es richtig"
- **Verlinkung aus Konfigurator:** Nicht direkt im Flow verlinkt (muss über Info-Center gefunden werden).
- **Visualisierung:** Hero-Bild Maßband, dann Realfotos (Mann mit Maßband, Fensterbank).

### SEO-Pattern
- **H1:** "Fenster ausmessen - so geht es richtig"
- **H2:** "Hinweise zum Thema Fenster richtig ausmessen" / "Altbau" / "Neubau"
- **Meta-Description:** "Fenster richtig messen ✅ Fenster Made in Germany ✅ Kauf auf Rechnung ✅ Versandkostenfrei ✅ Jetzt hier berechnen"
- **Content-Länge:** ~900 Wörter
- **Interner Link:** zu "So können Sie ein Fenster einbauen" am Ende.
- **Breadcrumbs:** Nicht prominent sichtbar.

---

## Seite 4 — deutscher-fenstershop.de (ItsLine)

**URL:**
- Konfigurator: `https://deutscher-fenstershop.de/konfigurator/fenster`

### Konfigurator-UX
- **Flow-Typ:** **Single-Page mit Tab/Button-Navigation** oben (9 Icon-Kacheln: Material / Hersteller & Profile / Fenstertyp / Maße & Öffnungsart / Farbe / Verglasung / Sprossen / Beschläge & Zubehör / Rollladen & Raffstore / Fensterbänke). Man kann frei zwischen Schritten springen.
- **Reihenfolge (empfohlen):**
  1. Material (7 Materialoptionen inkl. Brandschutz + Englische Vertikalschiebefenster)
  2. Hersteller & Profile (**sehr großer Katalog**: Aluplast, Drutex, Gealan, Copal, Schüco, Veka, Salamander, Euroline – mit spezifischen Profilen je Material)
  3. Fensterform
  4. Maße + Öffnungsart (Breite/Höhe mm, Dropdown ODER manuell. Aufteilung pro Flügel, Rahmenverbreiterungen)
  5. Farbe (Innen/Außen getrennt, Kernfarbe bei Kunststoff, Dichtungsfarbe)
  6. Verglasung (2-/3-fach, warme Kante, Glaseigenschaften: Schall, SZ-KA Kapillare etc.)
  7. Sprossen
  8. Beschläge/Zubehör (RC1N/RC2N/verdeckt)
  9. Rollladen, Fensterbänke
- **Preview:** Sidebar links mit Live-Konfigurations-Summary (Hersteller/Material/Profil/Typ/Öffnungsart/Farben/Dichtungsfarbe/Verglasung/Randverbund/Entwässerung/Stahlverstärkung). Hat sogar Gewichts-Berechnung.
- **Preis-Anzeige:** "51.28 € / 43.59 € (–15% bis 30.04.2026)" prominent. "inkl. MwSt. zzgl. Versand".
- **CTA:** "In den Warenkorb" + Option "Warenkorb per E-Mail senden und speichern" (Lead-Sicherung) + "Angebot anfordern" (Lead-Fallback wenn Sondermaß/Sonderkonfig nicht online möglich).
- **Besonderheit:** **Fallback zu Lead-Formular**, wenn Konfiguration außerhalb Standard: "Da die eingegebene Größe oder Konfiguration nicht den Standardwerten entspricht, ist Online-Konfiguration leider nicht möglich. Gerne erstellen wir Ihnen jedoch individuell ein unverbindliches Angebot."

### Ausmess-Tutorial
- **Im Konfigurator selbst:** Zusätzliche Erklärungen inline ("BLR", "Pfosten & Kämpfer", "Stulp anstelle eines Pfostens", "DK/D/FF Abkürzungen").
- **Separate Ausmess-Seite:** `https://deutscher-fenstershop.de/fenster-selbst-ausmessen`
- Konfigurator enthält sehr lange Erklär-Prosa ("Fensterkonfigurator Verzeichnis" mit 9 Anker-Sprüngen → SEO-Keyword-Loading in Fließtext, "fenster kaufen" 80+ mal wiederholt → KeywordStuffing-Signal).

### SEO-Pattern
- **H1:** "Fenster konfigurieren und kaufen"
- **Starkes Keyword-Stuffing** im Fließtext (–Achtung: sollten wir NICHT kopieren, wirkt alt/grau).
- **Starke interne Verlinkung** zu 12 anderen Konfiguratoren (Balkontür, PSK, HST, Haustür, Rollladen, Raffstore, Insektenschutz, Sektionaltor, Glas, Zubehör).
- **"Fensterkonfigurator Verzeichnis"** mit 9 Anker-Jumps als TOC – gut für Deep-Linking.
- **Content-Länge:** SEHR lang (~5000+ Wörter inkl. Erklärungs-Prosa im Konfigurator).

---

## Seite 5 — fensterblick.de

**URLs:**
- Ausmess-Tutorial: `https://www.fensterblick.de/fenster-ausmessen.html`
- (Konfigurator nicht einzeln gescrapt – ist ähnlich strukturiert, Produkte über Kömmerling)

### Ausmess-Tutorial (Fokus der Recherche)
- **Inhalte (am strukturiertesten der 5):**
  1. Skizze erstellen (Fenstergriff-Position, Öffnungsrichtung notieren)
  2. Fensterinnenmaß ausmessen (mind. 2 Messpunkte, kleinster Wert, Einbauluft abziehen)
  3. Fensterhöhe bestimmen (analog)
  4. **Fensterbankversatz und Fensterbankanschlussprofil** (Differenzmessung, Wahl 10/30/50 mm Profil)
  5. **Aufsatzrollladen integrieren** (Gesamtmaß = Fensterbank + Rollladen + Rahmenverbreiterung – sehr gute, oft vergessene Info)
  - **Tabelle: Minimumspalt-Maße nach Länge des Elements** (visuelle Tabelle für > 1,5 m)
  - **Glossar** zu: Aufmaß / Gesamtmaß / Fenstermaß / Fenster mit Rollladenkasten / Einbauluft / Öffnungsrichtung (6 Begriffe klar definiert → exzellent für SEO-Snippets und Verständnis)
  - "Tipps zum Fensterausmessen" (4 Kurz-Tipps als Merksätze)
- **Page-Title:** "Fenster ausmessen - Wie nehme ich das Aufmaß beim Fenster? - fensterblick.de"
- **H1:** "Ratgeber: Fenster Aufmaß – richtig Maß nehmen"
- **Breadcrumb:** fensterblick.de > Services > Anleitungen zu Fenster und Türen > Fenster ausmessen
- **Visualisierung:** Hochauflösende eigene Bilder mit Zoom-Modal (380px Thumbnail → 1520px Lightbox) für jeden Schritt.
- **Content-Länge:** Mittel (~1500 Wörter) aber sehr dicht.

### SEO-Pattern
- **Die klarste Glossar-Struktur** der 5. Sollten wir 1:1 als Inspiration für unseren Guide nehmen.
- Interne Links zu "Fenster Ausbau" und "Fenster Einbau" → Themen-Cluster Montage.

---

## Gemeinsamer Take-Away — Ausmess-Tutorial

### 5-8 Kern-Inhalte die drin sein müssen

1. **Altbau vs. Neubau unterscheiden** (alle 5 Anbieter haben das – unumgängliches Muster)
2. **Skizze anfertigen mit Öffnungsrichtung & Griff-Position** (Dreieck-Konvention: Spitze = Griff) – Neuffer und fensterblick machen das explizit.
3. **Mindestens 2 Messpunkte pro Dimension, kleinster Wert gewinnt** (alle 5 sagen das, oft zusätzlich "oberes/unteres Drittel" oder "linkes/rechtes Drittel")
4. **Einbauluft / Montagespalt abziehen** mit **Tabelle** nach Elementgröße (und optional Farbe thermisch bei Neuffer). Richtwerte-Spanne: 10–30 mm pro Seite, sehr hersteller-abhängig. **Kritisch: Wir müssen die Werte unserer Profile kennen.**
5. **Fensterbankanschlussprofil** als Sonderthema (10/25/30/40/50 mm Standard-Profile, bei Altbau oft Höhenversatz auszugleichen). fensterblick und fensterversand beschreiben das sehr gut.
6. **Rollladen-Integration** (Aufsatz vs. Vorbau, Gesamtmaß = Fenster + Rollladen + Rahmenverbreiterung). Nur fensterblick macht das sauber.
7. **Glossar der 6 Grundbegriffe** (Aufmaß, Gesamtmaß, Fenstermaß, Rohbaumaß, Bestellmaß, Einbauluft) → unverzichtbar für SEO-Snippets und Nutzer-Verständnis.
8. **Blick-Perspektive festhalten**: "Aus Sicht der Person, die von Innen nach Außen blickt" – alle Hersteller betonen das als Kardinalregel bei Öffnungsrichtung.

### Empfohlene URL/Title für SEO
- **URL:** `/fenster-ausmessen/` oder `/ratgeber/fenster-ausmessen/` (vermeiden: `.php` Endungen, gebunden an CMS)
- **Page-Title:** `Fenster ausmessen — Schritt-für-Schritt-Anleitung für Altbau & Neubau`
- **Meta-Description:** ~155 Zeichen, enthält: "Fenster ausmessen ✓ Altbau und Neubau ✓ Rohbaumaß ➜ Bestellmaß ✓ Einbauluft-Tabelle ✓ kostenlose Aufmaßhilfe-PDF"
- **H1:** `Fenster ausmessen — so bestimmen Sie das korrekte Bestellmaß`
- **H2-Struktur:**
  - "Vorbereitung: Skizze und Werkzeug"
  - "Fenster ausmessen im Altbau"
  - "Fenster ausmessen im Neubau"
  - "Rohbaumaß vs. Bestellmaß — was ist der Unterschied?"
  - "Einbauluft: Richtwerte-Tabelle nach Elementgröße"
  - "Sonderfall Rollladen und Fensterbank"
  - "Begriffe im Glossar"

### Empfohlene interne Verlinkung
- **Ausmess-Seite ⇆ Konfigurator (Maß-Schritt):** Bidirektional. Im Konfigurator unter Maß-Feld: "Unsicher beim Ausmessen? → Ausmess-Guide öffnen". Im Guide am Ende: "Bereit? → Maße jetzt im Konfigurator eingeben".
- **Ausmess-Seite → Produktseiten:** Kreuz-Link auf jede Profil-Detailseite ("Maße für dieses Profil korrekt ermitteln").
- **Themen-Cluster:** Fenster ausmessen → Fenster ausbauen → Fenster einbauen → Fenster einstellen (wie fensterversand). Das ist 4x Longtail + Topical-Authority.
- **Schema.org:** `HowTo` oder `Article` mit Steps-Array. fensterversand nutzt `page-type: Instruction` Meta-Tag.

### Empfohlene Visualisierungs-Art
- **Illustration > Realfoto > Video** (in der Reihenfolge ROI-effizient).
  - **Primär Illustrationen**: Vektor-Zeichnungen (SVG) für jeden Schritt. Klar, wiederverwendbar, schnell ladend, skalierbar. Neuffer macht das so.
  - **PDF-Download** zum Ausdrucken mit Feldern zum Eintragen (Aufmaßhilfe). fensterversand und Neuffer haben beide eins – ist SEO-Signal und Lead-Magnet. Kosten: 1 Tag Design.
  - **Video optional**: Nur wenn Budget vorhanden. fensterversand hat 2 YouTube-Videos (je ~1-2 min). Ohne Budget weglassen – die Konkurrenz differenziert sich auch nicht stark dort.
  - **Interaktive Elemente** (unser Differenzierer): Mini-Rechner auf der Ausmess-Seite ("Geben Sie Ihr Rohbaumaß ein → wir zeigen das Bestellmaß"). Kein Konkurrent hat das.

---

## Gemeinsamer Take-Away — Konfigurator-Flow

### Wizard oder Single-Page? Warum?

**Empfehlung: Hybrid "Stepped Single-Page" mit prominenten Schritten, aber scroll-basiert, und nicht-linear springbar.**

- **Echter mehrseitiger Wizard** (Schritt 1 → Klick → Schritt 2 → Klick): **nicht mehr Stand der Technik**. Bricht Flow, erzeugt Abbruch-Risiko bei jedem Klick, und verschleiert Gesamt-Umfang.
- **Reine Single-Page** mit allen Optionen auf einmal: überfordert Nutzer (deutscher-fenstershop hat das und wirkt überladen).
- **Stepped Single-Page** (fensterhandel, deutscher-fenstershop): Alle Schritte auf einer Route, aber visuell als nummerierte Karten/Accordions. Der Nutzer scrollt linear durch, kann aber springen. Live-Sidebar mit Preview + Preis immer sichtbar.

**Konkrete Umsetzung:**
- Schritte als **Sticky-Progress-Bar oben** (1/6, 2/6 …) UND gleichzeitig als Anchor-Links in Sidebar.
- **Responsive**: Desktop = 2-Spalten (links Schritte, rechts Sticky-Preview), Mobile = 1-Spalte mit Preview als Floating-Bottom-Sheet.

### Kritische Dos und Don'ts

**DOs:**
- Live-Preview-Schema ab Schritt 1 rendern, selbst wenn Default-Werte (leeres Fenster > gar nichts).
- Preis immer sichtbar, auch "ab X €" wenn noch nicht alle Parameter gewählt. **Nutzer wollen Preis-Orientierung früh.**
- Maß-Eingabe mit direkter Plausibilitäts-Prüfung (Min/Max pro gewähltem Profil + Flügelanzahl). fensterhandel schreibt's hinterher rein – das ist zu spät.
- Mengenrabatt und Aktionen sichtbar, aber nicht blinkend. Rabatt-Staffel als kompakte Tabelle.
- **"Angebot anfordern"-Fallback** immer präsent (deutscher-fenstershop macht das vorbildlich) – wenn Konfig aus Standard fällt oder Nutzer unsicher ist.
- Warenkorb-Preview per E-Mail senden (Lead-Magnet, Neuffer + deutscher-fenstershop machen das).
- Ausmess-Guide **aus Maß-Schritt** verlinken, idealerweise als Modal-Drawer, der State teilt (eingegebenes Rohbaumaß wird übernommen in Bestellmaß).

**DON'Ts:**
- Keine reinen Icon-Navigation ohne Text-Label (fensterhandel macht das bei Öffnungsart — unverständlich ohne Legende).
- Keine Keyword-Stuffing-Texte à la deutscher-fenstershop (SEO-Effekt fragwürdig, UX-Effekt negativ).
- Nicht mit "Dreh-Kipp-Rechts von Innen gesehen" kommunizieren ohne zeitgleiche Illustration — Nutzer verwechseln Perspektiven.
- **Nicht Profil zuerst fragen wenn unser USP Preis-Vergleich ist.** Wenn wir sagen "hier sind 12 passende Profile zu deinem Maß mit Preis-Ranking", müssen Maß & Aufteilung vorne stehen. Alle Wettbewerber fragen Profil zuerst weil sie ein Profil pro Konfig verkaufen — wir nicht.
- Keinen Warenkorb ohne Anmeldung komplett verstecken — mind. "per E-Mail speichern" anbieten.

### Mobile-spezifische Hinweise
- Live-Preview **muss auf Mobile oberhalb der Eingabefelder sticky kleben** (oder als Floating-Sheet), sonst ist der Preview-Nutzen weg.
- Maß-Eingabe per `inputmode="numeric"` und keyboard-optimiert (mm-Eingabe).
- Farb-Swatches nicht als winzige Thumbnails — mind. 44×44 px Touch-Target.
- Öffnungsart-Auswahl: große Icons mit Text-Label, niemals nur Icon.
- Progress-Bar **sticky top** (nicht innen Footer), sonst scrollt der Nutzer ins Dunkel.
- "In den Warenkorb"/"Angebot anfordern" als sticky-bottom-CTA, damit auch nach 3 Screens Scroll erreichbar.

### Empfehlung Reihenfolge unserer Schritte (weicht bewusst von Branche ab)

1. **Maße + Fenstertyp (Aufteilung/Oberlicht)** — gekoppelt, mit Ausmess-Assistent als Drawer
2. **Öffnungsart pro Flügel** — Schema-basierte Auswahl
3. **Hersteller-Filter (optional)** — Checkboxen Salamander/Aluplast/Gealan
4. **Profil-Liste mit Preisen** — die Kern-Output-Ansicht; hier wählt der Nutzer sein Profil
5. **Farbe + Verglasung + Rollladen + Schallschutz etc.** — Profil-spezifische Konfigurator-Optionen
6. **Angebot anfordern** — Formular mit Zusammenfassung, PDF-Export, E-Mail-Versand

Der Schritt 4 ist unser **USP-Moment**: "Hier sind 8 Profile die passen, sortierbar nach Preis / U-Wert / Lieferzeit". Branche zeigt immer nur EIN Profil gleichzeitig — wir zeigen die ganze Auswahl.

---

## Quellen-Liste

| # | Seite | Konfigurator-URL | Ausmess-URL |
|---|-------|------------------|-------------|
| 1 | fensterversand.com | `/produkt-konfigurator.php` + `/info/anleitungen/fensterkonfigurator.php` | `/info/anleitungen/fenster/ausmessen.php` |
| 2 | neuffer.de | `/fenster.php` (Lead-Funnel) | `/fenster-ausmessen.php` + `/mess-anleitungen.php` |
| 3 | fensterhandel.de | `/fensterkonfigurator/` | `/fenster-richtig-messen/` |
| 4 | deutscher-fenstershop.de | `/konfigurator/fenster` | `/fenster-selbst-ausmessen` |
| 5 | fensterblick.de | (Kömmerling-Shop) | `/fenster-ausmessen.html` |

PDFs: `fensterversand.com/fileadmin/pdf/aufmassblatt-fensterversand.pdf`, `neuffer.de/sites/de/files/downloads/pdf/aufmasshilfe-fenster.pdf`.
