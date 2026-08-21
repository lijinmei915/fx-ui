import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

export const scrollAreaAnchors = [
  { label: "组件总览", labelEn: "Overview", href: "#scroll-area-overview" },
  { label: "API", href: "#scroll-area-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#scroll-area-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#scroll-area-do-dont" },
]

const propRows = [
  { prop: "orientation", type: "vertical | horizontal", defaultValue: "vertical", desc: "ScrollBar 的滚动方向。" },
  { prop: "className", type: "string", defaultValue: "—", desc: "在根节点设置稳定宽高。" },
]

const semanticDomRows = [
  { part: 'data-slot="scroll-area"', desc: "滚动区域根节点。" },
  { part: 'data-slot="scroll-area-viewport"', desc: "可聚焦的内容视口。" },
  { part: 'data-slot="scroll-area-scrollbar"', desc: "垂直或水平滚动条。" },
  { part: 'data-slot="scroll-area-thumb"', desc: "可拖拽滑块。" },
]

const doDontRows = [
  { do: "在根节点提供明确宽高，再让内容自然溢出。", dont: "依赖内容撑开导致页面整体滚动。" },
  { do: "需要横向滚动时显式加入 horizontal ScrollBar。", dont: "用隐藏 overflow 掩盖被截断内容。" },
]

export function ScrollAreaPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="scroll-area"
      title="ScrollArea 滚动区域"
      lead="在稳定尺寸容器中提供一致的垂直或水平滚动体验。"
      overview={<ScrollArea className="h-48 w-full max-w-sm rounded-lg border"><div className="flex flex-col gap-3 p-4">{Array.from({ length: 12 }, (_, index) => <div key={index} className="text-body">列表项 {index + 1}</div>)}</div><ScrollBar /></ScrollArea>}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { ScrollArea } from "@/components/ui/scroll-area"'}
      usageCode={'<ScrollArea className="h-72">...</ScrollArea>'}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
