---
category: Components
group: 业务组合
title: TimePicker
subtitle: 时间选择器
description: 公司组合组件，用于选择 HH:mm 时间点。
source: src/components/fx/time-picker.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - muted
  - muted-foreground
  - input
  - popover
  - border
  - ring
  - destructive
status: complete
---

# TimePicker 时间选择器

用于选择 `HH:mm` 时间点。它不是 Select 的变体，而是 fx 组合组件：由 `Input`、`Popover`、`Button` 等现有组件组合而成。

公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不硬编码颜色或手写状态样式。

AI 使用 TimePicker 前必须先以 `src/components/fx/time-picker.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/fx/time-picker.tsx
```

## 使用方式 {#usage}

```tsx
import { TimePicker } from "@/components/fx/time-picker"
```

```tsx
<TimePicker defaultValue="09:30" />
```

## 组件总览 {#overview}

- 类型：fx
- 语义 DOM：`data-slot="time-picker"`、`data-slot="time-picker-value"`、`data-slot="time-picker-clear"`、`data-slot="time-picker-list"`
- 原生/数据状态：hover、focus-visible、open、disabled、aria-invalid
- 尺寸：`xs`=24px、`sm`=28px（默认）、`md`=32px
- 呈现方式：`popover`（默认）/ `native`
- 导出项：TimePicker、TimePickerProps

## 场景示例 {#examples}

### 单个时间

```tsx
<TimePicker placeholder="请选择时间" />
```

### 时间范围

```tsx
<div className="flex items-center gap-2">
  <TimePicker placeholder="开始时间" />
  <span className="text-muted-foreground">至</span>
  <TimePicker placeholder="结束时间" />
</div>
```

### 字段错误

```tsx
<Field data-invalid>
  <FieldLabel>提醒时间</FieldLabel>
  <TimePicker aria-invalid />
  <FieldError>请选择时间</FieldError>
</Field>
```

## API {#api}

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value / defaultValue` | `string` | - | 受控 / 非受控的时间值，格式为 `HH:mm` |
| `onValueChange` | `(value: string) => void` | - | 时间变化回调 |
| `mode` | `"popover" \| "native"` | `"popover"` | 弹层时间列表或原生 time input |
| `step` | `15 \| 30 \| 60` | `30` | 分钟步进 |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | 触发器尺寸：24 / 28 / 32 |
| `clearable` | `boolean` | `false` | 有值时是否展示清除入口 |
| `disabled` | `boolean` | `false` | 禁用时间选择 |
| `aria-invalid` | `boolean` | `false` | 标记校验失败 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="time-picker"` | 时间选择器触发器 / 原生输入组合根节点 |
| `data-slot="time-picker-value"` | 弹层模式下展示当前时间或占位文本 |
| `data-slot="time-picker-clear"` | 清除当前时间值的入口 |
| `data-slot="time-picker-list"` | 弹层内的时间选项列表 |
| `aria-invalid` | 校验失败语义，同时驱动错误边框 |
| `disabled` | 禁用语义，阻止交互 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 已选时间文字 |
| `--muted` | 禁用 / 展开背景 |
| `--muted-foreground` | 次要图标与辅助文字 |
| `--input` | 控件边框 |
| `--popover` | 弹层背景 |
| `--border` | 弹层边界 |
| `--ring` | 聚焦 / 展开边框 |
| `--destructive` | 错误态边框和文案 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 时间选择用 `TimePicker`，不要把普通 `Select` 临时改造成时间控件。
- 范围选择用两个 `TimePicker` 组合，不把开始/结束时间塞进一个字符串值。
- 错误态用 `Field + aria-invalid + FieldError`。
- 尺寸用 `size`，步进用 `step`，不要在页面里覆盖高度、边框、圆角或时间列表。
- 使用 TimePicker 前必须以 `src/components/fx/time-picker.tsx` 为真实 API。

## 正误示例 {#do-dont}

不推荐：

```tsx
// 不要用 Select 硬拼时间选择器。
<Select>
  <SelectTrigger>
    <SelectValue placeholder="请选择时间" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="09:00">09:00</SelectItem>
  </SelectContent>
</Select>
```

推荐：

```tsx
<TimePicker defaultValue="09:00" step={30} />
```
