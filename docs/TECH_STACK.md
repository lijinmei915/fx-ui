---
layer: knowledge
type: spec
last_verified: 2026-07-27
teaches: "fx-ui 实际采用的技术栈、版本边界，以及 AI 生成代码前要遵守的版本约束"
use_when: "生成代码、加依赖、或讨论技术选型前，先确认这里标的是不是已确定"
---

# 技术栈说明

> 用途：记录项目实际采用或明确计划采用的框架、运行时、工具和版本边界。
> 不要写什么：产品路线、临时调试记录、尚未确定却被强行指定的技术选型。

## 技术栈总览

| 层级 | 技术 / 工具 | 版本 / 要求 | 状态 | 说明 |
|------|-------------|-------------|------|------|
| 前端框架 | React + TypeScript | React `^19.2.7`、TS `^6.0.3` | 已确定 | |
| 样式 | Tailwind CSS | `^4.3.0`（v4，新引擎） | 已确定 | token 通过 `theme/fx-theme.css` 注入语义槽 |
| 组件库 | shadcn/ui | CLI `shadcn ^4.10.0` | 已确定 | open-code 模式，组件源码进 `src/components/ui/` |
| 组件底层原语 | Base UI (`@base-ui/react`) | `^1.5.0` | 已确定 | 不是 Radix——Button 等组件基于 Base UI，见 `docs/DECISIONS.md` DEC-001、`docs/LESSONS.md` LES-002 |
| 构建 / 包管理 | Vite + npm | Vite `^8.0.16` | 已确定 | `npm run build` 实际是 `tsc -b && vite build` |
| 图标 | @tabler/icons-react | `^3.44.0` | 已确定 | 统一从 `@/lib/icons` 导入，线性默认、选中态使用 `*Filled` 变体 |
| 工具库 | class-variance-authority / clsx / tailwind-merge | `^0.7.1` / `^2.1.1` / `^3.6.0` | 已确定 | shadcn 组件标配的变体/类名合并方案 |
| 部署 | `候选` | — | 候选 | 尚未确定，不要假设具体平台 |

状态说明：
- `已确定`：项目已经在用，AI 可以直接当作实现前提
- `候选`：方向已讨论，但还没进入实现，AI 只能讨论不能假设已落地
- `待定`：暂时不要让 AI 假设具体版本

## 版本边界

- 运行时：Node（具体版本以本地 `.nvmrc` / CI 配置为准，本文件不重复记版本号易过期的内容）
- 包管理器：npm
- React：`^19.2.7`（注意是 React 19，很多旧教程/旧库的写法不适用）
- TypeScript：`^6.0.3`

## 选型原因

| 选型 | 原因 | 替代方案 | 取舍 |
|------|------|----------|------|
| shadcn/ui（open-code）而非自研组件库 | 组件源码可读可改，AI 和工程师都能直接消费；详细原因见 `docs/DECISIONS.md` DEC-001 | 自己手写组件、沿用老 Element 改造库 | 放弃自研——黑盒难维护、AI 读不懂 |
| Tailwind v4 + token 注入 | 公司视觉只需改 `theme/fx-theme.css` 一处即可全局换肤，不在组件层动手脚 | 在组件 className 里硬编码颜色 | 放弃硬编码——会导致视觉散落、难统一 |

## AI 使用约束

- 标记为 `已确定` 的才能当作实现前提；`候选`/`待定` 的只能讨论方向，不能直接当成已落地的事实写进代码或文档
- 涉及组件底层库（Base UI / Radix 等）时，先看本表 + 源码确认，不要凭"shadcn 生态通识"假设——这条是 LES-002 踩过的坑
- 如果本文件与 `package.json` 实际版本冲突，以 `package.json` 为准，并回来更新本文件

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/ARCHITECTURE.md` | 系统结构和模块边界 |
| `docs/DECISIONS.md` | 技术选型背后的决策原因（DEC-001） |
| `docs/LESSONS.md` | 因误判底层库踩过的坑（LES-002） |
