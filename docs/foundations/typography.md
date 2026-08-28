---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "FDS 字族、字号、字重、行高与文本角色规则"
use_when: "查询排版档位、文本角色、数据排版或混排规则时"
---

# FDS 排版规范

> 本文是 FDS Foundation 专题说明；数值与映射的唯一真相源仍是 `tokens/source/*.tokens.json`。总览见 [设计 Token](../TOKENS.md)，统一目录见 [FDS 文档索引](../INDEX.md)。

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

## 文本角色

先按文本用途选角色，并在调用处只写对应的 `text-{role}` 工具类；不要凭视觉大小临时拼 `text-{size}` 与 `font-*`，也不要在同一元素叠加两者。`text-{size}` 与 `font-*` 是角色的底层映射，用于追溯，不是第二套调用方式。机器事实在 `docs/data/design-tokens.json#typography.roles`，可用 `npm run tokens -- search "section title"` 查询。

| 角色 | 字号 Token | 字重 Token | 调用 | 用于 | 不用于 |
|------|------------|------------|------|------|--------|
| page-title | `text-xl` | `font-bold` | `text-page-title` | 页面、详情页主标题 | 卡片或表格标题 |
| section-title | `text-lg` | `font-semibold` | `text-section-title` | 区块、卡片、组件标题 | 普通正文 |
| body | `text-base` | `font-normal` | `text-body` | 默认正文、表单值、菜单、列表内容 | 用小字伪装弱信息 |
| label | `text-sm` | `font-medium` | `text-label` | 字段标签、按钮、菜单项、短状态标签 | 多句说明 |
| caption | `text-sm` | `font-normal` | `text-caption` | 辅助说明、提示、元信息 | 关键操作或主要正文 |

## 数据排版

表格和列表列先按字段类型声明，再由 `DataTable` 的 `dataType` 采用对应对齐和字形。机器事实在 `docs/data/design-tokens.json#typography.dataRules`；不以列标题猜数据类型。名称、说明等长文本是否截断仍由具体列内容明确选择 `truncate`，避免组件擅自隐藏业务信息。

| 字段类型 | `DataTable` | 对齐 / 字形 | 场景 |
|------|------|------|------|
| number / currency / percentage | `dataType="…"` | 右对齐 + `tabular-nums` | 数量、金额、百分比 |
| date / identifier | `dataType="…"` | 左对齐 + 等宽数字 + 不换行 | 日期、订单号、手机号 |
| status | `dataType="status"` | 居中 + 不换行 | 短状态、Tag、Badge |
| text | `dataType="text"` 或省略 | 左对齐 | 名称、说明、链接 |

## 混排、代码与编号

这部分是 Agent 和协作者的调用约定，机器事实在 `docs/data/design-tokens.json#typography.conventions`；`npm run tokens -- search "代码 字体" --json` 可查询。

| 内容 | 约定 |
|------|------|
| 中文 / 中英文混排 | 使用默认字距与 `font-sans`，不另造中文字号或字距 API；新增或调整的中文、混排文本不使用 `tracking-tight` / `tracking-tighter`。 |
| 英文全大写 | 仅短缩写或短标签，如 `ID`、`API`、`SKU`；句子、说明和长标题保持原始大小写。 |
| 代码与字段名 | 需要复制或逐字符辨认时使用 `font-mono`：代码、命令、字段名、密钥片段。 |
| 业务编号 | 日期、订单号、手机号等仍走数据字段规则的 `tabular-nums`，不因其包含字母数字就改为代码字体。 |
| 长文本 | 是否截断由实际列或内容容器显式添加 `truncate`；`DataTable` 不自动猜测。 |

## 组件排版映射

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
