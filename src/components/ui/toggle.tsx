import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-(--fx-control-gap-tight) rounded-lg text-base font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted",
      },
      size: {
        default:
          "h-(--fx-control-sm-height) min-w-(--fx-control-sm-height) px-(--fx-control-px-sm) has-data-[icon=inline-end]:pr-[calc(var(--fx-control-px-sm)-2px)] has-data-[icon=inline-start]:pl-[calc(var(--fx-control-px-sm)-2px)]",
        sm: "h-(--fx-control-xs-height) min-w-(--fx-control-xs-height) rounded-[min(var(--radius-md),12px)] px-(--fx-control-px-xs) text-sm has-data-[icon=inline-end]:pr-[calc(var(--fx-control-px-xs)-2px)] has-data-[icon=inline-start]:pl-[calc(var(--fx-control-px-xs)-2px)] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-(--fx-control-md-height) min-w-(--fx-control-md-height) px-(--fx-control-px-md) has-data-[icon=inline-end]:pr-[calc(var(--fx-control-px-md)-2px)] has-data-[icon=inline-start]:pl-[calc(var(--fx-control-px-md)-2px)]",
        // 方形纯图标档（与 Button icon-sm 一致 28×28、14px 图标）：图标工具栏/视图切换用，选中底是正方块不偏宽
        "icon-sm": "size-(--fx-control-icon-sm) px-0 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
