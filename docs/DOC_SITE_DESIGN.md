---
layer: knowledge
type: spec
last_verified: 2026-06-25
teaches: "fx-ui 文档站自身的页面结构、样式边界和改样式流程"
use_when: "要改 fx-ui 文档网站的顶部导航、侧边栏、内容区、目录、示例区、代码块或文档页展示样式时"
depends_on: [theme/fx-theme.css, docs/TOKENS.md, docs/LAYOUTS.md, src/App.tsx]
---

# 文档站设计规范

> 用途：回答“fx-ui 这个承载组件和规范的网站本身应该怎么设计、以后要改样式该改哪里”。
> 不要写什么：具体组件 API、token 真实色值、业务页面布局规范。

fx-ui 文档站是组件、token、Blocks 和 AI 规则的承载界面。它本身不是业务后台页面，也不是营销站；它应该优先服务“工程师快速查”和“AI 准确读”。

## 索引

- [样式来源](#样式来源)　|　[机器可读结构](#机器可读结构)（token 分层 / 组件 manifest / 文档站 manifest）
- [页面骨架](#页面骨架)：顶部导航 / 左侧导航 / 中间内容区 / [页面头部组](#页面头部组统一规范) / [模块说明与行高](#模块说明与行高) / [组件文档页结构](#组件文档页结构区别于-token-页) / 右侧目录
- [内容组件规则](#内容组件规则)：章节标题 / 示例区 / 表格 / 代码块 / 卡片
- [改样式流程](#改样式流程)　|　[禁止事项](#禁止事项)　|　[检查清单](#检查清单)

> 体积控制：能被 `scripts/check-*` 兜底的规则，正文只留"一句意图 + 指向 check"，判定细节交给脚本，别在这里复述；清单型事实（组件 prop、页面骨架）放 `docs/data/*.json` manifest，不抄进本文。某一类规则长大到能独立演化时，再单独拆成文件并登记路由——不要一上来全拆碎。

## 样式来源

| 层级 | 管什么 | 修改位置 |
|------|--------|----------|
| 全局视觉 | 品牌色、背景、文字、边框、圆角、字体 | `theme/fx-theme.css` |
| token 说明 | token 值、用途、Tailwind 用法 | `docs/TOKENS.md` |
| token 机器事实表 | token 分层、语义槽、组件消费规则 | `docs/data/design-tokens.json` |
| 组件机器事实表 | 组件来源、文档状态、API 契约和 AI 可读规则 | `docs/data/components.manifest.json` |
| 治理数据总入口 | 机器事实表目录、用途、消费方、维护角色和检查命令 | `docs/data/governance-index.json` |
| 文档站骨架 | 顶部导航、左侧导航、内容区、右侧目录、搜索入口 | `src/App.tsx` |
| 工程文件关系 | 文档站和项目文件之间的读取、导入、检查、约束和产出关系 | `docs/data/system-relations.json` |
| 现状治理内容 | 当前状态卡、数据新鲜度、规则资产、治理闭环和参考案例 | `docs/data/governance-status.json` |
| 组件文档内容 | Button / Icon 等组件的规则和示例文本 | `docs/components/*.md` 与 `src/App.tsx` 中对应数据 |
| 页面布局沉淀 | 业务后台页面布局规则 | `docs/LAYOUTS.md` |

## 机器可读结构

文档站服务两类读者：人和 AI。Markdown 适合人读，JSON 负责给 AI、检查脚本和 Inspector 读。

所有治理数据先从 `docs/data/governance-index.json` 进入。它登记每份机器事实表的用途、维护角色、消费方和检查命令；AI 接手项目时先读这个索引，再进入具体 manifest。

文档站治理采用三件套：

```txt
docs/DOC_SITE_DESIGN.md
  -> docs/data/doc-site.manifest.json
  -> scripts/check-doc-site-contract.mjs
```

文字规范解释设计意图，manifest 记录不可漂移的页面骨架事实，检查脚本在 `npm run check` 中验证源码仍然满足这些事实。

### token 分层

主项目采用 shadcn 友好的三层结构：

```txt
Primitive -> Semantic -> Component Usage
```

- `Primitive`：公司原始视觉值，例如 `--fx-primary`。
- `Semantic`：shadcn/ui 和 Tailwind 真正消费的槽位，例如 `--primary`、`--background`、`--ring`。
- `Component Usage`：组件如何消费 token 的规则，例如 Button 不手写颜色，Loading 用 `disabled + Spinner`。

`fx-ui-report-skill` 的 `Seed -> Map -> Alias -> Component` 四层结构可作为报告输出参考，但不替代主项目的 shadcn semantic slots。文档站和组件体系以 `docs/data/design-tokens.json` 为机器可读 token 入口。

`docs/data/design-tokens.json` 必须覆盖 `theme/fx-theme.css` 里的 token 事实：`primitive` 对应 `--fx-*` 原始值，`semantic` 对应 shadcn/Tailwind 消费槽，`componentUsage` 记录核心组件如何消费 token。`npm run check:tokens` 会核对 JSON 中的 token 名和值是否和 CSS 真相源一致，并检查组件消费规则指向的源码和 token 是否存在。

### 组件 manifest

组件事实表放在 `docs/data/components.manifest.json`：

- `source` 指向真实 open-code 源码。
- `doc` 指向组件文档。
- `variants` / `sizes` / `states` 必须来自源码，不得杜撰。
- `composedStates` 明确写组合方式，例如 `loading = disabled + Spinner`。
- `docStatus` 用于标记哪些组件已经像 Button 一样补齐契约。

后续每过完一个组件，就把它从 `pending` 补成完整契约。

### 文档站 manifest

文档站骨架事实表放在 `docs/data/doc-site.manifest.json`：

- 顶部导航必须保留品牌、版本、一级入口、语言切换和搜索入口。
- 左侧导航必须保留分组、页面级入口和 active indicator。
- 中间内容区必须承载组件文档、token 页面、Markdown 视图和报告预览。
- 右侧目录必须只消费当前页面 anchors。
- 维护分组应包含现状看板，用来优先展示当前规则保护状态和风险，再承载治理闭环解释。
- `docs/data/doc-site.manifest.json` 的 `layoutContracts` 记录容易漂的页面布局细则：阅读宽度、顶部操作区、右侧目录和组件索引页。改这些结构时先改 manifest，再让 `npm run check:doc-site` 证明源码仍符合契约。
- 现状看板是从 `docs/data/*.json` 和项目图谱派生出来的仓库快照，不是服务端实时监控；源文件更新后，页面刷新即可体现新状态。
- 现状页必须解释网页和实际文档的维护关系：`docs/*.md` 负责人读说明，`docs/data/*.json` 负责机器事实，`src/App.tsx` 负责展示，`scripts/check-*` 负责防漂。不要暗示任意 Markdown 改动都会自动生成网页；只有被页面 import 或被 JSON/检查脚本消费的内容，才会进入网页或门禁。
- 现状看板应优先可视化 fx-ui 工程如何运转，工程运行图需要拆成两个视角：`网站` 说明当前文档站自身如何由入口、`src/App.tsx`、组件体系、文档数据、主题 token 和检查脚本支撑；`项目` 说明整个仓库工程文件如何组织，并用“产出/消费/检查/分发”的关系链表达应用源码、组件体系、规范数据、脚本工具、AI/skills、分发/构建产物之间的关系，而不是简单堆文件清单。
- 工程运行图每个大视角下还应区分两种读法：`分类视图` 用来回答“模块属于哪一层、负责什么”；`文件关系` 用来回答“哪个真实文件/目录被谁读取、import、检查、约束或产出”。不要把文件关系误画成时间顺序；这里的重点是文件之间如何互相作用。
- 工程运行图的文件关系来自 `docs/data/system-relations.json`，不要直接写死在 `src/App.tsx`。改文件关系时同步这份 JSON，并由 `scripts/check-doc-site-contract.mjs` 验证基本结构和真实路径。
- `scripts/build-project-graph.sh` 生成 `project-graph.v0.3`，会把自动扫描得到的文件节点/引用边与 `docs/data/system-relations.json` 的工程关系合流。页面看板读取 `docs/data/project-graph.json`，其中 `systemRelations` 和 `systemRelationEdges` 用来解释“文件之间如何共同作用”，不是时间线。
- 现状页应先展示工程驾驶舱摘要，但数字只作为证据，不作为结论。驾驶舱必须回答“我要改样式 / 改组件 / 改网站 / 看影响范围时，先看哪里、跑什么检查、什么算完成”，并用可切换的行动链路展示对应文件流。文件节点、自动引用边、工程关系、过期节点和关系分组用于支撑这些行动入口。工程运行图才是钻取层，用来逐条查看网站/项目文件关系。
- 驾驶舱首页只放决策入口：行动链路和任务路由优先展示；文件节点、自动引用边、关系分布和关系分组属于证据详情，应收进折叠区，不抢主视线。
- 驾驶舱行动链路来自 `docs/data/governance-status.json` 的 `actionFlows`，不要写死在 `src/App.tsx`。每条链路必须有 `id`、中英文标题/描述、目标页面、检查命令、完成标准和步骤文件；`scripts/check-doc-site-contract.mjs` 负责验证这些文件和命令存在。
- 行动链路里的跳转按钮必须有具体目标文案，例如“查看 token 页 / 查看组件索引 / 查看工程运行图”，不要使用“打开对应页面”这种泛化文案；如果下方文件链路已经能回答问题，按钮只负责跳到更完整的钻取页面。
- 用户任务和 DevInspector 输入先走 `docs/data/governance-status.json` 的 `taskRoutes`，再映射到 `actionFlows`。`taskRoutes` 负责回答“这类请求属于哪个工作流、第一步先判断什么、最后跑什么检查”，避免 AI 靠感觉选择流程。
- 现状页必须明确 shadcn 上游升级策略：官网 / registry 更新不自动同步到本地；只有 bug、安全、可访问性或业务需要时，才按单个组件评估升级，并保留 fx-ui token、`data-slot`、文档契约和检查门禁。
- 现状页的视觉语义必须稳定：步骤编号和普通计数统一使用安静样式；`primary` 只用于当前项、真实行动入口或数据里明确标记的 `emphasis`。不要用 `index === 0` 之类的位置条件制造无意义强调。
- 现状看板的当前状态卡、数据新鲜度、规则资产、治理闭环和参考案例来自 `docs/data/governance-status.json`，不要直接写死在 `src/App.tsx`。页面只消费机器事实表并负责展示；其中状态卡数值和更新时间可以由页面从其他 manifest 计算，但标题、解释、valueKey、updatedAtKey 和维护说明必须在 JSON 中维护。已完成的阶段性治理记录可以留在 JSON 里做历史，但不要默认占用现状页。
- `docs/data/governance-status.json` 的 `next` 是 AI 可执行任务队列，不是普通文案列表。每项必须包含 `id`、`priority`、`status`、`ownerRole`、`targetFiles`、`checkCommand` 和 `definitionOfDone`，方便 AI 逐项接手并用检查命令收口。
- 工程运行图采用组织架构式层级，顶层是最终可访问的完整页面，而不是 `dist/`；治理规则关系只是其中一部分，不应把整张图做成纯规则闭环图。
- `DevInspector` 属于用户自己的外挂工具，不作为 fx-ui 主工程运行图节点展示。
- 工程运行图中的节点必须来自真实文件、目录或真实检查命令，并在节点内说明“它负责什么”，避免只堆文件名。

这些是文档站的结构事实，不靠自然语言记忆。

## 页面骨架

文档站使用三栏结构：

1. 顶部导航：品牌、版本、一级入口、语言切换、搜索入口。
2. 左侧导航：按信息架构分组，承载开始使用、设计 Tokens、通用组件、业务组件等入口。
3. 中间内容区：承载组件文档、token 页面、规范页和报告预览。
4. 右侧目录：只展示当前页面的锚点，帮助长文档快速跳转。

### 顶部导航

- 高度保持紧凑，优先作为工具栏，不做大面积品牌展示。
- 品牌名使用 `text-primary` 或品牌 token，不写硬编码色。
- 顶部导航只放高频开发入口；维护类页面不作为一级入口，放入左侧维护分组。
- 搜索框是全站查找入口，视觉上低于主内容，不抢组件文档注意力。
- 语言切换是工具按钮，保持小尺寸。

### 左侧导航

- 分组标题使用弱文本色，避免和页面标题抢层级。
- 当前项用轻背景 + 主色点表达，不只靠颜色文字区分。
- 分组之间可以留较大间距，组内项保持紧凑。
- 不把组件 API 细节塞进左侧导航；左侧只放页面级入口。

### 中间内容区

- 中间内容是主阅读区，优先保证长文档可读。
- 页面标题使用文档站标题层级，不使用营销页式超大标题。
- 首段说明用于解释页面用途，避免堆叠口号。
- 首段说明使用较宽的文档站 lead 版心，避免因为 `max-w-3xl` 之类窄宽度在桌面端提前折行；标题区右侧操作按钮不应压缩正文说明的阅读宽度。
- 内容区宽度应适合代码和表格阅读；若表格较宽，局部横向滚动，而不是撑破页面。

### 页面头部组（统一规范）

所有页面（Token 子页、组件页、布局页、Icon 页等）的开头必须用同一个头部组，由 `PageLead` 组件承载，禁止各页手写一套。

- **固定内容，只有这四样**：①面包屑（`crumb`，弱文本色）②大标题（`title`）③一句说明（`lead`，独占整行）④右侧操作（`actions`）。
- **不放第二行说明**：补充信息下沉到分隔线之后的正文，不堆在头部组里。
- **不在头部组内另加横线**：头部组之后只有一条分隔线（`PageLead` 自带），不"线套线"。
- **内部间距固定**：面包屑→标题 `mb-2`；标题↔说明成组 `gap-2`；说明→分隔线 `mt-2`（与组内间距一致，不留大空当）；分隔线→正文 `mb-10`。
- **上边距**：头部组顶到内容区上沿的距离由中间内容区容器统一控制（`py-14`），各页不单独加。
- 缺面包屑或缺说明都算不合规：组件页面包屑用 `组件 / {名称}`，颜色等页必须补一句说明。
- **`lead` 怎么写**：一句话点明「这个组件/页面是什么、用来做什么」，像 Button 的「按钮用于开始一个即时操作。」。**不堆术语、不塞代码片段（`code` 胶囊）、不写 `见 DEC-xxx` 这类决策引用**——选型理由、依赖版本、底层库这些下沉到正文（使用方式 / API / 正误示例），不挤进标题下的说明。lead 用 `docsSpacing.leadText`（`text-lg`），字号固定。

### 模块说明与行高

- **每个模块（h2 区块）都要有标题 + 一句说明**，说明只回答"这个模块是干嘛的"，尽量一句话。
- **模块说明字号固定**：`text-2xl` 模块标题下的说明统一用 `docsSpacing.sectionDesc`（= `text-base text-muted-foreground`），所有页一致。不要再用 `text-fx-13` 等小一号字写模块说明，那会让各页大小不一。
- **说明不与下方内容重复**：表格 / 场景列 / 卡片里已经逐项写明的，说明里不再罗列（如圆角档位的逐档→组件映射在场景列，说明就别再抄一遍）。
- **行高不手写**：正文/说明的行高由字号 token 自带（`text-fx-12/13` → 18、`text-fx-15` → 22、`text-fx-18` → 28；`text-base` 走 Tailwind 默认 1.5）。不要再加 `leading-7`/`leading-8` 把行距抬到 2.0+，那样换行太散、不符合主流正文行高（约 1.5）。
- **组件页模块说明的固定文案**：组件文档页（含 Button 独立页与 `StandardDocPage`）的标准模块说明统一口径，不要一页一个写法：
  - 头部一律用 `PageLead`（面包屑 `组件 / Xxx` + 大标题 + 一句 lead「这个组件干嘛的」+ 分隔线），不要再写裸 `<h1>`。
  - **组件总览**：一句「紧凑展示该组件的样子，用来快速查看长什么样」。
  - **场景示例**：一句「常见用法与适用场景」。
  - 其余模块（使用方式 / API / 语义 DOM / 正误示例）按各自职责一句话点明，不堆口号、不与下方内容重复。

### 组件文档页结构（区别于 token 页）

页面分两类，结构不同、不要混用：

**① 组件文档页**（Button 独立页 / 所有走 `StandardDocPage` 的组件）——固定 7 段，顺序不变、缺一不可：

| 段 | 内容 | 要点 |
|----|------|------|
| 头部 | `PageLead` | 面包屑 `组件 / Xxx` + 大标题 + 一句 lead + 分隔线 |
| 组件总览 | 真实组件预览 | 「紧凑展示该组件的样子」；**每个小标题块 = 场景示例的一个 tab（一一对应），块内示例也对应该 tab 的场景**。总览只快速展示，不加额外说明文字/旁注（说明留给场景示例的约束列） |
| 场景示例 | 表：场景 / 示例 / 使用意图 / 约束 / 推荐写法 | 示例列在场景前；行不可点（关 hover） |
| 使用方式 | `import` +（可选）一段**完整组装** JSX | 组合型组件（带 Provider/结构/useState，如 Sidebar/Tabs/Calendar）保留完整组装范例；用法极简、场景示例已完整覆盖的（如 Button）只留 `import`、不重复 |
| **API 属性** | 表：**属性 / 类型 / 默认值 / 说明 四列** | **组件页和 token 页的核心区别——必须讲清可配置 prop 及其类型，不能只有名字没类型** |
| 语义 DOM | `data-slot` 等结构 | 来自源码，不杜撰 |
| 正误示例 | do / don't | 用现有能力，不发明 API |

- **场景示例的筛选 tab**：场景较多需分组时用筛选 tab。**不要「全部」tab**，默认选中第一个分组；维度要对该组件有意义（Button = 类型/尺寸/状态/图标，ButtonGroup = 类型/尺寸，Icon = 用色/用法）。
- **尺寸类分组逐档一行**：凡是「尺寸」分组，必须每个尺寸（xs/sm/default/lg）单独一行，写清各档的规格 + 用在什么情况 + 约束，对齐 Button 尺寸表，不要用一行「不同尺寸」糊弄过去。
- **规格列只在「尺寸」分组出现**：规格是量化尺寸口径（高/字号/圆角），只对尺寸维度有意义；类型/用法等场景不要塞规格（会重复或牵强）。`ScenarioTable` 的规格列按"当前 tab 显示的行是否有 spec"动态显示——只给尺寸场景的行写 `spec`，类型/用法行不写。

**② Token 页**（颜色/圆角/阴影/间距/排版/层级/动效）——结构不同：

- 头部 `PageLead` + 档位表（**token / 值 / 示例 / 场景**）+ 计算方式/逻辑模块。
- **没有「API 属性 / 类型」这类**——token 不是可配置组件，讲的是"值和怎么算"，不是"prop 和类型"。

**检验**：`scripts/check-component-docs.mjs`（接 `check-all`）校验每个组件的 `*PropRows` 数组都非空、且每个属性都带 `type`——API 表不能出现"有属性名、没类型"。

### 右侧目录

- 只展示当前页面锚点。
- 当前锚点优先用文字加深/加粗提示，不使用漂浮圆点；如需线性提示，应贴合目录竖线而不是悬空。
- 右侧目录不承载操作按钮。
- 小屏或内容空间不足时可以隐藏。

## 内容组件规则

### 章节标题

- 章节标题用于建立阅读结构，不随意跳级。
- 标题和说明之间默认使用紧凑间距。
- **章节说明文字独占整行**：当标题行右侧有操作控件（如浅色/深色切换、筛选 tab）时，标题与控件用 `flex justify-between` 同行，**说明 `<p>` 放在该行下方独占整行**，不要塞进左侧子容器里——否则长说明会被控件挤窄、换行后右侧留出空白块。
- 一个章节只讲一类问题：概览、场景、API、语义 DOM、token、正误示例。

### 示例区

- 展示组件能力时可以用视觉矩阵。
- 解释使用决策时优先用决策表。
- 组合模式必须显式写出组合方式，例如 `Loading = disabled + Spinner`。
- 不把业务场景包装成不存在的组件 API。
- **示例预览的并排间距**：场景示例/组件总览里并排多个示例时，默认 `gap-3`（12px）。
- **示例列宽**：场景表「示例」列容器统一 `max-w-[500px]`——不到则自适应内容宽度，超过才约束并让内部 `flex-wrap` 折行（示例多/宽时不撑爆表格）。
- **plain 按钮无横向 padding**：`variant="plain"` 的文字/图标+文字按钮不带横向 padding（组件层已 `px-0`），间距交给调用方 gap；纯图标 plain（`size=icon-*`）保留方形点击热区。

### 表格

- 表格用于 API、决策、token 和对比信息。
- 列名要面向读者：场景、使用意图、推荐写法、约束、预览。
- **示例/预览列一律排在"场景/说明"列前面**：先给读者看到直观示例，再读文字说明。token 表、组件表都遵循此序。
- **表格正文用同一种文字色**：同一张表里的正文文字（含说明/场景列与 token/值列的 `code`）统一用 `text-foreground`，不要场景列走 `text-muted-foreground`、code 走 `text-foreground` 造成深浅不一。需要弱化的只有表头或辅助注释，不在正文行内混色。
- **token / 值列统一用 code 胶囊**：所有 token 表的 `Token` 列和 `值` 列都用 `<code className="rounded bg-muted px-1.5 py-0.5 text-xs">` 包裹，不要某张表的"值"写成裸文本或浅灰。值带单位写全（如行高 `18px / 28px`、间距 `1rem / 16px`），含义不止一个时在该列表头或模块说明里点明（如字号列"值 = 字号 / 行高"）。
- **示例列统一命名"示例"**：展示真实效果的列一律叫"示例"（英文 Example），不要混用"预览"。
- **「用法」列的场景名同组同格式**：场景表第一列（「用法」）里同一个 tab 下的场景名要用统一构词。如 Button「类型」tab 统一「XX 操作」（主操作 / 次操作 / 危险操作 / 描边操作 / 幽灵操作 / 无底色操作），不要混「X 操作」和「X 按钮」。检验见 `scripts/check-shadcn-contract.mjs`（Button 类型 tab 场景名须全部以「操作」结尾）。
- 代码较长时允许在单元格内横向滚动。
- 不用表格承载长段落说明。
- **列宽与换行**（防止挤成竖排断词）：
  - **短标签列**（场景 / 规格 / 属性名）→ `whitespace-nowrap` + **不设固定宽度**，让它按内容自适应收窄；设了固定宽度短内容会留一大段空隙，宽窄不一。
  - **长文本列**（使用意图 / 约束 / 说明）→ `whitespace-normal` + **必须同时给 `min-w` 和 `max-w`**（如意图 `min-w-[180px] max-w-[260px]`）。只给 `max-w` 不给 `min-w`，会被相邻超宽列挤成一行两三字的竖排——这是反例。
  - **代码列**（推荐写法）→ 代码用 **`block max-w-[360px] overflow-x-auto whitespace-pre`**，让长代码在**单元格内横向滚动**。注意 inline `<code>` 上的 `overflow-x-auto` 不生效，必须 `block`/`pre`，否则不换行的长代码会撑爆整表、把别的列挤扁、还被截断。
  - **整表**靠容器 `overflow-x-auto` + 足够 `min-w` 撑开横滚，列多就滚，**不靠压窄列**。
  - **列宽自适应做法（推荐）**：表用 `w-auto`（覆盖 shadcn `Table` 默认的 `w-full`）走 `table-layout: auto`，列宽随内容自动取最宽——短内容窄、不留大空当。**上限**靠在单元格内包一层 `<div className="max-w-[..]">`（`<td>` 自己的 `max-width` 在 auto 布局会被忽略，必须套 div）。
  - **文本列必须显式 `whitespace-normal`**：shadcn `TableCell` 默认带 `whitespace-nowrap`，不覆盖就不换行——auto 布局下文字会把列撑得极宽、甚至溢出**盖到隔壁列**（"叠在一起"事故）。文本/规格/场景列单元格加 `whitespace-normal`，长串再加 `break-words`。
  - **代码列**：`<div className="max-w-[360px] overflow-x-auto">` 套 `<pre className="w-max …">`，长代码在格内横滚、不撑表。
  - 全站场景示例统一走 `ScenarioTable` 组件（`src/App.tsx`），列宽/换行只在这一处维护，不要各页再手写一套。

### 代码块

- 代码块展示真实可复制用法。
- 代码必须和源码 API 一致，不发明 prop。
- 代码块背景使用 `bg-muted`，不要硬写灰色。
- 若代码用于 AI 规则，应补充“不推荐/推荐”的对照。

### 卡片

- 卡片用于承载独立信息块、示例预览或说明区域。
- 不要卡片套卡片形成过重层级。
- 卡片边框使用 `border-border`，背景使用 `bg-card`。
- 纯展示页不滥用阴影。
- **卡片内分节用虚线**：卡片**内部**把内容分成几小节时，用虚线分隔 `border-t border-dashed border-border`；**页面级/卡片之间**才用实线 `Separator`。两者区分，避免卡片里实线显得割裂。（Separator 组件自身的演示页除外）

## 改样式流程

改文档站样式前，先判断改动属于哪一类：

| 想改什么 | 应该改哪里 | 备注 |
|----------|------------|------|
| 全站颜色、圆角、字体、背景 | `theme/fx-theme.css` | 全局影响，动手前说明影响范围 |
| token 文案和值说明 | `docs/TOKENS.md` | 改 token 后要同步检查 token 文档 |
| 顶部导航、侧边栏、右侧目录、文档页布局 | `src/App.tsx` | 文档站局部骨架 |
| 某个组件文档的内容规则 | `docs/components/*.md` 和对应数据 | 需要和源码 API 对齐 |
| shadcn 基础组件默认样式 | `src/components/ui/<component>.tsx` | 不新增黑盒封装 |
| 公司组合模式 | `src/components/fx/` | 底层仍然由 shadcn 组合 |

## 禁止事项

- 不在页面里硬写品牌色、灰色、圆角和字体。
- 不为了文档站局部视觉去改 `theme/fx-theme.css`，除非目标就是全局换肤。
- 不为了单个页面手搓基础组件。
- 不把“主操作”“错误状态”等业务语义写成不存在的 Button prop。
- 不手改 `dist/`。
- 不新增文档而忘记登记 `docs/DOCUMENTATION.md` 的 SSOT 路由表。

## 检查清单

文档站样式改完后，至少确认：

- 是否使用 token/Tailwind 语义类，而不是硬编码色值。
- 是否只改了正确层级：全局、组件、文档站局部、组件文档内容。
- 是否影响了组件文档展示的 API 真实性。
- 若改了组件页面、Markdown 或 AI 数据源，是否读取对应 `src/components/ui/<component>.tsx` 核对。
- 是否仍满足 `docs/data/doc-site.manifest.json` 中的文档站骨架事实。
- 是否运行 `npm run check`。

## 相关文件

| 文件 | 关系 |
|------|------|
| `src/App.tsx` | 当前文档站主要页面骨架和渲染入口 |
| `theme/fx-theme.css` | 文档站和组件共同使用的视觉 token 真相源 |
| `docs/TOKENS.md` | token 值和用法说明 |
| `docs/data/governance-index.json` | 治理数据总入口，登记所有机器事实表 |
| `docs/data/design-tokens.json` | token 机器可读事实表 |
| `docs/data/components.manifest.json` | 组件机器可读事实表 |
| `docs/data/doc-site.manifest.json` | 文档站骨架机器可读事实表 |
| `docs/data/system-relations.json` | 工程运行图文件关系机器事实表 |
| `docs/data/governance-status.json` | 现状看板当前状态、数据新鲜度、治理内容和历史沉淀机器事实表 |
| `scripts/check-doc-site-contract.mjs` | 文档站骨架和 manifest 基础一致性检查 |
| `docs/LAYOUTS.md` | 业务后台页面布局规范，不等同于文档站布局 |
| `docs/DESIGN_STANDARDS.md` | 设计规则总览 |
| `docs/components/` | 组件文档内容来源 |
