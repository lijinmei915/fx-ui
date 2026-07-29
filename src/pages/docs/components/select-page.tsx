import { PageLead } from "@/components/fx/page-lead"
import { SectionLead } from "@/components/fx/section-lead"
import { DocDoDont } from "@/components/fx/doc-do-dont"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { docsSpacing } from "@/lib/docs-spacing"
import type { StandardDocLang } from "@/pages/docs/components/standard-doc-page"

export const selectAnchors = [
  { label: "调试台", href: "#select-playground" },
  { label: "API", href: "#select-props" },
  { label: "语义 DOM", href: "#select-semantic-dom" },
  { label: "正误示例", href: "#select-do-dont" },
]

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const selectPropRows = [
  { prop: "items", type: "Select item data[]", defaultValue: "—", desc: "可选的数据集合；用于让 SelectValue 根据 value 解析显示内容" },
  { prop: "value / defaultValue", type: "string | string[] | null", defaultValue: "—", desc: "受控 / 非受控的当前选中值；多选时为数组" },
  { prop: "onValueChange", type: "(value: string | string[] | null) => void", defaultValue: "—", desc: "选中值变化时的回调" },
  { prop: "multiple", type: "boolean", defaultValue: "false", desc: "开启多选，value / defaultValue 使用数组" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用整个选择器" },
  { prop: "variant", type: "\"outline\" | \"borderless\"", defaultValue: "outline", desc: "触发器样式：有边框 / 无边框" },
  { prop: "size", type: "\"xs\" | \"sm\" | \"md\"", defaultValue: "sm", desc: "SelectTrigger 的尺寸：xs=24px、sm=28px（默认）、md=32px" },
  { prop: "size（SelectContent）", type: "\"xs\" | \"sm\" | \"md\"", defaultValue: "sm", desc: "下拉选项字号尺寸，应与 SelectTrigger 传相同值" },
  { prop: "clearable（SelectTrigger）", type: "boolean", defaultValue: "false", desc: "为悬停或聚焦时显示的同级 SelectClear 预留箭头左侧热区；不负责清除状态" },
  { prop: "value（SelectItem）", type: "string", defaultValue: "—", desc: "选项的取值，需要在选项集合内唯一" },
  { prop: "disabled（SelectItem）", type: "boolean", defaultValue: "false", desc: "禁用单个选项" },
  { prop: "SelectControl / SelectClear", type: "组合子组件", defaultValue: "—", desc: "组织触发器与总清除动作；有值时在悬停或聚焦后显示于箭头左侧，必须与 SelectTrigger 同级" },
  { prop: "SelectSeparator", type: "子组件", defaultValue: "—", desc: "分隔不同 SelectGroup，不用普通边框元素代替" },
  { prop: "SelectScrollUpButton / SelectScrollDownButton", type: "子组件", defaultValue: "内置", desc: "长列表滚动时由 SelectContent 内部提供边缘滚动反馈" },
  { prop: "其他输入", type: "受控 value + Input 组合", defaultValue: "—", desc: "选择 value=\"other\" 后在 SelectContent 内渲染 Input；必填校验由输入框 aria-invalid 承载" },
  { prop: "items / maxVisible / overflow / onRemove（SelectMultiValue）", type: "SelectMultiValueItem[] / number / \"collapse\" | \"scroll\" / (value) => void", defaultValue: "— / 2 / collapse / —", desc: "多选已选值、完整标签数量上限、溢出模式与单项删除；collapse 按容器宽度从末项折叠为 +n，scroll 保持单行横向滚动" },
  { prop: "SelectItemIndicator", type: "子组件", defaultValue: "—", desc: "在多选 SelectItem 中显示 Checkbox 选中反馈，状态由 SelectItem 驱动" },
  { prop: "side / align / alignItemWithTrigger", type: "SelectContent props", defaultValue: "bottom / center / false", desc: "控制浮层位置、对齐和是否将已选项对齐触发器；默认从触发器下方展开" },
]

export const selectSemanticDomRows = [
  { part: "data-slot=\"select-trigger\"", desc: "选择器触发按钮，承载边框、圆角、尺寸样式" },
  { part: "data-slot=\"select-control\"", desc: "触发器与清除动作的定位容器" },
  { part: "data-slot=\"select-value\"", desc: "展示当前选中值或 placeholder 的文本节点" },
  { part: "data-slot=\"select-content\"", desc: "下拉浮层容器，承载阴影、动效、滚动" },
  { part: "data-slot=\"select-item\"", desc: "单个选项节点；选中态使用品牌色文字表达" },
  { part: "data-slot=\"select-item-indicator\"", desc: "多选项的 Checkbox 选中反馈" },
  { part: "data-slot=\"select-multi-value-remove\"", desc: "删除单个已选标签的按钮" },
  { part: "data-slot=\"select-group\" / \"select-label\"", desc: "选项分组容器与分组标题" },
  { part: "data-slot=\"select-clear\" / \"select-separator\"", desc: "清除动作与选项组分隔结构" },
  { part: "data-slot=\"select-scroll-up-button\" / \"select-scroll-down-button\"", desc: "长列表的上下滚动反馈" },
  { part: "data-slot=\"select-multi-value\" / data-overflow / \"select-overflow-count\"", desc: "多选已选值；scroll 为横向滚动，collapse 为超出 maxVisible 后的 +n 折叠计数" },
]

export const selectDoDontRows = [
  { do: "用 SelectValue 的 placeholder 表达未选择态。", dont: "手写一个空字符串选项当作占位符。" },
  { do: "选项较多时用 SelectGroup + SelectLabel 分组。", dont: "把分组标题写成普通禁用选项。" },
  { do: "多选筛选用 Select multiple 和数组值。", dont: "用自由 tags 冒充多选选择器。" },
  { do: "本地搜索作为 SelectContent 内组合，远程搜索沉淀为 fx 组合。", dont: "给 Select 发明 showSearch / remoteSearch 这类不存在的 prop。" },
  { do: "其他输入用受控 value + SelectContent 内 Input 组合。", dont: "给 Select 发明 allowOther / otherRequired 这类源码没有的 prop。" },
  { do: "清除选择用受控 value + 外部动作。", dont: "在 SelectTrigger 里嵌套 button 或发明 allowClear prop。" },
  { do: "无边框场景用 SelectTrigger variant=\"borderless\"。", dont: "在调用处用 className 覆盖 border / bg。" },
  { do: "用 size 属性切换紧凑/默认尺寸。", dont: "用 className 覆盖高度、内边距来改尺寸。" },
  { do: "用 disabled 表达不可操作。", dont: "靠样式降低透明度但仍可点击触发。" },
]

export function SelectPage({ actions, lang, playground, propRows, semanticDomRows, doDontRows }: {
  actions: React.ReactNode
  lang: StandardDocLang
  playground: React.ReactNode
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="select" className="flex flex-col gap-2"><PageLead crumb={lang === "en" ? "Components / Select" : "组件 / 选择器"} title="Select 选择器" lead="从一组选项中选择一个或多个值，用于表单字段、筛选条件等场景。" actions={actions} /></section>
      <section id="select-playground" className={docsSpacing.sectionStack}><SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Tune content, structure, appearance, behavior, and semantics through real Select props and verified compositions." : "通过真实 Select 属性与已验证组合，依次调试内容、结构、外观、行为和语义。"} />{playground}</section>
      <section id="select-props" className={docsSpacing.sectionStack}><h2 className="text-xl font-bold tracking-tight">API 属性</h2><DocSurfaceTableCard><Table className="min-w-[640px]"><TableHeader><TableRow><TableHead className="pl-4">属性</TableHead><TableHead>类型</TableHead><TableHead>默认值</TableHead><TableHead className="pr-4">描述</TableHead></TableRow></TableHeader><TableBody>{propRows.map((row) => <TableRow key={row.prop}><TableCell className="pl-4 font-medium">{row.prop}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
      <section id="select-semantic-dom" className={docsSpacing.sectionStack}><SectionLead title="语义 DOM" description="Select 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。" /><DocSurfaceTableCard><Table className="min-w-[640px]"><TableHeader><TableRow><TableHead className="pl-4">部位</TableHead><TableHead className="pr-4">说明</TableHead></TableRow></TableHeader><TableBody>{semanticDomRows.map((row) => <TableRow key={row.part}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
      <section id="select-do-dont" className={docsSpacing.sectionStack}><SectionLead title="正误示例" description="工程师和 AI 生成代码最容易犯的错误，照着做即可。" /><DocDoDont rows={doDontRows} /></section>
    </div>
  )
}
