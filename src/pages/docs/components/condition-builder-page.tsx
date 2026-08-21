import { ConditionBuilder, type ConditionBuilderValue, type ConditionField } from "@/components/fx/condition-builder"
import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

const manifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const conditionBuilderManifest = manifest.customPlaygrounds!.conditionBuilder

export const conditionBuilderFields: ConditionField[] = [
  {
    value: "country",
    label: "客户所在国家",
    valueType: "select",
    operators: [{ value: "is", label: "是" }, { value: "is-not", label: "不是" }],
    options: [{ value: "china", label: "中国" }, { value: "usa", label: "美国" }, { value: "japan", label: "日本" }],
  },
  {
    value: "tags",
    label: "客户标签",
    valueType: "multi-select",
    operators: [{ value: "contains-any", label: "包含任一" }, { value: "contains-all", label: "包含全部" }],
    options: [{ value: "important", label: "重点客户" }, { value: "renewal", label: "待续约" }, { value: "partner", label: "合作伙伴" }],
  },
  {
    value: "name",
    label: "客户名称",
    valueType: "text",
    operators: [{ value: "contains", label: "包含" }, { value: "equals", label: "等于" }, { value: "empty", label: "为空" }],
    placeholder: "输入客户名称",
  },
  {
    value: "amount",
    label: "合同金额",
    valueType: "number",
    operators: [{ value: "greater-than", label: "大于" }, { value: "less-than", label: "小于" }, { value: "equals", label: "等于" }],
    placeholder: "输入金额",
  },
]

const singleGroupValue: ConditionBuilderValue = {
  groups: [{
    id: "group-a",
    rules: [
      { id: "rule-country", field: "country", operator: "is", value: "china", exposed: true },
      { id: "rule-tags", field: "tags", operator: "contains-any", value: ["important", "renewal"] },
    ],
  }],
}

const orGroupsValue: ConditionBuilderValue = {
  groups: [
    ...singleGroupValue.groups,
    { id: "group-b", rules: [{ id: "rule-name", field: "name", operator: "contains", value: "科技", exposed: false }] },
  ],
}

function renderConditionBuilder(values: Record<string, string>) {
  return (
    <ConditionBuilder
      key={JSON.stringify(values)}
      fields={conditionBuilderFields}
      defaultValue={values.structure === "or-groups" ? orGroupsValue : singleGroupValue}
      disabled={values.disabled === "true"}
      readOnly={values.readOnly === "true"}
      maxGroups={4}
      maxRulesPerGroup={6}
    />
  )
}

export const conditionBuilderPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#customPlaygrounds.conditionBuilder",
  props: componentPlaygroundPropsFromManifest(conditionBuilderManifest),
  initial: conditionBuilderManifest.initial,
  guidanceKey: conditionBuilderManifest.guidanceKey,
  previewItemsClassName: "w-full",
  renderOne: renderConditionBuilder,
  genCode: (values) => `import { ConditionBuilder } from "@/components/fx/condition-builder"\n\n<ConditionBuilder fields={fields} value={filters} onValueChange={setFilters}${values.disabled === "true" ? " disabled" : ""}${values.readOnly === "true" ? " readOnly" : ""} />`,
}

export const conditionBuilderAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#condition-builder-playground" },
  { label: "API", href: "#condition-builder-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#condition-builder-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#condition-builder-do-dont" },
]

const propRows: PropRow[] = [
  { prop: "fields", type: "ConditionField[]", defaultValue: "—", desc: "字段、值类型、可用操作符和候选项的唯一配置源。" },
  { prop: "value / defaultValue", type: "ConditionBuilderValue", defaultValue: "{ groups: [] }", desc: "OR 条件组及组内 AND 规则的受控或非受控值。" },
  { prop: "onValueChange", type: "(value) => void", defaultValue: "—", desc: "新增、删除或编辑任一条件后返回完整结构值。" },
  { prop: "disabled / readOnly", type: "boolean", defaultValue: "false", desc: "禁用全部交互，或仅允许查看当前条件。" },
  { prop: "maxGroups / maxRulesPerGroup", type: "number", defaultValue: "—", desc: "限制 OR 组数量和每组条件数量。" },
  { prop: "*Label / *Placeholder / emptyText", type: "string", defaultValue: "中文默认文案", desc: "业务文案与空态文案，不用于覆盖视觉。" },
]

const semanticDomRows: SemanticDomRow[] = [
  { part: 'data-slot="condition-builder"', desc: "根节点，暴露 disabled 与 readonly 运行态。" },
  { part: 'data-slot="condition-group"', desc: "一个 AND 条件组；多个组之间按 OR 连接。" },
  { part: 'data-slot="condition-rule"', desc: "字段、操作符、值、删除和外露组成的一条规则。" },
  { part: 'data-slot="condition-builder-or"', desc: "条件组之间的 OR 语义分隔。" },
  { part: 'data-slot="condition-group-actions" / "condition-builder-actions"', desc: "新增条件、删除组和新增 OR 组操作。" },
]

const doDontRows: DoDontRow[] = [
  { do: "用稳定 id 保存组和规则，并用 value + onValueChange 接入查询状态。", dont: "用 DOM 顺序或展示文案充当规则标识。" },
  { do: "字段切换后接受组件自动重置操作符和值。", dont: "保留与新字段不兼容的旧值。" },
  { do: "在 fields 中声明值类型、操作符与候选项。", dont: "为每个页面复制一套条件行 JSX。" },
]

export function ConditionBuilderPage({ actions, lang }: { actions: React.ReactNode; lang: StandardDocLang }) {
  return (
    <StandardDocPage
      slug="condition-builder"
      title="ConditionBuilder 条件选择器"
      lead="用 AND 规则与 OR 条件组构造列表筛选，支持文本、数值、单选、多选和外露状态。"
      playground={<ComponentPlayground config={conditionBuilderPlaygroundConfig} lang={lang} />}
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={[]}
      renderScenarioPreview={() => null}
      importCode={'import { ConditionBuilder } from "@/components/fx/condition-builder"'}
      usageCode={'<ConditionBuilder fields={fields} value={filters} onValueChange={setFilters} />'}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
