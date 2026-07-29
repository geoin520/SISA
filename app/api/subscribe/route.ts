import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/redis";

/**
 * POST /api/subscribe
 * Adds an email to the subscriber list stored in Upstash Redis.
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

  const isNew = await addSubscriber(email);
  if (!isNew) {
    return NextResponse.json({ ok: true, alreadySubscribed: true, email });
  }
  console.log(`[subscribe] New subscriber: ${email}`);
  return NextResponse.json({ ok: true, email });
}

/** GET /api/subscribe — return the current subscriber list (admin/debug use). */
export async function GET() {
  const { getSubscribers } = await import("@/lib/redis");
  const subscribers = await getSubscribers();
  return NextResponse.json({ ok: true, subscribers });
}
