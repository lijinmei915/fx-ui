---
category: Components
group: 通用
title: Label
subtitle: 标签
description: 为表单控件提供可访问名称。
source: src/components/ui/label.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - background
status: complete
---

# Label 标签

为表单控件提供可访问名称。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Label 前必须先以 `src/components/ui/label.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/label.tsx
```

## 使用方式 {#usage}

```tsx
import { Label } from "@/components/ui/label"
```

```tsx
<Field>
  <FieldLabel htmlFor="email">邮箱</FieldLabel>
  <Input id="email" />
</Field>
```

## 组件总览 {#overview}

- 类型：form
- 语义 DOM：data-slot="label"
- 原生/数据状态：disabled
- 变体：无独立 variant prop
- 导出项：Label

## 场景示例 {#examples}

### 推荐场景

- 使用意图：为表单控件提供可访问名称。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Field>
  <FieldLabel htmlFor="email">邮箱</FieldLabel>
  <Input id="email" />
</Field>
```

### 不适合场景

- 不用 Label 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/label.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="label"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |

## 键盘与焦点 {#keyboard-focus}

Label 是原生 `label`，本身不进入 tab 顺序。它通过 `htmlFor` 将点击和辅助技术名称关联到真实控件；控件的键盘操作与焦点环由对应 Input、Select、Checkbox 或其他表单组件负责。

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--background` | 页面或控件的基础背景 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 真实表单字段优先放进 `FieldGroup + Field`，不要用普通 div 临时拼字段。
- 校验失败用字段级 `data-invalid` 和控件级 `aria-invalid`，不要手写红色边框。
- 禁用态使用源码支持的 `disabled` / `data-disabled`，不要靠 opacity 伪装。
- 使用 Label 前必须以 src/components/ui/label.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Label 的 div，也不要硬编码 token 颜色。
<div className="custom-label">...</div>
```

推荐：

```tsx
<Field>
  <FieldLabel htmlFor="email">邮箱</FieldLabel>
  <Input id="email" />
</Field>
```
