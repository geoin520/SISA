/**
 * CNNVD (国家信息安全漏洞库) advisory client.
 *
 * CNNVD does not expose a stable public JSON API. The official site
 * (www.cnnvd.org.cn) is sometimes reachable and sometimes blocked behind
 * anti-bot protections. This client makes a best-effort attempt to fetch
 * recent vulnerability bulletins from the homepage or RSS feed.
 *
 * Strategy: try the official site first. On any failure, return empty array
 * and let the aggregator's sourceStatus show "unreachable" for transparency.
 *
 * This is NOT a critical data source — CISA KEV and NVD provide the primary
 * vulnerability data. CNNVD adds domestic context when available.
 */

import type { Advisory, DataSource } from "@/lib/types";
import { withinLastDays } from "@/lib/utils";

const CNNVD_HOMEPAGE =
  process.env.CNNVD_URL ?? "https://www.cnnvd.org.cn";

/**
 * Best-effort fetch of recent CNNVD bulletins.
 * Tries the homepage / RSS endpoint. Returns [] on any failure.
 */
export async function fetchCnnvdAdvisories(): Promise<Advisory[]> {
  try {
    const res = await fetch(CNNVD_HOMEPAGE, {
      next: { revalidate: Number(process.env.DATA_CACHE_TTL ?? 3600) },
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) return [];
    const text = await res.text();
    // Try to extract bulletin-like entries from the HTML
    return parseCnnvdHtml(text);
  } catch {
    return [];
  }
}

function parseCnnvdHtml(html: string): Advisory[] {
  const items: Advisory[] = [];

  // Look for bulletin entries with title, date, and link patterns.
  // CNNVD homepage typically has lists like: <li><a href="/web/xxxxx">标题</a><span>日期</span></li>
  const liRe = /<li[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>[^<]*<span[^>]*>([^<]+)<\/span>/gi;
  let m: RegExpExecArray | null;

  while ((m = liRe.exec(html)) && items.length < 10) {
    const href = m[1]?.trim();
    const title = m[2]?.trim();
    const dateStr = m[3]?.trim();
    if (!title || !dateStr) continue;

    const date = parseCnnvdDate(dateStr);
    if (!date) continue;
    if (!withinLastDays(date.toISOString(), 7)) continue;

    const url = href?.startsWith("http")
      ? href
      : href?.startsWith("/")
        ? `${CNNVD_HOMEPAGE}${href}`
        : CNNVD_HOMEPAGE;

    items.push({
      id: `cnnvd-${title.slice(0, 50)}`,
      title,
      organization: "CNNVD" as DataSource,
      publishedDate: date.toISOString(),
      updatedAt: date.toISOString(),
      type: "security_bulletin",
      summary: title,
      url,
    });
  }

  return items;
}

function parseCnnvdDate(s: string): Date | null {
  // Common formats: 2026-09-15, 2026/09/15, 2026年9月15日
  s = s.trim();
  const d1 = s.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (d1) {
    const d = new Date(Number(d1[1]), Number(d1[2]) - 1, Number(d1[3]));
    if (!isNaN(d.getTime())) return d;
  }
  const d2 = s.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (d2) {
    const d = new Date(Number(d2[1]), Number(d2[2]) - 1, Number(d2[3]));
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}
