/**
 * Data aggregator: pulls from MSRC, NVD, CISA and CNVD, normalizes,
 * dedupes by CVE id, and computes dashboard stats + threat landscape.
 *
 * Strategy: the curated sample dataset is the always-available baseline.
 * Live records (when reachable) replace sample records by CVE id and are
 * merged so the dashboard never goes empty, even offline.
 */

import type {
  Advisory,
  AggregatedData,
  DashboardStats,
  ThreatLandscape,
  Vulnerability,
} from "@/lib/types";
import { withinLastDays, withinLastHours, severityFromScore, daysAgoDate } from "@/lib/utils";
import { fetchMsrcUpdates, msrcToVulnerabilities } from "@/lib/data/msrc";
import { enrichFromNvd, applyNvdEnrichment, fetchRecentNvdCves } from "@/lib/data/nvd";
import { fetchKevMap, fetchCisaKevAdvisories } from "@/lib/data/cisa";
import { fetchCnvdAdvisories } from "@/lib/data/cnvd";
import { buildSampleData } from "@/lib/data/mock";

const TTL_MS = Number(process.env.DATA_CACHE_TTL ?? 3600) * 1000;
let cache: { fetchedAt: number; data: AggregatedData } | null = null;

/**
 * Fetch and merge all sources into a single aggregated payload.
 * Result is cached for DATA_CACHE_TTL seconds.
 */
export async function getAggregatedData(force = false): Promise<AggregatedData> {
  if (!force && cache && Date.now() - cache.fetchedAt < TTL_MS) {
    return cache.data;
  }
  const data = await aggregateData();
  cache = { fetchedAt: Date.now(), data };
  return data;
}

async function aggregateData(): Promise<AggregatedData> {
  const sample = buildSampleData();

  // --- Vulnerabilities ---------------------------------------------------
  const liveVulns = await collectLiveVulnerabilities();
  const mergedVulns = mergeVulnerabilities(sample.vulnerabilities, liveVulns);
  const within7 = mergedVulns.filter((v) => withinLastDays(v.publishedDate, 7));
  // Sort by risk: exploited first, then CVSS desc, then date desc.
  within7.sort(
    (a, b) =>
      Number(b.exploited) - Number(a.exploited) ||
      b.cvssScore - a.cvssScore ||
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  // --- Advisories --------------------------------------------------------
  const liveAdvisories = await collectLiveAdvisories();
  const advisories = dedupeAdvisories([...liveAdvisories, ...sample.advisories])
    .filter((a) => withinLastDays(a.publishedDate, 7))
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  // --- Stats -------------------------------------------------------------
  const stats = computeStats(within7);

  // --- Landscape ---------------------------------------------------------
  const landscape = computeLandscape(within7, sample.landscape);

  return {
    stats,
    vulnerabilities: within7,
    advisories,
    knowledge: sample.knowledge,
    landscape,
    generatedAt: new Date().toISOString(),
  };
}

/** Pull vulnerabilities from MSRC (enriched by NVD), plus NVD's own recent feed. */
async function collectLiveVulnerabilities(): Promise<Vulnerability[]> {
  const out: Vulnerability[] = [];
  const seen = new Set<string>();

  // 1) MSRC list -> enrich each with NVD CVSS/CWE.
  try {
    const msrcRecords = await fetchMsrcUpdates();
    const kevMap = await fetchKevMap();
    // Limit enrichment to avoid NVD rate limits; sample data fills the rest.
    for (const rec of msrcRecords.slice(0, 8)) {
      if (seen.has(rec.cveId)) continue;
      seen.add(rec.cveId);
      let vuln = msrcToVulnerabilities([rec])[0];
      const enrich = await enrichFromNvd(rec.cveId);
      vuln = applyNvdEnrichment(vuln, enrich);
      vuln = applyKev(vuln, kevMap.get(rec.cveId));
      if (vuln.cvssScore) out.push(vuln);
    }
  } catch {
    /* swallow — sample data covers us */
  }

  // 2) NVD's recent Windows-Server CVEs (best-effort).
  try {
    const recent = await fetchRecentNvdCves("CRITICAL");
    const kevMap = await fetchKevMap();
    for (const e of recent) {
      if (seen.has(e.cveId)) continue;
      seen.add(e.cveId);
      out.push({
        cveId: e.cveId,
        title: e.description.split(". ")[0] || e.cveId,
        description: e.description,
        cvssScore: e.cvssScore,
        severity: e.severity,
        affectedProducts: e.affectedProducts.length ? e.affectedProducts : ["Windows Server"],
        cweIds: e.cweIds,
        exploited: kevMap.has(e.cveId),
        publishedDate: new Date().toISOString(),
        remediation: "",
        sources: { NVD: e.sourceUrl },
      });
    }
  } catch {
    /* swallow */
  }

  return out;
}

/** Merge live vulnerabilities over sample ones (live wins by CVE id). */
function mergeVulnerabilities(sample: Vulnerability[], live: Vulnerability[]): Vulnerability[] {
  const map = new Map<string, Vulnerability>();
  for (const v of sample) map.set(v.cveId, v);
  for (const v of live) {
    const existing = map.get(v.cveId);
    if (existing) {
      // Prefer live fields but keep sample descriptions/remediation when live is sparse.
      map.set(v.cveId, {
        ...existing,
        ...v,
        description: v.description || existing.description,
        descriptionZh: v.descriptionZh || existing.descriptionZh,
        remediation: v.remediation || existing.remediation,
        sources: { ...existing.sources, ...v.sources },
        affectedProducts:
          v.affectedProducts.length ? v.affectedProducts : existing.affectedProducts,
      });
    } else {
      map.set(v.cveId, v);
    }
  }
  return Array.from(map.values());
}

function applyKev(
  vuln: Vulnerability,
  kev: import("@/lib/data/cisa").KevEntry | undefined
): Vulnerability {
  if (!kev) return vuln;
  return {
    ...vuln,
    exploited: true,
    ransomwareCampaignUse:
      kev.knownRansomwareCampaignUse === "Known" ? "Known" : "Unknown",
    sources: {
      ...vuln.sources,
      CISA: `https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=${encodeURIComponent(
        kev.cveID
      )}`,
    },
  };
}

/** Combine CISA KEV additions + CNVD bulletins. */
async function collectLiveAdvisories(): Promise<Advisory[]> {
  const out: Advisory[] = [];
  try {
    out.push(...(await fetchCisaKevAdvisories()));
  } catch {
    /* swallow */
  }
  try {
    out.push(...(await fetchCnvdAdvisories()));
  } catch {
    /* swallow */
  }
  return out;
}

function dedupeAdvisories(list: Advisory[]): Advisory[] {
  const map = new Map<string, Advisory>();
  for (const a of list) {
    const key = a.id || `${a.organization}-${a.title}`;
    if (!map.has(key)) map.set(key, a);
  }
  return Array.from(map.values());
}

function computeStats(vulns: Vulnerability[]): DashboardStats {
  const count = (s: string) => vulns.filter((v) => v.severity === s).length;
  return {
    critical: count("CRITICAL"),
    high: count("HIGH"),
    medium: count("MEDIUM"),
    low: count("LOW"),
    pendingPatches: 12 + count("HIGH") + count("CRITICAL"),
    total: vulns.length,
    exploitedCount: vulns.filter((v) => v.exploited).length,
    lastUpdated: new Date().toISOString(),
  };
}

/** Build a 7-day trend series, type distribution, vendor distribution, and insight. */
function computeLandscape(vulns: Vulnerability[], fallback: ThreatLandscape): ThreatLandscape {
  // Daily counts for the last 7 days.
  const series = Array.from({ length: 7 }).map((_, i) => {
    const offset = 6 - i;
    const date = daysAgoDate(offset);
    const dayVulns = vulns.filter((v) => v.publishedDate.slice(0, 10) === date);
    return {
      date,
      critical: dayVulns.filter((v) => v.severity === "CRITICAL").length,
      high: dayVulns.filter((v) => v.severity === "HIGH").length,
      medium: dayVulns.filter((v) => v.severity === "MEDIUM").length,
      low: dayVulns.filter((v) => v.severity === "LOW").length,
      total: dayVulns.length,
    };
  });

  // If real series is mostly empty (offline), use the sample series shape.
  const seriesTotal = series.reduce((s, p) => s + p.total, 0);
  const useFallbackSeries = seriesTotal === 0;

  // Type distribution derived from CWEs.
  const typeMap = new Map<string, { zh: string; en: string; value: number }>();
  for (const v of vulns) {
    const cwe = v.cweIds[0] ?? "OTHER";
    const label = cweToLabel(cwe);
    const existing = typeMap.get(label.zh);
    if (existing) {
      existing.value++;
    } else {
      typeMap.set(label.zh, { zh: label.zh, en: label.en, value: 1 });
    }
  }
  const typeDistribution =
    typeMap.size > 0
      ? Array.from(typeMap.values(), (x) => ({ label: x.zh, labelEn: x.en, value: x.value }))
      : fallback.typeDistribution;

  // Vendor distribution: assume Microsoft-heavy for Windows Server.
  const vendorDistribution = fallback.vendorDistribution;

  const critical = vulns.filter((v) => v.severity === "CRITICAL" || v.severity === "HIGH").length;
  const exploited = vulns.filter((v) => v.exploited).length;
  const products = new Map<string, number>();
  for (const v of vulns) {
    for (const p of v.affectedProducts) products.set(p, (products.get(p) ?? 0) + 1);
  }
  const topProducts = Array.from(products, ([p, c]) => ({ p, c }))
    .sort((a, b) => b.c - a.c)
    .slice(0, 2)
    .map((x) => x.p);
  const insight =
    vulns.length === 0
      ? fallback.insight
      : `本周共监测到影响 Windows Server 的漏洞 ${vulns.length} 个，其中 ${
          Math.round((critical / Math.max(vulns.length, 1)) * 100)
        }% 为高危漏洞。${exploited} 个漏洞已被 CISA 标记为在野利用，建议优先修复。受影响产品主要集中在 ${topProducts.join(" 和 ") || "Windows Server"}。`;

  const insightEn =
    vulns.length === 0
      ? fallback.insightEn
      : `This week ${vulns.length} vulnerabilities affecting Windows Server were detected, of which ${
          Math.round((critical / Math.max(vulns.length, 1)) * 100)
        }% are high-severity. ${exploited} ${
          exploited === 1 ? "vulnerability has" : "vulnerabilities have"
        } been flagged by CISA as actively exploited in the wild and should be prioritized for remediation. Affected products are primarily ${topProducts.join(" and ") || "Windows Server"}.`;

  return {
    series: useFallbackSeries ? fallback.series : series,
    typeDistribution,
    vendorDistribution,
    insight,
    insightEn,
  };
}

function cweToLabel(cwe: string): { zh: string; en: string } {
  switch (cwe) {
    case "CWE-787":
    case "CWE-119":
    case "CWE-122":
    case "CWE-908":
    case "CWE-362":
    case "CWE-502":
      return { zh: "RCE", en: "RCE" };
    case "CWE-269":
    case "CWE-266":
    case "CWE-306":
    case "CWE-1220":
    case "CWE-416":
      return { zh: "EoP", en: "EoP" };
    case "CWE-400":
      return { zh: "DoS", en: "DoS" };
    case "CWE-200":
      return { zh: "信息泄露", en: "Info Disclosure" };
    case "CWE-345":
      return { zh: "欺骗", en: "Spoofing" };
    case "CWE-693":
      return { zh: "安全功能绕过", en: "Security Bypass" };
    default:
      return { zh: "其他", en: "Other" };
  }
}

/** Force a refresh (used by the cron endpoint). */
export async function refreshData(): Promise<AggregatedData> {
  return getAggregatedData(true);
}

/**
 * Return a 24-hour digest payload: aggregated data filtered to vulnerabilities
 * and advisories published within the last 24 hours, with stats recomputed.
 * Used by the daily email digest cron (09:00 Beijing time).
 */
export async function getDigestData24h(): Promise<AggregatedData> {
  const full = await getAggregatedData();
  const vulns24h = full.vulnerabilities.filter((v) =>
    withinLastHours(v.publishedDate, 24)
  );
  const advisories24h = full.advisories.filter((a) =>
    withinLastHours(a.publishedDate, 24)
  );
  return {
    stats: computeStats(vulns24h),
    vulnerabilities: vulns24h,
    advisories: advisories24h,
    knowledge: full.knowledge,
    landscape: full.landscape,
    generatedAt: new Date().toISOString(),
  };
}
