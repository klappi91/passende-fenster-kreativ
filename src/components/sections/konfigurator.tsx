"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const steps = [
  {
    n: "01",
    title: "Maße",
    body: "Breite × Höhe in Millimetern eingeben — exakt so, wie Sie gemessen haben.",
  },
  {
    n: "02",
    title: "Öffnungsart",
    body: "Fest, Dreh-Kipp, Links oder Rechts — wählen Sie pro Flügel.",
  },
  {
    n: "03",
    title: "Profil",
    body: "Gealan, Aluplast, Salamander — konfigurieren, bestellen, montieren.",
  },
];

const openings = [
  { label: "Fest", image: "/images/Fest.png" },
  { label: "DIN Links", image: "/images/DIN-Links.png" },
  { label: "DIN Rechts", image: "/images/DIN-Rechts.png" },
  { label: "Kipp", image: "/images/Kipp.png" },
  { label: "DKL", image: "/images/DKL.png" },
  { label: "DKR", image: "/images/DKR.png" },
];

function Field({
  label,
  value,
  setValue,
  min,
  max,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <label className="grid gap-1.5">
      <span
        className="mono up text-[10px]"
        style={{ color: "var(--brand-text)" }}
      >
        {label}
      </span>
      <div
        className="grid overflow-hidden"
        style={{
          gridTemplateColumns: "1fr auto",
          border: "1px solid rgba(255,255,255,0.7)",
          borderRadius: 12,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 12px -6px rgba(17,40,70,0.08)",
        }}
      >
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const next = Math.max(min, Math.min(max, isNaN(raw) ? min : raw));
            setValue(next);
          }}
          className="no-spin w-full border-0 bg-transparent px-4 py-3 text-[18px] outline-none"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "var(--brand-heading)",
            minHeight: 44,
          }}
        />
        <div className="grid" style={{ gridTemplateRows: "1fr 1fr" }}>
          <button
            type="button"
            aria-label="Wert erhöhen"
            onClick={() => setValue(Math.min(max, value + 10))}
            className="px-3 text-[12px]"
            style={{
              borderLeft: "1px solid var(--brand-border)",
              color: "var(--brand-primary)",
              minHeight: 22,
            }}
          >
            ▲
          </button>
          <button
            type="button"
            aria-label="Wert verringern"
            onClick={() => setValue(Math.max(min, value - 10))}
            className="px-3 text-[12px]"
            style={{
              borderLeft: "1px solid var(--brand-border)",
              borderTop: "1px solid var(--brand-border)",
              color: "var(--brand-primary)",
              minHeight: 22,
            }}
          >
            ▼
          </button>
        </div>
      </div>
    </label>
  );
}

function ConfigPreview() {
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(1400);
  const [opening, setOpening] = useState(4);
  const price = Math.round(((width * height) / 1e6) * 420 + 120);

  const maxW = 280;
  const maxH = 340;
  const scale = Math.min(maxW / width, maxH / height) * 1000;
  const dw = (width / 1000) * scale;
  const dh = (height / 1000) * scale;

  return (
    <div
      className="pf-konf-preview relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "saturate(160%) blur(20px)",
        WebkitBackdropFilter: "saturate(160%) blur(20px)",
        border: "1px solid rgba(255,255,255,0.55)",
        borderRadius: 20,
        boxShadow:
          "0 18px 50px -20px rgba(17,40,70,0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
      }}
    >
      <span className="glass-edge-light" aria-hidden />

      {/* LEFT canvas */}
      <div
        className="relative grid place-items-center"
        style={{
          padding: "clamp(28px, 4vw, 56px)",
          minHeight: 440,
          background:
            "linear-gradient(180deg, rgba(0,159,227,0.04), rgba(255,255,255,0.0))",
          backgroundImage:
            "linear-gradient(rgba(0,159,227,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,159,227,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          borderRight: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        <div
          className="mono up absolute text-[10px]"
          style={{ top: 20, left: 20, color: "var(--brand-primary)" }}
        >
          Live-Vorschau
        </div>

        <div className="relative" style={{ width: dw, minHeight: dh }}>
          {/* Width dim */}
          <div
            className="absolute flex items-center gap-2"
            style={{ top: -32, left: 0, right: 0 }}
          >
            <span
              className="flex-1"
              style={{ height: 1, background: "var(--brand-primary)" }}
            />
            <span
              className="mono text-[11px] font-semibold"
              style={{ color: "var(--brand-primary)" }}
            >
              {width} mm
            </span>
            <span
              className="flex-1"
              style={{ height: 1, background: "var(--brand-primary)" }}
            />
          </div>
          {/* Height dim */}
          <div
            className="absolute flex flex-col items-center gap-2"
            style={{ right: -40, top: 0, bottom: 0 }}
          >
            <span
              className="flex-1"
              style={{ width: 1, background: "var(--brand-primary)" }}
            />
            <span
              className="mono text-[11px] font-semibold"
              style={{
                color: "var(--brand-primary)",
                writingMode: "vertical-rl",
              }}
            >
              {height} mm
            </span>
            <span
              className="flex-1"
              style={{ width: 1, background: "var(--brand-primary)" }}
            />
          </div>

          {/* Window frame */}
          <div
            className="relative grid place-items-center"
            style={{
              width: dw,
              height: dh,
              background: "#fff",
              border: "10px solid #f0f4f8",
              borderRadius: 4,
              boxShadow:
                "0 20px 60px -20px rgba(0,159,227,0.35), inset 0 0 0 1px #e2e8ef",
            }}
          >
            <div
              className="absolute overflow-hidden grid place-items-center"
              style={{
                inset: 12,
                background:
                  "linear-gradient(135deg, rgba(180,210,230,0.55) 0%, rgba(230,240,248,0.85) 55%, rgba(150,190,220,0.4) 100%)",
                border: "1px solid rgba(0,159,227,0.2)",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.25) 100%)",
                }}
              />
              <Image
                src={openings[opening].image}
                alt={openings[opening].label}
                width={120}
                height={160}
                sizes="120px"
                className="relative h-auto"
                style={{
                  width: "55%",
                  opacity: 0.75,
                  mixBlendMode: "multiply",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT controls */}
      <div
        className="relative grid content-start"
        style={{
          padding: "clamp(24px, 3.5vw, 48px)",
          gap: 28,
        }}
      >
        <div>
          <div
            className="mono up mb-4 text-[10px]"
            style={{ color: "var(--brand-primary)" }}
          >
            Schritt 1 — Maße
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <Field
              label="Breite (mm)"
              value={width}
              setValue={setWidth}
              min={400}
              max={2400}
            />
            <Field
              label="Höhe (mm)"
              value={height}
              setValue={setHeight}
              min={400}
              max={2800}
            />
          </div>
        </div>

        <div>
          <div
            className="mono up mb-4 text-[10px]"
            style={{ color: "var(--brand-primary)" }}
          >
            Schritt 2 — Öffnungsart
          </div>
          <div className="grid grid-cols-3 gap-2">
            {openings.map((o, i) => {
              const isActive = i === opening;
              return (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setOpening(i)}
                  className="relative grid justify-items-center gap-1.5 transition-all"
                  style={{
                    padding: "12px 8px 10px",
                    minHeight: 44,
                    borderRadius: 12,
                    background: isActive
                      ? "var(--brand-primary)"
                      : "rgba(255,255,255,0.55)",
                    color: isActive ? "#fff" : "var(--brand-text)",
                    border: `1px solid ${
                      isActive ? "var(--brand-primary)" : "rgba(255,255,255,0.8)"
                    }`,
                    backdropFilter: isActive ? "none" : "blur(10px)",
                    WebkitBackdropFilter: isActive ? "none" : "blur(10px)",
                    boxShadow: isActive
                      ? "0 8px 20px -8px rgba(0,159,227,0.55)"
                      : "inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 14px -6px rgba(17,40,70,0.12)",
                  }}
                >
                  <Image
                    src={o.image}
                    alt=""
                    aria-hidden
                    width={38}
                    height={38}
                    sizes="38px"
                    className="h-[38px] w-[38px] object-contain"
                    style={{
                      filter: isActive ? "brightness(0) invert(1)" : "none",
                    }}
                  />
                  <span
                    className="text-[11px] font-semibold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {o.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price readout */}
        <div
          className="relative grid items-center gap-4 overflow-hidden text-white"
          style={{
            marginTop: 12,
            padding: 24,
            gridTemplateColumns: "1fr auto",
            borderRadius: 14,
            background: "rgba(20,25,34,0.88)",
            backdropFilter: "saturate(180%) blur(20px)",
            WebkitBackdropFilter: "saturate(180%) blur(20px)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow:
              "0 18px 50px -18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          <span className="glass-shine" aria-hidden />
          <div className="relative">
            <div
              className="mono up mb-1 text-[10px]"
              style={{ color: "var(--brand-primary)" }}
            >
              Richtpreis ab
            </div>
            <div
              className="text-[32px] sm:text-[36px] leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              {price.toLocaleString("de-DE")} €
              <span
                className="ml-2 text-[13px] font-normal"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                inkl. MwSt.
              </span>
            </div>
          </div>
          <Link
            href="/konfigurator"
            className="relative inline-flex items-center whitespace-nowrap rounded-full text-[14px] font-semibold text-white"
            style={{
              padding: "12px 20px",
              minHeight: 44,
              background: "var(--brand-primary)",
              fontFamily: "var(--font-display)",
              boxShadow: "0 10px 24px -10px rgba(0,159,227,0.6)",
            }}
          >
            Weiter →
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          .pf-konf-preview {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function Konfigurator() {
  return (
    <section
      id="konfigurator"
      className="relative overflow-hidden"
      style={{
        background: "var(--brand-light)",
        padding: "clamp(72px, 10vw, 140px) clamp(24px, 5vw, 72px)",
      }}
    >
      {/* Big ghost type */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "8%",
          right: "-8%",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(220px, 26vw, 440px)",
          lineHeight: 0.85,
          color: "var(--brand-primary)",
          opacity: 0.06,
          letterSpacing: "-0.05em",
        }}
      >
        03
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <div
          className="pf-konf-head mb-16 grid items-end gap-[clamp(32px,5vw,80px)]"
          style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}
        >
          <div>
            <div
              className="mono up mb-4 text-[11px]"
              style={{ color: "var(--brand-primary)" }}
            >
              ‹ 03 › Konfigurator
            </div>
            <h2
              className="m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(36px, 5vw, 72px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                color: "var(--brand-heading)",
                overflowWrap: "anywhere",
                hyphens: "auto",
              }}
            >
              Drei Schritte.
              <br />
              Kein Formularwust.
            </h2>
          </div>
          <p
            className="m-0"
            style={{
              color: "var(--brand-text)",
              fontSize: 17,
              lineHeight: 1.6,
              maxWidth: "42ch",
            }}
          >
            Maße eintragen, Öffnungsart wählen, Profil bestimmen — Preis und
            Lieferzeit erscheinen live. Kein Gespräch vorab nötig.
          </p>
        </div>

        {/* Steps */}
        <div
          className="pf-konf-steps mb-12 grid overflow-hidden"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            background: "var(--brand-border)",
            borderRadius: 20,
            border: "1px solid var(--brand-border)",
          }}
        >
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative grid gap-3.5 overflow-hidden"
              style={{
                padding: "36px 32px",
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 40%)",
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(44px, 5vw, 64px)",
                  color: "var(--brand-primary)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                }}
              >
                {s.n}
              </div>
              <div
                className="text-[22px]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  color: "var(--brand-heading)",
                }}
              >
                {s.title}
              </div>
              <p
                className="m-0 text-[14.5px]"
                style={{
                  lineHeight: 1.55,
                  color: "var(--brand-text)",
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <ConfigPreview />
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          .pf-konf-head {
            grid-template-columns: 1fr !important;
          }
          .pf-konf-steps {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
