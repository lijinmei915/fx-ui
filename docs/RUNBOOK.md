---
layer: knowledge
type: guide
last_verified: 2026-06-07
teaches: "fx-ui 怎么跑起来、遇到常见报错怎么处理"
use_when: "本地启动/构建出问题时，先来这里查有没有现成的症状/原因/处理"
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
npm run preview      # 预览构建产物
```

## 提交前自动检查（pre-commit 钩子）

`.git/hooks/` 不进版本库，每个 clone 下来的人**首次**要手动装一次：

```bash
bash scripts/install-git-hooks.sh
```

装好之后，每次 `git commit` 前会自动跑一遍 `npm run check:all`（组件契约 / token 漂移 / 密钥扫描），不通过就中止提交。钩子源文件在 `scripts/pre-commit`，改检查逻辑去改 `scripts/check-all.sh`，不要直接改 `.git/hooks/pre-commit`（不会同步给别人）。

紧急情况可以 `git commit --no-verify` 跳过，但不建议常态化使用。

## 发布流程

目前没有真正的对外发布/部署流程——fx-ui 现在是内部组件文档站，止步于推送到 GitHub 私有仓库（`lijinmei915/fx-ui`）。
有真正的部署需求时，再回来补充这一节，不要在没有的情况下假写一套发布步骤。

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
