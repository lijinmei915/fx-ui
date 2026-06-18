# fx-ui

公司 Web 端组件库与设计规范站点。**不手写组件**——基础控件全部来自 [shadcn/ui](https://ui.shadcn.com)（open-code），公司视觉只通过**注入 token** 实现；项目本体是一个可浏览的文档站，承载组件示例、设计 token、布局/栅格规范和 AI 协作规则。

## 技术栈

React + TypeScript + Tailwind CSS v4 + shadcn/ui（open-code）+ Vite

## 快速开始

```bash
npm install
npm run dev      # 本地启动文档站（默认 http://localhost:5173）
npm run build    # 生产构建
npm run check:all # 跑全部治理检查（契约/token 漂移/锚点/交互态等）
```

## 目录速览

| 路径 | 作用 |
|------|------|
| `src/App.tsx` | 文档站本体（组件页、token 页、布局/栅格页） |
| `src/components/ui/` | shadcn 基础组件（open-code，可读可改） |
| `src/components/fx/` | 公司组合组件（PageShell / Layout 骨架 / SearchToolbar 等） |
| `src/lib/icons.ts` | 图标统一入口（底层 Tabler，线宽/面型见下） |
| `theme/fx-theme.css` | **设计 token 真相源**，改这里 = 全局换肤 |
| `docs/` | 规范文档（见下） |
| `scripts/check-*` | 可执行治理检查，`check:all` 汇总 |

## 关键文档

- **`AGENTS.md`** — AI/协作红线（进项目先读）
- **`docs/TOKENS.md`** — 颜色 / 圆角 / 阴影 / 间距 / 排版 / 图标 token 值与用法
- **`docs/LAYOUTS.md`** — 24 列栅格、页面容器、容器默认尺寸
- **`docs/DECISIONS.md`** — 重要技术决策（选了什么、为什么）
- **`docs/CHANGELOG.md`** — 结构性改动记录
- **`docs/DOCUMENTATION.md`** — 文档路由表（哪类信息写哪份）

## 设计体系要点

- **Token 真相源唯一**：`theme/fx-theme.css`，oklch 从种子色派生 13 色系 + 中性灰轴；改 token 按"改 CSS → 同步 docs → `npm run build:tokens`"的顺序。
- **交互态走色板阶梯**，禁 `color-mix` / `/透明度`（有门禁脚本拦截）。
- **图标** Tabler：线宽全局 `.tabler-icon { stroke-width: 1.75 }`，面型用 `*Filled`。
- **字体** 自托管开源：Inter（西文）+ Noto Sans SC（中文），跨平台一致。
- **布局**两层：整页骨架用 `fx/layout.tsx` 组件，内容分栏用 Tailwind 24 列工具类。
