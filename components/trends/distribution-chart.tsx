"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TypeDistributionSlice } from "@/lib/types";
import type { Locale } from "@/lib/types";

const palette = ["#0078D4", "#00A3FF", "#D13438", "#FFB900", "#107C10", "#5A5A5A"];

/** Donut chart for vulnerability-type / vendor distribution. */
export function DistributionChart({
  data,
  locale = "zh",
}: {
  data: TypeDistributionSlice[];
  locale?: Locale;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const localized = data.map((d) => ({
    ...d,
    displayLabel: locale === "en" && d.labelEn ? d.labelEn : d.label,
  }));
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <div className="h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={localized}
              dataKey="value"
              nameKey="displayLabel"
              innerRadius={42}
              outerRadius={70}
              paddingAngle={2}
              stroke="none"
            >
              {localized.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid rgba(10,30,60,0.1)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:grid-cols-1">
        {localized.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: palette[i % palette.length] }}
            />
            <span className="flex-1 truncate text-sisa-muted">{d.displayLabel}</span>
            <span className="font-semibold tabular-nums text-sisa-navy">
              {d.value}
            </span>
            <span className="text-sisa-muted">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
