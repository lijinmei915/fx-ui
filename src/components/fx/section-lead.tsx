import type { ReactNode } from "react"

const sectionLeadSlots = {
  root: "flex flex-col gap-1",
  title: "text-xl font-bold tracking-tight text-foreground",
  description: "text-sm text-muted-foreground",
} as const

type SectionLeadProps = {
  title: ReactNode
  description?: ReactNode
}

function SectionLead({ title, description }: SectionLeadProps) {
  return (
    <div className={sectionLeadSlots.root}>
      <h2 className={sectionLeadSlots.title}>{title}</h2>
      {description ? <p className={sectionLeadSlots.description}>{description}</p> : null}
    </div>
  )
}

export { SectionLead, sectionLeadSlots, type SectionLeadProps }
