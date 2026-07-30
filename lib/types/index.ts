/**
 * SISA.ing — Core domain types
 * 安全洞察 · 态势感知 — 核心类型定义
 */

export type Locale = "zh" | "en";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type DataSource = "MSRC" | "NVD" | "CISA" | "CNNVD" | "CNVD";

/** A normalized vulnerability record aggregated from multiple sources. */
export interface Vulnerability {
  /** Unique key — the CVE id. */
  cveId: string;
  title: string;
  description: string;
  /** Chinese translation of the description, when available. */
  descriptionZh?: string;
  /** CVSS v3.x base score (0–10). */
  cvssScore: number;
  severity: Severity;
  /** Affected Windows Server products / versions. */
  affectedProducts: string[];
  /** CWE category ids, e.g. ["CWE-787"]. */
  cweIds: string[];
  /** Whether the flaw is known to be exploited in the wild (CISA KEV). */
  exploited: boolean;
  /** Known ransomware campaign use, when available. */
  ransomwareCampaignUse?: "Known" | "Unknown";
  publishedDate: string; // ISO date — original publication (e.g. Patch Tuesday)
  /** Last time this record was updated by any source (NVD enrichment, CISA KEV add, etc.). */
  updatedAt?: string; // ISO date
  /** Prioritized remediation guidance derived by the aggregator. */
  remediation: string;
  /** Original official links keyed by source. */
  sources: Partial<Record<DataSource, string>>;
  /** Patch ID, e.g. "KB5082142", associated with the fix for this vulnerability. */
  patchId?: string;
  /** Link to the KB article on Microsoft Support. */
  kbArticle?: string;
  /** Installation status of the patch. */
  patchStatus?: "available" | "installed" | "pending";
}

export type AdvisoryType = "security_update" | "vuln_alert" | "security_bulletin";

export interface Advisory {
  id: string;
  title: string;
  /** English translation of the title, when available. */
  titleEn?: string;
  organization: DataSource;
  publishedDate: string; // ISO date
  /** Last time this advisory was updated by the issuing organization. */
  updatedAt?: string; // ISO date
  type: AdvisoryType;
  summary: string;
  /** English translation of the summary, when available. */
  summaryEn?: string;
  url: string;
}

export type KnowledgeType = "kb_article" | "security_baseline" | "hardening_guide" | "best_practice";

export interface KnowledgeArticle {
  id: string;
  title: string;
  /** English translation of the title, when available. */
  titleEn?: string;
  type: KnowledgeType;
  updatedAt: string; // ISO date
  summary: string;
  /** English translation of the summary, when available. */
  summaryEn?: string;
  relatedProducts: string[];
  url: string;
}

/** KPI summary used by the dashboard. */
export interface DashboardStats {
  critical: number;
  high: number;
  medium: number;
  low: number;
  /** Within the rolling 7-day window. */
  total: number;
  exploitedCount: number;
  lastUpdated: string; // ISO datetime
}

/** One day in the 7-day trend series. */
export interface TrendPoint {
  date: string; // YYYY-MM-DD
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface TypeDistributionSlice {
  label: string;
  /** English translation of the label, when available. */
  labelEn?: string;
  value: number;
}

export interface VendorDistributionSlice {
  label: string;
  /** English translation of the label, when available. */
  labelEn?: string;
  value: number;
}

export interface ThreatLandscape {
  series: TrendPoint[];
  typeDistribution: TypeDistributionSlice[];
  vendorDistribution: VendorDistributionSlice[];
  /** AI-style generated summary text. */
  insight: string;
  /** English translation of the insight, when available. */
  insightEn?: string;
}

/** The full aggregated payload served by the API layer. */
export interface AggregatedData {
  stats: DashboardStats;
  vulnerabilities: Vulnerability[];
  advisories: Advisory[];
  knowledge: KnowledgeArticle[];
  landscape: ThreatLandscape;
  generatedAt: string; // ISO datetime
}
