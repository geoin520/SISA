import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/types";

const sources: { label: string; url: string }[] = [
  { label: "MSRC", url: "https://msrc.microsoft.com/update-guide" },
  { label: "NVD", url: "https://nvd.nist.gov/" },
  { label: "CISA", url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog" },
  { label: "CNNVD", url: "https://www.cnnvd.org.cn/" },
  { label: "CNVD", url: "https://www.cnvd.org.cn/" },
];

export function Footer({ dict }: { dict: Dictionary; locale: Locale }) {
  return (
    <footer className="mt-16 border-t border-white/10 bg-sisa-navy text-white">
      <div className="bg-tech-grid">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sisa-brand">
                  <span>🔐</span>
                </span>
                <span className="text-base font-extrabold">
                  SISA<span className="text-sisa-glow">.ing</span>
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {dict.footer.disclaimer}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                {dict.footer.sources}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {sources.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-sisa-glow hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-white/50">
            {dict.footer.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}
