---
layer: knowledge
type: spec
last_verified: 2026-06-17
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

## 功能色（状态色）

四个功能色全走对应色板，且按交互阶梯补齐**实心组 + 浅色组**两套态（和 primary 一致）：

| 语义 | 色系 | 实心 默认/hover/active/disabled | 浅色 默认/hover/active |
|------|------|--------------------------------|------------------------|
| 危险 destructive | red | 09 / 08 / 10 / 05 | 01 / 02 / 03 |
| 成功 success | green | 09 / 08 / 10 / 05 | 01 / 02 / 03 |
| 警告 warning | amber | 09 / 08 / 10 / 05 | 01 / 02 / 03 |
| 信息 info | blue | 09 / 08 / 10 / 05 | 01 / 02 / 03 |

- 实心：`bg-{success/warning/info/destructive}`、`-hover`、`-active`、`-disabled`，文字反白
- 浅色：`bg-{...}-light`、`-light-hover`、`-light-active`，文字取该色 09 阶
- 不再写死十六进制——`--success/--warning/--info` 已归到 `green/amber/blue-09`（原 `#30C776/#FF7C19/#0C6CFF` 弃用，warning 由撞品牌橙改为琥珀）
- **中性 / 默认标签用 `secondary`（灰）**，不归入状态色：草稿、未开始、归档这类不带情绪的标签，用 secondary（neutrals 03/04/05），不要拿 info 假扮中性

## 链接色（Link）

链接统一用**蓝色**（与品牌橙、中性信息区分）：

| 态 | 来源 | 用法 |
|----|------|------|
| 默认 | `--fx-blue-09` | `text-link` |
| hover | `--fx-blue-08` | `hover:text-link-hover` |
| active | `--fx-blue-10` | `active:text-link-active` |

`Button` / `Badge` 的 `link` 变体、行内超链接都用这套，不再用品牌橙。链接、品牌强调文字都走下方「统一交互阶梯」（09/08/10），不单独加深。

## 文字 / 图标层级

**文字与图标共用同一套四级层级**，全部取自中性轴（对齐主流 Ant/Apple 的 4 级做法）：

| 级 | 用途 | 来源 | 变量/用法 |
|----|------|------|-----------|
| ① 主 | 标题、正文、表单标签、默认图标 | `--fx-neutrals-20` | `text-foreground` |
| ② 次 | 次要正文、说明 | `--fx-neutrals-15` | `text-foreground-secondary` |
| ③ 弱信息/caption | 描述、辅助说明、次要图标 | `--fx-neutrals-11` | `text-muted-foreground` |
| ④ 占位 + 禁用 | 表单 placeholder、禁用文字与图标（≈25%，对齐 Ant/Apple） | `--fx-neutrals-07` | `text-foreground-disabled` |
| 反白 | 主色/品牌背景上的文字图标 | `--fx-neutrals-01` | `text-primary-foreground` |

> **placeholder 与禁用同档**（④）：主流表单 placeholder 都很浅（Ant 25% / Material ~38%），不要用 ③ 的弱信息色（太深）。表单 placeholder 一律 `placeholder:text-foreground-disabled`。

> 图标不再单列一套色，直接复用这四级（默认图标 = ①，次要/禁用图标取 ③/④）。`text-icon` / `text-icon-muted` 作为 ①/③ 的别名保留，供 shadcn 组件兼容。

## 背景 / 边框

| 用途 | 值 | 变量/用法 |
|------|-----|-----------|
| 全局背景 | `--fx-neutrals-02` | `bg-background` |
| 卡片背景 | `--fx-neutrals-01` | `bg-card` |
| 弱背景 | `--fx-neutrals-03` | `bg-muted` |
| 弱边框 / 分割线 | `--fx-neutrals-04` | `border-border-subtle` |
| 默认边框 | `--fx-neutrals-05` | `border-border` |
| 强边框 / hover | `--fx-neutrals-08` | `border-border-strong` |
| 输入框边框 | `--fx-neutrals-07` | `border-input` |

## 圆角

按组件**类型/层级**选档（标签<控件<卡片<弹窗），不是按同一组件的大小——同一按钮的大中小尺寸通常共用一档（fx-ui 小尺寸按钮降到 md，常规/大按钮用 lg）。核心档由唯一基准 `--radius` 按 **shadcn 标准 ±2px 步进**派生；大容器档用 Tailwind 默认固定值；`full` 是胶囊/圆形，不参与派生。

**为什么 calc 派生而非固定值**：① 单一总开关，改 `--radius` 整套等量平移；② 步进恒定，相邻档差值一致不漂移；③ 品牌可调（更圆/更方一处生效）。固定值更直观但失去总开关，故表里同时标 px。

**尺寸与圆角（0.15~0.35 比值带）**：先按组件类型选一档，套到该组件所有尺寸上算 `圆角 ÷ 高度`——每个尺寸都落在 0.15~0.35 就共用一档（如 8px 按钮在 28/32/36px → 0.29/0.25/0.22，全在带内，不破例）。掉出带的尺寸**自动**换相邻档：> 0.4 太圆下调、< 0.15 太尖上调，复用现有阶梯不造新值。判定靠比值算，不靠感觉，也不用逐组件预先指定。

| 项 | 值 | 用法 |
|----|-----|------|
| `--radius` | `0.625rem`（10px，= rounded-lg） | 基础圆角真相源 |
| `rounded-none` | `0` | 表格、紧贴边缘容器、直角分割块 |
| `rounded-xs` | `calc(var(--radius) - 6px)` ≈ 4px | 极小元素：复选框、缩略图角、内联 code |
| `rounded-sm` | `calc(var(--radius) - 4px)` ≈ 6px | 小标签、小 chip |
| `rounded-md` | `calc(var(--radius) - 2px)` ≈ 8px | 按钮、输入框、小控件 |
| `rounded-lg` | `var(--radius)` = 10px | 卡片、下拉、浮层容器 |
| `rounded-xl` | `calc(var(--radius) + 4px)` ≈ 14px | Dialog、Sheet、较大区域容器 |
| `rounded-2xl/3xl/4xl` | 16 / 24 / 32px | 大区域容器（Tailwind 默认） |
| `rounded-full` | `9999px` | 胶囊按钮、Badge、头像、开关 |

## 排版（字号 / 字重 / 字体 · 企业 web 规范）

来源：企业 Figma **web 字体规范**（fx-ui 是 web 库，以 web 规范为准；移动端字号另有一套，见 DEC-004）。业务页面/组件用 `text-fx-*` 字号；文档站自身展示标题另走 Tailwind `text-*` 大号，不在此列。

**字号 + 行高**（默认正文 = 13）：

| 工具类 | 字号/行高 | 字重 | 层级/场景 |
|------|-----|------|------|
| `text-fx-18` | 18 / 28 | bold | 详情页标题 |
| `text-fx-15` | 15 / 22 | regular·bold | 模块/卡片/组件标题 |
| `text-fx-13` | 13 / 18 | regular·bold | **默认正文** — 菜单、列表、表单、大面积文案 |
| `text-fx-12` | 12 / 18 | regular | 提示信息、说明文字 |

**行高随字号 token 自带**（上表"字号/行高"列即定义），用 `text-fx-*` 自动带上对应行高；`text-base` 走 Tailwind 默认 1.5。正文/说明**不要手写 `leading-7`/`leading-8`** 把行距抬到 2.0+——那样换行太散，不符合主流正文行高（约 1.5）。

**字重**：`font-normal`(400) 常规·正文 / `font-medium`(500) 中等·标签·按钮·菜单 / `font-bold`(**700**) 加粗·标题·强调。

**字族**：`--font-sans` = `"Helvetica Neue", Helvetica, "Source Han Sans CN", "PingFang SC", "Hiragino Sans GB", "Microsoft Yahei", "微软雅黑", Arial, sans-serif`（西文 Helvetica 优先，中文思源黑体 CN，全系统字体、零下载）。

> 完整企业字号阶（11/14/16/20/22/28 + 中英双套语义变量名 Large Title/Title1/Body1…）见 Figma 字体规范；fx-ui web 当前只落地上面四档，按需再补。

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

阴影表达元素「离页面多高」（elevation），只在浮层/下拉/可交互表面谨慎使用，不作装饰。来源：Figma「图层样式」。**禁用 Tailwind 内置 `shadow-sm/md/lg`**——未映射公司 token，会漂。

| Token | 值 | 场景 |
|------|-----|------|
| `shadow-l1` | `0 2px 6px` | 浮层菜单、Dropdown — 最近层 |
| `shadow-l2` | `0 4px 12px` | Sheet、侧边滑出面板 — 中层 |
| `shadow-l3` | `0 6px 24px` | Dialog、Modal — 最高层遮罩 |
| `shadow-l1-up` | `0 -2px 6px` | 向上弹出的浮层（底部工具栏菜单） |

**计算方式**：每档 = `0 {y}px {blur}px var(--fx-shadow-color)`，spread 恒为 0。
- **颜色总开关** `--fx-shadow-color = oklch(from var(--fx-neutrals-20) l c h / .15)`：从最深中性灰（带品牌色相微染）派生 + 15% 透明，**跟随色板**而非写死纯黑；四档共用，调深浅/色板一处生效。
- **y 偏移**：每升一层 +2px（2/4/6），光从上方来、越高落得越远。
- **blur**：约每层翻倍（6/12/24），越高越柔越散。
- 靠几何（y + blur）拉开层级，**不靠加深颜色**，浮层保持淡而中性；`shadow-l1-up` 是 L1 的 y 取负的方向变体。

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

## 基础色板（13 有色色系 × 12 阶 + 中性灰 20 阶）

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
| 10 | `l*0.92, c*0.95` | 暗 8%，hover / 按下态（与 09 缓和过渡，不跳） |
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

### 13 有色色系种子色

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

> 灰色不在有色色系里——全站唯一中性灰是下方 Neutrals 20 阶（结构灰）。不再有独立的"品牌偏色灰"色系。

## 中性色（Neutrals 01–20）

**全站唯一中性灰轴**：变量名 `--fx-neutrals-{01~20}`，用 `color-mix(in oklch, white, neutral-dark N%)` 推导（`neutral-dark` 带品牌色相微量染色）。页面底/卡片/文字/边框，以及中性交互面（secondary / muted / ghost·outline 悬浮底）全部取自这里。

| 编号 | 混合比 | 常用场景 |
|------|--------|----------|
| 01 | white | 卡片、容器背景（`--card`）、反白文字、浅色图标 |
| 02 | 2% | 页面底色（`--background`） |
| 03 | 5% | 次级背景 muted / secondary 默认底、ghost·outline 悬浮底 |
| 04 | 9% | secondary·muted hover |
| 05 | 14% | secondary·muted active、分割线（`--border`） |
| 07 | 25% | 占位+禁用文字/图标（`--foreground-disabled`） |
| 11 | 49% | 弱信息/caption（`--muted-foreground`）、icon-muted |
| 15 | 73% | 次要文字（`--foreground-secondary`） |
| 20 | neutral-dark | 主文字（`--foreground`）、icon |

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

## 图标（颜色 + 尺寸）

图标用 lucide-react（线性单色，`currentColor` 跟随），分三类用色，颜色全部来自色板/文字层级，不另造图标专用色：

**1. 单色图标 — 跟随文字四级层级**

| 用途 | 类 |
|------|----|
| 主图标 | `text-foreground`（neutrals-20） |
| 次图标 | `text-muted-foreground`（neutrals-11） |
| 禁用图标 | `text-foreground-disabled`（neutrals-07） |
| 反白图标（深底/品牌底） | `text-primary-foreground`（neutrals-01） |

**2. 彩色线性图标 — 语义/品牌色**：`text-primary` / `text-success` / `text-warning` / `text-destructive` / `text-info`，分类场景可用 chart 色系（09 阶）。

**3. 面状/反白图标**：彩色圆底（`bg-{色}-09`）+ 白色图标（`text-primary-foreground`）。

**图标尺寸阶**：`size-3`(12) 内联/徽标 · `size-3.5`(14) 小按钮 · `size-4`(16) 默认 · `size-5`(20) 强调/列表 · `size-6`(24) 页面级/空状态。

**粗细 / 形态（weight）**：Phosphor 的粗细靠 `weight` 选档（thin/light/regular/bold/fill/duotone），不是数字 strokeWidth。
- **全站默认 `weight="regular"`**（线性），在 `src/main.tsx` 的 `IconContext.Provider` 一处设定，不逐个图标改粗细。
- **线性 vs 面型是语义切换**（对齐 iOS/Material 惯例）：默认/未选态用线性（regular），**选中/激活/强调态用 `weight="fill"`（面型）**。
- 要整体更细，改 IconContext 的默认 weight（如 `light`），属全局决策，不在单个图标上乱调。

> 兼容别名：`--fx-icon-dark`=neutrals-20、`--fx-icon-gray`=neutrals-11、`--fx-icon-light`=neutrals-01，供 shadcn 组件的 `text-icon` / `text-icon-muted` 使用。

## 交互色状态阶梯（通用规则）

任何一个需要交互的颜色（主色、功能色等），都按下面这套固定阶梯派生态，**深浅各一组**，统一从该色的 12 阶色板取阶，不手挑十六进制：

> ⚠️ **当前阶梯仅适用浅色模式**。深色模式以后另定（hover/active 的明暗方向会反），不要把这套直接套用到 dark。

### 实心 / 彩色文字组（以 09 为默认）

适用：主色实心、状态色实心、**链接文字、品牌强调文字**——全部一套，不单独加深。

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
