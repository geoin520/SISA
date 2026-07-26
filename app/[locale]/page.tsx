import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAggregatedData } from "@/lib/data/aggregator";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { SectionHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VulnerabilityList } from "@/components/vulnerabilities/vulnerability-list";
import { AdvisoryList } from "@/components/advisories/advisory-list";
import { KnowledgeList } from "@/components/knowledge/knowledge-list";
import { TrendChart } from "@/components/trends/trend-chart";
import { DistributionChart } from "@/components/trends/distribution-chart";
import { SubscribeForm } from "@/components/dashboard/subscribe-form";

export const revalidate = 3600; // ISR: refresh hourly

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === "en" ? "en" : "zh";
  const [dict, data] = await Promise.all([
    getDictionary(locale),
    getAggregatedData(),
  ]);

  const topVulns = data.vulnerabilities.slice(0, 5);
  const latestAdvisories = data.advisories.slice(0, 3);
  const latestKnowledge = data.knowledge.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-sisa-navy/10 bg-sisa-navy text-white">
        <div className="bg-tech-grid">
          <div className="flex flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sisa-brand/20 px-3 py-1 text-xs font-semibold text-sisa-glow ring-1 ring-inset ring-sisa-glow/30">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sisa-glow" />
                {dict.nav.dashboard} · {dict.common.last7Days}
              </span>
              <h1 className="mt-3 text-lg font-extrabold leading-tight whitespace-nowrap sm:text-xl lg:text-2xl">
                {dict.home.heroTitle}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                {dict.home.heroSubtitle}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href={`/${locale}/vulnerabilities`}>
                  {dict.home.heroCta} →
                </Button>
                <Button href={`/${locale}/trends`} variant="outline" className="border-white/20 text-white hover:border-sisa-glow hover:text-sisa-glow">
                  {dict.sections.trends.title}
                </Button>
              </div>
            </div>
            <KpiGrid stats={data.stats} dict={dict} locale={locale} />
          </div>
        </div>
      </section>

      {/* Section 1 — Vulnerabilities */}
      <section className="animate-fadeIn">
        <SectionHeader
          icon="📋"
          title={dict.sections.vulnerabilities.title}
          subtitle={dict.sections.vulnerabilities.subtitle}
          description={dict.sections.vulnerabilities.description}
          action={
            <Button href={`/${locale}/vulnerabilities`} variant="outline">
              {dict.sections.vulnerabilities.viewAll} →
            </Button>
          }
        />
        <VulnerabilityList
          vulns={topVulns}
          dict={dict}
          locale={locale}
          empty={dict.sections.vulnerabilities.empty}
        />
        <p className="mt-3 text-xs text-sisa-muted">
          📎 {dict.sections.vulnerabilities.source}
        </p>
      </section>

      {/* Section 2 — Advisories */}
      <section className="animate-fadeIn">
        <SectionHeader
          icon="🚨"
          title={dict.sections.advisories.title}
          subtitle={dict.sections.advisories.subtitle}
          description={dict.sections.advisories.description}
          action={
            <Button href={`/${locale}/advisories`} variant="outline">
              {dict.sections.advisories.viewAll} →
            </Button>
          }
        />
        <AdvisoryList
          advisories={latestAdvisories}
          dict={dict}
          locale={locale}
          empty={dict.sections.advisories.empty}
        />
      </section>

      {/* Section 3 — Knowledge */}
      <section className="animate-fadeIn">
        <SectionHeader
          icon="📚"
          title={dict.sections.knowledge.title}
          subtitle={dict.sections.knowledge.subtitle}
          description={dict.sections.knowledge.description}
          action={
            <Button href={`/${locale}/knowledge`} variant="outline">
              {dict.sections.knowledge.viewAll} →
            </Button>
          }
        />
        <KnowledgeList
          items={latestKnowledge}
          dict={dict}
          locale={locale}
          empty={dict.sections.knowledge.empty}
        />
      </section>

      {/* Section 4 — Threat landscape */}
      <section className="animate-fadeIn">
        <SectionHeader
          icon="📊"
          title={dict.sections.trends.title}
          subtitle={dict.sections.trends.subtitle}
          description={dict.sections.trends.description}
          action={
            <Button href={`/${locale}/trends`} variant="outline">
              {dict.sections.trends.viewAll} →
            </Button>
          }
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-sisa-navy/10 bg-white p-4 shadow-card lg:col-span-2">
            <h3 className="mb-3 text-sm font-bold text-sisa-navy">
              {dict.sections.trends.weeklyTrend}
            </h3>
            <TrendChart series={data.landscape.series} />
          </div>
          <div className="rounded-xl border border-sisa-navy/10 bg-white p-4 shadow-card">
            <h3 className="mb-3 text-sm font-bold text-sisa-navy">
              {dict.sections.trends.typeDistribution}
            </h3>
            <DistributionChart data={data.landscape.typeDistribution} locale={locale} />
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-sisa-brand/20 bg-sisa-brand/5 p-4">
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
      </section>

      {/* Subscribe */}
      <section
        id="subscribe"
        className="scroll-mt-20 overflow-hidden rounded-2xl border border-sisa-brand/20 bg-white p-6 shadow-card sm:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sisa-brand/10 px-3 py-1 text-xs font-semibold text-sisa-brand">
              🔔 {dict.nav.subscribe}
            </span>
            <h2 className="mt-3 text-xl font-bold text-sisa-navy">
              {dict.subscribe.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-sisa-muted">
              {dict.subscribe.description}
            </p>
          </div>
          <SubscribeForm labels={dict.subscribe} />
        </div>
      </section>
    </div>
  );
}
