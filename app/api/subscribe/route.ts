import { NextResponse } from "next/server";

/**
 * POST /api/subscribe
 * Adds an email to the subscriber list stored in Vercel KV.
 * Subscribers receive a daily digest at 09:00 Beijing time (01:00 UTC)
 * covering the past 24 hours. There is NO real-time push for critical
 * vulnerabilities — the digest is the sole notification channel.
 */
export async function POST(request: Request) {
  let email: string;
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Persist to Vercel KV if available.
  try {
    const { kv } = await import("@vercel/kv");
    const added = await kv.sadd("sisa:subscribers", email);
    if (added === 0) {
      return NextResponse.json({ ok: true, alreadySubscribed: true, email });
    }
    console.log(`[subscribe] New subscriber: ${email}`);
  } catch {
    // Fallback: log a warning. In environments without Vercel KV (local dev),
    // subscribers can be configured via the EMAIL_SUBSCRIBERS env var.
    console.warn(
      `[subscribe] Vercel KV not available — email "${email}" not persisted. ` +
        "Set EMAIL_SUBSCRIBERS env var as fallback."
    );
  }

  return NextResponse.json({ ok: true, email });
}

/** GET /api/subscribe — return the current subscriber list (admin/debug use). */
export async function GET() {
  try {
    const { kv } = await import("@vercel/kv");
    const members = await kv.smembers("sisa:subscribers");
    return NextResponse.json({ ok: true, subscribers: members });
  } catch {
    // Fallback: return env-var based list
    const fromEnv = (process.env.EMAIL_SUBSCRIBERS ?? "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    return NextResponse.json({ ok: true, subscribers: fromEnv, source: "env" });
  }
}
