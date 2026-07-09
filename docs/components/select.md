---
category: Components
group: 通用
title: Select
subtitle: 选择器
description: 用于从一组选项中选择一个值。
source: src/components/ui/select.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - popover
  - popover-foreground
  - muted
  - muted-foreground
  - accent
  - accent-foreground
  - destructive
  - border
  - input
  - ring
  - radius
status: complete
---

# Select 选择器

用于从一组选项中选择一个值。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Select 前必须先以 `src/components/ui/select.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/select.tsx
```

## 使用方式 {#usage}

```tsx
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
```

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="请选择状态" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>状态</SelectLabel>
      <SelectItem value="paid">已支付</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## 组件总览 {#overview}

- 类型：form
- 语义 DOM：data-slot="select-group"、data-slot="select-value"、data-slot="select-trigger"、data-slot="select-content"、data-slot="select-label"、data-slot="select-item"、data-slot="select-separator"、data-slot="select-scroll-up-button"、data-slot="select-scroll-down-button"
- 原生/数据状态：hover、focus-visible、disabled、aria-invalid、data-open、data-closed
- 变体：无独立 variant prop
- 尺寸：`xs`=24px、`sm`=28px（默认）、`md`=32px
- 导出项：Select、SelectContent、SelectGroup、SelectItem、SelectLabel、SelectScrollDownButton、SelectScrollUpButton、SelectSeparator、SelectTrigger、SelectValue

## 场景示例 {#examples}

### 基础选择

- 使用意图：用于从一组选项中选择一个值。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="请选择状态" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>状态</SelectLabel>
      <SelectItem value="paid">已支付</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### 筛选选择

```tsx
<Select>
  <SelectTrigger size="xs">
    <SelectValue placeholder="筛选状态" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">进行中</SelectItem>
    <SelectItem value="done">已完成</SelectItem>
  </SelectContent>
</Select>
```

### 不适合场景

- 不用 Select 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/select.tsx`，不要凭空发明 API。

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value / defaultValue` | `string` | - | 受控 / 非受控的当前选中值 |
| `onValueChange` | `(value: string) => void` | - | 选中值变化时的回调 |
| `disabled` | `boolean` | `false` | 禁用整个选择器 |
| `size`（SelectTrigger） | `"xs" \| "sm" \| "md"` | `"sm"` | 触发器尺寸：24 / 28 / 32 |
| `value`（SelectItem） | `string` | - | 选项取值，需要在选项集合内唯一 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="select-group"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-value"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-trigger"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-label"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-item"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-separator"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-scroll-up-button"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-scroll-down-button"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 鼠标悬停反馈，来自源码状态样式 |
| `focus-visible` | 键盘焦点态，以 1px 边框变化反馈，不加外扩 focus ring |
| `disabled` | 禁用态，阻止交互并使用禁用语义色 |
| `aria-invalid` | 校验失败语义，以 1px 错误边框反馈 |
| `data-open` | 浮层或折叠内容打开态 |
| `data-closed` | 浮层或折叠内容关闭态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--popover` | 浮层背景 |
| `--popover-foreground` | 浮层文字和图标 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--accent` | 菜单项 hover/focus 背景 |
| `--accent-foreground` | 菜单项 hover/focus 文字 |
| `--destructive` | 危险、错误或不可逆操作语义 |
| `--border` | 边框、分隔线和描边结构 |
| `--input` | 表单控件边框、背景和 disabled 语义 |
| `--ring` | focus-visible 焦点环 |
| `--radius` | 圆角派生尺度 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 真实表单字段优先放进 `FieldGroup + Field`，不要用普通 div 临时拼字段。
- 校验失败用字段级 `data-invalid` 和控件级 `aria-invalid`，不要手写红色边框。
- 禁用态使用源码支持的 `disabled` / `data-disabled`，不要靠 opacity 伪装。
- `SelectItem` 放在 `SelectContent` 内，选项多时用 `SelectGroup + SelectLabel`。
- 未选择态用 `SelectValue` 的 placeholder，不写空字符串选项。
- 尺寸只用 `SelectTrigger size`：`xs` 24px、`sm` 28px（默认）、`md` 32px。
- 校验失败时在 `SelectTrigger` 上设置 `aria-invalid`，错误文案放字段组件。
- 使用 Select 前必须以 src/components/ui/select.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Select 的 div，也不要硬编码 token 颜色。
<div className="custom-select">...</div>
```

推荐：

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="请选择状态" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>状态</SelectLabel>
      <SelectItem value="paid">已支付</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```
