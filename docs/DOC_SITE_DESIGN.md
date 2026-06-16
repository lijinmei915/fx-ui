---
layer: knowledge
type: spec
last_verified: 2026-06-12
teaches: "fx-ui 文档站自身的页面结构、样式边界和改样式流程"
use_when: "要改 fx-ui 文档网站的顶部导航、侧边栏、内容区、目录、示例区、代码块或文档页展示样式时"
depends_on: [theme/fx-theme.css, docs/TOKENS.md, docs/LAYOUTS.md, src/App.tsx]
---

# 文档站设计规范

> 用途：回答“fx-ui 这个承载组件和规范的网站本身应该怎么设计、以后要改样式该改哪里”。
> 不要写什么：具体组件 API、token 真实色值、业务页面布局规范。

fx-ui 文档站是组件、token、Blocks 和 AI 规则的承载界面。它本身不是业务后台页面，也不是营销站；它应该优先服务“工程师快速查”和“AI 准确读”。

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

### 右侧目录

- 只展示当前页面锚点。
- 当前锚点优先用文字加深/加粗提示，不使用漂浮圆点；如需线性提示，应贴合目录竖线而不是悬空。
- 右侧目录不承载操作按钮。
- 小屏或内容空间不足时可以隐藏。

## 内容组件规则

### 章节标题

- 章节标题用于建立阅读结构，不随意跳级。
- 标题和说明之间默认使用紧凑间距。
- 一个章节只讲一类问题：概览、场景、API、语义 DOM、token、正误示例。

### 示例区

- 展示组件能力时可以用视觉矩阵。
- 解释使用决策时优先用决策表。
- 组合模式必须显式写出组合方式，例如 `Loading = disabled + Spinner`。
- 不把业务场景包装成不存在的组件 API。

### 表格

- 表格用于 API、决策、token 和对比信息。
- 列名要面向读者：场景、使用意图、推荐写法、约束、预览。
- 代码较长时允许在单元格内横向滚动。
- 不用表格承载长段落说明。

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
