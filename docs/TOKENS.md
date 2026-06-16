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

## 基础色板（14 色系 × 12 阶）

> 真相源：`theme/fx-theme.css`，用 CSS 相对颜色语法从种子色（seed）在 oklch 空间推导。
> 变量名格式：`--fx-{色系}-{阶}`，例如 `--fx-orange-09`。

### 推导公式

| 阶 | 公式 | 用途 |
|----|------|------|
| 01 | `l + (1-l)*0.93, c*0.04` | 极浅背景 |
| 02 | `l + (1-l)*0.84, c*0.10` | 次浅背景 |
| 03 | `l + (1-l)*0.72, c*0.18` | 交互浅背景（默认） |
| 04 | `l + (1-l)*0.58, c*0.30` | 交互浅背景（hover） |
| 05 | `l + (1-l)*0.43, c*0.45` | 交互浅背景（active） |
| 06 | `l + (1-l)*0.28, c*0.62` | 浅边框 |
| 07 | `l + (1-l)*0.14, c*0.80` | 边框（默认） |
| 08 | `l + (1-l)*0.12, c*0.94` | 边框（hover），与 09 有明显视觉差距 |
| 09 | seed 本身 | 最鲜艳，实心填充基准（按钮/Badge 默认） |
| 10 | `l*0.87, c*0.95` | 暗 13%，hover / 按下态（同色靠动效区分） |
| 11 | `l*0.72, c*0.82` | 暗 28%，**低对比彩色文字**（仍明显有色，如品牌色链接、Tag 文字） |
| 12 | `l*0.35, c*0.65` | 暗 65%，**高对比深色文字**（接近深棕/黑，WCAG AA 可达） |

> **11-12 跨度大是有意为之**（对齐 Radix 设计逻辑）：11 是"还能看出是品牌色"的文字，12 是"必须够深才能达标"的正文。两档功能不同，跨度天然大。

### Radix 分区对照

| 阶范围 | 分区 | 典型用途 |
|--------|------|----------|
| 01–02 | 背景 | 极浅彩色块、高亮背景 |
| 03–05 | 交互背景 | 浅色按钮/组件 hover/active 背景 |
| 06–08 | 边框 | 分割线、输入框描边、边框 hover |
| 09–10 | 实心填充 | 主按钮、Badge、Tag 实心背景 |
| 11 | 低对比文字 | 彩色链接、Tag 文字、品牌色标注 |
| 12 | 高对比文字 | 深色正文、需要高对比的彩色文字 |

### 14 色系种子色

| 色系变量 | 参考值 | 语义 |
|----------|--------|------|
| `--fx-brand-vivid` | `#FF8000` | 品牌橙（随 `--fx-brand` 换肤） |
| `--fx-seed-orange-warning` | `#F97316` | 暖橙 Warning |
| `--fx-seed-amber` | `#F59E0B` | 琥珀 |
| `--fx-seed-yellow` | `#EAB308` | 黄 |
| `--fx-seed-lime` | `#84CC16` | 嫩绿 |
| `--fx-seed-yellow-green` | `oklch(0.70 0.19 137)` | 黄绿 |
| `--fx-seed-green` | `#22C55E` | 绿 · 成功 |
| `--fx-seed-teal` | `#14B8A6` | 青 |
| `--fx-seed-cyan` | `#06B6D4` | 青蓝 |
| `--fx-seed-blue` | `#3B82F6` | 蓝 · 链接/信息 |
| `--fx-seed-purple` | `#8B5CF6` | 紫 |
| `--fx-seed-pink` | `#EC4899` | 粉 |
| `--fx-seed-red` | `#EF4444` | 红 · 错误 |
| `--fx-seed-gray` | `oklch(from brand 0.65 0.010 h)` | 主题色偏色灰；C=0.010 为确认值，继承 brand 色相但彩度极低，视觉上看不出色相偏向；不调高到 0.020+（会出现橙调），不降到 0.005 以下（步骤差异消失） |

## 中性色（Neutrals 01–19）

变量名：`--fx-neutrals-{01~19}`，用 `color-mix(in oklch, white, neutral-dark N%)` 推导。

| 编号 | 混合比 | 常用场景 |
|------|--------|----------|
| 01 | white | 卡片、容器背景 |
| 02 | 2% | 页面底色（`--background`） |
| 03 | 5% | 次级背景、muted、input disabled |
| 05 | 16% | 分割线（`--border`） |
| 07 | 28% | 表单边框（`--input`） |
| 11 | 54% | 辅助文字（`--muted-foreground`）、icon-muted |
| 19 | neutral-dark | 主文字（`--foreground`）、icon |

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

## 交互色状态阶梯（通用规则）

任何一个需要交互的颜色（主色、功能色等），都按下面这套固定阶梯派生态，**深浅各一组**，统一从该色的 12 阶色板取阶，不手挑十六进制：

### 实心组（按钮、实心标签等）

| 态 | 取阶 | 规律 |
|------|------|------|
| 默认 Default | 09 | 种子色本身 |
| 悬浮 Hover | 08 | 比默认浅一阶（柔和悬浮） |
| 激活 Active / 按下 Click | 10 | 比默认深一阶（按下加深） |
| 禁用 Disabled | 05 | 大幅变浅（组件层不再叠 opacity） |

### 浅色组（Tag / Badge / Alert / Ghost 按钮背景）

| 态 | 取阶 | 规律 |
|------|------|------|
| 默认 Default | 01 | 最浅背景 |
| 悬浮 Hover | 02 | 深一阶 |
| 激活 Active / 按下 Click | 03 | 再深一阶 |
| 文字 / 描边 | 09 | 浅色背景上的文字用种子色 |

### 焦点环 Focus ring

键盘焦点环单独一条：种子色（09）叠 40% 透明，`oklch(from var(--fx-brand-09) l c h / 0.4)`。

### 唯一真相：所有交互态都从 12 阶色板取阶

**禁止**用 `color-mix(...)` 现算、`/透明度`（如 `bg-primary/80`、`bg-destructive/10`）这类手法表达交互态——它们绕过色板、各处不一致。一律走对应色系的 12 阶色板。

各类颜色的色板归属：

| 颜色 | 色板来源 | 实心/浅色 |
|------|----------|-----------|
| 主色 primary | `--fx-brand-*`（随换肤变） | 实心组 默认09/hover08/active10/禁用05 + 浅色组 01/02/03 |
| 功能色 success/info/warning/destructive | 各自 `--fx-green/blue/amber/red-*` | 浅色组 01/02/03，文字用 09 |
| 中性面 secondary/muted | `--fx-gray-*`（灰色板，对齐 Radix 交互区 03/04/05） | 默认 03 / hover 04 / active 05 |

落地 token：
- 主色：`--fx-primary` = `--fx-brand-09`、`-hover` = `08`、`-active` = `10`、`-disabled` = `05`；`--fx-primary-light*` = `--fx-brand-01/02/03`
- 功能色：`--fx-{success/info/warning/danger}-light(/-hover/-active)` = 对应色板 01/02/03
- 中性面：`--secondary(/-hover/-active)` = `--fx-gray-03/04/05`；`--muted(/-hover/-active)` = `--fx-gray-02/03/04`
- 焦点环：`--ring` = 种子色 09 叠 40% 透明

> 新增任何可交互色时，按这张表派生，不要临时挑色值、不要用 color-mix 或透明度。

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
