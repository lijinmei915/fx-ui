import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const linkVariants = cva(
  "group/link inline-flex shrink-0 items-center gap-1 rounded-sm underline-offset-4 outline-none transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1em]",
  {
    variants: {
      // 链接语义色：默认/悬停/按下走 base/hover/active token；禁用态不响应 hover/active（not-data-disabled 守卫），仅降透明 + 禁止光标
      tone: {
        standard: "text-link not-data-disabled:hover:text-link-hover not-data-disabled:active:text-link-active",
        default: "text-foreground-secondary not-data-disabled:hover:text-primary not-data-disabled:active:text-primary-active",
        primary: "text-primary not-data-disabled:hover:text-primary-hover not-data-disabled:active:text-primary-active",
        success: "text-success not-data-disabled:hover:text-success-hover not-data-disabled:active:text-success-active",
        warning: "text-warning not-data-disabled:hover:text-warning-hover not-data-disabled:active:text-warning-active",
        danger: "text-destructive not-data-disabled:hover:text-destructive-hover not-data-disabled:active:text-destructive-active",
      },
      // 类型：基础文字链接（悬停出下划线）/ 下划线文字链接（常驻下划线）；禁用不出下划线
      underline: {
        hover: "not-data-disabled:hover:underline",
        always: "not-data-disabled:underline",
      },
      size: {
        sm: "text-fx-12",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      tone: "standard",
      underline: "hover",
      size: "default",
    },
  }
)

function Link({
  className,
  tone = "standard",
  underline = "hover",
  size = "default",
  disabled,
  tabIndex,
  href,
  ...props
}: React.ComponentProps<"a"> & VariantProps<typeof linkVariants> & { disabled?: boolean }) {
  return (
    <a
      data-component="Link"
      data-slot="link"
      data-tone={tone}
      data-underline={underline}
      data-size={size}
      data-disabled={disabled ? "" : undefined}
      aria-disabled={disabled || undefined}
      // 禁用时去掉 href 阻止跳转（保留 cursor-not-allowed 提示），并移出 tab 序
      href={disabled ? undefined : href}
      tabIndex={disabled ? -1 : tabIndex}
      className={cn(linkVariants({ tone, underline, size, className }))}
      {...props}
    />
  )
}

export { Link, linkVariants }
