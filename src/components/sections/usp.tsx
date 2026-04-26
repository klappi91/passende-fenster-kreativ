"use client";

const usps = [
  {
    kbd: "01",
    title: "Fünf Premium-Marken",
    body: "Profile von Schüco, Gealan, Aluplast, Deceuninck und Salamander.",
  },
  {
    kbd: "02",
    title: "Konfigurator",
    body: "Jedes Maß, jede Öffnungsart, in drei Schritten.",
  },
  {
    kbd: "03",
    title: "Versandkostenfrei",
    body: "Ab 1.000 € Bestellwert, deutschlandweit.",
  },
  {
    kbd: "04",
    title: "Montage-Service",
    body: "Fenster, Türen und Rollläden aus einer Hand — keine Subunternehmer.",
  },
];

const BRANDS = ["Schüco", "Gealan", "Aluplast", "Deceuninck", "Salamander"];

export default function Usp() {
  const [first, ...rest] = usps;

  return (
    <section
      id="warum-passende-fenster"
      className="relative overflow-hidden bg-white"
      style={{
        padding: "clamp(72px, 9vw, 120px) clamp(24px, 5vw, 72px)",
      }}
    >
      <div className="relative mx-auto max-w-[1440px]">
        <div
          className="pf-usp-head mb-[72px] grid grid-cols-1 items-end gap-[clamp(32px,5vw,80px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
        >
          <div>
            <div
              className="mono up mb-4 text-[11px]"
              style={{ color: "var(--brand-primary)" }}
            >
              ‹ 01 › Warum Passende-Fenster
            </div>
            <h2
              className="m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(36px, 5vw, 68px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                color: "var(--brand-heading)",
                overflowWrap: "anywhere",
                hyphens: "auto",
              }}
            >
              Vier Gründe,
              <br />
              keine Nachverhandlung.
            </h2>
          </div>
          <p
            className="m-0"
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--brand-text)",
              maxWidth: "48ch",
            }}
          >
            Fünf Premium-Marken, jedes Maß online konfiguriert, Montage im
            Umkreis von 200 km um Hannover. Alles aus einer Hand — keine
            Subunternehmer.
          </p>
        </div>

        <div
          className="pf-usp-editorial grid gap-5"
          style={{ gridTemplateColumns: "minmax(0,1.25fr) minmax(0,1fr)" }}
        >
          {/* Big feature */}
          <div
            className="relative overflow-hidden text-white"
            style={{
              background: "var(--brand-dark)",
              borderRadius: 24,
              padding: "clamp(32px, 4vw, 56px)",
              display: "grid",
              alignContent: "space-between",
              gap: 40,
              minHeight: 420,
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: -120,
                right: -120,
                width: 360,
                height: 360,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, var(--brand-primary) 0%, transparent 65%)",
                opacity: 0.35,
              }}
            />
            <div className="relative flex items-center gap-3.5">
              <span
                className="mono text-xs font-semibold"
                style={{ color: "var(--brand-primary)" }}
              >
                {first.kbd}
              </span>
              <span
                className="flex-1"
                style={{ height: 1, background: "rgba(255,255,255,0.15)" }}
              />
              <span
                className="mono up text-[10px]"
                style={{ color: "var(--text-on-dark-muted)" }}
              >
                Marken
              </span>
            </div>
            <div className="relative">
              <h3
                className="m-0"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(28px, 3.6vw, 48px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  color: "var(--brand-light)",
                  overflowWrap: "anywhere",
                  hyphens: "auto",
                }}
              >
                Fünf Premium-Profile
                <br />
                <span
                  style={{
                    color: "var(--brand-primary)",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  unter einem Dach.
                </span>
              </h3>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {BRANDS.map((b) => (
                  <span
                    key={b}
                    className="rounded-full text-[13px] font-medium"
                    style={{
                      padding: "8px 16px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.04)",
                      fontFamily: "var(--font-display)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Three stacked */}
          <div
            className="grid gap-5"
            style={{ gridTemplateRows: "repeat(3, 1fr)" }}
          >
            {rest.map((u, i) => {
              const tints: Array<{
                bg: string;
                accent: string;
                inverted?: boolean;
                border?: boolean;
              }> = [
                { bg: "var(--brand-light)", accent: "var(--brand-primary)" },
                {
                  bg: "var(--surface-card)",
                  accent: "var(--brand-secondary)",
                  border: true,
                },
                {
                  bg: "var(--brand-primary)",
                  accent: "#fff",
                  inverted: true,
                },
              ];
              const t = tints[i];
              return (
                <div
                  key={u.title}
                  data-inverted={t.inverted ? "true" : "false"}
                  className="relative grid grid-cols-[1fr_auto] items-center gap-5 overflow-hidden rounded-[20px] px-7 py-6 text-[var(--brand-text)] data-[inverted=true]:text-white"
                  style={{
                    background: t.bg,
                    border: t.border ? "1px solid var(--brand-border)" : "none",
                  }}
                >
                  <div className="grid gap-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        data-inverted={t.inverted ? "true" : "false"}
                        className="mono text-[11px] font-semibold data-[inverted=true]:text-white/85"
                        style={{
                          color: t.inverted ? undefined : t.accent,
                        }}
                      >
                        {u.kbd}
                      </span>
                      <h3
                        data-inverted={t.inverted ? "true" : "false"}
                        className="m-0 text-[20px] text-[var(--brand-heading)] data-[inverted=true]:text-white"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          letterSpacing: "-0.015em",
                        }}
                      >
                        {u.title}
                      </h3>
                    </div>
                    <p
                      data-inverted={t.inverted ? "true" : "false"}
                      className="m-0 text-[14px] text-[var(--brand-text)] data-[inverted=true]:text-white/85"
                      style={{ lineHeight: 1.55 }}
                    >
                      {u.body}
                    </p>
                  </div>
                  <div
                    aria-hidden
                    data-inverted={t.inverted ? "true" : "false"}
                    className="text-[rgba(33,41,52,0.06)] data-[inverted=true]:text-white/[0.18]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "clamp(44px, 5vw, 68px)",
                      lineHeight: 0.9,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {u.kbd}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .pf-usp-head {
            grid-template-columns: 1fr !important;
          }
          .pf-usp-editorial {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
