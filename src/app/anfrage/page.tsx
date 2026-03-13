import type { Metadata } from "next";
import AnfrageForm from "@/components/sections/anfrage-form";

export const metadata: Metadata = {
  title: "Anfrage senden – Passende-Fenster.de",
  description:
    "Senden Sie uns Ihre Anfrage für Fenster und Türen. Kostenlose und unverbindliche Beratung von Passende-Fenster.de in Hannover.",
};

export default function AnfragePage() {
  return (
    <main className="pt-24">
      <AnfrageForm />
    </main>
  );
}
