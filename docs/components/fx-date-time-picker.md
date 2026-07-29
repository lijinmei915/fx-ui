---
category: Components
group: 业务组合
title: DateTimePicker
subtitle: 日期时间选择器
description: 公司组合组件，用于在一个弹层中选择单个日期时间或日期时间范围。
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

# DateTimePicker 日期时间选择器

用于在一个触发器和一个弹层中完成日期与时间选择。它是 fx 组合组件，复用 `Calendar`、`Popover`、`TimeWheel`、`Button` 与 `Separator`，不向基础 `Input` 添加日期时间业务语义。

## 来源 {#source}

```txt
src/components/fx/time-picker.tsx
```

## 使用方式 {#usage}

```tsx
import { DateTimePicker } from "@/components/fx/time-picker"
```

```tsx
<DateTimePicker defaultValue={new Date(2026, 6, 15, 9, 30)} clearable />
```

## 组件总览 {#overview}

- 类型：fx
- 选择模式：单个日期时间；`range` 单触发器范围选择
- 日历导航：上一年 / 上一月 / 下一月 / 下一年箭头，可直接跨年跳转（当前年前后各 100 年）
- 时间格式：`HH:mm:ss`（默认）；`HH:mm`
- 弹层布局：桌面端时间滚轮面板与 Calendar 等高，滚轮内容独立滚动
- 原生/数据状态：default、hover、focus-visible、open、disabled、aria-invalid
- 尺寸：`xs`=24px、`sm`=28px（默认）、`md`=32px
- 导出项：DateTimePicker、DateTimePickerProps、DateTimePickerRangeValue

## API {#api}

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `range` | `boolean` | `false` | 使用一个触发器和一个弹层分两步选择起止日期时间：先确认开始，再确认结束 |
| `value / defaultValue` | `Date \| DateRange` | - | 单值使用带时间的 `Date`；范围模式使用 `DateRange` |
| `onValueChange` | `(value: Date \| DateRange \| undefined) => void` | - | 选择日期或时间时即时返回当前完整值；点击取消会恢复打开前的值 |
| `format` | `"HH:mm" \| "HH:mm:ss"` | `"HH:mm:ss"` | 时间滚轮与触发器的显示精度 |
| `minuteStep / secondStep` | `1 \| 5 \| 10 \| 15 \| 30` | `1` | 分钟与秒滚轮步进 |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | 触发器尺寸：24 / 28 / 32 |
| `clearable` | `boolean` | `false` | 有值时在悬停或聚焦控件后展示清除入口 |
| `variant` | `"outlined" \| "borderless"` | `"outlined"` | 控件外观变体 |
| `open / onOpenChange` | `boolean` / `(open: boolean) => void` | - | 受控弹层状态 |
| `showNow` | `boolean` | `false` | 提供“此刻”快捷入口 |
| `minDate / maxDate` | `Date` | - | 限制可选择的日期范围 |
| `disabledDate` | `(date: Date) => boolean` | - | 按业务规则禁用日期 |
| `disabled` | `boolean` | `false` | 禁止打开弹层或修改值 |
| `aria-invalid` | `boolean` | `false` | 标记字段校验失败 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="date-time-picker"` | 日期时间选择器控件根节点 |
| `data-slot="date-time-picker-trigger"` | 打开统一弹层的触发器 |
| `data-slot="date-time-picker-value"` | 已选日期时间或占位文本 |
| `data-slot="date-time-picker-range-start"` | 范围模式的开始日期时间值区，可点击切换当前编辑侧 |
| `data-slot="date-time-picker-range-end"` | 范围模式的结束日期时间值区，可点击切换当前编辑侧 |
| `data-slot="date-time-picker-clear"` | 清除当前值的入口 |
| `data-slot="date-time-picker-content"` | 包含选择面板与确认操作的完整弹层内容 |
| `data-slot="date-time-picker-panel"` | Calendar 与时间滚轮共用的弹层面板 |
| `data-slot="date-time-picker-time-panel"` | 与 Calendar 同高的时间滚轮面板 |
| `data-slot="calendar"` | 弹层内复用的 Calendar 根节点 |
| `aria-invalid` | 校验失败语义，同时驱动错误边框 |
| `disabled` | 禁用语义，阻止交互 |

## AI Rules {#ai-rules}

- 需要在一个弹层内选择日期和时间时使用 `DateTimePicker`，不要并排 `DatePicker` 与 `TimePicker` 后手工拼接值。
- 范围模式使用一个 `DateTimePicker range` 和结构化 `DateRange`，按“开始确认 → 结束确认”两步完成。
- 错误态使用 `Field + aria-invalid + FieldError`。
- 尺寸、格式与步进分别使用 `size`、`format`、`minuteStep` / `secondStep`，不要在调用处覆盖外观。
