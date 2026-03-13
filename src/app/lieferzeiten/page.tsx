import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Lieferzeiten – Passende-Fenster.de",
};

export default function LieferzeitenPage() {
  return (
    <LegalLayout title="Lieferzeiten">
      <p>
        Folgende Lieferzeiten können Sie erwarten, je nach bestellter
        Konfiguration:
      </p>

      <div className="not-prose my-8 overflow-hidden rounded-xl border border-[var(--border)]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--brand-primary)] text-white">
              <th className="px-6 py-4 font-semibold">Konfiguration</th>
              <th className="px-6 py-4 font-semibold">Lieferzeit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            <tr className="hover:bg-[var(--muted)]">
              <td className="px-6 py-4">Kunststoff, weiß</td>
              <td className="px-6 py-4 font-semibold">2-5 Wochen</td>
            </tr>
            <tr className="hover:bg-[var(--muted)]">
              <td className="px-6 py-4">Kunststoff, anthrazit</td>
              <td className="px-6 py-4 font-semibold">3-6 Wochen</td>
            </tr>
            <tr className="hover:bg-[var(--muted)]">
              <td className="px-6 py-4">Kunststoff, andere Farben</td>
              <td className="px-6 py-4 font-semibold">4-6 Wochen</td>
            </tr>
            <tr className="hover:bg-[var(--muted)]">
              <td className="px-6 py-4">
                Mit Schallschutz, RS2 etc. Option
              </td>
              <td className="px-6 py-4 font-semibold">3-6 Wochen</td>
            </tr>
          </tbody>
        </table>
      </div>
    </LegalLayout>
  );
}
