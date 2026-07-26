import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { DailyDigestEmail } from "@/components/email/daily-digest";
import { getDigestData24h } from "@/lib/data/aggregator";

export const dynamic = "force-dynamic";

/** GET /api/email/preview — renders the daily digest email as HTML for QA.
 *  Uses the 24-hour digest data (same window as the 09:00 daily cron). */
export async function GET() {
  const data = await getDigestData24h();
  const html = await render(
    <DailyDigestEmail data={data} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} />
  );
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
