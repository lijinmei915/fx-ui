---
layer: governance
type: spec
last_verified: 2026-08-28
teaches: "FDS 四层 Token 与 Styling Hooks 的命名语法、受控词典、公开边界和兼容规则"
use_when: "新增、重命名、发布或评审任何 --fds-g-* / --fds-c-* Token 时"
---

# FDS Token 命名规范

> FDS 参考 SLDS 2 Styling Hooks 的全局/组件接口思路，但不复制其产品词典。结构事实以 `docs/data/token-naming.manifest.json` 为唯一真相源；本文解释命名意图、判断顺序和评审方法。

## 定位与边界

FDS 使用四层 Token 架构：`Primitive / Seed -> Map -> Semantic -> Component`。四层是依赖与治理边界，不是要求每个 Token 机械经过全部层级。颜色通常经过四层；间距、尺寸等结构值可以从 Primitive 直接被 Component 引用。

CSS Styling Hooks 只分两类公开前缀：

| 前缀 | 含义 | 是否自动公开 |
|------|------|--------------|
| `--fds-g-*` | Global Token，可能属于 Primitive、Map 或 Semantic | 否；由 manifest 的 `visibility` 决定 |
| `--fds-c-*` | 经过准入的 Component Styling Hook | 是；发布后受 SemVer 保护 |

内部临时实现不得占用这两个前缀。Token 的层级、所有者、公开性和稳定性必须存在于机器合同，不能只从 CSS 名称猜测。

命名只描述稳定的设计意图，不描述 React、Vue、Tailwind、Radix、DOM 结构或当前色值。业务调用处仍通过组件 API 表达 variant 和状态，不靠覆盖 Hook 改变单个实例的语义。

### 命名判断顺序

不先想变量名，先回答以下问题；任一步不成立就不创建 Token。

1. 这是物理事实、生成刻度、稳定意图，还是单组件的公开换肤缺口？四者分别归 Primitive、Map、Semantic、Component。
2. 它是公开接口还是内部运行时输出？名称不能决定公开性，必须显式填 `visibility` 和 `stability`。
3. 是否已有 Global Semantic 可以表达？有则直接复用，不为组件重造同义 Hook。
4. 名称能否由本文的子语法与受控词典完整拆解？不能则先评审词典，不在 CSS 里先造词。
5. 引用是否只指向上游层，owner、文档、合同和检查是否齐全？不齐全就不进入发布链。

## 四层架构

### Primitive / Seed

保存无语义物理事实和受治理的主题输入。仅 FDS Foundation 维护者可写，协作者、产品代码和框架适配器只读。

```css
--fds-g-color-seed-brand
--fds-g-color-seed-neutral
--fds-g-spacing-8
--fds-g-sizing-32
--fds-g-font-size-14
--fds-g-font-line-height-20
--fds-g-font-weight-500
--fds-g-radius-seed-base
--fds-g-radius-full
--fds-g-border-width-1
--fds-g-icon-stroke-175
--fds-g-opacity-50
--fds-g-motion-duration-200
```

规则：

- Seed 只表达输入身份，不携带 `primary`、`button`、`dashboard` 等用途。颜色使用 family，维度 Seed 使用受控 category 与 role。
- 数值档使用稳定 range ID；当前 FDS 的 spacing、sizing、字号和行高以像素等价值作为 ID。圆角数值档已作为 Map 由 8px Seed 生成，`full` 因不可由基准值有意义地计算而保留 Primitive。
- 原始值不得包含 hover、disabled 等交互状态。

### Map

Map 是生成器根据 Seed 和算法版本派生的受控刻度，不允许手工修改生成结果。品牌、中性和功能色拥有各自 Seed；功能色不会由品牌色改色相。圆角是首个非颜色 Map 样板，由 8px Seed 在构建时生成明确的 px 值。

```css
--fds-g-color-brand-base-10
--fds-g-color-brand-base-50
--fds-g-color-brand-base-100
--fds-g-color-neutral-base-10
--fds-g-color-red-base-60
--fds-g-radius-6
--fds-g-radius-16
```

彩色色阶固定为 `10 / 20 / ... / 120`，中性色阶扩展到 `200`，数值越大视觉越深。旧 `01 / ... / 12` 与中性 `01 / ... / 20` 在迁移期分别映射到十倍 range，不允许新合同继续产生两套编号。圆角 Map 使用 `0 / 2 / 4 / 6 / 8 / 12 / 16`，由 8px Seed 乘以 `0 / 1/4 / 1/2 / 3/4 / 1 / 3/2 / 2` 得到；比例只在构建器中计算，运行时输出仍是确定的 px。

Map 名称不得出现 surface、text、border、button、hover 等使用意图。Map 只回答“它在刻度中的位置”，不回答“在哪里使用”。

### Semantic

Semantic 表达跨页面、跨组件、跨框架稳定的使用意图。它可以引用 Primitive 或 Map，不得写裸物理值。

```css
--fds-g-color-surface-default
--fds-g-color-surface-overlay
--fds-g-color-text-primary
--fds-g-color-text-secondary
--fds-g-color-border-focus
--fds-g-color-action-primary
--fds-g-color-action-primary-hover
--fds-g-shadow-overlay
```

Core Semantic 是公开的跨场景接口；Dashboard、Report、工作台等 Scenario Semantic 只在页面语义 manifest 中把区域角色映射到 Core Semantic，不创建页面专属色值。

`brand` 表示品牌色系，`primary` 表示操作优先级；`error` 表示信息状态，`destructive` 表示不可逆操作。两组词不得互换。

Theme Preset 还会产生一类 **internal Semantic profile**：它们表示“当前主题密度下的控件尺寸”等稳定运行时角色，但不是对外 Styling Hook。Preset 只把这些 Semantic 输出映射到 Foundation 引用，不形成第五层。

```css
--fds-g-font-size-control-sm
--fds-g-sizing-control-block-sm
--fds-g-spacing-panel-padding
--fds-g-sizing-navigation-topbar-block
--fds-g-motion-duration-theme
```

迁移期还允许少量经过评审的 internal Semantic 收口跨组件运行时用途。例如 `--fds-g-color-surface-subtle` 与 `--fds-g-color-text-subtle` 分别承接低强调表面和文字；它们保持既有物理结果，但阻止页面继续直引 Foundation。internal 不是逃避命名评审的临时前缀，也不会自动进入对外发布面。

这类名称使用 `category -> property -> role? -> size?`，只允许 `internal` 可见性；末尾 size 表示 profile 轴，不是交互 state。完整输出集合由 `theme-presets.manifest.json` 与 Semantic contract 联合派生，本文不复制 41 项清单。

### Component

Component Token 是经过准入、愿意长期维护的公开 Styling Hook，不是每个组件属性的自动镜像。视觉类 Hook 默认引用 Semantic；结构类 Hook可以引用 Primitive。不得引用裸值，也不得表达行为、DOM 或业务数据。

```css
--fds-c-button-color-background
--fds-c-button-color-background-hover
--fds-c-input-color-border-focus
--fds-c-table-sizing-cell-block-compact
```

只有真实的独立换肤需求、无法由 Global Semantic 准确表达、跨 variant/产品/框架复用且拥有测试证据时，才允许新增 Component Hook。组件维护者拥有提案和维护责任，没有自由造词权限。

## Global Hooks 命名

Global Token 按层级和职责使用受控子语法，不使用一条必须填满所有字段的万能模板。

```txt
Primitive color seed:
--fds-g-color-seed-{family}

Primitive dimension seed:
--fds-g-{category}-seed-{role}

Primitive scale:
--fds-g-{category}-{property?}-{range}

Color map:
--fds-g-color-{family}-{scale}-{range}

Color map anchor:
--fds-g-color-{anchor}

Dimension map:
--fds-g-{category}-{range}

Semantic:
--fds-g-{category}-{property}-{role?}-{modifier?}-{state?}

Internal semantic profile:
--fds-g-{category}-{property}-{role?}-{size?}
```

字段顺序固定：意图型使用 `prefix -> category -> property -> role -> modifier -> state`，profile 型使用 `prefix -> category -> property -> role -> size`，Primitive/Map 的 range 始终在末尾。Map 的 `scale` 只允许 `base` 与 `dark`：`base` 是浅色背景使用的通用色阶，`dark` 是固定基础色相的暗色背景色阶。实心交互由 Semantic 映射 Base 90/80/100/50，禁止另建 Solid Map。少量生成算法所需、没有连续 range 的 anchor 必须整项登记，当前只有 `brand-vivid` 与 `neutral-anchor-dark`。`modifier` 只表达同一意图的稳定形态，如 `subtle`、`raised`、`floating`；交互 `state` 始终在末尾。某类语法不需要的字段直接省略，不使用 `none`、`na` 或空占位符。

上述模板不是说明性文案。`token-naming.manifest.json#grammar.definitions` 为每种子语法登记 layer、namespace、字段顺序、必填/可选、词典来源和末位字段；`check-token-naming.mjs` 要求每个真实 Token 恰好命中一种子语法，并验证模板与字段合同一致。

Global 命名示例：

| 正确 | 层级 | 原因 |
|------|------|------|
| `--fds-g-color-seed-brand` | Primitive | 品牌主题输入 |
| `--fds-g-radius-seed-base` | Primitive | 圆角生成基准，内部治理输入 |
| `--fds-g-spacing-8` | Primitive | 8px 等价值物理档 |
| `--fds-g-color-brand-base-50` | Map | 品牌色阶中档 |
| `--fds-g-color-blue-dark-110` | Map | 蓝色暗色 profile 的高对比文字/图标候选档 |
| `--fds-g-color-brand-base-90` | Map | 品牌色基准档；Semantic 可将其映射为默认实心交互态 |
| `--fds-g-color-brand-vivid` | Map anchor | 中性轴、暗色表面等主题算法使用的受控品牌色 anchor；不参与 Brand Base 色阶生成 |
| `--fds-g-radius-6` | Map | 由圆角 Seed 生成的 6px 档 |
| `--fds-g-color-text-secondary` | Semantic | 次级文字意图 |
| `--fds-g-color-foreground-primary` | Semantic | Primary 实心状态组经主题算法生成的统一前景 |
| `--fds-g-color-action-primary-hover` | Semantic | 主操作 hover 状态 |
| `--fds-g-color-action-destructive-subtle-hover` | Semantic | 不可逆操作的浅色 hover 面 |
| `--fds-g-font-size-control-sm` | Internal Semantic profile | 当前密度下的紧凑控件字号 |
| `--fds-g-sizing-navigation-topbar-block` | Internal Semantic profile | 当前密度下的顶栏块轴尺寸 |

以下写法禁止：

| 错误 | 原因 |
|------|------|
| `--fds-g-blue-500` | 缺少 category，且沿用框架色板命名 |
| `--fds-g-color-button-orange` | Global 层混入组件和具体色相用途 |
| `--fds-g-color-primary-bg` | 使用 `bg` 缩写且 property/role 顺序不稳定 |
| `--fds-g-spacing-card-16` | Primitive 混入组件用途 |
| `--fds-g-color-brand-hover-50` | Map 混入交互状态 |

## Component Hooks 命名

组件 Hook 按视觉和结构分成两条语法：

```txt
Visual:
--fds-c-{component}-{variant?}-{category}-{property}-{state?}

Structural:
--fds-c-{component}-{category}-{property}-{size?}
```

规则：

- `component` 必须来自组件 manifest 的 canonical ID，使用单数 kebab-case。
- `variant` 必须来自组件真实公开 API；默认 variant 省略，不写 `default`。`tone`、`density` 等其他公开轴也不得冒充 variant。
- Visual Hook 的 state 永远位于末尾。
- Structural Hook 的 size 或真实 density 值永远位于末尾；取值必须存在于组件 manifest，默认值省略。
- 同一个 Hook 不同时携带 state 和 size；需要时拆成两个职责单一的 Hook。
- 禁止为 JSX prop、slot、事件、loading 业务组合或 DOM 子节点创建 Hook。

组件命名示例：

| 正确 | 说明 |
|------|------|
| `--fds-c-button-color-background` | Button 默认变体背景；默认 variant 省略 |
| `--fds-c-button-color-background-hover` | Button 默认变体 hover 背景 |
| `--fds-c-input-color-border-focus` | Input 焦点边框 |
| `--fds-c-table-sizing-cell-block-compact` | Table 的真实 compact 密度单元格块轴尺寸 |

禁止 `--fds-c-button-bg-orange`、`--fds-c-button-div-padding`、`--fds-c-react-button-*`、`--fds-c-button-on-click-*` 和 `--fds-c-button-default-*`。

## 受控词典

完整集合以 manifest 为准。新增词必须先说明现有词为何无法表达，再更新合同；不得在 CSS 中先用后补。

| 段 | 当前受控词 |
|----|------------|
| category | `color`、`spacing`、`sizing`、`font`、`radius`、`border`、`shadow`、`opacity`、`blur`、`motion`、`z-index`、`icon` |
| state | `hover`、`active`、`focus`、`focus-visible`、`disabled`、`selected`、`checked`、`invalid`、`readonly`、`expanded` |
| size / density | `xs`、`sm`、`md`、`lg`、`xl`、`compact`、`comfortable`；还必须存在于对应组件 API |
| color property | `background`、`foreground`、`text`、`icon`、`border`、`ring`、`fill`、`stroke`、`surface`、`action`、`status`、`link`、`highlight`、`navigation`、`data`、`shadow` |
| intent role | `primary`、`secondary`、`brand`、`neutral`、`destructive`、`error`、`success`、`warning`、`info`、`muted`、`inverse`、`link` |
| semantic modifier | `subtle`、`raised`、`floating`、`interactive`、`categorical` |
| semantic profile role | `control`、`panel`、`menu`、`navigation`、`theme` |
| Map scale | `base`、`dark` |
| Map anchor | `brand-vivid`、`neutral-anchor-dark`；只能整项登记，不能自由拼接 |
| visibility | `internal`、`public-global`、`public-component` |
| stability | `experimental`、`stable`、`deprecated` |

默认状态不写 `-default`；但 `default` 可以作为 `surface.default` 这类语义角色存在。禁用缩写包括 `bg`、`fg`、`txt`、`bd`、`px`、`py`、`h`、`w`。CSS 采用美式英文 `color`，不使用 `colour`。

Map family 只使用 `brand`、`neutral` 或无语义色相名，如 `orange`、`amber`、`yellow`、`lime`、`green`、`blue`、`red`。`danger`、`success`、`warning`、`info` 属于 Semantic role，不得进入 Map family。

## 公开与兼容

对内完整合同包含四层；对外只发布 `public-global` 与 `public-component`。CSS 文件即使技术上包含内部变量，也不构成公开兼容承诺，公开面以 release contract 为准。

公开清单由生成器写入 `registry/fx-theme.contract.json#stylingHooks`，并以同一结构投影到 `docs/data/framework-core.manifest.json#tokens.publicStylingHooks`。两边必须逐字段一致，`build:theme-release` 会在漂移时失败。当前 `1.0.0-draft.14` 合同发布 101 个 Global Hook 与 13 个 Component Hook，共 114 个；其中 48 个 Global 和 13 个 Component Hook 已为 `stable`，其余 53 个 Global Hook 仍为 `experimental`，所以合同整体状态仍是 `experimental`。这与主题算法和 light/dark 产物的 `stable` 发布状态相互独立。

公共合同只携带名称、类型、层级、稳定性、owner、组件归属和文档指针，默认值统一由 `registry/fx-theme.css` 提供。Primitive、Map、internal Semantic、兼容别名和组件内部变量不会进入公共 Hook 清单。只有全部已发布 Hook 完成评审且不存在 `experimental` 项时，合同才可升为 `stable`；不得因为主题 CSS 已稳定就自动提升 Hook 稳定性。

Component Hook 从 `experimental` 晋级 `stable` 时，除了原准入证据，还必须证明文档锚点、合同检查和视觉用例真实存在，并由至少一个 `ready` 参考适配器显式绑定且在对应组件源码中消费。晋级会增强兼容承诺并触发 Minor 发布；不能只修改 `stability` 字段。首批 Button/Input/Table Hook 通过该门后随主题 `v1.4.0` 发布。

Global Hook 晋级 stable 必须保持 `public-global`、具有 Semantic owner 和生成 runtime，并进入 Theme audit 派生的 `coverage.stableEligibleHooks` 实际合格清单；仅出现在质量门配置中不构成证据。对应 Theme audit 必须 ready，Hook 还必须存在于公开合同。首批 34 个表面/文字、核心操作与状态阶梯 Hook 在 7 个受治理主题和 7 个极端自定义 Seed、light/dark 两种模式下通过对比度与状态差异门，随 `v1.5.0` 晋级。

第二组 `text-secondary`、`icon-muted`、`icon-inverse` 分别通过全部 28 个样本的正常文字 4.5:1 或非文字 3:1 强制门，随 `v1.6.0` 晋级。`icon-primary` 只通过浅色样本，链接 default/hover/active 组只通过暗色样本；链接必须同时满足三个状态的文字对比度和相邻状态差异，不能只稳定单个 active 值。

disabled Hook 使用独立的联合证据，不套用普通文字 4.5:1：必须同时满足 enabled 与 disabled 的 OKLab 差异、disabled 对相邻背景的最低可见度、真实组件的 `disabled` / `aria-disabled` 行为断言，以及真实 runtime 消费链。`text-disabled`、`action-destructive-disabled`、`status-info-disabled` 覆盖全部 28 个主题样本并通过行为与消费证据，随 `v1.7.0` 晋级。`surface-control-disabled`、`action-primary-disabled` 因视觉样本不足保留 experimental；`link-disabled` 因 Link 仍使用 opacity 而没有消费该 Hook 保留 experimental；success/warning disabled 还缺真实行为和消费证据。

阴影 Hook 按完整 elevation 系统评审，不使用文字或边框对比度门。审计覆盖 28 个主题样本与 `none/low/medium/high` 四档，共 112 个 profile 样本，验证 shadow color alpha 顺序和档位递增、L1/L2/L3 几何范围递增、L1-up 方向镜像、真实组件消费及已提交视觉基线。三个 shadow color Hook 与 elevation 1/2/3 通过全部证据，随 `v1.8.0` 晋级；elevation 1-up 虽结构正确，但没有真实消费者和视觉证据，继续 experimental。

尚未达到门槛的 Hook 可以进入 candidate 审计，候选失败不回滚已经发布且证据完整的主题，但会阻止该 Hook 晋级 stable。当前 `border-strong`、`border-interactive` 与 `ring-focus` 的非文字 3:1 候选分别只有 `0/28`、`0/28`、`5/28` 个样本通过，最差为 `2.23`、`1.75`、`1.02`，因此继续 experimental。装饰性 chrome/faint/container/subtle/default 边框不机械套用控件边界 3:1，后续另走层级可辨识证据。

接入方只允许在主题根节点或受治理 Theme Provider 覆盖公开 Hook。单个组件实例仍使用 `variant` / `size` / `state` API，不通过局部 `style`、`className` 或任意 CSS 覆盖改变语义。

从 `--fx-*` 迁移遵守以下阶段：

1. `contract-only`：冻结 FDS 合同并建立 DTCG Primitive/Map source；FDS 名称可以进入 source/portable contract，但不声明为运行时 CSS 变量。
2. `dual-write`：生成 `--fds-*` 真相与 `--fx-*` 兼容别名，不复制物理值。
3. `fds-primary`：源码和发布物以 FDS 为主，旧前缀只存在于 alias 区。
4. `legacy-removal`：下一个 Major 删除已过废弃期的旧别名。

当前处于 `fds-primary`：runtime source、公开装配入口、派生数据和跨框架合同均以 FDS 名称为主；`--fx-*` 只存在于生成的兼容 alias、迁移对照字段与发布兼容层。主题适配器只写 `--fds-g-color-seed-brand`，`brand-vivid` 与完整 Brand Map 由 Foundation 统一派生，不得成为第二写入口。

阶段不能凭主观判断切换。`docs/data/fds-migration-audit.manifest.json` 从真实 source、公开装配入口、生成兼容层、发布物、文档和脚本派生旧前缀清单；当前阶段必须保持 `gates.currentPhase.status = ready`。下一阶段 `legacy-removal` 只有在发布版本达到 `2.0.0`、合同显式切换且运行时与发布物旧前缀全部归零后才允许进入。动态拼接和没有权威 replacement 的旧名称必须先确定归属，禁止全仓文本替换。

未映射的旧变量必须先匹配 `token-naming.manifest.json#migration.legacyDispositions`，有明确归属后才能建立 replacement。当前分为四类：

| 去向 | 适用对象 | 处理方式 |
|------|----------|----------|
| 内部 Global Semantic | 排版 profile、控件尺寸与间距、面板和导航度量、主题动效时长 | 先在 Semantic source 评审并登记 internal Token，再迁移全部消费者；不得机械转成公开 Component Hook |
| 组件局部运行时变量 | 只服务单个实现细节、没有跨组件设计含义的 CSS 变量 | 移除 `--fx-` / `--fds-` 保留前缀，改为组件作用域本地名称，不进入 Token 合同 |
| 组件内部分类色查表 | 例如 Avatar 根据内容 hash 选择稳定色系 | owner 评审后可在组件内部用静态表引用 FDS Map；没有独立换肤需求时不准入公开 Hook，禁止动态拼接 Token 名称 |
| Foundation 文档展示 | Token 文档中的原色、色阶和物理档位名称 | 直接从 Foundation contract 渲染 FDS 名称与 range，不保留旧前缀作为展示标签 |

迁移审计要求每个未映射或动态 runtime action item 都命中且只命中一个 disposition。新增第五类时，必须先更新机器合同和本节，再修改消费者。

Avatar 的彩色 fallback 已完成 owner 评审：六种背景是稳定身份分类色，不表达跨组件语义，也没有独立换肤需求。因此组件内部使用 `AVATAR_TONE_BACKGROUNDS` 静态查表引用 `--fds-g-color-{family}-base-80`，反白前景使用 `--fds-g-color-text-inverse`。这属于受治理的组件实现映射，不新增 `--fds-c-avatar-*`，也不授权产品页直接消费 Foundation Map。

兼容别名随 v1.3.0 引入，最早只能在 v2.0.0 删除。到达版本号只是必要条件，不是充分条件；`legacy-removal` 还要求运行时、公开装配、生成兼容层和发布物中的旧前缀全部归零。

Primitive/Map 内部变化且公开输出不变可发 Patch；新增公开 Hook 发 Minor；删除、改名或改变公开含义必须发 Major。废弃项必须登记 replacement，至少保留一个 Major 迁移窗口。

## 评审清单

新增或修改 Token 前逐项确认：

1. 唯一层级、owner、visibility 和 stability 已声明。
2. 名称可以由受控语法和词典完整解释。
3. 没有实现技术、DOM、业务实体、具体物理值或非标准缩写。
4. 引用方向符合 Primitive -> Map -> Semantic -> Component，且无循环。
5. Map 来自生成算法，不是手填派生色阶。
6. Semantic 不含组件名，Scenario 只映射 Core Semantic。
7. Component Hook 满足准入条件并绑定真实组件、owner、用途和测试。
8. 对外 Hook 已声明 SemVer、废弃和替代策略。
9. `--fx-*` 只按当前迁移阶段存在于兼容范围，迁移审计没有被手工跳过。
10. `npm run check:token-naming`、`npm run check:fds-migration`、`bash scripts/check-all.sh` 通过；视觉发生变化时再运行 `npm run test:visual`。

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/data/token-naming.manifest.json` | 命名语法、受控词典和迁移阶段 SSOT |
| `tokens/source/primitive.tokens.json` | DTCG Primitive 真相源 |
| `tokens/source/map.tokens.json` | Map 算法、色阶和例外真相源 |
| `tokens/source/semantic.tokens.json` | Semantic 角色、模式值、公开性和兼容别名真相源 |
| `tokens/source/component.tokens.json` | 经过准入的 Component Hook、owner 与证据真相源 |
| `docs/data/fds-foundation.manifest.json` | 从 Primitive/Map 派生的 FDS/legacy 对照合同 |
| `docs/data/fds-semantic.manifest.json` | Semantic portable contract 与兼容清单 |
| `docs/data/fds-migration-audit.manifest.json` | 旧前缀消费者、权威 replacement 与阶段就绪门的派生审计 |
| `theme/fds-semantic.css` | 生成式 FDS Semantic runtime，禁止手改 |
| `theme/fds-components.css` | 生成式 Component Styling Hooks runtime，禁止手改 |
| `docs/TOKENS.md` | Token 真实值、主题映射和使用规则 |
| `docs/DECISIONS.md` | FDS 四层体系的取舍与迁移决策 |
| `docs/FRAMEWORK_ADAPTERS.md` | 跨框架消费边界 |
| `docs/data/components.manifest.json` | 组件 canonical ID、variant 和 API 真相源 |
