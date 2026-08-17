/**
 * NVD CVE API v2.0 client.
 * Docs: https://services.nvd.nist.gov/rest/json/cves/2.0
 *
 * Used to enrich CVEs with CVSS scores and CWE classifications.
 * The NVD API is rate-limited (~5 req/30s without a key); every call is
 * guarded so failures never break rendering.
 */

import type { Severity, Vulnerability } from "@/lib/types";
import { severityFromScore } from "@/lib/utils";

const NVD_API_BASE =
  process.env.NVD_API_BASE ?? "https://services.nvd.nist.gov/rest/json/cves/2.0";

interface NvdCve {
  id: string;
  descriptions?: { lang: string; value: string }[];
  published?: string;
  metrics?: {
    cvssMetricV31?: {
      cvssData?: { baseScore?: number; baseSeverity?: string };
    }[];
    cvssMetricV30?: {
      cvssData?: { baseScore?: number; baseSeverity?: string };
    }[];
  };
  weaknesses?: { description?: { lang: string; value: string }[] }[];
  configurations?: { nodes?: { cpeMatch?: { criteria: string }[] }[] }[];
  references?: { url: string }[];
}

interface NvdResponse {
  vulnerabilities?: { cve: NvdCve }[];
}

export interface NvdEnrichment {
  cveId: string;
  cvssScore: number;
  severity: Severity;
  cweIds: string[];
  description: string;
  affectedProducts: string[];
  sourceUrl: string;
  published?: string;
}

/** Query NVD for a single CVE and return enrichment data. */
export async function enrichFromNvd(cveId: string): Promise<NvdEnrichment | null> {
  try {
    const url = `${NVD_API_BASE}?cveId=${encodeURIComponent(cveId)}`;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (process.env.NVD_API_KEY) headers.apiKey = process.env.NVD_API_KEY;
    const res = await fetch(url, {
      headers,
      next: { revalidate: Number(process.env.DATA_CACHE_TTL ?? 3600) },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as NvdResponse;
    const cve = json.vulnerabilities?.[0]?.cve;
    if (!cve) return null;
    return parseNvdCve(cve);
  } catch {
    return null;
  }
}

/** Query NVD for CVEs published in the last 7 days, optionally filtered by severity. */
export async function fetchRecentNvdCves(
  severity?: Severity
): Promise<NvdEnrichment[]> {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const params = new URLSearchParams({
      pubStartDate: `${start.toISOString().slice(0, 19)}.000`,
      resultsPerPage: "40",
    });
    if (severity) params.set("cvssV3Severity", severity);
    const headers: Record<string, string> = { Accept: "application/json" };
    if (process.env.NVD_API_KEY) headers.apiKey = process.env.NVD_API_KEY;
    const res = await fetch(`${NVD_API_BASE}?${params.toString()}`, {
      headers,
      next: { revalidate: Number(process.env.DATA_CACHE_TTL ?? 3600) },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as NvdResponse;
    return (json.vulnerabilities ?? []).map((v) => parseNvdCve(v.cve)).filter(Boolean) as NvdEnrichment[];
  } catch {
    return [];
  }
}

function parseNvdCve(cve: NvdCve): NvdEnrichment {
  const metric =
    cve.metrics?.cvssMetricV31?.[0] ?? cve.metrics?.cvssMetricV30?.[0];
  const score = metric?.cvssData?.baseScore ?? 0;
  const severity = metric?.cvssData?.baseSeverity
    ? (metric.cvssData.baseSeverity.toUpperCase() as Severity)
    : severityFromScore(score);
  const cweIds = Array.from(
    new Set(
      (cve.weaknesses ?? [])
        .flatMap((w) => w.description ?? [])
        .filter((d) => d.lang === "en" && d.value.startsWith("CWE-"))
        .map((d) => d.value)
    )
  );
  const description =
    cve.descriptions?.find((d) => d.lang === "en")?.value ?? cve.id;
  const affectedProducts = extractWindowsServerProducts(cve);
  return {
    cveId: cve.id,
    cvssScore: score,
    severity,
    cweIds,
    description,
    affectedProducts,
    sourceUrl: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
    published: cve.published,
  };
}

function extractWindowsServerProducts(cve: NvdCve): string[] {
  const products = new Set<string>();
  for (const cfg of cve.configurations ?? []) {
    for (const node of cfg.nodes ?? []) {
      for (const match of node.cpeMatch ?? []) {
        const cpe = match.criteria ?? "";
        // cpe:2.3:o:microsoft:windows_server_2022:...
        if (cpe.includes("microsoft:windows_server")) {
          const parts = cpe.split(":");
          const product = parts[3]?.replace(/_/g, " ") ?? "Windows Server";
          products.add(product);
        }
      }
    }
  }
  return Array.from(products);
}

/** Merge NVD enrichment into a Vulnerability record. */
export function applyNvdEnrichment(
  vuln: Vulnerability,
  enrich: NvdEnrichment | null
): Vulnerability {
  if (!enrich) return vuln;
  return {
    ...vuln,
    cvssScore: enrich.cvssScore || vuln.cvssScore,
    severity: enrich.cvssScore ? enrich.severity : vuln.severity,
    cweIds: enrich.cweIds.length ? enrich.cweIds : vuln.cweIds,
    description: enrich.description || vuln.description,
    affectedProducts:
      enrich.affectedProducts.length ? enrich.affectedProducts : vuln.affectedProducts,
    sources: { ...vuln.sources, NVD: enrich.sourceUrl },
  };
}
