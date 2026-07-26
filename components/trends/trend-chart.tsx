"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/lib/types";
import { useLocale } from "@/components/i18n/locale-provider";

const legendLabels = {
  zh: { critical: "严重", high: "高危", medium: "中危", low: "低危" },
  en: { critical: "Critical", high: "High", medium: "Medium", low: "Low" },
};

/** 7-day vulnerability trend — stacked area chart. */
export function TrendChart({ series }: { series: TrendPoint[] }) {
  const locale = useLocale();
  const labels = legendLabels[locale];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="g-crit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D13438" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#D13438" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="g-high" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFB900" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#FFB900" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="g-med" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00A3FF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00A3FF" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="g-low" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#107C10" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#107C10" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,30,60,0.08)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#5A5A5A" }}
            tickFormatter={(d: string) => d.slice(5)}
            stroke="rgba(10,30,60,0.15)"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#5A5A5A" }}
            stroke="rgba(10,30,60,0.15)"
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid rgba(10,30,60,0.1)",
              fontSize: 12,
              boxShadow: "0 8px 24px rgba(10,30,60,0.12)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="critical"
            name={labels.critical}
            stackId={undefined}
            stroke="#D13438"
            strokeWidth={2}
            fill="url(#g-crit)"
          />
          <Area
            type="monotone"
            dataKey="high"
            name={labels.high}
            stackId={undefined}
            stroke="#FFB900"
            strokeWidth={2}
            fill="url(#g-high)"
          />
          <Area
            type="monotone"
            dataKey="medium"
            name={labels.medium}
            stackId={undefined}
            stroke="#00A3FF"
            strokeWidth={2}
            fill="url(#g-med)"
          />
          <Area
            type="monotone"
            dataKey="low"
            name={labels.low}
            stackId={undefined}
            stroke="#107C10"
            strokeWidth={2}
            fill="url(#g-low)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
