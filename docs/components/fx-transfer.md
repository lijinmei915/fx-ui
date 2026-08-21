---
category: Components
group: 业务组合组件
title: Transfer
subtitle: 穿梭框
description: 在源列表与目标列表间批量移动数据。
source: src/components/fx/transfer.tsx
theme: theme/fx-theme.css
tokens:
  - surface
  - border
  - foreground
  - muted
  - accent
  - primary
  - ring
status: complete
---

# Transfer 穿梭框

Transfer 是由 shadcn `Checkbox`、`Input`、`Button`、`ScrollArea`、`Empty` 与 `Spinner` 组成的 fx 组合组件。shadcn registry 没有等价 Transfer；参考 Ant Design 的双栏信息架构和受控数据模型，但不复用其实现或 token。

## 来源 {#source}

```txt
src/components/fx/transfer.tsx
```

## 使用方式 {#usage}

```tsx
<Transfer
  dataSource={departments}
  targetKeys={selectedDepartmentKeys}
  onChange={setSelectedDepartmentKeys}
  showSearch
/>
```

## 实时属性 {#runtime-props}

- 选择：点击项或全选框更新左右 `selectedKeys`。
- 移动：向右或向左命令更新 `targetKeys`，并回调本次方向与移动键。
- 检索：`showSearch` 显示两侧查询框，输入时 `onSearch(direction, value)` 实时触发。
- 单向：`oneWay` 隐藏“移回源列表”命令。
- 状态：`disabled`、`loading`、`status="error|warning"` 均为运行态。

## API {#api}

以 `src/components/fx/transfer.tsx` 为真实 API。完整属性表见组件文档页的 API 区；核心为 `dataSource`、`targetKeys`、`selectedKeys`、`onChange`、`onSelectChange`、`showSearch`、`oneWay`、`loading` 和 `status`。

## Semantic DOM {#semantic-dom}

- `data-slot="transfer"`：根节点及运行态。
- `data-slot="transfer-list"`：左右列表，含 `data-direction`。
- `data-slot="transfer-actions"`：移动操作区。
- `data-slot="transfer-item"`：列表项。
- `data-slot="transfer-loading"` 与 `data-slot="transfer-empty"`：内容状态。

## AI Rules {#ai-rules}

- `dataSource` 每项必须提供唯一稳定的 `key`；最终选择统一由 `targetKeys` 保存。
- 复杂表格、树形和分页数据需单独沉淀为经过验证的组合能力，不扩张当前基础 API。
- `className` 仅用于根节点布局；不在调用处覆盖面板颜色、边框、圆角和内间距。
