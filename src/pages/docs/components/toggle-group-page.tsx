import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@/lib/icons"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type ScenarioExample = { id: string; title: string; intent: string; rule: string; code: string; group?: string; spec?: string }
type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const toggleGroupAnchors = [
  { label: "组件总览", href: "#toggle-group-overview" },
  { label: "场景示例", href: "#toggle-group-preview" },
  { label: "使用方式", href: "#toggle-group-usage" },
  { label: "API", href: "#toggle-group-props" },
  { label: "语义 DOM", href: "#toggle-group-semantic-dom" },
  { label: "正误示例", href: "#toggle-group-do-dont" },
]

export const toggleGroupPropRows = [
  { prop: "multiple", type: "boolean", defaultValue: "false", desc: "false 时仅一项可按下（互斥单选），true 时可同时按下多项。" },
  { prop: "value / onValueChange", type: "string | string[]", defaultValue: "—", desc: "受控的选中值；single 为字符串，multiple 为字符串数组。" },
  { prop: "variant / size", type: "\"default\" | \"outline\" / \"default\" | \"sm\" | \"lg\"", defaultValue: "\"default\"", desc: "统一下发给组内所有 ToggleGroupItem 的样式与尺寸。" },
  { prop: "orientation / spacing", type: "\"horizontal\" | \"vertical\" / number", defaultValue: "\"horizontal\" / 2", desc: "排列方向与组内间距；spacing=0 时相邻项会合并边框。" },
]

export const toggleGroupSemanticDomRows = [
  { part: "[data-slot=\"toggle-group\"][data-orientation][data-spacing]", desc: "组容器，记录排列方向与间距，驱动相邻项的圆角合并样式。" },
  { part: "[data-slot=\"toggle-group-item\"][data-state][data-variant][data-size]", desc: "组内选项，data-state 标记选中状态，并继承组级 variant/size。" },
]

export const toggleGroupDoDontRows = [
  { do: "互斥选项用 type=\"single\"，并行选项用 type=\"multiple\"。", dont: "用 multiple 实现互斥选择，靠业务逻辑硬控制只能选一个。" },
  { do: "single 模式下提供合理的默认选中值。", dont: "初始状态什么都没选中，用户不知道当前是什么视图。" },
  { do: "组内选项数量保持在 2-5 个。", dont: "塞入十几个选项，每个选项窄到看不清图标。" },
]

export function ToggleGroupPage({ actions, lang, scenarioExamples, propRows, semanticDomRows, doDontRows, autoScenarioSlugs }: { actions: React.ReactNode; lang: StandardDocLang; scenarioExamples: ScenarioExample[]; propRows: PropRow[]; semanticDomRows: SemanticDomRow[]; doDontRows: DoDontRow[]; autoScenarioSlugs: string[] }) {
  return <StandardDocPage slug="toggle-group" title="Toggle Group 切换按钮组" lead="把多个 Toggle 组合成一组，支持互斥单选与并行多选两种模式。" overview={<ToggleGroup defaultValue={["left"]}><ToggleGroupItem value="left">左对齐</ToggleGroupItem><ToggleGroupItem value="center">居中</ToggleGroupItem><ToggleGroupItem value="right">右对齐</ToggleGroupItem></ToggleGroup>} scenarioExamples={scenarioExamples} renderScenarioPreview={(id) => id === "single" ? <ToggleGroup defaultValue={["left"]} className="scale-90"><ToggleGroupItem value="left">左</ToggleGroupItem><ToggleGroupItem value="center">中</ToggleGroupItem><ToggleGroupItem value="right">右</ToggleGroupItem></ToggleGroup> : <ToggleGroup multiple variant="outline"><ToggleGroupItem value="bold"><BoldIcon /></ToggleGroupItem><ToggleGroupItem value="italic"><ItalicIcon /></ToggleGroupItem><ToggleGroupItem value="underline"><UnderlineIcon /></ToggleGroupItem></ToggleGroup>} importCode={`import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"`} usageCode={`<ToggleGroup defaultValue={["left"]}>\n  <ToggleGroupItem value="left">左对齐</ToggleGroupItem>\n  <ToggleGroupItem value="center">居中</ToggleGroupItem>\n  <ToggleGroupItem value="right">右对齐</ToggleGroupItem>\n</ToggleGroup>`} propRows={propRows} semanticDomRows={semanticDomRows} doDontRows={doDontRows} actions={actions} lang={lang} autoScenarioSlugs={autoScenarioSlugs} />
}
