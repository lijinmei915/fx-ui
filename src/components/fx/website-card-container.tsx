const websiteCardContainerSlots = {
  root: "rounded-lg border border-border bg-card p-5",
  stack: "grid gap-4",
  headerBlock: "h-14 rounded-lg bg-muted",
  innerPanel: "rounded-lg border border-border-subtle bg-background p-4",
  divider: "border-t border-border-subtle",
  controlShell: "h-10 rounded-md border border-border-subtle bg-muted",
  elevatedPanel: "rounded-lg border border-border bg-card p-4 shadow-l1",
  label: "text-sm font-medium text-muted-foreground",
} as const

type WebsiteCardContainerProps = {
  label: string
}

function WebsiteCardContainer({ label }: WebsiteCardContainerProps) {
  return (
    <div data-slot="website-card-container" className={websiteCardContainerSlots.root}>
      <div className={websiteCardContainerSlots.stack}>
        <div className={websiteCardContainerSlots.headerBlock} />
        <div data-slot="website-card-inner-panel" className={websiteCardContainerSlots.innerPanel}>
          <div className={websiteCardContainerSlots.stack}>
            <p className={websiteCardContainerSlots.label}>{label}</p>
            <div data-slot="website-card-divider" className={websiteCardContainerSlots.divider} />
            <div data-slot="website-card-control-shell" className={websiteCardContainerSlots.controlShell} />
          </div>
        </div>
        <div data-slot="website-card-elevated-panel" className={websiteCardContainerSlots.elevatedPanel}>
          <div className={websiteCardContainerSlots.controlShell} />
        </div>
      </div>
    </div>
  )
}

export {
  WebsiteCardContainer,
  websiteCardContainerSlots,
  type WebsiteCardContainerProps,
}
