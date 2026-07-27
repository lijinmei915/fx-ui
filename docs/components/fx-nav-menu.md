---
category: Components
group: 导航
title: NavMenu
subtitle: 导航菜单
description: 一级应用栏与二级单面板菜单的组合导航。
source: src/components/fx/nav-menu.tsx
theme: theme/fx-theme.css
tokens:
  - card
  - border
  - input
  - muted
  - accent
  - ring
status: complete
---

# NavMenu 导航菜单

`NavMenu` 提供 `NavRail` 一级应用栏和单面板二级菜单。展开宽度 200px，收起 rail 模式为 48px，适合后台导航和 CRM 外壳。

## 来源 {#source}

```txt
src/components/fx/nav-menu.tsx
```

## 使用方式 {#usage}

```tsx
import { NavMenu, NavMenuHeader, NavMenuList, NavMenuItem } from "@/components/fx/nav-menu"
```

```tsx
<NavMenu>
  <NavMenuHeader title="CRM" viewName="客户管理" />
  <NavMenuList>
    <NavMenuItem label="客户" active />
  </NavMenuList>
</NavMenu>
```

## 组件总览 {#overview}

- 类型：fx 组合组件
- 结构：`NavRail` → `NavRailItem`；`NavMenu` → Header/Search/List/GroupLabel/Item/Footer
- 状态：默认、hover、active、expanded、collapsed
- 收起态通过 Tooltip 补充菜单文案

## API {#api}

| 组件/属性 | 类型 | 说明 |
| --- | --- | --- |
| `NavRail` | `children?: ReactNode; footer?: ReactNode; className?: string` | 64px 一级应用栏 |
| `NavRailItem` | `icon: ReactNode; activeIcon?; label?; active?; boxed?` | 一级应用入口按钮 |
| `NavMenu` | `children?: ReactNode; collapsed?: boolean; collapseMode?: "rail" \| "strip"` | 二级菜单面板 |
| `NavMenuHeader` | `title: string; viewName?; collapsed?` | 菜单标题和视图名 |
| `NavMenuSearch` | `placeholder?; onAdd?; collapsed?` | 搜索框和新增动作 |
| `NavMenuItem` | `label: string; icon?; active?; indent?; expandable?; expanded?; collapsed?; arrow?` | 菜单项和展开项 |
| `NavMenuFooter` | `collapsed?; pinned?; onToggle?; onPin?` | 收起、展开或固定导航 |

## Semantic DOM {#semantic-dom}

| 部位 | 标记 |
| --- | --- |
| 一级栏 | `data-slot="nav-rail"` |
| 一级项 | `data-slot="nav-rail-item"` |
| 二级面板 | `data-slot="nav-menu"` |
| 菜单项 | `data-slot="nav-menu-item"` |
| 搜索行 | `data-slot="nav-menu-search"` |
| 底部操作 | `data-slot="nav-menu-footer"` |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--card` | 导航表面和选中表面 |
| `--border` | 导航分隔结构 |
| `--input` | 搜索输入边界 |
| `--muted` | hover 背景 |
| `--accent` | 二级菜单选中底色 |
| `--ring` | focus-visible 焦点环 |

## AI Rules {#ai-rules}

- 复用完整的 `NavRail`/`NavMenu` 组合，不在页面里重写折叠、hover、选中和 tooltip 交互。
- 调整业务内容只替换菜单数据和图标，不覆盖组件视觉 class。
- `collapseMode="strip"` 只用于需要细条 peek 的场景；常规后台使用默认 rail 模式。

## 正误示例 {#do-dont}

推荐使用 `NavMenuItem active` 表达选中状态；不要用页面自定义颜色或 opacity 伪造选中、禁用和焦点状态。
