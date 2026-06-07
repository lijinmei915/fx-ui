import { useEffect, useRef, useState } from "react"
import {
  BellIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  CopyIcon,
  DatabaseIcon,
  FileCodeIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  TerminalIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import buttonMarkdown from "../docs/components/button.md?raw"
import iconMarkdown from "../docs/components/icon.md?raw"
import tokensMarkdown from "../docs/TOKENS.md?raw"

type Lang = "zh" | "en"
type ButtonScenarioFilter = "all" | "category" | "size" | "state" | "icon" | "combo"

const uiText = {
  zh: {
    languageZh: "中文",
    languageEn: "英文",
    search: "搜索组件、Blocks、Tokens...",
    copyPage: "复制当前页",
    moreActions: "更多页面操作",
    viewMarkdown: "以 Markdown 查看",
    viewPage: "查看页面",
    copyMarkdown: "复制 Markdown",
    markdownLead: "这是当前页面对应的 Markdown 真相源，后续可以直接给前端工程师、v0 或其他 AI 作为上下文消费。",
    toc: "本页目录",
  },
  en: {
    languageZh: "Chinese",
    languageEn: "English",
    search: "Search components, Blocks, Tokens...",
    copyPage: "Copy page",
    moreActions: "More page actions",
    viewMarkdown: "View as Markdown",
    viewPage: "View page",
    copyMarkdown: "Copy Markdown",
    markdownLead: "This is the Markdown source for the current page. It can be used as context by frontend engineers, v0, or other AI tools.",
    toc: "On this page",
  },
}

function getLabel(item: { label: string; labelEn?: string }, lang: Lang) {
  return lang === "en" && item.labelEn ? item.labelEn : item.label
}

// Keep documentation page rhythm aligned with docs/TOKENS.md spacing tokens.
const docsSpacing = {
  pageStack: "flex flex-col gap-10",
  sectionStack: "flex flex-col gap-5",
  sectionHeader: "flex flex-col gap-3",
  sectionStackCompact: "flex flex-col gap-4",
  contentGap: "flex flex-col gap-3",
}

const topNav = [
  { label: "组件", labelEn: "Components", href: "#button", page: "button" },
  { label: "设计令牌", labelEn: "Tokens", href: "#tokens", page: "tokens" },
]

const docsNav = [
  {
    title: "开始使用",
    titleEn: "Getting Started",
    items: [
      { label: "项目定位", labelEn: "Positioning", href: "#intro" },
      { label: "安装接入", labelEn: "Installation", href: "#install" },
      { label: "主题注入", labelEn: "Theming", href: "#theme" },
      { label: "AI 使用规则", labelEn: "AI Rules", href: "#ai-rules" },
    ],
  },
  {
    title: "设计 Tokens",
    titleEn: "Design Tokens",
    items: [
      { label: "概览", labelEn: "Overview", href: "#tokens" },
      { label: "颜色", labelEn: "Colors", href: "#tokens-colors" },
      { label: "排版", labelEn: "Typography", href: "#tokens-typography" },
      { label: "圆角", labelEn: "Radius", href: "#tokens-radius" },
      { label: "间距", labelEn: "Spacing", href: "#tokens-spacing" },
      { label: "阴影", labelEn: "Shadow", href: "#tokens-shadow" },
      { label: "动效", labelEn: "Motion", href: "#tokens-motion" },
      { label: "层级", labelEn: "Layer", href: "#tokens-layer" },
    ],
  },
  {
    title: "通用",
    titleEn: "General",
    items: [
      { label: "按钮", labelEn: "Button", href: "#button" },
      { label: "文字", labelEn: "Typography", href: "#typography" },
      { label: "图标", labelEn: "Icon", href: "#icon" },
    ],
  },
  {
    title: "数据录入",
    titleEn: "Data Entry",
    items: [
      { label: "输入框", labelEn: "Input", href: "#input" },
      { label: "选择器", labelEn: "Select", href: "#select" },
      { label: "复选框", labelEn: "Checkbox", href: "#checkbox" },
      { label: "开关", labelEn: "Switch", href: "#switch" },
      { label: "多行输入", labelEn: "Textarea", href: "#textarea" },
    ],
  },
  {
    title: "数据展示",
    titleEn: "Data Display",
    items: [
      { label: "表格", labelEn: "Table", href: "#table" },
      { label: "卡片", labelEn: "Card", href: "#card" },
      { label: "徽标", labelEn: "Badge", href: "#badge" },
      { label: "提示", labelEn: "Tooltip", href: "#tooltip" },
    ],
  },
  {
    title: "反馈",
    titleEn: "Feedback",
    items: [
      { label: "对话框", labelEn: "Dialog", href: "#dialog" },
      { label: "警告对话框", labelEn: "Alert Dialog", href: "#alert-dialog" },
      { label: "抽屉", labelEn: "Sheet", href: "#sheet" },
      { label: "骨架屏", labelEn: "Skeleton", href: "#skeleton" },
    ],
  },
  {
    title: "业务组合组件",
    titleEn: "Compositions",
    items: [
      { label: "页面头部", labelEn: "PageHeader", href: "#page-header" },
      { label: "搜索工具栏", labelEn: "SearchToolbar", href: "#search-toolbar" },
      { label: "实体表格", labelEn: "EntityTable", href: "#entity-table" },
      { label: "表单分组", labelEn: "FormSection", href: "#form-section" },
      { label: "危险确认框", labelEn: "ConfirmDangerDialog", href: "#confirm-danger-dialog" },
    ],
  },
  {
    title: "页面 Blocks",
    titleEn: "Page Blocks",
    items: [
      { label: "列表页", labelEn: "ListPage", href: "#list-page" },
      { label: "详情页", labelEn: "DetailPage", href: "#detail-page" },
      { label: "编辑表单", labelEn: "EditForm", href: "#edit-form" },
      { label: "设置页", labelEn: "SettingsPage", href: "#settings-page" },
      { label: "仪表盘", labelEn: "Dashboard", href: "#dashboard" },
    ],
  },
]

const propRows = [
  { prop: "variant", type: "'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'", defaultValue: "'default'", desc: "来自 shadcn Button 的样式变体", descEn: "Style variant from shadcn Button" },
  { prop: "size", type: "'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'", defaultValue: "'default'", desc: "来自 shadcn Button 的尺寸变体", descEn: "Size variant from shadcn Button" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "是否禁用", descEn: "Whether the button is disabled" },
  { prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "错误态样式，继承 shadcn 语义 token", descEn: "Invalid state styling based on semantic tokens" },
  { prop: "render", type: "ReactElement | (props, state) => ReactElement", defaultValue: "undefined", desc: "把按钮样式渲染到自定义元素上（如 <a>），相当于 Base UI 版本的 asChild", descEn: "Render the button styling onto a custom element (e.g. <a>); Base UI's equivalent of asChild" },
]

const buttonTokenRows = [
  { name: "primary", value: "#FF8000", usage: "主操作按钮、激活态、重点链接", usageEn: "Primary actions, active states, key links" },
  { name: "primary-foreground", value: "#FFFFFF", usage: "主色背景上的文字和图标", usageEn: "Text and icons on primary backgrounds" },
  { name: "ring", value: "#FF8000", usage: "键盘聚焦与可访问性焦点环", usageEn: "Keyboard focus and accessibility rings" },
]

const buttonImportCode = `import { Button } from "@/components/ui/button"`

const buttonUsageCode = `<Button variant="outline">Button</Button>`

const buttonScenarioExamples = [
  {
    id: "primary",
    title: "主操作",
    titleEn: "Primary action",
    intent: "页面或区域的主要行动点，一个操作区域建议只出现一个。",
    intentEn: "The main action in a page or region. Use one primary action per action area.",
    rule: "用于保存、提交、新建等明确推进流程的操作。",
    ruleEn: "Use for actions that advance the flow, such as save, submit, or create.",
    variant: "default",
    size: "default",
    group: "category",
    props: ["variant: default", "size: default"],
    code: "<Button>保存</Button>",
  },
  {
    id: "secondary",
    title: "次操作",
    titleEn: "Secondary action",
    intent: "与主操作并列但优先级较低，不抢主行动点。",
    intentEn: "An action shown alongside the primary action with lower priority.",
    rule: "用于取消、返回、稍后处理等辅助操作。",
    ruleEn: "Use for supporting actions such as cancel, back, or do later.",
    variant: "secondary",
    size: "default",
    group: "category",
    props: ["variant: secondary", "size: default"],
    code: '<Button variant="secondary">取消</Button>',
  },
  {
    id: "destructive",
    title: "危险操作",
    titleEn: "Destructive action",
    intent: "删除、移除权限等不可逆操作，通常需要二次确认。",
    intentEn: "Irreversible actions such as delete or remove permissions. Usually requires confirmation.",
    rule: "必须使用 destructive，不要用主按钮表达危险操作。",
    ruleEn: "Use destructive. Do not express dangerous actions with the primary button.",
    variant: "destructive",
    size: "default",
    group: "category",
    props: ["variant: destructive", "size: default"],
    code: '<Button variant="destructive">删除项目</Button>',
  },
  {
    id: "link",
    title: "链接操作",
    titleEn: "Link action",
    intent: "弱操作或跳转入口，不承载关键提交行为。",
    intentEn: "Low-emphasis actions or navigation. Do not use for critical submissions.",
    rule: "用于查看详情、打开文档等轻量跳转。",
    ruleEn: "Use for lightweight navigation such as view details or open docs.",
    variant: "link",
    size: "default",
    group: "category",
    props: ["variant: link", "size: default"],
    code: '<Button variant="link">打开文档</Button>',
  },
  {
    id: "outline",
    title: "描边操作",
    titleEn: "Outline action",
    intent: "与主操作并列、但比 secondary 更轻的辅助操作，常用于工具栏。",
    intentEn: "Secondary actions lighter than the secondary variant, common in toolbars.",
    rule: "保留边框但不强调底色，避免与 secondary 同时出现造成层级混乱。",
    ruleEn: "Keep the border without a strong fill; avoid pairing with secondary in the same group to prevent unclear hierarchy.",
    variant: "outline",
    size: "default",
    group: "category",
    props: ["variant: outline", "size: default"],
    code: '<Button variant="outline">导出</Button>',
  },
  {
    id: "ghost",
    title: "Ghost 操作",
    titleEn: "Ghost action",
    intent: "工具栏、卡片内的弱化操作，不需要边框和底色来吸引注意。",
    intentEn: "Low-emphasis actions in toolbars or cards that don't need a border or fill to draw attention.",
    rule: "shadcn 里官方就叫 ghost；用于辅助操作，悬浮态才出现底色，不要用于页面主行动点。",
    ruleEn: "shadcn officially calls this variant \"ghost\". Use for secondary actions; the fill only appears on hover. Avoid using it for primary page actions.",
    variant: "ghost",
    size: "default",
    group: "category",
    props: ["variant: ghost", "size: default"],
    code: '<Button variant="ghost">查看详情</Button>',
  },
  {
    id: "size-xs",
    title: "超小尺寸",
    titleEn: "Extra small size",
    intent: "极紧凑的工具栏、表格内联操作。",
    intentEn: "Very compact toolbars and inline table actions.",
    rule: "只用于密度很高的局部操作，不用于页面主按钮。",
    ruleEn: "Use only for dense local actions, not for primary page actions.",
    variant: "default",
    size: "xs",
    group: "size",
    props: ["variant: default", "size: xs"],
    code: '<Button size="xs">超小尺寸</Button>',
  },
  {
    id: "size-sm",
    title: "小尺寸",
    titleEn: "Small size",
    intent: "筛选栏、表格行、紧凑表单等高密度区域。",
    intentEn: "Filter bars, table rows, and compact forms.",
    rule: "小尺寸用于空间受限场景，不用于页面主行动点。",
    ruleEn: "Use small size in constrained spaces, not for primary page actions.",
    variant: "default",
    size: "sm",
    group: "size",
    props: ["variant: default", "size: sm"],
    code: '<Button size="sm">小尺寸</Button>',
  },
  {
    id: "size-default",
    title: "默认尺寸",
    titleEn: "Default size",
    intent: "页面正文、表单页和常规操作区域。",
    intentEn: "Body content, forms, and standard action areas.",
    rule: "默认尺寸是业务页面的首选尺寸。",
    ruleEn: "Default size is the preferred size for product pages.",
    variant: "default",
    size: "default",
    group: "size",
    props: ["variant: default", "size: default"],
    code: "<Button>默认尺寸</Button>",
  },
  {
    id: "size-lg",
    title: "大尺寸",
    titleEn: "Large size",
    intent: "需要更强触达的表单提交、营销页或空状态行动点。",
    intentEn: "Higher-emphasis actions in forms, marketing pages, or empty states.",
    rule: "大尺寸谨慎使用，不在密集列表里使用。",
    ruleEn: "Use large size sparingly and avoid it in dense lists.",
    variant: "default",
    size: "lg",
    group: "size",
    props: ["variant: default", "size: lg"],
    code: '<Button size="lg">大尺寸</Button>',
  },
  {
    id: "icon-start",
    title: "左图标",
    titleEn: "Leading icon",
    intent: "用图标辅助识别动作含义。",
    intentEn: "Use an icon to support action recognition.",
    rule: "左图标使用 data-icon=\"inline-start\"，不手写尺寸。",
    ruleEn: "Use data-icon=\"inline-start\" for leading icons and do not manually size them.",
    variant: "default",
    size: "default",
    group: "icon",
    props: ["variant: default", "data-icon: inline-start"],
    code: '<Button><SearchIcon data-icon="inline-start" />搜索</Button>',
  },
  {
    id: "icon-end",
    title: "右图标",
    titleEn: "Trailing icon",
    intent: "用于带方向、展开或继续含义的按钮。",
    intentEn: "Use for actions that imply direction, expansion, or continuation.",
    rule: "右图标使用 data-icon=\"inline-end\"。",
    ruleEn: "Use data-icon=\"inline-end\" for trailing icons.",
    variant: "outline",
    size: "default",
    group: "icon",
    props: ["variant: outline", "data-icon: inline-end"],
    code: '<Button variant="outline">继续<ChevronDownIcon data-icon="inline-end" /></Button>',
  },
  {
    id: "icon-only",
    title: "图标按钮",
    titleEn: "Icon button",
    intent: "工具栏、表格行操作等空间紧凑的位置。",
    intentEn: "Compact areas such as toolbars and table row actions.",
    rule: "图标按钮必须有 aria-label，图标使用 data-icon，不手写尺寸。",
    ruleEn: "Icon buttons need aria-label. Use data-icon on icons and do not manually size them.",
    variant: "default",
    size: "icon",
    group: "icon",
    props: ["variant: default", "size: icon", "aria-label", "data-icon"],
    code: '<Button size="icon" aria-label="打开组件包"><PackageIcon data-icon="inline-start" /></Button>',
  },
  {
    id: "icon-only-ghost",
    title: "无底色图标按钮",
    titleEn: "Borderless icon button",
    intent: "工具栏、卡片角落等需要弱化视觉权重的图标操作。",
    intentEn: "Toolbars and card corners where the icon action should stay visually quiet.",
    rule: "使用 variant=\"ghost\"，悬浮态再出现底色；同样必须有 aria-label。",
    ruleEn: "Use variant=\"ghost\" so the background only appears on hover; aria-label is still required.",
    variant: "ghost",
    size: "icon",
    group: "icon",
    props: ["variant: ghost", "size: icon", "aria-label", "data-icon"],
    code: '<Button variant="ghost" size="icon" aria-label="打开组件包"><PackageIcon data-icon="inline-start" /></Button>',
  },
  {
    id: "disabled",
    title: "禁用状态",
    titleEn: "Disabled state",
    intent: "权限不足、表单未完成或提交中，暂时不可触发。",
    intentEn: "Temporarily unavailable actions, such as insufficient permissions, incomplete forms, or pending submit.",
    rule: "使用 disabled 表达不可操作，不要只降低透明度伪装禁用。",
    ruleEn: "Use disabled for unavailable actions. Do not fake disabled state with opacity alone.",
    variant: "default",
    size: "default",
    group: "state",
    props: ["variant: default", "size: default", "disabled"],
    code: "<Button disabled>提交中</Button>",
  },
  {
    id: "loading",
    title: "加载状态",
    titleEn: "Loading state",
    intent: "提交中、保存中等需要阻止重复点击的场景。",
    intentEn: "Pending submit or save actions that should prevent repeated clicks.",
    rule: "Button 没有 loading prop，使用 disabled 和 Spinner 组合。",
    ruleEn: "Button has no loading prop. Compose with disabled and Spinner.",
    variant: "default",
    size: "default",
    group: "state",
    props: ["disabled", "Spinner", "data-icon: inline-start"],
    code: '<Button disabled><Spinner data-icon="inline-start" />提交中</Button>',
  },
  {
    id: "button-group",
    title: "按钮组合",
    titleEn: "Button group",
    intent: "工具栏、分段操作等需要把多个按钮视觉上连成一体的场景。",
    intentEn: "Toolbars and segmented actions where multiple buttons should read as one unit.",
    rule: "用 ButtonGroup 包裹，不要靠手写负 margin 拼接按钮边框。",
    ruleEn: "Wrap with ButtonGroup instead of hand-rolling negative margins to merge button borders.",
    variant: "outline",
    size: "default",
    group: "combo",
    props: ["ButtonGroup", "variant: outline", "size: default"],
    code: '<ButtonGroup>\n  <Button variant="outline">复制</Button>\n  <Button variant="outline">剪切</Button>\n  <Button variant="outline">粘贴</Button>\n</ButtonGroup>',
  },
] as const

const buttonScenarioFilters: { value: ButtonScenarioFilter; label: string; labelEn: string }[] = [
  { value: "all", label: "全部", labelEn: "All" },
  { value: "category", label: "类型", labelEn: "Variant" },
  { value: "size", label: "尺寸", labelEn: "Size" },
  { value: "state", label: "状态", labelEn: "State" },
  { value: "icon", label: "图标", labelEn: "Icon" },
  { value: "combo", label: "组合", labelEn: "Group" },
]

const semanticDomRows = [
  { part: "root", desc: "按钮根节点，承载 variant、size、disabled、aria-invalid 和焦点态样式。", descEn: "Button root node for variant, size, disabled, aria-invalid, and focus styles." },
  { part: "icon", desc: "图标区域，用 data-icon=\"inline-start\"（前置）或 \"inline-end\"（后置）标记位置，不手写尺寸覆盖。", descEn: "Icon region. Mark placement with data-icon=\"inline-start\" (leading) or \"inline-end\" (trailing); do not override sizing manually." },
  { part: "content", desc: "按钮文本内容，保持单行动作短语，避免塞入说明文案。", descEn: "Button text content. Keep it as a concise action phrase." },
]

const buttonDosDonts = [
  {
    title: "不要手写品牌色",
    titleEn: "Do not hard-code brand color",
    wrong: '<Button className="bg-[#FF8000]">保存</Button>',
    right: "<Button>保存</Button>",
  },
  {
    title: "危险操作使用 destructive",
    titleEn: "Use destructive for dangerous actions",
    wrong: "<Button>删除项目</Button>",
    right: '<Button variant="destructive">删除项目</Button>',
  },
  {
    title: "加载态用组合，不发明 loading prop",
    titleEn: "Compose loading states instead of inventing a loading prop",
    wrong: "<Button loading>提交</Button>",
    right: "<Button disabled><Spinner data-icon=\"inline-start\" />提交中</Button>",
  },
  {
    title: "按钮内图标不手写尺寸",
    titleEn: "Do not manually size icons inside Button",
    wrong: '<PackageIcon className="size-4" />',
    right: '<PackageIcon data-icon="inline-start" />',
  },
]

const buttonAnchors = [
  { label: "组件总览", labelEn: "Overview", href: "#overview" },
  { label: "场景示例", labelEn: "Scenario examples", href: "#preview" },
  { label: "使用方式", labelEn: "Usage", href: "#usage" },
  { label: "API", href: "#props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#semantic-dom" },
  { label: "设计 Token", labelEn: "Design Token", href: "#button-tokens" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#do-dont" },
]

const tokenAnchors = [
  { label: "基础架构", labelEn: "Architecture", href: "#tokens-architecture" },
  { label: "颜色", labelEn: "Colors", href: "#tokens-colors" },
  { label: "排版", labelEn: "Typography", href: "#tokens-typography" },
  { label: "圆角", labelEn: "Radius", href: "#tokens-radius" },
  { label: "间距", labelEn: "Spacing", href: "#tokens-spacing" },
  { label: "阴影", labelEn: "Shadow", href: "#tokens-shadow" },
  { label: "动效", labelEn: "Motion", href: "#tokens-motion" },
  { label: "层级", labelEn: "Layer", href: "#tokens-layer" },
]

const iconAnchors = [
  { label: "图标库", labelEn: "Icon Library", href: "#icon-library" },
  { label: "安装状态", labelEn: "Installation", href: "#icon-install" },
  { label: "代码演示", labelEn: "Examples", href: "#icon-examples" },
  { label: "使用规则", labelEn: "Usage Rules", href: "#icon-rules" },
  { label: "AI 规则", labelEn: "AI Rules", href: "#icon-ai-rules" },
]

const tokenLayers = [
  { title: "Primitive", desc: "公司原始视觉值，只在 token 真相源里维护。", descEn: "Raw company visual values maintained only in the token source of truth.", example: "--fx-primary: #FF8000" },
  { title: "Semantic", desc: "shadcn/ui 和页面真正消费的语义槽。", descEn: "Semantic slots consumed by shadcn/ui and product pages.", example: "bg-primary text-primary-foreground" },
]

const semanticTokens = [
  { name: "primary", value: "#FF8000", usage: "主操作、激活态、品牌强调", usageEn: "Primary actions, active states, brand emphasis", className: "bg-primary" },
  { name: "background", value: "#F7F8FA", usage: "页面底色", usageEn: "Page background", className: "bg-background" },
  { name: "foreground", value: "#181C25", usage: "主文字", usageEn: "Primary text", className: "bg-foreground" },
  { name: "card", value: "#FFFFFF", usage: "卡片、浮层、内容容器", usageEn: "Cards, overlays, content containers", className: "bg-card" },
  { name: "muted", value: "#F2F3F5", usage: "次级背景、弱按钮、代码块", usageEn: "Subtle backgrounds, weak buttons, code blocks", className: "bg-muted" },
  { name: "muted-foreground", value: "#91959E", usage: "辅助说明、弱信息", usageEn: "Supporting text and low-emphasis information", className: "bg-muted-foreground" },
  { name: "border", value: "#DEE1E8", usage: "边框、分割线", usageEn: "Borders and dividers", className: "bg-border" },
  { name: "destructive", value: "#FF522A", usage: "删除、危险、不可逆操作", usageEn: "Delete, dangerous, irreversible actions", className: "bg-destructive" },
]

const typographyTokens = [
  { name: "font-sans", value: "Geist / system sans-serif", usage: "页面正文、表单、组件默认字体", usageEn: "Body text, forms, and default component typography" },
  { name: "text-sm", value: "0.875rem", usage: "表格、菜单、说明文字", usageEn: "Tables, menus, and supporting text" },
  { name: "text-base", value: "1rem", usage: "正文和主要说明", usageEn: "Body copy and primary descriptions" },
  { name: "text-2xl", value: "1.5rem", usage: "章节标题", usageEn: "Section headings" },
  { name: "text-4xl", value: "2.25rem", usage: "页面标题", usageEn: "Page titles" },
]

const radiusTokens = [
  { name: "--radius", value: "0.625rem", usage: "基础圆角真相源", usageEn: "Base radius source of truth" },
  { name: "rounded-md", value: "calc(var(--radius) - 2px)", usage: "按钮、输入框、小控件", usageEn: "Buttons, inputs, and compact controls" },
  { name: "rounded-lg", value: "var(--radius)", usage: "卡片、下拉、浮层容器", usageEn: "Cards, dropdowns, and overlay containers" },
  { name: "rounded-xl", value: "calc(var(--radius) + 4px)", usage: "Dialog、Sheet、较大区域容器", usageEn: "Dialogs, Sheets, and larger surface containers" },
]

const spacingTokens = [
  { name: "gap-1", value: "0.25rem / 4px", usage: "紧凑图标、微小内部间隔", usageEn: "Tight icon gaps and tiny internal spacing" },
  { name: "gap-2", value: "0.5rem / 8px", usage: "按钮图标、表单项内部间隔", usageEn: "Button icons and internal form item spacing" },
  { name: "gap-3", value: "0.75rem / 12px", usage: "章节标题与说明之间", usageEn: "Between a section title and its description" },
  { name: "gap-4", value: "1rem / 16px", usage: "卡片内容、表单字段之间", usageEn: "Card content and gaps between form fields" },
  { name: "gap-5", value: "1.25rem / 20px", usage: "章节标题组与主体内容之间", usageEn: "Between a section heading group and body content" },
  { name: "gap-6", value: "1.5rem / 24px", usage: "页面区块、小型章节之间", usageEn: "Page blocks and small sections" },
  { name: "gap-10", value: "2.5rem / 40px", usage: "文档章节、主内容分组之间", usageEn: "Documentation sections and major content groups" },
]

const shadowTokens = [
  { name: "shadow-none", usage: "扁平控件、表格、默认页面区域", usageEn: "Flat controls, tables, and default page regions" },
  { name: "shadow-sm", usage: "轻量卡片、可点击列表项", usageEn: "Light cards and clickable list items" },
  { name: "shadow-md", usage: "浮层、下拉菜单、轻量弹出容器", usageEn: "Overlays, dropdowns, and lightweight popover containers" },
  { name: "shadow-lg", usage: "重点浮层、需要从页面背景中脱离的容器", usageEn: "Prominent overlays and containers that need stronger separation" },
]

const motionTokens = [
  { name: "duration-100", usage: "Dialog、Dropdown、Popover、Tooltip 的进入退出", usageEn: "Enter and exit transitions for Dialog, Dropdown, Popover, and Tooltip" },
  { name: "duration-150", usage: "Sheet 遮罩淡入淡出", usageEn: "Sheet overlay fade transitions" },
  { name: "duration-200", usage: "Sidebar、Sheet 内容位移和宽度变化", usageEn: "Sidebar and Sheet content movement or width transitions" },
  { name: "animate-in / animate-out", usage: "基于 data-open / data-closed 的浮层显隐", usageEn: "Overlay visibility driven by data-open and data-closed states" },
  { name: "fade / zoom / slide", usage: "浮层常用组合，不为单页临时发明动画", usageEn: "Common overlay motion primitives; avoid one-off page animations" },
]

const layerTokens = [
  { name: "z-10", usage: "局部控件内部层级，例如 Avatar 状态点、Calendar 范围态", usageEn: "Local component layering, such as Avatar status dots or Calendar range states" },
  { name: "z-20", usage: "Sidebar 拖拽手柄等局部交互热区", usageEn: "Local interaction hit areas such as the Sidebar rail" },
  { name: "z-40", usage: "固定 Header、文档顶部导航", usageEn: "Fixed headers and document top navigation" },
  { name: "z-50", usage: "Dialog、Dropdown、Popover、Sheet、Tooltip 等浮层", usageEn: "Overlays such as Dialog, Dropdown, Popover, Sheet, and Tooltip" },
]

const iconInstallCode = "npm install lucide-react"

const docsByPage = {
  button: {
    title: "Button",
    path: "docs/components/button.md",
    markdown: buttonMarkdown,
  },
  icon: {
    title: "Icon",
    path: "docs/components/icon.md",
    markdown: iconMarkdown,
  },
  tokens: {
    title: "Tokens",
    path: "docs/TOKENS.md",
    markdown: tokensMarkdown,
  },
}

type DocPage = keyof typeof docsByPage
type ViewMode = "page" | "markdown"

function isDocPage(page: string): page is DocPage {
  return page === "button" || page === "icon" || page === "tokens"
}

function getPageFromHash(hash: string) {
  if (hash.startsWith("#tokens")) return "tokens"
  if (hash === "#icon" || hash.startsWith("#icon-")) return "icon"
  if (buttonAnchors.some((item) => item.href === hash)) return "button"
  if (hash === "#button" || hash === "" || hash === "#") return "button"
  return hash.replace("#", "") || "button"
}

function getNavItemFromHash(hash: string) {
  const normalizedHash = hash || "#button"
  const navItems = [
    ...topNav,
    ...docsNav.flatMap((section) => section.items),
  ]

  return navItems.find((item) => item.href === normalizedHash)
}

function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => copyTextFallback(text))
    return
  }

  copyTextFallback(text)
}

function copyTextFallback(text: string) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.top = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
}

function CopyCodeBlock({ code, label, lang }: { code: string; label: string; lang: Lang }) {
  return (
    <div className="relative rounded-lg bg-muted">
      <pre className="max-w-full overflow-x-auto p-4 pr-14 text-sm leading-7">
        <code>{code}</code>
      </pre>
      <div className="absolute right-3 top-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={lang === "en" ? `Copy ${label}` : `复制${label}`}
          onClick={() => copyText(code)}
        >
          <CopyIcon data-icon="inline-start" />
        </Button>
      </div>
    </div>
  )
}

function ButtonScenarioPreview({ id, lang }: { id: string; lang: Lang }) {
  if (id === "secondary") return <Button variant="secondary">{lang === "en" ? "Cancel" : "取消"}</Button>
  if (id === "destructive") return <Button variant="destructive">{lang === "en" ? "Delete project" : "删除项目"}</Button>
  if (id === "link") return <Button variant="link">{lang === "en" ? "Open docs" : "打开文档"}</Button>
  if (id === "outline") return <Button variant="outline">{lang === "en" ? "Export" : "导出"}</Button>
  if (id === "ghost") return <Button variant="ghost">{lang === "en" ? "View details" : "查看详情"}</Button>
  if (id === "size-xs") return <Button size="xs">{lang === "en" ? "Extra small size" : "超小尺寸"}</Button>
  if (id === "size-sm") return <Button size="sm">{lang === "en" ? "Small size" : "小尺寸"}</Button>
  if (id === "size-default") return <Button>{lang === "en" ? "Default size" : "默认尺寸"}</Button>
  if (id === "size-lg") return <Button size="lg">{lang === "en" ? "Large size" : "大尺寸"}</Button>
  if (id === "icon-start") {
    return (
      <Button>
        <SearchIcon data-icon="inline-start" />
        {lang === "en" ? "Search" : "搜索"}
      </Button>
    )
  }
  if (id === "icon-end") {
    return (
      <Button variant="outline">
        {lang === "en" ? "Continue" : "继续"}
        <ChevronDownIcon data-icon="inline-end" />
      </Button>
    )
  }
  if (id === "icon-only") {
    return (
      <Button size="icon" aria-label={lang === "en" ? "Open package" : "打开组件包"}>
        <PackageIcon data-icon="inline-start" />
      </Button>
    )
  }
  if (id === "icon-only-ghost") {
    return (
      <Button variant="ghost" size="icon" aria-label={lang === "en" ? "Open package" : "打开组件包"}>
        <PackageIcon data-icon="inline-start" />
      </Button>
    )
  }
  if (id === "disabled") return <Button disabled>{lang === "en" ? "Submitting" : "提交中"}</Button>
  if (id === "loading") {
    return (
      <Button disabled>
        <Spinner data-icon="inline-start" />
        {lang === "en" ? "Submitting" : "提交中"}
      </Button>
    )
  }
  if (id === "button-group") {
    return (
      <ButtonGroup>
        <Button variant="outline">{lang === "en" ? "Copy" : "复制"}</Button>
        <Button variant="outline">{lang === "en" ? "Cut" : "剪切"}</Button>
        <Button variant="outline">{lang === "en" ? "Paste" : "粘贴"}</Button>
      </ButtonGroup>
    )
  }
  return <Button>{lang === "en" ? "Save" : "保存"}</Button>
}

function ButtonOverview({ lang }: { lang: Lang }) {
  return (
    <div className="grid gap-6 rounded-lg border border-border bg-card p-6">
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Variants" : "类型"}</h3>
        <div className="flex flex-wrap items-center gap-3">
          {buttonScenarioExamples
            .filter((example) => example.group === "category")
            .map((example) => (
              <ButtonScenarioPreview key={example.id} id={example.id} lang={lang} />
            ))}
        </div>
      </div>
      <Separator />
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Sizes" : "尺寸"}</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">XS</Button>
          <Button size="sm">SM</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon-xs" aria-label={lang === "en" ? "Extra small icon button" : "超小图标按钮"}>
            <PackageIcon data-icon="inline-start" />
          </Button>
          <Button size="icon-sm" aria-label={lang === "en" ? "Small icon button" : "小图标按钮"}>
            <PackageIcon data-icon="inline-start" />
          </Button>
          <Button size="icon" aria-label={lang === "en" ? "Open package" : "打开组件包"}>
            <PackageIcon data-icon="inline-start" />
          </Button>
          <Button size="icon-lg" aria-label={lang === "en" ? "Large icon button" : "大图标按钮"}>
            <PackageIcon data-icon="inline-start" />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Interaction states" : "交互状态"}</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button>{lang === "en" ? "Normal" : "正常"}</Button>
          <Button disabled>
            <Spinner data-icon="inline-start" />
            {lang === "en" ? "Loading" : "加载中"}
          </Button>
          <Button disabled>{lang === "en" ? "Disabled" : "禁用"}</Button>
        </div>
      </div>
      <Separator />
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Icons" : "图标"}</h3>
        <div className="flex flex-wrap items-center gap-3">
          {buttonScenarioExamples
            .filter((example) => example.group === "icon")
            .map((example) => (
              <ButtonScenarioPreview key={example.id} id={example.id} lang={lang} />
            ))}
        </div>
      </div>
      <Separator />
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Combinations" : "组合"}</h3>
        <div className="flex flex-wrap items-center gap-3">
          {buttonScenarioExamples
            .filter((example) => example.group === "combo")
            .map((example) => (
              <ButtonScenarioPreview key={example.id} id={example.id} lang={lang} />
            ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState(() => getPageFromHash(window.location.hash))
  const [activeHash, setActiveHash] = useState(() => window.location.hash || "#button")
  const [activeAnchor, setActiveAnchor] = useState("#overview")
  const [viewMode, setViewMode] = useState<ViewMode>("page")
  const [lang, setLang] = useState<Lang>(() => {
    const saved = window.localStorage.getItem("fx-ui-lang")
    return saved === "en" ? "en" : "zh"
  })
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onHashChange = () => {
      const nextHash = window.location.hash || "#button"

      setActiveHash(nextHash)
      setPage(getPageFromHash(nextHash))
      setViewMode("page")
    }

    onHashChange()
    window.addEventListener("hashchange", onHashChange)

    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    window.localStorage.setItem("fx-ui-lang", lang)
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN"
  }, [lang])

  useEffect(() => {
    const viewMarkdown = () => setViewMode("markdown")

    window.addEventListener("fx-ui:view-markdown", viewMarkdown)
    return () => window.removeEventListener("fx-ui:view-markdown", viewMarkdown)
  }, [])

  const isTokensPage = page === "tokens"
  const isIconPage = page === "icon"
  const isButtonPage = page === "button"
  const anchors = isTokensPage ? tokenAnchors : isIconPage ? iconAnchors : isButtonPage ? buttonAnchors : []
  const docKey: DocPage | null = isDocPage(page) ? page : null
  const currentDoc = docKey ? docsByPage[docKey] : null
  const placeholderItem = getNavItemFromHash(activeHash)

  useEffect(() => {
    const main = mainRef.current
    if (!main || viewMode === "markdown") return undefined

    const syncActiveAnchor = () => {
      const mainTop = main.getBoundingClientRect().top
      let nextActive = anchors[0]?.href ?? "#button"

      for (const item of anchors) {
        const target = document.getElementById(item.href.slice(1))
        if (!target) continue

        const offset = target.getBoundingClientRect().top - mainTop
        if (offset <= 160) {
          nextActive = item.href
        }
      }

      setActiveAnchor(nextActive)
    }

    syncActiveAnchor()
    main.addEventListener("scroll", syncActiveAnchor, { passive: true })

    return () => main.removeEventListener("scroll", syncActiveAnchor)
  }, [anchors, viewMode])

  useEffect(() => {
    const main = mainRef.current
    if (!main || viewMode === "markdown") return

    const id = activeHash.slice(1)
    const isPageAnchor = anchors.some((item) => item.href === activeHash)
    if (!id || !isPageAnchor) return

    requestAnimationFrame(() => {
      const target = document.getElementById(id)
      if (!target) return

      const mainTop = main.getBoundingClientRect().top
      const targetTop = target.getBoundingClientRect().top

      main.scrollTo({
        top: main.scrollTop + targetTop - mainTop - 28,
        behavior: "smooth",
      })
      setActiveAnchor(activeHash)
    })
  }, [activeHash, anchors, viewMode])

  const scrollToAnchor = (href: string) => {
    const main = mainRef.current
    const target = document.getElementById(href.slice(1))
    if (!main || !target) return

    const mainTop = main.getBoundingClientRect().top
    const targetTop = target.getBoundingClientRect().top

    window.history.pushState(null, "", href)
    setActiveHash(href)
    setActiveAnchor(href)
    main.scrollTo({
      top: main.scrollTop + targetTop - mainTop - 28,
      behavior: "smooth",
    })
  }

  const pageActions = currentDoc ? (
    <PageActions
      doc={currentDoc}
      lang={lang}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    />
  ) : (
    <CopyPageAction lang={lang} />
  )

  return (
    <div className="h-dvh overflow-hidden bg-background text-foreground">
      <header className="relative z-40 h-14 shrink-0 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center gap-6 px-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-primary">fx-ui</div>
            <Badge variant="outline">v1.2.0</Badge>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {topNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={page === item.page ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                {getLabel(item, lang)}
              </a>
            ))}
          </nav>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden w-[calc(2ch+12px)] px-1.5 md:inline-flex"
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          >
            {lang === "zh" ? "中" : "EN"}
          </Button>

          <div className="hidden w-72 items-center gap-2 rounded-lg border border-input bg-card px-3 lg:flex">
            <SearchIcon className="size-4 text-muted-foreground" />
            <input
              className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder={uiText[lang].search}
            />
          </div>
        </div>
      </header>

      <div className="grid h-[calc(100dvh-3.5rem)] min-h-0 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden min-h-0 border-r border-border lg:block">
          <div className="h-full overflow-y-auto px-8 py-10">
            <div className="mb-6 lg:hidden">
              <Input placeholder={uiText[lang].search} />
            </div>
            <nav className="flex flex-col gap-10">
              {docsNav.map((section) => (
                <div key={section.title} className="flex flex-col gap-1">
                  <div className="text-sm font-medium text-muted-foreground">{lang === "en" && section.titleEn ? section.titleEn : section.title}</div>
                  <div className="flex flex-col gap-1.5">
                    {section.items.map((item) => {
                      const isActive =
                        item.href === activeHash ||
                        (activeHash === "#" && item.href === "#button")

                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          className={
                            isActive
                              ? "flex h-8 items-center rounded-lg bg-muted px-3 text-sm font-medium text-foreground"
                              : "flex h-8 items-center rounded-lg px-3 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
                          }
                        >
                          {getLabel(item, lang)}
                          {isActive ? <span className="ml-2 size-1.5 rounded-full bg-primary" /> : null}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main ref={mainRef} className="h-full w-full min-w-0 max-w-full overflow-y-auto overflow-x-hidden">
          <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-10 px-6 py-14 xl:grid-cols-[minmax(0,1080px)_220px] xl:justify-center xl:gap-20 xl:px-10">
            <article
              className="w-full min-w-0 break-words"
              style={{ maxWidth: "calc(100vw - 3rem)" }}
            >
              {viewMode === "markdown" && currentDoc ? (
                <MarkdownPage doc={currentDoc} actions={pageActions} lang={lang} />
              ) : isTokensPage ? (
                <TokensPage actions={pageActions} lang={lang} />
              ) : isIconPage ? (
                <IconPage actions={pageActions} lang={lang} />
              ) : isButtonPage ? (
                <ButtonPage actions={pageActions} lang={lang} />
              ) : (
                <PlaceholderPage
                  actions={pageActions}
                  hash={activeHash}
                  item={placeholderItem}
                  lang={lang}
                />
              )}
            </article>

            <RightRail
              activeAnchor={activeAnchor}
              anchors={anchors}
              lang={lang}
              onAnchorSelect={scrollToAnchor}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

function PageActions({
  doc,
  lang,
  viewMode,
  onViewModeChange,
}: {
  doc: (typeof docsByPage)[DocPage]
  lang: Lang
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}) {
  const copyCurrentPage = () => {
    copyText(doc.markdown)
  }

  const copyMarkdown = () => {
    copyText(doc.markdown)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" size="sm" onClick={copyCurrentPage}>
        <CopyIcon data-icon="inline-start" />
        {uiText[lang].copyPage}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label={uiText[lang].moreActions}
            />
          }
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
            {doc.path}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewModeChange(viewMode === "markdown" ? "page" : "markdown")}>
            <FileCodeIcon />
            {viewMode === "markdown" ? uiText[lang].viewPage : uiText[lang].viewMarkdown}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyMarkdown}>
            <CopyIcon />
            {uiText[lang].copyMarkdown}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function CopyPageAction({ lang }: { lang: Lang }) {
  const copyCurrentPage = () => {
    const pageText = document.querySelector("article")?.textContent?.trim() || window.location.href
    copyText(pageText)
  }

  return (
    <Button variant="secondary" size="sm" onClick={copyCurrentPage}>
      <CopyIcon data-icon="inline-start" />
      {uiText[lang].copyPage}
    </Button>
  )
}

function MarkdownPage({
  doc,
  actions,
  lang,
}: {
  doc: (typeof docsByPage)[DocPage]
  actions: React.ReactNode
  lang: Lang
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-3 text-sm text-muted-foreground">Markdown / {doc.path}</p>
          <h1 className="text-4xl font-semibold leading-tight">{doc.title} Markdown</h1>
        </div>
        {actions}
      </div>

      <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
        {uiText[lang].markdownLead}
      </p>

      <Card className="min-w-0 max-w-full">
        <CardHeader>
          <CardTitle className="text-base">{doc.path}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[70dvh] max-w-full overflow-auto rounded-lg bg-muted p-5 text-sm leading-7">
            <code>{doc.markdown}</code>
          </pre>
        </CardContent>
      </Card>
    </section>
  )
}

function PlaceholderPage({
  actions,
  hash,
  item,
  lang,
}: {
  actions: React.ReactNode
  hash: string
  item?: { label: string; labelEn?: string; href: string }
  lang: Lang
}) {
  const title = item ? getLabel(item, lang) : hash.replace("#", "") || "Page"

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            {lang === "en" ? "Placeholder" : "空页面占位"} / {hash || "#button"}
          </p>
          <h1 className="text-4xl font-semibold leading-tight">{title}</h1>
        </div>
        {actions}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {lang === "en" ? "Content not filled yet" : "内容暂未填充"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-7 text-muted-foreground">
          <p>
            {lang === "en"
              ? "This menu item already has its own route. The page can later be filled from shadcn Blocks, component docs, or internal layout guidelines."
              : "这个菜单项已经有独立路由。后续可以从 shadcn Blocks、组件文档或公司内部布局规范里补内容。"}
          </p>
          <code className="w-fit rounded-lg bg-muted px-3 py-2 text-xs text-foreground">{hash}</code>
        </CardContent>
      </Card>
    </section>
  )
}

function ButtonPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const [scenarioFilter, setScenarioFilter] = useState<ButtonScenarioFilter>("all")
  const filteredScenarioExamples = buttonScenarioExamples.filter((example) => {
    return scenarioFilter === "all" || example.group === scenarioFilter
  })

  return (
    <div className={docsSpacing.pageStack}>
      <section id="button" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">{lang === "en" ? "Button" : "Button 按钮"}</h1>
          </div>
          {actions}
        </div>

        <p className="max-w-3xl break-words text-lg leading-8">
          {lang === "en" ? "A button starts an immediate action." : "按钮用于开始一个即时操作。"}
        </p>
      </section>

      <section id="overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Overview" : "组件总览"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "A compact visual matrix for quickly scanning Button variants, sizes, states, and icon usage."
              : "紧凑展示 Button 的类型、尺寸、状态和图标用法，用来快速查看组件长什么样。"}
          </p>
        </div>
        <ButtonOverview lang={lang} />
      </section>

      <section id="preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Scenario examples" : "场景示例"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "Use filters to inspect all examples, variant choices, sizes, states, and icon usage from the same data source."
              : "可点选查看全部、类型、尺寸、状态和图标用法；所有示例都来自同一份结构化数据源。"}
          </p>
        </div>
        <Tabs
          value={scenarioFilter}
          onValueChange={(value) => setScenarioFilter(value as ButtonScenarioFilter)}
          aria-label={lang === "en" ? "Filter Button examples" : "筛选 Button 示例"}
        >
          <TabsList className="flex h-auto flex-wrap justify-start">
          {buttonScenarioFilters.map((filter) => (
            <TabsTrigger key={filter.value} value={filter.value}>
              {lang === "en" ? filter.labelEn : filter.label}
            </TabsTrigger>
          ))}
          </TabsList>
        </Tabs>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[1080px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">{lang === "en" ? "Scenario" : "场景"}</TableHead>
                <TableHead className="w-[160px]">{lang === "en" ? "Example" : "示例"}</TableHead>
                <TableHead className="w-[260px]">{lang === "en" ? "Intent" : "使用意图"}</TableHead>
                <TableHead>{lang === "en" ? "Constraint" : "约束"}</TableHead>
                <TableHead className="w-[300px] pr-4">{lang === "en" ? "Recommended API" : "推荐写法"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{lang === "en" ? example.titleEn : example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <ButtonScenarioPreview id={example.id} lang={lang} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{lang === "en" ? example.intentEn : example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{lang === "en" ? example.ruleEn : example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <div className="flex max-w-[300px] flex-col gap-2">
                      <code className="overflow-x-auto rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                        {example.code}
                      </code>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Usage" : "使用方式"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "Copy the import and JSX usage into product pages."
              : "把 import 和 JSX 调用复制到业务页面里使用。"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={buttonImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={buttonUsageCode} label={lang === "en" ? "JSX" : "调用"} lang={lang} />
          </div>
        </div>
      </section>

      <section id="props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">{lang === "en" ? "API Props" : "API 属性"}</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Prop" : "属性"}</TableHead>
                <TableHead>{lang === "en" ? "Type" : "类型"}</TableHead>
                <TableHead>{lang === "en" ? "Default" : "默认值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Description" : "描述"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.descEn : row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Semantic DOM" : "语义 DOM"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "Button source comes from shadcn/ui and remains open-code. This section records the semantic parts AI and engineers should understand."
              : "Button 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"}
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Part" : "部位"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Description" : "说明"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.descEn : row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="button-tokens" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Design Tokens" : "主题变量 Design Token"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "The Button page only shows tokens consumed by this component. Open Tokens from the top nav or left sidebar for the full token system."
              : "Button 页只展示这个组件实际消费的 token。完整 token 系统请从顶部 Tokens 或左侧设计 Tokens 进入。"}
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Token</TableHead>
                <TableHead>{lang === "en" ? "Value" : "当前值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Usage" : "用途"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buttonTokenRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full border border-border bg-primary" />
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code>
                    </div>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="do-dont" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Do / Don’t" : "正误示例"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "These examples capture the most common mistakes for engineers and AI-generated code."
              : "这些例子记录工程师和 AI 生成代码最容易犯的错误。"}
          </p>
        </div>
        <div className="grid gap-4">
          {buttonDosDonts.map((row) => (
            <Card key={row.title}>
              <CardHeader>
                <CardTitle className="text-base">{lang === "en" ? row.titleEn : row.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="w-fit">{lang === "en" ? "Don’t" : "不推荐"}</Badge>
                  <pre className="max-w-full overflow-x-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                    <code>{row.wrong}</code>
                  </pre>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="w-fit">{lang === "en" ? "Do" : "推荐"}</Badge>
                  <pre className="max-w-full overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                    <code>{row.right}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

function TokensPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <>
      <section id="tokens" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">{lang === "en" ? "Design Tokens / Overview" : "设计 Tokens / Overview"}</p>
            <h1 className="text-4xl font-semibold leading-tight">{lang === "en" ? "Design Tokens" : "Tokens 设计令牌"}</h1>
          </div>
          {actions}
        </div>

        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          {lang === "en"
            ? "Tokens are the visual source of truth for fx-ui. Base components come from shadcn/ui and pages start from Blocks, but visual consistency must be expressed through semantic tokens."
            : "Tokens 是 fx-ui 的公司视觉真相。基础组件来自 shadcn/ui，页面从 Blocks 起步，但视觉统一必须通过这些语义 token 实现。"}
        </p>

        <p className="text-base leading-8">
          {lang === "en"
            ? "This page is designed for both engineers and AI: engineers read real values and usage, while AI reads generation constraints and component-level rules."
            : "这个页面给前端工程师和 AI 同时消费：工程师看真实值和用法，AI 看生成约束和组件级规则。"}
        </p>
      </section>

      <Separator className="my-10" />

      <section id="tokens-architecture" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">{lang === "en" ? "Token System" : "Token 系统"}</Badge>
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Token architecture" : "基础架构"}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {tokenLayers.map((layer) => (
            <Card key={layer.title}>
              <CardHeader>
                <CardTitle className="text-base">{layer.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p>{lang === "en" ? layer.descEn : layer.desc}</p>
                <code className="rounded-lg bg-muted px-3 py-2 text-xs text-foreground">{layer.example}</code>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      <section id="tokens-colors" className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold">{lang === "en" ? "Colors" : "颜色"}</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Token</TableHead>
                <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                <TableHead>Tailwind</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Usage" : "场景"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semanticTokens.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`size-4 rounded-full border border-border ${row.className}`} />
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.className}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Separator className="my-10" />

      <section id="tokens-typography" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Typography" : "排版"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "Typography tokens define the basic reading scale for pages, components, and documentation."
              : "排版 token 定义页面、组件和文档的基础阅读层级。"}
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Token</TableHead>
                <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Usage" : "场景"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typographyTokens.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Separator className="my-10" />

      <section id="tokens-radius" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Radius" : "圆角"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "Radius tokens keep shadcn controls, cards, and overlays visually consistent."
              : "圆角 token 用来统一 shadcn 控件、卡片和浮层容器的视觉性格。"}
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Token</TableHead>
                <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Usage" : "场景"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radiusTokens.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Separator className="my-10" />

      <section id="tokens-spacing" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Spacing" : "间距"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "Spacing tokens keep page rhythm, component density, and documentation layout consistent. Prefer Tailwind spacing utilities instead of one-off pixel values."
              : "间距 token 用来统一页面节奏、组件密度和文档排版。优先使用 Tailwind 间距工具类，不临时手写像素值。"}
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Token</TableHead>
                <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Usage" : "场景"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spacingTokens.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.value}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Separator className="my-10" />

      <section id="tokens-shadow" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Shadow" : "阴影"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "Shadow tokens describe elevation. Use them sparingly for overlays and interactive surfaces, not as decoration."
              : "阴影 token 用来表达层级抬升。只在浮层、下拉、可交互表面中谨慎使用，不作为纯装饰。"}
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Token</TableHead>
                <TableHead>{lang === "en" ? "Preview" : "预览"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Usage" : "场景"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shadowTokens.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                  </TableCell>
                  <TableCell>
                    <div className={`h-10 w-24 rounded-lg border border-border bg-card ${row.name}`} />
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Separator className="my-10" />

      <section id="tokens-motion" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Motion" : "动效"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "Motion follows the shadcn components already in the project: tw-animate-css utilities, short durations, and data-state driven enter/exit transitions."
              : "动效沿用项目里 shadcn 组件已经在使用的模式：tw-animate-css 工具类、短时长、以及由 data-state 驱动的进入退出。"}
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Token / Utility</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Usage" : "场景"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {motionTokens.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Separator className="my-10" />

      <section id="tokens-layer" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">{lang === "en" ? "Layer" : "层级"}</h2>
          <p className="text-base leading-8 text-muted-foreground">
            {lang === "en"
              ? "Layer rules document the z-index scale already used by shadcn overlays. Avoid inventing new z-index values unless a real collision appears."
              : "层级规则记录 shadcn 浮层已经在用的 z-index 习惯。除非真的出现遮挡冲突，不要临时发明新的 z-index。"}
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Token</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Usage" : "场景"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {layerTokens.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.name}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.usageEn : row.usage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  )
}

function IconPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const iconSamples = [
    { name: "SearchIcon", icon: SearchIcon, usage: "搜索、筛选、查询入口", usageEn: "Search, filter, query entry" },
    { name: "SettingsIcon", icon: SettingsIcon, usage: "配置、偏好设置", usageEn: "Settings and preferences" },
    { name: "DatabaseIcon", icon: DatabaseIcon, usage: "数据源、表、存储", usageEn: "Data sources, tables, storage" },
    { name: "BellIcon", icon: BellIcon, usage: "通知、提醒", usageEn: "Notifications and reminders" },
    { name: "CheckCircleIcon", icon: CheckCircleIcon, usage: "成功、完成、校验通过", usageEn: "Success, completed, validated" },
    { name: "SparklesIcon", icon: SparklesIcon, usage: "AI、智能生成、推荐", usageEn: "AI, generation, recommendations" },
  ]

  const iconRules = [
    {
      zh: "统一从 lucide-react 按需导入图标。",
      en: "Import icons from lucide-react by name.",
    },
    {
      zh: "图标颜色使用 currentColor，跟随父级 text-* 语义色。",
      en: "Use currentColor so icons follow semantic text colors.",
    },
    {
      zh: "图标放进 Button 时必须使用 data-icon，不手写尺寸覆盖。",
      en: "Use data-icon inside Button and do not override icon size manually.",
    },
    {
      zh: "纯图标按钮必须提供 aria-label。",
      en: "Icon-only buttons must provide an aria-label.",
    },
    {
      zh: "业务图标优先选择通用语义，不为单个页面临时创造一套风格。",
      en: "Choose broadly semantic icons and avoid page-specific icon styles.",
    },
  ]

  return (
    <>
      <section id="icon-library" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">{lang === "en" ? "General / Icon" : "通用 / Icon"}</p>
            <h1 className="text-4xl font-semibold leading-tight">{lang === "en" ? "Icon" : "Icon 图标"}</h1>
          </div>
          {actions}
        </div>

        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          {lang === "en" ? (
            <>
              fx-ui currently uses <code className="rounded bg-muted px-1.5 py-0.5">lucide-react</code> as the unified icon library.
              This matches the shadcn iconLibrary setting used by component examples, button icons, and menu icons.
            </>
          ) : (
            <>
              fx-ui 当前统一使用 <code className="rounded bg-muted px-1.5 py-0.5">lucide-react</code>。
              这也是 shadcn 项目配置里的 iconLibrary：组件示例、按钮图标、菜单图标都按这个库来。
            </>
          )}
        </p>

        <p className="text-base leading-8">
          {lang === "en" ? (
            <>
              Icons are not company wrapper components and do not live in <code className="rounded bg-muted px-1.5 py-0.5">src/components/ui</code>.
              They are consumed directly as part of the visual language.
            </>
          ) : (
            <>
              图标不是公司封装组件，不进入 <code className="rounded bg-muted px-1.5 py-0.5">src/components/ui</code>。
              它作为基础视觉语言被组件和页面直接消费。
            </>
          )}
        </p>
      </section>

      <Separator className="my-10" />

      <section id="icon-install" className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">{lang === "en" ? "Installation" : "安装状态"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{lang === "en" ? "Project config" : "项目配置"}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">components.json</code>
                {lang === "en" ? " declares:" : " 中："}
              </p>
              <code className="rounded-lg bg-muted px-3 py-2 text-xs text-foreground">
                "iconLibrary": "lucide"
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{lang === "en" ? "Dependency" : "依赖包"}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">package.json</code>
                {lang === "en" ? " includes:" : " 中已经安装："}
              </p>
              <code className="rounded-lg bg-muted px-3 py-2 text-xs text-foreground">
                "lucide-react": "^1.17.0"
              </code>
            </CardContent>
          </Card>
        </div>

        <Card className="min-w-0 max-w-full">
          <CardContent className="p-0">
            <div className="flex items-center gap-4 border-b border-border px-4 py-3 text-sm text-muted-foreground">
              <TerminalIcon className="size-4" />
              <span className="rounded-lg border border-border bg-card px-3 py-1 text-foreground">npm</span>
              <span>pnpm</span>
              <span>yarn</span>
              <CopyIcon className="ml-auto size-4" />
            </div>
            <pre className="max-w-full overflow-x-auto p-5 text-sm">
              <code>{iconInstallCode}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-10" />

      <section id="icon-examples" className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold">{lang === "en" ? "Examples" : "代码演示"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {iconSamples.map((item) => {
            const Icon = item.icon

            return (
              <Card key={item.name}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{lang === "en" ? item.usageEn : item.usage}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardContent className="p-0">
            <pre className="max-w-full overflow-x-auto p-5 text-sm leading-7">
              <code>{`import { SearchIcon } from "lucide-react"

export function SearchAction() {
  return <SearchIcon className="size-4 text-muted-foreground" />
}`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-10" />

      <section id="icon-rules" className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold">{lang === "en" ? "Usage Rules" : "使用规则"}</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Scenario" : "场景"}</TableHead>
                <TableHead>{lang === "en" ? "Pattern" : "写法"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Rule" : "规则"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="pl-4 font-medium">{lang === "en" ? "Icon in Button" : "按钮内图标"}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">data-icon="inline-start"</code>
                </TableCell>
                <TableCell className="pr-4 text-muted-foreground">
                  {lang === "en" ? "Button controls the icon size. Do not write size classes directly." : "尺寸由 Button 控制，不直接写 size class。"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-4 font-medium">{lang === "en" ? "Icon-only Button" : "纯图标按钮"}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">aria-label</code>
                </TableCell>
                <TableCell className="pr-4 text-muted-foreground">
                  {lang === "en" ? "Provide an accessible name." : "必须提供可访问名称。"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-4 font-medium">{lang === "en" ? "Inline supporting icon" : "普通说明图标"}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">text-muted-foreground</code>
                </TableCell>
                <TableCell className="pr-4 text-muted-foreground">
                  {lang === "en" ? "Use semantic text colors instead of hard-coded colors." : "使用语义文字色，不写硬编码颜色。"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <Separator className="my-10" />

      <section id="icon-ai-rules" className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold">{lang === "en" ? "AI Rules" : "AI 规则"}</h2>
        <Card>
          <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
            {iconRules.map((rule) => (
              <div key={rule.zh} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{lang === "en" ? rule.en : rule.zh}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function RightRail({
  activeAnchor,
  anchors,
  lang,
  onAnchorSelect,
}: {
  activeAnchor: string
  anchors: typeof buttonAnchors
  lang: Lang
  onAnchorSelect: (href: string) => void
}) {
  if (anchors.length === 0) return null

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-8">
        <nav className="border-l border-border pl-6">
          <div className="mb-4 text-sm font-medium text-foreground">{uiText[lang].toc}</div>
          <div className="flex flex-col gap-1 text-sm leading-7">
            {anchors.map((item) => {
              const isActive = activeAnchor === item.href

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault()
                    onAnchorSelect(item.href)
                  }}
                  className={
                    isActive
                      ? "relative flex items-center font-medium text-foreground"
                      : "relative flex items-center text-muted-foreground transition-colors hover:text-foreground"
                  }
                >
                  {isActive ? (
                    <span className="absolute -left-[29px] size-1.5 rounded-full bg-primary" />
                  ) : null}
                  {getLabel(item, lang)}
                </a>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default App
