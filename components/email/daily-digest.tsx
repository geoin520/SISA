import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { AggregatedData } from "@/lib/types";

/**
 * SISA.ing daily security digest email.
 *
 * Design rules (per spec):
 *  - pure white background (#FFFFFF)
 *  - black/dark-gray body text
 *  - brand blue (#0078D4) for banner + buttons only
 *  - critical red (#D13438) reserved for high-severity marks
 *  - inline-friendly (React Email renders to inline styles)
 */

const COLORS = {
  white: "#FFFFFF",
  brand: "#0078D4",
  navy: "#0A1E3C",
  critical: "#D13438",
  ink: "#1E1E1E",
  muted: "#5A5A5A",
  border: "#E5E7EB",
  cardBg: "#F8FAFC",
};

export function DailyDigestEmail({
  data,
  siteUrl = "https://sisa.ing",
}: {
  data: AggregatedData;
  siteUrl?: string;
}) {
  const highRisk = data.vulnerabilities
    .filter((v) => v.severity === "CRITICAL" || v.severity === "HIGH")
    .slice(0, 5);
  const topAdvisories = data.advisories.slice(0, 3);
  const date = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>SISA.ing 安全态势日报 · {date}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Brand banner */}
          <Section style={{ ...banner, backgroundColor: COLORS.brand }}>
            <Text style={bannerTitle}>🔐 SISA.ing · 安全洞察 · 态势感知</Text>
            <Text style={bannerSub}>安全态势日报 · {date}</Text>
          </Section>

          {/* KPI overview */}
          <Section style={{ padding: "24px 0 8px" }}>
            <Heading as="h2" style={h2}>
              📊 今日态势概览
            </Heading>
            <Section style={kpiRow}>
              <KpiCell label="高危" value={data.stats.critical} accent={COLORS.critical} />
              <KpiCell label="中危" value={data.stats.medium + data.stats.low} accent={COLORS.brand} />
              <KpiCell label="待安装" value={data.stats.pendingPatches} accent={COLORS.navy} />
            </Section>
            <Text style={mutedText}>
              近 24 小时共监测 {data.stats.total} 个漏洞，其中 {data.stats.exploitedCount} 个已发现在野利用。
            </Text>
          </Section>

          <Hr style={hr} />

          {/* High-risk vulnerabilities */}
          <Section style={{ padding: "8px 0" }}>
            <Heading as="h2" style={h2}>
              🔴 需立即关注（高危漏洞）
            </Heading>
            {highRisk.length === 0 ? (
              <Text style={mutedText}>今日暂无新增高危漏洞。</Text>
            ) : (
              highRisk.map((v) => (
                <Section key={v.cveId} style={vulnRow}>
                  <Text style={{ margin: "0 0 4px" }}>
                    <span style={vulnCve}>{v.cveId}</span>{" "}
                    <span style={severityBadge(v.severity === "CRITICAL", v.exploited)}>
                      {v.severity} · CVSS {v.cvssScore.toFixed(1)}
                      {v.exploited ? " · 在野利用" : ""}
                    </span>
                  </Text>
                  <Text style={vulnTitle}>{v.title}</Text>
                  <Link
                    href={v.sources.MSRC || v.sources.NVD || siteUrl}
                    style={linkStyle}
                  >
                    查看详情 →
                  </Link>
                </Section>
              ))
            )}
          </Section>

          <Hr style={hr} />

          {/* Latest advisories */}
          <Section style={{ padding: "8px 0" }}>
            <Heading as="h2" style={h2}>
              📰 最新通告
            </Heading>
            {topAdvisories.map((a) => (
              <Section key={a.id} style={{ ...vulnRow, paddingBottom: "12px" }}>
                <Text style={{ margin: "0 0 2px" }}>
                  <span style={orgTag}>{a.organization}</span>{" "}
                  <span style={vulnTitle}>{a.title}</span>
                </Text>
                <Text style={mutedText}>{a.summary}</Text>
                <Link href={a.url} style={linkStyle}>
                  查看原文 →
                </Link>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Footer / CTA */}
          <Section style={{ padding: "16px 0", textAlign: "center" }}>
            <Link href={siteUrl} style={ctaButton}>
              📎 查看全部 → {siteUrl.replace(/^https?:\/\//, "")}
            </Link>
            <Text style={{ ...mutedText, marginTop: "16px", fontSize: "12px" }}>
              此邮件由 SISA.ing 自动生成 · 数据来源：MSRC | NVD | CISA | CNNVD | CNVD
            </Text>
            <Text style={{ ...mutedText, fontSize: "11px", color: "#9CA3AF" }}>
              如需退订，请回复本邮件。© 2026 SISA.ing
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function KpiCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Section style={{ ...kpiCell, borderColor: COLORS.border }}>
      <Text style={{ ...kpiValue, color: accent }}>{value}</Text>
      <Text style={kpiLabel}>{label}</Text>
    </Section>
  );
}

function severityBadge(critical: boolean, exploited: boolean) {
  return {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 700,
    color: critical || exploited ? COLORS.critical : COLORS.brand,
    backgroundColor: critical || exploited ? "#FEE2E2" : "#DBEAFE",
  } as const;
}

const body: React.CSSProperties = {
  backgroundColor: "#F0F4F9",
  fontFamily: "Segoe UI, PingFang SC, Microsoft YaHei, Arial, sans-serif",
  margin: 0,
  padding: 0,
};
const container: React.CSSProperties = {
  backgroundColor: COLORS.white,
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden",
};
const banner: React.CSSProperties = { padding: "20px 24px", textAlign: "center" };
const bannerTitle: React.CSSProperties = {
  color: COLORS.white,
  fontSize: "18px",
  fontWeight: 700,
  margin: 0,
};
const bannerSub: React.CSSProperties = {
  color: "#FFFFFF",
  opacity: 0.85,
  fontSize: "13px",
  margin: "4px 0 0",
};
const h2: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 700,
  color: COLORS.navy,
  margin: "0 0 12px",
};
const hr: React.CSSProperties = {
  borderColor: COLORS.border,
  margin: "0",
};
const kpiRow: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginTop: "8px",
};
const kpiCell: React.CSSProperties = {
  flex: "1",
  border: `1px solid ${COLORS.border}`,
  borderRadius: "8px",
  backgroundColor: COLORS.cardBg,
  padding: "12px 8px",
  textAlign: "center",
};
const kpiValue: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 800,
  margin: 0,
  lineHeight: 1.1,
};
const kpiLabel: React.CSSProperties = {
  fontSize: "12px",
  color: COLORS.muted,
  margin: "4px 0 0",
};
const mutedText: React.CSSProperties = {
  fontSize: "13px",
  color: COLORS.muted,
  lineHeight: 1.6,
  margin: "8px 0",
};
const vulnRow: React.CSSProperties = {
  padding: "10px 0",
  borderTop: `1px solid ${COLORS.border}`,
};
const vulnCve: React.CSSProperties = {
  fontFamily: "ui-monospace, Menlo, monospace",
  fontSize: "12px",
  fontWeight: 700,
  color: COLORS.navy,
};
const vulnTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: COLORS.ink,
  margin: "0 0 4px",
};
const orgTag: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 6px",
  borderRadius: "3px",
  fontSize: "11px",
  fontWeight: 700,
  color: COLORS.white,
  backgroundColor: COLORS.brand,
};
const linkStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: COLORS.brand,
  textDecoration: "none",
};
const ctaButton: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 28px",
  backgroundColor: COLORS.brand,
  color: COLORS.white,
  fontSize: "14px",
  fontWeight: 700,
  borderRadius: "8px",
  textDecoration: "none",
};
