import { ComponentPlayground } from "@/components/fx/component-playground"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { switchPlaygroundConfig } from "@/pages/docs/components/switch-playground"

export const switchPropRows = [
  { prop: "checked / defaultChecked", type: "boolean", defaultValue: "false", desc: "受控 / 非受控的开关状态。" },
  { prop: "onCheckedChange", type: "(checked: boolean) => void", defaultValue: "-", desc: "状态变化时立即触发。" },
  { prop: "size", type: '"micro" | "mini" | "small" | "medium"', defaultValue: '"small"', desc: "12 / 16 / 22 / 32px 四档固定高度。" },
  { prop: "loading", type: "boolean", defaultValue: "false", desc: "标识异步切换中，同时阻止重复操作。" },
  { prop: "checkedChildren / unCheckedChildren", type: "ReactNode", defaultValue: "-", desc: "分别设置开、关状态下的轨道内容。" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用开关并阻止交互。" },
]

export const switchSemanticDomRows = [
  { part: 'data-slot="switch"', desc: "开关轨道根节点，承载状态、尺寸和交互语义。" },
  { part: 'data-slot="switch-thumb"', desc: "滑块；加载时承载 Spinner。" },
  { part: 'data-slot="switch-content"', desc: "可选的开/关态轨道内容。" },
]

export const switchDoDontRows = [
  { do: "用于切换后立即生效的二元设置。", dont: "用于必须提交后才生效的批量表单选择。" },
  { do: "异步切换使用 loading 阻止重复操作。", dont: "只放一个 Spinner 但仍允许继续切换。" },
  { do: "用 checkedChildren / unCheckedChildren 提供短内容。", dont: "塞入长句导致轨道失去开关形态。" },
  { do: "用 size、disabled 等源码 API。", dont: "在调用处覆盖宽高、位移、颜色或透明度。" },
]

export const switchAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#switch-playground" },
  { label: "API", href: "#switch-props" },
  { label: "语义 DOM", href: "#switch-semantic-dom" },
  { label: "正误示例", href: "#switch-do-dont" },
]

export function SwitchPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="switch"
      title="Switch 开关"
      lead="表达立即生效的二元设置，支持四档尺寸、默认 / 文字 / 图标内容、禁用和加载状态。"
      playground={<ComponentPlayground config={switchPlaygroundConfig} lang={lang} />}
      playgroundDescription="分别调整类型、值、状态和尺寸，预览会实时反映真实组件交互。"
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { Switch } from "@/components/ui/switch"'}
      usageCode={'<Switch checked={enabled} onCheckedChange={setEnabled} />'}
      propRows={switchPropRows}
      semanticDomRows={switchSemanticDomRows}
      doDontRows={switchDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
