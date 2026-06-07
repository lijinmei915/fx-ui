---
layer: knowledge
type: log
last_verified: 2026-06-07
teaches: "fx-ui 重要的技术/协作决策记录：选了什么、放弃了什么、为什么"
use_when: "讨论某个方案前，先查这里是否已经讨论过、有结论"
---

# 架构决策记录

> 记录重要技术或协作决策，防止重复讨论。
> 跟 `docs/CHANGELOG.md` 的分工：这里记"为什么这么定"，CHANGELOG 记"改了什么"。

---

## 如何记录一条决策

```markdown
### DEC-XXX: 决策标题

- **日期**：YYYY-MM-DD
- **状态**：已决定 / 已废弃 / 讨论中
- **决定**：我们选择了 X
- **放弃**：考虑过 Y 和 Z，但没选
- **原因**：选 X 是因为……；不选 Y 是因为……
- **影响**：这个决定会影响到……
- **相关文件**：`path/to/file`
```

---

## 决策列表

### DEC-001: 基础组件一律从 shadcn 拉，不手写

- **日期**：2026-06-07（决策本身更早，此处补记）
- **状态**：已决定
- **决定**：所有基础控件（Button / Input / Dialog / Table 等）一律 `npx shadcn add` 拉取，不手写
- **放弃**：第一版曾尝试由 AI 手搓 CSS 模拟 shadcn 组件外观
- **原因**：手搓组件不仅样式难保真，AI 和工程师都读不懂它的结构和约束，后续维护成本高；shadcn 的 open-code 模式天然解决"组件可读可改"的需求
- **影响**：`src/components/ui/` 下所有文件都必须保持"CLI 拉取 + 可读源码"的状态，禁止手写新组件混入
- **相关文件**：`AGENTS.md`、`HANDOFF.md`（踩坑记录）、`src/components/ui/`

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/LESSONS.md` | 决策失误时转为教训记录 |
| `docs/ARCHITECTURE.md` | 架构决策影响系统结构 |
| `docs/CHANGELOG.md` | 决策落地后的变更记录 |
