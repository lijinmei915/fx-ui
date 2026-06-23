---
layer: knowledge
type: spec
last_verified: 2026-06-23
teaches: "fx-ui 怎么验收一次改动——文档是否健康、AI 行为是否守规矩、设计是否一致"
use_when: "完成一次主要改动后，收尾前过一遍这份 checklist"
---

# 测试与验收

> 用途：定义验收标准和收尾检查。
> fx-ui 是纯前端组件文档站，没有后端 API、没有复杂业务逻辑——
> 传统的单元/端到端/API 三层测试在这里基本用不上，验收的重点是
> "文档是否健康、AI 有没有杜撰、UI 是否符合设计规范"。

---

## 验收分层

### 1. 构建检查

```bash
npm run check        # 契约 + token 漂移 + 文档站骨架 + 构建
npm run check:shadcn # 单独跑 shadcn contract 检查
npm run check:tokens # 单独跑 token 漂移检查
npm run check:doc-site # 单独跑文档站骨架契约检查
npm run check:components # 单独跑组件 manifest 检查
```

`check` 同时校验 shadcn 组件契约、token 漂移、文档站骨架契约、组件 manifest 和 TS/构建是否通过——这是 fx-ui 目前最接近"自动化测试"的命令。

### 2. 文档健康检查

确认核心文档存在且有实质内容（不是空模板/纯占位符）：
- `PROJECT.md` / `HANDOFF.md` / `PRODUCT.md` 是否与当前状态一致
- `docs/*` 是否残留 `未记录`、无解释的 `TODO`、`{{...}}` 占位符
- 改了代码结构后，`docs/ARCHITECTURE.md`、`docs/CODE_STRUCTURE.md` 是否需要同步

### 3. AI 行为验收 ★ 重点

确认 AI 协作时没有杜撰、没有跳过核实步骤——这条直接对应 `docs/LESSONS.md` LES-001/LES-002 踩过的坑：

- 给组件变体、API、属性命名或下定义前，是否先查了源码或官方文档确认其真实存在
- 涉及组件底层库（Base UI / Radix 等）时，是否先看了源码 import，而不是凭"生态通识"假设
- 用户说"跳过"或资料不全时，是否老实写"暂无/待补"，而不是编造一个"看起来合理"的答案
- 涉及不可逆操作（改 `theme/fx-theme.css`、git 操作）前，是否先给了改动计划等确认

### 4. 设计一致性

确认 UI 改动没有偏离设计规范：
- 改 UI 前是否查过 `docs/DESIGN_STANDARDS.md` / `docs/TOKENS.md`
- 颜色、圆角、间距是否走 token，而不是在组件里硬编码新值
- 新场景/新组件是否同步进了"组件总览"等汇总视图，避免出现 LES 记录过的"两处数据对不上"问题

### 5. 数据一致性（fx-ui 特有）

`src/App.tsx` 里"场景示例"和"组件总览"曾经因为分别维护而对不上数量，后来重构为从 `buttonScenarioExamples` 单一数据源派生（见 `docs/CHANGELOG.md` 2026-06-07 条目）。新增场景/变体时确认：
- 是否只改了一处数据源
- 总览矩阵是否自动跟着更新，而不是要手动同步两处

### 6. 治理防漂检查

长期规范应尽量形成“文字规范 + 机器事实表 + 可执行检查”：

- 文档站骨架：`docs/DOC_SITE_DESIGN.md` + `docs/data/doc-site.manifest.json` + `scripts/check-doc-site-contract.mjs`
- 组件事实：`docs/components/*.md` + `docs/data/components.manifest.json` + `scripts/check-components-manifest.mjs`
- token：`docs/TOKENS.md` + `docs/data/design-tokens.json` + `scripts/check-tokens-sync.sh`

如果新增了某条会被代码实现的规范，却没有机器事实表或检查脚本，要在收尾时明确说明它目前仍是软约束。

---

## 收尾最小检查

每次主要改动后确认：
- 改动是否符合 `PROJECT.md` 里的当前优先级
- UI 改动是否符合 `docs/DESIGN_STANDARDS.md`
- 是否跑了 `npm run check`
- 新增长期规范时，是否判断过需不需要机器事实表和检查脚本
- `HANDOFF.md` 的"下一步"是否需要更新
- 踩坑或杜撰被纠正后，是否更新了 `docs/LESSONS.md`

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/RUNBOOK.md` | 自检命令和故障处理 |
| `docs/LESSONS.md` | 验收中发现的杜撰/误判问题复盘 |
| `HANDOFF.md` | 验收结果影响交接状态 |
