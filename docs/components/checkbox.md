---
category: Components
group: 通用
title: Checkbox
subtitle: 复选框
description: 用于单个布尔选项或多选集合。
source: src/components/ui/checkbox.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - primary-foreground
  - foreground
  - destructive
  - border
  - input
  - ring
status: complete
---

# Checkbox 复选框

用于单个布尔选项或多选集合。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Checkbox 前必须先以 `src/components/ui/checkbox.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/checkbox.tsx
```

## 使用方式 {#usage}

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field"
```

```tsx
<FieldGroup>
  <Field orientation="horizontal">
    <Checkbox id="agree" />
    <FieldContent>
      <FieldLabel htmlFor="agree">我已阅读并同意</FieldLabel>
    </FieldContent>
  </Field>
</FieldGroup>
```

## 组件总览 {#overview}

- 类型：form
- 语义 DOM：data-slot="checkbox"、data-slot="checkbox-indicator"
- 原生/数据状态：focus-visible、disabled、aria-invalid、data-checked
- 变体：无独立 variant prop
- 导出项：Checkbox

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于单个布尔选项或多选集合。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Field orientation="horizontal">
  <Checkbox id="agree" />
  <FieldContent>
    <FieldLabel htmlFor="agree">我已阅读并同意</FieldLabel>
  </FieldContent>
</Field>
```

### 不适合场景

- 不用 Checkbox 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/checkbox.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="checkbox"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="checkbox-indicator"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `focus-visible` | 键盘焦点态，必须保留可访问焦点环 |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |
| `aria-invalid` | 校验失败语义，同时驱动错误态样式 |
| `data-checked` | 选中态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | 品牌强调色、选中态或主语义强调 |
| `--primary-foreground` | 主色背景上的文字和图标 |
| `--foreground` | 主要文字和图标 |
| `--destructive` | 危险、错误或不可逆操作语义 |
| `--border` | 边框、分隔线和描边结构 |
| `--input` | 表单控件边框、背景和 disabled 语义 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 真实表单字段优先放进 `FieldGroup + Field`，不要用普通 div 临时拼字段。
- 校验失败用字段级 `data-invalid` 和控件级 `aria-invalid`，不要手写红色边框。
- 禁用态使用源码支持的 `disabled` / `data-disabled`，不要靠 opacity 伪装。
- 单个 Checkbox 必须有 FieldLabel/Label 关联，多组选项用 FieldSet。
- 使用 Checkbox 前必须以 src/components/ui/checkbox.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Checkbox 的 div，也不要硬编码 token 颜色。
<div className="custom-checkbox">...</div>
```

推荐：

```tsx
<Field orientation="horizontal">
  <Checkbox id="agree" />
  <FieldContent>
    <FieldLabel htmlFor="agree">我已阅读并同意</FieldLabel>
  </FieldContent>
</Field>
```
