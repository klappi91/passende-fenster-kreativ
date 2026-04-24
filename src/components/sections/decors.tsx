"use client";

import Image from "next/image";

const decors = [
  { label: "Mahagoni", image: "/images/Mahagoni.png" },
  { label: "Golden Oak", image: "/images/Goalden-Oak.png" },
  { label: "Nussbaum", image: "/images/Nussbaum.png" },
];

export default function Decors() {
  return (
    <section
      id="decors"
      className="relative overflow-hidden bg-white"
      style={{
        padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 72px)",
      }}
    >
      <div className="relative mx-auto max-w-[1440px]">
        <div
          className="pf-deco-grid grid items-center gap-[clamp(24px,4vw,64px)]"
          style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)" }}
        >
          <div>
            <div
              className="mono up mb-4 text-[11px]"
              style={{ color: "var(--brand-primary)" }}
            >
              ‹ 05 › Dekor-Auswahl
            </div>
            <h2
              className="m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(32px, 3.8vw, 52px)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                color: "var(--brand-heading)",
                overflowWrap: "anywhere",
                hyphens: "auto",
              }}
            >
              Holzoptik — wo immer Sie sie wollen.
            </h2>
            <p
              className="m-0 mt-5"
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "var(--brand-text)",
                maxWidth: "40ch",
              }}
            >
              Acht Kunststoff-Dekore in Echtholz-Maserung. Außen Mahagoni, innen
              Weiß — oder umgekehrt. Sie entscheiden pro Flügel.
            </p>
          </div>
          <div className="pf-deco-cards grid grid-cols-3 gap-4">
            {decors.map((d) => (
              <div
                key={d.label}
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "4/5",
                  borderRadius: 14,
                  background: "#f2f3f5",
                  boxShadow: "0 10px 30px -12px rgba(33,41,52,0.2)",
                }}
              >
                <Image
                  src={d.image}
                  alt={`${d.label} Dekor`}
                  fill
                  sizes="(max-width: 1100px) 33vw, 280px"
                  className="object-cover"
                />
                <div
                  className="absolute flex items-center justify-between"
                  style={{
                    bottom: 10,
                    left: 10,
                    right: 10,
                    padding: "8px 14px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.72)",
                    backdropFilter: "saturate(160%) blur(14px)",
                    WebkitBackdropFilter: "saturate(160%) blur(14px)",
                    border: "1px solid rgba(255,255,255,0.8)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 18px -8px rgba(17,40,70,0.25)",
                  }}
                >
                  <span
                    className="text-[13px]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: "var(--brand-heading)",
                    }}
                  >
                    {d.label}
                  </span>
                  <span
                    className="mono text-[10px]"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          .pf-deco-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .pf-deco-cards {
            grid-template-columns: repeat(2, 1fr);
          }
          .pf-deco-cards > :nth-child(3) {
            grid-column: span 2;
            aspect-ratio: 16 / 9 !important;
          }
        }
      `}</style>
    </section>
  );
}
