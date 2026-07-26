import { clsx, type ClassValue } from "clsx";

/** Tailwind-friendly className combiner. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format an ISO date string as YYYY-MM-DD. */
export function formatDate(iso: string, locale: "zh" | "en" = "zh"): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

/** Format an ISO datetime for "last updated" displays. */
export function formatDateTime(iso: string, locale: "zh" | "en" = "zh"): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/** Return an ISO date for `daysAgo` days before now. */
export function daysAgoIso(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Return YYYY-MM-DD for `daysAgo` days before now. */
export function daysAgoDate(daysAgo: number): string {
  return daysAgoIso(daysAgo).slice(0, 10);
}

/** True when the given ISO date falls within the last `days` days. */
export function withinLastDays(iso: string, days: number): boolean {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return false;
  return t >= Date.now() - days * 24 * 60 * 60 * 1000;
}

/** Map a CVSS score to a severity bucket. */
export function severityFromScore(score: number): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  if (score >= 9) return "CRITICAL";
  if (score >= 7) return "HIGH";
  if (score >= 4) return "MEDIUM";
  return "LOW";
}
