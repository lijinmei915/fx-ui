import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import type { StandardScenarioExample } from "@/pages/docs/components/standard-scenario-playground"

export const labelAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#label-playground" },
  { label: "API", labelEn: "API", href: "#label-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#label-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#label-do-dont" },
]

function LabelPreview({ id }: { id: string }) {
  if (id === "disabled") return <div className="grid gap-2"><Label htmlFor="label-preview-disabled" data-disabled>不可编辑</Label><Input id="label-preview-disabled" disabled placeholder="Disabled" /></div>
  if (id === "long") return <div className="grid gap-2"><Label htmlFor="label-preview-long">通知邮箱地址</Label><Input id="label-preview-long" type="email" placeholder="name@example.com" /></div>
  return <div className="grid gap-2"><Label htmlFor="label-preview-default">姓名</Label><Input id="label-preview-default" placeholder="请输入姓名" /></div>
}

const labelProps = [
  { prop: "htmlFor", type: "string", defaultValue: "—", desc: "关联真实表单控件的 id，提供可访问名称。" },
  { prop: "data-disabled", type: "boolean", defaultValue: "false", desc: "字段结构禁用时使用，降低标签视觉权重。" },
  { prop: "className", type: "string", defaultValue: "—", desc: "仅用于布局或外部间距，不覆盖组件基础视觉。" },
]

const labelSemanticDom = [{ part: "data-slot=label", desc: "原生 label 根节点，供样式、测试和 AI 定位。" }]
const labelDoDont = [
  { do: "用 htmlFor 关联 Input、Select 等真实控件。", dont: "用 div 或 span 代替 label。" },
  { do: "把 Label 放进 Field 体系承载字段结构。", dont: "在页面里重复手写标签间距和禁用样式。" },
]

export function LabelPage({ actions, lang, scenarioExamples, autoScenarioSlugs }: { actions: React.ReactNode; lang: StandardDocLang; scenarioExamples: StandardScenarioExample[]; autoScenarioSlugs: string[] }) {
  return <StandardDocPage slug="label" title="Label 标签" lead="为表单控件提供可访问名称，并保留原生 label 的关联行为。" playground={undefined} overview={null} hideOverview hideScenarioExamples hideUsage scenarioExamples={scenarioExamples} renderScenarioPreview={(id) => <LabelPreview id={id} />} importCode={`import { Label } from "@/components/ui/label"`} usageCode={`<Label htmlFor="email">邮箱</Label>\n<Input id="email" />`} propRows={labelProps} semanticDomRows={labelSemanticDom} doDontRows={labelDoDont} actions={actions} lang={lang} autoScenarioSlugs={autoScenarioSlugs} />
}
