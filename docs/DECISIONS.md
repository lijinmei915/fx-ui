---
layer: knowledge
type: log
last_verified: 2026-06-17
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
- **影响**：新增 `--fx-{success/info/warning/danger}-light-hover/-active`、`--secondary/muted-hover/-active`、`--destructive-light*` 等 token；button/badge 已改为引用 token；其余用到 `bg-muted`、`/透明度` 交互态的组件后续逐步收敛
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`（交互色状态阶梯）、`src/components/ui/button.tsx`、`src/components/ui/badge.tsx`

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

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/LESSONS.md` | 决策失误时转为教训记录 |
| `docs/ARCHITECTURE.md` | 架构决策影响系统结构 |
| `docs/CHANGELOG.md` | 决策落地后的变更记录 |
