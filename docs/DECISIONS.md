---
layer: knowledge
type: log
last_verified: 2026-08-28
teaches: "fx-ui 重要的技术/协作决策记录：选了什么、放弃了什么、为什么"
use_when: "讨论某个方案前，先查这里是否已经讨论过、有结论"
---

# 架构决策记录

> 记录重要技术或协作决策，防止重复讨论。
> 跟 `docs/CHANGELOG.md` 的分工：这里记"为什么这么定"，CHANGELOG 记"改了什么"。

---

## 如何记录一条决策

```markdown
### DEC-XXX: 决策标题

- **日期**：YYYY-MM-DD
- **状态**：已决定 / 已废弃 / 讨论中
- **决定**：我们选择了 X
- **放弃**：考虑过 Y 和 Z，但没选
- **原因**：选 X 是因为……；不选 Y 是因为……
- **影响**：这个决定会影响到……
- **相关文件**：`path/to/file`
```

---

## 决策列表

### DEC-001: 基础组件一律从 shadcn 拉，不手写

- **日期**：2026-06-07（决策本身更早，此处补记）
- **状态**：已决定
- **决定**：所有基础控件（Button / Input / Dialog / Table 等）一律 `npx shadcn add` 拉取，不手写
- **放弃**：第一版曾尝试由 AI 手搓 CSS 模拟 shadcn 组件外观
- **原因**：手搓组件不仅样式难保真，AI 和工程师都读不懂它的结构和约束，后续维护成本高；shadcn 的 open-code 模式天然解决"组件可读可改"的需求
- **影响**：`src/components/ui/` 下所有文件都必须保持"CLI 拉取 + 可读源码"的状态，禁止手写新组件混入
- **相关文件**：`AGENTS.md`、`HANDOFF.md`（踩坑记录）、`src/components/ui/`

### DEC-002: 治理规则必须形成“文字规范 + 机器事实表 + 可执行检查”

- **日期**：2026-06-12
- **状态**：已决定
- **决定**：凡是会长期约束 AI 或工程师行为的规则，不能只写自然语言；至少要判断是否需要同步沉淀为机器可读事实表，并尽可能接入可执行检查
- **放弃**：只在 Markdown 里写“应该如何如何”，靠人和 AI 每次自觉遵守
- **原因**：纯文字规范容易漂移，尤其是组件 API、token、文档站骨架这类会被代码持续改动的事实；JSON manifest 能让 AI 和脚本读同一份结构化事实，可执行检查能在漂移发生时阻断
- **影响**：新增或修改治理规则时，默认按三件套思考：`text spec` 说明原因和边界，`machine manifest` 记录事实，`check script` 验证源码/文档是否仍对齐
- **相关文件**：`docs/DOCUMENTATION.md`、`docs/TESTING.md`、`docs/DOC_SITE_DESIGN.md`、`docs/data/doc-site.manifest.json`、`docs/data/components.manifest.json`、`docs/data/design-tokens.json`、`scripts/check-doc-site-contract.mjs`

### DEC-003: 灰色种子色彩度定为 C=0.010

- **日期**：2026-06-16
- **状态**：已废弃（被 DEC-006 取代——独立灰色色系已删除）
- **决定**：`--fx-seed-gray` 使用 `oklch(from var(--fx-brand-vivid) 0.65 0.010 h)`，C 锁定为 0.010
- **放弃**：C=0.030（初版）→ C=0.020（中间调整）；两个值都被确认"色相偏色太明显"
- **原因**：灰色继承 brand 色相（橙，H≈55°），C 稍高就会出现可感知的暖橙调；C=0.010 是视觉验证后的边界值——步骤间层次仍可区分，但人眼看不出明显色相偏向。不降到 0.005 以下是因为那会让 12 阶之间的差异消失
- **影响**：后续调整 brand 种子色时，灰色自动跟随色相但彩度保持 0.010 不变；如有争议先看这里，不要凭感觉改值
- **相关文件**：`theme/fx-theme.css`（`--fx-seed-gray`）、`docs/TOKENS.md`（种子色表格）

### DEC-004: fx-ui 不分移动端和 Web 端，一套组件跨端复用

- **日期**：2026-06-16
- **状态**：已决定
- **决定**：组件、token、视觉语言全场景统一，同一套覆盖 PC 和移动，不为移动端单独建组件分支
- **放弃**：不在 `src/components/fx/` 下建 `*-mobile.tsx` 变体；不引入只服务移动端的独立视觉系统（下沉式 tabbar、底部抽屉等）
- **原因**：双倍维护是反目标；统一设计语言才是 fx-ui 体系的核心价值，组件靠 Tailwind 响应式 + 内容驱动自适应不同宽度
- **影响**：组合组件设计需兼顾 PC 详情页和移动列表页两种宽度场景
- **补充（2026-06-17）**：组件结构/token 体系仍是一套；但**字号是例外**——企业 Figma 的 web 与移动端字号刻度不同（web 12/13/15/18 默认 13；移动端 13~28）。fx-ui 当前做 web，字号以 **web 规范**为准；移动端字号刻度以后单独落地，不强行用一套字号通吃。
- **相关文件**：`src/components/fx/`、`docs/DESIGN_STANDARDS.md`、`docs/TOKENS.md`（排版）

### DEC-005: 所有交互态颜色统一从 12 阶色板取阶，禁用 color-mix 和透明度

- **日期**：2026-06-16
- **状态**：已决定
- **决定**：任何可交互色的 hover/active/disabled 一律从 12 阶色板取阶。**统一交互阶梯（仅浅色模式）**：以 09 为默认的色（主色实心、状态实心、链接文字、品牌强调文字）一律 默认09 / hover08（浅一阶）/ active10（深一阶）；其中**主色实心按钮禁用态特例改为 04**，比原 05 更浅，保留一点主按钮语义但不再像可点击；其余品牌/功能色文字禁用仍按 05 控制。浅色/软色组（以 01 为默认的 tag/alert 背景）取 01/02/03；中性面填充（secondary）走灰 02/03/04；无填充控件（ghost / outline）再降一档 hover02/active03。深色模式以后另定，明暗方向会反。
- **放弃**：组件里用 `color-mix(...)` 现算、`/透明度`（`bg-primary/80`、`bg-destructive/10`）表达交互态——三套手法并存、各处不一致
- **原因**：色板是唯一真相源，绕过它就会漂移；统一取阶后换肤、对比度、深浅层次都可预测，组件只引用 token 不再写死算式
- **影响**：新增 `--fx-{success/info/warning/danger}-light-hover/-active`、`--secondary/muted-hover/-active`、`--destructive-light*` 等 token；button/badge 已改为引用 token
- **补充（2026-06-18）**：**浅色态收敛已完成**——全部组件浅色交互态/填充改用实心 token（footer/hover 走 `bg-muted`、危险态走 `bg-destructive-light`、禁用输入走 `bg-muted`、选中卡片走 `bg-accent`、细边框走 `border-border-subtle`），不再用 `/透明度`/`color-mix`。`focus-visible`/`aria-invalid` 焦点环按无障碍惯例保留透明度；`dark:` 暗色态待 DEC 另定。新增门禁 `scripts/check-interaction-tokens.mjs`（接 check-all）防回弹
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`（交互色状态阶梯）、`src/components/ui/*`、`scripts/check-interaction-tokens.mjs`
- **补充（2026-06-29）**：主按钮 default 的禁用底从 `brand-05` 调整为 `brand-04`。原因是 `05 + 白字` 在当前橙色色板里仍显得可点击，`04` 更接近主流禁用观感，同时保留微弱品牌语义。

### DEC-006: 只保留一套中性灰（Neutrals 20 阶），删除独立灰色色系

- **日期**：2026-06-16
- **状态**：已决定
- **决定**：全站只有一套中性灰——`--fx-neutrals-01~20`（白→近黑，带品牌色相微量染色）。删除原来作为第 14 个有色色系的 `--fx-gray-01~12` 和 `--fx-seed-gray`。页面底/卡片/文字/边框/中性交互面（secondary·muted·ghost·outline）全部取自 Neutrals
- **放弃**：两套并行的品牌微调灰（Neutrals 结构灰 + Gray 色板家族）；放弃"结构灰用 Neutrals、Gray 当数据色"的分工方案——老李认为两套贴脸会看出灰得不一样，不如合一
- **原因**：两套灰明度浅区高度接近，一个 card（neutrals）挨着 secondary 按钮（gray）会暴露色差；合成一套，唯一真相，杜绝贴脸不一致
- **影响**：色板由 14 色系 → 13 有色色系 + 中性灰轴；Neutrals 由 19 阶重算为 20 阶（混合比重新分配，现用阶颜色基本不变，仅 foreground 19→20、muted-foreground/icon-gray 11→13 重新指向）；secondary/muted 从 `--fx-gray-*` 改为 `--fx-neutrals-03/04/05`
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`、`src/App.tsx`（色板展示与语义表）

### DEC-007: 图标库从 lucide 换成 Phosphor

- **日期**：2026-06-17
- **状态**：已决定
- **决定**：全项目统一用 **Phosphor**（`@phosphor-icons/react`）替代 lucide-react。线性用默认 `weight="regular"`，面型用 `weight="fill"`
- **放弃**：lucide（只有线性，没有面型/实心变体）；放弃"再拼一个 fill 库"的双库方案
- **原因**：公司图标规范要求线性 + 面状/反白两类，lucide 画不出面型；Phosphor 一个库一个图标名靠 weight 切换线性/面型，9000+ 图标、React 组件化好用，一套库覆盖
- **影响**：新增 `src/lib/icons.ts` 把项目用的图标名映射到 Phosphor 等价图标（业务/组件 JSX 不用改，只把 import 从 `lucide-react` 改到 `@/lib/icons`）；`StarOff` 无 Phosphor 等价，暂用 `Star`；后续新增图标直接从 `@phosphor-icons/react` 取名加进 shim
- **相关文件**：`src/lib/icons.ts`、`package.json`、`docs/TOKENS.md`（图标小节）、`src/App.tsx`（Icon 页）

### DEC-008: 自托管开源字体（Inter + Noto Sans SC）

- **日期**：2026-06-18
- **状态**：已决定
- **决定**：字体从"纯系统字体栈"改为**自托管开源 webfont**：西文/数字用 **Inter**，中文用 **Noto Sans SC（= 思源黑体简体）**，均 OFL 授权、无版权困扰，做到跨平台一致。经 `@fontsource-variable/inter` + `@fontsource/noto-sans-sc`（400/500/700）引入，按 unicode-range 懒加载
- **放弃**：系统字体栈（Mac 苹方 / Windows 雅黑，跨系统不一致）；放弃 shadcn 的 Inter/Geist 单字体（不含中文，中文照样回退系统）
- **原因**：系统栈换台电脑中文字形就变；Inter 只解决西文，中文必须配 Noto Sans SC 才能全平台一致
- **补充说明**：这一轮已经放弃 `text-fx-*` 独立字号类，统一走 Tailwind `text-*`，因此不再需要在 `tailwind-merge` 里单独登记 FX 字号。
- **相关文件**：`theme/fx-theme.css`（`--font-sans`）、`src/main.tsx`（@fontsource 引入）、`src/lib/utils.ts`（cn/twMerge）、`docs/TOKENS.md`（排版·字族）

### DEC-009: 图标库从 Phosphor 换成 Tabler Icons

- **日期**：2026-06-18
- **状态**：已决定（取代 DEC-007 的 Phosphor 选择）
- **决定**：全项目改用 **Tabler Icons**（`@tabler/icons-react`）。线性线宽**可调**（全局 `.tabler-icon { stroke-width: 1.75 }` 一处统管，也可按图标传 `stroke`）；面型用成套 `*Filled` 变体
- **放弃**：Phosphor（`weight` 只有离散档 thin/light/regular/bold，给不了 regular 与 bold 之间的中间线宽，regular 在小尺寸偏细）；lucide（线宽可调但无实心变体）
- **原因**：既要"线宽精确可调"又要"有实心面型"——Phosphor 满足后者不满足前者，lucide 反之；Tabler 两者都有（描边可调 + `*Filled`）。Tabler 线性是真描边（stroke），所以能用 CSS `stroke-width` 统一控制；Phosphor regular 是实心填充路径，无法调线宽
- **影响**：`src/lib/icons.ts` 重新映射到 Tabler 等价名（业务/组件 JSX 不变）；`main.tsx` 去掉 Phosphor `IconContext`，改由 `theme/fx-theme.css` 的 `.tabler-icon` 全局线宽；面型从 `weight="fill"` 改为 `*Filled` 组件；卸载 `@phosphor-icons/react`
- **相关文件**：`src/lib/icons.ts`、`src/main.tsx`、`theme/fx-theme.css`（`.tabler-icon`）、`package.json`、`docs/TOKENS.md`（图标小节）、`src/App.tsx`（Icon 页）

### DEC-010: 布局分"骨架组件 + 栅格工具类"两层，栅格不封 Row/Col

- **日期**：2026-06-18
- **状态**：已决定
- **决定**：整页**骨架**做成 fx 组件 `Layout`（`Layout/LayoutHeader/LayoutSider/LayoutContent/LayoutFooter`，参考 Semi/Ant，侧栏可收起/响应式）；内容区内部的**栅格分栏**保持 Tailwind 工具类（`grid-cols-[repeat(24,…)]` / `col-span-[n]` / `gap-x/y`），**不封装 `Grid`/`Row`/`Col` 组件**。网页也拆成「布局」「栅格」两页对应这两层
- **放弃**：像 Semi/Ant 那样把栅格也做成 `Row/Col` 组件
- **原因**：Semi/Ant 不基于 Tailwind，必须用组件才能排版；本项目用 Tailwind——**栅格能力已存在于类名里**，再包 Row/Col 等于把"工具类"重新塞回"组件"，多一套 API 还更不灵活。而整页骨架是"大段重复结构 + 侧栏交互"，做成组件能复用、少出错，值得封
- **影响**：新增 `src/components/fx/layout.tsx`；默认尺寸（顶栏 56 / 侧栏 240·收起 64 / 底栏 48 / 内容 16→24）见 `docs/LAYOUTS.md`；`docs/data/components.manifest.json` 登记 Layout
- **相关文件**：`src/components/fx/layout.tsx`、`docs/LAYOUTS.md`、`docs/data/components.manifest.json`、`src/App.tsx`（布局/栅格两页）

### DEC-011: 禁用态统一 opacity-50 + cursor-not-allowed，不另造禁用色 token

- **日期**：2026-06-22
- **状态**：已废弃（被 DEC-020 取代——改用语义禁用色 token，不再用 opacity-50）
- **决定**：禁用态统一为 **`disabled:opacity-50` + `disabled:cursor-not-allowed`**，可交互态 `cursor-pointer`。Button 去掉 shadcn 默认的 `disabled:pointer-events-none`（它会屏蔽光标、让 `cursor-not-allowed` 失效），并把各 variant 的 `hover:`/`active:` 加 `enabled:` 前缀，保证禁用时悬停不变色、只显示禁止光标。图标禁用同口径（`opacity-50` + `cursor-not-allowed`；中性禁用用 `text-foreground-disabled`）
- **放弃**：为禁用态单独造语义色 token（如 `--primary-disabled`）
- **原因**：禁用是"整体降透明"的通用表现，shadcn 默认即 `opacity-50`，主流一致；再造禁用色 token 多维护一套且难统一。`pointer-events-none` 会连 `cursor` 一起屏蔽，要显示禁止光标必须去掉它，用 `enabled:` 前缀替代它原本"屏蔽 hover"的作用
- **影响**：`src/components/ui/button.tsx`（base 加 `cursor-pointer`/`disabled:cursor-not-allowed`，各 variant 改 `enabled:` 前缀）；Icon 页交互态示例同口径
- **相关文件**：`src/components/ui/button.tsx`、`docs/components/icon.md`（交互态）、`src/App.tsx`（Icon 交互状态示例）

### DEC-020: 按钮禁用态改用语义 token 实心禁用色（取代 DEC-011 的 opacity-50）

- **日期**：2026-06-25
- **状态**：已决定（取代 DEC-011）
- **决定**：Button 禁用态去掉整块 `disabled:opacity-50`，改用**语义禁用色 token**，各 variant 分别定：default→`bg-primary-disabled`、outline→`bg-surface-disabled`(新增 neutrals-02)+`border-border-subtle`+`text-foreground-disabled`、secondary/ghost→`text-foreground-disabled`、destructive→`bg-destructive-light`+`text-destructive-disabled`（保留淡红）、link/plain→`text-link-disabled`(新增)/`text-foreground-disabled`。保留 `disabled:cursor-not-allowed`
- **放弃**：DEC-011 的 `opacity-50` 整体降透明——用户判断"用透明度不够规范"，且项目本就有 `*-disabled` 语义 token
- **原因**：透明度是整块压暗、非语义；项目 token 体系有专门的禁用色阶（primary/destructive/info-disabled 等），实心禁用色更可控、可换肤、带语义色（危险禁用仍是淡红、链接仍是淡蓝）
- **补充（2026-06-29）**：default 主按钮的禁用底进一步从 `primary-disabled = brand-05` 调浅到 `brand-04`；同时将 `info/link/destructive` 文字型禁用色从 `05` 调浅到 `04`，中性禁用文字从 `neutrals-07` 提到 `neutrals-06`，保留可读性但不再像可点击态。
- **影响**：新增 `--surface-disabled`(neutrals-02)、`--link-disabled`(blue-05，后于 2026-06-29 调整为 blue-04) token（css + design-tokens.json）；`button.tsx` 各 variant 禁用类；分页器等用 Button 的禁用态随之更新
- **相关文件**：`src/components/ui/button.tsx`、`theme/fx-theme.css`、`docs/data/design-tokens.json`

### DEC-012: 场景表筛选 tab 顺序统一规范

- **日期**：2026-06-23
- **状态**：已决定
- **决定**：组件「场景示例」筛选 tab 统一按 **类型 → 状态 → 图标 → 尺寸** 排列；各组件只保留自身存在的维度，相对顺序不变。**语义色/变体归「类型」**，不单设"样式"tab。组件总览矩阵的分组顺序与之对齐
- **放弃**：每个组件各自拍脑袋排 tab（此前 Button 是 类型/尺寸/状态/图标，Link 是 类型/样式/图标/尺寸）；放弃含义模糊的"样式"维度
- **原因**：先"是什么"（类型，含语义色变体）→"什么状态"（状态）→"带不带图标"（图标）→ 量度维度"尺寸"收尾，认知顺序统一、跨组件可预期；图标自然落在尺寸前。"样式"与"类型"边界模糊，语义色本质是链接种类，归类型更清晰
- **影响**：`buttonScenarioFilters`（类型/状态/图标/尺寸）、`linkScenarioFilters`（类型/图标/尺寸，语义色+禁用并入类型）；Avatar/ButtonGroup/Icon 仅 类型/尺寸 已合规
- **相关文件**：`src/App.tsx`（各 `*ScenarioFilters` 与总览矩阵）

### DEC-013: 图标统一注册表——支持内置/第三方/上传三种来源，AI 按 keywords 检索

- **日期**：2026-06-23
- **状态**：已决定
- **决定**：图标支持三种来源——**内置 Tabler / 第三方库 / 上传自定义**，但全部**汇流到唯一出口 `@/lib/icons`** 并登记进 `docs/data/icons.manifest.json`。AI 选图标靠注册表的 **name + keywords 语义检索**，不靠像素识别。自定义图标放 `src/lib/icons-custom.tsx`（`currentColor` + `viewBox 0 0 24 24`），第三方库在 `icons.ts` 用 `IconX as XIcon` 映射。新增 `scripts/check-icons.mjs` 校验：每个登记 name 都能从 `@/lib/icons` 解析、名字唯一、来源合法、自定义图标用 currentColor 无写死色值
- **放弃**：直接在页面里塞裸 `<svg>`/`<img src=*.svg>`；让 AI 凭图标名猜用途；每个来源各自为政无统一出口
- **原因**：AI 不"看"图标，只能按名字/关键词查表取用；没有 keywords，"找个合同图标"无从命中。三种来源若不汇流到单一出口 + 单一注册表，调用方要感知来源、AI 无法发现上传图标、还会出现裸 SVG 硬编码与 XSS 风险。这与 DEC-002「文字规范 + 机器事实表 + 可执行检查」一致
- **影响**：新增 `src/lib/icons-custom.tsx`、`docs/data/icons.manifest.json`、`scripts/check-icons.mjs`（接入 check-all、`npm run check:icons`）；`governance-index.json` 登记 icons-manifest dataset；上传第三方 SVG 必须先消毒（删 `<script>`/`on*`/外链/写死色值，强制 currentColor）；线型/面型成对沿用 DEC-009
- **相关文件**：`src/lib/icons.ts`、`src/lib/icons-custom.tsx`、`docs/data/icons.manifest.json`、`scripts/check-icons.mjs`、`docs/TOKENS.md`（图标小节）

### DEC-014: 新增 `--surface` 控件表面 token，outline 按钮用白(bg-surface)不用页面灰

- **日期**：2026-06-24
- **状态**：已决定
- **决定**：新增语义 token **`--surface`（= 白，独立于 `--card`）**，表示"浮起控件的白底表面"；Button `outline` 变体底色从 `bg-background` 改为 **`bg-surface`**。hover/active 仍 `bg-muted`（灰）
- **放弃**：① 沿用 shadcn 的 `bg-background`；② 在每处手写 `className="bg-card"` 打补丁；③ 直接借 `--card`——值对但语义错（card 是"容器底色"，不是"控件表面"）
- **原因**：shadcn `outline` 用 `bg-background` 假设页面底为白；本项目 `--background = #F7F8FA`（浅灰），描边按钮因此变灰、与设计稿"白底描边"不符。颜色必须走 token（换肤/暗色/单一真相），但白色不能借 `--card`（名实冲突）——所以单立 `--surface`：card 用 `--card`、控件白底用 `--surface`，底值同为白、语义各归各。其它 token 的"借用"（accent 当 hover 底、muted 多用途）值与意图尚贴近，暂不拆，避免 token 过度膨胀
- **影响**：新增 `--surface` / `--color-surface`（fx-theme.css）、登记 design-tokens.json 与 TOKENS.md；所有 outline 按钮（导出/继续/图标按钮/NavMenu 的 +/搜索等）统一白底描边
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`、`docs/data/design-tokens.json`、`src/components/ui/button.tsx`、`src/components/fx/nav-menu.tsx`、`src/App.tsx`

### DEC-015: 二级菜单子项要不要图标，按「对象型 vs 功能型」分

- **日期**：2026-06-24
- **状态**：已决定
- **决定**：导航二级（内联子菜单）子项是否带图标，按导航性质分两套——**对象型导航子项带图标，功能型导航子项纯文字 + 缩进**。CRM 前台菜单的二级子项（客户、销售记录、联系人…）是业务**对象**，带图标（图标=对象标识）；后台/设置类菜单的二级子项（许可信息、部门管理…）是**功能页**，纯文字靠缩进表达层级
- **放弃**：一刀切"二级子项一律去图标"（主流后台常见做法）；也放弃"全都加图标"
- **原因**：主流后台（Ant/飞书/Element）二级子项确实多为纯文字——因为功能项无身份、加图标反而削弱缩进的层级感、窄栏更挤。但 CRM 的二级是「对象导航」（类似 Salesforce 对象级导航），每个对象是有身份的实体，图标是对象标识不是装饰，带图标合理且有辨识价值。所以判定标准是"子项代表对象还是功能"，不是"在第几级"
- **影响**：NavMenu 前台 demo 子项带图标、后台 demo 子项纯文字，两套并存即正确，不需统一；折叠态走整面板 peek（顶层图标列，子项收起隐藏、hover 展开才显示，见 NavMenu）
- **相关文件**：`src/components/fx/nav-menu.tsx`、`src/App.tsx`（NavMenu 前台/后台 demo）

### DEC-016: NavMenu 折叠/固定控件用什么（双箭头 vs 图钉）— 待定

- **日期**：2026-06-24
- **状态**：讨论中（暂保持现状：`«`/`»` 双箭头 + 锁固定 + hover 整面板偷看三套并存）
- **倾向**：① **纯 `«`/`»` 开关 + 图标栏收起**（点图标进 + hover tooltip，去掉锁和整面板偷看）——最主流、对齐 Salesforce/Ant/Dynamics；② 若要"偷看 + 钉住"高级感，**把锁换成图钉 📌**（锁的隐喻是"只读"，不对）。整面板 hover 偷看只在"细条/隐藏"式收起（无图标可点）时才必要；图标栏收起用不上
- **放弃（倾向不选）**：保留"锁"作固定隐喻；三套交互（双箭头/锁/偷看）长期并存
- **原因**：收起态已是图标栏、对象图标可直接点，整面板偷看是重复入口；锁=只读语义、表达"保持展开"不准确。但当前先不动，等定
- **影响**：定了再改 `NavMenuFooter`（控件）与前台 demo 的折叠交互；可能去掉 pin/onPin 与 hover-peek
- **相关文件**：`src/components/fx/nav-menu.tsx`（NavMenuFooter）、`src/App.tsx`（NavMenu 前台 demo）

### DEC-017: 无头组件底层用 Base UI，而非 Radix

- **日期**：2026-06-24
- **状态**：已决定
- **决定**：基础组件（Dropdown/Tooltip/Select/Menu/Dialog…）的无头底层统一用 **Base UI（`@base-ui/react`）**，不引入 Radix。组合走 Base UI 的 `render` prop 模式（`render={<a/>}`），不是 Radix 的 `asChild`
- **放弃**：Radix Primitives（shadcn 经典底层）、Headless UI、Ark UI、React Aria
- **原因**：Base UI 是 **Radix + MUI Base 原班人马合并后的"下一代"无头库**，能力对标 Radix 不缩水、API 更统一、锚点定位内置、更新最活跃（Radix 团队主力已转此），shadcn 新版也在迁。选它是踩在主流演进方向上，不是偏门；对项目实际差别只是组合语法（`render` vs `asChild`）
- **影响**：`src/components/ui/*` 全部 import 自 `@base-ui/react`（无 `@radix-ui`）；写/改组件用 `render` prop 组合；package.json 只依赖 `@base-ui/react`
- **相关文件**：`package.json`、`src/components/ui/*`

### DEC-018: 下拉菜单尺寸规范 + 选项状态选中样式统一

- **日期**：2026-06-24
- **状态**：已决定
- **尺寸**：`DropdownMenuContent`——**默认宽度按内容自适应**（auto），内容窄时即**最小宽 160px**，最宽 **320px**（超长文本截断）；最大高 **320px**（约 10 项，超出列表区滚动，细滚动条），同时受视口可用高度约束：`max-h-[min(20rem,var(--available-height))]`。选择型（菜单宽 = 触发器宽）由调用方加 `w-(--anchor-width)` opt-in，不再作为默认
- **放弃**：默认强制 `w-(--anchor-width)`（图标触发器会被撑到与按钮等宽，操作菜单不合理）、无上限的 `min-w-32`
- **原因**：主流区间（shadcn 128 起 / Ant ~160 / Linear·Notion 实测 200–280），取 160–320 覆盖操作菜单与选择器；硬上限避免菜单顶到屏幕边或无限撑宽
- **搜索空状态**：无匹配时显示居中 muted「无匹配结果」，上下留白 24px（`py-6 text-center`）
- **选中样式统一**：多选（CheckboxItem）与单选（RadioItem）的**选中项文字样式一致**——主色橙字 + 加粗 + 橙勾（`data-checked:font-medium data-checked:text-primary`）。原多选选中是中性黑勾、不变色，用户看不出"已选/可被选择"；统一成橙色高亮后，单/多选靠"能否多选"区分，不靠颜色
- **影响**：`dropdown-menu.tsx` 的 Content 尺寸类、CheckboxItem/RadioItem 选中色；文档 API 表与搜索场景约束
- **相关文件**：`src/components/ui/dropdown-menu.tsx`、`src/App.tsx`

### DEC-019: 组件用正交 prop 组合，不为组合造新组件（全站通用）

- **日期**：2026-06-25
- **状态**：已决定
- **适用范围**：所有组件（不限 Button）；通用规范正文见 `docs/DESIGN_STANDARDS.md`「组件变体与组合规范」
- **决定**：每个组件 = 一组**正交轴**，靠 props 组合：`variant`（语义/类型）/ `size`（尺寸）/ `tone` 或语义色（按组件）/ 原生·data 状态。任意组合合法，按需拼（如 `<Button variant="plain" size="sm" tone="danger">`）
- **放弃**：为某个组合单独封装组件（如 PlainSmallDangerButton）或滥加 variant；会组合爆炸、架空 variant/token 体系
- **规则**：① 选择顺序 variant → size →（需要才）tone → 状态；② 视觉值全走 token，交互态用 `*-hover/active/disabled` 不用透明度；③ 纯图标必须 aria-label + Tooltip；④ 仅当出现现有轴表达不了的新语义才加 variant/组件（如 Button 的 `plain` 无底色），并同步 manifest + 文档 + DEC
- **文档展示**：场景示例按轴分 tab，不铺全矩阵；组件总览并排各轴并体现正交可组合（如 plain 跟随尺寸）
- **首例落地**：Button 新增 `plain` 变体 + `tone`（中性/主色/链接/危险），用于表格操作列、行内弱化操作
- **相关文件**：`docs/DESIGN_STANDARDS.md`、`src/components/ui/button.tsx`、`docs/components/button.md`、`src/App.tsx`

### DEC-021: Table 行高单独治理，不复用通用控件高度

- **日期**：2026-07-01
- **状态**：已决定
- **决定**：`Table` 的三档行高单独使用 `--fx-table-row-height-compact/default/comfortable`，真实值固定为 `28 / 36 / 42`，不再直接复用 `--fx-control-sm/md/lg-height`
- **放弃**：让表格继续借用通用控件高度（当时实际会落成 `28 / 32 / 36`），再在文档里口头写成 `28 / 36 / 42`
- **原因**：表格行高和按钮/输入框高度不是同一语义层。通用控件高度服务表单与操作控件，表格行高服务数据阅读密度；两者强绑会导致文档口径与真实渲染值分叉
- **影响**：`TableHead` / `TableCell` 的密度切换改吃表格专用 token；调试台里“行高”三档现在和真实渲染一致
- **相关文件**：`theme/fx-theme.css`、`src/components/ui/table.tsx`、`docs/TOKENS.md`、`src/App.tsx`

### DEC-021: 拆分 Badge（角标）与 Tag（标签），对齐 Ant 模型

- **日期**：2026-06-25
- **状态**：已决定
- **决定**：把原来混在一个 Badge 里的两件事拆开——**Badge = 角标**（贴载体右上角的 dot 红点 / count 未读数）；**Tag = 标签**（行内状态/分类小药丸，`variant` 状态 + `color` 多彩分类打标）。对齐 Ant Design 的 Badge/Tag 分工
- **放弃**：shadcn 的"单 Badge 兼顾 pill + indicator"——语义混淆，用户分不清；也放弃 Badge 的 `ghost`/`link` 变体（非主流，已删）
- **新增能力**：Tag 的 `color` 分类打标（red/amber/…/purple/pink，软色=色板 01 底 + 07 字 + 03 描边），用于"客户下面贴标签"这类 CRM 打标
- **迁移**：全站原 `<Badge variant=…>`（行内标签）→ `<Tag>`；原 `<Indicator>`（角标）→ `<Badge>`；表格级别/客户标签、agent-surface、CustomerBriefing 等全部迁移
- **影响**：新增 `src/components/ui/tag.tsx` + `docs/components/tag.md` + Tag 文档页/导航/路由；`badge.tsx` 瘦身为角标、`badge.md` 改写；manifest 加 Tag、Badge 改角标；`check-components-manifest.mjs` 的 pill 断言改指向 Tag
- **相关文件**：`src/components/ui/tag.tsx`、`src/components/ui/badge.tsx`、`docs/components/tag.md`、`docs/components/badge.md`、`docs/data/components.manifest.json`、`scripts/check-components-manifest.mjs`、`src/App.tsx`

### DEC-022: Button 按"语义角色"平铺，不按"形态"（基础/描边/文字）分大类

- **日期**：2026-06-25
- **状态**：已决定
- **决定**：Button 文档/分类以**语义角色**平铺 6 个 variant（主操作 default / 次操作 secondary / 危险 destructive / 描边 outline / 幽灵 ghost / 无底色 plain），每个场景直接对应一个源码 variant。**不引入「基础按钮 / 描边按钮 / 文字按钮」这种"形态"大类**
- **放弃**：Ant Design / 公司 Figma 的"形态分大类 + 颜色子维度"组织方式（基础按钮里再分橙/灰/红）
- **原因**：我们 variant 是**平铺**的，硬加"形态"层会让"基础按钮"= 一组 variant（default+secondary+destructive），文档分类与代码 variant 对不上，违反"文档以源码 variant 为准"（AI/工程师按文档找不到对应 variant）；语义角色平铺更诚实、可追溯，且对齐 shadcn。颜色已揉进 variant（destructive=红）或 plain 的 tone，不单列颜色维度
- **影响**：Button「类型」tab 与组件总览「类型」块保持 6 个语义场景平铺；如需"形态感"只在排序/视觉编排上暗示，不新增形态层或 variant
- **相关文件**：`src/components/ui/button.tsx`、`docs/components/button.md`、`src/App.tsx`

### DEC-023: 页面以 `pageRegistry` 为唯一真相源，路由/锚点/渲染全部派生

- **日期**：2026-06-25
- **状态**：已决定
- **决定**：文档站每个页面的「slug → 锚点 + 渲染组件」集中在 `src/lib/page-registry-config.tsx` 的 `pageRegistry` 单一对象。`src/App.tsx` 只负责应用状态、站点骨架和消费注册结果；`getPageFromHash`（hash 折叠成 slug）、右栏 `anchors`、主区渲染分发都从注册表派生；新增页面只改 `pageRegistry` 一处（+ `docsNav` 导航项 + manifest + md）。
- **放弃**：原先并行手写的四套结构——`getPageFromHash` 的 `if` 链、~45 个 `isXxxPage` 布尔、`anchors` 巨型三元、render 巨型三元
- **原因**：同一份 slug 列表抄了四遍，加一个页面要在四处同时接线（TopBar 接线时漏接即 404/空锚点），是典型「多处无唯一真相」。收成 registry 后单点维护、漏接即编译报错
- **保留**：`docsNav`/`topNav`（导航树+搜索+索引的真相源，结构不同不并入）；`isComponentsIndexPage`/`isGovernancePage`/`isComponentArea` 等**分组**判定（用于顶栏高亮，非逐页重复）；`#ai-*` 锚点前缀与 slug 不同名，`getPageFromHash` 单独兜一行
- **影响**：路由注册从 `src/App.tsx` 抽到 `src/lib/page-registry-config.tsx`；后续新增/改页面以该注册表为准，App 不再承载页面模块导入和注册结构。
- **相关文件**：`src/lib/page-registry-config.tsx`、`src/lib/page-registry.ts`、`src/App.tsx`

### DEC-024: 列表页走可组合拆分，不做单体 ListPageBlock

- **日期**：2026-06-26
- **状态**：已决定方向，块待落地（#2）
- **决定**：列表页 = `CrmAppShell`（外壳）+ `PageHeader` + `ListToolbar` + `DataTable` + `Pagination` **拼装**，不绑成一个单体 `ListPageBlock`。对齐现代主流（shadcn/TanStack：故意不出 ProTable，给可组合 DataTable 自行拼）。
- **放弃**：单体配置式（Ant ProTable 那种一个组件吃下列/请求/工具栏/分页）——API 庞大、难偏离。
- **要拆出的两块（薄、受控、不引 TanStack）**：
  - `DataTable`：表格 + 勾选(全选/半选) + 行操作；中间列由 `columns`（每列一个 `cell` render 函数）驱动。
  - `ListToolbar`：筛选按钮 + 复合搜索(scope+input) + 视图切换 + 右侧额外动作。
  - 复用现成：`PageHeader`(fx)、`Pagination`(ui)。
- **必须可改动（核心要求）**：列定义(`columns`)、工具栏配置、头部、行操作都做成**参数化 + 受控**，页面侧只换数据/列/配置，**不写死**。换个列表页 = 换 columns/数据，不复制结构。
- **放置**：先落 `src/components/recipes/`（轻，只登记 ARCHITECTURE）跑通；稳定后升级到 `src/components/fx/`（对应架构候选 `EntityTable`/`SearchToolbar`，届时补 manifest+文档+check）。
- **页头处理（已落地 2026-06-26）**：现成 fx `PageHeader` 是「内容页大标题」（`text-xl` + `pb-4`），不适配列表页「紧凑标题栏」（h-12 + `text-lg` + 视图下拉），硬套要覆盖（踩红线 7）。故**单独沉淀 `ListPageHeader` block**（`src/components/recipes/list-page-header.tsx`），三轴变体由 props/slot 决定：① `views?` 不传只剩标题、传了出「客户 ｜ 全部客户 ⌄」视图下拉；② `actions` 插槽 0..N 动态；③ 操作按钮样式（描边/主色）由页面定。**变体轴是用户明确给出的（非猜测），故 N=1 即抽**（用户决定，跳过"等第二页"默认）。`PageHeader` 留作内容页用，不强行复用。
  - **相关文件**：`src/pages/templates/customer-list-template.tsx`、`src/App.tsx`（仅负责路由装配）、`src/components/fx/page-header.tsx`、（新）`src/components/recipes/data-table.tsx`、`list-toolbar.tsx`

### DEC-025: 「生成 + 内置设置面板」处理用户自调，不做可视化搭建器（暂搁置）

- **日期**：2026-06-26
- **状态**：**已定方向，暂搁置**（不动手；想做时从客户列表页的"列设置/工具栏开关"齿轮原型起步）
- **场景**：用户「生成一个列表页 → 自己在页面上调整一些东西（列显隐/工具栏有啥/视图）→ 实时生效」。
- **决定**：走 **「生成 + 内置设置面板」**——生成的列表页自带一份运行时 `config` + 一个齿轮设置面板（表单：勾选/排序），用现成 block 实时重渲染，可选持久化（localStorage/后端）。**"可调"严格限定在 block 暴露的合法变体轴**（列显隐/排序/宽度、工具栏各件开关、头部标题/视图/操作显隐、表格密度/勾选），用户碰不到样式/结构，token + 红线不被绕过。
- **放弃**：① 可视化拖拽搭建器（Puck/amis/Appsmith 那类"搭任意页"平台）——数周级、杀鸡用牛刀，且要让其渲染服从我们 token/红线，成本高；② 让用户自由布局/塞任意组件/改样式（破坏治理）。
- **原因**：用户要的是"调已生成页的可变部分"，不是"搭任意页"。主流 SaaS 给终端用户的几乎都是前者（如 CRM 齿轮的列设置 + 保存的视图）。我们 block 本就 props 驱动，把变体 props 提升成 `config` + 一个设置面板即可，**几天级**，并能接回生成器（生成即自带可调）。
- **影响（落地时）**：生成器模板改为吐 config-driven 页面 + 内置设置面板；新增一个"列表页设置面板" block。
- **相关文件**：`scripts/gen-list-page.mjs`、`src/components/recipes/*`、`docs/PAGES.md`

### DEC-065: 受控页面与区块搭建器取代 DEC-025 的“仅设置面板”范围

- **日期**：2026-08-06
- **状态**：已决定，MVP 实施中；本决策覆盖 DEC-025 对“可视化搭建器”的否定，但保留其 token 与 Block 边界。
- **决定**：搭建器支持选择已登记页面预设、对已登记 Block 进行添加、删除和排序、以及编辑已声明属性；运行时 schema 只允许 `page-builder.manifest.json` 中存在的模板、槽位、Block 与属性。首个模板是客户列表。
- **不做**：不接受任意 JSX、HTML、CSS class、原始色值、圆角、阴影、像素间距；不允许把任意组件拖入任意位置；不引入脱离 schema 的“自由画布”。
- **原因**：当前目标从“调一张已生成页面”扩展为“受控搭建页面和区块”，但生产质量仍依赖已验证 Block、token 和视觉回归。结构自由度必须由 slot contract 管理，而不是由样式编辑器管理。
- **影响**：新增 `PageBuilder` Block、`docs/data/page-builder.manifest.json` 及其校验；模板在发布前仍需完成页面/视觉检查。拖拽仅能作为未来的排序手势，不能扩大 schema 权限。
- **相关文件**：`docs/data/page-builder.manifest.json`、`scripts/check-page-builder.mjs`、`src/components/recipes/page-builder.tsx`、`docs/PAGES.md`

### DEC-026: 暗色模式 token 方案（class .dark 触发，覆盖语义槽）

- **日期**：2026-06-26
- **状态**：已决定（落地 DEC-005 里挂起的"暗色以后另定"）
- **决定**：暗色由 `theme/fx-theme.css` 的 `.dark { … }` 块**覆盖语义槽**实现（`@custom-variant dark (&:is(.dark *))` 已配，`.dark` 加在 `<html>` 即全站生效）。表面用品牌微染 oklch（C 0.008）由暗到亮分层（bg 0.165 / card 0.205 / popover 0.225 / 交互面 0.255+）；**边框/输入用白色 alpha**（`oklch(1 0 0 / .06~.26)`，叠任意暗面自适应）；前景 0.955/0.72/0.64/0.45 四级；品牌/状态色保留色相、暗底上提一档（brand-08 等），**软底 `-light` 改 `color-mix(色 + card)` 暗调**；遮罩转黑 alpha；warning 亮黄配深字。`--fill-subtle/-hover`（前景 alpha）自动适配无需改。
- **放弃**：① 翻转整条 20 阶 neutrals（牵连大、易错）——改为只覆盖语义槽，组件用语义即自动适配；② `prefers-color-scheme` 媒体查询——用 class 切换可控、可持久化。
- **原因**：语义槽是组件的真实引用面，覆盖它一处即全站翻；class 触发便于做切换 UI + 记忆。
- **影响**：新增 `.dark` 块；切换 UI 见 DEC（待）/HANDOFF；暗色交互阶梯方向与浅色相反（浅色 hover 变浅、暗色 hover 变亮）。深色具体取值后续按真机对比微调。
- **相关文件**：`theme/fx-theme.css`

### DEC-027: 中文字族改"优先系统苹方/雅黑，Noto Sans SC 退为兜底"（部分修订 DEC-008）

- **日期**：2026-06-26
- **状态**：已决定（部分取代 DEC-008 的中文字族选择；拉丁仍用 Inter 不变）
- **决定**：`--font-sans` 中文优先级改为 **PingFang SC / 苹方 → Microsoft YaHei / 微软雅黑 → Noto Sans SC（兜底）**。拉丁/数字仍 Inter（对齐 showcase 默认 sans 档）。
- **放弃**：DEC-008 "中文一律 Noto Sans SC 求跨平台一致"——实测 Noto（思源黑体）字形偏重、不如系统苹方顺眼，且与参考站（system Chinese）观感有差。
- **原因**：观感优先。Mac/Win 用系统中文字（苹方/雅黑）更精致；缺系统中文字的环境仍回退已自托管的 Noto Sans SC，不裸奔。代价：跨平台中文字形不再 100% 一致（可接受）。
- **影响**：`@fontsource/noto-sans-sc` 仍保留加载（作兜底）；视觉基线随中文字形变化已重定。
- **相关文件**：`theme/fx-theme.css`（`--font-sans`）、`docs/TOKENS.md`（排版·字族）

### DEC-028: 字重补 semibold(600) 档，并把文档站展示标题降一档对齐参考站

- **日期**：2026-06-26
- **状态**：已决定
- **决定**：① 字重阶从 400/500/700 三档补为 **400/500/600/700** 四档——`font-semibold`(600) 作"次强调/小标题/卡片标题"档（500 偏轻、700 偏重之间的中间档，且文档站早已在用，此为扶正）。② 文档站**展示型标题**降一档对齐参考站 component-library-showcase：页标题 `text-4xl(36)→text-3xl(30)`、区块标题 `text-2xl(24)→text-xl(20)`，均保留 `font-bold tracking-tight`。
- **放弃**：① 只用 700 不要 600（小标题没有合适中间字重）；② 维持 36/24 大标题（比参考站冲一档、不够克制）。
- **原因**：参考站观感更稳，归因为标题字号小一档 + 小标题用 semibold。字色阶（slate-900/700/500/400 ↔ 我们 foreground/-secondary/muted-foreground/disabled）方向本就一致，无需动。
- **范围边界**：只动文档站自身展示标题；业务/组件也统一走 Tailwind `text-*`，字号值仍由 `theme/fx-theme.css` 注入。`font-semibold` 是 Tailwind 原生类，无需加 token CSS。
- **相关文件**：`src/App.tsx`（标题 class）、`docs/TOKENS.md`（排版·字重）

### DEC-029: Card 加 `elevated` 浮起变体（默认平卡）

- **日期**：2026-06-27
- **状态**：已决定
- **决定**：`Card` 新增 `elevated?: boolean`（默认 `false`）。`false`=平卡（现状：`rounded-xl` + `ring-1`，无阴影）；`true`=加 `shadow-l1` 浮起。文档站总览卡等用 `<Card elevated>`，统一观感。
- **放弃**：① 让所有 Card 默认带阴影——B 端业务卡通常是平的，默认浮起不合规范；② 在调用处用 `className="shadow-l1"` 覆盖——违反红线 7（要变体不要覆盖），故收成组件 variant 走治理。
- **原因**：阴影表达 elevation，是组件该提供的正交开关；默认无、按场景 opt-in，既保持 B 端平卡习惯，又让文档站/营销页能要质感。
- **相关文件**：`src/components/ui/card.tsx`、`docs/components/card.md`、`src/App.tsx`（StandardDocPage 总览卡用 elevated）

### DEC-030: 字体主题做 4 档中英成对配置，字体必须可商用且优先本地托管

- **日期**：2026-06-27
- **状态**：已决定（基础落地；英文字体精确替换可后续迭代）
- **背景**：参考 `component-library-showcase` 的字体主题能力：`sans / serif / mono / geometric` 四档，默认 `sans`。英文字体分别是 Inter、Playfair Display、JetBrains Mono、Space Grotesk；默认主题 `fontFamily: "sans"`。
- **决定**：后续 fx-ui 也做 **4 个字体主题配置**，并且每一档都要有**英文 + 中文一一对应**的字体栈。字体选择必须满足：① 可商用；② 可本地托管或通过 npm/fontsource 等依赖落地；③ Windows / macOS / iOS / Android 都有明确 fallback；④ 中文不裸回退到不可控系统宋体。
- **初始候选配对**：
  - `sans` 默认企业 UI：英文 `Inter` + 中文 `Noto Sans SC` / 系统 `PingFang SC, Microsoft YaHei` fallback。
  - `serif` 雅致展示：英文 `Playfair Display` + 中文 `Noto Serif SC`。
  - `mono` 极客代码：英文 `JetBrains Mono` + 中文 `Noto Sans Mono CJK SC` 或保守回退 `Noto Sans SC`（中文 mono 字体体积大，落地前单独评估）。
  - `geometric` 现代几何：英文 `Space Grotesk` + 中文候选 `Source Han Sans SC` / `Noto Sans SC`（优先选择与几何英文字形气质接近、屏显稳定的黑体）。
- **中文可商用候选池（至少 3 套）**：`Noto Sans SC`、`Noto Serif SC`、`Source Han Sans SC`（思源黑体），均按开源字体许可证路径评估；后续如引入霞鹜文楷等展示字体，必须先确认 license、字重覆盖和文件体积。
- **落地约束**：不得直接依赖线上 Google Fonts CDN；生产优先使用本地字体包 / 自托管字体文件，保留 license 说明。移动端只加载必要字重，避免中文字体体积拖慢首屏。字体主题应通过 token/class 切换，不在组件调用处写死 `font-family`。
- **放弃**：① 只配置英文字体、中文交给浏览器随机 fallback；② 直接全量加载所有中文字体全字重；③ 为某个页面临时写死字体。
- **补充（2026-06-29）**：主题面板已先落地 4 档中英独立字体栈：中文 `sans/serif/mono/geometric` 不再共用同一套字体；`serif` 加载 `@fontsource/noto-serif-sc`，`geometric` 使用已安装的 `Geist Variable` + 系统现代黑体 fallback，`mono` 先走系统等宽 + 中文黑体兜底。文档解释字体时必须按“中文字体 / 西文数字”角色拆开，不能把整串 CSS fallback 误称为中文字体；主题面板只保留混排预览样张。Playfair / JetBrains Mono / Space Grotesk 暂未新增依赖，后续如需要更贴近参考站再单独评估包体和授权。
- **相关文件（落地时）**：`src/App.tsx`、`src/main.tsx`、`theme/fx-theme.css`、`docs/TOKENS.md`、`docs/data/design-tokens.json`

### DEC-031: “边框粗细”在主题语境里默认指组件默认边框规格

- **日期**：2026-06-29
- **状态**：已决定
- **决定**：在 fx-ui 的主题、token 和组件讨论里，默认把“边框粗细”解释为**组件默认边框规格**，即组件外轮廓通常是 `1px` 还是 `2px`。当前主题基线定为 **`1px`**。
- **放弃**：把“边框粗细”混用为颜色深浅、容器有无外框、或内部结构分隔线强弱。
- **原因**：主题定制最常讨论的是组件层面的默认描边规则，直接锚定到组件外轮廓最符合主流语境，也最利于 token 治理。分隔线和边框强度本来就是不同维度，混说会导致全局改动误伤内部结构线。
- **影响**：后续文档与讨论统一按三层口径：
  1. “边框粗细” = 组件外轮廓线宽（默认 `1px`）
  2. “边框强度” = 外轮廓颜色深浅（如 `border-border-container` / `border-border` / `border-border-strong`）
  3. “结构线 / 分隔线” = 表格内线、区块分隔线，单独治理，不跟组件外框绑定
- **补充（2026-07-22）**：不在普通主题面板开放边框粗细。它是固定的结构基线，不是用户偏好；运行时覆写曾让 `Card variant="outline"` 的 1px 描边被归零，破坏组件变体契约。容器需要更强层级时，由组件 `variant` 和语义边框强度决定，不能靠全局宽度覆写。
- **相关文件**：`docs/TOKENS.md`、`theme/fx-theme.css`、`src/components/fx/component-playground.tsx`

### DEC-032: 新增组件必须登记主题能力，检查从 manifest 派生

- **日期**：2026-06-29
- **状态**：已决定
- **决定**：以后新增基础组件或 fx 组合组件，固定流程为：`npx shadcn add` 拉组件 → 读取源码 API 和 `data-slot` → 在 `docs/data/components.manifest.json` 登记组件事实与主题能力 → 补组件文档与文档页示例 → 运行 `npm run check`。主题能力（如语义色、圆角、阴影）以后以 manifest 为事实源，检查脚本从 manifest 派生，不在脚本里硬编码一串组件清单。
- **放弃**：① 新组件加完只写页面示例，不登记主题能力；② 每新增一个规则就写一个独立检查脚本；③ 依赖人工记忆判断某个组件外框是否应该被主题影响。
- **原因**：组件是否跟随主题属于长期结构事实，容易在恢复页面或批量重构时被悄悄覆盖。把主题能力收进 manifest，可以让新增组件接入流程稳定，同时避免检查无限膨胀。
- **影响**：`docs/MAP.md` 的组件新增路线加入“补 manifest 主题能力”；后续扩展 `scripts/check-components-manifest.mjs` 或主题契约检查时，优先读取 manifest 里的能力声明，组件外框靠 `data-slot` 定位，结构线/分隔线不默认跟随组件主题。
- **相关文件**：`docs/MAP.md`、`docs/data/components.manifest.json`、`scripts/check-components-manifest.mjs`、`theme/fx-theme.css`

### DEC-033: 主题里的阴影强度只保留 elevation 递进，不混入复古硬阴影

- **日期**：2026-06-29
- **状态**：已决定
- **决定**：主题定制面板的「阴影强度」只保留主流 elevation 递进，不混入复古硬阴影。当前收口为 `none / low / medium / high` 四档：无、低、中、高。
- **原因**：主流设计系统把 shadow 作为 elevation / layer token 管理，表达层级高度和弥散程度；复古硬阴影是独立视觉风格，不是阴影强度。把它放在 Shadow Level 里会让主题能力不正交，也容易误导用户。
- **兼容**：旧配置里若存过 `shadowLevel: "retro"`，运行时回落到 `high`。
- **相关文件**：`src/App.tsx`、`docs/TOKENS.md`

### DEC-034: Tailwind 作为表达层，FX token 作为视觉真相源

- **日期**：2026-06-29
- **状态**：已决定
- **决定**：fx-ui 采用主流设计系统分层：**Tailwind 负责表达“怎么调用/怎么排版”，FX token 负责定义“具体值是什么”；企业视觉数值统一映射进 Tailwind 类体系消费**。排版统一收口到 `text-xs / text-sm / text-base / text-lg / text-xl`。
- **分层口径**：
  1. **布局/结构层**：继续优先用 Tailwind 原生工具类，如 `flex` / `grid` / `gap-*` / `px-*` / `col-span-*` / 响应式断点。
  2. **视觉语义层**：颜色、字号、圆角、阴影、动效时长优先收口到 FX token，再映射到 Tailwind 类或语义槽消费；边框粗细是组件受治理的固定结构基线，不作为主题调用面。
  3. **组件层**：组件默认样式只引用语义 token 或已治理过的工具类，不在调用处混入另一套默认视觉刻度。
- **放弃**：① 同一语义长期同时允许第二套 FX 字号类与 Tailwind `text-*` 双轨并存；② 为了“灵活”在组件调用处临时选 Tailwind 默认视觉值；③ 再造一层“FX 双写法”与 Tailwind 平行存在。
- **原因**：主流体系（Tailwind theme variables / shadcn semantic tokens）都是“token 作为真相源，utility 作为调用 API”。如果默认视觉刻度双轨并存，后续换肤、缩放、统一治理都会漂；而布局类保留 Tailwind 原生，则能继续保持工程效率和 open-code 的可读性。
- **补充说明**：像 `13px`、`15px` 这类企业字号，不走“在 Tailwind 默认字号基础上再乘百分比”的长期方案，而是直接定义 token，再映射成 Tailwind 类。现在不再保留 `text-fx-*` 旧口径；长期只保留 `text-xs / text-sm / text-base / text-lg / text-xl`。百分比推导可临时试验，但不作为治理基线。
- **影响**：
  1. `spacing`、栅格、断点继续沿用 Tailwind 原生体系。
  2. `color / typography / radius / shadow / motion` 统一按 FX token 治理；`border-width` 按组件结构基线治理。
  3. 排版调用层统一写 Tailwind `text-*`，具体值由 token 注入。
  4. 主题面板这类“全局主题能力”必须只改 FX token，不以局部类覆盖代替。
- **相关文件**：`docs/TOKENS.md`、`docs/LAYOUTS.md`、`theme/fx-theme.css`、`src/App.tsx`

### DEC-035: 真相源与所有引用项必须联动同步

- **日期**：2026-07-01
- **状态**：已决定
- **决定**：凡是有明确真相源的内容，所有引用到它的文档、网页、示例、manifest、数据视图、演示页面都必须和真相源建立联动关系。改动时按“真相源 ↔ 引用项”整条链路同步更新，不能只改其中一头。
- **放弃**：把网页、Markdown、JSON、示例页当成彼此独立维护的静态副本；或者只靠人工记忆“顺手同步”。
- **原因**：真正会漂移的不是“文档”单点，而是整条引用链。只改一处，其他被引用落点就会过期，最后页面、文档、机器事实、源码各说各话。把联动规则明确下来，才能让所有落点共享同一事实。
- **影响**：以后涉及 token、组件 API、manifest、文档示例、页面预览、数据视图时，先确认真相源，再顺着引用关系检查所有上游/下游落点；如存在引用链，变更必须整链完成，不能留下孤立副本。
- **相关文件**：`AGENTS.md`、`docs/MAP.md`、`docs/DOCUMENTATION.md`、`theme/fx-theme.css`、`docs/data/*.json`、`src/App.tsx`

### DEC-036: 文档、manifest、生成脚本按用途分层

- **日期**：2026-07-01
- **状态**：已决定
- **决定**：fx-ui 采用主流治理分层：**解释性内容写 Markdown；会被页面/AI/脚本共同消费的结构事实写 manifest；能从真相源稳定推导出的副本优先用生成脚本产出**。
- **放弃**：① 所有规则都只写 Markdown；② 为了“统一”把所有内容都 JSON 化；③ 同一份结构事实在 Markdown、JSON、页面 JSX 里各维护一份。
- **原因**：Markdown 适合表达“为什么”和“边界”，但不适合做页面与脚本共享的数据源；manifest 适合结构化事实，但不该承载长篇解释；能派生的副本继续手填，只会制造漂移。分层后，既保留可读性，也减少重复维护。
- **影响**：以后新增治理内容时，先判断它是解释、事实还是可派生副本；解释进 `docs/*.md`，事实进 `docs/data/*.json`，可派生内容优先补 `scripts/build-*.mjs`。禁止制造“双真相源”。
- **相关文件**：`docs/DOCUMENTATION.md`、`AGENTS.md`、`docs/data/*.json`、`scripts/build-*.mjs`

### DEC-037: 组件配方台把语义 Token 作为受控属性，不开放原始视觉值

- **日期**：2026-07-14
- **状态**：已决定
- **决定**：后续组件配方台由“结构树 + 真实组件预览 + 属性编辑”组成，属性面板同时支持真实组件 props 与组件声明过的视觉 Token 槽位。Token 选择器只展示语义 Token（例如 `background`、`foreground`、`primary`、`destructive`、`border`、`surface`），不把十六进制色值、色板原始阶梯、任意 Tailwind 视觉类或自由 CSS 作为可编辑选项。状态语义层只读展示语义 Token 对应的色板名称，名称必须从 token manifest 自动派生；界面不展示 `oklch/rgb` 原始计算值，色板名称不得回写为配置或成为第二真相源。
- **架构口径**：fx-ui 当前采用 **两层 Token 命名空间 + 一层组件用法**，即 `Primitive 色板 → Semantic 语义 Token → Component Usage 组件属性/状态消费规则`。`Component Usage` 是“哪个组件的哪个属性、在哪个状态使用哪个语义 Token”的映射事实，不是 `--input-border-hover` 这类独立组件 Token。制作台可以把三段关系可视化，但必须标为“组件用法 → 语义 Token → 色板”，不得宣称当前已有三层 Token。
- **编辑边界**：每个组件可编辑哪些 Token，必须由组件契约按槽位声明，例如 `backgroundToken`、`textToken`、`borderToken`；制作台不能把所有 Token 无差别开放。结构零件、真实 props 和 Token 槽位共用一份结构数据，实时预览、生成 JSX、DOM/尺寸/行为验证都从该数据派生。
- **组件 Token 准入**：默认沿用 shadcn 的语义槽，由组件源码直接消费语义 Token；只有某个组件确实需要长期独立换肤、跨变体复用且通用语义无法准确表达时，才单独评估新增组件 Token，并走 token SSOT、文档、manifest 和检查的完整治理。不得为每个组件状态批量生成组件 Token。
- **生效确认**：Token 变更必须同时通过四个信号确认：真实仓库组件即时重渲染、实际 DOM/CSS 变量可追踪、生成代码与预览一致、TypeScript/组件契约/token 检查通过。只改变面板选中值但未影响真实组件，不算生效。
- **治理边界**：页面或业务调用处仍禁止用 `className` 临时覆盖组件视觉。配方台中的 Token 编辑属于组件作者模式，只能写入已声明槽位并生成受治理的 variant、组件映射或草稿；一次性页面组合只能选择现有 variant 和语义能力，不能借制作台绕过组件治理。
- **放弃**：① 自由颜色选择器；② 原始色板值直接绑定组件；③ 任意圆角、边框、padding 和 CSS 输入；④ 预览与生成代码各维护一份状态；⑤ 把视觉组合伪装成不存在的组件 prop。
- **原因**：语义 Token 能表达用途并继续跟随主题，原始视觉值只能表达当前外观。将 Token 纳入制作台可以提升组合效率，但若不限制槽位和作用层级，会退化成调用处样式覆盖，破坏 fx-ui 的 token SSOT、variant 治理与可验证性。
- **后续落地**：制作台开工时，将组件可编辑 Token 槽位写入 `docs/data/*.json` 的唯一机器事实，并让属性面板和检查脚本共同消费；在此之前不提前维护一份未被实现消费的 manifest。
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`、`docs/DOC_SITE_DESIGN.md`、`docs/data/design-tokens.json`、`docs/data/components.manifest.json`、`src/components/fx/component-playground.tsx`

### DEC-038: InputAction 用受治理变体承载紧贴输入框的主搜索按钮

- **日期**：2026-07-15
- **状态**：已决定
- **决定**：`InputAction` 保持 `icon` 默认变体，并新增 `primary` 变体承载紧贴 `InputGroup` 的主搜索按钮。搜索图标前置/后置、固定范围标签和主按钮都继续由 `InputAffix` / `InputAddon` / `InputAction` 结构零件组合，不新增 `search` prop。范围下拉 + 全局搜索继续使用已有 fx `TopBarSearch`。
- **放弃**：① 在每个调用处给 Button 临时覆盖圆角、底色和高度；② 给 Input 新增 `search`、`scope` 等业务伪 prop；③ 把 TopBarSearch 的全局范围语义塞进基础 Input。
- **原因**：主搜索按钮是输入组合中的一个可见动作，不是新的输入框类型。变体让视觉和禁用态由组件层统一治理，同时保留结构拼接的可读性与 AI 可调用性。
- **相关文件**：`src/components/ui/input.tsx`、`docs/components/input.md`、`docs/data/components.manifest.json`、`docs/data/component-playgrounds.manifest.json`、`src/App.tsx`

### DEC-039: Token 面向 Agent 以派生 contract 与查询 CLI 提供，不新增视觉真相源

- **日期**：2026-07-15
- **状态**：已决定
- **决定**：保留 `theme/fx-theme.css -> docs/data/design-tokens.json` 的现有真相源链路；从后者自动派生 `docs/data/agent-tokens.manifest.json`，通过 `npm run tokens -- search|resolve|component` 提供只读查询。Agent 只能选择 semantic token 或 `componentUsage.stateMappings` 中声明的状态映射，不能直接选择 primitive 色板值。
- **放弃**：① 再手写一份 Agent token 清单；② 给每个组件批量创建独立 component token；③ 让 Agent 从 CSS 色值或色板阶数猜测组件状态。
- **原因**：Agent 需要稳定、紧凑、可查询的上下文，但视觉值仍必须只有一个真相源。派生 contract 同时保留 shadcn 语义槽和 open-code 组件的可读性，避免为了自动化复制 Astryx 的命名或主题实现。
- **影响**：Token 构建后必须同步 Agent contract；`check:agent-tokens` 会检查其派生结果，`check:tokens` 会检查 `stateMappings` 对 semantic token 的引用完整性。首批结构化状态映射覆盖 Input 与 Field，其他组件按真实源码能力逐步补齐。
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`、`docs/data/design-tokens.json`、`docs/data/agent-tokens.manifest.json`、`scripts/build-agent-token-contract.mjs`、`scripts/token-agent.mjs`

### DEC-040: Agent 通过派生组件/页面 contract 工作，页面生成只开放已验证骨架

- **日期**：2026-07-15
- **状态**：已决定
- **决定**：组件事实从 `components.manifest.json` 与调试台 manifest 派生为 Agent contract；页面能力用 `page-build-kit.manifest.json` 显式区分 `ready` 与 `needs-block`。统一入口为 `npm run fx -- search|component|build|token|context|doctor|theme|upgrade`。组件查询必须指出真实 `apiSource`，调试台控制项明确标记为非组件 API。
- **放弃**：① 给 Agent 一份手抄组件/API 目录；② 把详情页、表单页等尚未沉淀的页面类型伪装成模板；③ 让 Agent 根据名称自行拼装页面；④ 为尚无破坏性变更的版本预造空 codemod。
- **原因**：Agent 的效率来自可发现的真实能力，不来自扩大自由度。用派生 contract 收紧查询，用 Build Kit 收紧装配，既复用现有 open-code 组件和列表页生成器，也遵守“不手写重拼页面”的治理边界。
- **Shape**：补 `none / inner / element / container / page / full` 的语义圆角别名及同心嵌套规则；别名只映射现有半径阶，不批量改变组件外观。`theme build` 只重建现有主题的派生产物；迁移命令在存在已发布破坏性 API/token 改名时才登记实际 codemod。
- **诊断补充**：`doctor` 不复制校验规则，而是聚合 Token、组件源码/API、组件文档表、文档站示例、Build Kit 和 Agent UI 的既有检查；每项失败返回对应修复命令。这样协作者和 Agent 可先定位问题，完整门禁仍由 `check-all` 负责。
- **相关文件**：`docs/data/agent-components.manifest.json`、`docs/data/page-build-kit.manifest.json`、`docs/data/agent-context.md`、`scripts/fx-agent.mjs`、`scripts/doctor.mjs`、`docs/PAGES.md`、`docs/TOKENS.md`

### DEC-041: Agent 查询的边界固定，检索策略保持可演进

- **日期**：2026-07-16
- **状态**：已决定
- **决定**：Agent 意图搜索必须返回可解释的命中依据，优先给出组件和已验证页面骨架；组件写入前必须明确并读取 `apiSource`；调试台控制项永远标为非组件 API；组件示例只返回真实文档页或调试台的来源指针，不复制 JSX 成为第二真相源。
- **放弃**：① 只按全文字符串匹配却不说明为什么命中；② 把调试台选项当作可调用 props；③ 为查询方便手抄独立示例库；④ 将同义词、排序权重写入组件或设计规范。
- **原因**：前四项是长期可信边界，必须稳定且可检查；同义词和权重需要随着协作语言、组件覆盖和检索效果持续调整，固化后反而会把工具实现误当设计规则。
- **影响**：派生组件 contract 声明 `queryPolicy`；`check-agent-query-contract` 会验证 policy、来源指针、调试台非 API 标记，以及“邮箱输入”意图查询是否以 Input 为首个可解释结果。词表和权重只在 `fx-agent.mjs` 内演进。
- **相关文件**：`AGENTS.md`、`docs/data/agent-components.manifest.json`、`scripts/{fx-agent,build-agent-components,check-agent-query-contract}.mjs`

### DEC-042: Agent 接入走只读 init 适配器，诊断使用稳定错误码

- **日期**：2026-07-16
- **状态**：已决定
- **决定**：`fx init --agent codex|claude|cursor` 只输出一段可复制的短入口，不直接改写目标 Agent 的已有配置文件；`doctor` 为每项诊断返回稳定的 `FX_*` 错误码、检查名称、详情和修复命令。
- **放弃**：① 自动写入或覆盖 `.cursor` / `.claude` / Agent 配置；② 只输出随脚本文案变化的自然语言错误；③ 为每个 Agent 维护独立的组件或 Token 真相源。
- **原因**：协作项目的 Agent 配置常包含团队规则，自动写入容易覆盖上下文。短入口能让新 Agent 快速接入，而真实规则仍以仓库 `AGENTS.md` 为准。稳定错误码使人和自动化都能可靠地按失败类别处理问题。
- **影响**：新协作者可运行 `npm run fx -- init --agent <target> --json` 获取接入片段；自动化可消费 `npm run fx -- doctor --json` 的 `code` 字段，不依赖错误中文文案。
- **相关文件**：`scripts/fx-agent.mjs`、`scripts/doctor.mjs`、`docs/data/agent-context.md`

### DEC-043: 页面任务先解析为已验证 Build Kit 路径，不直接生成 JSX

- **日期**：2026-07-16
- **状态**：已决定
- **决定**：`fx plan <intent>` 只从 `page-build-kit.manifest.json` 选择已验证 archetype，返回生成器、固定 frame、数据契约、真实来源指针、工作流和禁止项。`ready` 可输出可执行生成命令；`needs-block` 必须返回 `blocked`，不生成替代 JSX。
- **放弃**：① 根据自然语言任务自由拼页面；② 将组件搜索结果直接当页面实现；③ 给未沉淀的详情/表单页编造模板。
- **原因**：页面正确性不只取决于组件存在，还取决于已验证的组合、交互和路由接入路径。任务计划应缩小可选空间，而不是把 Agent 引回从零组装。
- **影响**：列表类任务可走唯一生成器路径；表单和详情任务会明确停在 block 治理边界。`check-agent-query-contract` 覆盖这两类结果。
- **相关文件**：`scripts/fx-agent.mjs`、`docs/data/page-build-kit.manifest.json`、`scripts/check-agent-query-contract.mjs`、`docs/PAGES.md`

### DEC-044: 变更影响只沿声明引用链追踪，示例来源必须可验证

- **日期**：2026-07-16
- **状态**：已决定
- **决定**：`fx impact component <Name>` 和 `fx impact token <id|cssVar>` 只报告 contract、Token manifest、Build Kit 和示例指针中已经声明的上下游关系，并返回对应检查。Agent 示例来源必须校验文件、场景/调试台符号和文档锚点实际存在。
- **放弃**：① 用全文搜索把偶然文字提及伪装成依赖图；② 只给变更者一句“记得同步文档”；③ 让 Agent contract 指向已经删除的示例或锚点。
- **原因**：可解释、可验证的引用关系比貌似全面的模糊图更可靠。现有 manifest 已经表达关键治理链，应该直接用于变更前检查；示例指针若不能落到真实内容，查询结果就会失去协作价值。
- **影响**：组件影响会列出 API 源码、文档、示例、Token 和 Build Kit 关系；Token 影响会列出 CSS 真相源、semantic mapping 和已声明 consumers。`check-agent-examples` 与 `check-agent-query-contract` 共同防止影响链和示例入口漂移。
- **相关文件**：`scripts/{fx-agent,check-agent-examples,check-agent-query-contract}.mjs`、`docs/data/{agent-components,agent-tokens}.manifest.json`、`AGENTS.md`

### DEC-045: Theme Contract 只开放语义视觉槽，当前维持单一浅色主题

- **日期**：2026-07-16
- **状态**：已决定
- **决定**：从 Token contract 派生 Theme Contract。主题可替换声明过的语义视觉 token，必须保留交互状态阶梯；半径、字族和结构性效果 token 受保护。`fx theme show` 查询边界，`fx theme audit` / `check:theme` 审计契约。当前仅声明 light，不创建或宣称 dark / 自定义主题构建能力。
- **放弃**：① 在页面或组件调用处以 className 覆盖实现“主题”；② 允许 primitive 色板直接作为主题输入；③ 在没有多主题产物前预造主题编辑器或 dark mode 宣称。
- **原因**：主题是 semantic token 的整体映射，不是局部换色。先把可替换面与交互完整性变成契约，才能在未来安全扩展多品牌，而不破坏 token SSOT 和组件治理。
- **影响**：Token contract 新增 `themeContract`；现有 Token 同步与交互态检查被 `check-theme-contract` 聚合，doctor 用 `FX_THEME_CONTRACT` 报告失败。
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`、`docs/data/{design-tokens,agent-tokens}.manifest.json`、`scripts/check-theme-contract.mjs`、`scripts/fx-agent.mjs`

### DEC-046: 场景配方只沉淀已验证组合，不从组件 API 自由推导

- **日期**：2026-07-16
- **状态**：已决定
- **决定**：新增 `agent-recipes.manifest.json` 作为跨组件场景组合的唯一机器事实。每个 recipe 必须声明真实组件、结构零件、语义 Token、行为、验收条件、禁止项和真实证据。`fx recipe <intent>` 只返回已验证配方；未知场景返回 `no-proven-recipe`。
- **放弃**：① 根据单个组件 API 临时推导业务组合；② 复制 JSX 当作配方真相源；③ 将结构零件伪装成组件 prop；④ 未验证场景也返回“看似可用”的方案。
- **原因**：组件可用不等于组合正确。协作共建需要把可复用的行为与验收条件一并沉淀，才能让 Agent 和工程师得到同一条经过验证的实现路径。
- **影响**：首批覆盖邮箱字段校验、可清除搜索输入、带范围的全局搜索和日期范围筛选。`check-agent-recipes` 检查配方引用的组件、Token、证据文件和符号；视觉变化仍需按既有规则运行 `test:visual`。
- **相关文件**：`docs/data/agent-recipes.manifest.json`、`scripts/{fx-agent,check-agent-recipes}.mjs`、`AGENTS.md`

### DEC-047: Elevation Token 以单档复合阴影表达层次

- **日期**：2026-07-16
- **状态**：已决定
- **决定**：`shadow-l1` 使用两层投影，`shadow-l2` 与 `shadow-l3` 使用三层投影；近层为 `8%` 品牌微染中性灰，远层降为 `5%` 与 `3%`。调用方只能选择一个 elevation Token，不叠加 L1/L2/L3。
- **放弃**：① 单层阴影只加大透明度或 blur；② 让页面调用处叠加多个 shadow utility；③ 使用 Material 风格的高不透明度重阴影。
- **原因**：单层 L3 在浅色表面缺少可读的落点和扩散，简单加黑会显脏。复合阴影借鉴 Ant 的近/中/远层结构，并保持 Astryx 的 low/med/high 场景分工：tooltip、dropdown、dialog 只各取一档。
- **影响**：四个公司 shadow utility 的实际几何升级；主题预览强度映射、Token 文档、机器 manifest 与 Agent Token contract 必须同时更新。
- **相关文件**：`theme/fx-theme.css`、`src/App.tsx`、`docs/TOKENS.md`、`docs/data/{design-tokens,agent-tokens}.manifest.json`

### DEC-048: 文档站独立信息卡统一通过 WebsiteCardContainer

- **日期**：2026-07-16
- **状态**：已决定
- **决定**：文档站中的独立信息块、示例预览、说明区和表格外壳统一使用 fx 组合组件 `WebsiteCardContainer`；它内部复用 shadcn `Card` 的真实 API。完整应用预览、色板或组件制作台等贴边结构可用受控 `padding="none"`，该值同时清除 Card 根部的默认内边距与间距；组件自身的 API 预览保留直接使用 shadcn `Card`，保证示例仍能准确说明该基础组件。
- **放弃**：① 页面按需直接写 `Card` 或裸 `div`；② 把 WebsiteCardContainer 仅作为规范页静态示意；③ 在调用处覆盖卡片的圆角、边框、背景或阴影。
- **原因**：文档站是产品界面，不是基础组件样例的随意拼接场。集中入口能让网站卡片的视觉和结构随同一个组合组件演进，同时不污染基础 Card 的业务语义和真实示例。
- **影响**：`DocSurfaceCard` 委托 WebsiteCardContainer；组件索引、治理表格、规则代码块、间距节奏和 CRM 完整预览均通过它承载；`check-doc-site-contract` 验证该委托关系。网站卡片的视觉改动只在 WebsiteCardContainer 层完成。
- **相关文件**：`src/components/fx/{website-card-container,doc-surface}.tsx`、`src/App.tsx`、`docs/data/{components,doc-site,website-standards}.manifest.json`、`docs/DOC_SITE_DESIGN.md`、`scripts/check-doc-site-contract.mjs`

### DEC-049: 网站卡片阴影固定为 L1 并跟随全局 Shadow Level

- **日期**：2026-07-16
- **状态**：已决定
- **决定**：`WebsiteCardContainer` 固定使用 shadcn `Card elevated`，以公司 `shadow-l1` 作为网站卡片的唯一阴影。容器不暴露 `elevated` 调用选项；全局主题的 Shadow Level 仍通过 `--fx-shadow-l1` 控制其关闭和强度。
- **放弃**：① 每个页面或卡片实例自行传 `elevated`；② 为文档站写死一套不受主题影响的 `box-shadow`；③ 将网站卡片改成无阴影而只让浮层有阴影。
- **原因**：网站卡片是同一类产品表面，应保持一致的层次感。复用全局 Shadow Level 既让用户能统一关闭或调整阴影，也避免网站风格脱离系统 token。
- **影响**：网站卡片、文档表面和规则面板都自动获得 L1 阴影；全局 Shadow Level = none 时全部关闭。
- **相关文件**：`src/components/fx/{website-card-container,doc-surface,website-rule-panel}.tsx`、`theme/fx-theme.css`、`src/App.tsx`、`docs/data/{components,website-standards}.manifest.json`

### DEC-050: 组件质量通过只读 CLI 查询暴露给 Agent

- **日期**：2026-07-18
- **状态**：已决定
- **决定**：在现有 `fx search|component|recipe|impact|layer` 查询之外，增加 `fx quality <组件>` 只读入口，直接返回由组件、Playground、视觉测试和文档真相源派生的质量状态、缺口和证据指针。
- **放弃**：① 让 Agent 直接读取并解释整份质量 JSON；② 在 CLI 里手填一份质量评分；③ 把 `needs-review` 自动降级为“已覆盖”。
- **原因**：质量矩阵既服务人也服务 Agent，但原始 JSON 不是稳定的交互边界。显式查询可以保持输出契约、来源指针和缺口语义，同时让缺失证据继续可见。
- **影响**：`fx quality` 只读，不修改源码或 manifest；查询结果必须包含质量真相源，并通过 `check-agent-query-contract` 验证。质量状态仍由 `build:quality` 派生，不能在 CLI 中手改。
- **相关文件**：`scripts/fx-agent.mjs`、`scripts/check-agent-query-contract.mjs`、`docs/data/component-quality.manifest.json`

### DEC-051: 开源参考站只借鉴治理思想，不复制许可证未核实的实现

- **日期**：2026-07-18
- **状态**：已决定
- **决定**：Astryx Components（`https://astryx.atmeta.com/components`）以及其他开源组件站只用于参考信息架构、组件分层、文档导航、主题契约和工程治理方式。许可证、源码归属和可再分发范围未完成核实前，不复制其源码、样式实现、命名体系或资源。
- **放弃**：把参考站的页面或组件实现直接搬入 fx-ui，或仅凭“页面可访问/声称开源”推断可复制、可再发布。
- **原因**：fx-ui 的真相源必须保持在本地 shadcn open-code、Base UI、Tailwind token、manifest 和可执行检查中；参考站的组织思想可以吸收，但实现复制会引入许可证、供应链和 API 漂移风险。
- **影响**：新增分层、Playground、页面模板或治理能力时，先登记本地 source/contract，再通过质量与视觉检查；外部参考只记录为决策依据，不成为运行时依赖或第二真相源。
- **相关文件**：`docs/ARCHITECTURE.md`、`docs/data/layered-assets.manifest.json`、`docs/data/component-playgrounds.manifest.json`、`scripts/check-layered-assets.mjs`

### DEC-052: Astryx 仓库代码按 MIT 许可单独评估，站点资源仍不默认复用

- **日期**：2026-07-18
- **状态**：已决定
- **核验**：Astryx Components 页面链接到 `https://github.com/facebook/astryx`；仓库 `main/LICENSE` 声明 MIT License，版权归 Meta Platforms, Inc.（2026）。站点页脚另链接 Meta Open Source 条款，但页面、图标、字体、截图、品牌资产和第三方依赖不因此自动获得同一许可。
- **决定**：可以把该仓库的公开工程组织方式作为 MIT 范围内的参考；如未来确需复制具体代码，必须保留 MIT 版权/许可文本，并逐文件核对依赖和资源许可。当前 fx-ui 仍只吸收信息架构、分层、Playground、CLI/Agent 治理和主题契约，不引入 Astryx 运行时、不复制品牌资源，也不建立第二真相源。
- **放弃**：把网页可见内容、压缩产物、品牌图形或未标明来源的资源当作 MIT 代码直接搬运。
- **来源**：`https://astryx.atmeta.com/components`、`https://github.com/facebook/astryx`、`https://raw.githubusercontent.com/facebook/astryx/main/LICENSE`、`https://opensource.fb.com/legal/terms`
- **影响**：外部参考可以进入设计评审和治理决策，但任何落地能力仍必须先登记本地 source/contract，再通过 `build`、`check-all` 和 `test:visual` 验收。

### DEC-053: 质量矩阵区分不适用状态与待取证状态

- **日期**：2026-07-18
- **状态**：已决定
- **决定**：组件质量矩阵中的 disabled/loading/error 状态必须保留证据字段。`docs/data/components.manifest.json#stateApplicability` 只允许声明组件根契约明确不拥有的状态（例如 Dialog 的 disabled 属于 Trigger、ButtonGroup 的 loading 属于子 Button）；非交互组件且没有该状态语义时标记 `not-applicable`；其余交互组件没有源码、文档、story 或行为测试证据时标记 `not-declared`，并进入 `needs-review` 缺口，不得按“默认不需要”处理。
- **原因**：`not-declared` 和“不适用”代表不同工程风险；前者需要补证据，后者只需明确边界。两者混用会让质量矩阵看似全绿但无法指导补齐工作。
- **相关文件**：`scripts/build-component-quality.mjs`、`docs/data/component-quality.manifest.json`、`scripts/check-agent-query-contract.mjs`

### DEC-054: Playground 将场景预设与实时属性分层治理

- **日期**：2026-07-24
- **状态**：已决定
- **决定**：新建或改造 ComponentPlayground 时，实时属性固定按内容、结构、外观、行为、语义排序；缺少能力的分组不显示。场景预设只有在结构变化、多个真实 props/状态联动且具备已验证意图与约束时才允许出现；出现时位于实时属性之前，让用户先选完整场景，再微调真实属性，并按 manifest 显式顺序排列。
- **放弃**：① 所有 Playground 只要有 stories 就在属性区顶部展示；② 用单个 prop 或可独立调节的 props 组合伪造场景；③ 用页面布局覆盖作为场景。
- **原因**：场景用于先确定完整使用意图，实时属性用于继续探索真实 API；两者分层可以避免重复控制，同时符合“先选场景、再调细节”的操作路径。
- **影响**：`component-playgrounds.manifest.json#controlPanelContract` 成为顺序和准入的机器事实，`ComponentPlayground` 统一渲染顺序，`check-playground-contract.mjs` 同时校验声明与实际 DOM 顺序。
- **相关文件**：`docs/components/component-playground.md`、`docs/data/component-playgrounds.manifest.json`、`src/components/fx/component-playground.tsx`、`scripts/check-playground-contract.mjs`

### DEC-055: Web 排版统一采用 12 / 14 / 16 / 18 核心阶梯

- **日期**：2026-07-22
- **状态**：已决定
- **决定**：全局正文层级固定为 `text-xs / sm / base / lg = 12 / 14 / 16 / 18px`，`text-xl` 随之为 `20px`。组件尺寸必须复用这条阶梯；例如 Link 与 Breadcrumb 的 `sm / default / lg` 分别对应 `12 / 14 / 16px`。
- **放弃**：原先的 `12 / 13 / 15 / 18px` 高密度企业刻度，以及组件局部保留旧字号来维持视觉差异的做法。
- **原因**：12 / 14 / 16 是主流 Web 组件体系更稳定、可预期的正文阶梯，能与 shadcn/Tailwind 调用语义、浏览器默认阅读尺度和第三方组件更好对齐；局部组件不得再形成第二套字号系统。
- **影响**：正文、菜单、表单、表格、文档站和使用 `text-*` 的所有组件都会随 token 更新；需要同步更新 token 文档、派生 manifest、组件尺寸说明和视觉基线。
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`、`docs/data/design-tokens.json`、`src/components/ui/{link,breadcrumb}.tsx`

### DEC-056: 通用 Link 作为受控的原生语义组件例外

- **日期**：2026-07-22
- **状态**：已决定
- **决定**：保留项目内 Link，因为 shadcn registry 没有通用文本链接组件。它以原生 `<a>` 实现并继续位于 `src/components/ui/`，但必须在 `components.manifest.json#nativeSemanticComponents` 白名单登记、绑定本决策并通过 `check:components`；公开 API 保持 tone、underline、size、disabled 与原生 anchor props，不新增能力。
- **放弃**：① 每个页面各自手写链接颜色和状态；② 用 `Button variant="link"` 替代全部导航语义；③ 因单个例外而开放任意手写基础组件。
- **原因**：文本导航需要真实 anchor 语义、统一 token 和一致的禁用行为；Button 与导航语义不同，而无治理的页面级 `<a>` 会持续复制视觉实现。
- **影响**：Link 的 disabled 必须同时移除 href、退出 Tab 序并阻止调用方 onClick；架构规则允许的例外只由 manifest 白名单定义，新增例外必须单独决策。
- **相关文件**：`AGENTS.md`、`docs/{MAP,ARCHITECTURE,CODE_STRUCTURE}.md`、`docs/data/components.manifest.json`、`scripts/check-components-manifest.mjs`、`src/components/ui/link.tsx`

### DEC-057: shadcn open-code 可在基础层补齐主流组件能力

- **日期**：2026-07-22
- **状态**：已决定
- **决定**：已有 shadcn 组件缺少主流基础能力时，经用户逐项审核后可继续在 `src/components/ui/` 的原 open-code 中补齐，不强制把新增子能力迁移到 fx 层。扩展组件必须在 manifest 登记 `origin: shadcn-extended`、上游、决策和扩展清单，并由 `check:components` 校验。
- **放弃**：① 机械限制基础层只能保留上游原样；② 把 AvatarComposite 这类通用身份呈现能力迁成业务组合；③ 以“补全”为由从零手写与 shadcn 无关的新基础组件。
- **原因**：shadcn 是起点而不是完整设计系统；尺寸、形状、状态、分组等通用能力仍应由基础组件统一承载，避免调用处重复组合或视觉覆盖。
- **影响**：Avatar 保留 AvatarComposite 等受治理扩展；未来扩展必须先核对上游、公开 API、文档、Playground、manifest 和测试，不能自动同步或盲目覆盖本地源码。
- **相关文件**：`AGENTS.md`、`docs/{MAP,ARCHITECTURE}.md`、`docs/data/components.manifest.json`、`scripts/check-components-manifest.mjs`、`src/components/ui/avatar.tsx`

### DEC-058: Dev Inspector 只作开发期源码辅助，Playground 保持唯一场景真相源

- **日期**：2026-07-24
- **状态**：已决定
- **决定**：保留 `@lijinmei-810/dev-inspector` 仅在 Vite 开发服务中作为组件源码辅助工具，现有 Button 配置作为该工具的稳定入口，不再继续录入文档站组件场景。所有用户可见的组件预览、实时属性、场景预设、代码生成与视觉测试继续唯一通过 `component-playgrounds.manifest.json + ComponentPlayground` 管理。
- **放弃**：① 把 dev-inspector 扩展为第二个组件文档或调试台；② 在两处维护相同组件的 variants、尺寸和状态；③ 为新组件同时新建 Playground 与 dev-inspector 场景。
- **原因**：dev-inspector 适合开发期定位组件源码，但它的配置不带现有 Playground 的 manifest、代码、参考用例与视觉验收链路。继续并行扩展会形成两套场景真相源并造成漂移。
- **影响**：`npm run dev` 仍加载 dev-inspector Vite 插件；组件文档页不增加依赖、不以它生成产物。新组件的文档场景不得录入 `src/dev-inspector.config.tsx`，而应按现有治理流程登记 Playground manifest 并验收。
- **相关文件**：`vite.config.ts`、`src/dev-inspector.config.tsx`、`docs/data/component-playgrounds.manifest.json`、`src/components/fx/component-playground.tsx`

### DEC-059: Calendar 用单、双箭头完成月年导航

- **日期**：2026-07-28
- **状态**：已决定
- **决定**：Calendar 在 shadcn open-code 内补齐上一年 / 上一月 / 下一月 / 下一年四个导航按钮。单箭头按月切换，双箭头按年切换，并受 `startMonth` / `endMonth` 限制；日期和日期时间选择器复用该能力，不使用年月下拉。
- **放弃**：① 使用月份、年份下拉；② 在 DatePicker / DateTimePicker 调用处各自手写导航；③ 仅保留月份单箭头而让跨年回退为下拉。
- **原因**：用户明确要求紧凑箭头导航；它同时保留连续浏览月份和快速跨年的操作，并避免将同一导航结构复制到多个日期组合组件中。
- **影响**：Calendar 标记为 `shadcn-extended`，在 manifest 登记上游、决策和扩展能力；日期相关组件保留 100 年导航边界。
- **相关文件**：`src/components/ui/calendar.tsx`、`src/components/fx/{date-picker,time-picker}.tsx`、`docs/data/components.manifest.json`

### DEC-060: Signature 作为签名输入的原生语义组件例外

- **日期**：2026-07-30
- **状态**：已决定
- **决定**：新增 `Signature` 作为 `native-semantic` 白名单例外。shadcn registry 没有签名输入组件，canvas 绘制由 MIT 的 `signature_pad` 处理，fx-ui 只维护 React 生命周期、受控值、清空操作、禁用语义、响应式尺寸与 token 映射。
- **放弃**：① 在业务页面直接拼 canvas、指针事件和清空按钮；② 自行实现笔迹平滑算法；③ 把 Figma 的“填充=on/off”误建成业务 variant。
- **原因**：签名输入有明确的原生 canvas 交互语义，但不属于 shadcn 现有能力；集中治理可以统一数据 URL 输出、高清屏缩放、焦点态和容器自适应，并避免页面级重复实现。
- **影响**：组件公开 API 以 `value/defaultValue/onChange/onBegin/onEnd/disabled/clearLabel/height` 为准；Figma 当前唯一实例属性“填充”映射为运行时 `data-filled` 状态，不作为调用方可设置的视觉属性。
- **相关文件**：`src/components/ui/signature.tsx`、`docs/components/signature.md`、`docs/data/components.manifest.json`、`docs/data/component-playgrounds.manifest.json`

### DEC-061: Upload 作为文件选择与上传状态入口的原生语义组件例外

- **日期**：2026-07-30
- **状态**：已决定
- **决定**：新增 `Upload` 作为 `native-semantic` 白名单例外。shadcn registry 没有上传组件；组件以原生 `input[type=file]` 处理文件选择，统一按钮、拖拽区、照片墙、表单链接、文件限制、删除和受控状态展示，不内置网络请求。
- **放弃**：① 在业务页面反复拼 file input、拖拽事件和文件列表；② 把 Figma 的悬浮、点击、拖拽中做成视觉 prop；③ 在基础组件内持有 action URL、鉴权头、分片、重试等业务传输策略。
- **原因**：文件选择具有明确原生语义，但入口形态、可访问性、本地限制、进度和失败反馈需要统一。网络上传与鉴权高度依赖业务，留给调用方可避免基础组件成为传输黑盒。
- **影响**：公开 API 以受控文件列表、`onFilesSelect`、本地限制、`variant/listType/imageSize` 为准；Figma 的上传形式映射为 variant，回填映射为文件列表，交互状态由真实 DOM 事件产生。
- **相关文件**：`src/components/ui/upload.tsx`、`docs/components/upload.md`、`docs/data/components.manifest.json`、`docs/data/component-playgrounds.manifest.json`

### DEC-062: PeoplePicker 以 Combobox 为基础组合人员与组织选择

- **日期**：2026-07-31
- **状态**：已决定
- **决定**：通过 shadcn CLI 引入 Combobox，并在其 open-code 内补齐内联 panel、48px list density 与可关闭 item indicator 三项通用能力；PeoplePicker 位于 fx 层，复用 Combobox、InputGroup、Tabs、Checkbox、Avatar、ScrollArea 和 Button，承载人员、部门、组织、合伙人与用户组的搜索、多选、全选、收藏和下钻。
- **放弃**：① 在页面中临时拼选人面板；② 把人员与组织字段塞进基础 Select/Combobox；③ 将 Figma 的悬浮、选中或下钻截图做成视觉 mode prop；④ 保留安装器带入的第二套 InputGroup 真相源。
- **原因**：shadcn 没有完整 PeoplePicker，但 Combobox 已提供搜索、集合、键盘导航和多选语义。把通用列表几何留在基础层、业务数据模型留在 fx 层，既能贴合 Figma，又不污染基础组件契约。
- **影响**：Combobox 登记为 `shadcn-extended`，上游为 `@shadcn/combobox`；PeoplePicker 的 Figma 场景映射为真实 Tab，尺寸映射为 normal/medium，视觉全部使用 fx-ui token。
- **相关文件**：`src/components/ui/combobox.tsx`、`src/components/fx/people-picker.tsx`、`docs/components/{combobox,fx-people-picker}.md`、`docs/data/{components,component-playgrounds}.manifest.json`

### DEC-063: ColorPicker 以成熟颜色引擎组合为 fx 组件

- **日期**：2026-07-31
- **状态**：已决定
- **决定**：shadcn registry 没有 ColorPicker；在 `fx` 层复用 Popover、Button、Select、Input，并使用 MIT 的 `react-colorful` 处理色域、色相与透明度交互，使用 `colord` 处理解析和 HEX/RGB/HSL/CSS 转换。Popover 只新增受治理的 `picker` 尺寸以承载 Figma 的 258px 固定面板。
- **放弃**：① 页面内临时拼颜色面板；② 手写颜色交互算法；③ 复制 Figma 原始颜色作为组件 chrome；④ 把截图状态做成视觉 mode prop。
- **原因**：颜色交互、解析与浏览器边界已有成熟库可用；组合层负责真实 API、数据、可访问语义和 fx-ui token 映射即可。
- **影响**：Figma 的预览、吸色器、透明度、格式、最近色、预设色与触发器内容映射为真实 props/data；用户颜色值可作为动态内联样式，面板阴影、边框、文字与表面只使用项目 token。
- **相关文件**：`src/components/fx/color-picker.tsx`、`src/components/ui/popover.tsx`、`docs/components/fx-color-picker.md`、`docs/data/{components,component-playgrounds}.manifest.json`

### DEC-064: 列表页视觉评审使用受控校准台，不提供自由样式编辑

- **日期**：2026-08-06
- **状态**：已决定
- **决定**：客户列表页作为首个页面视觉校准样本。维护页 `#customer-list-calibration` 复用真实 `CustomerListFrame`，只开放 `CrmAppShell.frame`（`inset` / `continuous`）与 `DataTable.density`（`default` / `compact`）两条已声明的变体轴；每个候选组合均有意图、约束和视觉回归。
- **放弃**：① 仿照独立 Dashboard Studio 提供颜色、圆角、阴影、任意间距等自由滑块并存到 localStorage；② 复制一份专供调试的列表页 JSX；③ 用页面调用处 className 临时覆盖背景、边框或圆角。
- **原因**：fx-ui 的 token、组件与 Block 都有明确真相源。自由调参会产生“调试态”和正式页面两套视觉事实，而真实页面复用受控 Block 变体可先快速比较、后稳定收敛。
- **影响**：新列表页沿用生成器和默认基线；出现经评审的跨列表页视觉变化时，先提升为已有 Block 的有限 variant，再更新 `docs/PAGES.md`、视觉基线和检查证据。全局视觉变化仍按 token 流程处理。
- **相关文件**：`src/pages/docs/governance/customer-list-calibration-page.tsx`、`src/pages/templates/customer-list-template.tsx`、`src/components/recipes/{crm-app-shell,data-table}.tsx`、`docs/PAGES.md`、`docs/data/component-playgrounds.manifest.json`

### DEC-065: 默认主题全局页面背景固定为 #F5F6F7

- **日期**：2026-08-06
- **状态**：已决定
- **决定**：默认浅色主题使用 `--fx-page-background: #F5F6F7`，并由 shadcn 语义槽 `--background` 引用；所有页面继续使用 `bg-background`，不在调用处写死颜色。
- **放弃**：① 直接把 `--fx-neutrals-02` 改成 `#EFF1F3`；② 在页面或搭建器上局部覆盖背景色。
- **原因**：`--fx-neutrals-02` 同时服务禁用控件底色和低存在感结构线，修改它会扩大影响范围。独立页面画布 token 能保持语义清晰，并让全局换底不改变组件状态与边框。
- **影响**：所有使用 `bg-background` / `--background` 的页面画布统一显示 `#F5F6F7`；Card、Surface、Popover 及中性色阶保持原值。
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`、`docs/data/design-tokens.json`、`docs/data/agent-tokens.manifest.json`

### DEC-066: 完整应用画布外壳不使用卡片圆角

- **日期**：2026-08-06
- **状态**：已决定
- **决定**：`WebsiteCardContainer` 增加受控 `shape="square"` 形态，`CrmAppShell` 作为完整应用画布固定使用它；普通网站信息卡继续使用默认圆角。
- **放弃**：① 在页面调用处用 `rounded-none` 覆盖；② 全局移除 Card 圆角；③ 将整个应用预览视为浮起卡片。
- **原因**：完整应用画布是页面边界，不是页面中的卡片；使用方角可避免搭建器选框和顶栏被误读为卡片。
- **影响**：CRM 外壳的四角为 `0px`；内部导航、工作区和业务卡片仍按各自组件契约保留圆角。
- **相关文件**：`src/components/fx/website-card-container.tsx`、`src/components/recipes/crm-app-shell.tsx`、`docs/data/components.manifest.json`、`docs/data/layered-assets.manifest.json`

### DEC-067: 页面搭建与基础组件评审共用一个受控工作台

- **日期**：2026-08-06
- **状态**：已决定
- **决定**：搭建器标题旁用 Select 切换“页面搭建 / 基础组件评审 / 业务组件搭建”。基础组件代码由外部 Agent/Codex 按同一套 MCP/CLI contract 生产，网页端只消费候选契约并负责真实预览、状态矩阵、既有 API/Props 校正、治理检查、返工与确认。预览只能走已登记的本地安全适配器；检查通过且用户确认后，候选才进入 Playground 与组件入库审核。
- **放弃**：① 在网页端复制 Figma，靠容器、文字、图标和图层从零绘制组件；② 再放一个与外部 Agent 无差别的生成聊天框；③ 允许任意 JSX、CSS、像素值或 token 覆盖；④ 检查或确认前直接写源码和 registry。
- **原因**：从空白建模仍要求用户掌握图层、布局和属性设计，效率与 Figma/低代码平台接近，也重复外部 Agent 的实现能力。网页端真正不可替代的价值是让不同 Agent 的产物经过同一个可视化治理、状态验收和人工确认出口。
- **影响**：`page-builder.manifest.json#builderModes.component.reviewWorkbench` 成为基础组件评审真相源；当前首个安全预览适配器复用真实 Button API。返工只生成外部 Agent 任务，不伪称已执行；确认前不修改 `src/components/ui/*`、不创建 Playground、不写组件 manifest，确认后也只进入受治理的实现与审核队列。
- **相关文件**：`src/components/recipes/{page-builder,component-builder}.tsx`、`docs/data/page-builder.manifest.json`

### DEC-068: 业务组件从受控空白画布组合

- **日期**：2026-08-06
- **状态**：已决定
- **决定**：业务组件模式默认进入空白画布，左侧在“组件 / 图层”间切换；组件库以全量 manifest 搜索替代默认分类展开，只展示当前关键词的匹配结果。已适配白名单以受治理的默认实例插入，不依赖业务数据；未适配匹配项只汇总提示，不逐项渲染禁用入口。组件可点击或拖放插入，画布支持单选、Shift 多选、成组与解组。整体与组合的 Auto Layout 只使用登记的方向和间距档。选中实例的属性来自真实 Playground contract，搭建器只白名单开放已评审属性；任一开放属性可绑定为公开业务 Prop，实例值、公开名和默认值随草稿及发布产物持久化。个人组件可本地发布，业务组件必须提交审核。
- **放弃**：① 预置 TopBar 等业务模板作为唯一入口；② 自由拖入任意组件或 HTML；③ 输入像素、CSS 或 token 覆盖；④ 让 Agent 生成 JSX；⑤ 未经审核直接写入公共 fx 组件源码；⑥ 在搭建器复制属性选项或把调试台伪属性当成组件 API。
- **原因**：用户需要从零组合，而不是理解模板插槽。同时，公司组件库仍需保护真实 API 和 token；白名单节点、结构化分组和有限布局档可以兼顾自由度与治理。
- **影响**：`BusinessComponentBuilder` 的真相源是空白组合 schema；当前默认实例开放 Button、Input、Checkbox、Switch、Tag、Avatar、Separator、Select、Textarea、Badge、Slider、RadioGroup、Toggle、ToggleGroup、Link 和 Alert。存在 Playground contract 的组件通过 `page-builder.manifest.json` 指针派生初始值与已评审属性；只有固定默认实例的组件在真实属性契约登记前不显示可编辑属性。发布结果分为个人库与业务审核队列。
- **相关文件**：`src/components/recipes/{page-builder,business-component-builder}.tsx`、`docs/data/{page-builder,layered-assets}.manifest.json`

### DEC-072: 基础组件搭建与 AI 候选验收合并为一个入口

- **日期**：2026-08-23
- **状态**：已决定（候选确认门部分被 DEC-073 取代）
- **决定**：搭建器只向用户展示“基础组件搭建 / 业务组件搭建 / 页面搭建”三个模式。基础组件搭建从空白画布开始，用户配置结构、布局和受控实时属性后直接发送给 AI；候选返回、预览验收和发布是同一工作流的连续步骤，不再单独暴露“基础组件评审”模式。
- **放弃**：① 让用户在“基础组件搭建”和“基础组件评审”之间切换；② 重复提供一个与搭建器无关的候选审查工作台；③ 因合并入口而放宽组件、Token、Props 或源码治理边界。
- **原因**：用户的目标是制作基础组件并交给 AI 实现，独立评审入口增加认知负担，也把同一组件拆成两个不连续的任务。合并入口保留了候选验收的治理价值，同时让操作路径从空白画布到发布保持连续。
- **影响**：`BusinessComponentBuilder` 负责基础/业务两种组合工作流；`page-builder.manifest.json#builderModes.component.reviewWorkbench` 降为内部候选合约，不再作为下拉模式或独立页面展示。基础组件模式的 Agent 发送、候选快照失效和验收门继续有效。
- **相关文件**：`src/components/recipes/{page-builder,business-component-builder}.tsx`、`docs/PAGES.md`、`docs/ARCHITECTURE.md`、`docs/data/page-builder.manifest.json`

### DEC-073: 基础组件以实时画布直接发布

- **日期**：2026-08-24
- **状态**：已决定（部分取代 DEC-072）
- **决定**：基础组件模式以中央实时画布作为唯一发布前预览；右侧不再显示“候选确认”、候选快照、“生成候选”和“预览验收”。基础组件固定采用单根容器模型，第一个容器是默认白底的最外层容器，后续容器和结构预设只进入它的直接子级，不产生第二个根节点或更深的容器嵌套；左侧借鉴海报编辑器，以两列可视素材块提供容器、文字、图标、分割线和结构预设，整块支持点击与拖拽。布局、颜色、间距和交互状态不作为可插入节点，只在右侧属性中配置；全局只保留命名与发布，外边距交给使用方父级。属性页只保留当前资产的属性标题和真实控件，不重复展示 Token 标签、选中说明和基础资产来源。用户完成受控结构、属性、命名与发布方式配置后，顶部“发布组件”直接提交当前草稿到新建入库或已有组件更新队列。
- **放弃**：① 在同一画布结果之外再复制候选快照；② 发布前要求连续点击生成和验收；③ 因减少点击而直接覆盖组件源码。
- **原因**：实时画布已经持续展示当前草稿，再生成同内容快照并人工确认没有新增信息，只增加认知和操作成本。真正的组件治理发生在 Playground、契约检查、视觉回归与入库审核链，不应伪装成右侧的重复按钮。
- **影响**：`page-builder.manifest.json#builderModes.component-create` 使用 `creationContract` 声明实时预览、直接发布、单根容器、禁用全局布局和仅保留标题的属性说明层；仍校验组件名称、画布节点、公开 Prop，以及更新已有组件时的目标选择。业务组件的整体 Auto Layout、组件来源和属性契约提示不变。发布只进入对应队列，不直接修改 `src/components/ui/*`。
- **相关文件**：`src/components/recipes/business-component-builder.tsx`、`docs/data/page-builder.manifest.json`、`scripts/check-page-builder.mjs`、`tests/component-behavior.spec.ts`、`docs/{ARCHITECTURE,PAGES}.md`

### DEC-069: 先补齐资产成熟度，再开放 fx-ui MCP

- **日期**：2026-08-20
- **状态**：已决定
- **决定**：fx-ui 暂不以“完整组件库”或“完整 MCP”对外承诺。后续固定按四层顺序推进：① 盘点基础组件并以 `ready / review / missing / blocked` 标记真实成熟度；② 从真实页面验证中提炼稳定 Block；③ 仅将数据契约、响应式行为和视觉回归均通过的组合晋升为页面模板；④ 最后把既有 manifest 与 `fx` CLI 包装为 MCP Server。MCP 只能作为现有真相源的薄适配层，不维护第二套组件、Token、Block 或模板数据。
- **基础组件准入**：每个 `ready` 基础组件必须具备真实 open-code 源码 API、主流必要能力、完整交互状态、fx-ui semantic token、Playground 实时属性、文档与真实示例、视觉证据和 Agent contract；缺少任一关键证据时保持 `review`，不得为了目录完整而虚标可用。
- **Block 准入**：Block 必须从已验证业务页面提炼，只复用 `ready` 组件与已有 token，保留稳定结构、行为、数据入口和验收条件；候选包括页面顶栏、查询筛选栏、批量操作栏、数据表格区、分页区、空状态和表单区段。未经过真实页面验证的组合不得登记为可复用 Block。
- **页面模板准入**：页面模板不是 Block 的随意排列。只有完整页面的数据契约稳定，关键交互、响应式布局和视觉回归通过，并拥有唯一生成或复用路径时才标记 `ready`；依赖缺失组件或 Block 的页面类型保持 `blocked / needs-block`。
- **首条推进路径**：以客户列表作为第一条纵向样板，先核对并补齐 Button、Input、Select、Table、Pagination、Checkbox、DropdownMenu、Dialog、Tag、DatePicker、Filter、Empty、Skeleton、Tooltip 等真实依赖，再从完成页面中提炼 Block，最后将其晋升为生产级列表模板。随后按同一方法推进表单页与详情页，不横向机械搬运全部 shadcn 或 Ant Design 组件。
- **MCP 边界**：资产达到可用规模后，MCP 首期只暴露真实能力，例如组件列表与搜索、组件契约、示例、Token、recipe、页面计划、影响链和质量状态；查询必须返回成熟度并诚实暴露缺口。MCP 不生成不存在的组件，不把 `review` 伪装为 `ready`，也不绕过源码、Playground、视觉测试和人工确认门。
- **放弃**：① 先做完整 MCP 外壳再补内容；② 用数量衡量组件库完成度；③ 把所有 shadcn 或 Ant 组件机械搬入；④ 在基础资产未成熟时让搭建器自由生成任意页面；⑤ 维护一份独立于现有 manifest/CLI 的 MCP 数据目录。
- **原因**：MCP 只能提高真实资产的发现与调用效率，不能替代组件质量、业务验证和模板治理。先建立诚实的成熟度与补齐队列，才能让搭建器和外部 Agent 得到可执行边界，而不是更快地产生不完整或未经验证的页面。
- **影响**：后续资产盘点应从现有源码、组件 manifest、Playground、质量矩阵、分层资产和页面 Build Kit 派生，不手填第二套清单；当成熟度分类需要被页面、Agent 和脚本共同消费时，再扩展既有 manifest 与检查。搭建器当前继续承担资产评审与受控组合，不宣称全量页面生产能力。
- **相关文件**：`docs/data/{components,component-playgrounds,component-quality,layered-assets,page-build-kit,agent-components,agent-tokens,agent-recipes}.manifest.json`、`scripts/fx-agent.mjs`、`src/pages/templates/customer-list-template.tsx`

### DEC-070: 组件默认只读，修改必须从组件调试台发起

- **日期**：2026-08-22
- **状态**：已决定
- **决定**：基础组件和组合组件默认视为受治理资产，只能在页面、Block、模板和搭建器中选择既有 API、variant、尺寸与状态；未经用户明确授权“调试某个组件”，不得修改组件源码、默认 token 映射、variant、结构或文档契约。组件视觉诉求必须先回到对应真实 Playground 调试，再决定是 token、variant、API 还是结构变更。
- **放弃**：① 看到页面局部颜色/间距不合适就直接改全局组件 token；② 在调用处用 `className` 覆盖组件视觉；③ 只更新视觉截图或 manifest，留下源码与文档漂移；④ 把页面搭建器预览当作组件修改入口。
- **原因**：组件是多个页面和 Block 共享的公共资产，局部反馈不能自动推导为全局设计决策。默认只读可以避免一次页面校准误伤全站；真实 Playground 则提供可复现的属性、状态、代码和视觉验收入口。
- **影响**：普通页面/Block/模板问题先记录为调用侧或待确认项；明确授权组件调试后，必须从真实 Playground 复现，沿“源码/Token → manifest → 文档/引用 → check:all → test:visual”链路完成，并在交付说明中标明修改范围。该规则适用于基础组件、fx 组合组件和已登记业务组件。
- **相关文件**：`AGENTS.md`、`docs/data/component-playgrounds.manifest.json`、`docs/data/components.manifest.json`、`tests/visual.spec.ts`

### DEC-071: 13/18 仅作为 28px 紧凑控件字号

- **日期**：2026-08-22
- **状态**：已决定
- **决定**：在 DEC-055 的 `12 / 14 / 16 / 18` 页面与正文核心阶梯之外，增加受控的 `text-control-sm = 13 / 18px`。它只允许已治理组件源码为 28px 紧凑控件消费；页面、Block、模板和调用处仍不得把 13px 当作通用正文尺寸。Button 的文字档固定为 `24→12/18、28→13/18、32→14/20、36→16/24`，24/28 使用 6px 圆角，32/36 使用 8px 圆角。
- **放弃**：① 在 Button 中硬写 `text-[13px]`；② 把 13px 重新扩散成正文、标签和页面文案的通用字号；③ 为保持纯 Tailwind 默认阶梯而继续使用视觉失衡的 `28px + 14/20px`；④ 修改全局圆角从而影响其他组件。
- **原因**：公司 Figma 的 28px Button 明确采用 13/18，当前 shadcn `base-nova` 的 28px Button 也使用约 13px；将它收口为紧凑控件 token 可以恢复按钮比例，同时保留 DEC-055 对页面排版的稳定约束。
- **影响**：主题真相源、主题字号运行时、Button 源码、组件 manifest、Button 文档与视觉基线必须同步；新增 token 不构成页面调用层新增任意字号的许可。
- **相关文件**：`theme/fx-theme.css`、`src/lib/theme-runtime.ts`、`src/components/ui/button.tsx`、`docs/{TOKENS,components/button}.md`、`docs/data/{design-tokens,components}.manifest.json`

### DEC-072: 基础无语义规范与页面类型语义分离

- **日期**：2026-08-26
- **状态**：已决定
- **决定**：fx-ui 的页面视觉采用“基础无语义层 → 全局语义层 → 页面类型语义层”。基础层只维护色板、字号/行高、间距、圆角、阴影、图标和边框基线；全局语义层维护跨页面共用的 `background`、`card`、`surface`、`muted`、`primary`、`destructive`、`border` 等槽位；页面类型只在 `docs/data/page-semantics.manifest.json` 声明区域角色，并映射到已有全局 semantic token。
- **基础层治理补充（2026-08-27）**：Foundation 扩为 color、spacing、size、font family/size/line-height/weight、radius、border width、icon stroke、opacity、blur、duration、easing、z-index 共 15 类物理刻度。它是维护者专属写入面，协作者和 AI 只读；页面、Report、Dashboard、工作台和组件调用处不得直接消费。色相名称也必须无语义，历史 `orange-warning` 因混入状态意图改名为 `deep-orange`，色值不变。断点、栅格、运行时布局、组件状态和数据协议不进入 Foundation。
- **页面类型边界**：列表页、详情页、编辑表单页和搭建器先作为 `ready` 页面类型；Dashboard、认证页、设置页先登记为 `planned`，必须先有真实 Block、数据契约和视觉证据才能升级。页面类型不得声明专属色值、字号、间距、圆角、阴影刻度或组件 API。
- **放弃**：① 每个页面类型复制一套颜色/间距/字号；② 在调用处用 `className` 绕过页面角色覆盖组件视觉；③ 没有真实 Block 就把页面类型标成 ready；④ 为了页面语义批量制造组件 token。
- **原因**：页面之间需要有不同的信息层级和交互意图，但视觉语言必须保持一致。角色映射提供页面差异，semantic token 保持换肤和组件契约稳定，基础层则避免被业务语义污染。
- **影响**：新增或迁移页面先查 `page-semantics.manifest.json`，运行 `npm run check:page-semantics`；页面视觉变更必须同步 Block/模板引用和视觉回归，不能只改页面截图或局部样式。Foundation 的完整性、无语义命名和页面直引由 `check:foundation-tokens` 检查。
- **相关文件**：`theme/{foundation,fx-theme}.css`、`docs/data/design-tokens.json`、`docs/data/{page-semantics,page-build-kit}.manifest.json`、`scripts/{check-foundation-tokens,check-page-semantics}.mjs`、`docs/{TOKENS,DESIGN_STANDARDS,PAGES}.md`

### DEC-074: 圆角采用固定 2/4/6/8/12/16 档位

- **日期**：2026-08-26
- **状态**：已决定
- **决定**：圆角基础档统一为 `2 / 4 / 6 / 8 / 12 / 16px`，另保留 `full`。`--radius` 固定为 8px；语义别名映射为 `inner=4px`、`element=6px`、`container=12px`、`page=16px`。按钮按高度映射：24/28 使用 6px，32/36 使用 8px。
- **放弃**：① 页面调用处自由输入任意圆角；② 用连续 `calc()` 派生替代可验收的固定档位；③ 将大容器和小控件共用同一档圆角。
- **原因**：固定档位更容易记忆、审查和跨组件统一，同时保留组件层级差异；按钮尺寸映射解决紧凑按钮过扁或过圆的问题。
- **影响**：`theme/fx-theme.css` 是真相源，`docs/TOKENS.md`、token manifest、圆角文档页和搭建器语义映射必须同步；圆角变更属于全局视觉变更，完成后必须运行 token sync、全量 check 和视觉回归。
- **相关文件**：`theme/fx-theme.css`、`docs/data/design-tokens.json`、`src/components/recipes/business-component-builder.tsx`、`src/pages/docs/tokens/tokens-radius-page.tsx`

### DEC-075: 跨框架共享语义契约，不共享组件运行时

- **日期**：2026-08-26
- **状态**：已决定
- **决定**：fx-ui 拆为“框架无关核心契约 + 框架适配器”。核心从既有 Token、组件、Playground、图标、页面和 Agent UI 真相源派生，只包含语义身份、受治理选项、状态、意图、约束和数据协议；React 保持当前唯一 `ready` 参考适配器。Vue 2 只登记为 `planned` 并保留准入门，当前不新增 Vue 源码、依赖或能力声明。
- **实现边界**：组件运行时、无头原语绑定、图标包绑定、render/ref/event 约定和 Blocks renderer 由各适配器独立实现。portable contract 不包含 JSX、框架源码路径或框架包名；缺少结构化事实的组件标为 `identity-only`，不虚报完整 API。Token 仍是 `Primitive -> Semantic -> Component Usage`，不新增组件 Token 命名空间。
- **放弃**：① 将 React JSX 自动翻译为 Vue；② 用 Web Components 作为统一运行时底座；③ 复制一份 Vue Token 真相源；④ 先建空 Vue 目录或占位组件后补治理；⑤ 把 planned 写成已支持。
- **原因**：设计语言和交互意图可以跨框架稳定复用，但组件生命周期、事件、受控值和无障碍原语具有框架差异。共享 contract 能防止两套实现语义漂移，同时避免为了代码复用制造最低公分母黑盒。
- **影响**：新增 `framework-adapters` SSOT、派生 `framework-core` contract 和 `check:framework-core`；后续新框架必须先完成依赖评估、canonical ID 映射、API/交互/无障碍映射及独立构建和视觉验收，再升级适配器状态。
- **相关文件**：`docs/FRAMEWORK_ADAPTERS.md`、`docs/data/{framework-adapters,framework-core}.manifest.json`、`scripts/build-framework-core.mjs`、`docs/{ARCHITECTURE,TECH_STACK}.md`

### DEC-076: Foundation 物理独立，语义主题保持唯一公开入口

- **日期**：2026-08-27
- **状态**：已决定（CSS 真相源部分被 DEC-080 取代）
- **决定**：将全部无语义物理 Token 迁入 `theme/foundation.css`，由 Foundation 维护者独占写权限；`theme/fx-theme.css` 固定导入它，只保存语义映射、Tailwind 映射和运行时样式，并继续作为应用与分发侧的唯一 CSS 入口。构建工具按 Foundation → Semantic 顺序读取两个真相源，统一派生 manifest，不复制值。
- **主题输入边界**：接入方可以在运行时覆盖 `--fx-brand` 作为唯一主题色输入，让既有色阶继续派生；覆盖 CSS 变量不等于修改、上传或扩张 Foundation 刻度，也不会开放其他物理 Token。
- **放弃**：① 继续把 Foundation 与语义变量混在一个大文件；② 要求应用分别导入两个 CSS 文件；③ 在 `fx-theme.css` 复制 Foundation 值；④ 为每个技术框架复制一份基础 Token。
- **原因**：物理隔离让所有权、评审和跨框架消费边界可执行；保留单一公开入口则避免接入方承担导入顺序和内部文件结构，兼顾治理与易用性。
- **影响**：Foundation 专项检查会阻止语义 Token 混入、重复定义和入口断链；Token 文档、构建脚本、页面语义来源和治理页面必须区分物理值真相源与语义公开入口。
- **相关文件**：`theme/{foundation,fx-theme}.css`、`scripts/{build-design-tokens,check-foundation-tokens,check-tokens-sync}.mjs`、`docs/{TOKENS,MAP,ARCHITECTURE}.md`、`docs/data/design-tokens.json`

### DEC-077: 主题生成以受治理 Preset Contract 为输入，适配器只注入受控 Seed

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：新增 `theme-presets.manifest.json` 统一管理主题默认值、可选维度、Foundation 引用、派生算法版本、发布状态、质量门与输出白名单。React 运行时从该 contract 读取选项，并通过框架无关纯函数只写 `--fx-brand` / `--fx-brand-vivid` seed 对；完整色阶继续由 Foundation CSS 派生，语义层自动消费。算法 v2 保留品牌原色，同时增加固定明度的浅色三态与白字实心操作阶。
- **迁移结果**：字体、密度、圆角、阴影与动效均已从运行时裸值迁到 Foundation reference；CSS、contract JSON、shadcn registry 与 framework core 由同一 contract 生成，不再保留 `legacy-runtime-pending-foundation-migration` 副本。
- **放弃**：① 每个框架维护一份主题配置和算法；② React 同时覆盖 `--fx-brand`、派生色阶和语义别名；③ 把运行时预览直接当作已发布 dark theme；④ 为迁移方便复制一份 Foundation 物理值到 manifest。
- **原因**：适配器只输入 contract 白名单内的 Seed 可以利用 CSS 变量的原生继承和派生能力，消除运行时重复写入完整色阶与语义别名的漂移；结构化 contract 又为版本、审计、导出和未来框架适配提供稳定边界。
- **影响**：主题选项和默认值的改动必须从 preset contract 发起，并通过 `check:theme-presets`；`framework-core` 直接投影同一 contract；`fx theme show/audit/build` 分别统一查询、审计和重建 Preset + Semantic + portable core 链路。未来主题导出器和框架适配器不得从 React 源码反向提取。
- **相关文件**：`docs/data/{theme-presets,theme-audit,framework-adapters,framework-core}.manifest.json`、`src/lib/{theme-runtime,theme-derivation}.ts`、`scripts/{check-theme-presets,build-theme-artifacts,build-theme-audit,build-framework-core}.mjs`、`docs/{MAP,TOKENS,FRAMEWORK_ADAPTERS}.md`

### DEC-078: 品牌展示色与白字实心操作色分离，light/dark 以浏览器审计为发布门

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：主题 seed 继续表达品牌原色；主操作与功能色的实心面改用 Foundation `solid / solid-hover / solid-active` 派生阶，固定保留白字，并以 WCAG 2 `4.5:1` 作为普通文字门槛。浅色 01/02/03 改为固定 OKLCH 明度，避免纯白和高亮自定义 seed 生成不可区分状态。`slate` 使用独立 `--fx-seed-slate`，禁止反向引用由品牌派生的 Neutrals。
- **发布门**：`theme-presets.manifest.json#qualityGates` 是阈值与审计范围 SSOT；`build-theme-audit.mjs` 在 Chromium 中解析最终 CSS，对 7 个预设、7 个极端自定义样本、light/dark 的语义对比度和状态 Delta E 生成证据。不得降低阈值或改截图掩盖失败。只有审计通过的模式可进入 `publishedModes`；v1.1.0 起 light/dark 均已发布。
- **放弃**：① 根据背景自动把 primary 文字切黑；② 直接把亮 seed 当按钮底并接受低对比；③ 只审默认橙色；④ 把 dark 预览直接写成发布支持；⑤ 手填第二份 shadcn theme JSON。
- **原因**：品牌原色承担识别，实心操作面承担可读性，两者强行共用一个值会让亮黄、绿、橙在白字下系统性失败。真实浏览器审计还能捕获 CSS 变量循环、相对颜色和色域裁切，静态字符串检查无法替代。
- **影响**：默认橙色按钮比品牌展示橙更深，但文字保持白色；`registry/fx-theme.json` 由发布生成器输出 light/dark，不再手工维护；算法或阈值变化必须升级 contract 版本并重跑审计、全量检查与视觉回归。
- **相关文件**：`theme/{foundation,fx-theme}.css`、`docs/data/{theme-presets,theme-audit}.manifest.json`、`registry/fx-theme.{css,json}`、`scripts/{build-theme-artifacts,build-theme-audit,check-theme-presets}.mjs`

### DEC-079: FDS 采用四层 Token 与受治理 Styling Hooks

- **日期**：2026-08-27
- **状态**：已决定（分阶段实施）
- **决定**：设计系统正式命名为 FDS，目标 Token 架构为 `Primitive / Seed -> Map -> Semantic -> Component`。Global Styling Hooks 使用 `--fds-g-*`，经准入的 Component Styling Hooks 使用 `--fds-c-*`；命名语法、受控词典、公开性、稳定性和迁移阶段由 `token-naming.manifest.json` 统一声明，`TOKEN_NAMING.md` 只解释原因与评审方式。四层是依赖边界，不要求每个 Token 机械经过全部层级；结构性 Component Hook 可以引用 Primitive，视觉 Component Hook 默认引用 Semantic。
- **组件准入**：默认仍由组件直接消费 Global Semantic。只有存在真实独立换肤需要、Global Semantic 无法准确表达、跨 variant/产品/框架复用，并绑定 owner、文档、合同测试和视觉证据时，才发布 `--fds-c-*`。组件开发者拥有提案与维护责任，不拥有自由造词权限；调用处继续禁止通过 `className` 或局部 CSS 覆盖组件外观。
- **公开边界**：内部合同包含四层，对外只发布标为 `public-global` / `public-component` 的 Hook。接入方只在主题根或受治理 Theme Provider 覆盖公开 Hook；Primitive、Map 和未发布的内部映射不构成兼容承诺。页面类型只把场景角色映射到 Core Semantic，不增加第五层物理值。
- **迁移**：按 `contract-only -> dual-write -> fds-primary -> legacy-removal` 推进。第一阶段仅冻结合同，不改变现有 React 运行时；后续由生成器输出 FDS 真相和 `--fx-*` 引用别名，禁止复制物理值。新增公开 Hook 发 Minor，删除/改名/改变含义发 Major，废弃别名至少保留一个 Major 窗口。
- **取代范围**：本决策取代 DEC-037 与 DEC-075 中“当前不新增组件 Token 命名空间”的架构结论，但保留两者关于不批量生成 Component Token、不复制框架运行时、不开放原始视觉值和必须经过真实组件治理的限制。
- **放弃**：① 只把 `--fx-*` 文本替换成 `--fds-*`；② 让所有内部变量自动成为公开 Hook；③ 为每个组件状态机械生成 `--fds-c-*`；④ 让功能色全部跟随品牌色改色相；⑤ 在命名合同和检查器之前先迁移运行时。
- **原因**：FDS 需要同时服务内部组件治理和外部主题接入。四层合同能够隔离物理值、算法色阶、跨场景意图与组件稳定接口；Global/Component Styling Hooks 又能为跨框架消费者提供明确的公开面。机器词典和分阶段别名避免命名依赖个人习惯或一次性大迁移。
- **影响**：新增 `TOKEN_NAMING.md`、`token-naming.manifest.json` 与 `check:token-naming`；后续 DTCG SSOT、FDS CSS/JSON 发布物、Button/Input/Table 试点和文档站命名页面均必须从该合同派生。React API 与当前视觉在 contract-only 阶段保持不变。
- **相关文件**：`docs/{TOKEN_NAMING,TOKENS,MAP,DOCUMENTATION}.md`、`docs/data/{token-naming,doc-structure}.manifest.json`、`scripts/check-token-naming.mjs`、`AGENTS.md`

### DEC-080: DTCG Primitive 与生成式 Map 成为 Foundation 真相源

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：`tokens/source/primitive.tokens.json` 以 DTCG 结构保存 155 个 Primitive/Seed，`tokens/source/map.tokens.json` 保存色板算法、12 阶彩色/20 阶中性范围、实心操作档和已审核例外；`build-fds-foundation.mjs` 展开 241 个 Map，生成 396 个当前运行时变量与 FDS portable contract。`theme/foundation.css` 从物理值 SSOT 降为生成产物，禁止手改；`theme/fx-theme.css` 继续是 Semantic 真相源和唯一公开 CSS 入口。
- **迁移边界**：当前仍为 `contract-only`，生成的运行时变量保持 `--fx-*`，FDS 名称只进入 Token source 与 portable contract。生成器逐项证明迁移前后 396 个变量名称和值完全一致；下一阶段进入 dual-write 时才在运行时声明 `--fds-g-*` 并生成 `--fx-*` 引用别名。
- **Map 规则**：Map 不保存手填的 241 项值副本，而由 family、step、公式和少量显式 exception 展开。功能语义不进入 Map family：危险、成功、警告、信息分别在 Semantic 映射到 `red`、`green`、`amber`、`blue`；品牌 Seed 只影响 brand 与轻染 neutral，不改变固定功能色色相。
- **放弃**：① 继续手改大体量 Foundation CSS；② 在 DTCG 和 CSS 同时维护物理值；③ 把相对颜色公式伪装成 DTCG 原始 color value；④ 为了统一编号压缩现有 12/20 阶色板；⑤ 在 source 建立后仍让下游绕开统一构建入口。
- **原因**：Primitive 原始事实适合标准结构化格式，Map 派生关系适合算法合同；将二者分开能让设计工具、Agent、框架适配器和 CSS 生成器共享同一来源，又不会把计算公式错误建模为原始色值。生成式 CSS 还能消除 396 项手改漂移。
- **影响**：`build:tokens` 现在先生成 Foundation；`check:fds-foundation` 校验 CSS/portable contract 新鲜度，`check:token-naming` 校验全部 396 个 FDS 名称和 legacy 映射。Token 路由、AI 红线、架构、代码结构和文档站样式来源同步切换。
- **相关文件**：`tokens/source/{primitive,map}.tokens.json`、`scripts/build-fds-foundation.mjs`、`theme/foundation.css`、`docs/data/fds-foundation.manifest.json`、`docs/{TOKENS,TOKEN_NAMING,MAP}.md`

### DEC-081: Global Semantic 独立为 source，并由 FDS 真相生成兼容别名

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：`tokens/source/semantic.tokens.json` 成为 Global Semantic SSOT，显式登记稳定意图、light/dark 模式值、公开性、稳定性和兼容别名；`build-fds-semantic.mjs` 生成 `theme/fds-semantic.css` 与 portable contract。`theme/fx-theme.css` 不再保存语义值，只保留唯一公开入口、Tailwind/shadcn 装配和结构运行时映射。
- **命名口径**：Semantic 使用 `category -> property -> role -> modifier -> state`，其中 `modifier` 仅允许 `subtle/raised/floating/interactive/categorical` 等稳定形态，state 始终置尾。Global 名称禁止组件实体词，因此旧 Card/Popover 插槽分别映射为 `surface-raised` / `surface-floating`。
- **兼容与主题输入**：迁移阶段进入 `dual-write`。Foundation/Semantic runtime 先声明 `--fds-g-*` 真相，再生成 `--fx-*` 和 shadcn 无前缀引用别名；框架适配器只写 `--fds-g-color-seed-brand` / `--fds-g-color-brand-vivid`，禁止继续直接写 legacy seed。兼容别名至少保留一个 Major 窗口。
- **迁移例外**：为保证已有视觉基线，页面画布、BI 分类色和 Sidebar 两个历史值暂以带 `rawValueReason` 的 experimental Semantic 记录；它们不是新增任意裸值的许可，后续需在不改变公开结果时归并到受治理 Foundation/Map。
- **原因**：如果 Semantic 继续手写在公开入口，FDS、legacy、shadcn 和 dark override 会形成多个隐式真相；结构化 source + 生成别名可以让命名、权限、模式、跨框架发布和退役窗口被同一检查链管理。
- **验证**：迁移前发布 CSS 与新运行时对 116 个兼容变量做 light/dark 浏览器渲染对比，结果逐项一致；生成检查、Token sync、主题审计和视觉回归共同作为发布门。
- **取代范围**：本决策取代 DEC-076、DEC-077、DEC-080 中“Semantic 由 `theme/fx-theme.css` 手写”及“主题适配器写 `--fx-brand*`”的实现结论，其余治理边界保留。
- **相关文件**：`tokens/source/semantic.tokens.json`、`scripts/build-fds-semantic.mjs`、`theme/{fds-semantic,fx-theme}.css`、`docs/data/{fds-semantic,token-naming}.manifest.json`、`src/lib/theme-derivation.ts`、`docs/{TOKEN_NAMING,TOKENS,MAP}.md`

### DEC-082: Button、Input、Table 作为首批受准入 Component Hooks

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：新增 `tokens/source/component.tokens.json`，只登记通过 DEC-079 准入门的 Component Styling Hooks，并由 `build-fds-components.mjs` 生成 runtime 与 portable contract。首批开放 13 个 Hook：Button 默认主操作的 5 个表面状态、Input 的 5 个表面/边框状态、Table 的 3 个 density 行高。
- **命名纠正**：Component Hook 必须与真实组件 API 对齐。Button 没有 `brand` variant，因此默认变体省略 variant 段；Table 使用 `compact / default / comfortable` density，因此不使用虚构 `md`，且默认 density 在名称中省略。
- **准入边界**：Button 与 Input 的视觉 Hook 只引用 Global Semantic；Table 的结构 Hook 直接引用 Primitive sizing。每个组件必须登记 owner、独立换肤需要、Global Semantic 缺口、跨场景复用、文档、合同测试和视觉测试。未登记组件仍直接消费 Global Semantic，不自动生成 Hook。
- **发布**：13 个 Hook 标记为 `public-component + experimental`，只能在主题根或受治理 Theme Provider 覆盖；单组件实例仍禁止局部覆写。新增公开接口按 SemVer 将主题合同升级为 v1.3.0，React API 和默认计算值不变。
- **放弃**：① 为所有 variant/state/slot 批量生成 Hook；② 把 tone 当 variant 写进名称；③ 为 Table 强行套通用 `sm/md/lg`；④ 仅在 React 源码声明变量而不进入 portable core 与 release；⑤ 用组件 Hook 取代 variant/size/state API。
- **相关文件**：`tokens/source/component.tokens.json`、`scripts/build-fds-components.mjs`、`theme/fds-components.css`、`docs/data/fds-components.manifest.json`、`src/components/ui/{button,input,table}.tsx`、`docs/components/{button,input,table}.md`

### DEC-083: FDS 前缀阶段切换必须由迁移就绪审计放行

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：新增由真实仓库状态派生的 `fds-migration-audit`，分别扫描 runtime source、公开装配入口、生成兼容 runtime、发布物、文档、治理脚本和 Token source；从 Foundation/Semantic portable contract 生成唯一的 legacy-to-FDS replacement catalog，并用 `dual-write`、`fds-primary`、`legacy-removal` 三道机器门判断阶段是否就绪。
- **当前证据**：`dual-write` 合规；runtime source 仍有 44 个文件、547 处 `--fx-*`，其中 341 处没有权威 replacement、9 处为动态拼接。公开装配入口只有 2/193 处是直接 FDS alias，因此当前明确不能切到 `fds-primary`。
- **迁移规则**：先解决无 replacement 和动态名称，再按组件/页面/适配器等完整领域迁移已有映射；禁止全仓字符串替换。`fds-primary` 要求 runtime source 旧前缀归零、公开装配只保留直接 FDS alias、replacement 覆盖完整；legacy alias 从 v1.3.0 起至少保留到 v2.0.0，并且只有全发布链旧前缀归零后才能删除。
- **放弃**：① 凭“看起来迁完了”手工改 phase；② 用 grep 总数代替可定位、可复现的清单；③ 把所有旧结构变量自动公开成 Component Hook；④ 达到 Major 版本后不看消费者就删除 alias。
- **原因**：前缀迁移横跨源码、生成 CSS、发布 JSON、框架合同和文档。没有阶段门时，局部迁移容易造成两套真相、遗漏动态名称，或提前破坏外部消费者；派生审计能把兼容期变成可证明的工程状态。
- **相关文件**：`docs/data/{token-naming,fds-migration-audit}.manifest.json`、`scripts/build-fds-migration-audit.mjs`、`docs/{TOKEN_NAMING,MAP,DOCUMENTATION,TESTING}.md`、`package.json`

### DEC-084: 未映射旧变量先分类归属，再建立 FDS replacement

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：所有没有权威 replacement 或仍使用动态名称的 runtime `--fx-*`，必须先在 `token-naming.manifest.json#migration.legacyDispositions` 命中唯一去向，再允许改 source 或消费者。当前固定四类：运行时 profile 度量进入受评审的 internal Global Semantic；纯组件实现变量退出 FDS 保留前缀；组件视觉动态映射走 owner 的语义缺口与 Component Hook 准入；Foundation 文档展示直接消费 FDS contract。
- **首批迁移**：Token 颜色、Seed、Map、间距、层级、阴影和动效文档已从旧展示名迁到 FDS Foundation/Semantic 名称；`time-picker` 的日历高度被确认没有跨组件设计含义，改为本地 `--date-time-picker-calendar-height`。剩余 Avatar 动态色映射保持不动，等待组件 owner 准入评审。
- **机器门**：迁移审计新增 `runtime-action-items-have-governed-dispositions` 条件，当前 28/28 个未映射或动态 action item 已分类。审计从 44 个 runtime 文件、547 处旧引用下降为 37 个文件、365 处；未映射 exact 为 324 处，动态拼接从 9 处下降到 1 处。
- **放弃**：① 把所有结构变量批量替换为 Primitive；② 把旧组件变量自动升级成公开 `--fds-c-*`；③ 只改文档显示、不更新审计；④ 为消除动态拼接而在组件内硬编码色值。
- **原因**：旧前缀混合了设计意图、主题 profile、实现细节和文档标签。只按字符串形态迁移会扩大公开 API、丢失 profile 派生能力，或把非 Token 实现细节永久写进 FDS 合同；先分类能让每类进入正确治理路径。
- **相关文件**：`docs/data/{token-naming,fds-migration-audit}.manifest.json`、`scripts/{build-fds-migration-audit,check-token-naming}.mjs`、`src/pages/docs/tokens/{color-seed-preview,color-palette-with-tabs,tokens-colors-page,tokens-motion-page}.tsx`、`src/components/fx/time-picker.tsx`、`docs/{TOKEN_NAMING,CHANGELOG}.md`

### DEC-085: Theme profile 输出属于 internal Global Semantic

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：排版缩放、控件尺寸/间距、面板间距、导航尺寸和主题动效时长统一建模为 41 个 `internal` Global Semantic Token。`theme-presets.manifest.json` 只声明 `Semantic 输出 -> Foundation 引用`的 compact / standard / spacious 映射；React 运行时和组件消费 FDS Semantic 名称，不保存物理值副本。
- **命名**：普通意图 Semantic 使用 `category -> property -> role -> modifier -> state`；内部 profile Semantic 使用 `category -> property -> role -> size`。例如 `--fds-g-font-size-control-sm`、`--fds-g-sizing-navigation-topbar-block`和 `--fds-g-motion-duration-theme`。Profile 末尾尺寸轴不是交互状态，且不自动公开为 Styling Hook。
- **层级边界**：Theme Preset 是配置合同，不是第五层 Token。Profile 输出之所以不直接改为 Primitive，是因为它们的物理引用会随密度预设切换；之所以不改为 Component Hook，是因为它们是跨组件运行时角色，不存在单组件独立换肤缺口。
- **兼容与证据**：`build-fds-semantic` 继续生成 41 个旧 profile 别名，因此组件 API、默认尺寸和视觉不变。迁移完成后 Semantic 总数为 141、兼容别名为 157；runtime 旧前缀从 37 个文件/365 处降到 6 个文件/41 处，未映射 fixed reference 归零，剩余 1 处 Avatar 动态名称单独评审。
- **放弃**：①让组件直接选择固定 Primitive；②为每个控件生成同义 Component Hook；③继续让 Preset 向 `--fx-*` 写物理值；④把 Theme Preset 误画为新的 Token 层。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/{theme-presets,token-naming,fds-semantic,fds-migration-audit}.manifest.json`、`src/lib/theme-runtime.ts`、`theme/fx-theme.css`、`scripts/{build-fds-semantic,check-token-naming,check-theme-presets}.mjs`、`docs/{TOKEN_NAMING,TOKENS}.md`

### DEC-086: Avatar 分类色使用组件内部静态 Map 查表

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：`AvatarFallback colorful` 保留按内容 hash 选择 brand/green/amber/red/blue/purple 六个色系的行为，但由动态 `--fx-${tone}-08` 改为组件内部 `AVATAR_TONE_BACKGROUNDS` 静态查表。六个背景精确引用 FDS Map 的 `base-80`，反白前景引用 Global Semantic `--fds-g-color-text-inverse`。
- **分层判断**：六色只用于稳定分散身份，不表达跨组件的 success/warning 等意图，也没有单独主题化 Avatar 色盘的需求；因此不创建 Global Semantic，不准入 `--fds-c-avatar-*` 公开 Hook。Foundation Map 的引用只存在于受治理的组件实现内，不授权页面和产品代码直接消费 Map。
- **兼容与证据**：`base-80` 与旧 `08` 是同一生成色阶，hash 顺序、组件 API 和计算颜色均不变；命名检查固定校验六项静态映射、inverse 前景及禁止动态 Token 名称。
- **放弃**：① 为六个色系创建公开 Component Hook；② 创建跨组件 categorical Semantic 但没有复用证据；③ 继续动态拼接旧前缀；④ 在源码写死六个色值。
- **相关文件**：`src/components/ui/avatar.tsx`、`docs/components/avatar.md`、`docs/data/{components,token-naming,fds-migration-audit}.manifest.json`、`scripts/check-token-naming.mjs`

### DEC-087: 运行时源码完成 FDS 主名称迁移

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：将剩余 39 处有权威 replacement 的 runtime source 引用迁到 FDS 主名称。Table 固定列阴影使用已有 Global Semantic `color.shadow.default`；文档侧栏、DropdownMenu 分组标签和 ComponentPlayground 的低强调用途新增两个 `internal` Semantic：`color.text.subtle` 与 `color.surface.subtle`；Tag 分类色与 Avatar 相同，组件内部静态引用 FDS Map，不开放 Component Hook。
- **分层边界**：页面和跨组件用途不得为清零审计而直接改用 Foundation Map；找不到等值语义时先建立受评审的 internal Semantic。Tag 的 `color` 是受控分类 API，Map 查表只存在于组件实现，调用方不能直接选色阶或局部覆写。两个 internal Semantic 保持既有值，不进入对外发布面。
- **兼容与证据**：Semantic 从 141 增至 143，兼容 alias 仍为 157；runtime source 从 5 个文件/39 处降为 0。React API、Tag 分类色、Table 固定列阴影与文档站浅色/深色计算值保持不变；旧 `--fx-*` alias 仍按 v1.3.0 至 v2.0.0 的窗口存在于生成兼容层。
- **放弃**：① 页面直接引用 FDS Map；② 为 Tag 32 个色阶映射创建公开 Hook；③ 把 `neutrals-02/10` 机械改成含义不符或数值不同的现有 Semantic；④ runtime 清零后立即删除兼容 alias。
- **相关文件**：`tokens/source/semantic.tokens.json`、`src/{app/docs-sidebar,components/fx/component-playground,components/ui/{dropdown-menu,table,tag}}.tsx`、`docs/data/{components,fds-migration-audit}.manifest.json`、`docs/components/{component-playground,dropdown-menu,table,tag}.md`

### DEC-088: FDS 进入 fds-primary，兼容别名继续受版本门保护

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：在迁移审计证明 runtime source 与公开装配入口旧前缀归零、replacement 完整且发布物包含全部 FDS 合同后，将命名合同阶段从 `dual-write` 切换到 `fds-primary`。阶段值只由 `token-naming.manifest.json` 声明，Foundation、设计数据、跨框架核心、迁移审计与 release 均从该来源派生。
- **主名称边界**：`theme/fx-theme.css`、React runtime、`design-tokens.json`、Agent contract 与 portable core 使用 `--fds-g-*` / `--fds-c-*` 主名称；`--fx-*` 只允许存在于生成兼容 CSS、发布兼容层、Token source 的 `legacyName/aliases` 和迁移 replacement catalog。公开装配不得绕回兼容别名。
- **兼容策略**：切换主名称不等于删除旧接口。v1.3.0 引入的 legacy alias 至少保留到 v2.0.0；`legacy-removal` 还必须同时满足合同显式切换、运行时/生成物/发布物旧前缀全部归零。达到版本号但仍有消费者时不得删除。
- **证据**：`fds-primary` 当前阶段门全部通过，runtime source 与公开装配均为 0 个 legacy reference，13/13 Component Hook 已发布；下一阶段因版本仍为 v1.3.0 且兼容 alias 尚在而保持 not-ready。主题浏览器审计继续覆盖 14 个输入、light/dark 两种模式。
- **放弃**：①只改 phase 字符串而保留生成器写死阶段；②进入主名称阶段就删除旧 alias；③让派生数据继续以旧名作为主字段；④用发布版本代替真实消费者审计。
- **相关文件**：`docs/data/{token-naming,fds-migration-audit}.manifest.json`、`docs/data/design-tokens.json`、`theme/fx-theme.css`、`scripts/{build-fds-foundation,build-design-tokens,build-fds-migration-audit,check-token-naming}.mjs`、`docs/{TOKEN_NAMING,TOKENS,ARCHITECTURE,FRAMEWORK_ADAPTERS}.md`

### DEC-089: 公共 Styling Hooks 由 Theme 与 Framework Core 同源发布

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：从 `fds-semantic.manifest.json` 的 `public-global` 和 `fds-components.manifest.json` 的 `public-component` 生成唯一公共 Hook 投影；同一生成规则分别写入 Theme contract 与 framework core，release 构建要求两份结构逐字段一致。公共合同版本升为 `1.0.0-draft.4`。
- **公开边界**：公共投影只包含名称、类型、层级、稳定性、owner、组件归属和文档指针；默认值由统一 CSS 提供。Primitive、Map、internal Semantic、兼容 alias 和组件局部变量即使存在于发布 CSS，也不构成公开 API。框架适配器不得从内部合同自行扩大覆盖面。
- **稳定性**：主题算法、light/dark 模式与 CSS 产物可以保持 stable，同时 Styling Hooks 合同继续为 experimental。只有所有公开 Hook 完成评审且没有 experimental 项时，Hook 合同才能升 stable；Component Hook 仍逐个走语义缺口和证据准入。
- **证据**：当前公共投影为 97 个 Global + 13 个 Component，共 110 项；Theme contract、portable core 和 release manifest 绑定同一版本与计数。构建漂移会由 `check:theme-artifacts`、`check:framework-core` 或 `check:theme-release` 阻断。
- **参考适配**：React 的 Button、Input、Table 映射显式绑定全部 13 个 Component Hook，构建检查组件归属、重复/未知名称和源码真实消费；release 公开绑定计数而不泄漏框架源码路径。planned 适配器不得提前声明绑定。
- **放弃**：①把内部四层全量合同直接声明为公开；②由 React/Vue 适配器各自筛选 Hook；③因为主题产物 stable 就批量把 Hook 改为 stable；④复制第二份手填公共清单。
- **相关文件**：`docs/data/token-naming.manifest.json`、`scripts/lib/fds-public-hooks.mjs`、`scripts/{build-theme-artifacts,build-framework-core,build-theme-release}.mjs`、`registry/fx-theme.{contract,release}.json`、`docs/data/framework-core.manifest.json`

### DEC-090: 首批 Component Hooks 通过稳定门并以 v1.4.0 发布

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：Button、Input、Table 的 13 个 Component Hook 从 experimental 晋级 stable，Component contract 从 draft 升为 `1.0.0`，公共命名合同升为 `1.0.0-draft.5`，主题发布升为 `v1.4.0`。97 个 Global Hook 尚未逐项完成同等评审，继续保持 experimental，因此公共合同整体仍是 experimental。
- **稳定门**：stable Component Hook 除原有 owner、独立换肤需求、语义缺口、跨场景复用、文档、合同测试和视觉测试外，还必须证明文档锚点、检查脚本、视觉用例真实存在，至少有一个 ready 参考适配器显式绑定，并由对应组件源码实际消费。任何证据漂移都会阻断命名或框架核心检查。
- **版本策略**：晋级 stable 会增强公开兼容承诺，按 Minor 发布；不得改写已经发布的 v1.3.0 含义。未来删除、改名或改变 stable Hook 含义仍必须走 Major，新增 Hook 先以 experimental 进入。
- **兼容与视觉**：默认引用和生成 CSS 值没有变化，React 组件源码只增加机器合同侧的绑定声明，没有新增 prop、variant 或 DOM 结构；Vue 2 保持 planned 和零绑定。light/dark 主题审计继续作为 release 门。
- **放弃**：①把 110 个 Hook 一次性全部标 stable；②仅凭源码出现变量名就晋级；③不升版本覆盖 v1.3.0 release；④让 planned 适配器充当稳定证据。
- **相关文件**：`tokens/source/component.tokens.json`、`docs/data/{token-naming,framework-adapters}.manifest.json`、`scripts/{check-token-naming,build-framework-core}.mjs`、`registry/fx-theme.release.json`、`docs/components/{button,input,table}.md`

### DEC-091: Global Hook 只按 FDS 直接审计覆盖分组晋级

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：Theme Preset 的对比度与交互态质量门不再通过 `--fx-*` 或 shadcn alias 间接验证，全部改为直接引用 public-global `--fds-g-*`。首批被质量门覆盖的 34 个表面/文字、核心操作、状态和导航 Hook 晋级 stable，Semantic contract 升为 `1.0.0-draft.2`，公共命名合同升为 `1.0.0-draft.6`，主题以 `v1.5.0` 发布。
- **Global 稳定门**：stable Global Hook 必须具有 public-global visibility、Semantic owner、生成 runtime、FDS 主名称质量门覆盖、ready Theme audit 和公开合同记录。质量门覆盖 7 个受治理主题与 7 个极端自定义 Seed的 light/dark 对比度和状态差异；检查禁止重新使用兼容别名作为审计输入。
- **分组边界**：本轮只稳定直接进入对比度 pair 或交互 state group 的 34 项。未被当前审计证明的 disabled、border/ring、shadow、data categorical 以及其他表面/文字/导航用途继续 experimental；存在相同默认值或已有消费者不构成稳定证据。
- **兼容与版本**：从 alias 审计切到 FDS Hook 审计不改变解析值，浏览器审计结果仍为 14 类输入 × 2 模式、零失败。稳定晋级增强兼容承诺，采用 Minor 发布；React API、组件源码和视觉不变。
- **放弃**：①因为别名审计通过就宣称 FDS Hook 已被直接验证；②一次性稳定全部 97 个 Global Hook；③只按名称族推断未覆盖状态；④降低对比度或状态差异阈值换取通过。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/{theme-presets,token-naming,theme-audit}.manifest.json`、`scripts/{check-theme-presets,check-token-naming}.mjs`、`registry/fx-theme.release.json`

### DEC-092: FDS 命名模板必须成为可执行字段合同

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：保留面向网页和文档的简洁 grammar 模板，同时在 `token-naming.manifest.json#grammar.definitions` 为 Primitive Seed、Primitive Scale、Color Map、Map Anchor、Semantic Intent、Semantic Profile、Component Visual 与 Component Structural 八类子语法登记 layer、namespace、字段顺序、必填/可选、权威来源和末位字段。每个真实 Token 必须且只能命中一种子语法。
- **Map 边界**：连续 Map 使用 `family -> scale -> range`，scale 仅允许 `base` / `solid`；没有连续 range 的算法锚点必须以完整名称进入受控词典，当前只有 `brand-vivid` 与 `neutral-anchor-dark`。Map 不得混入交互 state 或组件意图。
- **机器门**：命名检查会验证模板占位符与字段合同逐项一致、词典路径有效、复合 category 采用最长匹配、state 位于末尾、Component canonical ID 存在，并让全部 396 个 Foundation、143 个 Semantic 和 13 个 Component Token 通过真实语法分类。错误示例也必须被对应层语法拒绝。
- **兼容与发布**：命名合同升为 `1.0.0-draft.7`，公开 Hook 名称、数量、stability、默认值和主题发布版本不变；React API、组件源码与视觉不变。Theme contract 和 framework core 继续从同一命名合同生成。
- **放弃**：①只在 Markdown 写模板；②用一条万能长公式覆盖四层；③让检查器只看前缀与 kebab-case；④为适配现有特殊 Map 名称保留未登记例外。
- **相关文件**：`docs/data/token-naming.manifest.json`、`scripts/check-token-naming.mjs`、`docs/{TOKEN_NAMING,DECISIONS,CHANGELOG}.md`、`PROJECT.md`

### DEC-093: Global stable 只接受 Theme audit 的实际合格清单

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：Theme audit 从每个真实浏览器样本派生 `coverage.stableEligibleHooks`；Global Hook stable 门只认可这份实际通过清单，不再把“名称出现在 qualityGates 配置中且总体 audit ready”视为充分证据。候选门可以记录失败而不破坏已有 stable Hook 的发布，但候选 Hook 在全部样本通过前不得晋级。
- **首组候选**：为 `border-strong` 对 page、`border-interactive` 对 control、`ring-focus` 对 page 建立合成透明度后的 WCAG 非文字 3:1 审计，覆盖 7 个受治理主题、7 个极端自定义 Seed、light/dark 共 28 个样本。通过率分别为 `0/28`、`0/28`、`5/28`，最差对比度为 `2.23`、`1.75`、`1.02`，三项继续 experimental。
- **边界**：候选前景允许带 alpha，但审计必须先与相邻背景合成再计算对比度；背景仍必须解析为不透明颜色。chrome/faint/container/subtle/default 属于装饰与层级分隔角色，不用错误的 3:1 门槛强行稳定，后续需要独立的顺序与可辨识证据。
- **兼容与视觉**：本轮没有修改 Semantic 值、组件样式、React API 或视觉基线，主题发布仍为 `v1.5.0`，公共合同仍为 `1.0.0-draft.7 / experimental`。新增证据只收紧晋级条件。
- **放弃**：①降低 3:1 阈值；②把总体 audit ready 等同于每个 Hook 合格；③忽略 alpha 直接比较未合成色；④为了凑 stable 数量立即加深全局边框或改组件 focus 样式。
- **相关文件**：`docs/data/{theme-presets,theme-audit}.manifest.json`、`scripts/{build-theme-audit,check-theme-presets,check-token-naming}.mjs`、`docs/TOKEN_NAMING.md`、`PROJECT.md`

### DEC-094: 文字与图标按用途强制审计，链接按完整状态组评审

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：正常文字使用 4.5:1 强制门，有意义的非文字图标使用合成后 3:1 强制门；多状态文字交互必须在同一候选组中同时验证每个状态的文字对比度与相邻状态 ΔE，不能拆开稳定单个通过值。
- **晋级结果**：`text-secondary` 最低 7.74:1，`icon-muted` 最低 4.12:1，`icon-inverse` 最低 4.64:1，均覆盖 7 个受治理主题、7 个极端自定义 Seed、light/dark 共 28 个样本，晋级 stable。Semantic contract 升为 `1.0.0-draft.3`，公共命名合同升为 `1.0.0-draft.8`，主题以 `v1.6.0` 发布。
- **保留 experimental**：`icon-primary` 暗色最低 1.05:1，只通过 14/28；链接状态组只通过 14/28，浅色 default/hover 最低为 4.04/3.28，虽然 active 和状态 ΔE 合格，仍不得拆分晋级。disabled 颜色不使用普通文字阈值直接判定，后续必须联合状态可辨识与真实不可交互证据。
- **兼容与视觉**：只改变 stability 与发布元数据，不改变任何 Token 值、dark 公式、组件源码、React API 或视觉基线。Theme 与 Framework 公共投影仍逐字段一致。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/{theme-presets,theme-audit,token-naming}.manifest.json`、`scripts/{build-theme-audit,check-theme-presets,check-token-naming}.mjs`、`registry/fx-theme.release.json`

### DEC-095: Disabled Hook 必须使用视觉、行为与消费联合证据

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：disabled 不套用普通文字 4.5:1，也不因 CSS 名称带 `disabled` 就自动稳定。候选必须同时通过 enabled 与 disabled 的 OKLab `0.03` 差异、disabled 对相邻背景 `1.5:1` 的组织级可见度、真实组件 `disabled` / `aria-disabled` 行为断言，以及真实 runtime 消费证据。行为断言必须绑定现有 Playwright 测试标题和测试块内的具体断言，不能只写文件路径。
- **晋级结果**：`text-disabled`、`action-destructive-disabled`、`status-info-disabled` 在 7 个预设、7 个极端自定义 Seed、light/dark 共 28 个样本中全部通过，并具有 Button/Input/Select/Tabs 的原生或语义禁用证据与真实消费链，晋级 stable。Semantic contract 升为 `1.0.0-draft.4`，公共命名合同升为 `1.0.0-draft.9`，主题以 `v1.7.0` 发布。
- **保留 experimental**：`surface-control-disabled` 为 `0/28`，最低相邻对比度 `1.03`、最低 ΔE `0.018`；`action-primary-disabled` 为 `23/28`，最低相邻对比度 `1.46`；`link-disabled` 虽通过视觉和行为证据，但真实 Link 仍使用 opacity，缺少该 Hook 的 runtime 消费；success/warning disabled 只通过 `14/28` 且没有行为和消费证据。
- **兼容与视觉**：本轮只改变三项 stability 与发布元数据，不改变 Token 值、组件源码、React API 或视觉基线。候选失败不破坏已发布主题，但禁止对应 Hook 晋级。
- **放弃**：①把 disabled 按普通文字对比度一刀切；②只凭视觉或只凭 `disabled` 属性晋级；③把文件路径当作行为证据而不核对测试块断言；④为通过候选门降低阈值或修改现有颜色。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/{theme-presets,theme-audit,token-naming}.manifest.json`、`scripts/{build-theme-audit,check-theme-presets,check-token-naming}.mjs`、`registry/fx-theme.release.json`

### DEC-096: Shadow Hook 按完整 elevation 系统与真实使用证据晋级

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：阴影不套用文字或边框对比度门，而以完整 elevation 系统审计。Theme audit 在 7 个预设、7 个极端自定义 Seed、light/dark 与 `none/low/medium/high` 四档组合下生成 112 个 profile 样本，验证 shadow color alpha 严格按 default > soft > faint、low < medium < high，L1 < L2 < L3 几何范围递增，L1-up 与 L1 几何镜像，并要求每个 elevation Hook 绑定真实 runtime 消费和已提交视觉基线。
- **晋级结果**：`color-shadow-default/soft/faint` 与 `shadow-elevation-1/2/3` 通过全部 profile、Popover/Sheet/Dialog 消费和 WebsiteCard/Sheet/Dialog 视觉证据，晋级 stable。Semantic contract 升为 `1.0.0-draft.5`，公共命名合同升为 `1.0.0-draft.10`，主题以 `v1.8.0` 发布。
- **保留 experimental**：`shadow-elevation-1-up` 的两层负 y 几何与 L1 镜像均通过，但仓库只有文档展示，没有真实向上浮层消费者或视觉基线，因此不得因结构正确而提前稳定。
- **兼容与视觉**：本轮只改变六项 stability 与发布元数据，不改变 shadow 数值、主题 profile 值、组件源码、React API 或视觉基线。Tailwind `shadow-l1/l2/l3/l1-up` 继续作为 FDS Semantic Hook 的调用层映射。
- **放弃**：①只检查 CSS 能解析就批量稳定；②只凭文档示例把 L1-up 当真实消费者；③用单张截图证明全部层级；④为了让 L1-up 晋级而临时给组件添加不需要的阴影。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/{theme-presets,theme-audit,token-naming}.manifest.json`、`scripts/{build-theme-audit,check-theme-presets,check-token-naming}.mjs`、`registry/fx-theme.release.json`

### DEC-097: Foundation 以设计分类浏览、以 Token 层级筛选

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：不新增一套与现有颜色、排版、圆角、阴影、间距、层级和动效页面重复的 Foundation 浏览器。设计分类继续作为协作者的主浏览路径；`Seed / Primitive / Map` 作为概览中的筛选与治理维度，并提供搜索、只读详情、真相源和 Semantic 反向引用。
- **数据边界**：页面不得手填第二份 Token 清单或引用关系。Foundation Token 来自 `fds-foundation.manifest.json`，Semantic 引用从 `fds-semantic.manifest.json` 的真实 CSS 依赖直接或递归派生；Seed 只是 Primitive 的独立查看视图，不新增第五层真相源。
- **权限边界**：可视化与可查询不等于可编辑。Primitive/Seed 仍仅由 Foundation 维护者修改，Map 仍只允许生成器产出。后续 Seed 试算只能产生临时预览，写回和发布必须继续经过评审、构建与主题审计。
- **放弃**：①按 Seed/Primitive/Map 重建一套重复导航；②让设计负责人直接阅读 JSON；③为了展示引用关系手填静态映射；④在详情面板开放 Foundation 写入。
- **相关文件**：`src/pages/docs/tokens/{tokens-page,tokens-page-adapter}.tsx`、`docs/data/fds-{foundation,semantic}.manifest.json`、`PROJECT.md`

### DEC-098: Map 基准档统一由 Seed 生成

- **日期**：2026-08-27
- **状态**：已决定
- **决定**：彩色色阶的 90 档统一直接引用对应 Seed，不再为 `red.base.90` 保留单点人工覆盖。Map 继续由固定算法生成，Foundation 维护者只治理 Seed、算法和经过明确评审的结构性例外，不把逐档视觉微调当作常规能力。
- **调整边界**：整条色相需要变化时调整 Seed；特定使用意图需要不同颜色时在 Semantic 层选择合适档位；实心危险操作继续使用独立 solid 色阶。不得为了单个组件或页面直接修改 Map 某一档。
- **版本影响**：`--fds-g-color-red-base-90` 从 `#F04446` 回归 `color.seed.red` 的 `#EF4444`，主题以补丁版本 `v1.8.1` 发布；Token 名称、层级和组件 API 不变。
- **取代范围**：本决策取代 DEC-080 中允许当前 Map 保留少量逐档显式 exception 的实现结论；生成器仍保留空的受治理扩展槽，但当前合同没有任何 Map 例外值。
- **放弃**：①继续保留红色 90 档硬编码；②将硬编码转移到生成 CSS；③为保持旧视觉修改组件调用处；④把实心危险色与基础红色 90 档混为同一用途。
- **相关文件**：`tokens/source/map.tokens.json`、`docs/data/theme-presets.manifest.json`、`docs/TOKENS.md`、`registry/fx-theme.release.json`

### DEC-099: 圆角作为首个非颜色 Seed/Map 样板

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：将 `8px` 建模为内部 `radius.seed.base` Primitive，由生成器按 `0 / 1/4 / 1/2 / 3/4 / 1 / 3/2 / 2` 的受控比例生成 `0/2/4/6/8/12/16px` 七档 Dimension Map。8px 与常规控件/表面及 shadcn `--radius` 基准一致；`full = 9999px` 无法由基准值有意义地计算，继续作为固定 Primitive。
- **兼容边界**：保留全部既有 `--fds-g-radius-*` 与 `--fx-radius-*` 名称、最终 px 值、Semantic/shadcn 映射和组件 API。计算只发生在构建期，浏览器运行时不做乘除；portable contract 额外记录 Seed、公式和比例，便于框架与 Agent 追溯。
- **治理边界**：这是验证非颜色 Seed/Map 建模和生成链的首个样板，不代表所有 Primitive 都要机械 Seed 化。后续先评估间距的网格关系与例外档，确认关系稳定且不改变现值后再决定是否迁移。
- **版本影响**：Foundation contract 升为 `1.0.0-draft.2`，命名合同升为 `1.0.0-draft.11`，主题合同以 `v1.9.0` 发布；Foundation 总数由 396 增为 397，结构变为 149 Primitive + 248 Map。
- **放弃**：①继续手工维护七个圆角 Primitive；②把 `full` 硬套进比例算法；③在 CSS 或浏览器运行时动态计算；④为迁移改动组件外观或调用 API；⑤一次性把所有物理刻度算法化。
- **相关文件**：`tokens/source/{primitive,map}.tokens.json`、`scripts/{build-fds-foundation,check-foundation-tokens,check-token-naming}.mjs`、`docs/{TOKEN_NAMING,TOKENS}.md`、`docs/data/fds-foundation.manifest.json`

### DEC-100: 间距只保留真实消费的主网格与偶数补档

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：移除没有通用 spacing 消费者的 `1/3/5/7/9/11px` Primitive。间距继续以 4px 主网格为骨架，只保留已有 Semantic 和密度场景消费的 `2/6/10px` 偶数补档；1px 归边框宽度体系，组件内部的光学修正不自动升级为全局间距档。
- **密度映射**：compact 的横向内距从 `7/9/11px` 收敛为 `6/8/10px`，gap 从 `3/5px` 收敛为 `2/4px`；spacious 的 tight gap 从 `5px` 收敛为 `6px`。standard 不变，compact < standard < spacious 的顺序保持成立。
- **建模结论**：spacing 当前不复制圆角的 Seed/Map 模式。它包含主网格与少量受治理补档，直接 Primitive 更清楚；等未来出现需要统一缩放的跨框架真实需求后，再评估生成式 Map，不能为了层级形式强行算法化。
- **版本影响**：Foundation contract 升为 `1.0.0-draft.3`，由 149 Primitive + 248 Map / 397 项收敛为 143 Primitive + 248 Map / 391 项；Theme Preset 以补丁版本 `v1.9.1` 发布。删除项均为 internal experimental，不改变公开 Styling Hook 名称或组件 API。
- **组件边界**：Tabs 当前的 `p-[3px]` 是既有 shadcn 组件内部实现，不是 Foundation Token 消费；本次不借 Token 清理修改组件源码、外观或视觉基线，后续只能在明确调试 Tabs 时单独评审。
- **放弃**：①为“看起来完整”保留无人使用的奇数档；②把 1px 描边混进 spacing；③删除 Token 后留下密度 Preset 悬空引用；④为了消灭 3px 同时越权修改 Tabs。
- **相关文件**：`tokens/source/primitive.tokens.json`、`docs/data/theme-presets.manifest.json`、`src/pages/docs/tokens/tokens-spacing-page.tsx`、`docs/foundations/spacing.md`、`scripts/check-token-naming.mjs`

### DEC-101: 固定色相建立独立 Dark Map，动态 Brand 保持主题派生

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：为 16 个固定有色色相生成 `dark` 12 阶 Map；10–80 从 OKLCH `L=0.18` 暗色锚点渐进到 Seed，90 等于 Seed，100–120 向高亮展开。`base`、`dark`、`solid` 成为 Map 受控 scale，Dark Map 只发布 FDS 名称，不制造新的 legacy 别名。
- **语义边界**：固定功能色的暗色软底使用 Dark 20/30/40，链接使用 Dark 110/120/100；中性表面、文字和白色 alpha 边框保留专用 Semantic 公式。动态 Brand 不建立固定 Dark Map，因为纯黑或纯白合法输入无法同时满足“90 等于 Seed”和“12 阶严格递增”；它继续由 Theme v3 公式和全部极端 Seed 样本审计。
- **质量门**：真实 Chromium 必须验证 16 个 Dark Map 均可解析、90 与 Seed 一致、明度严格递增且相邻 OKLab ΔE 至少 `0.025`。当前 16/16 通过，最小相邻 ΔE 为 `0.030`。
- **版本影响**：Foundation contract 升为 `1.0.0-draft.4`，由 143 Primitive + 248 Map / 391 项扩为 143 Primitive + 440 Map / 583 项；Semantic contract 升为 `1.0.0-draft.6`，命名合同升为 `1.0.0-draft.12`，Theme 算法升为 v3 并以 `v1.10.0` 发布。Base 色值、公共 Hook 名称和组件 API 不变。
- **放弃**：①只把色板画布换暗而继续展示 Base；②机械反转 Base 阶序；③给 Dark Map 新造 `--fx-*` 别名；④把暗色表面、文字和边框强行塞进彩色 Map；⑤对极端动态 Brand 伪称固定色板单调。
- **相关文件**：`tokens/source/{map,semantic}.tokens.json`、`scripts/{build-fds-foundation,build-theme-audit,check-token-naming}.mjs`、`docs/data/{token-naming,theme-presets,theme-audit}.manifest.json`、`src/pages/docs/tokens/{color-palette-with-tabs,color-seed-preview}.tsx`

### DEC-102: 同一仓库提供完整站与 Foundation 白名单构建

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：不复制项目或另建一套 Foundation 文档。完整维护站继续使用默认页面注册表、导航和 Markdown；Foundation 分享站在 Vite 构建期替换为 `docs/data/publication-profiles.manifest.json` 声明的白名单投影，独立输出 `dist-foundation/`。
- **发布边界**：Foundation 站只发布 Token 概览、颜色、排版、图标、圆角、阴影、间距、层级、动效、栅格、布局及其同源 Markdown。图标基础页只读取 Foundation manifest 中的尺寸与线宽，不携带完整站的 Icon 组件 Playground。组件文档、Component Hook 准入名单、Playground、搭建器、页面模板、报告和治理数据不得进入其导航、路由、搜索数据或构建产物；非白名单 hash 回到 Token 概览，source map 关闭。
- **治理边界**：白名单是结构事实 SSOT，`src/publications/foundation/` 只是构建投影。构建后必须扫描禁止内容并运行独立浏览器/视觉测试；给协作者的是静态站点，不是完整仓库权限。部署平台和域名在公司环境确定前保持待定。
- **放弃**：①只隐藏组件导航；②复制 Token 和 Markdown 到独立项目；③发布完整 `dist/` 后依赖口头约定不访问组件；④把 Vue 2 适配与只读文档发布捆绑实施。
- **相关文件**：`docs/data/publication-profiles.manifest.json`、`src/publications/foundation/`、`vite.config.ts`、`scripts/check-publication-profiles.mjs`、`playwright.foundation.config.ts`

### DEC-103: 品牌识别色与实心操作色分开消费

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：新增内部 Semantic `--fds-g-color-brand-identity`，浅色模式映射动态 Brand Base 90，暗色模式映射动态 Brand Base 80。Logo、品牌文字、顶栏与侧栏当前项消费品牌识别色；固定白字的主按钮继续消费经过对比度审计的 `action-primary` Solid 阶。
- **展示约束**：颜色文档的“值”与“示例”必须消费同一个 Semantic Token。Seed 试算器是临时预览，可接受 CSS 支持的 3/4/6/8 位 Hex；Theme Provider 的持久化自定义主题合同仍只接收规范化 6 位 Hex。
- **边界**：不修改 Foundation Seed、Base/Dark/Solid Map、实心操作对比度、组件源码或组件 API；品牌识别色当前仅供系统内部消费，不作为公开 Styling Hook。
- **放弃**：①继续用深色 `primary` 表示 Logo 与导航品牌高亮；②让白字按钮直接使用鲜亮 Seed；③在页面里直接引用 Foundation Base 90；④颜色表来源写 Base、示例却渲染 Semantic。
- **相关文件**：`tokens/source/semantic.tokens.json`、`src/app/{site-navigation,docs-sidebar}.tsx`、`src/pages/docs/tokens/{color-seed-preview,tokens-colors-page}.tsx`、`docs/foundations/colors.md`

### DEC-104: 实心交互只使用 Base 90/80/100/50

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：主色、危险、成功、警告和信息实心交互统一映射同一 Base Map：Default 90、Hover 80、Active 100、Disabled 50。删除独立 `solid-50/60/70` Map，禁止 Semantic 绕过既有 Map 再派生一套组件背景色。
- **对比度边界**：背景色阶和前景色可读性分开治理。新增 stable `--fds-g-color-text-on-vivid` 承担鲜明实心表面的前景色；不得为了固定白字而暗改 90/80/100 的背景值。原 `text/icon-inverse` 的旧证据依赖已删除 Solid 背景，暂降为 experimental，等待真实深色表面重新取证。
- **取代范围**：本决策取代 DEC-078、DEC-098、DEC-101 与 DEC-103 中关于独立 Solid Map、固定白字实心操作阶以及品牌按钮必须与 Base 90 分离的结论；这些决策的其他边界继续有效。
- **版本影响**：Foundation Map 删除 15 个 internal experimental Solid Token，Theme 算法升为 v4、合同升为 `v1.11.0`；公开 action Hook 与 Button API 不变，但其视觉值恢复为既定 Base 阶梯。
- **放弃**：①保留两套颜色阶梯并靠文档解释；②仅修网页示例而不改 Semantic 真相源；③把 Base 90 改暗以迁就白字；④在组件调用处覆盖按钮颜色。
- **相关文件**：`tokens/source/{map,semantic,component}.tokens.json`、`docs/data/{theme-presets,token-naming}.manifest.json`、`scripts/{build-fds-foundation,check-theme-presets}.mjs`、`docs/{TOKENS,TOKEN_NAMING}.md`

### DEC-105: 实心角色前景按完整状态组选择

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：Primary、Destructive、Success、Warning、Info 分别发布角色化 Semantic 前景 Hook。每组同时审计 Default/Hover/Active：优先使用白色，只有三态对白色都达到 FDS `2.0:1` 保护线时才整组使用白色；任一状态不足则整组回退近黑色，禁止 hover/active 单独切换字色。
- **质量边界**：`2.0:1` 是 FDS 对彩色实心表面的视觉保护线，不是 WCAG 正常文字合格线。正文 `4.5:1`、有意义非文字 `3:1` 与 disabled 联合证据继续独立执行，不得用本决策降低。Theme audit 必须在 7 个预设、7 个自定义 Seed、light/dark 共 28 个样本中解析真实浏览器颜色并验证五组三态。
- **架构边界**：框架适配器仍只写品牌 Seed；五个前景属于 `resolverWrites`，由共享派生器生成。组件、页面和文档示例只消费 Semantic 输出，不得直接选择白/黑或 Foundation 色阶。`--fds-g-color-text-on-vivid` 只保留为 internal deprecated 迁移别名。
- **参考与取舍**：Ant 的彩色实心按钮固定使用白字，并用 6/5/7 色阶表达默认、悬浮和按下；FDS 保留相同的“整组前景稳定”体验，同时增加 `2.0:1` 最低保护线，以覆盖任意主题 Seed。放弃逐状态自动切字色、把背景色阶压暗迁就白字、以及让组件自行计算对比度。
- **版本影响**：Semantic contract 升为 `1.0.0-draft.8`，命名合同升为 `1.0.0-draft.14`，Theme contract 升为 `1.12.0`，算法升为 v5。新增五个公开 Hook，不新增组件 API。
- **取代范围**：取代 DEC-104 中由单个 `text-on-vivid` stable Semantic 承担全部鲜明表面前景的结论；DEC-104 的 Base 90/80/100/50 背景阶梯继续有效。
- **相关文件**：`tokens/source/{semantic,component}.tokens.json`、`docs/data/{theme-presets,theme-audit,token-naming}.manifest.json`、`src/lib/{theme-derivation,theme-runtime}.ts`、`scripts/{build-theme-audit,check-theme-presets}.mjs`

### DEC-108: Brand Base 与固定色相共用唯一 Map 公式

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：动态 Brand Base 不再维护品牌专属 `steps`，改由 `brand.base.stepsSource = palette.steps` 显式复用通用 Base 公式，并直接从 `color.seed.brand` 生成。相同 Seed 必须得到逐阶相同的 Brand Base 与固定色相 Base；`brand-vivid` 继续作为中性轴、暗色表面等算法的归一化锚点，但不再作为 Brand Base 输入。
- **治理边界**：过浅、过暗或低色度 Seed 的可用性由 Theme audit、Semantic 前景解析与后续独立 Seed 质量门治理，不得通过第二套隐藏色阶公式改写 Brand Seed。生成器必须校验 `stepsSource`，页面预览只展示同一 Foundation 结果。
- **取代范围**：取代 DEC-077/DEC-078 中“Brand Base 通过 vivid 或固定明度专属阶生成”的部分；适配器只注入 Brand Seed、`brand-vivid` 的其他消费者、Semantic 状态映射及发布审计边界保持不变。
- **相关文件**：`tokens/source/map.tokens.json`、`scripts/build-fds-foundation.mjs`、`docs/foundations/colors.md`、`docs/TOKEN_NAMING.md`

### DEC-109: 功能色实心前景统一跟随主按钮

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：Theme Resolver 只根据主按钮 Default/Hover/Active 解析一次 `--fds-g-color-foreground-primary`。Destructive、Success、Warning、Info 保留各自公开的 `foreground-*` Semantic Hook 以维持组件合同稳定，但全部直接引用 Primary 前景；四类功能色不再分别运行黑白文字对比度选择。
- **状态边界**：功能色 Default/Hover/Active/Disabled 全部消费同一个角色前景，禁用态只通过 Base 50 背景和不可交互行为表达，不在文档示例或组件调用处临时切换深色文字。正文 `4.5:1`、非文字 `3:1` 和其他 Theme 质量门不受影响。
- **取代范围**：取代 DEC-105 中“五个前景都由 Resolver 独立生成并分别审计”的部分；主按钮整组三态的 `2.0:1` 选择逻辑、Base 90/80/100/50 背景阶梯、公开 Hook 名称及组件 API 保持不变。
- **版本影响**：Semantic contract 升为 `1.0.0-draft.9`，Theme contract 升为 `1.13.0`；不新增或删除公开 Token，不新增组件 API。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/theme-presets.manifest.json`、`src/pages/docs/tokens/tokens-colors-page.tsx`、`scripts/check-theme-presets.mjs`、`docs/foundations/colors.md`

### DEC-110: 自定义主题发布门暂以常规品牌色为审计范围

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：Theme audit 的 7 个自定义样本改为覆盖红、橙、黄、绿、青、蓝、紫的常规中等明度品牌色。纯黑、纯白与纯 RGB/CMY 极端 Seed 仍可输入，但暂不进入发布门禁，也不得宣称已通过状态可辨识审计。
- **原因**：当前极端 Seed 会让部分 Default/Hover 色差被色域边界压缩；本阶段优先发布常规企业品牌色能力，极端色保护另行建设。
- **相关文件**：`docs/data/theme-presets.manifest.json`、`docs/data/theme-audit.manifest.json`、`docs/TOKENS.md`

### DEC-111: Web Primitive 字号与行高收口为受治理离散档

- **日期**：2026-08-28
- **状态**：已决定
- **决定**：Primitive 字号统一为 `11/12/13/14/15/16/18/20/22/24/28/32/40px`，删除 `30/36/44px`。行高按小字/正文、界面标题、展示标题三段倍率选择后吸附到偶数像素档；边界配对为 `11/16` 与 `40/48`，不保留无人引用的 `52px` 行高。默认 Semantic 的 `3xl/4xl` 分别映射 `28/32px`；compact、standard、spacious 三套字号密度同步落到新档位，保持从紧凑到舒展的层级递增。
- **使用边界**：`11px` 只用于 BI 图表中空间受限的极小刻度或数据标注；正文、操作文字和关键状态仍以 `12px` 为下限。业务页面继续消费文本角色或语义字号，不直接引用 Primitive。
- **相关文件**：`tokens/source/{primitive,semantic}.tokens.json`、`docs/data/theme-presets.manifest.json`、`docs/foundations/typography.md`、`src/pages/docs/tokens/tokens-typography-page.tsx`

## 相关文件

| 文件                   | 关系                   |
| ---------------------- | ---------------------- |
| `docs/LESSONS.md`      | 决策失误时转为教训记录 |
| `docs/ARCHITECTURE.md` | 架构决策影响系统结构   |
| `docs/CHANGELOG.md`    | 决策落地后的变更记录   |
