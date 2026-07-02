import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

function DocSurfaceCard({ className, elevated = false, ...props }: ComponentProps<typeof Card>) {
  return <Card className={cn("border-border-container", className)} elevated={elevated} {...props} />
}

function DocSurfaceTableCard({
  className,
  elevated = false,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <DocSurfaceCard
      className={cn("max-w-full overflow-x-auto py-0", className)}
      elevated={elevated}
      {...props}
    />
  )
}

export { DocSurfaceCard, DocSurfaceTableCard }
