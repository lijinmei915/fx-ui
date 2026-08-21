import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { Signature } from "@/components/ui/signature"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest

export const signatureAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#signature-playground" },
  { label: "API", href: "#signature-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#signature-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#signature-do-dont" },
]

export const signaturePropRows: PropRow[] = [
  { prop: "value", type: "string | null", defaultValue: "—", desc: "受控 PNG data URL；传 null 清空。" },
  { prop: "defaultValue", type: "string | null", defaultValue: "—", desc: "非受控初始签名。" },
  { prop: "onChange", type: "(value: string | null) => void", defaultValue: "—", desc: "一笔结束或清空时返回完整值。" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁止绘制和清空。" },
  { prop: "height", type: "number", defaultValue: "70", desc: "画布 CSS 高度，宽度跟随容器。" },
  { prop: "clearLabel", type: "string", defaultValue: '"清空"', desc: "清空按钮的可见文本。" },
]

export const signatureSemanticDomRows: SemanticDomRow[] = [
  { part: 'data-slot="signature"', desc: "根节点，带 data-filled 与 data-disabled。" },
  { part: 'data-slot="signature-canvas"', desc: "响应式签名画布。" },
  { part: 'data-slot="signature-clear"', desc: "复用 Button 的清空命令。" },
]

export const signatureDoDontRows: DoDontRow[] = [
  { do: "使用 value + onChange 保存签名 data URL。", dont: "读取或修改 canvas DOM 来同步表单值。" },
  { do: "用 disabled 表达只读回显。", dont: "用 className 降低透明度伪装禁用。" },
  { do: "用 height 调整输入区域高度。", dont: "在调用处覆盖组件颜色、边框或圆角。" },
]

export const signaturePlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.signature",
  props: componentPlaygroundPropsFromManifest(manifest.components.signature),
  initial: manifest.components.signature.initial,
  renderOne: (values) => (
    <Signature
      className="w-[280px]"
      height={Number(values.height)}
      disabled={values.disabled === "true"}
    />
  ),
  genCode: (values) => {
    const attrs = [`height={${Number(values.height)}}`]
    if (values.disabled === "true") attrs.push("disabled")
    return `import { Signature } from "@/components/ui/signature"\n\n<Signature ${attrs.join(" ")} />`
  },
}

export function SignaturePage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="signature"
      title="Signature 签名"
      lead="采集用户手写签名并输出 PNG data URL；画布宽度跟随容器。"
      playground={<ComponentPlayground config={signaturePlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { Signature } from "@/components/ui/signature"'}
      usageCode={'<Signature value={signature} onChange={setSignature} />'}
      propRows={signaturePropRows}
      semanticDomRows={signatureSemanticDomRows}
      doDontRows={signatureDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
