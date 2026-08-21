---
category: Components
group: 数据录入
title: RadioGroup
subtitle: 单选框
description: 用于一组选项中只能选择一个的场景。
source: src/components/ui/radio-group.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - primary-foreground
  - foreground-disabled
  - destructive
  - border
  - border-subtle
  - muted
  - input
  - ring
status: complete
---

# RadioGroup 单选框

用于一组选项中只能选择一个的场景，例如表单单选和设置项。表格单选列属于 Table 的“选择”组合能力。

源码来自 shadcn/ui，进入项目后保持 open-code；已按 DEC-057 补齐 12 / 14 / 16px 尺寸与 Figma 对齐的 hover、disabled 状态。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 RadioGroup 前必须先以 `src/components/ui/radio-group.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/radio-group.tsx
```

## 使用方式 {#usage}

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Field, FieldContent, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
```

```tsx
<FieldSet>
  <FieldLegend className="sr-only">选择默认工作台</FieldLegend>
  <RadioGroup value={value} onValueChange={setValue}>
    <FieldGroup>
      <Field orientation="horizontal">
        <RadioGroupItem id="crm" value="crm" size="default" />
        <FieldContent><FieldLabel htmlFor="crm">客户资料</FieldLabel></FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem id="orders" value="orders" size="default" />
        <FieldContent><FieldLabel htmlFor="orders">订单权限</FieldLabel></FieldContent>
      </Field>
    </FieldGroup>
  </RadioGroup>
</FieldSet>
```

## 组件总览 {#overview}

- 类型：form
- 语义 DOM：data-slot="radio-group"、data-slot="radio-group-item"、data-slot="radio-group-indicator"
- 原生/数据状态：hover、focus-visible、disabled、aria-invalid、data-checked
- 变体：无独立 variant prop
- 尺寸：sm（12px）、default（14px）、lg（16px）
- 导出项：RadioGroup、RadioGroupItem、RadioGroupItemSize、RadioGroupItemProps

## 尺寸与布局 {#sizes-layout}

| 尺寸 | 控件 | FieldLabel | 控件与标签间距 |
| --- | --- | --- | --- |
| `sm` | 12px | 12px / 18px | 4px |
| `default` | 14px | 14px / 20px | 4px |
| `lg` | 16px | 16px / 24px | 4px |

- 纵向组使用 8px 选项间距。
- 横向组使用 16px 列间距；换行后的行间距为 8px。
- 用 `FieldGroup orientation="horizontal"` 表达横向组布局；每个选项仍保留 `Field orientation="horizontal"` 的控件与标签组合。

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于一组选项里只能选一个的控件。
- 规则：表格单选列使用 RadioGroupItem，但在 Table 调试台的“选择”组合能力中验证，不在单选框调试台重复实现。

```tsx
<RadioGroup value={selectedId} onValueChange={setSelectedId}>
  <RadioGroupItem value={String(customer.id)} aria-label={`选择 ${customer.name}`} />
</RadioGroup>
```

### 不适合场景

- 不用 RadioGroup 表达多选，多个可独立勾选的选项应使用 Checkbox。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant 或状态。
- 不封装 Ant 风格 `options` 黑盒 API，也不新增 `Radio.Button`；按钮式互斥选择继续使用 ToggleGroup。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/radio-group.tsx`，不要凭空发明 API。

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="radio-group"` | 单选框根节点，承载分组布局和选择状态管理 |
| `data-slot="radio-group-item"` | 单个单选项根节点，承载交互态和选中态 |
| `data-slot="radio-group-indicator"` | 选中态指示圆点 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `focus-visible` | 键盘焦点态，必须保留可访问焦点环 |
| `hover` | 未选项悬停时显示主色描边，由真实鼠标交互触发 |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |
| `aria-invalid` | 校验失败语义，同时驱动错误态样式 |
| `data-checked` | 选中态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | 品牌强调色、选中态或主语义强调 |
| `--primary-foreground` | 主色背景上的文字和图标 |
| `--foreground-disabled` | 禁用态的文字和圆点 |
| `--destructive` | 危险、错误或不可逆操作语义 |
| `--border` | 边框、分隔线和描边结构 |
| `--border-subtle` | 禁用态的低对比边框 |
| `--muted` | 禁用态的中性填充 |
| `--input` | 表单控件边框、背景和 disabled 语义 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 表单单选使用 `RadioGroup / RadioGroupItem`；表格单选列由 Table 调试台的“选择”组合能力负责。
- 每个 `RadioGroupItem` 必须提供唯一 `value`，并用 `FieldLabel` 或 `aria-label` 说明含义。
- 表单组使用 `FieldSet + FieldLegend + FieldGroup + Field`；不需要可见组标题时将 `FieldLegend` 设为 `sr-only`，不要删除分组语义。表格单选列由一个 RadioGroup 管理所有行。
- `RadioGroupItem` 的 `size` 只能使用 `sm`、`default` 或 `lg`，并与 FieldLabel 字号联动。
- 禁用态使用源码支持的 `disabled`，不要靠 opacity 伪装。
- 校验失败用 `FieldSet data-invalid` 与 `RadioGroupItem aria-invalid` 组合；它是 Field 表单组合态，不在 RadioGroup 基础调试台单列。
- hover、focus-visible 和 data-checked 是原生交互态，应通过真实交互展示，不单列伪业务状态。
- 不封装 `options` 黑盒 API，不新增 Radio.Button；按钮式互斥选择使用 ToggleGroup。
- 使用 RadioGroup 前必须以 src/components/ui/radio-group.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

| Do | Don't |
| --- | --- |
| 表格单选列使用 `RadioGroupItem`。 | 在业务代码里手写 `input[type=radio]` 并覆盖样式。 |
| 使用 `FieldLabel` 或 `aria-label` 说明选项含义。 | 只展示无语义的圆点。 |
| 使用 `FieldGroup orientation` 组织纵向或横向布局。 | 在调用处覆盖圆点、边框或标签字号。 |
