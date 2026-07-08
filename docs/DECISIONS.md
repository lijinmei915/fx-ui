---
layer: knowledge
type: log
last_verified: 2026-07-08
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
- **决定**：文档站每个页面的「slug → 锚点 + 渲染组件」集中在 `src/App.tsx` 的 `pageRegistry` 单一对象。`getPageFromHash`（hash 折叠成 slug）、右栏 `anchors`、主区渲染分发都从它派生；新增页面只改 `pageRegistry` 一处（+ `docsNav` 导航项 + manifest + md）
- **放弃**：原先并行手写的四套结构——`getPageFromHash` 的 `if` 链、~45 个 `isXxxPage` 布尔、`anchors` 巨型三元、render 巨型三元
- **原因**：同一份 slug 列表抄了四遍，加一个页面要在四处同时接线（TopBar 接线时漏接即 404/空锚点），是典型「多处无唯一真相」。收成 registry 后单点维护、漏接即编译报错
- **保留**：`docsNav`/`topNav`（导航树+搜索+索引的真相源，结构不同不并入）；`isComponentsIndexPage`/`isGovernancePage`/`isComponentArea` 等**分组**判定（用于顶栏高亮，非逐页重复）；`#ai-*` 锚点前缀与 slug 不同名，`getPageFromHash` 单独兜一行
- **影响**：`src/App.tsx` 路由层重构；后续新增/改页面以 `pageRegistry` 为准
- **相关文件**：`src/App.tsx`

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
- **相关文件**：`src/App.tsx`（`CustomerListTemplate` 内容部分待抽）、`src/components/fx/page-header.tsx`、（新）`src/components/recipes/data-table.tsx`、`list-toolbar.tsx`

### DEC-025: 「生成 + 内置设置面板」处理用户自调，不做可视化搭建器（暂搁置）

- **日期**：2026-06-26
- **状态**：**已定方向，暂搁置**（不动手；想做时从客户列表页的"列设置/工具栏开关"齿轮原型起步）
- **场景**：用户「生成一个列表页 → 自己在页面上调整一些东西（列显隐/工具栏有啥/视图）→ 实时生效」。
- **决定**：走 **「生成 + 内置设置面板」**——生成的列表页自带一份运行时 `config` + 一个齿轮设置面板（表单：勾选/排序），用现成 block 实时重渲染，可选持久化（localStorage/后端）。**"可调"严格限定在 block 暴露的合法变体轴**（列显隐/排序/宽度、工具栏各件开关、头部标题/视图/操作显隐、表格密度/勾选），用户碰不到样式/结构，token + 红线不被绕过。
- **放弃**：① 可视化拖拽搭建器（Puck/amis/Appsmith 那类"搭任意页"平台）——数周级、杀鸡用牛刀，且要让其渲染服从我们 token/红线，成本高；② 让用户自由布局/塞任意组件/改样式（破坏治理）。
- **原因**：用户要的是"调已生成页的可变部分"，不是"搭任意页"。主流 SaaS 给终端用户的几乎都是前者（如 CRM 齿轮的列设置 + 保存的视图）。我们 block 本就 props 驱动，把变体 props 提升成 `config` + 一个设置面板即可，**几天级**，并能接回生成器（生成即自带可调）。
- **影响（落地时）**：生成器模板改为吐 config-driven 页面 + 内置设置面板；新增一个"列表页设置面板" block。
- **相关文件**：`scripts/gen-list-page.mjs`、`src/components/recipes/*`、`docs/PAGES.md`

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
- **补充（2026-07-03）**：主题面板里的边框粗细只作用于容器表面（如卡片、调试台）；Button outline、Toggle、Pagination 和表单控件都保持控件自身描边，不跟随容器边框粗细加粗或归零，避免轻量操作失去层级。
- **相关文件**：`docs/TOKENS.md`、`theme/fx-theme.css`、`src/components/fx/component-playground.tsx`

### DEC-032: 新增组件必须登记主题能力，检查从 manifest 派生

- **日期**：2026-06-29
- **状态**：已决定
- **决定**：以后新增基础组件或 fx 组合组件，固定流程为：`npx shadcn add` 拉组件 → 读取源码 API 和 `data-slot` → 在 `docs/data/components.manifest.json` 登记组件事实与主题能力 → 补组件文档与文档页示例 → 运行 `npm run check`。主题能力（如 `borderWidth`、`radius`、`shadow`）以后以 manifest 为事实源，检查脚本从 manifest 派生，不在脚本里硬编码一串组件清单。
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
  2. **视觉语义层**：颜色、字号、圆角、阴影、边框粗细、动效时长，优先收口到 FX token，再映射到 Tailwind 类或语义槽消费。
  3. **组件层**：组件默认样式只引用语义 token 或已治理过的工具类，不在调用处混入另一套默认视觉刻度。
- **放弃**：① 同一语义长期同时允许第二套 FX 字号类与 Tailwind `text-*` 双轨并存；② 为了“灵活”在组件调用处临时选 Tailwind 默认视觉值；③ 再造一层“FX 双写法”与 Tailwind 平行存在。
- **原因**：主流体系（Tailwind theme variables / shadcn semantic tokens）都是“token 作为真相源，utility 作为调用 API”。如果默认视觉刻度双轨并存，后续换肤、缩放、统一治理都会漂；而布局类保留 Tailwind 原生，则能继续保持工程效率和 open-code 的可读性。
- **补充说明**：像 `13px`、`15px` 这类企业字号，不走“在 Tailwind 默认字号基础上再乘百分比”的长期方案，而是直接定义 token，再映射成 Tailwind 类。现在不再保留 `text-fx-*` 旧口径；长期只保留 `text-xs / text-sm / text-base / text-lg / text-xl`。百分比推导可临时试验，但不作为治理基线。
- **影响**：
  1. `spacing`、栅格、断点继续沿用 Tailwind 原生体系。
  2. `color / typography / radius / shadow / border-width / motion` 统一按 FX token 治理。
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

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/LESSONS.md` | 决策失误时转为教训记录 |
| `docs/ARCHITECTURE.md` | 架构决策影响系统结构 |
| `docs/CHANGELOG.md` | 决策落地后的变更记录 |
