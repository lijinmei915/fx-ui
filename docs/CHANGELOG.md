---
layer: knowledge
type: log
last_verified: 2026-06-07
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

## 相关文件

| 文件 | 关系 |
|------|------|
| `HANDOFF.md` | 本轮交接涉及的变更 |
| `PROJECT.md` | 当前进度（含本条改动的来源任务） |
