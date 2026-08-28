import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Tag 标签：行内的状态/分类小药丸（Ant Tag 模型）。
//  - variant：状态语义（success/warning/destructive…）
//  - color：分类打标多彩预设色（蓝/绿/紫…），软色样式 = base-10 浅底 + base-80 彩字 + base-30 描边；颜色=类别不是状态
// variant 与 color 是两条正交轴；同时给时 color 覆盖配色。角标红点/数字请用 Badge。
const tagVariants = cva(
  "group/tag inline-flex h-[calc(var(--fds-g-sizing-control-block-xs)-4px)] w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-[calc(var(--fds-g-spacing-control-inline-xs)+2px)] py-0.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary-hover",
        soft:
          "rounded-sm border-border bg-secondary text-secondary-foreground [a]:hover:bg-secondary-hover",
        destructive:
          "bg-destructive-light text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive-light-hover",
        success:
          "bg-success-light text-success focus-visible:ring-success/20 dark:bg-success/20 dark:focus-visible:ring-success/40 [a]:hover:bg-success-light-hover",
        warning:
          "bg-warning-light text-warning focus-visible:ring-warning/20 dark:bg-warning/20 dark:focus-visible:ring-warning/40 [a]:hover:bg-warning-light-hover",
        outline:
          "border-border text-foreground [a]:hover:bg-muted-hover [a]:hover:text-muted-foreground",
      },
      // 分类打标预设色由组件内部静态引用 FDS Map；不是可覆盖的 Component Hook。
      color: {
        none: "",
        gray: "border-[var(--fds-g-color-neutral-base-40)] bg-[var(--fds-g-color-neutral-base-30)] text-foreground-secondary",
        red: "border-[var(--fds-g-color-red-base-30)] bg-[var(--fds-g-color-red-base-10)] text-[var(--fds-g-color-red-base-80)]",
        amber: "border-[var(--fds-g-color-amber-base-30)] bg-[var(--fds-g-color-amber-base-10)] text-[var(--fds-g-color-amber-base-80)]",
        yellow: "border-[var(--fds-g-color-yellow-base-30)] bg-[var(--fds-g-color-yellow-base-10)] text-[var(--fds-g-color-yellow-base-80)]",
        lime: "border-[var(--fds-g-color-lime-base-30)] bg-[var(--fds-g-color-lime-base-10)] text-[var(--fds-g-color-lime-base-80)]",
        green: "border-[var(--fds-g-color-green-base-30)] bg-[var(--fds-g-color-green-base-10)] text-[var(--fds-g-color-green-base-80)]",
        teal: "border-[var(--fds-g-color-teal-base-30)] bg-[var(--fds-g-color-teal-base-10)] text-[var(--fds-g-color-teal-base-80)]",
        cyan: "border-[var(--fds-g-color-cyan-base-30)] bg-[var(--fds-g-color-cyan-base-10)] text-[var(--fds-g-color-cyan-base-80)]",
        blue: "border-[var(--fds-g-color-blue-base-30)] bg-[var(--fds-g-color-blue-base-10)] text-[var(--fds-g-color-blue-base-80)]",
        purple: "border-[var(--fds-g-color-purple-base-30)] bg-[var(--fds-g-color-purple-base-10)] text-[var(--fds-g-color-purple-base-80)]",
        pink: "border-[var(--fds-g-color-pink-base-30)] bg-[var(--fds-g-color-pink-base-10)] text-[var(--fds-g-color-pink-base-80)]",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "none",
    },
  }
)

function Tag({
  className,
  variant = "default",
  color = "none",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof tagVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(tagVariants({ variant, color }), className),
      },
      props
    ),
    render,
    state: {
      slot: "tag",
      variant,
      color,
    },
  })
}

export { Tag, tagVariants }
