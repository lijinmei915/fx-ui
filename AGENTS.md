---
layer: governance
type: spec
last_verified: 2026-06-06
teaches: "AI 在 fx-ui 项目里的行为红线：不手写组件、只注入 token、保护 token 真相源"
use_when: "AI 首次进入 fx-ui、要写组件代码、或要改样式/token 时"
---

# AGENTS — fx-ui 的 AI 行为规则

> 用途：定义 AI 在 fx-ui 组件库里能做什么、绝对不能做什么。
> fx-ui 是「只注入 token + 全用现成 shadcn」的体系，不是手写组件库。

任何 AI 进入本项目，先读这里，再动手。

---

## 🚫 红线（违反就是做错了）

1. **不要手写组件。** 一律用 `npx shadcn@latest add <组件名>` 拉现成的。
   - 反例：用 CSS/JSX 手搓一个 Button —— 这是错的，shadcn 有现成的。
2. **不要封装黑盒。** shadcn 组件以 open-code 进 `src/components/ui/`，源码可见可改。
3. **不要从零写页面。** 页面用 shadcn Blocks / v0 / 内部 blocks 现成区块起步。
4. **不要乱改 token 真相源。** `theme/fx-theme.css` 是公司视觉的 SSOT，改它 = 全局换肤，必须先向用户说明再动。

---

## ✅ 你该做的

- 公司视觉**只靠注入 token 实现**（`theme/fx-theme.css` 里的语义变量）
- 需要新组件 → 查 shadcn 有没有现成的 → `npx shadcn add` 拉
- 需要改某个组件样式 → 改它的 Tailwind class 或 token，不重写
- 不确定用什么颜色/圆角 → 查 `docs/TOKENS.md`，用公司 token，别写死十六进制
- 不确定一条信息该写进哪份文档（CHANGELOG / DECISIONS / LESSONS / 新建文档…）→ 先查 `docs/DOCUMENTATION.md` 的 SSOT 路由表；新建 `docs/*.md` 时必须同时在该表里登记一行，否则会变成孤岛文档

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

`scripts/check-shadcn-contract.mjs` 会自动检查已接入的组件文档契约。新增组件文档时，应同时把该组件加入此检查脚本。

---

## 必读文件

1. `PROJECT.md` — 项目定位和当前进度
2. `docs/ARCHITECTURE.md` — 三层体系：基础组件、公司组合组件、页面 Blocks / 布局规范
3. `theme/fx-theme.css` — 公司 token（改这里要谨慎）
4. `docs/TOKENS.md` — token 值和用法
5. `docs/DOCUMENTATION.md` — 文档该写去哪的 SSOT 路由表（写文档前先查这里）

---

## 技术栈

React + TypeScript + Tailwind CSS v4 + shadcn/ui（open-code）
