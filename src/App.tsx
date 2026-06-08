import { useEffect, useRef, useState } from "react"
import {
  BellIcon,
  BoldIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  CopyIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileCodeIcon,
  FolderIcon,
  HomeIcon,
  ItalicIcon,
  LogOutIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  TerminalIcon,
  UnderlineIcon,
  UserIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Calendar } from "@/components/ui/calendar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
      { label: "按钮组", labelEn: "Button Group", href: "#button-group" },
      { label: "文字", labelEn: "Typography", href: "#typography" },
      { label: "图标", labelEn: "Icon", href: "#icon" },
      { label: "分隔线", labelEn: "Separator", href: "#separator" },
      { label: "头像", labelEn: "Avatar", href: "#avatar" },
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
      { label: "日历", labelEn: "Calendar", href: "#calendar" },
      { label: "切换按钮", labelEn: "Toggle", href: "#toggle" },
      { label: "切换按钮组", labelEn: "Toggle Group", href: "#toggle-group" },
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
      { label: "折叠面板", labelEn: "Collapsible", href: "#collapsible" },
    ],
  },
  {
    title: "导航",
    titleEn: "Navigation",
    items: [
      { label: "面包屑", labelEn: "Breadcrumb", href: "#breadcrumb" },
      { label: "标签页", labelEn: "Tabs", href: "#tabs" },
      { label: "下拉菜单", labelEn: "Dropdown Menu", href: "#dropdown-menu" },
      { label: "侧边栏", labelEn: "Sidebar", href: "#sidebar" },
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
      { label: "弹出层", labelEn: "Popover", href: "#popover" },
      { label: "加载指示器", labelEn: "Spinner", href: "#spinner" },
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

const typographyAnchors = [
  { label: "概览", href: "#typography-overview" },
  { label: "字号阶梯", href: "#typography-scale" },
  { label: "使用方式", href: "#typography-usage" },
  { label: "使用规则", href: "#typography-rules" },
]

const typographyUsageExamples = [
  {
    title: "页面标题",
    code: `<h1 className="text-4xl font-semibold leading-tight">页面标题</h1>`,
    usage: "用于文档页、详情页的最顶层标题，全页只出现一次。",
  },
  {
    title: "章节标题",
    code: `<h2 className="text-2xl font-semibold">章节标题</h2>`,
    usage: "用于页面内的分组小节标题，配合 Separator 分隔不同章节。",
  },
  {
    title: "正文",
    code: `<p className="text-base leading-8">正文说明文字…</p>`,
    usage: "用于段落说明、正文叙述，行高拉开方便长文阅读。",
  },
  {
    title: "辅助说明",
    code: `<p className="text-sm text-muted-foreground">表格、菜单里的次要说明文字</p>`,
    usage: "用于表格、菜单、表单提示等次要信息，颜色降级为 muted-foreground。",
  },
]

const typographyRules = [
  "字号必须用 Tailwind 的语义类（text-sm / text-base / text-2xl / text-4xl），不要手写 font-size。",
  "字体统一用 font-sans（Geist / system sans-serif），不为单个页面引入新字体。",
  "正文类文字优先配 leading-7 / leading-8，标题类文字用 leading-tight，避免行距随手调。",
  "次要说明文字用 text-muted-foreground 而不是手写灰色色值。",
  "标题层级要按页面结构选（页面标题用 text-4xl，章节标题用 text-2xl），不要为视觉效果跳级使用。",
]

const inputAnchors = [
  { label: "组件总览", href: "#input-overview" },
  { label: "场景示例", href: "#input-preview" },
  { label: "使用方式", href: "#input-usage" },
  { label: "API", href: "#input-props" },
  { label: "语义 DOM", href: "#input-semantic-dom" },
  { label: "正误示例", href: "#input-do-dont" },
]

const inputScenarioExamples = [
  {
    id: "default",
    title: "默认输入框",
    intent: "最基础的单行文本录入，搭配 placeholder 提示输入内容。",
    rule: "宽度跟随父容器，不手写固定宽度。",
    code: `<Input placeholder="请输入姓名" />`,
  },
  {
    id: "with-label",
    title: "搭配 Label",
    intent: "表单字段的标准写法，标签和输入框通过 id / htmlFor 关联。",
    rule: "Label 和 Input 必须用 id / htmlFor 显式关联，不能只靠视觉相邻。",
    code: `<div className="grid gap-2">\n  <Label htmlFor="name">姓名</Label>\n  <Input id="name" placeholder="请输入姓名" />\n</div>`,
  },
  {
    id: "disabled",
    title: "禁用状态",
    intent: "字段当前不可编辑（如只读详情、依赖未满足）。",
    rule: "用原生 disabled 属性，不要用样式假装禁用。",
    code: `<Input disabled placeholder="不可编辑" />`,
  },
  {
    id: "invalid",
    title: "校验失败",
    intent: "提交校验未通过时，提示用户当前字段有误。",
    rule: "用 aria-invalid 触发态，不手写红色边框 className。",
    code: `<Input aria-invalid placeholder="请输入邮箱" />`,
  },
]

const inputPropRows = [
  { prop: "type", type: "string", defaultValue: "text", desc: "原生 input 类型（text / number / password / email …）" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用输入，触发禁用态样式" },
  { prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "标记当前值未通过校验，触发错误态样式" },
  { prop: "placeholder", type: "string", defaultValue: "—", desc: "占位提示文字" },
  { prop: "className", type: "string", defaultValue: "—", desc: "在保留基础样式的前提下追加 Tailwind 类名" },
  { prop: "...props", type: "React.ComponentProps<\"input\">", defaultValue: "—", desc: "透传所有原生 input 属性（value / onChange / name / required 等）" },
]

const inputSemanticDomRows = [
  { part: "data-slot=\"input\"", desc: "标记输入框根节点，供样式选择器和测试定位使用" },
  { part: "aria-invalid", desc: "校验失败态的语义标记，同时驱动错误态样式" },
  { part: "disabled", desc: "原生禁用属性，驱动禁用态样式并阻止交互" },
]

const inputDoDontRows = [
  { do: "搭配 Label 并用 id / htmlFor 关联，保证可访问性。", dont: "只让 Label 在视觉上挨着 Input，不做关联。" },
  { do: "校验失败时设置 aria-invalid。", dont: "手写红色边框 className 来表示错误态。" },
  { do: "用 disabled 属性表达不可编辑。", dont: "用样式伪装禁用（如降低透明度但仍可输入）。" },
  { do: "通过 className 追加间距、宽度等布局类。", dont: "覆盖输入框自身的边框、圆角、内边距等基础视觉。" },
]

const selectAnchors = [
  { label: "组件总览", href: "#select-overview" },
  { label: "场景示例", href: "#select-preview" },
  { label: "使用方式", href: "#select-usage" },
  { label: "API", href: "#select-props" },
  { label: "语义 DOM", href: "#select-semantic-dom" },
  { label: "正误示例", href: "#select-do-dont" },
]

const selectScenarioExamples = [
  {
    id: "default",
    title: "默认选择器",
    intent: "从一组互斥选项中选择一个值，触发器宽度自适应。",
    rule: "用 SelectValue 的 placeholder 表达未选择态，不手写空字符串占位。",
    code: `<Select>\n  <SelectTrigger className="w-[180px]">\n    <SelectValue placeholder="请选择角色" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="admin">管理员</SelectItem>\n    <SelectItem value="member">成员</SelectItem>\n  </SelectContent>\n</Select>`,
  },
  {
    id: "grouped",
    title: "分组选项",
    intent: "选项较多需要按类别归组时，用 SelectGroup + SelectLabel 标记分组标题。",
    rule: "分组标题用 SelectLabel，不要用普通文本伪造分组标题。",
    code: `<SelectContent>\n  <SelectGroup>\n    <SelectLabel>常用</SelectLabel>\n    <SelectItem value="cn">中国</SelectItem>\n    <SelectItem value="us">美国</SelectItem>\n  </SelectGroup>\n</SelectContent>`,
  },
  {
    id: "small",
    title: "紧凑尺寸",
    intent: "用于工具栏、表格筛选等空间紧张的场景。",
    rule: "用 size=\"sm\" 切换尺寸，不手写高度类覆盖。",
    code: `<SelectTrigger size="sm" className="w-[140px]">\n  <SelectValue placeholder="筛选状态" />\n</SelectTrigger>`,
  },
  {
    id: "disabled",
    title: "禁用状态",
    intent: "选择器当前不可操作（如依赖项未满足）。",
    rule: "用原生 disabled，不要用样式假装禁用。",
    code: `<Select disabled>\n  <SelectTrigger className="w-[180px]">\n    <SelectValue placeholder="暂不可选择" />\n  </SelectTrigger>\n</Select>`,
  },
]

const selectPropRows = [
  { prop: "value / defaultValue", type: "string", defaultValue: "—", desc: "受控 / 非受控的当前选中值" },
  { prop: "onValueChange", type: "(value: string) => void", defaultValue: "—", desc: "选中值变化时的回调" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用整个选择器" },
  { prop: "size", type: "\"sm\" | \"default\"", defaultValue: "default", desc: "SelectTrigger 的尺寸（影响高度和圆角）" },
  { prop: "value（SelectItem）", type: "string", defaultValue: "—", desc: "选项的取值，需要在选项集合内唯一" },
]

const selectSemanticDomRows = [
  { part: "data-slot=\"select-trigger\"", desc: "选择器触发按钮，承载边框、圆角、尺寸样式" },
  { part: "data-slot=\"select-value\"", desc: "展示当前选中值或 placeholder 的文本节点" },
  { part: "data-slot=\"select-content\"", desc: "下拉浮层容器，承载阴影、动效、滚动" },
  { part: "data-slot=\"select-item\"", desc: "单个选项节点，包含选中态指示图标" },
  { part: "data-slot=\"select-group\" / \"select-label\"", desc: "选项分组容器与分组标题" },
]

const selectDoDontRows = [
  { do: "用 SelectValue 的 placeholder 表达未选择态。", dont: "手写一个空字符串选项当作占位符。" },
  { do: "选项较多时用 SelectGroup + SelectLabel 分组。", dont: "把分组标题写成普通禁用选项。" },
  { do: "用 size 属性切换紧凑/默认尺寸。", dont: "用 className 覆盖高度、内边距来改尺寸。" },
  { do: "用 disabled 表达不可操作。", dont: "靠样式降低透明度但仍可点击触发。" },
]

const checkboxAnchors = [
  { label: "组件总览", href: "#checkbox-overview" },
  { label: "场景示例", href: "#checkbox-preview" },
  { label: "使用方式", href: "#checkbox-usage" },
  { label: "API", href: "#checkbox-props" },
  { label: "语义 DOM", href: "#checkbox-semantic-dom" },
  { label: "正误示例", href: "#checkbox-do-dont" },
]

const checkboxScenarioExamples = [
  {
    id: "default",
    title: "默认复选框",
    intent: "单个布尔选项的勾选，常见于条款确认、设置开关项。",
    rule: "必须搭配 Label 并通过 id / htmlFor 关联，不能只靠相邻摆放。",
    code: `<div className="flex items-center gap-2">\n  <Checkbox id="agree" />\n  <Label htmlFor="agree">我已阅读并同意服务条款</Label>\n</div>`,
  },
  {
    id: "checked",
    title: "受控选中态",
    intent: "需要在外部状态中读取/控制选中值（如批量选择列表项）。",
    rule: "用 checked + onCheckedChange 受控，不直接操作 DOM。",
    code: `<Checkbox checked={checked} onCheckedChange={setChecked} />`,
  },
  {
    id: "disabled",
    title: "禁用状态",
    intent: "选项当前不可更改（如权限不足、依赖条件未满足）。",
    rule: "用原生 disabled，不要用样式假装禁用。",
    code: `<div className="flex items-center gap-2">\n  <Checkbox id="readonly" disabled />\n  <Label htmlFor="readonly">该选项不可编辑</Label>\n</div>`,
  },
  {
    id: "list",
    title: "列表内勾选",
    intent: "表格、列表里的批量选择项，通常配合表头的全选复选框。",
    rule: "列表项的勾选状态要和表头全选状态联动，避免出现状态不一致。",
    code: `<TableCell>\n  <Checkbox aria-label="选择该行" />\n</TableCell>`,
  },
]

const checkboxPropRows = [
  { prop: "checked / defaultChecked", type: "boolean", defaultValue: "false", desc: "受控 / 非受控的选中状态" },
  { prop: "onCheckedChange", type: "(checked: boolean) => void", defaultValue: "—", desc: "选中状态变化时的回调" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用复选框，阻止交互并触发禁用态样式" },
  { prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "标记当前选项未通过校验，触发错误态样式" },
  { prop: "id", type: "string", defaultValue: "—", desc: "与 Label 的 htmlFor 关联，建立可访问性映射" },
]

const checkboxSemanticDomRows = [
  { part: "data-slot=\"checkbox\"", desc: "复选框根节点，承载边框、圆角、选中态背景" },
  { part: "data-slot=\"checkbox-indicator\"", desc: "选中态的对勾图标容器，仅在选中时渲染内容" },
  { part: "data-checked", desc: "选中态的语义标记，驱动选中态背景和边框颜色" },
]

const checkboxDoDontRows = [
  { do: "搭配 Label 并用 id / htmlFor 关联。", dont: "只让文字在视觉上挨着复选框。" },
  { do: "用 checked + onCheckedChange 做受控状态管理。", dont: "用 ref 直接读写 DOM 节点状态。" },
  { do: "列表批量选择时让行选中态和表头全选状态联动。", dont: "让全选复选框和行复选框各自维护独立状态。" },
  { do: "用 disabled 表达不可更改。", dont: "用样式降低透明度但仍可点击切换。" },
]

const switchAnchors = [
  { label: "组件总览", href: "#switch-overview" },
  { label: "场景示例", href: "#switch-preview" },
  { label: "使用方式", href: "#switch-usage" },
  { label: "API", href: "#switch-props" },
  { label: "语义 DOM", href: "#switch-semantic-dom" },
  { label: "正误示例", href: "#switch-do-dont" },
]

const switchScenarioExamples = [
  {
    id: "default",
    title: "默认开关",
    intent: "立即生效的二元设置项，如通知开关、功能开关。",
    rule: "切换后立即生效，不需要额外的提交按钮；必须搭配 Label。",
    code: `<div className="flex items-center gap-2">\n  <Switch id="notify" />\n  <Label htmlFor="notify">接收消息通知</Label>\n</div>`,
  },
  {
    id: "checked",
    title: "受控状态",
    intent: "需要在外部状态中读取/控制开关值。",
    rule: "用 checked + onCheckedChange 受控，不直接操作 DOM。",
    code: `<Switch checked={enabled} onCheckedChange={setEnabled} />`,
  },
  {
    id: "small",
    title: "紧凑尺寸",
    intent: "用于表格行内、紧凑表单等空间有限的场景。",
    rule: "用 size=\"sm\" 切换尺寸，不手写宽高覆盖。",
    code: `<Switch size="sm" />`,
  },
  {
    id: "disabled",
    title: "禁用状态",
    intent: "开关当前不可操作（如权限不足）。",
    rule: "用原生 disabled，不要用样式假装禁用。",
    code: `<div className="flex items-center gap-2">\n  <Switch id="locked" disabled />\n  <Label htmlFor="locked">该选项不可更改</Label>\n</div>`,
  },
]

const switchPropRows = [
  { prop: "checked / defaultChecked", type: "boolean", defaultValue: "false", desc: "受控 / 非受控的开关状态" },
  { prop: "onCheckedChange", type: "(checked: boolean) => void", defaultValue: "—", desc: "状态变化时的回调，切换后立即触发" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用开关，阻止交互并触发禁用态样式" },
  { prop: "size", type: "\"sm\" | \"default\"", defaultValue: "default", desc: "开关的尺寸（影响轨道和滑块大小）" },
  { prop: "id", type: "string", defaultValue: "—", desc: "与 Label 的 htmlFor 关联，建立可访问性映射" },
]

const switchSemanticDomRows = [
  { part: "data-slot=\"switch\"", desc: "开关轨道根节点，承载圆角、开/关态背景色" },
  { part: "data-slot=\"switch-thumb\"", desc: "可滑动的圆形滑块，位移表达开/关状态" },
  { part: "data-checked / data-unchecked", desc: "开关状态的语义标记，驱动轨道颜色和滑块位移" },
]

const switchDoDontRows = [
  { do: "用于立即生效的设置项，搭配 Label 说明用途。", dont: "把 Switch 当复选框用在需要批量提交的表单里。" },
  { do: "用 checked + onCheckedChange 做受控状态管理。", dont: "用 ref 直接读写 DOM 节点状态。" },
  { do: "用 size 属性切换紧凑/默认尺寸。", dont: "用 className 覆盖宽高、位移来改尺寸。" },
  { do: "用 disabled 表达不可更改。", dont: "用样式降低透明度但仍可点击切换。" },
]

const textareaAnchors = [
  { label: "组件总览", href: "#textarea-overview" },
  { label: "场景示例", href: "#textarea-preview" },
  { label: "使用方式", href: "#textarea-usage" },
  { label: "API", href: "#textarea-props" },
  { label: "语义 DOM", href: "#textarea-semantic-dom" },
  { label: "正误示例", href: "#textarea-do-dont" },
]

const textareaScenarioExamples = [
  {
    id: "default",
    title: "默认多行输入",
    intent: "录入较长文本，如备注、描述、反馈内容。",
    rule: "高度随内容自适应（field-sizing-content），不要手写固定 rows 撑死高度。",
    code: `<div className="grid gap-2">\n  <Label htmlFor="bio">个人简介</Label>\n  <Textarea id="bio" placeholder="简单介绍一下自己" />\n</div>`,
  },
  {
    id: "disabled",
    title: "禁用状态",
    intent: "字段当前不可编辑（如只读详情）。",
    rule: "用原生 disabled，不要用样式假装禁用。",
    code: `<Textarea disabled placeholder="不可编辑" />`,
  },
  {
    id: "invalid",
    title: "校验失败",
    intent: "提交校验未通过时，提示用户当前字段有误。",
    rule: "用 aria-invalid 触发态，不手写红色边框 className。",
    code: `<Textarea aria-invalid placeholder="请输入至少 10 个字" />`,
  },
]

const textareaPropRows = [
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用输入，触发禁用态样式" },
  { prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "标记当前值未通过校验，触发错误态样式" },
  { prop: "placeholder", type: "string", defaultValue: "—", desc: "占位提示文字" },
  { prop: "className", type: "string", defaultValue: "—", desc: "在保留基础样式的前提下追加 Tailwind 类名" },
  { prop: "...props", type: "React.ComponentProps<\"textarea\">", defaultValue: "—", desc: "透传所有原生 textarea 属性（value / onChange / rows / required 等）" },
]

const textareaSemanticDomRows = [
  { part: "data-slot=\"textarea\"", desc: "标记多行输入框根节点，供样式选择器和测试定位使用" },
  { part: "aria-invalid", desc: "校验失败态的语义标记，同时驱动错误态样式" },
  { part: "disabled", desc: "原生禁用属性，驱动禁用态样式并阻止交互" },
]

const textareaDoDontRows = [
  { do: "搭配 Label 并用 id / htmlFor 关联。", dont: "只让 Label 在视觉上挨着 Textarea。" },
  { do: "让高度跟随内容自适应（默认行为）。", dont: "手写固定 rows 或 height 撑死/限死高度。" },
  { do: "校验失败时设置 aria-invalid。", dont: "手写红色边框 className 来表示错误态。" },
  { do: "用 disabled 表达不可编辑。", dont: "用样式伪装禁用（如降低透明度但仍可输入）。" },
]

const tableAnchors = [
  { label: "组件总览", href: "#table-overview" },
  { label: "场景示例", href: "#table-preview" },
  { label: "使用方式", href: "#table-usage" },
  { label: "API", href: "#table-props" },
  { label: "语义 DOM", href: "#table-semantic-dom" },
  { label: "正误示例", href: "#table-do-dont" },
]

const tableDemoRows = [
  { id: "INV-1001", customer: "张伟", status: "已支付", amount: "¥1,280" },
  { id: "INV-1002", customer: "李娜", status: "处理中", amount: "¥860" },
  { id: "INV-1003", customer: "王芳", status: "已支付", amount: "¥2,140" },
]

const tablePropRows = [
  { prop: "Table", type: "组件", defaultValue: "—", desc: "外层容器，自带横向滚动和文字大小设置" },
  { prop: "TableHeader / TableBody / TableFooter", type: "组件", defaultValue: "—", desc: "表头、表体、表尾分组容器，对应 thead / tbody / tfoot" },
  { prop: "TableRow", type: "组件", defaultValue: "—", desc: "表格行，自带 hover 态和选中态背景" },
  { prop: "TableHead / TableCell", type: "组件", defaultValue: "—", desc: "表头单元格 / 数据单元格" },
  { prop: "TableCaption", type: "组件", defaultValue: "—", desc: "表格的整体说明文字，渲染在表格下方" },
]

const tableSemanticDomRows = [
  { part: "data-slot=\"table\"", desc: "表格根节点的外层滚动容器" },
  { part: "data-slot=\"table-row\"", desc: "数据行节点，承载 hover、选中态背景" },
  { part: "data-slot=\"table-head\" / \"table-cell\"", desc: "表头单元格 / 数据单元格，承载内边距和对齐方式" },
]

const tableDoDontRows = [
  { do: "用 TableHeader/TableBody/TableRow 等语义子组件搭表格。", dont: "用一堆 div + Tailwind grid 手搓表格布局。" },
  { do: "需要整体说明时用 TableCaption。", dont: "在表格上方再写一段独立的 <p> 当说明文字。" },
  { do: "状态类内容用 Badge 包裹展示。", dont: "用纯文字加颜色 className 表达状态。" },
  { do: "宽表格让 Table 的外层容器自己处理横向滚动。", dont: "给每个单元格分别设置 overflow 和宽度。" },
]

const cardAnchors = [
  { label: "组件总览", href: "#card-overview" },
  { label: "场景示例", href: "#card-preview" },
  { label: "使用方式", href: "#card-usage" },
  { label: "API", href: "#card-props" },
  { label: "语义 DOM", href: "#card-semantic-dom" },
  { label: "正误示例", href: "#card-do-dont" },
]

const cardPropRows = [
  { prop: "Card", type: "组件", defaultValue: "—", desc: "卡片根容器，提供边框、圆角、背景与内部纵向间距" },
  { prop: "CardHeader", type: "组件", defaultValue: "—", desc: "头部分组，包含标题、描述与右上角操作区的网格布局" },
  { prop: "CardTitle / CardDescription", type: "组件", defaultValue: "—", desc: "标题与说明文字，分别承载强调和次要语义" },
  { prop: "CardAction", type: "组件", defaultValue: "—", desc: "头部右上角的操作区（按钮、菜单触发器等），自动定位到网格右侧" },
  { prop: "CardContent / CardFooter", type: "组件", defaultValue: "—", desc: "主体内容区 / 底部操作区，按需选用" },
]

const cardSemanticDomRows = [
  { part: "data-slot=\"card\"", desc: "卡片根节点，承载边框、圆角、阴影、背景" },
  { part: "data-slot=\"card-header\"", desc: "头部分组容器，用网格布局自动安排标题/描述/操作区位置" },
  { part: "data-slot=\"card-title\" / \"card-description\"", desc: "标题与说明文字节点，承载字重和颜色语义" },
  { part: "data-slot=\"card-action\"", desc: "头部右上角操作区，依据网格定位规则自动靠右对齐" },
  { part: "data-slot=\"card-content\" / \"card-footer\"", desc: "主体内容区 / 底部区域，承载内边距规范" },
]

const cardDoDontRows = [
  { do: "用 CardHeader/CardTitle/CardContent 等子组件搭骨架。", dont: "在 Card 里直接堆 div + 手写间距类名。" },
  { do: "头部右上角操作放进 CardAction，让布局自动对齐。", dont: "用绝对定位把按钮怼到卡片右上角。" },
  { do: "次要说明文字用 CardDescription。", dont: "在 CardTitle 里塞一段长说明文字。" },
  { do: "卡片只承载内容容器职责，交互逻辑放在业务组件里。", dont: "把 Card 包装成带状态管理的黑盒业务组件。" },
]

const badgeAnchors = [
  { label: "组件总览", href: "#badge-overview" },
  { label: "场景示例", href: "#badge-preview" },
  { label: "使用方式", href: "#badge-usage" },
  { label: "API", href: "#badge-props" },
  { label: "语义 DOM", href: "#badge-semantic-dom" },
  { label: "正误示例", href: "#badge-do-dont" },
]

const badgeScenarioExamples = [
  {
    id: "status",
    title: "状态标记",
    intent: "在表格、列表里标记数据的当前状态。",
    rule: "成功态用 default，中性态用 secondary 或 outline，错误态用 destructive。",
    code: `<Badge>已支付</Badge>\n<Badge variant="secondary">处理中</Badge>\n<Badge variant="destructive">已失败</Badge>`,
  },
  {
    id: "count",
    title: "计数提示",
    intent: "展示未读数量、新增条目数等数字提示。",
    rule: "数字内容保持简短，避免在 Badge 里塞长文本。",
    code: `<Badge variant="outline">+12</Badge>`,
  },
  {
    id: "icon",
    title: "搭配图标",
    intent: "用图标强化语义，如校验通过、AI 生成标记。",
    rule: "图标放进 Badge 时用 data-icon 标记位置，不手写尺寸覆盖。",
    code: `<Badge variant="secondary">\n  <CheckCircleIcon data-icon="inline-start" />\n  已校验\n</Badge>`,
  },
]

const badgeVariantRows = [
  { variant: "default", usage: "强调态，强调中的主要状态（如已完成、已支付）" },
  { variant: "secondary", usage: "中性态，次要或过程态信息（如处理中、草稿）" },
  { variant: "destructive", usage: "错误/警示态（如已失败、已过期）" },
  { variant: "outline", usage: "弱化态，适合密集列表中的轻量标签" },
  { variant: "ghost", usage: "更弱化的标记，适合悬浮态、非重点信息" },
  { variant: "link", usage: "可点击跳转的轻量标签，外观接近链接" },
]

const badgePropRows = [
  { prop: "variant", type: "\"default\" | \"secondary\" | \"destructive\" | \"outline\" | \"ghost\" | \"link\"", defaultValue: "default", desc: "视觉强调级别，对应不同语义场景" },
  { prop: "render", type: "ReactElement", defaultValue: "—", desc: "自定义根节点渲染（如渲染成 <a> 实现可点击徽标）" },
  { prop: "className", type: "string", defaultValue: "—", desc: "在保留基础样式的前提下追加 Tailwind 类名" },
]

const badgeSemanticDomRows = [
  { part: "data-slot=\"badge\"", desc: "徽标根节点，承载圆角、内边距、背景与文字色" },
  { part: "data-icon=\"inline-start\" / \"inline-end\"", desc: "标记图标在文字前/后的位置，驱动间距样式" },
]

const badgeDoDontRows = [
  { do: "用 variant 表达语义级别（成功/中性/错误）。", dont: "用自定义颜色 className 表达状态语义。" },
  { do: "内容保持简短（状态词、数字、图标+短词）。", dont: "把长句子或多行说明塞进 Badge。" },
  { do: "图标用 data-icon 标记位置。", dont: "手写图标尺寸和间距覆盖默认布局。" },
]

const tooltipAnchors = [
  { label: "组件总览", href: "#tooltip-overview" },
  { label: "场景示例", href: "#tooltip-preview" },
  { label: "使用方式", href: "#tooltip-usage" },
  { label: "API", href: "#tooltip-props" },
  { label: "语义 DOM", href: "#tooltip-semantic-dom" },
  { label: "正误示例", href: "#tooltip-do-dont" },
]

const tooltipScenarioExamples = [
  {
    id: "icon-button",
    title: "纯图标按钮说明",
    intent: "为没有文字标签的图标按钮补充说明，弥补可访问性缺口。",
    rule: "纯图标按钮必须同时提供 aria-label 和 Tooltip，二者互补不互相替代。",
    code: `<Tooltip>\n  <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="设置" />}>\n    <SettingsIcon />\n  </TooltipTrigger>\n  <TooltipContent>设置</TooltipContent>\n</Tooltip>`,
  },
  {
    id: "truncated-text",
    title: "截断文本补全",
    intent: "表格、列表里文字被截断时，悬浮展示完整内容。",
    rule: "只在内容确实被截断时使用，不要给完整可见的文本套 Tooltip。",
    code: `<Tooltip>\n  <TooltipTrigger render={<span className="truncate">{fullName}</span>} />\n  <TooltipContent>{fullName}</TooltipContent>\n</Tooltip>`,
  },
  {
    id: "side",
    title: "自定义弹出方向",
    intent: "根据触发元素在页面中的位置调整提示弹出方向，避免被遮挡。",
    rule: "用 side 属性控制方向，不手写定位偏移。",
    code: `<TooltipContent side="right">更多说明</TooltipContent>`,
  },
]

const tooltipPropRows = [
  { prop: "TooltipProvider", type: "组件", defaultValue: "delay=0", desc: "全局提供者，统一控制一组 Tooltip 的延迟时间，通常包一层在应用根部" },
  { prop: "Tooltip", type: "组件", defaultValue: "—", desc: "根节点，管理开关状态" },
  { prop: "TooltipTrigger", type: "组件", defaultValue: "—", desc: "触发元素，常用 render 把已有元素（如 Button）作为触发器" },
  { prop: "side", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", defaultValue: "top", desc: "提示内容相对触发元素的弹出方向" },
  { prop: "sideOffset", type: "number", defaultValue: "4", desc: "提示内容与触发元素之间的间距（像素）" },
]

const tooltipSemanticDomRows = [
  { part: "data-slot=\"tooltip-trigger\"", desc: "触发元素节点，悬浮/聚焦时唤起提示" },
  { part: "data-slot=\"tooltip-content\"", desc: "提示气泡内容容器，承载背景、圆角、动效" },
  { part: "data-slot=\"tooltip-provider\"", desc: "提供者节点，统一管理一组 Tooltip 的显隐延迟" },
]

const tooltipDoDontRows = [
  { do: "为纯图标按钮、截断文本等缺信息场景补充说明。", dont: "给已经有完整可见文字的元素也套 Tooltip。" },
  { do: "内容保持简短的一句话说明。", dont: "把操作说明文档、长段落塞进 Tooltip。" },
  { do: "用 side / sideOffset 控制弹出方向避免遮挡。", dont: "手写绝对定位坐标来调整提示位置。" },
]

const dialogAnchors = [
  { label: "组件总览", href: "#dialog-overview" },
  { label: "场景示例", href: "#dialog-preview" },
  { label: "使用方式", href: "#dialog-usage" },
  { label: "API", href: "#dialog-props" },
  { label: "语义 DOM", href: "#dialog-semantic-dom" },
  { label: "正误示例", href: "#dialog-do-dont" },
]

const dialogScenarioExamples = [
  {
    id: "form",
    title: "表单弹窗",
    intent: "在不离开当前页面的情况下完成新建/编辑等结构化录入。",
    rule: "Footer 操作按钮顺序为「取消在左、主操作在右」，主操作用 default variant。",
    code: `<Dialog>\n  <DialogTrigger render={<Button>新建项目</Button>} />\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>新建项目</DialogTitle>\n      <DialogDescription>填写基本信息后即可创建</DialogDescription>\n    </DialogHeader>\n    <div className="grid gap-4 py-2">\n      <Input placeholder="项目名称" />\n    </div>\n    <DialogFooter>\n      <DialogClose render={<Button variant="outline">取消</Button>} />\n      <Button>创建</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`,
  },
  {
    id: "confirm",
    title: "确认弹窗",
    intent: "对有一定影响但非破坏性的操作进行二次确认。",
    rule: "标题用一句话讲清后果，避免堆砌长段说明。",
    code: `<DialogContent>\n  <DialogHeader>\n    <DialogTitle>确认发布该版本？</DialogTitle>\n    <DialogDescription>发布后用户将立即看到最新内容。</DialogDescription>\n  </DialogHeader>\n  <DialogFooter>\n    <DialogClose render={<Button variant="outline">再想想</Button>} />\n    <Button>确认发布</Button>\n  </DialogFooter>\n</DialogContent>`,
  },
]

const dialogPropRows = [
  { prop: "Dialog", type: "组件", defaultValue: "—", desc: "根节点，管理弹窗开关状态（受控用 open / onOpenChange）" },
  { prop: "DialogTrigger", type: "组件", defaultValue: "—", desc: "触发器，常用 render 把 Button 作为触发元素" },
  { prop: "DialogContent", type: "组件", defaultValue: "—", desc: "弹窗主体容器，自带遮罩、动效、关闭按钮" },
  { prop: "DialogHeader / DialogFooter", type: "组件", defaultValue: "—", desc: "头部（标题+描述）/ 底部操作区的布局分组" },
  { prop: "DialogTitle / DialogDescription", type: "组件", defaultValue: "—", desc: "标题与说明文字，提供无障碍语义关联" },
  { prop: "DialogClose", type: "组件", defaultValue: "—", desc: "关闭触发器，常用 render 包裹「取消」按钮" },
]

const dialogSemanticDomRows = [
  { part: "data-slot=\"dialog-overlay\"", desc: "遮罩层，承载半透明背景与淡入淡出动效" },
  { part: "data-slot=\"dialog-content\"", desc: "弹窗主体容器，承载圆角、阴影、缩放动效" },
  { part: "data-slot=\"dialog-title\" / \"dialog-description\"", desc: "标题与说明，通过 aria 属性与弹窗根节点关联" },
  { part: "data-slot=\"dialog-close\"", desc: "关闭触发器，点击后关闭弹窗并恢复焦点" },
]

const dialogDoDontRows = [
  { do: "用 DialogTitle / DialogDescription 提供无障碍语义。", dont: "在 DialogContent 里直接写 <h2>/<p> 替代它们。" },
  { do: "Footer 按钮「取消在左、主操作在右」。", dont: "把多个同等重要的操作平铺排列不分主次。" },
  { do: "只承载需要聚焦完成的单一任务。", dont: "在弹窗里嵌套另一个弹窗或塞入整页面的内容。" },
  { do: "用 DialogClose 包裹取消/关闭按钮。", dont: "手写 onClick 调用 setOpen(false) 来关闭。" },
]

const alertDialogAnchors = [
  { label: "组件总览", href: "#alert-dialog-overview" },
  { label: "场景示例", href: "#alert-dialog-preview" },
  { label: "使用方式", href: "#alert-dialog-usage" },
  { label: "API", href: "#alert-dialog-props" },
  { label: "语义 DOM", href: "#alert-dialog-semantic-dom" },
  { label: "正误示例", href: "#alert-dialog-do-dont" },
]

const alertDialogScenarioExamples = [
  {
    id: "destructive",
    title: "破坏性操作确认",
    intent: "删除、清空等不可逆操作前，强制用户二次确认。",
    rule: "必须由用户主动选择，不能点击遮罩或按 Esc 关闭；主操作用 destructive variant。",
    code: `<AlertDialog>\n  <AlertDialogTrigger render={<Button variant="destructive">删除项目</Button>} />\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>确认删除该项目？</AlertDialogTitle>\n      <AlertDialogDescription>删除后数据无法恢复，请谨慎操作。</AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel render={<Button variant="outline">取消</Button>} />\n      <AlertDialogAction render={<Button variant="destructive">确认删除</Button>} />\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`,
  },
  {
    id: "leave",
    title: "离开未保存提示",
    intent: "用户在有未保存改动时尝试离开页面/关闭弹窗，提醒可能丢失数据。",
    rule: "标题直接说明后果（“未保存的修改将丢失”），不绕弯子。",
    code: `<AlertDialogContent>\n  <AlertDialogHeader>\n    <AlertDialogTitle>放弃当前修改？</AlertDialogTitle>\n    <AlertDialogDescription>未保存的修改将会丢失。</AlertDialogDescription>\n  </AlertDialogHeader>\n  <AlertDialogFooter>\n    <AlertDialogCancel render={<Button variant="outline">继续编辑</Button>} />\n    <AlertDialogAction render={<Button variant="destructive">放弃修改</Button>} />\n  </AlertDialogFooter>\n</AlertDialogContent>`,
  },
]

const alertDialogPropRows = [
  { prop: "AlertDialog", type: "组件", defaultValue: "—", desc: "根节点，管理弹窗开关状态，默认不可通过遮罩/Esc 关闭" },
  { prop: "AlertDialogTrigger", type: "组件", defaultValue: "—", desc: "触发器，常用 render 把 Button 作为触发元素" },
  { prop: "AlertDialogContent", type: "组件", defaultValue: "—", desc: "弹窗主体容器，自带遮罩与动效，语义上标记为 alertdialog" },
  { prop: "AlertDialogAction", type: "组件", defaultValue: "—", desc: "确认/继续操作的触发器，通常搭配 destructive 或 default Button" },
  { prop: "AlertDialogCancel", type: "组件", defaultValue: "—", desc: "取消操作的触发器，点击后关闭弹窗且不执行后续动作" },
]

const alertDialogSemanticDomRows = [
  { part: "role=\"alertdialog\"", desc: "弹窗主体的无障碍角色，区别于普通 dialog，强调需要立即关注" },
  { part: "data-slot=\"alert-dialog-action\"", desc: "确认/继续操作触发器，承载主操作语义" },
  { part: "data-slot=\"alert-dialog-cancel\"", desc: "取消触发器，承载次要操作语义" },
  { part: "data-slot=\"alert-dialog-title\" / \"...-description\"", desc: "标题与说明，通过 aria 属性与弹窗根节点关联" },
]

const alertDialogDoDontRows = [
  { do: "只用于不可逆或有重大影响的操作确认。", dont: "把它当成普通信息提示弹窗滥用。" },
  { do: "标题一句话讲清后果，Description 补充细节。", dont: "把警示信息和操作步骤混写在标题里。" },
  { do: "破坏性主操作用 AlertDialogAction + destructive Button。", dont: "把取消和确认按钮做成视觉同等强调，让用户难以分辨主次。" },
  { do: "保持默认的强制确认行为（不可点遮罩关闭）。", dont: "额外加逻辑让用户能绕过确认直接关闭。" },
]

const sheetAnchors = [
  { label: "组件总览", href: "#sheet-overview" },
  { label: "场景示例", href: "#sheet-preview" },
  { label: "使用方式", href: "#sheet-usage" },
  { label: "API", href: "#sheet-props" },
  { label: "语义 DOM", href: "#sheet-semantic-dom" },
  { label: "正误示例", href: "#sheet-do-dont" },
]

const sheetScenarioExamples = [
  {
    id: "right-form",
    title: "右侧编辑面板",
    intent: "在不离开当前列表上下文的情况下查看/编辑一条记录的详情。",
    rule: "默认从右侧滑出（side=\"right\"），保持和列表的空间关系。",
    code: `<Sheet>\n  <SheetTrigger render={<Button variant="outline">编辑</Button>} />\n  <SheetContent side="right">\n    <SheetHeader>\n      <SheetTitle>编辑成员</SheetTitle>\n      <SheetDescription>修改信息后点击保存生效</SheetDescription>\n    </SheetHeader>\n    <div className="grid gap-4 px-4">\n      <Input placeholder="姓名" />\n    </div>\n    <SheetFooter>\n      <Button>保存</Button>\n      <SheetClose render={<Button variant="outline">取消</Button>} />\n    </SheetFooter>\n  </SheetContent>\n</Sheet>`,
  },
  {
    id: "bottom-actions",
    title: "底部操作面板",
    intent: "移动端常见的底部弹出操作列表，承载一组相关操作。",
    rule: "用 side=\"bottom\"，操作项保持简短并按重要性排序。",
    code: `<SheetContent side="bottom">\n  <SheetHeader>\n    <SheetTitle>更多操作</SheetTitle>\n  </SheetHeader>\n  <div className="flex flex-col gap-2 px-4 pb-4">\n    <Button variant="outline">分享</Button>\n    <Button variant="outline">归档</Button>\n    <Button variant="destructive">删除</Button>\n  </div>\n</SheetContent>`,
  },
]

const sheetPropRows = [
  { prop: "Sheet", type: "组件", defaultValue: "—", desc: "根节点，管理面板开关状态" },
  { prop: "SheetTrigger", type: "组件", defaultValue: "—", desc: "触发器，常用 render 把 Button 作为触发元素" },
  { prop: "SheetContent", type: "组件", defaultValue: "—", desc: "面板主体容器，自带遮罩与滑入/滑出动效" },
  { prop: "side", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", defaultValue: "right", desc: "面板从屏幕哪一侧滑出" },
  { prop: "SheetHeader / SheetFooter", type: "组件", defaultValue: "—", desc: "头部（标题+描述）/ 底部操作区的布局分组" },
  { prop: "SheetClose", type: "组件", defaultValue: "—", desc: "关闭触发器，常用 render 包裹「取消」按钮" },
]

const sheetSemanticDomRows = [
  { part: "data-slot=\"sheet-overlay\"", desc: "遮罩层，承载半透明背景与淡入淡出动效" },
  { part: "data-slot=\"sheet-content\"", desc: "面板主体容器，依据 side 承载对应方向的滑入动效" },
  { part: "data-slot=\"sheet-title\" / \"sheet-description\"", desc: "标题与说明，通过 aria 属性与面板根节点关联" },
  { part: "data-slot=\"sheet-close\"", desc: "关闭触发器，点击后关闭面板并恢复焦点" },
]

const sheetDoDontRows = [
  { do: "用于不离开当前上下文的查看/编辑/操作场景。", dont: "把它当成独立页面使用，塞入与列表无关的大量内容。" },
  { do: "依据使用习惯选择 side（详情用 right，操作用 bottom）。", dont: "随意选择滑出方向，造成跨页面体验不一致。" },
  { do: "用 SheetClose 包裹取消/关闭按钮。", dont: "手写 onClick 调用 setOpen(false) 来关闭。" },
  { do: "内容较多时让 SheetContent 内部自行滚动。", dont: "把面板撑到超出可视区域导致整页滚动错位。" },
]

const skeletonAnchors = [
  { label: "组件总览", href: "#skeleton-overview" },
  { label: "场景示例", href: "#skeleton-preview" },
  { label: "使用方式", href: "#skeleton-usage" },
  { label: "API", href: "#skeleton-props" },
  { label: "语义 DOM", href: "#skeleton-semantic-dom" },
  { label: "正误示例", href: "#skeleton-do-dont" },
]

const skeletonScenarioExamples = [
  {
    id: "text-lines",
    title: "文本占位",
    intent: "在文本内容加载完成前，用占位条提示用户内容即将出现。",
    rule: "宽度参差体现真实文本的不规则感，行间距与正文一致。",
    code: `<div className="flex flex-col gap-2">\n  <Skeleton className="h-4 w-[240px]" />\n  <Skeleton className="h-4 w-[180px]" />\n</div>`,
  },
  {
    id: "card-media",
    title: "卡片占位",
    intent: "在头像、图片等媒体型卡片加载前，组合圆形与矩形占位还原结构。",
    rule: "圆形用于头像，矩形用于文本行，整体比例尽量贴近真实内容。",
    code: `<div className="flex items-center gap-4">\n  <Skeleton className="size-12 rounded-full" />\n  <div className="flex flex-col gap-2">\n    <Skeleton className="h-4 w-[160px]" />\n    <Skeleton className="h-4 w-[120px]" />\n  </div>\n</div>`,
  },
]

const skeletonPropRows = [
  { prop: "Skeleton", type: "React.ComponentProps<\"div\">", defaultValue: "—", desc: "本质是一个带 animate-pulse 动效的 div，通过 className 控制宽高、形状。" },
  { prop: "className", type: "string", defaultValue: "—", desc: "用于设置宽度、高度、圆角（如 rounded-full 做头像占位）。" },
]

const skeletonSemanticDomRows = [
  { part: "[data-slot=\"skeleton\"]", desc: "占位元素本体，自带 animate-pulse 呼吸动画与 bg-muted 底色。" },
]

const skeletonDoDontRows = [
  { do: "按真实内容的结构和比例摆放占位块。", dont: "用一整块大灰条糊弄所有内容类型。" },
  { do: "加载完成后立刻替换为真实内容，避免占位停留过久。", dont: "让骨架屏长时间展示，给用户「卡住了」的错觉。" },
  { do: "圆形头像用 rounded-full，文本行用矩形条。", dont: "所有占位形状一致，无法预期真实布局。" },
]

const avatarAnchors = [
  { label: "组件总览", href: "#avatar-overview" },
  { label: "场景示例", href: "#avatar-preview" },
  { label: "使用方式", href: "#avatar-usage" },
  { label: "API", href: "#avatar-props" },
  { label: "语义 DOM", href: "#avatar-semantic-dom" },
  { label: "正误示例", href: "#avatar-do-dont" },
]
const avatarScenarioExamples = [
  {
    id: "single",
    title: "单头像",
    intent: "展示单个用户身份，图片加载失败时回退到文字缩写。",
    rule: "AvatarFallback 用姓名首字母或图标兜底，避免空白占位。",
    code: `<Avatar>\n  <AvatarImage src="/avatars/01.png" alt="张三" />\n  <AvatarFallback>张</AvatarFallback>\n</Avatar>`,
  },
  {
    id: "group",
    title: "头像组",
    intent: "在评论区、协作者列表等场景里堆叠展示多个用户。",
    rule: "用 AvatarGroup 控制重叠间距，超出数量用 AvatarGroupCount 折叠显示。",
    code: `<AvatarGroup>\n  <Avatar><AvatarFallback>A</AvatarFallback></Avatar>\n  <Avatar><AvatarFallback>B</AvatarFallback></Avatar>\n  <AvatarGroupCount>+3</AvatarGroupCount>\n</AvatarGroup>`,
  },
]
const avatarPropRows = [
  { prop: "Avatar", type: "size?: \"default\" | \"sm\" | \"lg\"", defaultValue: "\"default\"", desc: "头像容器，size 控制整体尺寸（影响子元素的联动样式）。" },
  { prop: "AvatarImage", type: "AvatarPrimitive.Image.Props", defaultValue: "—", desc: "实际图片，加载失败时自动让出位置给 AvatarFallback。" },
  { prop: "AvatarFallback", type: "AvatarPrimitive.Fallback.Props", defaultValue: "—", desc: "图片缺省时的兜底内容，常用姓名缩写或图标。" },
  { prop: "AvatarBadge", type: "React.ComponentProps<\"span\">", defaultValue: "—", desc: "叠加在右下角的状态点（如在线状态），随 size 自动缩放。" },
  { prop: "AvatarGroup / AvatarGroupCount", type: "React.ComponentProps<\"div\">", defaultValue: "—", desc: "头像组容器与“+N”计数占位，用于堆叠展示多个用户。" },
]
const avatarSemanticDomRows = [
  { part: "[data-slot=\"avatar\"][data-size]", desc: "头像容器，data-size 标记当前尺寸档位（default/sm/lg）。" },
  { part: "[data-slot=\"avatar-image\"] / [data-slot=\"avatar-fallback\"]", desc: "图片与兜底内容，二者互斥展示。" },
  { part: "[data-slot=\"avatar-badge\"]", desc: "右下角状态徽标，常用于标记在线/离线。" },
  { part: "[data-slot=\"avatar-group\"] / [data-slot=\"avatar-group-count\"]", desc: "头像组容器与折叠计数占位。" },
]
const avatarDoDontRows = [
  { do: "始终提供 AvatarFallback 兜底内容。", dont: "只放 AvatarImage，图裂时显示空白圆圈。" },
  { do: "用首字母缩写（1-2 个字）做兜底文案。", dont: "塞入完整姓名导致文字溢出圆形容器。" },
  { do: "头像组按真实数量折叠，超出部分用 AvatarGroupCount。", dont: "无限堆叠头像，挤占横向空间。" },
]

const breadcrumbAnchors = [
  { label: "组件总览", href: "#breadcrumb-overview" },
  { label: "场景示例", href: "#breadcrumb-preview" },
  { label: "使用方式", href: "#breadcrumb-usage" },
  { label: "API", href: "#breadcrumb-props" },
  { label: "语义 DOM", href: "#breadcrumb-semantic-dom" },
  { label: "正误示例", href: "#breadcrumb-do-dont" },
]
const breadcrumbScenarioExamples = [
  {
    id: "basic",
    title: "基础路径",
    intent: "展示当前页面在层级结构中的位置，支持逐级返回。",
    rule: "最后一级用 BreadcrumbPage 标记当前页，不可点击。",
    code: `<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`,
  },
  {
    id: "collapsed",
    title: "折叠中间层级",
    intent: "层级过深时用省略号收起中间项，保留首尾关键节点。",
    rule: "用 BreadcrumbEllipsis 收起，不要让路径换行挤占页面头部。",
    code: `<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`,
  },
]
const breadcrumbPropRows = [
  { prop: "Breadcrumb", type: "React.ComponentProps<\"nav\">", defaultValue: "—", desc: "根容器，自带 aria-label=\"breadcrumb\"。" },
  { prop: "BreadcrumbList / BreadcrumbItem", type: "React.ComponentProps<\"ol\"> / <\"li\">", defaultValue: "—", desc: "列表与列表项，负责排版与间距。" },
  { prop: "BreadcrumbLink", type: "render?: ReactElement", defaultValue: "—", desc: "可点击的层级链接，支持 render 自定义底层标签。" },
  { prop: "BreadcrumbPage", type: "React.ComponentProps<\"span\">", defaultValue: "—", desc: "当前页标记，自动加 aria-current=\"page\"，不可点击。" },
  { prop: "BreadcrumbSeparator / BreadcrumbEllipsis", type: "React.ComponentProps<\"li\"> / <\"span\">", defaultValue: "—", desc: "分隔符（默认箭头图标）与省略号折叠占位。" },
]
const breadcrumbSemanticDomRows = [
  { part: "[data-slot=\"breadcrumb\"]", desc: "根 nav，带 aria-label=\"breadcrumb\" 供屏幕阅读器识别。" },
  { part: "[data-slot=\"breadcrumb-link\"] / [data-slot=\"breadcrumb-page\"]", desc: "可点击链接与当前页标记，后者带 aria-current。" },
  { part: "[data-slot=\"breadcrumb-separator\"] / [data-slot=\"breadcrumb-ellipsis\"]", desc: "分隔符与折叠占位，均带 aria-hidden。" },
]
const breadcrumbDoDontRows = [
  { do: "最后一级用 BreadcrumbPage，标记为当前页且不可点击。", dont: "把当前页也做成可点击链接，造成无意义跳转。" },
  { do: "层级超过 4 级时折叠中间项。", dont: "把所有层级平铺，导致面包屑换行挤占页头。" },
  { do: "链接文案用页面真实名称。", dont: "用 ID 或英文 slug 当文案，用户看不懂。" },
]

const buttonGroupAnchors = [
  { label: "组件总览", href: "#button-group-overview" },
  { label: "场景示例", href: "#button-group-preview" },
  { label: "使用方式", href: "#button-group-usage" },
  { label: "API", href: "#button-group-props" },
  { label: "语义 DOM", href: "#button-group-semantic-dom" },
  { label: "正误示例", href: "#button-group-do-dont" },
]
const buttonGroupScenarioExamples = [
  {
    id: "split",
    title: "操作组合",
    intent: "把强相关的多个操作按钮合并为一组，弱化彼此边界。",
    rule: "组内按钮 variant 保持一致，避免主次操作混在一起。",
    code: `<ButtonGroup>\n  <Button variant="outline">复制</Button>\n  <Button variant="outline">分享</Button>\n  <Button variant="outline">归档</Button>\n</ButtonGroup>`,
  },
  {
    id: "with-text",
    title: "带文案标签",
    intent: "用 ButtonGroupText 在按钮组里插入说明性文案或图标。",
    rule: "文案块仅作辅助说明，不承载点击交互。",
    code: `<ButtonGroup>\n  <ButtonGroupText>排序</ButtonGroupText>\n  <ButtonGroupSeparator />\n  <Button variant="outline">最新</Button>\n  <Button variant="outline">最热</Button>\n</ButtonGroup>`,
  },
]
const buttonGroupPropRows = [
  { prop: "ButtonGroup", type: "orientation?: \"horizontal\" | \"vertical\"", defaultValue: "\"horizontal\"", desc: "按钮组容器，自动合并相邻按钮的圆角与边框。" },
  { prop: "ButtonGroupText", type: "render?: ReactElement", defaultValue: "—", desc: "插入说明性文案/图标的占位块，非交互元素。" },
  { prop: "ButtonGroupSeparator", type: "orientation?: \"horizontal\" | \"vertical\"", defaultValue: "\"vertical\"", desc: "组内分隔线，复用 Separator 并自适应方向。" },
]
const buttonGroupSemanticDomRows = [
  { part: "[data-slot=\"button-group\"][data-orientation]", desc: "按钮组容器，data-orientation 标记排列方向。" },
  { part: "[data-slot=\"button-group-text\"]", desc: "组内说明性文案/图标占位块。" },
  { part: "[data-slot=\"button-group-separator\"]", desc: "组内分隔线。" },
]
const buttonGroupDoDontRows = [
  { do: "把强相关、同级的操作放进同一组。", dont: "把主操作和危险操作（如删除）合并到一组里。" },
  { do: "组内按钮统一用 outline 或 ghost 弱化样式。", dont: "组内混用 default/destructive 等强对比样式。" },
  { do: "组合超过 4 个按钮时考虑改用下拉菜单。", dont: "把工具栏所有按钮塞进一个组，造成视觉拥挤。" },
]

const calendarAnchors = [
  { label: "组件总览", href: "#calendar-overview" },
  { label: "场景示例", href: "#calendar-preview" },
  { label: "使用方式", href: "#calendar-usage" },
  { label: "API", href: "#calendar-props" },
  { label: "语义 DOM", href: "#calendar-semantic-dom" },
  { label: "正误示例", href: "#calendar-do-dont" },
]
const calendarScenarioExamples = [
  {
    id: "single",
    title: "单日选择",
    intent: "用于筛选、表单中选择某一天的场景。",
    rule: "selected 受控时务必同步提供 onSelect 回调。",
    code: `const [date, setDate] = useState<Date>()\n\n<Calendar mode="single" selected={date} onSelect={setDate} />`,
  },
  {
    id: "in-popover",
    title: "嵌入弹层中使用",
    intent: "把日历放进 Popover，搭配输入框做日期选择器。",
    rule: "弹层宽度需容纳完整日历，避免月份切换时跳动。",
    code: `<Popover>\n  <PopoverTrigger render={<Button variant="outline">选择日期</Button>} />\n  <PopoverContent className="w-auto p-0">\n    <Calendar mode="single" selected={date} onSelect={setDate} />\n  </PopoverContent>\n</Popover>`,
  },
]
const calendarPropRows = [
  { prop: "mode", type: "\"single\" | \"multiple\" | \"range\"", defaultValue: "—", desc: "选择模式：单日 / 多日 / 区间，决定 selected 的数据形状。" },
  { prop: "selected / onSelect", type: "Date | Date[] | DateRange", defaultValue: "—", desc: "受控选中值与变更回调，需配合 mode 使用。" },
  { prop: "captionLayout", type: "\"label\" | \"dropdown\"", defaultValue: "\"label\"", desc: "月份标题展示方式：纯文本或可切换的下拉选择。" },
  { prop: "buttonVariant", type: "ButtonProps[\"variant\"]", defaultValue: "\"ghost\"", desc: "上一月/下一月导航按钮的视觉样式。" },
  { prop: "showOutsideDays", type: "boolean", defaultValue: "true", desc: "是否显示当月之外的相邻月份日期。" },
]
const calendarSemanticDomRows = [
  { part: "[data-slot=\"calendar\"]", desc: "日历根容器（基于 react-day-picker 渲染）。" },
  { part: "[data-selected-single] / [data-range-start] / [data-range-end] / [data-range-middle]", desc: "日期格子上的选中状态标记，驱动高亮样式。" },
  { part: "[data-day]", desc: "日期按钮，携带本地化后的日期字符串，便于测试定位。" },
]
const calendarDoDontRows = [
  { do: "明确告知用户当前选择模式（单日/区间）。", dont: "默认进入区间模式却不给出任何视觉提示。" },
  { do: "嵌入 Popover 时用 className=\"w-auto p-0\" 让日历撑满弹层。", dont: "保留 Popover 默认的内边距和固定宽度，导致日历被裁切。" },
  { do: "搭配输入框展示已选日期的格式化文本。", dont: "选完日期后界面没有任何反馈，用户不确定是否选中。" },
]

const collapsibleAnchors = [
  { label: "组件总览", href: "#collapsible-overview" },
  { label: "场景示例", href: "#collapsible-preview" },
  { label: "使用方式", href: "#collapsible-usage" },
  { label: "API", href: "#collapsible-props" },
  { label: "语义 DOM", href: "#collapsible-semantic-dom" },
  { label: "正误示例", href: "#collapsible-do-dont" },
]
const collapsibleScenarioExamples = [
  {
    id: "panel",
    title: "折叠面板",
    intent: "默认收起次要信息，点击触发器展开查看详情。",
    rule: "触发器要有明确的展开/收起视觉反馈（如箭头旋转）。",
    code: `<Collapsible>\n  <CollapsibleTrigger render={<Button variant="ghost">查看更多 <ChevronDownIcon /></Button>} />\n  <CollapsibleContent>\n    <p className="text-sm text-muted-foreground">这里是展开后的详细内容。</p>\n  </CollapsibleContent>\n</Collapsible>`,
  },
  {
    id: "list-group",
    title: "分组列表收纳",
    intent: "在长列表中按分组折叠，减少初始信息量。",
    rule: "分组标题本身即触发器，避免额外增加按钮造成歧义。",
    code: `<Collapsible defaultOpen>\n  <CollapsibleTrigger render={<button className="text-sm font-medium">基础组件（12）</button>} />\n  <CollapsibleContent className="flex flex-col gap-1 pt-2 text-sm text-muted-foreground">\n    <span>Button</span>\n    <span>Input</span>\n  </CollapsibleContent>\n</Collapsible>`,
  },
]
const collapsiblePropRows = [
  { prop: "Collapsible", type: "open? / defaultOpen? / onOpenChange?", defaultValue: "—", desc: "根节点，可受控也可非受控管理展开状态。" },
  { prop: "CollapsibleTrigger", type: "render?: ReactElement", defaultValue: "—", desc: "触发展开/收起的元素，常用 render 包裹按钮或自定义标签。" },
  { prop: "CollapsibleContent", type: "React.ComponentProps<\"div\">", defaultValue: "—", desc: "可折叠的内容面板，收起时通过动画收起高度。" },
]
const collapsibleSemanticDomRows = [
  { part: "[data-slot=\"collapsible\"]", desc: "根容器，承载展开/收起状态。" },
  { part: "[data-slot=\"collapsible-trigger\"]", desc: "触发器，自动同步 aria-expanded。" },
  { part: "[data-slot=\"collapsible-content\"]", desc: "内容面板，收起时高度收起为 0 并隐藏。" },
]
const collapsibleDoDontRows = [
  { do: "用箭头旋转或文案变化提示当前展开状态。", dont: "收起和展开时触发器外观完全一致，用户分不清状态。" },
  { do: "默认收起非核心信息，保持页面简洁。", dont: "把关键操作或必读信息也藏进折叠面板里。" },
  { do: "折叠内容较长时允许内部滚动。", dont: "展开后内容把页面撑得很长，找不到收起按钮。" },
]

const dropdownMenuAnchors = [
  { label: "组件总览", href: "#dropdown-menu-overview" },
  { label: "场景示例", href: "#dropdown-menu-preview" },
  { label: "使用方式", href: "#dropdown-menu-usage" },
  { label: "API", href: "#dropdown-menu-props" },
  { label: "语义 DOM", href: "#dropdown-menu-semantic-dom" },
  { label: "正误示例", href: "#dropdown-menu-do-dont" },
]
const dropdownMenuScenarioExamples = [
  {
    id: "actions",
    title: "操作菜单",
    intent: "在表格行、卡片右上角等位置收纳次级操作。",
    rule: "危险操作（如删除）用 variant=\"destructive\" 区分，并放在分组末尾。",
    code: `<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="ghost" size="icon">⋯</Button>} />\n  <DropdownMenuContent>\n    <DropdownMenuItem>编辑</DropdownMenuItem>\n    <DropdownMenuItem>复制</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`,
  },
  {
    id: "user-menu",
    title: "用户菜单",
    intent: "导航栏头像点击后展示账户相关的快捷入口。",
    rule: "用 DropdownMenuLabel 和 Separator 区分账户信息与操作分组。",
    code: `<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="ghost" size="icon"><UserIcon /></Button>} />\n  <DropdownMenuContent>\n    <DropdownMenuLabel>我的账户</DropdownMenuLabel>\n    <DropdownMenuSeparator />\n    <DropdownMenuGroup>\n      <DropdownMenuItem>个人设置 <DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>\n      <DropdownMenuItem>账单 <DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>\n    </DropdownMenuGroup>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem variant="destructive">退出登录</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`,
  },
]
const dropdownMenuPropRows = [
  { prop: "DropdownMenu / DropdownMenuTrigger", type: "MenuPrimitive.Root.Props / Trigger.Props", defaultValue: "—", desc: "根节点与触发器，常用 render 包裹 Button 自定义外观。" },
  { prop: "DropdownMenuContent", type: "side? / align? / sideOffset?", defaultValue: "side=\"bottom\" align=\"start\"", desc: "菜单弹层，定位 props 决定弹出方向与对齐方式。" },
  { prop: "DropdownMenuItem", type: "variant?: \"default\" | \"destructive\" / inset?", defaultValue: "\"default\"", desc: "菜单项，destructive 用于危险操作的视觉强调。" },
  { prop: "DropdownMenuLabel / DropdownMenuSeparator", type: "—", defaultValue: "—", desc: "分组标题与分隔线，用于组织菜单结构。" },
  { prop: "DropdownMenuShortcut", type: "React.ComponentProps<\"span\">", defaultValue: "—", desc: "靠右展示的快捷键提示文案。" },
  { prop: "DropdownMenuCheckboxItem / RadioGroup / RadioItem", type: "checked? / value?", defaultValue: "—", desc: "复选 / 单选型菜单项，用于菜单内的状态切换。" },
]
const dropdownMenuSemanticDomRows = [
  { part: "[data-slot=\"dropdown-menu-trigger\"]", desc: "触发器，自动同步 aria-expanded / aria-haspopup。" },
  { part: "[data-slot=\"dropdown-menu-content\"]", desc: "菜单弹层容器，定位与动画都挂载在此。" },
  { part: "[data-slot=\"dropdown-menu-item\"][data-variant]", desc: "菜单项，data-variant 区分默认与危险操作样式。" },
  { part: "[data-slot=\"dropdown-menu-separator\"] / [data-slot=\"dropdown-menu-label\"]", desc: "分隔线与分组标题，组织菜单内部结构。" },
]
const dropdownMenuDoDontRows = [
  { do: "把危险操作放在末尾并用 destructive 变体区分。", dont: "把删除按钮和普通操作并排放置，容易误触。" },
  { do: "用 Separator 和 Label 给菜单项分组。", dont: "把十几个操作平铺成一长串列表，找不到重点。" },
  { do: "为常用操作标注快捷键（DropdownMenuShortcut）。", dont: "重要的快捷键信息只放在帮助文档里，菜单上不可见。" },
]

const popoverAnchors = [
  { label: "组件总览", href: "#popover-overview" },
  { label: "场景示例", href: "#popover-preview" },
  { label: "使用方式", href: "#popover-usage" },
  { label: "API", href: "#popover-props" },
  { label: "语义 DOM", href: "#popover-semantic-dom" },
  { label: "正误示例", href: "#popover-do-dont" },
]
const popoverScenarioExamples = [
  {
    id: "info",
    title: "信息说明卡",
    intent: "点击图标展示一段补充说明，不打断当前操作流程。",
    rule: "内容应简短聚焦，复杂表单类交互优先考虑 Dialog/Sheet。",
    code: `<Popover>\n  <PopoverTrigger render={<Button variant="ghost" size="icon">?</Button>} />\n  <PopoverContent>\n    <PopoverHeader>\n      <PopoverTitle>什么是工作区？</PopoverTitle>\n      <PopoverDescription>工作区是团队协作的基本单位，可包含多个项目。</PopoverDescription>\n    </PopoverHeader>\n  </PopoverContent>\n</Popover>`,
  },
  {
    id: "quick-edit",
    title: "快捷编辑",
    intent: "在不离开当前页面的情况下，快速修改某一项设置。",
    rule: "弹层内表单要短小，操作完成后应自动关闭或给出反馈。",
    code: `<Popover>\n  <PopoverTrigger render={<Button variant="outline" size="sm">设置别名</Button>} />\n  <PopoverContent className="flex flex-col gap-2.5">\n    <Input placeholder="输入别名" />\n    <Button size="sm">保存</Button>\n  </PopoverContent>\n</Popover>`,
  },
]
const popoverPropRows = [
  { prop: "Popover / PopoverTrigger", type: "PopoverPrimitive.Root.Props / Trigger.Props", defaultValue: "—", desc: "根节点与触发器，常用 render 包裹按钮自定义外观。" },
  { prop: "PopoverContent", type: "side? / align? / sideOffset?", defaultValue: "side=\"bottom\" align=\"center\"", desc: "弹层容器，定位 props 决定弹出方向与对齐方式。" },
  { prop: "PopoverHeader / PopoverTitle / PopoverDescription", type: "—", defaultValue: "—", desc: "弹层内的标题区结构，统一信息层级。" },
]
const popoverSemanticDomRows = [
  { part: "[data-slot=\"popover-trigger\"]", desc: "触发器，自动同步 aria-expanded。" },
  { part: "[data-slot=\"popover-content\"]", desc: "弹层容器，宽度默认 18rem（w-72）。" },
  { part: "[data-slot=\"popover-title\"] / [data-slot=\"popover-description\"]", desc: "标题与描述，构成弹层内的信息层级。" },
]
const popoverDoDontRows = [
  { do: "用于轻量的信息说明或单字段快捷编辑。", dont: "把多步骤表单塞进 Popover，应该用 Dialog 或 Sheet。" },
  { do: "保持内容简短，一屏可读完。", dont: "弹层内容超长导致需要内部滚动甚至遮挡触发元素。" },
  { do: "信息类用途搭配 PopoverTitle/Description 统一结构。", dont: "随意堆砌文本，没有标题和描述的层级区分。" },
]

const separatorAnchors = [
  { label: "组件总览", href: "#separator-overview" },
  { label: "场景示例", href: "#separator-preview" },
  { label: "使用方式", href: "#separator-usage" },
  { label: "API", href: "#separator-props" },
  { label: "语义 DOM", href: "#separator-semantic-dom" },
  { label: "正误示例", href: "#separator-do-dont" },
]
const separatorScenarioExamples = [
  {
    id: "horizontal",
    title: "水平分隔",
    intent: "区隔上下两块内容，常见于列表项之间、卡片分区。",
    rule: "搭配上下间距使用，避免分隔线紧贴内容造成拥挤。",
    code: `<div className="flex flex-col gap-4">\n  <p className="text-sm">第一段内容</p>\n  <Separator />\n  <p className="text-sm">第二段内容</p>\n</div>`,
  },
  {
    id: "vertical",
    title: "垂直分隔",
    intent: "在工具栏、面包屑等横向排列的元素之间做轻量分隔。",
    rule: "需要给父容器一个明确的高度，分隔线才能正确撑开。",
    code: `<div className="flex h-5 items-center gap-3 text-sm">\n  <span>编辑</span>\n  <Separator orientation="vertical" />\n  <span>分享</span>\n  <Separator orientation="vertical" />\n  <span>删除</span>\n</div>`,
  },
]
const separatorPropRows = [
  { prop: "orientation", type: "\"horizontal\" | \"vertical\"", defaultValue: "\"horizontal\"", desc: "分隔方向；垂直方向需要父容器提供明确高度。" },
  { prop: "decorative", type: "boolean", defaultValue: "true", desc: "是否仅作装饰（不参与无障碍语义），纯视觉分隔保持默认值即可。" },
]
const separatorSemanticDomRows = [
  { part: "[data-slot=\"separator\"][data-orientation]", desc: "分隔线本体，data-orientation 标记当前方向并驱动尺寸样式。" },
]
const separatorDoDontRows = [
  { do: "用它分隔弱关联的内容区块。", dont: "在每一行文字之间都加分隔线，制造视觉噪音。" },
  { do: "垂直分隔时确保父容器有固定高度（如 h-5）。", dont: "不设置高度直接使用，导致分隔线塌陷不可见。" },
  { do: "分隔线与内容之间留出呼吸间距。", dont: "让分隔线紧贴文字，看起来像下划线。" },
]

const sidebarAnchors = [
  { label: "组件总览", href: "#sidebar-overview" },
  { label: "场景示例", href: "#sidebar-preview" },
  { label: "使用方式", href: "#sidebar-usage" },
  { label: "API", href: "#sidebar-props" },
  { label: "语义 DOM", href: "#sidebar-semantic-dom" },
  { label: "正误示例", href: "#sidebar-do-dont" },
]
const sidebarScenarioExamples = [
  {
    id: "nav-groups",
    title: "分组导航",
    intent: "把功能模块按分组组织，是后台类产品最常见的主导航形态。",
    rule: "分组标题简短明确，单个分组内菜单项不宜过多（建议 ≤ 6 项）。",
    code: `<SidebarGroup>\n  <SidebarGroupLabel>工作台</SidebarGroupLabel>\n  <SidebarGroupContent>\n    <SidebarMenu>\n      <SidebarMenuItem>\n        <SidebarMenuButton><HomeIcon /> 概览</SidebarMenuButton>\n      </SidebarMenuItem>\n    </SidebarMenu>\n  </SidebarGroupContent>\n</SidebarGroup>`,
  },
  {
    id: "active-item",
    title: "当前项高亮",
    intent: "明确标记用户当前所在的菜单项，辅助定位。",
    rule: "isActive 应与路由状态保持同步，避免出现“高亮但内容不对应”。",
    code: `<SidebarMenuButton isActive>\n  <FolderIcon />\n  项目列表\n</SidebarMenuButton>`,
  },
]
const sidebarPropRows = [
  { prop: "SidebarProvider", type: "open? / onOpenChange? / defaultOpen?", defaultValue: "defaultOpen=true", desc: "提供折叠状态上下文，必须包裹在 Sidebar 外层（含移动端逻辑）。" },
  { prop: "Sidebar", type: "side? / variant? / collapsible?", defaultValue: "side=\"left\" variant=\"sidebar\" collapsible=\"offcanvas\"", desc: "侧边栏根容器，collapsible=\"none\" 时退化为普通固定面板。" },
  { prop: "SidebarHeader / SidebarContent / SidebarFooter", type: "React.ComponentProps<\"div\">", defaultValue: "—", desc: "侧边栏的头部、主体、底部分区。" },
  { prop: "SidebarGroup / SidebarGroupLabel / SidebarGroupContent", type: "—", defaultValue: "—", desc: "菜单分组容器、分组标题与分组内容区。" },
  { prop: "SidebarMenu / SidebarMenuItem / SidebarMenuButton", type: "isActive? / size?", defaultValue: "—", desc: "菜单列表、菜单项与可点击按钮，isActive 标记当前选中项。" },
  { prop: "SidebarTrigger", type: "React.ComponentProps<\"button\">", defaultValue: "—", desc: "折叠/展开侧边栏的触发按钮，通常放在页面头部。" },
]
const sidebarSemanticDomRows = [
  { part: "[data-slot=\"sidebar\"][data-state][data-collapsible]", desc: "侧边栏根节点，data-state 标记展开/折叠，驱动布局动画。" },
  { part: "[data-slot=\"sidebar-menu-button\"][data-active]", desc: "菜单按钮，data-active 标记当前选中项。" },
  { part: "[data-slot=\"sidebar-group-label\"] / [data-slot=\"sidebar-group-content\"]", desc: "分组标题与分组内容区，组织菜单层级结构。" },
  { part: "[data-slot=\"sidebar-trigger\"]", desc: "折叠触发按钮，绑定快捷键 Cmd/Ctrl+B。" },
]
const sidebarDoDontRows = [
  { do: "用 SidebarProvider 统一管理展开/折叠状态，并持久化用户偏好。", dont: "在多个地方各自维护一份折叠状态，导致刷新后状态不一致。" },
  { do: "用 isActive 与当前路由强绑定来高亮菜单项。", dont: "高亮状态和实际页面内容对不上，用户会怀疑导航是否生效。" },
  { do: "分组数量和每组菜单项数量保持克制。", dont: "把所有功能塞进一个侧边栏，造成超长滚动列表。" },
]

const spinnerAnchors = [
  { label: "组件总览", href: "#spinner-overview" },
  { label: "场景示例", href: "#spinner-preview" },
  { label: "使用方式", href: "#spinner-usage" },
  { label: "API", href: "#spinner-props" },
  { label: "语义 DOM", href: "#spinner-semantic-dom" },
  { label: "正误示例", href: "#spinner-do-dont" },
]
const spinnerScenarioExamples = [
  {
    id: "inline",
    title: "按钮内联loading",
    intent: "提交表单等待响应期间，在按钮内提示正在处理。",
    rule: "loading 时应同步禁用按钮，避免重复提交。",
    code: `<Button disabled>\n  <Spinner className="mr-1.5" />\n  提交中…\n</Button>`,
  },
  {
    id: "block",
    title: "区块级加载",
    intent: "整块内容尚未就绪时，在容器中央显示加载状态。",
    rule: "搭配简短文案说明正在加载什么，避免用户长时间等待时焦虑。",
    code: `<div className="flex flex-col items-center justify-center gap-2 py-10 text-sm text-muted-foreground">\n  <Spinner className="size-6" />\n  正在加载数据…\n</div>`,
  },
]
const spinnerPropRows = [
  { prop: "Spinner", type: "React.ComponentProps<\"svg\">", defaultValue: "—", desc: "本质是一个带 animate-spin 的图标（Loader2Icon），通过 className 控制大小颜色。" },
  { prop: "className", type: "string", defaultValue: "size-4", desc: "控制图标尺寸；放进按钮或文本行内时常配合 mr-1.5 等间距类。" },
]
const spinnerSemanticDomRows = [
  { part: "svg[role=\"status\"][aria-label=\"Loading\"]", desc: "Spinner 本体即一个带无障碍语义的旋转图标，无需额外包裹容器。" },
]
const spinnerDoDontRows = [
  { do: "loading 期间禁用触发按钮，防止重复提交。", dont: "按钮可继续点击，导致同一请求被触发多次。" },
  { do: "区块级加载搭配简短说明文案。", dont: "页面中央孤零零转一个圈，用户不知道在等什么。" },
  { do: "用 className 调整尺寸以匹配上下文（按钮内用小尺寸）。", dont: "所有场景都用同一个尺寸，按钮里显得过大或过小。" },
]

const tabsAnchors = [
  { label: "组件总览", href: "#tabs-overview" },
  { label: "场景示例", href: "#tabs-preview" },
  { label: "使用方式", href: "#tabs-usage" },
  { label: "API", href: "#tabs-props" },
  { label: "语义 DOM", href: "#tabs-semantic-dom" },
  { label: "正误示例", href: "#tabs-do-dont" },
]
const tabsScenarioExamples = [
  {
    id: "default",
    title: "默认样式切页",
    intent: "在同一区域内切换并列的内容分组，如“概览 / 详情”。",
    rule: "标签文案要简短并列，数量建议控制在 2-5 个。",
    code: `<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">概览</TabsTrigger>\n    <TabsTrigger value="detail">详情</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">概览内容…</TabsContent>\n  <TabsContent value="detail">详情内容…</TabsContent>\n</Tabs>`,
  },
  {
    id: "line",
    title: "下划线样式",
    intent: "在信息密度较高的页面里用更轻量的下划线样式区分标签。",
    rule: "variant=\"line\" 适合嵌入卡片或工具栏，不适合作为页面级主导航。",
    code: `<Tabs defaultValue="all">\n  <TabsList variant="line">\n    <TabsTrigger value="all">全部</TabsTrigger>\n    <TabsTrigger value="active">进行中</TabsTrigger>\n    <TabsTrigger value="done">已完成</TabsTrigger>\n  </TabsList>\n</Tabs>`,
  },
]
const tabsPropRows = [
  { prop: "Tabs", type: "defaultValue? / value? / onValueChange? / orientation?", defaultValue: "orientation=\"horizontal\"", desc: "根节点，可受控也可非受控管理当前激活标签。" },
  { prop: "TabsList", type: "variant?: \"default\" | \"line\"", defaultValue: "\"default\"", desc: "标签栏容器，default 为分段式底色，line 为下划线样式。" },
  { prop: "TabsTrigger", type: "value: string", defaultValue: "—", desc: "单个标签触发器，value 与 TabsContent 一一对应。" },
  { prop: "TabsContent", type: "value: string", defaultValue: "—", desc: "对应标签下的内容面板。" },
]
const tabsSemanticDomRows = [
  { part: "[data-slot=\"tabs\"][data-orientation]", desc: "根容器，data-orientation 标记水平/垂直布局。" },
  { part: "[data-slot=\"tabs-list\"][data-variant]", desc: "标签栏，data-variant 区分 default/line 样式。" },
  { part: "[data-slot=\"tabs-trigger\"][data-active]", desc: "标签触发器，data-active 标记当前激活项。" },
  { part: "[data-slot=\"tabs-content\"]", desc: "内容面板，仅渲染当前激活标签对应的内容。" },
]
const tabsDoDontRows = [
  { do: "标签数量保持在 2-5 个，文案简短并列。", dont: "塞入七八个标签，挤压每个标签的可点击区域。" },
  { do: "用 value 与业务状态（如路由参数）保持同步。", dont: "标签切换了但 URL/状态没变化，刷新后回到默认页。" },
  { do: "line 样式用于卡片内的轻量切换。", dont: "把 line 样式用作页面级主导航，弱化了导航的存在感。" },
]

const toggleAnchors = [
  { label: "组件总览", href: "#toggle-overview" },
  { label: "场景示例", href: "#toggle-preview" },
  { label: "使用方式", href: "#toggle-usage" },
  { label: "API", href: "#toggle-props" },
  { label: "语义 DOM", href: "#toggle-semantic-dom" },
  { label: "正误示例", href: "#toggle-do-dont" },
]
const toggleScenarioExamples = [
  {
    id: "icon",
    title: "图标开关",
    intent: "切换某个独立的二元状态，如收藏、静音、加粗。",
    rule: "图标含义要清晰直观，必要时搭配 aria-label 说明。",
    code: `<Toggle aria-label="加粗">\n  <BoldIcon />\n</Toggle>`,
  },
  {
    id: "outline",
    title: "描边样式",
    intent: "在工具栏等需要明确边界的场景中使用描边变体。",
    rule: "同一工具栏内的 Toggle 应保持统一的 variant 与 size。",
    code: `<Toggle variant="outline" size="sm">\n  <ItalicIcon />\n  斜体\n</Toggle>`,
  },
]
const togglePropRows = [
  { prop: "pressed / onPressedChange", type: "boolean / (pressed) => void", defaultValue: "—", desc: "受控的按下状态与变更回调；非受控时用 defaultPressed。" },
  { prop: "variant", type: "\"default\" | \"outline\"", defaultValue: "\"default\"", desc: "视觉样式：透明背景或带描边。" },
  { prop: "size", type: "\"default\" | \"sm\" | \"lg\"", defaultValue: "\"default\"", desc: "尺寸档位，影响高度、内边距与图标大小。" },
]
const toggleSemanticDomRows = [
  { part: "[data-slot=\"toggle\"][data-state]", desc: "切换按钮本体，data-state=\"on\"/\"off\" 反映当前按下状态。" },
]
const toggleDoDontRows = [
  { do: "用于二元状态切换（开/关、选中/未选中）。", dont: "用它触发会跳转或产生副作用的一次性操作。" },
  { do: "图标含义不明确时搭配文字或 aria-label。", dont: "只放一个生僻图标，用户猜不出按下后会发生什么。" },
  { do: "同一工具栏内统一 variant 与 size。", dont: "工具栏里一半描边一半透明，视觉风格不统一。" },
]

const toggleGroupAnchors = [
  { label: "组件总览", href: "#toggle-group-overview" },
  { label: "场景示例", href: "#toggle-group-preview" },
  { label: "使用方式", href: "#toggle-group-usage" },
  { label: "API", href: "#toggle-group-props" },
  { label: "语义 DOM", href: "#toggle-group-semantic-dom" },
  { label: "正误示例", href: "#toggle-group-do-dont" },
]
const toggleGroupScenarioExamples = [
  {
    id: "single",
    title: "单选模式",
    intent: "在多个互斥选项中选择一个，如对齐方式、视图切换。",
    rule: "type=\"single\" 时建议提供默认选中项，避免初始状态为空。",
    code: `<ToggleGroup defaultValue={["left"]}>\n  <ToggleGroupItem value="left">左对齐</ToggleGroupItem>\n  <ToggleGroupItem value="center">居中</ToggleGroupItem>\n  <ToggleGroupItem value="right">右对齐</ToggleGroupItem>\n</ToggleGroup>`,
  },
  {
    id: "multiple",
    title: "多选模式",
    intent: "允许同时启用多个互不冲突的格式选项，如加粗+斜体+下划线。",
    rule: "type=\"multiple\" 适合并行生效的选项，互斥选项请用 single。",
    code: `<ToggleGroup multiple variant="outline">\n  <ToggleGroupItem value="bold"><BoldIcon /></ToggleGroupItem>\n  <ToggleGroupItem value="italic"><ItalicIcon /></ToggleGroupItem>\n  <ToggleGroupItem value="underline"><UnderlineIcon /></ToggleGroupItem>\n</ToggleGroup>`,
  },
]
const toggleGroupPropRows = [
  { prop: "multiple", type: "boolean", defaultValue: "false", desc: "false 时仅一项可按下（互斥单选），true 时可同时按下多项。" },
  { prop: "value / onValueChange", type: "string | string[]", defaultValue: "—", desc: "受控的选中值；single 为字符串，multiple 为字符串数组。" },
  { prop: "variant / size", type: "\"default\" | \"outline\" / \"default\" | \"sm\" | \"lg\"", defaultValue: "\"default\"", desc: "统一下发给组内所有 ToggleGroupItem 的样式与尺寸。" },
  { prop: "orientation / spacing", type: "\"horizontal\" | \"vertical\" / number", defaultValue: "\"horizontal\" / 2", desc: "排列方向与组内间距；spacing=0 时相邻项会合并边框。" },
]
const toggleGroupSemanticDomRows = [
  { part: "[data-slot=\"toggle-group\"][data-orientation][data-spacing]", desc: "组容器，记录排列方向与间距，驱动相邻项的圆角合并样式。" },
  { part: "[data-slot=\"toggle-group-item\"][data-state][data-variant][data-size]", desc: "组内选项，data-state 标记选中状态，并继承组级 variant/size。" },
]
const toggleGroupDoDontRows = [
  { do: "互斥选项用 type=\"single\"，并行选项用 type=\"multiple\"。", dont: "用 multiple 实现互斥选择，靠业务逻辑硬控制只能选一个。" },
  { do: "single 模式下提供合理的默认选中值。", dont: "初始状态什么都没选中，用户不知道当前是什么视图。" },
  { do: "组内选项数量保持在 2-5 个。", dont: "塞入十几个选项，每个选项窄到看不清图标。" },
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
  const isTypographyPage = page === "typography"
  const isInputPage = page === "input"
  const isSelectPage = page === "select"
  const isCheckboxPage = page === "checkbox"
  const isSwitchPage = page === "switch"
  const isTextareaPage = page === "textarea"
  const isTablePage = page === "table"
  const isCardPage = page === "card"
  const isBadgePage = page === "badge"
  const isTooltipPage = page === "tooltip"
  const isDialogPage = page === "dialog"
  const isAlertDialogPage = page === "alert-dialog"
  const isSheetPage = page === "sheet"
  const isSkeletonPage = page === "skeleton"
  const isAvatarPage = page === "avatar"
  const isBreadcrumbPage = page === "breadcrumb"
  const isButtonGroupPage = page === "button-group"
  const isCalendarPage = page === "calendar"
  const isCollapsiblePage = page === "collapsible"
  const isDropdownMenuPage = page === "dropdown-menu"
  const isPopoverPage = page === "popover"
  const isSeparatorPage = page === "separator"
  const isSidebarPage = page === "sidebar"
  const isSpinnerPage = page === "spinner"
  const isTabsPage = page === "tabs"
  const isTogglePage = page === "toggle"
  const isToggleGroupPage = page === "toggle-group"
  const anchors = isTokensPage
    ? tokenAnchors
    : isIconPage
      ? iconAnchors
      : isButtonPage
        ? buttonAnchors
        : isTypographyPage
          ? typographyAnchors
          : isInputPage
            ? inputAnchors
            : isSelectPage
              ? selectAnchors
              : isCheckboxPage
                ? checkboxAnchors
                : isSwitchPage
                  ? switchAnchors
                  : isTextareaPage
                    ? textareaAnchors
                    : isTablePage
                      ? tableAnchors
                      : isCardPage
                        ? cardAnchors
                        : isBadgePage
                          ? badgeAnchors
                          : isTooltipPage
                            ? tooltipAnchors
                            : isDialogPage
                              ? dialogAnchors
                              : isAlertDialogPage
                                ? alertDialogAnchors
                                : isSheetPage
                                  ? sheetAnchors
                                  : isSkeletonPage
                                    ? skeletonAnchors
                                    : isAvatarPage
                                      ? avatarAnchors
                                      : isBreadcrumbPage
                                        ? breadcrumbAnchors
                                        : isButtonGroupPage
                                          ? buttonGroupAnchors
                                          : isCalendarPage
                                            ? calendarAnchors
                                            : isCollapsiblePage
                                              ? collapsibleAnchors
                                              : isDropdownMenuPage
                                                ? dropdownMenuAnchors
                                                : isPopoverPage
                                                  ? popoverAnchors
                                                  : isSeparatorPage
                                                    ? separatorAnchors
                                                    : isSidebarPage
                                                      ? sidebarAnchors
                                                      : isSpinnerPage
                                                        ? spinnerAnchors
                                                        : isTabsPage
                                                          ? tabsAnchors
                                                          : isTogglePage
                                                            ? toggleAnchors
                                                            : isToggleGroupPage
                                                              ? toggleGroupAnchors
                                                              : []
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
              ) : isTypographyPage ? (
                <TypographyPage actions={pageActions} lang={lang} />
              ) : isInputPage ? (
                <InputPage actions={pageActions} lang={lang} />
              ) : isSelectPage ? (
                <SelectPage actions={pageActions} lang={lang} />
              ) : isCheckboxPage ? (
                <CheckboxPage actions={pageActions} lang={lang} />
              ) : isSwitchPage ? (
                <SwitchPage actions={pageActions} lang={lang} />
              ) : isTextareaPage ? (
                <TextareaPage actions={pageActions} lang={lang} />
              ) : isTablePage ? (
                <TablePage actions={pageActions} lang={lang} />
              ) : isCardPage ? (
                <CardPage actions={pageActions} lang={lang} />
              ) : isBadgePage ? (
                <BadgePage actions={pageActions} lang={lang} />
              ) : isTooltipPage ? (
                <TooltipPage actions={pageActions} lang={lang} />
              ) : isDialogPage ? (
                <DialogPage actions={pageActions} lang={lang} />
              ) : isAlertDialogPage ? (
                <AlertDialogPage actions={pageActions} lang={lang} />
              ) : isSheetPage ? (
                <SheetPage actions={pageActions} lang={lang} />
              ) : isSkeletonPage ? (
                <SkeletonPage actions={pageActions} lang={lang} />
              ) : isAvatarPage ? (
                <AvatarPage actions={pageActions} lang={lang} />
              ) : isBreadcrumbPage ? (
                <BreadcrumbDocPage actions={pageActions} lang={lang} />
              ) : isButtonGroupPage ? (
                <ButtonGroupPage actions={pageActions} lang={lang} />
              ) : isCalendarPage ? (
                <CalendarPage actions={pageActions} lang={lang} />
              ) : isCollapsiblePage ? (
                <CollapsiblePage actions={pageActions} lang={lang} />
              ) : isDropdownMenuPage ? (
                <DropdownMenuPage actions={pageActions} lang={lang} />
              ) : isPopoverPage ? (
                <PopoverPage actions={pageActions} lang={lang} />
              ) : isSeparatorPage ? (
                <SeparatorPage actions={pageActions} lang={lang} />
              ) : isSidebarPage ? (
                <SidebarPage actions={pageActions} lang={lang} />
              ) : isSpinnerPage ? (
                <SpinnerPage actions={pageActions} lang={lang} />
              ) : isTabsPage ? (
                <TabsPage actions={pageActions} lang={lang} />
              ) : isTogglePage ? (
                <TogglePage actions={pageActions} lang={lang} />
              ) : isToggleGroupPage ? (
                <ToggleGroupPage actions={pageActions} lang={lang} />
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

function TypographyPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <>
      <section id="typography-overview" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">通用 / 文字</p>
            <h1 className="text-4xl font-semibold leading-tight">文字 Typography</h1>
          </div>
          {actions}
        </div>

        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          fx-ui 的字号、字重、行高全部走 Tailwind 的语义类，不单独定义一套排版组件。
          统一字体是 <code className="rounded bg-muted px-1.5 py-0.5">font-sans</code>（Geist / system sans-serif），
          页面只需要按场景选择合适的字号和颜色组合。
        </p>

        <p className="text-base leading-8">
          排版 token 的真相值在 <code className="rounded bg-muted px-1.5 py-0.5">docs/TOKENS.md</code> 的"排版"小节维护，
          本页只讲"在页面里该怎么用"。
        </p>
      </section>

      <Separator className="my-10" />

      <section id="typography-scale" className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-semibold">字号阶梯</h2>
          <p className="mt-2 text-sm text-muted-foreground">从正文到页面标题的常用字号，按使用场景挑选，不要新增字号。</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>类名</TableHead>
                <TableHead>值</TableHead>
                <TableHead>使用场景</TableHead>
                <TableHead>预览</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typographyTokens.map((token) => (
                <TableRow key={token.name}>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{token.name}</code>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{token.value}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{token.usage}</TableCell>
                  <TableCell>
                    <span className={token.name}>文字示例 Aa</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Separator className="my-10" />

      <section id="typography-usage" className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="mt-2 text-sm text-muted-foreground">页面里最常见的四类文字组合，直接照抄类名即可。</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {typographyUsageExamples.map((example) => (
            <Card key={example.title}>
              <CardHeader>
                <CardTitle className="text-base">{example.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">{example.usage}</p>
                <CopyCodeBlock code={example.code} label={example.title} lang={lang} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      <section id="typography-rules" className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">使用规则</h2>
        <Card>
          <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
            {typographyRules.map((rule) => (
              <div key={rule} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{rule}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function InputPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const inputImportCode = `import { Input } from "@/components/ui/input"\nimport { Label } from "@/components/ui/label"`
  const inputUsageCode = `<div className="grid gap-2">\n  <Label htmlFor="name">姓名</Label>\n  <Input id="name" placeholder="请输入姓名" />\n</div>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="input" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Input 输入框</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          单行文本录入控件，用于表单字段、搜索框、内联编辑等场景。
        </p>
      </section>

      <section id="input-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Input 是基础 shadcn 组件，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot="input"</code> 标记根节点，
            视觉由公司 token 注入，不需要也不应该手写覆盖样式。
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            <Label htmlFor="input-overview-demo">姓名</Label>
            <Input id="input-overview-demo" placeholder="请输入姓名" className="max-w-sm" />
          </CardContent>
        </Card>
      </section>

      <section id="input-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">
            常见的四类用法：默认、搭配 Label、禁用、校验失败。
          </p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[960px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">场景</TableHead>
                <TableHead className="w-[220px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[320px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inputScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    {example.id === "default" ? (
                      <Input placeholder="请输入姓名" className="max-w-[200px]" />
                    ) : example.id === "with-label" ? (
                      <div className="grid w-[200px] gap-2">
                        <Label htmlFor={`input-demo-${example.id}`}>姓名</Label>
                        <Input id={`input-demo-${example.id}`} placeholder="请输入姓名" />
                      </div>
                    ) : example.id === "disabled" ? (
                      <Input disabled placeholder="不可编辑" className="max-w-[200px]" />
                    ) : (
                      <Input aria-invalid placeholder="请输入邮箱" className="max-w-[200px]" />
                    )}
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="input-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={inputImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={inputUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="input-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inputPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="input-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Input 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inputSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="input-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {inputDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {inputDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function SelectPreview({ id }: { id: string }) {
  if (id === "default") {
    return (
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="请选择角色" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">管理员</SelectItem>
          <SelectItem value="member">成员</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  if (id === "grouped") {
    return (
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="请选择国家" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>常用</SelectLabel>
            <SelectItem value="cn">中国</SelectItem>
            <SelectItem value="us">美国</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  if (id === "small") {
    return (
      <Select>
        <SelectTrigger size="sm" className="w-[140px]">
          <SelectValue placeholder="筛选状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">进行中</SelectItem>
          <SelectItem value="done">已完成</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  return (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="暂不可选择" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="x">选项</SelectItem>
      </SelectContent>
    </Select>
  )
}

function SelectPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const selectImportCode = `import {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectLabel,\n  SelectTrigger,\n  SelectValue,\n} from "@/components/ui/select"`
  const selectUsageCode = `<Select>\n  <SelectTrigger className="w-[180px]">\n    <SelectValue placeholder="请选择角色" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="admin">管理员</SelectItem>\n    <SelectItem value="member">成员</SelectItem>\n  </SelectContent>\n</Select>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="select" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Select 选择器</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          从一组互斥选项中选择一个值，用于表单字段、筛选条件等场景。
        </p>
      </section>

      <section id="select-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Select 由 Trigger（触发器）、Content（下拉浮层）、Item（选项）等部位组合而成，
            统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记各部位，视觉由公司 token 注入。
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            <Label htmlFor="select-overview-demo">角色</Label>
            <Select>
              <SelectTrigger id="select-overview-demo" className="w-[200px]">
                <SelectValue placeholder="请选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">管理员</SelectItem>
                <SelectItem value="member">成员</SelectItem>
                <SelectItem value="guest">访客</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </section>

      <section id="select-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">
            常见的四类用法：默认、分组选项、紧凑尺寸、禁用。
          </p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">场景</TableHead>
                <TableHead className="w-[220px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[340px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <SelectPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="select-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={selectImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={selectUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="select-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="select-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Select 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="select-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {selectDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {selectDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function CheckboxPreview({ id }: { id: string }) {
  const [checked, setChecked] = useState(false)

  if (id === "default") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-demo-default" />
        <Label htmlFor="checkbox-demo-default">同意条款</Label>
      </div>
    )
  }

  if (id === "checked") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-demo-checked" checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
        <Label htmlFor="checkbox-demo-checked">{checked ? "已选中" : "未选中"}</Label>
      </div>
    )
  }

  if (id === "disabled") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-demo-disabled" disabled />
        <Label htmlFor="checkbox-demo-disabled">不可编辑</Label>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Checkbox aria-label="选择第 1 行" />
        <span className="text-sm text-muted-foreground">订单 #10231</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox aria-label="选择第 2 行" />
        <span className="text-sm text-muted-foreground">订单 #10232</span>
      </div>
    </div>
  )
}

function CheckboxPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const checkboxImportCode = `import { Checkbox } from "@/components/ui/checkbox"\nimport { Label } from "@/components/ui/label"`
  const checkboxUsageCode = `<div className="flex items-center gap-2">\n  <Checkbox id="agree" />\n  <Label htmlFor="agree">我已阅读并同意服务条款</Label>\n</div>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="checkbox" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Checkbox 复选框</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          表达单个布尔选项的勾选，常用于条款确认、设置项、列表批量选择。
        </p>
      </section>

      <section id="checkbox-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Checkbox 由根节点和选中态指示图标组成，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记，
            视觉由公司 token 注入，选中态颜色取自 primary。
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox-overview-demo" />
              <Label htmlFor="checkbox-overview-demo">我已阅读并同意服务条款</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="checkbox-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">
            常见的四类用法：默认、受控选中态、禁用、列表内勾选。
          </p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">场景</TableHead>
                <TableHead className="w-[220px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[340px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkboxScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <CheckboxPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="checkbox-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={checkboxImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={checkboxUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="checkbox-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkboxPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="checkbox-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Checkbox 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkboxSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="checkbox-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {checkboxDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {checkboxDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function SwitchPreview({ id }: { id: string }) {
  const [enabled, setEnabled] = useState(false)

  if (id === "default") {
    return (
      <div className="flex items-center gap-2">
        <Switch id="switch-demo-default" />
        <Label htmlFor="switch-demo-default">接收消息通知</Label>
      </div>
    )
  }

  if (id === "checked") {
    return (
      <div className="flex items-center gap-2">
        <Switch id="switch-demo-checked" checked={enabled} onCheckedChange={setEnabled} />
        <Label htmlFor="switch-demo-checked">{enabled ? "已开启" : "已关闭"}</Label>
      </div>
    )
  }

  if (id === "small") {
    return (
      <div className="flex items-center gap-2">
        <Switch id="switch-demo-small" size="sm" />
        <Label htmlFor="switch-demo-small">紧凑尺寸</Label>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Switch id="switch-demo-disabled" disabled />
      <Label htmlFor="switch-demo-disabled">该选项不可更改</Label>
    </div>
  )
}

function SwitchPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const switchImportCode = `import { Switch } from "@/components/ui/switch"\nimport { Label } from "@/components/ui/label"`
  const switchUsageCode = `<div className="flex items-center gap-2">\n  <Switch id="notify" />\n  <Label htmlFor="notify">接收消息通知</Label>\n</div>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="switch" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Switch 开关</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          表达立即生效的二元设置项，切换后无需额外提交，常用于偏好设置、功能开关。
        </p>
      </section>

      <section id="switch-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Switch 由轨道根节点和可滑动滑块组成，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记，
            开启态轨道颜色取自 primary。
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <Switch id="switch-overview-demo" />
              <Label htmlFor="switch-overview-demo">接收消息通知</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="switch-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">
            常见的四类用法：默认、受控状态、紧凑尺寸、禁用。
          </p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">场景</TableHead>
                <TableHead className="w-[220px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[340px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {switchScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <SwitchPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="switch-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={switchImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={switchUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="switch-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {switchPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="switch-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Switch 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {switchSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="switch-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {switchDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {switchDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function TextareaPreview({ id }: { id: string }) {
  if (id === "default") {
    return (
      <div className="grid w-[220px] gap-2">
        <Label htmlFor={`textarea-demo-${id}`}>个人简介</Label>
        <Textarea id={`textarea-demo-${id}`} placeholder="简单介绍一下自己" />
      </div>
    )
  }

  if (id === "disabled") {
    return <Textarea disabled placeholder="不可编辑" className="w-[220px]" />
  }

  return <Textarea aria-invalid placeholder="请输入至少 10 个字" className="w-[220px]" />
}

function TextareaPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const textareaImportCode = `import { Textarea } from "@/components/ui/textarea"\nimport { Label } from "@/components/ui/label"`
  const textareaUsageCode = `<div className="grid gap-2">\n  <Label htmlFor="bio">个人简介</Label>\n  <Textarea id="bio" placeholder="简单介绍一下自己" />\n</div>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="textarea" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Textarea 多行输入</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          录入较长文本，如备注、描述、反馈内容，高度随内容自适应。
        </p>
      </section>

      <section id="textarea-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Textarea 是基础 shadcn 组件，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot="textarea"</code> 标记根节点，
            高度通过 field-sizing-content 自适应内容，不需要手写 rows 撑高度。
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            <Label htmlFor="textarea-overview-demo">个人简介</Label>
            <Textarea id="textarea-overview-demo" placeholder="简单介绍一下自己" className="max-w-sm" />
          </CardContent>
        </Card>
      </section>

      <section id="textarea-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">常见的三类用法：默认、禁用、校验失败。</p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[960px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">场景</TableHead>
                <TableHead className="w-[240px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[320px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {textareaScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <TextareaPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="textarea-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={textareaImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={textareaUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="textarea-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {textareaPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="textarea-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Textarea 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {textareaSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="textarea-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {textareaDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {textareaDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function TablePage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const tableImportCode = `import {\n  Table,\n  TableBody,\n  TableCaption,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@/components/ui/table"`
  const tableUsageCode = `<Table>\n  <TableCaption>最近的订单记录</TableCaption>\n  <TableHeader>\n    <TableRow>\n      <TableHead>订单号</TableHead>\n      <TableHead>客户</TableHead>\n      <TableHead>状态</TableHead>\n      <TableHead className="text-right">金额</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {orders.map((order) => (\n      <TableRow key={order.id}>\n        <TableCell>{order.id}</TableCell>\n        <TableCell>{order.customer}</TableCell>\n        <TableCell><Badge variant="outline">{order.status}</Badge></TableCell>\n        <TableCell className="text-right">{order.amount}</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="table" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Table 表格</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          展示结构化的多行数据，常用于订单列表、用户管理、数据看板等场景。
        </p>
      </section>

      <section id="table-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Table 由 Header / Body / Row / Head / Cell 等语义子组件组合而成，
            统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记各部位，外层容器自带横向滚动。
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableCaption>最近的订单记录</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">金额</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableDemoRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "已支付" ? "default" : "outline"}>{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="table-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">
            带表尾汇总的表格，用于展示一组明细数据及其合计。
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">金额</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableDemoRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "已支付" ? "default" : "outline"}>{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>合计</TableCell>
                <TableCell className="text-right">¥4,280</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </section>

      <section id="table-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={tableImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={tableUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="table-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tablePropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="table-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Table 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="table-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {tableDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {tableDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function CardPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const cardImportCode = `import {\n  Card,\n  CardAction,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardTitle,\n} from "@/components/ui/card"`
  const cardUsageCode = `<Card className="w-[320px]">\n  <CardHeader>\n    <CardTitle>本月营收</CardTitle>\n    <CardDescription>对比上月同期</CardDescription>\n    <CardAction>\n      <Button variant="ghost" size="sm">查看详情</Button>\n    </CardAction>\n  </CardHeader>\n  <CardContent>\n    <p className="text-2xl font-semibold">¥128,400</p>\n  </CardContent>\n  <CardFooter>\n    <p className="text-sm text-muted-foreground">较上月增长 12.4%</p>\n  </CardFooter>\n</Card>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="card" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Card 卡片</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          通用内容容器，用 Header / Content / Footer 等子组件搭出统一的卡片骨架。
        </p>
      </section>

      <section id="card-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Card 由 Header（标题/描述/操作区）、Content（主体）、Footer（底部）等部位组成，
            统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记，视觉由公司 token 注入。
          </p>
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>本月营收</CardTitle>
            <CardDescription>对比上月同期</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm">查看详情</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">¥128,400</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">较上月增长 12.4%</p>
          </CardFooter>
        </Card>
      </section>

      <section id="card-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">
            常见的三类用法：数据概览卡、信息说明卡、可操作的列表项卡片。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">数据概览</CardTitle>
              <CardDescription>关键指标 + 同比说明</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">1,204</p>
              <p className="mt-1 text-sm text-muted-foreground">较上周 +8.2%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">信息说明</CardTitle>
              <CardDescription>仅展示静态内容，不含操作</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              用于展示帮助说明、配置摘要等只读信息，不需要 Footer 和 Action。
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">可操作列表项</CardTitle>
              <CardAction>
                <Button variant="outline" size="sm">编辑</Button>
              </CardAction>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              头部右上角放置操作入口，交给 CardAction 自动布局对齐。
            </CardContent>
            <CardFooter>
              <Badge variant="outline">已启用</Badge>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section id="card-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={cardImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={cardUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="card-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="card-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Card 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="card-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {cardDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {cardDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function BadgePreview({ id }: { id: string }) {
  if (id === "status") {
    return (
      <div className="flex flex-wrap gap-2">
        <Badge>已支付</Badge>
        <Badge variant="secondary">处理中</Badge>
        <Badge variant="destructive">已失败</Badge>
      </div>
    )
  }

  if (id === "count") {
    return <Badge variant="outline">+12</Badge>
  }

  return (
    <Badge variant="secondary">
      <CheckCircleIcon data-icon="inline-start" />
      已校验
    </Badge>
  )
}

function BadgePage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const badgeImportCode = `import { Badge } from "@/components/ui/badge"`
  const badgeUsageCode = `<Badge>已支付</Badge>\n<Badge variant="secondary">处理中</Badge>\n<Badge variant="destructive">已失败</Badge>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="badge" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Badge 徽标</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          展示简短的状态、计数或分类标记，常用于表格、列表、卡片角标。
        </p>
      </section>

      <section id="badge-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Badge 提供 6 种 variant 表达不同语义级别，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot="badge"</code> 标记，
            视觉由公司 token 注入。
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col gap-4 p-5">
            {badgeVariantRows.map((row) => (
              <div key={row.variant} className="flex items-center gap-3">
                <Badge variant={row.variant as React.ComponentProps<typeof Badge>["variant"]}>{row.variant}</Badge>
                <span className="text-sm text-muted-foreground">{row.usage}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="badge-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">
            常见的三类用法：状态标记、计数提示、搭配图标。
          </p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[960px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">场景</TableHead>
                <TableHead className="w-[220px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[320px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {badgeScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <BadgePreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="badge-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={badgeImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={badgeUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="badge-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {badgePropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="badge-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Badge 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {badgeSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="badge-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {badgeDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {badgeDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function TooltipPreview({ id }: { id: string }) {
  if (id === "icon-button") {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="设置">
              <SettingsIcon />
            </Button>
          }
        />
        <TooltipContent>设置</TooltipContent>
      </Tooltip>
    )
  }

  if (id === "truncated-text") {
    return (
      <Tooltip>
        <TooltipTrigger render={<span className="block w-[120px] truncate text-sm">这是一个很长的客户全称示例文本</span>} />
        <TooltipContent>这是一个很长的客户全称示例文本</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="sm">悬浮查看</Button>} />
      <TooltipContent side="right">提示从右侧弹出</TooltipContent>
    </Tooltip>
  )
}

function TooltipPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const tooltipImportCode = `import {\n  Tooltip,\n  TooltipContent,\n  TooltipProvider,\n  TooltipTrigger,\n} from "@/components/ui/tooltip"`
  const tooltipUsageCode = `<Tooltip>\n  <TooltipTrigger\n    render={\n      <Button variant="ghost" size="icon-sm" aria-label="设置">\n        <SettingsIcon />\n      </Button>\n    }\n  />\n  <TooltipContent>设置</TooltipContent>\n</Tooltip>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="tooltip" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Tooltip 提示</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          鼠标悬浮或聚焦时弹出的简短说明，用于补充说明、可访问性兜底，不承载关键信息。
        </p>
      </section>

      <section id="tooltip-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Tooltip 由 Provider（统一延迟）、Trigger（触发元素）、Content（提示气泡）组成，
            页面级建议只包一层 <code className="rounded bg-muted px-1.5 py-0.5">TooltipProvider</code>，
            视觉由公司 token 注入。
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button variant="ghost" size="icon-sm" aria-label="设置">
                      <SettingsIcon />
                    </Button>
                  }
                />
                <TooltipContent>设置</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-sm text-muted-foreground">悬浮左侧图标按钮查看提示</span>
          </CardContent>
        </Card>
      </section>

      <section id="tooltip-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">
            常见的三类用法：纯图标按钮说明、截断文本补全、自定义弹出方向。
          </p>
        </div>
        <TooltipProvider>
          <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] pl-4">场景</TableHead>
                  <TableHead className="w-[200px]">示例</TableHead>
                  <TableHead className="w-[260px]">使用意图</TableHead>
                  <TableHead>约束</TableHead>
                  <TableHead className="w-[340px] pr-4">推荐写法</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tooltipScenarioExamples.map((example) => (
                  <TableRow key={example.id}>
                    <TableCell className="pl-4 align-top whitespace-normal">
                      <span className="font-medium">{example.title}</span>
                    </TableCell>
                    <TableCell className="align-top">
                      <TooltipPreview id={example.id} />
                    </TableCell>
                    <TableCell className="align-top whitespace-normal text-muted-foreground">
                      <p className="max-w-[260px] leading-6">{example.intent}</p>
                    </TableCell>
                    <TableCell className="align-top whitespace-normal text-muted-foreground">
                      <p className="min-w-[220px] leading-6">{example.rule}</p>
                    </TableCell>
                    <TableCell className="pr-4 align-top whitespace-normal">
                      <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                        {example.code}
                      </code>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      </section>

      <section id="tooltip-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={tooltipImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={tooltipUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="tooltip-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性 / 子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tooltipPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="tooltip-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Tooltip 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tooltipSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="tooltip-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {tooltipDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {tooltipDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function DialogPreview({ id }: { id: string }) {
  if (id === "form") {
    return (
      <Dialog>
        <DialogTrigger render={<Button size="sm">新建项目</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建项目</DialogTitle>
            <DialogDescription>填写基本信息后即可创建。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Input placeholder="项目名称" />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">取消</Button>} />
            <Button>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" variant="outline">发布版本</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认发布该版本？</DialogTitle>
          <DialogDescription>发布后用户将立即看到最新内容。</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">再想想</Button>} />
          <Button>确认发布</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DialogPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const dialogImportCode = `import {\n  Dialog,\n  DialogClose,\n  DialogContent,\n  DialogDescription,\n  DialogFooter,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@/components/ui/dialog"`
  const dialogUsageCode = `<Dialog>\n  <DialogTrigger render={<Button>新建项目</Button>} />\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>新建项目</DialogTitle>\n      <DialogDescription>填写基本信息后即可创建</DialogDescription>\n    </DialogHeader>\n    <DialogFooter>\n      <DialogClose render={<Button variant="outline">取消</Button>} />\n      <Button>创建</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="dialog" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Dialog 对话框</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          以模态浮层承载需要用户聚焦完成的单一任务，如表单录入、操作确认。
        </p>
      </section>

      <section id="dialog-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Dialog 由 Trigger（触发）、Content（主体，含遮罩）、Header/Footer（布局分组）、
            Title/Description（语义标题与说明）组成，统一用 <code className="rounded bg-muted px-1.5 py-0.5">data-slot</code> 标记。
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Dialog>
              <DialogTrigger render={<Button>打开示例对话框</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建项目</DialogTitle>
                  <DialogDescription>填写基本信息后即可创建。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <Input placeholder="项目名称" />
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">取消</Button>} />
                  <Button>创建</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <span className="text-sm text-muted-foreground">点击按钮查看弹窗结构</span>
          </CardContent>
        </Card>
      </section>

      <section id="dialog-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">常见的两类用法：表单弹窗、确认弹窗。</p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">场景</TableHead>
                <TableHead className="w-[200px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[360px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dialogScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <DialogPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="dialog-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={dialogImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={dialogUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="dialog-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dialogPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="dialog-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Dialog 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dialogSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="dialog-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {dialogDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {dialogDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function AlertDialogPreview({ id }: { id: string }) {
  if (id === "destructive") {
    return (
      <AlertDialog>
        <AlertDialogTrigger render={<Button size="sm" variant="destructive">删除项目</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该项目？</AlertDialogTitle>
            <AlertDialogDescription>删除后数据无法恢复，请谨慎操作。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={<Button variant="outline">取消</Button>} />
            <AlertDialogAction render={<Button variant="destructive">确认删除</Button>} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button size="sm" variant="outline">关闭编辑窗口</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>放弃当前修改？</AlertDialogTitle>
          <AlertDialogDescription>未保存的修改将会丢失。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline">继续编辑</Button>} />
          <AlertDialogAction render={<Button variant="destructive">放弃修改</Button>} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function AlertDialogPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const alertDialogImportCode = `import {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@/components/ui/alert-dialog"`
  const alertDialogUsageCode = `<AlertDialog>\n  <AlertDialogTrigger render={<Button variant="destructive">删除项目</Button>} />\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>确认删除该项目？</AlertDialogTitle>\n      <AlertDialogDescription>删除后数据无法恢复，请谨慎操作。</AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel render={<Button variant="outline">取消</Button>} />\n      <AlertDialogAction render={<Button variant="destructive">确认删除</Button>} />\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="alert-dialog" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Alert Dialog 警告对话框</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          强制用户对不可逆或有重大影响的操作做出明确选择，不可通过点击遮罩或 Esc 关闭。
        </p>
      </section>

      <section id="alert-dialog-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Alert Dialog 与 Dialog 结构相似，但语义角色是 <code className="rounded bg-muted px-1.5 py-0.5">alertdialog</code>，
            并且默认强制用户通过 Action / Cancel 明确做出选择，不能随意关闭。
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive">删除项目</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除该项目？</AlertDialogTitle>
                  <AlertDialogDescription>删除后数据无法恢复，请谨慎操作。</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel render={<Button variant="outline">取消</Button>} />
                  <AlertDialogAction render={<Button variant="destructive">确认删除</Button>} />
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <span className="text-sm text-muted-foreground">点击按钮查看强制确认结构</span>
          </CardContent>
        </Card>
      </section>

      <section id="alert-dialog-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">常见的两类用法：破坏性操作确认、离开未保存提示。</p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] pl-4">场景</TableHead>
                <TableHead className="w-[200px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[360px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertDialogScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <AlertDialogPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="alert-dialog-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={alertDialogImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={alertDialogUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="alert-dialog-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertDialogPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="alert-dialog-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Alert Dialog 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertDialogSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="alert-dialog-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {alertDialogDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {alertDialogDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function SheetPreview({ id }: { id: string }) {
  if (id === "right-form") {
    return (
      <Sheet>
        <SheetTrigger render={<Button size="sm" variant="outline">编辑成员</Button>} />
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>编辑成员</SheetTitle>
            <SheetDescription>修改信息后点击保存生效。</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4">
            <Input placeholder="姓名" />
          </div>
          <SheetFooter>
            <Button>保存</Button>
            <SheetClose render={<Button variant="outline">取消</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet>
      <SheetTrigger render={<Button size="sm" variant="outline">更多操作</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>更多操作</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4 pb-4">
          <Button variant="outline">分享</Button>
          <Button variant="outline">归档</Button>
          <Button variant="destructive">删除</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function SheetPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const sheetImportCode = `import {\n  Sheet,\n  SheetClose,\n  SheetContent,\n  SheetDescription,\n  SheetFooter,\n  SheetHeader,\n  SheetTitle,\n  SheetTrigger,\n} from "@/components/ui/sheet"`
  const sheetUsageCode = `<Sheet>\n  <SheetTrigger render={<Button variant="outline">编辑</Button>} />\n  <SheetContent side="right">\n    <SheetHeader>\n      <SheetTitle>编辑成员</SheetTitle>\n      <SheetDescription>修改信息后点击保存生效</SheetDescription>\n    </SheetHeader>\n    <SheetFooter>\n      <Button>保存</Button>\n      <SheetClose render={<Button variant="outline">取消</Button>} />\n    </SheetFooter>\n  </SheetContent>\n</Sheet>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="sheet" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Sheet 抽屉</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          从屏幕边缘滑出的浮层面板，用于在不离开当前上下文的情况下查看详情或执行操作。
        </p>
      </section>

      <section id="sheet-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Sheet 与 Dialog 结构相似，区别在于以 <code className="rounded bg-muted px-1.5 py-0.5">side</code> 控制从屏幕哪一侧滑出，
            适合承载和当前页面强相关的详情或操作。
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Sheet>
              <SheetTrigger render={<Button>打开示例抽屉</Button>} />
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>编辑成员</SheetTitle>
                  <SheetDescription>修改信息后点击保存生效。</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 px-4">
                  <Input placeholder="姓名" />
                </div>
                <SheetFooter>
                  <Button>保存</Button>
                  <SheetClose render={<Button variant="outline">取消</Button>} />
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <span className="text-sm text-muted-foreground">点击按钮查看从右侧滑出的面板</span>
          </CardContent>
        </Card>
      </section>

      <section id="sheet-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">常见的两类用法：右侧编辑面板、底部操作面板。</p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">场景</TableHead>
                <TableHead className="w-[200px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[360px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <SheetPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="sheet-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={sheetImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={sheetUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="sheet-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性 / 子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="sheet-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Sheet 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="sheet-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {sheetDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {sheetDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function SkeletonPreview({ id }: { id: string }) {
  if (id === "text-lines") {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[240px]" />
        <Skeleton className="h-4 w-[180px]" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[160px]" />
        <Skeleton className="h-4 w-[120px]" />
      </div>
    </div>
  )
}

function SkeletonPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const skeletonImportCode = `import { Skeleton } from "@/components/ui/skeleton"`
  const skeletonUsageCode = `<div className="flex items-center gap-4">\n  <Skeleton className="size-12 rounded-full" />\n  <div className="flex flex-col gap-2">\n    <Skeleton className="h-4 w-[160px]" />\n    <Skeleton className="h-4 w-[120px]" />\n  </div>\n</div>`

  return (
    <div className={docsSpacing.pageStack}>
      <section id="skeleton" className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">Skeleton 骨架屏</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">
          内容加载完成前展示的占位块，用呼吸动画提示"正在加载"，并提前还原真实内容的大致结构。
        </p>
      </section>

      <section id="skeleton-overview" className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Skeleton 本质是一个带 <code className="rounded bg-muted px-1.5 py-0.5">animate-pulse</code> 动效的占位块，
            通过 className 控制宽高与形状来还原真实内容结构。
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-[160px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="skeleton-preview" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">常见的两类用法：文本占位、卡片媒体占位。</p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">场景</TableHead>
                <TableHead className="w-[200px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[360px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonScenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <SkeletonPreview id={example.id} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="skeleton-usage" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={skeletonImportCode} label="Import" lang={lang} />
            <CopyCodeBlock code={skeletonUsageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id="skeleton-props" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性 / 子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonPropRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="skeleton-semantic-dom" className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            Skeleton 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonSemanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="skeleton-do-dont" className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {skeletonDoDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {skeletonDoDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function StandardDocPage({
  slug,
  title,
  lead,
  overview,
  scenarioExamples,
  renderScenarioPreview,
  importCode,
  usageCode,
  propRows,
  semanticDomRows,
  doDontRows,
  actions,
  lang,
}: {
  slug: string
  title: string
  lead: string
  overview: React.ReactNode
  scenarioExamples: { id: string; title: string; intent: string; rule: string; code: string }[]
  renderScenarioPreview: (id: string) => React.ReactNode
  importCode: string
  usageCode: string
  propRows: { prop: string; type: string; defaultValue: string; desc: string }[]
  semanticDomRows: { part: string; desc: string }[]
  doDontRows: { do: string; dont: string }[]
  actions: React.ReactNode
  lang: Lang
}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id={slug} className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">{title}</h1>
          </div>
          {actions}
        </div>
        <p className="max-w-3xl break-words text-lg leading-8">{lead}</p>
      </section>

      <section id={`${slug}-overview`} className={docsSpacing.sectionStack}>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">组件总览</h2>
        </div>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">{overview}</CardContent>
        </Card>
      </section>

      <section id={`${slug}-preview`} className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">场景示例</h2>
          <p className="text-base leading-8 text-muted-foreground">常见用法与适用场景。</p>
        </div>
        <div className="max-w-full overflow-hidden rounded-lg border border-border bg-card">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-4">场景</TableHead>
                <TableHead className="w-[200px]">示例</TableHead>
                <TableHead className="w-[260px]">使用意图</TableHead>
                <TableHead>约束</TableHead>
                <TableHead className="w-[360px] pr-4">推荐写法</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarioExamples.map((example) => (
                <TableRow key={example.id}>
                  <TableCell className="pl-4 align-top whitespace-normal">
                    <span className="font-medium">{example.title}</span>
                  </TableCell>
                  <TableCell className="align-top">{renderScenarioPreview(example.id)}</TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="max-w-[260px] leading-6">{example.intent}</p>
                  </TableCell>
                  <TableCell className="align-top whitespace-normal text-muted-foreground">
                    <p className="min-w-[220px] leading-6">{example.rule}</p>
                  </TableCell>
                  <TableCell className="pr-4 align-top whitespace-normal">
                    <code className="overflow-x-auto whitespace-pre rounded-lg bg-muted px-3 py-2 text-xs leading-6">
                      {example.code}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id={`${slug}-usage`} className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">使用方式</h2>
          <p className="text-base leading-8 text-muted-foreground">把 import 和 JSX 调用复制到业务页面里使用。</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="grid gap-4">
            <CopyCodeBlock code={importCode} label="Import" lang={lang} />
            <CopyCodeBlock code={usageCode} label="调用" lang={lang} />
          </div>
        </div>
      </section>

      <section id={`${slug}-props`} className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">API 属性</h2>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">属性 / 子组件</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>默认值</TableHead>
                <TableHead className="pr-4">描述</TableHead>
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
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id={`${slug}-semantic-dom`} className={docsSpacing.sectionStack}>
        <div className={docsSpacing.sectionHeader}>
          <h2 className="text-2xl font-semibold">语义 DOM</h2>
          <p className="text-base leading-8 text-muted-foreground">
            源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。
          </p>
        </div>
        <div className="max-w-full overflow-x-auto rounded-lg border border-border bg-card">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">部位</TableHead>
                <TableHead className="pr-4">说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id={`${slug}-do-dont`} className={docsSpacing.sectionStack}>
        <h2 className="text-2xl font-semibold">正误示例</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">推荐 Do</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {doDontRows.map((row) => (
                <div key={`do-${row.do}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{row.do}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">避免 Don't</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              {doDontRows.map((row) => (
                <div key={`dont-${row.dont}`} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{row.dont}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function AvatarPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="avatar"
      title="Avatar 头像"
      lead="展示用户或实体身份的圆形图像，支持图片加载失败时回退到文字缩写，并可组合成头像组。"
      overview={
        <>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="用户头像" />
            <AvatarFallback>张</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">图片加载失败时自动回退到 AvatarFallback</span>
        </>
      }
      scenarioExamples={avatarScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "single" ? (
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="张三" />
            <AvatarFallback>张</AvatarFallback>
          </Avatar>
        ) : (
          <AvatarGroup>
            <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        )
      }
      importCode={`import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"`}
      usageCode={`<Avatar>\n  <AvatarImage src="/avatars/01.png" alt="张三" />\n  <AvatarFallback>张</AvatarFallback>\n</Avatar>`}
      propRows={avatarPropRows}
      semanticDomRows={avatarSemanticDomRows}
      doDontRows={avatarDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function BreadcrumbDocPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="breadcrumb"
      title="Breadcrumb 面包屑"
      lead="展示当前页面在层级结构中的位置，帮助用户理解所处位置并快速返回上级。"
      overview={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">项目</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      scenarioExamples={breadcrumbScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "basic" ? (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )
      }
      importCode={`import {\n  Breadcrumb,\n  BreadcrumbEllipsis,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from "@/components/ui/breadcrumb"`}
      usageCode={`<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>详情</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`}
      propRows={breadcrumbPropRows}
      semanticDomRows={breadcrumbSemanticDomRows}
      doDontRows={breadcrumbDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function ButtonGroupPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="button-group"
      title="Button Group 按钮组"
      lead="把强相关的多个操作按钮合并为一组，自动合并相邻边框与圆角，弱化彼此边界。"
      overview={
        <ButtonGroup>
          <Button variant="outline">复制</Button>
          <Button variant="outline">分享</Button>
          <Button variant="outline">归档</Button>
        </ButtonGroup>
      }
      scenarioExamples={buttonGroupScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "split" ? (
          <ButtonGroup>
            <Button size="sm" variant="outline">复制</Button>
            <Button size="sm" variant="outline">分享</Button>
            <Button size="sm" variant="outline">归档</Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            <ButtonGroupText>排序</ButtonGroupText>
            <ButtonGroupSeparator />
            <Button size="sm" variant="outline">最新</Button>
            <Button size="sm" variant="outline">最热</Button>
          </ButtonGroup>
        )
      }
      importCode={`import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"`}
      usageCode={`<ButtonGroup>\n  <Button variant="outline">复制</Button>\n  <Button variant="outline">分享</Button>\n  <Button variant="outline">归档</Button>\n</ButtonGroup>`}
      propRows={buttonGroupPropRows}
      semanticDomRows={buttonGroupSemanticDomRows}
      doDontRows={buttonGroupDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function CalendarPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="calendar"
      title="Calendar 日历"
      lead="基于 react-day-picker 的日期选择器，支持单日 / 多日 / 区间模式，常嵌入 Popover 组成日期选择控件。"
      overview={<Calendar mode="single" className="rounded-lg border p-2" />}
      scenarioExamples={calendarScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "single" ? (
          <Calendar mode="single" className="scale-90 rounded-lg border p-1 [--cell-size:1.6rem]" />
        ) : (
          <Popover>
            <PopoverTrigger render={<Button size="sm" variant="outline">选择日期</Button>} />
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" />
            </PopoverContent>
          </Popover>
        )
      }
      importCode={`import { Calendar } from "@/components/ui/calendar"`}
      usageCode={`const [date, setDate] = useState<Date>()\n\n<Calendar mode="single" selected={date} onSelect={setDate} />`}
      propRows={calendarPropRows}
      semanticDomRows={calendarSemanticDomRows}
      doDontRows={calendarDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function CollapsiblePage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="collapsible"
      title="Collapsible 折叠面板"
      lead="默认收起次要信息，点击触发器后展开查看详情，用于减少页面初始信息量。"
      overview={
        <Collapsible className="w-full">
          <CollapsibleTrigger
            render={
              <Button variant="ghost" className="gap-1.5">
                查看更多 <ChevronDownIcon className="size-4" />
              </Button>
            }
          />
          <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
            这里是展开后的详细内容，可以承载补充说明或次要信息。
          </CollapsibleContent>
        </Collapsible>
      }
      scenarioExamples={collapsibleScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "panel" ? (
          <Collapsible>
            <CollapsibleTrigger
              render={
                <Button size="sm" variant="ghost" className="gap-1.5">
                  查看更多 <ChevronDownIcon className="size-4" />
                </Button>
              }
            />
            <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
              这里是展开后的详细内容。
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Collapsible defaultOpen className="w-[180px]">
            <CollapsibleTrigger render={<button className="text-sm font-medium">基础组件（12）</button>} />
            <CollapsibleContent className="flex flex-col gap-1 pt-2 text-sm text-muted-foreground">
              <span>Button</span>
              <span>Input</span>
            </CollapsibleContent>
          </Collapsible>
        )
      }
      importCode={`import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"`}
      usageCode={`<Collapsible>\n  <CollapsibleTrigger render={<Button variant="ghost">查看更多</Button>} />\n  <CollapsibleContent>\n    <p className="text-sm text-muted-foreground">这里是展开后的详细内容。</p>\n  </CollapsibleContent>\n</Collapsible>`}
      propRows={collapsiblePropRows}
      semanticDomRows={collapsibleSemanticDomRows}
      doDontRows={collapsibleDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function DropdownMenuPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="dropdown-menu"
      title="Dropdown Menu 下拉菜单"
      lead="点击触发器后弹出的操作菜单，用于在有限空间里收纳多个次级操作。"
      overview={
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline">打开菜单</Button>} />
          <DropdownMenuContent>
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>个人设置 <DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuItem>账单 <DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">退出登录</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
      scenarioExamples={dropdownMenuScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "actions" ? (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="sm" variant="ghost">操作 ⋯</Button>} />
            <DropdownMenuContent>
              <DropdownMenuItem>编辑</DropdownMenuItem>
              <DropdownMenuItem>复制</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="sm" variant="outline"><UserIcon className="size-4" /> 账户</Button>} />
            <DropdownMenuContent>
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem><CreditCardIcon /> 账单</DropdownMenuItem>
                <DropdownMenuItem><SettingsIcon /> 设置</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive"><LogOutIcon /> 退出登录</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
      importCode={`import {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuItem,\n  DropdownMenuLabel,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@/components/ui/dropdown-menu"`}
      usageCode={`<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="ghost" size="icon">⋯</Button>} />\n  <DropdownMenuContent>\n    <DropdownMenuItem>编辑</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`}
      propRows={dropdownMenuPropRows}
      semanticDomRows={dropdownMenuSemanticDomRows}
      doDontRows={dropdownMenuDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function PopoverPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="popover"
      title="Popover 弹出层"
      lead="点击触发后弹出的轻量浮层，用于展示简短的补充信息或快捷操作，不打断当前流程。"
      overview={
        <Popover>
          <PopoverTrigger render={<Button variant="outline">打开弹层</Button>} />
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>什么是工作区？</PopoverTitle>
              <PopoverDescription>工作区是团队协作的基本单位，可包含多个项目。</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      }
      scenarioExamples={popoverScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "info" ? (
          <Popover>
            <PopoverTrigger render={<Button size="sm" variant="ghost">说明</Button>} />
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>什么是工作区？</PopoverTitle>
                <PopoverDescription>工作区是团队协作的基本单位。</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        ) : (
          <Popover>
            <PopoverTrigger render={<Button size="sm" variant="outline">设置别名</Button>} />
            <PopoverContent className="flex flex-col gap-2.5">
              <Input placeholder="输入别名" />
              <Button size="sm">保存</Button>
            </PopoverContent>
          </Popover>
        )
      }
      importCode={`import {\n  Popover,\n  PopoverContent,\n  PopoverDescription,\n  PopoverHeader,\n  PopoverTitle,\n  PopoverTrigger,\n} from "@/components/ui/popover"`}
      usageCode={`<Popover>\n  <PopoverTrigger render={<Button variant="outline">打开弹层</Button>} />\n  <PopoverContent>\n    <PopoverHeader>\n      <PopoverTitle>标题</PopoverTitle>\n      <PopoverDescription>补充说明文字。</PopoverDescription>\n    </PopoverHeader>\n  </PopoverContent>\n</Popover>`}
      propRows={popoverPropRows}
      semanticDomRows={popoverSemanticDomRows}
      doDontRows={popoverDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function SeparatorPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="separator"
      title="Separator 分隔线"
      lead="用于区隔弱关联的内容区块，支持水平与垂直两种方向。"
      overview={
        <div className="flex h-5 w-full items-center gap-3 text-sm text-muted-foreground">
          <span>编辑</span>
          <Separator orientation="vertical" />
          <span>分享</span>
          <Separator orientation="vertical" />
          <span>删除</span>
        </div>
      }
      scenarioExamples={separatorScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "horizontal" ? (
          <div className="flex w-[200px] flex-col gap-3">
            <p className="text-sm">第一段内容</p>
            <Separator />
            <p className="text-sm">第二段内容</p>
          </div>
        ) : (
          <div className="flex h-5 items-center gap-3 text-sm">
            <span>编辑</span>
            <Separator orientation="vertical" />
            <span>分享</span>
            <Separator orientation="vertical" />
            <span>删除</span>
          </div>
        )
      }
      importCode={`import { Separator } from "@/components/ui/separator"`}
      usageCode={`<div className="flex flex-col gap-4">\n  <p className="text-sm">第一段内容</p>\n  <Separator />\n  <p className="text-sm">第二段内容</p>\n</div>`}
      propRows={separatorPropRows}
      semanticDomRows={separatorSemanticDomRows}
      doDontRows={separatorDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function SidebarPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  const sidebarPreview = (
    <div className="relative h-[260px] w-[200px] overflow-hidden rounded-lg border">
      <SidebarProvider style={{ "--sidebar-width": "200px" } as React.CSSProperties}>
        <Sidebar collapsible="none" className="h-[260px] border-r">
          <SidebarHeader>
            <span className="px-2 text-sm font-semibold">fx-ui</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>工作台</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <HomeIcon /> 概览
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FolderIcon /> 项目列表
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  )

  return (
    <StandardDocPage
      slug="sidebar"
      title="Sidebar 侧边栏"
      lead="后台类产品最常见的主导航容器，提供分组菜单、折叠状态管理与移动端适配，需配合 SidebarProvider 使用。"
      overview={sidebarPreview}
      scenarioExamples={sidebarScenarioExamples}
      renderScenarioPreview={() => sidebarPreview}
      importCode={`import {\n  Sidebar,\n  SidebarContent,\n  SidebarGroup,\n  SidebarGroupContent,\n  SidebarGroupLabel,\n  SidebarHeader,\n  SidebarMenu,\n  SidebarMenuButton,\n  SidebarMenuItem,\n  SidebarProvider,\n} from "@/components/ui/sidebar"`}
      usageCode={`<SidebarProvider>\n  <Sidebar>\n    <SidebarHeader>fx-ui</SidebarHeader>\n    <SidebarContent>\n      <SidebarGroup>\n        <SidebarGroupLabel>工作台</SidebarGroupLabel>\n        <SidebarGroupContent>\n          <SidebarMenu>\n            <SidebarMenuItem>\n              <SidebarMenuButton isActive>概览</SidebarMenuButton>\n            </SidebarMenuItem>\n          </SidebarMenu>\n        </SidebarGroupContent>\n      </SidebarGroup>\n    </SidebarContent>\n  </Sidebar>\n  <SidebarInset>{/* 页面主体 */}</SidebarInset>\n</SidebarProvider>`}
      propRows={sidebarPropRows}
      semanticDomRows={sidebarSemanticDomRows}
      doDontRows={sidebarDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function SpinnerPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="spinner"
      title="Spinner 加载指示器"
      lead="用旋转图标提示用户当前正在加载或处理中，常嵌入按钮或区块中央。"
      overview={
        <>
          <Spinner className="size-6" />
          <span className="text-sm text-muted-foreground">本质是带 animate-spin 的图标，可自由控制大小</span>
        </>
      }
      scenarioExamples={spinnerScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "inline" ? (
          <Button size="sm" disabled>
            <Spinner className="mr-1.5" />
            提交中…
          </Button>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
            <Spinner className="size-5" />
            正在加载…
          </div>
        )
      }
      importCode={`import { Spinner } from "@/components/ui/spinner"`}
      usageCode={`<Button disabled>\n  <Spinner className="mr-1.5" />\n  提交中…\n</Button>`}
      propRows={spinnerPropRows}
      semanticDomRows={spinnerSemanticDomRows}
      doDontRows={spinnerDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function TabsPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="tabs"
      title="Tabs 标签页"
      lead="在同一区域内切换并列的内容分组，支持默认分段样式与轻量下划线样式。"
      overview={
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="detail">详情</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-2 text-sm text-muted-foreground">概览内容…</TabsContent>
          <TabsContent value="detail" className="pt-2 text-sm text-muted-foreground">详情内容…</TabsContent>
        </Tabs>
      }
      scenarioExamples={tabsScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "default" ? (
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="detail">详情</TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <Tabs defaultValue="all">
            <TabsList variant="line">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="active">进行中</TabsTrigger>
              <TabsTrigger value="done">已完成</TabsTrigger>
            </TabsList>
          </Tabs>
        )
      }
      importCode={`import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"`}
      usageCode={`<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">概览</TabsTrigger>\n    <TabsTrigger value="detail">详情</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">概览内容…</TabsContent>\n  <TabsContent value="detail">详情内容…</TabsContent>\n</Tabs>`}
      propRows={tabsPropRows}
      semanticDomRows={tabsSemanticDomRows}
      doDontRows={tabsDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function TogglePage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="toggle"
      title="Toggle 切换按钮"
      lead="用于切换某个独立的二元状态，如收藏、静音、文本加粗。"
      overview={
        <>
          <Toggle aria-label="加粗"><BoldIcon /></Toggle>
          <Toggle aria-label="斜体" variant="outline"><ItalicIcon /></Toggle>
        </>
      }
      scenarioExamples={toggleScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "icon" ? (
          <Toggle aria-label="加粗"><BoldIcon /></Toggle>
        ) : (
          <Toggle variant="outline" size="sm" className="gap-1.5">
            <ItalicIcon /> 斜体
          </Toggle>
        )
      }
      importCode={`import { Toggle } from "@/components/ui/toggle"`}
      usageCode={`<Toggle aria-label="加粗">\n  <BoldIcon />\n</Toggle>`}
      propRows={togglePropRows}
      semanticDomRows={toggleSemanticDomRows}
      doDontRows={toggleDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}

function ToggleGroupPage({ actions, lang }: { actions: React.ReactNode; lang: Lang }) {
  return (
    <StandardDocPage
      slug="toggle-group"
      title="Toggle Group 切换按钮组"
      lead="把多个 Toggle 组合成一组，支持互斥单选与并行多选两种模式。"
      overview={
        <ToggleGroup defaultValue={["left"]}>
          <ToggleGroupItem value="left">左对齐</ToggleGroupItem>
          <ToggleGroupItem value="center">居中</ToggleGroupItem>
          <ToggleGroupItem value="right">右对齐</ToggleGroupItem>
        </ToggleGroup>
      }
      scenarioExamples={toggleGroupScenarioExamples}
      renderScenarioPreview={(id) =>
        id === "single" ? (
          <ToggleGroup defaultValue={["left"]} className="scale-90">
            <ToggleGroupItem value="left">左</ToggleGroupItem>
            <ToggleGroupItem value="center">中</ToggleGroupItem>
            <ToggleGroupItem value="right">右</ToggleGroupItem>
          </ToggleGroup>
        ) : (
          <ToggleGroup multiple variant="outline">
            <ToggleGroupItem value="bold"><BoldIcon /></ToggleGroupItem>
            <ToggleGroupItem value="italic"><ItalicIcon /></ToggleGroupItem>
            <ToggleGroupItem value="underline"><UnderlineIcon /></ToggleGroupItem>
          </ToggleGroup>
        )
      }
      importCode={`import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"`}
      usageCode={`<ToggleGroup defaultValue={["left"]}>\n  <ToggleGroupItem value="left">左对齐</ToggleGroupItem>\n  <ToggleGroupItem value="center">居中</ToggleGroupItem>\n  <ToggleGroupItem value="right">右对齐</ToggleGroupItem>\n</ToggleGroup>`}
      propRows={toggleGroupPropRows}
      semanticDomRows={toggleGroupSemanticDomRows}
      doDontRows={toggleGroupDoDontRows}
      actions={actions}
      lang={lang}
    />
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
