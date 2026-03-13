"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(headlineRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
      })
        .from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          "-=0.4"
        )
        .from(
          buttonsRef.current!.children,
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/Passende-Fenster-Hintergrund-scaled.jpg')",
        }}
      />

      {/* Dark gradient overlay — dark left, transparent right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(33, 41, 52, 0.92) 0%, rgba(33, 41, 52, 0.75) 40%, rgba(33, 41, 52, 0.3) 70%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <h1
              ref={headlineRef}
              className="heading-display text-white text-balance"
            >
              Passende Fenster
              <br />
              und Türen für
              <br />
              <span className="text-[var(--brand-primary)]">
                jeden Geschmack
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:mt-8 sm:text-xl"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Suchen Sie die besten Fenster und Türen aus unserem Sortiment aus
            </p>

            <div
              ref={buttonsRef}
              className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:gap-5"
            >
              <a
                href="#fenster-systeme"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-primary)] px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-secondary)] hover:shadow-lg hover:shadow-[var(--brand-primary)]/25 sm:w-auto"
              >
                Unser Katalog
              </a>
              <Link
                href="/anfrage"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/60 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10 sm:w-auto"
              >
                Jetzt anfragen
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <a
          href="#warum-passende-fenster"
          className="flex flex-col items-center gap-2 text-white/60 transition-colors hover:text-white"
          aria-label="Nach unten scrollen"
        >
          <span
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Mehr erfahren
          </span>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
