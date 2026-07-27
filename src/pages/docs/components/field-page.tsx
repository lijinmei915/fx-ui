import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import type { StandardScenarioExample } from "@/pages/docs/components/standard-scenario-playground"

export const fieldAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#field-playground" },
  { label: "API", labelEn: "API", href: "#field-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#field-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#field-do-dont" },
]

function FieldPreview({ id }: { id: string }) {
  if (id === "invalid") {
    return <Field data-invalid><FieldLabel htmlFor="field-preview-invalid">邮箱</FieldLabel><Input id="field-preview-invalid" aria-invalid placeholder="name@example.com" /><FieldError>请输入有效邮箱。</FieldError></Field>
  }
  if (id === "disabled") {
    return <Field data-disabled><FieldLabel htmlFor="field-preview-disabled">姓名</FieldLabel><Input id="field-preview-disabled" disabled value="不可编辑" readOnly /></Field>
  }
  if (id === "horizontal") {
    return <Field orientation="horizontal"><FieldLabel htmlFor="field-preview-horizontal">接收通知</FieldLabel><Input id="field-preview-horizontal" placeholder="通知邮箱" /></Field>
  }
  return <Field><FieldLabel htmlFor="field-preview-default">姓名</FieldLabel><Input id="field-preview-default" placeholder="请输入姓名" /><FieldDescription>请填写真实姓名。</FieldDescription></Field>
}

const fieldProps = [
  { prop: "Field", type: "React.ComponentProps<\"div\">", defaultValue: "vertical", desc: "字段容器，支持 orientation、data-invalid、data-disabled。" },
  { prop: "FieldLabel", type: "React.ComponentProps<typeof Label>", defaultValue: "—", desc: "字段标签，通过 htmlFor 关联真实控件。" },
  { prop: "FieldDescription", type: "React.ComponentProps<\"p\">", defaultValue: "—", desc: "辅助说明文案。" },
  { prop: "FieldError", type: "React.ComponentProps<\"div\">", defaultValue: "—", desc: "错误文案，带 role=alert。" },
]

const fieldSemanticDom = [
  { part: "data-slot=field", desc: "字段结构容器，默认 role=group。" },
  { part: "data-slot=field-label", desc: "字段标签，与控件建立可访问关联。" },
  { part: "data-slot=field-description / field-error", desc: "辅助说明与错误反馈。" },
]

const fieldDoDont = [
  { do: "用 FieldLabel htmlFor 关联真实控件 id。", dont: "用普通文本冒充字段标签。" },
  { do: "错误态同时使用 data-invalid 与 aria-invalid。", dont: "只改变颜色，不提供错误语义。" },
  { do: "禁用态同时使用 data-disabled 与 disabled。", dont: "只用 opacity 假装不可编辑。" },
]

export function FieldPage({ actions, lang, scenarioExamples, autoScenarioSlugs }: { actions: React.ReactNode; lang: StandardDocLang; scenarioExamples: StandardScenarioExample[]; autoScenarioSlugs: string[] }) {
  return <StandardDocPage slug="field" title="Field 字段" lead="组织 label、control、description 和 error 的表单结构组件。" playground={undefined} overview={null} hideOverview hideScenarioExamples hideUsage scenarioExamples={scenarioExamples} renderScenarioPreview={(id) => <FieldPreview id={id} />} importCode={`import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"`} usageCode={`<Field>\n  <FieldLabel htmlFor="name">姓名</FieldLabel>\n  <Input id="name" />\n  <FieldDescription>请填写真实姓名。</FieldDescription>\n</Field>`} propRows={fieldProps} semanticDomRows={fieldSemanticDom} doDontRows={fieldDoDont} actions={actions} lang={lang} autoScenarioSlugs={autoScenarioSlugs} />
}
