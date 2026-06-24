---
layer: knowledge
type: log
last_verified: 2026-06-25
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
- **决定**：任何可交互色的 hover/active/disabled 一律从 12 阶色板取阶。**统一交互阶梯（仅浅色模式）**：以 09 为默认的色（主色实心、状态实心、链接文字、品牌强调文字）一律 默认09 / hover08（浅一阶）/ active10（深一阶）/ 禁用05——链接也照此、不单独加深；浅色/软色组（以 01 为默认的 tag/alert 背景）取 01/02/03；中性面填充（secondary）走灰 02/03/04；无填充控件（ghost / outline）再降一档 hover02/active03。深色模式以后另定，明暗方向会反。
- **放弃**：组件里用 `color-mix(...)` 现算、`/透明度`（`bg-primary/80`、`bg-destructive/10`）表达交互态——三套手法并存、各处不一致
- **原因**：色板是唯一真相源，绕过它就会漂移；统一取阶后换肤、对比度、深浅层次都可预测，组件只引用 token 不再写死算式
- **影响**：新增 `--fx-{success/info/warning/danger}-light-hover/-active`、`--secondary/muted-hover/-active`、`--destructive-light*` 等 token；button/badge 已改为引用 token
- **补充（2026-06-18）**：**浅色态收敛已完成**——全部组件浅色交互态/填充改用实心 token（footer/hover 走 `bg-muted`、危险态走 `bg-destructive-light`、禁用输入走 `bg-muted`、选中卡片走 `bg-accent`、细边框走 `border-border-subtle`），不再用 `/透明度`/`color-mix`。`focus-visible`/`aria-invalid` 焦点环按无障碍惯例保留透明度；`dark:` 暗色态待 DEC 另定。新增门禁 `scripts/check-interaction-tokens.mjs`（接 check-all）防回弹
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`（交互色状态阶梯）、`src/components/ui/*`、`scripts/check-interaction-tokens.mjs`

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

### DEC-008: 自托管开源字体（Inter + Noto Sans SC），并把 text-fx-* 登记进 tailwind-merge

- **日期**：2026-06-18
- **状态**：已决定
- **决定**：字体从"纯系统字体栈"改为**自托管开源 webfont**：西文/数字用 **Inter**，中文用 **Noto Sans SC（= 思源黑体简体）**，均 OFL 授权、无版权困扰，做到跨平台一致。经 `@fontsource-variable/inter` + `@fontsource/noto-sans-sc`（400/500/700）引入，按 unicode-range 懒加载
- **放弃**：系统字体栈（Mac 苹方 / Windows 雅黑，跨系统不一致）；放弃 shadcn 的 Inter/Geist 单字体（不含中文，中文照样回退系统）
- **原因**：系统栈换台电脑中文字形就变；Inter 只解决西文，中文必须配 Noto Sans SC 才能全平台一致
- **附带踩坑（tailwind-merge）**：自定义字号工具类 `text-fx-12/13/15/18` 必须在 `src/lib/utils.ts` 用 `extendTailwindMerge` 登记进 `font-size` 组；否则 tailwind-merge 把 `text-fx-13` 当成**文字颜色**，和 `text-primary-foreground` 冲突、把颜色覆盖掉（症状：主色按钮小尺寸出现意外黑字）。这是工具层的坑，记在这里防再踩，不属于字体/排版规范
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
- **影响**：新增 `--surface-disabled`(neutrals-02)、`--link-disabled`(blue-05) token（css + design-tokens.json）；`button.tsx` 各 variant 禁用类；分页器等用 Button 的禁用态随之更新
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

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/LESSONS.md` | 决策失误时转为教训记录 |
| `docs/ARCHITECTURE.md` | 架构决策影响系统结构 |
| `docs/CHANGELOG.md` | 决策落地后的变更记录 |
