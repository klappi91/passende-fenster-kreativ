"use client";

import { useState } from "react";

interface Service {
  name: string;
  price: string;
  unit: string;
  detail?: string;
}

const services: Record<"montage" | "extras", Service[]> = {
  montage: [
    {
      name: "Fenster Neubau",
      price: "30–35",
      unit: "€/lfm",
      detail: "inkl. Schrauben & Schaum",
    },
    {
      name: "Verblender / Klinker",
      price: "37–40",
      unit: "€/lfm",
      detail: "inkl. Schrauben, Konsole & Schaum",
    },
    {
      name: "Aufbaurollladen",
      price: "40",
      unit: "€/Stk",
      detail: "bis 2 m",
    },
    {
      name: "Aufsatzrollladen",
      price: "50",
      unit: "€/Stk",
      detail: "bis 2 m",
    },
    { name: "Raffstore", price: "80", unit: "€/Stk", detail: "bis 2 m" },
    {
      name: "Fenster Demontage",
      price: "10",
      unit: "€/lfm",
      detail: "Altfenster-Ausbau",
    },
  ],
  extras: [
    { name: "Fensterband / Dichtband", price: "6", unit: "€/lfm" },
    { name: "Silikon", price: "5", unit: "€/lfm" },
    { name: "Leisten weiß", price: "4", unit: "€/lfm" },
    { name: "Aufmaß", price: "35", unit: "€/Std" },
    { name: "Fahrtkosten ab 50 km", price: "65", unit: "€/Fahrt" },
  ],
};

export default function Dienstleistungen() {
  const [tab, setTab] = useState<"montage" | "extras">("montage");
  const list = services[tab];

  return (
    <section
      id="dienstleistungen"
      className="relative overflow-hidden text-white"
      style={{
        background: "var(--brand-darker)",
        padding: "clamp(72px, 10vw, 140px) clamp(24px, 5vw, 72px)",
      }}
    >
      <div className="relative mx-auto max-w-[1440px]">
        <div
          className="pf-serv-head mb-14 grid items-end gap-[clamp(24px,4vw,64px)]"
          style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}
        >
          <div>
            <div
              className="mono up mb-4 text-[11px]"
              style={{ color: "var(--brand-primary)" }}
            >
              ‹ 04 › Dienstleistungen
            </div>
            <h2
              className="m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(36px, 5vw, 72px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                color: "var(--brand-light)",
                overflowWrap: "anywhere",
                hyphens: "auto",
              }}
            >
              Transparente
              <br />
              <span style={{ color: "var(--brand-primary)" }}>Preisliste.</span>
            </h2>
          </div>
          <div>
            <p
              className="m-0"
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 16,
                lineHeight: 1.6,
                maxWidth: "44ch",
              }}
            >
              Keine versteckten Kosten. Alle Preise laufender Meter (lfm) oder
              pro Stück, inkl. aller Arbeitsschritte. Alle Preise zzgl. MwSt.
            </p>
            <div
              className="mt-5 inline-flex gap-0.5 rounded-full p-1"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {(
                [
                  ["montage", "Montage"],
                  ["extras", "Material & Extras"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  className="rounded-full text-[13px] font-semibold transition-colors"
                  style={{
                    padding: "10px 18px",
                    minHeight: 44,
                    background: tab === k ? "var(--surface-card)" : "transparent",
                    color: tab === k ? "var(--brand-dark)" : "rgba(255,255,255,0.7)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
          }}
        >
          {list.map((s, i) => (
            <div
              key={s.name}
              className="pf-serv-row grid items-center gap-6"
              style={{
                gridTemplateColumns: "60px minmax(0,1.3fr) minmax(0,1fr) auto",
                padding: "20px 26px",
                borderTop: i ? "1px solid rgba(255,255,255,0.06)" : undefined,
                background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent",
              }}
            >
              <span
                className="mono text-[12px]"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className="text-[16px]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  color: "var(--brand-light)",
                }}
              >
                {s.name}
              </div>
              <div
                className="text-[14px]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {s.detail || "—"}
              </div>
              <div className="text-right">
                <span
                  className="text-[22px]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--brand-primary)",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {s.price}
                </span>
                <span
                  className="mono ml-1.5 text-[11px]"
                  style={{ color: "var(--text-on-dark-muted)" }}
                >
                  {s.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .pf-serv-head {
            grid-template-columns: 1fr !important;
          }
          .pf-serv-row {
            grid-template-columns: 32px 1fr auto !important;
            gap: 12px !important;
            padding: 16px 18px !important;
          }
          .pf-serv-row > :nth-child(3) {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
