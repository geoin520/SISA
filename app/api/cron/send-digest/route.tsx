import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { DailyDigestEmail } from "@/components/email/daily-digest";
import { getDigestData24h } from "@/lib/data/aggregator";

/**
 * POST /api/cron/send-digest
 * Triggered by Vercel Cron at 01:00 UTC (= 09:00 Beijing time) daily.
 * Sends a 24-hour security digest to all subscribers.
 *
 * NOTE: This endpoint prepares the digest HTML. In production, wire it to an
 * email provider (Resend / SendGrid / SES) and iterate over subscribers
 * stored in Vercel KV / a database. The digest covers only the past 24 hours
 * — there is NO real-time push for critical vulnerabilities.
 *
 * Protected by CRON_SECRET via the `authorization` header.
 */
export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getDigestData24h();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sisa.ing";

  const html = await render(
    <DailyDigestEmail data={data} siteUrl={siteUrl} />
  );

  // TODO: integrate with email provider and send to all subscribers.
  // Example (Resend):
  //   await resend.emails.send({
  //     from: process.env.EMAIL_FROM!,
  //     to: subscribers,
  //     subject: `SISA.ing 安全态势日报 · ${new Date().toLocaleDateString("zh-CN")}`,
  //     html,
  //   });

  return NextResponse.json({
    ok: true,
    digestWindow: "24h",
    generatedAt: data.generatedAt,
    stats: data.stats,
    htmlLength: html.length,
  });
}

export async function GET(request: Request) {
  return POST(request);
}
