import { cn } from "@/lib/utils";

type Tone = "critical" | "high" | "medium" | "pending" | "safe" | "glow";

const toneStyles: Record<
  Tone,
  { ring: string; value: string; accent: string; iconBg: string }
> = {
  critical: {
    ring: "ring-sisa-critical/40",
    value: "text-sisa-critical",
    accent: "text-sisa-critical",
    iconBg: "bg-sisa-critical/20",
  },
  high: {
    ring: "ring-sisa-warning/40",
    value: "text-sisa-warning",
    accent: "text-sisa-warning",
    iconBg: "bg-sisa-warning/20",
  },
  medium: {
    ring: "ring-sisa-glow/40",
    value: "text-sisa-glow",
    accent: "text-sisa-glow",
    iconBg: "bg-sisa-glow/20",
  },
  pending: {
    ring: "ring-sisa-brand/40",
    value: "text-white",
    accent: "text-sisa-glow",
    iconBg: "bg-sisa-brand/30",
  },
  safe: {
    ring: "ring-sisa-safe/40",
    value: "text-sisa-safe",
    accent: "text-sisa-safe",
    iconBg: "bg-sisa-safe/20",
  },
  glow: {
    ring: "ring-sisa-glow/40",
    value: "text-sisa-glow",
    accent: "text-sisa-glow",
    iconBg: "bg-sisa-glow/20",
  },
};

export function KpiCard({
  label,
  value,
  icon,
  tone = "glow",
  hint,
  pulse,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tone?: Tone;
  hint?: string;
  pulse?: boolean;
}) {
  const t = toneStyles[tone];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-sisa-navy-2 p-4 text-white ring-1 ring-inset",
        t.ring,
        pulse && "animate-pulseGlow"
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-white/60">{label}</span>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-sm",
            t.iconBg
          )}
          aria-hidden
        >
          {icon}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={cn("text-3xl font-extrabold tabular-nums", t.value)}>
          {value}
        </span>
      </div>
      {hint && <p className="mt-1 text-[11px] text-white/50">{hint}</p>}
    </div>
  );
}
