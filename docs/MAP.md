---
layer: governance
type: spec
last_verified: 2026-06-26
teaches: "fx-ui 仓库地图：任意产物住哪、怎么新增登记、谁来检查——按产物种类一站式分流"
use_when: "要新增或查找任何产物（组件/block/token/图标/页面路由/视觉基线/规则/检查）前，先来这里定位，别靠猜"
---

# 仓库地图 · 产物路由

> 用途：**动手前先查这张表**。任意产物「住在哪 / 新增要登记几步 / 谁来 check」一站式分流，免得一通找。
> 边界：本表按**产物种类**分流；"某条信息该写进哪份 .md" 的**文档内部细分**看 `docs/DOCUMENTATION.md`。

## 产物路由表

| 产物种类 | 家（真相源） | 新增 / 登记步骤 | 谁 check |
|----------|--------------|-----------------|----------|
| 基础组件 | `src/components/ui/` | `npx shadcn add` 拉 → `docs/data/components.manifest.json` + `docs/components/<x>.md` + 导航/`pageRegistry` | `check:components` |
| 组合组件（fx） | `src/components/fx/` | 由现成 ui 组件组合 → 同上 manifest + md + 导航 | `check:components` |
| Block（区块；文件夹历史名 recipes/） | `src/components/recipes/` | 复用既有区块只换数据 → 在 `docs/ARCHITECTURE.md`「页面 Block 层」登记 | （暂无脚本，人工核） |
| 页面 / 路由 | `pageRegistry`（`src/App.tsx`，唯一真相源，见 DEC-023） | **先按 `docs/PAGES.md` 装配流程拼**；再加 registry 一行（满宽页加 `fullBleed`）+ `docsNav` 导航项 | `check:doc-site` |
| 列表页（脚手架） | 生成到 `src/pages/<slug>-list.tsx` | 跑 `npm run gen:list-page -- --name 订单 --slug order` 生成骨架 → 按打印的 3 行接进 App.tsx → 只填 columns/数据。**不要手写**：`src/pages/` 里像列表页却无 `@generated fx-ui:list-page` 标记的会被 `check-list-page-source` 拦 | `check:all`（含来源检查）+ `test:visual` |
| Token（颜色/圆角/间距…） | `theme/fx-theme.css` | ①改 css ②`docs/TOKENS.md` ③`docs/data/design-tokens.json` ④`build:tokens` ⑤才改组件映射（顺序不能反） | `check:tokens` |
| 图标 | `src/lib/icons.ts`（Tabler 映射）/ `src/lib/icons-custom.tsx`（自定义 SVG） | 加一行映射或自定义组件 → `docs/data/icons.manifest.json` | `check:icons` |
| 视觉基线 | `tests/visual.spec.ts` + `tests/visual.spec.ts-snapshots/` | 加用例 → `test:visual:update` 定基线 | `test:visual`（独立，**不在** check:all） |
| 规则 / 红线 | `AGENTS.md` | 改红线/自检清单；`.claude/settings.json` 的 SessionStart hook 每次自动注入红线块 | `check:doc-structure`（章节） |
| 决策及原因 | `docs/DECISIONS.md` | 追加 `DEC-NNN`（不写进 memory） | — |
| 文档（信息写哪份 .md） | 细分见 `docs/DOCUMENTATION.md` SSOT 表 | 新建 `docs/*.md` 必同时登记 SSOT 表 + `docs/data/doc-structure.manifest.json` | `check-docs-routing` / `check-doc-structure` |
| Agent UI block | `src/components/fx/agent-surface.tsx` + `docs/data/agent-ui.manifest.json` | 加 block 白名单 + manifest | `check:agent-ui` |

## 怎么用

1. 要**新增**某产物 → 查它那一行，按「新增/登记步骤」逐步做，最后跑对应 check。
2. 要**找/改**某产物 → 查它的「家」，从真相源改起，别从下游改。
3. 不在表里的新产物种类 → 先在本表加一行（家 + 登记步骤 + check），再动手。
4. 全部收尾：`bash scripts/check-all.sh` 全绿；改了视觉再跑 `npm run test:visual` 看截图。
