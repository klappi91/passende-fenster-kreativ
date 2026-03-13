"use client";

import Link from "next/link";
import { Wrench, Package, Truck } from "lucide-react";

interface Service {
  name: string;
  price: string;
  unit: string;
  detail?: string;
  category: "montage" | "material" | "sonstige";
}

const services: Service[] = [
  {
    name: "Fenster Montage Neubau",
    price: "30–35",
    unit: "EUR/Lfm",
    detail: "inkl. Schrauben und Schaum",
    category: "montage",
  },
  {
    name: "Fenster-Montage Verblender/Klinker",
    price: "37–40",
    unit: "EUR/Lfm",
    detail: "inkl. Schrauben, Konsole und Schaum",
    category: "montage",
  },
  {
    name: "Aufbaurollladen Montage",
    price: "40",
    unit: "EUR/Stk",
    detail: "bis 2M",
    category: "montage",
  },
  {
    name: "Aufsatzrollladen Montage",
    price: "50",
    unit: "EUR/Stk",
    detail: "bis 2M",
    category: "montage",
  },
  {
    name: "Raffstore Montage",
    price: "80",
    unit: "EUR/Stk",
    detail: "bis 2M",
    category: "montage",
  },
  {
    name: "Fensterband / Dichtband",
    price: "6",
    unit: "EUR/Lfm",
    category: "material",
  },
  {
    name: "Silikon",
    price: "5",
    unit: "EUR/Lfm",
    category: "material",
  },
  {
    name: "Leisten weiß",
    price: "4",
    unit: "EUR/Lfm",
    category: "material",
  },
  {
    name: "Fenster Demontage",
    price: "10",
    unit: "EUR/Lfm",
    category: "sonstige",
  },
  {
    name: "Fahrtkosten ab 50km",
    price: "65",
    unit: "EUR/Fahrt",
    category: "sonstige",
  },
  {
    name: "Fenster Aufmaß",
    price: "35",
    unit: "EUR/Stunde",
    category: "sonstige",
  },
];

const categories = [
  {
    key: "montage" as const,
    label: "Montage",
    icon: Wrench,
    accent: "var(--brand-primary)",
  },
  {
    key: "material" as const,
    label: "Material",
    icon: Package,
    accent: "var(--brand-secondary)",
  },
  {
    key: "sonstige" as const,
    label: "Sonstige",
    icon: Truck,
    accent: "var(--brand-accent)",
  },
];

function ServiceCard({ service }: { service: Service }) {
  const cat = categories.find((c) => c.key === service.category);
  const accentColor = cat?.accent || "var(--brand-primary)";

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-400 hover:border-white/20 hover:bg-white/10"
      data-animate="fade-up"
    >
      {/* Accent top border */}
      <div
        className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        style={{ background: accentColor }}
      />

      {/* Service name */}
      <h4
        className="text-base font-semibold leading-snug text-white sm:text-lg"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {service.name}
      </h4>

      {/* Price — large and prominent */}
      <div className="mt-4 flex items-baseline gap-2">
        <span
          className="text-3xl font-bold sm:text-4xl"
          style={{ color: accentColor }}
        >
          {service.price}
        </span>
        <span
          className="text-sm text-white/50"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {service.unit}
        </span>
      </div>

      {/* Detail / what's included */}
      {service.detail && (
        <p
          className="mt-3 text-sm text-white/60"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {service.detail}
        </p>
      )}

      {/* Subtle decorative circle */}
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-10"
        style={{ background: accentColor }}
      />
    </div>
  );
}

export default function Dienstleistungen() {
  return (
    <section
      id="dienstleistungen"
      className="bg-dark-section relative overflow-hidden py-24 sm:py-32"
    >
      {/* Background decorative elements */}
      <div
        className="pointer-events-none absolute top-0 left-0 h-full w-full"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(0,159,227,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(61,102,174,0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="mb-16 max-w-3xl sm:mb-20">
          <h2
            className="heading-section text-balance text-white"
            style={{ color: "#ffffff" }}
          >
            Unsere{" "}
            <span className="text-gradient">Dienstleistungen</span>
          </h2>
          <p
            className="mt-4 text-lg text-white/60 sm:text-xl"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Preisliste 2022 — Alle Preise zzgl. MwSt.
          </p>
        </div>

        {/* Category groups */}
        <div className="space-y-16">
          {categories.map((category) => {
            const Icon = category.icon;
            const categoryServices = services.filter(
              (s) => s.category === category.key
            );

            return (
              <div key={category.key}>
                {/* Category header */}
                <div className="mb-8 flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background: `${category.accent}20`,
                      border: `1px solid ${category.accent}40`,
                    }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: category.accent }}
                    />
                  </div>
                  <h3
                    className="text-xl font-bold text-white sm:text-2xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {category.label}
                  </h3>
                  {/* Decorative line */}
                  <div className="hidden h-px flex-1 bg-white/10 sm:block" />
                </div>

                {/* Service cards grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryServices.map((service) => (
                    <ServiceCard key={service.name} service={service} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/anfrage"
            className="group inline-flex items-center gap-3 rounded-xl bg-brand-gradient px-10 py-5 text-lg font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand-primary)]/40"
          >
            Jetzt Anfrage senden
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
