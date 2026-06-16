---
category: Components
group: 通用
title: Badge
subtitle: 徽标
description: 展示简短状态、计数或分类标记，常用于表格、列表和卡片角标。
source: src/components/ui/badge.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - primary-foreground
  - secondary
  - secondary-foreground
  - foreground
  - muted
  - muted-foreground
  - destructive
  - border
  - ring
  - success
status: complete
---

# Badge 徽标

Badge 用于展示简短状态、计数或分类标记，常见于表格、列表、卡片角标和版本标记。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过手写颜色 class 或重新封装实现。

AI 生成页面时应优先用 Badge 的 `variant` 表达语义，不要把 Badge 当 Button 用，也不要把长句说明塞进 Badge。

## 来源 {#source}

源码位于：

```txt
src/components/ui/badge.tsx
```

该组件来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入。

## 使用方式 {#usage}

```tsx
import { Badge } from "@/components/ui/badge"
```

```tsx
<Badge variant="success">已支付</Badge>
```

## 组件总览 {#overview}

- 语义 DOM：Base UI `useRender` 注入 `slot: "badge"`，运行时用于定位 `data-slot="badge"`
- 原生/数据状态：`hover`、`focus-visible`、`aria-invalid`
- 样式变体：`default`、`secondary`、`destructive`、`success`、`outline`、`ghost`、`link`
- 尺寸变体：无独立 `size` prop
- 图标：图标放入 Badge 时使用 `data-icon="inline-start"` 或 `data-icon="inline-end"`
- 链接徽标：需要可点击跳转时使用 `render={<a href="..." />}`，不要在 Badge 里嵌套 `<a>`

## 场景示例 {#examples}

AI 选择 Badge 时按这个顺序判断：

1. 先判断内容类型：状态、计数、分类、版本、可点击链接。
2. 再选择 `variant`：成功用 `success`，失败/风险用 `destructive`，中性过程态用 `secondary` 或 `outline`。
3. 再判断是否可点击。可点击徽标用 `render` 渲染为链接，不要用 Badge 代替 Button。
4. 最后控制内容长度。Badge 只放短词、短数字、图标 + 短词；长说明应该放正文、Tooltip 或表格列说明。

### 状态标记

- 使用意图：在表格、列表里标记数据的当前状态。
- 规则：成功态用 `success`，中性态用 `secondary` 或 `outline`，错误态用 `destructive`。

```tsx
<Badge variant="success">已支付</Badge>
<Badge variant="secondary">处理中</Badge>
<Badge variant="destructive">已失败</Badge>
```

### 计数提示

- 使用意图：展示未读数量、新增条目数等数字提示。
- 规则：数字内容保持简短，避免在 Badge 里塞长文本。

```tsx
<Badge variant="outline">+12</Badge>
```

### 搭配图标

- 使用意图：用图标强化语义，如校验通过、AI 生成标记。
- 规则：图标放进 Badge 时用 `data-icon` 标记位置，不手写尺寸覆盖。

```tsx
<Badge variant="secondary">
  <CheckCircleIcon data-icon="inline-start" />
  已校验
</Badge>
```

### 链接徽标

- 使用意图：版本号、分类标签等需要跳转到详情或筛选结果。
- 规则：使用 `render={<a href="..." />}`，不要嵌套 `<a>`，也不要用 `onClick` 把 Badge 伪装成 Button。

```tsx
<Badge variant="link" render={<a href="/releases/v1.2.0" />}>
  v1.2.0
</Badge>
```

## API {#api}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `variant` | 样式变体 | `'default' \| 'secondary' \| 'destructive' \| 'success' \| 'outline' \| 'ghost' \| 'link'` | `'default'` |
| `render` | 自定义根节点渲染，例如渲染成 `<a>` 实现链接徽标 | `ReactElement \| (props, state) => ReactElement` | - |
| `aria-invalid` | 校验失败状态 | `boolean` | `false` |
| `className` | 追加布局类，不用于硬覆盖 token 视觉 | `string` | - |
| `...props` | 透传到底层 `span` 或 `render` 指定的元素 | `useRender.ComponentProps<"span">` | - |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `slot: "badge"` | 源码传给 Base UI `useRender` 的状态，运行时用于标记 Badge 根节点 |
| `data-slot="badge"` | 运行时语义定位，承载圆角、内边距、背景与文字色 |
| `data-icon="inline-start"` | 前置图标位置标记，驱动左侧间距 |
| `data-icon="inline-end"` | 后置图标位置标记，驱动右侧间距 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 可点击或链接徽标的悬停反馈，来自源码状态样式 |
| `focus-visible` | 键盘焦点态，必须保留可访问焦点环 |
| `aria-invalid` | 校验失败语义，同时驱动错误态样式 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | default / link 的品牌强调色 |
| `--primary-foreground` | default 背景上的文字和图标 |
| `--secondary` | secondary 的中性背景 |
| `--secondary-foreground` | secondary 的文字和图标 |
| `--foreground` | outline 的文字 |
| `--muted` | outline / ghost 的 hover 背景 |
| `--muted-foreground` | outline / ghost hover 后的弱化文字 |
| `--destructive` | destructive 的错误/风险语义 |
| `--border` | outline 的边框 |
| `--ring` | focus-visible 焦点环 |
| `--success` | success 的成功/完成语义 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 使用 Badge 前必须先读取 `src/components/ui/badge.tsx`，以源码为真实 API。
- 用 `variant` 表达状态语义，不要手写颜色、圆角、边框和状态样式。
- Badge 只承载短状态、短数字或分类词；长说明放正文、Tooltip 或表格说明。
- Badge 不是 Button；触发操作用 Button，需要跳转时用 `render={<a />}`。
- 图标放入 Badge 时用 `data-icon` 标记位置，不手写图标尺寸。
- `className` 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。
- 只能使用源码中存在的 variant，不要发明新的变体名。
- 当前源码没有独立 `size` prop；不要因为布局需要发明 size。
- 修改文档、示例或 AI 数据源后，必须同步 `docs/data/components.manifest.json` 并运行 `npm run check:components`。

## 正误示例 {#do-dont}

### 不要硬覆盖 token 视觉

不推荐：

```tsx
<Badge className="bg-green-500 text-white">已支付</Badge>
```

推荐：

```tsx
<Badge variant="success">已支付</Badge>
```

### 不要把长说明塞进 Badge

不推荐：

```tsx
<Badge>该订单已经付款完成，可以进入下一步发货流程</Badge>
```

推荐：

```tsx
<Badge variant="success">已支付</Badge>
```

### 链接徽标用 render

不推荐：

```tsx
// 不要在 Badge 内部嵌套链接元素
<Badge>{/* nested link */}</Badge>
```

推荐：

```tsx
<Badge variant="link" render={<a href="/releases/v1.2.0" />}>
  v1.2.0
</Badge>
```
