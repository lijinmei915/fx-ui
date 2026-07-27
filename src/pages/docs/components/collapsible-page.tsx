import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@/lib/icons"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type ScenarioExample = { id: string; title: string; intent: string; rule: string; code: string; group?: string; spec?: string }
type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const collapsibleAnchors = [
  { label: "组件总览", href: "#collapsible-overview" },
  { label: "场景示例", href: "#collapsible-preview" },
  { label: "使用方式", href: "#collapsible-usage" },
  { label: "API", href: "#collapsible-props" },
  { label: "语义 DOM", href: "#collapsible-semantic-dom" },
  { label: "正误示例", href: "#collapsible-do-dont" },
]

export const collapsiblePropRows = [
  { prop: "Collapsible", type: "open? / defaultOpen? / onOpenChange?", defaultValue: "—", desc: "根节点，可受控也可非受控管理展开状态。" },
  { prop: "CollapsibleTrigger", type: "render?: ReactElement", defaultValue: "—", desc: "触发展开/收起的元素，常用 render 包裹按钮或自定义标签。" },
  { prop: "CollapsibleContent", type: "React.ComponentProps<\"div\">", defaultValue: "—", desc: "可折叠的内容面板，收起时通过动画收起高度。" },
]

export const collapsibleSemanticDomRows = [
  { part: "[data-slot=\"collapsible\"]", desc: "根容器，承载展开/收起状态。" },
  { part: "[data-slot=\"collapsible-trigger\"]", desc: "触发器，自动同步 aria-expanded。" },
  { part: "[data-slot=\"collapsible-content\"]", desc: "内容面板，收起时高度收起为 0 并隐藏。" },
]

export const collapsibleDoDontRows = [
  { do: "用箭头旋转或文案变化提示当前展开状态。", dont: "收起和展开时触发器外观完全一致，用户分不清状态。" },
  { do: "默认收起非核心信息，保持页面简洁。", dont: "把关键操作或必读信息也藏进折叠面板里。" },
  { do: "折叠内容较长时允许内部滚动。", dont: "展开后内容把页面撑得很长，找不到收起按钮。" },
]

export function CollapsiblePage({ actions, lang, scenarioExamples, propRows, semanticDomRows, doDontRows, autoScenarioSlugs }: {
  actions: React.ReactNode
  lang: StandardDocLang
  scenarioExamples: ScenarioExample[]
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
  autoScenarioSlugs: string[]
}) {
  return <StandardDocPage
    slug="collapsible"
    title="Collapsible 折叠面板"
    lead="默认收起次要信息，点击触发器后展开查看详情，用于减少页面初始信息量。"
    overview={<Collapsible className="w-full"><CollapsibleTrigger render={<Button variant="ghost" className="gap-1.5">查看更多 <ChevronDownIcon className="size-4" /></Button>} /><CollapsibleContent className="pt-2 text-sm text-muted-foreground">这里是展开后的详细内容，可以承载补充说明或次要信息。</CollapsibleContent></Collapsible>}
    scenarioExamples={scenarioExamples}
    renderScenarioPreview={(id) => id === "panel" ? <Collapsible><CollapsibleTrigger render={<Button size="sm" variant="ghost" className="gap-1.5">查看更多 <ChevronDownIcon className="size-4" /></Button>} /><CollapsibleContent className="pt-2 text-sm text-muted-foreground">这里是展开后的详细内容。</CollapsibleContent></Collapsible> : <Collapsible defaultOpen className="w-[180px]"><CollapsibleTrigger render={<button className="text-sm font-medium">基础组件（12）</button>} /><CollapsibleContent className="flex flex-col gap-1 pt-2 text-sm text-muted-foreground"><span>Button</span><span>Input</span></CollapsibleContent></Collapsible>}
    importCode={`import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"`}
    usageCode={`<Collapsible>\n  <CollapsibleTrigger render={<Button variant="ghost">查看更多</Button>} />\n  <CollapsibleContent>\n    <p className="text-sm text-muted-foreground">这里是展开后的详细内容。</p>\n  </CollapsibleContent>\n</Collapsible>`}
    propRows={propRows}
    semanticDomRows={semanticDomRows}
    doDontRows={doDontRows}
    autoScenarioSlugs={autoScenarioSlugs}
    actions={actions}
    lang={lang}
  />
}
