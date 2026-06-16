---
category: Components
group: 通用
title: Toggle
subtitle: 切换按钮
description: 用于切换单个 pressed/on 状态。
source: src/components/ui/toggle.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - muted
  - destructive
  - border
  - input
  - ring
  - radius
status: complete
---

# Toggle 切换按钮

用于切换单个 pressed/on 状态。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Toggle 前必须先以 `src/components/ui/toggle.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/toggle.tsx
```

## 使用方式 {#usage}

```tsx
import { Toggle, toggleVariants } from "@/components/ui/toggle"
```

```tsx
<Toggle aria-label="加粗">B</Toggle>
```

## 组件总览 {#overview}

- 类型：action
- 语义 DOM：data-slot="toggle"
- 原生/数据状态：hover、focus-visible、disabled、aria-invalid
- 变体：default、outline
- 导出项：Toggle、toggleVariants

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于切换单个 pressed/on 状态。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Toggle aria-label="加粗">B</Toggle>
```

### 不适合场景

- 不用 Toggle 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/toggle.tsx`，不要凭空发明 API。


| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `variant` | 源码存在的视觉/语义变体 | `default` \| `outline` |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="toggle"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 鼠标悬停反馈，来自源码状态样式 |
| `focus-visible` | 键盘焦点态，必须保留可访问焦点环 |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |
| `aria-invalid` | 校验失败语义，同时驱动错误态样式 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--destructive` | 危险、错误或不可逆操作语义 |
| `--border` | 边框、分隔线和描边结构 |
| `--input` | 表单控件边框、背景和 disabled 语义 |
| `--ring` | focus-visible 焦点环 |
| `--radius` | 圆角派生尺度 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 动作组件表达可触发行为，状态或分类展示不要用动作组件伪装。
- 少量互斥/多选项优先使用 ToggleGroup，不要手写一排 Button 管 active。
- 使用 Toggle 前必须以 src/components/ui/toggle.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Toggle 的 div，也不要硬编码 token 颜色。
<div className="custom-toggle">...</div>
```

推荐：

```tsx
<Toggle aria-label="加粗">B</Toggle>
```
