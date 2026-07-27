---
category: Components
group: 通用
title: Card
subtitle: 卡片
description: 承载一组相关内容、操作或数据摘要。
source: src/components/ui/card.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - card
  - card-foreground
  - muted
  - muted-hover
  - muted-active
  - muted-foreground
  - border-container
  - border-strong
  - border-subtle
  - surface-disabled
  - foreground-disabled
  - ring
status: complete
---

# Card 卡片

承载一组相关内容、操作或数据摘要。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Card 前必须先以 `src/components/ui/card.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/card.tsx
```

## 使用方式 {#usage}

```tsx
import { Card, CardHeader, CardMedia, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "@/components/ui/card"
```

```tsx
<Card variant="outline" size="md">
  <CardHeader>
    <CardTitle>订单概览</CardTitle>
    <CardDescription>最近 30 天数据</CardDescription>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

## 组件总览 {#overview}

- 类型：container
- 语义 DOM：data-slot="card"、data-slot="card-media"、data-slot="card-header"、data-slot="card-title"、data-slot="card-description"、data-slot="card-action"、data-slot="card-content"、data-slot="card-footer"
- 原生/数据状态：hover、active、focus-visible、disabled（button render）
- 视觉变体：`variant="outline | subtle | elevated"`，默认 `outline`
- 尺寸：`size="sm | md | lg"`，默认 `md`
- 交互语义：通过 Base UI `render` 把根节点渲染为原生 `a` 或 `button`；静态 Card 仍渲染为 `div`
- 导出项：Card、CardMedia、CardHeader、CardFooter、CardTitle、CardAction、CardDescription、CardContent

## 场景示例 {#examples}

### 推荐场景

- 使用意图：承载一组相关内容、操作或数据摘要。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Card variant="outline" size="md">
  <CardHeader>
    <CardTitle>订单概览</CardTitle>
    <CardDescription>最近 30 天数据</CardDescription>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

### 不适合场景

- 不用 Card 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。
- 不给 Card 增加 `clickable`、`hoverable`、`loading`、`empty` 或业务状态布尔属性。
- 整卡已渲染为 `a/button` 时，不在内部嵌套 Button、Link 或其他交互控件。

## API {#api}

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `"outline" \| "subtle" \| "elevated"` | `"outline"` | 描边、弱底色和 L1 浮起表面；outline 使用强边框 token，elevated 使用容器边框 token，阴影跟随全局阴影配置 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 统一控制根间距、子区域内边距和标题密度 |
| `render` | `ReactElement` | — | Base UI 多态渲染；整卡跳转用 `a`，整卡动作使用 `button` |
| `CardMedia` | 组件 | — | 顶部媒体结构容器。放在 Card 的首个子节点；图片、视频等 children 自行提供比例、裁切和替代文本 |
| 原生 props | 对应渲染元素的 props | — | 静态根节点默认继承 `div` props；链接/按钮属性放在 `render` 元素上 |

`CardHeader`、`CardTitle`、`CardDescription`、`CardAction`、`CardContent`、`CardFooter` 负责结构分区，不承载业务状态。

```tsx
<Card>
  <CardMedia>
    <img src="/customer.jpg" alt="客户会话预览" />
  </CardMedia>
  <CardHeader>
    <CardTitle>客户会话预览</CardTitle>
  </CardHeader>
</Card>
```

```tsx
<Card render={<a href="/orders/FX-2048" />}>
  <CardHeader>
    <CardTitle>订单 #FX-2048</CardTitle>
    <CardDescription>查看订单详情</CardDescription>
  </CardHeader>
  <CardContent>待处理</CardContent>
</Card>
```


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="card"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-media"` | 顶部媒体结构容器；作为第一个子节点时贴齐卡片顶部，Card 根节点负责圆角裁切 |
| `data-slot="card-header"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-title"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-description"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-action"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="card-footer"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 仅当 `render` 为原生 `a/button` 时启用对应变体的 hover 表面 |
| `active` | 仅当 `render` 为原生 `a/button` 时启用按压表面 |
| `focus-visible` | 键盘聚焦原生 `a/button` 时显示语义焦点环 |
| `disabled` | `render` 为 `button` 时由原生 `disabled` 提供不可用语义和视觉；链接不伪造 disabled |

Loading 是 `Card + Skeleton`，Empty 是 `Card + Empty`，成功/警告/错误信息用 `Tag` 或 `Alert` 组合，不是 Card 原生状态。

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--card` | 卡片背景 |
| `--card-foreground` | 卡片文字和图标 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-hover` | 交互 Card 的 hover 表面 |
| `--muted-active` | 交互 Card 的 active 表面 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--border-container` | elevated Card 与网站页面容器的低强调外框 |
| `--border-strong` | outline Card 的清晰外框 |
| `--border-subtle` | subtle 变体的弱边框 |
| `--surface-disabled` | button render 的禁用表面 |
| `--foreground-disabled` | button render 的禁用文字 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 容器组件负责结构和层级，不直接承载业务状态颜色。
- 使用完整子组件结构，不要把标题、描述、内容全部塞进一个 div。
- 使用 `CardHeader`、`CardTitle`、`CardDescription`、`CardContent`、`CardFooter` 组织内容。
- 有媒体内容时使用 `CardMedia`，并把它放在 Card 的第一个子节点；媒体元素本身负责 `alt`、比例与裁切策略。
- 不要把整个卡片内容都塞进 `CardContent` 后再手写标题样式。
- 用 `variant` 和 `size` 选择受治理的外观，不在调用处重写边框、背景、圆角或阴影。
- 整卡跳转或操作通过 `render` 使用原生 `a/button`，不要给 `div` 添加 `onClick` 和 `tabIndex` 模拟交互。
- loading、empty、selected、status 属于组合或 Pattern/Block，不扩成 Card 根属性。
- 使用 Card 前必须以 src/components/ui/card.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Card 的 div，也不要硬编码 token 颜色。
<div className="custom-card">...</div>
```

推荐：

```tsx
<Card variant="outline" size="md">
  <CardHeader>
    <CardTitle>订单概览</CardTitle>
    <CardDescription>最近 30 天数据</CardDescription>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```
