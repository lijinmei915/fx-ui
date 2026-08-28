---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "fx-ui 的跨框架核心边界、框架适配器状态，以及新框架实现的准入条件"
use_when: "要让 fx-ui 适配 React 之外的框架，或判断某项能力能否跨框架共享时"
---

# 框架核心与适配器

> fx-ui 共享的是设计与交互契约，不是某个框架的组件运行时代码。适配器状态以 `docs/data/framework-adapters.manifest.json` 为真相源。

## 核心边界

框架无关核心包含：Token 及语义槽、Theme Seed/Preset 与派生算法版本、组件身份与受治理选项、交互状态和使用意图、图标语义 ID、页面类型与数据契约、搭建操作协议、Agent UI block/action 协议。

`docs/data/framework-core.manifest.json` 从现有真相源生成，只是 portable 投影，不成为第二份真相源。它包含 FDS 命名合同、Primitive/Map/Semantic/Component 四层声明和 Foundation FDS/legacy 对照，但不包含组件源码路径、框架包名、JSX 示例、渲染函数或框架事件对象。组件按证据分为 `identity-only`、`governed-options` 和 `adapter-ready`；只有 canonical contract 与 ready 参考适配器映射都通过检查，才能进入 `adapter-ready`。

FDS portable contract 采用 `Primitive / Seed -> Map -> Semantic -> Component`。Global Styling Hooks 使用 `--fds-g-*`；只有通过准入的 Component Styling Hooks 才使用 `--fds-c-*`，其余组件仍直接消费 Global Semantic。当前为 `fds-primary` 阶段，portable core 和 React 运行时以 FDS Foundation/Semantic 为主名称，旧 `--fx-*` 只作生成式兼容别名；Button、Input、Table 是首批准入试点，owner、语义缺口和测试证据来自 `component.tokens.json`。语法与公开面以 `token-naming.manifest.json` 为真相源，真实阶段就绪状态由 `fds-migration-audit.manifest.json` 派生，适配器不得自行宣称已进入下一阶段。

portable core 现在分别携带 `tokens.globalSemantic`、`tokens.componentHooks` 两份完整层合同，以及只含对外接口的 `tokens.publicStylingHooks`。公共投影与 `registry/fx-theme.contract.json#stylingHooks` 由同一个生成规则产生，release 构建会校验两者完全一致；适配器只能把这份公共清单当作可覆盖 API，不能从完整内部合同自行扩大公开面。当前公共合同为 `1.0.0-draft.11 / experimental`，包含 46 个 stable Global、13 个 stable Component 和 51 个 experimental Global Hook。

主题不由框架适配器各自定义。portable core 的 `theme` 字段直接投影 `theme-presets.manifest.json` 中的受治理维度、Foundation 引用、算法版本、light/dark 发布状态、质量门和输出白名单；适配器只应用 contract 声明的变量，不复制预设表或色阶算法。统一 CSS、contract JSON、shadcn registry 与 Chromium 审计证据分别位于 `registry/fx-theme.css`、`registry/fx-theme.contract.json`、`registry/fx-theme.json` 和 `docs/data/theme-audit.manifest.json`；`registry/fx-theme.release.json` 以哈希把它们和 portable core 绑定为一次版本发布。

## 适配器状态

| 适配器 | 状态 | 含义 |
|--------|------|------|
| React | `ready` | 当前参考实现；shadcn open-code、Base UI、Tabler React 绑定和现有 Blocks 均属于 React 适配器。 |
| Vue 2 | `planned` | 只保留治理入口和准入门；当前没有源码目录、依赖、组件或 Blocks，不构成已支持。 |

状态必须由机器登记和检查。文档中的描述不可以把 `planned`、`experimental` 写成生产可用。

当前已完成六条纵向样板：

- Input：portable core 声明单行文本输入的值模型、通用属性、`valueChange/focus/blur` 事件、Field/InputGroup 组合和无障碍约束。
- Button：portable core 声明即时动作语义、表面/语义色/尺寸、`activate/focus/blur` 事件，以及前后图标、纯图标、加载和链接表面的组合约束；Loading 明确保持为 `disabled + Spinner`，不是组件属性。
- Select：声明单选/多选值模型、开合与清除契约，并把搜索、其他项输入和 Field 保持为组合能力。
- Checkbox：声明布尔值模型；`indeterminate` 是从子项集合派生的表现状态，不是第三个业务值。
- Dialog：声明受控开合、焦点进入/恢复和标题约束；未保存拦截是受控组合，危险确认仍使用 AlertDialog。
- Table：声明原生语义表格、表面与密度轴，以及排序、筛选、冻结、选择、加载、空态、分页和汇总的组合边界；不把业务状态塞进 Table 根属性。

React 适配器再分别映射到本地 open-code 导出、Base UI 原语或原生 HTML 语义，以及现有 props/events。六条样板都没有修改组件 API 或外观。

Button、Input、Table 的 React 映射还显式登记了全部 13 个已准入 Component Hook。`build:framework-core` 会逐项验证 Hook 属于对应 canonical component、没有未发布名称、没有重复绑定，并且登记的 React 源码真实消费该变量；portable core 与 release 只输出“3 个组件 / 13 个 Hook 已绑定”的适配状态，不把 React 文件路径变成跨框架合同。Vue 2 在 `planned` 阶段保持零绑定。

## 新框架准入

新适配器按以下顺序进入：

1. 选择该框架仍受维护的成熟无头组件或组件基础，不翻译 React JSX。
2. 建立 canonical component/icon ID 到框架实现的显式映射。
3. 对每个组件验证 props、事件、受控值、焦点、键盘和无障碍语义。
4. 复用同一版本的 Token CSS/JSON 契约，并消费已发布模式；不复制或改写视觉真相源、预设算法或审计阈值。
5. 为该框架独立实现并验证 Block renderer；不共享 React render/ref/event 约定。
6. 通过适配器 manifest 声明的 contract、interaction、accessibility、build 与 visual gates 后，才可从 `planned` 升级。

Vue 2 进入实施前还必须确认依赖维护状态、TypeScript 边界、SSR/构建目标和宿主应用约束；未确认前不新增 Vue 文件或依赖。

## 不共享的内容

- React/Vue 组件源码、hooks、refs、事件对象和插槽/render conventions。
- Base UI、Tabler React 等框架绑定包。
- React Blocks、页面 renderer、文档站预览适配器和视觉测试 harness。
- 在调用处覆盖组件外观的 class、任意 CSS 值或框架专属逃生 API。
- Web Components 通用运行时；当前不以它作为所有框架的共同底座。

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/ARCHITECTURE.md` | 生产层级和模块职责 |
| `docs/TECH_STACK.md` | 当前真实技术栈与版本状态 |
| `docs/data/framework-adapters.manifest.json` | 适配器状态与准入门真相源 |
| `docs/data/framework-core.manifest.json` | 从既有 SSOT 派生的 portable contract |
| `docs/data/token-naming.manifest.json` | FDS 四层命名、公开性与迁移阶段合同 |
| `docs/data/fds-migration-audit.manifest.json` | 旧前缀消费者、replacement 覆盖与阶段就绪证据 |
| `docs/data/fds-foundation.manifest.json` | 583 个 Primitive/Map 的 FDS 名称、profile 与可用 legacy 对照派生产物 |
| `docs/DECISIONS.md` | 跨框架拆分的取舍原因 |
