import { Toggle } from "@/components/ui/toggle"
import { BoldIcon, ItalicIcon } from "@/lib/icons"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type ScenarioExample = { id: string; title: string; intent: string; rule: string; code: string; group?: string; spec?: string }
type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const toggleAnchors = [
  { label: "组件总览", href: "#toggle-overview" },
  { label: "场景示例", href: "#toggle-preview" },
  { label: "使用方式", href: "#toggle-usage" },
  { label: "API", href: "#toggle-props" },
  { label: "语义 DOM", href: "#toggle-semantic-dom" },
  { label: "正误示例", href: "#toggle-do-dont" },
]

export const togglePropRows = [
  { prop: "pressed / onPressedChange", type: "boolean / (pressed) => void", defaultValue: "—", desc: "受控的按下状态与变更回调；非受控时用 defaultPressed。" },
  { prop: "variant", type: "\"default\" | \"outline\"", defaultValue: "\"default\"", desc: "视觉样式：透明背景或带描边。" },
  { prop: "size", type: "\"default\" | \"sm\" | \"lg\"", defaultValue: "\"default\"", desc: "尺寸档位，影响高度、内边距与图标大小。" },
]

export const toggleSemanticDomRows = [
  { part: "[data-slot=\"toggle\"][data-state]", desc: "切换按钮本体，data-state=\"on\"/\"off\" 反映当前按下状态。" },
]

export const toggleDoDontRows = [
  { do: "用于二元状态切换（开/关、选中/未选中）。", dont: "用它触发会跳转或产生副作用的一次性操作。" },
  { do: "图标含义不明确时搭配文字或 aria-label。", dont: "只放一个生僻图标，用户猜不出按下后会发生什么。" },
  { do: "同一工具栏内统一 variant 与 size。", dont: "工具栏里一半描边一半透明，视觉风格不统一。" },
]

export function TogglePage({ actions, lang, scenarioExamples, propRows, semanticDomRows, doDontRows }: { actions: React.ReactNode; lang: StandardDocLang; scenarioExamples: ScenarioExample[]; propRows: PropRow[]; semanticDomRows: SemanticDomRow[]; doDontRows: DoDontRow[] }) {
  return <StandardDocPage slug="toggle" title="Toggle 切换按钮" lead="用于切换某个独立的二元状态，如收藏、静音、文本加粗。" overview={<><Toggle aria-label="加粗"><BoldIcon /></Toggle><Toggle aria-label="斜体" variant="outline"><ItalicIcon /></Toggle></>} scenarioExamples={scenarioExamples} renderScenarioPreview={(id) => id === "icon" ? <Toggle aria-label="加粗"><BoldIcon /></Toggle> : <Toggle variant="outline" size="sm" className="gap-1.5"><ItalicIcon /> 斜体</Toggle>} importCode={`import { Toggle } from "@/components/ui/toggle"`} usageCode={`<Toggle aria-label="加粗">\n  <BoldIcon />\n</Toggle>`} propRows={propRows} semanticDomRows={semanticDomRows} doDontRows={doDontRows} actions={actions} lang={lang} />
}
