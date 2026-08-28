---
category: Components
group: 通用
title: Table
subtitle: 表格
description: 展示结构化数据列表。
source: src/components/ui/table.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - card
  - accent
  - accent-hover
  - muted
  - muted-hover
  - muted-foreground
  - border
  - border-subtle
  - ring
status: complete
---

# Table 表格

展示结构化数据列表。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Table 前必须先以 `src/components/ui/table.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/table.tsx
```

## 使用方式 {#usage}

```tsx
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table"
```

```tsx
<Table>
  <TableHeader><TableRow><TableHead>状态</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>已支付</TableCell></TableRow></TableBody>
</Table>
```

## 组件总览 {#overview}

- 类型：display
- 语义 DOM：data-slot="table-container"、data-slot="table"、data-slot="table-header"、data-slot="table-body"、data-slot="table-footer"、data-slot="table-row"、data-slot="table-head"、data-slot="table-cell"、data-slot="table-caption"
- 原生/数据状态：hover、focus-visible、aria-expanded、aria-sort、data-state=selected、data-filtered
- 表面变体：`variant="plain | bordered | striped"`，默认 `plain`
- 尺寸/密度：`density="compact | default | comfortable"`，分别对应 28 / 36 / 42px 行高
- 导出项：Table、TableHeader、TableBody、TableFooter、TableHead、TableRow、TableCell、TableCaption

## 场景示例 {#examples}

### 推荐场景

- 使用意图：展示结构化数据列表。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Table>
  <TableHeader><TableRow><TableHead>状态</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>已支付</TableCell></TableRow></TableBody>
</Table>
```

### 不适合场景

- 不用 Table 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。
- 不把 loading、empty、分页、筛选或选择扩成 Table 根节点的业务布尔属性。

## API {#api}

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `Table.variant` | `"plain" \| "bordered" \| "striped"` | `"plain"` | 控制无外框、圆角描边和斑马纹表面 |
| `Table.density` | `"compact" \| "default" \| "comfortable"` | `"default"` | 28 / 36 / 42px 行高尺寸轴 |
| `Table.maxHeight` | `number \| string` | — | 纵向滚动最大高度，与 `TableHeader sticky` 组合 |
| `TableHeader.sticky` | `boolean` | `false` | 在 Table 滚动容器内吸顶 |
| `TableRow data-state` | `"selected"` | — | 选中行使用主题浅色背景，hover 时加深一级 |
| `TableRow.variant` | `"default" \| "static"` | `"default"` | 数据行有扫读 hover；Skeleton/空态占位行使用 static |
| `TableHead.align` | `"left" \| "center" \| "right"` | `"left"` | 表头内容对齐 |
| `TableHead.sortable / sorted / onSort` | `boolean / "asc" \| "desc" \| false / () => void` | — | 可键盘操作的排序入口，并同步 `aria-sort` |
| `TableHead.filterContent / filtered` | `ReactNode / boolean` | — | 组合 Popover 列筛选及已筛选反馈 |
| `TableHead.pinned / frozenLeft / frozenEdge` | 见源码 | — | 固定操作列或冻结连续左侧列 |
| `TableHead.menuActions` | `{ label; icon?; onClick? }[]` | — | 列操作 DropdownMenu |
| `TableCell.align / pinned / frozenLeft / frozenEdge` | 见源码 | — | 数据单元格对齐与固定能力 |

Loading 使用 `Table + Skeleton`，Empty 使用跨列空态，分页使用 `Pagination`；这些是组合场景，不是 Table 根属性。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="table-container"` | 表格最外层滚动容器；横向滚动后带 `data-scrolled-x="true"`，用于固定列阴影 |
| `data-slot="table"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="table-header"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="table-body"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="table-footer"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="table-row"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="table-head"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="table-cell"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="table-caption"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 鼠标悬停反馈，来自源码状态样式 |
| `aria-expanded` | 展开态语义，常用于触发器 |
| `focus-visible` | 排序、筛选和列操作入口的键盘焦点环 |
| `aria-sort` | sortable 表头同步 none / ascending / descending |
| `data-state=selected` | 选择控件与行选中反馈 |
| `data-filtered` | 列筛选已生效反馈 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--card` | 表头、固定列和 bordered 表面的背景 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-hover` | 行 hover 与筛选入口 hover |
| `--accent` | 选中行的主题浅色背景 |
| `--accent-hover` | 选中行 hover 的主题浅色加深背景 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--border` | 边框、分隔线和描边结构 |
| `--border-subtle` | 行分隔和 bordered 表面弱边框 |
| `--ring` | 排序、筛选和列操作的焦点环 |
| `--fds-g-color-shadow-default` | 横向滚动时固定列边缘的柔和阴影 |

完整 token 规则见 `docs/TOKENS.md`。

## Component Styling Hooks {#component-styling-hooks}

以下 3 个结构 Hook 已通过 stable 准入，用于跨框架共享真实 density 尺寸：

| Hook | 默认引用 | 对应 API |
| --- | --- | --- |
| `--fds-c-table-sizing-cell-block` | `--fds-g-sizing-36` | `density="default"` |
| `--fds-c-table-sizing-cell-block-compact` | `--fds-g-sizing-28` | `density="compact"` |
| `--fds-c-table-sizing-cell-block-comfortable` | `--fds-g-sizing-42` | `density="comfortable"` |

默认 density 在 Hook 名中省略 `default`；`compact / comfortable` 与真实组件 API 一致，不使用虚构的 `sm / md / lg`。这些结构 Hook 供主题根和跨框架适配器读取，页面调用仍只传 `density`。

## 排版 Typography {#typography}

| 元素 | 规则 |
| --- | --- |
| 表头 | `TableHead` 使用 label 的 `font-medium`，只承载短字段名、排序和筛选入口。 |
| 单元格 | 原生 Table 不猜字段类型。使用 `DataTable` 时，数值、日期、编号和状态用 `dataType`；普通文本按 body 内容呈现。 |

机器映射在 `docs/data/design-tokens.json#componentUsage`，可用 `npm run tokens -- component Table --json` 查询。

## AI Rules {#ai-rules}

- 展示组件只负责呈现数据或身份，不承载提交类动作。
- 状态语义优先用现有 variant 或组合组件，不手写颜色。
- 表格结构使用 TableHeader/TableBody/TableRow/TableCell，不要用 div grid 伪造表格。
- `variant` 只选择表面，`density` 只选择行高；业务能力使用现有子组件或成形 Playground 场景。
- 排序入口必须通过 `sortable + sorted + onSort` 保持图标、状态和 `aria-sort` 一致。
- loading、empty、分页和批量选择是组合，不给 Table 增加布尔业务 API；列表行选择在 Table 调试台的“选择”能力中验证表头全选、半选、行高亮和批量操作。
- 表头 hover 由 `TableHeader` 内部处理；Skeleton/empty 占位行用 `TableRow variant="static"`，不要在调用处覆盖 hover 背景。
- 使用 Table 前必须以 src/components/ui/table.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Table 的 div，也不要硬编码 token 颜色。
<div className="custom-table">...</div>
```

推荐：

```tsx
<Table>
  <TableHeader><TableRow><TableHead>状态</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>已支付</TableCell></TableRow></TableBody>
</Table>
```
