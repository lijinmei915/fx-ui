---
category: Components
group: 数据展示
title: Tag
subtitle: 标签
description: 行内的状态/分类小标签；状态用 variant，分类打标用多彩 color。
source: src/components/ui/tag.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - secondary
  - success
  - warning
  - destructive
  - border
status: complete
---

# Tag 标签

行内的状态/分类小标签；状态用 variant，分类打标用多彩 color。角标红点/未读数请用 Badge。

源码来自项目自建（基于 shadcn Badge 的 pill 拆分而来），保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过硬编码颜色或手写状态样式实现。

AI 使用 Tag 前必须先以 `src/components/ui/tag.tsx` 为真实 API。

## 来源 {#source}

```txt
src/components/ui/tag.tsx
```

## 使用方式 {#usage}

```tsx
import { Tag } from "@/components/ui/tag"
```

```tsx
<Tag variant="success">已支付</Tag>
<Tag color="purple">高意向</Tag>
```

## 组件总览 {#overview}

- 类型：display
- 语义 DOM：slot="tag"
- 两条正交轴：`variant`（状态语义）/ `color`（分类打标多彩）
- 变体：default / secondary / destructive / success / warning / outline
- 打标色：gray / red / amber / yellow / lime / green / teal / cyan / blue / purple / pink（软色 = 浅底 01/中性 03 + 彩字 07/中性前景 + 描边 03/中性 07）
- 导出项：Tag、tagVariants

## 场景示例 {#examples}

### 推荐场景

- 使用意图：表格/列表里的状态标记（已支付、待审核）与分类打标（高意向、华东区）。
- 规则：状态用 `variant`；给实体打类别标签用 `color`（颜色=类别，不是状态）。

```tsx
<Tag variant="success">已支付</Tag>
<Tag color="blue">华东区</Tag>
<Tag color="purple">高意向</Tag>
```

### 不适合场景

- 不要把 Tag 当按钮/链接（加 onClick 跳转）；需要交互用 Button/链接。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、状态样式。
- 不发明源码里没有的 variant / color。

## API {#api}

该组件以源码导出的 props 为准。使用前读取 `src/components/ui/tag.tsx`。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'success' \| 'warning' \| 'outline'` | `'default'` | 状态语义配色 |
| `color` | `'none' \| 'gray' \| 'red' \| 'amber' \| 'yellow' \| 'lime' \| 'green' \| 'teal' \| 'cyan' \| 'blue' \| 'purple' \| 'pink'` | `'none'` | 分类打标软色；设置后覆盖 variant 配色，`gray` 用于中性分类标签 |
| `render` | `ReactElement` | — | 渲染到自定义元素（Base UI render） |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `slot: "tag"` | 标签根节点，供样式选择器、测试和 AI 定位（`state.slot`） |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 作链接（render 成 a）时的悬停态 |
| `focus-visible` | 键盘聚焦时的焦点环 |
| `aria-invalid` | 校验失败时的描边/环（少见） |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | default 品牌强调 |
| `--secondary` | secondary 中性底 |
| `--success` / `--warning` / `--destructive` | 状态语义配色 |
| `--border` | outline 描边 |

打标 `color` 取自 13 色板阶（`--fx-{color}-01/03/07`）。完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 状态用 `variant`，分类打标用 `color`，两条轴各管各的。
- 使用 Tag 前必须以 src/components/ui/tag.tsx 为真实 API。
- 不要把 Tag 当按钮/链接；不要手写颜色/圆角/状态样式。
- className 只用于布局或外部间距。

## 正误示例 {#do-dont}

### 状态用 variant、打标用 color

不推荐：

```tsx
// 不要手写颜色硬造标签
<span className="bg-[#f2f4fb] text-[#545861]">一般客户</span>
```

推荐：

```tsx
<Tag color="gray">一般客户</Tag>
<Tag color="purple">高意向</Tag>
```
