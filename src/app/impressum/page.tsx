import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Impressum – Passende-Fenster.de",
};

export default function ImpressumPage() {
  return (
    <LegalLayout title="Impressum">
      <h2>Gesetzliche Anbieterkennung:</h2>
      <p>
        Alexander Azov
        <br />
        Passende-Fenster.de
        <br />
        Vor der Seelhorst 82c
        <br />
        30519 Hannover
        <br />
        Deutschland
      </p>
      <p>
        Telefon: 0151 16804054
        <br />
        E-Mail: info@passende-fenster.de
      </p>
      <p>USt-IdNr.: DE299218795</p>
      <p>Zuständiges Finanzamt: Finanzamt Nord</p>
      <p>Zuständiges Gericht: Amtsgericht Hannover</p>

      <h2>Alternative Streitbeteiligung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform für die
        außergerichtliche Online-Streitbeilegung (OS-Plattform) bereit,
        aufrufbar unter{" "}
        <a
          href="https://ec.europa.eu/odr"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ec.europa.eu/odr
        </a>
        .
      </p>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an
        Streitbeilegungsverfahren vor Verbraucherschlichtungsstellen
        teilzunehmen.
      </p>
      <p>
        Wir sind seit 04.02.2019 Mitglied der Initiative &bdquo;FairCommerce&ldquo;.
      </p>
      <p>
        Nähere Informationen hierzu finden Sie unter{" "}
        <a
          href="https://www.haendlerbund.de/faircommerce"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.haendlerbund.de/faircommerce
        </a>
      </p>
    </LegalLayout>
  );
}
