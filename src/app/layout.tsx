import type { Metadata } from "next";
import { Poppins, Lato, JetBrains_Mono } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Passende-Fenster.de – Fenster und Türen für jeden Geschmack",
  description:
    "Passende Fenster und Türen für jeden Geschmack. Große Auswahl an Profil-Systemen von Schüco, Gealan, Aluplast, Deceuninck und Salamander. Konfigurator, Montage-Service und deutschlandweite Lieferung.",
  keywords: [
    "Fenster kaufen",
    "Türen kaufen",
    "Fenster online",
    "Fenster Konfigurator",
    "Schüco Fenster",
    "Gealan Fenster",
    "Aluplast Fenster",
    "Fenster Hannover",
    "Fenster Montage",
  ],
  openGraph: {
    title: "Passende-Fenster.de – Fenster und Türen für jeden Geschmack",
    description:
      "Große Auswahl an Profil-Systemen. Konfigurator, Montage-Service und deutschlandweite Lieferung.",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${poppins.variable} ${lato.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:rounded-md focus:bg-[var(--brand-primary)] focus:px-4 focus:py-2 focus:text-white"
        >
          Zum Hauptinhalt springen
        </a>
        <QueryProvider>
          <Header />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
