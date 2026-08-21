import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircleIcon,
  ChecklistIcon,
  CircleIcon,
  ComponentsIcon,
  FileCodeIcon,
  InfoIcon,
  RefreshIcon,
  SparklesIcon,
} from "@/lib/icons";
import pageBuilderManifestRaw from "../../../docs/data/page-builder.manifest.json?raw";

type ButtonVariant = "default" | "outline" | "secondary" | "destructive";
type ButtonSize = "xs" | "sm" | "md" | "lg";
type ReviewStatus = "reviewing" | "revision-created" | "checked" | "approved";
type ReviewDraft = {
  label: string;
  variant: ButtonVariant;
  size: ButtonSize;
  selectedProperties: string[];
};
type Candidate = {
  id: string;
  name: string;
  version: string;
  status: "pending-review";
  source: string;
  submittedBy: string;
  submittedAt: string;
  summary: string;
  previewAdapter: "button";
  expectedOutputs: string[];
};
type ReviewWorkbenchManifest = {
  candidateSources: string[];
  previewAdapters: {
    id: "button";
    name: string;
    contractSource: string;
  }[];
  controls: {
    id: "variant" | "size";
    name: string;
    values: string[];
  }[];
  runtimeProperties: {
    id: string;
    name: string;
    type: "string" | "enum" | "boolean";
    recommended: boolean;
  }[];
  checks: { id: string; name: string; command: string }[];
  candidates: Candidate[];
  initial: ReviewDraft & { candidateId: string };
};

export type ComponentBuilderHandle = { undo: () => void; redo: () => void };

const pageBuilderManifest = JSON.parse(pageBuilderManifestRaw) as {
  builderModes: {
    id: string;
    reviewWorkbench?: ReviewWorkbenchManifest;
  }[];
};
const workbench = pageBuilderManifest.builderModes.find(
  (mode) => mode.id === "component",
)!.reviewWorkbench!;
const candidate = workbench.candidates.find(
  (item) => item.id === workbench.initial.candidateId,
)!;
const initialDraft: ReviewDraft = {
  label: workbench.initial.label,
  variant: workbench.initial.variant,
  size: workbench.initial.size,
  selectedProperties: workbench.initial.selectedProperties,
};

const variantLabels: Record<ButtonVariant, string> = {
  default: "主按钮",
  outline: "描边按钮",
  secondary: "次级按钮",
  destructive: "危险按钮",
};
const sizeLabels: Record<ButtonSize, string> = {
  xs: "超小",
  sm: "小",
  md: "中",
  lg: "大",
};
const statusLabels: Record<ReviewStatus, string> = {
  reviewing: "待评审",
  "revision-created": "待返工",
  checked: "检查通过",
  approved: "已确认",
};

function cloneDraft(draft: ReviewDraft): ReviewDraft {
  return structuredClone(draft);
}

function PreviewButton({
  draft,
  state = "default",
}: {
  draft: ReviewDraft;
  state?: "default" | "disabled" | "loading" | "with-icon";
}) {
  const showIcon =
    state === "with-icon" && draft.selectedProperties.includes("icon");
  return (
    <Button
      variant={draft.variant}
      size={draft.size}
      disabled={state === "disabled" || state === "loading"}
    >
      {state === "loading" ? <Spinner data-icon="inline-start" /> : null}
      {showIcon ? <SparklesIcon data-icon="inline-start" /> : null}
      {state === "loading" ? "处理中" : draft.label}
    </Button>
  );
}

export const ComponentBuilder = forwardRef<
  ComponentBuilderHandle,
  { onHistoryChange?: (state: { canUndo: boolean; canRedo: boolean }) => void }
>(function ComponentBuilder({ onHistoryChange }, ref) {
  const [draft, setDraft] = useState<ReviewDraft>(() =>
    cloneDraft(initialDraft),
  );
  const [past, setPast] = useState<ReviewDraft[]>([]);
  const [future, setFuture] = useState<ReviewDraft[]>([]);
  const [reviewStatus, setReviewStatus] =
    useState<ReviewStatus>("reviewing");
  const [revisionRequest, setRevisionRequest] = useState(
    "请调整主操作按钮的视觉与状态，并保持现有 token 和 Button API。",
  );

  const commit = (update: (current: ReviewDraft) => ReviewDraft) => {
    setDraft((current) => {
      const next = update(cloneDraft(current));
      if (JSON.stringify(next) === JSON.stringify(current)) return current;
      setPast((history) => [...history, cloneDraft(current)]);
      setFuture([]);
      setReviewStatus("reviewing");
      return next;
    });
  };
  const undo = () => {
    const previous = past[past.length - 1];
    if (!previous) return;
    setPast((history) => history.slice(0, -1));
    setFuture((history) => [cloneDraft(draft), ...history]);
    setDraft(cloneDraft(previous));
    setReviewStatus("reviewing");
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setPast((history) => [...history, cloneDraft(draft)]);
    setFuture((history) => history.slice(1));
    setDraft(cloneDraft(next));
    setReviewStatus("reviewing");
  };

  useImperativeHandle(ref, () => ({ undo, redo }));
  useEffect(
    () =>
      onHistoryChange?.({
        canUndo: past.length > 0,
        canRedo: future.length > 0,
      }),
    [future.length, onHistoryChange, past.length],
  );

  const toggleProperty = (propertyId: string, checked: boolean) =>
    commit((current) => ({
      ...current,
      selectedProperties: checked
        ? [...current.selectedProperties, propertyId]
        : current.selectedProperties.filter((id) => id !== propertyId),
    }));

  const hasIcon = draft.selectedProperties.includes("icon");
  const checksPassed = reviewStatus === "checked" || reviewStatus === "approved";

  return (
    <div
      data-slot="component-builder"
      className="grid min-h-0 grid-cols-[280px_minmax(0,1fr)_320px]"
    >
      <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] border-r border-border-subtle bg-card">
        <div className="border-b border-border-subtle p-4">
          <span className="text-section-title">Agent 候选</span>
          <p className="text-caption text-muted-foreground">
            这里验收外部 Agent 产物，不在画布里重做组件
          </p>
        </div>
        <ScrollArea className="min-h-0">
          <div className="flex flex-col gap-4 p-3">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              aria-label={`选择候选 ${candidate.name} ${candidate.version}`}
            >
              <ComponentsIcon data-icon="inline-start" />
              {candidate.name}
              <Tag variant="outline" className="ml-auto">
                {candidate.version}
              </Tag>
            </Button>
            <div className="flex flex-col gap-2 px-1">
              <div className="flex items-center justify-between">
                <span className="text-label">状态</span>
                <Tag
                  variant={checksPassed ? "success" : "secondary"}
                >
                  {statusLabels[reviewStatus]}
                </Tag>
              </div>
              <p className="text-caption text-muted-foreground">
                {candidate.summary}
              </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-3 px-1">
              <span className="text-label">交接信息</span>
              <dl className="grid grid-cols-[72px_1fr] gap-x-2 gap-y-2 text-caption">
                <dt className="text-muted-foreground">提交方</dt>
                <dd>{candidate.submittedBy}</dd>
                <dt className="text-muted-foreground">来源</dt>
                <dd>MCP 候选契约</dd>
                <dt className="text-muted-foreground">时间</dt>
                <dd>{candidate.submittedAt}</dd>
                <dt className="text-muted-foreground">预览</dt>
                <dd>Button 安全适配器</dd>
              </dl>
            </div>
            <Separator />
            <div className="flex flex-col gap-3 px-1">
              <span className="text-label">确认后产物</span>
              {candidate.expectedOutputs.map((output) => (
                <div key={output} className="flex items-center gap-2 text-caption">
                  <FileCodeIcon />
                  {output}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </aside>

      <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] bg-muted">
        <div className="flex items-center justify-between border-b border-border-subtle bg-card px-5 py-3">
          <div>
            <span className="text-section-title">{candidate.name}</span>
            <p className="text-caption text-muted-foreground">
              真实组件预览 · 当前调整只作用于候选契约
            </p>
          </div>
          <Tag variant="outline">{candidate.version}</Tag>
        </div>

        <ScrollArea className="min-h-0">
          <div className="flex flex-col gap-6 p-6">
            {reviewStatus === "revision-created" ? (
              <Alert>
                <RefreshIcon />
                <AlertTitle>返工任务已生成</AlertTitle>
                <AlertDescription>
                  已整理当前配置和修改要求，等待外部 Agent 连接器接收；尚未执行代码修改。
                </AlertDescription>
              </Alert>
            ) : null}
            {checksPassed ? (
              <Alert>
                <CheckCircleIcon />
                <AlertTitle>
                  {reviewStatus === "approved" ? "候选已确认" : "治理检查已通过"}
                </AlertTitle>
                <AlertDescription>
                  {reviewStatus === "approved"
                    ? "已进入 Playground 与组件入库审核队列，尚未直接覆盖组件源码。"
                    : "可以确认候选，或继续修改后重新运行检查。"}
                </AlertDescription>
              </Alert>
            ) : null}

            <section
              data-slot="candidate-live-preview"
              className="flex min-h-72 flex-col items-center justify-center gap-4 bg-background p-8"
            >
              <span className="text-caption text-muted-foreground">实时预览</span>
              <PreviewButton draft={draft} />
              <p className="max-w-xl text-center text-caption text-muted-foreground">
                直接悬停、聚焦或点击检查真实交互。外观只能通过 Button
                已有 variant、size 和语义 token 调整。
              </p>
            </section>

            <section className="flex flex-col gap-3" data-slot="candidate-state-matrix">
              <div>
                <span className="text-section-title">状态验收</span>
                <p className="text-caption text-muted-foreground">
                  组合态按真实 Button 契约渲染；Loading = disabled + Spinner
                </p>
              </div>
              <div className="grid grid-cols-4 divide-x divide-border-subtle bg-card">
                <div className="flex min-h-28 flex-col items-center justify-center gap-3 p-4">
                  <span className="text-caption text-muted-foreground">默认</span>
                  <PreviewButton draft={draft} />
                </div>
                <div className="flex min-h-28 flex-col items-center justify-center gap-3 p-4">
                  <span className="text-caption text-muted-foreground">禁用</span>
                  <PreviewButton draft={draft} state="disabled" />
                </div>
                <div className="flex min-h-28 flex-col items-center justify-center gap-3 p-4">
                  <span className="text-caption text-muted-foreground">加载</span>
                  <PreviewButton draft={draft} state="loading" />
                </div>
                <div className="flex min-h-28 flex-col items-center justify-center gap-3 p-4">
                  <span className="text-caption text-muted-foreground">前置图标</span>
                  {hasIcon ? (
                    <PreviewButton draft={draft} state="with-icon" />
                  ) : (
                    <Tag variant="secondary">未暴露</Tag>
                  )}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-3" data-slot="candidate-checks">
              <div>
                <span className="text-section-title">自动验收</span>
                <p className="text-caption text-muted-foreground">
                  页面展示声明的检查契约；真实命令由 Agent/CI 执行并回传结果
                </p>
              </div>
              <div className="divide-y divide-border-subtle bg-card">
                {workbench.checks.map((check) => (
                  <div
                    key={check.id}
                    className="flex items-center gap-3 px-4 py-3"
                    data-check-id={check.id}
                  >
                    {checksPassed ? (
                      <CheckCircleIcon className="text-success" />
                    ) : (
                      <CircleIcon className="text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-label">{check.name}</p>
                      <code className="text-caption text-muted-foreground">
                        {check.command}
                      </code>
                    </div>
                    <Tag variant={checksPassed ? "success" : "outline"}>
                      {checksPassed ? "通过" : "待运行"}
                    </Tag>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="border-t border-border-subtle bg-card px-5 py-3">
          <FieldGroup orientation="horizontal">
            <Field>
              <FieldLabel htmlFor="candidate-revision" className="sr-only">
                给外部 Agent 的修改要求
              </FieldLabel>
              <Textarea
                id="candidate-revision"
                value={revisionRequest}
                onChange={(event) => setRevisionRequest(event.target.value)}
                placeholder="告诉外部 Agent 需要修改什么"
              />
            </Field>
            <Button
              variant="outline"
              disabled={!revisionRequest.trim() || reviewStatus === "approved"}
              onClick={() => setReviewStatus("revision-created")}
            >
              <RefreshIcon data-icon="inline-start" />
              生成返工任务
            </Button>
          </FieldGroup>
        </div>
      </section>

      <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] border-l border-border-subtle bg-card">
        <div className="border-b border-border-subtle px-4 py-3">
          <span className="text-section-title">评审配置</span>
          <p className="text-caption text-muted-foreground">
            只开放候选声明的真实 API 与 token 档
          </p>
        </div>
        <ScrollArea className="min-h-0">
          <div className="flex flex-col gap-5 p-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="candidate-label">预览文字</FieldLabel>
                <Input
                  id="candidate-label"
                  value={draft.label}
                  onChange={(event) =>
                    commit((current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="candidate-variant">外观变体</FieldLabel>
                <Select
                  items={Object.entries(variantLabels).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                  value={draft.variant}
                  onValueChange={(value) =>
                    value &&
                    commit((current) => ({
                      ...current,
                      variant: value as ButtonVariant,
                    }))
                  }
                >
                  <SelectTrigger id="candidate-variant" aria-label="外观变体">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(variantLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="candidate-size">组件尺寸</FieldLabel>
                <Select
                  items={Object.entries(sizeLabels).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                  value={draft.size}
                  onValueChange={(value) =>
                    value &&
                    commit((current) => ({
                      ...current,
                      size: value as ButtonSize,
                    }))
                  }
                >
                  <SelectTrigger id="candidate-size" aria-label="组件尺寸">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(sizeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <Separator />

            <FieldSet data-slot="runtime-property-selection">
              <FieldLegend variant="label">公开实时属性</FieldLegend>
              <FieldDescription>
                Agent 已给出建议；这里只确认最终组件需要暴露的 Props。
              </FieldDescription>
              <FieldGroup>
                {workbench.runtimeProperties.map((property) => (
                  <Field key={property.id} orientation="horizontal">
                    <Checkbox
                      id={`review-property-${property.id}`}
                      checked={draft.selectedProperties.includes(property.id)}
                      onCheckedChange={(checked) =>
                        toggleProperty(property.id, Boolean(checked))
                      }
                    />
                    <FieldLabel htmlFor={`review-property-${property.id}`}>
                      {property.name}
                    </FieldLabel>
                    {property.recommended ? (
                      <Tag variant="secondary" className="ml-auto">
                        建议
                      </Tag>
                    ) : null}
                  </Field>
                ))}
              </FieldGroup>
            </FieldSet>

            <Separator />

            <Alert>
              <InfoIcon />
              <AlertTitle>治理边界</AlertTitle>
              <AlertDescription>
                此处不接受 CSS、像素值或不存在的 prop。确认只会进入实现与入库审核队列。
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>
        <div className="flex flex-col gap-2 border-t border-border-subtle p-4">
          <Button
            variant="outline"
            disabled={reviewStatus === "approved"}
            onClick={() => setReviewStatus("checked")}
          >
            <ChecklistIcon data-icon="inline-start" />
            运行验收
          </Button>
          <Button
            disabled={!checksPassed || reviewStatus === "approved"}
            onClick={() => setReviewStatus("approved")}
          >
            <CheckCircleIcon data-icon="inline-start" />
            确认进入 Playground
          </Button>
        </div>
      </aside>
    </div>
  );
});
