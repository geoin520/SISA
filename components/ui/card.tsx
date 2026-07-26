import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-sisa-navy/10 bg-white shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  icon,
  title,
  subtitle,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2.5">
          <span className="text-xl" aria-hidden>
            {icon}
          </span>
          <h2 className="text-lg font-bold text-sisa-navy sm:text-xl">{title}</h2>
          {subtitle && (
            <span className="hidden text-xs font-medium uppercase tracking-wider text-sisa-muted sm:inline">
              {subtitle}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-sisa-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
