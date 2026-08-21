---
layer: knowledge
type: log
last_verified: 2026-08-21
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

## 相关文件

| 文件                   | 关系                   |
| ---------------------- | ---------------------- |
| `docs/LESSONS.md`      | 决策失误时转为教训记录 |
| `docs/ARCHITECTURE.md` | 架构决策影响系统结构   |
| `docs/CHANGELOG.md`    | 决策落地后的变更记录   |
