import type { DevInspectorConfigOverrides } from "@lijinmei-810/dev-inspector"
import { SearchIcon } from "@/lib/icons"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export const devInspectorConfig: DevInspectorConfigOverrides = {
  componentPreviews: [
    {
      type: "Button",
      label: "按钮",
      category: "action",
      summary: "用于触发即时操作，源码来自 shadcn/ui。",
      selector: '[data-component="Button"]',
      variants: [
        {
          id: "button-default",
          label: "Default",
          group: "Variant",
          propsLabel: "variant=default / size=default",
          selector:
            '[data-component="Button"][data-variant="default"][data-size="default"]',
          usage: "页面主操作、保存、提交。",
          capabilities: ["点击", "hover", "active", "focus-visible", "disabled"],
          tokenRefs: ["--primary", "--primary-foreground", "--ring"],
          render: () => <Button>保存</Button>,
        },
        {
          id: "button-outline",
          label: "Outline",
          group: "Variant",
          propsLabel: "variant=outline / size=default",
          selector:
            '[data-component="Button"][data-variant="outline"][data-size="default"]',
          usage: "次要操作和工具操作。",
          capabilities: ["点击", "hover", "aria-expanded", "focus-visible"],
          tokenRefs: ["--border", "--background", "--muted", "--ring"],
          render: () => <Button variant="outline">筛选</Button>,
        },
        {
          id: "button-secondary",
          label: "Secondary",
          group: "Variant",
          propsLabel: "variant=secondary / size=default",
          selector:
            '[data-component="Button"][data-variant="secondary"][data-size="default"]',
          usage: "与主操作并列的次级操作。",
          capabilities: ["点击", "hover", "aria-expanded", "focus-visible"],
          tokenRefs: ["--secondary", "--secondary-foreground", "--ring"],
          render: () => <Button variant="secondary">取消</Button>,
        },
        {
          id: "button-ghost",
          label: "Ghost",
          group: "Variant",
          propsLabel: "variant=ghost / size=default",
          selector:
            '[data-component="Button"][data-variant="ghost"][data-size="default"]',
          usage: "低强调度工具操作。",
          capabilities: ["点击", "hover", "aria-expanded", "focus-visible"],
          tokenRefs: ["--muted", "--foreground", "--ring"],
          render: () => <Button variant="ghost">更多</Button>,
        },
        {
          id: "button-destructive",
          label: "Destructive",
          group: "Variant",
          propsLabel: "variant=destructive / size=default",
          selector:
            '[data-component="Button"][data-variant="destructive"][data-size="default"]',
          usage: "删除等危险、不可逆操作。",
          capabilities: ["点击", "hover", "focus-visible", "disabled"],
          tokenRefs: ["--destructive", "--ring"],
          render: () => <Button variant="destructive">删除项目</Button>,
        },
        {
          id: "button-link",
          label: "Link",
          group: "Variant",
          propsLabel: "variant=link / size=default",
          selector:
            '[data-component="Button"][data-variant="link"][data-size="default"]',
          usage: "轻量跳转或查看文档。",
          capabilities: ["点击", "hover", "focus-visible"],
          tokenRefs: ["--primary", "--ring"],
          render: () => <Button variant="link">打开文档</Button>,
        },
        ...(["xs", "sm", "default", "lg"] as const).map((size) => ({
          id: `button-size-${size}`,
          label: size === "default" ? "Default" : size.toUpperCase(),
          group: "Size",
          propsLabel: `variant=default / size=${size}`,
          selector: `[data-component="Button"][data-variant="default"][data-size="${size}"]`,
          usage: "按页面密度选择按钮尺寸。",
          capabilities: ["尺寸", "点击", "focus-visible"],
          tokenRefs: ["--radius", "--primary", "--ring"],
          render: () => <Button size={size}>{size === "default" ? "提交" : size.toUpperCase()}</Button>,
        })),
        ...(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => ({
          id: `button-size-${size}`,
          label: size,
          group: "Icon Size",
          propsLabel: `variant=default / size=${size} / aria-label`,
          selector: `[data-component="Button"][data-variant="default"][data-size="${size}"]`,
          usage: "纯图标操作必须提供 aria-label。",
          capabilities: ["图标", "尺寸", "aria-label", "focus-visible"],
          tokenRefs: ["--radius", "--primary", "--ring"],
          render: () => (
            <Button size={size} aria-label="搜索">
              <SearchIcon data-icon="inline-start" />
            </Button>
          ),
        })),
        {
          id: "button-disabled",
          label: "Disabled",
          group: "State",
          propsLabel: "disabled",
          usage: "组件原生禁用状态。",
          capabilities: ["disabled"],
          tokenRefs: ["--primary"],
          status: "native-state",
          render: () => <Button disabled>禁用</Button>,
        },
        {
          id: "button-loading",
          label: "Loading",
          group: "State",
          propsLabel: "disabled + Spinner",
          usage: "业务组合态；Button 没有 loading prop。",
          capabilities: ["disabled", "Spinner", "业务组合态"],
          tokenRefs: ["--primary"],
          status: "composed-state",
          render: () => (
            <Button disabled>
              <Spinner data-icon="inline-start" />
              提交中
            </Button>
          ),
        },
      ],
    },
  ],
}
