import { SliderPlayground } from "@/pages/docs/components/slider-playground"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const sliderAnchors = [
  { label: "调试台", href: "#slider-playground" },
  { label: "API", href: "#slider-props" },
  { label: "语义 DOM", href: "#slider-semantic-dom" },
  { label: "正误示例", href: "#slider-do-dont" },
]

export const sliderPropRows = [
  { prop: "value / defaultValue", type: "number | number[]", defaultValue: "—", desc: "单值传 number，范围值传含两个值的数组。受控时配合 onValueChange。" },
  { prop: "onValueChange", type: "(value, eventDetails) => void", defaultValue: "—", desc: "拖动、轨道点击或键盘操作时触发。" },
  { prop: "onValueCommitted", type: "(value, eventDetails) => void", defaultValue: "—", desc: "一次交互提交完成后触发。" },
  { prop: "min / max", type: "number", defaultValue: "0 / 100", desc: "允许选择的最小值与最大值，两者不能相等。" },
  { prop: "step / largeStep", type: "number", defaultValue: "1 / 10", desc: "普通步进，以及 Page Up/Down 或 Shift + 方向键的步进。" },
  { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', desc: "滑动方向；垂直方向需要调用处提供明确高度。" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用指针和键盘修改，并使用禁用语义 token。" },
  { prop: "name / form", type: "string", defaultValue: "—", desc: "参与原生表单提交时使用。" },
  { prop: "minStepsBetweenValues", type: "number", defaultValue: "0", desc: "范围滑块两个游标之间的最小步数。" },
  { prop: "thumbCollisionBehavior", type: '"push" | "swap" | "none"', defaultValue: '"push"', desc: "范围游标相遇时的行为。" },
]

export const sliderSemanticDomRows = [
  { part: '[data-slot="slider"][role="group"]', desc: "Slider 根节点，承载取值范围、方向与表单语义。" },
  { part: '[data-slot="slider-track"]', desc: "完整取值区间的轨道。" },
  { part: '[data-slot="slider-range"]', desc: "当前单值进度或范围选区。" },
  { part: '[data-slot="slider-thumb"] input[type="range"]', desc: "每个游标包含一个可键盘操作的原生 range input。" },
  { part: "data-orientation / data-disabled / data-dragging", desc: "Base UI 暴露的真实方向、禁用与拖动态。" },
]

export const sliderDoDontRows = [
  { do: "单值用 number，范围用 number[]，并为滑块提供可访问名称。", dont: "新增 range 布尔属性或省略标签，让值形态和语义重复表达。" },
  { do: "刻度与输入框按 Slider + 文本刻度 / Input 组合。", dont: "给 Slider 发明 marks、showInput 等源码不存在的属性。" },
  { do: "水平默认自适应容器；垂直方向只在调用处提供高度。", dont: "用 className 覆盖轨道颜色、游标尺寸或圆角。" },
]

export function SliderPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return <StandardDocPage
    slug="slider"
    title="Slider 滑块"
    lead="帮助用户在连续或离散区间中选择单个数值或范围值。"
    overview={null}
    playground={<SliderPlayground lang={lang} />}
    playgroundDescription={lang === "en" ? "Tune the real Base UI props and value shape live." : "实时调整 Base UI 的真实属性与单值/范围值形态。"}
    hideOverview
    hideScenarioExamples
    hideUsage
    scenarioExamples={[]}
    renderScenarioPreview={() => null}
    importCode={`import { Field, FieldLabel } from "@/components/ui/field"\nimport { Slider } from "@/components/ui/slider"`}
    usageCode={`<Field>\n  <FieldLabel id="completion-label">完成度</FieldLabel>\n  <Slider aria-labelledby="completion-label" defaultValue={20} />\n</Field>`}
    propRows={sliderPropRows as PropRow[]}
    semanticDomRows={sliderSemanticDomRows as SemanticDomRow[]}
    doDontRows={sliderDoDontRows as DoDontRow[]}
    actions={actions}
    lang={lang}
  />
}
