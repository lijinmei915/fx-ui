import { Toaster as Sonner, type ToasterProps } from "sonner"

import { CheckCircleIcon, InfoIcon, AlertTriangleIcon, XCircleIcon, Loader2Icon } from "@/lib/icons"

// fx-ui 当前只做浅色（暗色以后另定，见 DEC-005），不接 next-themes。
// 浮层阴影走公司档 shadow-l1；圆角/颜色走语义 token。
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <AlertTriangleIcon className="size-4" />,
        error: <XCircleIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-lg)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast shadow-l1",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
