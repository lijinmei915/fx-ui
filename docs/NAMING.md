---
layer: governance
type: spec
last_verified: 2026-08-28
teaches: "fx-ui 文档应该叫什么名字、放在哪里"
use_when: "新建文档前，判断它该放根目录还是 docs/、该用什么命名风格"
depends_on: []
---

# 文档命名规范

> 用途：定义文档命名和放置位置，让 AI 和人快速判断"这个文件该叫什么、放哪里"。
> 什么时候更新：新增文档类型、目录命名策略变化时。
> 不要写什么：具体文档内容、组件设计本身。

设计 Token 和 Styling Hooks 的命名不归本文管理，统一查看 `docs/TOKEN_NAMING.md`。

---

## 总原则

```txt
平台约定名不改。
根目录放入口。
docs/ 放工程治理。
```

## 根目录主流文件

| 文件 | 用途 |
|------|------|
| `README.md` | 项目入口 |
| `AGENTS.md` | AI 工作规则 |
| `PROJECT.md` | 项目当前状态 |
| `HANDOFF.md` | 交接上下文 |
| `PRODUCT.md` | 产品定义 |
| `CLAUDE.md` | Claude Code 专属适配（路由规则、首次引导） |

规则：社区约定或工具自动读取的文件放根目录，不要为了统一风格改名。

## docs/ 工程文档

`docs/` 下用大写主题名：

| 文件 | 回答的问题 |
|------|------------|
| `docs/ARCHITECTURE.md` | 三层体系、模块职责、目录边界 |
| `docs/TOKENS.md` | 设计 token 查询表 |
| `docs/TOKEN_NAMING.md` | FDS Token 与 Styling Hooks 命名规范 |
| `docs/LAYOUTS.md` | 布局规范（从真实页面沉淀） |
| `docs/DECISIONS.md` | 决策及原因 |
| `docs/CHANGELOG.md` | 结构性变更 |
| `docs/LESSONS.md` | 踩坑复盘 |
| `docs/BLOCKS.md` | 内部 Blocks 使用方式（待建） |

## 子目录命名

`docs/components/` 下按组件名小写存放文档资产，例如：

```txt
docs/components/button.md
docs/components/button-group.md
```

## 不建议的命名

避免：`notes.md`、`misc.md`、`todo.md`、`final.md` —— 没有语义边界，AI 和人都猜不出该往里塞什么。

不知道放哪里时，先写进 `HANDOFF.md`，稳定后再沉淀到对应 docs 文件。

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/ARCHITECTURE.md` | 目录结构和分层边界 |
| `AGENTS.md` | 文档职责总表 |
| `HANDOFF.md` | 不确定归属的内容先落在这里 |
