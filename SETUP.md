# fx-ui 搭建说明（历史记录）

> 核心原则：**不自己写组件，只注入公司 token，组件全用现成 shadcn/ui。**
>
> ⚠️ 本文件是工程**初次搭建时**的一次性步骤记录，工程早已搭完，不再是日常操作入口：
> - 日常启动/构建命令查 `docs/ENVIRONMENT.md` / `docs/RUNBOOK.md`
> - 当前进度查 `PROJECT.md`（唯一真相源，本文件不再维护进度清单）
> 留着只为回答"当初是怎么从零搭起来的"。

## 这个项目是什么

不是一个"手写的组件库"，是一套 **AI 可读的组件生产体系**：
- 底层组件：用现成的 shadcn/ui（open-code，源码进仓库，团队可改）
- 公司视觉：只靠注入 token 实现（`theme/fx-theme.css`）
- 组件来源：`npx shadcn add xxx` 现成拉，拉下来自动是公司橙

## 技术栈（组织级标准）

- React + TypeScript
- Tailwind CSS v4
- shadcn/ui（不封装黑盒，open-code 进仓库）

## 搭建步骤（在终端跑）

### 1. 起一个 Vite + React + TS 工程
```bash
npm create vite@latest . -- --template react-ts
npm install
```

### 2. 装 Tailwind v4
```bash
npm install tailwindcss @tailwindcss/vite
```
然后在 `vite.config.ts` 加上 `@tailwindcss/vite` 插件。

### 3. init shadcn
```bash
npx shadcn@latest init
```
按提示选：Tailwind v4、CSS variables = yes。

### 4. ★ 注入公司 token（关键一步）
把 `theme/fx-theme.css` 的内容，贴进 shadcn 生成的 `src/index.css`（或 globals.css）里，替换掉它默认的 `:root` 变量。

这一步做完，**所有现成组件自动变公司橙**。

如果要按 shadcn 官方 registry 分发主题，使用：

```txt
registry/fx-theme.json
```

它是官方 `registry:theme` 格式；本项目运行时仍以 `theme/fx-theme.css` 为 token 真相源。

### 5. 拉现成组件（不用自己写）
```bash
npx shadcn@latest add button card input dialog table form
```
拉下来的组件已经是公司视觉，源码在 `src/components/ui/`，团队想改就改。

## 页面模板也用现成的

不从零写页面。用：
- shadcn Blocks（官方现成区块）
- v0.dev 生成
- 内部 blocks registry

再由 AI / 工程师改成本业务版本。

## 相关文件

| 文件 | 关系 |
|------|------|
| `PROJECT.md` | 当前进度唯一真相源（本文件不重复记录） |
| `docs/ENVIRONMENT.md` | 日常启动/构建命令 |
| `docs/RUNBOOK.md` | 故障处理和常用操作 |
