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
  - soft
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
- 变体：default / secondary / soft / destructive / success / warning / outline
- 打标色：gray / red / amber / yellow / lime / green / teal / cyan / blue / purple / pink（彩色软色 = Map base-10 浅底 + base-80 彩字 + base-30 描边；gray 使用 neutral base-30/40）
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
| `variant` | `'default' \| 'secondary' \| 'soft' \| 'destructive' \| 'success' \| 'warning' \| 'outline'` | `'default'` | 状态语义配色；`soft` 用于选择器已选项等紧凑中性标签 |
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

## 键盘与焦点 {#keyboard-focus}

Tag 默认渲染为 `span`，本身不是键盘交互控件，因此不创建 tab stop。通过 `render` 渲染为链接时，键盘进入、激活和焦点样式由原生 `a[href]` 负责；不要把 Tag 渲染成伪按钮承载操作。

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | default 品牌强调 |
| `--secondary` | secondary 中性底 |
| `--success` / `--warning` / `--destructive` | 状态语义配色 |
| `--border` | outline 描边 |
| `--fds-g-color-neutral-base-30` / `--fds-g-color-neutral-base-40` | gray 分类标签的浅底与描边；组件内部静态 Map 映射 |
| `--fds-g-color-red-base-10` / `--fds-g-color-red-base-30` / `--fds-g-color-red-base-80` | red 分类标签的浅底、描边与文字 |
| `--fds-g-color-amber-base-10` / `--fds-g-color-amber-base-30` / `--fds-g-color-amber-base-80` | amber 分类标签的浅底、描边与文字 |
| `--fds-g-color-yellow-base-10` / `--fds-g-color-yellow-base-30` / `--fds-g-color-yellow-base-80` | yellow 分类标签的浅底、描边与文字 |
| `--fds-g-color-lime-base-10` / `--fds-g-color-lime-base-30` / `--fds-g-color-lime-base-80` | lime 分类标签的浅底、描边与文字 |
| `--fds-g-color-green-base-10` / `--fds-g-color-green-base-30` / `--fds-g-color-green-base-80` | green 分类标签的浅底、描边与文字 |
| `--fds-g-color-teal-base-10` / `--fds-g-color-teal-base-30` / `--fds-g-color-teal-base-80` | teal 分类标签的浅底、描边与文字 |
| `--fds-g-color-cyan-base-10` / `--fds-g-color-cyan-base-30` / `--fds-g-color-cyan-base-80` | cyan 分类标签的浅底、描边与文字 |
| `--fds-g-color-blue-base-10` / `--fds-g-color-blue-base-30` / `--fds-g-color-blue-base-80` | blue 分类标签的浅底、描边与文字 |
| `--fds-g-color-purple-base-10` / `--fds-g-color-purple-base-30` / `--fds-g-color-purple-base-80` | purple 分类标签的浅底、描边与文字 |
| `--fds-g-color-pink-base-10` / `--fds-g-color-pink-base-30` / `--fds-g-color-pink-base-80` | pink 分类标签的浅底、描边与文字 |

打标 `color` 由组件内部静态引用 FDS Map，不是公开 `--fds-c-tag-*` Hook；调用方只选择 `color` prop，不能覆盖单个实例。完整 token 规则见 `docs/TOKENS.md`。

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
