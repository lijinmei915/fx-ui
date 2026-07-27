import { DatePicker } from "@/components/fx/date-picker"
import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const datePickerManifest = componentPlaygroundsManifest.customPlaygrounds!.datePicker

function datePickerValue(value: string) {
  return value === "selected" || value === "clearable" ? new Date(2026, 6, 15) : undefined
}

function renderDatePickerPlayground(values: Record<string, string>) {
  const props = {
    size: values.size as "xs" | "sm" | "md",
    clearable: values.valueState === "clearable",
    disabled: values.state === "disabled",
    "aria-invalid": values.state === "invalid",
    "data-state": (values.state === "hover" || values.state === "focus" || values.state === "open" ? values.state : undefined) as "hover" | "focus" | "open" | undefined,
  } as const
  if (values.scenario === "range") {
    const date = datePickerValue(values.valueState)
    return <DatePicker {...props} range defaultValue={date ? { from: date, to: new Date(2026, 6, 21) } : undefined} className="w-[360px]" />
  }
  return <DatePicker {...props} defaultValue={datePickerValue(values.valueState)} />
}

function genDatePickerCode(values: Record<string, string>) {
  const attrs = [`size="${values.size}"`]
  if (values.valueState === "clearable") attrs.push("clearable")
  if (values.state === "disabled") attrs.push("disabled")
  if (values.state === "invalid") attrs.push("aria-invalid")
  if (values.valueState === "selected" || values.valueState === "clearable") attrs.push(values.scenario === "range" ? "defaultValue={{ from: new Date(2026, 6, 15), to: new Date(2026, 6, 21) }}" : "defaultValue={new Date(2026, 6, 15)}")
  if (values.scenario === "range") return `import { DatePicker } from "@/components/fx/date-picker"\n\n<DatePicker range ${attrs.join(" ")} />`
  return `import { DatePicker } from "@/components/fx/date-picker"\n\n<DatePicker ${attrs.join(" ")} />`
}

export const datePickerPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.datePicker",
  props: componentPlaygroundPropsFromManifest(datePickerManifest),
  initial: datePickerManifest.initial,
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
  { prop: "value / defaultValue", type: "Date | DateRange", defaultValue: "—", desc: "单日期使用 Date，范围模式使用结构化 DateRange。" },
  { prop: "onValueChange", type: "(value: Date | DateRange | undefined) => void", defaultValue: "—", desc: "根据 range 返回单日期或日期范围。" },
  { prop: "range", type: "boolean", defaultValue: "false", desc: "使用单触发器、单弹层选择开始和结束日期。" },
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
  { do: "日期范围使用 DatePicker range 和结构化 DateRange。", dont: "并排两个输入框或拼接开始、结束日期字符串。" },
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
      lead="用于从日历中选择单个日期或日期范围；属于 fx 组合组件，由 Popover 和 Calendar 组成，不向基础 Input 增加日期业务语义。"
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
