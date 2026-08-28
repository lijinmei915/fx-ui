---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "FDS 颜色 Seed、Map、语义色与交互色规则"
use_when: "查询颜色值、状态色、中性轴、图表色或对比度时"
---

# FDS 颜色规范

> 本文是 FDS Foundation 专题说明；数值与映射的唯一真相源仍是 `tokens/source/*.tokens.json`。总览见 [设计 Token](../TOKENS.md)，统一目录见 [FDS 文档索引](../INDEX.md)。

## 语义颜色 Token

shadcn/ui 和业务页面真正使用的语义槽。

当前生成的 Semantic contract 共 149 项，其中 101 项为 Public Global、48 项为 Internal；准确计数以 `docs/data/fds-semantic.manifest.json#counts` 为准。Internal 包括 `--fds-g-color-brand-identity`、Theme profile 输出与迁移期内部角色，不是外部可随意覆盖的 Hook。

| 语义 | 值 | Tailwind 用法 | 使用场景 |
|------|-----|---------------|----------|
| `brand-identity` | `--fds-g-color-brand-base-90` | `text-(--fds-g-color-brand-identity)` / `bg-(--fds-g-color-brand-identity)` | Logo、品牌标识和导航当前项 |
| `primary` | `--fds-g-color-brand-base-90` | `bg-primary text-primary-foreground` | 主操作默认态；hover/active 统一取 Base 80/100 |
| `background` | `#F5F6F7` | `bg-background` | 页面底色 |
| `foreground` | `#080504`（默认 seed 派生） | `text-foreground` | 主文字 |
| `card` | `#FFFFFF` | `bg-card text-card-foreground` | 卡片、浮层、内容容器 |
| `surface` | `#FFFFFF` | `bg-surface` | 浮起控件白底（outline 按钮等）；与 card 同值、语义独立（card=容器，surface=控件表面） |
| `muted` | `#F2F3F5` | `bg-muted` | 次级背景、弱按钮、代码块 |
| `muted-foreground` | `#6A6765`（默认 seed 派生） | `text-muted-foreground` | 辅助说明、弱信息；正文规格保持 4.5:1 |
| `accent` | `#F2F4FB` | `bg-accent text-accent-foreground` | 悬浮态、轻量高亮背景 |
| `accent-hover` | 橙色 02 阶 | `bg-accent-hover` | 轻量高亮背景的 hover；例如已选表格行 |
| `border` | `#DEE1E8` | `border-border` | 边框、分割线 |
| `input` | `#C1C5CE` | `border-input` | 表单边框 |
| `ring` | `#FF8000` | `ring-ring` | 键盘焦点和可访问性焦点环 |
| `destructive` | 红色 Base 90 | `bg-destructive text-destructive-foreground` | 删除、危险、不可逆操作；前景由三态对比度自动选择 |
| `overlay` | `oklch(from neutrals-20 … / 0.2)` | `bg-overlay` | 弹窗/抽屉的**遮罩蒙层**（20%，配合组件的 `backdrop-blur-xs` 模糊，故比主流纯遮罩浅）；透明度烤进 token，直接用不加 `/x` |

> 遮罩归颜色（语义色）：本质是"蒙层色 + 透明度"。从最深中性灰派生跟随色板，**透明度内置**（半透明），Dialog/Sheet/AlertDialog 直接 `bg-overlay`，不写死 `bg-black/10`。z-index 归层级、淡入归动效，是共用机制不是归属。
> 遮罩的**模糊**也收成 token：`--overlay-blur = 2px`，组件用 `backdrop-blur-[var(--overlay-blur)]`，浓淡/模糊一处统管。

## 功能色（状态色）

四个功能色全走对应色板，且按交互阶梯补齐**实心组 + 浅色组**两套态（和 primary 一致）：

| 语义 | 色系 | 实心 默认/hover/active/disabled | 浅色 默认/hover/active |
|------|------|--------------------------------|------------------------|
| 危险 destructive | red | Base 90 / 80 / 100 / 50 | Base 10 / 20 / 30 |
| 成功 success | green | Base 90 / 80 / 100 / 50 | Base 10 / 20 / 30 |
| 警告 warning | amber | Base 90 / 80 / 100 / 50 | Base 10 / 20 / 30 |
| 信息 info | blue | Base 90 / 80 / 100 / 50 | Base 10 / 20 / 30 |

- 实心：`bg-{success/warning/info/destructive}`、`-hover`、`-active`、`-disabled`；各角色保留 `foreground-*` Semantic 名称，但统一引用主按钮 `foreground-primary`
- 只有主按钮 Default/Hover/Active 参与整组黑白前景解析；危险、成功、警告、信息不再独立做颜色对比度选择，默认、悬浮、按下和禁用均跟随主按钮前景
- Amber Base 80 是受控 Map 例外：保留比 Base 90 更浅的 hover 关系；禁用态继续使用 Base 50 背景和统一主按钮前景
- 浅色：`bg-{...}-light`、`-light-hover`、`-light-active`，文字取该色 09 阶
- 实心操作色统一引用 Foundation Base 90/80/100/50；Map 不提供第二套 Solid 色阶。Theme Resolver 只解析 `--fds-g-color-foreground-primary`，其余四个角色前景 Hook 是对它的稳定别名，不建立第二套对比度逻辑。正文 WCAG `4.5:1` 与非文字 `3:1` 仍是独立质量门。
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
| ④ 占位 + 禁用 | 表单 placeholder、禁用文字与图标 | `--fx-neutrals-06` | `text-foreground-disabled` |
| 实心表面前景 | 主色/功能色实心背景上的文字图标 | 运行时在白色与近黑色间整组选择 | `text-primary-foreground` / 对应状态色 foreground |

> **placeholder 与禁用同档**（④）：当前项目将中性禁用/placeholder 从 `neutrals-07` 上调到 `neutrals-06`，避免文字按钮禁用后过虚；表单 placeholder 一律 `placeholder:text-foreground-disabled`。

> 图标不再单列一套色，直接复用这四级（默认图标 = ①，次要/禁用图标取 ③/④）。`text-icon` / `text-icon-muted` 作为 ①/③ 的别名保留，供 shadcn 组件兼容。

## 背景 / 边框

> 术语约定：在 fx-ui 里，默认说“边框粗细”时，指的是**组件默认边框规格**，也就是组件外轮廓通常是 `1px` 还是 `2px`。颜色深浅单独叫“边框强度”，表格内线/区块分隔单独叫“分隔线 / 结构线”，不要混说。

| 用途 | 值 | 变量/用法 |
|------|-----|-----------|
| 全局页面背景 | `--fx-page-background`（`#F5F6F7`） | `bg-background` |
| 卡片背景 | `--fx-neutrals-01` | `bg-card` |
| 弱背景 | `--fx-neutrals-03` | `bg-muted` |
| 站点骨架最低存在感线 | `--fx-neutrals-02` | `border-border-chrome`；为需要几乎隐去的结构边界预留 |
| 站点骨架分割线 | `--fx-neutrals-03` | `border-border-faint`；顶栏下线与侧栏右线 |
| 容器外框 | 浅色：`--fx-neutrals-04` 向白混 45%<br>暗色：`oklch(1 0 0 / 0.07)` | `border-border-container` |
| 弱边框 / 分割线 | `--fx-neutrals-04` | `border-border-subtle` |
| 默认边框 | `--fx-neutrals-05` | `border-border` |
| 强边框 / hover | `--fx-neutrals-08` | `border-border-strong` |
| 输入框边框 | `--fx-neutrals-07` | `border-input` |

- 组件默认边框规格：当前主题默认按 **`1px`** 理解，这是主流 Web UI 的常规基线。
- 边框粗细不是普通主题面板能力：它是组件默认的结构基线，运行时不允许将容器描边加粗或归零；需要差异时通过组件变体和边框强度表达。
- 容器外框：优先讨论“要不要外框”和“外框颜色深浅”，不默认通过加粗来表达。
- 分隔线 / 结构线：单独治理，不纳入“组件边框粗细”的口径。
- 强调边框：只有选中、焦点、错误或其他高强调场景，才考虑 `2px` 或更强语义色。

## 基础色板（16 有色色系 × 12 阶 + 中性灰 20 阶）

> 真相源：`tokens/source/primitive.tokens.json` 保存 Seed，`tokens/source/map.tokens.json` 保存 oklch 派生算法和例外；`theme/foundation.css` 为生成结果，`theme/fx-theme.css` 只赋予语义。
> 变量名格式：`--fx-{色系}-{阶}`，例如 `--fx-orange-09`。

动态 Brand Base 与固定色相共用下表唯一一套公式：`brand.base.stepsSource = palette.steps`。Brand Base 直接从 `color.seed.brand` 推导；当 Brand Seed 与任一固定色相 Seed 相同时，12 阶结果必须逐阶一致。`brand-vivid` 是中性轴和暗色表面等算法使用的归一化锚点，不参与 Brand Base 色阶生成。

### 推导公式

| 阶 | 公式 | 用途 |
|----|------|------|
| 01 | `l + (1-l)*0.90, c*0.06` | 极浅背景 |
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

### 16 有色色系种子色

| 色系变量 | 参考值 | 语义 |
|----------|--------|------|
| `--fx-brand` | `#FF8000` | Brand Base 的品牌 Seed（随主题换肤） |
| `--fx-brand-vivid` | 由 Brand Seed 归一化 | 中性轴和暗色表面等算法锚点，不参与 Brand Base 色阶生成 |
| `--fx-seed-slate` | `#64748B` | 独立中性主题 seed；不得引用由品牌派生的 Neutrals，避免循环依赖 |
| `--fx-seed-deep-orange` | `#F97316` | 深橙 |
| `--fx-seed-amber` | `#F59E0B` | 琥珀 |
| `--fx-seed-yellow` | `#EAB308` | 黄 |
| `--fx-seed-lime` | `#84CC16` | 嫩绿 |
| `--fx-seed-yellow-green` | `oklch(0.74 0.18 137)` | 黄绿（提亮版） |
| `--fx-seed-green` | `#22C55E` | 绿 · 成功 |
| `--fx-seed-teal` | `#14B8A6` | 青 |
| `--fx-seed-cyan` | `#06B6D4` | 青蓝 |
| `--fx-seed-light-blue` | `#0EA5E9` | 亮蓝 |
| `--fx-seed-blue` | `#3B73E8` | 蓝 · 链接/信息 |
| `--fx-seed-indigo` | `#6366F1` | 靛蓝 |
| `--fx-seed-purple` | `#8B5CF6` | 紫 |
| `--fx-seed-magenta` | `#D946EF` | 洋红 |
| `--fx-seed-pink` | `#EC4899` | 粉 |
| `--fx-seed-red` | `#EF4444` | 红 · 错误 |

红色色板 09 阶直接等于红色 Seed：`--fds-g-color-red-base-90: #EF4444`（兼容别名 `--fx-red-09`）；危险操作直接按 09/08/10/05 映射，不另造 Solid 色阶。

## 暗色色板（Dark 10–120）

16 个固定有色色相各自生成一套独立 Dark Map，命名为 `--fds-g-color-{family}-dark-{10~120}`。它不是把 Base 色板反转，也不是只把展示画布换黑：

- 10–80：以 OKLCH `L=0.18` 为暗色表面锚点，按 `0.08 / 0.16 / 0.25 / 0.35 / 0.46 / 0.58 / 0.70 / 0.84` 逐步插值到 Seed；色度按 `0.10 / 0.16 / 0.23 / 0.32 / 0.44 / 0.58 / 0.73 / 0.88` 恢复。
- 90：保持对应固定色相 Seed，不做人工单档覆盖。
- 100–120：向白提升 Seed 明度的 `13% / 27% / 42%`，同时将色度收敛到 `92% / 76% / 58%`，用于暗底上的高亮文字、图标和强调。
- Chromium 审计要求全部 16 个色相的明度严格递增、90 与 Seed 完全一致、相邻 OKLab ΔE 不低于 `0.025`；当前实际最小值为 `0.030`。

Dark Map 只有 FDS 名称，不新增历史 `--fx-*` 别名。动态 Brand 没有固定 Dark Map；Brand Base 直接由原始 Seed 按通用 Base 公式生成，`brand-vivid` 仅供中性轴、暗色表面等独立算法使用。极端 Seed 的可用性由 Theme 审计与 Semantic 前景解析单独治理，组件和页面不得直接挑 Dark Map，必须通过 Semantic。

> 灰色不在有色色系里——全站唯一中性灰是下方 Neutrals 20 阶（结构灰）。不再有独立的"品牌偏色灰"色系。

## 中性色（Neutrals 01–20）

**全站唯一中性灰轴**：变量名 `--fx-neutrals-{01~20}`，用 `color-mix(in oklch, white, neutral-dark N%)` 推导（`neutral-dark` 带品牌色相微量染色）。卡片、文字、边框，以及中性交互面（secondary / muted / ghost·outline 悬浮底）全部取自这里；全局页面画布单独使用 `--fx-page-background`，避免换页面底色时连带改变控件和边框。

| 编号 | 混合比 | 常用场景 |
|------|--------|----------|
| 01 | white | 卡片、容器背景（`--card`）、反白文字、浅色图标 |
| 02 | 2% | 禁用控件底、低存在感结构线 |
| 03 | 5% | 次级背景 muted / secondary 默认底、ghost·outline 悬浮底 |
| 04 | 9% | secondary·muted hover |
| 05 | 14% | secondary·muted active、分割线（`--border`） |
| 06 | 19% | 占位+禁用文字/图标（`--foreground-disabled`） |
| 11 | 49% | 弱信息/caption（`--muted-foreground`）、icon-muted |
| 15 | 73% | 次要文字（`--foreground-secondary`） |
| 20 | neutral-dark | 主文字（`--foreground`）、icon |

### 半透明填充（自适应背景）

实色 neutrals 默认「背景比我浅」；当填充控件放在**透明容器 / 未知宿主底色**上（如全局顶栏 TopBar 的搜索框、图标按钮 hover），实色会和宿主糊在一起。这两个 token 用**前景色 alpha 叠加**，叠在任意底色上都自带相对反差，且深色模式自动随前景翻转。

| Token | 值 | Tailwind | 用途 |
|-------|-----|----------|------|
| `--fill-subtle` | `color-mix(foreground 5%, transparent)` | `bg-fill-subtle` | 透明容器上填充控件的待命底（如顶栏搜索框） |
| `--fill-hover` | `color-mix(foreground 8%, transparent)` | `bg-fill-hover` | 同上的 hover 加深 / 无底色图标按钮 hover |

> 它们是**语义填充**，不是色板色号——色板里没有半透明档。背景已知（如卡片内）时仍用实色 `muted` / `muted-hover`。

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

## 交互色状态阶梯（通用规则）

任何一个需要交互的颜色都按合同声明的阶梯派生，不手挑十六进制。实心操作统一引用 Base 色阶；固定功能色的暗色软底由 `.dark` 语义槽映射到 Dark 20/30/40，动态 Brand 软底继续使用受审计的主题公式。

### 实心操作组

适用：主色和状态色实心操作面。背景色严格走统一色阶；Primary 前景由 Theme Resolver 统一确定，四类功能色通过各自 Semantic Hook 跟随它，不允许为了迁就文字色而另造或压暗背景色阶。

| 态 | 取阶 | 规律 |
|------|------|------|
| 默认 Default | 09 / Base 90 | Seed 基准档 |
| 悬浮 Hover | 08 / Base 80 | 相邻浅一档 |
| 激活 Active / 按下 Click | 10 / Base 100 | 相邻深一档 |
| 禁用 Disabled | 05 / Base 50 | 大幅变浅；组件层不再叠 opacity |

### 浅色组（Tag / Badge / Alert / Ghost 按钮背景）

| 态 | 取阶 | 规律 |
|------|------|------|
| 默认 Default | 01 | 最浅背景 |
| 悬浮 Hover | 02 | 深一阶 |
| 激活 Active / 按下 Click | 03 | 再深一阶 |
| 文字 / 描边 | 09 | 浅色背景上的文字用种子色 |

### 暗色软底组

| 态 | 取阶 | 规律 |
|------|------|------|
| 默认 Default | Dark 20 | 暗色表面上的低强调色底 |
| 悬浮 Hover | Dark 30 | 明度与色度同步提升 |
| 激活 Active / 按下 Click | Dark 40 | 再提升一阶 |
| 链接 Default / Hover / Active | Dark 110 / 120 / 100 | 满足暗底文字对比并保持状态差异 |

### 焦点环 Focus ring

键盘焦点环单独一条：种子色（09）叠 40% 透明，`oklch(from var(--fx-brand-09) l c h / 0.4)`。

### 唯一真相：交互阶来自 Foundation 派生合同

**禁止**用 `color-mix(...)` 现算、`/透明度`（如 `bg-primary/80`、`bg-destructive/10`）这类手法表达交互态——它们绕过色板、各处不一致。一律走对应色系的 12 阶色板。

各类颜色的色板归属：

| 颜色 | 色板来源 | 实心/浅色 |
|------|----------|-----------|
| 主色 primary | `--fx-brand-*`（随换肤变） | 实心组 09/08/10/05 + 浅色组 01/02/03 |
| 功能色 success/info/warning/destructive | 各自 `--fx-green/blue/amber/red-*` | 实心组 09/08/10/05；浅色组 01/02/03 |
| 中性面 secondary/muted | `--fx-gray-*`（灰色板，对齐 Radix 交互区 03/04/05） | 默认 03 / hover 04 / active 05 |

落地 token：
- 主色：`--fx-primary(/-hover/-active/-disabled)` = `--fx-brand-09/08/10/05`；`--fx-primary-light*` = `--fx-brand-01/02/03`
- 功能色：`--fx-{success/info/warning/danger}-light(/-hover/-active)` = 对应色板 01/02/03
- 中性面：`--secondary(/-hover/-active)` = `--fx-gray-03/04/05`；`--muted(/-hover/-active)` = `--fx-gray-02/03/04`
- 焦点环：`--ring` = 种子色 09 叠 40% 透明

> 新增任何可交互色时，按这张表派生，不要临时挑色值、不要用 color-mix 或透明度。

## 列表行高亮色

| Token | 值 | 场景 |
|-------|-----|------|
| `--fx-list-orange` | `#FFF7E6` | 列表行选中 / 高亮·橙（Orange 01） |
| `--fx-list-blue`   | `#E6F4FF` | 列表行选中 / 高亮·蓝（Dark Blue 01） |
