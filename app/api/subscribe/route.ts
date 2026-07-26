import { NextResponse } from "next/server";

/**
 * POST /api/subscribe — demo subscription endpoint.
 * In production this would persist the email to Vercel KV / a DB and enqueue
 * the daily digest job. Here we just validate and acknowledge.
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

  // TODO: persist email to Vercel KV / database.
  return NextResponse.json({ ok: true, email });
}
