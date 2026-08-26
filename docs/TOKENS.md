---
layer: knowledge
type: spec
last_verified: 2026-08-26
teaches: "公司设计 token 的基础架构、真实值和全局视觉使用规则"
use_when: "AI 要用颜色/圆角/字体/状态样式、生成页面、改 shadcn 组件样式或判断视觉是否符合公司规范时"
---

# fx-ui 设计 Token

> 用途：公司视觉规范的查询表和 AI 生成规则。
> 真相源：`theme/fx-theme.css`。改那里 = 全局换肤，必须先说明影响。
> 改完 `fx-theme.css` 后，跑 `bash scripts/check-tokens-sync.sh` 校验本表的色值有没有漏抄/抄漂——脚本只查不改，发现差异要手动同步本表。

fx-ui 的组件源码来自 shadcn/ui，公司的视觉统一不靠重写组件，而靠 token 注入。

## Agent Token Contract

Agent 不直接从色板挑数值。它应查询由 `docs/data/design-tokens.json` 派生的 `docs/data/agent-tokens.manifest.json`，只选择 semantic token 或组件已经声明的 `stateMappings`；primitive 色板仅供主题实现解析。该 contract 不新增 Token，也不是第二真相源。

主题能力先通过 `npm run fx -- theme show --json` 查询：只允许替换声明过的语义视觉槽，半径、字族、间距和结构性效果不属于主题调用处覆盖面。`npm run fx -- theme audit --json` 与 `npm run check:theme` 只审计当前契约；当前只支持 light，不代表已经支持 dark 或可生成自定义主题。

```bash
# 按意图查语义 token 与组件映射
npm run tokens -- search "Input invalid"

# 追溯一个语义 token 到 CSS 变量与色板引用
npm run tokens -- resolve semantic.destructive --json

# 查看组件允许的 token 与状态映射
npm run tokens -- component Input --json
```

`npm run build:tokens` 会先从 `theme/fx-theme.css` 重建 Token manifest，再重建 Agent contract。`npm run check:agent-tokens` 会阻止派生数据漂移；组件状态映射必须引用已声明的 semantic token，且不得在调用处改写视觉。

统一 Agent CLI 也提供 `npm run fx -- token <query> --json` 与 `npm run fx -- theme`。其中 `npm run fx -- theme build` 只重建现有 CSS 主题的 Token/Agent 产物，**不**接受自由色值、临时组件覆盖或生成额外主题实现。

## 基础架构

### 0. 分层治理

fx-ui 采用主流设计系统分层：**Tailwind 是表达层，FX token 是视觉真相源；企业视觉数值统一映射进 Tailwind 类体系消费**。

- Tailwind 负责“怎么摆、怎么调用”：布局、栅格、间距、断点、对齐、显隐、响应式，以及统一的 class API。
- FX token 负责“值是多少”：颜色、字号、圆角、阴影、边框粗细、动效时长。
- 组件层负责把两者接起来：把 FX 数值挂到 Tailwind 语义类上，用统一类名消费，而不是平行维护两套视觉刻度。

治理口径：

| 维度 | 默认口径 | 说明 |
|------|----------|------|
| `spacing / layout / breakpoint` | **Tailwind 原生** | 保持与 shadcn / Tailwind 工程习惯一致，如 `gap-*`、`px-*`、`grid`、`lg:*` |
| `color` | **FX token → Tailwind 语义类** | 必须走 `--fx-*` / 语义槽 / `bg-primary` 这类映射，不写死十六进制，不长期依赖 Tailwind 默认色 |
| `typography` | **FX token → Tailwind 字号类** | 对外主推荐 `text-sm/base/lg/xl`；`text-control-sm` 仅供 28px 紧凑控件内部使用，底层仍由企业字号 token 驱动 |
| `radius` | **FX token → Tailwind 圆角类** | 组件圆角走 `--radius` 派生档，不另立一套默认刻度 |
| `shadow` | **FX token → Tailwind 阴影类** | 统一 `shadow-l1/l2/l3`，不用 Tailwind 默认 `shadow-sm/md/lg` |
| `border-width` | **FX 结构基线** | 默认 `1px`，由组件和 token 规范固定；不作为普通主题面板的运行时覆写项 |
| `motion` | **FX token / 约定档位** | 动效时长跟随主题或规范档位，不在单页随意发明时长 |

一句话收口：**Tailwind 管形式，FX 管数值；FX 的值映射进 Tailwind 里用。**

### 1. Primitive Token

公司原始视觉值，只在 token 真相源里出现。

| 名称 | 值 | 说明 |
|------|-----|------|
| `fx-primary` | `#FF8000` | 品牌橙 |
| `fx-success` | `#30C776` | 成功绿 |
| `fx-info` | `#0C6CFF` | 信息蓝 |
| `fx-warning` | `#FF7C19` | 警告橙 |
| `fx-danger` | `#F04446` | 危险红 |

### 2. Semantic Token

shadcn/ui 和业务页面真正使用的语义槽。

| 语义 | 值 | Tailwind 用法 | 使用场景 |
|------|-----|---------------|----------|
| `primary` | `#FF8000` | `bg-primary text-primary-foreground` | 主操作、激活态、品牌强调 |
| `background` | `#F7F8FA` | `bg-background` | 页面底色 |
| `foreground` | `#181C25` | `text-foreground` | 主文字 |
| `card` | `#FFFFFF` | `bg-card text-card-foreground` | 卡片、浮层、内容容器 |
| `surface` | `#FFFFFF` | `bg-surface` | 浮起控件白底（outline 按钮等）；与 card 同值、语义独立（card=容器，surface=控件表面） |
| `muted` | `#F2F3F5` | `bg-muted` | 次级背景、弱按钮、代码块 |
| `muted-foreground` | `#91959E` | `text-muted-foreground` | 辅助说明、弱信息 |
| `accent` | `#F2F4FB` | `bg-accent text-accent-foreground` | 悬浮态、轻量高亮背景 |
| `accent-hover` | 橙色 02 阶 | `bg-accent-hover` | 轻量高亮背景的 hover；例如已选表格行 |
| `border` | `#DEE1E8` | `border-border` | 边框、分割线 |
| `input` | `#C1C5CE` | `border-input` | 表单边框 |
| `ring` | `#FF8000` | `ring-ring` | 键盘焦点和可访问性焦点环 |
| `destructive` | `#F04446` | `bg-destructive text-destructive-foreground` | 删除、危险、不可逆操作 |
| `overlay` | `oklch(from neutrals-20 … / 0.2)` | `bg-overlay` | 弹窗/抽屉的**遮罩蒙层**（20%，配合组件的 `backdrop-blur-xs` 模糊，故比主流纯遮罩浅）；透明度烤进 token，直接用不加 `/x` |

> 遮罩归颜色（语义色）：本质是"蒙层色 + 透明度"。从最深中性灰派生跟随色板，**透明度内置**（半透明），Dialog/Sheet/AlertDialog 直接 `bg-overlay`，不写死 `bg-black/10`。z-index 归层级、淡入归动效，是共用机制不是归属。
> 遮罩的**模糊**也收成 token：`--overlay-blur = 2px`，组件用 `backdrop-blur-[var(--overlay-blur)]`，浓淡/模糊一处统管。

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
| ④ 占位 + 禁用 | 表单 placeholder、禁用文字与图标 | `--fx-neutrals-06` | `text-foreground-disabled` |
| 反白 | 主色/品牌背景上的文字图标 | `--fx-neutrals-01` | `text-primary-foreground` |

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

## 圆角

按组件**类型/层级**选档（标签<控件<卡片<弹窗），不是在调用处自由输入数值。固定档位为 `2 / 4 / 6 / 8 / 12 / 16px`，另有 `full` 胶囊档；同一按钮按高度映射：24/28 用 6px，32/36 用 8px。

为方便 Agent 按用途判断，Token manifest 额外提供 `none / inner / element / container / page / full` 六个**语义别名**，它们映射到现有圆角阶，不改变任何已落地组件外观。嵌套圆角表面遵守同心规则：`innerRadius = max(0px, outerRadius - inset)`；该计算只应由组件内部实现，业务调用处不手写 `calc()` 或覆盖圆角。

**为什么采用固定档位**：① 数值容易记忆和验收；② 与现有 2px/4px 节奏一致；③ 组件层级清晰；④ 不允许页面临时造新圆角。`--radius` 仍保留为 shadcn 的常规 8px 基准，语义别名负责表达容器层级。

| 项 | 值 | 用法 |
|----|-----|------|
| `--radius` | `0.5rem`（8px，= rounded-lg） | 基础圆角真相源 |
| `rounded-none` | `0` | 表格、紧贴边缘容器、直角分割块 |
| `rounded-xs` | `2px` | 极小图形、紧凑结构 |
| `rounded-sm` | `4px` | 小标签、嵌套内层 |
| `rounded-md` | `6px` | 24/28 控件、输入框 |
| `rounded-lg` | `8px` | 32/36 控件、常规表面 |
| `rounded-xl` | `12px` | 下拉、浮层、较大容器 |
| `rounded-2xl` | `16px` | Dialog、Sheet、页面级容器 |
| `rounded-3xl/4xl` | 24 / 32px | 特殊大区域，不作为常规组件默认值 |
| `rounded-full` | `9999px` | 胶囊按钮、Badge、头像、开关 |

## 排版（字号 / 字重 / 字体 · 企业 web 规范）

来源：企业 Figma **web 字体规范**（fx-ui 是 web 库，以 web 规范为准；移动端字号另有一套，见 DEC-004）。当前统一口径为**直接使用 Tailwind 常见字号类**，让开发和 AI 都按主流写法调用；这些类背后的真实数值，仍然由 fx-ui 的企业字号 token 控制。

| 主推荐类 | 当前映射 | 字号/行高 | 场景 |
|------|------|------|------|
| `text-xl` | `20 / 30` | 页面/详情标题 | 大标题、页头标题 |
| `text-lg` | `18 / 28` | 模块/卡片/组件标题 | 区块标题、卡片标题 |
| `text-base` | `16 / 24` | 默认正文、菜单、列表、表单 | 主体文案 |
| `text-sm` | `14 / 20` | 标签、按钮、菜单项、辅助文案 | 短文本与辅助信息 |
| `text-control-sm` | `13 / 18` | 28px 紧凑控件内部文字 | 仅由 Button 等已治理组件源码消费，不用于页面正文 |
| `text-xs` | `12 / 18` | 最小辅助信息、紧凑场景 | 不承载正文 |

**实现方式**：
- 页面与组合层新代码统一使用 `text-xs / text-sm / text-base / text-lg / text-xl`；`text-control-sm` 只允许已治理组件源码按尺寸映射使用。
- `theme/fx-theme.css` 覆盖 Tailwind 的 `--text-*` 变量，把企业字号和值注入到这套类里。
- 主题面板继续只改底层 token，不改组件调用代码。
- Web 字号底线是 **12px**：任何正文、标签、角标、头像缩写、示意图文字都不得低于 12px；需要弱化时用颜色、字重、透明层级或空间关系，不用更小字号。

**字号 + 行高**（默认正文 = 16）：

| 工具类 | 字号/行高 | 字重 | 层级/场景 |
|------|-----|------|------|
| `text-xl` | 20 / 30 | bold | 详情页标题 |
| `text-lg` | 18 / 28 | regular·bold | 模块/卡片/组件标题 |
| `text-base` | 16 / 24 | regular·bold | **默认正文** — 菜单、列表、表单、大面积文案 |
| `text-sm` | 14 / 20 | regular·medium | 字段标签、按钮、菜单项、辅助信息 |
| `text-control-sm` | 13 / 18 | regular | 28px 紧凑控件内容；不进入正文角色 |
| `text-xs` | 12 / 18 | regular | 最小辅助信息、紧凑场景 |

**行高随主题字号映射一并调整**（上表"字号/行高"列即定义）。正文/说明**不要手写 `leading-7`/`leading-8`** 把行距抬到 2.0+——那样换行太散，不符合主流正文行高（约 1.5）。

> 治理建议：新增或调整的面向用户文本调用已注册的 `text-{role}` 角色；`text-{size}` 是角色内部复用的基础字号 Token，不再作为业务调用层另行拼接。

### 文本角色

先按文本用途选角色，并在调用处只写对应的 `text-{role}` 工具类；不要凭视觉大小临时拼 `text-{size}` 与 `font-*`，也不要在同一元素叠加两者。`text-{size}` 与 `font-*` 是角色的底层映射，用于追溯，不是第二套调用方式。机器事实在 `docs/data/design-tokens.json#typography.roles`，可用 `npm run tokens -- search "section title"` 查询。

| 角色 | 字号 Token | 字重 Token | 调用 | 用于 | 不用于 |
|------|------------|------------|------|------|--------|
| page-title | `text-xl` | `font-bold` | `text-page-title` | 页面、详情页主标题 | 卡片或表格标题 |
| section-title | `text-lg` | `font-semibold` | `text-section-title` | 区块、卡片、组件标题 | 普通正文 |
| body | `text-base` | `font-normal` | `text-body` | 默认正文、表单值、菜单、列表内容 | 用小字伪装弱信息 |
| label | `text-sm` | `font-medium` | `text-label` | 字段标签、按钮、菜单项、短状态标签 | 多句说明 |
| caption | `text-sm` | `font-normal` | `text-caption` | 辅助说明、提示、元信息 | 关键操作或主要正文 |

### 数据排版

表格和列表列先按字段类型声明，再由 `DataTable` 的 `dataType` 采用对应对齐和字形。机器事实在 `docs/data/design-tokens.json#typography.dataRules`；不以列标题猜数据类型。名称、说明等长文本是否截断仍由具体列内容明确选择 `truncate`，避免组件擅自隐藏业务信息。

| 字段类型 | `DataTable` | 对齐 / 字形 | 场景 |
|------|------|------|------|
| number / currency / percentage | `dataType="…"` | 右对齐 + `tabular-nums` | 数量、金额、百分比 |
| date / identifier | `dataType="…"` | 左对齐 + 等宽数字 + 不换行 | 日期、订单号、手机号 |
| status | `dataType="status"` | 居中 + 不换行 | 短状态、Tag、Badge |
| text | `dataType="text"` 或省略 | 左对齐 | 名称、说明、链接 |

### 混排、代码与编号

这部分是 Agent 和协作者的调用约定，机器事实在 `docs/data/design-tokens.json#typography.conventions`；`npm run tokens -- search "代码 字体" --json` 可查询。

| 内容 | 约定 |
|------|------|
| 中文 / 中英文混排 | 使用默认字距与 `font-sans`，不另造中文字号或字距 API；新增或调整的中文、混排文本不使用 `tracking-tight` / `tracking-tighter`。 |
| 英文全大写 | 仅短缩写或短标签，如 `ID`、`API`、`SKU`；句子、说明和长标题保持原始大小写。 |
| 代码与字段名 | 需要复制或逐字符辨认时使用 `font-mono`：代码、命令、字段名、密钥片段。 |
| 业务编号 | 日期、订单号、手机号等仍走数据字段规则的 `tabular-nums`，不因其包含字母数字就改为代码字体。 |
| 长文本 | 是否截断由实际列或内容容器显式添加 `truncate`；`DataTable` 不自动猜测。 |

### 组件排版映射

组件内部文本先查 `docs/data/design-tokens.json#componentUsage[].typographyMappings`，再读本地源码；可用 `npm run tokens -- component Input --json` 或 `npm run tokens -- component Table --json` 查询。

| 组件 | 元素 | 角色与边界 |
|------|------|------|
| Input | value | `size="md"` 用 body 的 `text-base`；`sm/xs` 是高密度控件降级，不另造角色。 |
| Input | placeholder | 继承当前值的字号，颜色走 `foreground-disabled`；不替代 FieldLabel。 |
| Table | header | label，`TableHead` 用 `font-medium`，只承载短字段名。 |
| Table | cell | 原生 Table 不猜数据类型；使用 `DataTable` 时用 `dataType` 处理数据列，其余按 body 内容呈现。 |

**字重**：`font-normal`(400) 常规·正文 / `font-medium`(500) 中等·标签·按钮·菜单 / `font-semibold`(**600**) 次强调·小标题/卡片标题（500 偏轻、700 偏重时的中间档）/ `font-bold`(**700**) 加粗·页/区块标题·强调（见 DEC-028）。

**字族**：默认 `--font-sans` = `"Inter Variable", -apple-system, BlinkMacSystemFont, "PingFang SC", "苹方", "Microsoft YaHei", "微软雅黑", "Noto Sans SC", Arial, sans-serif`。字体栈按字符 fallback：西文/数字优先命中 **Inter**（自托管 OFL），中文会跳过不含中文字形的西文字体，命中系统中文黑体（苹方/雅黑）或兜底 **Noto Sans SC（思源黑体）**。文档说明字体时按角色拆开写：**中文字体**只写中文会命中的字体，**西文数字**只写拉丁/数字字体；不要把整串 CSS fallback 误写成“中文字体”。主题定制面板按用户语言展示 4 类体验：**系统默认**、**书面雅致**、**代码极客**、**现代几何**；卡片下方只用当前语言的混排样张预览字体效果（中文为 `中文 Aa 123`，英文为 `Abc 123`），不再把具体字体名当说明文案。实际命中仍由平台字体可用性决定。`src/main.tsx` 引入 `@fontsource-variable/inter`、`@fontsource-variable/geist`、`@fontsource/noto-sans-sc`、`@fontsource/noto-serif-sc`。

> 完整企业字号阶（11/14/16/20/22/28 + 中英双套语义变量名 Large Title/Title1/Body1…）见 Figma 字体规范；fx-ui web 当前只落地上面四档，按需再补。

## 间距

间距不单独造 CSS 变量，优先使用 Tailwind spacing scale，让页面节奏和 shadcn 组件密度保持一致。

**计算方式**：每个间距 = 基准单位 × 档位数字。基准 `--spacing = 0.25rem（4px，Tailwind 默认）`，`gap-n = calc(var(--spacing) * n)`（如 gap-4 = 4×4 = 16px）。所有间距落在 **4px 的倍数**上（4 点网格），节奏统一可预测；padding / margin / gap 共用这一套刻度，一律用工具类、不手写任意 px。

| Token | 值 | 使用场景 |
|------|-----|----------|
| `gap-0` | `0 / 0px` | 无间距、紧贴、去掉默认间隙 |
| `gap-0.5` | `0.125rem / 2px` | 极紧凑：图标与文字、徽标内部 |
| `gap-1` | `0.25rem / 4px` | 紧凑图标、微小内部间隔 |
| `gap-2` | `0.5rem / 8px` | 按钮图标、表单项内部间隔 |
| `gap-3` | `0.75rem / 12px` | 章节标题与说明之间 |
| `gap-4` | `1rem / 16px` | 卡片内容、表单字段之间 |
| `gap-5` | `1.25rem / 20px` | 章节标题组与主体内容之间 |
| `gap-6` | `1.5rem / 24px` | 页面区块、小型章节之间 |
| `gap-10` | `2.5rem / 40px` | 文档章节、主内容分组之间 |

## 表格行高

表格行高单独治理，不直接复用通用控件高度。当前 `Table` 的三档真实值为：

| Token | 值 | 场景 |
|------|-----|------|
| `--fx-table-row-height-compact` | `28px` | 紧凑列表、信息密度高的表格 |
| `--fx-table-row-height-default` | `36px` | 默认表格行高 |
| `--fx-table-row-height-comfortable` | `42px` | 宽松列表、需要更强可读性的表格 |

## 阴影

阴影表达元素「离页面多高」（elevation），主题里的「阴影强度」提供 **无 / 低 / 中 / 高** 四档递进；不把复古硬阴影放进 shadow level，复古属于独立视觉风格，不属于主流 elevation 强度。阴影只在浮层/下拉/可交互表面谨慎使用，不作装饰。来源：Figma「图层样式」。**禁用 Tailwind 内置 `shadow-sm/md/lg`**——未映射公司 token，会漂。

| Token | 值 | 场景 |
|------|-----|------|
| `shadow-l1` | 两层：`0 2 6 -2` / `0 4 10 -4` | 浮层菜单、Dropdown — 最近层 |
| `shadow-l2` | 三层：`0 4 12 -4` / `0 8 20 -2` / `0 12 28 0` | Sheet、侧边滑出面板 — 中层 |
| `shadow-l3` | 三层：`0 6 16 -8` / `0 9 28 0` / `0 12 48 16` | Dialog、Modal — 最高层遮罩 |
| `shadow-l1-up` | 两层：`0 -2 6 -2` / `0 -4 10 -4` | 向上弹出的浮层（底部工具栏菜单） |

**计算方式**：一个 elevation token 由两到三层 `0 {y}px {blur}px {spread}px var(--fx-shadow-color-*)` 组成。近层保留落点，远层负责柔和扩散；调用方只选择一档，不叠加多个 elevation token。
- **颜色总开关** `--fx-shadow-color / soft / faint = 8% / 5% / 3%`：均从最深中性灰（带品牌色相微染）派生，**跟随色板**而非写死纯黑。
- **y 偏移 / blur / spread**：随层级升高，偏移和模糊增大；近层的负 spread 收住边缘，L3 最外层的正 spread 保证高层投影仍可见。
- `shadow-l1-up` 是 L1 的 y 取负方向变体；阴影只表达 elevation，不作装饰性边框。

## 动效

动效沿用 shadcn 组件已经使用的模式：`tw-animate-css`、短时长、以及由 `data-open` / `data-closed` / `data-state` 驱动的进入退出。

**规则**：时长短促（**100–200ms**，小浮层快、位移大的稍慢，界面动效是反馈不是表演）；进入/退出**状态驱动**（`data-open`/`data-closed`/`data-state`，不手动计时）；用 `tw-animate-css` 工具类组合 `fade`/`zoom`/`slide`，不为单页临时写关键帧。

| Token / Utility | 使用场景 |
|-----------------|----------|
| `duration-100` | Dialog、Dropdown、Popover、Tooltip 的进入退出 |
| `duration-150` | Sheet 遮罩淡入淡出 |
| `duration-200` | Sidebar、Sheet 内容位移和宽度变化 |
| `animate-in` / `animate-out` | 基于状态的浮层显隐 |
| `fade` / `zoom` / `slide` | 浮层常用组合，不为单页临时发明动画 |

## 层级

层级规则记录 shadcn 浮层已经在用的 z-index 习惯。除非真的出现遮挡冲突，不要临时发明新的 z-index。

**分层逻辑**：从低到高——页面内容 → 局部控件(10–20) → 固定/吸顶头部(40) → 弹层(50)，数字越大越靠近用户、压在越上面。所有弹层（对话框/下拉/气泡/抽屉/提示框）都用最高一档 `z-50`，谁后打开谁在上，不靠更大数字。万一被挡住，归到现有档，**别编更大的数字**（否则越堆越乱）。

| Token | 使用场景 |
|------|----------|
| `z-10` | 局部控件内部层级，例如 Avatar 状态点、Calendar 范围态 |
| `z-20` | Sidebar 拖拽手柄等局部交互热区 |
| `z-40` | 固定 Header、文档顶部导航 |
| `z-50` | Dialog、Dropdown、Popover、Sheet、Tooltip 等浮层 |

## 基础色板（16 有色色系 × 12 阶 + 中性灰 20 阶）

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

### 16 有色色系种子色

| 色系变量 | 参考值 | 语义 |
|----------|--------|------|
| `--fx-brand-vivid` | `#FF8000` | 品牌橙（随 `--fx-brand` 换肤） |
| `--fx-seed-orange-warning` | `#F97316` | 暖橙 Warning |
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

## 图标（颜色 + 尺寸）

图标用 Tabler（线性/面型均默认 `currentColor` 跟随），分三类用色，颜色全部来自色板/文字层级，不另造图标专用色：

**1. 单色图标 — 跟随文字四级层级**

| 用途 | 类 |
|------|----|
| 主图标 | `text-foreground`（neutrals-20） |
| 次图标 | `text-muted-foreground`（neutrals-11） |
| 禁用图标 | `text-foreground-disabled`（neutrals-06） |
| 主色/危险色底图标 | `text-primary-foreground` / `text-destructive-foreground`（neutrals-20） |

**2. 彩色线性图标 — 语义/品牌色**：`text-primary` / `text-success` / `text-warning` / `text-destructive` / `text-info`，分类场景可用 chart 色系（09 阶）。

**3. 面状/反白图标**：彩色圆底（`bg-{色}-09`）+ 白色图标（`text-primary-foreground`）。

**图标尺寸阶**：`size-3`(12) 内联/徽标 · `size-3.5`(14) 小按钮 · `size-4`(16) 默认 · `size-5`(20) 强调/列表 · `size-6`(24) 页面级/空状态。

**粗细 / 形态**：图标库 = **Tabler**（线性是真描边，线宽可调；见 DEC-009）。
- **线宽全局统一**：`theme/fx-theme.css` 的 `.tabler-icon { stroke-width: 1.75 }` 一处控制（1.75 介于偏细 1.5 与 shadcn/lucide 2 之间）；要整体更粗/更细改这一个值，不逐个图标调。
- **线性 vs 面型是语义切换**（对齐 iOS/Material 惯例）：默认/未选态用线性，**选中/激活/强调态用 `*Filled` 实心变体**（如 `IconStarFilled`）。
- 个别图标要单独调线宽，可传 `stroke={n}`（默认 2 被全局 CSS 覆盖为 1.75）。
- **线端/拐角圆角**：由 `stroke-linecap` / `stroke-linejoin` 决定，Tabler 默认即 `round`（圆头圆角，柔和、主流），无需设置。要改硬朗方头，在 `.tabler-icon` 加 `stroke-linecap: butt`（或 `square`）、`stroke-linejoin: miter` 一处统管。Tabler 只有这一套圆头线性风格，没有 Material 那种 Rounded/Sharp 字族切换。

**来源与接入（见 DEC-013）**：图标支持三种来源——内置 Tabler / 第三方库 / 上传自定义，全部从唯一出口 `@/lib/icons` 引用，并登记进 `docs/data/icons.manifest.json`（`name + keywords` 让 AI 按语义检索取用）。
- **内置**：在 `src/lib/icons.ts` 用 `IconX as XIcon` 映射稳定别名。
- **第三方库**：同样在 `icons.ts` 映射出口，调用方不感知来源；注册表 `source` 记 `thirdparty:<库名>`。
- **上传自定义**：SVG 组件放 `src/lib/icons-custom.tsx`（`currentColor` + `viewBox 0 0 24 24`），从 `icons.ts` re-export；上传第三方 SVG 必须先消毒（删 `<script>`/`on*`/外链/写死色值，强制 currentColor）。
- 调用方禁止裸 `<svg>` / `<img src=*.svg>`；新增映射后运行 `npm run build:icons`，`npm run check:icons` 会同时拦截未登记导出与失效登记。

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
| 禁用 Disabled | 04 | 大幅变浅（保留一点品牌语义，但避免看起来仍可点击；组件层不再叠 opacity） |

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
| 主色 primary | `--fx-brand-*`（随换肤变） | 实心组 默认09/hover08/active10/禁用04 + 浅色组 01/02/03 |
| 功能色 success/info/warning/destructive | 各自 `--fx-green/blue/amber/red-*` | 浅色组 01/02/03，文字用 09 |
| 中性面 secondary/muted | `--fx-gray-*`（灰色板，对齐 Radix 交互区 03/04/05） | 默认 03 / hover 04 / active 05 |

落地 token：
- 主色：`--fx-primary` = `--fx-brand-09`、`-hover` = `08`、`-active` = `10`、`-disabled` = `04`；`--fx-primary-light*` = `--fx-brand-01/02/03`
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
