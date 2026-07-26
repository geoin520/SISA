import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAggregatedData } from "@/lib/data/aggregator";
import { AdvisoryList } from "@/components/advisories/advisory-list";
import { SectionHeader } from "@/components/ui/card";

export const revalidate = 3600;

export default async function AdvisoriesPage({
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
        icon="🚨"
        title={dict.sections.advisories.title}
        subtitle={dict.sections.advisories.subtitle}
        description={dict.sections.advisories.description}
      />
      <AdvisoryList
        advisories={data.advisories}
        dict={dict}
        locale={locale}
        empty={dict.sections.advisories.empty}
      />
    </div>
  );
}
