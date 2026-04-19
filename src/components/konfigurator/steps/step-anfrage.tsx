"use client";

import { useState } from "react";
import { z } from "zod";
import { useConfigStore } from "../store";
import { useInquiryMutation, usePrice } from "@/lib/konfigurator-api";
import type { InitResponse } from "@/lib/konfigurator-types";
import { Check, AlertCircle } from "lucide-react";

const ContactSchema = z.object({
  name: z.string().min(2, "Name zu kurz"),
  email: z.string().email("Ungültige E-Mail"),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export function StepAnfrage({ init }: { init: InitResponse }) {
  const {
    articleSlug,
    width,
    height,
    groupExternalId,
    shapes,
    variantExternalId,
    selectedAdditionVariantExternalIds,
    contact,
    materialRequest,
    nonStandardSize,
    setContact,
    setStep,
    reset,
  } = useConfigStore();

  const inquiry = useInquiryMutation();
  const price = usePrice({ articleSlug, w: width, h: height, groupExternalId });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const firstShape = shapes?.flat()[0] ?? "Fest";
  const groupName = init.groups.find((g) => g.external_id === groupExternalId)?.name;

  const canSubmit =
    (materialRequest || (articleSlug && width && height && groupExternalId && shapes)) &&
    contact.email.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = ContactSchema.safeParse(contact);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }

    // Bei materialRequest: verwenden wir einen Dummy-Artikel-Slug?
    // Der POST /api/v1/inquiries erwartet einen gueltigen article_slug.
    // Fuer Sonderanfragen (Alu/Holz/nonStandard) muessen wir das per Feld
    // im configuration-JSONB markieren — API akzeptiert das, da configuration
    // frei befuellbar ist. Der article_slug bleibt derjenige aus dem Flow
    // (oder ersatzweise "streamline-76" als Marker). Das muessen wir aber
    // backend-seitig sauber machen → vorerst: wenn kein Slug, schicken wir
    // eine Mailto-Fallback-URL statt POST.
    if (!articleSlug || !groupExternalId || !width || !height) {
      // Materialanfrage ohne Profil-Wahl: mailto:
      const subject = encodeURIComponent(
        `Sonderanfrage: ${materialRequest ?? "Nicht-Standard"}`
      );
      const body = encodeURIComponent(
        [
          `Hallo Team Passende-Fenster,`,
          ``,
          materialRequest
            ? `ich interessiere mich fuer ${materialRequest === "alu" ? "Alu-" : "Holz-"}Fenster.`
            : `ich habe eine Sonderanfrage.`,
          width && height ? `Maß: ${width} × ${height} mm` : "",
          groupName ? `Aufteilung: ${groupName}` : "",
          ``,
          `Nachricht: ${contact.message ?? ""}`,
          ``,
          `Name: ${contact.name}`,
          `E-Mail: ${contact.email}`,
          contact.phone ? `Telefon: ${contact.phone}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      );
      window.location.href = `mailto:info@passende-fenster.de?subject=${subject}&body=${body}`;
      return;
    }

    await inquiry.mutateAsync({
      article_slug: articleSlug,
      width_mm: width,
      height_mm: height,
      group_external_id: groupExternalId,
      shape_code: firstShape,
      variant_external_id: variantExternalId ?? undefined,
      selected_addition_variant_external_ids:
        selectedAdditionVariantExternalIds.length
          ? selectedAdditionVariantExternalIds
          : undefined,
      total_price_cents: price.data?.base_price_cents,
      contact: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone || undefined,
        message: contact.message || undefined,
      },
    });
  };

  if (inquiry.isSuccess) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="bg-brand-gradient mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg">
            <Check className="h-8 w-8" strokeWidth={3} />
          </div>
          <h2 className="heading-konfig-step mt-6">Anfrage eingegangen</h2>
          <p className="text-caption mt-3">
            Vielen Dank. Wir melden uns innerhalb von 48 Stunden mit einem
            unverbindlichen Angebot.
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            Referenz-Nr. {inquiry.data.id}
          </p>
          <button
            type="button"
            onClick={() => {
              reset();
              setStep(1);
            }}
            className="mt-6 rounded-full border-2 border-[var(--brand-primary)] px-6 py-2 text-sm font-semibold text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5"
          >
            Neue Konfiguration starten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-12">
      <p className="heading-price-label">Schritt 5 von 5</p>
      <h2 className="heading-konfig-step mt-2">
        {materialRequest
          ? `Sonderanfrage: ${materialRequest === "alu" ? "Alu" : "Holz"}-Fenster`
          : "Unverbindliches Angebot anfordern"}
      </h2>
      <p className="text-caption mt-2 max-w-xl">
        Wir melden uns innerhalb von 48 Stunden.
      </p>

      {/* Zusammenfassung */}
      {!materialRequest && articleSlug && (
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
          <p className="heading-price-label">Ihre Konfiguration</p>
          <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-[var(--muted-foreground)]">Profil</dt>
            <dd className="font-medium">{articleSlug}</dd>
            <dt className="text-[var(--muted-foreground)]">Maße</dt>
            <dd className="font-medium">{width} × {height} mm</dd>
            <dt className="text-[var(--muted-foreground)]">Aufteilung</dt>
            <dd className="font-medium">{groupName}</dd>
            {selectedAdditionVariantExternalIds.length > 0 && (
              <>
                <dt className="text-[var(--muted-foreground)]">Zubehör</dt>
                <dd className="font-medium">
                  {selectedAdditionVariantExternalIds.length} gewählt
                </dd>
              </>
            )}
            {price.data && (
              <>
                <dt className="text-[var(--muted-foreground)]">Richtpreis</dt>
                <dd className="font-bold text-[var(--konfig-price)]">
                  {Math.round(price.data.base_price_eur)} €
                </dd>
              </>
            )}
          </dl>
        </div>
      )}

      {nonStandardSize && (
        <div className="mt-4 flex gap-2 rounded-xl border border-[var(--destructive)]/30 bg-white p-4 text-sm text-[var(--destructive)]">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>
            Deine Maße liegen außerhalb des Standard-Rasters. Wir behandeln deine
            Anfrage als Sonderanfrage und erstellen manuell ein Angebot.
          </p>
        </div>
      )}

      {/* Kontakt-Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <TextField
          label="Name"
          name="name"
          value={contact.name}
          onChange={(v) => setContact({ name: v })}
          error={errors.name}
          required
          autoComplete="name"
        />
        <TextField
          label="E-Mail"
          name="email"
          type="email"
          value={contact.email}
          onChange={(v) => setContact({ email: v })}
          error={errors.email}
          required
          autoComplete="email"
        />
        <TextField
          label="Telefon"
          name="phone"
          type="tel"
          value={contact.phone}
          onChange={(v) => setContact({ phone: v })}
          autoComplete="tel"
          helper="Optional — erleichtert die Rückfrage"
        />
        <TextareaField
          label="Nachricht"
          name="message"
          value={contact.message}
          onChange={(v) => setContact({ message: v })}
          helper="z.B. Einbau-Wunschtermin, besondere Anforderungen"
        />

        {inquiry.isError && (
          <div className="rounded-xl border border-[var(--destructive)]/30 bg-white p-4 text-sm text-[var(--destructive)]">
            Anfrage konnte nicht gesendet werden:{" "}
            {inquiry.error instanceof Error ? inquiry.error.message : "Unbekannt"}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setStep(materialRequest ? 3 : 4)}
            className="text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--brand-primary)]"
          >
            ← Zurück
          </button>
          <button
            type="submit"
            disabled={!canSubmit || inquiry.isPending}
            className="bg-brand-gradient konfig-animate inline-flex items-center rounded-full px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {inquiry.isPending ? "Sende …" : "Anfrage senden"}
          </button>
        </div>

        <p className="text-xs text-[var(--muted-foreground)]">
          Antwort innerhalb 48 Stunden · Unverbindlich · Keine Daten an Dritte
        </p>
      </form>
    </div>
  );
}

function TextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  autoComplete,
  helper,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[var(--brand-heading)]">
        {label} {required && <span className="text-[var(--destructive)]">*</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--konfig-stroke)] ${
          error ? "border-[var(--destructive)]" : "border-[var(--border)]"
        }`}
      />
      {(error || helper) && (
        <p
          className={`mt-1 text-xs ${
            error ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"
          }`}
        >
          {error ?? helper}
        </p>
      )}
    </label>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
  helper,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[var(--brand-heading)]">
        {label}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-xl border-2 border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--konfig-stroke)]"
      />
      {helper && (
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">{helper}</p>
      )}
    </label>
  );
}
