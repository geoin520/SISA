import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Advisory, Locale } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { SourceTag } from "@/components/ui/source-tag";
import { formatDate } from "@/lib/utils";

const typeIcon: Record<string, string> = {
  security_update: "📦",
  vuln_alert: "🚨",
  security_bulletin: "📢",
};

export function AdvisoryList({
  advisories,
  dict,
  locale,
  empty,
}: {
  advisories: Advisory[];
  dict: Dictionary;
  locale: Locale;
  empty?: string;
}) {
  if (advisories.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-sisa-navy/15 bg-white/50 px-6 py-10 text-center text-sm text-sisa-muted">
        {empty ?? dict.sections.advisories.empty}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {advisories.map((a) => (
        <Card key={a.id} className="flex flex-col p-4 transition hover:shadow-md">
          <div className="flex items-center justify-between gap-2">
            <SourceTag source={a.organization} />
            <span className="text-[11px] text-sisa-muted">
              {formatDate(a.publishedDate, locale)}
            </span>
          </div>
          <div className="mt-3 flex items-start gap-2">
            <span className="text-base" aria-hidden>
              {typeIcon[a.type] ?? "📢"}
            </span>
            <h3 className="text-sm font-bold leading-snug text-sisa-navy">
              {locale === "en" && a.titleEn ? a.titleEn : a.title}
            </h3>
          </div>
          <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-sisa-muted">
            {locale === "en" && a.summaryEn ? a.summaryEn : a.summary}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded bg-sisa-navy/5 px-2 py-0.5 text-[11px] font-medium text-sisa-navy">
              {dict.advisory.types[a.type]}
            </span>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-sisa-brand hover:underline"
            >
              {dict.table.viewDetails} →
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}
