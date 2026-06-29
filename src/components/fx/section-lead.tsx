import type { ReactNode } from "react"

type SectionLeadProps = {
  title: ReactNode
  description?: ReactNode
}

function SectionLead({ title, description }: SectionLeadProps) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  )
}

export { SectionLead, type SectionLeadProps }
