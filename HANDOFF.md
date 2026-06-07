> **接手时间**：2026-06-07
> **项目根目录**：fx-ui
> **当前状态**：组件功能开发暂停一轮，专门做了一次文档治理体系大整顿——补全 docs/ 核心文档、建立 SSOT 路由表、接入自动检查脚本和 git 钩子
> **下一步**：回到产品功能线——把列表页 demo 拆成内部 Block 候选，继续补编辑页 / 详情页样板
> **风险**：`theme/fx-theme.css` 是 token 真相源，改动影响全局；基础组件必须从 shadcn 拉，不能手写；新建文档必须同步登记 `docs/DOCUMENTATION.md` 的路由表，否则会被 pre-commit 钩子拦截

---
layer: knowledge
type: status
last_verified: 2026-06-07
teaches: "fx-ui 上一轮做了什么、当前能不能继续、风险是什么、下一步具体干什么"
use_when: "新的 AI 会话接手 fx-ui 时"
depends_on: [PROJECT.md]
---

# 当前交接 — fx-ui

> 新 AI 接手 fx-ui，先读这里。

## 当前状态

- 当前做到：完成一轮系统性的文档治理整顿——对照"Project OS"治理模板逐份审查，按 fx-ui 实际现状新建/调整了一整套 docs/ 文档，搭起 SSOT 路由表和自动化检查链
- 当前阻塞：无
- 是否可继续：可以；本轮是治理基建，下一步该回到产品功能线（列表页 → Block 拆分）

## 本次已完成

- **新建 docs/ 核心文档**（共 13 份，均按 fx-ui 实际现状填写，非套用模板占位）：`CHANGELOG`、`DECISIONS`、`LESSONS`、`NAMING`、`DESIGN_STANDARDS`、`TECH_STACK`、`DOCUMENTATION`、`CODE_STRUCTURE`、`RUNBOOK`、`TESTING`、`ENVIRONMENT`、`KNOWLEDGE_SCHEMA`，以及根目录 `PRODUCT.md`
- **修正 `docs/ARCHITECTURE.md`**：补"模块职责"表，修正 frontmatter `type: architecture` → `type: spec`（不在合法枚举里）
- **token SSOT 治理**：新建 `scripts/check-tokens-sync.sh` 校验 `theme/fx-theme.css` 与 `docs/TOKENS.md` 色值是否漂移——运行时即发现并修复了 `--accent`/`--sidebar-accent` 真实漏抄
- **建立文档 SSOT 路由表**：在 `docs/DOCUMENTATION.md` 补全"问题 → 该写去哪"映射表，覆盖全部 19 份文档（含根目录治理文档），并在 `AGENTS.md` 里补上指向它的入口（之前 AI 进项目都不知道有这张表）
- **新建检查链**：`scripts/check-all.sh` 统一入口，整合"组件契约 / token 漂移 / 文档路由登记 / 密钥扫描 / 文档同步弱提醒"五项，接入 `npm run check:all` 和 git pre-commit 钩子（`scripts/pre-commit` + `scripts/install-git-hooks.sh`）
- **从 kit 安全提取**：`.ai/rules`（符号链接同步真相文档）、`templates/`、若干自动化脚本；`check-secrets.sh` 按 fx-ui 实际情况重写；删除 5 个和 fx-ui 现状不符的打分类脚本
- **文档体检清理**：删除 `SETUP.md`（内容和 `PROJECT.md` 重复且已过期）、修复 `docs/KNOWLEDGE_SCHEMA.md` 孤岛（漏被引用）、清理两代孤儿文件 `knowledge-registry.json`、删除 `11/` 参考模板目录

## 风险与待确认

- `theme/fx-theme.css` 是 token 真相源，改它 = 全局换肤，动手前必须先告知用户
- 基础组件仍然必须从 shadcn 拉；公司组合组件可以写，但必须由 shadcn 组件组合而成，不能变成新的黑盒基础组件库
- `@theme inline` 不能用 `var()` 引用——Tailwind v4 编译时取不到运行时变量，必须直接写色值
- 必须 `@import "tailwindcss"`，否则 `shadcn/tailwind.css` 里所有 utility class 都不生效
- **新规矩**：新建 `docs/*.md` 必须同步在 `docs/DOCUMENTATION.md` 的 SSOT 路由表里登记一行，否则 `check-docs-routing.sh` 会在提交前拦截
- token 改动后若 `npm run check:tokens` 报漂移，要去同步 `docs/TOKENS.md` 的对应表格——脚本只查不自动改

## 下一步

1. 回到产品功能线：把当前列表页 demo 拆成内部 Block 候选 `src/blocks/list-page/`
2. 继续做编辑页 / 详情页 / 设置页样板
3. 补 `docs/BLOCKS.md`，记录内部 Blocks 的使用方式（记得同步登记进路由表）
4. 跑 `bash scripts/build-project-graph.sh` 生成知识图谱（目前生成了但还没有消费方）

## 相关文件

| 文件 | 关系 |
|------|------|
| `PROJECT.md` | 项目全局状态（本文件只记当前轮次的交接信息） |
| `AGENTS.md` | AI 行为规则，含"第一版手搓组件被否决"的踩坑记录 |
| `PRODUCT.md` | 产品定义（避免交接时偏离 fx-ui 的产品意图） |
| `docs/ARCHITECTURE.md` | 三层体系（基础组件 / 公司组合组件 / 页面 Blocks）说明 |
