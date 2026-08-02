import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { DailyDigestEmail } from "@/components/email/daily-digest";
import { getAggregatedData } from "@/lib/data/aggregator";
import { getSubscribers } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const maxDuration = 10;

/**
 * POST /api/cron/send-digest
 * Triggered by Vercel Cron at 01:00 UTC (= 09:00 Beijing time) daily.
 * Sends a full security posture digest (7-day rolling window) to all
 * subscribers via Resend. The email mirrors the website dashboard layout.
 *
 * Protected by CRON_SECRET via the `authorization` header.
 */
export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getAggregatedData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sisa.ing";

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
      digestWindow: "7d",
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
        digestWindow: "7d",
        generatedAt: data.generatedAt,
        stats: data.stats,
      });
    }

    // Send to each subscriber individually to isolate per-recipient failures
    // (e.g. Resend test-domain restriction on non-verified recipients).
    const results = await Promise.allSettled(
      subscribers.map((email) =>
        resend.emails.send({ from: emailFrom, to: email, subject, html })
      )
    );

    const succeeded = results.filter((r) => r.status === "fulfilled" && !r.value.error);
    const failed = results
      .map((r, i) =>
        r.status === "rejected"
          ? { email: subscribers[i], error: String(r.reason) }
          : r.value.error
            ? { email: subscribers[i], error: r.value.error.message }
            : null
      )
      .filter(Boolean);

    if (succeeded.length === 0) {
      console.error("[send-digest] All sends failed:", failed);
      return NextResponse.json(
        {
          ok: false,
          error: "All email sends failed",
          details: failed,
        },
        { status: 500 }
      );
    }

    console.log(
      `[send-digest] Email sent to ${succeeded.length}/${subscribers.length} subscriber(s).` +
        (failed.length ? ` Failed: ${JSON.stringify(failed)}` : "")
    );
    return NextResponse.json({
      ok: true,
      sentTo: succeeded.length,
      failed: failed.length,
      failedDetails: failed,
      digestWindow: "7d",
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
