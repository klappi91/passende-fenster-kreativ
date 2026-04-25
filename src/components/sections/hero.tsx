"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          isMotionOK: "(prefers-reduced-motion: no-preference)",
          isReduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMotionOK } = context.conditions as {
            isMotionOK: boolean;
            isReduced: boolean;
          };
          if (!isMotionOK) {
            // Reduced motion: render final state immediately, no entrance animation.
            return;
          }
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.from(paneRef.current, {
            y: 40,
            opacity: 0,
            scale: 0.98,
            duration: 1.1,
          })
            .from(
              specRef.current,
              { opacity: 0, x: -20, duration: 0.7 },
              "-=0.5"
            )
            .from(
              headlineRef.current,
              { y: 40, opacity: 0, duration: 1 },
              "-=0.5"
            )
            .from(
              copyRef.current,
              { y: 20, opacity: 0, duration: 0.8 },
              "-=0.6"
            )
            .from(
              ctaRef.current!.children,
              { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 },
              "-=0.5"
            );
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden text-white"
      style={{
        background: "var(--surface-deep)",
        minHeight: "min(920px, 100vh)",
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/Passende-Fenster-Hintergrund-scaled.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center right",
          filter: "saturate(0.9) brightness(0.78)",
        }}
      />
      {/* Gradient overlay — lighter so glass has something to show through */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(15,20,32,0.88) 0%, rgba(15,20,32,0.55) 40%, rgba(15,20,32,0.25) 75%, rgba(15,20,32,0.15) 100%)",
        }}
      />
      {/* Grid lines — read as mullions */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 30% 50%, black, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 30% 50%, black, transparent 70%)",
        }}
      />

      <div
        className="relative mx-auto grid max-w-[1440px]"
        style={{
          padding: "180px clamp(24px, 5vw, 72px) 100px",
          minHeight: "min(920px, 100vh)",
          alignContent: "center",
        }}
      >
        {/* Hero glass pane */}
        <div
          ref={paneRef}
          className="pf-hero-pane relative overflow-hidden"
          style={{
            ["--glass-blur" as string]: "26px",
            padding: "clamp(40px, 5vw, 72px) clamp(28px, 5vw, 64px)",
            background: "rgba(20,25,34,0.28)",
            backdropFilter: "saturate(180%) blur(var(--glass-blur, 26px))",
            WebkitBackdropFilter: "saturate(180%) blur(var(--glass-blur, 26px))",
            border: "1px solid var(--glass-dark-edge)",
            borderRadius: 28,
            boxShadow:
              "0 18px 50px -18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.25)",
            maxWidth: 1080,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <span className="glass-edge-light" aria-hidden />
          <span className="glass-shine" aria-hidden />
          <span className="mullion-cross" aria-hidden />

          {/* Corner ticks */}
          {[
            { top: 12, left: 12, bt: true, bl: true },
            { top: 12, right: 12, bt: true, br: true },
            { bottom: 12, left: 12, bb: true, bl: true },
            { bottom: 12, right: 12, bb: true, br: true },
          ].map((t, i) => (
            <span
              key={i}
              aria-hidden
              style={{
                position: "absolute",
                width: 14,
                height: 14,
                top: t.top,
                left: t.left,
                right: t.right,
                bottom: t.bottom,
                borderTop: t.bt ? "1px solid rgba(255,255,255,0.45)" : undefined,
                borderLeft: t.bl ? "1px solid rgba(255,255,255,0.45)" : undefined,
                borderRight: t.br ? "1px solid rgba(255,255,255,0.45)" : undefined,
                borderBottom: t.bb ? "1px solid rgba(255,255,255,0.45)" : undefined,
              }}
            />
          ))}

          <div className="relative">
            <div
              ref={specRef}
              className="mono up mb-8 flex items-center gap-4 text-[11px]"
              style={{ color: "var(--brand-primary)" }}
            >
              <span
                style={{
                  width: 40,
                  height: 1,
                  background: "var(--brand-primary)",
                }}
              />
              PF/2026 — KATALOG 05
            </div>

            <h1
              ref={headlineRef}
              className="text-balance m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 7.5vw, 118px)",
                fontWeight: 800,
                lineHeight: 0.94,
                letterSpacing: "-0.035em",
                maxWidth: "16ch",
                color: "var(--brand-light)",
                hyphens: "auto",
              }}
            >
              Fenster,
              <br />
              die{" "}
              <em
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "var(--brand-primary)",
                }}
              >
                passen
              </em>{" "}
              —<br />
              millimetergenau.
            </h1>

            <div
              className="pf-hero-bottom mt-10 grid items-end gap-10"
              style={{ gridTemplateColumns: "minmax(0,1fr) auto" }}
            >
              <p
                ref={copyRef}
                className="m-0"
                style={{
                  fontSize: "clamp(15px, 1.3vw, 19px)",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.85)",
                  maxWidth: "44ch",
                }}
              >
                Profile von{" "}
                <b style={{ color: "var(--brand-light)" }}>
                  Gealan, Aluplast, Salamander, Deceuninck
                </b>{" "}
                und Schüco — konfiguriert auf Ihr Maß, geliefert nach ganz
                Deutschland, montiert vom Profi.
              </p>
              <div ref={ctaRef} className="flex flex-wrap gap-3">
                <Link
                  href="/konfigurator"
                  className="inline-flex items-center gap-2.5 rounded-full text-[15px] font-semibold text-white transition-transform hover:scale-[1.03]"
                  style={{
                    padding: "16px 28px",
                    minHeight: 44,
                    background: "var(--brand-primary)",
                    fontFamily: "var(--font-display)",
                    boxShadow: "0 12px 30px -10px rgba(0,159,227,0.55)",
                  }}
                >
                  Konfigurator starten
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/anfrage"
                  className="inline-flex items-center rounded-full text-[15px] font-medium text-white"
                  style={{
                    padding: "16px 24px",
                    minHeight: 44,
                    background: "rgba(20,25,34,0.25)",
                    border: "1px solid var(--glass-dark-edge)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Beratung anfragen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pf-hero-bottom {
          grid-template-columns: minmax(0, 1fr) auto;
        }
        @media (max-width: 1024px) {
          .pf-hero-bottom {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
