# Passende-fenster — Website Relaunch

Variante: Kreativ | Daten aus Crawl

## Datenquellen
- Unternehmens-Daten: `../scraped-data/`
- Build-Specs: `./specs/`

## Design Context

> Vollversion in `.impeccable.md`. Kurzfassung hier — gilt für alle Aufgaben in dieser Codebase (Code, Copy, UX).

### Users
Mischung aus **Privat-Sanierern** (Hauptlast, Vertrauensaufbau abends/Wochenende), **Bauherren** im Neubau (Beratungsgefühl, Maß-Sicherheit) und **Profi-Verarbeitern** (Effizienz, kennen Profil-Marken). Job: 4–12 Fenster transparent konfigurieren, fairer Preis, vertrauenswürdiger Anbieter.

### Brand Personality
**modern · technisch · selbstbewusst.** Knappe faktische Aussagen, Spezifikationen vor Marketing-Sprech. Emotion: *Vertrauen durch Klarheit.* Industrie-Premium statt Luxus-Premium.

### Aesthetic Direction
- **Referenz**: Schüco / Internorm — Architektur-Fotografie, ruhige Hierarchie, deutsche Engineering-Sprache.
- **Anti**: bunte SaaS-Landings, verspielte Illus, Marketing-Hyperbel.
- **Theme**: hell. Dark-Mode nicht gesetzt — `@custom-variant dark` und `dark:`-Utilities entfernen, bis ein echtes Dark-Theme designed ist. `--surface-deep` bleibt als gezielter Sektion-Akzent.

### Constraints
- **Brand-Blau `#009fe3`** ist gesetzt; Sekundär `#3d66ae` und Akzent `#15779b` aktiv mitspielen lassen statt monochrom auf Cyan.
- **WCAG AA** ist Pflicht (BFSG). Touch-Targets ≥ 44 px, Form-A11y, `<main>` + Skip-Link, Reduced-Motion.

### Design Principles
1. **Fakten vor Effekt.** Wenn ein Element ohne Glass/Gradient/Animation klarer wäre, fliegt der Effekt.
2. **Mullion ist die Markensignatur.** `.mullion-cross` ausbauen — andere Glass-Spielereien (`.glass-shine`, `.glass-edge-light`) reduzieren.
3. **Cyan hat Ruhe verdient.** 60-30-10: brand-getönte Neutrale tragen 60-30, Cyan ist die 10 %.
4. **Editorial-Hierarchie statt Card-Salat.** Asymmetrische Grids, italic emphasis, nummerierte Labels — Magazin-DNA ausbauen, identische Card-Reihen abbauen.
5. **Touch-First-Premium.** Premium auf 6-Zoll-Display ist der Maßstab — keine "auf Desktop wechseln"-Hints.
