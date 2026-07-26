<div align="center">

# 🔐 SISA.ing

### 安全洞察 · 态势感知 — Security Insights & Situational Awareness

**一站式 Windows Server 安全情报聚合平台**

*A one-stop Windows Server security intelligence hub aggregating MSRC, NVD, CISA, CNNVD and CNVD.*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/geoin520/SISA&project-name=sisa-ing&repository-name=SISA)
[![GitHub stars](https://img.shields.io/github/stars/geoin520/SISA?style=social)](https://github.com/geoin520/SISA/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/geoin520/SISA?style=social)](https://github.com/geoin520/SISA/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/geoin520/SISA?style=social)](https://github.com/geoin520/SISA)
[![GitHub issues](https://img.shields.io/github/issues/geoin520/SISA)](https://github.com/geoin520/SISA/issues)
[![GitHub license](https://img.shields.io/github/license/geoin520/SISA)](https://github.com/geoin520/SISA/blob/main/LICENSE)
[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=sisa-ing)](https://vercel.com/)

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.7-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-FF7300?style=flat&logo=react&logoColor=white)](https://recharts.org/)
[![React Email](https://img.shields.io/badge/React_Email-0EA5E9?style=flat&logo=react&logoColor=white)](https://react.email/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

[English](#english) | [中文](#中文)

</div>

---

## English

SISA.ing is a security intelligence aggregation platform focused on Windows Server. It automatically collects, correlates, and prioritizes vulnerability data from authoritative sources including **MSRC**, **NVD**, **CISA KEV**, **CNNVD**, and **CNVD** — delivering end-to-end situational awareness from alerting and impact assessment to remediation verification.

### ✨ Features

- **📊 Security Dashboard** — KPI cards (Critical / High / Medium / Pending Patches) with a 7-day rolling window
- **📋 Vulnerability & Patch Database** — CVE tracking with CVSS scores, exploitation status, and affected products
- **🚨 Advisories & Alerts Center** — Aggregated security advisories from MSRC, CISA, and CNVD
- **📚 Knowledge Base** — Curated KB articles, security baselines, and hardening guides
- **📈 Threat Landscape** — 7-day vulnerability trend charts, type distribution, and AI-style key insights
- **🔔 Email Subscriptions** — Daily security digest via React Email templates
- **🌍 Bilingual (ZH/EN)** — Full internationalization with automatic locale detection
- **⚡ ISR + Cron Jobs** — Hourly ISR revalidation and scheduled data refresh via Vercel Cron

### 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | SSR / ISR, SEO-friendly |
| Language | TypeScript 5.7 | Type safety |
| Styling | Tailwind CSS 3 | Deep-blue tech theme |
| Charts | Recharts | Trend & distribution visualization |
| Email | React Email | Reusable email templates |
| Deployment | Vercel | Auto-deploy + Cron Jobs |

### 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/geoin520/SISA.git
cd SISA

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it auto-redirects to `/zh` or `/en` based on your browser language.

### 📂 Project Structure

```
SISA/
├── app/
│   ├── [locale]/              # i18n routes (zh / en)
│   │   ├── page.tsx           # Home (dashboard + 4 sections)
│   │   ├── vulnerabilities/   # Vulnerability & Patch DB
│   │   ├── advisories/        # Advisories & Alerts
│   │   ├── knowledge/         # Knowledge Base
│   │   └── trends/            # Threat Landscape
│   ├── api/
│   │   ├── vulnerabilities/   # Vulnerability API
│   │   ├── advisories/        # Advisory API
│   │   ├── trends/            # Trends API
│   │   ├── email/preview/     # Email template preview
│   │   ├── subscribe/         # Email subscription
│   │   └── cron/fetch-data/   # Cron job endpoint
│   ├── sitemap.ts / robots.ts # SEO
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # Card, Badge, Button, SourceTag
│   ├── dashboard/             # Header, Footer, KPI, SubscribeForm
│   ├── vulnerabilities/       # VulnerabilityList, VulnerabilityTable
│   ├── advisories/            # AdvisoryList
│   ├── knowledge/             # KnowledgeList
│   ├── trends/                # TrendChart, DistributionChart
│   └── email/                 # DailyDigestEmail
├── lib/
│   ├── data/                  # MSRC, NVD, CISA, CNVD clients + aggregator
│   ├── i18n/                  # Locale config + dictionaries
│   └── types/                 # TypeScript types
├── vercel.json                # Vercel config with cron schedules
└── tailwind.config.ts         # SISA color palette
```

### 📡 Data Sources

| Source | Type | Content |
|--------|------|---------|
| [MSRC CVRF API](https://api.msrc.microsoft.com) | REST API | Microsoft security updates, CVE details |
| [NVD CVE API v2.0](https://services.nvd.nist.gov/rest/json/cves/2.0) | REST API | CVSS scores, CWE classifications |
| [CISA KEV Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) | JSON Feed | Known exploited vulnerabilities |
| [CNVD](https://www.cnvd.org.cn) / CNNVD | RSS | China National Vulnerability Database |

**Aggregation strategy**: Deduplicate by CVE ID (priority: MSRC > NVD > others), retain only the last 7 days, and sort by CVSS score, exploitation status, and impact scope. Falls back to a curated sample dataset when external APIs are unreachable.

### ⏰ Scheduled Tasks

Vercel Cron triggers `/api/cron/fetch-data` at 06:00, 12:00, and 18:00 (UTC) to refresh the data cache. The endpoint is authenticated via `CRON_SECRET`.

### 🔧 Environment Variables

See [`.env.example`](.env.example) for the full list:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Site URL |
| `DATA_CACHE_TTL` | Data cache TTL in seconds |
| `MSRC_API_BASE` | MSRC API endpoint |
| `NVD_API_BASE` | NVD API endpoint |
| `NVD_API_KEY` | NVD API key (optional, raises rate limits) |
| `CISA_KEV_URL` | CISA KEV JSON feed URL |
| `CRON_SECRET` | Cron endpoint authentication secret |
| `EMAIL_FROM` | Sender email address |

### 🎨 Design

Deep-blue tech theme with alert highlights. Color palette defined in `tailwind.config.ts`:

| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#0A1E3C` | Navigation, footer |
| Card BG | `#1E2F4D` | KPI cards |
| Brand | `#0078D4` | Buttons, links |
| Tech accent | `#00A3FF` | Glowing borders, data highlights |
| Critical | `#D13438` | Critical CVE markers |
| High | `#FFB900` | High-severity indicators |
| Safe | `#107C10` | Patched / hardened states |

---

## 中文

SISA.ing 是一个专注于 Windows Server 的安全情报聚合平台。它自动采集、关联并排序来自 **MSRC**、**NVD**、**CISA KEV**、**CNNVD**、**CNVD** 等权威数据源的漏洞信息，从预警推送、影响评估到修复验证，提供全链路安全态势感知。

### ✨ 功能特性

- **📊 安全仪表盘** — KPI 卡片（严重 / 高危 / 中危 / 待安装补丁），7 天滚动窗口
- **📋 漏洞与补丁库** — CVE 追踪，含 CVSS 评分、利用状态、影响范围
- **🚨 预警与通告中心** — 聚合 MSRC、CISA、CNVD 安全通告
- **📚 知识库与最佳实践** — KB 文章、安全基线、加固指南
- **📈 态势分析** — 7 天漏洞趋势图、类型分布、AI 洞察总结
- **🔔 邮件订阅** — 基于 React Email 的日报模板
- **🌍 中英双语** — 完整国际化，自动语言检测
- **⚡ ISR + 定时任务** — 每小时 ISR 重新验证 + Vercel Cron 定时数据刷新

### 🚀 快速开始

```bash
git clone https://github.com/geoin520/SISA.git
cd SISA
npm install
cp .env.example .env.local
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)，根据浏览器语言自动跳转至 `/zh` 或 `/en`。

### 📡 数据源

| 数据源 | 类型 | 内容 |
|--------|------|------|
| [MSRC CVRF API](https://api.msrc.microsoft.com) | REST API | 微软安全更新、CVE 详情 |
| [NVD CVE API v2.0](https://services.nvd.nist.gov/rest/json/cves/2.0) | REST API | CVSS 评分、CWE 分类 |
| [CISA KEV Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) | JSON Feed | 已知被利用漏洞 |
| [CNVD](https://www.cnvd.org.cn) / CNNVD | RSS | 国内漏洞情报 |

**聚合策略**：以 CVE 编号为唯一键去重合并（优先级 MSRC > NVD > 其他），仅保留近 7 天数据，按 CVSS、利用状态、影响范围综合排序。外部源不可达时自动回落到内置示例数据集。

### ⏰ 定时任务

Vercel Cron 在 UTC 06:00 / 12:00 / 18:00 触发 `/api/cron/fetch-data` 刷新缓存，通过 `CRON_SECRET` 鉴权。

### 🔧 环境变量

详见 [`.env.example`](.env.example)。

### 🎨 设计规范

深蓝科技风 + 警示高亮，色值见 `tailwind.config.ts` 的 `sisa` 调色板（主基调 `#0A1E3C`、品牌高亮 `#0078D4`、高危警示 `#D13438`）。

---

### 📧 邮件预览

访问 `GET /api/email/preview` 可查看日报邮件 HTML 渲染效果。

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 发起 Pull Request

### 📄 License

本项目采用 MIT 许可证 — 详见 [LICENSE](LICENSE) 文件。

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

If this project helps you, please consider giving it a star!

[![Star History](https://api.star-history.com/svg?repos=geoin520/SISA&type=Date)](https://star-history.com/#geoin520/SISA&Date)

</div>

---

<div align="center">

© 2026 **SISA.ing** · 安全洞察 · 态势感知

数据来源：[MSRC](https://msrc.microsoft.com) | [NVD](https://nvd.nist.gov) | [CISA](https://www.cisa.gov) | [CNNVD](https://www.cnnvd.org.cn) | [CNVD](https://www.cnvd.org.cn)

</div>
