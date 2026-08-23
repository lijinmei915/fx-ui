import { useRef, useState, type ReactNode } from "react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  EyeIcon,
  FileTextIcon,
  LayoutGridFilledIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  Trash2Icon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  BusinessComponentBuilder,
  type BusinessComponentBuilderHandle,
} from "@/components/recipes/business-component-builder";

export type PageBuilderSlot = {
  id: string;
  block: string;
  label?: string;
  category?: string;
  zones?: string[];
  required: boolean;
  max: number;
};
export type PageBuilderPreset = {
  id: string;
  name: string;
  blocks: string[];
  properties: Record<string, string>;
};
export type PageBuilderTemplate = {
  id: string;
  name: string;
  slots: PageBuilderSlot[];
  properties: Array<{
    id: string;
    type: "text" | "enum";
    values?: string[];
    default: string;
  }>;
  presets: PageBuilderPreset[];
  builder?: {
    layouts: Array<{
      id: string;
      name: string;
      description: string;
      frame: string;
      zones: string[];
    }>;
    zones: Array<{ id: string; name: string }>;
    libraryGroups: Array<{ id: string; name: string }>;
  };
};
export type PageBuilderValue = {
  blocks: string[];
  properties: Record<string, string>;
};
export type PageBuilderOperation =
  | { op: "insertBlock"; block: string; after?: string }
  | { op: "removeBlock"; block: string }
  | { op: "moveBlock"; block: string; before?: string; after?: string }
  | { op: "setProp"; target: "page" | string; name: string; value: string };

export type PageBuilderPreviewControls = {
  selected: string;
  onSelect: (block: string) => void;
  onRemove: (block: string) => void;
};
type PageBuilderProps = {
  template: PageBuilderTemplate;
  value: PageBuilderValue;
  onValueChange: (value: PageBuilderValue) => void;
  onCreateBlankPage?: () => void;
  renderPreview: (
    value: PageBuilderValue,
    controls: PageBuilderPreviewControls,
  ) => ReactNode;
};

function normalizePageBuilderValue(
  template: PageBuilderTemplate,
  value: PageBuilderValue,
): PageBuilderValue {
  const blocks: string[] = [];
  for (const block of value.blocks) {
    const slot = template.slots.find((candidate) => candidate.id === block);
    if (slot && !blocks.includes(block)) blocks.push(block);
  }
  for (const slot of template.slots)
    if (slot.required && !blocks.includes(slot.id)) blocks.push(slot.id);
  const properties: Record<string, string> = {};
  for (const property of template.properties) {
    const candidate = value.properties[property.id];
    properties[property.id] =
      property.type === "enum" && !property.values?.includes(candidate)
        ? property.default
        : (candidate ?? property.default);
  }
  return { blocks, properties };
}

function applyPageBuilderOperations(
  template: PageBuilderTemplate,
  value: PageBuilderValue,
  operations: PageBuilderOperation[],
) {
  let next = normalizePageBuilderValue(template, value);
  for (const operation of operations) {
    if (operation.op === "setProp") {
      if (
        !template.properties.some((property) => property.id === operation.name)
      )
        continue;
      next = normalizePageBuilderValue(template, {
        ...next,
        properties: { ...next.properties, [operation.name]: operation.value },
      });
      continue;
    }
    const slot = template.slots.find(
      (candidate) => candidate.id === operation.block,
    );
    if (!slot) continue;
    if (operation.op === "removeBlock") {
      if (!slot.required)
        next = {
          ...next,
          blocks: next.blocks.filter((block) => block !== operation.block),
        };
      continue;
    }
    const blocks = next.blocks.filter((block) => block !== operation.block);
    const anchor =
      operation.op === "insertBlock"
        ? operation.after
        : (operation.before ?? operation.after);
    const anchorIndex = anchor ? blocks.indexOf(anchor) : -1;
    const offset = operation.op === "moveBlock" && operation.before ? 0 : 1;
    blocks.splice(
      anchorIndex < 0 ? blocks.length : anchorIndex + offset,
      0,
      operation.block,
    );
    next = normalizePageBuilderValue(template, { ...next, blocks });
  }
  return normalizePageBuilderValue(template, next);
}

function operationsFromCustomerListIntent(
  prompt: string,
): PageBuilderOperation[] {
  const operations: PageBuilderOperation[] = [];
  if (/(客户.*列表|列表页)/.test(prompt)) {
    operations.push(
      { op: "insertBlock", block: "topbar" },
      { op: "insertBlock", block: "navigation", after: "topbar" },
      { op: "insertBlock", block: "header" },
      { op: "insertBlock", block: "toolbar", after: "header" },
      { op: "insertBlock", block: "customer-list", after: "toolbar" },
    );
  }
  const title = prompt.match(
    /(?:标题|页面名)(?:改成|设为|设置为|叫)?[：:\s]*[“"]?([^，”"。\n]+)[”"]?/,
  );
  if (title?.[1])
    operations.push({
      op: "setProp",
      target: "page",
      name: "title",
      value: title[1].trim(),
    });
  if (/紧凑/.test(prompt))
    operations.push({
      op: "setProp",
      target: "customer-list",
      name: "density",
      value: "compact",
    });
  if (/标准密度|默认密度/.test(prompt))
    operations.push({
      op: "setProp",
      target: "customer-list",
      name: "density",
      value: "default",
    });
  if (/连续工作区|连续布局/.test(prompt))
    operations.push({
      op: "setProp",
      target: "page",
      name: "frame",
      value: "continuous",
    });
  if (/嵌入工作区|嵌入布局/.test(prompt))
    operations.push({
      op: "setProp",
      target: "page",
      name: "frame",
      value: "inset",
    });
  if (/核心列|精简列|精简字段/.test(prompt))
    operations.push({
      op: "setProp",
      target: "customer-list",
      name: "columnSet",
      value: "essential",
    });
  if (/全部列|标准列|完整字段/.test(prompt))
    operations.push({
      op: "setProp",
      target: "customer-list",
      name: "columnSet",
      value: "standard",
    });
  if (/(隐藏|关闭).*行操作/.test(prompt))
    operations.push({
      op: "setProp",
      target: "customer-list",
      name: "rowActions",
      value: "hide",
    });
  if (/(显示|开启).*行操作/.test(prompt))
    operations.push({
      op: "setProp",
      target: "customer-list",
      name: "rowActions",
      value: "show",
    });
  if (/只读/.test(prompt))
    operations.push({
      op: "setProp",
      target: "page",
      name: "permission",
      value: "readonly",
    });
  if (/可编辑/.test(prompt))
    operations.push({
      op: "setProp",
      target: "page",
      name: "permission",
      value: "editable",
    });
  if (/(隐藏|删除|移除).*(筛选|工具栏)/.test(prompt))
    operations.push({ op: "removeBlock", block: "toolbar" });
  if (/(显示|添加|恢复).*(筛选|工具栏)/.test(prompt))
    operations.push({ op: "insertBlock", block: "toolbar", after: "header" });
  if (/(隐藏|删除|移除).*(客户列表|表格|分页)/.test(prompt))
    operations.push({ op: "removeBlock", block: "customer-list" });
  if (/(显示|添加|恢复).*(客户列表|表格|分页)/.test(prompt))
    operations.push({
      op: "insertBlock",
      block: "customer-list",
      after: "toolbar",
    });
  if (/(隐藏|删除|移除).*顶栏/.test(prompt))
    operations.push({ op: "removeBlock", block: "topbar" });
  if (/(显示|添加|恢复).*顶栏/.test(prompt))
    operations.push({ op: "insertBlock", block: "topbar" });
  if (/(隐藏|删除|移除).*(侧边导航|导航栏)/.test(prompt))
    operations.push({ op: "removeBlock", block: "navigation" });
  if (/(显示|添加|恢复).*(侧边导航|导航栏)/.test(prompt))
    operations.push({
      op: "insertBlock",
      block: "navigation",
      after: "topbar",
    });
  return operations;
}

function displayName(slot: PageBuilderSlot) {
  return slot.label ?? slot.block;
}

type BuilderMode = "page" | "component-create" | "business-component";

const builderModeStorageKey = "fx-ui:page-builder-mode";

function isBuilderMode(value: string | null): value is BuilderMode {
  return (
    value === "page" ||
    value === "component-create" ||
    value === "business-component"
  );
}

function operationSummary(
  template: PageBuilderTemplate,
  operation: PageBuilderOperation,
) {
  if (operation.op === "setProp")
    return `设置${operation.name}为${operation.value}`;
  const name = displayName(
    template.slots.find((slot) => slot.id === operation.block) ?? {
      id: operation.block,
      block: operation.block,
      required: false,
      max: 1,
    },
  );
  if (operation.op === "insertBlock") return `添加${name}`;
  if (operation.op === "removeBlock") return `移除${name}`;
  return `移动${name}`;
}

function PageBuilder({
  template,
  value,
  onValueChange,
  onCreateBlankPage,
  renderPreview,
}: PageBuilderProps) {
  const [builderMode, setBuilderMode] = useState<BuilderMode>(() => {
    const savedMode = localStorage.getItem(builderModeStorageKey);
    return isBuilderMode(savedMode) ? savedMode : "page";
  });
  const businessComponentBuilderRef =
    useRef<BusinessComponentBuilderHandle>(null);
  const [businessComponentHistory, setBusinessComponentHistory] = useState({
    canUndo: false,
    canRedo: false,
  });
  const isBlankTemplate = template.id === "blank-page";
  const [selected, setSelected] = useState<string>("page");
  const [prompt, setPrompt] = useState(
    isBlankTemplate
      ? "生成一个客户列表页，包含页面头部、筛选、表格和分页"
      : "把标题改成重点客户，表格使用紧凑密度",
  );
  const [stage, setStage] = useState<"start" | "layout" | "editing">(
    isBlankTemplate ? "start" : "editing",
  );
  const [previewViewport, setPreviewViewport] = useState<"web" | "mobile">(
    "web",
  );
  const [insertZone, setInsertZone] = useState("main");
  const [pendingOperations, setPendingOperations] = useState<
    PageBuilderOperation[]
  >([]);
  const [past, setPast] = useState<PageBuilderValue[]>([]);
  const [future, setFuture] = useState<PageBuilderValue[]>([]);
  const [savedPresets, setSavedPresets] = useState<PageBuilderPreset[]>([]);
  const normalizedValue = normalizePageBuilderValue(template, value);
  const activeSlots = normalizedValue.blocks
    .map((id) => template.slots.find((slot) => slot.id === id))
    .filter((slot): slot is PageBuilderSlot => Boolean(slot));
  const availableSlots = template.slots.filter(
    (slot) => !normalizedValue.blocks.includes(slot.id),
  );
  const selectedSlot = activeSlots.find((slot) => slot.id === selected);
  const agentTarget = selectedSlot
    ? displayName(selectedSlot)
    : selected === "page"
      ? "整个页面"
      : (template.builder?.zones.find((zone) => zone.id === insertZone)?.name ??
        "整个页面");
  const commit = (next: PageBuilderValue) => {
    const normalizedNext = normalizePageBuilderValue(template, next);
    if (JSON.stringify(normalizedNext) === JSON.stringify(normalizedValue))
      return;
    setPast((history) => [...history, normalizedValue]);
    setFuture([]);
    onValueChange(normalizedNext);
  };
  const runOperations = (operations: PageBuilderOperation[]) =>
    commit(applyPageBuilderOperations(template, normalizedValue, operations));
  const proposeAgentOperations = () =>
    setPendingOperations(operationsFromCustomerListIntent(prompt));
  const updateProperties = (properties: Record<string, string>) =>
    commit({ ...normalizedValue, properties });
  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = activeSlots[index + direction];
    if (!target) return;
    runOperations([
      {
        op: "moveBlock",
        block: activeSlots[index].id,
        ...(direction < 0 ? { before: target.id } : { after: target.id }),
      },
    ]);
  };
  const undo = () => {
    const previous = past[past.length - 1];
    if (!previous) return;
    setPast((history) => history.slice(0, -1));
    setFuture((history) => [normalizedValue, ...history]);
    onValueChange(previous);
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setPast((history) => [...history, normalizedValue]);
    setFuture((history) => history.slice(1));
    onValueChange(next);
  };

  return (
    <div
      data-slot="page-builder"
      className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-background"
    >
      <header
        data-slot="page-builder-header"
        className="grid min-h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border-subtle bg-card px-4"
      >
        <div className="flex shrink-0 items-center gap-2">
          <LayoutGridFilledIcon className="text-primary" />
          <span className="text-section-title">搭建器</span>
          <Select
            value={builderMode}
            onValueChange={(next) => {
              if (!isBuilderMode(next)) return;
              setBuilderMode(next);
              localStorage.setItem(builderModeStorageKey, next);
            }}
          >
            <SelectTrigger size="sm" aria-label="搭建模式">
              <SelectValue>
                {(mode) =>
                  mode === "page"
                    ? "页面"
                    : mode === "component-create"
                      ? "基础组件"
                      : "业务组件"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="component-create">基础组件</SelectItem>
                <SelectItem value="business-component">业务组件</SelectItem>
                <SelectItem value="page">页面</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {builderMode === "page" ? (
            <>
              <ToggleGroup
                value={[previewViewport]}
                onValueChange={(next) =>
                  next[0] && setPreviewViewport(next[0] as "web" | "mobile")
                }
                variant="outline"
                size="sm"
                aria-label="预览设备"
              >
                <ToggleGroupItem value="web">WEB端</ToggleGroupItem>
                <ToggleGroupItem value="mobile">移动端</ToggleGroupItem>
              </ToggleGroup>
              <Button
                variant="outline"
                size="sm"
                render={<a href="#customer-list-calibration" />}
              >
                列表页校准
              </Button>
              <span className="text-body text-muted-foreground">100%</span>
            </>
          ) : (
            <span className="text-label">
              {builderMode === "component-create"
                ? "基础组件画布"
                : "真实组合预览"}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="撤销"
            disabled={
              builderMode === "page"
                ? !past.length
                : !businessComponentHistory.canUndo
            }
            onClick={
              builderMode === "page"
                ? undo
                : () => businessComponentBuilderRef.current?.undo()
            }
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="重做"
            disabled={
              builderMode === "page"
                ? !future.length
                : !businessComponentHistory.canRedo
            }
            onClick={
              builderMode === "page"
                ? redo
                : () => businessComponentBuilderRef.current?.redo()
            }
          >
            <ArrowRightIcon />
          </Button>
          <Button variant="outline" size="sm">
            <EyeIcon data-icon="inline-start" />
            预览
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={
              builderMode === "page"
                ? () =>
                    setSavedPresets((presets) => [
                      ...presets,
                      {
                        id: `local-${presets.length + 1}`,
                        name: `我的预设 ${presets.length + 1}`,
                        blocks: [...normalizedValue.blocks],
                        properties: { ...normalizedValue.properties },
                      },
                    ])
                : builderMode === "business-component" ||
                    builderMode === "component-create"
                  ? () => businessComponentBuilderRef.current?.save()
                  : undefined
            }
          >
            {builderMode === "page" ? "保存模板" : "保存草稿"}
          </Button>
          <Button
            size="sm"
            onClick={
              builderMode === "business-component" ||
              builderMode === "component-create"
                ? () => businessComponentBuilderRef.current?.publish()
                : undefined
            }
          >
            <CheckCircleIcon data-icon="inline-start" />
            {builderMode === "page" ? "发布" : "发布组件"}
          </Button>
        </div>
      </header>

      {builderMode === "business-component" ||
      builderMode === "component-create" ? (
        <BusinessComponentBuilder
          ref={businessComponentBuilderRef}
          onHistoryChange={setBusinessComponentHistory}
          workflow={
            builderMode === "component-create" ? "foundation" : "business"
          }
        />
      ) : (
        <div className="grid min-h-0 grid-cols-[240px_minmax(0,1fr)_320px]">
          <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] border-r border-border-subtle bg-card">
            <div className="flex flex-col gap-3 border-b border-border-subtle p-4">
              <span className="text-section-title">页面与模板</span>
              <Field>
                <FieldLabel htmlFor="page-builder-search" className="sr-only">
                  搜索页面或模板
                </FieldLabel>
                <Input id="page-builder-search" placeholder="搜索页面或模板" />
              </Field>
            </div>
            <ScrollArea className="min-h-0">
              <div className="flex flex-col gap-5 p-3">
                <section className="flex flex-col gap-1">
                  <span className="px-2 text-label">常用页面预设</span>
                  {[...template.presets, ...savedPresets].map((preset) => (
                    <Button
                      key={preset.id}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        commit({
                          blocks: [...preset.blocks],
                          properties: { ...preset.properties },
                        });
                        setSelected("page");
                      }}
                    >
                      <LayoutGridIcon data-icon="inline-start" />
                      {preset.name}
                    </Button>
                  ))}
                </section>
                <Separator />
                <section className="flex flex-col gap-1">
                  <span className="px-2 text-label">我的页面</span>
                  <Button
                    variant={selected === "page" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setSelected("page")}
                  >
                    <FileTextIcon data-icon="inline-start" />
                    {normalizedValue.properties.title}
                    {template.id === "blank-page" ? "" : "列表页"}
                  </Button>
                </section>
                <Separator />
                {!isBlankTemplate && (
                  <section className="flex flex-col gap-1">
                    <span className="px-2 text-label">新建</span>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={onCreateBlankPage}
                    >
                      <PlusIcon data-icon="inline-start" />
                      增加空白页
                    </Button>
                  </section>
                )}
                {!isBlankTemplate && <Separator />}
                <section className="flex flex-col gap-1">
                  <span className="px-2 text-label">页面结构</span>
                  {activeSlots.map((slot, index) => (
                    <div key={slot.id} className="flex items-center gap-1">
                      <Button
                        variant={selected === slot.id ? "secondary" : "ghost"}
                        className="min-w-0 flex-1 justify-start truncate"
                        onClick={() => setSelected(slot.id)}
                      >
                        <ListIcon data-icon="inline-start" />
                        {displayName(slot)}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`上移${displayName(slot)}`}
                        disabled={index === 0}
                        onClick={() => moveBlock(index, -1)}
                      >
                        <ArrowUpIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`下移${displayName(slot)}`}
                        disabled={index === activeSlots.length - 1}
                        onClick={() => moveBlock(index, 1)}
                      >
                        <ArrowDownIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        tone="danger"
                        aria-label={`删除${displayName(slot)}`}
                        disabled={slot.required}
                        onClick={() => {
                          runOperations([
                            { op: "removeBlock", block: slot.id },
                          ]);
                          setSelected("page");
                        }}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  ))}
                </section>
              </div>
            </ScrollArea>
          </aside>

          <section
            aria-label="页面预览"
            className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] bg-muted"
          >
            <div className="min-h-0 overflow-auto p-5">
              <div
                data-slot="page-builder-preview"
                data-builder-stage={stage}
                data-preview-viewport={previewViewport}
                className={cn(
                  "mx-auto min-h-[520px] overflow-hidden bg-background shadow-l1",
                  previewViewport === "mobile" ? "w-[390px]" : "min-w-[960px]",
                )}
              >
                {stage === "start" ? (
                  <Empty className="min-h-[520px]">
                    <EmptyHeader>
                      <EmptyTitle>从空白页开始</EmptyTitle>
                      <EmptyDescription>选择生成方式</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <div className="flex gap-2">
                        <Button onClick={proposeAgentOperations}>
                          <SparklesIcon data-icon="inline-start" />用 Agent 生成
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setStage("layout")}
                        >
                          <LayoutGridIcon data-icon="inline-start" />
                          手动搭建
                        </Button>
                      </div>
                    </EmptyContent>
                  </Empty>
                ) : stage === "layout" ? (
                  <Empty className="min-h-[520px]">
                    <EmptyHeader>
                      <EmptyTitle>选择页面骨架</EmptyTitle>
                      <EmptyDescription>
                        骨架决定页面内容的基础排列方式
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <div className="grid w-full grid-cols-2 gap-2">
                        {template.builder?.layouts.map((layout) => (
                          <Button
                            key={layout.id}
                            variant="outline"
                            className="h-auto min-h-20 flex-col justify-center"
                            onClick={() => {
                              updateProperties({
                                ...normalizedValue.properties,
                                layout: layout.id,
                                frame: layout.frame,
                              });
                              setInsertZone(layout.zones[0]);
                              setStage("editing");
                            }}
                          >
                            <LayoutGridIcon />
                            <span>{layout.name}</span>
                            <span className="text-caption text-muted-foreground">
                              {layout.description}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </EmptyContent>
                  </Empty>
                ) : normalizedValue.blocks.length === 0 ? (
                  <Empty className="min-h-[520px]">
                    <EmptyHeader>
                      <EmptyTitle>
                        {template.builder?.zones.find(
                          (zone) => zone.id === insertZone,
                        )?.name ?? "主要内容"}
                      </EmptyTitle>
                      <EmptyDescription>当前插入区尚无区块</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button
                        variant="outline"
                        onClick={() => setSelected("page")}
                      >
                        <PlusIcon data-icon="inline-start" />
                        添加主要内容区块
                      </Button>
                    </EmptyContent>
                  </Empty>
                ) : (
                  renderPreview(normalizedValue, {
                    selected,
                    onSelect: setSelected,
                    onRemove: (block) => {
                      runOperations([{ op: "removeBlock", block }]);
                      setSelected("page");
                    },
                  })
                )}
              </div>
            </div>
            <div
              data-slot="page-builder-agent-composer"
              className="border-t border-border-subtle bg-background px-5 py-3"
            >
              <div className="mx-auto flex max-w-3xl flex-col gap-2">
                {pendingOperations.length > 0 && (
                  <Alert>
                    <SparklesIcon />
                    <AlertTitle>
                      Agent 将对{agentTarget}执行 {pendingOperations.length}{" "}
                      项受控修改
                    </AlertTitle>
                    <AlertDescription>
                      {pendingOperations
                        .map((operation) =>
                          operationSummary(template, operation),
                        )
                        .join("、")}
                    </AlertDescription>
                    <AlertAction>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPendingOperations([])}
                        >
                          取消
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            runOperations(pendingOperations);
                            setPendingOperations([]);
                            setStage("editing");
                          }}
                        >
                          应用修改
                        </Button>
                      </div>
                    </AlertAction>
                  </Alert>
                )}
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="page-builder-agent" className="sr-only">
                    Agent 指令
                  </FieldLabel>
                  <Input
                    id="page-builder-agent"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder={`描述你想调整的${agentTarget}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={proposeAgentOperations}
                  >
                    <SparklesIcon data-icon="inline-start" />
                    Agent 生成
                  </Button>
                </Field>
              </div>
            </div>
          </section>

          <aside className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] border-l border-border-subtle bg-card">
            <section className="flex flex-col gap-3 border-b border-border-subtle p-4">
              <div className="flex items-center justify-between">
                <span className="text-section-title">组件库</span>
                <Button variant="ghost" size="icon-sm" aria-label="搜索组件">
                  <SearchIcon />
                </Button>
              </div>
              <Tabs defaultValue="business">
                <TabsList variant="line" size="sm">
                  <TabsTrigger value="business">业务区块</TabsTrigger>
                  <TabsTrigger value="primitive">基础组件</TabsTrigger>
                  <TabsTrigger value="saved">已保存</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="business"
                  className="grid grid-cols-2 gap-2 pt-2"
                >
                  {template.slots.map((slot) => {
                    const active = normalizedValue.blocks.includes(slot.id);
                    return (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="h-auto min-h-16 flex-col justify-center"
                        disabled={
                          stage !== "editing" ||
                          Boolean(
                            slot.zones && !slot.zones.includes(insertZone),
                          )
                        }
                        onClick={() =>
                          active
                            ? setSelected(slot.id)
                            : (runOperations([
                                {
                                  op: "insertBlock",
                                  block: slot.id,
                                  after:
                                    activeSlots[activeSlots.length - 1]?.id,
                                },
                              ]),
                              setSelected(slot.id))
                        }
                      >
                        {active ? <LayoutGridIcon /> : <PlusIcon />}
                        <span>{displayName(slot)}</span>
                      </Button>
                    );
                  })}
                </TabsContent>
                <TabsContent value="primitive">
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>暂无独立基础组件</EmptyTitle>
                      <EmptyDescription>
                        基础组件需要先沉淀为可复用业务区块。
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent />
                  </Empty>
                </TabsContent>
                <TabsContent value="saved">
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>暂无已保存区块</EmptyTitle>
                      <EmptyDescription>
                        保存后的团队区块会出现在这里。
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent />
                  </Empty>
                </TabsContent>
              </Tabs>
            </section>
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <span className="text-section-title">
                {selectedSlot ? displayName(selectedSlot) : "页面"}配置
              </span>
              <Tag variant="outline">受控属性</Tag>
            </div>
            <ScrollArea className="min-h-0">
              <Tabs defaultValue="properties" className="p-4">
                <TabsList variant="line" size="sm">
                  <TabsTrigger value="properties">属性</TabsTrigger>
                  <TabsTrigger value="data">数据</TabsTrigger>
                  <TabsTrigger value="interaction">交互</TabsTrigger>
                  <TabsTrigger value="permission">权限</TabsTrigger>
                  <TabsTrigger value="add">添加</TabsTrigger>
                </TabsList>
                <TabsContent value="add" className="flex flex-col gap-2 pt-3">
                  {availableSlots.length ? (
                    availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          runOperations([
                            {
                              op: "insertBlock",
                              block: slot.id,
                              after: activeSlots[activeSlots.length - 1]?.id,
                            },
                          ]);
                          setSelected(slot.id);
                        }}
                      >
                        <PlusIcon data-icon="inline-start" />
                        添加{displayName(slot)}
                      </Button>
                    ))
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>区块已完整</EmptyTitle>
                        <EmptyDescription>
                          当前模板允许的区块都已加入。
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent />
                    </Empty>
                  )}
                </TabsContent>
                <TabsContent value="properties" className="pt-3">
                  {(selected === "page" || selectedSlot?.id === "header") && (
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="page-builder-title">
                          页面标题
                        </FieldLabel>
                        <Input
                          id="page-builder-title"
                          value={normalizedValue.properties.title}
                          onChange={(event) =>
                            updateProperties({
                              ...normalizedValue.properties,
                              title: event.target.value,
                            })
                          }
                        />
                      </Field>
                    </FieldGroup>
                  )}
                  {selectedSlot && selectedSlot.id !== "header" && (
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>使用区块默认属性</EmptyTitle>
                        <EmptyDescription>
                          该区块当前没有开放额外属性。
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent />
                    </Empty>
                  )}
                </TabsContent>
                <TabsContent value="data" className="pt-3">
                  {selectedSlot?.id === "customer-list" ? (
                    <FieldGroup>
                      <Field>
                        <FieldLabel>显示字段</FieldLabel>
                        <ToggleGroup
                          value={[normalizedValue.properties.columnSet]}
                          onValueChange={(next) =>
                            next[0] &&
                            updateProperties({
                              ...normalizedValue.properties,
                              columnSet: next[0],
                            })
                          }
                          variant="outline"
                          size="sm"
                        >
                          <ToggleGroupItem value="standard">
                            全部列
                          </ToggleGroupItem>
                          <ToggleGroupItem value="essential">
                            核心列
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </Field>
                      <Field>
                        <FieldLabel>表格密度</FieldLabel>
                        <ToggleGroup
                          value={[normalizedValue.properties.density]}
                          onValueChange={(next) =>
                            next[0] &&
                            updateProperties({
                              ...normalizedValue.properties,
                              density: next[0],
                            })
                          }
                          variant="outline"
                          size="sm"
                        >
                          <ToggleGroupItem value="default">
                            标准
                          </ToggleGroupItem>
                          <ToggleGroupItem value="compact">
                            紧凑
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </Field>
                    </FieldGroup>
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>选择数据区块</EmptyTitle>
                        <EmptyDescription>
                          选择客户列表后配置已开放的数据属性。
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent />
                    </Empty>
                  )}
                </TabsContent>
                <TabsContent value="interaction" className="pt-3">
                  {selected === "page" ? (
                    <FieldGroup>
                      <Field>
                        <FieldLabel>工作区模式</FieldLabel>
                        <ToggleGroup
                          value={[normalizedValue.properties.frame]}
                          onValueChange={(next) =>
                            next[0] &&
                            updateProperties({
                              ...normalizedValue.properties,
                              frame: next[0],
                            })
                          }
                          variant="outline"
                          size="sm"
                        >
                          <ToggleGroupItem value="inset">嵌入</ToggleGroupItem>
                          <ToggleGroupItem value="continuous">
                            连续
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </Field>
                    </FieldGroup>
                  ) : selectedSlot?.id === "customer-list" ? (
                    <FieldGroup>
                      <Field>
                        <FieldLabel>行操作</FieldLabel>
                        <ToggleGroup
                          value={[normalizedValue.properties.rowActions]}
                          onValueChange={(next) =>
                            next[0] &&
                            updateProperties({
                              ...normalizedValue.properties,
                              rowActions: next[0],
                            })
                          }
                          variant="outline"
                          size="sm"
                        >
                          <ToggleGroupItem value="show">显示</ToggleGroupItem>
                          <ToggleGroupItem value="hide">隐藏</ToggleGroupItem>
                        </ToggleGroup>
                      </Field>
                    </FieldGroup>
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>沿用区块交互</EmptyTitle>
                        <EmptyDescription>
                          交互来自已验证 Block，不在页面中重新拼装。
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent />
                    </Empty>
                  )}
                </TabsContent>
                <TabsContent value="permission" className="pt-3">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>页面权限</FieldLabel>
                      <ToggleGroup
                        value={[normalizedValue.properties.permission]}
                        onValueChange={(next) =>
                          next[0] &&
                          updateProperties({
                            ...normalizedValue.properties,
                            permission: next[0],
                          })
                        }
                        variant="outline"
                        size="sm"
                      >
                        <ToggleGroupItem value="editable">
                          可编辑
                        </ToggleGroupItem>
                        <ToggleGroupItem value="readonly">只读</ToggleGroupItem>
                      </ToggleGroup>
                      <FieldDescription>
                        只读模式会移除新建、编辑与勾选能力。
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </aside>
        </div>
      )}
    </div>
  );
}

export {
  PageBuilder,
  applyPageBuilderOperations,
  normalizePageBuilderValue,
  operationsFromCustomerListIntent,
};
