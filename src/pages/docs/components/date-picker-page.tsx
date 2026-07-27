import { DatePicker } from "@/components/fx/date-picker"
import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, componentPlaygroundStoriesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const datePickerManifest = componentPlaygroundsManifest.customPlaygrounds!.datePicker

function datePickerValue(value: string) {
  return value === "selected" ? new Date(2026, 6, 15) : undefined
}

function renderDatePickerPlayground(values: Record<string, string>) {
  const props = {
    size: values.size as "xs" | "sm" | "md",
    clearable: values.clearable === "true",
    disabled: values.disabled === "true",
    "aria-invalid": values.invalid === "true",
    defaultValue: datePickerValue(values.value),
  } as const
  if (values.scenario === "range") {
    return <div className="flex flex-wrap items-center gap-2"><DatePicker {...props} placeholder="开始日期" /><span className="text-muted-foreground">至</span><DatePicker {...props} defaultValue={undefined} placeholder="结束日期" /></div>
  }
  return <DatePicker {...props} />
}

function genDatePickerCode(values: Record<string, string>) {
  const attrs = [`size="${values.size}"`, `clearable={${values.clearable === "true"}}`, `disabled={${values.disabled === "true"}}`, `aria-invalid={${values.invalid === "true"}}`]
  if (values.value === "selected") attrs.push("defaultValue={new Date(2026, 6, 15)}")
  if (values.scenario === "range") return `import { DatePicker } from "@/components/fx/date-picker"\n\n<div className="flex items-center gap-2">\n  <DatePicker ${attrs.join(" ")} placeholder="开始日期" />\n  <span>至</span>\n  <DatePicker ${attrs.filter((attr) => !attr.startsWith("defaultValue")).join(" ")} placeholder="结束日期" />\n</div>`
  return `import { DatePicker } from "@/components/fx/date-picker"\n\n<DatePicker ${attrs.join(" ")} />`
}

export const datePickerPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.datePicker",
  props: componentPlaygroundPropsFromManifest(datePickerManifest),
  initial: datePickerManifest.initial,
  stories: componentPlaygroundStoriesFromManifest(datePickerManifest),
  guidanceKey: datePickerManifest.guidanceKey,
  renderOne: renderDatePickerPlayground,
  genCode: genDatePickerCode,
}

export const datePickerAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#date-picker-playground" },
  { label: "API", href: "#date-picker-props" },
  { label: "语义 DOM", href: "#date-picker-semantic-dom" },
  { label: "正误示例", href: "#date-picker-do-dont" },
]

export const datePickerPropRows = [
  { prop: "value / defaultValue", type: "Date", defaultValue: "—", desc: "受控 / 非受控日期值。" },
  { prop: "onValueChange", type: "(value: Date | undefined) => void", defaultValue: "—", desc: "选择或清除日期时的回调。" },
  { prop: "placeholder", type: "string", defaultValue: "请选择日期", desc: "未选值时显示的提示。" },
  { prop: "size", type: "xs | sm | md", defaultValue: "sm", desc: "触发器尺寸：24 / 28 / 32。" },
  { prop: "clearable", type: "boolean", defaultValue: "false", desc: "有值时展示清除入口。" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁止打开日历或修改日期。" },
  { prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "标记字段校验失败。" },
]

export const datePickerSemanticDomRows = [
  { part: "data-slot=\"date-picker\"", desc: "日期选择器控件根节点。" },
  { part: "data-slot=\"date-picker-trigger\"", desc: "打开日历的日期触发器。" },
  { part: "data-slot=\"date-picker-value\"", desc: "已选日期或占位文本。" },
  { part: "data-slot=\"date-picker-clear\"", desc: "清除当前日期的入口。" },
  { part: "data-slot=\"calendar\"", desc: "弹层内的 Calendar 根节点。" },
  { part: "aria-invalid / disabled", desc: "字段错误与禁用语义。" },
]

export const datePickerDoDontRows = [
  { do: "选择日期时使用 DatePicker。", dont: "在基础 Input 里临时加日历图标或 date prop。" },
  { do: "日期范围由两个 DatePicker 组合。", dont: "把开始和结束日期拼成一个字符串值。" },
  { do: "错误态使用 Field + aria-invalid + FieldError。", dont: "在调用处覆盖日期选择器边框颜色。" },
]

export function DatePickerPage({
  actions,
  lang,
  propRows,
  semanticDomRows,
  doDontRows,
}: {
  actions: React.ReactNode
  lang: StandardDocLang
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return (
    <StandardDocPage
      slug="date-picker"
      title="DatePicker 日期选择器"
      lead="用于从日历中选择单个日期；属于 fx 组合组件，由 Popover 和 Calendar 组成，不向基础 Input 增加日期业务语义。"
      playground={<ComponentPlayground config={datePickerPlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={`import { DatePicker } from "@/components/fx/date-picker"`}
      usageCode={`<DatePicker defaultValue={new Date(2026, 6, 15)} clearable />`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
