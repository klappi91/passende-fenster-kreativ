import type { Metadata } from "next";
import { KonfiguratorShell } from "@/components/konfigurator/konfigurator-shell";
import { MobileBottomSheetWrapper } from "@/components/konfigurator/mobile-bottom-sheet-wrapper";

export const metadata: Metadata = {
  title: "Fenster konfigurieren — Maße → passende Profile | Passende-Fenster",
  description:
    "Gib deine Maße ein und finde das passende PVC-Fenster-Profil mit transparentem Preis. 6 Profile von Salamander, Aluplast und Gealan im Live-Vergleich.",
  openGraph: {
    title: "Fenster konfigurieren | Passende-Fenster",
    description:
      "Maße eingeben, passende Profile vergleichen, unverbindliches Angebot anfordern.",
    type: "website",
    locale: "de_DE",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function KonfiguratorPage() {
  return (
    <>
      <KonfiguratorShell />
      <MobileBottomSheetWrapper />
    </>
  );
}
