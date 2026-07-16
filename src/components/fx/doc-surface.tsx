import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"

function DocSurfaceCard({ className, ...props }: ComponentProps<typeof WebsiteCardContainer>) {
  return <WebsiteCardContainer className={cn(className)} {...props} />
}

function DocSurfaceTableCard({
  className,
  ...props
}: ComponentProps<typeof WebsiteCardContainer>) {
  return (
    <DocSurfaceCard
      className={cn("max-w-full overflow-x-auto py-0", className)}
      {...props}
    />
  )
}

export { DocSurfaceCard, DocSurfaceTableCard }
