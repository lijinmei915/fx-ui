---
category: Components
group: 业务组合组件
title: PeoplePicker
subtitle: 选人下拉菜单
description: 人员与组织的检索、多选、下钻和收藏面板。
source: src/components/fx/people-picker.tsx
theme: theme/fx-theme.css
status: complete
---

# PeoplePicker 选人下拉菜单

PeoplePicker 是由 Combobox、InputGroup、Tabs、Checkbox、Avatar、ScrollArea 和 Button 组成的 fx 组合组件。参考 Figma `11903:38614`，但颜色、边框、圆角、阴影和交互态全部映射到 fx-ui 语义 token。

Figma 实时属性为 `场景：部门 / 人员 / 最近` 与 `尺寸：normal / medium`。代码中场景映射为真实 `activeTab/defaultTab`，尺寸保留为 `size`；悬浮、选中、搜索、收藏、下钻与包含子部门均由真实交互和数据生成。

## 来源 {#source}

`src/components/fx/people-picker.tsx`

## 使用方式 {#usage}

```tsx
<PeoplePicker
  items={items}
  value={selectedIds}
  onValueChange={(ids) => setSelectedIds(ids)}
  defaultTab="recent"
/>
```

## 组件总览 {#overview}

- `normal`：342 × 488px；`medium`：618 × 488px。
- 搜索控件 32px；列表行 48px；人员头像使用 Avatar 默认 32px。
- 支持最近、同事、部门、合伙人和用户组，支持全选、组织下钻、人员收藏与包含子部门。
- 图片资源来自 Figma 原始头像导出；非人员类型使用项目 Tabler 图标。

## API {#api}

以 `src/components/fx/people-picker.tsx#PeoplePickerProps` 为真实契约。组件支持 value/query/activeTab/includeDescendants 的受控与非受控模式；远程搜索、组织树加载、权限和数据持久化由调用方处理。

## Semantic DOM {#semantic-dom}

根节点为 `data-slot="people-picker"`，搜索、工具栏与部门页脚分别为 `people-picker-search`、`people-picker-toolbar`、`people-picker-footer`。

## 主题变量 Design Token {#design-token}

使用 `--popover`、`--popover-foreground`、`--foreground`、`--muted`、`--muted-foreground`、`--border`、`--primary` 与 `--ring`，不复制 Figma 十六进制色值。

## AI Rules {#ai-rules}

- 场景使用 activeTab/defaultTab，不新增视觉 scene/mode prop。
- 人员头像用 Avatar；组织、部门、搜索、收藏和箭头只从 `@/lib/icons` 导入。
- `className` 只用于根节点定位和外部布局，不覆盖组件视觉。
- 业务接口、权限与远程加载留给调用方。
