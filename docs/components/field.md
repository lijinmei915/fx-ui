---
category: Components
group: 通用
title: Field
subtitle: 表单字段结构
description: 表单字段的结构组件，用于组织 label、control、description、error 和字段组。
source: src/components/ui/field.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - muted-foreground
  - destructive
  - primary
  - background
  - border
status: complete
---

# Field 表单字段结构

Field 用于组织真实表单字段。它不是输入控件本身，而是字段结构：label、control、description、error、fieldset 和分隔线都放在这里统一管理。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装或硬编码样式实现。

AI 生成表单时，优先使用 Field 体系承载字段结构，再把 `Input`、`Textarea`、`Select`、`Checkbox`、`Switch` 等控件放入对应字段里。

## 来源 {#source}

Field 源码位于：

```txt
src/components/ui/field.tsx
```

上游来源：

```txt
shadcn/ui field
```

## 使用方式 {#usage}

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
```

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">邮箱</FieldLabel>
    <Input id="email" type="email" placeholder="name@example.com" />
    <FieldDescription>用于接收通知。</FieldDescription>
  </Field>
</FieldGroup>
```

## 组件总览 {#overview}

- 字段组：`FieldGroup`
- 单个字段：`Field`
- 字段标签：`FieldLabel` / `FieldTitle`
- 字段说明：`FieldDescription`
- 字段错误：`FieldError`
- 分组字段：`FieldSet` / `FieldLegend`
- 字段分隔：`FieldSeparator`
- 原生状态：`data-invalid`、`data-disabled`
- 布局方向：`orientation="vertical" | "horizontal" | "responsive"`

## 场景示例 {#examples}

### 标准文本字段

- 使用意图：最常见的表单字段结构。
- 规则：Label 通过 `htmlFor` 关联控件 `id`，辅助说明放在 `FieldDescription`。

```tsx
<Field>
  <FieldLabel htmlFor="name">姓名</FieldLabel>
  <Input id="name" placeholder="请输入姓名" />
  <FieldDescription>请填写真实姓名。</FieldDescription>
</Field>
```

### 校验失败字段

- 使用意图：提交校验失败后，向用户说明具体错误。
- 规则：`Field` 设置 `data-invalid`，控件设置 `aria-invalid`，错误文案放进 `FieldError`。

```tsx
<Field data-invalid>
  <FieldLabel htmlFor="email">邮箱</FieldLabel>
  <Input id="email" aria-invalid placeholder="请输入邮箱" />
  <FieldError>请输入有效邮箱。</FieldError>
</Field>
```

### 禁用字段

- 使用意图：字段不可编辑，同时降低标签和控件的可交互感。
- 规则：`Field` 设置 `data-disabled`，控件设置原生 `disabled`。

```tsx
<Field data-disabled>
  <FieldLabel htmlFor="readonly-name">姓名</FieldLabel>
  <Input id="readonly-name" disabled placeholder="不可编辑" />
</Field>
```

### 水平字段

- 使用意图：设置项、开关项等 label 与 control 横向排列的场景。
- 规则：使用 `orientation="horizontal"`，不要手写 flex 结构替代 Field。

```tsx
<Field orientation="horizontal">
  <Switch id="notify" />
  <FieldLabel htmlFor="notify">接收通知</FieldLabel>
</Field>
```

## API {#api}

Field 由多个 open-code 子组件组成。

| 组件 | 说明 | 关键属性 |
| --- | --- | --- |
| `FieldGroup` | 字段列表容器 | `className` |
| `Field` | 单个字段容器 | `orientation`、`data-invalid`、`data-disabled` |
| `FieldLabel` | 字段标签 | `htmlFor` |
| `FieldDescription` | 辅助说明 | 原生 `p` 属性 |
| `FieldError` | 错误文案 | `children`、`errors` |
| `FieldSet` | 一组相关字段 | 原生 `fieldset` 属性 |
| `FieldLegend` | 字段组标题 | `variant="legend" | "label"` |
| `FieldSeparator` | 字段组分隔线 | `children` |
| `FieldContent` | 横向字段中的文本内容容器 | `className` |
| `FieldTitle` | 非 label 型标题 | `className` |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="field-group"` | 字段组容器 |
| `data-slot="field"` | 单个字段容器，默认 `role="group"` |
| `data-slot="field-label"` | 字段标签或标题 |
| `data-slot="field-description"` | 字段辅助说明 |
| `data-slot="field-error"` | 字段错误文案，带 `role="alert"` |
| `data-slot="field-set"` | 原生 fieldset |
| `data-slot="field-legend"` | 原生 legend |
| `data-slot="field-separator"` | 字段组分隔线 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 字段标签、标题和主要文字 |
| `--muted-foreground` | 字段说明和分隔说明 |
| `--destructive` | 字段错误文案和 invalid 字段文字 |
| `--primary` | checked 字段卡片的强调色 |
| `--background` | 带内容分隔线的背景遮罩 |
| `--border` | 复合字段卡片边框 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 真实表单字段使用 `FieldGroup + Field + FieldLabel + 控件`，不要用普通 `div` 临时拼。
- 错误态必须同时有字段级 `data-invalid` 和控件级 `aria-invalid`。
- 禁用态必须同时有字段级 `data-disabled` 和控件级 `disabled`。
- 多个相关字段用 `FieldSet + FieldLegend`，不要用普通标题加一堆 div。
- `FieldError` 用于错误文案，不要用手写红色 `p`。
- `className` 只用于布局和外部间距，不覆盖 Field 的颜色、字号和状态样式。

## 正误示例 {#do-dont}

### 不要用 div 拼字段

不推荐：

```tsx
<div className="grid gap-2">
  <Label htmlFor="email">邮箱</Label>
  <Input id="email" />
</div>
```

推荐：

```tsx
<Field>
  <FieldLabel htmlFor="email">邮箱</FieldLabel>
  <Input id="email" />
</Field>
```

### 错误态不要只改颜色

不推荐：

```tsx
<p className="text-red-500">请输入有效邮箱。</p>
```

推荐：

```tsx
<Field data-invalid>
  <Input aria-invalid />
  <FieldError>请输入有效邮箱。</FieldError>
</Field>
```
