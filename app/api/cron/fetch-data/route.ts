import { NextResponse } from "next/server";
import { refreshData } from "@/lib/data/aggregator";

/**
 * POST /api/cron/fetch-data
 * Triggered by Vercel Cron (0 0 * * * = 08:00 Beijing time) once daily.
 * Refreshes the aggregated cache so the 09:00 digest has fresh data.
 * Email digest sending is handled by /api/cron/send-digest (0 1 * * * = 09:00 Beijing time).
 * Protected by CRON_SECRET via the `authorization` header.
 */
export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await refreshData();
  return NextResponse.json({
    ok: true,
    generatedAt: data.generatedAt,
    stats: data.stats,
  });
}

export async function GET(request: Request) {
  return POST(request);
}
