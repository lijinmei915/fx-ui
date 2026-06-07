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

## 相关文件

| 文件 | 关系 |
|------|------|
| `HANDOFF.md` | 本轮交接涉及的变更 |
| `PROJECT.md` | 当前进度（含本条改动的来源任务） |
