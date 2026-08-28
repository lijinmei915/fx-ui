---
layer: knowledge
type: log
last_verified: 2026-08-28
teaches: "fx-ui 高价值结构改动的记录：改了什么、为什么改、影响到哪里"
use_when: "需要回溯某次跨层改动的原因和影响范围时"
---

# 代码变更日志

> 只记录高价值结构改动，用于回溯"改了什么 / 为什么改 / 影响到哪里"。
> 不记录零碎样式微调；逐行 diff 看 git log，这里记的是结构性的"为什么"。

维护规则：
- 只记录跨层改动（影响数据流向、目录结构、组件分层边界的改动）
- 每条固定写"改动 / 影响 / 相关文件"
- 无结构影响的小修不记录
- 一次连续任务合并成一条

## 2026-08-28 — Brand Base 复用通用色阶公式

- **改动**：Brand Base 改为直接从 Brand Seed 复用 `palette.steps` 生成，删除品牌专属第二套色阶公式；`brand-vivid` 仅保留为中性轴和暗色表面等算法锚点。
- **影响**：相同 Seed 的 Brand Base 与固定色相 Base 现在逐阶一致；后续 Base 公式只需维护一处，页面预览与 Foundation Map 不再漂移。
- **相关文件**：`tokens/source/map.tokens.json`、`scripts/build-fds-foundation.mjs`、`docs/foundations/colors.md`、`docs/TOKEN_NAMING.md`、`docs/DECISIONS.md`

## 2026-08-28 — 五类实心角色使用整组三态前景解析

- **改动**：新增 Primary、Destructive、Success、Warning、Info 五个公开 Semantic 前景 Hook。Theme v5 对每个角色的 Default/Hover/Active 整组计算：优先白色，三态对白色均达到 FDS `2.0:1` 保护线时整组使用白色，否则整组回退近黑色；旧 `text-on-vivid` 降为内部弃用兼容。
- **影响**：组件与网页只消费角色化 Semantic，不直接读取 Foundation 色板；hover/active 不会单独切换字色。正常文字 `4.5:1` 和非文字 `3:1` 门槛保持不变。Theme audit 覆盖 7 个预设、7 个自定义 Seed、light/dark 共 28 个样本。
- **相关文件**：`tokens/source/{semantic,component}.tokens.json`、`docs/data/{theme-presets,theme-audit,token-naming}.manifest.json`、`src/lib/{theme-derivation,theme-runtime}.ts`、`scripts/{build-theme-audit,check-theme-presets}.mjs`、`src/pages/docs/tokens/tokens-colors-page.tsx`

## 2026-08-28 — 实心交互恢复 Base 90/80/100 唯一阶梯

- **改动**：删除 Foundation Map 中重复的 `solid-50/60/70` 色阶；主色与四类功能色的 Semantic 默认、hover、active、disabled 统一映射 Base `90/80/100/50`。前景对比度改由独立 `text-on-vivid` Semantic 承担，不再通过压暗背景色规避。
- **影响**：修复 Map 与 Semantic 双重派生导致的按钮颜色漂移；Theme 算法升为 v4，网页示例、命名合同、文档和发布派生物回到同一交互规则。Button 源码和 API 不变。
- **相关文件**：`tokens/source/{map,semantic,component}.tokens.json`、`docs/data/{theme-presets,token-naming}.manifest.json`、`scripts/{build-fds-foundation,check-theme-presets}.mjs`、`src/pages/docs/tokens/tokens-colors-page.tsx`、`docs/{TOKENS,TOKEN_NAMING,DECISIONS,LESSONS}.md`

## 2026-08-28 — 品牌识别色与颜色文档预览对齐

- **改动**：新增内部 Semantic `--fds-g-color-brand-identity`，让文档站 Logo 与导航当前项使用品牌展示色，不再误用白字实心操作色；主题 Seed 试算器默认显示真实 HEX，支持 3/4/6/8 位十六进制输入及颜色选择；语义色表统一从真实 Semantic Token 渲染值与示例。
- **影响**：Foundation Seed、Map 算法、实心操作色和组件 API 均未改变；颜色页中同一行的值、示例与实际运行时映射保持一致。
- **相关文件**：`tokens/source/semantic.tokens.json`、`src/app/{site-navigation,docs-sidebar}.tsx`、`src/pages/docs/tokens/{color-seed-preview,tokens-colors-page}.tsx`、`docs/{TOKENS,DECISIONS}.md`

## 2026-08-28 — 完整站与 Foundation 分享站双构建

- **改动**：新增 `foundation` 发布配置，以构建期页面、导航、Markdown 和数据投影白名单生成 `dist-foundation/`；完整站继续使用默认构建输出 `dist/`。Foundation 概览隐藏组件 Hook 命名与准入名单，非白名单 hash 自动回到 Token 概览。
- **影响**：Foundation 分享站包含 11 个基础页面和 11 份同源 Markdown；图标基础页从 Foundation manifest 派生尺寸与线宽，原组件 Playground 仍只存在于完整站。发布物不复制 Token/文档正文，并自动阻止组件文档、Playground、搭建器、页面模板、报告、治理数据和 source map 进入。托管平台仍待公司环境确定。
- **相关文件**：`docs/data/publication-profiles.manifest.json`、`src/publications/foundation/`、`vite.config.ts`、`scripts/check-publication-profiles.mjs`、`playwright.foundation.config.ts`、`docs/{MAP,RUNBOOK,TECH_STACK,DECISIONS}.md`

## 2026-08-28 — 16 色相 Dark Map 与暗色语义消费

- **改动**：为 16 个固定有色色相新增独立 Dark 10–120 Map；90 保持 Seed，低阶从 `L=0.18` 暗色锚点渐进，高阶向高亮展开。主色以外的软底状态、链接、高亮和状态禁用暗色映射改为消费 Dark Map；动态 Brand 继续走主题公式。颜色网页改为真实 Base/Dark Token 切换，Theme audit 新增 Dark Map 单调性、Seed 保真和相邻 ΔE 浏览器门。
- **影响**：Foundation 由 143 Primitive + 248 Map / 391 项扩为 143 Primitive + 440 Map / 583 项，命名合同升为 `1.0.0-draft.12`，Semantic dark override 增至 59，Theme 算法升为 v3 并以 `v1.10.0` 发布。浅色 Base 色板、公开 Hook 名称、shadcn 组件 API 均不变。
- **相关文件**：`tokens/source/{map,semantic}.tokens.json`、`scripts/{build-fds-foundation,build-theme-audit,check-token-naming}.mjs`、`docs/data/{token-naming,theme-presets}.manifest.json`、`src/pages/docs/tokens/{color-palette-with-tabs,color-seed-preview}.tsx`、`docs/{TOKENS,TOKEN_NAMING,DECISIONS}.md`

## 2026-08-28 — 间距刻度移除无消费者奇数档

- **改动**：从 Primitive 移除 `spacing-1/3/5/7/9/11`，compact 密度的横向内距与 gap 收敛到 `6/8/10px` 和 `2/4px`，spacious tight gap 收敛到 `6px`；网页与 Foundation 专题同步只展示保留档位。
- **影响**：Foundation 由 149 Primitive + 248 Map / 397 项收敛为 143 Primitive + 248 Map / 391 项，合同升为 `1.0.0-draft.3`；Theme Preset 以 `v1.9.1` 发布。公开 Styling Hook、组件 API 和 standard 默认主题不变，compact/spacious 的少数间距改为相邻偶数档。
- **相关文件**：`tokens/source/primitive.tokens.json`、`docs/data/theme-presets.manifest.json`、`docs/foundations/spacing.md`、`src/pages/docs/tokens/tokens-spacing-page.tsx`、`docs/{TOKENS,DECISIONS}.md`

## 2026-08-28 — 圆角成为首个非颜色 Seed/Map 样板

- **改动**：新增内部 8px 圆角 Seed，由构建器按 0 / 1/4 / 1/2 / 3/4 / 1 / 3/2 / 2 的受控比例生成 0/2/4/6/8/12/16px Dimension Map；`full` 保持 9999px 固定 Primitive。portable contract 同步记录 Seed、公式和比例。
- **影响**：Foundation 变为 149 Primitive + 248 Map，共 397 项；全部既有圆角变量名、最终数值、组件 API 与视觉保持不变。主题合同升为 v1.9.0，下一步只评估间距是否适合相同模式。
- **相关文件**：`tokens/source/{primitive,map}.tokens.json`、`scripts/{build-fds-foundation,check-foundation-tokens,check-token-naming}.mjs`、`docs/{TOKEN_NAMING,TOKENS,DECISIONS}.md`、`docs/data/fds-foundation.manifest.json`

## 2026-08-27 — 红色色阶回归统一 Map 算法并发布 v1.8.1

- **改动**：移除 `red.base.90` 的单点人工覆盖，90 档重新直接引用 `color.seed.red`，与其余彩色色阶统一遵循“90 = Seed”的生成规则。
- **影响**：`--fds-g-color-red-base-90` 从 `#F04446` 调整为 Seed 值 `#EF4444`；Theme 发布升为 `v1.8.1`。危险操作的独立 solid 色阶、组件 API 和 Token 命名均未改变。
- **相关文件**：`tokens/source/map.tokens.json`、`docs/data/theme-presets.manifest.json`、`docs/TOKENS.md`、`theme/foundation.css`、`registry/fx-theme.{css,contract,release}.json`

## 2026-08-27 — Foundation 可视化与追溯第一阶段

- **改动**：Token 概览沿用现有设计分类导航，新增 Seed / Primitive / Map 层级筛选、全量搜索、只读详情和 Semantic 反向引用；展示数据与引用关系全部从 Foundation/Semantic 生成合同派生。
- **影响**：协作者无需阅读 JSON 即可核对 396 个无语义 Token 的值、真相源、权限和使用关系，同时不新增 Token 真相源、不开放 Foundation 写权限，也不改变任何 Token 值或组件 API。
- **相关文件**：`src/pages/docs/tokens/{tokens-page,tokens-page-adapter}.tsx`、`docs/{DECISIONS,PROJECT}.md`

## 2026-08-27 — 阴影系统 Hooks 稳定发布 v1.8.0

- **改动**：Theme audit 新增 `none/low/medium/high` 四档阴影 profile 审计，在 28 个主题样本上验证三种 shadow color 的 alpha 顺序与强度递增、L1/L2/L3 几何范围递增、L1-up 镜像方向、真实组件消费和视觉基线；三种 shadow color 与 elevation 1/2/3 共 6 个 Hook 晋级 stable。
- **影响**：Semantic/命名合同分别升为 `1.0.0-draft.5` / `1.0.0-draft.10`，主题发布升为 `v1.8.0`，公共合同现为 59 stable + 51 experimental。L1-up 因没有真实消费者与视觉证据继续 experimental；没有修改阴影值、组件源码、React API 或视觉基线。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/{theme-presets,theme-audit,token-naming}.manifest.json`、`scripts/{build-theme-audit,check-theme-presets}.mjs`、`registry/fx-theme.{contract,release}.json`、`docs/{TOKEN_NAMING,TOKENS,DECISIONS}.md`

## 2026-08-27 — Disabled 联合证据与 Hooks 稳定发布 v1.7.0

- **改动**：Theme audit 为 8 个 disabled Global Hook 增加 enabled/disabled OKLab 差异、相邻背景可见度、真实组件行为断言和 runtime 消费四类联合证据；`text-disabled`、`action-destructive-disabled`、`status-info-disabled` 通过全部 28 个样本及行为/消费门后晋级 stable。
- **影响**：Semantic/命名合同分别升为 `1.0.0-draft.4` / `1.0.0-draft.9`，主题发布升为 `v1.7.0`，公共合同现为 53 stable + 57 experimental。其余 disabled Hook 因视觉样本不足或缺少消费/行为证据继续 experimental；没有修改 Token 值、React API、组件源码或视觉基线。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/{theme-presets,theme-audit,token-naming}.manifest.json`、`scripts/{build-theme-audit,check-theme-presets}.mjs`、`registry/fx-theme.{contract,release}.json`、`docs/{TOKEN_NAMING,DECISIONS}.md`

## 2026-08-27 — FDS 命名子语法机器化

- **改动**：将 Primitive/Map/Semantic/Component 的 8 类命名模板升级为字段级机器合同，登记字段顺序、必填/可选、词典来源与末位约束；补齐 Map 的 `base` / `solid` scale 和受控 anchor，并让命名检查对全部四层 Token 执行唯一语法匹配。
- **影响**：命名合同升为 `1.0.0-draft.7`；公开 Hook 仍为 110 项，稳定性和默认值不变。复合 `z-index` category、Map anchor、state 末位和 Component canonical ID 现在都有可执行约束，不再只靠 Markdown 解释。
- **相关文件**：`docs/data/token-naming.manifest.json`、`scripts/check-token-naming.mjs`、`docs/{TOKEN_NAMING,DECISIONS}.md`、`PROJECT.md`

## 2026-08-27 — Global stable 实际合格清单与非文字候选审计

- **改动**：Theme audit 新增逐样本派生的 `stableEligibleHooks` 与非文字候选结果；Global stable 检查改为读取实际合格清单。首组审计 strong/interactive border 与 focus ring 在相邻表面上合成后的 3:1 对比度。
- **影响**：现有 34 个 stable Global Hook 继续有完整证据；三个候选均未覆盖全部 28 个样本，保持 experimental。候选失败不会误伤已有主题发布，也不能被总体 ready 状态掩盖；没有修改 Token 值、组件或视觉基线。
- **相关文件**：`docs/data/{theme-presets,theme-audit}.manifest.json`、`scripts/{build-theme-audit,check-theme-presets,check-token-naming}.mjs`、`docs/{TOKEN_NAMING,DECISIONS}.md`

## 2026-08-27 — 次级文字与图标 Hooks 稳定发布 v1.6.0

- **改动**：Theme audit 增加强制非文字对和完整文字状态组候选；`text-secondary`、`icon-muted`、`icon-inverse` 通过全部 28 个样本后晋级 stable，Semantic/命名合同分别升为 `1.0.0-draft.3` / `1.0.0-draft.8`，主题发布升为 `v1.6.0`。
- **影响**：公共合同现为 50 stable + 60 experimental。`icon-primary` 因暗色失败、链接组因浅色 default/hover 不足继续 experimental；Token 值、React API、组件源码和视觉不变。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/{theme-presets,theme-audit,token-naming}.manifest.json`、`scripts/{build-theme-audit,check-theme-presets}.mjs`、`registry/fx-theme.{contract,release}.json`

## 2026-08-27 — 首批 Global Hooks 稳定发布 v1.5.0

- **改动**：Theme Preset 的 13 组对比度与 8 组交互态质量门从 `--fx-*` / shadcn 兼容槽切到 public-global FDS 主名称；新增 Global stable 机器门。34 个表面/文字、核心操作、成功/警告/信息状态与导航表面 Hook 通过直接浏览器审计后晋级 stable，命名合同升为 `1.0.0-draft.6`，主题发布升为 `v1.5.0`。
- **影响**：公共 110 项现为 47 stable + 63 experimental，整体仍为 experimental。禁用态、边框、焦点环、阴影和数据分类色没有足够分组证据，继续保持 experimental。Token 值、React API 和组件视觉不变。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/{theme-presets,token-naming,theme-audit,fds-semantic}.manifest.json`、`scripts/{check-theme-presets,check-token-naming}.mjs`、`registry/fx-theme.{contract,release}.json`、`docs/{TOKEN_NAMING,TOKENS,DECISIONS}.md`

## 2026-08-27 — FDS Styling Hooks 公共发布合同与 v1.4.0

- **改动**：从 Semantic/Component 真相合同生成 `1.0.0-draft.5` 公共 Styling Hooks 投影，Theme contract 与 framework core 同时发布 97 个 Global Hook、13 个 Component Hook；release 构建新增逐字段一致性门，并明确主题产物 stable 与 Hook 合同 experimental 是两条独立状态轴。Button/Input/Table 的 13 个 Hook 通过五项稳定门后随主题 `v1.4.0` 晋级 stable。
- **影响**：React 和未来框架不再从内部四层合同自行猜测可覆盖 Token；Primitive、Map、internal Semantic 和兼容别名不会进入公开清单。React 映射显式绑定首批 13 个 stable Component Hook，构建验证归属、清单与真实源码消费；Vue 2 planned 保持零绑定。97 个 Global Hook 继续保持 experimental，React 组件 API、Token 默认值和视觉均未变化。
- **相关文件**：`docs/data/token-naming.manifest.json`、`scripts/lib/fds-public-hooks.mjs`、`scripts/{build-theme-artifacts,build-framework-core,build-theme-release,check-token-naming}.mjs`、`registry/fx-theme.{contract,release}.json`、`docs/{TOKEN_NAMING,TOKENS,FRAMEWORK_ADAPTERS,MAP,DECISIONS}.md`

## 2026-08-27 — FDS 主名称阶段正式启用

- **改动**：公开装配入口最后 24 处旧 Token 消费迁到等值 FDS Semantic；迁移阶段由 `dual-write` 切换为 `fds-primary`，生成器统一从命名合同读取阶段。`design-tokens.json` 的 Primitive 主字段同步改为 FDS 名称，旧名仅保留为 `legacyName` 对照。
- **影响**：runtime source 与 `theme/fx-theme.css` 的 `--fx-*` 消费均归零，当前阶段审计全部通过；473 个权威 replacement 与生成/发布兼容 alias 继续保留，`legacy-removal` 被 v2.0.0 版本门和旧消费者归零门明确阻止。React API、Token 计算值与组件视觉不变。
- **相关文件**：`theme/fx-theme.css`、`docs/data/{token-naming,fds-migration-audit}.manifest.json`、`docs/data/{design-tokens,framework-core.manifest}.json`、`scripts/{build-fds-foundation,build-design-tokens,build-fds-migration-audit,check-token-naming,check-foundation-tokens}.mjs`、`docs/{TOKEN_NAMING,TOKENS,ARCHITECTURE,FRAMEWORK_ADAPTERS,DECISIONS}.md`

## 2026-08-27 — FDS internal Semantic profile 收口

- **改动**：将排版缩放、控件尺寸/间距、面板间距、导航尺寸和主题动效建模为 41 个 `internal` Global Semantic Token；Theme Preset 改为 `Semantic 输出 -> Foundation 引用`，React 运行时与消费者改用 FDS 名称。命名合同新增 profile 子语法并联查输出必须属于 internal Semantic。
- **影响**：Semantic 总数从 100 增到 141，兼容别名从 116 增到 157；runtime 旧前缀从 37 个文件/365 处降到 6 个文件/41 处，未映射 fixed reference 归零。组件 API、默认值和兼容别名保持不变。
- **相关文件**：`tokens/source/semantic.tokens.json`、`docs/data/{theme-presets,token-naming,fds-semantic,fds-migration-audit}.manifest.json`、`src/lib/theme-runtime.ts`、`theme/fx-theme.css`、`docs/{TOKEN_NAMING,TOKENS,DECISIONS}.md`

## 2026-08-27 — Avatar 分类色静态 FDS Map 查表

- **改动**：完成 Avatar owner 的 Token 分层评审，将彩色 fallback 从动态旧前缀改为六项受治理的 FDS Map 静态查表，反白前景改用 Global Semantic；没有新增公开 Avatar Hook。
- **影响**：消除 runtime source 最后一处动态旧 Token 名称；`base-80` 与旧 `08` 映射相同，因此 hash 顺序、组件 API 和视觉值不变。命名检查会阻止动态 Token 名称回流。
- **相关文件**：`src/components/ui/avatar.tsx`、`docs/components/avatar.md`、`docs/data/{components,token-naming,fds-migration-audit}.manifest.json`、`scripts/check-token-naming.mjs`、`docs/DECISIONS.md`

## 2026-08-27 — Runtime source 旧前缀归零

- **改动**：将 DocsSidebar、ComponentPlayground、DropdownMenu、Table、Tag 剩余 39 处旧 Token 引用迁到 FDS 主名称；新增两个等值 internal Semantic 承接低强调表面/文字，Tag 分类色改为静态 Map 映射。
- **影响**：Global Semantic 增至 143 个，兼容 alias 保持 157 个；runtime source 从 5 个文件/39 处降为 0。未新增公开 Hook或组件 API，视觉值保持不变。
- **相关文件**：`tokens/source/semantic.tokens.json`、`src/{app/docs-sidebar,components/fx/component-playground,components/ui/{dropdown-menu,table,tag}}.tsx`、`docs/data/{components,fds-migration-audit}.manifest.json`、`docs/DECISIONS.md`

## 2026-08-27 — FDS 未映射旧变量分类与首个领域迁移

- **改动**：为未映射和动态 `--fx-*` 增加四类机器化 disposition，并把完整分类作为 `fds-primary` 前置门；Token 颜色、Seed、Map、间距、层级、阴影和动效文档统一展示 FDS Foundation/Semantic 名称，`time-picker` 的非 Token 日历高度改为组件局部变量。
- **影响**：runtime 旧前缀从 44 个文件、547 处降到 37 个文件、365 处，动态拼接从 9 处降到 1 处；28/28 个未映射或动态 action item 都有受治理去向。剩余 profile 度量必须先建立 internal Global Semantic，Avatar 动态色必须先过组件准入，不能批量改名。
- **相关文件**：`docs/data/{token-naming,fds-migration-audit}.manifest.json`、`scripts/{build-fds-migration-audit,check-token-naming}.mjs`、`src/pages/docs/tokens/{color-seed-preview,color-palette-with-tabs,tokens-colors-page,tokens-motion-page}.tsx`、`src/components/fx/time-picker.tsx`、`docs/{TOKEN_NAMING,DECISIONS}.md`

## 2026-08-27 — FDS 前缀迁移就绪审计

- **改动**：新增可生成、可校验的 `fds-migration-audit`，从四层合同和真实消费者派生 432 条 legacy-to-FDS replacement，并按 runtime、公开装配、生成兼容层、发布物、文档、脚本和 Token source 分域统计旧前缀；同步固定 v1.3.0 到 v2.0.0 的最短兼容窗口。
- **影响**：当前 `dual-write` 已有机器证据证明合规，但 `fds-primary` 会被 44 个 runtime 文件中的 547 处旧引用及公开装配阻塞项拦住。后续只能按审计清单逐域迁移，不能手工切 phase 或全仓盲替换。
- **相关文件**：`docs/data/{token-naming,fds-migration-audit}.manifest.json`、`scripts/build-fds-migration-audit.mjs`、`docs/{TOKEN_NAMING,DECISIONS,MAP,DOCUMENTATION,TESTING}.md`、`package.json`、`scripts/check-all.sh`

---

## 2026-08-27 — FDS 首批 Component Styling Hooks 与 v1.3.0

- **改动**：为 Button、Input、Table 建立准入式 Component Token source、生成 runtime 和 portable contract，共开放 13 个 `--fds-c-*` experimental Hook；同步修正命名示例，使 Button 默认变体和 Table density 与真实 API 一致。
- **影响**：主题与跨框架发布物升级到 v1.3.0；三个 React 组件开始消费公开 Hook，但 API 与默认计算值不变。其余组件仍直接消费 Global Semantic，不批量生成组件变量。
- **相关文件**：`tokens/source/component.tokens.json`、`theme/fds-components.css`、`docs/data/fds-components.manifest.json`、`src/components/ui/{button,input,table}.tsx`、`docs/{TOKEN_NAMING,TOKENS,DECISIONS}.md`

---

## 2026-08-27 — FDS Global Semantic 进入 dual-write

- **改动**：新增 `tokens/source/semantic.tokens.json`、Semantic 生成器与 portable contract，生成 100 个 `--fds-g-*` Global Semantic、37 个 dark 覆盖和 116 个 `--fx-*` / shadcn 兼容别名；Foundation 同步改为 FDS 真相 + legacy 引用别名，迁移阶段从 `contract-only` 升为 `dual-write`。
- **影响**：主题运行时只写 FDS brand Seed，旧前缀不再是第二写入口；迁移前后 116 个兼容变量在 light/dark 的浏览器渲染值逐项一致。新增公开 Global Hooks 按 SemVer 以 v1.2.0 发布；React 组件 API 未改变，Component Hooks 尚未开放。
- **相关文件**：`tokens/source/semantic.tokens.json`、`theme/{foundation,fds-semantic,fx-theme}.css`、`scripts/build-fds-{foundation,semantic}.mjs`、`docs/data/fds-semantic.manifest.json`、`src/lib/theme-derivation.ts`、`docs/{TOKEN_NAMING,TOKENS,DECISIONS,MAP}.md`

## 2026-08-27 — FDS 四层 Token 命名合同第一阶段

- **改动**：设计系统确定为 FDS，建立 `Primitive / Seed -> Map -> Semantic -> Component` 目标架构和 SLDS 2 Styling Hooks 风格的 `--fds-g-*` / `--fds-c-*` 命名合同。新增独立文字规范、机器词典与可执行检查，固定层级引用、受控词、组件准入、公开性、稳定性和 `contract-only -> dual-write -> fds-primary -> legacy-removal` 迁移阶段。
- **影响**：当前只冻结合同，不修改 React API、组件源码、运行时变量或视觉；`--fx-*` 仍是现行实现。DEC-079 取代旧的“无组件 Token 命名空间”结论，但保留禁止批量造 Component Token 和调用处覆盖的规则。
- **相关文件**：`docs/{TOKEN_NAMING,TOKENS,DECISIONS,MAP,DOCUMENTATION,ARCHITECTURE,FRAMEWORK_ADAPTERS}.md`、`docs/data/{token-naming,doc-structure}.manifest.json`、`scripts/check-token-naming.mjs`、`AGENTS.md`

## 2026-08-27 — FDS Primitive/Map 结构化真相源

- **改动**：将 Foundation 迁到 `tokens/source/primitive.tokens.json` 的 155 个 DTCG Primitive 与 `tokens/source/map.tokens.json` 的生成式 Map 合同；生成器展开 241 个 Map，输出 396 个 legacy runtime 变量和 FDS portable contract。彩色保留 12 阶、中性保留 20 阶，功能语义不提前进入无语义 Map family。
- **影响**：`theme/foundation.css` 改为禁止手改的生成产物；生成前后 396 个变量名和值逐项差异为 0。portable core 和 release manifest 已绑定命名、Primitive、Map 与 Foundation contract；React API 和视觉不变，完整视觉回归 198 passed / 1 skipped。
- **相关文件**：`tokens/source/{primitive,map}.tokens.json`、`scripts/build-fds-foundation.mjs`、`theme/foundation.css`、`docs/data/{fds-foundation,framework-core}.manifest.json`、`registry/fx-theme.release.json`、`docs/{TOKENS,DECISIONS,MAP}.md`

## 2026-08-27 — 受治理的跨框架主题生成与 v1.1.0 发布

- **改动**：建立 Theme Preset/Seed SSOT 与算法 v2，把字体、密度、圆角、阴影、动效全部迁到 Foundation 引用；品牌展示色与固定白字的实心操作色分离，修复 `slate` 预设对 Neutrals 的循环引用。统一生成 CSS、contract JSON 和 shadcn light/dark registry，并新增 Chromium 对比度/状态审计与哈希 release manifest。
- **影响**：7 个受治理预设和 7 个极端自定义 seed 样本在 light/dark 下的语义文字对均达到 4.5:1，交互态可辨识且无失效变量；light/dark 从文档站预览升级为 v1.1.0 stable 发布。React 继续是 ready 参考适配器，Vue 2 仍仅 planned；框架适配器不复制算法或物理值。
- **相关文件**：`theme/{foundation,fx-theme}.css`、`docs/data/{theme-presets,theme-audit,framework-core}.manifest.json`、`registry/fx-theme.{css,json}`、`registry/fx-theme.{contract,release}.json`、`scripts/{build-theme-artifacts,build-theme-audit,build-theme-release,fx-agent}.mjs`、`docs/{TOKENS,DECISIONS,FRAMEWORK_ADAPTERS}.md`

## 2026-08-27 — 无语义 Foundation Token 完整层

- **改动**：在既有完整色板之上补齐 spacing、size、排版物理刻度、radius、border width、icon stroke、opacity、blur、duration、easing 和 z-index，共形成 15 类 Foundation；随后将 353 个物理 Token 迁入专属 `theme/foundation.css`，`theme/fx-theme.css` 保留为语义映射与唯一公开入口。现有名称和值不变，历史 `orange-warning` 无损改名为无语义的 `deep-orange`。
- **影响**：`design-tokens.json#foundation` 现在机器化登记 353 个维护者专属只读 Token；协作者和 AI 只能查询，页面、Report、Dashboard、工作台不能直接引用。Token 概览、间距、动效和层级网页同步展示基础档位；新增检查阻止刻度缺失、语义命名回流和产品运行时直引。
- **相关文件**：`theme/{foundation,fx-theme}.css`、`docs/{TOKENS,DECISIONS,MAP}.md`、`docs/data/design-tokens.json`、`docs/data/{agent-tokens,framework-core}.manifest.json`、`scripts/{build-design-tokens,check-foundation-tokens}.mjs`、`scripts/check-all.sh`、`src/pages/docs/tokens/`

## 2026-08-26 — 框架无关核心与适配器边界

- **改动**：新增框架适配器状态 SSOT，从既有 Token、组件、Playground、图标、页面和 Agent UI 真相源派生 portable core contract；React 登记为唯一 ready 参考适配器，Vue 2 仅登记 planned 准入门。Input、Button、Select、Checkbox、Dialog、Table 已成为首批 `adapter-ready` 样板，完整登记 canonical 属性、事件、组合、无障碍和 React 映射。
- **影响**：跨框架消费者可以读取同一套语义与数据契约，但不会拿到 React 源码路径、包绑定或 JSX；机器检查会阻止 planned Vue 2 被误报为已支持，并要求 `adapter-ready` 同时具备 canonical contract 和 ready 参考映射，同时按显式轴映射校验 canonical variant/size/density 与组件 manifest 不漂移。Playwright 固定测试时钟，避免日期断言跨月漂移。
- **相关文件**：`docs/FRAMEWORK_ADAPTERS.md`、`docs/data/{framework-adapters,framework-core}.manifest.json`、`scripts/build-framework-core.mjs`、`tests/{component-behavior,visual}.spec.ts`、`docs/{MAP,ARCHITECTURE,TECH_STACK,DECISIONS,TESTING}.md`

## 2026-07-16 — Elevation Token 复合阴影升级

- **改动**：`shadow-l1/l2/l3/l1-up` 从单层改为两到三层复合阴影，以近层落点和远层扩散表达 elevation；主题预览强度映射、Token manifest 和阴影文档同步为同一组真实值。
- **影响**：Dropdown、Sheet、Dialog 等已有调用不需要更换 utility，即可获得更清楚但仍克制的层级；调用方仍禁止叠加多个 elevation Token。
- **相关文件**：`theme/fx-theme.css`、`src/App.tsx`、`docs/TOKENS.md`、`docs/data/design-tokens.json`、`docs/DECISIONS.md`

## 2026-07-15 — Agent 查询/受控装配 contract + Shape 语义半径

- **改动**：从现有 Token、组件和调试台 manifest 派生 Agent token/组件 contract 与快速上下文；新增统一 `npm run fx -- ...` 查询入口、doctor 诊断及页面 Build Kit。Build Kit 只开放已有 `gen:list-page` 的列表页骨架，详情页/表单页明确标记为 `needs-block`。新增 Shape 语义半径别名与同心嵌套规则，不改变组件默认外观。
- **影响**：Agent 可先查询真实 API、Token 映射与页面生成边界，再读取源码或执行脚手架；派生物、Build Kit 和 Shape 映射均接入检查。主题构建只重建既有 CSS 真相源的派生产物；当前没有可执行的历史迁移，因此 upgrade 命令只报告该状态。
- **相关文件**：`docs/data/{agent-tokens,agent-components,page-build-kit}.manifest.json`、`docs/data/agent-context.md`、`scripts/{fx-agent,doctor,build-agent-components,build-agent-context}.mjs`、`theme/fx-theme.css`、`docs/{TOKENS,PAGES,DECISIONS}.md`

## 2026-07-16 — Agent 意图查询边界固化

- **改动**：将可解释命中、组件/API 优先、调试台控制项非 API、示例只存来源指针固化到 Agent contract 和 AI 行为规则；新增 `check-agent-query-contract` 门禁。词表和排序权重保留在 CLI 内演进。
- **影响**：协作者和 Agent 获得稳定查询边界，又不会把检索实现细节误当作组件或设计规范。
- **相关文件**：`AGENTS.md`、`docs/DECISIONS.md`、`docs/data/agent-components.manifest.json`、`scripts/check-agent-query-contract.mjs`

## 2026-07-16 — Agent 接入与诊断协议

- **改动**：新增只读 `fx init --agent codex|claude|cursor` 接入片段；doctor 结果新增稳定 `FX_*` 错误码及修复命令。
- **影响**：新协作者可快速获得最小正确上下文，自动化可按诊断代码处理问题，且不会被工具覆盖既有 Agent 配置。
- **相关文件**：`scripts/{fx-agent,doctor,build-agent-context}.mjs`、`docs/{DECISIONS,CHANGELOG}.md`

## 2026-07-16 — 受控页面任务计划

- **改动**：新增 `fx plan`，由现有 Page Build Kit 为自然语言任务返回唯一的已验证页面路径、数据契约、来源指针和禁止项；未沉淀页型明确返回 blocked。
- **影响**：Agent 从“查询组件”进入“受控装配”，但不会绕过页面 Block 治理生成临时 JSX。
- **相关文件**：`scripts/fx-agent.mjs`、`docs/data/page-build-kit.manifest.json`、`scripts/check-agent-query-contract.mjs`、`docs/DECISIONS.md`

## 2026-07-16 — 变更影响与示例来源门禁

- **改动**：新增 `fx impact component|token`，沿既有 contract 输出真相源、下游引用和必跑检查；新增 Agent 示例来源验证，检查文档页文件、场景符号和锚点是否真实存在。
- **影响**：协作者在修改前能看见受治理的影响链，示例入口不再因页面重构而静默失效。
- **相关文件**：`scripts/{fx-agent,check-agent-examples,check-agent-query-contract}.mjs`、`docs/data/agent-components.manifest.json`、`AGENTS.md`

## 2026-07-16 — Theme Contract 与主题审计

- **改动**：从现有 Token contract 派生 Theme Contract，新增 `fx theme show/audit` 和 `check:theme`，明确可替换语义视觉槽与受保护结构 token；不创建新主题。
- **影响**：主题边界、交互状态完整性和当前只支持 light 的事实变为可查询、可审计契约。
- **相关文件**：`scripts/{build-agent-token-contract,check-theme-contract,fx-agent}.mjs`、`docs/data/agent-tokens.manifest.json`、`docs/{TOKENS,DECISIONS}.md`

## 2026-07-16 — Agent 场景配方 Contract

- **改动**：新增 `fx recipe` 和四条真实场景配方，记录跨组件组合、行为、验收、禁止项与证据来源；未知场景显式拒绝。新增 `check:agent-recipes` 门禁与 `FX_AGENT_RECIPE_DRIFT` 诊断码。
- **影响**：协作者可查询经过验证的业务组合，不再从单个组件 API 自由猜测场景实现。
- **相关文件**：`docs/data/agent-recipes.manifest.json`、`scripts/{fx-agent,check-agent-recipes}.mjs`、`docs/DECISIONS.md`

## 2026-06-18 — 图标库换 Tabler + 布局拆「布局/栅格」两页 + Layout 骨架组件

- **改动**：图标从 Phosphor 换成 Tabler（`src/lib/icons.ts` 重映射，线宽由全局 `.tabler-icon` 控制、面型用 `*Filled`，见 DEC-009，卸载 phosphor）；布局页拆成「布局」(#layout，页面容器+尺寸) 和「栅格」(#grid，24 列+断点) 两页，借鉴 Semi；新增 fx 骨架组件 `src/components/fx/layout.tsx`（Layout/Header/Sider/Content/Footer，见 DEC-010），栅格保持 Tailwind 工具类不封 Row/Col；按钮对齐 shadcn（字重 400、梯度字号 12/13/14/16）
- **影响**：图标线宽可调、有实心变体；布局/栅格职责分离、各有独立页；新增可复用页面骨架组件；图标/布局红线写进 `AGENTS.md`
- **相关文件**：`src/lib/icons.ts`、`src/components/fx/layout.tsx`、`src/App.tsx`、`theme/fx-theme.css`、`docs/{TOKENS,LAYOUTS,DECISIONS}.md`、`AGENTS.md`、`scripts/check-toc-anchors.mjs`

## 2026-06-18 — 自托管开源字体（Inter + Noto Sans SC）

- **改动**：字体从纯系统栈改为自托管开源 webfont（`@fontsource` 引入 Inter 管西文、Noto Sans SC 管中文，见 DEC-008）
- **影响**：中英文跨平台渲染一致、无版权困扰
- **相关文件**：`src/main.tsx`、`src/lib/utils.ts`、`theme/fx-theme.css`、`docs/{TOKENS,DECISIONS}.md`

## 2026-06-16~18 — Token 层全面精修 + 交互态收敛 + 治理门禁

- **改动**：颜色（单一中性灰 DEC-006、交互阶梯 DEC-005）、圆角（±2px 派生 + 比值带）、阴影（elevation + `--fx-shadow-color` 派生跟随色板）、间距（4px 网格）、层级、动效、排版（web 字号 + 行高随 token）逐页细化为"档位 + 计算方式 + 示例"；遮罩收成语义 token `--overlay`；组件浅色交互态从 `/透明度` 收到实心 token；新增可执行门禁 `check-interaction-tokens`、`check-shadow-tokens`、`check-toc-anchors`（接 check-all）
- **影响**：token 体系可换肤、可预测、有门禁防漂；文档站七个 token 子页结构统一、目录与内容双向关联
- **相关文件**：`theme/fx-theme.css`、`docs/TOKENS.md`、`docs/DECISIONS.md`、`docs/data/design-tokens.json`、`src/components/ui/*`、`scripts/check-*.mjs`

## 2026-06-08 — 补全全部 28 个 shadcn 基础组件的中文文档页

- **改动**：在 `src/App.tsx` 里为本地拉取的全部 28 个 shadcn 基础组件建好中文文档页（新增 Avatar、Breadcrumb、Button Group、Calendar、Collapsible、Dialog、Alert Dialog、Dropdown Menu、Popover、Select、Separator、Sheet、Sidebar、Skeleton、Spinner、Tabs、Toggle、Toggle Group、Tooltip 等，加上此前已完成的 Typography/Input/Checkbox/Switch/Textarea/Table/Card/Badge），统一走"组件总览/场景示例/使用方式/API/语义 DOM/正误示例"六段结构；为避免十几页重复模板代码，抽出 `StandardDocPage` 公共组件承载页面骨架；导航菜单同步重新分组（新增"导航"分组：面包屑/标签页/下拉菜单/侧边栏）
- **影响**：组件文档覆盖率从约一半提升到 100%，后续新拉 shadcn 组件可直接复用 `StandardDocPage` + 数据数组的模式快速补页；导航分组调整后用户能更快按场景找到组件
- **相关文件**：`src/App.tsx`（`StandardDocPage`、各组件的 `xxxAnchors`/`xxxScenarioExamples`/`xxxPropRows` 等数据数组与 `XxxPage` 组件、导航分组数据、路由判断链）

## 2026-06-07 — 组件总览改为从场景数据派生

- **改动**：`src/App.tsx` 中 `ButtonOverview`（组件总览矩阵）原本是手写的独立数据，改为直接从 `buttonScenarioExamples` 按 `group` 过滤派生，并复用 `ButtonScenarioPreview` 渲染
- **影响**：消除了"场景示例"和"组件总览"两处数据各自维护、容易漏同步的问题（曾经发生过总览少了 outline 类型、icon 区少了 ghost 图标按钮的不一致）；以后新增场景只需改一处
- **相关文件**：`src/App.tsx`（`buttonScenarioExamples`、`ButtonScenarioPreview`、`ButtonOverview`）

## 2026-06-07 — 新增 token 漂移校验脚本，治理 TOKENS.md 手抄风险

- **改动**：新增 `scripts/check-tokens-sync.sh`，自动提取 `theme/fx-theme.css` 的 `:root` 色值，逐个核对是否出现在 `docs/TOKENS.md` 中；运行时即发现 `--accent` / `--sidebar-accent`（`#F2F4FB`）漏抄，已补进 TOKENS.md 的语义 Token 表
- **影响**：`fx-theme.css` 仍是 fx-ui 范围内唯一真相源（不引入新的 `.ts` 副本，避免再叠一层转译），`docs/TOKENS.md` 改为"改完 CSS 后跑脚本校验"而不是纯靠人工记得同步；脚本只查不改，发现差异仍需手动同步表格内容
- **相关文件**：`scripts/check-tokens-sync.sh`、`docs/TOKENS.md`、`theme/fx-theme.css`

## 2026-06-07 — 文档体检：修孤岛、消重复

- **改动**：① `docs/DOCUMENTATION.md` 的"相关文件"表补上 `docs/KNOWLEDGE_SCHEMA.md`（之前全项目没有文档引用它，是个孤岛）；② `SETUP.md` 删掉过期的"当前进度"打勾清单（和 `PROJECT.md` 重复记录同一件事，且已经过期），改为指向 `PROJECT.md` 的历史记录说明
- **影响**：消除"两处记进度、必然漂移"的隐患，`PROJECT.md` confirmed 为进度唯一真相源；`KNOWLEDGE_SCHEMA.md` 现在能从 `DOCUMENTATION.md` 顺藤摸到
- **相关文件**：`docs/DOCUMENTATION.md`、`SETUP.md`、`PROJECT.md`

## 2026-06-07 — 新建文档自动登记路由表：流程规则 + 兜底脚本

- **改动**：① `docs/DOCUMENTATION.md` 加了一条强制步骤——新建 `docs/*.md` 时必须同时在 SSOT 路由表加一行（"该归到哪类问题"是语义判断，机器做不了，只能靠人/AI 当场做）；② 新增 `scripts/check-docs-routing.sh` 作为兜底，机械检查 `docs/*.md` 文件名是否都出现在路由表里，没有就报警并阻断提交，接入 `check-all.sh`
- **影响**：从"靠记性 → 事后才发现漏登记"变成"建文档时强制登记 + 提交前机械兜底"，二者互补（流程减少疏漏，脚本兜住漏网）
- **相关文件**：`docs/DOCUMENTATION.md`、`scripts/check-docs-routing.sh`、`scripts/check-all.sh`

## 2026-06-07 — 路由表覆盖范围补到根目录，修掉 CLAUDE.md 这处真空

- **改动**：① `docs/DOCUMENTATION.md` 的 SSOT 表补一行"Claude Code 专属行为规则 → CLAUDE.md"——它之前能被发现纯靠 Claude Code 工具自动读取这个文件名，但路由表里查不到"这类信息该写哪"；② `scripts/check-docs-routing.sh` 扫描范围从只查 `docs/*.md` 扩大到根目录治理文档（豁免 `DOCUMENTATION.md` 自身和已转历史记录的 `SETUP.md`）
- **影响**：路由设计不再只覆盖 `docs/` 这一个角落，根目录的治理文件也纳入同一张图，避免"靠工具约定能找到 = 不需要登记"的认知漏洞
- **相关文件**：`docs/DOCUMENTATION.md`、`scripts/check-docs-routing.sh`、`CLAUDE.md`

## 2026-06-07 — 删除 SETUP.md（不再维护就别留着占位）

- **改动**：用户看到 `PRODUCT.md` / `PROJECT.md` / `SETUP.md` 三个名字容易看混，借机判断 `SETUP.md` 既已转成"历史记录、不再维护"，干脆直接删除，而不是留着一份不会再更新的文件。同步清理 `AGENTS.md` 必读列表里对它的引用、`scripts/check-docs-routing.sh` 里对它的豁免项（文件都没了，豁免规则就是死引用）
- **影响**：减少一份"内容会过期但没人会去看"的文件；`PRODUCT.md`/`PROJECT.md` 的角色区分仍然保留在 SSOT 表里，靠职责说明区分而不是靠多一份文件做缓冲
- **相关文件**：`AGENTS.md`、`scripts/check-docs-routing.sh`

## 2026-06-07 — AGENTS.md 补上指向文档路由表的入口

- **改动**：`AGENTS.md` 之前完全没提 `docs/DOCUMENTATION.md`——而 AI 在这个项目里最常做的事之一就是"写东西"（记 CHANGELOG/DECISIONS/LESSONS、建新文档），却没有指引去查路由表，导致"新建文档必须登记路由表"这条规则即便写在 DOCUMENTATION.md 里，AI 进来也未必会主动翻到。现在在"必读文件"和"你该做的"里都补上了指向
- **影响**：补上路由设计的最后一环——"规则本身完善"和"AI 知道去哪查规则"是两件事，前者有了不代表后者也有
- **相关文件**：`AGENTS.md`、`docs/DOCUMENTATION.md`

## 2026-06-07 — 新增 HANDOFF 新鲜度提醒（弱提示，不自动生成内容）

- **改动**：新增 `scripts/check-handoff-freshness.sh`——统计自上次改动 `HANDOFF.md` 以来，又有多少次涉及 `src/`/`docs/` 的提交，超过阈值（5 次）就提醒"该写交接了"；接入 `check-all.sh` 的弱提示区
- **影响**：交接记录的"内容"仍然只能靠人/AI 当场总结（语义判断，机器编不出有价值的内容），但"该不该动笔"这个时机判断现在有机器兜底提醒了——不阻断提交，纯提示
- **相关文件**：`scripts/check-handoff-freshness.sh`、`scripts/check-all.sh`、`HANDOFF.md`

## 相关文件

| 文件 | 关系 |
|------|------|
| `HANDOFF.md` | 本轮交接涉及的变更 |
| `PROJECT.md` | 当前进度（含本条改动的来源任务） |
