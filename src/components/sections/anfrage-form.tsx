"use client";

import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

interface FormData {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  nachricht: string;
}

const initial: FormData = {
  vorname: "",
  nachname: "",
  email: "",
  telefon: "",
  nachricht: "",
};

const brand = {
  phone: "0151 16804054",
  email: "info@passende-fenster.de",
  address: { street: "Vor der Seelhorst 82c", city: "30519 Hannover" },
};

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: "phone" | "mail" | "pin";
  label: string;
  value: string;
  href?: string;
}) {
  const Icon =
    icon === "phone" ? Phone : icon === "mail" ? Mail : MapPin;
  const commonStyle: React.CSSProperties = {
    padding: "14px 18px",
    minHeight: 44,
    borderRadius: 14,
    background: "rgba(255,255,255,0.14)",
    backdropFilter: "saturate(160%) blur(16px)",
    WebkitBackdropFilter: "saturate(160%) blur(16px)",
    border: "1px solid rgba(255,255,255,0.28)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.4), 0 10px 30px -14px rgba(0,0,0,0.25)",
  };
  const Inner = (
    <>
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "inherit",
          background:
            "linear-gradient(125deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 45%)",
        }}
      />
      <span
        className="relative grid h-11 w-11 place-items-center rounded-[12px] text-white"
        style={{
          background: "rgba(255,255,255,0.2)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="relative">
        <span
          className="mono up block text-[10px]"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {label}
        </span>
        <span
          className="block text-[15px]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="relative grid items-center gap-4 overflow-hidden text-white"
        style={{
          ...commonStyle,
          gridTemplateColumns: "44px 1fr",
        }}
      >
        {Inner}
      </a>
    );
  }
  return (
    <div
      className="relative grid items-center gap-4 overflow-hidden text-white"
      style={{
        ...commonStyle,
        gridTemplateColumns: "44px 1fr",
      }}
    >
      {Inner}
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span
        className="mono up text-[10px]"
        style={{ color: "var(--brand-heading)" }}
      >
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="text-[15px] outline-none"
        style={{
          padding: "14px 16px",
          minHeight: 44,
          borderRadius: 12,
          border: "1px solid var(--brand-border)",
          fontFamily: "var(--font-sans)",
          color: "var(--brand-heading)",
          background: "#fff",
        }}
      />
    </label>
  );
}

export default function AnfrageForm() {
  const [form, setForm] = useState<FormData>(initial);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    alert(
      "Vielen Dank für Ihre Anfrage! Wir melden uns schnellstmöglich bei Ihnen."
    );
  }

  return (
    <section
      id="anfrage"
      className="relative overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
        padding: "clamp(72px, 10vw, 140px) clamp(24px, 5vw, 72px)",
      }}
    >
      <div className="relative mx-auto max-w-[1440px]">
        <div
          className="pf-anf-grid grid gap-[clamp(32px,5vw,80px)]"
          style={{ gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)" }}
        >
          <div>
            <div
              className="mono up mb-4 text-[11px]"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              ‹ 06 › Anfrage
            </div>
            <h2
              className="m-0"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(38px, 5.5vw, 78px)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
            >
              Reden wir
              <br />
              über Ihr
              <br />
              <em style={{ fontWeight: 500, fontStyle: "italic" }}>
                Bauvorhaben.
              </em>
            </h2>
            <p
              className="m-0"
              style={{
                marginTop: 24,
                marginBottom: 32,
                fontSize: 18,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.85)",
                maxWidth: "38ch",
              }}
            >
              Kostenlos, unverbindlich und in der Regel innerhalb von 24
              Stunden.
            </p>

            <div className="grid gap-3.5">
              <ContactRow
                icon="phone"
                label="Telefon"
                value={brand.phone}
                href={`tel:${brand.phone.replace(/\s/g, "")}`}
              />
              <ContactRow
                icon="mail"
                label="E-Mail"
                value={brand.email}
                href={`mailto:${brand.email}`}
              />
              <ContactRow
                icon="pin"
                label="Werkstatt"
                value={`${brand.address.street}, ${brand.address.city}`}
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid content-start gap-4.5"
            style={{
              background: "#fff",
              color: "var(--brand-text)",
              borderRadius: 24,
              padding: "clamp(24px, 3.5vw, 44px)",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.3)",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: "-0.015em",
                color: "var(--brand-heading)",
                marginBottom: 4,
              }}
            >
              Anfrage senden
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Input
                label="Vorname"
                name="vorname"
                value={form.vorname}
                onChange={handleChange}
                placeholder="Max"
              />
              <Input
                label="Nachname"
                name="nachname"
                value={form.nachname}
                onChange={handleChange}
                placeholder="Mustermann"
              />
            </div>
            <Input
              label="E-Mail"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="max@beispiel.de"
              type="email"
              required
            />
            <Input
              label="Telefon (optional)"
              name="telefon"
              value={form.telefon}
              onChange={handleChange}
              placeholder="0151 …"
              type="tel"
            />
            <label className="grid gap-1.5">
              <span
                className="mono up text-[10px]"
                style={{ color: "var(--brand-heading)" }}
              >
                Nachricht
              </span>
              <textarea
                name="nachricht"
                value={form.nachricht}
                onChange={handleChange}
                rows={4}
                placeholder="z. B. 4 Fenster, 1.200 × 1.400 mm, Gealan S 9000, Mahagoni außen …"
                className="w-full resize-y text-[15px] outline-none"
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid var(--brand-border)",
                  fontFamily: "var(--font-sans)",
                  color: "var(--brand-heading)",
                  background: "#fff",
                }}
              />
            </label>
            <button
              type="submit"
              className="mt-1.5 flex items-center justify-center gap-2.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.01]"
              style={{
                padding: "16px 20px",
                minHeight: 44,
                borderRadius: 12,
                background: "var(--brand-dark)",
                fontFamily: "var(--font-display)",
              }}
            >
              Anfrage abschicken
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
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          .pf-anf-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
