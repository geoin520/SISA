/**
 * CISA KEV (Known Exploited Vulnerabilities) catalog client.
 * Feed: https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
 *
 * Used to flag CVEs that are known to be exploited in the wild, to
 * surface Microsoft/Windows-Server-relevant KEV additions as advisories,
 * and to provide the KEV catalog version + total count for the dashboard.
 *
 * The KEV feed is updated daily (often multiple times per day) and is the
 * most reliable source of "fresh" vulnerability data because the JSON feed
 * is always reachable (unlike NVD which rate-limits).
 */

import type { Advisory, DataSource, Vulnerability } from "@/lib/types";
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
  count?: number;
  vulnerabilities: KevEntry[];
}

export interface KevCatalogInfo {
  version?: string;
  count?: number;
  entries: KevEntry[];
}

let cache: { fetchedAt: number; data: KevCatalogInfo } | null = null;
const TTL_MS = Number(process.env.DATA_CACHE_TTL ?? 3600) * 1000;

/** Fetch the full KEV catalog with metadata (cached in-memory for the TTL window). */
export async function fetchKevCatalog(): Promise<KevCatalogInfo> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) return cache.data;
  try {
    const res = await fetch(CISA_KEV_URL, {
      next: { revalidate: Number(process.env.DATA_CACHE_TTL ?? 3600) },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      if (cache?.data) return cache.data;
      return { version: undefined, count: undefined, entries: [] };
    }
    const json = (await res.json()) as KevCatalog;
    const info: KevCatalogInfo = {
      version: json.catalogVersion,
      count: json.count,
      entries: json.vulnerabilities ?? [],
    };
    cache = { fetchedAt: Date.now(), data: info };
    return info;
  } catch {
    if (cache?.data) return cache.data;
    return { version: undefined, count: undefined, entries: [] };
  }
}

/** Set of CVE ids present in the KEV catalog. */
export async function fetchKevCveSet(): Promise<Set<string>> {
  const info = await fetchKevCatalog();
  return new Set(info.entries.map((e) => e.cveID));
}

/** Build a lookup of CVE -> KEV entry for enrichment. */
export async function fetchKevMap(): Promise<Map<string, KevEntry>> {
  const info = await fetchKevCatalog();
  return new Map(info.entries.map((e) => [e.cveID, e]));
}

/** Return KEV catalog metadata (version + total count). */
export async function fetchKevMeta(): Promise<{ version?: string; count?: number }> {
  const info = await fetchKevCatalog();
  return { version: info.version, count: info.count };
}

/** Generate advisories for KEV additions in the last N days (Microsoft/Windows only). */
export async function fetchCisaKevAdvisories(days = 7): Promise<Advisory[]> {
  const info = await fetchKevCatalog();
  const recent = info.entries.filter(
    (e) =>
      withinLastDays(e.dateAdded, days) &&
      (e.vendorProject?.toLowerCase().includes("microsoft") ||
        e.product?.toLowerCase().includes("windows"))
  );
  return recent.map((e) => ({
    id: `cisa-kev-${e.cveID}`,
    title: `CISA KEV: ${e.vulnerabilityName}`,
    organization: "CISA" as DataSource,
    publishedDate: new Date(e.dateAdded).toISOString(),
    updatedAt: new Date(e.dateAdded).toISOString(),
    type: "vuln_alert",
    summary: e.shortDescription,
    url: `https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${encodeURIComponent(
      e.cveID
    )}`,
  }));
}

/**
 * Return recent KEV additions as Vulnerability stubs.
 *
 * These are entries added to the KEV catalog within the last `days` days.
 * They come from the KEV feed itself (no CVSS score), so cvssScore=0 and
 * severity=CRITICAL (conservative — all KEV entries are actively exploited).
 * When the aggregator later merges with NVD enrichment, real scores replace.
 *
 * This is the key mechanism that ensures "fresh daily data" even when MSRC/NVD
 * live APIs are rate-limited or unreachable — CISA adds 1-10 new KEV entries
 * almost every day.
 */
export async function fetchKevRecentAsVulnerabilities(
  days = 7
): Promise<Vulnerability[]> {
  const info = await fetchKevCatalog();
  if (info.entries.length === 0) return [];
  const recent = info.entries.filter((e) => withinLastDays(e.dateAdded, days));
  return recent.map((e) => {
    const isMicrosoft =
      e.vendorProject?.toLowerCase().includes("microsoft") ||
      e.product?.toLowerCase().includes("windows");
    return {
      cveId: e.cveID,
      title: e.vulnerabilityName || e.cveID,
      description: e.shortDescription || e.vulnerabilityName || e.cveID,
      cvssScore: 0, // unknown — will be filled by NVD enrichment if available
      severity: "CRITICAL", // conservative default for KEV entries
      affectedProducts: isMicrosoft
        ? deriveProductFromKev(e)
        : [e.product || e.vendorProject || "Unknown"],
      cweIds: [],
      exploited: true,
      ransomwareCampaignUse:
        e.knownRansomwareCampaignUse === "Known" ? "Known" : "Unknown",
      publishedDate: new Date(e.dateAdded).toISOString(),
      updatedAt: new Date(e.dateAdded).toISOString(),
      remediation: e.requiredAction || "Apply security updates from the vendor immediately.",
      sources: {
        CISA: `https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${encodeURIComponent(
          e.cveID
        )}`,
      },
    };
  });
}

function deriveProductFromKev(e: KevEntry): string[] {
  const p = (e.product || "").toLowerCase();
  if (p.includes("windows") && p.includes("server")) return ["Windows Server"];
  if (p.includes("windows")) return ["Windows"];
  if (p.includes("sharepoint")) return ["SharePoint Server"];
  if (p.includes("exchange")) return ["Exchange Server"];
  if (p.includes("sql")) return ["SQL Server"];
  if (p.includes("hyper-v") || p.includes("vmswitch")) return ["Hyper-V / VMSwitch"];
  return [e.product || "Microsoft Product"];
}
