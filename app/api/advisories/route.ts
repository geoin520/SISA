import { NextResponse } from "next/server";
import { getAggregatedData } from "@/lib/data/aggregator";

export const revalidate = 3600;

/** GET /api/advisories — returns the aggregated advisory list. */
export async function GET() {
  const data = await getAggregatedData();
  return NextResponse.json(
    {
      total: data.advisories.length,
      advisories: data.advisories,
      generatedAt: data.generatedAt,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
