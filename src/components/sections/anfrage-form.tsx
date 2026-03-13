"use client";

import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FormData {
  vorname: string;
  nachname: string;
  firma: string;
  email: string;
  nachricht: string;
}

export default function AnfrageForm() {
  const [form, setForm] = useState<FormData>({
    vorname: "",
    nachname: "",
    firma: "",
    email: "",
    nachricht: "",
  });

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
      className="w-full py-20 sm:py-28 lg:py-32"
      style={{ backgroundColor: "var(--brand-light)" }}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section heading */}
        <div className="mb-14 text-center sm:mb-20" data-animate="fade-up">
          <h2 className="heading-section">
            Anfrage{" "}
            <span className="text-gradient">senden</span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-lg text-[var(--brand-text)]/80"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Wir beraten Sie gerne — kostenlos und unverbindlich
          </p>
        </div>

        {/* Content grid: form + sidebar */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-2" data-animate="fade-up">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white p-8 shadow-lg sm:p-10"
            >
              {/* Name row */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="vorname"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--brand-heading)",
                    }}
                  >
                    Vorname
                  </label>
                  <Input
                    id="vorname"
                    name="vorname"
                    type="text"
                    placeholder="Max"
                    value={form.vorname}
                    onChange={handleChange}
                    className="h-12 rounded-xl px-4 text-base focus-visible:border-[var(--brand-primary)] focus-visible:ring-[var(--brand-primary)]/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="nachname"
                    className="mb-2 block text-sm font-semibold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--brand-heading)",
                    }}
                  >
                    Nachname
                  </label>
                  <Input
                    id="nachname"
                    name="nachname"
                    type="text"
                    placeholder="Mustermann"
                    value={form.nachname}
                    onChange={handleChange}
                    className="h-12 rounded-xl px-4 text-base focus-visible:border-[var(--brand-primary)] focus-visible:ring-[var(--brand-primary)]/30"
                  />
                </div>
              </div>

              {/* Firma */}
              <div className="mt-6">
                <label
                  htmlFor="firma"
                  className="mb-2 block text-sm font-semibold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--brand-heading)",
                  }}
                >
                  Firma{" "}
                  <span className="font-normal text-[var(--brand-text)]/50">
                    (optional)
                  </span>
                </label>
                <Input
                  id="firma"
                  name="firma"
                  type="text"
                  placeholder="Firma GmbH"
                  value={form.firma}
                  onChange={handleChange}
                  className="h-12 rounded-xl px-4 text-base focus-visible:border-[var(--brand-primary)] focus-visible:ring-[var(--brand-primary)]/30"
                />
              </div>

              {/* E-Mail */}
              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--brand-heading)",
                  }}
                >
                  E-Mail Adresse <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="max@beispiel.de"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="h-12 rounded-xl px-4 text-base focus-visible:border-[var(--brand-primary)] focus-visible:ring-[var(--brand-primary)]/30"
                />
              </div>

              {/* Nachricht */}
              <div className="mt-6">
                <label
                  htmlFor="nachricht"
                  className="mb-2 block text-sm font-semibold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--brand-heading)",
                  }}
                >
                  Nachricht <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="nachricht"
                  name="nachricht"
                  placeholder="Beschreiben Sie Ihr Anliegen — z.B. gewünschte Fensterart, Maße, Anzahl..."
                  required
                  rows={5}
                  value={form.nachricht}
                  onChange={handleChange}
                  className="min-h-[140px] rounded-xl px-4 py-3 text-base focus-visible:border-[var(--brand-primary)] focus-visible:ring-[var(--brand-primary)]/30"
                />
              </div>

              {/* Submit */}
              <div className="mt-8">
                <Button
                  type="submit"
                  className="bg-brand-gradient min-h-[44px] w-full rounded-xl px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-100 sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Anfrage senden
                </Button>
              </div>
            </form>
          </div>

          {/* Contact sidebar */}
          <div className="lg:col-span-1" data-animate="fade-up">
            <div className="sticky top-28 rounded-2xl bg-white p-8 shadow-lg sm:p-10">
              <h3
                className="mb-6 text-xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--brand-heading)",
                }}
              >
                Direkter Kontakt
              </h3>
              <p
                className="mb-8 text-sm leading-relaxed text-[var(--brand-text)]/70"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Sie möchten uns lieber direkt erreichen? Kein Problem — rufen
                Sie an oder schreiben Sie uns eine E-Mail.
              </p>

              <ul className="space-y-6">
                {/* Phone */}
                <li>
                  <a
                    href="tel:015116804054"
                    className="group flex items-start gap-4 transition-colors"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:bg-[var(--brand-primary)]"
                      style={{
                        backgroundColor: "rgba(0, 159, 227, 0.1)",
                      }}
                    >
                      <Phone
                        className="h-5 w-5 transition-colors group-hover:text-white"
                        style={{ color: "var(--brand-primary)" }}
                      />
                    </div>
                    <div>
                      <span
                        className="block text-xs font-semibold uppercase tracking-wide text-[var(--brand-text)]/50"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Telefon
                      </span>
                      <span
                        className="mt-0.5 block text-base font-medium text-[var(--brand-heading)] group-hover:text-[var(--brand-primary)]"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        0151 16804054
                      </span>
                    </div>
                  </a>
                </li>

                {/* Email */}
                <li>
                  <a
                    href="mailto:info@passende-fenster.de"
                    className="group flex items-start gap-4 transition-colors"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:bg-[var(--brand-primary)]"
                      style={{
                        backgroundColor: "rgba(0, 159, 227, 0.1)",
                      }}
                    >
                      <Mail
                        className="h-5 w-5 transition-colors group-hover:text-white"
                        style={{ color: "var(--brand-primary)" }}
                      />
                    </div>
                    <div>
                      <span
                        className="block text-xs font-semibold uppercase tracking-wide text-[var(--brand-text)]/50"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        E-Mail
                      </span>
                      <span
                        className="mt-0.5 block text-base font-medium text-[var(--brand-heading)] group-hover:text-[var(--brand-primary)]"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        info@passende-fenster.de
                      </span>
                    </div>
                  </a>
                </li>

                {/* Address */}
                <li>
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: "rgba(0, 159, 227, 0.1)",
                      }}
                    >
                      <MapPin
                        className="h-5 w-5"
                        style={{ color: "var(--brand-primary)" }}
                      />
                    </div>
                    <div>
                      <span
                        className="block text-xs font-semibold uppercase tracking-wide text-[var(--brand-text)]/50"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Adresse
                      </span>
                      <span
                        className="mt-0.5 block text-base leading-relaxed text-[var(--brand-heading)]"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        Vor der Seelhorst 82c
                        <br />
                        30519 Hannover
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
