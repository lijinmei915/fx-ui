---
category: Components
group: 通用
title: Tooltip
subtitle: 提示气泡
description: 展示短小的补充说明。
source: src/components/ui/tooltip.tsx
theme: theme/fx-theme.css
tokens:
  - background
  - foreground
status: complete
---

# Tooltip 提示气泡

展示短小的补充说明。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Tooltip 前必须先以 `src/components/ui/tooltip.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/tooltip.tsx
```

## 使用方式 {#usage}

```tsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
```

```tsx
<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon" />}>?</TooltipTrigger>
  <TooltipContent>短说明</TooltipContent>
</Tooltip>
```

## 组件总览 {#overview}

- 类型：overlay
- 语义 DOM：data-slot="tooltip-provider"、data-slot="tooltip"、data-slot="tooltip-trigger"、data-slot="tooltip-content"
- 原生/数据状态：data-open、data-closed
- 变体：无独立 variant prop
- 导出项：Tooltip、TooltipTrigger、TooltipContent、TooltipProvider

## 场景示例 {#examples}

### 推荐场景

- 使用意图：展示短小的补充说明。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon" />}>?</TooltipTrigger>
  <TooltipContent>短说明</TooltipContent>
</Tooltip>
```

### 不适合场景

- 不用 Tooltip 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/tooltip.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="tooltip-provider"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="tooltip"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="tooltip-trigger"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="tooltip-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `data-open` | 浮层或折叠内容打开态 |
| `data-closed` | 浮层或折叠内容关闭态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--background` | 页面或控件的基础背景 |
| `--foreground` | 主要文字和图标 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 浮层触发器使用源码提供的 Trigger / render 能力，不要手写绝对定位面板。
- 浮层内容使用源码提供的 Content / Portal / Positioner，不要手写 z-index。
- 需要标题的弹层必须提供 Title；视觉隐藏时使用 `sr-only`，不要省略可访问名称。
- Tooltip 只放短说明，不放可交互内容；可交互浮层用 Popover。
- 使用 Tooltip 前必须以 src/components/ui/tooltip.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Tooltip 的 div，也不要硬编码 token 颜色。
<div className="custom-tooltip">...</div>
```

推荐：

```tsx
<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon" />}>?</TooltipTrigger>
  <TooltipContent>短说明</TooltipContent>
</Tooltip>
```
