import type { Locale } from "@/lib/types";

export const locales: Locale[] = ["zh", "en"];
export const defaultLocale: Locale = "zh";

export const localeLabels: Record<Locale, string> = {
  zh: "中文",
  en: "EN",
};

/** All route segment names that should be treated as non-locale routes. */
export const reservedSegments = new Set(["api", "_next", "favicon.ico"]);

export function isLocale(value: string): value is Locale {
  return value === "zh" || value === "en";
}

/** Map a pathname to a locale, falling back to the default. */
export function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg && isLocale(seg) ? seg : defaultLocale;
}
