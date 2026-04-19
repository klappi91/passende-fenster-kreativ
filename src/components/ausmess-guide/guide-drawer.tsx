"use client";

// Stub. Full content (Guide-Kapitel + Mini-Rechner) wird in 4f implementiert.
// Hier: Drawer-Shell + Mini-Rechner-Kern, damit Step-Masse schon funktioniert.

import { useState } from "react";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { MiniRechner } from "./mini-rechner";

export function GuideDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[560px] flex-col rounded-l-3xl bg-white shadow-[0_0_48px_rgba(0,0,0,0.2)] outline-none">
          <Drawer.Title className="sr-only">Fenster ausmessen — Mess-Guide</Drawer.Title>
          <Drawer.Description className="sr-only">
            Interaktiver Mini-Rechner und Schritt-für-Schritt-Anleitung zum Ausmessen von Fenstern.
          </Drawer.Description>
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
            <div>
              <p className="heading-price-label">Mess-Guide</p>
              <h2
                className="heading-sub"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Rohbaumaß → Bestellmaß
              </h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-[var(--muted-foreground)] hover:bg-[var(--konfig-chip-idle-bg)]"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-y-auto p-6">
            <MiniRechner onApply={() => setOpen(false)} />
            <p className="text-caption mt-8 border-t border-[var(--border)] pt-6">
              Vollständige Schritt-für-Schritt-Anleitung findest du unter{" "}
              <a
                href="/fenster-ausmessen"
                className="font-medium text-[var(--brand-primary)] underline"
              >
                /fenster-ausmessen
              </a>
              .
            </p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
