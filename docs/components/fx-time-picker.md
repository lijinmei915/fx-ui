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
- 语义 DOM：`data-slot="time-picker"`、`data-slot="time-picker-value"`、`data-slot="time-picker-clear"`、`data-slot="time-picker-list"`、`data-slot="time-picker-wheel"`
- 原生/数据状态：hover、focus-visible、open、disabled、aria-invalid
- 尺寸：`xs`=24px、`sm`=28px（默认）、`md`=32px
- 呈现方式：`popover`（默认）/ `native`
- 弹层选择形式：`list`（默认）/ `wheel`
- 时间格式：`HH:mm`（默认）/ `HH:mm:ss`
- 选择范围：单时间（默认）/ `range` 单触发器范围选择
- 导出项：TimePicker、TimePickerProps、TimePickerRangeValue

## 场景示例 {#examples}

### 单个时间

```tsx
<TimePicker placeholder="请选择时间" />
```

### 时间范围

```tsx
<TimePicker
  range
  defaultValue={{ start: "09:30", end: "18:00" }}
/>
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
| `range` | `boolean` | `false` | 使用单触发器、单弹层选择开始和结束时间 |
| `value / defaultValue` | `string \| { start?: string; end?: string }` | - | 单时间传字符串；`range` 模式传结构化范围值 |
| `onValueChange` | `(value: string \| TimePickerRangeValue) => void` | - | 根据 `range` 判别返回单时间或范围值 |
| `mode` | `"popover" \| "native"` | `"popover"` | 弹层时间列表或原生 time input |
| `picker` | `"list" \| "wheel"` | `"list"` | 弹层内使用时间列表或滚轮选择 |
| `format` | `"HH:mm" \| "HH:mm:ss"` | `"HH:mm"` | 时间显示格式 |
| `step` | `15 \| 30 \| 60` | `30` | 分钟步进 |
| `minuteStep` | `1 \| 5 \| 10 \| 15 \| 30` | `1` | 滚轮模式的分钟步进 |
| `secondStep` | `1 \| 5 \| 10 \| 15 \| 30` | `1` | 滚轮模式的秒步进 |
| `needConfirm` | `boolean` | `true` | 滚轮模式是否需要确定 / 取消 |
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
| `data-slot="time-picker-wheel"` | 滚轮模式弹层内的时分秒选择器 |
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
- 范围选择用一个 `TimePicker range`，开始和结束时间使用结构化对象值，不拼接字符串。
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

<TimePicker picker="wheel" format="HH:mm:ss" defaultValue="17:10:33" />
```
