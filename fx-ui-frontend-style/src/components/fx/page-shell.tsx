import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageShellProps = {
  children: ReactNode
  className?: string
}

function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn("min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">{children}</div>
    </main>
  )
}

export { PageShell }
