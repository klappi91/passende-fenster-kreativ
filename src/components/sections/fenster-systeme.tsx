"use client";

import { useState } from "react";
import Image from "next/image";

interface System {
  brand: string;
  name: string;
  image: string;
  uf: string;
  depth: string;
  chambers: string;
  body: string;
  tag: string;
  accent: string;
}

const systems: System[] = [
  {
    brand: "Gealan",
    name: "S 9000",
    image: "/images/synego.png",
    uf: "0.95",
    depth: "82.5 mm",
    chambers: "6",
    body: "Sechskammer-System mit IKD-Mitteldichtung. Premium-Wärmeschutz.",
    tag: "Bestseller",
    accent: "var(--brand-primary)",
  },
  {
    brand: "Aluplast",
    name: "energeto neo",
    image: "/images/energeto-neo-program.png",
    uf: "0.83",
    depth: "85 mm",
    chambers: "7",
    body: "Bonding-Technologie ohne Stahlverstärkung. Höchste Dämmwerte.",
    tag: "Passivhaus",
    accent: "var(--brand-accent)",
  },
  {
    brand: "Salamander",
    name: "bluEvolution 92",
    image: "/images/bluevolution92-program-deutschland.png",
    uf: "0.94",
    depth: "92 mm",
    chambers: "6",
    body: "Siebenkammer-Profil, 92 mm Bautiefe. Schall- und Wärmeschutz.",
    tag: "Schallschutz",
    accent: "var(--brand-secondary)",
  },
  {
    brand: "Aluminium",
    name: "Alux DB",
    image: "/images/Alux-DB.png",
    uf: "1.3",
    depth: "75 mm",
    chambers: "—",
    body: "Alu-Profil mit Dekorbeschichtung. Schlank, langlebig, modern.",
    tag: "Aluminium",
    accent: "var(--brand-accent)",
  },
];

function Spec({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div>
      <div
        className="mono up mb-1.5 text-[10px]"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {label}
      </div>
      <div
        className="text-[22px]"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          letterSpacing: "-0.015em",
          color: "#fff",
        }}
      >
        {value}
        {unit && (
          <span
            className="ml-1.5 text-[11px] font-normal"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function FensterSysteme() {
  const [active, setActive] = useState(0);
  const sys = systems[active];
  return (
    <section
      id="fenster-systeme"
      className="relative overflow-hidden text-white"
      style={{
        background: "var(--brand-dark)",
        padding: "clamp(72px, 10vw, 140px) clamp(24px, 5vw, 72px)",
      }}
    >
      <div className="relative mx-auto max-w-[1440px]">
        <div
          className="pf-sys-head mb-14 grid items-end gap-6"
          style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}
        >
          <div>
            <div
              className="mono up mb-4 text-[11px]"
              style={{ color: "var(--brand-primary)" }}
            >
              ‹ 02 › Fenster-Systeme
            </div>
            <h2
              className="m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(36px, 5vw, 72px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                color: "#fff",
                overflowWrap: "anywhere",
                hyphens: "auto",
              }}
            >
              Fünf Profile.
              <br />
              <span
                style={{
                  color: "var(--brand-primary)",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                Eine Passform.
              </span>
            </h2>
          </div>
          <p
            className="m-0"
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 16,
              lineHeight: 1.55,
              maxWidth: "42ch",
            }}
          >
            Jede Marke mit eigener Stärke — Dämmwert, Schallschutz, Ästhetik.
            Wir beraten, welches Profil zu Ihrem Bauvorhaben wirklich passt.
          </p>
        </div>

        <div
          className="pf-sys-body grid items-stretch gap-[clamp(28px,5vw,80px)]"
          style={{ gridTemplateColumns: "1fr 1.1fr" }}
        >
          {/* LEFT list */}
          <div className="grid content-start gap-0.5">
            {systems.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.name}
                  onClick={() => setActive(i)}
                  className="text-left transition-all duration-200"
                  style={{
                    padding: "22px 26px",
                    minHeight: 44,
                    background: isActive
                      ? "rgba(0,159,227,0.08)"
                      : "transparent",
                    borderLeft: `3px solid ${
                      isActive
                        ? "var(--brand-primary)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 16,
                    alignItems: "center",
                  }}
                >
                  <span
                    className="mono text-xs"
                    style={{
                      color: isActive
                        ? "var(--brand-primary)"
                        : "rgba(255,255,255,0.4)",
                    }}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <div
                      className="mono up mb-0.5 text-[10px]"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {s.brand}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "clamp(18px, 2vw, 26px)",
                        letterSpacing: "-0.015em",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {s.name}
                    </div>
                  </div>
                  <span
                    className="rounded-full text-[11px]"
                    style={{
                      padding: "4px 10px",
                      background: isActive
                        ? "var(--brand-primary)"
                        : "rgba(255,255,255,0.08)",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                      fontWeight: 600,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {s.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT detail card */}
          <div
            className="relative overflow-hidden"
            style={{
              background: "rgba(20,25,34,0.35)",
              backdropFilter: "saturate(180%) blur(18px)",
              WebkitBackdropFilter: "saturate(180%) blur(18px)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 20,
              boxShadow:
                "0 18px 50px -18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
              padding: "clamp(24px, 3vw, 48px)",
              display: "grid",
              gap: 28,
              gridTemplateRows: "auto 1fr auto auto",
            }}
          >
            <span className="glass-edge-light" aria-hidden />
            <span className="glass-shine" aria-hidden />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div
                  className="mono up mb-2 text-[10px]"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Aktuell
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(22px, 2.6vw, 36px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {sys.brand} {sys.name}
                </div>
              </div>
              <span
                className="rounded-full whitespace-nowrap text-[11px]"
                style={{
                  padding: "6px 14px",
                  background: sys.accent,
                  color: "#fff",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                }}
              >
                {sys.tag}
              </span>
            </div>

            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: "4/3",
                background:
                  "linear-gradient(135deg, rgba(180,210,230,0.18) 0%, rgba(255,255,255,0.04) 55%, rgba(0,159,227,0.12) 100%)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)) center / 1px 100% no-repeat, linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)) center / 100% 1px no-repeat",
                }}
              />
              <Image
                src={sys.image}
                alt={sys.name}
                width={520}
                height={420}
                sizes="(max-width: 1100px) 90vw, 500px"
                className="relative h-auto w-auto max-h-[82%] max-w-[72%] object-contain"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.45))" }}
              />
              <div
                className="absolute left-4 top-4 mono"
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "rgba(20,25,34,0.45)",
                  backdropFilter: "saturate(180%) blur(10px)",
                  WebkitBackdropFilter: "saturate(180%) blur(10px)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontSize: 10,
                  letterSpacing: 0.08,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                REF {sys.brand.slice(0, 3).toUpperCase()}-{active + 1}
              </div>
            </div>

            <p
              className="relative m-0 text-[15px]"
              style={{
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.6,
              }}
            >
              {sys.body}
            </p>

            <div
              className="relative grid gap-6 pt-6"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
                borderTop: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Spec label="Uf-Wert" value={sys.uf} unit="W/m²K" />
              <Spec label="Bautiefe" value={sys.depth} />
              <Spec label="Kammern" value={sys.chambers} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          .pf-sys-head {
            grid-template-columns: 1fr !important;
          }
          .pf-sys-body {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
