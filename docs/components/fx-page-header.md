---
category: Components
group: 业务组合
title: PageHeader
subtitle: 页面标题区
description: 公司组合组件，用于页面标题、描述和主操作。
source: src/components/fx/page-header.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - muted
  - muted-foreground
  - border
  - ring
status: complete
---

# PageHeader 页面标题区

公司组合组件，用于页面标题、描述和主操作。

源码来自 fx-ui 公司组合组件，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 PageHeader 前必须先以 `src/components/fx/page-header.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/fx/page-header.tsx
```

## 使用方式 {#usage}

```tsx
import { PageHeader } from "@/components/fx/page-header"
```

```tsx
<PageHeader
  eyebrow="订单"
  title="订单详情"
  description="查看订单状态和操作记录。"
  actions={<Button>保存</Button>}
/>
```

## 组件总览 {#overview}

- 类型：fx
- 语义 DOM：root
- 原生/数据状态：root
- 变体：无独立 variant prop
- 导出项：PageHeader

## 场景示例 {#examples}

### 推荐场景

- 使用意图：公司组合组件，用于页面标题、描述和主操作。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<PageHeader
  eyebrow="订单"
  title="订单详情"
  description="查看订单状态和操作记录。"
  actions={<Button>保存</Button>}
/>
```

### 不适合场景

- 不用 PageHeader 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

源码定义的 PageHeaderProps：

| 属性 | 说明 |
| --- | --- |
| `title: string` | 以源码类型为准；这里只记录真实存在的公开属性 |
| `description?: string` | 以源码类型为准；这里只记录真实存在的公开属性 |
| `eyebrow?: string` | 以源码类型为准；这里只记录真实存在的公开属性 |
| `actions?: ReactNode` | 以源码类型为准；这里只记录真实存在的公开属性 |


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `root` | 组件根节点；源码没有更细 data-slot 时按根节点理解 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 无额外交互状态，按根节点语义理解 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--border` | 边框、分隔线和描边结构 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 公司组合组件只组合现有 shadcn/ui 能力，不新增隐藏 API。
- 业务页面优先复用组合组件，局部差异通过 props 和 children 注入。
- 不要复制组件内部 JSX 到页面里再改样式。
- 使用 PageHeader 前必须以 src/components/fx/page-header.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 PageHeader 的 div，也不要硬编码 token 颜色。
<div className="custom-pageheader">...</div>
```

推荐：

```tsx
<PageHeader
  eyebrow="订单"
  title="订单详情"
  description="查看订单状态和操作记录。"
  actions={<Button>保存</Button>}
/>
```
