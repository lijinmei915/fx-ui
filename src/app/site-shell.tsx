import type { CSSProperties, ReactNode } from "react"

type DocsSiteShellProps = {
  motion: string
  runtimeStyle: CSSProperties
  children: ReactNode
}

export function DocsSiteShell({ motion, runtimeStyle, children }: DocsSiteShellProps) {
  return <div
    className="h-dvh overflow-hidden bg-background text-foreground"
    data-theme-motion={motion}
    style={runtimeStyle}>
    {children}
  </div>
}
