---
category: Components
group: 通用
title: Spinner
subtitle: 加载指示
description: 表示短时间等待或局部加载状态。
source: src/components/ui/spinner.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - background
status: complete
---

# Spinner 加载指示

表示短时间等待或局部加载状态。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Spinner 前必须先以 `src/components/ui/spinner.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/spinner.tsx
```

## 使用方式 {#usage}

```tsx
import { Spinner } from "@/components/ui/spinner"
```

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  提交中
</Button>
```

## 组件总览 {#overview}

- 类型：feedback
- 语义 DOM：root
- 原生/数据状态：root
- 变体：无独立 variant prop
- 导出项：Spinner

## 场景示例 {#examples}

### 推荐场景

- 使用意图：表示短时间等待或局部加载状态。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  提交中
</Button>
```

### 不适合场景

- 不用 Spinner 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/spinner.tsx`，不要凭空发明 API。


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
| `--background` | 页面或控件的基础背景 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 反馈组件要表达明确状态，不要只靠颜色让用户猜语义。
- 危险确认使用 AlertDialog 或 ConfirmDangerDialog，不要用普通 Dialog 代替。
- 加载态优先用 Skeleton 或 Spinner 组合，不要手写 animate-pulse 占位块。
- Spinner 表示局部等待；按钮 loading 组合为 `disabled + Spinner`。
- 使用 Spinner 前必须以 src/components/ui/spinner.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Spinner 的 div，也不要硬编码 token 颜色。
<div className="custom-spinner">...</div>
```

推荐：

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  提交中
</Button>
```
