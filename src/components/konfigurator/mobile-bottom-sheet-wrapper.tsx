"use client";

import { useInit } from "@/lib/konfigurator-api";
import { MobileBottomSheet } from "./mobile-bottom-sheet";

export function MobileBottomSheetWrapper() {
  const init = useInit();
  if (!init.data) return null;
  return <MobileBottomSheet init={init.data} />;
}
