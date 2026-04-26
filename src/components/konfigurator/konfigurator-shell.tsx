"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  // Scroll-to-top bei Step-Wechsel (nur wenn weiter als der sticky Progress)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const progressHeight = 64 + 64; // Header + ProgressBar
    if (window.scrollY > progressHeight) {
      window.scrollTo({
        top: progressHeight - 8,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  }, [step, reduceMotion]);

  if (init.isError) {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center bg-[var(--konfig-canvas)]">
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-[var(--destructive)]" />
          <h2 className="heading-sub">Konfigurator konnte nicht geladen werden</h2>
          <p className="text-caption mt-3">
            {init.error instanceof Error ? init.error.message : "Unbekannter Fehler"}
          </p>
          <button
            onClick={() => init.refetch()}
            className="mt-6 rounded-full border-2 border-[var(--brand-primary)] px-6 py-2 text-sm font-semibold text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  // Step-Transition Variants
  const stepVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };

  return (
    <div className="relative bg-[var(--konfig-canvas)] pt-12 sm:pt-20">
      <ProgressBar />

      <div className="mx-auto flex max-w-7xl">
        {/* Main column — min-height stabilisiert das Layout beim Step-Wechsel,
            sodass der Footer auch bei kurzen Steps unten bleibt.
            Rechnung: 100vh − (Header 64px + Progress 72px + Footer-Bereich ~160px). */}
        <main className="flex min-h-[calc(100vh-20rem)] flex-1 flex-col">
          {init.isLoading ? (
            <div className="mx-auto w-full max-w-3xl px-6 py-16">
              <div className="h-8 w-48 animate-pulse rounded bg-muted" />
              <div className="mt-4 h-4 w-96 animate-pulse rounded bg-muted" />
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="h-20 animate-pulse rounded bg-muted" />
                <div className="h-20 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                variants={stepVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                transition={{
                  duration: reduceMotion ? 0 : 0.32,
                  ease: [0.2, 0.9, 0.3, 1.1],
                }}
                className="flex-1"
              >
                {step === 1 && init.data && <StepMasse init={init.data} />}
                {step === 2 && init.data && <StepOeffnungsart init={init.data} />}
                {step === 3 && init.data && <StepProfil init={init.data} />}
                {step === 4 && init.data && <StepKonfiguration init={init.data} />}
                {step === 5 && init.data && <StepAnfrage init={init.data} />}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* Desktop sidebar */}
        {init.data && <SummarySidebar init={init.data} />}
      </div>

      {/* Spacer damit auch auf kurzen Steps genug Luft zum Footer bleibt */}
      <div className="h-24 lg:h-16" aria-hidden="true" />
    </div>
  );
}
