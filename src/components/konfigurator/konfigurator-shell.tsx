"use client";

import { useConfigStore } from "./store";
import { useInit } from "@/lib/konfigurator-api";
import { ProgressBar } from "./progress-bar";
import { StepMasse } from "./steps/step-masse";
import { StepOeffnungsart } from "./steps/step-oeffnungsart";
import { StepProfil } from "./steps/step-profil";
import { StepKonfiguration } from "./steps/step-konfiguration";
import { StepAnfrage } from "./steps/step-anfrage";
import { SummarySidebar } from "./summary-sidebar";
import { AlertCircle } from "lucide-react";

export function KonfiguratorShell() {
  const { step } = useConfigStore();
  const init = useInit();

  if (init.isError) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <AlertCircle className="mx-auto mb-4 h-10 w-10 text-[var(--destructive)]" />
        <h2 className="heading-sub">Konfigurator konnte nicht geladen werden</h2>
        <p className="mt-3 text-caption">
          {init.error instanceof Error ? init.error.message : "Unbekannter Fehler"}
        </p>
        <button
          onClick={() => init.refetch()}
          className="mt-6 rounded-full border-2 border-[var(--brand-primary)] px-6 py-2 text-sm font-semibold text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--konfig-canvas)] pt-20">
      <ProgressBar />

      <div className="mx-auto flex max-w-7xl">
        {/* Main column */}
        <main className="flex-1">
          {init.isLoading ? (
            <div className="mx-auto max-w-3xl px-6 py-16">
              <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 h-4 w-96 animate-pulse rounded bg-gray-200" />
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="h-20 animate-pulse rounded bg-gray-200" />
                <div className="h-20 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ) : (
            <>
              {step === 1 && init.data && <StepMasse init={init.data} />}
              {step === 2 && init.data && <StepOeffnungsart init={init.data} />}
              {step === 3 && init.data && <StepProfil init={init.data} />}
              {step === 4 && init.data && <StepKonfiguration init={init.data} />}
              {step === 5 && init.data && <StepAnfrage init={init.data} />}
            </>
          )}
        </main>

        {/* Desktop sidebar */}
        {init.data && (
          <SummarySidebar init={init.data} />
        )}
      </div>
    </div>
  );
}
