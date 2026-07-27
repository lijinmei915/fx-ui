import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { StandardScenarioPlayground } from "@/pages/docs/components/standard-scenario-playground";
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page";

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

export const textareaPropRows = [
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "禁用输入，触发禁用态样式",
  },
  {
    prop: "aria-invalid",
    type: "boolean",
    defaultValue: "false",
    desc: "标记当前值未通过校验，触发错误态样式",
  },
  {
    prop: "placeholder",
    type: "string",
    defaultValue: "—",
    desc: "占位提示文字",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    desc: "在保留基础样式的前提下追加 Tailwind 类名",
  },
  {
    prop: "...props",
    type: 'React.ComponentProps<"textarea">',
    defaultValue: "—",
    desc: "透传所有原生 textarea 属性（value / onChange / rows / required 等）",
  },
];
export const textareaSemanticDomRows = [
  {
    part: 'data-slot="textarea"',
    desc: "标记多行输入框根节点，供样式选择器和测试定位使用",
  },
  { part: "aria-invalid", desc: "校验失败态的语义标记，同时驱动错误态样式" },
  { part: "disabled", desc: "原生禁用属性，驱动禁用态样式并阻止交互" },
];
export const textareaDoDontRows = [
  {
    do: "搭配 Label 并用 id / htmlFor 关联。",
    dont: "只让 Label 在视觉上挨着 Textarea。",
  },
  {
    do: "让高度跟随内容自适应（默认行为）。",
    dont: "手写固定 rows 或 height 撑死/限死高度。",
  },
  {
    do: "校验失败时设置 aria-invalid。",
    dont: "手写红色边框 className 来表示错误态。",
  },
  {
    do: "用 disabled 表达不可编辑。",
    dont: "用样式伪装禁用（如降低透明度但仍可输入）。",
  },
];

export const textareaAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#textarea-playground" },
  { label: "API", href: "#textarea-props" },
  { label: "语义 DOM", href: "#textarea-semantic-dom" },
  { label: "正误示例", href: "#textarea-do-dont" },
];

function TextareaPreview({ id }: { id: string }) {
  if (id === "default")
    return (
      <FieldGroup className="w-[220px]">
        <Field>
          <FieldLabel htmlFor={`textarea-demo-${id}`}>个人简介</FieldLabel>
          <Textarea id={`textarea-demo-${id}`} placeholder="简单介绍一下自己" />
          <FieldDescription>用于公开展示的个人信息。</FieldDescription>
        </Field>
      </FieldGroup>
    );
  if (id === "disabled")
    return (
      <FieldGroup className="w-[220px]">
        <Field data-disabled>
          <FieldLabel htmlFor="textarea-demo-disabled">备注</FieldLabel>
          <Textarea
            id="textarea-demo-disabled"
            disabled
            placeholder="不可编辑"
          />
        </Field>
      </FieldGroup>
    );
  return (
    <FieldGroup className="w-[220px]">
      <Field data-invalid>
        <FieldLabel htmlFor="textarea-demo-invalid">备注</FieldLabel>
        <Textarea
          id="textarea-demo-invalid"
          aria-invalid
          placeholder="请输入至少 10 个字"
        />
        <FieldError>请输入至少 10 个字。</FieldError>
      </Field>
    </FieldGroup>
  );
}

export function TextareaPage({
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
      slug="textarea"
      title="Textarea 文本域"
      lead="多行文本录入控件，用于备注、描述、反馈等较长内容。"
      playground={
        <StandardScenarioPlayground
          slug="textarea"
          examples={scenarioExamples}
          renderScenarioPreview={(id) => <TextareaPreview id={id} />}
          importCode={`import { Textarea } from "@/components/ui/textarea"\nimport { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"`}
          lang={lang}
        />
      }
      hideOverview
      hideScenarioExamples
      hideUsage
      overview={null}
      scenarioExamples={scenarioExamples}
      renderScenarioPreview={(id) => <TextareaPreview id={id} />}
      importCode={`import { Textarea } from "@/components/ui/textarea"\nimport { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"`}
      usageCode={`<FieldGroup>\n  <Field>\n    <FieldLabel htmlFor="bio">个人简介</FieldLabel>\n    <Textarea id="bio" placeholder="简单介绍一下自己" />\n    <FieldDescription>简单介绍一下自己。</FieldDescription>\n  </Field>\n</FieldGroup>`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  );
}
