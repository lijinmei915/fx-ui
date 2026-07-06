> **接手时间**：2026-07-06（最新一轮：playground 泛化收尾 + check-secrets 沙箱兼容 + 仓库清理）
> **项目根目录**：fx-ui
> **当前状态**：本轮把上一轮（6/26）攒下未提交的 playground 泛化改动收尾提交、推上云端，顺带修一个沙箱阻塞 + 清一批导出残留垃圾。① **playground 泛化已完成**（`src/components/fx/component-playground.tsx`）：从 Button 专用硬编码（PG_VARIANTS/pgButton/genButtonCode）泛化为 **config 驱动通用引擎**——`ComponentPlaygroundConfig`（scenarios[]/props[]/initial/guidanceKey/renderOne/genCode + onValueChange + disabledWhen/hiddenWhen 联动），segment/text 两类 prop，全程 zh/en 双语；真相源收口到 `docs/data/component-playgrounds.manifest.json`（schemaVersion 1），已配 icon/tag/buttonGroup 三个组件 + 28 个 autoScenarioComponents（从 props 自动生成场景）；② **check-secrets.sh mktemp 兼容沙箱/CI**：裸 `mktemp` 改 `mktemp "${TMPDIR:-/tmp}/..."`，macOS 沙箱（mktemp 不读 $TMPDIR）和 Linux CI 都能跑；③ **清导出残留**：删 `fx-ui-frontend-style/`+zip（已跟踪的项目快照副本，63 文件/2 万行）+ `button-page-export/`+zip（gitignore）。5 个提交已推 origin/main（2 旧 + fix + feat + chore）
> **下一步**：1）playground 继续铺组件页——往 `component-playgrounds.manifest.json` 加配置即可（icon/tag/buttonGroup 已有范例），autoScenarioComponents 里 28 个走自动场景，优先补 Input/Select/Badge 等高频组件的 renderOne/genCode 适配；2）旧待办仍在：DEC-005 尾巴（toggle/table/tabs/sidebar 的 `/透明度`、旧 hover）、block 升 fx（DEC-024）、逐个组件体检、下拉多选/单选选中样式；3）视觉基线补 playground 截图
> **风险**：① `theme/fx-theme.css` 是 token 真相源，动它即全局换肤（顺序 CSS→TOKENS.md→design-tokens.json→`build:tokens`→组件）；② **大块改动随手提交，别攒一堆未提交**（本轮就是攒了一堆才推）；③ **改页面/组合/视觉，收尾必跑 `npm run test:visual` 看截图**（红线，曾因没看截图漏掉缝隙/圆角）；④ 视觉基线是 mac/chromium 版，换机/上 CI 需重定；⑤ **沙箱网络只放行 aihub.firstshare.cn + api.anthropic.com，github.com 被拦**——`git push` 需在独立终端跑，Claude Code 会话里推不了

---

## 本轮（2026-07-06）playground 泛化收尾 + check-secrets 沙箱兼容 + 仓库清理

**主线：把上一轮（6/26）攒下未提交的 playground 泛化改动收尾提交、推上云端，顺带修一个沙箱阻塞、清一批导出残留垃圾。**

playground 泛化（上一轮写好的代码，本轮收尾提交，commit a0be21c）：
- **config 驱动通用引擎**（`src/components/fx/component-playground.tsx`）：`ComponentPlaygroundConfig` = scenarios[] + props[] + initial + guidanceKey + renderOne + genCode + onValueChange，props 支持 segment（带 hasAll / 选项 intent+constraint 双语）和 text（bilingual），每个 prop 可 `disabledWhen`/`hiddenWhen` 联动；eyebrow/分段控件 chrome 全走 token
- **真相源收口**：新增 `docs/data/component-playgrounds.manifest.json`（schemaVersion 1，`truthSource` 指向自身），组件页和网站规范页都从这里读场景/属性/意图/约束，源码只负责渲染
- **已配 3 个组件**：icon / tag / buttonGroup（含完整 scenarios + props + intent/constraint 双语）；另声明 28 个 `autoScenarioComponents`（input/select/checkbox/...）走自动场景生成
- 同步更新 button-group.tsx、theme/fx-theme.css（playground 相关 token）、App.tsx、button.md / component-playground.md、design-tokens.json、website-standards.manifest.json

check-secrets 沙箱兼容（commit c17029d）：
- `scripts/check-secrets.sh` 裸 `mktemp` 在 macOS 沙箱里走系统 `/var/folders/.../T/`（mktemp 不读 `$TMPDIR`），无写权限 → pre-commit 误报失败
- 改 `mktemp "${TMPDIR:-/tmp}/secret-scan.XXXXXX"`，沙箱 / 本地终端 / Linux CI 都能跑，不削弱检查能力

仓库清理（commit dcc6b54）：
- 删 `fx-ui-frontend-style/` + zip（6/26 导出的整个项目快照副本，已被 git 跟踪，63 文件 / 20061 行——留着占体积 + 易被 AI 当真相源误读）
- 删 `button-page-export/` + zip（gitignore 覆盖，本地残留）

一句话给下个 AI：**playground 已泛化成 config 驱动，铺新组件 = 往 `component-playgrounds.manifest.json` 加配置 + 写 renderOne/genCode，别再复制 Button 专用那套。**

---

## 本轮（2026-06-26 晚）网站样式优化（对标 showcase）+ Button 交互调试台

**主线：参考桌面 `component-library-showcase` 把文档站观感往"克制、精致"调，保 token；并新建 Button 交互 playground。**

字体/排版（纯文档站展示层，未碰 `text-fx-*` 企业字号阶）：
- 全站标题 `font-semibold`→`font-bold tracking-tight`；页/区块标题各**降一档**（4xl→3xl、2xl→xl）—— showcase 标题更小更稳（DEC-028）
- 字重阶补 **semibold(600)**（小标题/卡片标题档，扶正早已在用的 `font-semibold`）（DEC-028）
- **中文字族**改"优先系统苹方/雅黑，Noto Sans SC 退兜底"（拉丁仍 Inter）—— Noto 偏重不如苹方顺眼（DEC-027 部分修订 DEC-008）；已同步 TOKENS + design-tokens.json + 视觉基线

Button 交互调试台（`#playground`，Button 页顶部）：
- `ButtonPlayground`：左**场景预设**（7 个，单选）+ 右**实时属性**（变体/尺寸/图标位置/禁用=分段，内容=Input）；下方 **Preview/Code**（Tabs `variant="line"` 下划线）+ **Copy**（实时生成 JSX）；预览区**点阵网格底**
- **「全部」**：每个属性首项，选中后预览铺该维度全变体**矩阵**（笛卡尔积）
- 选中场景 → 左下显 **使用意图 / 推荐写法** 卡片（随场景联动）
- **eyebrow 微标签**（圆点 + 小号大写），场景=蓝点 / 属性=橙点
- **`PgSegmented`** 分段控件：playground 自有 chrome，1:1 抠 showcase（`text-[11px]` + muted 轨道 + 「全部」竖线分隔 + 白滑块，激活滑块 `bg-card shadow-l1`，全部激活描品牌色/具体值描主文字色）；色值全走 token，不引硬编码
- 视觉基线新增 `button-playground.png`

注意：**playground 目前 Button 专用**（PG_VARIANTS/pgButton/genButtonCode 硬编码）。铺到别的组件页前，先泛化成 config 驱动引擎，别复制粘贴。

一句话给下个 AI：**样式优化只动文档站展示层 + token（走 DEC），别碰企业 `text-fx-*`；playground 要泛化再铺。**

---

## 本轮（2026-06-26）TopBar + 列表页 + 区块化生产线 + 防跑偏治理

**主线：从"做一个顶栏"一路做到"AI 怎么可靠地生产一个列表页"——沉淀组件/区块 + 建立防跑偏机制。**

产物（都在本地 main）：
- **TopBar**（`src/components/fx/top-bar.tsx`）：全局应用顶栏，1:1 对齐公司 Figma。透明底（换肤友好）、白底 app 卡片、灰底搜索（hover 提亮/聚焦变白）、14px 工具图标、彩色九宫格静态 SVG。新增 `--fill-subtle/--fill-hover` 半透明填充 token（自适应宿主底色）
- **Progress**（`src/components/ui/progress.tsx`）：base-ui 进度条，tone 切语义色；不出独立文档页，作"数据展示"用于表格（用户决定）
- **客户列表页模板**（`src/App.tsx` `CustomerListTemplate`，挂「页面模板」导航）：满宽浮卡布局，由下列 block 拼成
- **4 个 block**（`src/components/recipes/`）：`CrmAppShell`（外壳）/`CrmShellNav`（双层导航）/`ListPageHeader`（标题+视图下拉+操作槽）/`ListToolbar`（筛选+搜索+视图切换）/`DataTable`（薄表格，columns 驱动+勾选）
- **`gen:list-page` 生成器**（`scripts/gen-list-page.mjs`）：一条命令按模板生成列表页骨架，结构锁死、只填 columns/数据
- **页面唯一真相源**：`pageRegistry`（DEC-023），路由/锚点/渲染全部派生

防跑偏机制（重点，给下一任）：
- **AGENTS 红线 6/7**：禁手写重拼组装；禁在调用处 className 覆盖组件外观（要变体加 variant，对齐 Polaris/Spectrum）
- **SessionStart hook**（`.claude/settings.json`）：每次会话自动注入 AGENTS 红线块（含"先查 MAP"）
- **仓库地图 `docs/MAP.md`**：按产物种类分流（住哪/登记/谁 check），动手前先查
- **页面装配 playbook `docs/PAGES.md`**：列表页→直接跑生成器；其它页→6 步流程 + 决策树 + block 变体三层规则
- **机器门禁**：hygiene lint 扩到 fx 层（+ raw-svg/颜色函数规则）；**`check-list-page-source`**（手写列表页无 `@generated` 标记即拦）；**Playwright 视觉回归**（`tests/visual.spec.ts`，`npm run test:visual`）
- 决策：DEC-023（pageRegistry）、DEC-024（列表页可组合拆分不做单体 + ListPageHeader 落地）

一句话给下个 AI：**做列表页别手搓——查 `docs/PAGES.md` → 跑 `npm run gen:list-page` → 填 columns → `check:all` + `test:visual`。**

---

## 本轮（2026-06-25）组件体检体系 + Button/Table/Tag/Command/Pagination

**主线：建立"逐个体检"的方法论与门禁，并把 Button/Table 等核心组件按公司 Figma + 主流重做。**

体检体系（方法论，最重要）：
- **组件体检清单 14 条**：`docs/DESIGN_STANDARDS.md`「组件体检清单」——A 设计规范(公司Figma优先+主流交叉)/B 正交轴/C 颜色状态/D 结构/E 可达性/F 文档治理。过审流程：机器扫硬伤→人判软性→`governance-status` 记账
- **hygiene 检查**：`scripts/check-component-hygiene.mjs` 精确抓 `disabled:opacity-50`/`pointer-events-none`/组件内 hex；baseline 豁免存量 18 条（新增违规❌），行内 `hygiene-ignore` 放行；并弱提示"未登记 figma 源"组件清单
- **Figma 真相源**：manifest 加 `figma` 字段，体检时登记节点 URL（Tag/Button 已登记）

组件改动：
- **Button**：删 link 变体（跳转用 Link）；新增 plain（无底色文字/图标，无 padding、hover变色）+ tone(中性/主色/info蓝/危险)；禁用态全 token 化(DEC-020 取代 DEC-011)；**尺寸键名改纯尺寸 xs24/sm28/md32/lg36**，默认 28 由 defaultVariants 指定（双层，不再有"default"档名）；图标场景拆「无底色文字操作/无底色纯图标」；命名「XX操作」+ 总览↔tab 一一对应进 check
- **Table**：三档行高(28/36/42)、列 ⋮ 菜单(排序常驻+冻结/筛选)、Excel 冻结到此列、maxHeight 稳定滚动、对齐公司列表页视觉
- **Tag/Badge 拆分**(DEC-021)：Badge=角标、Tag=标签(variant 状态 + color 多彩打标)
- **Command**(新)：⌘K 命令面板，网站搜索接入；**Pagination**(新)：主流分页
- 决策：DEC-018~022（下拉尺寸/正交组合/拆Tag/禁用token/Button不按形态分类）

---

## 本轮（2026-06-25）Table 业务化 + Pagination + Button 体系 + 组合规范

**主线：把 Table 做成贴公司列表页的业务表，补齐 Pagination 组件，扩展 Button（无底色 plain + tone + 禁用 token 化），并把"组件怎么组合"沉淀成全站规范。**

已完成：
- **Table**：`table.tsx` 加 `density`(compact=36px)、`TableHead` 的 `sortable/align`、`TableCell/Head` 的 `pinned`(固定列)、`TableHeader sticky`(吸顶)、`bordered`(默认无边框，对齐公司列表页)；表头白底+加粗+深下边线(neutrals05)、表体淡线(neutrals04)。业务表场景：链接首列/头像/级别 Badge/金额右对齐排序/行选中+批量操作条/纯图标操作(查看·编辑·删除)/加载骨架/空状态
- **Pagination（新组件）**：`src/components/ui/pagination.tsx`，主流页码+省略号+上下页(受控)；完整文档页 + 导航/路由/锚点 + manifest + `pagination.md`
- **Badge**：新增 `warning` 变体(琥珀浅底)，级别 tag 对齐 Figma
- **Button**：① 禁用态去 `opacity-50`、改语义禁用色 token(危险/链接保留淡本色)，新增 `--surface-disabled`(neutrals-02)/`--link-disabled`(blue-05)；② 新增 `plain` 变体(无底色文字/图标，hover 只变色) + `tone`(中性/主色/链接/危险，仅 plain 生效)；③ 图标-文字 gap 按尺寸适配(4px / lg 8px)；④ link 变体去 hover 下划线(B 端风)
- **规范**：`DESIGN_STANDARDS.md` 新增「组件变体与组合规范」(正交轴，全站通用)；`DECISIONS.md` DEC-018(下拉尺寸+选中)、DEC-019(组件正交组合，全站)、DEC-020(禁用态改 token，取代 DEC-011)

未收口（下一任注意）：
- **下拉菜单 多选/单选选中样式**待定：曾探讨"单选橙字、多选中性"vs"都橙字"，未拍板（当前都橙字）
- 其余组件未按 DEC-019/组合规范逐个核对
- DEC-005 尾巴仍在

---

## 本轮（2026-06-22）组件文档结构 & 用色统一

**主线：把"图标页对不齐 + 正误示例两种形式 + 筛选/说明不统一"理顺，并补门禁。**

已完成：
- **图标页重写**：标准 7 段式（总览/场景/使用/API/语义DOM/正误），新增带类型的 `iconPropRows` API 表；`icon.md` 从过期的 lucide 修正为 Tabler / `@/lib/icons` 并补「图标颜色规范」节
- **组件总览改纯展示**：单色线性/彩色线性/面型/反白/尺寸 五块，统一同一批图标（Home/CheckCircle/Bell/Star/Database）、统一主题色（`bg-primary`/`text-primary-foreground`），去掉子标签注释
- **图标用色定死**：单色默认 `text-foreground`、次要 muted、禁用 disabled；彩色走语义色；反白 `bg-primary`+`text-primary-foreground`；禁用 `opacity-50`+`cursor-not-allowed`（与 Button 同口径，不另造禁用 token）
- **场景筛选统一**：去掉「全部」tab、默认选第一组；按钮=类型/尺寸/状态/图标，按钮组=类型/尺寸，图标=类型/尺寸；尺寸分组逐档一行（写规格+用途+约束）
- **正误示例全站统一**：按钮/图标从「逐条代码卡片」改为两列「推荐 Do / 避免 Don't」+ 补一句说明，与其余 ~27 个组件（StandardDocPage + 13 内联页）口径一致
- **模块说明字号固定**：`docsSpacing.sectionDesc`（`text-base`），全站把零散 `text-base` 模块说明 bump 上来；规范 PageLead `lead` 写法（一句话用途、不堆术语/代码/DEC 引用）
- **按钮禁用态**：`button.tsx` 去 `disabled:pointer-events-none`→`disabled:cursor-not-allowed`，各 variant hover/active 加 `enabled:` 前缀（禁用悬停不变色、显示禁止光标），base 加 `cursor-pointer`
- **新增门禁**：`scripts/check-component-docs.mjs`（每张 `*PropRows` 非空且 prop 都带 type）、`scripts/check-imports.mjs`（图标走 `@/lib/icons`、无旧图标库残留），均接入 `check-all.sh`
- 规范沉淀进 `docs/DOC_SITE_DESIGN.md`（页面头部组/模块说明/组件文档页结构/筛选 tab/尺寸逐档）

未收口（下一任注意）：
- 其余组件页（Input/Select/… 内联页）的 PageLead lead 写法、说明字号、尺寸分组是否全按新规范，尚未逐个巡检
- DEC-005 尾巴（toggle/table/tabs/sidebar 的 `/透明度`、旧 hover）仍未收敛

---

## 本轮（2026-06-16）颜色系统治理

**主线：把颜色从"散落写死/三套手法"整顿成"色板单一真相 + 统一规则 + 可执行检查"。**

已完成：
- **Token 生成器 + CI**：`scripts/build-design-tokens.mjs`（改完 CSS 跑 `npm run build:tokens` 重建 manifest）、`.github/workflows/check.yml`（服务器端全套检查，绕不过 `--no-verify`）、`scripts/check-frontmatter.sh`
- **两套灰合一**：删除独立 Gray 色系，全站唯一中性灰 = `--fx-neutrals-01~20`（20 阶，偏色 0.008）；secondary/muted 走中性轴
- **统一交互阶梯（DEC-005，仅浅色模式）**：以 09 为默认的色（主色/状态实心/链接/品牌文字）= 默认09 / hover08 / active10 / 禁用05；浅色组 01/02/03；中性填充 02/03/04，ghost/outline hover02/active03
- **状态色**：拆成 危险/成功/警告/信息 四张表，实心+浅色完整态；warning 改琥珀（不撞品牌橙）；info 蓝（中性/默认标签改用 `secondary`）
- **链接色**：新增 `--link`（蓝 09/08/10），Button/Badge link 变体由橙改蓝
- **文字/图标四级**：均匀梯度 20/15/11/07 + 反白 01；拆「中性层级」「彩色（品牌/链接）」两表；placeholder 与禁用同档(07)
- **三件套闭环**：`interactionLadder` 写进 `design-tokens.json`，`check-tokens-sync.sh` 校验每个色 hover/active/disabled 实际阶——已验证能拦漂移
- **文档站颜色页**：彩色色板（13 色系）+ 中性色板（20 阶）双表、推导数值上墙、示例列前置、说明独占整行（layoutContract 锁定）

未收口（下一任注意）：
- toggle / table / tabs / sidebar 等仍有 `/50` 透明度、旧 `bg-muted` hover，未收敛
- 组件"场景示例"表（约 22 张）是否按"示例在前"调整，老李暂停未定

---

# 上一轮交接 — fx-ui Agent UI（背景参考）

> 新 AI 接手这轮工作，先读这里。

## 当前状态

- 当前做到：`AgentSurface` 已经作为单独的 `Agent UI` 组接入文档站；支持 `text`、`object-card`、`file-card`、`insight-card`、`action-row` 五类 block
- 当前阻塞：无
- 是否可继续：可以；当前适合继续做真实视觉风格、更多高频 block，或者开始设计 `action/context` 机制

## 本次已完成

- **Agent UI 协议落地**：新增 `docs/AGENT_UI.md`、`docs/data/agent-ui.manifest.json`、`scripts/check-agent-ui-contract.mjs`。已把 Agent UI 从“口头规则”变成“文字规范 + 机器事实 + 可执行检查”
- **AgentSurface 组件落地**：新增 `src/components/fx/agent-surface.tsx`，当前 block 白名单：
  - `text`
  - `object-card`
  - `file-card`
  - `insight-card`
  - `action-row`
- **Agent UI 视觉规范**：新增 `docs/AGENT_UI_VISUAL.md` 和 `docs/data/agent-ui-visual.manifest.json`
  - 关键原则：`视觉气质参考 C 端，底层能力仍用 fx-ui`
  - 不是另起一套设计系统，仍吃 `fx-ui token + shadcn + src/components/fx`
- **高频场景矩阵**：Agent UI 已梳理 phase-1 / phase-2 场景
  - phase-1：对象信息、文件信息、建议/结论、操作区
  - phase-2：任务/待办、多对象列表、风险/警告、进度状态
- **AgentSurface 页面接入**：`src/App.tsx` 已有独立页面和右侧目录，内容包括：
  - 组件总览
  - 高频场景
  - 视觉规范
  - Mock 预览
  - 实时示例
  - JSON 协议
  - 协议取舍
  - 安全边界
- **Mock Playground**：当前页面 `#agent-surface` 已经支持左侧粘贴 / 编辑 mock JSON，右侧实时渲染真实 `AgentSurface`
  - JSON 错误时显示错误
  - 未知 block 走安全兜底
  - 按钮事件进入事件日志
- **action/context 已记账**：当前没有实现页面上下文和动作注册，只是明确记入后续队列

## 关键文件

- `src/components/fx/agent-surface.tsx`
  AgentSurface 真实源码和 block 白名单
- `src/App.tsx`
  AgentSurface 页面、Mock Playground、实时示例
- `docs/AGENT_UI.md`
  Agent UI 协议、block 说明、高频场景、后续队列
- `docs/AGENT_UI_VISUAL.md`
  Agent UI 视觉规范，强调“参考 C 端、底层仍用 fx-ui”
- `docs/components/fx-agent-surface.md`
  AgentSurface 组件文档
- `docs/data/agent-ui.manifest.json`
  Agent UI 机器事实表
- `docs/data/agent-ui-visual.manifest.json`
  Agent UI 视觉机器事实表
- `docs/data/governance-status.json`
  已记录 `agent-action-context` 为 `queued`
- `scripts/check-agent-ui-contract.mjs`
  Agent UI 检查脚本

## 风险与边界

- `theme/fx-theme.css` 是 token 真相源，动它就是全局换肤
- Agent UI 当前是**轻协议**，不是完整产品运行时
  - 当前只做到：`onAction({ surfaceId, event, payload })`
  - 还没做到：页面上下文、动作注册表、宿主 action、human-in-the-loop
- 组件样式目前仍偏“规则面板”，还没有进入用户想要的更强 C 端化真实风格
- 场景矩阵当前已经从“8 张同质卡”改成 phase-1 / phase-2 分组，但真实组件视觉风格还没正式重做

## 下一步建议

1. **优先做真实视觉方向**
   把 `AgentSurface` 改成更 C 端的数据卡 / 助理看板风格，而不是当前偏治理说明页的样子
2. **新增候选 block**
   如果继续扩展，最值得优先讨论的是：
   - `metric-card`
   - `task-card`
   - `result-list`
3. **再进入 action/context**
   这块已经登记，但建议等视觉和高频 block 稳住后再做

## 检查

- 当前最小检查：`npm run check:agent-ui`
- 当前总检查：`npm run check`
- 本轮最后一次已跑：`npm run check:agent-ui` 通过

## 给下一任模型的开场提示词

可以直接把下面这段交给下一任模型：

```txt
你正在接手 fx-ui 的 Agent UI 工作，请先读 HANDOFF.md、AGENTS.md、docs/AGENT_UI.md、docs/AGENT_UI_VISUAL.md。

当前状态：
1. AgentSurface 已落地，源码在 src/components/fx/agent-surface.tsx
2. 当前支持 5 个 block：text、object-card、file-card、insight-card、action-row
3. 文档站页面在 src/App.tsx，#agent-surface 页面已有 Mock Playground
4. Agent UI 当前是轻协议：只做安全渲染和 onAction 事件回传
5. action/context 机制还没做，只在 docs/data/governance-status.json 里记为 queued

本轮优先方向：
- 优先做更 C 端化的真实 Agent 卡片样式
- 或扩展新的高频 block（metric-card / task-card / result-list）
- 不要直接进入重协议或复杂运行时

规则：
- 不手写基础组件，继续用 shadcn open-code
- 不改 dist
- 改完运行 npm run check
```
