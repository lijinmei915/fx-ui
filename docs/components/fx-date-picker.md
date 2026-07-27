---
category: Components
group: 业务组合
title: DatePicker
subtitle: 日期选择器
description: 公司组合组件，用于从日历中选择单个日期或日期范围。
source: src/components/fx/date-picker.tsx
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

# DatePicker 日期选择器

用于从日历中选择单个日期或日期范围。它是 fx 组合组件：由 `Popover` 和 `Calendar` 组成，视觉上像输入控件，但不向基础 `Input` 增加日期或日历图标的业务语义。

## 来源 {#source}

```txt
src/components/fx/date-picker.tsx
```

## 使用方式 {#usage}

```tsx
import { DatePicker } from "@/components/fx/date-picker"
```

```tsx
<DatePicker defaultValue={new Date(2026, 6, 15)} clearable />
```

## 组件总览 {#overview}

- 类型：fx
- 选择模式：单日期；`range` 单触发器范围选择
- 原生/数据状态：hover、focus-visible、open、disabled、aria-invalid
- 尺寸：`xs`=24px、`sm`=28px（默认）、`md`=32px
- 导出项：DatePicker、DatePickerProps、DatePickerRangeValue

## API {#api}

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `range` | `boolean` | `false` | 使用单触发器、单弹层选择开始和结束日期 |
| `value / defaultValue` | `Date \| DateRange` | - | 单日期使用 `Date`；范围模式使用结构化 `DateRange` |
| `onValueChange` | `(value: Date \| DateRange \| undefined) => void` | - | 根据 `range` 返回单日期或日期范围 |
| `placeholder` | `string` | `"请选择日期"` | 未选择日期时的提示 |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | 触发器尺寸：24 / 28 / 32 |
| `clearable` | `boolean` | `false` | 有值时展示清除入口 |
| `disabled` | `boolean` | `false` | 禁用日期选择 |
| `aria-invalid` | `boolean` | `false` | 标记校验失败 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="date-picker"` | 日期选择器控件根节点 |
| `data-slot="date-picker-trigger"` | 打开日历的日期触发器 |
| `data-slot="date-picker-value"` | 已选日期或占位文本 |
| `data-slot="date-picker-clear"` | 清除当前日期的入口 |
| `data-slot="calendar"` | Popover 内复用的日历根节点 |
| `aria-invalid` | 校验失败语义，同时驱动错误边框 |
| `disabled` | 禁用语义，阻止交互 |

## AI Rules {#ai-rules}

- 选择日期使用 `DatePicker`，不要给基础 `Input` 临时加日历图标或日期 prop。
- 日期范围使用一个 `DatePicker range`，开始和结束日期使用结构化 `DateRange`。
- 错误态用 `Field + aria-invalid + FieldError`。
- 尺寸用 `size`，不要在页面里覆盖高度、边框、圆角或弹层样式。
