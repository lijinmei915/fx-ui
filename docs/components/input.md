---
category: Components
group: 通用
title: Input
subtitle: 输入框
description: 单行文本录入控件，用于表单字段、搜索框、内联编辑等场景。
source: src/components/ui/input.tsx
theme: theme/fx-theme.css
tokens:
  - input
  - background
  - foreground
  - border
  - ring
  - destructive
  - muted-foreground
  - radius
status: complete
---

# Input 输入框

Input 用于单行文本录入，适合表单字段、搜索框、内联编辑等场景。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装或硬编码样式实现。

AI 生成页面时应优先使用原生 input props、`disabled` 和 `aria-invalid` 表达状态，避免手写边框色、圆角或禁用样式。进入真实表单时，Input 不单独承担字段结构，字段结构由 `FieldGroup`、`Field`、`FieldLabel`、`FieldDescription` 和 `FieldError` 承载。

## 来源 {#source}

Input 源码位于：

```txt
src/components/ui/input.tsx
```

上游来源：

```txt
shadcn/ui input
```

## 使用方式 {#usage}

标准表单字段使用 Field 体系组织，并通过 `id` / `htmlFor` 建立可访问性关联。

```tsx
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
```

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="name">姓名</FieldLabel>
    <Input id="name" placeholder="请输入姓名" />
    <FieldDescription>请填写真实姓名。</FieldDescription>
  </Field>
</FieldGroup>
```

## 组件总览 {#overview}

- 根节点：`data-slot="input"`
- 原生交互状态：focus-visible、disabled、aria-invalid
- 原生属性：透传 `React.ComponentProps<"input">`，包括 `type`、`value`、`onChange`、`name`、`required`、`placeholder`
- Input 没有 `variant` 或 `size` prop；尺寸和视觉来自源码 class 与 token
- 字段结构：真实表单字段使用 Field 体系，Input 只负责输入控件本身

## 场景示例 {#examples}

AI 选择 Input 时按这个顺序判断：

1. 先判断是不是“真实表单字段”。如果是，用 `FieldGroup + Field + FieldLabel + Input`。
2. 再判断是否需要辅助文案或错误文案。说明用 `FieldDescription`，错误用 `FieldError`。
3. 再判断状态。禁用是 `data-disabled + disabled`，校验失败是 `data-invalid + aria-invalid`。
4. 最后才考虑布局宽度。`className` 可以放宽度和外部间距，不覆盖 Input 自身颜色、圆角、边框、内边距。

### 默认输入框

- 使用意图：最基础的单行文本录入，搭配 placeholder 提示输入内容。
- 规则：单独展示控件能力时可以直接用 Input；进入真实表单后放进 Field。

```tsx
<Input placeholder="请输入姓名" />
```

### 标准字段

- 使用意图：真实表单里的标准写法，承载 label、输入控件和辅助说明。
- 规则：使用 `FieldGroup + Field + FieldLabel`，不用 `div/grid` 临时拼字段结构。

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="name">姓名</FieldLabel>
    <Input id="name" placeholder="请输入姓名" />
    <FieldDescription>请填写真实姓名。</FieldDescription>
  </Field>
</FieldGroup>
```

### 禁用状态

- 使用意图：字段当前不可编辑，例如只读详情、依赖未满足。
- 规则：Field 标记 `data-disabled`，Input 使用 `disabled`，不要用样式假装禁用。

```tsx
<Field data-disabled>
  <FieldLabel htmlFor="readonly-name">姓名</FieldLabel>
  <Input id="readonly-name" disabled placeholder="不可编辑" />
</Field>
```

### 校验失败

- 使用意图：提交校验未通过时，提示用户当前字段有误。
- 规则：Field 标记 `data-invalid`，Input 使用 `aria-invalid`，并通过 `FieldError` 输出错误文案。

```tsx
<Field data-invalid>
  <FieldLabel htmlFor="email">邮箱</FieldLabel>
  <Input id="email" aria-invalid placeholder="请输入邮箱" />
  <FieldError>请输入有效邮箱。</FieldError>
</Field>
```

## API {#api}

Input 支持原生 input props，并保留 shadcn open-code 的基础视觉。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 原生 input 类型，例如 text / number / password / email | `string` | `text` |
| `disabled` | 禁用输入，触发禁用态样式 | `boolean` | `false` |
| `aria-invalid` | 标记当前值未通过校验，触发错误态样式 | `boolean` | `false` |
| `placeholder` | 占位提示文字 | `string` | - |
| `className` | 追加 class，主要用于布局、宽度或外部间距 | `string` | - |
| `...props` | 透传所有原生 input 属性 | `React.ComponentProps<"input">` | - |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="input"` | 输入框根节点，供样式选择器、测试和 AI 定位使用 |
| `data-slot="field"` | 字段容器，承载 label、control、description 和 error 的语义分组 |
| `data-slot="field-label"` | 字段标签，通常通过 `htmlFor` 与 Input 的 `id` 关联 |
| `data-slot="field-description"` | 字段辅助说明 |
| `data-slot="field-error"` | 字段错误文案，使用 `role="alert"` 向辅助技术宣布错误 |
| `data-invalid` | 字段级错误状态，设置在 `Field` 上 |
| `data-disabled` | 字段级禁用状态，设置在 `Field` 上 |
| `disabled` | 原生禁用属性，驱动禁用态样式并阻止交互 |
| `aria-invalid` | 校验失败态的语义标记，同时驱动错误态样式 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--input` | 输入框默认边框与禁用态背景 |
| `--background` | 输入框背景 |
| `--foreground` | 文件输入按钮文字等前景色 |
| `--border` | 基础边框语义，参与全局边框体系 |
| `--ring` | focus-visible 焦点环 |
| `--destructive` | aria-invalid 错误态边框和焦点环 |
| `--muted-foreground` | placeholder 文本 |
| `--radius` | 输入框圆角派生尺度 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 真实表单字段必须使用 `FieldGroup + Field + FieldLabel + Input`，并用 `id` / `htmlFor` 关联。
- 校验失败时 Field 设置 `data-invalid`，Input 设置 `aria-invalid`，错误文案放在 `FieldError`，不要手写红色边框 className。
- 不可编辑时 Field 设置 `data-disabled`，Input 设置 `disabled`，不要用 opacity 或 pointer-events 假装禁用。
- `className` 只用于布局、宽度或外部间距，不用于覆盖输入框自身颜色、圆角、边框和内边距。
- Input 没有 `variant` 或 `size` prop，不要发明这些 API。

## 正误示例 {#do-dont}

### 表单字段使用 Field

不推荐：

```tsx
<div className="custom-field">
  <Label htmlFor="name">姓名</Label>
  <Input />
</div>
```

推荐：

```tsx
<Field>
  <FieldLabel htmlFor="name">姓名</FieldLabel>
  <Input id="name" />
</Field>
```

### 错误态使用 aria-invalid

不推荐：

```tsx
<Input className="border-red-500" />
```

推荐：

```tsx
<Field data-invalid>
  <FieldLabel htmlFor="email">邮箱</FieldLabel>
  <Input id="email" aria-invalid />
  <FieldError>请输入有效邮箱。</FieldError>
</Field>
```

### 禁用态使用 disabled

不推荐：

```tsx
<Input className="opacity-50" />
```

推荐：

```tsx
<Field data-disabled>
  <Input disabled />
</Field>
```
