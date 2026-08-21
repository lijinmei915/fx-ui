import { ColorPicker } from "@/components/fx/color-picker"
import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const colorPickerManifest = manifest.customPlaygrounds!.colorPicker
const colors = ["#1677ff", "#13c2c2", "#52c41a", "#faad14", "#ff4d4f", "#722ed1", "#eb2f96", "#8c8c8c", "#262626", "#ffffff"]

function renderColorPicker(values: Record<string, string>) {
  return (
    <ColorPicker
      key={JSON.stringify(values)}
      defaultOpen
      defaultValue="#1677ffcc"
      showPreviewSwatch={values.showPreviewSwatch !== "false"}
      showEyedropper={values.showEyedropper !== "false"}
      showAlpha={values.showAlpha !== "false"}
      defaultFormat={(values.format || "HEX") as "HEX" | "RGB" | "HSL" | "CSS"}
      recentColors={values.showRecent === "true" ? colors.slice(0, 8) : []}
      presetColors={values.showPresets !== "false" ? [...colors, ...colors, ...colors, ...colors, ...colors] : []}
      triggerContent={(values.triggerContent || "value") as "value" | "name" | "label"}
      colorName="品牌蓝"
      label="主题颜色"
    />
  )
}

export const colorPickerPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.colorPicker",
  props: componentPlaygroundPropsFromManifest(colorPickerManifest),
  initial: colorPickerManifest.initial,
  guidanceKey: colorPickerManifest.guidanceKey,
  previewItemsClassName: "min-h-[540px] items-start",
  renderOne: renderColorPicker,
  genCode: (values) => `import { ColorPicker } from "@/components/fx/color-picker"\n\n<ColorPicker showAlpha={${values.showAlpha !== "false"}} defaultFormat="${values.format || "HEX"}" onValueChange={setColor} />`,
}

export const colorPickerAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#color-picker-playground" },
  { label: "API", href: "#color-picker-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#color-picker-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#color-picker-do-dont" },
]

const propRows = [
  { prop: "value / defaultValue", type: "string", defaultValue: '"#1677ff"', desc: "受控或非受控 CSS 颜色值；确定后提交。" },
  { prop: "format / defaultFormat", type: '"HEX" | "RGB" | "HSL" | "CSS"', defaultValue: '"HEX"', desc: "受控或非受控显示格式。" },
  { prop: "showPreviewSwatch / showEyedropper / showAlpha", type: "boolean", defaultValue: "true", desc: "控制 Figma 中三个可选结构能力。" },
  { prop: "recentColors / presetColors", type: "string[]", defaultValue: "[]", desc: "最近色最多展示 10 个；预设色超过四行时滚动。" },
  { prop: "triggerContent", type: '"value" | "name" | "label"', defaultValue: '"value"', desc: "触发器展示颜色值、颜色名或字段标签。" },
  { prop: "onValueChange / onConfirm", type: "(value: string) => void", defaultValue: "—", desc: "点击确定时提交草稿色。" },
  { prop: "onClear", type: "() => void", defaultValue: "—", desc: "点击清除时通知业务侧。" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用触发器。" },
]

export function ColorPickerPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="color-picker"
      title="ColorPicker 颜色选择器"
      lead="选择、输入、吸取和复用颜色；面板结构参考 Figma，视觉使用 fx-ui token。"
      playground={<ComponentPlayground config={colorPickerPlaygroundConfig} lang={lang} />}
      hideOverview hideScenarioExamples hideUsage overview={null} scenarioExamples={[]} renderScenarioPreview={() => null}
      importCode={'import { ColorPicker } from "@/components/fx/color-picker"'}
      usageCode={'<ColorPicker value={color} onValueChange={setColor} />'}
      propRows={propRows}
      semanticDomRows={[
        { part: 'data-slot="color-picker"', desc: "颜色面板主体。" },
        { part: 'data-slot="color-picker-preview"', desc: "当前草稿色预览。" },
        { part: 'data-slot="color-picker-recent"', desc: "最近使用颜色。" },
        { part: 'data-slot="color-picker-presets"', desc: "系统预设颜色。" },
        { part: 'data-slot="color-picker-footer"', desc: "清除与确定命令。" },
      ]}
      doDontRows={[
        { do: "用真实颜色数据和结构 props 表达差异。", dont: "把 hover、active 或截图编号做成 mode prop。" },
        { do: "颜色数据可动态传入；组件 chrome 使用 token。", dont: "在调用处覆盖面板颜色、圆角、边框或内间距。" },
      ]}
      actions={actions}
      lang={lang}
    />
  )
}
