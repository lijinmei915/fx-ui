import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page";
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw";
import {
  standardScenarioExamplesFromManifest,
  type ComponentPlaygroundsManifest,
} from "@/pages/docs/components/component-playground-manifest";

export const radioGroupAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#radio-group-playground" },
  { label: "API", href: "#radio-group-props" },
  { label: "语义 DOM", href: "#radio-group-semantic-dom" },
  { label: "正误示例", href: "#radio-group-do-dont" },
];

const radioGroupImportCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"\nimport { Field, FieldContent, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"`;

const radioGroupUsageCode = `<FieldSet>\n  <FieldLegend>默认工作台</FieldLegend>\n  <RadioGroup value={value} onValueChange={setValue}>\n    <FieldGroup>\n      <Field orientation="horizontal">\n        <RadioGroupItem id="crm" value="crm" />\n        <FieldContent>\n          <FieldLabel htmlFor="crm">CRM</FieldLabel>\n        </FieldContent>\n      </Field>\n      <Field orientation="horizontal">\n        <RadioGroupItem id="bi" value="bi" />\n        <FieldContent>\n          <FieldLabel htmlFor="bi">BI</FieldLabel>\n        </FieldContent>\n      </Field>\n    </FieldGroup>\n  </RadioGroup>\n</FieldSet>`;

const componentPlaygroundsManifest = JSON.parse(
  componentPlaygroundsManifestRaw,
) as ComponentPlaygroundsManifest;
const radioGroupScenarioExamples = standardScenarioExamplesFromManifest(
  componentPlaygroundsManifest,
  "radio-group",
);

function RadioGroupPreview({ id }: { id: string }) {
  const disabled = id === "disabled";
  return (
    <FieldSet>
      <FieldLegend>默认工作台</FieldLegend>
      <RadioGroup defaultValue="crm">
        <FieldGroup>
          <Field orientation="horizontal">
            <RadioGroupItem id={`radio-playground-${id}-crm`} value="crm" />
            <FieldContent>
              <FieldLabel htmlFor={`radio-playground-${id}-crm`}>
                CRM
              </FieldLabel>
            </FieldContent>
          </Field>
          <Field orientation="horizontal" data-disabled={disabled || undefined}>
            <RadioGroupItem
              id={`radio-playground-${id}-${disabled ? "disabled" : "bi"}`}
              value={disabled ? "disabled" : "bi"}
              disabled={disabled}
            />
            <FieldContent>
              <FieldLabel
                htmlFor={`radio-playground-${id}-${disabled ? "disabled" : "bi"}`}
              >
                {disabled ? "不可选择" : "BI"}
              </FieldLabel>
            </FieldContent>
          </Field>
        </FieldGroup>
      </RadioGroup>
    </FieldSet>
  );
}

const radioGroupPropRows = [
  {
    prop: "RadioGroup",
    type: "value? / defaultValue? / onValueChange?",
    defaultValue: "—",
    desc: "单选组容器，负责管理同组单选项的互斥选择。",
  },
  {
    prop: "RadioGroupItem",
    type: "value / disabled / aria-invalid",
    defaultValue: "—",
    desc: "单个单选项，value 必须能唯一标识该选项。",
  },
];

const radioGroupSemanticDomRows = [
  {
    part: 'data-slot="radio-group"',
    desc: "单选组根节点，承载分组布局和选择状态管理。",
  },
  {
    part: 'data-slot="radio-group-item"',
    desc: "单个单选项根节点，承载 focus-visible、disabled、data-checked 等状态。",
  },
  { part: 'data-slot="radio-group-indicator"', desc: "选中态指示圆点。" },
];

const radioGroupDoDontRows = [
  {
    do: "表单单选或表格单选列使用 RadioGroup / RadioGroupItem。",
    dont: "在业务代码里手写 input[type=radio] 并覆盖样式。",
  },
  {
    do: "每个 RadioGroupItem 提供唯一 value，并用 Label 或 aria-label 说明含义。",
    dont: "只展示一个无语义的圆点，让读屏器无法理解选项。",
  },
  { do: "禁用态使用 disabled。", dont: "靠 opacity 伪装禁用但仍允许交互。" },
];

export function RadioGroupPage({
  actions,
  lang,
  autoScenarioSlugs,
}: {
  actions: React.ReactNode;
  lang: StandardDocLang;
  autoScenarioSlugs: string[];
}) {
  return (
    <StandardDocPage
      slug="radio-group"
      title="RadioGroup 单选组"
      lead="表达一组选项中只能选择一个，适用于表单单选、设置项和表格单选列。"
      overview={null}
      scenarioExamples={radioGroupScenarioExamples}
      renderScenarioPreview={(id) => <RadioGroupPreview id={id} />}
      importCode={radioGroupImportCode}
      usageCode={radioGroupUsageCode}
      propRows={radioGroupPropRows}
      semanticDomRows={radioGroupSemanticDomRows}
      doDontRows={radioGroupDoDontRows}
      autoScenarioSlugs={autoScenarioSlugs}
      actions={actions}
      lang={lang}
    />
  );
}
