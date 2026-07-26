import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { KnowledgeArticle, Locale } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

const typeIcon: Record<string, string> = {
  kb_article: "📄",
  security_baseline: "📐",
  hardening_guide: "🛡️",
  best_practice: "✅",
};

export function KnowledgeList({
  items,
  dict,
  locale,
  empty,
}: {
  items: KnowledgeArticle[];
  dict: Dictionary;
  locale: Locale;
  empty?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-sisa-navy/15 bg-white/50 px-6 py-10 text-center text-sm text-sisa-muted">
        {empty ?? dict.sections.knowledge.empty}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((k) => (
        <Card key={k.id} className="flex flex-col p-4 transition hover:shadow-md">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded bg-sisa-brand/10 px-2 py-0.5 text-[11px] font-bold text-sisa-brand">
              <span aria-hidden>{typeIcon[k.type] ?? "📄"}</span>
              {dict.knowledgeType[k.type]}
            </span>
            <span className="text-[11px] text-sisa-muted">
              {formatDate(k.updatedAt, locale)}
            </span>
          </div>
          <h3 className="mt-3 text-sm font-bold leading-snug text-sisa-navy">
            {locale === "en" && k.titleEn ? k.titleEn : k.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-sisa-muted">
            {locale === "en" && k.summaryEn ? k.summaryEn : k.summary}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="truncate text-[11px] text-sisa-muted">
              {k.relatedProducts.join(" · ")}
            </span>
            <a
              href={k.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-sisa-brand hover:underline"
            >
              {dict.table.viewDetails} →
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}
