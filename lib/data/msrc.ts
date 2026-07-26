/**
 * MSRC CVRF API client.
 * Docs: https://api.msrc.microsoft.com
 *
 * The MSRC feed provides Microsoft Security Update notes, affected products
 * and KB articles. This client is defensive: any network/parsing failure
 * yields an empty array so the aggregator can fall back gracefully.
 */

import type { Vulnerability } from "@/lib/types";

const MSRC_API_BASE =
  process.env.MSRC_API_BASE ?? "https://api.msrc.microsoft.com";

interface MsrcUpdateEntry {
  ID: string;
  Alias: string;
  DocumentTitle: string;
  CurrentReleaseDate: string;
  InitialReleaseDate: string;
}

interface MsrcProductStatus {
  ProductID: string;
  Severity?: string;
}

export interface MsrcCveRecord {
  cveId: string;
  title: string;
  publishedDate: string;
  severity: string | undefined;
  affectedProducts: string[];
  sourceUrl: string;
}

/** Fetch the list of recent MSRC updates (last 30 days). */
export async function fetchMsrcUpdates(): Promise<MsrcCveRecord[]> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const url = `${MSRC_API_BASE}/cvrf/v3.0/updates?$filter=currentReleaseDate gt ${since
      .toISOString()
      .slice(0, 10)}T00:00:00Z&$orderby=currentReleaseDate desc&$top=20`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: Number(process.env.DATA_CACHE_TTL ?? 3600) },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const value: MsrcUpdateEntry[] = json?.value ?? [];
    const out: MsrcCveRecord[] = [];
    for (const entry of value) {
      const id = entry.Alias || entry.ID;
      const title = entry.DocumentTitle ?? id;
      const date = entry.CurrentReleaseDate ?? entry.InitialReleaseDate;
      out.push({
        cveId: id,
        title,
        publishedDate: date,
        severity: undefined,
        affectedProducts: ["Windows Server"],
        sourceUrl: `https://msrc.microsoft.com/update-guide/vulnerability/${id}`,
      });
    }
    return out;
  } catch {
    return [];
  }
}

/** Convert MSRC records to normalized Vulnerability stubs (CVSS filled by NVD). */
export function msrcToVulnerabilities(records: MsrcCveRecord[]): Vulnerability[] {
  return records.map((r) => ({
    cveId: r.cveId,
    title: r.title,
    description: r.title,
    cvssScore: 0,
    severity: "MEDIUM",
    affectedProducts: r.affectedProducts,
    cweIds: [],
    exploited: false,
    publishedDate: r.publishedDate,
    remediation: "",
    sources: { MSRC: r.sourceUrl },
  }));
}
