# Phase 2 — eko4u Watchdog

**Datum:** 2026-04-19
**Status:** Konzept — Implementierung nach Phase-1-Launch
**Parent-Spec:** [`konfigurator-db.md`](./konfigurator-db.md) §9
**Scope:** Automatisierte Überwachung der Eko-Okna-Händlerplattform (eko4u.com / benefit.ekookna.com) auf Sortiments- und Spec-Änderungen

---

## 1. Problem & Ziel

### 1.1 Problem (belegt während Recherche 2026-04-19)

Eko-Okna publiziert Produktinformationen auf ihrer B2B-Plattform verstreut über mindestens vier verschiedene Ebenen:

- **Haupt-Menü** pro Hersteller (z.B. Salamander → BluEvolution 92, 82, greenEvolution 76 Flex)
- **Produkt-Detail-Seiten** (Fließtext mit Specs)
- **Zertifizierungs-Tabellen** (Max-Abmessungen pro Profil × Ausführung)
- **ZIP-Downloads** (technische Zeichnungen + evtl. Detail-Specs)

Keine dieser Ebenen ist vollständig. Die Seite hat **keine öffentliche API**. Inhalte verschieben sich, Profile kommen und gehen (z.B. Streamline 76 nicht mehr im Haupt-Menü, aber als `SL76.zip` weiter verfügbar), Specs werden geändert.

Als Händler manuell nachzuhalten ist weder wirtschaftlich noch zuverlässig („pain in the ass"-Zitat Kunde).

### 1.2 Ziel

Ein Watchdog, der:

1. **Täglich** (oder wöchentlich) die relevanten eko4u-Seiten abgrast (mit persistenter Login-Session)
2. Inhalte **normalisiert** (LLM-basiert, weil kein einheitliches Schema möglich)
3. **Diffs** gegen den letzten bekannten Stand macht
4. Bei Änderungen einen **Telegram-Alert** an Chris + Kunde schickt mit Vorschlag „übernehmen" / „ignorieren"
5. Bei Freigabe: Delta in eine Approval-Queue legt, die optional in die Relaunch-DB gespielt wird

**Nicht-Ziele:**
- KEIN automatischer DB-Commit auf die Live-Website
- KEINE Preisübernahme (Preise pflegt passende-fenster weiterhin eigenständig in qlein)
- KEINE vollständige Spiegelung des eko4u-Sortiments — nur die relevanten Profile

---

## 2. Architektur-Überblick

```
┌──────────────────┐
│ agent-browser    │ ← persistent headless Chrome auf VPS
│ (Login-Session)  │   Login-Cookie im Profil gespeichert
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Scraper Module   │ ← Python, nutzt agent-browser CLI
│ (scheduled)      │   Cron: täglich 07:00
└────────┬─────────┘
         │ Raw HTML + Downloads
         ▼
┌──────────────────┐
│ LLM Extractor    │ ← Anthropic SDK (Claude Haiku 4.5)
│ (normalize)      │   Prompt Cache aktiv
└────────┬─────────┘
         │ Normalisierte JSON-Snapshots
         ▼
┌──────────────────┐
│ Delta-Detector   │ ← Vergleich mit letztem Snapshot
│                  │   Felder: sortiment/specs/max-sizes
└────────┬─────────┘
         │ Änderungen
         ▼
┌──────────────────┐     ┌──────────────────┐
│ Alert Router     │────▶│ Telegram Bot     │
│                  │     │ (interaktiv)     │
└────────┬─────────┘     └──────────────────┘
         │
         ▼
┌──────────────────┐
│ Supabase         │ ← snapshots, products, alerts, approvals
│ (State + Queue)  │
└──────────────────┘
```

---

## 3. Flow im Detail

### 3.1 Initial-Setup (einmalig)

1. `agent-browser open https://eko4u.com/` — Profile mit persistentem State
2. Chris öffnet den Browser via SSH-Forwarding oder VNC-Session
3. Chris loggt manuell in eko4u ein (Credentials vom Kunden)
4. Session-Cookie wird im agent-browser-Profil persistiert (verschlüsselt via `AGENT_BROWSER_ENCRYPTION_KEY`)
5. Test: `agent-browser open https://benefit.ekookna.com/de/` — sollte eingeloggten User zeigen

### 3.2 Periodic Run (täglich via Cron)

```
# /etc/cron.d/eko4u-watchdog
0 7 * * * chris /home/chris/projects/relaunch-passende-fenster/scripts/eko4u-watchdog.py run
```

Flow:

1. **Session-Check:** `agent-browser` lädt `benefit.ekookna.com`, prüft auf Login-Wall. Falls expired → Telegram-Alert „Re-Login nötig", Run abbrechen.
2. **Relevante Seiten abgrasen** (siehe §4 Target-Seiten)
3. **HTML + Downloads** in `/tmp/eko4u-<date>/` ablegen
4. **Network-Sniffing:** `agent-browser network requests --filter "eko4u\|ekookna" --json` → interne JSON-Calls erkennen (ggf. direkter als HTML-Parsing)
5. **LLM-Extraktion** (§5)
6. **Diff gegen letzten Snapshot** (§6)
7. **Persistieren** in Supabase: raw_snapshot + extracted + diff
8. **Alerts** bei nicht-leerem Diff (§7)

### 3.3 Manuelle Runs

`eko4u-watchdog.py run --force` — ignoriert Diff-Schwellen und pusht auch leere Diffs (für Debugging).
`eko4u-watchdog.py dry-run` — extrahiert, diffed, aber schreibt nichts und alarmiert nicht.

---

## 4. Target-Seiten

Fokus auf das, was sich ändert und auswirkt:

| URL | Zweck | Priorität |
|---|---|---|
| `https://benefit.ekookna.com/de/produkt-anleitung/fenster/kunststoffschreinerei` | Hersteller-Übersicht PVC | hoch |
| `https://benefit.ekookna.com/de/produkt-anleitung/fenster/kunststoffschreinerei/salamander` | Salamander-Serien | hoch |
| `https://benefit.ekookna.com/de/produkt-anleitung/fenster/kunststoffschreinerei/aluplast` | Aluplast-Serien | hoch |
| `https://benefit.ekookna.com/de/produkt-anleitung/fenster/kunststoffschreinerei/gealan` | Gealan-Serien | hoch |
| Detail-Seite pro Profil (z.B. `.../salamander/bluevolution-92`) | Specs | hoch |
| `https://benefit.ekookna.com/de/produkt-anleitung/tabelle-der-zertifizierten-abmessungen` | Max-Abmessungen | mittel |
| ZIP-Download-Index (PVC + Alu + Holz) | Datei-Liste | niedrig (für Sortiments-Delta) |

**Alu** und **Holz** analog, wenn Phase 3 aktiviert wird.

Konkrete URLs werden in der ersten Implementierung via `agent-browser` verifiziert — die obigen sind aus der Recherche hergeleitet.

---

## 5. LLM-Extraktion

### 5.1 Warum LLM

Die Seite hat **keine einheitliche Struktur**. Specs stehen mal als HTML-Tabelle, mal als Bullet-Liste, mal als Fließtext. Ein XPath/CSS-basierter Parser bricht bei jedem Layout-Change. LLM mit Schema-validierung (Zod/Pydantic) ist hier robuster.

### 5.2 Modell-Wahl

- **Claude Haiku 4.5** — günstig, schnell, gut genug für Feld-Extraktion aus Markdown.
- **Prompt Caching** auf System-Prompt + Extraktions-Schema → deutlich billiger bei wiederholten Calls.
- Pro Run: ~40-60 Seiten × ~3k Tokens → kostet wenige Cent.

### 5.3 Extraktions-Schema (Pydantic)

```python
class ProductSpec(BaseModel):
    manufacturer: Literal["Salamander", "Aluplast", "Gealan", "Rehau", "Eko-Okna"]
    material: Literal["PVC", "Alu", "Holz"]
    name: str                                   # „BluEvolution 92"
    uw_value: float | None                      # 0.73
    frame_depth_mm: int | None                  # 92
    chambers: int | None                        # 6
    glazing: str | None                         # „3-fach" oder „3/4-fach"
    seals: int | None                           # 3
    description: str | None
    max_sizes: dict[str, tuple[int, int]] | None  # { "einflügelig": (1500, 1500), ... }
    source_url: str
    scraped_at: datetime
```

### 5.4 Prompt (vereinfacht)

```
System: Du extrahierst Fensterprofil-Specs aus B2B-Händlerseiten.
        Nur Fakten aus dem Text, keine Vermutungen. Null bei fehlenden Werten.
        Schema: <ProductSpec>

User:   URL: <url>
        Content: <markdown>
```

Die Extraktion läuft page-weise, Ergebnisse werden zu `snapshot_YYYY-MM-DD.json` aggregiert.

---

## 6. Delta-Detection

### 6.1 Was zählt als Änderung

- **Sortiment:** Profil neu, Profil entfernt, Profil umbenannt
- **Specs:** Uw / Bautiefe / Kammern / Verglasung / Dichtungen abweichend
- **Max-Abmessungen:** Einflügelig / Zweiflügelig / ... in Zertifizierungstabelle
- **ZIP-Verfügbarkeit:** .zip neu/entfernt (Signal dass Produkt eingestellt/hinzugefügt wird)

### 6.2 Was NICHT zählt

- Reine Text-Reformulierungen in Beschreibungen (Noise)
- Bild-Hashes (zu laut)
- Preise (pflegen wir sowieso nicht aus eko4u)

### 6.3 Implementierung

Pro Profil: `old_spec` vs. `new_spec` → Feld-für-Feld-Diff. Ausgabe als List of Change-Events:

```python
class ChangeEvent:
    product_name: str
    change_type: Literal["added", "removed", "modified"]
    field: str | None                 # z.B. "uw_value"
    old_value: Any | None
    new_value: Any | None
```

---

## 7. Alert-Flow

### 7.1 Format

Telegram-Message mit Inline-Buttons:

```
🏗 eko4u-Änderungen entdeckt (2026-05-03)

🔄 BluEvolution 92 — Uw: 0,73 → 0,71
🆕 Salamander greenEvolution 76 — neu im Sortiment
❌ Streamline 76 — ZIP nicht mehr verfügbar

[Alles übernehmen] [Review einzeln] [Ignorieren]
```

### 7.2 Freigabe-Modi

- **Alles übernehmen:** Alle Änderungen gehen als `pending_approvals` in Supabase, User kann später in einem Admin-UI einzeln freigeben.
- **Review einzeln:** Telegram schickt pro Change ein eigenes Inline-Menü.
- **Ignorieren:** Delta wird als „seen" markiert, kommt nicht wieder im Alert.

### 7.3 Wer bekommt den Alert

- **Chris** (Entwickler) — via `telegram-notify`-Skill
- **Kunde** (passende-fenster, optional, per Konfig-Flag)

---

## 8. Datenmodell (Supabase)

```sql
-- Raw Snapshots (archiviert für Nachvollziehbarkeit)
create table eko4u_snapshots (
  id           bigserial primary key,
  scraped_at   timestamptz not null default now(),
  raw_pages    jsonb not null,                 -- {url: html}
  file_path    text,                            -- Storage-Path für Backup-ZIP
  run_id       uuid not null                    -- ein Run = ein Snapshot
);

-- Normalisierte Produkt-Daten
create table eko4u_products (
  id              bigserial primary key,
  snapshot_id     bigint references eko4u_snapshots(id),
  source_url      text not null,
  manufacturer    text not null,
  material        text not null,
  name            text not null,
  specs           jsonb not null,               -- {uw, frame_depth, chambers, ...}
  max_sizes       jsonb,
  zip_available   bool default false,
  first_seen_at   timestamptz default now(),
  last_seen_at    timestamptz default now(),
  unique (manufacturer, name)
);

-- Change-Events (Audit)
create table eko4u_changes (
  id              bigserial primary key,
  snapshot_id     bigint references eko4u_snapshots(id),
  product_name    text not null,
  manufacturer    text not null,
  change_type     text not null check (change_type in ('added', 'removed', 'modified')),
  field           text,
  old_value       text,
  new_value       text,
  detected_at     timestamptz default now()
);

-- Approval-Queue
create table eko4u_approvals (
  id              bigserial primary key,
  change_id       bigint references eko4u_changes(id),
  status          text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'applied')),
  decided_by      text,                          -- telegram username
  decided_at      timestamptz,
  applied_to_articles_id bigint references articles(id), -- FK zur Relaunch-DB falls übernommen
  created_at      timestamptz default now()
);

create index eko4u_changes_snapshot_idx on eko4u_changes(snapshot_id);
create index eko4u_approvals_status_idx on eko4u_approvals(status, created_at desc);
```

---

## 9. Tech-Stack

- **Runtime:** Python 3.12 + venv, auf dem VPS
- **Browser:** `agent-browser` CLI (bereits installiert, headless Chromium)
- **LLM:** Anthropic SDK (`@anthropic-ai/sdk` oder Python-Pendant), Model `claude-haiku-4-5-20251001`, Prompt-Cache aktiv
- **DB:** Supabase (gleiches Projekt `passende-fenster`)
- **Alerts:** `telegram-notify`-Skill (bereits vorhanden) + optional `voice-message`-Skill für kritische Changes
- **Scheduler:** systemd timer oder Cron
- **Secrets:** `.env` mit `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`

---

## 10. Failure Modes

| Szenario | Handling |
|---|---|
| Session expired (Login-Wall bei scrape) | Telegram-Alert „Re-Login nötig", Run bricht ab. Chris macht manuellen Re-Login im agent-browser. |
| eko4u-Layout-Änderung → Parser kaputt | LLM ist robust gegen Layout-Noise. Falls Extraktion systematisch leer → Alert „Watchdog degraded", manueller Check. |
| LLM extrahiert falsche Werte | Review-Mode über Telegram-Inline-Buttons; Approval-Queue erzwingt menschliches „OK" vor DB-Übernahme. |
| eko4u-Rate-Limit / IP-Sperre | `agent-browser` fährt einzelne Page-Loads mit 2-5 s Delay, konservatives Tempo. Bei HTTP 403/429 → exponential backoff + Alert. |
| Supabase-Quota voll (Storage für Snapshots) | Snapshots älter als 90 Tage auto-archivieren oder komprimieren. |

---

## 11. Roadmap / Trigger

**Phase 2 wird aktiviert wenn:**

- Phase 1 ist live und stabil (Konfigurator läuft auf der Relaunch-Website)
- Erste „hab ich verpasst dass sich Specs geändert haben"-Situation tritt auf → Aufwand/Nutzen gerechtfertigt
- ODER: Kunde wünscht Sortiments-Erweiterung und wir brauchen eine automatisierte Datenquelle

**Estimated effort:** 3–5 Arbeitstage für MVP (Scraper + Extraction + Diff + Telegram). Ausbau auf Auto-Apply in die Relaunch-DB: +2 Tage.

---

## 12. Abgrenzung zu Phase 1

| Aspekt | Phase 1 | Phase 2 (Watchdog) |
|---|---|---|
| **Datenquelle** | qlein-API (admin.passende-fenster.de) | eko4u / benefit.ekookna.com |
| **Auth** | öffentlich | Login erforderlich |
| **Sortiment** | 6 Profile (was passende-fenster verkauft) | alle Eko-Okna-Profile (Überwachung) |
| **Frequenz** | einmaliger Import + ggf. wöchentlicher Re-Scrape | täglicher Watchdog |
| **Output** | Live-DB fürs Frontend | Approval-Queue, kein Auto-Commit |
| **Kritizität** | blockierend für Launch | optional, aber hilfreich für Pflege |

---

## 13. Offene Fragen

- [ ] **Eko-Okna-Credentials:** Wer bekommt den Zugang? Chris (für Setup) + serviceAccount (für Watchdog)? Oder reicht Chris' persönlicher Login?
- [ ] **Eko-Okna-TOS:** Ist Scraping mit eigenem Login TOS-konform? Wir sollten das in den Nutzungsbedingungen prüfen (höchstwahrscheinlich: für rein informative Zwecke OK, für Automated Reselling verboten — unser Case ist ersteres).
- [ ] **Alert-Frequenz:** Täglich oder wöchentlich? → Empfehlung: wöchentlich, weil Eko-Okna-Updates vermutlich nicht täglich passieren.
- [ ] **Scope Alu / Holz:** Von Anfang an mit überwachen oder erst wenn Phase 3 aktiviert? → Empfehlung: nur PVC in Phase 2 MVP.
- [ ] **Rate-Limit-Tests:** Wie viele Requests pro Stunde sind sicher? → Ist in der Implementierung zu ermitteln, starten mit konservativen 10 req/min.

---

## 14. Referenzen

- **Parent-Spec:** [`konfigurator-db.md`](./konfigurator-db.md)
- **API-Audit Phase 1:** [`qlein-api-findings.md`](./qlein-api-findings.md)
- **agent-browser:** `agent-browser --help` / `~/.npm-global/bin/agent-browser`
- **Supabase Project:** `passende-fenster`, ref `fvafvfhdrbziivlbuuqn`
- **Eko-Okna B2B:** https://eko4u.com, https://benefit.ekookna.com
- **Miquido (Plattform-Hersteller):** https://www.miquido.com/portfolio/ekookna/
