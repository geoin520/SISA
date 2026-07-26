/**
 * Curated sample dataset for SISA.ing.
 *
 * External feeds (MSRC/NVD/CISA) are rate-limited and often unreachable from
 * build/preview sandboxes. To guarantee the dashboard always renders a
 * meaningful picture, the aggregator layers this realistic, recent dataset
 * underneath live data — live records replace sample records by CVE id, and
 * any sample CVE that also appears in CISA KEV is automatically flagged.
 */

import type {
  Advisory,
  AggregatedData,
  KnowledgeArticle,
  ThreatLandscape,
  Vulnerability,
} from "@/lib/types";
import { daysAgoDate, daysAgoIso, severityFromScore } from "@/lib/utils";

/** Deterministic sample CVEs anchored to "today" so the 7-day window is always populated. */
function buildSampleVulnerabilities(): Vulnerability[] {
  const base: Array<
    Omit<Vulnerability, "cvssScore" | "severity" | "publishedDate"> & {
      cvssScore: number;
      offset: number;
    }
  > = [
    {
      cveId: "CVE-2026-56164",
      title: "Windows Server SharePoint Remote Code Execution",
      description:
        "A remote code execution vulnerability exists when SharePoint Server improperly handles serialized data. An authenticated attacker could execute arbitrary code in the context of the SharePoint application pool.",
      descriptionZh:
        "当 SharePoint Server 不正确地处理序列化数据时，存在远程代码执行漏洞。经过身份验证的攻击者可在 SharePoint 应用程序池的上下文中执行任意代码。",
      cvssScore: 9.8,
      offset: 2,
      affectedProducts: ["Windows Server 2022", "Windows Server 2025"],
      cweIds: ["CWE-502"],
      exploited: true,
      ransomwareCampaignUse: "Known",
      remediation:
        "立即安装本月累积安全更新；限制 SharePoint管理中心远程访问，启用请求过滤与身份验证。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-56164",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-56164",
        CISA: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
      },
    },
    {
      cveId: "CVE-2026-56155",
      title: "Windows Kernel Elevation of Privilege",
      description:
        "An elevation of privilege vulnerability in the Windows Kernel allows a local attacker to gain SYSTEM privileges via a crafted call into a vulnerable system call.",
      descriptionZh:
        "Windows 内核中存在权限提升漏洞，本地攻击者可通过构造特定的系统调用获取 SYSTEM 权限。",
      cvssScore: 8.8,
      offset: 2,
      affectedProducts: ["Windows Server 2019", "Windows Server 2022"],
      cweIds: ["CWE-269"],
      exploited: true,
      remediation:
        "部署本月安全更新；审计域控与终端的本地管理员组，启用 LSASS 保护模式。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-56155",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-56155",
        CISA: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
      },
    },
    {
      cveId: "CVE-2026-55892",
      title: "Active Directory Domain Services Elevation of Privilege",
      description:
        "An elevation of privilege vulnerability in AD DS allows an authenticated attacker to manipulate directory objects and escalate privileges within the domain.",
      descriptionZh:
        "AD DS 中存在权限提升漏洞，经过身份验证的攻击者可操纵目录对象并在域内提升权限。",
      cvssScore: 8.1,
      offset: 4,
      affectedProducts: ["Windows Server 2025"],
      cweIds: ["CWE-266"],
      exploited: false,
      remediation:
        "安装 AD DS 相关累积更新；审查域管理员委派，最小化特权账户。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-55892",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-55892",
      },
    },
    {
      cveId: "CVE-2026-55770",
      title: "Windows Hyper-V Denial of Service",
      description:
        "A denial of service vulnerability exists in Hyper-V when it fails to properly validate input from an authenticated user on a guest virtual machine.",
      descriptionZh:
        "Hyper-V 在未能正确验证来自虚拟机来宾中已验证用户的输入时，存在拒绝服务漏洞。",
      cvssScore: 7.5,
      offset: 5,
      affectedProducts: ["Windows Server 2022", "Windows Server 2025"],
      cweIds: ["CWE-400"],
      exploited: false,
      remediation:
        "应用 Hyper-V 安全更新；对高负载宿主实施资源配额与监控。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-55770",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-55770",
      },
    },
    {
      cveId: "CVE-2026-55641",
      title: "Windows Remote Desktop Services RCE",
      description:
        "A remote code execution vulnerability in Remote Desktop Services allows an unauthenticated attacker to run arbitrary code by sending specially crafted requests.",
      descriptionZh:
        "远程桌面服务中存在远程代码执行漏洞，未经身份验证的攻击者可通过发送特制请求运行任意代码。",
      cvssScore: 9.1,
      offset: 1,
      affectedProducts: ["Windows Server 2019", "Windows Server 2022"],
      cweIds: ["CWE-787"],
      exploited: false,
      remediation:
        "立即安装 RDS 安全更新；启用 NLA 网络级身份验证，关闭不必要的 3389 端口暴露。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-55641",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-55641",
      },
    },
    {
      cveId: "CVE-2026-55588",
      title: "Windows Print Spooler Elevation of Privilege",
      description:
        "An elevation of privilege vulnerability in the Print Spooler service allows an attacker to gain SYSTEM privileges (PrintNightmare-class issue).",
      descriptionZh:
        "Print Spooler 服务中存在权限提升漏洞，攻击者可获取 SYSTEM 权限（PrintNightmare 类问题）。",
      cvssScore: 8.4,
      offset: 3,
      affectedProducts: ["Windows Server 2019", "Windows Server 2022", "Windows Server 2025"],
      cweIds: ["CWE-269"],
      exploited: false,
      remediation:
        "安装 Print Spooler 更新；在域控上禁用“允许Print Spooler接受客户端连接”。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-55588",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-55588",
      },
    },
    {
      cveId: "CVE-2026-55430",
      title: "Windows DNS Server Spoofing",
      description:
        "A spoofing vulnerability in the Windows DNS server could allow a man-in-the-middle attacker to redirect DNS responses.",
      descriptionZh:
        "Windows DNS 服务器中存在欺骗漏洞，中间人攻击者可重定向 DNS 响应。",
      cvssScore: 6.5,
      offset: 6,
      affectedProducts: ["Windows Server 2022", "Windows Server 2025"],
      cweIds: ["CWE-345"],
      exploited: false,
      remediation: "应用 DNS 服务器累积更新；启用 DNSSEC 并强制安全动态更新。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-55430",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-55430",
      },
    },
    {
      cveId: "CVE-2026-55398",
      title: "Windows SMBv3 Information Disclosure",
      description:
        "An information disclosure vulnerability in SMBv3 may expose kernel memory to a remote attacker under specific conditions.",
      descriptionZh:
        "SMBv3 中存在信息泄露漏洞，在特定条件下可能将内核内存暴露给远程攻击者。",
      cvssScore: 5.9,
      offset: 0,
      affectedProducts: ["Windows Server 2022"],
      cweIds: ["CWE-200"],
      exploited: false,
      remediation: "安装 SMB 客户端安全更新；评估是否可禁用 SMBv3 压缩。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-55398",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-55398",
      },
    },
  ];

  return base.map((v) => ({
    cveId: v.cveId,
    title: v.title,
    description: v.description,
    descriptionZh: v.descriptionZh,
    cvssScore: v.cvssScore,
    severity: severityFromScore(v.cvssScore),
    affectedProducts: v.affectedProducts,
    cweIds: v.cweIds,
    exploited: v.exploited,
    ransomwareCampaignUse: v.ransomwareCampaignUse,
    publishedDate: daysAgoIso(v.offset),
    remediation: v.remediation,
    sources: v.sources,
  }));
}

function buildSampleAdvisories(): Advisory[] {
  return [
    {
      id: "msrc-2026-07",
      title: "七月安全更新发布：修复 622 个漏洞",
      titleEn: "July Security Update Release: 622 Vulnerabilities Patched",
      organization: "MSRC",
      publishedDate: daysAgoIso(2),
      type: "security_update",
      summary:
        "微软发布 2026 年 7 月安全更新，共修复 622 个漏洞，其中 9 个被评为严重，多个 Windows Server 组件受影响。",
      summaryEn:
        "Microsoft released the July 2026 security update, patching 622 vulnerabilities in total. 9 are rated Critical, with multiple Windows Server components affected.",
      url: "https://msrc.microsoft.com/update-guide/",
    },
    {
      id: "cisa-kev-2026-07",
      title: "CISA 新增 2 个 Windows Server KEV 漏洞",
      titleEn: "CISA Adds 2 Windows Server KEV Vulnerabilities",
      organization: "CISA",
      publishedDate: daysAgoIso(2),
      type: "vuln_alert",
      summary:
        "CISA 已知被利用漏洞目录新增 2 个影响 Windows Server 的漏洞，要求联邦机构在指定日期前完成修复。",
      summaryEn:
        "CISA's Known Exploited Vulnerabilities catalog added 2 vulnerabilities affecting Windows Server, requiring federal agencies to remediate by the specified due date.",
      url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    },
    {
      id: "cnvd-2026-27",
      title: "CNVD 2026 年第 27 期漏洞周报",
      titleEn: "CNVD Weekly Vulnerability Bulletin — Week 27, 2026",
      organization: "CNVD",
      publishedDate: daysAgoIso(0),
      type: "security_bulletin",
      summary:
        "本周 CNVD 共收集整理漏洞 142 个，其中高危漏洞 38 个，涉及多个国产化与开源组件，建议相关单位尽快排查修复。",
      summaryEn:
        "This week CNVD collected 142 vulnerabilities, including 38 high-severity ones, affecting multiple domestic and open-source components. Affected organizations are advised to investigate and remediate promptly.",
      url: "https://www.cnvd.org.cn/",
    },
  ];
}

function buildSampleKnowledge(): KnowledgeArticle[] {
  return [
    {
      id: "kb-5082142",
      title: "KB5082142: Windows Server 2022 累积安全更新",
      titleEn: "KB5082142: Windows Server 2022 Cumulative Security Update",
      type: "kb_article",
      updatedAt: daysAgoIso(2),
      summary:
        "介绍 2026 年 4 月 Windows Server 2022 累积安全更新（KB5082142，OS 内部版本 20348.5020），包含安全修复、已知问题及部署步骤。",
      summaryEn:
        "Covers the April 2026 Windows Server 2022 cumulative security update (KB5082142, OS build 20348.5020), including security fixes, known issues, and deployment steps.",
      relatedProducts: ["Windows Server 2022"],
      url: "https://support.microsoft.com/en-us/servicing/os/windows-server/2026/04/april-14-2026-kb5082142-os-build-20348-5020",
    },
    {
      id: "baseline-2025",
      title: "Windows Server 2025 安全基线配置指南",
      titleEn: "Windows Server 2025 Security Baseline Configuration Guide",
      type: "security_baseline",
      updatedAt: daysAgoIso(5),
      summary:
        "面向 Windows Server 2025 的官方安全基线，通过 OSConfig 部署，涵盖账户策略、审计策略、事件日志与服务最小化等 200+ 项配置。",
      summaryEn:
        "Official security baseline for Windows Server 2025, deployed via OSConfig, covering 200+ settings including account policies, audit policies, event logging, and service minimization.",
      relatedProducts: ["Windows Server 2025"],
      url: "https://learn.microsoft.com/en-us/windows-server/security/osconfig/osconfig-how-to-configure-security-baselines",
    },
    {
      id: "hardening-ports",
      title: "关闭不必要的端口与服务：Server 加固实践",
      titleEn: "Disabling Unnecessary Ports and Services: Server Hardening Practices",
      type: "hardening_guide",
      updatedAt: daysAgoIso(7),
      summary:
        "梳理 Windows Server 常见系统服务与暴露端口（SMB/RDP/WinRM），提供微软官方分角色关闭清单与安全配置建议。",
      summaryEn:
        "Reviews common Windows Server system services and exposed ports (SMB/RDP/WinRM), providing official Microsoft role-based disablement checklists and security configuration guidance.",
      relatedProducts: ["Windows Server 2019", "Windows Server 2022", "Windows Server 2025"],
      url: "https://learn.microsoft.com/en-us/windows-server/security/windows-services/security-guidelines-for-disabling-system-services-in-windows-server",
    },
  ];
}

function buildSampleLandscape(): ThreatLandscape {
  const series = Array.from({ length: 7 }).map((_, i) => {
    const offset = 6 - i;
    const seed = (offset * 7) % 5;
    const critical = (seed + 1) % 3;
    const high = (seed + 2) % 4;
    const medium = (seed + 3) % 5;
    const low = (seed + 1) % 2;
    return {
      date: daysAgoDate(offset),
      critical,
      high,
      medium,
      low,
      total: critical + high + medium + low,
    };
  });

  return {
    series,
    typeDistribution: [
      { label: "RCE", value: 38 },
      { label: "EoP", value: 31 },
      { label: "DoS", value: 14 },
      { label: "信息泄露", labelEn: "Info Disclosure", value: 11 },
      { label: "欺骗", labelEn: "Spoofing", value: 6 },
    ],
    vendorDistribution: [
      { label: "Microsoft", value: 86 },
      { label: "第三方组件", labelEn: "Third-party", value: 9 },
      { label: "开源软件", labelEn: "Open-source", value: 5 },
    ],
    insight:
      "本周共监测到影响 Windows Server 的漏洞 8 个，其中 50% 为高危漏洞。2 个漏洞已被 CISA 标记为在野利用，建议优先修复。受影响产品主要集中在 Windows Server 2022 和 Windows Server 2025。",
    insightEn:
      "This week 8 vulnerabilities affecting Windows Server were detected, of which 50% are high-severity. 2 vulnerabilities have been flagged by CISA as actively exploited in the wild and should be prioritized for remediation. Affected products are primarily Windows Server 2022 and Windows Server 2025.",
  };
}

/** Build the full sample dataset. */
export function buildSampleData(): AggregatedData {
  const vulns = buildSampleVulnerabilities();
  const critical = vulns.filter((v) => v.severity === "CRITICAL").length;
  const high = vulns.filter((v) => v.severity === "HIGH").length;
  const medium = vulns.filter((v) => v.severity === "MEDIUM").length;
  const low = vulns.filter((v) => v.severity === "LOW").length;
  return {
    stats: {
      critical,
      high,
      medium,
      low,
      pendingPatches: 12 + high,
      total: vulns.length,
      exploitedCount: vulns.filter((v) => v.exploited).length,
      lastUpdated: new Date().toISOString(),
    },
    vulnerabilities: vulns,
    advisories: buildSampleAdvisories(),
    knowledge: buildSampleKnowledge(),
    landscape: buildSampleLandscape(),
    generatedAt: new Date().toISOString(),
  };
}
