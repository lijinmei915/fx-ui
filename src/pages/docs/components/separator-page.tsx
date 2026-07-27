import { Separator } from "@/components/ui/separator"
import { SeparatorPlayground } from "@/pages/docs/components/separator-playground"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const separatorAnchors = [
  { label: "调试台", href: "#separator-playground" },
  { label: "API", href: "#separator-props" },
  { label: "语义 DOM", href: "#separator-semantic-dom" },
  { label: "正误示例", href: "#separator-do-dont" },
]

export const separatorPropRows = [
  { prop: "orientation", type: "\"horizontal\" | \"vertical\"", defaultValue: "\"horizontal\"", desc: "分隔方向；垂直方向需要父容器提供明确高度。" },
]

export const separatorSemanticDomRows = [
  { part: "[data-slot=\"separator\"]", desc: "Separator 根节点，由 Base UI 渲染为 div。" },
  { part: "role=\"separator\"", desc: "始终向辅助技术暴露分隔语义；当前 Base UI API 不提供 decorative prop。" },
  { part: "aria-orientation", desc: "向辅助技术声明 horizontal 或 vertical 方向。" },
  { part: "data-orientation", desc: "标记当前方向，并驱动横向或纵向尺寸样式。" },
]

export const separatorDoDontRows = [
  { do: "用它分隔弱关联的内容区块。", dont: "在每一行文字之间都加分隔线，制造视觉噪音。" },
  { do: "垂直分隔时确保父容器有固定高度（如 h-5）。", dont: "不设置高度直接使用，导致分隔线塌陷不可见。" },
  { do: "分隔线与内容之间留出呼吸间距。", dont: "让分隔线紧贴文字，看起来像下划线。" },
]

export function SeparatorPage({ actions, lang, propRows, semanticDomRows, doDontRows }: {
  actions: React.ReactNode
  lang: StandardDocLang
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return <StandardDocPage
    slug="separator"
    title="Separator 分隔线"
    lead="用于区隔弱关联的内容区块，支持水平与垂直两种方向。"
    overview={null}
    overviewMatrix={<div className="flex w-full flex-col gap-3"><p className="text-sm">第一段内容</p><Separator /><p className="text-sm">第二段内容</p></div>}
    playground={<SeparatorPlayground lang={lang} />}
    playgroundDescription={lang === "en" ? "Tune the real prop live, then copy the recommended code." : "实时调真实属性，预览随之变化，写法可一键复制。"}
    hideOverview
    hideScenarioExamples
    hideUsage
    scenarioExamples={[]}
    renderScenarioPreview={() => null}
    importCode={`import { Separator } from "@/components/ui/separator"`}
    usageCode={`<div className="flex flex-col gap-4">\n  <p className="text-sm">第一段内容</p>\n  <Separator />\n  <p className="text-sm">第二段内容</p>\n</div>`}
    propRows={propRows}
    semanticDomRows={semanticDomRows}
    doDontRows={doDontRows}
    actions={actions}
    lang={lang}
  />
}
