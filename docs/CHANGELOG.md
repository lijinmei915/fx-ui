---
layer: knowledge
type: log
last_verified: 2026-06-18
teaches: "fx-ui 高价值结构改动的记录：改了什么、为什么改、影响到哪里"
use_when: "需要回溯某次跨层改动的原因和影响范围时"
---

# 代码变更日志

> 只记录高价值结构改动，用于回溯"改了什么 / 为什么改 / 影响到哪里"。
> 不记录零碎样式微调；逐行 diff 看 git log，这里记的是结构性的"为什么"。

维护规则：
- 只记录跨层改动（影响数据流向、目录结构、组件分层边界的改动）
- 每条固定写"改动 / 影响 / 相关文件"
- 无结构影响的小修不记录
- 一次连续任务合并成一条

---

## 2026-06-18 — 图标库换 Tabler + 布局拆「布局/栅格」两页 + Layout 骨架组件

- **改动**：图标从 Phosphor 换成 Tabler（`src/lib/icons.ts` 重映射，线宽由全局 `.tabler-icon` 控制、面型用 `*Filled`，见 DEC-009，卸载 phosphor）；布局页拆成「布局」(#layout，页面容器+尺寸) 和「栅格」(#grid，24 列+断点) 两页，借鉴 Semi；新增 fx 骨架组件 `src/components/fx/layout.tsx`（Layout/Header/Sider/Content/Footer，见 DEC-010），栅格保持 Tailwind 工具类不封 Row/Col；按钮对齐 shadcn（字重 400、梯度字号 12/13/14/16）
- **影响**：图标线宽可调、有实心变体；布局/栅格职责分离、各有独立页；新增可复用页面骨架组件；图标/布局红线写进 `AGENTS.md`
- **相关文件**：`src/lib/icons.ts`、`src/components/fx/layout.tsx`、`src/App.tsx`、`theme/fx-theme.css`、`docs/{TOKENS,LAYOUTS,DECISIONS}.md`、`AGENTS.md`、`scripts/check-toc-anchors.mjs`

## 2026-06-18 — 自托管开源字体（Inter + Noto Sans SC）

- **改动**：字体从纯系统栈改为自托管开源 webfont（`@fontsource` 引入 Inter 管西文、Noto Sans SC 管中文，见 DEC-008）；附带把 `text-fx-*` 用 `extendTailwindMerge` 登记为 font-size，修掉它被当文字颜色覆盖的 bug（小尺寸主色按钮黑字）
- **影响**：中英文跨平台渲染一致、无版权困扰；`cn()` 不再误吞文字颜色
- **相关文件**：`src/main.tsx`、`src/lib/utils.ts`、`theme/fx-theme.css`、`docs/{TOKENS,DECISIONS}.md`

## 2026-06-16~18 — Token 层全面精修 + 交互态收敛 + 治理门禁

- **改动**：颜色（单一中性灰 DEC-006、交互阶梯 DEC-005）、圆角（±2px 派生 + 比值带）、阴影（elevation + `--fx-shadow-color` 派生跟随色板）、间距（4px 网格）、层级、动效、排版（web 字号 + 行高随 token）逐页细化为"档位 + 计算方式 + 示例"；遮罩收成语义 token `--overlay`；组件浅色交互态从 `/透明度` 收到实心 token；新增可执行门禁 `check-interaction-tokens`、`check-shadow-tokens`、`check-toc-anchors`（接 check-all）
- **影响**：token 体系可换肤、可预测、有门禁防漂；文档站七个 token 子页结构统一、目录与内容双向关联
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`、`docs/DECISIONS.md`、`docs/data/design-tokens.json`、`src/components/ui/*`、`scripts/check-*.mjs`

## 2026-06-08 — 补全全部 28 个 shadcn 基础组件的中文文档页

- **改动**：在 `src/App.tsx` 里为本地拉取的全部 28 个 shadcn 基础组件建好中文文档页（新增 Avatar、Breadcrumb、Button Group、Calendar、Collapsible、Dialog、Alert Dialog、Dropdown Menu、Popover、Select、Separator、Sheet、Sidebar、Skeleton、Spinner、Tabs、Toggle、Toggle Group、Tooltip 等，加上此前已完成的 Typography/Input/Checkbox/Switch/Textarea/Table/Card/Badge），统一走"组件总览/场景示例/使用方式/API/语义 DOM/正误示例"六段结构；为避免十几页重复模板代码，抽出 `StandardDocPage` 公共组件承载页面骨架；导航菜单同步重新分组（新增"导航"分组：面包屑/标签页/下拉菜单/侧边栏）
- **影响**：组件文档覆盖率从约一半提升到 100%，后续新拉 shadcn 组件可直接复用 `StandardDocPage` + 数据数组的模式快速补页；导航分组调整后用户能更快按场景找到组件
- **相关文件**：`src/App.tsx`（`StandardDocPage`、各组件的 `xxxAnchors`/`xxxScenarioExamples`/`xxxPropRows` 等数据数组与 `XxxPage` 组件、导航分组数据、路由判断链）

## 2026-06-07 — 组件总览改为从场景数据派生

- **改动**：`src/App.tsx` 中 `ButtonOverview`（组件总览矩阵）原本是手写的独立数据，改为直接从 `buttonScenarioExamples` 按 `group` 过滤派生，并复用 `ButtonScenarioPreview` 渲染
- **影响**：消除了"场景示例"和"组件总览"两处数据各自维护、容易漏同步的问题（曾经发生过总览少了 outline 类型、icon 区少了 ghost 图标按钮的不一致）；以后新增场景只需改一处
- **相关文件**：`src/App.tsx`（`buttonScenarioExamples`、`ButtonScenarioPreview`、`ButtonOverview`）

## 2026-06-07 — 新增 token 漂移校验脚本，治理 TOKENS.md 手抄风险

- **改动**：新增 `scripts/check-tokens-sync.sh`，自动提取 `theme/fx-theme.css` 的 `:root` 色值，逐个核对是否出现在 `docs/TOKENS.md` 中；运行时即发现 `--accent` / `--sidebar-accent`（`#F2F4FB`）漏抄，已补进 TOKENS.md 的语义 Token 表
- **影响**：`fx-theme.css` 仍是 fx-ui 范围内唯一真相源（不引入新的 `.ts` 副本，避免再叠一层转译），`docs/TOKENS.md` 改为"改完 CSS 后跑脚本校验"而不是纯靠人工记得同步；脚本只查不改，发现差异仍需手动同步表格内容
- **相关文件**：`scripts/check-tokens-sync.sh`、`docs/TOKENS.md`、`theme/fx-theme.css`

## 2026-06-07 — 文档体检：修孤岛、消重复

- **改动**：① `docs/DOCUMENTATION.md` 的"相关文件"表补上 `docs/KNOWLEDGE_SCHEMA.md`（之前全项目没有文档引用它，是个孤岛）；② `SETUP.md` 删掉过期的"当前进度"打勾清单（和 `PROJECT.md` 重复记录同一件事，且已经过期），改为指向 `PROJECT.md` 的历史记录说明
- **影响**：消除"两处记进度、必然漂移"的隐患，`PROJECT.md` confirmed 为进度唯一真相源；`KNOWLEDGE_SCHEMA.md` 现在能从 `DOCUMENTATION.md` 顺藤摸到
- **相关文件**：`docs/DOCUMENTATION.md`、`SETUP.md`、`PROJECT.md`

## 2026-06-07 — 新建文档自动登记路由表：流程规则 + 兜底脚本

- **改动**：① `docs/DOCUMENTATION.md` 加了一条强制步骤——新建 `docs/*.md` 时必须同时在 SSOT 路由表加一行（"该归到哪类问题"是语义判断，机器做不了，只能靠人/AI 当场做）；② 新增 `scripts/check-docs-routing.sh` 作为兜底，机械检查 `docs/*.md` 文件名是否都出现在路由表里，没有就报警并阻断提交，接入 `check-all.sh`
- **影响**：从"靠记性 → 事后才发现漏登记"变成"建文档时强制登记 + 提交前机械兜底"，二者互补（流程减少疏漏，脚本兜住漏网）
- **相关文件**：`docs/DOCUMENTATION.md`、`scripts/check-docs-routing.sh`、`scripts/check-all.sh`

## 2026-06-07 — 路由表覆盖范围补到根目录，修掉 CLAUDE.md 这处真空

- **改动**：① `docs/DOCUMENTATION.md` 的 SSOT 表补一行"Claude Code 专属行为规则 → CLAUDE.md"——它之前能被发现纯靠 Claude Code 工具自动读取这个文件名，但路由表里查不到"这类信息该写哪"；② `scripts/check-docs-routing.sh` 扫描范围从只查 `docs/*.md` 扩大到根目录治理文档（豁免 `DOCUMENTATION.md` 自身和已转历史记录的 `SETUP.md`）
- **影响**：路由设计不再只覆盖 `docs/` 这一个角落，根目录的治理文件也纳入同一张图，避免"靠工具约定能找到 = 不需要登记"的认知漏洞
- **相关文件**：`docs/DOCUMENTATION.md`、`scripts/check-docs-routing.sh`、`CLAUDE.md`

## 2026-06-07 — 删除 SETUP.md（不再维护就别留着占位）

- **改动**：用户看到 `PRODUCT.md` / `PROJECT.md` / `SETUP.md` 三个名字容易看混，借机判断 `SETUP.md` 既已转成"历史记录、不再维护"，干脆直接删除，而不是留着一份不会再更新的文件。同步清理 `AGENTS.md` 必读列表里对它的引用、`scripts/check-docs-routing.sh` 里对它的豁免项（文件都没了，豁免规则就是死引用）
- **影响**：减少一份"内容会过期但没人会去看"的文件；`PRODUCT.md`/`PROJECT.md` 的角色区分仍然保留在 SSOT 表里，靠职责说明区分而不是靠多一份文件做缓冲
- **相关文件**：`AGENTS.md`、`scripts/check-docs-routing.sh`

## 2026-06-07 — AGENTS.md 补上指向文档路由表的入口

- **改动**：`AGENTS.md` 之前完全没提 `docs/DOCUMENTATION.md`——而 AI 在这个项目里最常做的事之一就是"写东西"（记 CHANGELOG/DECISIONS/LESSONS、建新文档），却没有指引去查路由表，导致"新建文档必须登记路由表"这条规则即便写在 DOCUMENTATION.md 里，AI 进来也未必会主动翻到。现在在"必读文件"和"你该做的"里都补上了指向
- **影响**：补上路由设计的最后一环——"规则本身完善"和"AI 知道去哪查规则"是两件事，前者有了不代表后者也有
- **相关文件**：`AGENTS.md`、`docs/DOCUMENTATION.md`

## 2026-06-07 — 新增 HANDOFF 新鲜度提醒（弱提示，不自动生成内容）

- **改动**：新增 `scripts/check-handoff-freshness.sh`——统计自上次改动 `HANDOFF.md` 以来，又有多少次涉及 `src/`/`docs/` 的提交，超过阈值（5 次）就提醒"该写交接了"；接入 `check-all.sh` 的弱提示区
- **影响**：交接记录的"内容"仍然只能靠人/AI 当场总结（语义判断，机器编不出有价值的内容），但"该不该动笔"这个时机判断现在有机器兜底提醒了——不阻断提交，纯提示
- **相关文件**：`scripts/check-handoff-freshness.sh`、`scripts/check-all.sh`、`HANDOFF.md`

## 相关文件

| 文件 | 关系 |
|------|------|
| `HANDOFF.md` | 本轮交接涉及的变更 |
| `PROJECT.md` | 当前进度（含本条改动的来源任务） |
