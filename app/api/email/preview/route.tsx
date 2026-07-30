import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { DailyDigestEmail } from "@/components/email/daily-digest";
import { getAggregatedData } from "@/lib/data/aggregator";

export const dynamic = "force-dynamic";

/** GET /api/email/preview — renders the daily digest email as HTML for QA.
 *  Uses the full aggregated data (7-day rolling window, same as the cron). */
export async function GET() {
  const data = await getAggregatedData();
  const html = await render(
    <DailyDigestEmail data={data} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} />
  );
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
