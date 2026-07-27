import type { ReactNode } from "react"

type PageHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
}

function PageHeader({ title, description, eyebrow, actions }: PageHeaderProps) {
  return (
    <header data-slot="page-header" className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 space-y-1">
        {eyebrow ? (
          <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="text-xl font-semibold leading-tight text-foreground">{title}</h1>
        {description ? (
          <p className="max-w-3xl text-base leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}

export { PageHeader }
