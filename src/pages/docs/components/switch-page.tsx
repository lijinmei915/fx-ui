import { useState } from "react";
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { StandardScenarioPlayground } from "@/pages/docs/components/standard-scenario-playground";

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

export const switchPropRows = [
  {
    prop: "checked / defaultChecked",
    type: "boolean",
    defaultValue: "false",
    desc: "受控 / 非受控的开关状态",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean) => void",
    defaultValue: "—",
    desc: "状态变化时的回调，切换后立即触发",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "禁用开关，阻止交互并触发禁用态样式",
  },
  {
    prop: "size",
    type: '"sm" | "default"',
    defaultValue: "default",
    desc: "开关的尺寸（影响轨道和滑块大小）",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    desc: "与 Label 的 htmlFor 关联，建立可访问性映射",
  },
];
export const switchSemanticDomRows = [
  {
    part: 'data-slot="switch"',
    desc: "开关轨道根节点，承载圆角、开/关态背景色",
  },
  {
    part: 'data-slot="switch-thumb"',
    desc: "可滑动的圆形滑块，位移表达开/关状态",
  },
  {
    part: "data-checked / data-unchecked",
    desc: "开关状态的语义标记，驱动轨道颜色和滑块位移",
  },
];
export const switchDoDontRows = [
  {
    do: "用于立即生效的设置项，搭配 Label 说明用途。",
    dont: "把 Switch 当复选框用在需要批量提交的表单里。",
  },
  {
    do: "用 checked + onCheckedChange 做受控状态管理。",
    dont: "用 ref 直接读写 DOM 节点状态。",
  },
  {
    do: "用 size 属性切换紧凑/默认尺寸。",
    dont: "用 className 覆盖宽高、位移来改尺寸。",
  },
  {
    do: "用 disabled 表达不可更改。",
    dont: "用样式降低透明度但仍可点击切换。",
  },
];

export const switchAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#switch-playground" },
  { label: "API", href: "#switch-props" },
  { label: "语义 DOM", href: "#switch-semantic-dom" },
  { label: "正误示例", href: "#switch-do-dont" },
];

function SwitchPreview({ id }: { id: string }) {
  const [enabled, setEnabled] = useState(false);
  if (id === "default")
    return (
      <Field orientation="horizontal">
        <Switch id="switch-demo-default" />
        <FieldContent>
          <FieldLabel htmlFor="switch-demo-default">接收消息通知</FieldLabel>
          <FieldDescription>切换后立即生效。</FieldDescription>
        </FieldContent>
      </Field>
    );
  if (id === "checked")
    return (
      <Field orientation="horizontal">
        <Switch
          id="switch-demo-checked"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
        <FieldContent>
          <FieldLabel htmlFor="switch-demo-checked">
            {enabled ? "已开启" : "已关闭"}
          </FieldLabel>
        </FieldContent>
      </Field>
    );
  if (id === "small")
    return (
      <Field orientation="horizontal">
        <Switch id="switch-demo-small" size="sm" />
        <FieldContent>
          <FieldLabel htmlFor="switch-demo-small">紧凑尺寸</FieldLabel>
        </FieldContent>
      </Field>
    );
  return (
    <Field orientation="horizontal" data-disabled>
      <Switch id="switch-demo-disabled" disabled />
      <FieldContent>
        <FieldLabel htmlFor="switch-demo-disabled">该选项不可更改</FieldLabel>
      </FieldContent>
    </Field>
  );
}

export function SwitchPage({
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
      slug="switch"
      title="Switch 开关"
      lead="表达立即生效的二元设置项，切换后无需额外提交，常用于偏好设置、功能开关。"
      playground={
        <StandardScenarioPlayground
          slug="switch"
          examples={scenarioExamples}
          renderScenarioPreview={(id) => <SwitchPreview id={id} />}
          importCode={`import { Switch } from "@/components/ui/switch"\nimport { Field, FieldContent, FieldLabel } from "@/components/ui/field"`}
          lang={lang}
        />
      }
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={scenarioExamples}
      renderScenarioPreview={(id) => <SwitchPreview id={id} />}
      importCode={`import { Switch } from "@/components/ui/switch"\nimport { Field, FieldContent, FieldLabel } from "@/components/ui/field"`}
      usageCode={`<Field orientation="horizontal">\n  <Switch id="notify" />\n  <FieldContent>\n    <FieldLabel htmlFor="notify">接收消息通知</FieldLabel>\n  </FieldContent>\n</Field>`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  );
}
