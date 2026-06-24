import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-fx-12 font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
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
        ghost:
          "hover:bg-muted-hover hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-link underline-offset-4 hover:text-link-hover hover:underline active:text-link-active",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

// 角标（通知红点 / 未读数字），符合主流 Badge 的 dot/count 用法：
//  - 传 children 时包裹元素并定位到右上角（头像、图标、按钮通用）；不传则独立内联渲染。
//  - count>max 显示「max+」；count<=0 默认不渲染（showZero 强制显示 0）。
function Indicator({
  dot = false,
  count,
  max = 99,
  showZero = false,
  tone = "destructive",
  className,
  children,
}: {
  dot?: boolean
  count?: number
  max?: number
  showZero?: boolean
  tone?: "destructive" | "primary"
  className?: string
  children?: React.ReactNode
}) {
  const show = dot || (typeof count === "number" && (count > 0 || showZero))
  const content = dot
    ? null
    : typeof count === "number"
      ? count > max
        ? `${max}+`
        : count
      : null
  const toneClass =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-destructive text-primary-foreground"
  const node = show ? (
    <span
      data-slot="indicator"
      className={cn(
        // 角标数字按主流惯例比正文更小（10px），是字号 token 体系外的刻意单点破例：
        // 通知数字塞进 16px 小角标，最小的 text-fx-12 也偏挤，故此处例外。
        "pointer-events-none z-10 inline-flex items-center justify-center rounded-full text-[10px] leading-none font-medium tabular-nums ring-2 ring-background select-none",
        dot ? "size-2" : "h-4 min-w-4 px-1",
        toneClass,
        // 中心锚定载体右上角顶点（参考 MUI/Ant）：任意宽度角标位置一致、向外对称展开，不越宽越内盖
        children ? "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" : "",
        className
      )}
    >
      {content}
    </span>
  ) : null
  if (!children) return node
  return (
    <span data-slot="indicator-root" className="relative inline-flex w-fit">
      {children}
      {node}
    </span>
  )
}

export { Badge, badgeVariants, Indicator }
