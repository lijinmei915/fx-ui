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
> 改完 `fx-theme.css` 后，跑 `bash scripts/check-tokens-sync.sh` 校验本表的色值有没有漏抄/抄漂——脚本只查不改，发现差异要手动同步本表。

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
| `accent` | `#F2F4FB` | `bg-accent text-accent-foreground` | 悬浮态、轻量高亮背景 |
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

## 基础色板（Figma 色彩规范 · 11 色系 × 00–10 阶）

> 来源：Figma「全局规范」色彩规范节点。变量名格式：`--fx-{色系}-{阶}`，06 为 Normal 基准值。

### Orange（品牌橙）
`#FFFBF0` `#FFF7E6` `#FFDDA3` `#FFCA7A` `#FFB452` `#FF9B29` `#FF8000` `#D96500` `#B34100` `#8C2F00` `#662500`

### Magenta（玫红）
`#FFF1F0` `#FFF0F0` `#FFEDED` `#FFC4C7` `#FF9CA4` `#FF7383` `#FF4A66` `#D93452` `#B32241` `#8C1432` `#660D26`

### Red（红 · 错误）
`#FFF6F0` `#FFF5F0` `#FFDCCC` `#FFBDA3` `#FF9C7A` `#FF7752` `#FF522A` `#D93518` `#B31E0B` `#8C0D01` `#660500`

### Yellow（黄）
`#FFFEF0` `#FFFCE6` `#FFF2A6` `#FFE77D` `#FFDA54` `#FFCA2B` `#FFB602` `#D99400` `#B37400` `#8C5600` `#663C00`

### Orange Warning（暖橙 · 警告）
`#FFFAF0` `#FFF5E6` `#FFE2BD` `#FFCD94` `#FFB56B` `#FF9A42` `#FF7C19` `#D95D0B` `#B34100` `#8C2F00` `#661F00`

### Yellow Green（黄绿）
`#FBFFF0` `#FAFFF0` `#F9FFED` `#DDF2BB` `#C0E68C` `#A3D962` `#87CC3B` `#65A628` `#478018` `#2C590C` `#183307`

### Green（绿 · 成功）
`#F0FFF3` `#F0FFF4` `#DCFAE6` `#ABEDC3` `#7EE0A5` `#55D48C` `#30C776` `#1FA160` `#117A49` `#085433` `#042E1D`

### Teal（青）
`#F0FFFB` `#E1F5F1` `#B0E8DE` `#84DBCE` `#5BCFC1` `#36C2B6` `#16B4AB` `#0A8F8D` `#026769` `#003F42` `#001A1C`

### Blue（蓝）
`#F0FCFF` `#E6F9FF` `#BAEBFF` `#91DCFF` `#69CAFF` `#40B6FF` `#189DFF` `#097BD9` `#005CB3` `#00448C` `#002E66`

### Dark Blue（深蓝 · 链接/信息）
`#F0F9FF` `#E6F4FF` `#B0DAFF` `#87C3FF` `#5EA9FF` `#368DFF` `#0C6CFF` `#004FD9` `#003BB3` `#002A8C` `#001B66`

### Purple（紫）
`#F8F0FF` `#F7F0FF` `#F5EDFF` `#DDC4FF` `#BC97F7` `#976AEB` `#7341DE` `#542CB8` `#391C91` `#230F6B` `#140945`

## 中性色（Neutrals 01–19）

变量名：`--fx-neutrals-{01~19}`

| 编号 | 值 | 常用场景 |
|------|-----|----------|
| 01 | `#FFFFFF` | 背景 |
| 02 | `#FAFAFA` | 背景 |
| 03 | `#F2F3F5` | 背景 / input disabled / header |
| 04 | `#EAEBEE` | — |
| 05 | `#DEE1E8` | 分割线 / icon gray |
| 06 | `#CED1D9` | — |
| 07 | `#C1C5CE` | text H4 / input border / icon light |
| 08 | `#ADB1BA` | — |
| 09 | `#A3A7B0` | input border hover |
| 10 | `#999DA6` | — |
| 11 | `#91959E` | text H3 |
| 12 | `#81858F` | — |
| 13 | `#737881` | — |
| 14 | `#606570` | — |
| 15 | `#545861` | text H2 |
| 16 | `#444852` | — |
| 17 | `#343841` | — |
| 18 | `#272B34` | — |
| 19 | `#181C25` | text H1 |

## 特殊色（Special）

| 变量 | 值 | 场景 |
|------|-----|------|
| `--fx-special-01` | `#F2F4FB` | 标签背景 |
| `--fx-special-02` | `#737C8C` | icon/dark |
| `--fx-special-03` | `#EFF1F3` | 页面底色 |
| `--fx-special-04` | `#F7F8FA` | 卡片底色 |

## 图表色板（BI 常用色 · 10 色）

> 来源：Figma「色彩的使用」BI常用颜色规范。取每个色系的 Normal/06 阶。

| Token | 值 | 色系·阶 |
|-------|-----|---------|
| `--chart-1`  | `#FF7383` | Magenta 05 |
| `--chart-2`  | `#FF7752` | Red 05 |
| `--chart-3`  | `#FF9B29` | Orange 05 |
| `--chart-4`  | `#FFDA54` | Yellow 04 |
| `--chart-5`  | `#DDF2BB` | Yellow Green 03 |
| `--chart-6`  | `#55D48C` | Green 05 |
| `--chart-7`  | `#5BCFC1` | Teal 04 |
| `--chart-8`  | `#40B6FF` | Blue 05 |
| `--chart-9`  | `#368DFF` | Dark Blue 05 |
| `--chart-10` | `#976AEB` | Purple 05 |

## 图标色（Icon colors）

| Token | 值 | 场景 |
|-------|-----|------|
| `--fx-icon-dark`  | `#181C25` | 单色图标·深色（深色背景反白） |
| `--fx-icon-light` | `#FFFFFF` | 单色图标·浅色（深色背景反白） |
| `--fx-icon-gray`  | `#737C8C` | 单色图标·灰色（次级 icon） |

线性图标（Linear icon）使用各色系 Normal/06 颜色，与 BI chart 色一致。
填充/反色图标（Filled/Reverse icon）使用各色系 05 阶（比 Normal 浅一档）。

## 品牌色交互四态

| 状态 | Token | 值 | 说明 |
|------|-------|-----|------|
| Normal   | `--primary` / `--fx-orange-06`    | `#FF8000` | 默认态 |
| Hover    | `--fx-primary-hover`              | `#FF9B29` | Orange 05，悬浮变浅 |
| Click    | `--fx-primary-click`              | `#D96500` | Orange 07，点击加深 |
| Disabled | `--fx-primary-disabled`           | `#FF9B29` | Orange 05，组件层叠加 opacity |

## 列表行高亮色

| Token | 值 | 场景 |
|-------|-----|------|
| `--fx-list-orange` | `#FFF7E6` | 列表行选中 / 高亮·橙（Orange 01） |
| `--fx-list-blue`   | `#E6F4FF` | 列表行选中 / 高亮·蓝（Dark Blue 01） |

## 文件分工

| 文件 | 角色 |
|------|------|
| `theme/fx-theme.css` | 运行时真相源，项目实际使用 |
| `registry/fx-theme.json` | shadcn 官方 `registry:theme` 分发格式 |
| `docs/TOKENS.md` | 人和 AI 共同读取的 token 使用规范 |
