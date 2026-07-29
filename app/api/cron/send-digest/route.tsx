import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { DailyDigestEmail } from "@/components/email/daily-digest";
import { getDigestData24h } from "@/lib/data/aggregator";
import { getSubscribers } from "@/lib/redis";

export const dynamic = "force-dynamic";

/**
 * POST /api/cron/send-digest
 * Triggered by Vercel Cron at 01:00 UTC (= 09:00 Beijing time) daily.
 * Sends a 24-hour security digest to all subscribers via Resend.
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

  // If no vulnerabilities or advisories in the past 24h, skip sending.
  if (data.vulnerabilities.length === 0 && data.advisories.length === 0) {
    console.log("[send-digest] No new data in 24h — skipping email.");
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "no_new_data",
      digestWindow: "24h",
      generatedAt: data.generatedAt,
      stats: data.stats,
    });
  }

  const html = await render(
    <DailyDigestEmail data={data} siteUrl={siteUrl} />
  );

  // --- Send email via Resend ---
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  if (!resendApiKey || !emailFrom) {
    console.warn(
      "[send-digest] RESEND_API_KEY or EMAIL_FROM not set — email not sent."
    );
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "missing_email_config",
      digestWindow: "24h",
      generatedAt: data.generatedAt,
      stats: data.stats,
      htmlLength: html.length,
    });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    const date = new Date().toLocaleDateString("zh-CN");
    const subject = `SISA.ing 安全态势日报 · ${date}`;

    const subscribers = await getSubscribers();

    if (subscribers.length === 0) {
      console.log("[send-digest] No subscribers configured — email not sent.");
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "no_subscribers",
        digestWindow: "24h",
        generatedAt: data.generatedAt,
        stats: data.stats,
      });
    }

    const { error } = await resend.emails.send({
      from: emailFrom,
      to: subscribers,
      subject,
      html,
    });

    if (error) {
      console.error("[send-digest] Resend error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    console.log(
      `[send-digest] Email sent to ${subscribers.length} subscriber(s).`
    );
    return NextResponse.json({
      ok: true,
      sentTo: subscribers.length,
      digestWindow: "24h",
      generatedAt: data.generatedAt,
      stats: data.stats,
      htmlLength: html.length,
    });
  } catch (err) {
    console.error("[send-digest] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
