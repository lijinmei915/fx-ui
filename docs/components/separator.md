---
category: Components
group: 通用
title: Separator
subtitle: 分割线
description: 用于分隔相关内容区域。
source: src/components/ui/separator.tsx
theme: theme/fx-theme.css
tokens:
  - border
status: complete
---

# Separator 分割线

用于分隔相关内容区域。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Separator 前必须先以 `src/components/ui/separator.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/separator.tsx
```

## 使用方式 {#usage}

```tsx
import { Separator } from "@/components/ui/separator"
```

```tsx
<Separator />
```

## 组件总览 {#overview}

- 类型：layout
- 语义 DOM：data-slot="separator"
- 原生/数据状态：root
- 变体：无独立 variant prop
- 导出项：Separator

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于分隔相关内容区域。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Separator />
```

### 不适合场景

- 不用 Separator 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/separator.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="separator"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 无额外交互状态，按根节点语义理解 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--border` | 边框、分隔线和描边结构 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 布局组件只负责分隔、间距或结构，不承载业务语义。
- 不要用普通 div 或 hr 复刻已有布局组件。
- 分隔内容用 Separator，不要手写 `<hr>` 或 `border-t` div。
- 使用 Separator 前必须以 src/components/ui/separator.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Separator 的 div，也不要硬编码 token 颜色。
<div className="custom-separator">...</div>
```

推荐：

```tsx
<Separator />
```
