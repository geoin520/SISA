/**
 * CNVD / CNNVD domestic-vulnerability feed client.
 *
 * The official CNVD/CNNVD portals do not expose a stable public JSON API,
 * so this client attempts RSS-style discovery but always degrades to an
 * empty list. Domestic intel is best-effort and supplemented by the
 * aggregator's curated sample content when feeds are unavailable.
 */

import type { Advisory, DataSource } from "@/lib/types";
import { withinLastDays } from "@/lib/utils";

const CNVD_RSS = "https://www.cnvd.org.cn";

export interface DomesticAdvisorySeed {
  title: string;
  publishedDate: string;
  summary: string;
  url: string;
  source: "CNVD" | "CNNVD";
}

/** Best-effort fetch of recent CNVD weekly bulletins. Returns [] on any failure. */
export async function fetchCnvdAdvisories(): Promise<Advisory[]> {
  try {
    const res = await fetch(CNVD_RSS, {
      next: { revalidate: Number(process.env.DATA_CACHE_TTL ?? 3600) },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    // RSS parsing is intentionally minimal; on any structural surprise we bail.
    const text = await res.text();
    if (!text.includes("<item")) return [];
    return parseRssItems(text, "CNVD");
  } catch {
    return [];
  }
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

/** Convert a domestic seed into an Advisory. */
export function seedToAdvisory(seed: DomesticAdvisorySeed): Advisory {
  return {
    id: `${seed.source}-${seed.title}`.slice(0, 80),
    title: seed.title,
    organization: seed.source,
    publishedDate: new Date(seed.publishedDate).toISOString(),
    type: "security_bulletin",
    summary: seed.summary,
    url: seed.url,
  };
}
