---
layer: governance
type: spec
last_verified: 2026-08-28
teaches: "fx-ui 仓库地图：任意产物住哪、怎么新增登记、谁来检查——按产物种类一站式分流"
use_when: "要新增或查找任何产物（组件/block/token/图标/页面路由/视觉基线/规则/检查）前，先来这里定位，别靠猜"
---

# 仓库地图 · 产物路由

> 用途：**动手前先查这张表**。任意产物「住在哪 / 新增要登记几步 / 谁来 check」一站式分流，免得一通找。
> 边界：本表按**产物种类**分流；"某条信息该写进哪份 .md" 的**文档内部细分**看 `docs/DOCUMENTATION.md`。

## 产物路由表

| 产物种类 | 家（真相源） | 新增 / 登记步骤 | 谁 check |
|----------|--------------|-----------------|----------|
| 基础组件 | `src/components/ui/` | `npx shadcn add` 拉 → 读 `src/components/ui/<x>.tsx` 源码 API / `data-slot` → 补 `docs/data/components.manifest.json`（含主题能力）→ `docs/components/<x>.md` → 文档页示例 + 导航/`pageRegistry` → `npm run check`；已有 shadcn 缺主流基础能力时登记 `shadcn-extended` + upstream/DEC/extensions；无等价能力时仅允许 `nativeSemanticComponents` 白名单例外 | `check:components` |
| 组合组件（fx） | `src/components/fx/` | 由现成 ui 组件组合 → 读源码 API / `data-slot` → 补 manifest（含主题能力）→ md → 文档页示例 + 导航/`pageRegistry` → `npm run check` | `check:components` |
| 组件质量矩阵 | `docs/data/component-quality.manifest.json`（由组件、Playground、文档和视觉测试真相源派生） | 运行 `npm run build:quality` 重建；不得手填评分；缺失证据保留为 needs-review | `check:component-quality` |
| 分层资产（Components / Hooks / Patterns / Blocks / Page templates） | `docs/data/layered-assets.manifest.json`（只登记已有源码和已验证 recipe/build-kit） | 新增资产先确认真实 source/contract，再登记唯一 id、状态和约束 | `check:layered-assets` |
| Block（区块；文件夹历史名 recipes/） | `src/components/recipes/` | 复用既有区块只换数据 → 在 `docs/ARCHITECTURE.md`「页面 Block 层」登记 | （暂无脚本，人工核） |
| 页面 / 路由 | `pageRegistry`（`src/lib/page-registry-config.tsx`，唯一真相源；App 只消费注册表，见 DEC-023） | **先按 `docs/PAGES.md` 装配流程拼**；派生 Build Kit 只登记已验证的 block/generator；再加 registry 一行（满宽页加 `fullBleed`）+ `docsNav` 导航项（统一维护于 `src/lib/site-navigation.ts`） | `check:doc-site` + `check:page-build-kit` |
| 页面类型语义 | `docs/data/page-semantics.manifest.json` | 登记页面角色到全局 semantic token 的受控映射；ready 类型必须绑定已声明 Build Kit 或真实页面来源；不得写页面专属色值/字号/间距/圆角 | `check:page-semantics` + `test:visual` |
| 页面/组件搭建器 schema | `docs/data/page-builder.manifest.json` | 页面先登记模板、Block slots、properties 与 preset；基础组件评审只登记外部 Agent 候选、真实预览适配器、受控 API、检查与确认门；业务组件只登记已评审实例，新增后补视觉用例 | `check:page-builder` + `test:visual` |
| 文档页面模块 | `src/pages/docs/<domain>/` | 按 `components` / `foundations` / `getting-started` / `governance` / `tokens` 归位；页面专属 Playground、预览和适配器与页面同域；跨域运行时留在 `src/lib/` | `check:doc-site` + `check:toc-anchors` + `test:visual` |
| 文档站发布配置（完整站 / Foundation 站） | `docs/data/publication-profiles.manifest.json`（发布范围 SSOT）+ `src/publications/`（构建期注册表、导航与 Markdown 投影） | 新增发布配置先登记允许页面与文档白名单 → 在 `src/publications/<profile>/` 建同源投影 → Vite 独立输出目录 → 验证禁止页面未进入发布物；不得复制 Token 或 Markdown 正文 | `check:publication-profiles` + `npm run build:foundation` + `test:visual:foundation` |
| Getting Started 页面域 | `src/pages/docs/getting-started/` | 安装命令、主题接入代码和页面适配器按领域集中维护；`App.tsx` 只注入 manifest 数据和治理看板渲染器 | `npm run build` + `check:doc-site` + `check:doc-structure` |
| 列表页（脚手架） | 生成到 `src/pages/<slug>-list.tsx` | 跑 `npm run gen:list-page -- --name 订单 --slug order` 生成骨架 → 按打印的 3 行接进 App.tsx → 只填 columns/数据。**不要手写**：`src/pages/` 里像列表页却无 `@generated fx-ui:list-page` 标记的会被 `check-list-page-source` 拦 | `check:all`（含来源检查）+ `test:visual` |
| Token（颜色/圆角/间距…） | `tokens/source/primitive.tokens.json`（DTCG Primitive）+ `tokens/source/map.tokens.json`（生成式 Map）+ `tokens/source/semantic.tokens.json`（Semantic）+ `tokens/source/component.tokens.json`（准入式 Component Hooks）；`theme/{foundation,fds-semantic,fds-components}.css` 为生成产物，`theme/fx-theme.css` 为唯一公开装配入口 | ①按层改 Primitive/Map/Semantic/Component source ②`build:tokens` 按 Foundation → Semantic → Component 生成 runtime/portable contract ③同步 `docs/TOKENS.md`（总览）与对应 `docs/foundations/*.md`（专题） ④重建 Agent/Theme/Framework contract ⑤最后才改组件映射；Primitive/Map 仅维护者可改，Semantic 须评审，Component 必须有准入证据，页面不得直引 Foundation | `check:fds-foundation` + `check:fds-semantic` + `check:fds-components` + `check:tokens` + `check:foundation-tokens` + `check:theme` + `check:agent-tokens` |
| FDS Token 命名合同 / Styling Hooks 词典 | `docs/data/token-naming.manifest.json`（结构事实 SSOT）+ `docs/TOKEN_NAMING.md`（解释与评审规则）；公开投影生成到 `registry/fx-theme.contract.json#stylingHooks` 与 `framework-core#tokens.publicStylingHooks` | 先登记层、前缀、语法、受控词和迁移阶段 → 同步命名规范与相关 DEC → 重建 Theme/Framework 发布物；新增 `--fds-c-*` 还必须绑定组件 owner、准入理由和公开稳定性，不得由组件开发者自由造词；两份公开投影必须完全一致 | `check:token-naming` + `check:theme-artifacts` + `check:framework-core` + `check:theme-release` |
| FDS 前缀迁移审计 | `docs/data/fds-migration-audit.manifest.json`（由命名合同、FDS 四层合同、发布物与真实消费者派生） | 运行 `npm run build:fds-migration-audit` 重建；按 runtime source / public assembly / generated compatibility / docs / scripts 分域量化 `--fx-*`，不得手填计数或绕过阶段门；进入 `fds-primary` 前必须消除清单中的全部 next-phase blocker | `check:fds-migration` |
| Theme Seed / Preset / 发布与审计产物 | `docs/data/theme-presets.manifest.json`（输入与质量门 SSOT）→ `registry/fx-theme.css` + `registry/fx-theme.contract.json` + `registry/fx-theme.json` + `docs/data/theme-audit.manifest.json` + `registry/fx-theme.release.json`（派生产物） | 先登记 Foundation 引用、维度所有权和可执行质量门 → `build:theme-artifacts` 生成同版本 CSS/JSON/shadcn registry → `build:theme-audit` 用真实浏览器审计全部预设与模式 → `build:theme-release` 绑定产物/审计/portable core 哈希 → React/未来框架适配器只负责应用输出；不得复制预设值、算法或审计阈值 | `check:theme-presets` + `check:theme-artifacts` + `check:theme-audit` + `check:theme-release` + `check:theme` |
| 图标 | `src/lib/icons.ts`（Tabler 映射）/ `src/lib/icons-custom.tsx`（自定义 SVG） | 加一行映射或自定义组件 → `docs/data/icons.manifest.json` | `check:icons` |
| 视觉基线 | `tests/visual.spec.ts` + `tests/visual.spec.ts-snapshots/` | 加用例 → `test:visual:update` 定基线 | `test:visual`（独立，**不在** check:all） |
| 规则 / 红线 | `AGENTS.md` | 改红线/自检清单；`.claude/settings.json` 的 SessionStart hook 每次自动注入红线块 | `check:doc-structure`（章节） |
| 决策及原因 | `docs/DECISIONS.md` | 追加 `DEC-NNN`（不写进 memory） | — |
| 文档（信息写哪份 .md） | 细分见 `docs/DOCUMENTATION.md` SSOT 表 | 新建 `docs/*.md` 必同时登记 SSOT 表 + `docs/data/doc-structure.manifest.json` | `check-docs-routing` / `check-doc-structure` |
| Agent UI block | `src/components/fx/agent-surface.tsx` + `docs/data/agent-ui.manifest.json` | 加 block 白名单 + manifest | `check:agent-ui` |
| Agent 查询 contract | 组件/token/page 的既有 manifest 与 CSS 真相源，加 `docs/data/agent-recipes.manifest.json` 管场景组合 | 跑 `build:tokens` / `build:agent` 派生 `docs/data/agent-*.manifest.json` 与快速上下文；用 `fx recipe` 查已验证场景、`fx impact` 查影响链；不得手写派生文件 | `check:agent-tokens` + `check:agent-components` + `check:agent-query` + `check:agent-examples` + `check:agent-recipes` |
| 跨框架核心契约 / 框架适配器 | `docs/data/framework-adapters.manifest.json`（适配器状态 SSOT）+ 既有 token/组件/图标/页面/Agent UI manifest（核心事实源）；`docs/data/framework-core.manifest.json` 为派生产物 | 先在适配器登记表声明状态、源码根和准入门 → `npm run build:framework-core` 生成 portable contract；`planned` 不得带实现目录或宣称支持 | `check:framework-core` |

## 怎么用

1. 要**新增**某产物 → 查它那一行，按「新增/登记步骤」逐步做，最后跑对应 check。
2. 要**找/改**某产物 → 查它的「家」，从真相源改起，别从下游改。
3. 不在表里的新产物种类 → 先在本表加一行（家 + 登记步骤 + check），再动手。
4. 全部收尾：`bash scripts/check-all.sh` 全绿；改了视觉再跑 `npm run test:visual` 看截图。
