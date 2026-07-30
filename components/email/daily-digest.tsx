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
 * SISA.ing Daily Security Digest Email — full mirror of the website dashboard.
 *
 * Design rules:
 *  - pure white background (#FFFFFF)
 *  - dark body text (#1E1E1E)
 *  - brand blue (#0078D4) for banner + CTAs
 *  - critical red (#D13438) reserved for high-severity marks
 *  - inline-friendly (React Email renders to inline styles)
 *  - table-based layout for maximum email-client compatibility
 */

const C = {
  white: "#FFFFFF",
  brand: "#0078D4",
  navy: "#0A1E3C",
  critical: "#D13438",
  high: "#D97706",
  medium: "#0284C7",
  low: "#059669",
  ink: "#1E1E1E",
  muted: "#5A5A5A",
  border: "#E5E7EB",
  cardBg: "#F8FAFC",
  subtleBg: "#F0F4F9",
};

/* ─── helpers ───────────────────────────────────────────── */

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${m}/${day}`;
  } catch {
    return iso;
  }
}

function sevColor(s: string) {
  switch (s) {
    case "CRITICAL":
      return C.critical;
    case "HIGH":
      return C.high;
    case "MEDIUM":
      return C.medium;
    case "LOW":
      return C.low;
    default:
      return C.muted;
  }
}

function sevBg(s: string) {
  switch (s) {
    case "CRITICAL":
      return "#FEE2E2";
    case "HIGH":
      return "#FEF3C7";
    case "MEDIUM":
      return "#DBEAFE";
    case "LOW":
      return "#D1FAE5";
    default:
      return "#F3F4F6";
  }
}

function sevLabel(s: string) {
  const map: Record<string, string> = {
    CRITICAL: "严重",
    HIGH: "高危",
    MEDIUM: "中危",
    LOW: "低危",
  };
  return map[s] ?? s;
}

function advisoryTypeLabel(type: string) {
  const map: Record<string, string> = {
    security_update: "安全更新",
    vuln_alert: "漏洞预警",
    security_bulletin: "安全公告",
  };
  return map[type] ?? type;
}

function knowledgeTypeLabel(type: string) {
  const map: Record<string, string> = {
    kb_article: "KB 文章",
    security_baseline: "安全基线",
    hardening_guide: "加固指南",
    best_practice: "最佳实践",
  };
  return map[type] ?? type;
}

/* ─── sub-components ────────────────────────────────────── */

function SectionHeader({
  icon,
  title,
  subtitle,
  description,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  description?: string;
}) {
  return (
    <Section style={{ marginBottom: "16px" }}>
      <Text style={{ margin: "0 0 4px" }}>
        <span style={{ fontSize: "20px", marginRight: "8px" }}>{icon}</span>
        <span style={sectionHeaderTitle}>{title}</span>
      </Text>
      {subtitle && (
        <Text style={sectionHeaderSubtitle}>{subtitle}</Text>
      )}
      {description && (
        <Text style={sectionHeaderDesc}>{description}</Text>
      )}
    </Section>
  );
}

function KpiCard({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <Section style={{ ...kpiCardBase, backgroundColor: bg }}>
      <Text style={{ ...kpiValue, color }}>{value}</Text>
      <Text style={kpiLabel}>{label}</Text>
    </Section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Section style={emptyStateBox}>
      <Text style={emptyStateText}>{text}</Text>
    </Section>
  );
}

/* ─── main component ────────────────────────────────────── */

export function DailyDigestEmail({
  data,
  siteUrl = "https://sisa.ing",
}: {
  data: AggregatedData;
  siteUrl?: string;
}) {
  const topVulns = data.vulnerabilities.slice(0, 5);
  const topAdvisories = data.advisories.slice(0, 3);
  const topKnowledge = data.knowledge.slice(0, 3);
  const series = data.landscape.series;
  const typeDist = data.landscape.typeDistribution;
  const insight = data.landscape.insight;

  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  /* Max total for mini-bar scaling */
  const maxTotal = Math.max(
    ...series.map((s) => s.total),
    1
  );

  return (
    <Html>
      <Head />
      <Preview>SISA.ing 安全态势日报 · {today}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* ═════ HERO ═════ */}
          <Section style={heroBanner}>
            <Text style={heroBadge}>
              <span style={heroPill}>SISA.ing · 安全洞察 · 态势感知</span>
            </Text>
            <Text style={heroTitle}>
              Windows Server 安全情报，一站洞察
            </Text>
            <Text style={heroSubtitle}>
              SISA.ing 自动采集 MSRC、CISA、NVD、CNNVD、CNVD 等权威数据，
              从预警推送、影响评估到修复验证，提供全链路安全态势感知。
            </Text>
            <Text style={heroDate}>安全态势日报 · {today}</Text>
          </Section>

          {/* ═════ KPI GRID ═════ */}
          <Section style={sectionPadding}>
            <SectionHeader
              icon="📊"
              title="态势概览"
              subtitle="7 天滚动窗口安全态势关键指标"
            />

            {/* Primary 3 KPIs — table layout for email-client compatibility */}
            <table style={kpiTable} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td style={{ ...kpiTd, width: "33.33%" }}>
                    <div style={{ ...kpiCardBase, backgroundColor: "#FEE2E2" }}>
                      <Text style={{ ...kpiValue, color: C.critical }}>
                        {data.stats.critical}
                      </Text>
                      <Text style={kpiLabel}>严重</Text>
                    </div>
                  </td>
                  <td style={{ ...kpiTd, width: "33.33%" }}>
                    <div style={{ ...kpiCardBase, backgroundColor: "#FEF3C7" }}>
                      <Text style={{ ...kpiValue, color: C.high }}>
                        {data.stats.high}
                      </Text>
                      <Text style={kpiLabel}>高危</Text>
                    </div>
                  </td>
                  <td style={{ ...kpiTd, width: "33.33%" }}>
                    <div style={{ ...kpiCardBase, backgroundColor: "#DBEAFE" }}>
                      <Text style={{ ...kpiValue, color: C.medium }}>
                        {data.stats.medium + data.stats.low}
                      </Text>
                      <Text style={kpiLabel}>中低危</Text>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Secondary stats bar — table layout */}
            <table style={statBarTable} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td style={statBarTd}>
                    <span style={statBarLabel}>近7天漏洞总数</span>
                    <span style={{ ...statBarValue, color: C.navy }}>
                      {data.stats.total} 个
                    </span>
                  </td>
                  <td style={statBarDividerTd}>|</td>
                  <td style={statBarTd}>
                    <span style={statBarLabel}>已发现在野利用</span>
                    <span style={{ ...statBarValue, color: C.critical }}>
                      {data.stats.exploitedCount} 个
                    </span>
                  </td>
                  <td style={statBarDividerTd}>|</td>
                  <td style={statBarTd}>
                    <span style={statBarLabel}>最近更新</span>
                    <span style={{ ...statBarValue, color: C.ink, fontWeight: 500 }}>
                      {fmtDate(data.stats.lastUpdated)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* ═════ VULNERABILITIES ═════ */}
          <Section style={sectionPadding}>
            <SectionHeader
              icon="📋"
              title="漏洞与补丁库"
              subtitle="Vulnerability & Patch Database"
              description="集成微软安全更新指南等权威数据，自动追踪 CVE 漏洞与月度补丁。以下为近 7 天内有更新的高危漏洞，按风险优先级排序。"
            />

            {topVulns.length === 0 ? (
              <EmptyState text="近 7 天内未检测到影响 Windows Server 的漏洞更新。系统将持续监控，如有新的安全通告将第一时间更新。" />
            ) : (
              topVulns.map((v) => (
                <Section key={v.cveId} style={vulnCard}>
                  {/* top row: CVE + severity + CVSS + exploited */}
                  <Text style={{ margin: "0 0 8px" }}>
                    <span style={cveId}>{v.cveId}</span>
                    <span
                      style={{
                        ...badge,
                        color: sevColor(v.severity),
                        backgroundColor: sevBg(v.severity),
                      }}
                    >
                      {sevLabel(v.severity)}
                    </span>
                    <span style={cvssBadge}>
                      CVSS {v.cvssScore.toFixed(1)}
                    </span>
                    {v.exploited && (
                      <span style={exploitedBadge}>⚠ 已发现在野利用</span>
                    )}
                  </Text>

                  {/* title */}
                  <Text style={vulnTitle}>{v.title}</Text>

                  {/* description (if available) */}
                  {v.descriptionZh && (
                    <Text style={vulnDesc}>{v.descriptionZh}</Text>
                  )}

                  {/* metadata row */}
                  <Text style={metaRow}>
                    <span style={metaLabel}>影响范围：</span>
                    <span style={metaValue}>
                      {v.affectedProducts.join("、")}
                    </span>
                  </Text>
                  <Text style={metaRow}>
                    <span style={metaLabel}>发布日期：</span>
                    <span style={metaValue}>{fmtDate(v.publishedDate)}</span>
                    {v.updatedAt && (
                      <>
                        <span style={{ color: C.border, margin: "0 6px" }}>
                          ·
                        </span>
                        <span style={metaLabel}>更新日期：</span>
                        <span style={metaValue}>{fmtDate(v.updatedAt)}</span>
                      </>
                    )}
                  </Text>

                  {/* remediation */}
                  {v.remediation && (
                    <Text style={metaRow}>
                      <span style={metaLabel}>修复建议：</span>
                      <span style={metaValue}>{v.remediation}</span>
                    </Text>
                  )}

                  {/* source tags + link */}
                  <Text style={{ margin: "10px 0 0" }}>
                    {Object.entries(v.sources)
                      .filter(([, url]) => url)
                      .map(([src]) => (
                        <span key={src} style={sourceTag}>
                          {src}
                        </span>
                      ))}
                    <Link
                      href={v.sources.MSRC || v.sources.NVD || siteUrl}
                      style={detailLink}
                    >
                      查看详情 →
                    </Link>
                  </Text>
                </Section>
              ))
            )}

            {topVulns.length > 0 && (
              <Text style={dataSource}>
                数据来源：Microsoft Security Response Center · NIST NVD ·
                CISA KEV Catalog · 点击「详情」查看官方原始页面
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* ═════ ADVISORIES ═════ */}
          <Section style={sectionPadding}>
            <SectionHeader
              icon="🚨"
              title="预警与通告中心"
              subtitle="Advisories & Alerts Center"
              description="聚合来自 MSRC、CISA、国内 CERT 等机构的官方安全预警与通告。以下为近 7 天内发布或更新的最新通告。"
            />

            {topAdvisories.length === 0 ? (
              <EmptyState text="近 7 天内未收到来自官方机构的新安全通告。系统将持续监控各机构发布渠道，如有新的预警信息将第一时间推送。" />
            ) : (
              topAdvisories.map((a) => (
                <Section key={a.id} style={advisoryCard}>
                  <Text style={{ margin: "0 0 6px" }}>
                    <span style={sourceTag}>{a.organization}</span>
                    <span style={typeTag}>
                      {advisoryTypeLabel(a.type)}
                    </span>
                    <span style={{ ...metaValue, fontSize: "11px" }}>
                      {fmtDate(a.publishedDate)}
                      {a.updatedAt && a.updatedAt !== a.publishedDate && (
                        <span style={{ color: C.brand }}>
                          {" "}(更新 {fmtDate(a.updatedAt)})
                        </span>
                      )}
                    </span>
                  </Text>

                  <Text style={advisoryTitle}>{a.title}</Text>

                  {a.summary && (
                    <Text style={advisorySummary}>{a.summary}</Text>
                  )}

                  <Text style={{ margin: "8px 0 0" }}>
                    <Link href={a.url || siteUrl} style={detailLink}>
                      查看原文 →
                    </Link>
                  </Text>
                </Section>
              ))
            )}
          </Section>

          <Hr style={hr} />

          {/* ═════ KNOWLEDGE ═════ */}
          <Section style={sectionPadding}>
            <SectionHeader
              icon="📚"
              title="知识库与最佳实践"
              subtitle="Knowledge Base & Best Practices"
              description="微软官方 KB 文章、安全基线、加固指南与最佳实践，帮助运维团队快速落地修复与防护。"
            />

            {topKnowledge.length === 0 ? (
              <EmptyState text="知识库暂无新增内容。系统持续同步微软官方文档中心，如有新的 KB 文章或安全指南将第一时间收录。" />
            ) : (
              topKnowledge.map((k) => (
                <Section key={k.id} style={knowledgeCard}>
                  <Text style={{ margin: "0 0 6px" }}>
                    <span style={typeTag}>
                      {knowledgeTypeLabel(k.type)}
                    </span>
                    <span style={{ ...metaValue, fontSize: "11px" }}>
                      更新 {fmtDate(k.updatedAt)}
                    </span>
                  </Text>

                  <Text style={knowledgeTitle}>{k.title}</Text>

                  {k.summary && (
                    <Text style={knowledgeSummary}>{k.summary}</Text>
                  )}

                  {k.relatedProducts && k.relatedProducts.length > 0 && (
                    <Text style={metaRow}>
                      <span style={metaLabel}>相关产品：</span>
                      <span style={metaValue}>
                        {k.relatedProducts.join("、")}
                      </span>
                    </Text>
                  )}

                  <Text style={{ margin: "8px 0 0" }}>
                    <Link href={k.url || siteUrl} style={detailLink}>
                      查看原文 →
                    </Link>
                  </Text>
                </Section>
              ))
            )}
          </Section>

          <Hr style={hr} />

          {/* ═════ TRENDS ═════ */}
          <Section style={sectionPadding}>
            <SectionHeader
              icon="📊"
              title="态势分析"
              subtitle="Threat Landscape Analysis"
              description="基于近 7 天数据的多维度态势分析，帮助您把握安全趋势与风险分布。"
            />

            {/* Mini bar chart */}
            <Section style={chartContainer}>
              <Text style={chartTitle}>近 7 天漏洞趋势</Text>
              <table style={chartTable} cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    {series.map((s, idx) => {
                      const heightPct = Math.round((s.total / maxTotal) * 100);
                      return (
                        <td key={idx} style={chartCell}>
                          <div style={chartCountLabel}>{s.total}</div>
                          <div style={chartBarWrap}>
                            <div
                              style={{
                                ...chartBar,
                                height: `${Math.max(heightPct, 4)}%`,
                              }}
                            />
                          </div>
                          <div style={chartDateLabel}>{fmtDate(s.date)}</div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Type distribution */}
            {typeDist && typeDist.length > 0 && (
              <Section style={distContainer}>
                <Text style={distTitle}>类型分布</Text>
                <Text style={{ margin: "0" }}>
                  {typeDist.map((item, idx) => (
                    <span key={idx} style={distPill}>
                      <span
                        style={{
                          ...distDot,
                          backgroundColor:
                            idx === 0
                              ? C.critical
                              : idx === 1
                              ? C.high
                              : idx === 2
                              ? C.medium
                              : C.low,
                        }}
                      />
                      {item.label}
                      <span style={distCount}>{item.value}</span>
                    </span>
                  ))}
                </Text>
              </Section>
            )}

            {/* Key insight */}
            {insight && (
              <Section style={insightBox}>
                <Text style={insightLabel}>💡 关键洞察</Text>
                <Text style={insightText}>{insight}</Text>
              </Section>
            )}
          </Section>

          <Hr style={hr} />

          {/* ═════ FOOTER ═════ */}
          <Section style={footerSection}>
            <Section style={{ textAlign: "center" as const, marginBottom: "20px" }}>
              <Link href={siteUrl} style={ctaButton}>
                📎 查看全部安全态势 → {siteUrl}
              </Link>
            </Section>

            <Text style={footerSource}>
              数据来源：MSRC · CISA · NVD · CNNVD · CNVD · 微软安全更新指南
            </Text>

            <Text style={footerLegal}>
              本邮件由 SISA.ing 自动生成并发送。如不希望继续接收，可{" "}
              <Link href={`${siteUrl}/unsubscribe`} style={footerLink}>
                点击此处退订
              </Link>
              。
            </Text>

            <Text style={footerCopyright}>
              © {new Date().getFullYear()} SISA.ing · Windows Server 安全情报平台
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ─── style objects ─────────────────────────────────────── */

const body: React.CSSProperties = {
  backgroundColor: "#F5F5F5",
  margin: "0",
  padding: "20px 0",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  color: C.ink,
};

const container: React.CSSProperties = {
  backgroundColor: C.white,
  borderRadius: "8px",
  maxWidth: "640px",
  margin: "0 auto",
  padding: "0",
  border: `1px solid ${C.border}`,
  overflow: "hidden",
};

const heroBanner: React.CSSProperties = {
  backgroundColor: C.navy,
  padding: "36px 32px 28px",
  textAlign: "center" as const,
};

const heroBadge: React.CSSProperties = {
  margin: "0 0 14px",
};

const heroPill: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "rgba(255,255,255,0.12)",
  color: "#FFFFFF",
  fontSize: "12px",
  fontWeight: 500,
  padding: "4px 12px",
  borderRadius: "999px",
  letterSpacing: "0.5px",
};

const heroTitle: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: 700,
  margin: "0 0 10px",
  lineHeight: 1.3,
};

const heroSubtitle: React.CSSProperties = {
  color: "rgba(255,255,255,0.75)",
  fontSize: "14px",
  lineHeight: 1.6,
  margin: "0 0 16px",
};

const heroDate: React.CSSProperties = {
  color: "rgba(255,255,255,0.55)",
  fontSize: "12px",
  margin: "0",
  letterSpacing: "0.5px",
};

const sectionPadding: React.CSSProperties = {
  padding: "28px 32px",
};

const sectionHeaderTitle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  color: C.ink,
  verticalAlign: "middle",
};

const sectionHeaderSubtitle: React.CSSProperties = {
  margin: "2px 0 0",
  fontSize: "12px",
  color: C.muted,
  fontWeight: 400,
  letterSpacing: "0.3px",
};

const sectionHeaderDesc: React.CSSProperties = {
  margin: "8px 0 0",
  fontSize: "13px",
  color: C.muted,
  lineHeight: 1.6,
};

const kpiTable: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "12px 0",
  marginBottom: "16px",
};

const kpiTd: React.CSSProperties = {
  width: "25%",
  padding: "0",
  verticalAlign: "top" as const,
};

const kpiCardBase: React.CSSProperties = {
  borderRadius: "10px",
  padding: "16px 8px",
  textAlign: "center" as const,
  border: `1px solid ${C.border}`,
};

const kpiValue: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 700,
  margin: "0 0 4px",
  lineHeight: 1,
};

const kpiLabel: React.CSSProperties = {
  fontSize: "12px",
  color: C.muted,
  margin: "0",
  fontWeight: 500,
};

const statBarTable: React.CSSProperties = {
  width: "100%",
  backgroundColor: C.subtleBg,
  borderRadius: "8px",
  borderCollapse: "collapse",
};

const statBarTd: React.CSSProperties = {
  padding: "12px 8px",
  textAlign: "center" as const,
  fontSize: "13px",
  whiteSpace: "nowrap" as const,
};

const statBarDividerTd: React.CSSProperties = {
  padding: "0",
  textAlign: "center" as const,
  color: C.border,
  fontSize: "12px",
  width: "1%",
};

const statBarLabel: React.CSSProperties = {
  color: C.muted,
  fontSize: "12px",
  marginRight: "4px",
};

const statBarValue: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "14px",
};

const hr: React.CSSProperties = {
  borderColor: C.border,
  borderStyle: "solid",
  borderWidth: "1px 0 0",
  margin: "0 32px",
};

const vulnCard: React.CSSProperties = {
  backgroundColor: C.cardBg,
  border: `1px solid ${C.border}`,
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "14px",
};

const cveId: React.CSSProperties = {
  fontFamily:
    'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
  fontWeight: 700,
  fontSize: "14px",
  color: C.ink,
  marginRight: "8px",
};

const badge: React.CSSProperties = {
  display: "inline-block",
  fontSize: "11px",
  fontWeight: 600,
  padding: "2px 8px",
  borderRadius: "4px",
  marginRight: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.3px",
};

const cvssBadge: React.CSSProperties = {
  display: "inline-block",
  fontSize: "11px",
  fontWeight: 600,
  color: C.muted,
  backgroundColor: "#F3F4F6",
  padding: "2px 8px",
  borderRadius: "4px",
  marginRight: "6px",
};

const exploitedBadge: React.CSSProperties = {
  display: "inline-block",
  fontSize: "11px",
  fontWeight: 600,
  color: C.critical,
  backgroundColor: "#FEE2E2",
  padding: "2px 8px",
  borderRadius: "4px",
};

const vulnTitle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 600,
  color: C.ink,
  margin: "0 0 8px",
  lineHeight: 1.4,
};

const vulnDesc: React.CSSProperties = {
  fontSize: "13px",
  color: C.muted,
  lineHeight: 1.6,
  margin: "0 0 10px",
};

const metaRow: React.CSSProperties = {
  fontSize: "12px",
  margin: "0 0 4px",
  lineHeight: 1.5,
};

const metaLabel: React.CSSProperties = {
  color: C.muted,
  fontWeight: 500,
};

const metaValue: React.CSSProperties = {
  color: C.ink,
};

const sourceTag: React.CSSProperties = {
  display: "inline-block",
  fontSize: "11px",
  fontWeight: 500,
  color: C.brand,
  backgroundColor: "#EFF6FF",
  padding: "2px 8px",
  borderRadius: "4px",
  marginRight: "6px",
};

const typeTag: React.CSSProperties = {
  display: "inline-block",
  fontSize: "11px",
  fontWeight: 500,
  color: C.navy,
  backgroundColor: "#E2E8F0",
  padding: "2px 8px",
  borderRadius: "4px",
  marginRight: "6px",
};

const detailLink: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 500,
  color: C.brand,
  textDecoration: "none",
  marginLeft: "4px",
};

const dataSource: React.CSSProperties = {
  fontSize: "11px",
  color: C.muted,
  margin: "12px 0 0",
  textAlign: "center" as const,
};

const advisoryCard: React.CSSProperties = {
  backgroundColor: C.cardBg,
  border: `1px solid ${C.border}`,
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "14px",
};

const advisoryTitle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 600,
  color: C.ink,
  margin: "0 0 8px",
  lineHeight: 1.4,
};

const advisorySummary: React.CSSProperties = {
  fontSize: "13px",
  color: C.muted,
  lineHeight: 1.6,
  margin: "0",
};

const knowledgeCard: React.CSSProperties = {
  backgroundColor: C.cardBg,
  border: `1px solid ${C.border}`,
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "14px",
};

const knowledgeTitle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 600,
  color: C.ink,
  margin: "0 0 8px",
  lineHeight: 1.4,
};

const knowledgeSummary: React.CSSProperties = {
  fontSize: "13px",
  color: C.muted,
  lineHeight: 1.6,
  margin: "0 0 8px",
};

const emptyStateBox: React.CSSProperties = {
  border: `1.5px dashed ${C.border}`,
  borderRadius: "10px",
  padding: "24px",
  textAlign: "center" as const,
  backgroundColor: C.white,
};

const emptyStateText: React.CSSProperties = {
  fontSize: "13px",
  color: C.muted,
  margin: "0",
  lineHeight: 1.6,
};

const chartContainer: React.CSSProperties = {
  backgroundColor: C.cardBg,
  border: `1px solid ${C.border}`,
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "16px",
};

const chartTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: C.ink,
  margin: "0 0 12px",
};

const chartTable: React.CSSProperties = {
  width: "100%",
  height: "120px",
  borderCollapse: "collapse",
};

const chartCell: React.CSSProperties = {
  verticalAlign: "bottom" as const,
  textAlign: "center" as const,
  padding: "0 4px",
  width: `${100 / 7}%`,
};

const chartBarWrap: React.CSSProperties = {
  height: "90px",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  backgroundColor: "#F3F4F6",
  borderRadius: "4px 4px 0 0",
  overflow: "hidden",
};

const chartBar: React.CSSProperties = {
  width: "60%",
  backgroundColor: C.brand,
  borderRadius: "4px 4px 0 0",
  minHeight: "4px",
};

const chartCountLabel: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  color: C.navy,
  marginBottom: "4px",
  textAlign: "center" as const,
};

const chartDateLabel: React.CSSProperties = {
  fontSize: "10px",
  color: C.muted,
  marginTop: "4px",
};

const distContainer: React.CSSProperties = {
  backgroundColor: C.cardBg,
  border: `1px solid ${C.border}`,
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "16px",
};

const distTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: C.ink,
  margin: "0 0 10px",
};

const distPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
  color: C.ink,
  backgroundColor: C.white,
  border: `1px solid ${C.border}`,
  padding: "4px 10px",
  borderRadius: "999px",
  marginRight: "8px",
  marginBottom: "6px",
};

const distDot: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  display: "inline-block",
};

const distCount: React.CSSProperties = {
  fontWeight: 700,
  color: C.muted,
  marginLeft: "2px",
};

const insightBox: React.CSSProperties = {
  backgroundColor: "#FFFBEA",
  border: "1px solid #FDE68A",
  borderRadius: "10px",
  padding: "16px",
};

const insightLabel: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: C.high,
  margin: "0 0 6px",
};

const insightText: React.CSSProperties = {
  fontSize: "13px",
  color: C.ink,
  lineHeight: 1.6,
  margin: "0",
};

const footerSection: React.CSSProperties = {
  padding: "24px 32px 32px",
  textAlign: "center" as const,
};

const ctaButton: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: C.brand,
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: "8px",
  textDecoration: "none",
};

const footerSource: React.CSSProperties = {
  fontSize: "11px",
  color: C.muted,
  margin: "16px 0 8px",
};

const footerLegal: React.CSSProperties = {
  fontSize: "11px",
  color: C.muted,
  margin: "0 0 8px",
};

const footerLink: React.CSSProperties = {
  color: C.brand,
  textDecoration: "none",
};

const footerCopyright: React.CSSProperties = {
  fontSize: "11px",
  color: "#9CA3AF",
  margin: "0",
};
