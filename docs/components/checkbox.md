---
category: Components
group: 通用
title: Checkbox
subtitle: 多选框
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

# Checkbox 多选框

用于单个布尔选项或多选集合。

源码来自 shadcn/ui，进入项目后保持 open-code。当前 Checkbox 以 `shadcn-extended` 受治理：保留 Base UI 的 Checkbox 语义，在同一基础组件中补齐 sm / default / lg 尺寸、与标签联动的字级及 Figma 对齐的 hover、禁用状态，不拆成黑盒或业务组件。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

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
- 原生/数据状态：hover、focus-visible、disabled、aria-invalid、data-checked、data-indeterminate、indeterminate
- 变体：无独立 variant prop
- 尺寸：`sm`（12px 控件 + 12px / 18px 标签）、`default`（14px 控件 + 14px / 20px 标签）、`lg`（16px 控件 + 16px / 24px 标签）
- 导出项：Checkbox

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于单个布尔选项或多选集合。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Field orientation="horizontal">
    <Checkbox id="agree" size="default" />
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
| `data-indeterminate` | 半选态；与选中态使用相同的实心默认、hover、active 和禁用色阶 |
| `indeterminate` | 半选态；用于父级全选项表示子项只选中一部分 |

## 尺寸与布局 {#size-layout}

| 项目 | sm | default | lg |
| --- | --- | --- | --- |
| 控件 | 12px | 14px | 16px |
| 标签文字 | 12px / 18px | 14px / 20px | 16px / 24px |
| 控件与标签 | 4px | 4px | 4px |
| 对勾 / 半选横杠描边 | 约 1px | 约 1px | 约 1px |

- 横向复选组：选项之间 `16px`，内容宽度自适应，换行行距 `8px`。
- 纵向复选组：选项之间 `8px`。
- 继续用 `FieldGroup + Field` 组合，不新增 `Checkbox.Group`；横向组使用 `FieldGroup orientation="horizontal"`，纵向组使用 `orientation="vertical"`。
- 对勾和半选横杠是 Checkbox 内部图标例外：按 8 / 10 / 12px 实际图标尺寸分别映射 `stroke-width` 为 `3 / 2.4 / 2`，使可见描边保持约 1px；不影响全局 Tabler 图标基线。

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | 品牌强调色、选中态或主语义强调 |
| `--primary-foreground` | 主色背景上的文字和图标 |
| `--fx-primary-hover` | 已选和半选控件的 hover 实心填充 |
| `--fx-primary-active` | 已选和半选控件的 active 实心填充 |
| `--foreground` | 主要文字和图标 |
| `--foreground-disabled` | 禁用态文字和图标 |
| `--destructive` | 危险、错误或不可逆操作语义 |
| `--border` | 边框、分隔线和描边结构 |
| `--border-subtle` | 禁用控件边框 |
| `--input` | 表单控件边框、背景和 disabled 语义 |
| `--muted` | 禁用控件填充 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 真实表单字段优先放进 `FieldGroup + Field`，不要用普通 div 临时拼字段。
- 校验失败用字段级 `data-invalid` 和控件级 `aria-invalid`，不要手写红色边框；它是 Field 表单组合态，不在 Checkbox 基础调试台单列。
- 禁用态使用源码支持的 `disabled` / `data-disabled`，不要靠 opacity 伪装。
- 单个 Checkbox 必须有 FieldLabel/Label 关联；多组选项默认用 `FieldGroup + Field`，只有真实表单字段需要统一字段名、分组语义或整组校验时才加 `FieldSet + FieldLegend`。
- 复选组由调用处维护受控值；全选和半选状态从同一组子项值派生，不新增 `Checkbox.Group` 黑盒。
- 表格或资源列表的行选择归 Table 调试台的“选择”组合能力负责；Checkbox 只提供行与表头所需的基础勾选和半选语义。
- hover、focus-visible 由真实交互展示，不作为组件业务状态或调试台伪属性；未选中 hover 使用主色边框，已选和半选 hover / active 依次使用主色实心阶梯 `09 / 08 / 10`。
- 禁用和已选禁用使用中性填充、边框与图标色，不通过降低主色透明度伪装。
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
