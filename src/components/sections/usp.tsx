"use client";

import { Layers, Settings, Truck, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface UspCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

const uspCards: UspCard[] = [
  {
    icon: Layers,
    title: "Große Auswahl",
    description:
      "Profile von Schüco, Gealan, Aluplast, Deceuninck und Salamander",
  },
  {
    icon: Settings,
    title: "Individuelle Konfiguration",
    description: "Konfigurator für maßgeschneiderte Fenster und Türen",
  },
  {
    icon: Truck,
    title: "Versandkostenfrei",
    description:
      "Ab 1.000 € Bestellwert versandkostenfrei in ganz Deutschland",
  },
  {
    icon: Wrench,
    title: "Montage-Service",
    description:
      "Professionelle Montage von Fenstern, Türen und Rollläden",
  },
];

export default function Usp() {
  return (
    <section
      id="warum-passende-fenster"
      className="w-full py-20 sm:py-28 lg:py-32"
      style={{ backgroundColor: "var(--brand-light)" }}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section heading */}
        <div className="mb-14 text-center sm:mb-20">
          <h2 className="heading-section">
            Warum{" "}
            <span className="text-gradient">Passende-Fenster?</span>
          </h2>
        </div>

        {/* USP Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {uspCards.map((card) => (
            <div
              key={card.title}
              data-animate="fade-up"
              className="group flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl sm:p-10"
            >
              {/* Icon */}
              <div
                className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(0, 159, 227, 0.1)" }}
              >
                <card.icon
                  className="h-8 w-8"
                  style={{ color: "var(--brand-primary)" }}
                  strokeWidth={1.75}
                />
              </div>

              {/* Title */}
              <h3
                className="mb-3 text-lg font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--brand-heading)",
                }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--brand-text)",
                }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
