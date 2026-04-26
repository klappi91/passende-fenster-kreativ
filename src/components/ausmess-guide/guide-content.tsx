// Vollständiger Inhalt des Mess-Guides. Wird sowohl auf /fenster-ausmessen
// als auch im GuideDrawer verwendet (re-usable).
//
// Struktur nach specs/konfigurator-ux-research-v2.md §3.4.

import { EinbauluftTable } from "./einbauluft-table";
import { Glossar } from "./glossar";
import { Ruler, PenTool, Home, Ambulance, Layers, AlertCircle } from "lucide-react";

const SECTIONS = [
  { id: "vorbereitung", label: "Vorbereitung" },
  { id: "skizze", label: "Skizze & Öffnungsrichtung" },
  { id: "altbau", label: "Im Altbau messen" },
  { id: "neubau", label: "Im Neubau messen" },
  { id: "einbauluft", label: "Einbauluft-Tabelle" },
  { id: "rollladen", label: "Rollladen" },
  { id: "fensterbank", label: "Fensterbank-Anschluss" },
  { id: "glossar", label: "Glossar" },
] as const;

export function GuideTOC() {
  return (
    <nav aria-label="Inhaltsverzeichnis" className="text-sm">
      <p className="heading-price-label mb-3">Inhalt</p>
      <ul className="space-y-1.5">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="text-[var(--muted-foreground)] transition hover:text-[var(--brand-primary)]"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function GuideContent() {
  return (
    <div className="space-y-16">
      {/* 3. Vorbereitung */}
      <Section id="vorbereitung" title="Vorbereitung und Werkzeug">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <IconCard icon={<Ruler />} title="Zollstock / Metermaß" hint="Mind. 2 m Länge, präzise Skala" />
          <IconCard icon={<PenTool />} title="Papier & Stift" hint="Skizze mit Öffnungsrichtung" />
          <IconCard icon={<Ambulance />} title="Wasserwaage" hint="Bei Unsicherheit über Parallelität" />
        </div>
        <p className="mt-5 text-base leading-relaxed text-[var(--brand-text)]">
          Miss <strong>immer an mindestens zwei Stellen</strong> pro Dimension
          (oben + unten für Breite, links + rechts für Höhe). Bei Differenzen
          gewinnt der <strong>kleinere Wert</strong>. Öffnungen sind selten
          wirklich rechtwinklig — besonders im Altbau.
        </p>
      </Section>

      {/* 4. Skizze */}
      <Section id="skizze" title="Skizze & Öffnungsrichtung">
        <p className="text-base leading-relaxed text-[var(--brand-text)]">
          Vor dem Messen: einfache Skizze auf Papier zeichnen. <strong>Die
          Perspektive ist immer von innen auf das Fenster blickend</strong> —
          das ist die DIN-Konvention und gilt für alle Hersteller.
        </p>
        <p className="mt-3 text-base leading-relaxed text-[var(--brand-text)]">
          Markiere in der Skizze die <strong>Öffnungsrichtung</strong> mit einem
          Dreieck. Die <strong>Spitze des Dreiecks zeigt zur Drehachse</strong>
          {" "}(dort wo die Scharniere sitzen), der Griff sitzt gegenüber.
        </p>
        <div className="mt-5 rounded-2xl bg-[var(--konfig-chip-idle-bg)] p-5">
          <p className="text-sm font-medium text-[var(--brand-heading)]">
            Beispiel: DKL (Dreh-Kipp Links)
          </p>
          <p className="mt-1 text-sm text-[var(--brand-text)]">
            Dreieck-Spitze zeigt links → Scharniere links → Griff rechts →
            Fenster öffnet nach innen rechts und kippt oben.
          </p>
        </div>
      </Section>

      {/* 5. Altbau */}
      <Section id="altbau" title="Im Altbau messen" icon={<Home className="h-6 w-6" />}>
        <p className="text-base leading-relaxed text-[var(--brand-text)]">
          Im Altbau ist das bestehende Fenster noch vorhanden. Messe das
          vorhandene <strong>Stock-Außenmaß</strong> (also den Holz- oder
          Kunststoffrahmen außen umlaufend) — das ist meistens Ihr Bestellmaß,
          falls derselbe Einbautyp erhalten bleibt.
        </p>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-base text-[var(--brand-text)]">
          <li>
            <strong>Außen und innen prüfen:</strong> Sitzt das Fenster mit
            Anschlag (Maueröffnung springt zur Außenseite zurück)? Dann ist das
            Außenmaß größer als das Innenmaß.
          </li>
          <li>
            <strong>Breite messen</strong> — oben, mittig, unten. Kleinstes Maß
            nehmen.
          </li>
          <li>
            <strong>Höhe messen</strong> — links, mittig, rechts. Kleinstes Maß
            nehmen.
          </li>
          <li>
            <strong>Einbauluft berücksichtigen</strong> (siehe Tabelle unten) —
            falls Sie nicht das vorhandene Außenmaß, sondern die Maueröffnung
            als Basis nehmen.
          </li>
        </ol>
      </Section>

      {/* 6. Neubau */}
      <Section id="neubau" title="Im Neubau messen" icon={<Layers className="h-6 w-6" />}>
        <p className="text-base leading-relaxed text-[var(--brand-text)]">
          Im Neubau gibt es noch kein Fenster — Sie messen direkt die
          <strong> lichte Maueröffnung</strong>.
        </p>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-base text-[var(--brand-text)]">
          <li>
            <strong>Breite der Öffnung</strong> messen (oben, mittig, unten →
            kleinster Wert).
          </li>
          <li>
            <strong>Höhe der Öffnung</strong> messen (links, mittig, rechts →
            kleinster Wert).
          </li>
          <li>
            Einbauluft <strong>pro Seite abziehen</strong> (2× pro Achse):
            Weiß 10–20 mm, farbig 15–25 mm je nach Größe.
          </li>
          <li>
            Fensterbank-Anschluss und Rollladen-Aufsatz gegebenenfalls von der
            Höhe abziehen.
          </li>
        </ol>
        <div className="mt-5 rounded-xl bg-white p-4 shadow-sm ring-1 ring-[var(--border)]">
          <p className="text-sm font-semibold text-[var(--brand-heading)]">
            Rechenbeispiel Neubau (Weiß, 1.260 × 1.460 mm)
          </p>
          <dl className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
            <dt className="text-[var(--muted-foreground)]">Rohbaumaß</dt>
            <dd className="font-medium">1.260 × 1.460 mm</dd>
            <dt className="text-[var(--muted-foreground)]">− Einbauluft 2×20 mm</dt>
            <dd className="font-medium">−40 mm B / −40 mm H</dd>
            <dt className="text-[var(--muted-foreground)]">
              − Fensterbankleiste
            </dt>
            <dd className="font-medium">−30 mm H</dd>
            <dt className="text-[var(--muted-foreground)]">Bestellmaß</dt>
            <dd className="font-bold text-[var(--konfig-price)]">
              1.220 × 1.390 mm
            </dd>
          </dl>
        </div>
      </Section>

      {/* 7. Einbauluft */}
      <Section id="einbauluft" title="Einbauluft-Tabelle">
        <p className="mb-5 text-base leading-relaxed text-[var(--brand-text)]">
          Die Einbauluft hängt von Fenstergröße und Farbe ab. Bei dunklen
          Profilen (Anthrazit 7016 etc.) muss wegen thermischer Ausdehnung mehr
          Luft gelassen werden.
        </p>
        <EinbauluftTable />
      </Section>

      {/* 8. Rollladen */}
      <Section id="rollladen" title="Sonderfall Rollladen">
        <p className="text-base leading-relaxed text-[var(--brand-text)]">
          Ein <strong>Aufsatzrollladen</strong> sitzt direkt auf dem
          Fensterrahmen. Sein Kasten addiert Höhe zum Gesamtmaß — das Fenster
          selbst wird entsprechend niedriger als die Maueröffnung.
        </p>
        <p className="mt-3 text-base leading-relaxed text-[var(--brand-text)]">
          Typische Kastenhöhen:{" "}
          <strong>140 / 180 / 220 / 240 mm</strong>. Bei Unsicherheit messen Sie
          Ihren Bestandskasten oder wählen den gewünschten Kasten direkt in der
          Konfiguration — wir ziehen die Höhe automatisch ab.
        </p>
        <div className="mt-4 flex gap-3 rounded-xl bg-[var(--konfig-chip-idle-bg)] p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-[var(--konfig-stroke)]" />
          <p className="text-sm text-[var(--brand-text)]">
            <strong>Vorbaurollladen</strong> (außen montiert) verändern das
            Fenstermaß nicht — sie werden separat auf die Fassade gesetzt.
          </p>
        </div>
      </Section>

      {/* 9. Fensterbank */}
      <Section id="fensterbank" title="Fensterbank-Anschlussprofil">
        <p className="text-base leading-relaxed text-[var(--brand-text)]">
          Die <strong>Fensterbankleiste</strong> (oder das
          Fensterbank-Anschlussprofil) sitzt unter dem Fenster und verbindet
          den Rahmen mit der Innenfensterbank. Standard-Höhen:
        </p>
        <ul className="mt-3 space-y-1 text-base text-[var(--brand-text)]">
          <li>• <strong>10 mm</strong> — Standard bei Neubau</li>
          <li>• <strong>25 mm</strong> — mittlerer Übergang</li>
          <li>• <strong>30 mm</strong> — häufiger Default</li>
          <li>• <strong>40 mm</strong> — bei größerem Höhenversatz</li>
          <li>• <strong>50 mm</strong> — bei Altbau-Versätzen</li>
        </ul>
        <p className="mt-3 text-base leading-relaxed text-[var(--brand-text)]">
          Wählen Sie die kleinste Höhe, mit der Ihr gewünschter Innenbank-Übergang
          noch funktioniert. Im Zweifel fragen wir bei der Bestellung nach.
        </p>
      </Section>

      {/* 10. Glossar */}
      <Section id="glossar" title="Glossar">
        <Glossar />
      </Section>

      {/* 11. PDF + CTA */}
      <Section title="Bereit?" muted>
        <div className="rounded-3xl bg-brand-gradient p-8 text-center text-white sm:p-12">
          <p className="heading-price-label text-white/80">Jetzt loslegen</p>
          <h3
            className="mt-1 text-2xl font-bold sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ihr Fenster konfigurieren
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-white/85">
            Maße eingeben, passende Profile vergleichen, unverbindliches
            Angebot anfordern. Antwort innerhalb 48 Stunden.
          </p>
          <a
            href="/konfigurator"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[var(--brand-primary)] shadow-lg transition hover:scale-105"
          >
            Zum Konfigurator →
          </a>
        </div>
      </Section>
    </div>
  );
}

function Section({
  id,
  title,
  icon,
  muted,
  children,
}: {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-heading` : undefined}>
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-[var(--konfig-stroke)]">{icon}</span>
        )}
        <h2
          id={id ? `${id}-heading` : undefined}
          className={`${muted ? "heading-price-label" : "heading-konfig-step"}`}
          style={!muted ? { fontFamily: "var(--font-display)" } : undefined}
        >
          {title}
        </h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function IconCard({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--konfig-chip-idle-bg)] text-[var(--konfig-stroke)]">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-[var(--brand-heading)]">
          {title}
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>
      </div>
    </div>
  );
}
