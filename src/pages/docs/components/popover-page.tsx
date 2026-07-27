import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type ScenarioExample = { id: string; title: string; intent: string; rule: string; code: string; group?: string; spec?: string }
type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const popoverAnchors = [
  { label: "组件总览", href: "#popover-overview" },
  { label: "场景示例", href: "#popover-preview" },
  { label: "使用方式", href: "#popover-usage" },
  { label: "API", href: "#popover-props" },
  { label: "语义 DOM", href: "#popover-semantic-dom" },
  { label: "正误示例", href: "#popover-do-dont" },
]

export const popoverPropRows = [
  { prop: "Popover / PopoverTrigger", type: "PopoverPrimitive.Root.Props / Trigger.Props", defaultValue: "—", desc: "根节点与触发器，常用 render 包裹按钮自定义外观。" },
  { prop: "PopoverContent.size", type: "\"sm\" | \"md\" | \"lg\"", defaultValue: "\"md\"", desc: "控制弹层宽度；用组件尺寸轴，不在调用处覆盖宽度。" },
  { prop: "PopoverContent", type: "side? / align? / sideOffset?", defaultValue: "side=\"bottom\" align=\"center\"", desc: "弹层容器，定位 props 决定弹出方向与对齐方式。" },
  { prop: "PopoverHeader / PopoverTitle / PopoverDescription", type: "—", defaultValue: "—", desc: "弹层内的标题区结构，统一信息层级。" },
]

export const popoverSemanticDomRows = [
  { part: "[data-slot=\"popover-trigger\"]", desc: "触发器，自动同步 aria-expanded。" },
  { part: "[data-slot=\"popover-content\"][data-size]", desc: "弹层容器；size=sm/md/lg 控制受治理宽度。" },
  { part: "[data-slot=\"popover-title\"] / [data-slot=\"popover-description\"]", desc: "标题与描述，构成弹层内的信息层级。" },
]

export const popoverDoDontRows = [
  { do: "用于轻量的信息说明或单字段快捷编辑。", dont: "把多步骤表单塞进 Popover，应该用 Dialog 或 Sheet。" },
  { do: "保持内容简短，一屏可读完。", dont: "弹层内容超长导致需要内部滚动甚至遮挡触发元素。" },
  { do: "信息类用途搭配 PopoverTitle/Description 统一结构。", dont: "随意堆砌文本，没有标题和描述的层级区分。" },
]

export function PopoverPage({ actions, lang, scenarioExamples, propRows, semanticDomRows, doDontRows, autoScenarioSlugs }: {
  actions: React.ReactNode
  lang: StandardDocLang
  scenarioExamples: ScenarioExample[]
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
  autoScenarioSlugs: string[]
}) {
  return <StandardDocPage
    slug="popover"
    title="Popover 弹出层"
    lead="点击触发后弹出的轻量浮层，用于展示简短的补充信息或快捷操作，不打断当前流程。"
    overview={<Popover><PopoverTrigger render={<Button variant="outline">打开弹层</Button>} /><PopoverContent><PopoverHeader><PopoverTitle>什么是工作区？</PopoverTitle><PopoverDescription>工作区是团队协作的基本单位，可包含多个项目。</PopoverDescription></PopoverHeader></PopoverContent></Popover>}
    scenarioExamples={scenarioExamples}
    renderScenarioPreview={(id) => id === "info" ? <Popover><PopoverTrigger render={<Button size="sm" variant="ghost">说明</Button>} /><PopoverContent size="sm"><PopoverHeader><PopoverTitle>什么是工作区？</PopoverTitle><PopoverDescription>工作区是团队协作的基本单位。</PopoverDescription></PopoverHeader></PopoverContent></Popover> : id === "filter" ? <Popover><PopoverTrigger render={<Button size="sm" variant="outline">筛选条件</Button>} /><PopoverContent size="lg"><PopoverHeader><PopoverTitle>筛选条件</PopoverTitle><PopoverDescription>用宽版浮层承载少量并列筛选字段。</PopoverDescription></PopoverHeader><Input placeholder="负责人" /><Input placeholder="标签" /><Button size="sm">应用筛选</Button></PopoverContent></Popover> : <Popover><PopoverTrigger render={<Button size="sm" variant="outline">设置别名</Button>} /><PopoverContent size="md" className="flex flex-col gap-2.5"><Input placeholder="输入别名" /><Button size="sm">保存</Button></PopoverContent></Popover>}
    importCode={`import {\n  Popover,\n  PopoverContent,\n  PopoverDescription,\n  PopoverHeader,\n  PopoverTitle,\n  PopoverTrigger,\n} from "@/components/ui/popover"`}
    usageCode={`<Popover>\n  <PopoverTrigger render={<Button variant="outline">打开弹层</Button>} />\n  <PopoverContent>\n    <PopoverHeader>\n      <PopoverTitle>标题</PopoverTitle>\n      <PopoverDescription>补充说明文字。</PopoverDescription>\n    </PopoverHeader>\n  </PopoverContent>\n</Popover>`}
    propRows={propRows}
    semanticDomRows={semanticDomRows}
    doDontRows={doDontRows}
    autoScenarioSlugs={autoScenarioSlugs}
    actions={actions}
    lang={lang}
  />
}
