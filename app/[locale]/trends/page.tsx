import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAggregatedData } from "@/lib/data/aggregator";
import { SectionHeader } from "@/components/ui/card";
import { TrendChart } from "@/components/trends/trend-chart";
import { DistributionChart } from "@/components/trends/distribution-chart";

export const revalidate = 3600;

export default async function TrendsPage({
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
        icon="📊"
        title={dict.sections.trends.title}
        subtitle={dict.sections.trends.subtitle}
        description={dict.sections.trends.description}
      />

      <div className="rounded-xl border border-sisa-navy/10 bg-white p-5 shadow-card">
        <h3 className="mb-3 text-sm font-bold text-sisa-navy">
          {dict.sections.trends.weeklyTrend}
        </h3>
        <TrendChart series={data.landscape.series} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-sisa-navy/10 bg-white p-5 shadow-card">
          <h3 className="mb-3 text-sm font-bold text-sisa-navy">
            {dict.sections.trends.typeDistribution}
          </h3>
          <DistributionChart data={data.landscape.typeDistribution} locale={locale} />
        </div>
        <div className="rounded-xl border border-sisa-navy/10 bg-white p-5 shadow-card">
          <h3 className="mb-3 text-sm font-bold text-sisa-navy">
            {dict.sections.trends.vendorDistribution}
          </h3>
          <DistributionChart data={data.landscape.vendorDistribution} locale={locale} />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-sisa-brand/20 bg-sisa-brand/5 p-5">
        <span className="text-lg" aria-hidden>
          💡
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sisa-brand">
            {dict.sections.trends.insight}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-sisa-ink">
            {locale === "en" && data.landscape.insightEn
              ? data.landscape.insightEn
              : data.landscape.insight}
          </p>
        </div>
      </div>
    </div>
  );
}
