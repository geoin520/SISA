import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAggregatedData } from "@/lib/data/aggregator";
import { VulnerabilityTable } from "@/components/vulnerabilities/vulnerability-list";
import { SectionHeader } from "@/components/ui/card";

export const revalidate = 3600;

export default async function VulnerabilitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === "en" ? "en" : "zh";
  const [dict, data] = await Promise.all([getDictionary(locale), getAggregatedData()]);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon="📋"
        title={dict.sections.vulnerabilities.title}
        subtitle={dict.sections.vulnerabilities.subtitle}
        description={dict.sections.vulnerabilities.description}
      />
      <div className="flex flex-wrap items-center gap-2 text-xs text-sisa-muted">
        <span className="rounded bg-sisa-navy/5 px-2 py-1 font-semibold text-sisa-navy">
          {data.stats.total} {dict.kpi.total}
        </span>
        <span className="rounded bg-sisa-critical/10 px-2 py-1 font-semibold text-sisa-critical">
          {data.stats.exploitedCount} {dict.kpi.exploited}
        </span>
        <span>· {dict.common.prioritizedByRisk}</span>
      </div>
      <VulnerabilityTable vulns={data.vulnerabilities} dict={dict} locale={locale} />
      <p className="text-xs text-sisa-muted">📎 {dict.sections.vulnerabilities.source}</p>
    </div>
  );
}
