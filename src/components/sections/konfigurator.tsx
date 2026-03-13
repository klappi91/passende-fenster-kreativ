"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

interface OpeningType {
  label: string;
  description: string;
  image: string;
}

const openingTypes: OpeningType[] = [
  {
    label: "Fest",
    description: "Festes Element",
    image: "/images/Fest.png",
  },
  {
    label: "DIN Links",
    description: "Öffnet sich von rechts nach links",
    image: "/images/DIN-Links.png",
  },
  {
    label: "DIN Rechts",
    description: "Öffnet sich von links nach rechts",
    image: "/images/DIN-Rechts.png",
  },
  {
    label: "Kipp",
    description: "Kann nur gekippt werden",
    image: "/images/Kipp.png",
  },
  {
    label: "DKL",
    description: "Von rechts nach links + kipp",
    image: "/images/DKL.png",
  },
  {
    label: "DKR",
    description: "Von links nach rechts + kipp",
    image: "/images/DKR.png",
  },
];

interface Step {
  number: number;
  title: string;
}

const steps: Step[] = [
  { number: 1, title: "Fenstergröße eingeben in mm" },
  { number: 2, title: "Kategorie und Fenstertyp (Öffnungsart) wählen" },
  { number: 3, title: "Gewünschten Profilhersteller anklicken und konfigurieren" },
];

export default function Konfigurator() {
  return (
    <section
      id="konfigurator"
      className="relative w-full overflow-hidden py-20 sm:py-28 lg:py-32"
      data-animate="section"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-brand-gradient" />

      {/* Decorative circles */}
      <div
        className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-10"
        style={{ backgroundColor: "#ffffff" }}
      />
      <div
        className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-10"
        style={{ backgroundColor: "#ffffff" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="mb-14 text-center sm:mb-20" data-animate="fade-up">
          <h2
            className="heading-section text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fenster Konfigurator
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            In nur 3 Schritten zu Ihrem Wunsch-Fenster — einfach, schnell und
            individuell.
          </p>
        </div>

        {/* 3 Steps */}
        <div
          className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8"
          data-animate="fade-up"
        >
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative flex flex-col items-center rounded-2xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
            >
              {/* Step number */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-bold text-[var(--brand-primary)] shadow-lg transition-transform duration-300 group-hover:scale-110">
                {step.number}
              </div>
              <p
                className="text-base font-medium leading-snug text-white sm:text-lg"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Opening types heading */}
        <div className="mb-8 text-center" data-animate="fade-up">
          <h3
            className="heading-sub text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Öffnungsarten
          </h3>
          <p
            className="mt-2 text-white/70"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Wählen Sie die gewünschte Öffnungsart für Ihr Fenster
          </p>
        </div>

        {/* Opening types grid */}
        <div
          className="mx-auto mb-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 md:gap-5"
          data-animate="fade-up"
        >
          {openingTypes.map((type) => (
            <div
              key={type.label}
              className="group flex flex-col items-center gap-3 rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl sm:p-5"
            >
              <div className="flex h-20 w-20 items-center justify-center">
                <Image
                  src={type.image}
                  alt={`${type.label} — ${type.description}`}
                  width={80}
                  height={80}
                  className="h-auto w-auto object-contain"
                />
              </div>
              <div className="text-center">
                <span
                  className="block text-sm font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--brand-heading)",
                  }}
                >
                  {type.label}
                </span>
                <span
                  className="mt-0.5 block text-[11px] leading-tight text-[var(--brand-text)]/70"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {type.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-5" data-animate="fade-up">
          <Link
            href="/anfrage"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-10 py-4 text-lg font-bold text-[var(--brand-primary)] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Jetzt Anfrage senden &rarr;
          </Link>
          <a
            href="tel:015116804054"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <Phone className="h-4 w-4" />
            Oder kontaktieren Sie uns direkt: 0151 16804054
          </a>
        </div>
      </div>
    </section>
  );
}
