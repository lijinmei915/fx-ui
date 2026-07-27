import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { DocDoDont } from "@/components/fx/doc-do-dont"
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { PageLead as FxPageLead } from "@/components/fx/page-lead"
import { SectionLead } from "@/components/fx/section-lead"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { docsSpacing } from "@/lib/docs-spacing"
import { getDisplayTitle, PageTitleMetaContext } from "@/lib/page-title-meta"
import { CopyCodeBlock, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { useContext, type ReactNode } from "react"
import { TimePickerPreview } from "@/pages/docs/components/time-picker-preview"
import { componentPlaygroundStoriesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const timePickerManifest = componentPlaygroundsManifest.customPlaygrounds?.timePicker
if (!timePickerManifest) throw new Error("Missing customPlaygrounds.timePicker manifest entry")

export const timePickerAnchors = [
  { label: "使用方式", href: "#time-picker-usage" },
  { label: "API", href: "#time-picker-props" },
  { label: "语义 DOM", href: "#time-picker-semantic-dom" },
  { label: "正误示例", href: "#time-picker-do-dont" },
]

export const timePickerPropRows = [
  { prop: "value / defaultValue", type: "string", defaultValue: "—", desc: "受控 / 非受控的时间值，格式为 HH:mm" },
  { prop: "onValueChange", type: "(value: string) => void", defaultValue: "—", desc: "时间变化回调" },
  { prop: "mode", type: "\"popover\" | \"native\"", defaultValue: "popover", desc: "弹层时间列表或原生 time input" },
  { prop: "step", type: "15 | 30 | 60", defaultValue: "30", desc: "分钟步进" },
  { prop: "size", type: "\"xs\" | \"sm\" | \"md\"", defaultValue: "sm", desc: "尺寸：xs=24px、sm=28px、md=32px" },
  { prop: "clearable", type: "boolean", defaultValue: "false", desc: "有值时是否展示清除入口" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用时间选择" },
  { prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "标记校验失败" },
]

export const timePickerSemanticDomRows = [
  { part: "data-slot=\"time-picker\"", desc: "时间选择器触发器 / 原生输入组合根节点" },
  { part: "data-slot=\"time-picker-value\"", desc: "弹层模式下展示当前时间或占位文本" },
  { part: "data-slot=\"time-picker-clear\"", desc: "清除当前时间值的入口" },
  { part: "data-slot=\"time-picker-list\"", desc: "弹层内的时间选项列表" },
  { part: "aria-invalid", desc: "校验失败语义，同时驱动错误边框" },
  { part: "disabled", desc: "禁用语义，阻止交互" },
]

export const timePickerDoDontRows = [
  { do: "时间选择用 TimePicker，不把普通 Select 临时改造成时间控件。", dont: "在 SelectItem 里手写一长串时间选项。" },
  { do: "范围选择用两个 TimePicker 组合。", dont: "一个控件里拼 start-end 字符串。" },
  { do: "错误态用 Field + aria-invalid + FieldError。", dont: "在页面里手写红色提示或覆盖边框。" },
  { do: "尺寸用 size，步进用 step。", dont: "用 className 改高度或临时过滤时间选项。" },
]

export const timePickerImportCodeForPlayground = `import { TimePicker } from "@/components/fx/time-picker"`

const timePickerModeOptions = [
  { value: "popover", label: "弹层", labelEn: "Popover", intent: "展示时间列表，适合设计稿里的选择器形态。", constraint: "弹层内容由 TimePicker 内部维护，业务页面不重写时间列表。" },
  { value: "native", label: "原生", labelEn: "Native", intent: "使用浏览器原生时间输入，适合表单快速录入。", constraint: "原生模式仍走 InputGroup，不手写图标定位。" },
]
const timePickerValueStateOptions = [
  { value: "placeholder", label: "占位", labelEn: "Placeholder", intent: "尚未选择时提示用户选择时间。", constraint: "占位由组件 placeholder 承载，不写假值。" },
  { value: "selected", label: "已选", labelEn: "Selected", intent: "展示已有时间值。", constraint: "用 value / defaultValue 表达时间值，格式使用 HH:mm。" },
  { value: "clearable", label: "可清除", labelEn: "Clearable", intent: "已选后允许快速清空。", constraint: "只在有值且非禁用时展示清除入口。" },
]
const timePickerStateOptions = [
  { value: "normal", label: "默认", labelEn: "Default", intent: "默认可选择状态。", constraint: "不额外传状态 prop。" },
  { value: "hover", label: "悬停", labelEn: "Hover", intent: "鼠标经过时提示可点击。", constraint: "悬停是原生交互态；调试台只用 data-state 预览。" },
  { value: "focus", label: "聚焦", labelEn: "Focus", intent: "键盘焦点时显示边框反馈。", constraint: "由 focus-visible 驱动，不在调用处覆盖边框。" },
  { value: "open", label: "展开", labelEn: "Open", intent: "弹层打开，用户正在选择时间。", constraint: "只适用于弹层模式；原生模式由浏览器接管。" },
  { value: "invalid", label: "报错", labelEn: "Error", intent: "时间未填或不合法。", constraint: "Field 设置 data-invalid，TimePicker 设置 aria-invalid，错误文案放 FieldError。" },
  { value: "disabled", label: "禁用", labelEn: "Disabled", intent: "当前不可选择。", constraint: "使用 disabled，不用 opacity 或 pointer-events 假装禁用。" },
]
const timePickerStepOptions = [
  { value: "15", label: "15分钟", labelEn: "15 min", intent: "用于需要较精细预约或排班的场景。", constraint: "选项会更多，避免在低频表单里默认使用。" },
  { value: "30", label: "30分钟", labelEn: "30 min", intent: "常规半小时粒度，是默认步进。", constraint: "默认可省略 step。" },
  { value: "60", label: "60分钟", labelEn: "60 min", intent: "用于小时级筛选。", constraint: "只用于不关心分钟的业务。" },
]
const timePickerSizeOptions = [
  { value: "xs", label: "超小24", labelEn: "XS 24", intent: "用于高密度筛选条。", constraint: "只传 size=\"xs\"，不覆盖高度。" },
  { value: "sm", label: "默认28", labelEn: "Default 28", intent: "常规表单和筛选默认尺寸。", constraint: "默认尺寸可省略 size。" },
  { value: "md", label: "中32", labelEn: "Medium 32", intent: "用于更宽松表单。", constraint: "只传 size=\"md\"，不覆盖高度。" },
]

function buildTimePickerPlaygroundCode(values: Record<string, string>) {
  const modeProp = values.mode === "popover" ? "" : ` mode="native"`
  const sizeProp = values.size === "sm" ? "" : ` size="${values.size}"`
  const stepProp = values.step === "30" ? "" : ` step={${values.step}}`
  const hasValue = values.valueState === "selected" || values.valueState === "clearable"
  const valueProp = hasValue ? ` defaultValue="09:30"` : ""
  const clearableProp = values.valueState === "clearable" ? " clearable" : ""
  const disabledProp = values.state === "disabled" ? " disabled" : ""
  const invalidProp = values.state === "invalid" ? " aria-invalid" : ""
  if (values.capability === "range") {
    return `<div className="flex items-center gap-2">
  <TimePicker${modeProp}${sizeProp}${stepProp} placeholder="开始时间"${disabledProp}${invalidProp} />
  <span className="text-muted-foreground">至</span>
  <TimePicker${modeProp}${sizeProp}${stepProp} placeholder="结束时间"${disabledProp}${invalidProp} />
</div>`
  }
  return `<TimePicker${modeProp}${sizeProp}${stepProp}${valueProp}${clearableProp}${disabledProp}${invalidProp} />`
}

export const timePickerPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.timePicker",
  stories: componentPlaygroundStoriesFromManifest(timePickerManifest),
  props: [
    { key: "mode", zh: "呈现方式", en: "Mode", propName: "mode", type: "segment", options: timePickerModeOptions },
    { key: "valueState", zh: "值状态", en: "Value state", propName: "value", type: "segment", options: timePickerValueStateOptions },
    { key: "state", zh: "交互状态", en: "State", propName: "state", type: "segment", options: timePickerStateOptions },
    { key: "step", zh: "步进", en: "Step", propName: "step", type: "segment", options: timePickerStepOptions },
    { key: "size", zh: "尺寸", en: "Size", propName: "size", type: "segment", options: timePickerSizeOptions },
  ],
  initial: { capability: "basic", mode: "popover", valueState: "placeholder", state: "normal", step: "30", size: "sm" },
  guidanceKey: "mode",
  renderOne: (values: Record<string, string>) => <TimePickerPreview values={values} />,
  genCode: (values: Record<string, string>) => `${timePickerImportCodeForPlayground}\n\n${buildTimePickerPlaygroundCode(values)}`,
}

export function TimePickerPage({
  actions,
  lang,
  playgroundConfig,
  importCode,
  propRows,
  semanticDomRows,
  doDontRows,
}: {
  actions: ReactNode
  lang: StandardDocLang
  playgroundConfig: ComponentPlaygroundConfig
  importCode: string
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  const titleMeta = useContext(PageTitleMetaContext)
  const displayTitle = getDisplayTitle("TimePicker 时间选择器", lang === "en" ? undefined : titleMeta)
  const usageCode = `<Field data-invalid={error ? true : undefined}>\n  <FieldLabel>提醒时间</FieldLabel>\n  <TimePicker value={time} onValueChange={setTime} aria-invalid={error ? true : undefined} />\n  {error ? <FieldError>请选择时间</FieldError> : null}\n</Field>`

  return <div className={docsSpacing.pageStack}>
    <section id="time-picker" className="flex flex-col gap-2"><FxPageLead crumb={lang === "en" ? "Components / Time Picker" : "组件 / 时间选择器"} title={displayTitle} titleMeta={lang === "en" ? undefined : titleMeta} lead="用于选择 HH:mm 时间点；属于 fx 组合组件，由 Input、Popover 和 Button 组合而成，不作为 Select 的变体。" actions={actions} /></section>
    <section id="time-picker-playground" className={docsSpacing.sectionStack}><SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Choose a basic or range preset, then tune mode, value state, interaction state, step, and size." : "先选择基础时间或时间范围场景，再调节呈现方式、值状态、交互状态、步进和尺寸。"} /><ComponentPlayground config={playgroundConfig} lang={lang} /></section>
    <section id="time-picker-usage" className={docsSpacing.sectionStack}><SectionLead title="使用方式" description="把 import 和 JSX 调用复制到业务页面里使用。" /><DocSurfaceCard><div className="grid gap-4 p-5"><CopyCodeBlock code={importCode} label="Import" lang={lang} /><CopyCodeBlock code={usageCode} label="调用" lang={lang} /></div></DocSurfaceCard></section>
    <section id="time-picker-props" className={docsSpacing.sectionStack}><SectionLead title="API 属性" /><DocSurfaceTableCard><Table className="min-w-[680px]"><TableHeader><TableRow><TableHead className="pl-4">属性</TableHead><TableHead>类型</TableHead><TableHead>默认值</TableHead><TableHead className="pr-4">描述</TableHead></TableRow></TableHeader><TableBody>{propRows.map((row) => <TableRow key={row.prop}><TableCell className="pl-4 font-medium">{row.prop}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="time-picker-semantic-dom" className={docsSpacing.sectionStack}><SectionLead title="语义 DOM" description="TimePicker 保留可定位的 data-slot，便于测试和 AI 读取组件结构。" /><DocSurfaceTableCard><Table className="min-w-[620px]"><TableHeader><TableRow><TableHead className="pl-4">部位</TableHead><TableHead className="pr-4">说明</TableHead></TableRow></TableHeader><TableBody>{semanticDomRows.map((row) => <TableRow key={row.part}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard></section>
    <section id="time-picker-do-dont" className={docsSpacing.sectionStack}><SectionLead title="正误示例" description="工程师和 AI 生成代码最容易犯的错误，照着做即可。" /><DocDoDont rows={doDontRows} /></section>
  </div>
}
