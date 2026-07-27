import { Button } from "@/components/ui/button"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { toast } from "sonner"

type ScenarioExample = { id: string; title: string; intent: string; rule: string; code: string; group?: string; spec?: string }
type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const toastAnchors = [
  { label: "组件总览", href: "#toast-overview" },
  { label: "场景示例", href: "#toast-preview" },
  { label: "使用方式", href: "#toast-usage" },
  { label: "API", href: "#toast-props" },
  { label: "语义 DOM", href: "#toast-semantic-dom" },
  { label: "正误示例", href: "#toast-do-dont" },
]

export const toastPropRows = [
  { prop: "<Toaster />", type: "组件", defaultValue: "—", desc: "全局只挂一次（已在 main.tsx 根节点）；承载所有 toast 的容器与样式。" },
  { prop: "toast(message, options?)", type: "function", defaultValue: "—", desc: "命令式调用弹出提示；从 \"sonner\" 导入，无需放进 JSX。" },
  { prop: "toast.success / error / warning / info / loading", type: "function", defaultValue: "—", desc: "语义化变体，自动套对应图标（走 @/lib/icons 的图标（Tabler））。" },
  { prop: "options.description", type: "string", defaultValue: "—", desc: "主文案下方的次要说明。" },
  { prop: "options.action", type: "{ label, onClick }", defaultValue: "—", desc: "右侧操作按钮，常用于「撤销」。" },
]

export const toastSemanticDomRows = [
  { part: "section.toaster.group", desc: "Toaster 根容器，挂在页面根节点，定位所有 toast。" },
  { part: ".cn-toast", desc: "单条 toast 的根类，套公司浮层阴影 shadow-l1、圆角 --radius-lg。" },
]

export const toastDoDontRows = [
  { do: "用语义变体（success/error）让图标和含义对应。", dont: "全用默认 toast()，成功失败长一个样。" },
  { do: "可逆操作给 action「撤销」，让用户能反悔。", dont: "删除前弹一堆确认框打断操作。" },
  { do: "文案简短、说清结果。", dont: "把长段落塞进 toast，超时消失没人看完。" },
  { do: "全局只挂一个 <Toaster />。", dont: "在多个页面重复挂 Toaster，导致提示重复弹。" },
]

export function ToastPage({ actions, lang, scenarioExamples, propRows, semanticDomRows, doDontRows, autoScenarioSlugs }: { actions: React.ReactNode; lang: StandardDocLang; scenarioExamples: ScenarioExample[]; propRows: PropRow[]; semanticDomRows: SemanticDomRow[]; doDontRows: DoDontRow[]; autoScenarioSlugs: string[] }) {
  return <StandardDocPage slug="toast" title="Toast 轻提示" lead="操作完成后弹出的轻量、自动消失的反馈，不打断当前流程。基于 sonner，命令式调用 toast()。" overview={<><Button size="sm" variant="outline" onClick={() => toast.success("已保存")}>触发一条 toast</Button><span className="text-sm text-muted-foreground">全局只挂一个 &lt;Toaster /&gt;，到处 toast() 即可</span></>} scenarioExamples={scenarioExamples} renderScenarioPreview={(id) => id === "success" ? <Button size="sm" variant="outline" onClick={() => toast.success("已保存")}>成功提示</Button> : id === "error" ? <Button size="sm" variant="outline" onClick={() => toast.error("保存失败", { description: "网络异常，请重试" })}>失败提示</Button> : <Button size="sm" variant="outline" onClick={() => toast("已删除 1 项", { action: { label: "撤销", onClick: () => toast("已撤销") } })}>带撤销</Button>} importCode={`import { toast } from "sonner"`} usageCode={`toast.success("已保存")\ntoast.error("保存失败", { description: "网络异常，请重试" })\ntoast("已删除 1 项", {\n  action: { label: "撤销", onClick: () => restore() },\n})`} propRows={propRows} semanticDomRows={semanticDomRows} doDontRows={doDontRows} actions={actions} lang={lang} autoScenarioSlugs={autoScenarioSlugs} />
}
