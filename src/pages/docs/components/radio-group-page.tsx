import { ComponentPlayground } from "@/components/fx/component-playground"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { radioGroupPlaygroundConfig } from "@/pages/docs/components/radio-group-playground"

export const radioGroupAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#radio-group-playground" },
  { label: "API", href: "#radio-group-props" },
  { label: "语义 DOM", href: "#radio-group-semantic-dom" },
  { label: "正误示例", href: "#radio-group-do-dont" },
]

const radioGroupPropRows = [
  {
    prop: "RadioGroup",
    type: "value? / defaultValue? / onValueChange?",
    defaultValue: "-",
    desc: "单选框容器，负责管理同组单选项的互斥选择。",
  },
  {
    prop: "RadioGroupItem",
    type: 'value / size? / disabled / aria-invalid',
    defaultValue: 'size: "default"',
    desc: "单个单选项；size 支持 sm（12px）、default（14px）和 lg（16px），并与 FieldLabel 字号联动。",
  },
]

const radioGroupSemanticDomRows = [
  {
    part: 'data-slot="radio-group"',
    desc: "单选框根节点，承载分组布局和选择状态管理。",
  },
  {
    part: 'data-slot="radio-group-item"',
    desc: "单个单选项根节点，承载 hover、focus-visible、disabled 与 data-checked 状态。",
  },
  { part: 'data-slot="radio-group-indicator"', desc: "选中态指示圆点。" },
]

const radioGroupDoDontRows = [
  {
    do: "表单单选或表格单选列使用 RadioGroup / RadioGroupItem。",
    dont: "在业务代码里手写 input[type=radio] 并覆盖样式。",
  },
  {
    do: "用 FieldLabel 或 aria-label 为每个选项提供可访问名称。",
    dont: "只展示一个无语义的圆点。",
  },
  {
    do: "用 FieldGroup 的 orientation 表达组布局，并让 hover 与焦点态由真实交互展示。",
    dont: "手写 options 黑盒 API 或 Radio.Button 外观；按钮式互斥选择使用 ToggleGroup。",
  },
  { do: "禁用态使用 disabled。", dont: "靠 opacity 伪装禁用但仍允许交互。" },
]

export function RadioGroupPage({
  actions,
  lang,
}: {
  actions: React.ReactNode
  lang: StandardDocLang
}) {
  return (
    <StandardDocPage
      slug="radio-group"
      title="RadioGroup 单选框"
      lead="表达一组选项中只能选择一个，适用于表单单选与设置项；表格单选列由 Table 的“选择”能力组合。"
      playground={<ComponentPlayground config={radioGroupPlaygroundConfig} lang={lang} />}
      playgroundDescription="切换尺寸、布局和状态，预览会实时反映真实组合交互，并可复制对应写法。"
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"\nimport { Field, FieldContent, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"'}
      usageCode={'<FieldSet>\n  <FieldLegend className="sr-only">选择默认工作台</FieldLegend>\n  <RadioGroup value={value} onValueChange={setValue}>\n    <FieldGroup>\n      <Field orientation="horizontal">\n        <RadioGroupItem id="crm" value="crm" />\n        <FieldContent><FieldLabel htmlFor="crm">客户资料</FieldLabel></FieldContent>\n      </Field>\n    </FieldGroup>\n  </RadioGroup>\n</FieldSet>'}
      propRows={radioGroupPropRows}
      semanticDomRows={radioGroupSemanticDomRows}
      doDontRows={radioGroupDoDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
