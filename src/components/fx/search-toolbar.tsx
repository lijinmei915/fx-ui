import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"

type SearchToolbarProps = {
  children: ReactNode
  actions?: ReactNode
}

function SearchToolbar({ children, actions }: SearchToolbarProps) {
  return (
    <Card>
      <CardContent>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
          {actions ? <div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div> : null}
        </div>
      </CardContent>
    </Card>
  )
}

export { SearchToolbar }
