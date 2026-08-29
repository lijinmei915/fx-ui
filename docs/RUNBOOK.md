---
layer: knowledge
type: guide
last_verified: 2026-08-29
teaches: "fx-ui 的常用命令、提交前检查和常见故障处理（运行环境/依赖见 ENVIRONMENT）"
use_when: "要查命令、跑检查、或本地启动/构建出问题时"
---

# 运行手册

> 用途：记录常见操作命令和故障处理步骤。
> 不要写什么：长期路线图、详细变更历史、一次性操作。

---

## 本地自检

实际命令（见 `package.json`）：

```bash
npm run dev          # 启动本地开发服务器（Vite）
npm run build        # tsc -b && vite build
npm run check        # 契约 + token 漂移 + 构建
npm run check:all    # 契约 + token 漂移 + 密钥扫描（不含构建，更快）
npm run check:shadcn # 单独跑 shadcn contract 检查
npm run check:tokens # 单独跑 token 漂移检查
npm run build:tokens # 从 fx-theme.css 重建 design-tokens.json（改完 CSS 必跑）
npm run preview      # 预览构建产物
npm run build:foundation         # 构建只含基础规范与对应 Markdown 的分享版
npm run preview:foundation       # 预览 dist-foundation
npm run test:visual:foundation   # 验证分享范围、Markdown 和视觉基线
```

## 提交前自动检查（pre-commit 钩子）

`.git/hooks/` 不进版本库，每个 clone 下来的人**首次**要手动装一次：

```bash
bash scripts/install-git-hooks.sh
```

装好之后，每次 `git commit` 前会自动跑一遍 `npm run check:all`（组件契约 / token 漂移 / 密钥扫描），不通过就中止提交。钩子源文件在 `scripts/pre-commit`，改检查逻辑去改 `scripts/check-all.sh`，不要直接改 `.git/hooks/pre-commit`（不会同步给别人）。

紧急情况可以 `git commit --no-verify` 跳过，但不建议常态化使用。

## 发布流程

当前有两个静态构建出口。公司 Foundation 的唯一发布目标为 `https://git.firstshare.cn/bigfe/sharecrm-design-system`；旧的个人命名空间仓库 `lijm9767/fds` 仅保留历史版本，不再更新。

```bash
npm run build                 # 完整维护站 → dist/
npm run build:foundation      # Foundation 分享站 → dist-foundation/
npm run test:visual:foundation
```

`dist-foundation/` 可以部署到 GitLab Pages、内部 Nginx 或其他静态托管。它按 `docs/data/publication-profiles.manifest.json` 的白名单只包含 Token、栅格、布局和对应 Markdown；构建结束会扫描产物，发现组件文档、Playground、搭建器、页面模板、报告或治理数据时直接失败。不要把仓库权限或完整 `dist/` 当成 Foundation 交付物。

发布时只把 `dist-foundation/` 同步为公司仓库的 `public/`，并同步白名单内的 11 份 Markdown 与人读 `README.md`。不得把完整 fx-ui 源码、组件文档或主项目 Git 历史推入公司 Foundation 仓库。

Foundation 构建使用相对资源路径，因此既可部署在域名根目录，也可部署在 GitLab Pages 的项目子路径（例如 `/fds/`）；同时禁用完整站 `public/` 目录的默认复制，避免把未被 Foundation 引用的业务图片带入分享包。完整维护站仍使用根路径资源并保留原有公开资源。

## 常见故障

### Tailwind v4 utility class 不生效

```txt
症状：写了 Tailwind class 但页面没样式
原因：忘记 @import "tailwindcss"，shadcn/tailwind.css 里的 utility class 不会生效
处理：检查入口 CSS 文件，确认有 @import "tailwindcss"
```

### `@theme inline` 里用 var() 引用颜色不生效

```txt
症状：在 @theme inline 里用 var(--xxx) 引用 token 颜色，编译后取不到值
原因：Tailwind v4 的 @theme inline 是编译期取值，拿不到运行时 CSS 变量
处理：直接在 @theme inline 里写死色值，不要用 var() 嵌套引用
```

### 不要手搓组件代替 shadcn 组件

```txt
症状：发现某个"组件"样式总是跟 shadcn 官方的对不上、AI 读不懂它的结构
原因：第一版走错了路，由 AI 手搓 CSS 模拟出一个假组件，而不是 npx shadcn add 拉真实组件
处理：删掉手搓的，用 npx shadcn add <组件名> 重新拉取；详见 docs/DECISIONS.md DEC-001
```

## 相关文件

| 文件 | 关系 |
|------|------|
| `HANDOFF.md` | 故障最初是在交接记录里发现的，新故障先记那里再沉淀到这里 |
| `docs/DECISIONS.md` | 故障背后牵涉的技术选型决策 |
| `docs/LESSONS.md` | 因误判/杜撰导致的错误模式（跟"环境报错"是不同类型） |
