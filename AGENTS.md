---
layer: governance
type: spec
last_verified: 2026-06-26
teaches: "AI 在 fx-ui 项目里的行为红线：不手写组件、只注入 token、保护 token 真相源"
use_when: "AI 首次进入 fx-ui、要写组件代码、或要改样式/token 时"
---

# AGENTS — fx-ui 的 AI 行为规则

> 用途：定义 AI 在 fx-ui 组件库里能做什么、绝对不能做什么。
> fx-ui 是「只注入 token + 全用现成 shadcn」的体系，不是手写组件库。

任何 AI 进入本项目，先读这里，再动手。

---

## 🚫 红线（违反就是做错了）

> 🧭 **动手前先查 `docs/MAP.md` 产物路由表**：任意产物（组件/recipe/token/图标/页面路由/视觉基线/规则/检查）住哪、怎么新增登记、谁来 check，那张表一站式分流——**别靠猜、别一通找**。不在表里的新种类，先去表里加一行再动手。

1. **不要手写组件。** 一律用 `npx shadcn@latest add <组件名>` 拉现成的。
   - 反例：用 CSS/JSX 手搓一个 Button —— 这是错的，shadcn 有现成的。
2. **不要封装黑盒。** shadcn 组件以 open-code 进 `src/components/ui/`，源码可见可改。
3. **不要从零写页面。** 页面用 shadcn Blocks / v0 / 内部 blocks 现成区块起步。
4. **不要乱改 token 真相源。** `theme/fx-theme.css` 是公司视觉的 SSOT，改它 = 全局换肤，必须先向用户说明再动。
5. **不要自动同步 shadcn 上游。** shadcn 官网 / registry 更新不等于本项目必须更新；只有遇到 bug、安全、可访问性或明确业务需要时，才按单个组件评估升级，且不得盲目覆盖本地源码。
6. **不要手写重拼组装结构。** 搭页面 / 组合 UI 时，只能用现有组件 + 现有 token，且必须**搬运库里已有的成形用法**（组件文档页 / demo / example 里的写法），整段复用或抽成共享件，**只换数据 props**。禁止：重新推导一套组装结构、自创简化版、杜撰 props/数据形态。库里缺的能力 → 标"需沉淀为组件"交给用户，**绝不临时手搓填补**。反例：照搬真实组件却重写了导航的组装与交互（漏掉折叠/hover/选中）—— 这是错的，应复用既有 `comboDemo`。
7. **不改组件外观——要变体，不要覆盖。**（对齐主流治理型设计系统 Polaris/Spectrum：调用处覆盖组件视觉 = 坏味道）
   - 调用 / 组合 / recipe 处：用组件的 **props / variant** 表达差异，**禁止在调用处用 className 覆盖组件视觉**——颜色 / 圆角(`rounded-*`) / 边框(`border-*`) / 底色 / 内部间距。
   - 需要新外观 → **在组件层加一个 variant**，走治理（manifest + 文档 + DEC），不在页面里 ad-hoc 覆盖。
   - className 只许用于**把组件放进布局**（外层容器的定位 / 宽度）；布局间距也照搬库里既有范例的写法，不自创（见红线 6）。
   - 改了页面 / 组合 / 视觉，**收尾必跑 `npm run test:visual` 看截图**（见自检清单 #10），没多余缝隙/圆角/漂移才算完。
   - 反例：给 `NavMenu` 加 `rounded-none border-r` 改它的圆角/边框 = 改外观（该加 variant 或别改）；给外层加范例没有的 `gap-2` = 偏离照搬（违反红线 6）。

---

## ✅ 你该做的

- 公司视觉**只靠注入 token 实现**（`theme/fx-theme.css` 里的语义变量）
- 需要新组件 → 查 shadcn 有没有现成的 → `npx shadcn add` 拉
- 需要改某个组件样式 → 改它的 Tailwind class 或 token，不重写
- 需要升级已有 shadcn 组件 → 先说明升级原因，只处理相关组件，对比本地源码和上游差异，保留 fx-ui token、文档契约和 `data-slot` 语义，再跑 `npm run check`
- 不确定用什么颜色/圆角 → 查 `docs/TOKENS.md`，用公司 token，别写死十六进制
- 图标统一从 `@/lib/icons` 导入（底层 **Tabler**，见 DEC-009）：线性默认，线宽由全局 `.tabler-icon { stroke-width: 1.75 }` 一处控制；面型/选中态用 `*Filled` 变体。**不引第二个图标库、不手写 SVG、不逐个图标硬调线宽或加描边**；缺图标就在 `src/lib/icons.ts` 加一行 Tabler 映射
- 布局分两层（见 DEC-010）：**整页骨架**用 fx 组件 `Layout`（`src/components/fx/layout.tsx`，Header/Sider/Content/Footer）；**内容区分栏**用 Tailwind 24 列栅格工具类（`grid-cols-[repeat(24,…)]`/`col-span-[n]`/`gap-x/y`）。**不要给栅格封 `Row/Col` 组件**（Tailwind 类名已是栅格能力，再包多此一举）；尺寸默认值见 `docs/LAYOUTS.md`
- 不确定一条信息该写进哪份文档（CHANGELOG / DECISIONS / LESSONS / 新建文档…）→ 先查 `docs/DOCUMENTATION.md` 的 SSOT 路由表；新建 `docs/*.md` 时必须同时在该表里登记一行，否则会变成孤岛文档
- 用户说"记住这个规则"→ **先判断类型**：设计/架构/产品决策 → `docs/DECISIONS.md`；AI 行为偏好/跨项目约定 → memory；不要两个都写
- **任何涉及 token 的改动，按固定顺序：① 先改 `theme/fx-theme.css`（真相源）② 同步 `docs/TOKENS.md` + 相关规则/`DECISIONS.md` ③ 跑 `npm run build:tokens` 重建 manifest ④ 最后才改组件等映射处**。顺序不能反——先改组件后补 token 会漂移

---

## 每次组件改动都必须核对

组件页面、Markdown、示例或 AI 数据源有任何改动时，完成前必须：

1. 读取对应的 `src/components/ui/<component>.tsx`，以仓库内 shadcn open-code 源码为真实 API。
2. 核对页面和 Markdown 展示的 variant、size、状态与源码一致：
   - 不遗漏源码已有能力。
   - 不发明源码没有的 prop 或状态。
   - 组合态必须明确写出组合方式，例如 Loading = `disabled + Spinner`。
3. 状态必须区分：
   - 组件原生交互态，例如 hover、active、focus-visible、aria-expanded。
   - 业务组合态，例如 Loading。
4. 运行 `npm run check`。检查不通过，不得向用户宣告完成。
5. 最终回复必须说明：使用了哪些 shadcn 能力、是否新增 API、检查是否通过。

`scripts/check-shadcn-contract.mjs` 目前只对 **Button** 做机器化契约核对（变体多、容易改坏，值得写专门脚本）。其余组件的 variant/size/状态等结构和 Button 差异很大（例如 Avatar 没有 variant/size、Sidebar 是另一套结构），硬塞进同一个脚本只会变成勉强凑数的伪检查；这些组件改动后，靠上面第 1-3 步的人工核对 + `npm run check` 基础构建检查即可，不强制加进契约脚本。

---

## 治理自检清单（每次新建/修改前后对照）

**动手前：**
1. **路由唯一**：这条信息/能力唯一归哪个文件？查 `docs/DOCUMENTATION.md` SSOT 表——已有归属就别另起，别和别的文档蹭。
2. **认准真相源**：要改的是不是真相源（`theme/fx-theme.css` / `docs/data/*.json`）？是就从源头改，别从下游改。

**改 token / 颜色：**
3. 顺序铁律：**改 `theme/fx-theme.css` → 同步 `docs/TOKENS.md`+规则 → `npm run build:tokens` → 最后改组件**。顺序不能反。
4. 交互态一律走色板阶梯（实心 09/08/10/05、浅色 01/02/03，仅浅色模式），禁 `color-mix`、禁 `/透明度`。

**新建 / 改文档：**
5. **登记**：新建 `docs/*.md` 同时①在 SSOT 表加一行 ②在 `docs/data/doc-structure.manifest.json` 声明唯一 `responsibility` + 必备章节。
6. **不重复**：本文该写的别人不写；别人的活只放指针（link），不复制正文。
7. **章节齐全**：对照 doc-structure 的 `requiredSections`，别产出残缺文档。

**新增长期规则：**
8. **三件套**：文字规范（MD）→ 机器事实（JSON）→ 可执行检查（script 接 `check-all.sh`）。只写 MD 会飘。
8b. **防膨胀**：规则一旦有 check 兜底，MD 只留"一句意图 + 指向 check"，**判定细节别在 MD 复述**；清单型事实（组件 prop、页面骨架）放 manifest，不抄进 MD。规范文档应越来越薄，不是越堆越长。
8c. **检查不必一一接入**：加 check 前先过三门槛——①高价值且易静默漂移 ②机器能客观判定 ③构建/人工抓不到；不满足就靠 build + 人工核对 + 文字规范。**同类机械规则合并到一个脚本**（如禁用 import 都进 `check-imports.mjs`），不要一规则一脚本，否则检查也会膨胀。

**收尾：**
9. `bash scripts/check-all.sh` 全绿才算完；`last_verified` 由 pre-commit 自动 bump，不用手填。
10. **改了页面/组合/视觉 → 必须 `npm run test:visual` 并肉眼核对截图**（基线在 `tests/visual.spec.ts-snapshots/`），确认没多余缝隙/圆角/对齐漂移，再宣告完成。没看截图就说"好了" = 没做完。
11. 不确定写哪 / 该不该删——先查文档，别凭感觉。

---

## 必读文件

0. `docs/MAP.md` — 仓库地图/产物路由表（加或找任何产物前先查它）
1. `PROJECT.md` — 项目定位和当前进度
2. `docs/ARCHITECTURE.md` — 三层体系：基础组件、公司组合组件、页面 Blocks / 布局规范
3. `theme/fx-theme.css` — 公司 token（改这里要谨慎）
4. `docs/TOKENS.md` — token 值和用法
5. `docs/DOCUMENTATION.md` — 文档该写去哪的 SSOT 路由表（写文档前先查这里）

---

## 技术栈

React + TypeScript + Tailwind CSS v4 + shadcn/ui（open-code）
