---
layer: governance
type: spec
last_verified: 2026-08-28
teaches: "fx-ui 的文档分工边界、SSOT 规则——一条信息该写进哪个文件"
use_when: "不确定一条新信息该记录到哪份文档时，先查这里的 SSOT 表和判断示例"
---

# 文档编写规范

> 用途：定义文档边界、命名方式和更新规则，让 AI 和人快速判断"这条信息该写进哪个文件"。
> 不要写什么：当前项目状态、交接流水、具体业务实现。

---

## SSOT 原则

同一类信息只在一个文件里维护，其他地方只引用。冲突时按下表定主：

> ⚠️ **新建 `docs/*.md` 时的强制步骤**：必须**同时**在下面这张 SSOT 表里加一行（"这份文档解决什么问题 → 它是真相源"）。
> 这一步和"建文档"是同一个动作，不是事后补充——漏了会让新文档变成孤岛（查不到它，等于不存在）。
> `scripts/check-docs-routing.sh` 会在提交前兜底检查有没有漏登记，但那是兜底网，不是替代这一步。

### 防漂治理三件套

长期规则不能只停留在自然语言里。新增或修改治理规则时，先判断它属于哪种类型：

| 类型 | 只写 Markdown 是否足够 | 还应该补什么 |
|------|------------------------|--------------|
| 解释性原则 | 通常足够 | 必要时补相关文件链接 |
| 会被代码实现的结构事实 | 不够 | 补 `docs/data/*.json` 机器事实表 |
| 会随源码变化的 API / token / 页面骨架 | 不够 | 补检查脚本，并接入 `npm run check` 或 `check-all.sh` |

标准闭环：

```txt
文字规范 text spec -> 机器事实表 machine manifest -> 可执行检查 executable check
```

例子：

| 规则 | 文字规范 | 机器事实表 | 检查 |
|------|----------|------------|------|
| 文档站骨架 | `docs/DOC_SITE_DESIGN.md` | `docs/data/doc-site.manifest.json` | `scripts/check-doc-site-contract.mjs` |
| 组件事实 | `docs/components/*.md` | `docs/data/components.manifest.json` | `scripts/check-components-manifest.mjs` |
| 组件质量矩阵 | 组件源码、组件 manifest、Playground manifest、视觉测试 | `docs/data/component-quality.manifest.json`（派生） | `scripts/check-component-quality.mjs` |
| 组件生产分层事实 | 组件源码、Hook、recipes/Blocks、page build kit | `docs/data/layered-assets.manifest.json` | `scripts/check-layered-assets.mjs` |
| token | `docs/TOKENS.md`（架构总览）+ `docs/foundations/*.md`（专题规范） | `docs/data/design-tokens.json`（映射事实）→ `docs/data/agent-tokens.manifest.json`（派生 Agent / Theme contract） | `scripts/check-tokens-sync.sh` + `scripts/build-agent-token-contract.mjs --check` + `scripts/check-theme-contract.mjs` |
| FDS Token 命名、四层生成与前缀迁移 | `docs/TOKEN_NAMING.md` | `docs/data/token-naming.manifest.json`（命名 SSOT）+ `tokens/source/{primitive,map,semantic,component}.tokens.json`（四层 SSOT）→ `docs/data/fds-{foundation,semantic,components}.manifest.json` + `docs/data/fds-migration-audit.manifest.json`（派生） | `scripts/check-token-naming.mjs` + `scripts/build-fds-{foundation,semantic,components}.mjs --check` + `scripts/build-fds-migration-audit.mjs --check` |
| Agent 查询能力 | `AGENTS.md`（行为边界）、现有组件/token/page 真相源 | `docs/data/agent-*.manifest.json`、`docs/data/agent-context.md`、`docs/data/page-build-kit.manifest.json`、`docs/data/agent-recipes.manifest.json` | `doctor` 聚合 Token、组件源码/API、文档示例、Build Kit 与 Agent UI 检查；`check:agent-query` 守查询/计划/影响/配方边界，`check:agent-examples` 守示例来源，`check:agent-recipes` 守场景证据 |
| 文档章节/职责 | 本文（SSOT 表） | `docs/data/doc-structure.manifest.json` | `scripts/check-doc-structure.mjs` |

### Markdown / Manifest / Generated 分工

主流做法不是“全写 Markdown”也不是“全做 JSON”，而是按用途分层：

| 载体 | 适合放什么 | 不该放什么 |
|------|------------|------------|
| `docs/*.md` | 背景、原因、边界、判断原则、流程说明 | 会被页面/AI/脚本反复消费的结构化事实 |
| `docs/data/*.json` | 页面、AI、脚本都要读取的结构化事实；需要状态、优先级、字段约束的内容 | 纯解释性长文、权衡过程、重复叙述 |
| `scripts/build-*.mjs` / 生成脚本 | 能从真相源稳定推导出来的副本，例如命令表、token 清单、部分治理页面数据 | 再造一个新的真相源；把本该手写的判断逻辑硬塞成伪自动化 |

判断顺序固定为：

```txt
先问：这是解释，还是事实？
再问：这份事实会不会被页面 / AI / 脚本共同消费？
再问：它能不能从别的真相源稳定派生？
```

落地规则：

1. **解释写 Markdown。** “为什么这样定 / 边界是什么 / 什么时候例外”优先写 `docs/*.md`。
2. **结构事实写 manifest。** 只要页面、AI、脚本中有两方以上要消费，同一份事实就应收口到 `docs/data/*.json`。
3. **能派生的不要手填第二份。** 如果内容能从 `package.json`、源码、token 源、路由源或其他 manifest 稳定生成，就优先写生成脚本，而不是再手抄一个副本。
4. **禁止双真相源。** 同一份结构化事实不能同时在 Markdown、JSON、页面 JSX 里各维护一份“都像真相源”的副本。
5. **不要过度机器化。** 纯待讨论的想法、一次性备注、只给人看的 TODO，不必强行做成 JSON；只有当页面、AI 或脚本真的要消费时，才升级为 manifest。

简单判断：

| 场景 | 应该放哪 |
|------|----------|
| “为什么真相源和引用项要联动” | `docs/*.md` |
| 页面上的规则卡槽 / 命令表 / 状态表 | `docs/data/*.json` |
| `package.json scripts` 派生出来的命令展示 | `scripts/build-*.mjs` 生成到 manifest |
| 临时脑暴、一次性备注 | Markdown 即可 |

| 问题 | SSOT |
|------|------|
| 基础、组件和页面规范的统一人读入口 | `docs/INDEX.md`（只导航，不复制规则） |
| 任意产物住哪/怎么新增登记/谁 check（按种类分流总入口） | `docs/MAP.md` |
| 怎么装配一个页面（流程/决策树/可用区块） | `docs/PAGES.md` |
| 怎么开始用 | `README.md` |
| 产品定位和设计方向 | `PRODUCT.md` |
| AI 怎么行动 | `AGENTS.md` |
| 项目当前状态、当前优先级 | `PROJECT.md` |
| 交接 / 接手 | `HANDOFF.md` |
| Claude Code 专属行为规则 | `CLAUDE.md`（通用规则仍以 `AGENTS.md` 为准，本文件只放 Claude Code 特有行为） |
| 三层架构、模块职责 | `docs/ARCHITECTURE.md` |
| 跨框架核心边界、适配器状态与新框架准入 | `docs/FRAMEWORK_ADAPTERS.md` |
| 设计规则总览（指向 token/布局） | `docs/DESIGN_STANDARDS.md` |
| 文档站自身的页面结构、样式边界和改样式流程 | `docs/DOC_SITE_DESIGN.md` |
| Token 架构、治理边界与专题路由 | `docs/TOKENS.md` |
| 颜色、排版、圆角、间距、阴影、动效、层级、图标、栅格和布局专题规范 | `docs/foundations/*.md` |
| FDS Token / Styling Hooks 命名语法、词典、公开与兼容规则 | `docs/TOKEN_NAMING.md` |
| 布局规范 | `docs/LAYOUTS.md` |
| 已就绪/规划中页面类型的人读索引 | `docs/pages/README.md`（状态事实仍引用 page manifest） |
| Agent UI 生成式界面协议 | `docs/AGENT_UI.md` |
| Agent UI 视觉规范 | `docs/AGENT_UI_VISUAL.md` |
| 对外报告/简报渲染层（`src/reports/`）说明和数据契约 | `docs/REPORTS.md` |
| 技术栈版本和约束 | `docs/TECH_STACK.md` |
| 文档/文件命名规范 | `docs/NAMING.md` |
| 架构/技术/产品决策及原因 | `docs/DECISIONS.md`（⚠️ 不写进 AI memory，memory 只存跨项目 AI 行为偏好） |
| 结构性变更 | `docs/CHANGELOG.md` |
| 错误复盘 | `docs/LESSONS.md` |
| 实际目录结构、模块边界 | `docs/CODE_STRUCTURE.md` |
| 本地怎么跑起来、依赖、环境变量 | `docs/ENVIRONMENT.md` |
| 常用命令、故障排查步骤 | `docs/RUNBOOK.md` |
| 测试/质量校验规范 | `docs/TESTING.md` |
| 文档 frontmatter 元数据规范 | `docs/KNOWLEDGE_SCHEMA.md` |

---

## 核心文件边界

每个文件只回答一类问题。以下是最简判断依据：

### README.md
回答"这是什么、怎么装、怎么开始"。不写 AI 规则、交接流水。

### AGENTS.md
回答"AI 进来后怎么判断请求、哪些行为禁止"。不写产品介绍、项目进度。

### PROJECT.md
回答"项目现在是什么阶段、当前优先级、已知问题"。不写交接细节、变更历史。

### HANDOFF.md
回答"这轮做了什么、风险是什么、下一步干什么"。不写长期路线图、产品介绍。

### docs/DESIGN_STANDARDS.md
回答"UI 规则总览、token 怎么用、设计边界"。具体值不在这里列，指向 TOKENS/LAYOUTS。

### docs/DOC_SITE_DESIGN.md
回答"fx-ui 文档站本身怎么布局、哪些样式能改、改样式时该动哪一层"。不写 token 具体值、组件 API 或业务后台页面布局规则。

### docs/TOKEN_NAMING.md

回答"FDS Token 与 Styling Hooks 应该叫什么、字段按什么顺序、哪些词合法、哪些接口公开"。不抄 Token 具体值，不负责文件命名，也不维护组件真实 API。

### docs/TECH_STACK.md
回答"用了什么技术、什么版本、AI 能不能假设它已落地"。不写产品路线。

### docs/DECISIONS.md
回答"为什么这么定、放弃了什么方案"。不写当前 TODO。

### docs/CHANGELOG.md
回答"这次改动影响了什么层"。不写当前状态、纯文案小修。

### docs/LESSONS.md
回答"犯了什么错、新增了什么约束"。误判、杜撰、用户指出"又编了"时更新。

### docs/ARCHITECTURE.md
回答"模块职责、三层边界、目录结构"。不写运行规则、当前进度。

### docs/FRAMEWORK_ADAPTERS.md
回答"哪些契约跨框架共享、各框架适配器处于什么状态、何时允许新增实现"。不写具体组件 API 或虚构尚未落地的框架支持。

### docs/AGENT_UI.md
回答"公司 Agent 怎么生成受控 UI、AgentSurface 支持哪些 JSON block、action 怎么回传、哪些字段禁止"。不写具体业务接口、权限规则或某个 Agent 的提示词。

### docs/AGENT_UI_VISUAL.md
回答"Agent UI 卡片应该长什么气质、怎么参考 C 端、和 fx-ui token / shadcn 基础组件是什么关系"。不写 Agent 通信协议、业务接口或提示词。

---

## 快速判断示例

> 场景：给 Button 文档加场景示例时，编了一个 shadcn 不存在的"文字按钮"概念，被用户指出"一切都不要杜撰"，改名为 ghost 并修正。

| 该写到 | 写什么 |
|--------|--------|
| `docs/LESSONS.md` | LES-001：杜撰了"文字按钮"概念，根本原因是没先查源码核实，新增"落笔前必须核实"的规则 |
| `docs/CHANGELOG.md` | 场景示例数据结构改动（如果同时触发了结构性重构，比如改成数据派生） |
| `HANDOFF.md` | 这轮把场景示例改对了、踩了这个坑（给下一轮提醒） |
| 不该写到 `docs/DECISIONS.md` | 这是"犯错改正"，不是"权衡后选择方案"——除非改正过程中确立了新的长期规则 |
| 不该写到 `PROJECT.md` | 除非这件事改变了项目的当前优先级 |

---

## 文档头部规范

每个 .md 顶部应有 frontmatter（`teaches` / `use_when`）和一段简介：

```md
---
layer: knowledge | governance
type: spec | status | log | architecture
last_verified: 2026-08-28
teaches: "这份文档回答什么问题"
use_when: "什么场景下应该先查这份文档"
---
```

这样 AI 不需要读全文就能判断"该不该来这里查、该不该往这里写"。

---

## 反模式

- 每次改动都把 PROJECT / HANDOFF / CHANGELOG / DECISIONS 全更新一遍（按实际影响更新，不是凑齐）
- `PROJECT.md` 写成流水账
- `HANDOFF.md` 写成永久历史（应该是"这轮做了什么"，不是项目编年史）
- `CHANGELOG.md` 写成 TODO 清单
- 把"为什么这么选"写进 `CHANGELOG.md`（应该去 `DECISIONS.md`）
- 把"犯过的错"写进 `DECISIONS.md`（应该去 `LESSONS.md`，除非错误本身催生了新的方案决策）

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/NAMING.md` | 文件命名和放置位置 |
| `docs/TOKEN_NAMING.md` | FDS Token 与 Styling Hooks 命名语言 |
| `docs/KNOWLEDGE_SCHEMA.md` | frontmatter 元数据字段和取值规范（本文件定文档边界，它定 frontmatter 格式） |
| `AGENTS.md` | AI 的文档职责定义 |
| `PRODUCT.md` | 产品方向（文档内容需对齐产品定位） |
