import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";

/**
 * Locale routing middleware.
 * - Bare `/` and any non-locale path are redirected to a locale-prefixed path
 *   (default zh, or guessed from Accept-Language).
 * - API routes, Next internals and static assets are passed through.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Pass through API, Next internals and static assets.
  if (
    first === "api" ||
    first === "_next" ||
    (first && first.startsWith("favicon"))
  ) {
    return NextResponse.next();
  }

  // Already locale-prefixed — nothing to do.
  if (first && isLocale(first)) {
    return NextResponse.next();
  }

  // No locale present (bare "/" or a path like "/vulnerabilities") — redirect.
  const guessed = negotiateLocale(request) ?? defaultLocale;
  const url = request.nextUrl.clone();
  const rest = segments.length ? "/" + segments.join("/") : "";
  url.pathname = `/${guessed}${rest}`;
  return NextResponse.redirect(url, 307);
}

function negotiateLocale(request: NextRequest): string | null {
  const header = request.headers.get("accept-language");
  if (!header) return null;
  const prefs = header
    .split(",")
    .map((p) => p.split(";")[0].trim().toLowerCase())
    .filter(Boolean);
  for (const pref of prefs) {
    if (pref.startsWith("zh")) return "zh";
    if (pref.startsWith("en")) return "en";
  }
  return null;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export { locales };
