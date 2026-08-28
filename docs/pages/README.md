---
layer: knowledge
type: guide
last_verified: 2026-08-28
teaches: "FDS 页面类型规范的状态、真相源与文档入口"
use_when: "要查列表、详情、表单、Dashboard、Report 或搭建器页面规范时"
---

# FDS 页面规范索引

> 页面规范只记录已验证页面类型的角色、Block 和装配边界；不复制 Foundation 数值或组件 API。

## 已就绪页面类型

| 类型 | 机器真相源 | 人读入口 |
|------|----------------|----------|
| 列表页 | `page-semantics#list` + `page-build-kit#list` | [页面装配流程](../PAGES.md) |
| 详情页 | `page-semantics#detail` + `page-build-kit#detail` | [页面装配流程](../PAGES.md) |
| 编辑表单页 | `page-semantics#form` + `page-build-kit#form` | [页面装配流程](../PAGES.md) |
| 搭建器 | `page-semantics#builder` + `page-builder.manifest.json` | [页面装配流程](../PAGES.md) |
| Report 报告 | `REPORTS.md` 的渲染与数据合同 | [报告渲染规范](../REPORTS.md) |

## 规划中页面类型

Dashboard、认证页和设置页仍为 `planned`；先沉淀真实 Block 和 Build Kit，再建立各自的 Markdown 规范，不提前创建空契约。

## 页面规范边界

- 基础数值查 [Foundation 专题](../INDEX.md#基础规范)。
- 组件 API 查 [组件文档](../components/README.md)。
- 页面类型只负责角色、布局、Block 选择和组装约束。
