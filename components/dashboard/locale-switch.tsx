"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

/** Compact [EN | 中文] toggle that swaps the locale segment of the current path. */
export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname() ?? "/";

  const buildHref = (target: "zh" | "en") => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] === "zh" || parts[0] === "en") parts[0] = target;
    else parts.unshift(target);
    return "/" + parts.join("/");
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/20 bg-white/5 p-0.5 text-xs font-semibold",
        className
      )}
    >
      {(["zh", "en"] as const).map((l) => (
        <Link
          key={l}
          href={buildHref(l)}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            locale === l ? "bg-sisa-brand text-white" : "text-white/70 hover:text-white"
          )}
          aria-current={locale === l}
        >
          {l === "zh" ? "中文" : "EN"}
        </Link>
      ))}
    </div>
  );
}
