---
category: Components
group: 通用
title: Tabs
subtitle: 标签页
description: 在同一页面区域内切换互斥内容面板。
source: src/components/ui/tabs.tsx
theme: theme/fx-theme.css
tokens:
  - background
  - foreground
  - foreground-disabled
  - muted
  - muted-hover
  - muted-foreground
  - border
  - border-subtle
  - input
  - ring
status: complete
---

# Tabs 标签页

在同一页面区域内切换互斥内容面板。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Tabs 前必须先以 `src/components/ui/tabs.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/tabs.tsx
```

## 使用方式 {#usage}

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from "@/components/ui/tabs"
```

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">概览</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">内容</TabsContent>
</Tabs>
```

## 组件总览 {#overview}

- 类型：navigation
- 语义 DOM：data-slot="tabs"、data-slot="tabs-list"、data-slot="tabs-trigger"、data-slot="tabs-content"
- 原生/数据状态：hover、active、focus-visible、disabled、data-active、data-orientation
- 变体：`TabsList variant="default | line"`
- 尺寸：`TabsList size="sm | md | lg"`，默认 `md`
- 方向：`Tabs orientation="horizontal | vertical"`，方向键漫游由 Base UI 管理
- 激活：`TabsList activateOnFocus` 可让方向键焦点同步切换面板；默认仍由 Enter / Space 确认
- 导出项：Tabs、TabsList、TabsTrigger、TabsContent、tabsListVariants

## 场景示例 {#examples}

### 推荐场景

- 使用意图：在同一页面区域内切换互斥内容面板。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">概览</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">内容</TabsContent>
</Tabs>
```

### 不适合场景

- 不用 Tabs 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。
- 不用 Button 列表模拟 Tabs，也不手写方向键、选中态和面板关联。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/tabs.tsx`，不要凭空发明 API。


| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `Tabs.value / defaultValue / onValueChange` | Base UI Root props | — | 受控或非受控激活值 |
| `Tabs.orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | 布局方向和对应方向键逻辑 |
| `TabsList.variant` | `"default" \| "line"` | `"default"` | 分段式表面或轻量指示线 |
| `TabsList.size` | `"sm" \| "md" \| "lg"` | `"md"` | 标签栏高度、触发器字号与内边距 |
| `TabsList.activateOnFocus` | `boolean` | `false` | 方向键焦点移动时是否同步激活面板 |
| `TabsList.loopFocus` | `boolean` | `true` | 键盘漫游是否首尾循环 |
| `TabsTrigger.value / disabled` | `string / boolean` | — | 触发器值和禁用语义 |
| `TabsContent.value` | `string` | — | 与 Trigger 一一对应的面板值 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="tabs"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="tabs-list"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="tabs-trigger"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="tabs-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 鼠标悬停反馈，来自源码状态样式 |
| `active` | 当前激活或按下状态 |
| `focus-visible` | 键盘焦点态，必须保留可访问焦点环 |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |
| `data-active` | 当前/激活项 |
| `data-orientation` | horizontal / vertical 方向语义，决定布局和方向键 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--background` | 页面或控件的基础背景 |
| `--foreground` | 主要文字和图标 |
| `--foreground-disabled` | 禁用标签文字 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-hover` | default 变体未激活标签的 hover 表面 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--border` | 边框、分隔线和描边结构 |
| `--border-subtle` | default 激活标签的弱边框 |
| `--input` | 表单控件边框、背景和 disabled 语义 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 导航组件只表达位置和切换，不承载提交类动作。
- 当前项使用源码支持的 active/current 语义，不要只改颜色。
- 层级关系用组件结构表达，不用缩进和文字伪造。
- `TabsTrigger` 必须放在 `TabsList` 里，不要直接渲染在 `Tabs` 下。
- 同一组 Tabs 的 variant 和 size 只在 TabsList 声明一次，不逐个覆盖 Trigger。
- 垂直 Tabs 使用 orientation="vertical"，依赖 Base UI 的上下方向键；水平 Tabs 使用左右方向键。需要方向键立即切换面板时，显式使用 `activateOnFocus`。
- 使用 Tabs 前必须以 src/components/ui/tabs.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Tabs 的 div，也不要硬编码 token 颜色。
<div className="custom-tabs">...</div>
```

推荐：

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">概览</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">内容</TabsContent>
</Tabs>
```
