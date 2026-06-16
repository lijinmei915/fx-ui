---
layer: governance
type: spec
last_verified: 2026-06-16
depends_on: [docs/DOCUMENTATION.md]
teaches: "fx-ui 文档 frontmatter 元数据的字段定义和合法取值，避免字段值越写越乱"
use_when: "给新文档加 frontmatter、或检查已有文档的元数据是否规范时"
---

# 知识结构化规范

> 用途：定义文档 frontmatter 元数据字段和取值枚举，保证 AI 和人写的元数据互相对得上。
> 不要写什么：具体文档内容、安装流程。

> 说明：fx-ui 目前**没有** `scripts/build-project-graph.sh` 这类自动解析 frontmatter 生成知识图谱的脚本——
> 这份规范现阶段的作用是"让人和 AI 写 frontmatter 时用统一的字段和取值"，
> 不是"喂给某个自动化工具"。如果以后引入图谱生成脚本，再回来补充消费方式。

## 两层元数据并存

每个文档头部有两套元数据，各管一摊：

| 元数据 | 形式 | 给谁看 | 例子 |
|--------|------|--------|------|
| Frontmatter | 文件最顶部 YAML（`---` 包裹） | 机器（AI 检索、未来可能的图谱工具） | `layer: knowledge` |
| 用途引用块 | 标题下方 `> 用途/什么时候更新/不要写什么` | 人 | `> 用途：说明系统结构` |

两者并存，不互相替代。

## Frontmatter 字段

```yaml
---
layer: knowledge        # 架构归属层（必填）
type: spec              # 文档类型（必填）
last_verified: 2026-06-16
depends_on: [AGENTS.md, docs/DOCUMENTATION.md]  # 声明式依赖（可选，无则省略）
teaches: "项目的技术栈选型与运行环境约定"  # 语义摘要：这个文件教会 AI 什么（可选）
use_when: "AI 需要了解项目用了什么框架、怎么启动时"  # 语义触发：什么场景下该查这个文件（可选）
---
```

### layer — 架构归属层

一个文件只归一层：

| 值 | 含义 | 典型文件 |
|----|------|---------|
| `entry` | 用户入口层 | README.md |
| `knowledge` | 知识与资产层 | 多数 docs/*.md |
| `governance` | 基础治理层 | AGENTS.md、docs/DOCUMENTATION.md、docs/NAMING.md |

> fx-ui 暂时用不到 `skills` 层（对应 `.ai/skills/`、批量脚本能力，fx-ui 还没有这套）。

### type — 文档类型

| 值 | 含义 | 典型文件 |
|----|------|---------|
| `spec` | 规范类：定义规则、边界、约定 | ARCHITECTURE / TECH_STACK / DESIGN_STANDARDS |
| `status` | 状态类：当前进度、交接 | PROJECT.md / HANDOFF.md |
| `log` | 流水类：追加记录 | CHANGELOG / DECISIONS / LESSONS |
| `guide` | 指南类：操作手册、教程 | RUNBOOK.md |

> ⚠️ 自查发现：`docs/ARCHITECTURE.md` 之前写的是 `type: architecture`，不在合法枚举里——已改正为 `type: spec`（架构说明本质是"定义规则和边界"，归 spec 类）。

### last_verified — 最后内容变更日期（自动维护）

ISO 日期（`YYYY-MM-DD`），语义是**该文档最后一次内容变更的日期**。

**自动更新**：`scripts/bump-doc-dates.sh` 在 pre-commit 里，把本次提交中有内容变更的文档（`docs/*.md` + `AGENTS.md` / `PROJECT.md` / `PRODUCT.md`）的 `last_verified` 自动 bump 到当天并重新入暂存。**不需要手动填**——改了内容、提交时日期就跟着到当天。

`scripts/check-doc-freshness.sh` 是兜底：万一绕过 hook（`--no-verify`）或手改导致日期落后，会在 `check-all` 里弱提醒。

### depends_on — 声明式依赖

该文档逻辑上必须配合阅读的其他文件路径数组。是**人工声明的强依赖**，不是自动 grep 出来的引用关系。无依赖时省略此字段。

### teaches — 语义摘要

一句话描述这个文件**教会 AI 什么知识**，回答"读完这个文件，AI 能做到什么？"

| 写法 | 评价 |
|------|------|
| `teaches: "前端规范"` | ❌ 太笼统，和标题重复 |
| `teaches: "fx-ui 的三层组件体系：基础组件/公司组合组件/页面 Blocks"` | ✅ 读完知道整个分层逻辑 |

可选字段，无则省略。

### use_when — 语义触发

一句话描述**什么场景下 AI 应该来查这个文件**，描述触发条件而不是文件内容。

| 写法 | 评价 |
|------|------|
| `use_when: "需要时"` | ❌ 等于没说 |
| `use_when: "新建文件/组件前，判断该放进哪个目录"` | ✅ 明确触发场景 |

可选字段，无则省略。

## 新增文件接入规则

新增一个文档时：

1. **加 frontmatter**：在文件最顶部加 YAML 块，至少填 `layer` / `type` / `last_verified`
2. **归层**：从三层（entry/knowledge/governance）里选一个
3. **定类型**：从四种 type（spec/status/log/guide）里选一个，不要自创新值
4. **声明依赖**：如果该文档必须配合其他文件读，填 `depends_on`
5. **写语义索引**：尽量补 `teaches`/`use_when`，方便 AI 按场景检索

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/DOCUMENTATION.md` | 文档编写规范和 SSOT 边界（本文件专注 frontmatter 元数据） |
| `docs/NAMING.md` | 文档命名和放置位置 |
