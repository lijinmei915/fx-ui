import {
  forwardRef,
  type ComponentProps,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  CheckCircleIcon,
  ComponentsIcon,
  FolderIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  Trash2Icon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { componentIndexSections } from "@/lib/site-navigation";
import componentPlaygroundsManifestRaw from "../../../docs/data/component-playgrounds.manifest.json?raw";
import componentsManifestRaw from "../../../docs/data/components.manifest.json?raw";
import pageBuilderManifestRaw from "../../../docs/data/page-builder.manifest.json?raw";

type SpacingValue = "none" | "xs" | "sm" | "md" | "lg";
type Direction = "horizontal" | "vertical";
type ComponentNode = {
  id: string;
  type: "component";
  component: string;
  props: Record<string, string>;
};
type FoundationKind =
  | "layout"
  | "container"
  | "color"
  | "spacing"
  | "typography"
  | "icon"
  | "separator"
  | "interaction";
type FoundationNode = {
  id: string;
  type: "foundation";
  foundation: FoundationKind;
  assetId: string;
  props: Record<string, string>;
  children?: CanvasNode[];
};
type PublicProp = {
  id: string;
  name: string;
  nodeId: string;
  property: string;
  type: "text" | "enum" | "boolean";
  defaultValue: string;
};
type GroupNode = {
  id: string;
  type: "group";
  children: CanvasNode[];
  direction: Direction;
  gap: SpacingValue;
};
type CanvasNode = ComponentNode | FoundationNode | GroupNode;
type CompositionDraft = {
  name: string;
  nodes: CanvasNode[];
  margin: SpacingValue;
  gap: SpacingValue;
  direction: Direction;
  destination: "personal" | "business";
  publicProps: PublicProp[];
};
type CompositionOperation =
  | { op: "addComponent"; component: string; parent?: string; before?: string }
  | {
      op: "addFoundation";
      foundation: FoundationKind;
      assetId: string;
      props: Record<string, string>;
      parent?: string;
      before?: string;
    }
  | { op: "addFoundationPreset"; presetId: string }
  | { op: "removeComponent"; target: string }
  | { op: "moveComponent"; target: string; direction: "up" | "down" }
  | { op: "groupComponents"; targets: string[]; group: string }
  | { op: "ungroupComponents"; target: string }
  | {
      op: "setCompositionLayout";
      target?: string;
      property: "margin" | "gap" | "direction";
      value: SpacingValue | Direction;
    }
  | { op: "setComponentName"; value: string }
  | { op: "setComponentProp"; target: string; property: string; value: string }
  | {
      op: "exposeComponentProp";
      target: string;
      property: string;
      name: string;
    }
  | { op: "renamePublicProp"; id: string; name: string }
  | { op: "removePublicProp"; id: string };

type PlaygroundProperty = {
  key: string;
  zh: string;
  propName: string;
  type: "text" | "segment";
  options?: { value: string; label: string }[];
};
type PlaygroundContract = {
  initial: Record<string, string>;
  props: PlaygroundProperty[];
};

type BusinessComponentDefinition = {
  id: string;
  name: string;
  source: string;
  layout: {
    id: string;
    name: string;
    slots: { id: string; name: string; accepts: string[] }[];
    spacingValues: SpacingValue[];
    directions: Direction[];
  };
  components: {
    id: string;
    name: string;
    category: string;
    source: string;
    contract?: { source: string; editableProps: string[] };
    instance: { preset: "default"; content?: Record<string, string | number> };
  }[];
  initial: CompositionDraft;
  publishTargets: {
    id: "personal" | "business";
    name: string;
    outcome: string;
  }[];
};
type FoundationAsset = {
  id: string;
  name: string;
  kind: FoundationKind;
  props: Record<string, string>;
};
type FoundationAssetGroup = {
  id: string;
  name: string;
  items: FoundationAsset[];
};
type FoundationCompositionPreset = {
  id: string;
  name: string;
  description: string;
  assets: { assetId: string; props: Record<string, string> }[];
};
type FoundationDeliveryTarget = {
  id: "new" | "existing";
  name: string;
  outcome: string;
  storageKey: string;
};

type CatalogComponent = {
  name: string;
  category: string;
  source: string;
};

export type BusinessComponentBuilderHandle = {
  undo: () => void;
  redo: () => void;
  save: () => void;
  publish: () => void;
};

const pageBuilderManifest = JSON.parse(pageBuilderManifestRaw) as {
  businessComponents: BusinessComponentDefinition[];
  builderModes: {
    id: string;
    candidateGate?: {
      initialComposition?: {
        assetId: string;
        props: Record<string, string>;
      };
      foundationAssets?: FoundationAssetGroup[];
      compositionPresets?: FoundationCompositionPreset[];
      deliveryTargets?: FoundationDeliveryTarget[];
      existingComponentSource?: string;
    };
  }[];
};
const definition = pageBuilderManifest.businessComponents[0];
const foundationMode = pageBuilderManifest.builderModes.find(
  (mode) => mode.id === "component-create",
);
const foundationAssets = foundationMode?.candidateGate?.foundationAssets ?? [];
const foundationPresets =
  foundationMode?.candidateGate?.compositionPresets ?? [];
const foundationDeliveryTargets =
  foundationMode?.candidateGate?.deliveryTargets ?? [];
const foundationInitialComposition =
  foundationMode?.candidateGate?.initialComposition;
const foundationAssetById = new Map(
  foundationAssets
    .flatMap((group) => group.items)
    .map((asset) => [asset.id, asset]),
);

function createInitialDraft(workflow: "business" | "foundation") {
  const draft = cloneDraft(definition.initial);
  if (workflow !== "foundation" || !foundationInitialComposition) return draft;
  const asset = foundationAssetById.get(foundationInitialComposition.assetId);
  if (!asset || asset.kind !== "container") return draft;
  draft.nodes = [
    {
      id: `${asset.id}-${crypto.randomUUID()}`,
      type: "foundation",
      foundation: asset.kind,
      assetId: asset.id,
      props: { ...foundationInitialComposition.props },
      children: [],
    },
  ];
  return draft;
}
const componentPlaygroundsManifest = JSON.parse(
  componentPlaygroundsManifestRaw,
) as Record<string, unknown>;
const componentsManifest = JSON.parse(componentsManifestRaw) as {
  uiComponents: CatalogComponent[];
  fxComponents: CatalogComponent[];
};
const navigationMetadata = new Map(
  componentIndexSections.flatMap((section) =>
    section.items.map(
      (item) =>
        [
          item.labelEn.toLowerCase().replace(/[^a-z0-9]/g, ""),
          { label: item.label, category: section.title },
        ] as const,
    ),
  ),
);
const catalogComponents = [
  ...componentsManifest.uiComponents,
  ...componentsManifest.fxComponents,
].map((component) => {
  const metadata = navigationMetadata.get(
    component.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
  );
  return {
    ...component,
    label: metadata?.label ?? component.name,
    categoryLabel: metadata?.category ?? component.category,
  };
});
const foundationExistingComponents = catalogComponents.filter((component) =>
  componentsManifest.uiComponents.some((item) => item.name === component.name),
);

function resolvePlaygroundContract(
  source?: string,
): PlaygroundContract | undefined {
  const [, pointer] = source?.split("#") ?? [];
  return pointer
    ?.split(".")
    .reduce<unknown>(
      (value, key) => (value as Record<string, unknown>)?.[key],
      componentPlaygroundsManifest,
    ) as PlaygroundContract | undefined;
}

const componentContracts = new Map(
  definition.components.map((component) => [
    component.id,
    resolvePlaygroundContract(component.contract?.source),
  ]),
);

function editableProperties(componentId: string) {
  const definitionEntry = definition.components.find(
    (component) => component.id === componentId,
  );
  const contract = componentContracts.get(componentId);
  return (contract?.props ?? []).filter((property) =>
    definitionEntry?.contract?.editableProps.includes(property.key),
  );
}

function initialComponentProps(componentId: string) {
  const contract = componentContracts.get(componentId);
  return Object.fromEntries(
    editableProperties(componentId).map((property) => [
      property.key,
      contract?.initial[property.key] ?? "",
    ]),
  );
}
const spacingLabels: Record<SpacingValue, string> = {
  none: "无",
  xs: "超小",
  sm: "小",
  md: "中",
  lg: "大",
};
type RadiusValue = "none" | "inner" | "element" | "container" | "page" | "full";
type FoundationSize = "sm" | "md" | "lg";
const radiusLabels: Record<RadiusValue, string> = {
  none: "无",
  inner: "内层",
  element: "控件",
  container: "容器",
  page: "页面",
  full: "胶囊",
};
const radiusClasses: Record<RadiusValue, string> = {
  none: "rounded-none",
  inner: "rounded-sm",
  element: "rounded-md",
  container: "rounded-lg",
  page: "rounded-xl",
  full: "rounded-full",
};
const foundationSizeLabels: Record<FoundationSize, string> = {
  sm: "28",
  md: "32",
  lg: "36",
};
const foundationSizeClasses: Record<FoundationSize, string> = {
  sm: "min-h-7",
  md: "min-h-8",
  lg: "min-h-9",
};
const marginClasses: Record<SpacingValue, string> = {
  none: "m-0",
  xs: "m-1",
  sm: "m-2",
  md: "m-4",
  lg: "m-6",
};
const paddingClasses: Record<SpacingValue, string> = {
  none: "p-0",
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
};
const gapClasses: Record<SpacingValue, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};
const foundationProperties: Record<FoundationKind, PlaygroundProperty[]> = {
  layout: [
    {
      key: "direction",
      zh: "方向",
      propName: "direction",
      type: "segment",
      options: [
        { value: "horizontal", label: "横向" },
        { value: "vertical", label: "纵向" },
      ],
    },
    {
      key: "gap",
      zh: "间隔",
      propName: "gap",
      type: "segment",
      options: Object.entries(spacingLabels).map(([value, label]) => ({
        value,
        label,
      })),
    },
  ],
  container: [
    {
      key: "surface",
      zh: "表面",
      propName: "surface",
      type: "segment",
      options: [
        { value: "card", label: "白色" },
        { value: "surface", label: "表面" },
        { value: "primary", label: "主色" },
        { value: "danger", label: "危险" },
      ],
    },
    {
      key: "padding",
      zh: "内边距",
      propName: "padding",
      type: "segment",
      options: Object.entries(spacingLabels).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: "radius",
      zh: "圆角",
      propName: "radius",
      type: "segment",
      options: Object.entries(radiusLabels).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: "size",
      zh: "尺寸",
      propName: "size",
      type: "segment",
      options: Object.entries(foundationSizeLabels).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: "direction",
      zh: "排列",
      propName: "direction",
      type: "segment",
      options: [
        { value: "horizontal", label: "横向" },
        { value: "vertical", label: "纵向" },
      ],
    },
    {
      key: "gap",
      zh: "子项间距",
      propName: "gap",
      type: "segment",
      options: Object.entries(spacingLabels).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: "state",
      zh: "交互状态",
      propName: "state",
      type: "segment",
      options: [
        { value: "default", label: "默认" },
        { value: "hover", label: "悬停" },
        { value: "focus", label: "聚焦" },
        { value: "disabled", label: "禁用" },
      ],
    },
  ],
  color: [
    {
      key: "token",
      zh: "颜色 Token",
      propName: "token",
      type: "segment",
      options: [
        { value: "primary", label: "主色" },
        { value: "surface", label: "表面" },
        { value: "muted", label: "弱化" },
      ],
    },
  ],
  spacing: [
    {
      key: "value",
      zh: "间距值",
      propName: "value",
      type: "segment",
      options: Object.entries(spacingLabels).map(([value, label]) => ({
        value,
        label,
      })),
    },
  ],
  typography: [
    {
      key: "role",
      zh: "文字角色",
      propName: "role",
      type: "segment",
      options: [
        { value: "body", label: "正文" },
        { value: "label", label: "标签" },
        { value: "section-title", label: "区块标题" },
      ],
    },
    { key: "text", zh: "文字内容", propName: "text", type: "text" },
  ],
  icon: [
    {
      key: "name",
      zh: "图标",
      propName: "name",
      type: "segment",
      options: [
        { value: "sparkles", label: "闪光" },
        { value: "plus", label: "添加" },
        { value: "search", label: "搜索" },
        { value: "check", label: "勾选" },
      ],
    },
  ],
  separator: [
    {
      key: "orientation",
      zh: "方向",
      propName: "orientation",
      type: "segment",
      options: [
        { value: "horizontal", label: "水平" },
        { value: "vertical", label: "垂直" },
      ],
    },
  ],
  interaction: [
    {
      key: "state",
      zh: "交互状态",
      propName: "state",
      type: "segment",
      options: [
        { value: "default", label: "默认" },
        { value: "hover", label: "悬停" },
        { value: "focus", label: "聚焦" },
        { value: "disabled", label: "禁用" },
      ],
    },
  ],
};
const foundationLabels: Record<FoundationKind, string> = {
  layout: "布局",
  container: "容器",
  color: "颜色",
  spacing: "间距",
  typography: "字体排版",
  icon: "图标",
  separator: "分割线",
  interaction: "交互状态",
};

function cloneDraft(draft: CompositionDraft): CompositionDraft {
  return structuredClone(draft);
}

function findNode(nodes: CanvasNode[], id: string): CanvasNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (
      node.type === "group" ||
      (node.type === "foundation" && node.foundation === "container")
    ) {
      const child = findNode(node.children ?? [], id);
      if (child) return child;
    }
  }
}

function findParentNode(
  nodes: CanvasNode[],
  id: string,
  parent?: GroupNode | FoundationNode,
): GroupNode | FoundationNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return parent;
    if (
      node.type === "group" ||
      (node.type === "foundation" && node.foundation === "container")
    ) {
      const match = findParentNode(node.children ?? [], id, node);
      if (match) return match;
    }
  }
}

function updateGroup(
  nodes: CanvasNode[],
  id: string,
  update: (group: GroupNode) => GroupNode,
): CanvasNode[] {
  return nodes.map((node) =>
    node.id === id && node.type === "group"
      ? update(node)
      : node.type === "group"
        ? { ...node, children: updateGroup(node.children, id, update) }
        : node.type === "foundation" && node.foundation === "container"
          ? { ...node, children: updateGroup(node.children ?? [], id, update) }
          : node,
  );
}

function insertNode(
  nodes: CanvasNode[],
  node: CanvasNode,
  before?: string,
): CanvasNode[] {
  if (!before) return [...nodes, node];
  const index = nodes.findIndex((item) => item.id === before);
  if (index < 0) return [...nodes, node];
  const next = [...nodes];
  next.splice(index, 0, node);
  return next;
}

function insertIntoParent(
  nodes: CanvasNode[],
  parentId: string,
  node: CanvasNode,
  before?: string,
): CanvasNode[] {
  return nodes.map((current) => {
    if (current.id === parentId) {
      if (current.type === "group") {
        return {
          ...current,
          children: insertNode(current.children, node, before),
        };
      }
      if (current.type === "foundation" && current.foundation === "container") {
        return {
          ...current,
          children: insertNode(current.children ?? [], node, before),
        };
      }
    }
    if (current.type === "group") {
      return {
        ...current,
        children: insertIntoParent(current.children, parentId, node, before),
      };
    }
    if (current.type === "foundation" && current.foundation === "container") {
      return {
        ...current,
        children: insertIntoParent(
          current.children ?? [],
          parentId,
          node,
          before,
        ),
      };
    }
    return current;
  });
}

function removeNode(nodes: CanvasNode[], id: string): CanvasNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) =>
      node.type === "group"
        ? { ...node, children: removeNode(node.children, id) }
        : node.type === "foundation" && node.foundation === "container"
          ? { ...node, children: removeNode(node.children ?? [], id) }
          : node,
    );
}

function updateComponentNode(
  nodes: CanvasNode[],
  id: string,
  update: (node: ComponentNode) => ComponentNode,
): CanvasNode[] {
  return nodes.map((node) =>
    node.id === id && node.type === "component"
      ? update(node)
      : node.type === "group"
        ? { ...node, children: updateComponentNode(node.children, id, update) }
        : node.type === "foundation" && node.foundation === "container"
          ? {
              ...node,
              children: updateComponentNode(node.children ?? [], id, update),
            }
          : node,
  );
}

function updateFoundationNode(
  nodes: CanvasNode[],
  id: string,
  update: (node: FoundationNode) => FoundationNode,
): CanvasNode[] {
  return nodes.map((node) =>
    node.id === id && node.type === "foundation"
      ? update(node)
      : node.type === "group"
        ? { ...node, children: updateFoundationNode(node.children, id, update) }
        : node.type === "foundation" && node.foundation === "container"
          ? {
              ...node,
              children: updateFoundationNode(node.children ?? [], id, update),
            }
          : node,
  );
}

function moveNode(
  nodes: CanvasNode[],
  id: string,
  direction: "up" | "down",
): CanvasNode[] {
  const index = nodes.findIndex((node) => node.id === id);
  if (index >= 0) {
    const next = [...nodes];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < next.length)
      [next[index], next[target]] = [next[target], next[index]];
    return next;
  }
  return nodes.map((node) =>
    node.type === "group"
      ? { ...node, children: moveNode(node.children, id, direction) }
      : node.type === "foundation" && node.foundation === "container"
        ? { ...node, children: moveNode(node.children ?? [], id, direction) }
        : node,
  );
}

function ungroupNode(nodes: CanvasNode[], id: string): CanvasNode[] {
  const result: CanvasNode[] = [];
  for (const node of nodes) {
    if (node.id === id && node.type === "group") result.push(...node.children);
    else
      result.push(
        node.type === "group"
          ? { ...node, children: ungroupNode(node.children, id) }
          : node.type === "foundation" && node.foundation === "container"
            ? { ...node, children: ungroupNode(node.children ?? [], id) }
            : node,
      );
  }
  return result;
}

function groupNodesInSameParent(
  nodes: CanvasNode[],
  targets: string[],
  group: string,
): CanvasNode[] {
  const selectedIndexes = nodes
    .map((node, index) => (targets.includes(node.id) ? index : -1))
    .filter((index) => index >= 0);
  if (selectedIndexes.length > 1) {
    const firstIndex = selectedIndexes[0];
    const selected = new Set(selectedIndexes);
    const children = nodes.filter((_, index) => selected.has(index));
    const next = nodes.filter((_, index) => !selected.has(index));
    next.splice(firstIndex, 0, {
      id: group,
      type: "group",
      children,
      direction: "horizontal",
      gap: "sm",
    });
    return next;
  }
  return nodes.map((node) =>
    node.type === "group"
      ? {
          ...node,
          children: groupNodesInSameParent(node.children, targets, group),
        }
      : node.type === "foundation" && node.foundation === "container"
        ? {
            ...node,
            children: groupNodesInSameParent(
              node.children ?? [],
              targets,
              group,
            ),
          }
        : node,
  );
}

function applyOperation(
  draft: CompositionDraft,
  operation: CompositionOperation,
): CompositionDraft {
  const next = cloneDraft(draft);
  if (operation.op === "addComponent") {
    const node: ComponentNode = {
      id: `${operation.component}-${crypto.randomUUID()}`,
      type: "component",
      component: operation.component,
      props: initialComponentProps(operation.component),
    };
    next.nodes = operation.parent
      ? insertIntoParent(next.nodes, operation.parent, node, operation.before)
      : insertNode(next.nodes, node, operation.before);
  }
  if (operation.op === "addFoundation") {
    const node: FoundationNode = {
      id: `${operation.assetId}-${crypto.randomUUID()}`,
      type: "foundation",
      foundation: operation.foundation,
      assetId: operation.assetId,
      props: { ...operation.props },
    };
    next.nodes = operation.parent
      ? insertIntoParent(next.nodes, operation.parent, node, operation.before)
      : insertNode(next.nodes, node, operation.before);
  }
  if (operation.op === "addFoundationPreset") {
    const preset = foundationPresets.find(
      (item) => item.id === operation.presetId,
    );
    const firstAsset =
      preset && foundationAssetById.get(preset.assets[0]?.assetId);
    if (preset && firstAsset) {
      const existingRoot =
        next.nodes.length === 1 &&
        next.nodes[0].type === "foundation" &&
        next.nodes[0].foundation === "container" &&
        (next.nodes[0].children?.length ?? 0) === 0
          ? next.nodes[0]
          : undefined;
      const container: FoundationNode = existingRoot
        ? { ...existingRoot, props: { ...preset.assets[0].props } }
        : {
            id: `${firstAsset.id}-${crypto.randomUUID()}`,
            type: "foundation",
            foundation: firstAsset.kind,
            assetId: firstAsset.id,
            props: { ...preset.assets[0].props },
          };
      next.nodes = existingRoot
        ? [container]
        : insertNode(next.nodes, container);
      for (const asset of preset.assets.slice(1)) {
        const definition = foundationAssetById.get(asset.assetId);
        if (!definition) continue;
        const child: FoundationNode = {
          id: `${definition.id}-${crypto.randomUUID()}`,
          type: "foundation",
          foundation: definition.kind,
          assetId: definition.id,
          props: { ...asset.props },
        };
        next.nodes = insertIntoParent(next.nodes, container.id, child);
      }
    }
  }
  if (operation.op === "removeComponent") {
    next.nodes = removeNode(next.nodes, operation.target);
    next.publicProps = next.publicProps.filter((property) =>
      findNode(next.nodes, property.nodeId),
    );
  }
  if (operation.op === "moveComponent")
    next.nodes = moveNode(next.nodes, operation.target, operation.direction);
  if (operation.op === "groupComponents") {
    next.nodes = groupNodesInSameParent(
      next.nodes,
      operation.targets,
      operation.group,
    );
  }
  if (operation.op === "ungroupComponents")
    next.nodes = ungroupNode(next.nodes, operation.target);
  if (operation.op === "setCompositionLayout") {
    if (!operation.target) {
      if (operation.property === "margin")
        next.margin = operation.value as SpacingValue;
      if (operation.property === "gap")
        next.gap = operation.value as SpacingValue;
      if (operation.property === "direction")
        next.direction = operation.value as Direction;
    } else {
      next.nodes = updateGroup(next.nodes, operation.target, (group) => ({
        ...group,
        [operation.property]: operation.value,
      }));
    }
  }
  if (operation.op === "setComponentName") next.name = operation.value;
  if (operation.op === "setComponentProp") {
    next.nodes = updateComponentNode(next.nodes, operation.target, (node) => ({
      ...node,
      props: { ...node.props, [operation.property]: operation.value },
    }));
    next.nodes = updateFoundationNode(next.nodes, operation.target, (node) => ({
      ...node,
      props: { ...node.props, [operation.property]: operation.value },
    }));
    next.publicProps = next.publicProps.map((property) =>
      property.nodeId === operation.target &&
      property.property === operation.property
        ? { ...property, defaultValue: operation.value }
        : property,
    );
  }
  if (operation.op === "exposeComponentProp") {
    const node = findNode(next.nodes, operation.target);
    const property =
      node?.type === "component"
        ? editableProperties(node.component).find(
            (item) => item.key === operation.property,
          )
        : node?.type === "foundation"
          ? foundationProperties[node.foundation].find(
              (item) => item.key === operation.property,
            )
          : undefined;
    const id = `${operation.target}:${operation.property}`;
    if (
      (node?.type === "component" || node?.type === "foundation") &&
      property &&
      !next.publicProps.some((item) => item.id === id)
    ) {
      next.publicProps.push({
        id,
        name: operation.name,
        nodeId: operation.target,
        property: operation.property,
        type:
          property.type === "text"
            ? "text"
            : property.options?.every((option) =>
                  ["true", "false"].includes(option.value),
                )
              ? "boolean"
              : "enum",
        defaultValue: node.props[operation.property] ?? "",
      });
    }
  }
  if (operation.op === "renamePublicProp")
    next.publicProps = next.publicProps.map((property) =>
      property.id === operation.id
        ? { ...property, name: operation.name }
        : property,
    );
  if (operation.op === "removePublicProp")
    next.publicProps = next.publicProps.filter(
      (property) => property.id !== operation.id,
    );
  return next;
}

function nodeCount(nodes: CanvasNode[]): number {
  return nodes.reduce(
    (count, node) =>
      count +
      1 +
      (node.type === "group" ||
      (node.type === "foundation" && node.foundation === "container")
        ? nodeCount(node.children ?? [])
        : 0),
    0,
  );
}

export const BusinessComponentBuilder = forwardRef<
  BusinessComponentBuilderHandle,
  {
    onHistoryChange?: (state: { canUndo: boolean; canRedo: boolean }) => void;
    workflow?: "business" | "foundation";
  }
>(function BusinessComponentBuilder(
  { onHistoryChange, workflow = "business" },
  ref,
) {
  const [draft, setDraft] = useState<CompositionDraft>(() =>
    createInitialDraft(workflow),
  );
  const [past, setPast] = useState<CompositionDraft[]>([]);
  const [future, setFuture] = useState<CompositionDraft[]>([]);
  const initialSelectedId =
    workflow === "foundation" ? draft.nodes[0]?.id : undefined;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId,
  );
  const selectedIdRef = useRef<string | undefined>(initialSelectedId);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedId ? [initialSelectedId] : [],
  );
  const [leftPanel, setLeftPanel] = useState<
    "components" | "selection" | "layers"
  >("components");
  const [rightPanel, setRightPanel] = useState<"global" | "properties">(
    "global",
  );
  const [dragTarget, setDragTarget] = useState<string>();
  const [query, setQuery] = useState("");
  const [prompt, setPrompt] = useState("");
  const [pending, setPending] = useState<CompositionOperation[]>([]);
  const [status, setStatus] = useState("未保存");
  const [candidateStage, setCandidateStage] = useState<
    "draft" | "generated" | "accepted"
  >("draft");
  const [candidateSnapshot, setCandidateSnapshot] =
    useState<CompositionDraft>();
  const [foundationDeliveryMode, setFoundationDeliveryMode] = useState<
    "new" | "existing"
  >(foundationDeliveryTargets[0]?.id ?? "new");
  const [foundationExistingComponent, setFoundationExistingComponent] =
    useState("");
  const groupSequence = useRef(1);

  const commit = (next: CompositionDraft) => {
    if (JSON.stringify(next) === JSON.stringify(draft)) return;
    setPast((history) => [...history, cloneDraft(draft)]);
    setFuture([]);
    setDraft(next);
    setStatus("有未保存修改");
    if (workflow === "foundation") setCandidateStage("draft");
  };
  const run = (operation: CompositionOperation) =>
    commit(applyOperation(draft, operation));
  const undo = () => {
    const previous = past[past.length - 1];
    if (!previous) return;
    setPast((history) => history.slice(0, -1));
    setFuture((history) => [cloneDraft(draft), ...history]);
    setDraft(cloneDraft(previous));
    setStatus("有未保存修改");
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setPast((history) => [...history, cloneDraft(draft)]);
    setFuture((history) => history.slice(1));
    setDraft(cloneDraft(next));
    setStatus("有未保存修改");
  };
  const persist = (publish: boolean) => {
    if (!draft.name.trim()) {
      setStatus("请先命名组件");
      return;
    }
    if (draft.nodes.length === 0) {
      setStatus("请先添加组件");
      return;
    }
    if (workflow === "foundation" && publish && candidateStage !== "accepted") {
      setStatus("请先生成并验收候选");
      return;
    }
    const publicPropNames = draft.publicProps.map((property) =>
      property.name.trim(),
    );
    if (
      publicPropNames.some((name) => !/^[A-Za-z][A-Za-z0-9]*$/.test(name)) ||
      new Set(publicPropNames).size !== publicPropNames.length
    ) {
      setStatus("业务 Prop 名称需唯一且使用英文驼峰");
      return;
    }
    if (
      workflow === "foundation" &&
      publish &&
      foundationDeliveryMode === "existing" &&
      !foundationExistingComponent
    ) {
      setStatus("请选择已有组件");
      return;
    }
    const businessTarget = definition.publishTargets.find(
      (item) => item.id === draft.destination,
    );
    const foundationTarget = foundationDeliveryTargets.find(
      (item) => item.id === foundationDeliveryMode,
    );
    const key =
      workflow === "foundation"
        ? publish
          ? (foundationTarget?.storageKey ??
            "fx-ui:foundation-component-candidates")
          : "fx-ui:foundation-component-drafts"
        : draft.destination === "personal"
          ? "fx-ui:personal-components"
          : "fx-ui:business-component-submissions";
    const outcome =
      workflow === "foundation"
        ? foundationTarget?.outcome
        : businessTarget?.outcome;
    const current = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
    localStorage.setItem(
      key,
      JSON.stringify([
        ...current,
        {
          ...draft,
          ...(workflow === "foundation"
            ? {
                deliveryMode: foundationDeliveryMode,
                existingComponent:
                  foundationDeliveryMode === "existing"
                    ? foundationExistingComponent
                    : undefined,
              }
            : {}),
          id: crypto.randomUUID(),
          updatedAt: new Date().toISOString(),
          status: publish ? outcome : "draft",
        },
      ]),
    );
    setStatus(publish ? (outcome ?? "已发布") : "草稿已保存");
  };
  useImperativeHandle(ref, () => ({
    undo,
    redo,
    save: () => persist(false),
    publish: () => persist(true),
  }));
  useEffect(
    () =>
      onHistoryChange?.({
        canUndo: past.length > 0,
        canRedo: future.length > 0,
      }),
    [future.length, onHistoryChange, past.length],
  );

  const selectedNode = selectedId
    ? findNode(draft.nodes, selectedId)
    : undefined;
  const selectNode = (id: string, additive: boolean) => {
    setRightPanel("properties");
    selectedIdRef.current = id;
    if (additive) {
      setSelectedIds((current) =>
        current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id],
      );
      setSelectedId(id);
      return;
    }
    setSelectedIds([id]);
    setSelectedId(id);
  };
  const clearSelection = () => {
    selectedIdRef.current = undefined;
    setSelectedId(undefined);
    setSelectedIds([]);
  };
  const groupSelection = () => {
    if (selectedIds.length < 2) return;
    const id = `group-${groupSequence.current++}`;
    run({ op: "groupComponents", targets: selectedIds, group: id });
    setRightPanel("properties");
    setSelectedIds([id]);
    setSelectedId(id);
    selectedIdRef.current = id;
  };
  const deleteSelection = () => {
    if (selectedIds.length === 0) return;
    commit(
      selectedIds.reduce(
        (current, id) =>
          applyOperation(current, { op: "removeComponent", target: id }),
        draft,
      ),
    );
    clearSelection();
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      )
        return;
      if (selectedIds.length === 0) return;
      event.preventDefault();
      deleteSelection();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, draft]);
  const getSelectedParentId = () => {
    const id = selectedIdRef.current ?? selectedId;
    if (!id) return undefined;
    const node = findNode(draft.nodes, id);
    if (
      node?.type === "group" ||
      (node?.type === "foundation" && node.foundation === "container")
    )
      return node.id;
    return findParentNode(draft.nodes, id)?.id;
  };
  const getDefaultFoundationParentId = () => {
    const selectedParent = getSelectedParentId();
    if (selectedParent) return selectedParent;
    const rootContainer =
      draft.nodes.length === 1 &&
      draft.nodes[0].type === "foundation" &&
      draft.nodes[0].foundation === "container"
        ? draft.nodes[0]
        : undefined;
    return rootContainer?.id;
  };
  const dropComponent = (
    component: string,
    parent?: string,
    before?: string,
  ) => {
    run({
      op: "addComponent",
      component,
      parent:
        parent ??
        (workflow === "foundation"
          ? getDefaultFoundationParentId()
          : undefined),
      before,
    });
    setDragTarget(undefined);
  };
  const dropFoundation = (assetId: string, parent?: string) => {
    const asset = foundationAssetById.get(assetId);
    if (!asset) return;
    run({
      op: "addFoundation",
      foundation: asset.kind,
      assetId: asset.id,
      props: asset.props,
      parent:
        parent ??
        (workflow === "foundation"
          ? getDefaultFoundationParentId()
          : undefined),
    });
    setDragTarget(undefined);
  };
  const addFoundationPreset = (presetId: string) => {
    const preset = foundationPresets.find((item) => item.id === presetId);
    if (!preset || preset.assets.length === 0) return;
    const next = applyOperation(draft, {
      op: "addFoundationPreset",
      presetId,
    });
    const container = next.nodes.find(
      (node) => node.type === "foundation" && node.foundation === "container",
    );
    if (!container) return;
    commit(next);
    setRightPanel("properties");
    setSelectedId(container.id);
    setSelectedIds([container.id]);
    selectedIdRef.current = container.id;
  };
  const componentById = new Map(
    definition.components.map((component) => [component.id, component]),
  );
  const nodeDisplayName = (id: string): string => {
    const node = findNode(draft.nodes, id);
    if (!node) return "未知节点";
    if (node.type === "component") {
      return componentById.get(node.component)?.name ?? node.component;
    }
    if (node.type === "foundation") {
      return (
        foundationAssetById.get(node.assetId)?.name ??
        foundationLabels[node.foundation]
      );
    }
    return `组合 ${node.children.length}`;
  };
  const candidateNodeName = (node: CanvasNode) => {
    if (node.type === "component")
      return componentById.get(node.component)?.name ?? node.component;
    if (node.type === "foundation")
      return (
        foundationAssetById.get(node.assetId)?.name ??
        foundationLabels[node.foundation]
      );
    return `组合 ${node.children.length}`;
  };
  const renderCandidateTree = (
    nodes: CanvasNode[],
    depth = 0,
  ): React.ReactNode =>
    nodes.flatMap((node) => [
      <div
        key={node.id}
        className="flex items-center gap-2 text-caption"
        style={{ paddingLeft: depth * 12 }}
      >
        <ComponentsIcon className="size-3.5" />
        <span>{candidateNodeName(node)}</span>
        {node.type === "foundation" ? (
          <Tag variant="outline" className="ml-auto">
            基础
          </Tag>
        ) : null}
      </div>,
      node.type === "group"
        ? renderCandidateTree(node.children, depth + 1)
        : node.type === "foundation" && node.foundation === "container"
          ? renderCandidateTree(node.children ?? [], depth + 1)
          : null,
    ]);
  const insertableByName = new Map(
    definition.components.map((component) => [
      component.id.toLowerCase().replace(/[^a-z0-9]/g, ""),
      component,
    ]),
  );
  const normalizedQuery = query.trim().toLowerCase();
  const foundationSearch = normalizedQuery;
  const filteredFoundationPresets = foundationSearch
    ? foundationPresets.filter((preset) =>
        `${preset.name} ${preset.description ?? ""} ${preset.id}`
          .toLowerCase()
          .includes(foundationSearch),
      )
    : foundationPresets;
  const filteredFoundationGroups = foundationAssets
    .map((group) => ({
      ...group,
      items: group.items.filter((asset) =>
        `${asset.name} ${asset.id} ${group.name}`
          .toLowerCase()
          .includes(foundationSearch),
      ),
    }))
    .filter((group) => group.items.length > 0);
  const searchResults = normalizedQuery
    ? catalogComponents.filter((component) => {
        const insertable = insertableByName.get(
          component.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
        );
        return `${component.label}${component.name}${insertable?.name ?? ""}${component.categoryLabel}${component.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      })
    : [];
  const addableSearchResults = searchResults.filter((component) =>
    insertableByName.has(
      component.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
    ),
  );
  const unsupportedResultCount =
    searchResults.length - addableSearchResults.length;
  const selectedComponentDefinition =
    selectedNode?.type === "component"
      ? componentById.get(selectedNode.component)
      : undefined;
  const selectedProperties =
    selectedNode?.type === "component"
      ? editableProperties(selectedNode.component)
      : selectedNode?.type === "foundation"
        ? foundationProperties[selectedNode.foundation]
        : [];
  const suggestedPublicPropName = (componentId: string, property: string) => {
    const normalizedId = componentId
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .map((part, index) =>
        index === 0
          ? part.charAt(0).toLowerCase() + part.slice(1)
          : part.charAt(0).toUpperCase() + part.slice(1),
      )
      .join("");
    if (normalizedId === property) return normalizedId;
    return `${normalizedId}${property.charAt(0).toUpperCase()}${property.slice(1)}`;
  };

  const renderFoundation = (node: FoundationNode): React.ReactNode => {
    if (node.foundation === "container")
      return (
        <div
          className={cn(
            "flex min-w-40 border border-border-subtle text-body",
            node.props.surface === "primary"
              ? node.props.state === "hover"
                ? "border-primary-hover bg-primary-hover text-primary-foreground"
                : node.props.state === "disabled"
                  ? "border-primary-disabled bg-primary-disabled text-primary-foreground"
                  : "border-primary bg-primary text-primary-foreground"
              : node.props.surface === "danger"
                ? node.props.state === "hover"
                  ? "border-destructive-hover bg-destructive-hover text-destructive-foreground"
                  : node.props.state === "disabled"
                    ? "border-destructive-disabled bg-destructive-disabled text-destructive-foreground"
                    : "border-destructive bg-destructive text-destructive-foreground"
                : node.props.surface === "surface"
                  ? "bg-surface"
                  : "bg-card",
            paddingClasses[(node.props.padding as SpacingValue) || "md"],
            radiusClasses[(node.props.radius as RadiusValue) || "container"],
            foundationSizeClasses[(node.props.size as FoundationSize) || "md"],
            node.props.direction === "vertical" ? "flex-col" : "flex-row",
            gapClasses[(node.props.gap as SpacingValue) || "xs"],
            node.props.state === "focus" && "border-ring ring-3 ring-ring",
            node.props.state === "disabled" && "cursor-not-allowed",
          )}
        >
          {node.children?.length ? (
            node.children.map((child) =>
              renderNode(
                child,
                node.props.direction === "horizontal"
                  ? "horizontal"
                  : "vertical",
              ),
            )
          ) : (
            <span className="text-muted-foreground">容器内容</span>
          )}
        </div>
      );
    if (node.foundation === "color")
      return (
        <div className="flex min-w-40 items-center gap-2 border border-border-subtle p-2">
          <span
            className={cn(
              "size-6 shrink-0 border border-border-subtle",
              node.props.token === "primary"
                ? "bg-primary"
                : node.props.token === "muted"
                  ? "bg-muted"
                  : "bg-surface",
            )}
          />
          <span className="text-body">{node.props.token || "surface"}</span>
        </div>
      );
    if (node.foundation === "spacing")
      return (
        <div
          className={cn(
            "flex min-w-32 items-center justify-center border border-dashed border-border-subtle text-caption text-muted-foreground",
            paddingClasses[(node.props.value as SpacingValue) || "md"],
          )}
        >
          间距 {spacingLabels[(node.props.value as SpacingValue) || "md"]}
        </div>
      );
    if (node.foundation === "typography")
      return (
        <span
          className={
            node.props.role === "section-title"
              ? "text-section-title"
              : node.props.role === "label"
                ? "text-label"
                : "text-body"
          }
        >
          {node.props.text || "示例文本"}
        </span>
      );
    if (node.foundation === "icon") {
      const Icon =
        node.props.name === "plus"
          ? PlusIcon
          : node.props.name === "search"
            ? SearchIcon
            : node.props.name === "check"
              ? CheckIcon
              : SparklesIcon;
      return <Icon aria-label="图标" />;
    }
    if (node.foundation === "separator")
      return (
        <Separator
          orientation={
            (node.props.orientation as "horizontal" | "vertical") ||
            "horizontal"
          }
          className={node.props.orientation === "vertical" ? "h-8" : "w-40"}
        />
      );
    if (node.foundation === "interaction")
      return (
        <div
          className={cn(
            node.props.state === "hover" && "rounded-md bg-primary-hover p-1",
            node.props.state === "focus" && "rounded-md ring-2 ring-ring",
          )}
        >
          <Button size="sm" disabled={node.props.state === "disabled"}>
            {node.props.state || "default"}
          </Button>
        </div>
      );
    return (
      <div
        className={cn(
          "flex min-w-40 items-center border border-dashed border-border-subtle p-2",
          node.props.direction === "horizontal" ? "flex-row" : "flex-col",
          gapClasses[(node.props.gap as SpacingValue) || "sm"],
        )}
      >
        布局
      </div>
    );
  };

  const renderComponent = (node: ComponentNode, parentDirection: Direction) => {
    if (node.component === "button")
      return (
        <Button
          variant={
            node.props.variant as ComponentProps<typeof Button>["variant"]
          }
          tone={node.props.tone as ComponentProps<typeof Button>["tone"]}
          size={node.props.size as ComponentProps<typeof Button>["size"]}
          disabled={node.props.disabled === "true"}
        >
          {node.props.text || "按钮"}
        </Button>
      );
    if (node.component === "input")
      return (
        <Input
          placeholder={node.props.placeholder || "输入内容"}
          size={node.props.size as ComponentProps<typeof Input>["size"]}
          type={node.props.type as ComponentProps<"input">["type"]}
          disabled={node.props.disabled === "true"}
          aria-invalid={node.props.invalid === "true"}
        />
      );
    if (node.component === "checkbox") {
      const state = node.props.state;
      return (
        <Checkbox
          aria-label="复选框"
          size={node.props.size as ComponentProps<typeof Checkbox>["size"]}
          checked={state === "checked" || state === "disabled-checked"}
          indeterminate={state === "indeterminate"}
          disabled={state === "disabled" || state === "disabled-checked"}
        />
      );
    }
    if (node.component === "switch")
      return (
        <Switch
          aria-label="开关"
          size={node.props.size as ComponentProps<typeof Switch>["size"]}
          checked={node.props.checked === "on"}
          loading={node.props.state === "loading"}
          disabled={node.props.state === "disabled"}
        />
      );
    if (node.component === "tag") return <Tag>标签</Tag>;
    if (node.component === "avatar")
      return (
        <Avatar>
          <AvatarFallback colorful>陈</AvatarFallback>
        </Avatar>
      );
    if (node.component === "separator")
      return (
        <Separator
          orientation={
            parentDirection === "horizontal" ? "vertical" : "horizontal"
          }
          className={parentDirection === "horizontal" ? "h-8" : "w-full"}
        />
      );
    if (node.component === "select")
      return (
        <Select
          defaultValue="member"
          disabled={node.props.semanticState === "disabled"}
        >
          <SelectTrigger
            variant={
              node.props.variant as ComponentProps<
                typeof SelectTrigger
              >["variant"]
            }
            size={
              node.props.size as ComponentProps<typeof SelectTrigger>["size"]
            }
            aria-invalid={node.props.semanticState === "invalid"}
          >
            <SelectValue placeholder="请选择角色" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="admin">管理员</SelectItem>
              <SelectItem value="member">成员</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    if (node.component === "textarea")
      return <Textarea placeholder="请输入内容" />;
    if (node.component === "badge") return <Badge count={8} />;
    if (node.component === "slider") {
      const min = Number(node.props.min || 0);
      const max = Number(node.props.max || 100);
      const value = Number(node.props.value || 20);
      const rangeValue = [Math.min(value, max), Math.min(value + 30, max)];
      return (
        <Field>
          <div className="flex items-center justify-between gap-4">
            <FieldLabel>完成度</FieldLabel>
            <output>
              {node.props.type === "range" ? rangeValue.join(" – ") : value}
            </output>
          </div>
          <Slider
            value={node.props.type === "range" ? rangeValue : [value]}
            min={min}
            max={max}
            step={Number(node.props.step || 1)}
            orientation={node.props.orientation as "horizontal" | "vertical"}
            disabled={node.props.disabled === "true"}
          />
        </Field>
      );
    }
    if (node.component === "radio-group") {
      const state = node.props.state;
      const orientation =
        node.props.layout === "horizontal" ? "horizontal" : "vertical";
      return (
        <FieldSet>
          <FieldLegend className="sr-only">选择默认工作台</FieldLegend>
          <RadioGroup defaultValue="crm" disabled={state === "disabled"}>
            <FieldGroup orientation={orientation}>
              {[
                ["crm", "客户资料"],
                ["orders", "订单权限"],
                ["messages", "消息通知"],
              ].map(([value, label]) => (
                <Field key={value} orientation="horizontal">
                  <RadioGroupItem
                    value={value}
                    id={`${node.id}-${value}`}
                    size={
                      node.props.size as ComponentProps<
                        typeof RadioGroupItem
                      >["size"]
                    }
                    aria-invalid={state === "invalid"}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={`${node.id}-${value}`}>
                      {label}
                    </FieldLabel>
                  </FieldContent>
                </Field>
              ))}
            </FieldGroup>
          </RadioGroup>
        </FieldSet>
      );
    }
    if (node.component === "toggle") return <Toggle>收藏</Toggle>;
    if (node.component === "toggle-group")
      return (
        <ToggleGroup defaultValue={["all"]} variant="outline" size="sm">
          <ToggleGroupItem value="all">全部</ToggleGroupItem>
          <ToggleGroupItem value="active">启用</ToggleGroupItem>
          <ToggleGroupItem value="archived">归档</ToggleGroupItem>
        </ToggleGroup>
      );
    if (node.component === "link")
      return (
        <Link
          href="#page-builder"
          underline={
            node.props.underline as ComponentProps<typeof Link>["underline"]
          }
          tone={node.props.tone as ComponentProps<typeof Link>["tone"]}
          size={node.props.size as ComponentProps<typeof Link>["size"]}
          disabled={node.props.disabled === "true"}
        >
          查看详情
        </Link>
      );
    if (node.component === "alert")
      return (
        <Alert>
          <AlertTitle>操作已完成</AlertTitle>
          <AlertDescription>更改已成功保存。</AlertDescription>
        </Alert>
      );
    return null;
  };
  const renderNode = (
    node: CanvasNode,
    parentDirection: Direction,
  ): React.ReactNode => {
    const selected = selectedIds.includes(node.id);
    if (node.type === "group")
      return (
        <div
          key={node.id}
          data-builder-node={node.id}
          data-node-type="group"
          onClick={(event) => {
            event.stopPropagation();
            selectNode(node.id, event.shiftKey);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setDragTarget(node.id);
          }}
          onDrop={(event) => {
            event.preventDefault();
            event.stopPropagation();
            const component = event.dataTransfer.getData(
              "application/x-fx-component",
            );
            if (component) dropComponent(component, node.id);
            const foundation = event.dataTransfer.getData(
              "application/x-fx-foundation",
            );
            if (foundation) dropFoundation(foundation, node.id);
          }}
          className={cn(
            "flex min-h-12 items-center p-2 outline-2 outline-offset-[-2px]",
            node.direction === "horizontal" ? "flex-row" : "flex-col",
            gapClasses[node.gap],
            dragTarget === node.id
              ? "outline-primary"
              : selected
                ? "outline-primary"
                : "outline-transparent hover:outline-border",
          )}
        >
          {node.children.map((child) => renderNode(child, node.direction))}
        </div>
      );
    return (
      <div
        key={node.id}
        data-builder-node={node.id}
        data-node-type={
          node.type === "foundation" ? node.foundation : node.component
        }
        onClick={(event) => {
          event.stopPropagation();
          selectNode(node.id, event.shiftKey);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setDragTarget(node.id);
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const component = event.dataTransfer.getData(
            "application/x-fx-component",
          );
          const parent =
            node.type === "foundation" && node.foundation === "container"
              ? node.id
              : undefined;
          if (component)
            dropComponent(component, parent, parent ? undefined : node.id);
          const foundation = event.dataTransfer.getData(
            "application/x-fx-foundation",
          );
          if (foundation) dropFoundation(foundation, parent);
        }}
        className={cn(
          "flex min-h-10 items-center justify-center p-1 outline-2 outline-offset-[-2px]",
          node.type === "component" && node.component === "input" && "w-56",
          node.type === "component" &&
            node.component === "separator" &&
            (parentDirection === "horizontal" ? "self-stretch" : "w-full"),
          dragTarget === node.id
            ? "outline-primary"
            : selected
              ? "outline-primary"
              : "outline-transparent hover:outline-border",
        )}
      >
        {node.type === "foundation"
          ? renderFoundation(node)
          : renderComponent(node, parentDirection)}
      </div>
    );
  };
  const renderTree = (nodes: CanvasNode[], depth = 0): React.ReactNode =>
    nodes.map((node, index) => {
      const component =
        node.type === "component"
          ? componentById.get(node.component)
          : undefined;
      const foundation =
        node.type === "foundation"
          ? foundationAssetById.get(node.assetId)
          : undefined;
      const label =
        node.type === "group"
          ? `组合 ${node.children.length}`
          : node.type === "foundation"
            ? (foundation?.name ?? foundationLabels[node.foundation])
            : (component?.name ?? node.component);
      return (
        <div key={node.id} className="flex flex-col gap-1">
          <div
            data-composition-item={node.id}
            className="flex items-center gap-1"
            style={{ paddingLeft: depth * 16 }}
          >
            <Button
              variant={selectedIds.includes(node.id) ? "secondary" : "ghost"}
              className="min-w-0 flex-1 justify-start"
              onClick={(event) => selectNode(node.id, event.shiftKey)}
            >
              {node.type === "group" ? (
                <FolderIcon data-icon="inline-start" />
              ) : (
                <ComponentsIcon data-icon="inline-start" />
              )}
              {label}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`上移${label}`}
              disabled={index === 0}
              onClick={() =>
                run({ op: "moveComponent", target: node.id, direction: "up" })
              }
            >
              <ArrowUpIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`下移${label}`}
              disabled={index === nodes.length - 1}
              onClick={() =>
                run({ op: "moveComponent", target: node.id, direction: "down" })
              }
            >
              <ArrowDownIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`删除${label}`}
              onClick={() => {
                run({ op: "removeComponent", target: node.id });
                clearSelection();
              }}
            >
              <Trash2Icon />
            </Button>
          </div>
          {node.type === "group" ? renderTree(node.children, depth + 1) : null}
        </div>
      );
    });

  const createAgentOperations = () => {
    const operations: CompositionOperation[] = [];
    if (workflow === "foundation") {
      const promptText = prompt.trim();
      const preset = foundationPresets.find(
        (item) =>
          promptText.includes(item.name) ||
          (item.id === "button" && /按钮|主按钮/.test(promptText)),
      );
      if (preset) {
        operations.push({ op: "addFoundationPreset", presetId: preset.id });
      } else {
        for (const group of foundationAssets) {
          for (const asset of group.items) {
            const matches =
              promptText.includes(asset.name) ||
              promptText.includes(group.name) ||
              (asset.kind === "typography" && /文字|文本/.test(promptText)) ||
              (asset.kind === "icon" && /图标/.test(promptText));
            if (matches) {
              operations.push({
                op: "addFoundation",
                foundation: asset.kind,
                assetId: asset.id,
                props: asset.props,
                parent: getSelectedParentId(),
              });
            }
          }
        }
      }
    } else {
      for (const component of definition.components)
        if (prompt.includes(`添加${component.name}`))
          operations.push({
            op: "addComponent",
            component: component.id,
            parent:
              selectedNode?.type === "group" ? selectedNode.id : undefined,
          });
    }
    const name = prompt.match(
      /(?:命名为|名字叫)[：:\s]*[“"]?([^，。”"\n]+)[”"]?/,
    );
    if (name?.[1])
      operations.push({ op: "setComponentName", value: name[1].trim() });
    setPending(operations);
  };
  const generateCandidate = () => {
    if (draft.nodes.length === 0) {
      setStatus("请先添加组件");
      return;
    }
    setCandidateSnapshot(cloneDraft(draft));
    setCandidateStage("generated");
    setStatus("候选已生成，待预览验收");
  };
  const acceptCandidate = () => {
    if (candidateStage !== "generated") return;
    setCandidateStage("accepted");
    setStatus("候选验收通过，可发布");
  };
  const candidateIsCurrent = candidateSnapshot
    ? JSON.stringify(candidateSnapshot) === JSON.stringify(draft)
    : false;

  return (
    <div
      data-slot="business-component-builder"
      className="grid min-h-0 grid-cols-[240px_minmax(0,1fr)_320px]"
    >
      <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] border-r border-border-subtle bg-card">
        <Tabs
          value={leftPanel}
          onValueChange={(value) =>
            setLeftPanel(value as "components" | "selection" | "layers")
          }
          className="contents"
        >
          <div className="flex flex-col gap-3 border-b border-border-subtle p-4">
            <TabsList variant="line" size="sm" className="w-full">
              <TabsTrigger value="components">
                {workflow === "foundation" ? "全部" : "组件"}
              </TabsTrigger>
              {workflow === "foundation" ? (
                <TabsTrigger value="selection">选中</TabsTrigger>
              ) : (
                <TabsTrigger value="layers">图层</TabsTrigger>
              )}
            </TabsList>
            {leftPanel === "components" ? (
              <Field>
                <FieldLabel
                  htmlFor={
                    workflow === "foundation"
                      ? "foundation-asset-search"
                      : "composition-component-search"
                  }
                  className="sr-only"
                >
                  搜索组件
                </FieldLabel>
                <Input
                  id={
                    workflow === "foundation"
                      ? "foundation-asset-search"
                      : "composition-component-search"
                  }
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={
                    workflow === "foundation" ? "搜索基础资产" : "搜索组件"
                  }
                />
              </Field>
            ) : workflow !== "foundation" ? (
              <p className="text-caption text-muted-foreground">
                Shift 多选，使用箭头调整顺序
              </p>
            ) : null}
          </div>
          <TabsContent value="components" className="min-h-0">
            <ScrollArea className="h-full">
              {workflow === "foundation" ? (
                <div
                  data-slot="foundation-library"
                  className="flex flex-col gap-4 p-3"
                >
                  {filteredFoundationPresets.length > 0 ? (
                    <section className="flex flex-col gap-1">
                      <span className="px-2 text-label">结构预设</span>
                      {filteredFoundationPresets.map((preset) => (
                        <Button
                          key={preset.id}
                          variant="outline"
                          className="justify-start"
                          onClick={() => addFoundationPreset(preset.id)}
                        >
                          {preset.name}
                          <Tag variant="outline" className="ml-auto">
                            起点
                          </Tag>
                          <PlusIcon />
                        </Button>
                      ))}
                    </section>
                  ) : null}
                  {filteredFoundationGroups.map((group) => (
                    <section key={group.id} className="flex flex-col gap-1">
                      <span className="px-2 text-label">{group.name}</span>
                      {group.items.map((asset) => (
                        <Button
                          key={asset.id}
                          variant="ghost"
                          className="justify-start"
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.effectAllowed = "copy";
                            event.dataTransfer.setData(
                              "application/x-fx-foundation",
                              asset.id,
                            );
                          }}
                          onClick={() => dropFoundation(asset.id)}
                        >
                          <ComponentsIcon data-icon="inline-start" />
                          {asset.name}
                          <Tag variant="outline" className="ml-auto">
                            基础
                          </Tag>
                          <PlusIcon />
                        </Button>
                      ))}
                    </section>
                  ))}
                  {foundationSearch &&
                  filteredFoundationPresets.length === 0 &&
                  filteredFoundationGroups.length === 0 ? (
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>没有匹配基础资产</EmptyTitle>
                        <EmptyDescription>
                          换一个基础资产或结构预设名称。
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : null}
                </div>
              ) : normalizedQuery ? (
                searchResults.length > 0 ? (
                  <div
                    data-slot="component-search-results"
                    className="flex flex-col gap-1 p-3"
                  >
                    {addableSearchResults.map((component) => {
                      const insertable = insertableByName.get(
                        component.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
                      )!;
                      return (
                        <Button
                          key={`${component.source}:${component.name}`}
                          variant="ghost"
                          className="justify-start"
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.effectAllowed = "copy";
                            event.dataTransfer.setData(
                              "application/x-fx-component",
                              insertable.id,
                            );
                          }}
                          onClick={() =>
                            dropComponent(
                              insertable.id,
                              selectedNode?.type === "group"
                                ? selectedNode.id
                                : undefined,
                            )
                          }
                        >
                          <ComponentsIcon data-icon="inline-start" />
                          {insertable.name}
                          <Tag variant="outline" className="ml-auto">
                            可添加
                          </Tag>
                          <PlusIcon />
                        </Button>
                      );
                    })}
                    {unsupportedResultCount > 0 ? (
                      <p
                        data-slot="unsupported-component-summary"
                        className="px-3 py-2 text-caption text-muted-foreground"
                      >
                        另有 {unsupportedResultCount} 个匹配组件暂未支持直接搭建
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>没有匹配组件</EmptyTitle>
                      <EmptyDescription>
                        换一个中文或英文关键词。
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>搜索全量组件</EmptyTitle>
                    <EmptyDescription>
                      输入中文名或英文名，只展示匹配结果。
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="selection" className="min-h-0">
            <ScrollArea className="h-full">
              <div
                data-slot="foundation-selection"
                className="flex flex-col gap-3 p-3"
              >
                {selectedIds.length > 0 ? (
                  <>
                    <div
                      data-slot="foundation-selection-actions"
                      className="flex items-center gap-1"
                    >
                      <Tag variant="outline">已选 {selectedIds.length} 项</Tag>
                      {selectedIds.length > 1 ? (
                        <Button size="sm" onClick={groupSelection}>
                          成组
                        </Button>
                      ) : null}
                      {selectedNode?.type === "group" &&
                      selectedIds.length === 1 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            run({
                              op: "ungroupComponents",
                              target: selectedNode.id,
                            });
                            clearSelection();
                          }}
                        >
                          解组
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="ml-auto"
                        aria-label="删除所选节点"
                        onClick={deleteSelection}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1">
                      {selectedIds.map((id) => (
                        <Button
                          key={id}
                          variant="secondary"
                          className="justify-start"
                          onClick={() => selectNode(id, false)}
                        >
                          <ComponentsIcon data-icon="inline-start" />
                          {nodeDisplayName(id)}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>未选中节点</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="layers" className="min-h-0">
            <ScrollArea className="h-full">
              <div
                data-slot="composition-layer-tree"
                className="flex flex-col gap-1 p-3"
              >
                {draft.nodes.length > 0 ? (
                  renderTree(draft.nodes)
                ) : (
                  <span className="px-2 text-caption text-muted-foreground">
                    还没有图层
                  </span>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </aside>

      <section
        className={cn(
          "grid min-h-0 bg-muted",
          workflow === "foundation"
            ? "grid-rows-[minmax(0,1fr)]"
            : "grid-rows-[minmax(0,1fr)_auto]",
        )}
      >
        <ScrollArea className="min-h-0">
          <div
            className={cn(
              "flex min-h-full flex-col p-5",
              workflow === "foundation"
                ? "items-center justify-center"
                : "gap-4",
            )}
          >
            {workflow !== "foundation" && draft.nodes.length > 0 ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-section-title">空白组件</span>
                  <p className="text-caption text-muted-foreground">
                    拖入组件，Shift 多选
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedIds.length > 0 ? (
                    <div
                      data-slot="canvas-selection-toolbar"
                      className="flex items-center gap-1"
                    >
                      <Tag variant="outline">已选 {selectedIds.length} 项</Tag>
                      {selectedIds.length > 1 ? (
                        <Button size="sm" onClick={groupSelection}>
                          成组
                        </Button>
                      ) : null}
                      {selectedNode?.type === "group" &&
                      selectedIds.length === 1 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            run({
                              op: "ungroupComponents",
                              target: selectedNode.id,
                            });
                            clearSelection();
                          }}
                        >
                          解组
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="删除所选组件"
                        onClick={deleteSelection}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  ) : null}
                  <Tag variant="outline">{nodeCount(draft.nodes)} 个节点</Tag>
                </div>
              </div>
            ) : null}
            <div
              data-slot="business-component-preview"
              data-drag-target={dragTarget === "root" ? true : undefined}
              onClick={clearSelection}
              onDragOver={(event) => {
                event.preventDefault();
                if (event.target === event.currentTarget) setDragTarget("root");
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node))
                  setDragTarget(undefined);
              }}
              onDrop={(event) => {
                event.preventDefault();
                const component = event.dataTransfer.getData(
                  "application/x-fx-component",
                );
                if (component) dropComponent(component);
                const foundation = event.dataTransfer.getData(
                  "application/x-fx-foundation",
                );
                if (foundation) dropFoundation(foundation);
              }}
              className={cn(
                "outline-2 outline-offset-[-2px]",
                workflow === "foundation"
                  ? "w-fit min-w-40 bg-transparent"
                  : "min-h-56 w-full bg-background p-4",
                dragTarget === "root"
                  ? "outline-primary"
                  : "outline-transparent",
              )}
            >
              {draft.nodes.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>从空白开始</EmptyTitle>
                    <EmptyDescription>从左侧拖入或点击组件。</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div
                  data-slot="composition-root"
                  className={cn(
                    "flex items-center",
                    workflow !== "foundation" && "min-h-24",
                    draft.direction === "horizontal"
                      ? "flex-row flex-wrap"
                      : "flex-col",
                    marginClasses[draft.margin],
                    gapClasses[draft.gap],
                  )}
                >
                  {draft.nodes.map((node) => renderNode(node, draft.direction))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        {workflow !== "foundation" ? (
          <div
            data-slot="business-component-builder-agent"
            className="border-t border-border-subtle bg-background px-5 py-3"
          >
            <div className="mx-auto flex max-w-3xl flex-col gap-2">
              {pending.length > 0 ? (
                <Alert>
                  <SparklesIcon />
                  <AlertTitle>Agent 将调整当前组件</AlertTitle>
                  <AlertDescription>
                    {pending.length} 项受控修改
                  </AlertDescription>
                  <AlertAction>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPending([])}
                      >
                        取消
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const next = pending.reduce(applyOperation, draft);
                          commit(next);
                          setPending([]);
                        }}
                      >
                        应用修改
                      </Button>
                    </div>
                  </AlertAction>
                </Alert>
              ) : null}
              <Field orientation="horizontal">
                <FieldLabel
                  htmlFor="business-component-agent"
                  className="sr-only"
                >
                  Agent 指令
                </FieldLabel>
                <Input
                  id="business-component-agent"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="例如：添加按钮和输入框，命名为快速搜索"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={createAgentOperations}
                >
                  <SparklesIcon data-icon="inline-start" />
                  Agent 生成
                </Button>
              </Field>
            </div>
          </div>
        ) : null}
      </section>

      <aside
        data-slot="business-component-builder-config"
        className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] border-l border-border-subtle bg-card"
      >
        <Tabs
          value={rightPanel}
          onValueChange={(value) =>
            setRightPanel(value as "global" | "properties")
          }
          className="contents"
        >
          <div className="border-b border-border-subtle px-4 py-3">
            <TabsList variant="line" size="sm" className="w-full">
              <TabsTrigger value="global">全局</TabsTrigger>
              <TabsTrigger value="properties">属性</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={rightPanel} className="min-h-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-5 p-4">
                {rightPanel === "global" ? (
                  <p className="text-caption text-muted-foreground">{status}</p>
                ) : null}
                {rightPanel === "global" || selectedNode ? (
                  <section className="flex flex-col gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-label">
                          {rightPanel === "global"
                            ? "Auto Layout · 整体"
                            : selectedNode?.type === "group"
                              ? "Auto Layout · 组合"
                              : selectedNode?.type === "component"
                                ? "组件属性"
                                : selectedNode?.type === "foundation"
                                  ? `${foundationLabels[selectedNode.foundation]}属性`
                                  : "属性"}
                        </span>
                        {rightPanel === "properties" ? (
                          <Tag variant="outline">Token 约束</Tag>
                        ) : null}
                      </div>
                      <p className="mt-1 text-caption text-muted-foreground">
                        {rightPanel === "properties"
                          ? "只修改当前选中的节点"
                          : "配置整个组件画布的布局与间距"}
                      </p>
                    </div>
                    {rightPanel === "properties" &&
                    (selectedNode?.type === "component" ||
                      selectedNode?.type === "foundation") ? (
                      <div
                        data-slot="component-instance-properties"
                        className="flex flex-col gap-3"
                      >
                        <div className="flex flex-col gap-1 text-caption text-muted-foreground">
                          {selectedNode.type === "component" ? (
                            <>
                              <p>
                                组件源：{selectedComponentDefinition?.source}
                              </p>
                              <p>
                                属性契约：
                                {selectedComponentDefinition?.contract
                                  ?.source ?? "尚无已登记属性契约"}
                              </p>
                            </>
                          ) : (
                            <p>
                              基础资产：
                              {foundationLabels[selectedNode.foundation]}
                            </p>
                          )}
                        </div>
                        {selectedProperties.length > 0 ? (
                          selectedProperties.map((property) => {
                            const bindingId = `${selectedNode.id}:${property.key}`;
                            const binding = draft.publicProps.find(
                              (item) => item.id === bindingId,
                            );
                            const value =
                              selectedNode.props[property.key] ?? "";
                            return (
                              <Field
                                key={property.key}
                                data-component-property={property.key}
                              >
                                <div className="flex items-center justify-between">
                                  <FieldLabel
                                    htmlFor={`component-property-${selectedNode.id}-${property.key}`}
                                  >
                                    {property.zh}
                                  </FieldLabel>
                                  <label className="flex items-center gap-2 text-caption text-muted-foreground">
                                    <Checkbox
                                      aria-label={`公开${property.zh}为业务 Prop`}
                                      checked={Boolean(binding)}
                                      onCheckedChange={(checked) =>
                                        checked
                                          ? run({
                                              op: "exposeComponentProp",
                                              target: selectedNode.id,
                                              property: property.key,
                                              name: suggestedPublicPropName(
                                                selectedNode.type ===
                                                  "component"
                                                  ? selectedNode.component
                                                  : selectedNode.assetId,
                                                property.key,
                                              ),
                                            })
                                          : binding &&
                                            run({
                                              op: "removePublicProp",
                                              id: binding.id,
                                            })
                                      }
                                    />
                                    公开
                                  </label>
                                </div>
                                {property.type === "text" ? (
                                  <Input
                                    id={`component-property-${selectedNode.id}-${property.key}`}
                                    aria-label={`${property.zh}属性`}
                                    value={value}
                                    onChange={(event) =>
                                      run({
                                        op: "setComponentProp",
                                        target: selectedNode.id,
                                        property: property.key,
                                        value: event.target.value,
                                      })
                                    }
                                  />
                                ) : (
                                  <Select
                                    value={value}
                                    onValueChange={(nextValue) =>
                                      nextValue &&
                                      run({
                                        op: "setComponentProp",
                                        target: selectedNode.id,
                                        property: property.key,
                                        value: nextValue,
                                      })
                                    }
                                  >
                                    <SelectTrigger
                                      id={`component-property-${selectedNode.id}-${property.key}`}
                                      aria-label={`${property.zh}属性`}
                                      className="w-full"
                                    >
                                      <SelectValue>
                                        {property.options?.find(
                                          (option) => option.value === value,
                                        )?.label ?? value}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {property.options?.map((option) => (
                                          <SelectItem
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                )}
                              </Field>
                            );
                          })
                        ) : (
                          <p className="text-caption text-muted-foreground">
                            当前组件尚无已登记的可编辑属性。
                          </p>
                        )}
                      </div>
                    ) : null}
                    {rightPanel === "global" ||
                    selectedNode?.type === "group" ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-body text-muted-foreground">
                            方向
                          </span>
                          <ToggleGroup
                            value={[
                              rightPanel === "properties" &&
                              selectedNode?.type === "group"
                                ? selectedNode.direction
                                : draft.direction,
                            ]}
                            onValueChange={(values) =>
                              values[0] &&
                              run({
                                op: "setCompositionLayout",
                                target:
                                  rightPanel === "properties" &&
                                  selectedNode?.type === "group"
                                    ? selectedNode.id
                                    : undefined,
                                property: "direction",
                                value: values[0] as Direction,
                              })
                            }
                            variant="outline"
                            size="sm"
                          >
                            <ToggleGroupItem value="horizontal">
                              横向
                            </ToggleGroupItem>
                            <ToggleGroupItem value="vertical">
                              纵向
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body text-muted-foreground">
                            间隔
                          </span>
                          <Select
                            value={
                              rightPanel === "properties" &&
                              selectedNode?.type === "group"
                                ? selectedNode.gap
                                : draft.gap
                            }
                            onValueChange={(value) =>
                              value &&
                              run({
                                op: "setCompositionLayout",
                                target:
                                  rightPanel === "properties" &&
                                  selectedNode?.type === "group"
                                    ? selectedNode.id
                                    : undefined,
                                property: "gap",
                                value: value as SpacingValue,
                              })
                            }
                          >
                            <SelectTrigger size="sm" aria-label="组件间隔">
                              <SelectValue>
                                {
                                  spacingLabels[
                                    rightPanel === "properties" &&
                                    selectedNode?.type === "group"
                                      ? selectedNode.gap
                                      : draft.gap
                                  ]
                                }
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {definition.layout.spacingValues.map(
                                  (value) => (
                                    <SelectItem key={value} value={value}>
                                      {spacingLabels[value]}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        {rightPanel === "global" ? (
                          <div className="flex items-center justify-between">
                            <span className="text-body text-muted-foreground">
                              外边距
                            </span>
                            <Select
                              value={draft.margin}
                              onValueChange={(value) =>
                                value &&
                                run({
                                  op: "setCompositionLayout",
                                  property: "margin",
                                  value: value as SpacingValue,
                                })
                              }
                            >
                              <SelectTrigger size="sm" aria-label="整体外边距">
                                <SelectValue>
                                  {spacingLabels[draft.margin]}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {definition.layout.spacingValues.map(
                                    (value) => (
                                      <SelectItem key={value} value={value}>
                                        {spacingLabels[value]}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </section>
                ) : null}
                {rightPanel === "global" ? <Separator /> : null}
                {rightPanel === "global" && draft.publicProps.length > 0 ? (
                  <section
                    data-slot="business-component-public-props"
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-label">业务 Props</span>
                      <Tag variant="outline">{draft.publicProps.length} 个</Tag>
                    </div>
                    {draft.publicProps.map((property) => (
                      <Field key={property.id}>
                        <FieldLabel htmlFor={`public-prop-${property.id}`}>
                          {nodeDisplayName(property.nodeId)} ·{" "}
                          {property.property}
                        </FieldLabel>
                        <div className="flex items-center gap-1">
                          <Input
                            id={`public-prop-${property.id}`}
                            aria-label={`业务 Prop 名称 ${property.property}`}
                            value={property.name}
                            onChange={(event) =>
                              run({
                                op: "renamePublicProp",
                                id: property.id,
                                name: event.target.value,
                              })
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`取消公开 ${property.name}`}
                            onClick={() =>
                              run({ op: "removePublicProp", id: property.id })
                            }
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                        <p className="text-caption text-muted-foreground">
                          {property.type} · 默认 {property.defaultValue || "空"}
                        </p>
                      </Field>
                    ))}
                  </section>
                ) : null}
                {rightPanel === "global" && draft.publicProps.length > 0 ? (
                  <Separator />
                ) : null}
                {rightPanel === "global" && workflow === "foundation" ? (
                  <section
                    data-slot="foundation-candidate-gate"
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-label">候选确认</span>
                        <p className="text-caption text-muted-foreground">
                          先生成候选，再确认预览结果，最后才能发布。
                        </p>
                      </div>
                      <Tag
                        variant={
                          candidateStage === "accepted" ? "default" : "outline"
                        }
                      >
                        {candidateStage === "draft"
                          ? candidateSnapshot
                            ? "需重新生成"
                            : "未生成"
                          : candidateStage === "generated"
                            ? "待验收"
                            : "已验收"}
                      </Tag>
                    </div>
                    {candidateSnapshot ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-caption text-muted-foreground">
                          <span>
                            {candidateIsCurrent
                              ? "候选与当前画布一致"
                              : "当前画布已有修改，请重新生成候选"}
                          </span>
                          <span>
                            {candidateSnapshot?.nodes.length ?? 0} 个节点 ·{" "}
                            {candidateSnapshot?.publicProps.length ?? 0} 个公开
                            Prop
                          </span>
                        </div>
                        <div
                          data-slot="foundation-candidate-preview"
                          className="flex flex-col gap-2 border border-border-subtle p-3"
                        >
                          <span className="text-label">候选结构预览</span>
                          {renderCandidateTree(candidateSnapshot.nodes)}
                        </div>
                      </div>
                    ) : null}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateCandidate}
                        disabled={draft.nodes.length === 0}
                      >
                        <SparklesIcon data-icon="inline-start" />
                        生成候选
                      </Button>
                      <Button
                        size="sm"
                        onClick={acceptCandidate}
                        disabled={candidateStage !== "generated"}
                      >
                        <CheckCircleIcon data-icon="inline-start" />
                        预览验收
                      </Button>
                    </div>
                  </section>
                ) : null}
                {rightPanel === "global" && workflow === "foundation" ? (
                  <Separator />
                ) : null}
                {rightPanel === "global" ? (
                  <section className="flex flex-col gap-3">
                    <span className="text-label">命名与发布</span>
                    <Field>
                      <FieldLabel htmlFor="business-component-name">
                        组件名称
                      </FieldLabel>
                      <Input
                        id="business-component-name"
                        value={draft.name}
                        onChange={(event) =>
                          run({
                            op: "setComponentName",
                            value: event.target.value,
                          })
                        }
                        placeholder="例如：客户快捷操作"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="business-component-destination">
                        {workflow === "foundation" ? "组件方式" : "发布位置"}
                      </FieldLabel>
                      <Select
                        value={
                          workflow === "foundation"
                            ? foundationDeliveryMode
                            : draft.destination
                        }
                        onValueChange={(value) =>
                          value && workflow === "foundation"
                            ? setFoundationDeliveryMode(
                                value as "new" | "existing",
                              )
                            : value &&
                              commit({
                                ...draft,
                                destination: value as "personal" | "business",
                              })
                        }
                      >
                        <SelectTrigger id="business-component-destination">
                          <SelectValue>
                            {workflow === "foundation"
                              ? foundationDeliveryTargets.find(
                                  (target) =>
                                    target.id === foundationDeliveryMode,
                                )?.name
                              : definition.publishTargets.find(
                                  (target) => target.id === draft.destination,
                                )?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {(workflow === "foundation"
                              ? foundationDeliveryTargets
                              : definition.publishTargets
                            ).map((target) => (
                              <SelectItem key={target.id} value={target.id}>
                                {target.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    {workflow === "foundation" &&
                    foundationDeliveryMode === "existing" ? (
                      <Field>
                        <FieldLabel htmlFor="foundation-existing-component">
                          选择已有组件
                        </FieldLabel>
                        <Select
                          value={foundationExistingComponent}
                          onValueChange={(value) =>
                            value && setFoundationExistingComponent(value)
                          }
                        >
                          <SelectTrigger id="foundation-existing-component">
                            <SelectValue placeholder="选择组件">
                              {foundationExistingComponents.find(
                                (component) =>
                                  component.name ===
                                  foundationExistingComponent,
                              )?.label ?? "选择组件"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {foundationExistingComponents.map((component) => (
                                <SelectItem
                                  key={component.name}
                                  value={component.name}
                                >
                                  {component.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    ) : null}
                    <p className="text-caption text-muted-foreground">
                      {workflow === "foundation"
                        ? foundationDeliveryMode === "new"
                          ? "创建新的基础组件，验收后进入 Playground 与入库流程。"
                          : "更新已有基础组件，验收后提交受控更新，不直接覆盖源码。"
                        : "个人组件直接保存；业务组件提交审核后进入公共组件库。"}
                    </p>
                  </section>
                ) : null}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  );
});
