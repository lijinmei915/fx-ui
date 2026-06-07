---
layer: knowledge
type: status
last_verified: 2026-06-06
teaches: "fx-ui 上一轮做了什么、下一步具体干什么、有什么坑"
use_when: "新的 AI 会话接手 fx-ui 时"
---

# 当前交接 — fx-ui

> 新 AI 接手 fx-ui，先读这里。

## 上一轮做了什么

- 搭建了 Vite + React + TS 工程（手动创建 package.json + 安装依赖）
- 安装 Tailwind v4（`@tailwindcss/vite` 插件）+ `npx shadcn init`
- 公司 token 注入到 `theme/fx-theme.css`，`@theme inline` 直接用色值覆盖 shadcn 默认主题
- `npx shadcn add button` 拉现成 Button 组件，验证公司橙换肤成功 ✅
- 写过 Button 演示页（后续已替换为标准列表页 demo）
- 记录了长期方向：fx-ui 是公司级 AI 可读前端生产体系，不只是基础组件库。详见 `docs/ARCHITECTURE.md`
- 拉取了更多 shadcn 基础组件：Card / Input / Dialog / Table / Tabs / Badge / Separator / Label / Select / Alert Dialog / Dropdown Menu / Textarea
- 完成标准后台列表页 demo：标题区 + 筛选区 + 表格区 + 新建客户弹窗 + 删除确认
- 抽出第一批公司组合组件：`src/components/fx/page-shell.tsx`、`page-header.tsx`、`search-toolbar.tsx`、`confirm-danger-dialog.tsx`
- 新增第一版布局规范：`docs/LAYOUTS.md`
- 组件库承载页已改为从 shadcn 官方 `sidebar-15` Block 起步：保留 `SidebarProvider` / `SidebarInset` / `SidebarLeft` / `SidebarRight` 三栏结构，再替换为 fx-ui 组件文档内容

## ⚠️ 重要的坑（别重蹈覆辙）

- **第一版走错了路**：AI 手搓了 CSS 假组件（Button/Card），被用户当场否决。
- **正确做法**：不手写组件，一律 `npx shadcn add` 拉现成，公司视觉只靠 token 注入。
- 这条已写进 `AGENTS.md` 红线，务必遵守。
- **`@theme inline` 不能用 `var()` 引用**：Tailwind v4 编译时取不到运行时变量，必须直接写色值（如 `--color-primary: #FF8000`），`:root` 里的 `--primary` 变量仅供业务代码直接引用。
- **必须 `@import "tailwindcss"`**：`shadcn/tailwind.css` 不包含 tailwindcss 本体，缺了这行所有 utility class 都不生效。
- 页面骨架优先用 shadcn Blocks 起步；当前组件库页底座来自 `npx shadcn@latest add sidebar-15`，不要再退回纯手写三栏。

## 下一步具体干什么

1. 把当前列表页 demo 拆成内部 Block 候选：`src/blocks/list-page/`
2. 继续做编辑页 / 详情页 / 设置页样板
3. 补 `docs/BLOCKS.md`，记录内部 Blocks 的使用方式
4. 接 Project OS：跑 build-project-graph 生成 fx-ui 的知识图谱

## 风险

- token 真相源 `theme/fx-theme.css` 改动影响全局，改前说明
- 基础组件仍然必须从 shadcn 拉；公司组合组件可以写，但必须由 shadcn 组件组合而成，不能变成新的黑盒基础组件库
- 当前目录不是 git 仓库，无法用 git diff/status 追踪变更
