# ColorPicker 颜色选择器

ColorPicker 是 `fx` 组合组件，复用 Popover、Button、Select、Input，并由 `react-colorful` 提供成熟的色域、色相与透明度交互。

## 真相源

- API：`src/components/fx/color-picker.tsx`
- Playground：`docs/data/component-playgrounds.manifest.json#customPlaygrounds.colorPicker`
- 决策：`docs/DECISIONS.md#dec-063-colorpicker-以成熟颜色引擎组合为-fx-组件`

## 使用规则

- `value/defaultValue` 接收 CSS 颜色，点击“确定”后通过 `onValueChange/onConfirm` 提交。
- Figma 的预览、吸色器、透明度、格式、最近色、预设色与触发器文案映射为真实 props 和数据。
- 最近色最多一行 10 个；预设色超过四行滚动。
- 动态色值允许作为内联数据样式，组件外观只使用 fx-ui 语义 token。

## 可访问性

触发器、吸色器、色块与输入框均提供原生键盘焦点和可访问名称；浏览器不支持 EyeDropper API 时吸色器按钮禁用。
