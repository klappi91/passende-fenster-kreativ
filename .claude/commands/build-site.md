# Website bauen — Variante Kreativ

Baue eine komplette Website fuer das Unternehmen.
Stil: Mutig, auffaellig, Wow-Effekt. Darf polarisieren.

## Daten
- Content, Bilder, Brand: `../scraped-data/`
- Design-Richtung: `./specs/design.md`
- Analyse: `../scraped-data/analysis.md`

Lies zuerst alle Datenquellen bevor du anfaengst.

## Vorgaben
- Texte und Seitenstruktur 1:1 aus scraped-data uebernehmen
- Bilder uebernehmen, Hero-Bild neu generieren (Gemini-Skill)
- Unternehmensfarben aus brand/colors.json
- Logo einbinden aus brand/
- Impressum und Datenschutz 1:1 uebernehmen
- Mobile-first: Alle Komponenten zuerst fuer 390px bauen, dann Desktop
- Hamburger-Menu fuer Mobile Navigation
- Touch-Targets mindestens 44x44px
- Bilder responsive mit sizes und srcSet
- Keine horizontalen Scrollbalken auf Mobile

## Stack
Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, GSAP

## Skills nutzen
- frontend-design Plugin fuer Design-Qualitaet
- web-design-guidelines fuer Accessibility und UX
- vercel-react-best-practices fuer Performance
- gsap-scrolltrigger fuer Scroll-Animationen und Parallax
- animation-designer fuer Motion Design
- ui-styling fuer shadcn Komponenten (stark angepasst)
- motion-framer fuer Micro-Interactions und Hover
- gemini-image fuer Hero-Bild Generierung

## Design-Regeln
- Asymmetrische Layouts, gebrochenes Grid
- Volle Breite nutzen, edge-to-edge Sektionen
- Sehr grosse Headlines (clamp, 4-8rem)
- Display-Font fuer Headlines erlaubt
- Grosse farbige Flaechen, dunkle Sektionen
- GSAP ScrollTrigger fuer Scroll-Effekte
- Parallax auf Bildern und Sektionen
- Staggered Reveals, Slide-Ins
- Hero mit starker Eingangs-Animation
- shadcn/ui stark angepasst, eigener Look
- Bilder mit Clip-Paths oder Masken

## Am Ende
1. `npm run build` muss durchlaufen
2. `git add -A && git commit -m "Build complete"`

Nutze Agent-Teams fuer parallele Arbeit. Entscheide selbst
welche Agents du brauchst und in welcher Reihenfolge.
