export type SiteNavItem = {
  label: string;
  labelEn: string;
  href: string;
  page?: string;
  items?: SiteNavItem[];
};

export type SiteNavSection = {
  title: string;
  titleEn: string;
  items: SiteNavItem[];
};

export const topNav: SiteNavItem[] = [
  { label: "开始使用", labelEn: "Getting Started", href: "#intro", page: "intro" },
  { label: "组件", labelEn: "Components", href: "#components", page: "components" },
  { label: "基础", labelEn: "Foundations", href: "#tokens", page: "tokens" },
  { label: "页面", labelEn: "Pages", href: "#template-customer-list", page: "template-customer-list" },
  { label: "搭建器", labelEn: "Builder", href: "#page-builder", page: "page-builder" },
  { label: "治理中心", labelEn: "Governance", href: "#governance-map", page: "governance-map" },
];

export const docsNav: SiteNavSection[] = [
  { title: "设计令牌", titleEn: "Design Tokens", items: [{ label: "概览", labelEn: "Overview", href: "#tokens" }, { label: "颜色", labelEn: "Colors", href: "#tokens-colors" }, { label: "排版", labelEn: "Typography", href: "#tokens-typography" }, { label: "圆角", labelEn: "Radius", href: "#tokens-radius" }, { label: "阴影", labelEn: "Shadow", href: "#tokens-shadow" }, { label: "间距", labelEn: "Spacing", href: "#tokens-spacing" }, { label: "层级", labelEn: "Layer", href: "#tokens-layer" }, { label: "动效", labelEn: "Motion", href: "#tokens-motion" }] },
  { title: "布局系统", titleEn: "Layout", items: [{ label: "栅格", labelEn: "Grid", href: "#grid" }, { label: "布局", labelEn: "Layout", href: "#layout" }, { label: "顶栏", labelEn: "TopBar", href: "#top-bar" }] },
  { title: "通用", titleEn: "General", items: [{ label: "按钮", labelEn: "Button", href: "#button" }, { label: "按钮组", labelEn: "Button Group", href: "#button-group" }, { label: "图标", labelEn: "Icon", href: "#icon" }, { label: "分隔线", labelEn: "Separator", href: "#separator" }, { label: "链接", labelEn: "Link", href: "#link" }, { label: "头像", labelEn: "Avatar", href: "#avatar" }] },
  { title: "数据录入", titleEn: "Data Entry", items: [{ label: "输入框", labelEn: "Input", href: "#input" }, { label: "选择器", labelEn: "Select", href: "#select" }, { label: "组合框", labelEn: "Combobox", href: "#combobox" }, { label: "颜色选择器", labelEn: "Color Picker", href: "#color-picker" }, { label: "图标选择器", labelEn: "Icon Picker", href: "#icon-picker" }, { label: "穿梭框", labelEn: "Transfer", href: "#transfer" }, { label: "条件选择器", labelEn: "Condition Builder", href: "#condition-builder" }, { label: "选人下拉菜单", labelEn: "People Picker", href: "#people-picker" }, { label: "滑块", labelEn: "Slider", href: "#slider" }, { label: "时间选择器", labelEn: "Time Picker", href: "#time-picker" }, { label: "日期选择器", labelEn: "Date Picker", href: "#date-picker" }, { label: "日期时间选择器", labelEn: "Date Time Picker", href: "#date-time-picker" }, { label: "多选框", labelEn: "Checkbox", href: "#checkbox" }, { label: "单选框", labelEn: "Radio", href: "#radio-group" }, { label: "开关", labelEn: "Switch", href: "#switch" }, { label: "多行输入", labelEn: "Textarea", href: "#textarea" }, { label: "上传", labelEn: "Upload", href: "#upload" }, { label: "签名", labelEn: "Signature", href: "#signature" }, { label: "日历", labelEn: "Calendar", href: "#calendar" }, { label: "切换按钮", labelEn: "Toggle", href: "#toggle" }, { label: "切换按钮组", labelEn: "Toggle Group", href: "#toggle-group" }] },
  { title: "数据展示", titleEn: "Data Display", items: [{ label: "表格", labelEn: "Table", href: "#table" }, { label: "卡片", labelEn: "Card", href: "#card" }, { label: "图表", labelEn: "Chart", href: "#chart" }, { label: "标签", labelEn: "Tag", href: "#tag" }, { label: "徽标", labelEn: "Badge", href: "#badge" }, { label: "提示", labelEn: "Tooltip", href: "#tooltip" }, { label: "滚动区域", labelEn: "Scroll Area", href: "#scroll-area" }, { label: "折叠面板", labelEn: "Collapsible", href: "#collapsible" }] },
  { title: "导航", titleEn: "Navigation", items: [{ label: "面包屑", labelEn: "Breadcrumb", href: "#breadcrumb" }, { label: "标签页", labelEn: "Tabs", href: "#tabs" }, { label: "下拉菜单", labelEn: "Dropdown Menu", href: "#dropdown-menu" }, { label: "侧边栏", labelEn: "Sidebar", href: "#sidebar" }, { label: "导航菜单", labelEn: "Nav Menu", href: "#nav-menu" }, { label: "分页器", labelEn: "Pagination", href: "#pagination" }, { label: "命令面板", labelEn: "Command", href: "#command" }] },
  { title: "反馈", titleEn: "Feedback", items: [{ label: "提示", labelEn: "Alert", href: "#alert" }, { label: "空状态", labelEn: "Empty", href: "#empty" }, { label: "对话框", labelEn: "Dialog", href: "#dialog" }, { label: "警告对话框", labelEn: "Alert Dialog", href: "#alert-dialog" }, { label: "抽屉", labelEn: "Sheet", href: "#sheet" }, { label: "骨架屏", labelEn: "Skeleton", href: "#skeleton" }, { label: "弹出层", labelEn: "Popover", href: "#popover" }, { label: "加载指示器", labelEn: "Spinner", href: "#spinner" }, { label: "轻提示", labelEn: "Toast", href: "#toast" }] },
  { title: "业务组合组件", titleEn: "Business Compositions", items: [{ label: "页面头部", labelEn: "PageHeader", href: "#page-header" }, { label: "搜索工具栏", labelEn: "SearchToolbar", href: "#search-toolbar" }, { label: "实体表格", labelEn: "EntityTable", href: "#entity-table" }, { label: "表单分组", labelEn: "FormSection", href: "#form-section" }, { label: "危险确认框", labelEn: "ConfirmDangerDialog", href: "#confirm-danger-dialog" }] },
  { title: "Agent 界面", titleEn: "Agent UI", items: [{ label: "生成式UI组件", labelEn: "Generative UI", href: "#agent-surface" }] },
  { title: "页面", titleEn: "Pages", items: [{ label: "列表页", labelEn: "List Page", href: "#template-customer-list" }, { label: "编辑表单", labelEn: "Edit Form", href: "#template-edit-form" }, { label: "详情页", labelEn: "Detail Page", href: "#template-detail" }] },
  { title: "治理中心", titleEn: "Governance", items: [{ label: "概览", labelEn: "Overview", href: "#governance-map" }, { label: "规则库", labelEn: "Rules", href: "#ai-rules" }, { label: "文档规范", labelEn: "Documentation", href: "#documentation" }, { label: "网站规范", labelEn: "Website Standards", href: "#website-standards" }, { label: "质量与诊断", labelEn: "Quality & Diagnostics", href: "#checks" }] },
];

export const componentIndexSections = docsNav.filter((section) => ["通用", "数据录入", "数据展示", "导航", "反馈", "业务组合组件", "Agent 界面"].includes(section.title));
export const tokenNavSections = docsNav.filter((section) => section.title === "设计令牌");
export const layoutNavSections = docsNav.filter((section) => section.title === "布局系统");
export const foundationNavSections = [...tokenNavSections, ...layoutNavSections];
export const pageNavSections = docsNav.filter((section) => section.title === "页面");
export const governanceNavSections = docsNav.filter((section) => section.title === "治理中心");

export const footerNavItems = [
  ...gettingStartedNavItems.map((item) => ({ ...item, group: "开始使用", groupEn: "Getting Started" })),
  { label: "组件", labelEn: "Components", href: "#components", group: "组件", groupEn: "Components" },
  ...componentIndexSections.flatMap((section) => section.items.map((item) => ({ ...item, group: section.title, groupEn: section.titleEn }))),
  ...[...foundationNavSections, ...pageNavSections].flatMap((section) => section.items.map((item) => ({ ...item, group: section.title, groupEn: section.titleEn }))),
  ...governanceQuickLinks.map((item) => ({ ...item, group: "治理中心", groupEn: "Governance" })),
];
import { gettingStartedNavItems, governanceQuickLinks } from "@/pages/docs/getting-started/getting-started-navigation";
