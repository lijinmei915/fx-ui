import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// 进度条：完成度 / 上传 / 跟进进度等线性进度。轨道走 muted、填充按 tone 切语义色，全部 token。
// 取值受控（value 0–max，max 默认 100）；填充宽度由 base-ui 按百分比自动设置。
const progressIndicatorVariants = cva(
  "h-full rounded-full transition-[width] duration-300 ease-out",
  {
    variants: {
      tone: {
        default: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        danger: "bg-destructive",
      },
    },
    defaultVariants: { tone: "default" },
  }
)

function Progress({
  value,
  max = 100,
  tone,
  className,
  trackClassName,
  ...props
}: Omit<ProgressPrimitive.Root.Props, "render"> &
  VariantProps<typeof progressIndicatorVariants> & {
    trackClassName?: string
  }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn("w-full", className)}
      {...props}
    >
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted", trackClassName)}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={progressIndicatorVariants({ tone })}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress, progressIndicatorVariants }
