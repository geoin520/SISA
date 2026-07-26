import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SISA.ing · 安全洞察 · 态势感知",
  description:
    "一站式 Windows Server 安全情报聚合平台，聚合 MSRC、NVD、CISA、CNNVD、CNVD 等权威数据源。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://sisa.ing"),
  keywords: [
    "Windows Server",
    "安全",
    "漏洞",
    "MSRC",
    "NVD",
    "CISA",
    "态势感知",
    "Security",
    "Vulnerability",
  ],
  openGraph: {
    title: "SISA.ing · 安全洞察 · 态势感知",
    description:
      "一站式 Windows Server 安全情报聚合平台，聚合 MSRC、NVD、CISA、CNNVD、CNVD 等权威数据源。",
    siteName: "SISA.ing",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
