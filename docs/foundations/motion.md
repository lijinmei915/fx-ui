---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "FDS 动效时长、曲线与状态驱动规则"
use_when: "查询组件进入退出动效、时长或缓动曲线时"
---

# FDS 动效规范

> 本文是 FDS Foundation 专题说明；数值与映射的唯一真相源仍是 `tokens/source/*.tokens.json`。总览见 [设计 Token](../TOKENS.md)，统一目录见 [FDS 文档索引](../INDEX.md)。

## 动效

动效的基础层提供 `--fx-duration-*` 与 `--fx-ease-*` 数值档；各框架适配层将这些档位映射到组件的进入、退出和状态过渡。基础档不规定哪个组件必须使用哪一档，具体映射属于组件或运行时契约。

**规则**：时长短促（**100–200ms**，小浮层快、位移大的稍慢，界面动效是反馈不是表演）；进入/退出**状态驱动**（`data-open`/`data-closed`/`data-state`，不手动计时）；用 `tw-animate-css` 工具类组合 `fade`/`zoom`/`slide`，不为单页临时写关键帧。

| 基础 Token / Utility | 使用场景 |
|----------------------|----------|
| `--fx-duration-75/100/150/200/300/500/700/1000` | 完整时间刻度；组件只映射真实需要的档位 |
| `--fx-ease-linear/in/out/in-out` | 数学缓动曲线，不包含业务意图 |
| `duration-100/150/200` | 当前框架适配器的常用 Tailwind 调用 |
| `animate-in` / `animate-out` | 基于状态的浮层显隐 |
| `fade` / `zoom` / `slide` | 浮层常用组合，不为单页临时发明动画 |
