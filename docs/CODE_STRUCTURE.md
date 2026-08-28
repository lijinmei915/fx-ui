---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "fx-ui 代码目录现在实际长什么样、新文件该放哪、不该放哪"
use_when: "新建文件/组件前，判断该放进哪个目录；分不清'现状'和'长期方向'时来这里对照 ARCHITECTURE.md"
depends_on: [docs/ARCHITECTURE.md]
---

# 代码结构说明

> 本文件回答：代码现在实际怎么分层、各目录放什么、不该放什么。
> 跟 `docs/ARCHITECTURE.md` 的分工：那边是"长期方向、应该长成什么样"，这里是"现在实际是什么样"——
> 两边可能不一致（比如 `layouts/` 在 ARCHITECTURE 里是规划方向，但现在还没创建），
> 不一致时以本文件的"当前结构"为准，不要把 ARCHITECTURE 的推荐目录当成已存在去引用。

## 当前结构

实际存在的目录（`src/` 下）：

```txt
src/
  components/
    ui/        # shadcn open-code 基础组件 + manifest 明确白名单的原生语义例外
    fx/        # 公司组合组件层，已抽出 PageShell / PageHeader / SearchToolbar / ConfirmDangerDialog
  hooks/       # 共享 hooks
  lib/         # 跨领域工具、注册表与站点运行时
  pages/
    docs/
      components/      # 组件文档页面及其专属 Playground/预览适配器
      foundations/     # 栅格、布局、图标等基础文档页面
      getting-started/ # Getting Started 内容、导航和页面适配器
      governance/      # 治理与网站规范页面及其专属展示模块
      tokens/          # Token 文档页面及其专属预览
    templates/         # 已验证的完整页面模板
  reports/     # 独立报告页面
  App.tsx      # 文档站组合入口
```

Token 真相源位于 `tokens/source/`：`primitive.tokens.json` 保存 DTCG Primitive，`map.tokens.json` 保存生成式 Map 合同，`semantic.tokens.json` 保存 Global Semantic，`component.tokens.json` 保存经过准入的 Component Hooks。`theme/foundation.css`、`theme/fds-semantic.css` 与 `theme/fds-components.css` 分别生成；`theme/fx-theme.css` 固定导入三者并作为唯一运行时入口。生成产物不得手改，也不得与 source 重复维护值。

尚未创建、属于规划方向（见 `docs/ARCHITECTURE.md`）：`src/layouts/`——新建前先确认是否真的要落地，不要假设它们已存在。

- 代码位置：`src/`
- 页面入口：`src/App.tsx`（当前承载组件文档站，不是业务页面）
- 共享组件：`src/components/ui/`（基础）、`src/components/fx/`（公司组合）
- 页面：`src/pages/`；逻辑与工具：`src/hooks/`、`src/lib/`
- 跨框架架构事实：`docs/data/framework-adapters.manifest.json`；portable 派生产物：`docs/data/framework-core.manifest.json`
- FDS Primitive/Map 真相源：`tokens/source/`；运行时 Foundation 与 portable contract 由 `scripts/build-fds-foundation.mjs` 生成

## 结构规则

- 先按职责分层（基础组件 / 公司组合组件 / 页面 / 工具），不按技术名词堆目录
- `src/components/ui/` 以 CLI 拉取的 shadcn 组件为准；只有 manifest `nativeSemanticComponents` 白名单绑定 DEC 的原生语义组件可以例外（当前仅 Link，见 DEC-056）
- `src/components/fx/` 的组件必须由 `ui/` 里的组件组合而成，不能绕开 `ui/` 自己另起一套样式
- 新目录只有在现有结构承接不了、且已经从真实页面里验证过模式时再新增（呼应"从真实页面沉淀规范"的原则）
- 不为 `planned` 适配器预建空源码目录；新框架通过准入门后再创建独立实现根，不能混入当前 React 目录

## 待补充

- 抽出第一个 `src/blocks/` 候选时，回来补充该目录的实际结构和命名约定

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/ARCHITECTURE.md` | 长期方向和三层体系（本文件偏"现在实际是什么样"） |
| `docs/NAMING.md` | 文件和目录命名规范 |
| `docs/DECISIONS.md` | "不手写组件"等结构相关决策的原因 |
