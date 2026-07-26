import { cn } from "@/lib/utils";

const toneStyles = {
  MSRC: "bg-sisa-brand/10 text-sisa-brand ring-sisa-brand/25",
  NVD: "bg-sisa-glow/10 text-sisa-glow ring-sisa-glow/25",
  CISA: "bg-sisa-critical/10 text-sisa-critical ring-sisa-critical/25",
  CNNVD: "bg-sisa-safe/10 text-sisa-safe ring-sisa-safe/25",
  CNVD: "bg-sisa-warning/10 text-sisa-warning ring-sisa-warning/25",
} as const;

export function SourceTag({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const tone =
    (toneStyles as Record<string, string>)[source] ?? "bg-sisa-navy/10 text-sisa-navy ring-sisa-navy/20";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset",
        tone,
        className
      )}
    >
      {source}
    </span>
  );
}
