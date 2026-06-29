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
  root: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
  content: "min-w-0",
  crumb: "mb-3 flex gap-2 text-sm font-normal text-muted-foreground",
  crumbCurrent: "font-medium text-foreground",
  titleRow: "flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1",
  title: "text-3xl font-bold tracking-tight text-foreground",
  titleMeta: "text-lg font-bold text-muted-foreground",
  lead: "mt-2 max-w-5xl text-base font-normal text-muted-foreground",
  actions: "shrink-0 md:pt-0",
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
        <p data-slot="page-lead-description" className={pageLeadSlots.lead}>{lead}</p>
      </div>
      <div data-slot="page-lead-actions" className={pageLeadSlots.actions}>{actions}</div>
    </div>
  )
}

export { PageLead, pageLeadSlots, type PageLeadProps }
