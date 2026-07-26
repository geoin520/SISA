import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAggregatedData } from "@/lib/data/aggregator";
import { KnowledgeList } from "@/components/knowledge/knowledge-list";
import { SectionHeader } from "@/components/ui/card";

export const revalidate = 3600;

export default async function KnowledgePage({
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
        icon="📚"
        title={dict.sections.knowledge.title}
        subtitle={dict.sections.knowledge.subtitle}
        description={dict.sections.knowledge.description}
      />
      <KnowledgeList
        items={data.knowledge}
        dict={dict}
        locale={locale}
        empty={dict.sections.knowledge.empty}
      />
    </div>
  );
}
