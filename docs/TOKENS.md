---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "公司设计 token 的基础架构、真实值和全局视觉使用规则"
use_when: "AI 要用颜色/圆角/字体/状态样式、生成页面、改 shadcn 组件样式或判断视觉是否符合公司规范时"
---

# fx-ui 设计 Token

> 用途：公司视觉规范的查询表和 AI 生成规则。
> 真相源分层：`tokens/source/primitive.tokens.json` 保存 DTCG Primitive，`tokens/source/map.tokens.json` 保存生成式 Map，`tokens/source/semantic.tokens.json` 保存 Semantic，`tokens/source/component.tokens.json` 保存经过准入的 Component Hooks；`theme/foundation.css`、`theme/fds-semantic.css` 与 `theme/fds-components.css` 由它们生成，`theme/fx-theme.css` 只作唯一公开装配入口。改任一真相层都必须先说明影响。
> 改完 Primitive/Map 或 Semantic 后，跑 `npm run build:tokens` 依次重建 Foundation runtime、portable contract、Token manifest 和 Agent contract，再跑 `bash scripts/check-tokens-sync.sh` 校验本表有没有漏抄或漂移。

FDS 四层 Token 与 `--fds-g-*` / `--fds-c-*` Styling Hooks 的完整命名语法、受控词典、公开面和 `--fx-*` 兼容阶段统一以 `docs/TOKEN_NAMING.md` + `docs/data/token-naming.manifest.json` 为准。当前处于 `fds-primary`：运行时、公开装配、派生数据和 portable contract 使用 FDS 主名称；旧变量与 shadcn 插槽只通过生成别名兼容。

机器可消费的公开 Hook 清单位于 `registry/fx-theme.contract.json#stylingHooks`，并与跨框架 core 的 `tokens.publicStylingHooks` 强制同构。当前 114 项中有 48 个 `public-global` 和 13 个 `public-component` stable Hook，剩余 53 个 Global Hook 仍为 experimental，因此公共合同整体保持 experimental。主题默认值由 `registry/fx-theme.css` 提供，内部四层全量合同不等于公开兼容面。

fx-ui 的组件源码来自 shadcn/ui，公司的视觉统一不靠重写组件，而靠 token 注入。

## Agent Token Contract

Agent 不直接从色板挑数值。它应查询由 `docs/data/design-tokens.json` 派生的 `docs/data/agent-tokens.manifest.json`，只选择 semantic token 或组件已经声明的 `stateMappings`；primitive 色板仅供主题实现解析。该 contract 不新增 Token，也不是第二真相源。

主题能力先通过 `npm run fx -- theme show --json` 查询：结果同时返回受治理的 Preset Contract 与语义槽 Contract。`npm run fx -- theme audit --json` 会连同浏览器对比度/状态报告一起审计；light 与 dark 自 v1.2.0 起可分发，当前合同版本由 `theme-presets.manifest.json#contractVersion` 唯一声明。

```bash
# 按意图查语义 token 与组件映射
npm run tokens -- search "Input invalid"

# 追溯一个语义 token 到 CSS 变量与色板引用
npm run tokens -- resolve semantic.destructive --json

# 查看组件允许的 token 与状态映射
npm run tokens -- component Input --json
```

`npm run build:tokens` 会按 `DTCG Primitive + Map contract → Foundation runtime → Semantic source → Semantic runtime → admitted Component source → Component runtime → public entry` 的固定顺序重建 Token manifest 和 Agent contract。`check:fds-foundation`、`check:fds-semantic`、`check:fds-components` 与 `check:agent-tokens` 会阻止派生数据漂移；组件状态映射必须引用已声明的 Semantic Token，且不得在调用处改写视觉。

统一 Agent CLI 也提供 `npm run fx -- token <query> --json` 与 `npm run fx -- theme`。其中 `npm run fx -- theme build` 重建 Token、Agent 与跨框架 core 派生产物，**不**接受自由色值、临时组件覆盖或生成额外主题实现。

## 基础架构

### 0. 分层治理

FDS 采用主流设计系统分层：**Tailwind 是表达层，FDS Token 是视觉真相源；企业视觉数值统一映射进 Tailwind 类体系消费**。

- Tailwind 负责“怎么摆、怎么调用”：布局、栅格、间距、断点、对齐、显隐、响应式，以及统一的 class API。
- FX token 负责“值是多少”：颜色、字号、圆角、阴影、边框粗细、动效时长。
- 组件层负责把两者接起来：把 FX 数值挂到 Tailwind 语义类上，用统一类名消费，而不是平行维护两套视觉刻度。

治理口径：

| 维度 | 默认口径 | 说明 |
|------|----------|------|
| `spacing / layout / breakpoint` | **Tailwind 原生** | 保持与 shadcn / Tailwind 工程习惯一致，如 `gap-*`、`px-*`、`grid`、`lg:*` |
| `color` | **FX token → Tailwind 语义类** | 必须走 `--fx-*` / 语义槽 / `bg-primary` 这类映射，不写死十六进制，不长期依赖 Tailwind 默认色 |
| `typography` | **FX token → Tailwind 字号类** | 对外主推荐 `text-sm/base/lg/xl`；`text-control-sm` 仅供 28px 紧凑控件内部使用，底层仍由企业字号 token 驱动 |
| `radius` | **FX token → Tailwind 圆角类** | 组件圆角走 `--radius` 派生档，不另立一套默认刻度 |
| `shadow` | **FX token → Tailwind 阴影类** | 统一 `shadow-l1/l2/l3`，不用 Tailwind 默认 `shadow-sm/md/lg` |
| `border-width` | **FX 结构基线** | 默认 `1px`，由组件和 token 规范固定；不作为普通主题面板的运行时覆写项 |
| `motion` | **FX token / 约定档位** | 动效时长跟随主题或规范档位，不在单页随意发明时长 |

一句话收口：**Tailwind 管形式，FX 管数值；FX 的值映射进 Tailwind 里用。**

## 主题生成合同

主题定制不是另一套 Token，也不是 React 页面里的局部样式。`docs/data/theme-presets.manifest.json` 统一声明受治理的输入、预设、默认值、算法版本、所有权和输出白名单；框架适配器只消费这份 contract。

当前执行链为：

```txt
Theme Preset / custom brand seed
              -> v5 适配器只写 --fds-g-color-seed-brand
              -> Foundation CSS 派生 Base/Dark 色阶
              -> Global Semantic 自动消费色阶
              -> resolver 为五类实心角色整组三态选择白色或近黑色前景
              -> 同版本 CSS / contract JSON / shadcn light+dark registry
              -> React / 未来框架适配器渲染
```

- Foundation 仍只允许 Foundation 维护者修改；主题生成不会写回或扩张物理刻度。
- light/dark 与 7 个预设、7 个极端自定义 seed 样本必须通过 `docs/data/theme-audit.manifest.json` 的真实 Chromium 审计，才可进入 `publishedModes`。
- 主色预设必须引用已存在的 Foundation seed；自定义色仅允许规范化的 6 位 Hex 输入。
- v5 保留用户输入的品牌 seed；实心交互统一由 Semantic 映射 Base 90/80/100，禁用态映射 Base 50，不再另造一套 Solid 色阶。Resolver 对 Primary、Destructive、Success、Warning、Info 的 Default/Hover/Active 整组判断：白色全部达到 `2.0:1` 才整组用白色，否则整组用近黑色；该保护线不替代正文 `4.5:1` 和非文字 `3:1`。16 个固定基础色相保留独立 Dark 12 阶。
- 字体、密度、圆角、阴影和动效均已改为 Foundation 引用；框架运行时不再保存这些物理值副本。
- 排版、控件、面板、导航和主题动效共有 41 个 profile 输出登记为 `internal` Global Semantic；Preset 把它们映射到 Foundation 引用，消费者只读 Semantic 名称。
- 任何框架不得复制预设表或重写色阶公式。算法版本变化必须同步 contract、审计和发布版本。

`npm run fx -- theme build` 重建整条派生链；`npm run fx -- theme release --json` 只在审计全绿后输出 `registry/fx-theme.release.json`。Release manifest 绑定同版本 CSS、contract JSON、shadcn registry、审计证据和 portable core 的 SHA-256，供接入方核对是否来自同一次发布。

这条链路在全局语义层后分成两个消费方向，不是四层 Token：

```txt
Foundation 物理值 -> Global Semantic 全局语义
                              |-> Page Type Semantics 页面类型角色 -> Block / 页面装配
                              `-> Component Usage 组件使用规则 -> 框架适配器
```

- Foundation 维护者负责无语义物理值。
- 协作者不改 Foundation，但可建设全局语义、页面类型角色、布局、交互和数据契约。
- 组件使用规则只记录现有 API / 状态如何消费语义槽，不批量创建组件专属 Token。

### 无语义基础层合同

无语义基础层只记录可测量的原始事实，不表达“主要、危险、Dashboard、Report、按钮”等用途。它是所有页面类型、产品运行时和框架适配器共同依赖的底座，但不是调用层 API。

| 类别 | 命名 | 当前范围 |
|------|------|----------|
| 色彩 | `--fds-g-color-{family}-{base|dark}-{range}` | 16 个有色色系各含 Base/Dark 12 阶，另含动态品牌色阶和中性灰 20 阶 |
| 间距 | `--fds-g-spacing-{value}` | 0–96px；4px 主网格，2/6/10px 仅供受治理的紧凑间距映射 |
| 尺寸 | `--fds-g-sizing-{value}` | 12–64px；包含主题密度使用的 22/26/30/34px 控件补档 |
| 排版 | `--fds-g-font-{property}-{value}` | 4 套受治理字族、字号 12–44、行高 18–52、字重 400–700 |
| 形状与描边 | `--fds-g-radius-*` / `--fds-g-border-width-*` / `--fds-g-icon-stroke-*` | 圆角 Seed 8px，生成 Map 0/2/4/6/8/12/16，固定 Primitive full；边框 0/1/2，图标线宽 1.5/1.75/2 |
| 效果 | `--fds-g-opacity-*` / `--fds-g-blur-*` | 透明度 0–100%（含阴影强度补档），模糊 0–40px |
| 动效 | `--fds-g-motion-duration-*` / `--fds-g-motion-easing-*` | 0–1000ms，linear/in/out/in-out 数学曲线 |
| 层级 | `--fds-g-z-index-*` | 0/10/20/30/40/50 数值档 |

治理边界：

- Primitive 物理值 SSOT 是 `tokens/source/primitive.tokens.json`，Map 算法 SSOT 是 `tokens/source/map.tokens.json`，Semantic SSOT 是 `tokens/source/semantic.tokens.json`，准入式组件公开面 SSOT 是 `tokens/source/component.tokens.json`；三个 `theme/fds-*.css` 运行时文件只能由生成器输出，`theme/fx-theme.css` 只负责统一导入和 Tailwind/shadcn 装配。
- 仅基础规范维护者可以新增或修改；协作者和 AI 只能读取。
- 页面、组件调用处和产品运行时不得直接选择基础值，只能消费语义角色或现有组件 API。
- `primary`、`danger`、`dashboard`、`report`、`workbench`、`button`、`control` 等用途词不得进入基础 Token 名称。
- 基础层不纳入断点、栅格、页面模板、组件状态、数据协议和运行时布局引擎；这些能力依赖具体技术架构。
- “大而全”指常用视觉物理维度覆盖完整，不表示为每个整数建立 Token，也不允许上传任意值扩张刻度。
- 接入方通过受治理 Theme Provider 写入 `--fds-g-color-seed-brand` 只是在运行时输入主题色，不会获得修改、上传或扩张 Foundation 刻度的权限；`--fx-brand` 只保留兼容读取。

### 1. Primitive Token

公司原始视觉值，只在 token 真相源里出现。

| 名称 | 值 | 说明 |
|------|-----|------|
| `--fds-g-color-brand-identity` | `--fds-g-color-brand-base-90` | 品牌识别色；用于 Logo、品牌文字和导航当前项 |
| `fx-primary` | `--fx-brand-09` | 品牌实心操作默认态；hover/active 分别为 08/10 |
| `fx-success` | `--fx-green-09` | 成功实心操作默认态；hover/active 分别为 08/10 |
| `fx-info` | `--fx-blue-09` | 信息实心操作默认态；hover/active 分别为 08/10 |
| `fx-warning` | `--fx-amber-09` | 警告实心操作默认态；hover/active 分别为 08/10 |
| `fx-danger` | `--fx-red-09` | 危险实心操作默认态；hover/active 分别为 08/10 |

## 专题文档

Token 数值和结构事实仍来自四层 JSON 真相源；下列 Markdown 只按人的查询任务拆分说明和使用约束。

| 专题 | Markdown | 真相源 |
|------|----------|----------|
| 颜色 | [foundations/colors.md](foundations/colors.md) | Primitive / Map / Semantic color |
| 排版 | [foundations/typography.md](foundations/typography.md) | Primitive typography + Semantic roles |
| 圆角 | [foundations/radius.md](foundations/radius.md) | Primitive radius Seed + Map |
| 间距与尺寸 | [foundations/spacing.md](foundations/spacing.md) | Primitive spacing / sizing |
| 阴影 | [foundations/shadow.md](foundations/shadow.md) | Foundation effect + Semantic elevation |
| 动效 | [foundations/motion.md](foundations/motion.md) | Primitive duration / easing |
| 层级 | [foundations/layer.md](foundations/layer.md) | Primitive z-index |
| 图标 | [foundations/icons.md](foundations/icons.md) | Primitive icon stroke + icons manifest |
| 栅格 | [foundations/grid.md](foundations/grid.md) | 布局规范 |
| 布局 | [foundations/layout.md](foundations/layout.md) | 布局规范 |

## 文件分工

| 文件 | 角色 |
|------|------|
| `tokens/source/{primitive,map,semantic,component}.tokens.json` | 四层 Token 真相源 |
| `theme/fx-theme.css` | 唯一公开装配入口 |
| `registry/fx-theme.css` / `registry/fx-theme.contract.json` | 跨框架发布产物 |
| `docs/TOKENS.md` | Token 架构、治理边界与专题索引 |
| `docs/foundations/*.md` | 按颜色、排版、圆角等任务拆分的人读规范 |
