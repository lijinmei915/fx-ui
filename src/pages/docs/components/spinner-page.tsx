import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

type ScenarioExample = { id: string; title: string; intent: string; rule: string; code: string; group?: string; spec?: string }
type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const spinnerAnchors = [
  { label: "组件总览", href: "#spinner-overview" },
  { label: "场景示例", href: "#spinner-preview" },
  { label: "使用方式", href: "#spinner-usage" },
  { label: "API", href: "#spinner-props" },
  { label: "语义 DOM", href: "#spinner-semantic-dom" },
  { label: "正误示例", href: "#spinner-do-dont" },
]

export const spinnerPropRows = [
  { prop: "Spinner", type: "React.ComponentProps<\"svg\">", defaultValue: "—", desc: "本质是一个带 animate-spin 的图标（Loader2Icon），通过 className 控制大小颜色。" },
  { prop: "className", type: "string", defaultValue: "size-4", desc: "控制图标尺寸；放进按钮或文本行内时常配合 mr-1.5 等间距类。" },
]

export const spinnerSemanticDomRows = [
  { part: "svg[role=\"status\"][aria-label=\"Loading\"]", desc: "Spinner 本体即一个带无障碍语义的旋转图标，无需额外包裹容器。" },
]

export const spinnerDoDontRows = [
  { do: "loading 期间禁用触发按钮，防止重复提交。", dont: "按钮可继续点击，导致同一请求被触发多次。" },
  { do: "区块级加载搭配简短说明文案。", dont: "页面中央孤零零转一个圈，用户不知道在等什么。" },
  { do: "用 className 调整尺寸以匹配上下文（按钮内用小尺寸）。", dont: "所有场景都用同一个尺寸，按钮里显得过大或过小。" },
]

export function SpinnerPage({ actions, lang, scenarioExamples, propRows, semanticDomRows, doDontRows, autoScenarioSlugs }: { actions: React.ReactNode; lang: StandardDocLang; scenarioExamples: ScenarioExample[]; propRows: PropRow[]; semanticDomRows: SemanticDomRow[]; doDontRows: DoDontRow[]; autoScenarioSlugs: string[] }) {
  return <StandardDocPage slug="spinner" title="Spinner 加载指示器" lead="用旋转图标提示用户当前正在加载或处理中，常嵌入按钮或区块中央。" overview={<><Spinner className="size-6" /><span className="text-sm text-muted-foreground">本质是带 animate-spin 的图标，可自由控制大小</span></>} scenarioExamples={scenarioExamples} renderScenarioPreview={(id) => id === "inline" ? <Button size="sm" disabled><Spinner className="mr-1.5" />提交中…</Button> : <div className="flex flex-col items-center justify-center gap-2 py-2 text-xs text-muted-foreground"><Spinner className="size-5" />正在加载…</div>} importCode={`import { Spinner } from "@/components/ui/spinner"`} usageCode={`<Button disabled>\n  <Spinner className="mr-1.5" />\n  提交中…\n</Button>`} propRows={propRows} semanticDomRows={semanticDomRows} doDontRows={doDontRows} actions={actions} lang={lang} autoScenarioSlugs={autoScenarioSlugs} />
}
