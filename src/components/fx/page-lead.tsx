import { Fragment, type ReactNode } from "react"

type PageLeadProps = {
  crumb: string
  title: string
  lead: ReactNode
  actions: ReactNode
}

function PageLead({ crumb, title, lead, actions }: PageLeadProps) {
  const crumbParts = crumb.split(" / ")

  return (
    <>
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="mb-3 flex gap-2 text-fx-12 font-normal text-muted-foreground">
              {crumbParts.map((part, index) => (
                <Fragment key={`${part}-${index}`}>
                  {index > 0 ? <span>/</span> : null}
                  <span className={index === crumbParts.length - 1 ? "font-medium text-foreground" : undefined}>{part}</span>
                </Fragment>
              ))}
            </nav>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">{title}</h1>
            <p className="mt-2 max-w-5xl text-sm leading-6 text-muted-foreground">{lead}</p>
          </div>
          {actions}
        </div>
      </div>
    </>
  )
}

export { PageLead, type PageLeadProps }
