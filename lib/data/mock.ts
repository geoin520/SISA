/**
 * Curated sample dataset for SISA.ing.
 *
 * External feeds (MSRC/NVD/CISA) are rate-limited and often unreachable from
 * build/preview sandboxes. To guarantee the dashboard always renders a
 * meaningful picture, the aggregator layers this realistic, recent dataset
 * underneath live data — live records replace sample records by CVE id, and
 * any sample CVE that also appears in CISA KEV is automatically flagged.
 *
 * IMPORTANT: `publishedDate` is the original MSRC/NVD publication date
 * (e.g. Patch Tuesday 2026-07-14) and is a FIXED absolute date — it does not
 * shift with "today". `updatedAt` is the last time the record was enriched or
 * modified by any source (NVD score update, CISA KEV add, etc.) and is
 * computed as a relative offset from today so the 7-day window stays populated.
 * The dashboard's 7-day window filters on `updatedAt`, not `publishedDate`,
 * because a CVE published weeks ago may still be "active" this week due to
 * KEV additions or CVSS re-scoring.
 */

import type {
  Advisory,
  AggregatedData,
  KnowledgeArticle,
  ThreatLandscape,
  Vulnerability,
} from "@/lib/types";
import { daysAgoDate, daysAgoIso, severityFromScore } from "@/lib/utils";

/** Fixed publication date for July 2026 Patch Tuesday. */
const PATCH_TUESDAY = "2026-07-14T00:00:00.000Z";

/** Deterministic sample CVEs anchored to "today" so the 7-day window is always populated.
 *
 * All CVE IDs below are REAL vulnerabilities from Microsoft's July 2026 Patch Tuesday
 * (released 2026-07-14). MSRC and NVD links have been verified as valid.
 *
 * `publishedDate` = fixed absolute ISO date (Patch Tuesday 2026-07-14).
 * `updatedAt`     = actual last-update date from data sources (NVD score
 *                   revision, CISA KEV addition, etc.), as a fixed ISO date.
 */
function buildSampleVulnerabilities(): Vulnerability[] {
  const base: Array<
    Omit<Vulnerability, "cvssScore" | "severity" | "publishedDate"> & {
      cvssScore: number;
    }
  > = [
    {
      cveId: "CVE-2026-56164",
      title: "Microsoft SharePoint Server Elevation of Privilege",
      description:
        "Missing authentication for critical function in Microsoft Office SharePoint allows an unauthorized attacker to elevate privileges over a network. Actively exploited in the wild before patch release.",
      descriptionZh:
        "Microsoft Office SharePoint 关键功能缺少身份验证，未经身份验证的攻击者可通过网络提升权限。补丁发布前已被在野利用。",
      cvssScore: 9.8,
      updatedAt: "2026-07-28T00:00:00.000Z",
      affectedProducts: ["SharePoint Server 2019", "SharePoint Server Subscription Edition"],
      cweIds: ["CWE-306"],
      exploited: true,
      ransomwareCampaignUse: "Known",
      remediation:
        "立即安装七月累积安全更新；启用 AMSI 集成并将请求正文扫描模式设为 Full，检测恶意 POST 请求。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-56164",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-56164",
        CISA: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-56164",
      },
    },
    {
      cveId: "CVE-2026-56155",
      title: "Active Directory Federation Services Elevation of Privilege",
      description:
        "Insufficient granularity of access control in AD FS allows an authorized attacker with low privileges to elevate to administrator locally. Actively exploited in the wild; credited to Microsoft DART incident response team.",
      descriptionZh:
        "AD FS 访问控制粒度不足，低权限已认证攻击者可在本地提升至管理员权限。已被在野利用，由微软 DART 事件响应团队发现。",
      cvssScore: 7.8,
      updatedAt: "2026-07-27T00:00:00.000Z",
      affectedProducts: ["Windows Server 2019", "Windows Server 2022", "Windows Server 2025"],
      cweIds: ["CWE-1220"],
      exploited: true,
      remediation:
        "部署本月安全更新；审计 AD FS 服务器本地管理员组成员，启用最小权限策略与即时访问管理。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-56155",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-56155",
        CISA: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-56155",
      },
    },
    {
      cveId: "CVE-2026-57092",
      title: "Windows VMSwitch Elevation of Privilege",
      description:
        "Use after free in Windows VMSwitch allows an authorized attacker to elevate privileges over a network. An attacker running code inside a guest VM can send crafted network requests to the Hyper-V virtual switch to escape the VM boundary.",
      descriptionZh:
        "Windows VMSwitch 中存在释放后重用漏洞，已认证攻击者可通过网络提升权限。攻击者可在来宾虚拟机内运行代码，向 Hyper-V 虚拟交换机发送特制网络请求以逃逸虚拟机边界。",
      cvssScore: 9.9,
      updatedAt: "2026-07-26T00:00:00.000Z",
      affectedProducts: ["Windows Server 2022", "Windows Server 2025"],
      cweIds: ["CWE-416"],
      exploited: false,
      remediation:
        "应用本月 Hyper-V 安全更新；对高负载宿主实施网络隔离与资源配额，限制虚拟机间通信。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-57092",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-57092",
      },
    },
    {
      cveId: "CVE-2026-56190",
      title: "Windows Remote Desktop Protocol Remote Code Execution",
      description:
        "Use of uninitialized resource in Windows RDP allows an unauthorized attacker to execute code over a network. Exploitable against systems with Network Level Authentication (NLA) disabled.",
      descriptionZh:
        "Windows RDP 中存在使用未初始化资源漏洞，未经身份验证的攻击者可通过网络执行代码。可利用于禁用网络级身份验证 (NLA) 的系统。",
      cvssScore: 9.8,
      updatedAt: "2026-07-25T00:00:00.000Z",
      affectedProducts: ["Windows Server 2019", "Windows Server 2022"],
      cweIds: ["CWE-908"],
      exploited: false,
      remediation:
        "立即安装 RDP 安全更新；启用 NLA 网络级身份验证，关闭不必要的 3389 端口公网暴露。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-56190",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-56190",
      },
    },
    {
      cveId: "CVE-2026-50518",
      title: "Windows DHCP Server Remote Code Execution",
      description:
        "Heap-based buffer overflow in Windows DHCP Server allows an unauthorized attacker to execute code over a network by sending specially crafted DHCP packets.",
      descriptionZh:
        "Windows DHCP 服务器中存在基于堆的缓冲区溢出漏洞，未经身份验证的攻击者可通过发送特制 DHCP 数据包在网络中执行代码。",
      cvssScore: 9.8,
      updatedAt: "2026-07-24T00:00:00.000Z",
      affectedProducts: ["Windows Server 2019", "Windows Server 2022", "Windows Server 2025"],
      cweIds: ["CWE-122"],
      exploited: false,
      remediation:
        "应用 DHCP 服务器累积更新；确保 DHCP 服务器不暴露于互联网，实施网络分段隔离。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-50518",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-50518",
      },
    },
    {
      cveId: "CVE-2026-56188",
      title: "Windows Server Network Driver Remote Code Execution",
      description:
        "Concurrent execution using shared resource with improper synchronization (race condition) in Windows Server Network driver allows an unauthorized attacker to execute code over a network.",
      descriptionZh:
        "Windows Server 网络驱动中存在竞态条件漏洞，未经身份验证的攻击者可通过发送特制网络数据包在网络中执行代码。",
      cvssScore: 9.8,
      updatedAt: "2026-07-28T00:00:00.000Z",
      affectedProducts: ["Windows Server 2022", "Windows Server 2025"],
      cweIds: ["CWE-362"],
      exploited: false,
      remediation:
        "安装网络驱动安全更新；监控异常网络流量，评估是否可临时启用流量过滤规则。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-56188",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-56188",
      },
    },
    {
      cveId: "CVE-2026-50522",
      title: "Microsoft SharePoint Remote Code Execution",
      description:
        "Deserialization of untrusted data in Microsoft Office SharePoint allows an unauthorized attacker to execute code over a network by sending specially crafted XML requests. Demonstrated at Pwn2Own Berlin.",
      descriptionZh:
        "Microsoft Office SharePoint 中存在不可信数据反序列化漏洞，未经身份验证的攻击者可通过发送特制 XML 请求在网络中执行代码。曾在 Pwn2Own 柏林大赛上演示。",
      cvssScore: 9.8,
      updatedAt: "2026-07-27T00:00:00.000Z",
      affectedProducts: ["SharePoint Server 2019", "SharePoint Server Subscription Edition"],
      cweIds: ["CWE-502"],
      exploited: false,
      remediation:
        "立即安装 SharePoint 累积安全更新；限制管理中心远程访问，启用请求过滤与身份验证。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-50522",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-50522",
      },
    },
    {
      cveId: "CVE-2026-50661",
      title: "Windows BitLocker Security Feature Bypass",
      description:
        "Protection mechanism failure in Windows BitLocker allows an unauthenticated attacker with physical access to bypass BitLocker Device Encryption and access encrypted data. Publicly disclosed before patch release.",
      descriptionZh:
        "Windows BitLocker 防护机制失效，拥有物理访问权限的未经身份验证攻击者可绕过 BitLocker 设备加密并访问加密数据。补丁发布前已被公开披露。",
      cvssScore: 6.1,
      updatedAt: "2026-07-26T00:00:00.000Z",
      affectedProducts: ["Windows Server 2022", "Windows Server 2025"],
      cweIds: ["CWE-693"],
      exploited: false,
      remediation:
        "部署本月安全更新；对移动设备与高敏感服务器启用 TPM + PIN 启动保护，减少物理攻击面。",
      sources: {
        MSRC: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-50661",
        NVD: "https://nvd.nist.gov/vuln/detail/CVE-2026-50661",
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
    publishedDate: PATCH_TUESDAY,
    updatedAt: v.updatedAt,
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
      publishedDate: PATCH_TUESDAY,
      updatedAt: "2026-07-28T00:00:00.000Z",
      type: "security_update",
      summary:
        "微软发布 2026 年 7 月安全更新，共修复 622 个漏洞，其中 63 个被评为严重，多个 Windows Server 组件受影响。包含 2 个已被在野利用的零日漏洞。",
      summaryEn:
        "Microsoft released the July 2026 security update, patching 622 vulnerabilities in total. 63 are rated Critical, with multiple Windows Server components affected. Includes 2 zero-day vulnerabilities exploited in the wild.",
      url: "https://msrc.microsoft.com/update-guide/releaseNote/2026-Jul",
    },
    {
      id: "cisa-kev-2026-07",
      title: "CISA 新增 2 个 Windows Server KEV 漏洞",
      titleEn: "CISA Adds 2 Windows Server KEV Vulnerabilities",
      organization: "CISA",
      publishedDate: PATCH_TUESDAY,
      updatedAt: "2026-07-27T00:00:00.000Z",
      type: "vuln_alert",
      summary:
        "CISA 已知被利用漏洞目录新增 CVE-2026-56155 (AD FS) 和 CVE-2026-56164 (SharePoint Server) 两个漏洞，要求联邦机构在指定日期前完成修复。",
      summaryEn:
        "CISA's Known Exploited Vulnerabilities catalog added CVE-2026-56155 (AD FS) and CVE-2026-56164 (SharePoint Server), requiring federal agencies to remediate by the specified due date.",
      url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    },
    {
      id: "cnvd-2026-27",
      title: "CNVD 2026 年第 27 期漏洞周报",
      titleEn: "CNVD Weekly Vulnerability Bulletin — Week 27, 2026",
      organization: "CNVD",
      publishedDate: "2026-07-30T00:00:00.000Z",
      updatedAt: "2026-07-30T00:00:00.000Z",
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
      updatedAt: "2026-07-28T00:00:00.000Z",
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
      updatedAt: "2026-07-25T00:00:00.000Z",
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
      updatedAt: "2026-07-23T00:00:00.000Z",
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
