export type GettingStartedPage =
  | "intro"
  | "install"
  | "theme"
  | "governance-map"
  | "ai-rules"
  | "documentation"
  | "website-standards"
  | "checks";

export const gettingStartedSlugs: GettingStartedPage[] = [
  "intro",
  "install",
  "theme",
  "governance-map",
  "ai-rules",
  "documentation",
  "website-standards",
  "checks",
];

export type GettingStartedNavItem = {
  label: string;
  labelEn?: string;
  href: string;
  page: string;
};

export const gettingStartedNavItems: GettingStartedNavItem[] = [
  { label: "开始使用", labelEn: "Getting Started", href: "#intro", page: "intro" },
];

export const governanceQuickLinks: GettingStartedNavItem[] = [
  { label: "概览", labelEn: "Overview", href: "#governance-map", page: "governance-map" },
  { label: "规则库", labelEn: "Rules", href: "#ai-rules", page: "ai-rules" },
  { label: "文档规范", labelEn: "Documentation", href: "#documentation", page: "documentation" },
  { label: "网站规范", labelEn: "Website Standards", href: "#website-standards", page: "website-standards" },
  { label: "质量与诊断", labelEn: "Quality & Diagnostics", href: "#checks", page: "checks" },
];

export const gettingStartedAnchors: Record<
  GettingStartedPage,
  { label: string; labelEn: string; href: string }[]
> = {
  intro: [
    { label: "定位", labelEn: "Positioning", href: "#intro-positioning" },
    { label: "安装和引入", labelEn: "Install", href: "#intro-install" },
    { label: "主题接入", labelEn: "Theme Setup", href: "#theme-source" },
    { label: "语义槽", labelEn: "Semantic Slots", href: "#theme-slots" },
    { label: "修改流程", labelEn: "Change Flow", href: "#theme-flow" },
    { label: "内部维护", labelEn: "Maintenance", href: "#intro-layers" },
    { label: "团队协同", labelEn: "Workflow", href: "#intro-audience" },
  ],
  install: [
    { label: "接入前提", labelEn: "Prerequisites", href: "#install-prerequisites" },
    { label: "安装组件", labelEn: "Components", href: "#install-components" },
    { label: "接入主题", labelEn: "Theme", href: "#install-theme" },
    { label: "目录约定", labelEn: "Structure", href: "#install-structure" },
    { label: "启动检查", labelEn: "Verify", href: "#install-verify" },
  ],
  theme: [
    { label: "token 真相源", labelEn: "Token Source", href: "#theme-source" },
    { label: "shadcn 语义槽", labelEn: "Semantic Slots", href: "#theme-slots" },
    { label: "修改流程", labelEn: "Change Flow", href: "#theme-flow" },
  ],
  "governance-map": [
    { label: "当前状态", labelEn: "Status", href: "#governance-map-status" },
    { label: "工程运行图", labelEn: "System Map", href: "#governance-map-system" },
    { label: "数据新鲜度", labelEn: "Freshness", href: "#governance-map-freshness" },
    { label: "规则资产", labelEn: "Assets", href: "#governance-map-assets" },
    { label: "治理闭环", labelEn: "Loop", href: "#governance-map-loop" },
    { label: "参考案例", labelEn: "References", href: "#governance-map-references" },
  ],
  "ai-rules": [
    { label: "行为红线", labelEn: "Guardrails", href: "#ai-guardrails" },
    { label: "改样式流程", labelEn: "Style Flow", href: "#ai-style-flow" },
    { label: "交付检查", labelEn: "Checks", href: "#ai-checks" },
  ],
  documentation: [
    { label: "SSOT 路由", labelEn: "SSOT", href: "#documentation-ssot" },
    { label: "防漂三件套", labelEn: "Anti-Drift", href: "#documentation-anti-drift" },
    { label: "写入规则", labelEn: "Write Rules", href: "#documentation-write-rules" },
  ],
  "website-standards": [
    { label: "页面组件", labelEn: "Page Components", href: "#website-standards-components" },
    { label: "间距节奏", labelEn: "Spacing Rhythm", href: "#website-standards-spacing" },
    { label: "卡片容器", labelEn: "Card Container", href: "#website-standards-boundaries" },
    { label: "内部 fx 组件", labelEn: "Internal fx", href: "#website-standards-fx-internal" },
  ],
  checks: [
    { label: "常用命令", labelEn: "Commands", href: "#checks-commands" },
    { label: "检查分层", labelEn: "Layers", href: "#checks-layers" },
    { label: "收尾清单", labelEn: "Checklist", href: "#checks-checklist" },
  ],
};
