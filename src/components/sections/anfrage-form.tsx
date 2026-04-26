"use client";

import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Check, AlertTriangle } from "lucide-react";

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

const CONTACT_ROW_STYLE: React.CSSProperties = {
  ["--glass-blur" as string]: "16px",
  padding: "14px 18px",
  minHeight: 44,
  borderRadius: 14,
  background: "var(--glass-dark-edge)",
  backdropFilter: "saturate(160%) blur(var(--glass-blur, 16px))",
  WebkitBackdropFilter: "saturate(160%) blur(var(--glass-blur, 16px))",
  border: "1px solid rgba(255,255,255,0.28)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.4), 0 10px 30px -14px rgba(0,0,0,0.25)",
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
        className="pf-anf-contact-row relative grid items-center gap-4 overflow-hidden text-white"
        style={{
          ...CONTACT_ROW_STYLE,
          gridTemplateColumns: "44px minmax(0,1fr)",
        }}
      >
        {Inner}
      </a>
    );
  }
  return (
    <div
      className="pf-anf-contact-row relative grid items-center gap-4 overflow-hidden text-white"
      style={{
        ...CONTACT_ROW_STYLE,
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
  hint,
}: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  const hintId = hint ? `contact-${name}-hint` : undefined;
  return (
    <label className="grid gap-1.5">
      <span
        className="mono up text-[10px]"
        style={{ color: "var(--brand-heading)" }}
      >
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: "var(--brand-primary)" }}>
            {" *"}
          </span>
        )}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-required={required || undefined}
        aria-describedby={hintId}
        className="text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        style={{
          padding: "14px 16px",
          minHeight: 44,
          borderRadius: 12,
          border: "1px solid var(--brand-border)",
          fontFamily: "var(--font-sans)",
          color: "var(--brand-heading)",
          background: "var(--surface-card)",
        }}
      />
      {hint && (
        <span
          id={hintId}
          className="text-[12px]"
          style={{ color: "var(--muted-foreground)" }}
        >
          {hint}
        </span>
      )}
    </label>
  );
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function AnfrageForm() {
  const [form, setForm] = useState<FormData>(initial);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let payload: { ok?: boolean; error?: string } | null = null;
      try {
        payload = (await res.json()) as { ok?: boolean; error?: string };
      } catch {
        payload = null;
      }

      if (!res.ok || !payload?.ok) {
        const fallback =
          res.status === 400
            ? "Eingaben prüfen — E-Mail-Format und Pflichtfelder."
            : "Senden fehlgeschlagen. Bitte erneut versuchen oder direkt anrufen.";
        setErrorMessage(payload?.error ?? fallback);
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage(
        "Keine Verbindung zum Server. Internetverbindung prüfen oder direkt anrufen."
      );
      setStatus("error");
    }
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
                color: "var(--brand-light)",
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
              Kostenlos, unverbindlich, Antwort innerhalb von 24 Stunden.
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

          {status === "success" ? (
            <div
              role="status"
              aria-live="polite"
              className="grid content-start gap-4"
              style={{
                background: "var(--surface-card)",
                color: "var(--brand-text)",
                borderRadius: 24,
                padding: "clamp(24px, 3.5vw, 44px)",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.3)",
              }}
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-full"
                style={{
                  background: "color-mix(in srgb, var(--brand-primary) 14%, white)",
                  color: "var(--brand-primary)",
                  border: "1px solid var(--brand-border)",
                }}
                aria-hidden
              >
                <Check className="h-6 w-6" strokeWidth={2.5} />
              </span>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 24,
                  letterSpacing: "-0.015em",
                  color: "var(--brand-heading)",
                }}
              >
                Anfrage eingegangen
              </div>
              <p
                className="m-0"
                style={{
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "var(--brand-text)",
                }}
              >
                Wir melden uns innerhalb von 24 Stunden persönlich. Bei
                dringenden Anliegen erreichen Sie uns unter{" "}
                <a
                  href={`tel:${brand.phone.replace(/\s/g, "")}`}
                  style={{
                    color: "var(--brand-primary)",
                    textDecoration: "underline",
                  }}
                >
                  {brand.phone}
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              aria-busy={status === "submitting"}
              className="grid content-start gap-4.5"
              style={{
                background: "var(--surface-card)",
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
                  className="w-full resize-y text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1px solid var(--brand-border)",
                    fontFamily: "var(--font-sans)",
                    color: "var(--brand-heading)",
                    background: "var(--surface-card)",
                  }}
                />
              </label>
              {status === "error" && errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2 text-[13px]"
                  style={{
                    color: "var(--destructive, #b3261e)",
                    background:
                      "color-mix(in srgb, var(--destructive, #b3261e) 8%, white)",
                    border:
                      "1px solid color-mix(in srgb, var(--destructive, #b3261e) 30%, white)",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                >
                  <AlertTriangle
                    className="mt-[1px] h-4 w-4 shrink-0"
                    aria-hidden
                  />
                  <span>{errorMessage}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-1.5 flex items-center justify-center gap-2.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-dark)]"
                style={{
                  padding: "16px 20px",
                  minHeight: 44,
                  borderRadius: 12,
                  background: "var(--brand-dark)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {status === "submitting" ? "Wird gesendet…" : "Anfrage abschicken"}
                {status !== "submitting" && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .pf-anf-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
