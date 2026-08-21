---
category: Components
group: 通用
title: Switch
subtitle: 开关
description: 用于立即生效的布尔设置。
source: src/components/ui/switch.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - fx-primary-disabled
  - primary-foreground
  - background
  - surface-disabled
  - foreground-disabled
  - foreground
  - destructive
  - border
  - input
  - ring
status: complete
---

# Switch 开关

用于立即生效的布尔设置，支持四档固定尺寸、默认 / 文字 / 图标内容、禁用和加载状态。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Switch 前必须先以 `src/components/ui/switch.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/switch.tsx
```

## 使用方式 {#usage}

```tsx
import { Switch } from "@/components/ui/switch"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
```

```tsx
<Field orientation="horizontal">
  <Switch id="notify" />
  <FieldContent>
    <FieldLabel htmlFor="notify">接收通知</FieldLabel>
  </FieldContent>
</Field>
```

## 组件总览 {#overview}

- 类型：form
- 语义 DOM：data-slot="switch"、data-slot="switch-thumb"
- 原生/数据状态：focus-visible、disabled、aria-invalid、aria-busy、data-checked、data-unchecked
- 变体：无独立 variant prop
- 尺寸：micro、mini、small、medium；默认 small（22px）
- 导出项：Switch、SwitchProps

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于立即生效的布尔设置。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Field orientation="horizontal">
  <Switch id="notify" />
  <FieldContent>
    <FieldLabel htmlFor="notify">接收通知</FieldLabel>
  </FieldContent>
</Field>
```

### 不适合场景

- 不用 Switch 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 轨道内容只用于极短文字或图标，不放长句。

## API {#api}

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `checked / defaultChecked` | `boolean` | `false` | 受控 / 非受控状态 |
| `onCheckedChange` | `(checked: boolean) => void` | - | 状态变化回调 |
| `size` | `"micro" \| "mini" \| "small" \| "medium"` | `"small"` | 固定高度分别为 12 / 16 / 22 / 32px |
| `loading` | `boolean` | `false` | 异步处理中，设置 `aria-busy` 并阻止重复操作 |
| `checkedChildren` | `ReactNode` | - | 开启时轨道内容 |
| `unCheckedChildren` | `ReactNode` | - | 关闭时轨道内容 |
| `disabled` | `boolean` | `false` | 禁用 |


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="switch"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="switch-thumb"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="switch-content"` | 可选的开 / 关态轨道内容 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `focus-visible` | 键盘焦点态，必须保留可访问焦点环 |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |
| `aria-invalid` | 校验失败语义，同时驱动错误态样式 |
| `data-checked` | 选中态 |
| `data-unchecked` | 未选中态 |
| `aria-busy` | 加载态，阻止重复操作 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | 品牌强调色、选中态或主语义强调 |
| `--fx-primary-disabled` | 加载且已开启时的低强度主色 |
| `--primary-foreground` | 主色背景上的文字和图标 |
| `--background` | 页面或控件的基础背景 |
| `--surface-disabled` | 禁用轨道和滑块表面 |
| `--foreground-disabled` | 禁用态轨道内容 |
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
- Switch 用于立即生效的设置，不用于需要提交保存的表单布尔输入。
- 异步切换使用 `loading`，不只显示 Spinner 却保留交互。
- 开关态轨道内容使用 `checkedChildren / unCheckedChildren`，仅放短文字或图标。
- 内容类型由 `checkedChildren / unCheckedChildren` 组合：不传为默认型，传短文字为文字型，传项目图标为图标型；micro 不使用图标型。
- 使用 Switch 前必须以 src/components/ui/switch.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Switch 的 div，也不要硬编码 token 颜色。
<div className="custom-switch">...</div>
```

推荐：

```tsx
<Field orientation="horizontal">
  <Switch id="notify" />
  <FieldContent>
    <FieldLabel htmlFor="notify">接收通知</FieldLabel>
  </FieldContent>
</Field>
```
