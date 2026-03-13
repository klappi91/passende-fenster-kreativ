"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Fenster-Systeme", href: "/#fenster-systeme" },
  { label: "Dienstleistungen", href: "/dienstleistungen" },
  { label: "Konfigurator", href: "/#konfigurator" },
  { label: "Anfrage", href: "/anfrage" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-lg backdrop-blur-md"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="relative z-10 flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/logo.png"
            alt="Passende-Fenster.de Logo"
            width={44}
            height={44}
            className="h-10 w-auto sm:h-11"
            priority
          />
          <span
            className={`hidden text-lg font-bold tracking-tight transition-colors duration-300 sm:inline-block ${
              scrolled ? "text-[var(--brand-heading)]" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            Passende-Fenster.de
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-[var(--brand-primary)]/10 ${
                scrolled
                  ? "text-[var(--brand-text)] hover:text-[var(--brand-primary)]"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Phone link */}
          <a
            href="tel:015116804054"
            className={`ml-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              scrolled
                ? "text-[var(--brand-text)] hover:text-[var(--brand-primary)]"
                : "text-white/90 hover:text-white"
            }`}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">0151 16804054</span>
          </a>

          {/* CTA Button */}
          <Link
            href="/#konfigurator"
            className="bg-brand-gradient ml-3 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-100"
          >
            Jetzt konfigurieren
          </Link>
        </nav>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="tel:015116804054"
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors ${
              scrolled
                ? "text-[var(--brand-primary)]"
                : "text-white"
            }`}
            aria-label="Anrufen"
          >
            <Phone className="h-5 w-5" />
          </a>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors ${
                scrolled
                  ? "text-[var(--brand-heading)]"
                  : "text-white"
              }`}
              aria-label="Navigation öffnen"
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent side="right" className="w-full max-w-sm border-l-0 p-0">
              <SheetHeader className="border-b border-[var(--border)] px-6 py-5">
                <SheetTitle className="text-lg font-bold text-[var(--brand-heading)]" style={{ fontFamily: "var(--font-display)" }}>
                  Navigation
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col px-4 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[44px] items-center rounded-xl px-4 text-base font-medium text-[var(--brand-text)] transition-colors hover:bg-[var(--brand-light)] hover:text-[var(--brand-primary)]"
                  >
                    {item.label}
                  </Link>
                ))}

                <a
                  href="tel:015116804054"
                  className="mt-2 flex min-h-[44px] items-center gap-3 rounded-xl px-4 text-base font-medium text-[var(--brand-text)] transition-colors hover:bg-[var(--brand-light)] hover:text-[var(--brand-primary)]"
                >
                  <Phone className="h-5 w-5" />
                  0151 16804054
                </a>

                <div className="mt-6 px-4">
                  <Link
                    href="/#konfigurator"
                    onClick={() => setMobileOpen(false)}
                    className="bg-brand-gradient flex min-h-[44px] w-full items-center justify-center rounded-full text-base font-semibold text-white shadow-md transition-all hover:shadow-lg"
                  >
                    Jetzt konfigurieren
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
