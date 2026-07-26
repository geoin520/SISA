import { NextResponse } from "next/server";
import { getAggregatedData } from "@/lib/data/aggregator";

export const revalidate = 3600;

/** GET /api/trends — returns stats + threat landscape. */
export async function GET() {
  const data = await getAggregatedData();
  return NextResponse.json(
    {
      stats: data.stats,
      landscape: data.landscape,
      generatedAt: data.generatedAt,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
