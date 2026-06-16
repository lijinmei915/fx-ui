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
  - muted
  - muted-foreground
  - border
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
- 原生/数据状态：hover、active、focus-visible、disabled、data-active
- 变体：default、line
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

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/tabs.tsx`，不要凭空发明 API。


| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `variant` | 源码存在的视觉/语义变体 | `default` \| `line` |

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

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--background` | 页面或控件的基础背景 |
| `--foreground` | 主要文字和图标 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--border` | 边框、分隔线和描边结构 |
| `--input` | 表单控件边框、背景和 disabled 语义 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 导航组件只表达位置和切换，不承载提交类动作。
- 当前项使用源码支持的 active/current 语义，不要只改颜色。
- 层级关系用组件结构表达，不用缩进和文字伪造。
- `TabsTrigger` 必须放在 `TabsList` 里，不要直接渲染在 `Tabs` 下。
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
