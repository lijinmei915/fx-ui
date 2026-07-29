import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type ScenarioExample = { id: string; title: string; intent: string; rule: string; code: string; group?: string; spec?: string }
type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const calendarAnchors = [
  { label: "组件总览", href: "#calendar-overview" },
  { label: "场景示例", href: "#calendar-preview" },
  { label: "使用方式", href: "#calendar-usage" },
  { label: "API", href: "#calendar-props" },
  { label: "语义 DOM", href: "#calendar-semantic-dom" },
  { label: "正误示例", href: "#calendar-do-dont" },
]

export const calendarPropRows = [
  { prop: "mode", type: "\"single\" | \"multiple\" | \"range\"", defaultValue: "—", desc: "选择模式：单日 / 多日 / 区间，决定 selected 的数据形状。" },
  { prop: "selected / onSelect", type: "Date | Date[] | DateRange", defaultValue: "—", desc: "受控选中值与变更回调，需配合 mode 使用。" },
  { prop: "buttonVariant", type: "ButtonProps[\"variant\"]", defaultValue: "\"ghost\"", desc: "上一年 / 上一月 / 下一月 / 下一年导航按钮的视觉样式。" },
  { prop: "showOutsideDays", type: "boolean", defaultValue: "true", desc: "是否显示当月之外的相邻月份日期。" },
]

export const calendarSemanticDomRows = [
  { part: "[data-slot=\"calendar\"]", desc: "日历根容器（基于 react-day-picker 渲染）。" },
  { part: "[data-selected-single] / [data-range-start] / [data-range-end] / [data-range-middle]", desc: "日期格子上的选中状态标记，驱动高亮样式。" },
  { part: "[data-day]", desc: "日期按钮，携带本地化后的日期字符串，便于测试定位。" },
]

export const calendarDoDontRows = [
  { do: "明确告知用户当前选择模式（单日/区间）。", dont: "默认进入区间模式却不给出任何视觉提示。" },
  { do: "嵌入 Popover 时用 className=\"w-auto p-0\" 让日历撑满弹层。", dont: "保留 Popover 默认的内边距和固定宽度，导致日历被裁切。" },
  { do: "搭配输入框展示已选日期的格式化文本。", dont: "选完日期后界面没有任何反馈，用户不确定是否选中。" },
]

export function CalendarPage({ actions, lang, scenarioExamples, propRows, semanticDomRows, doDontRows }: {
  actions: React.ReactNode
  lang: StandardDocLang
  scenarioExamples: ScenarioExample[]
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return <StandardDocPage
    slug="calendar"
    title="Calendar 日历"
    lead="基于 react-day-picker 的日期选择器，支持单日 / 多日 / 区间模式，常嵌入 Popover 组成日期选择控件。"
    overview={<Calendar mode="single" className="rounded-lg border p-2" />}
    scenarioExamples={scenarioExamples}
    renderScenarioPreview={(id) => id === "single" ? <Calendar mode="single" className="scale-90 rounded-lg border p-1 [--cell-size:1.6rem]" /> : <Popover><PopoverTrigger render={<Button size="sm" variant="outline">选择日期</Button>} /><PopoverContent className="w-auto p-0"><Calendar mode="single" /></PopoverContent></Popover>}
    importCode={`import { Calendar } from "@/components/ui/calendar"`}
    usageCode={`const [date, setDate] = useState<Date>()\n\n<Calendar mode="single" selected={date} onSelect={setDate} />`}
    propRows={propRows}
    semanticDomRows={semanticDomRows}
    doDontRows={doDontRows}
    actions={actions}
    lang={lang}
  />
}
