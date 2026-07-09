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

AI 生成页面时应优先使用原生 input props、`disabled` 和 `aria-invalid` 表达状态，避免手写边框色、圆角或禁用样式。前后缀、单位、搜索按钮和范围选择等固定组合使用 `InputGroup`、`InputAddon`、`InputAffix`、`InputAction`，不要在调用处绝对定位图标或覆盖内边距。进入真实表单时，Input 不单独承担字段结构，字段结构由 `FieldGroup`、`Field`、`FieldLabel`、`FieldDescription` 和 `FieldError` 承载。

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
import {
  Input,
  InputAction,
  InputAddon,
  InputAffix,
  InputGroup,
} from "@/components/ui/input"
import { SearchIcon } from "@/lib/icons"
import {
  Field,
  FieldDescription,
  FieldError,
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

## 调试台规则 {#playground}

AI 选择 Input 时按这个顺序判断：

1. 先判断是不是“真实表单字段”。如果是，用 `FieldGroup + Field + FieldLabel + Input`。
2. 再判断是否需要前后缀、搜索图标、范围选择或单位。需要就用 `InputGroup` 组合，不手写定位。
3. 再判断是否需要辅助文案或错误文案。说明用 `FieldDescription`，错误用 `FieldError`。
4. 再判断状态。禁用是 `data-disabled + disabled`，校验失败是 `data-invalid + aria-invalid`。
5. 最后才考虑布局宽度。`className` 可以放宽度和外部间距，不覆盖 Input 自身颜色、圆角、边框、内边距。

Input 调试台按“先定能力，再定组合，再看状态和尺寸”的顺序拆分：

1. **能力**：基础、搜索。
2. **组合方式**：无、图标、文字、筛选。
3. **位置**：左、右；仅在图标或文字组合时参与。
4. **交互状态**：默认、悬停、聚焦、输入中、回填、禁用、回填并禁用、报错。
5. **尺寸**：超小24、默认28、中32。

新增 Input 能力时优先判断是否属于“基础”或“搜索”；新增组合时先归入“组合方式”，不要重新平铺成场景列表。页面只保留调试台作为实时示例入口，不再额外维护“组件总览”或“场景示例”重复区块。

## API {#api}

Input 支持原生 input props，并保留 shadcn open-code 的基础视觉。组合型能力由同文件导出的子组件承载。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `size` | 输入框尺寸，`xs`=24px、`sm`=28px（默认）、`md`=32px | `"xs" \| "sm" \| "md"` | `sm` |
| `type` | 原生 input 类型，例如 text / number / password / email | `string` | `text` |
| `disabled` | 禁用输入，触发禁用态样式 | `boolean` | `false` |
| `aria-invalid` | 标记当前值未通过校验，触发错误态样式 | `boolean` | `false` |
| `placeholder` | 占位提示文字 | `string` | - |
| `className` | 追加 class，主要用于布局、宽度或外部间距 | `string` | - |
| `InputGroup` | 输入组合容器，统一持有边框、焦点、禁用和错误态 | 组件 | - |
| `InputAddon` | 前后置固定标签块，例如 `http://`、`PX`、`全部` | 组件 | `side="start"` |
| `InputAffix` | 轻量前后缀内容，例如图标、`%`、清除提示 | 组件 | `side="end"` |
| `InputAction` | 输入框内动作按钮，例如搜索或清除 | `button` | `type="button"` |
| `...props` | 透传所有原生 input 属性，原生 `size` 由组件尺寸接管 | `Omit<React.ComponentProps<"input">, "size">` | - |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="input"` | 输入框根节点，供样式选择器、测试和 AI 定位使用 |
| `data-slot="input-group"` | 输入组合容器，统一持有边框、焦点、禁用和错误态 |
| `data-slot="input-addon"` | 前后置固定标签块，带分隔线 |
| `data-slot="input-affix"` | 轻量前后缀区域，常用于图标或单位 |
| `data-slot="input-action"` | 输入框内动作按钮，必须提供 `aria-label` |
| `data-state="hover|focus"` | 文档调试台用于展示悬停 / 聚焦视觉态，不作为业务状态来源 |
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
| `--ring` | focus-visible / focus-within 聚焦边框 |
| `--destructive` | aria-invalid 错误态边框 |
| `--muted-foreground` | placeholder 文本 |
| `--radius` | 输入框圆角派生尺度 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 真实表单字段必须使用 `FieldGroup + Field + FieldLabel + Input`，并用 `id` / `htmlFor` 关联。
- 前后缀、单位、搜索按钮、范围选择必须使用 `InputGroup` 组合，不要绝对定位图标或覆盖 Input 内边距。
- 校验失败时 Field 设置 `data-invalid`，Input 设置 `aria-invalid`，错误文案放在 `FieldError`，不要手写红色边框 className。
- 不可编辑时 Field 设置 `data-disabled`，Input 设置 `disabled`，不要用 opacity 或 pointer-events 假装禁用。
- `className` 只用于布局、宽度或外部间距，不用于覆盖输入框自身颜色、圆角、边框和内边距。
- Input 没有 `variant` prop，不要发明视觉类型；尺寸只使用 `size="md|sm|xs"`。

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
