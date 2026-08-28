---
layer: knowledge
type: guide
last_verified: 2026-08-28
teaches: "FDS 基础规范、组件规范与页面规范的统一人读入口"
use_when: "不确定应该查基础、组件还是页面规范时"
---

# FDS 文档索引

> 本页只做导航，不复制规则、Token 数值或组件 API。结构事实仍由各领域 manifest 维护。

## 基础规范

- [Token 架构与治理](TOKENS.md)
- [颜色](foundations/colors.md) · [排版](foundations/typography.md) · [圆角](foundations/radius.md)
- [间距与尺寸](foundations/spacing.md) · [阴影](foundations/shadow.md) · [动效](foundations/motion.md) · [层级](foundations/layer.md)
- [图标](foundations/icons.md) · [栅格](foundations/grid.md) · [布局](foundations/layout.md)

## 组件规范

- [组件文档说明与索引](components/README.md)
- 组件真实 API 以 `src/components/{ui,fx}/` 源码为准，结构合同由 `docs/data/components.manifest.json` 维护。

## 页面规范

- [页面规范索引](pages/README.md)
- [页面装配流程](PAGES.md) · [报告渲染规范](REPORTS.md)
- 页面类型语义以 `docs/data/page-semantics.manifest.json` 为准，已验证骨架以 `docs/data/page-build-kit.manifest.json` 为准。

## 治理与交付

- [仓库地图](MAP.md) · [文档分工](DOCUMENTATION.md) · [Token 命名](TOKEN_NAMING.md)
- [跨框架交付](FRAMEWORK_ADAPTERS.md) · [检查与验收](TESTING.md)
