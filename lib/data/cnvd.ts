/**
 * CNVD (国家信息安全漏洞共享平台) advisory client.
 *
 * ⚠️ KNOWN LIMITATION: The official CNVD site (www.cnvd.org.cn) is protected
 * by CAPTCHA and anti-bot measures. Direct fetching from a serverless
 * function will almost always fail. Per the SISA skill documentation, we
 * should NOT attempt direct connection — it's a waste of time and bandwidth.
 *
 * In a WorkBuddy / AI-agent environment, the skill uses WebSearch to find
 * third-party reprints of CNVD weekly reports. In a Next.js serverless
 * context, we don't have access to web search APIs by default.
 *
 * This client makes a best-effort attempt to find an RSS or JSON feed, but
 * the expected outcome is an empty array. The aggregator's sourceStatus
 * will show "unreachable" for transparency.
 *
 * If you want real CNVD data, options include:
 *   1. Add a Bing Search API / SerpAPI key and search for CNVD weekly reports
 *   2. Find a reliable third-party RSS feed that re-publishes CNVD data
 *   3. Use the CNVD API if you have official access credentials
 */

import type { Advisory, DataSource } from "@/lib/types";
import { withinLastDays } from "@/lib/utils";

// We don't try the official site directly (it has captcha).
// Try alternative feeds that may or may not work.
const CNVD_FEEDS = [
  // Potential third-party RSS sources — best effort
  "https://www.cnvd.org.cn",
];

/**
 * Best-effort fetch of CNVD bulletins.
 * Expected to return [] due to CAPTCHA protection.
 * sourceStatus in the aggregator will show "unreachable".
 */
export async function fetchCnvdAdvisories(): Promise<Advisory[]> {
  for (const url of CNVD_FEEDS) {
    try {
      const res = await fetch(url, {
        next: { revalidate: Number(process.env.DATA_CACHE_TTL ?? 3600) },
        signal: AbortSignal.timeout(4000),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (!res.ok) continue;
      const text = await res.text();
      const items = parseRssItems(text, "CNVD");
      if (items.length > 0) return items;
    } catch {
      // try next feed
    }
  }
  return [];
}

function parseRssItems(xml: string, source: "CNVD" | "CNNVD"): Advisory[] {
  const items: Advisory[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) && items.length < 10) {
    const block = m[1];
    const title = textBetween(block, "<title>", "</title>");
    const link = textBetween(block, "<link>", "</link>");
    const pub = textBetween(block, "<pubDate>", "</pubDate>");
    const desc = textBetween(block, "<description>", "</description>");
    if (!title || !pub) continue;
    const iso = new Date(pub).toISOString();
    if (!withinLastDays(iso, 7)) continue;
    items.push({
      id: `${source}-${title}`.slice(0, 80),
      title,
      organization: source as DataSource,
      publishedDate: iso,
      updatedAt: iso,
      type: "security_bulletin",
      summary: stripTags(desc) || title,
      url: link || (source === "CNVD" ? "https://www.cnvd.org.cn" : "https://www.cnnvd.org.cn"),
    });
  }
  return items;
}

function textBetween(s: string, start: string, end: string): string {
  const i = s.indexOf(start);
  if (i < 0) return "";
  const j = s.indexOf(end, i + start.length);
  if (j < 0) return "";
  return s.slice(i + start.length, j).trim();
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}
