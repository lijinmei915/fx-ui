---
category: Components
group: 业务组合
title: Layout
subtitle: 页面骨架
description: 用于整页头部、侧栏、内容和底部区域的 flex 骨架。
source: src/components/fx/layout.tsx
theme: theme/fx-theme.css
tokens:
  - background
  - card
  - border
  - muted-foreground
status: complete
---

# Layout 页面骨架

`Layout` 负责整页骨架；内容区内部的分栏仍使用 Tailwind 24 列栅格工具类，不再封装 Row/Col。

## 来源 {#source}

```txt
src/components/fx/layout.tsx
```

## 使用方式 {#usage}

```tsx
import { Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from "@/components/fx/layout"
```

```tsx
<Layout hasSider>
  <LayoutSider>导航</LayoutSider>
  <Layout>
    <LayoutHeader>页面标题</LayoutHeader>
    <LayoutContent>页面内容</LayoutContent>
    <LayoutFooter>页脚</LayoutFooter>
  </Layout>
</Layout>
```

## 组件总览 {#overview}

- 类型：fx 组合组件
- 子组件：`LayoutHeader`、`LayoutSider`、`LayoutContent`、`LayoutFooter`
- 默认尺寸：顶栏 56px、侧栏 240px/收起 64px、底栏 48px

## API {#api}

| 组件/属性 | 类型 | 说明 |
| --- | --- | --- |
| `Layout` | `children?: ReactNode; className?: string; hasSider?: boolean` | 整页容器；`hasSider` 时改为横向骨架 |
| `LayoutHeader` | `children?: ReactNode; className?: string` | 固定 56px 顶栏 |
| `LayoutSider` | `children?: ReactNode; className?: string; collapsed?: boolean` | 侧栏；收起时为 64px |
| `LayoutContent` | `children?: ReactNode; className?: string` | 撑满剩余空间的内容区 |
| `LayoutFooter` | `children?: ReactNode; className?: string` | 固定 48px 底栏 |

## Semantic DOM {#semantic-dom}

| 部位 | 标记 |
| --- | --- |
| 根容器 | `data-slot="layout"` |
| 顶栏 | `data-slot="layout-header"` |
| 侧栏 | `data-slot="layout-sider"` |
| 内容区 | `data-slot="layout-content"` |
| 底栏 | `data-slot="layout-footer"` |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--background` | 页面骨架底色 |
| `--card` | 顶栏和侧栏表面 |
| `--border` | 分隔线 |
| `--muted-foreground` | 底栏辅助文字 |

## AI Rules {#ai-rules}

- 整页骨架优先复用 `Layout`，内容分栏使用 24 列 Tailwind 工具类。
- `collapsed` 由页面状态或响应式逻辑控制，不在组件外重写宽度样式。
- 不在调用处覆盖组件颜色、圆角、边框和状态视觉。

## 正误示例 {#do-dont}

推荐使用 `Layout` 与其子组件组合页面骨架；不要用多个裸 `div` 复制头/侧/内容/底结构。
