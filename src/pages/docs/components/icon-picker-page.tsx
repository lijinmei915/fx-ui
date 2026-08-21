import { IconPicker, type IconPickerOption } from "@/components/fx/icon-picker"
import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import {
  BellIcon,
  BookOpenIcon,
  BoxIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  ChartLineIcon,
  ChartPieIcon,
  ChecklistIcon,
  ClockIcon,
  Code2Icon,
  ComponentsIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileTextIcon,
  FolderIcon,
  HeadsetIcon,
  HomeIcon,
  InboxIcon,
  LayoutGridIcon,
  ListIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PackageIcon,
  SchoolIcon,
  SettingsIcon,
  StarIcon,
  TargetIcon,
  UserIcon,
} from "@/lib/icons"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const iconPickerManifest = manifest.customPlaygrounds!.iconPicker

export const iconPickerOptions: IconPickerOption[] = [
  { id: "home", label: "首页", icon: HomeIcon, keywords: ["home", "导航"] },
  { id: "user", label: "用户", icon: UserIcon, keywords: ["person", "账号"] },
  { id: "settings", label: "设置", icon: SettingsIcon, keywords: ["setting", "配置"] },
  { id: "calendar", label: "日历", icon: CalendarIcon, keywords: ["date", "日期"] },
  { id: "mail", label: "邮件", icon: MailIcon, keywords: ["email", "消息"] },
  { id: "bell", label: "通知", icon: BellIcon, keywords: ["notice", "提醒"] },
  { id: "folder", label: "文件夹", icon: FolderIcon, keywords: ["directory", "目录"] },
  { id: "file", label: "文档", icon: FileTextIcon, keywords: ["document", "文件"] },
  { id: "inbox", label: "收件箱", icon: InboxIcon, keywords: ["mailbox"] },
  { id: "message", label: "会话", icon: MessageCircleIcon, keywords: ["chat", "沟通"] },
  { id: "database", label: "数据库", icon: DatabaseIcon, keywords: ["data", "存储"] },
  { id: "package", label: "包裹", icon: PackageIcon, keywords: ["box", "商品"] },
  { id: "building", label: "企业", icon: BuildingIcon, keywords: ["company", "公司"] },
  { id: "briefcase", label: "业务", icon: BriefcaseIcon, keywords: ["business", "工作"] },
  { id: "school", label: "学校", icon: SchoolIcon, keywords: ["education", "教育"] },
  { id: "headset", label: "客服", icon: HeadsetIcon, keywords: ["support", "服务"] },
  { id: "chart-line", label: "趋势图", icon: ChartLineIcon, keywords: ["chart", "数据"] },
  { id: "chart-pie", label: "饼图", icon: ChartPieIcon, keywords: ["chart", "数据"] },
  { id: "target", label: "目标", icon: TargetIcon, keywords: ["goal"] },
  { id: "map-pin", label: "位置", icon: MapPinIcon, keywords: ["location", "地图"] },
  { id: "clock", label: "时间", icon: ClockIcon, keywords: ["time"] },
  { id: "checklist", label: "清单", icon: ChecklistIcon, keywords: ["todo", "任务"] },
  { id: "grid", label: "网格", icon: LayoutGridIcon, keywords: ["layout", "布局"] },
  { id: "list", label: "列表", icon: ListIcon, keywords: ["layout", "布局"] },
  { id: "components", label: "组件", icon: ComponentsIcon, keywords: ["component", "模块"] },
  { id: "code", label: "代码", icon: Code2Icon, keywords: ["developer", "开发"] },
  { id: "credit-card", label: "支付", icon: CreditCardIcon, keywords: ["payment", "银行卡"] },
  { id: "book", label: "知识库", icon: BookOpenIcon, keywords: ["docs", "文档"] },
  { id: "box", label: "对象", icon: BoxIcon, keywords: ["object"] },
  { id: "star", label: "收藏", icon: StarIcon, keywords: ["favorite"] },
]

function renderIconPicker(values: Record<string, string>) {
  const mode = values.mode ?? "select"
  const allowUpload = values.allowUpload === "true" || mode === "upload"
  return (
    <IconPicker
      key={JSON.stringify(values)}
      icons={mode === "empty" ? [] : iconPickerOptions}
      defaultValue="home"
      defaultQuery={mode === "search" ? "用户" : mode === "empty" ? "不存在" : ""}
      allowUpload={allowUpload}
      defaultTab={mode === "upload" ? "upload" : "library"}
      loading={mode === "loading"}
      error={mode === "error" ? "加载失败，请刷新重试" : undefined}
      onRetry={mode === "error" ? () => undefined : undefined}
    />
  )
}

export const iconPickerPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.iconPicker",
  props: componentPlaygroundPropsFromManifest(iconPickerManifest),
  initial: iconPickerManifest.initial,
  guidanceKey: iconPickerManifest.guidanceKey,
  previewItemsClassName: "w-full",
  renderOne: renderIconPicker,
  genCode: (values) => {
    const attrs = [values.allowUpload === "true" ? "allowUpload" : ""].filter(Boolean).join(" ")
    return `import { IconPicker } from "@/components/fx/icon-picker"\n\n<IconPicker icons={icons} ${attrs} onValueChange={setIconId} />`
  },
}

export const iconPickerAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#icon-picker-playground" },
  { label: "API", href: "#icon-picker-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#icon-picker-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#icon-picker-do-dont" },
]

export const iconPickerPropRows: PropRow[] = [
  { prop: "icons", type: "IconPickerOption[]", defaultValue: "—", desc: "图标数据；icon 必须从 @/lib/icons 传入，id、名称和关键词参与检索。" },
  { prop: "value / defaultValue", type: "string", defaultValue: "—", desc: "受控或非受控的图标 ID。" },
  { prop: "onValueChange", type: "(id, option) => void", defaultValue: "—", desc: "选择、Enter 或随机分配后返回图标 ID 与完整对象。" },
  { prop: "query / defaultQuery", type: "string", defaultValue: '""', desc: "受控或非受控搜索词，实时匹配 id、label 和 keywords。" },
  { prop: "onQueryChange", type: "(query) => void", defaultValue: "—", desc: "搜索词变化回调，可用于服务端检索或埋点。" },
  { prop: "allowUpload", type: "boolean", defaultValue: "false", desc: "开启后显示图标库/自定义上传 Tabs；关闭时不显示 Tabs。" },
  { prop: "accept", type: "string", defaultValue: "SVG/PNG/JPEG/WebP", desc: "上传文件 accept 规则。" },
  { prop: "onUpload", type: "(file: File) => void", defaultValue: "—", desc: "选择上传文件后交给业务侧保存并生成图标 ID。" },
  { prop: "loading", type: "boolean", defaultValue: "false", desc: "图标数据加载中。" },
  { prop: "error / onRetry", type: "string / () => void", defaultValue: "—", desc: "加载失败文案和重试命令。" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用搜索、选择、随机分配与上传。" },
  { prop: "className", type: "string", defaultValue: "—", desc: "只用于根节点宽度和外部布局。" },
]

export const iconPickerSemanticDomRows: SemanticDomRow[] = [
  { part: 'data-slot="icon-picker"', desc: "根节点；data-mode 反映当前运行态。" },
  { part: 'data-slot="icon-picker-grid"', desc: "可键盘导航的图标网格。" },
  { part: 'data-slot="icon-picker-loading"', desc: "图标数据加载态。" },
  { part: 'data-slot="icon-picker-error"', desc: "图标数据加载失败态。" },
  { part: 'data-slot="icon-picker-empty"', desc: "搜索无结果态。" },
]

export const iconPickerDoDontRows: DoDontRow[] = [
  { do: "图标对象统一从 @/lib/icons 导入，并提供稳定 id、名称和关键词。", dont: "在页面里手写 SVG 或引入第二个图标库。" },
  { do: "让 loading、error、query 和上传数据驱动运行态。", dont: "暴露 select/search/error 等纯视觉 mode prop。" },
  { do: "使用 value + onValueChange 保存图标 ID。", dont: "查询 DOM class 或图标序号推断选择值。" },
]

export function IconPickerPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="icon-picker"
      title="IconPicker 图标选择器"
      lead="检索、键盘选择、随机分配或上传图标；使用项目 Tabler 图标出口与 fx-ui 语义 token。"
      playground={<ComponentPlayground config={iconPickerPlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { IconPicker } from "@/components/fx/icon-picker"'}
      usageCode={'<IconPicker icons={icons} value={iconId} onValueChange={setIconId} />'}
      propRows={iconPickerPropRows}
      semanticDomRows={iconPickerSemanticDomRows}
      doDontRows={iconPickerDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
