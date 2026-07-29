import { DateTimePicker } from "@/components/fx/time-picker"
import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const dateTimePickerManifest = componentPlaygroundsManifest.customPlaygrounds!.dateTimePicker

function renderDateTimePickerPlayground(values: Record<string, string>) {
  const props = {
    size: values.size as "xs" | "sm" | "md",
    format: values.format as "HH:mm" | "HH:mm:ss",
    clearable: true,
    disabled: values.state === "disabled",
    "aria-invalid": values.state === "invalid",
    "data-state": values.state === "hover" || values.state === "focus" ? values.state : undefined,
  } as const

  if (values.scenario === "range") {
    return (
      <DateTimePicker
        {...props}
        range
        className="w-[400px]"
      />
    )
  }

  return <DateTimePicker {...props} className="w-[280px]" />
}

function genDateTimePickerCode(values: Record<string, string>) {
  const attrs = []
  if (values.scenario === "range") attrs.push("range")
  if (values.format === "HH:mm") attrs.push('format="HH:mm"')
  if (values.size !== "sm") attrs.push(`size="${values.size}"`)
  attrs.push("clearable")
  if (values.state === "disabled") attrs.push("disabled")
  if (values.state === "invalid") attrs.push("aria-invalid")
  return `import { DateTimePicker } from "@/components/fx/time-picker"\n\n<DateTimePicker${attrs.length ? ` ${attrs.join(" ")}` : ""} />`
}

export const dateTimePickerPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.dateTimePicker",
  props: componentPlaygroundPropsFromManifest(dateTimePickerManifest),
  initial: dateTimePickerManifest.initial,
  guidanceKey: dateTimePickerManifest.guidanceKey,
  renderOne: renderDateTimePickerPlayground,
  genCode: genDateTimePickerCode,
}

export const dateTimePickerAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#date-time-picker-playground" },
  { label: "API", href: "#date-time-picker-props" },
  { label: "语义 DOM", href: "#date-time-picker-semantic-dom" },
  { label: "正误示例", href: "#date-time-picker-do-dont" },
]

export const dateTimePickerPropRows = [
  { prop: "value / defaultValue", type: "Date | DateRange", defaultValue: "—", desc: "单值使用带时间的 Date，范围模式使用 from / to 均带时间的 DateRange。" },
  { prop: "onValueChange", type: "(value: Date | DateRange | undefined) => void", defaultValue: "—", desc: "选择日期或时间时即时返回单个日期时间或范围；点击取消会恢复打开前的值。" },
  { prop: "range", type: "boolean", defaultValue: "false", desc: "使用一个触发器和一个弹层分两步选择起止日期时间：先确认开始，再确认结束。" },
  { prop: "format", type: "HH:mm | HH:mm:ss", defaultValue: "HH:mm:ss", desc: "时间滚轮与触发器的显示精度。" },
  { prop: "minuteStep / secondStep", type: "1 | 5 | 10 | 15 | 30", defaultValue: "1", desc: "分钟与秒滚轮的步进。" },
  { prop: "minDate / maxDate", type: "Date", defaultValue: "—", desc: "限制可选择日期范围。" },
  { prop: "disabledDate", type: "(date: Date) => boolean", defaultValue: "—", desc: "按业务规则禁用日期。" },
  { prop: "variant", type: "outlined | borderless", defaultValue: "outlined", desc: "控件外观变体。" },
  { prop: "open / onOpenChange", type: "boolean / (open) => void", defaultValue: "—", desc: "受控弹层状态。" },
  { prop: "showNow", type: "boolean", defaultValue: "false", desc: "提供“此刻”快捷入口。" },
  { prop: "size", type: "xs | sm | md", defaultValue: "sm", desc: "触发器尺寸：24 / 28 / 32。" },
  { prop: "clearable", type: "boolean", defaultValue: "false", desc: "有值时在悬停或聚焦控件后展示清除入口。" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁止打开弹层或修改值。" },
  { prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "标记字段校验失败。" },
]

export const dateTimePickerSemanticDomRows = [
  { part: 'data-slot="date-time-picker"', desc: "日期时间选择器控件根节点。" },
  { part: 'data-slot="date-time-picker-trigger"', desc: "打开统一日期时间弹层的触发器。" },
  { part: 'data-slot="date-time-picker-value"', desc: "已选日期时间或占位文本。" },
  { part: 'data-slot="date-time-picker-range-start" / "date-time-picker-range-end"', desc: "范围模式的开始/结束值区；点击值区切换当前编辑侧。" },
  { part: 'data-slot="date-time-picker-clear"', desc: "清除当前值的入口。" },
  { part: 'data-slot="date-time-picker-content"', desc: "包含选择面板与确认操作的完整弹层内容。" },
  { part: 'data-slot="date-time-picker-panel"', desc: "Calendar 与时间滚轮共用的弹层面板。" },
  { part: 'data-slot="date-time-picker-time-panel"', desc: "与 Calendar 同高的时间滚轮面板。" },
  { part: 'data-slot="calendar"', desc: "弹层内复用的 Calendar 根节点。" },
  { part: "aria-invalid / disabled", desc: "字段错误与禁用语义。" },
]

export const dateTimePickerDoDontRows = [
  { do: "需要在一个弹层内选择日期和时间时使用 DateTimePicker。", dont: "并排 DatePicker 与 TimePicker 后手工拼接值。" },
  { do: "范围模式使用一个 DateTimePicker range，先确认开始日期时间，再确认结束日期时间。", dont: "并排两个日期时间输入框或在同一面板同时编辑两侧。" },
  { do: "错误态使用 Field + aria-invalid + FieldError。", dont: "在调用处覆盖边框、底色或弹层样式。" },
]

export function DateTimePickerPage({
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
      slug="date-time-picker"
      title="DateTimePicker 日期时间选择器"
      lead="用于在同一个触发器和弹层内完成日期与时间选择；单值和范围模式都复用 Calendar、Popover、TimeWheel 与 Button。"
      playground={<ComponentPlayground config={dateTimePickerPlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={`import { DateTimePicker } from "@/components/fx/time-picker"`}
      usageCode={`<DateTimePicker defaultValue={new Date(2026, 6, 15, 9, 30)} clearable />`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
