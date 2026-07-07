import { Fragment, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageLeadProps = {
  crumb: string
  title: string
  titleMeta?: string
  lead: ReactNode
  actions: ReactNode
}

const pageLeadSlots = {
  root: "grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-start",
  content: "min-w-0",
  crumb: "mb-3 flex gap-2 text-sm font-normal text-muted-foreground",
  crumbCurrent: "font-medium text-foreground",
  titleRow: "flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1",
  title: "text-3xl font-medium tracking-tight text-foreground",
  titleMeta: "text-lg font-medium text-muted-foreground",
  lead: "text-base font-normal text-muted-foreground md:col-span-2",
  actions: "shrink-0 md:justify-self-end md:pt-0",
}

function PageLead({ crumb, title, titleMeta, lead, actions }: PageLeadProps) {
  const crumbParts = crumb.split(" / ")

  return (
    <div data-slot="page-lead" className={pageLeadSlots.root}>
      <div data-slot="page-lead-content" className={pageLeadSlots.content}>
        <nav data-slot="page-lead-crumb" className={pageLeadSlots.crumb}>
          {crumbParts.map((part, index) => (
            <Fragment key={`${part}-${index}`}>
              {index > 0 ? <span aria-hidden>/</span> : null}
              <span className={cn(index === crumbParts.length - 1 && pageLeadSlots.crumbCurrent)}>{part}</span>
            </Fragment>
          ))}
        </nav>
        <div className={pageLeadSlots.titleRow}>
          <h1 data-slot="page-lead-title" className={pageLeadSlots.title}>{title}</h1>
          {titleMeta ? <span data-slot="page-lead-title-meta" className={pageLeadSlots.titleMeta}>{titleMeta}</span> : null}
        </div>
      </div>
      <div data-slot="page-lead-actions" className={pageLeadSlots.actions}>{actions}</div>
      <p data-slot="page-lead-description" className={pageLeadSlots.lead}>{lead}</p>
    </div>
  )
}

export { PageLead, pageLeadSlots, type PageLeadProps }
