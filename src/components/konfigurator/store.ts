"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ShapeCode } from "@/lib/konfigurator-types";

export type StepId = 1 | 2 | 3 | 4 | 5;

export type ConfigState = {
  step: StepId;
  width: number | null;
  height: number | null;
  groupExternalId: number | null;
  // shapes[row][cell] — 2D-Array entsprechend group.shape_configuration
  shapes: ShapeCode[][] | null;
  articleSlug: string | null;
  variantExternalId: number | null;
  selectedAdditionVariantExternalIds: number[];
  contact: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  materialRequest?: "alu" | "holz";
  nonStandardSize: boolean;

  // Actions
  setMasse: (w: number | null, h: number | null) => void;
  setGroup: (externalId: number, shapeTemplate?: ShapeCode[][]) => void;
  setShapes: (s: ShapeCode[][]) => void;
  setArticleSlug: (slug: string | null) => void;
  setVariantExternalId: (id: number | null) => void;
  toggleAdditionVariant: (externalId: number) => void;
  setAdditionVariants: (ids: number[]) => void;
  setContact: (partial: Partial<ConfigState["contact"]>) => void;
  setMaterialRequest: (m: "alu" | "holz" | undefined) => void;
  setNonStandardSize: (v: boolean) => void;
  setStep: (s: StepId) => void;
  reset: () => void;
};

const initialState: Omit<
  ConfigState,
  | "setMasse"
  | "setGroup"
  | "setShapes"
  | "setArticleSlug"
  | "setVariantExternalId"
  | "toggleAdditionVariant"
  | "setAdditionVariants"
  | "setContact"
  | "setMaterialRequest"
  | "setNonStandardSize"
  | "setStep"
  | "reset"
> = {
  step: 1,
  width: null,
  height: null,
  groupExternalId: null,
  shapes: null,
  articleSlug: null,
  variantExternalId: null,
  selectedAdditionVariantExternalIds: [],
  contact: { name: "", email: "", phone: "", message: "" },
  materialRequest: undefined,
  nonStandardSize: false,
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      ...initialState,

      setMasse: (w, h) => set({ width: w, height: h }),
      setGroup: (externalId, shapeTemplate) =>
        set({
          groupExternalId: externalId,
          shapes: shapeTemplate ?? null,
          // Wechsel der Gruppe invalidiert Profil-Auswahl
          articleSlug: null,
          variantExternalId: null,
          selectedAdditionVariantExternalIds: [],
        }),
      setShapes: (shapes) => set({ shapes }),
      setArticleSlug: (articleSlug) =>
        set({
          articleSlug,
          variantExternalId: null,
          selectedAdditionVariantExternalIds: [],
        }),
      setVariantExternalId: (variantExternalId) => set({ variantExternalId }),
      toggleAdditionVariant: (externalId) =>
        set((s) => ({
          selectedAdditionVariantExternalIds:
            s.selectedAdditionVariantExternalIds.includes(externalId)
              ? s.selectedAdditionVariantExternalIds.filter((id) => id !== externalId)
              : [...s.selectedAdditionVariantExternalIds, externalId],
        })),
      setAdditionVariants: (ids) =>
        set({ selectedAdditionVariantExternalIds: ids }),
      setContact: (partial) =>
        set((s) => ({ contact: { ...s.contact, ...partial } })),
      setMaterialRequest: (materialRequest) => set({ materialRequest }),
      setNonStandardSize: (nonStandardSize) => set({ nonStandardSize }),
      setStep: (step) => set({ step }),
      reset: () => set({ ...initialState }),
    }),
    {
      name: "pf-konfigurator-v1",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      partialize: (state) => ({
        step: state.step,
        width: state.width,
        height: state.height,
        groupExternalId: state.groupExternalId,
        shapes: state.shapes,
        articleSlug: state.articleSlug,
        variantExternalId: state.variantExternalId,
        selectedAdditionVariantExternalIds: state.selectedAdditionVariantExternalIds,
        contact: state.contact,
        materialRequest: state.materialRequest,
        nonStandardSize: state.nonStandardSize,
      }),
      version: 1,
    }
  )
);
