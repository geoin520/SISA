import { NextResponse } from "next/server";
import { refreshData } from "@/lib/data/aggregator";

/**
 * POST /api/cron/fetch-data
 * Triggered by Vercel Cron (0 6,12,18 * * *). Refreshes the aggregated cache.
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
