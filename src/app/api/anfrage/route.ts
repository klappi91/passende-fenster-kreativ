import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const AnfrageSchema = z.object({
  vorname: z.string().trim().max(120).optional().default(""),
  nachname: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email(),
  telefon: z.string().trim().max(80).optional().default(""),
  nachricht: z.string().trim().max(5000).optional().default(""),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ungültiger Anfragetext (JSON erwartet)." },
      { status: 400 }
    );
  }

  const parsed = AnfrageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Bitte überprüfen Sie Ihre Eingaben.",
        issues: parsed.error.issues,
      },
      { status: 400 }
    );
  }

  try {
    // TODO: wire up Resend / nodemailer / form provider to actually deliver
    // the inquiry. For now we acknowledge receipt so the UI can confirm
    // submission flow end-to-end.
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unbekannter Serverfehler.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
