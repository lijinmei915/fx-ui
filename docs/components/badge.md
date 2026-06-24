---
category: Components
group: 数据展示
title: Badge
subtitle: 角标
description: 贴在载体右上角的通知红点 / 未读数字。
source: src/components/ui/badge.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - destructive
  - background
status: complete
---

# Badge 角标

贴在头像、图标、按钮等载体右上角的通知红点（dot）或未读数字（count）。行内的状态/分类标签请用 Tag。

源码来自项目自建，保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入。

AI 使用 Badge 前必须先以 `src/components/ui/badge.tsx` 为真实 API。

## 来源 {#source}

```txt
src/components/ui/badge.tsx
```

## 使用方式 {#usage}

```tsx
import { Badge } from "@/components/ui/badge"
```

```tsx
<Badge dot>
  <Button size="icon" variant="outline" aria-label="通知"><BellIcon /></Button>
</Badge>
<Badge count={5}>…</Badge>
<Badge count={120} max={99}>…</Badge>  {/* 99+ */}
```

## 组件总览 {#overview}

- 类型：display（角标 dot/count）
- 语义 DOM：data-slot="badge"（角标本体）/ data-slot="badge-root"（包裹载体的定位容器）
- 用法：传 children 时包裹元素并定位右上角；不传则独立内联渲染
- 数字：count>max 显示「max+」；count<=0 默认不渲染（showZero 强制 0）
- 导出项：Badge

## 场景示例 {#examples}

### 推荐场景

- 使用意图：导航/图标/头像上的未读提示——红点表示"有更新"，数字表示"未读数"。
- 规则：dot 用于无需具体数量的提示；count 用于可计数；溢出用 max。

```tsx
<Badge dot><BellIcon /></Badge>
<Badge count={5}><BellIcon /></Badge>
```

### 不适合场景

- 不要用 Badge 承载行内状态/分类标签（那是 Tag 的职责）。
- 不通过 `className` 硬改位置/颜色覆盖组件定位与配色。

## API {#api}

该组件以源码导出的 props 为准。使用前读取 `src/components/ui/badge.tsx`。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `dot` | `boolean` | `false` | 红点（不显示数字） |
| `count` | `number` | — | 未读数；超过 max 显示「max+」 |
| `max` | `number` | `99` | 数字溢出阈值 |
| `showZero` | `boolean` | `false` | count<=0 时是否仍显示 0 |
| `tone` | `'destructive' \| 'primary'` | `'destructive'` | 角标配色 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="badge"` | 角标本体（红点/数字） |
| `data-slot="badge-root"` | 包裹载体的相对定位容器（传 children 时出现） |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 纯展示，无交互态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--destructive` | 默认角标底色（提示红） |
| `--primary` | tone="primary" 角标底色 |
| `--primary-foreground` | 角标内的数字/文字（反白） |
| `--background` | 角标外圈描边（与载体分隔的 ring） |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- Badge 是角标（dot/count），贴载体右上角；行内状态/分类标签用 Tag。
- 使用 Badge 前必须以 src/components/ui/badge.tsx 为真实 API。
- className 只用于布局或外部间距，不用于覆盖定位与配色。

## 正误示例 {#do-dont}

### 角标用 Badge、标签用 Tag

不推荐：

```tsx
// 不要用角标 Badge 当行内状态标签
<Badge>已支付</Badge>
```

推荐：

```tsx
<Tag variant="success">已支付</Tag>
<Badge count={5}><BellIcon /></Badge>
```
