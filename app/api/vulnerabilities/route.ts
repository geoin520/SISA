import { NextResponse } from "next/server";
import { getAggregatedData } from "@/lib/data/aggregator";

export const revalidate = 3600;

/** GET /api/vulnerabilities — returns the aggregated vulnerability list. */
export async function GET() {
  const data = await getAggregatedData();
  return NextResponse.json(
    {
      total: data.vulnerabilities.length,
      vulnerabilities: data.vulnerabilities,
      generatedAt: data.generatedAt,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
