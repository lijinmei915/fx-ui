---
category: Components
group: 通用
title: Breadcrumb
subtitle: 面包屑
description: 展示当前位置的层级路径，帮助用户返回上级页面。
source: src/components/ui/breadcrumb.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - muted
  - muted-foreground
status: complete
---

# Breadcrumb 面包屑

展示当前位置的层级路径，帮助用户返回上级页面。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Breadcrumb 前必须先以 `src/components/ui/breadcrumb.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/breadcrumb.tsx
```

## 使用方式 {#usage}

```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from "@/components/ui/breadcrumb"
```

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">首页</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>订单详情</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## 组件总览 {#overview}

- 类型：navigation
- 语义 DOM：data-slot="breadcrumb"、data-slot="breadcrumb-list"、data-slot="breadcrumb-item"、data-slot="breadcrumb-page"、data-slot="breadcrumb-separator"、data-slot="breadcrumb-ellipsis"
- 原生/数据状态：hover、disabled
- 变体：无独立 variant prop
- 导出项：Breadcrumb、BreadcrumbList、BreadcrumbItem、BreadcrumbLink、BreadcrumbPage、BreadcrumbSeparator、BreadcrumbEllipsis

## 场景示例 {#examples}

### 推荐场景

- 使用意图：展示当前位置的层级路径，帮助用户返回上级页面。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">首页</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>订单详情</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### 不适合场景

- 不用 Breadcrumb 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/breadcrumb.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="breadcrumb"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="breadcrumb-list"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="breadcrumb-item"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="breadcrumb-page"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="breadcrumb-separator"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="breadcrumb-ellipsis"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 鼠标悬停反馈，来自源码状态样式 |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 导航组件只表达位置和切换，不承载提交类动作。
- 当前项使用源码支持的 active/current 语义，不要只改颜色。
- 层级关系用组件结构表达，不用缩进和文字伪造。
- 最后一级用当前页语义，不要做成可点击链接。
- 使用 Breadcrumb 前必须以 src/components/ui/breadcrumb.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Breadcrumb 的 div，也不要硬编码 token 颜色。
<div className="custom-breadcrumb">...</div>
```

推荐：

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">首页</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>订单详情</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```
