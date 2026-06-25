import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1 rounded-md border border-transparent bg-clip-padding text-sm font-normal whitespace-nowrap transition-colors outline-none select-none cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground enabled:hover:bg-primary-hover enabled:active:bg-primary-active disabled:bg-primary-disabled disabled:text-primary-foreground",
        outline:
          "border-border bg-surface enabled:hover:bg-muted enabled:hover:text-foreground enabled:active:bg-muted-hover aria-expanded:bg-muted aria-expanded:text-foreground disabled:border-border-subtle disabled:bg-surface-disabled disabled:text-foreground-disabled dark:border-input dark:bg-input/30 dark:enabled:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground enabled:hover:bg-secondary-hover enabled:active:bg-secondary-active aria-expanded:bg-secondary aria-expanded:text-secondary-foreground disabled:text-foreground-disabled",
        ghost:
          "enabled:hover:bg-muted enabled:hover:text-foreground enabled:active:bg-muted-hover aria-expanded:bg-muted aria-expanded:text-foreground disabled:text-foreground-disabled dark:enabled:hover:bg-muted/50",
        destructive:
          "bg-destructive-light text-destructive enabled:hover:bg-destructive-light-hover enabled:active:bg-destructive-light-active focus-visible:border-destructive/40 focus-visible:ring-destructive/20 disabled:bg-destructive-light disabled:text-destructive-disabled dark:bg-destructive/20 dark:enabled:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        // 无底色按钮（文字/图标/图标+文字）：无边框无底色，hover 只变色不变底。跳转/链接用独立 Link 组件，Button 不提供 link 变体。
        // 行内文字操作：上下左右内边距全为 0、高度贴文字；纯图标(size=icon-*)保留方形热区。默认中性 hover 变主题色，配合 tone 分色。
        plain: "text-foreground enabled:hover:text-primary enabled:active:text-primary-active disabled:text-foreground-disabled not-data-[size^=icon]:h-auto not-data-[size^=icon]:px-0 not-data-[size^=icon]:has-data-[icon=inline-end]:pr-0 not-data-[size^=icon]:has-data-[icon=inline-start]:pl-0",
      },
      // 仅作用于无底色 plain：按语义分色（默认中性 / 主色 / 蓝 info / 危险），见 compoundVariants
      // info(蓝)用于"企业不想用品牌橙、改用蓝做文字按钮"，是纯色操作按钮，不是跳转链接
      tone: {
        default: "",
        primary: "",
        info: "",
        danger: "",
      },
      size: {
        default:
          "h-8 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2 text-fx-12 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-fx-13 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 px-4 text-base has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-9",
      },
    },
    compoundVariants: [
      // plain（无底色、hover 只变色）：色随 tone，hover 加深
      { variant: "plain", tone: "primary", className: "text-primary enabled:hover:text-primary-hover enabled:active:text-primary-active disabled:text-primary-disabled" },
      { variant: "plain", tone: "info", className: "text-info enabled:hover:text-info-hover enabled:active:text-info-active disabled:text-info-disabled" },
      { variant: "plain", tone: "danger", className: "text-destructive enabled:hover:text-destructive-hover enabled:active:text-destructive-active disabled:text-destructive-disabled" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      tone: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  tone = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-component="Button"
      data-slot="button"
      data-size={size}
      data-variant={variant}
      data-tone={tone}
      className={cn(buttonVariants({ variant, size, tone, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
