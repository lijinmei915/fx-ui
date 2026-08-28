---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "FDS z-index 数值档与运行时层级边界"
use_when: "查询页面、固定头部、局部热区或弹层层级时"
---

# FDS 层级规范

> 本文是 FDS Foundation 专题说明；数值与映射的唯一真相源仍是 `tokens/source/*.tokens.json`。总览见 [设计 Token](../TOKENS.md)，统一目录见 [FDS 文档索引](../INDEX.md)。

## 层级

基础层提供 `--fx-z-0/10/20/30/40/50` 数值档；层级语义由每个运行时在自己的 stacking context 内映射。Dashboard、Report 和工作台可以有不同的容器与渲染机制，但只能从同一数值档选择，不能不断发明更大的数字。

**分层逻辑**：从低到高——页面内容 → 局部控件(10–20) → 固定/吸顶头部(40) → 弹层(50)，数字越大越靠近用户、压在越上面。所有弹层（对话框/下拉/气泡/抽屉/提示框）都用最高一档 `z-50`，谁后打开谁在上，不靠更大数字。万一被挡住，归到现有档，**别编更大的数字**（否则越堆越乱）。

| 基础 Token | 当前 React 映射 | 使用场景 |
|------|------|----------|
| `--fx-z-0` | `z-0` | 默认 stacking context 起点 |
| `--fx-z-10` | `z-10` | 局部控件内部层级，例如 Avatar 状态点、Calendar 范围态 |
| `--fx-z-20` | `z-20` | Sidebar 拖拽手柄等局部交互热区 |
| `--fx-z-30` | `z-30` | 为运行时局部浮动层保留，不直接绑定页面类型 |
| `--fx-z-40` | `z-40` | 固定 Header、文档顶部导航 |
| `--fx-z-50` | `z-50` | Dialog、Dropdown、Popover、Sheet、Tooltip 等浮层 |
