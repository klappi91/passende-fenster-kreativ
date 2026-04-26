"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Fenster-Systeme", href: "/#fenster-systeme" },
  { label: "Katalog", href: "/katalog" },
  { label: "Konfigurator", href: "/konfigurator" },
  { label: "Ausmessen", href: "/fenster-ausmessen" },
  { label: "Anfrage", href: "/anfrage" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1100) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Focus management + Escape + Tab-trap for mobile drawer
  useEffect(() => {
    if (!open) return;

    const menu = mobileMenuRef.current;
    if (!menu) return;

    const focusables = Array.from(
      menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // Initial focus on first link in menu
    first?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Restore focus to burger button on close
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      burgerRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

  return (
    <header
      className="pf-header fixed z-50"
      style={{
        top: 14,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(1320px, calc(100% - 28px))",
      }}
    >
      <div
        className="pf-header-glass relative flex items-center justify-between text-white"
        style={{
          ["--glass-blur" as string]: "22px",
          padding: "10px 10px 10px 22px",
          background: `rgba(20,25,34,${scrolled ? 0.62 : 0.5})`,
          backdropFilter: "saturate(180%) blur(var(--glass-blur, 22px))",
          WebkitBackdropFilter: "saturate(180%) blur(var(--glass-blur, 22px))",
          border: "1px solid var(--glass-dark-edge)",
          borderRadius: 999,
          boxShadow:
            "0 18px 50px -18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.25)",
          transition: "background 0.3s",
        }}
      >
        <Link href="/" className="relative flex items-center gap-3">
          <div
            className="grid h-9 w-9 place-items-center rounded-[10px] text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            PF
          </div>
          <span
            className="hidden sm:inline-block font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            Passende-Fenster
            <span className="text-[var(--brand-primary)]">.de</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="pf-nav-desktop hidden items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[13px] font-medium text-white/85 transition-colors hover:text-white"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/konfigurator"
            className="ml-3 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{
              background: "var(--brand-primary)",
              fontFamily: "var(--font-display)",
              boxShadow: "var(--shadow-brand-cta)",
            }}
          >
            Jetzt konfigurieren →
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          ref={burgerRef}
          type="button"
          aria-label={open ? "Navigation schließen" : "Navigation öffnen"}
          aria-expanded={open}
          aria-controls="pf-mobile-menu"
          onClick={() => setOpen(!open)}
          className="pf-nav-mobile grid place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-dark)]"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          ref={mobileMenuRef}
          id="pf-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="pf-header-mobile-menu relative mt-3 grid gap-1 overflow-hidden p-5"
          style={{
            background: "rgba(20,25,34,0.55)",
            // Mobile-only surface — directly use the gentler tier (12px)
            // instead of going through the var override.
            backdropFilter: "saturate(160%) blur(12px)",
            WebkitBackdropFilter: "saturate(160%) blur(12px)",
            border: "1px solid var(--glass-dark-edge)",
            borderRadius: 22,
            boxShadow:
              "0 18px 50px -18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.25)",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="relative min-h-[44px] rounded-xl px-4 py-3.5 text-[15px] font-medium text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-dark)]"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/konfigurator"
            onClick={closeMenu}
            className="relative mt-2 min-h-[44px] rounded-xl px-4 py-3.5 text-center text-[15px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-dark)]"
            style={{
              background: "var(--brand-primary)",
              fontFamily: "var(--font-display)",
              boxShadow: "var(--shadow-brand-cta)",
            }}
          >
            Jetzt konfigurieren →
          </Link>
        </div>
      )}

      {/* Breakpoint rules for desktop↔mobile nav */}
      {/* keep at 1100px — 5 nav items + brand + CTA don't fit at lg (1024px) */}
      <style jsx>{`
        :global(.pf-nav-desktop) {
          display: none;
        }
        :global(.pf-nav-mobile) {
          display: grid;
        }
        @media (min-width: 1101px) {
          :global(.pf-nav-desktop) {
            display: flex;
          }
          :global(.pf-nav-mobile) {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
