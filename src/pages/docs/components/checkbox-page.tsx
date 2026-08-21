import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page";
import { ComponentPlayground } from "@/components/fx/component-playground";
import { checkboxPlaygroundConfig } from "@/pages/docs/components/checkbox-playground";

type ScenarioExample = {
  id: string;
  title: string;
  intent: string;
  rule: string;
  code: string;
  group?: string;
  spec?: string;
};
type PropRow = {
  prop: string;
  type: string;
  defaultValue: string;
  desc: string;
};
type SemanticDomRow = { part: string; desc: string };
type DoDontRow = { do: string; dont: string };

export const checkboxPropRows = [
  {
    prop: "size",
    type: '"sm" | "default" | "lg"',
    defaultValue: '"default"',
    desc: "控件与标签联动的尺寸档位；sm 为 12px，default 为 14px，lg 为 16px。",
  },
  {
    prop: "checked / defaultChecked",
    type: "boolean",
    defaultValue: "false",
    desc: "受控 / 非受控的选中状态",
  },
  {
    prop: "indeterminate",
    type: "boolean",
    defaultValue: "false",
    desc: "半选状态，通常由子项选中数量派生，用于全选复选框",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean) => void",
    defaultValue: "—",
    desc: "选中状态变化时的回调",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "禁用复选框，阻止交互并触发禁用态样式",
  },
  {
    prop: "aria-invalid",
    type: "boolean",
    defaultValue: "false",
    desc: "标记当前选项未通过校验，触发错误态样式",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    desc: "与 Label 的 htmlFor 关联，建立可访问性映射",
  },
];
export const checkboxSemanticDomRows = [
  {
    part: 'data-slot="checkbox"',
    desc: "复选框根节点，承载边框、圆角、选中态背景",
  },
  {
    part: 'data-slot="checkbox-indicator"',
    desc: "选中态的对勾图标容器，仅在选中时渲染内容",
  },
  { part: "data-checked", desc: "选中态的语义标记，驱动选中态背景和边框颜色" },
  { part: "indeterminate", desc: "半选状态；父级全选项应由子项选择结果派生，而非独立维护" },
];
export const checkboxDoDontRows = [
  {
    do: "搭配 Label 并用 id / htmlFor 关联。",
    dont: "只让文字在视觉上挨着复选框。",
  },
  {
    do: "用 checked + onCheckedChange 做受控状态管理。",
    dont: "用 ref 直接读写 DOM 节点状态。",
  },
  {
    do: "列表批量选择时让行选中态和表头全选状态联动。",
    dont: "让全选复选框和行复选框各自维护独立状态。",
  },
  {
    do: "用 disabled 表达不可更改。",
    dont: "用样式降低透明度但仍可点击切换。",
  },
];

export const checkboxAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#checkbox-playground" },
  { label: "API", href: "#checkbox-props" },
  { label: "语义 DOM", href: "#checkbox-semantic-dom" },
  { label: "正误示例", href: "#checkbox-do-dont" },
];

export function CheckboxPage({
  actions,
  lang,
  scenarioExamples,
  propRows,
  semanticDomRows,
  doDontRows,
}: {
  actions: React.ReactNode;
  lang: StandardDocLang;
  scenarioExamples: ScenarioExample[];
  propRows: PropRow[];
  semanticDomRows: SemanticDomRow[];
  doDontRows: DoDontRow[];
}) {
  return (
    <StandardDocPage
      slug="checkbox"
      title="Checkbox 多选框"
      lead="表达单个布尔选项的勾选，常用于条款确认、设置项、列表批量选择。"
      playground={
        <ComponentPlayground config={checkboxPlaygroundConfig} lang={lang} />
      }
      playgroundDescription="切换类型和状态，预览会实时反映真实组合交互，并可复制对应写法。"
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={scenarioExamples}
      renderScenarioPreview={() => null}
      importCode={`import { Checkbox } from "@/components/ui/checkbox"\nimport { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field"`}
      usageCode={`<FieldGroup>\n  <Field orientation="horizontal">\n    <Checkbox id="agree" />\n    <FieldContent>\n      <FieldLabel htmlFor="agree">我已阅读并同意服务条款</FieldLabel>\n    </FieldContent>\n  </Field>\n</FieldGroup>`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  );
}
