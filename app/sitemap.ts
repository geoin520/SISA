import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sisa.ing";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/vulnerabilities", "/advisories", "/knowledge", "/trends"];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of ["zh", "en"]) {
    for (const route of routes) {
      entries.push({
        url: `${BASE}/${locale}${route}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }
  return entries;
}
