import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { Upload, type UploadFileItem, type UploadFileStatus, type UploadListType, type UploadVariant } from "@/components/ui/upload"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest

const sampleFiles: UploadFileItem[] = [
  { id: "contract", name: "客户合同.pdf", size: 1024 * 1024, type: "application/pdf", status: "success" },
  { id: "image", name: "项目截图.png", size: 620 * 1024, type: "image/png", status: "uploading", percent: 65 },
  { id: "failed", name: "超限附件.zip", size: 12 * 1024 * 1024, type: "application/zip", status: "error", error: "文件超过 10 MB" },
]

export const uploadAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#upload-playground" },
  { label: "API", href: "#upload-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#upload-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#upload-do-dont" },
]

export const uploadPropRows: PropRow[] = [
  { prop: "value / defaultValue", type: "UploadFileItem[]", defaultValue: "[]", desc: "受控或非受控文件列表。" },
  { prop: "onValueChange", type: "(files) => void", defaultValue: "—", desc: "选择或删除后返回完整列表。" },
  { prop: "onFilesSelect", type: "(files, items) => void", defaultValue: "—", desc: "返回通过本地限制的原生 File。" },
  { prop: "accept", type: "string", defaultValue: "—", desc: "文件类型过滤。" },
  { prop: "multiple", type: "boolean", defaultValue: "false", desc: "允许多选。" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁止选择、拖拽与删除。" },
  { prop: "maxCount / maxSize", type: "number", defaultValue: "—", desc: "数量与单文件字节限制。" },
  { prop: "variant", type: "button | dropzone | picture-card | link", defaultValue: "button", desc: "上传入口形式。" },
  { prop: "listType", type: "text | picture", defaultValue: "text", desc: "回填列表形式。" },
  { prop: "imageSize", type: "small | mini | micro", defaultValue: "small", desc: "照片墙尺寸。" },
]

export const uploadSemanticDomRows: SemanticDomRow[] = [
  { part: 'data-slot="upload"', desc: "根节点与实时属性状态。" },
  { part: 'data-slot="upload-input"', desc: "原生 file input。" },
  { part: 'data-slot="upload-trigger"', desc: "按钮或链接入口。" },
  { part: 'data-slot="upload-dropzone"', desc: "真实拖拽与键盘入口。" },
  { part: 'data-slot="upload-list"', desc: "文件列表。" },
  { part: 'data-slot="upload-item"', desc: "带 data-status 的文件项。" },
]

export const uploadDoDontRows: DoDontRow[] = [
  { do: "业务通过 onFilesSelect 发起请求，再更新 value 的状态和进度。", dont: "让基础组件持有 action、鉴权头或重试策略。" },
  { do: "用 variant 对应 Figma 上传形式。", dont: "用 className 重写拖拽区、照片墙或链接样式。" },
  { do: "用真实拖拽、focus、disabled 交互检查状态。", dont: "增加 hover 或 dragging 视觉 prop。" },
]

export const uploadPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.upload",
  props: componentPlaygroundPropsFromManifest(manifest.components.upload),
  initial: manifest.components.upload.initial,
  renderOne: (values) => <UploadPlaygroundPreview values={values} />,
  genCode: (values) => {
    const attrs = [`variant="${values.variant}"`, `listType="${values.listType}"`]
    if (values.disabled === "true") attrs.push("disabled")
    if (values.showFileList === "false") attrs.push("showFileList={false}")
    return `import { Upload } from "@/components/ui/upload"\n\n<Upload ${attrs.join(" ")} />`
  },
}

function UploadPlaygroundPreview({ values }: { values: Record<string, string> }) {
  const status = values.status as UploadFileStatus
  const listType = values.listType as UploadListType
  const variant = values.variant as UploadVariant
  const seededFiles = sampleFiles.map((file, index) => (
    index === 1 ? { ...file, status, percent: status === "uploading" ? 65 : undefined } : file
  ))

  return (
    <Upload
      key={`${variant}-${listType}-${status}-${values.disabled}-${values.showFileList}`}
      className="w-[320px]"
      defaultValue={seededFiles}
      variant={variant}
      listType={listType}
      disabled={values.disabled === "true"}
      showFileList={values.showFileList === "true"}
      helperText="支持 png、pdf，单个文件不超过 10 MB"
    />
  )
}

export function UploadPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="upload"
      title="Upload 上传"
      lead="选择或拖拽本地文件，并用受控列表呈现进度、成功与失败状态。"
      playground={<ComponentPlayground config={uploadPlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { Upload } from "@/components/ui/upload"'}
      usageCode={'<Upload variant="dropzone" onFilesSelect={startUpload} />'}
      propRows={uploadPropRows}
      semanticDomRows={uploadSemanticDomRows}
      doDontRows={uploadDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
