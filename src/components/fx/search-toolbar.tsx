import type { ReactNode } from "react"

import { CardContent } from "@/components/ui/card"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"

type SearchToolbarProps = {
  children: ReactNode
  actions?: ReactNode
}

function SearchToolbar({ children, actions }: SearchToolbarProps) {
  return (
    <WebsiteCardContainer data-slot="search-toolbar">
      <CardContent>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
          {actions ? <div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div> : null}
        </div>
      </CardContent>
    </WebsiteCardContainer>
  )
}

export { SearchToolbar }
