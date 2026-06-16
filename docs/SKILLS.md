---
layer: knowledge
type: spec
last_verified: 2026-06-09
teaches: "skills/ 目录是什么、里面的 skill 包怎么维护"
use_when: "AI 要新建/修改 skills/ 下的 skill 包时"
---

# AI Skill 包（skills/）

> 用途：说明 `skills/` 目录是什么、为什么存在、怎么维护。

## 这个目录是什么

`skills/` 存放面向 AI 的能力包。每个包告诉 AI「怎么生成符合 fx-ui 规范的某类产物」。

目前只有一个：`fx-ui-report/`

## fx-ui-report

**职责**：接受任意格式的报告数据（HTML / JSON / Markdown / 纯文字），输出严格对齐 fx-ui token 的独立 HTML 报告页。

- 入参：不限格式，AI 自行识别内容语义
- 出参：单文件 HTML，所有样式内嵌，Chart.js CDN + Lucide CDN，无其他外部依赖
- 真相源：`theme/fx-theme.css`，token 值不得手动杜撰

### 文件结构

| 文件 | 作用 |
|------|------|
| `SKILL.md` | AI 入口，读这里了解职责和调用方式 |
| `USAGE.md` | 阅读顺序、Do/Avoid |
| `DESIGN.md` | 视觉规则（页面结构/文字层级/8个组件规则/图标系统） |
| `manifest.json` | skill 元数据 |
| `tokens.css` | 报告 HTML 直接整段粘贴用的 token 快照 |
| `tailwind-v4.css` | token 到 Tailwind v4 `@theme` 映射（React 版报告用） |
| `design-tokens.json` | token 结构化审计记录 |
| `components.html` | 8 个报告模块的可视化目录 |
| `components.manifest.json` | 模块机器可读索引 |
| `example.html` | 人工校对通过的完整报告样本 |
| `preview/index.html` | 报告整体预览 |
| `preview/colors.html` | 色板预览 |
| `preview/typography.html` | 文字层级预览 |
| `preview/charts.html` | 6 种图表色板效果预览 |
| `source/evidence.md` | 溯源说明 |
| `source/token-contract.report.json` | token → `fx-theme.css` 行号映射（供校验脚本消费） |
| `source/tokens.source.json` | 原始 token 机器可读格式 |

### 维护规则

- **真相源永远是 `theme/fx-theme.css`**——`tokens.css` / `design-tokens.json` / `source/` 都是导出产物
- `theme/fx-theme.css` 改了 token 色值 → 同步更新 `tokens.css`、`design-tokens.json`、`source/token-contract.report.json`
- `example.html` 是人工校对通过的样本，改样式规则后必须同步更新它，`preview/index.html` 是其副本
- 图标用 Lucide CDN（`data-lucide="icon-name"`），图表用 Chart.js 4 CDN

## 相关文件

| 文件 | 关系 |
|------|------|
| `theme/fx-theme.css` | token 真相源 |
| `docs/TOKENS.md` | token 查询表 |
| `scripts/check-tokens-sync.sh` | 校验 token 是否漂移，消费 `source/token-contract.report.json` |
