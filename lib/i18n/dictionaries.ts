import type { Locale } from "@/lib/types";

/**
 * Translation dictionaries for SISA.ing.
 * Keys are nested by UI area. Access via the `t` helper in server components.
 */
export const dictionaries = {
  zh: {
    meta: {
      title: "SISA.ing · 安全洞察 · 态势感知",
      description:
        "一站式 Windows Server 安全情报聚合平台，聚合 MSRC、NVD、CISA、CNNVD、CNVD 等权威数据源。",
      brand: "安全洞察 · 态势感知",
    },
    nav: {
      dashboard: "态势感知仪表盘",
      vulnerabilities: "漏洞与补丁库",
      advisories: "预警与通告中心",
      knowledge: "知识库与最佳实践",
      trends: "态势分析",
      subscribe: "订阅邮件通知",
    },
    footer: {
      sources: "数据来源",
      copyright: "© 2026 SISA.ing · 安全洞察 · 态势感知",
      disclaimer: "所有数据均来自官方源，本站仅做聚合展示，提供原始链接。",
    },
    kpi: {
      critical: "严重",
      high: "高危",
      medium: "中危",
      low: "低危",
      lastUpdated: "最近更新",
      total: "近7天漏洞总数",
      exploited: "已发现在野利用",
    },
    sections: {
      vulnerabilities: {
        title: "漏洞与补丁库",
        subtitle: "Vulnerability & Patch Database",
        description:
          "集成微软安全更新指南等权威数据，自动追踪 CVE 漏洞与月度补丁。以下为近 7 天内有更新的高危漏洞（CVSS 评分 ≥ 7.0），按风险优先级排序。",
        viewAll: "查看全部漏洞",
        empty:
          "近 7 天内未检测到影响 Windows Server 的漏洞更新。系统将持续监控，如有新的安全通告将第一时间更新。建议您定期访问本页面或订阅邮件通知。",
        source: "数据来源：Microsoft Security Response Center · NIST NVD · CISA KEV Catalog · 点击「详情」查看官方原始页面",
      },
      advisories: {
        title: "预警与通告中心",
        subtitle: "Advisories & Alerts Center",
        description:
          "聚合来自 MSRC、CISA、国内 CERT 等机构的官方安全预警与通告。以下为近 7 天内发布或更新的最新通告。",
        viewAll: "查看全部通告",
        empty:
          "近 7 天内未收到来自官方机构的新安全通告。系统将持续监控各机构发布渠道，如有新的预警信息将第一时间推送。",
      },
      knowledge: {
        title: "知识库与最佳实践",
        subtitle: "Knowledge Base & Best Practices",
        description:
          "整理 KB 文章、安全基线、配置加固指南等实用资源，帮助您构建更安全的 Windows Server 环境。",
        viewAll: "查看全部知识",
        empty:
          "近 7 天内暂无新的知识库内容更新。建议访问微软官方文档库获取更多 Windows Server 安全配置指南。",
      },
      trends: {
        title: "态势分析",
        subtitle: "Threat Landscape",
        description:
          "整合第三方安全厂商的威胁情报，提供攻击趋势分析，帮助您把握整体安全态势。",
        viewAll: "查看完整态势分析",
        weeklyTrend: "本周漏洞趋势",
        typeDistribution: "漏洞类型分布",
        vendorDistribution: "厂商分布",
        insight: "关键洞察",
        empty:
          "本周暂无足够的态势数据进行分析。系统将持续积累数据，随着数据量增加，态势分析将更加全面和准确。",
      },
    },
    table: {
      cveId: "CVE 编号",
      title: "漏洞标题",
      cvss: "CVSS",
      severity: "等级",
      affectedProducts: "影响范围",
      exploited: "利用状态",
      publishedDate: "发布日期",
      updatedDate: "更新日期",
      remediation: "修复建议",
      actions: "操作",
      viewDetails: "查看详情",
      officialSource: "官方来源",
    },
    advisory: {
      title: "通告标题",
      organization: "发布机构",
      publishedDate: "发布时间",
      updatedDate: "更新时间",
      type: "通告类型",
      summary: "摘要",
      actions: "操作",
      types: {
        security_update: "安全更新",
        vuln_alert: "漏洞预警",
        security_bulletin: "安全公告",
      },
    },
    knowledgeType: {
      kb_article: "KB 文章",
      security_baseline: "安全基线",
      hardening_guide: "加固指南",
      best_practice: "最佳实践",
    },
    severity: {
      CRITICAL: "严重",
      HIGH: "高危",
      MEDIUM: "中危",
      LOW: "低危",
    },
    exploited: {
      true: "已发现在野利用",
      false: "未发现利用",
    },
    common: {
      last7Days: "近 7 天",
      loading: "加载中…",
      noData: "暂无数据",
      topN: "TOP {n}",
    },
    subscribe: {
      title: "订阅安全态势日报",
      description: "每日 09:00 收到前 24 小时 Windows Server 安全态势汇总。",
      emailLabel: "邮箱地址",
      emailPlaceholder: "you@example.com",
      submit: "立即订阅",
      success: "订阅成功，敬请期待每日安全态势日报。",
      agree: "我同意接收 SISA.ing 发送的安全态势邮件。",
    },
    home: {
      heroTitle: "Windows Server 安全情报，一站洞察",
      heroSubtitle:
        "SISA.ing 自动采集 MSRC、CISA、NVD、CNNVD、CNVD 等权威数据，从预警推送、影响评估到修复验证，提供全链路安全态势感知。",
      heroCta: "进入态势感知仪表盘",
      heroSecondary: "了解数据来源",
    },
  },
  en: {
    meta: {
      title: "SISA.ing · Security Insights & Situational Awareness",
      description:
        "A one-stop Windows Server security intelligence hub aggregating MSRC, NVD, CISA, CNNVD and CNVD.",
      brand: "Security Insights & Situational Awareness",
    },
    nav: {
      dashboard: "Security Dashboard",
      vulnerabilities: "Vulnerability & Patch Database",
      advisories: "Advisories & Alerts Center",
      knowledge: "Knowledge Base & Best Practices",
      trends: "Threat Landscape",
      subscribe: "Subscribe to Email Alerts",
    },
    footer: {
      sources: "Data Sources",
      copyright: "© 2026 SISA.ing · Security Insights & Situational Awareness",
      disclaimer:
        "All data is sourced from official channels. This site only aggregates and links to original sources.",
    },
    kpi: {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      lastUpdated: "Last updated",
      total: "Vulns (last 7 days)",
      exploited: "Actively Exploited",
    },
    sections: {
      vulnerabilities: {
        title: "Vulnerability & Patch Database",
        subtitle: "Vulnerability & Patch Database",
        description:
          "Integrates the Microsoft Security Update Guide and other authoritative sources to automatically track CVEs and monthly patches. Below are high-severity vulnerabilities (CVSS ≥ 7.0) updated in the last 7 days, prioritized by risk.",
        viewAll: "View all vulnerabilities",
        empty:
          "No vulnerability updates affecting Windows Server were detected in the last 7 days. The system keeps monitoring and will update immediately when new advisories arrive. Visit this page regularly or subscribe to email alerts.",
        source:
          "Sources: Microsoft Security Response Center · NIST NVD · CISA KEV Catalog · Click “Details” for the official page.",
      },
      advisories: {
        title: "Advisories & Alerts Center",
        subtitle: "Advisories & Alerts Center",
        description:
          "Aggregates official advisories from MSRC, CISA and domestic CERTs. Below are the latest advisories published or updated in the last 7 days.",
        viewAll: "View all advisories",
        empty:
          "No new official advisories in the last 7 days. The system keeps monitoring all publisher channels and will push new alerts immediately.",
      },
      knowledge: {
        title: "Knowledge Base & Best Practices",
        subtitle: "Knowledge Base & Best Practices",
        description:
          "Curated KB articles, security baselines and hardening guides to help you build a more secure Windows Server environment.",
        viewAll: "View all knowledge",
        empty:
          "No new knowledge base updates in the last 7 days. Visit the official Microsoft documentation library for more Windows Server security guidance.",
      },
      trends: {
        title: "Threat Landscape",
        subtitle: "Threat Landscape",
        description:
          "Integrates third-party threat intelligence to provide attack-trend analysis and help you grasp the overall security posture.",
        viewAll: "View full threat landscape",
        weeklyTrend: "Weekly vulnerability trend",
        typeDistribution: "Type distribution",
        vendorDistribution: "Vendor distribution",
        insight: "Key insight",
        empty:
          "Not enough trend data this week. The system keeps accumulating data; analysis will become more comprehensive over time.",
      },
    },
    table: {
      cveId: "CVE ID",
      title: "Title",
      cvss: "CVSS",
      severity: "Severity",
      affectedProducts: "Affected Products",
      exploited: "Exploitation",
      publishedDate: "Published",
      updatedDate: "Last Updated",
      remediation: "Remediation Guidance",
      actions: "Actions",
      viewDetails: "View Details",
      officialSource: "Official Source",
    },
    advisory: {
      title: "Title",
      organization: "Organization",
      publishedDate: "Published",
      updatedDate: "Updated",
      type: "Type",
      summary: "Summary",
      actions: "Actions",
      types: {
        security_update: "Security Update",
        vuln_alert: "Vulnerability Alert",
        security_bulletin: "Security Bulletin",
      },
    },
    knowledgeType: {
      kb_article: "KB Article",
      security_baseline: "Security Baseline",
      hardening_guide: "Hardening Guide",
      best_practice: "Best Practice",
    },
    severity: {
      CRITICAL: "CRITICAL",
      HIGH: "HIGH",
      MEDIUM: "MEDIUM",
      LOW: "LOW",
    },
    exploited: {
      true: "Actively Exploited in the Wild",
      false: "No Known Exploitation",
    },
    common: {
      last7Days: "Last 7 Days",
      loading: "Loading…",
      noData: "No data",
      topN: "TOP {n}",
    },
    subscribe: {
      title: "Subscribe to the daily security digest",
      description:
        "Receive a 24-hour Windows Server security summary at 09:00 daily.",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      submit: "Subscribe now",
      success: "Subscribed! Watch for the daily security digest.",
      agree: "I agree to receive SISA.ing security posture emails.",
    },
    home: {
      heroTitle: "Windows Server security intelligence, all in one view",
      heroSubtitle:
        "SISA.ing automatically aggregates MSRC, CISA, NVD, CNNVD and CNVD — from alerting and impact assessment to remediation verification — for end-to-end situational awareness.",
      heroCta: "Open the Security Dashboard",
      heroSecondary: "Learn about data sources",
    },
  },
};

export type Dictionary = (typeof dictionaries)["zh"];

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries.zh;
}

/** Resolve a dotted key path against a dictionary object. */
export function t(dict: Dictionary, path: string, vars?: Record<string, string | number>): string {
  const parts = path.split(".");
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return path;
    }
  }
  let str = typeof cur === "string" ? cur : path;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}
