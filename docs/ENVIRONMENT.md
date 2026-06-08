---
layer: knowledge
type: spec
last_verified: 2026-06-08
teaches: "fx-ui 本地怎么跑起来、需要什么依赖、有没有环境变量"
use_when: "AI 需要帮用户启动项目、排查环境问题、或判断要不要配置密钥时"
---

# 环境说明

> 用途：说明本地运行、依赖、环境变量和外部服务。
> 什么时候更新：启动命令、依赖版本、环境变量、外部服务变化时。
> 不要写什么：产品路线、交接流水、一次性调试日志。

本文回答：开发者和 AI 在这个项目里怎么把环境跑起来。

## 运行环境

当前是 Vite + React + TypeScript 前端项目。

基础依赖：
- `node`
- `npm`

具体版本要求见 `docs/TECH_STACK.md`。

## 常用命令

```bash
npm install
npm run dev          # 启动本地开发服务器
npm run build        # 构建
npm run check        # shadcn contract 检查 + 构建
npm run preview      # 预览构建产物
```

## 环境变量

**没有**。fx-ui 不依赖任何环境变量——没有 `.env` / `.env.example` / `.env.local` 文件，代码里也没有读取自定义环境变量（只用了 Vite 内置的 `import.meta.env.DEV`）。

如果以后需要接入外部服务并引入密钥，新增前先回来更新本节，不要假设已经存在某个环境变量。

## 本地忽略规则（.gitignore）

`.gitignore` 在 `node_modules`/`dist`/`.DS_Store` 之外，又补了三类，原因记在这里方便以后查：

- `*.tsbuildinfo`：TS 增量编译缓存（如 `tsconfig.tsbuildinfo`），机器生成、因人而异，提交了只会造成无意义的 diff
- `.claude/settings.local.json`、`*.local.*`：个人本地配置（如 Claude Code 的本地权限设置），换人/换机器就会不同，不该跨人同步
- `.env`、`.env.local`、`.env.*.local`：环境变量文件的标准命名模式，一旦真的引入会包含密钥；现在虽然用不到（见上一节"没有"），但提前占位防止以后有人手滑提交密钥

`tsconfig.tsbuildinfo` 和 `.claude/settings.local.json` 此前已被提交，补规则的同时用 `git rm --cached` 做了取消跟踪（本地文件保留，以后不再进 diff）。

## 外部服务

当前不依赖数据库、云服务或第三方 API。fx-ui 是纯前端组件文档站，所有数据来自本地源码。

## 常见问题

环境相关的启动报错见 `docs/RUNBOOK.md`（例如 Tailwind utility class 不生效、`@theme inline` 取值问题）。

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/TECH_STACK.md` | 具体依赖版本号 |
| `docs/RUNBOOK.md` | 启动报错和故障处理 |
