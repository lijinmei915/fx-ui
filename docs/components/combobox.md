---
category: Components
group: 数据录入
title: Combobox
subtitle: 组合框
description: 可搜索、可筛选的单选或多选输入基础能力。
source: src/components/ui/combobox.tsx
theme: theme/fx-theme.css
tokens:
  - surface
  - foreground
  - popover
  - popover-foreground
  - muted-foreground
  - accent
  - border
  - input
  - ring
status: complete
---

# Combobox 组合框

Combobox 通过 `npx shadcn@latest add combobox` 引入，基于 Base UI，复用项目现有 InputGroup、Input 与 Button。fx-ui 扩展 `ComboboxList variant="panel"`、`ComboboxItem density="list"` 和 `indicator="none"`，供 PeoplePicker 等内联组合面板复用。

它用于候选项较多、需要先输入关键词再选择的场景。文档调试台直接展示单选、多选 Chips、清除、空结果和禁用状态；少量固定选项优先使用 Select、RadioGroup 或 CheckboxGroup 类组合。

## 来源 {#source}

`src/components/ui/combobox.tsx`

## 使用方式 {#usage}

```tsx
<Combobox items={items} value={value} onValueChange={setValue}>
  <ComboboxInput placeholder="搜索" />
  <ComboboxContent>
    <ComboboxList>{(item) => <ComboboxItem value={item}>{item.label}</ComboboxItem>}</ComboboxList>
  </ComboboxContent>
</Combobox>
```

## API {#api}

公开 API 以源码和 Base UI Combobox Root 为准。单选使用标量 `value`，多选使用 `multiple + value[] + ComboboxChips`。`ComboboxInput` 的 `showClear` 提供清除动作。`variant="panel"` 用于固定面板内联列表，`density="list"` 使用 48px 列表行，`indicator="none"` 允许组合组件使用 Checkbox 等独立选择反馈；源码不存在 `inline` prop。

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="combobox-input"` | 搜索输入。 |
| `data-slot="combobox-content"` | 浮层内容。 |
| `data-slot="combobox-list"` | 候选列表；额外提供 `data-variant`。 |
| `data-slot="combobox-item"` | 候选项；额外提供 `data-density` 与 `data-indicator`。 |
| `data-slot="combobox-empty"` | 无匹配结果。 |

## 状态标记 {#states}

- `open`：浮层已打开。
- `closed`：浮层已关闭。
- `highlighted`：键盘或指针高亮候选项。
- `selected`：候选项已选中。
- `disabled`：根节点或候选项禁用。
- `empty`：过滤后无候选项。

## 主题变量 Design Token {#design-token}

使用 `--surface`、`--popover`、`--popover-foreground`、`--foreground`、`--muted-foreground`、`--accent`、`--border`、`--input` 与 `--ring`，阴影使用 `shadow-l1`。

## AI Rules {#ai-rules}

- 业务选择模型留在 fx 组合层，不向基础 Combobox 注入人员、组织等 props。
- 调用处不覆盖颜色、圆角、边框和内部间距。
- 图标只从 `@/lib/icons` 导入。
