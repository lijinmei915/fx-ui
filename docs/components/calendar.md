---
category: Components
group: 通用
title: Calendar
subtitle: 日历
description: 用于日期选择和日期范围展示。
source: src/components/ui/calendar.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - primary-foreground
  - background
  - foreground
  - card
  - popover
  - muted
  - muted-foreground
  - border
  - ring
  - radius
status: complete
---

# Calendar 日历

用于日期选择和日期范围展示。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Calendar 前必须先以 `src/components/ui/calendar.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/calendar.tsx
```

## 使用方式 {#usage}

```tsx
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
```

```tsx
<Calendar mode="single" />
```

## 组件总览 {#overview}

- 类型：form
- 语义 DOM：data-slot="calendar"
- 本地化：默认使用 `zh-CN`，标题按紧凑的“2026年7月”展示，字号为 14px；需要其它语言时传入 `react-day-picker` 的 `locale`，沿用对应本地格式。
- 原生/数据状态：hover、today、disabled；today 使用主题色线框提示定位，选中时仍由选中态使用实心主题色
- 导航：上一年 / 上一月 / 下一月 / 下一年四个 16px 箭头；同侧单、双箭头间距 8px，并在 28px 标题轨道内垂直居中；不使用年月下拉
- 变体：无独立 variant prop
- 导出项：Calendar、CalendarDayButton

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于日期选择和日期范围展示。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Calendar mode="single" />
```

### 不适合场景

- 不用 Calendar 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/calendar.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="calendar"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 鼠标悬停反馈，来自源码状态样式 |
| `today` | 当前日期使用主题色线框；与选中态叠加时保留选中态的实心主题色 |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | 品牌强调色、选中态或主语义强调 |
| `--primary-foreground` | 主色背景上的文字和图标 |
| `--background` | 页面或控件的基础背景 |
| `--foreground` | 主要文字和图标 |
| `--card` | 卡片背景 |
| `--popover` | 浮层背景 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--border` | 边框、分隔线和描边结构 |
| `--ring` | focus-visible 焦点环 |
| `--radius` | 圆角派生尺度 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 真实表单字段优先放进 `FieldGroup + Field`，不要用普通 div 临时拼字段。
- 校验失败用字段级 `data-invalid` 和控件级 `aria-invalid`，不要手写红色边框。
- 禁用态使用源码支持的 `disabled` / `data-disabled`，不要靠 opacity 伪装。
- 日期按钮样式来自 buttonVariants，不要手写日期单元格颜色。
- 年月导航使用 Calendar 内建的单、双箭头，不在调用处自行拼接下拉或导航按钮。
- 使用 Calendar 前必须以 src/components/ui/calendar.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Calendar 的 div，也不要硬编码 token 颜色。
<div className="custom-calendar">...</div>
```

推荐：

```tsx
<Calendar mode="single" />
```
