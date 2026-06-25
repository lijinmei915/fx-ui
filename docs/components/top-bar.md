---
category: Components
group: 布局
title: TopBar
subtitle: 顶栏
description: 全局应用顶栏：品牌、应用切换、全局搜索、工具图标与头像。
source: src/components/fx/top-bar.tsx
figma: https://www.figma.com/design/kZSoa7pCfxCmKjiY83tw6l/%E6%96%B0%E7%89%88WebUI?node-id=1961-152595
theme: theme/fx-theme.css
tokens:
  - card
  - fill-subtle
  - fill-hover
  - border
  - muted-foreground
  - ring
status: complete
---

# TopBar 顶栏

全局应用顶栏：品牌、应用切换、全局搜索、工具图标与头像，48px 白底两端对齐。1:1 参照公司 Figma「新版WebUI」顶栏，视觉全部走 `theme/fx-theme.css` 语义 token，不硬编码颜色。

AI 使用 TopBar 前必须先以 `src/components/fx/top-bar.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/fx/top-bar.tsx
```

## 使用方式 {#usage}

```tsx
import {
  TopBar, TopBarBrand, TopBarDivider,
  TopBarApps, TopBarSearch,
  TopBarActions, TopBarIconButton,
} from "@/components/fx/top-bar"
```

```tsx
const [app, setApp] = useState("crm")
const [q, setQ] = useState("")
const [scope, setScope] = useState("all")

<TopBar>
  <TopBarBrand logo={<Logo />} name="纷享销客" />
  <TopBarDivider />
  <TopBarApps current="CRM" apps={apps} onSelect={setApp} />
  <TopBarSearch value={q} onValueChange={setQ} scope={scope} scopes={scopes} onScopeChange={setScope} />
  <TopBarActions>
    <TopBarIconButton icon={<MessageCircleIcon />} label="消息" count={3} />
    <TopBarIconButton icon={<BellIcon />} label="通知" dot />
  </TopBarActions>
  <Avatar>…</Avatar>
</TopBar>
```

## 组件总览 {#overview}

- 类型：fx 组合组件（布局）
- 语义 DOM：data-slot="top-bar" / -brand / -divider / -search / -actions
- 原生/数据状态：default / hover / focus-within / expanded（下拉展开）
- 子件：TopBar、TopBarBrand、TopBarDivider、TopBarApps、TopBarSearch、TopBarActions、TopBarIconButton
- 导出项：上述子件 + TooltipProvider

## 场景示例 {#examples}

### 推荐场景

- 使用意图：登录后的全局应用顶栏；品牌 + 应用切换 + 全局搜索 + 工具图标 + 头像，两端对齐。
- 规则：应用切换、搜索词、搜索范围均受控，状态由页面持有；工具图标必带 `aria-label` + Tooltip，未读用角标。

```tsx
<TopBarSearch value={q} onValueChange={setQ} scope={scope} scopes={scopes} onScopeChange={setScope} />
```

### 不适合场景

- 页面级标题区（标题 + 操作按钮）用 PageHeader，不要用 TopBar。
- 不通过 `className` 硬覆盖组件内部颜色、圆角和状态样式。
- 不发明源码里没有的 prop、子件或状态。

## API {#api}

该组件以源码导出的 props 为准。使用前读取 `src/components/fx/top-bar.tsx`，不要凭空发明 API。

| 子件 | 关键 props | 说明 |
| --- | --- | --- |
| `TopBar` | `children` | 顶栏外壳（48px，自身不设底色/分割线，换肤时由宿主决定），两端对齐布局 |
| `TopBarBrand` | `logo?`, `name` | 左侧品牌：logo + 公司/产品名（超长截断） |
| `TopBarDivider` | — | 竖向分隔线 |
| `TopBarApps` | `current`, `apps`, `onSelect?` | 应用切换：当前应用名 + 下拉选择（受控） |
| `TopBarSearch` | `value`, `onValueChange`, `scope?`, `scopes?`, `onScopeChange?`, `placeholder?` | 全局搜索：范围下拉 + 输入框（受控）；不传 scopes 退化为纯搜索框 |
| `TopBarActions` / `TopBarIconButton` | `icon`, `label`, `dot?`, `count?`, `onClick?` | 右侧工具区与图标按钮：无底色 + Tooltip + aria-label，可选角标 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="top-bar"` | 顶栏根节点（header），48px，自身不设底色/分割线 |
| `data-slot="top-bar-brand"` / `-divider` | 品牌区与竖向分隔线 |
| `data-slot="top-bar-search"` | 搜索容器（灰底填充），focus-within 高亮焦点环 |
| `data-slot="top-bar-actions"` | 右侧工具按钮区 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `default / hover` | 应用切换、范围下拉触发器 hover 变底/变色 |
| `focus-within` | 搜索框聚焦时容器焦点环高亮 |
| `data-state="open"` | 应用/范围下拉展开 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--card` | 应用切换卡片白底、搜索框聚焦白底 |
| `--fill-subtle` | 搜索框待命填充（半透明，自适应宿主底色） |
| `--fill-hover` | 搜索框 hover、图标按钮 hover 填充 |
| `--border` | 竖向分隔线、范围与搜索之间的分隔 |
| `--muted-foreground` | 图标与范围文字 |
| `--ring` | 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 受控组件：应用切换、搜索词、搜索范围由页面持有，不让组件内部猜测数据源。
- 用子件组合，不要把整条顶栏写成裸 div + 手写样式。
- 工具图标必带 `aria-label` + Tooltip，未读用角标（Badge dot/count）。
- 使用 TopBar 前必须以 src/components/fx/top-bar.tsx 为真实 API。
- className 只用于布局或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手搓整条顶栏 + 自己拼搜索/下拉/图标按钮
<div className="flex h-12 items-center ...">{/* 一坨裸 div */}</div>
```

推荐：

```tsx
<TopBar>
  <TopBarBrand logo={<Logo />} name="纷享销客" />
  <TopBarApps current="CRM" apps={apps} onSelect={setApp} />
  <TopBarSearch value={q} onValueChange={setQ} />
  <TopBarActions>
    <TopBarIconButton icon={<BellIcon />} label="通知" dot />
  </TopBarActions>
</TopBar>
```
