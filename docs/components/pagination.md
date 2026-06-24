---
category: Components
group: 导航
title: Pagination
subtitle: 分页器
description: 分页浏览大量数据，提供页码、上一页/下一页与省略号。
source: src/components/ui/pagination.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - border
  - muted-foreground
status: complete
---

# Pagination 分页器

分页浏览大量数据，提供页码、上一页/下一页与省略号。

源码来自项目自建，保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Pagination 前必须先以 `src/components/ui/pagination.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/pagination.tsx
```

## 使用方式 {#usage}

```tsx
import { Pagination } from "@/components/ui/pagination"
```

```tsx
<Pagination page={page} total={193} pageSize={10} onPageChange={setPage} />
```

## 组件总览 {#overview}

- 类型：navigation
- 语义 DOM：data-slot="pagination" / data-slot="pagination-ellipsis"
- 原生/数据状态：root
- 变体：无独立 variant prop（受控分页，行为由 props 驱动）
- 导出项：Pagination、getPageList

## 场景示例 {#examples}

### 推荐场景

- 使用意图：列表/表格数据量大时分页浏览；页码过多自动用省略号收起。
- 规则：受控用法，自己持有 `page` 状态并在 `onPageChange` 中更新；总数用 `total` + `pageSize` 推导总页数。

```tsx
<Pagination page={page} total={193} pageSize={20} siblingCount={1} onPageChange={setPage} />
```

### 不适合场景

- 数据量很小（一屏可见）时不必分页。
- 不通过 `className` 硬覆盖组件内部颜色、圆角和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的 props 为准。使用前读取 `src/components/ui/pagination.tsx`，不要凭空发明 API。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `page` | `number` | — | 当前页（从 1 开始，受控） |
| `total` | `number` | — | 数据总条数，用于推导总页数 |
| `pageSize` | `number` | `10` | 每页条数 |
| `siblingCount` | `number` | `1` | 当前页两侧各保留的页码数 |
| `showTotal` | `boolean` | `true` | 是否显示「共 N 条」 |
| `onPageChange` | `(page: number) => void` | — | 翻页回调 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="pagination"` | 分页器根节点（nav），供样式选择器、测试和 AI 定位使用 |
| `data-slot="pagination-ellipsis"` | 省略号占位，页码过多时收起中间页 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 无额外交互状态；当前页通过 `aria-current="page"` 标记，首/末页时上一/下一页按钮禁用 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | 当前页码高亮底色 |
| `--border` | 上一/下一页按钮描边 |
| `--muted-foreground` | 总数文字与省略号 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 受控组件：自己持有 `page` 状态，在 `onPageChange` 更新，不要让组件内部猜测数据源。
- 用 `total` + `pageSize` 推导页数，不要手算页码列表。
- 使用 Pagination 前必须以 src/components/ui/pagination.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手搓页码按钮 + 自己拼省略号
<div className="flex gap-1">{pages.map(...)}</div>
```

推荐：

```tsx
<Pagination page={page} total={total} pageSize={20} onPageChange={setPage} />
```
