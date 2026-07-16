---
layer: knowledge
type: log
last_verified: 2026-07-16
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

## 2026-07-16 — Elevation Token 复合阴影升级

- **改动**：`shadow-l1/l2/l3/l1-up` 从单层改为两到三层复合阴影，以近层落点和远层扩散表达 elevation；主题预览强度映射、Token manifest 和阴影文档同步为同一组真实值。
- **影响**：Dropdown、Sheet、Dialog 等已有调用不需要更换 utility，即可获得更清楚但仍克制的层级；调用方仍禁止叠加多个 elevation Token。
- **相关文件**：`theme/fx-theme.css`、`src/App.tsx`、`docs/TOKENS.md`、`docs/data/design-tokens.json`、`docs/DECISIONS.md`

## 2026-07-15 — Agent 查询/受控装配 contract + Shape 语义半径

- **改动**：从现有 Token、组件和调试台 manifest 派生 Agent token/组件 contract 与快速上下文；新增统一 `npm run fx -- ...` 查询入口、doctor 诊断及页面 Build Kit。Build Kit 只开放已有 `gen:list-page` 的列表页骨架，详情页/表单页明确标记为 `needs-block`。新增 Shape 语义半径别名与同心嵌套规则，不改变组件默认外观。
- **影响**：Agent 可先查询真实 API、Token 映射与页面生成边界，再读取源码或执行脚手架；派生物、Build Kit 和 Shape 映射均接入检查。主题构建只重建既有 CSS 真相源的派生产物；当前没有可执行的历史迁移，因此 upgrade 命令只报告该状态。
- **相关文件**：`docs/data/{agent-tokens,agent-components,page-build-kit}.manifest.json`、`docs/data/agent-context.md`、`scripts/{fx-agent,doctor,build-agent-components,build-agent-context}.mjs`、`theme/fx-theme.css`、`docs/{TOKENS,PAGES,DECISIONS}.md`

## 2026-07-16 — Agent 意图查询边界固化

- **改动**：将可解释命中、组件/API 优先、调试台控制项非 API、示例只存来源指针固化到 Agent contract 和 AI 行为规则；新增 `check-agent-query-contract` 门禁。词表和排序权重保留在 CLI 内演进。
- **影响**：协作者和 Agent 获得稳定查询边界，又不会把检索实现细节误当作组件或设计规范。
- **相关文件**：`AGENTS.md`、`docs/DECISIONS.md`、`docs/data/agent-components.manifest.json`、`scripts/check-agent-query-contract.mjs`

## 2026-07-16 — Agent 接入与诊断协议

- **改动**：新增只读 `fx init --agent codex|claude|cursor` 接入片段；doctor 结果新增稳定 `FX_*` 错误码及修复命令。
- **影响**：新协作者可快速获得最小正确上下文，自动化可按诊断代码处理问题，且不会被工具覆盖既有 Agent 配置。
- **相关文件**：`scripts/{fx-agent,doctor,build-agent-context}.mjs`、`docs/{DECISIONS,CHANGELOG}.md`

## 2026-07-16 — 受控页面任务计划

- **改动**：新增 `fx plan`，由现有 Page Build Kit 为自然语言任务返回唯一的已验证页面路径、数据契约、来源指针和禁止项；未沉淀页型明确返回 blocked。
- **影响**：Agent 从“查询组件”进入“受控装配”，但不会绕过页面 Block 治理生成临时 JSX。
- **相关文件**：`scripts/fx-agent.mjs`、`docs/data/page-build-kit.manifest.json`、`scripts/check-agent-query-contract.mjs`、`docs/DECISIONS.md`

## 2026-07-16 — 变更影响与示例来源门禁

- **改动**：新增 `fx impact component|token`，沿既有 contract 输出真相源、下游引用和必跑检查；新增 Agent 示例来源验证，检查文档页文件、场景符号和锚点是否真实存在。
- **影响**：协作者在修改前能看见受治理的影响链，示例入口不再因页面重构而静默失效。
- **相关文件**：`scripts/{fx-agent,check-agent-examples,check-agent-query-contract}.mjs`、`docs/data/agent-components.manifest.json`、`AGENTS.md`

## 2026-07-16 — Theme Contract 与主题审计

- **改动**：从现有 Token contract 派生 Theme Contract，新增 `fx theme show/audit` 和 `check:theme`，明确可替换语义视觉槽与受保护结构 token；不创建新主题。
- **影响**：主题边界、交互状态完整性和当前只支持 light 的事实变为可查询、可审计契约。
- **相关文件**：`scripts/{build-agent-token-contract,check-theme-contract,fx-agent}.mjs`、`docs/data/agent-tokens.manifest.json`、`docs/{TOKENS,DECISIONS}.md`

## 2026-07-16 — Agent 场景配方 Contract

- **改动**：新增 `fx recipe` 和四条真实场景配方，记录跨组件组合、行为、验收、禁止项与证据来源；未知场景显式拒绝。新增 `check:agent-recipes` 门禁与 `FX_AGENT_RECIPE_DRIFT` 诊断码。
- **影响**：协作者可查询经过验证的业务组合，不再从单个组件 API 自由猜测场景实现。
- **相关文件**：`docs/data/agent-recipes.manifest.json`、`scripts/{fx-agent,check-agent-recipes}.mjs`、`docs/DECISIONS.md`

## 2026-06-18 — 图标库换 Tabler + 布局拆「布局/栅格」两页 + Layout 骨架组件

- **改动**：图标从 Phosphor 换成 Tabler（`src/lib/icons.ts` 重映射，线宽由全局 `.tabler-icon` 控制、面型用 `*Filled`，见 DEC-009，卸载 phosphor）；布局页拆成「布局」(#layout，页面容器+尺寸) 和「栅格」(#grid，24 列+断点) 两页，借鉴 Semi；新增 fx 骨架组件 `src/components/fx/layout.tsx`（Layout/Header/Sider/Content/Footer，见 DEC-010），栅格保持 Tailwind 工具类不封 Row/Col；按钮对齐 shadcn（字重 400、梯度字号 12/13/14/16）
- **影响**：图标线宽可调、有实心变体；布局/栅格职责分离、各有独立页；新增可复用页面骨架组件；图标/布局红线写进 `AGENTS.md`
- **相关文件**：`src/lib/icons.ts`、`src/components/fx/layout.tsx`、`src/App.tsx`、`theme/fx-theme.css`、`docs/{TOKENS,LAYOUTS,DECISIONS}.md`、`AGENTS.md`、`scripts/check-toc-anchors.mjs`

## 2026-06-18 — 自托管开源字体（Inter + Noto Sans SC）

- **改动**：字体从纯系统栈改为自托管开源 webfont（`@fontsource` 引入 Inter 管西文、Noto Sans SC 管中文，见 DEC-008）
- **影响**：中英文跨平台渲染一致、无版权困扰
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
