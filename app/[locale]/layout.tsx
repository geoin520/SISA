import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales } from "@/lib/i18n/config";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { Header } from "@/components/dashboard/header";
import { Footer } from "@/components/dashboard/footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = isLocale(locale) ? await getDictionary(locale) : await getDictionary("zh");
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: {
        zh: "/zh",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "zh";
  if (!isLocale(localeParam)) notFound();
  const dict = await getDictionary(locale);

  return (
    <LocaleProvider locale={locale}>
      <html lang={locale}>
        <body className="min-h-screen bg-sisa-bg antialiased">
          <Header locale={locale} dict={dict} />
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
          <Footer dict={dict} locale={locale} />
        </body>
      </html>
    </LocaleProvider>
  );
}
