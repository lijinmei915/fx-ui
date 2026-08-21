---
category: Components
group: 业务组合组件
title: ConditionBuilder
subtitle: 条件选择器
description: 用 AND 规则与 OR 条件组构造结构化列表筛选。
source: src/components/fx/condition-builder.tsx
theme: theme/fx-theme.css
tokens:
  - surface
  - input
  - border
  - foreground
  - muted-foreground
  - info
  - destructive
  - ring
status: complete
---

# ConditionBuilder 条件选择器

ConditionBuilder 是由 shadcn `Select`、`Input`、`Checkbox`、`Button`、`Tag` 与 `Separator` 组成的 fx 组合组件。shadcn registry 没有等价的 Query Builder；结构参考 Figma `13072:52343` 的 28px 控件、4px 条件间距与 AND/OR 层级，交互模型参考主流筛选构造器，但全部视觉使用 fx-ui token。

## 来源 {#source}

`src/components/fx/condition-builder.tsx`

## 使用方式 {#usage}

```tsx
<ConditionBuilder
  fields={fields}
  value={filters}
  onValueChange={setFilters}
/>
```

## 实时属性 {#runtime-props}

- 结构：组内条件按 AND 连接，条件组之间按 OR 连接；支持实时新增和删除。
- 值编辑：字段声明 `text`、`number`、`select` 或 `multi-select`，多选值使用 Tag 展示。
- 联动：切换字段会同步切换操作符集合，并清空不兼容的旧值。
- 状态：每条条件支持 `exposed`；组件支持 `disabled`、`readOnly`、组数和规则数上限。
- 数据：`value/defaultValue + onValueChange` 支持受控与非受控使用。

## API {#api}

以 `src/components/fx/condition-builder.tsx` 导出的类型为真实契约。`fields` 是字段能力真相源，`ConditionBuilderValue.groups` 保存 OR 组，`ConditionGroup.rules` 保存组内 AND 规则。

## Semantic DOM {#semantic-dom}

- `data-slot="condition-builder"`：根节点及禁用、只读状态。
- `data-slot="condition-group"`：AND 条件组。
- `data-slot="condition-rule"`：单条条件。
- `data-slot="condition-builder-or"`：OR 分隔。
- `data-slot="condition-group-actions"` 与 `data-slot="condition-builder-actions"`：组内和根层命令。

## AI Rules {#ai-rules}

- 条件组和规则必须使用稳定唯一 id；不要用数组序号或展示文案作业务标识。
- 操作符和值候选只从 `fields` 读取，不在调用处复制条件行结构。
- `className` 仅用于根节点布局，不覆盖颜色、圆角、边框或内部间距。
