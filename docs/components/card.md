---
category: Components
group: 通用
title: Card
subtitle: 卡片
description: 承载一组相关内容、操作或数据摘要。
source: src/components/ui/card.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - card
  - card-foreground
  - muted
  - muted-foreground
  - border
  - ring
status: complete
---

# Card 卡片

承载一组相关内容、操作或数据摘要。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Card 前必须先以 `src/components/ui/card.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/card.tsx
```

## 使用方式 {#usage}

```tsx
import { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "@/components/ui/card"
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>订单概览</CardTitle>
    <CardDescription>最近 30 天数据</CardDescription>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

## 组件总览 {#overview}

- 类型：container
- 语义 DOM：data-slot="card"、data-slot="card-header"、data-slot="card-title"、data-slot="card-description"、data-slot="card-action"、data-slot="card-content"、data-slot="card-footer"
- 原生/数据状态：root
- 变体：无独立 variant prop
- 导出项：Card、CardHeader、CardFooter、CardTitle、CardAction、CardDescription、CardContent

## 场景示例 {#examples}

### 推荐场景

- 使用意图：承载一组相关内容、操作或数据摘要。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Card>
  <CardHeader>
    <CardTitle>订单概览</CardTitle>
    <CardDescription>最近 30 天数据</CardDescription>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

### 不适合场景

- 不用 Card 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/card.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="card"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-header"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-title"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-description"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-action"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-footer"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 无额外交互状态，按根节点语义理解 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--card` | 卡片背景 |
| `--card-foreground` | 卡片文字和图标 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--border` | 边框、分隔线和描边结构 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 容器组件负责结构和层级，不直接承载业务状态颜色。
- 使用完整子组件结构，不要把标题、描述、内容全部塞进一个 div。
- 使用 `CardHeader`、`CardTitle`、`CardDescription`、`CardContent`、`CardFooter` 组织内容。
- 不要把整个卡片内容都塞进 `CardContent` 后再手写标题样式。
- 使用 Card 前必须以 src/components/ui/card.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Card 的 div，也不要硬编码 token 颜色。
<div className="custom-card">...</div>
```

推荐：

```tsx
<Card>
  <CardHeader>
    <CardTitle>订单概览</CardTitle>
    <CardDescription>最近 30 天数据</CardDescription>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```
