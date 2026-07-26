import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/types";
import { LocaleSwitch } from "@/components/dashboard/locale-switch";

/** Top navigation bar — deep-navy band with brand, nav links, locale + subscribe. */
export function Header({
  locale,
  dict,
  active,
}: {
  locale: Locale;
  dict: Dictionary;
  active?: string;
}) {
  const base = `/${locale}`;
  const nav = [
    { href: `${base}`, key: "dashboard" as const },
    { href: `${base}/vulnerabilities`, key: "vulnerabilities" as const },
    { href: `${base}/advisories`, key: "advisories" as const },
    { href: `${base}/knowledge`, key: "knowledge" as const },
    { href: `${base}/trends`, key: "trends" as const },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-sisa-navy text-white">
      <div className="bg-tech-grid">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href={base} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sisa-brand shadow-glow">
              <span className="text-lg">🔐</span>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-tight">
                SISA<span className="text-sisa-glow">.ing</span>
              </span>
              <span className="hidden text-[10px] font-medium text-white/60 sm:block">
                {dict.meta.brand}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const isActive =
                active === item.key ||
                (item.key === "dashboard" && active === "home");
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {dict.nav[item.key]}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2.5">
            <LocaleSwitch />
            <Link
              href={`${base}#subscribe`}
              className="hidden items-center gap-1.5 rounded-lg bg-sisa-brand px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sisa-brand/90 sm:inline-flex"
            >
              <span aria-hidden>🔔</span>
              <span className="hidden md:inline">{dict.nav.subscribe}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
