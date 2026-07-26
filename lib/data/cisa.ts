/**
 * CISA KEV (Known Exploited Vulnerabilities) catalog client.
 * Feed: https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
 *
 * Used to flag CVEs that are known to be exploited in the wild, and to
 * surface Microsoft/Windows-Server-relevant KEV additions as advisories.
 */

import type { Advisory, DataSource } from "@/lib/types";
import { withinLastDays } from "@/lib/utils";

const CISA_KEV_URL =
  process.env.CISA_KEV_URL ??
  "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

export interface KevEntry {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate: string;
  knownRansomwareCampaignUse: string;
}

interface KevCatalog {
  title?: string;
  catalogVersion?: string;
  vulnerabilities: KevEntry[];
}

let cache: { fetchedAt: number; data: KevEntry[] } | null = null;
const TTL_MS = Number(process.env.DATA_CACHE_TTL ?? 3600) * 1000;

/** Fetch the full KEV catalog (cached in-memory for the TTL window). */
export async function fetchKevCatalog(): Promise<KevEntry[]> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) return cache.data;
  try {
    const res = await fetch(CISA_KEV_URL, {
      next: { revalidate: Number(process.env.DATA_CACHE_TTL ?? 3600) },
    });
    if (!res.ok) return cache?.data ?? [];
    const json = (await res.json()) as KevCatalog;
    cache = { fetchedAt: Date.now(), data: json.vulnerabilities ?? [] };
    return cache.data;
  } catch {
    return cache?.data ?? [];
  }
}

/** Set of CVE ids present in the KEV catalog. */
export async function fetchKevCveSet(): Promise<Set<string>> {
  const list = await fetchKevCatalog();
  return new Set(list.map((e) => e.cveID));
}

/** Build a lookup of CVE -> KEV entry for enrichment. */
export async function fetchKevMap(): Promise<Map<string, KevEntry>> {
  const list = await fetchKevCatalog();
  return new Map(list.map((e) => [e.cveID, e]));
}

/** Generate advisories for KEV additions in the last 7 days (Microsoft/Windows only). */
export async function fetchCisaKevAdvisories(): Promise<Advisory[]> {
  const list = await fetchKevCatalog();
  const recent = list.filter(
    (e) =>
      withinLastDays(e.dateAdded, 7) &&
      (e.vendorProject?.toLowerCase().includes("microsoft") ||
        e.product?.toLowerCase().includes("windows"))
  );
  return recent.map((e) => ({
    id: `cisa-kev-${e.cveID}`,
    title: `CISA KEV: ${e.vulnerabilityName}`,
    organization: "CISA" as DataSource,
    publishedDate: new Date(e.dateAdded).toISOString(),
    type: "vuln_alert",
    summary: e.shortDescription,
    url: `https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${encodeURIComponent(
      e.cveID
    )}`,
  }));
}
