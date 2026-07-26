import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/types";

const severityStyles: Record<Severity, string> = {
  CRITICAL: "bg-sisa-critical/10 text-sisa-critical ring-sisa-critical/30",
  HIGH: "bg-sisa-critical/10 text-sisa-critical ring-sisa-critical/30",
  MEDIUM: "bg-sisa-warning/10 text-sisa-warning ring-sisa-warning/30",
  LOW: "bg-sisa-safe/10 text-sisa-safe ring-sisa-safe/30",
};

const severityLabels: Record<Severity, string> = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
};

export function SeverityBadge({
  severity,
  label,
  className,
}: {
  severity: Severity;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset",
        severityStyles[severity],
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          severity === "MEDIUM" ? "bg-sisa-warning" : "bg-sisa-critical"
        )}
      />
      {label ?? severityLabels[severity]}
    </span>
  );
}
