import type { DashboardStats, Locale } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { formatDateTime } from "@/lib/utils";

/** KPI strip — four primary cards plus a secondary stat bar. */
export function KpiGrid({
  stats,
  dict,
  locale,
}: {
  stats: DashboardStats;
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard
          label={dict.kpi.critical}
          value={stats.critical}
          icon="🔴"
          tone="critical"
          pulse={stats.critical > 0}
          hint={dict.common.last7Days}
        />
        <KpiCard
          label={dict.kpi.high}
          value={stats.high}
          icon="🟠"
          tone="high"
          hint={dict.common.last7Days}
        />
        <KpiCard
          label={dict.kpi.medium}
          value={stats.medium + stats.low}
          icon="🟡"
          tone="medium"
          hint={dict.common.last7Days}
        />
        <KpiCard
          label={dict.kpi.total}
          value={stats.total}
          icon="📋"
          tone="glow"
          hint={dict.common.last7Days}
        />
      </div>

      {/* Secondary stat bar */}
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-sisa-navy/10 bg-white px-4 py-2.5 text-xs text-sisa-muted">
        <span className="flex items-center gap-1.5">
          {dict.kpi.total}
          <span className="font-semibold text-sisa-navy">{stats.total} 个</span>
        </span>
        <span className="h-3 w-px bg-sisa-navy/10" />
        <span className="flex items-center gap-1.5">
          {dict.kpi.exploited}
          <span className="font-semibold text-sisa-critical">
            {stats.exploitedCount} 个
          </span>
        </span>
        <span className="h-3 w-px bg-sisa-navy/10" />
        <span className="flex items-center gap-1.5">
          {dict.kpi.lastUpdated}:
          <span className="font-medium text-sisa-ink">
            {formatDateTime(stats.lastUpdated, locale)}
          </span>
        </span>
      </div>
    </div>
  );
}
