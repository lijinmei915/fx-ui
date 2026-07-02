import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Tag 标签：行内的状态/分类小药丸（Ant Tag 模型）。
//  - variant：状态语义（success/warning/destructive…）
//  - color：分类打标多彩预设色（蓝/绿/紫…），软色样式 = 浅底(01) + 彩字(07) + 描边(03)；颜色=类别不是状态
// variant 与 color 是两条正交轴；同时给时 color 覆盖配色。角标红点/数字请用 Badge。
const tagVariants = cva(
  "group/tag inline-flex h-[calc(var(--fx-control-xs-height)-4px)] w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-[calc(var(--fx-control-px-xs)+2px)] py-0.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary-hover",
        destructive:
          "bg-destructive-light text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive-light-hover",
        success:
          "bg-success-light text-success focus-visible:ring-success/20 dark:bg-success/20 dark:focus-visible:ring-success/40 [a]:hover:bg-success-light-hover",
        warning:
          "bg-warning-light text-warning focus-visible:ring-warning/20 dark:bg-warning/20 dark:focus-visible:ring-warning/40 [a]:hover:bg-warning-light-hover",
        outline:
          "border-border text-foreground [a]:hover:bg-muted-hover [a]:hover:text-muted-foreground",
      },
      // 分类打标预设色（软色：浅底 + 深一档彩字 + 描边），全取自 13 色板阶
      color: {
        none: "",
        gray: "border-[var(--fx-neutrals-04)] bg-[var(--fx-neutrals-03)] text-foreground-secondary",
        red: "border-[var(--fx-red-03)] bg-[var(--fx-red-01)] text-[var(--fx-red-08)]",
        amber: "border-[var(--fx-amber-03)] bg-[var(--fx-amber-01)] text-[var(--fx-amber-08)]",
        yellow: "border-[var(--fx-yellow-03)] bg-[var(--fx-yellow-01)] text-[var(--fx-yellow-08)]",
        lime: "border-[var(--fx-lime-03)] bg-[var(--fx-lime-01)] text-[var(--fx-lime-08)]",
        green: "border-[var(--fx-green-03)] bg-[var(--fx-green-01)] text-[var(--fx-green-08)]",
        teal: "border-[var(--fx-teal-03)] bg-[var(--fx-teal-01)] text-[var(--fx-teal-08)]",
        cyan: "border-[var(--fx-cyan-03)] bg-[var(--fx-cyan-01)] text-[var(--fx-cyan-08)]",
        blue: "border-[var(--fx-blue-03)] bg-[var(--fx-blue-01)] text-[var(--fx-blue-08)]",
        purple: "border-[var(--fx-purple-03)] bg-[var(--fx-purple-01)] text-[var(--fx-purple-08)]",
        pink: "border-[var(--fx-pink-03)] bg-[var(--fx-pink-01)] text-[var(--fx-pink-08)]",
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
