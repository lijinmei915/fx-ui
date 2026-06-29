import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1 rounded-md border border-transparent bg-clip-padding text-sm font-normal whitespace-nowrap transition-colors outline-none select-none cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.15em]",
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
      // 双层：尺寸名是纯尺寸（xs24 / sm28 / md32 / lg36），不含「default」语义；
      // 「哪个是默认」由 defaultVariants 单独声明（= sm 28px，对齐公司 Figma 默认）。
      // 图标-文字大小关系：文字档不写 svg 尺寸，统一走 base 的 size-[1.15em]（图标=字号×1.15，各档自动成比例）。
      size: {
        xs: "h-6 gap-1 px-2 text-sm in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        sm: "h-7 gap-1 px-2.5 text-base in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        md: "h-8 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        lg: "h-9 gap-2 px-4 text-base has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        // 纯图标档：图标占满方形热区的比例由各档手控（脱离字号），不走 1.15em
        "icon-xs": "size-6 in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-7 in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-4",
        "icon-md": "size-8 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-9 [&_svg:not([class*='size-'])]:size-5",
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
      size: "sm",
      tone: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "sm",
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
