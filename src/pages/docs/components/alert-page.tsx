import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon } from "@/lib/icons"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"

export const alertAnchors = [
  { label: "组件总览", labelEn: "Overview", href: "#alert-overview" },
  { label: "API", href: "#alert-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#alert-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#alert-do-dont" },
]

const propRows = [
  { prop: "variant", type: "default | destructive", defaultValue: "default", desc: "普通提示或破坏性/错误提示。" },
  { prop: "className", type: "string", defaultValue: "—", desc: "只用于根节点宽度与外部布局。" },
]

const semanticDomRows = [
  { part: 'data-slot="alert"', desc: "role=alert 的根节点。" },
  { part: 'data-slot="alert-title"', desc: "简短提示标题。" },
  { part: 'data-slot="alert-description"', desc: "补充说明。" },
  { part: 'data-slot="alert-action"', desc: "右上角命令区域。" },
]

const doDontRows = [
  { do: "提示信息使用 Alert + Title + Description。", dont: "手写带颜色和边框的提示 div。" },
  { do: "错误提示使用 destructive variant。", dont: "在调用处覆盖红色边框和文字。" },
]

export function AlertPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="alert"
      title="Alert 提示"
      lead="在页面内容中持续展示需要用户注意的信息或错误。"
      overview={<Alert><AlertCircleIcon /><AlertTitle>配置尚未完成</AlertTitle><AlertDescription>补齐必要信息后即可发布。</AlertDescription><AlertAction><Button variant="plain" size="xs">查看</Button></AlertAction></Alert>}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"'}
      usageCode={'<Alert><AlertTitle>提示</AlertTitle><AlertDescription>说明</AlertDescription></Alert>'}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
