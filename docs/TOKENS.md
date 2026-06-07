---
layer: knowledge
type: spec
last_verified: 2026-06-06
teaches: "公司设计 token 的基础架构、真实值和全局视觉使用规则"
use_when: "AI 要用颜色/圆角/字体/状态样式、生成页面、改 shadcn 组件样式或判断视觉是否符合公司规范时"
---

# fx-ui 设计 Token

> 用途：公司视觉规范的查询表和 AI 生成规则。
> 真相源：`theme/fx-theme.css`。改那里 = 全局换肤，必须先说明影响。

fx-ui 的组件源码来自 shadcn/ui，公司的视觉统一不靠重写组件，而靠 token 注入。

## 基础架构

### 1. Primitive Token

公司原始视觉值，只在 token 真相源里出现。

| 名称 | 值 | 说明 |
|------|-----|------|
| `fx-primary` | `#FF8000` | 品牌橙 |
| `fx-success` | `#30C776` | 成功绿 |
| `fx-info` | `#0C6CFF` | 信息蓝 |
| `fx-warning` | `#FF7C19` | 警告橙 |
| `fx-danger` | `#FF522A` | 危险红 |

### 2. Semantic Token

shadcn/ui 和业务页面真正使用的语义槽。

| 语义 | 值 | Tailwind 用法 | 使用场景 |
|------|-----|---------------|----------|
| `primary` | `#FF8000` | `bg-primary text-primary-foreground` | 主操作、激活态、品牌强调 |
| `background` | `#F7F8FA` | `bg-background` | 页面底色 |
| `foreground` | `#181C25` | `text-foreground` | 主文字 |
| `card` | `#FFFFFF` | `bg-card text-card-foreground` | 卡片、浮层、内容容器 |
| `muted` | `#F2F3F5` | `bg-muted` | 次级背景、弱按钮、代码块 |
| `muted-foreground` | `#91959E` | `text-muted-foreground` | 辅助说明、弱信息 |
| `border` | `#DEE1E8` | `border-border` | 边框、分割线 |
| `input` | `#C1C5CE` | `border-input` | 表单边框 |
| `ring` | `#FF8000` | `ring-ring` | 键盘焦点和可访问性焦点环 |
| `destructive` | `#FF522A` | `bg-destructive text-destructive-foreground` | 删除、危险、不可逆操作 |

## 功能色

| 语义 | 值 | CSS 变量 | Tailwind 用法 |
|------|-----|----------|---------------|
| 成功 | `#30C776` | `--success` | `text-success` / `bg-success` |
| 信息 | `#0C6CFF` | `--info` | `text-info` / `bg-info` |
| 警告 | `#FF7C19` | `--warning` | `text-warning` / `bg-warning` |
| 危险 | `#FF522A` | `--destructive` | `text-destructive` / `bg-destructive` |

## 文字层级

| 用途 | 值 | 变量/用法 |
|------|-----|-----------|
| 主文字 | `#181C25` | `text-foreground` |
| 辅助文字 | `#91959E` | `text-muted-foreground` |
| 反白文字 | `#FFFFFF` | `text-primary-foreground` / `text-destructive-foreground` |

## 背景 / 边框

| 用途 | 值 | 变量/用法 |
|------|-----|-----------|
| 全局背景 | `#F7F8FA` | `bg-background` |
| 卡片背景 | `#FFFFFF` | `bg-card` |
| 弱背景 | `#F2F3F5` | `bg-muted` |
| 边框 / 分割线 | `#DEE1E8` | `border-border` |
| 输入框边框 | `#C1C5CE` | `border-input` |

## 圆角 / 字体

| 项 | 值 | 用法 |
|----|-----|------|
| `--radius` | `0.625rem` | 基础圆角真相源 |
| `radius-sm` | `calc(var(--radius) * 0.6)` | 小控件、tag |
| `radius-md` | `calc(var(--radius) * 0.8)` | 默认控件 |
| `radius-lg` | `var(--radius)` | 卡片、弹窗、区域容器 |
| 默认字体 | `PingFang SC`, `Microsoft YaHei`, `sans-serif` | `font-sans` |

## 间距

间距不单独造 CSS 变量，优先使用 Tailwind spacing scale，让页面节奏和 shadcn 组件密度保持一致。

| Token | 值 | 使用场景 |
|------|-----|----------|
| `gap-1` | `0.25rem / 4px` | 紧凑图标、微小内部间隔 |
| `gap-2` | `0.5rem / 8px` | 按钮图标、表单项内部间隔 |
| `gap-3` | `0.75rem / 12px` | 章节标题与说明之间 |
| `gap-4` | `1rem / 16px` | 卡片内容、表单字段之间 |
| `gap-5` | `1.25rem / 20px` | 章节标题组与主体内容之间 |
| `gap-6` | `1.5rem / 24px` | 页面区块、小型章节之间 |
| `gap-10` | `2.5rem / 40px` | 文档章节、主内容分组之间 |

## 阴影

阴影用来表达层级抬升，只在浮层、下拉、可交互表面中谨慎使用，不作为纯装饰。

| Token | 使用场景 |
|------|----------|
| `shadow-none` | 扁平控件、表格、默认页面区域 |
| `shadow-sm` | 轻量卡片、可点击列表项 |
| `shadow-md` | 浮层、下拉菜单、轻量弹出容器 |
| `shadow-lg` | 重点浮层、需要从页面背景中脱离的容器 |

## 动效

动效沿用 shadcn 组件已经使用的模式：`tw-animate-css`、短时长、以及由 `data-open` / `data-closed` / `data-state` 驱动的进入退出。

| Token / Utility | 使用场景 |
|-----------------|----------|
| `duration-100` | Dialog、Dropdown、Popover、Tooltip 的进入退出 |
| `duration-150` | Sheet 遮罩淡入淡出 |
| `duration-200` | Sidebar、Sheet 内容位移和宽度变化 |
| `animate-in` / `animate-out` | 基于状态的浮层显隐 |
| `fade` / `zoom` / `slide` | 浮层常用组合，不为单页临时发明动画 |

## 层级

层级规则记录 shadcn 浮层已经在用的 z-index 习惯。除非真的出现遮挡冲突，不要临时发明新的 z-index。

| Token | 使用场景 |
|------|----------|
| `z-10` | 局部控件内部层级，例如 Avatar 状态点、Calendar 范围态 |
| `z-20` | Sidebar 拖拽手柄等局部交互热区 |
| `z-40` | 固定 Header、文档顶部导航 |
| `z-50` | Dialog、Dropdown、Popover、Sheet、Tooltip 等浮层 |

## 文件分工

| 文件 | 角色 |
|------|------|
| `theme/fx-theme.css` | 运行时真相源，项目实际使用 |
| `registry/fx-theme.json` | shadcn 官方 `registry:theme` 分发格式 |
| `docs/TOKENS.md` | 人和 AI 共同读取的 token 使用规范 |
