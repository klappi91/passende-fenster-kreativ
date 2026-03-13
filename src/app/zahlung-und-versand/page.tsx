import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Zahlung und Versand – Passende-Fenster.de",
};

export default function ZahlungUndVersandPage() {
  return (
    <LegalLayout title="Zahlung und Versand">
      <h2>Es gelten folgende Bedingungen:</h2>
      <p>Die Lieferung erfolgt nur im Inland (Deutschland).</p>
      <p>Der Versand auf deutsche Inseln ist ausgeschlossen.</p>

      <h3>Versandkosten (inklusive gesetzliche Mehrwertsteuer)</h3>
      <p>
        Wir berechnen die Versandkosten nach dem Bestellwert
        (Bruttowarenwert): <strong>59,50 &euro;</strong>
      </p>
      <p>
        Ab einem Bestellwert von <strong>1.000,00 &euro;</strong> liefern wir
        versandkostenfrei.
      </p>

      <h3>Lieferfristen</h3>
      <p>
        Soweit im jeweiligen Angebot keine andere Frist angegeben ist, erfolgt
        die Lieferung der Ware im Inland (Deutschland) innerhalb von 3-7
        Tagen nach Vertragsschluss (bei vereinbarter Vorauszahlung nach dem
        Zeitpunkt Ihrer Zahlungsanweisung).
      </p>
      <p>
        Beachten Sie, dass an Sonn- und Feiertagen keine Zustellung erfolgt.
      </p>
      <p>
        Haben Sie Artikel mit unterschiedlichen Lieferzeiten bestellt,
        versenden wir die Ware in einer gemeinsamen Sendung, sofern wir keine
        abweichenden Vereinbarungen mit Ihnen getroffen haben. Die Lieferzeit
        bestimmt sich in diesem Fall nach dem Artikel mit der längsten
        Lieferzeit, den Sie bestellt haben.
      </p>

      <h3>Akzeptierte Zahlungsmöglichkeiten</h3>
      <ul>
        <li>Vorkasse per Überweisung</li>
      </ul>
      <p>Über Stripe:</p>
      <ul>
        <li>Zahlung per Sofort/Sofortüberweisung (über Klarna)</li>
        <li>Zahlung per SEPA-Lastschrift (über Klarna)</li>
        <li>Zahlung per Kreditkarte (über Klarna)</li>
        <li>Zahlung per Kreditkarte</li>
        <li>Zahlung per Apple Pay</li>
        <li>Zahlung per Google Pay</li>
        <li>Zahlung per SEPA-Lastschrift</li>
      </ul>

      <h3>Unsere Bankverbindung</h3>
      <p>
        Passende-Fenster
        <br />
        IBAN: DE40 1001 0010 0662 2381 35
      </p>
      <p>Bei Fragen finden Sie unsere Kontaktdaten im Impressum.</p>
    </LegalLayout>
  );
}
