import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDownIcon } from "@/lib/icons"

type WebsiteRulePanelSource = {
  label: string
  value: string
}

const websiteRulePopoverSlots = {
  root: "relative shrink-0",
  trigger:
    "w-fit shrink-0 [&[aria-expanded='true']_[data-icon='inline-end']]:rotate-180 [&_[data-icon='inline-end']]:transition-transform",
  content: "absolute top-full right-0 z-20 mt-2",
  defaultWidth: "w-[min(44rem,calc(100vw-3rem))]",
} as const

const websiteRulePanelSlots = {
  root: "rounded-2xl border border-border bg-card p-4",
  inner: "grid gap-3",
  section: "px-2 py-1",
  heading: "mb-3 flex items-center justify-between gap-3",
  title: "text-sm font-semibold text-foreground",
  badge: "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
  sources: "flex flex-wrap gap-2 px-2 pt-1 text-xs text-muted-foreground",
  sourceTag: "rounded-full bg-muted px-2 py-0.5 font-medium",
} as const

const websiteRuleValueListSlots = {
  root: "grid gap-2.5 text-sm text-muted-foreground md:grid-cols-2",
  item: "flex flex-col gap-0.5",
  itemHeader: "flex flex-wrap items-center gap-2",
  title: "font-medium text-foreground",
  meta: "rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
  text: "text-xs leading-5 text-muted-foreground",
} as const

type WebsiteRuleValueItem = {
  title: ReactNode
  meta?: ReactNode
  description?: ReactNode
  value?: ReactNode
}

type WebsiteRulePanelProps = {
  title: ReactNode
  badge?: ReactNode
  children: ReactNode
  sources?: WebsiteRulePanelSource[]
}

type WebsiteRulePopoverProps = {
  label?: ReactNode
  children: ReactNode
  widthClassName?: string
}

function WebsiteRulePopover({
  label = "查看规则",
  children,
  widthClassName = "w-[min(44rem,calc(100vw-3rem))]",
}: WebsiteRulePopoverProps) {
  return (
    <Collapsible data-slot="website-rule-popover" className={websiteRulePopoverSlots.root}>
      <CollapsibleTrigger
        render={
          <Button
            variant="secondary"
            size="sm"
            className={websiteRulePopoverSlots.trigger}
          />
        }
      >
        {label}
        <ChevronDownIcon data-icon="inline-end" />
      </CollapsibleTrigger>
      <CollapsibleContent
        data-slot="website-rule-popover-content"
        className={`${websiteRulePopoverSlots.content} ${widthClassName}`}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

function WebsiteRulePanel({ title, badge, children, sources = [] }: WebsiteRulePanelProps) {
  return (
    <div data-slot="website-rule-panel" className={websiteRulePanelSlots.root}>
      <div className={websiteRulePanelSlots.inner}>
        <section data-slot="website-rule-panel-section" className={websiteRulePanelSlots.section}>
          <div className={websiteRulePanelSlots.heading}>
            <p className={websiteRulePanelSlots.title}>{title}</p>
            {badge ? (
              <span className={websiteRulePanelSlots.badge}>
                {badge}
              </span>
            ) : null}
          </div>
          {children}
        </section>

        {sources.length > 0 ? (
          <div
            data-slot="website-rule-panel-sources"
            className={websiteRulePanelSlots.sources}
          >
            {sources.map((source) => (
              <span key={`${source.label}-${source.value}`} className={websiteRulePanelSlots.sourceTag}>
                {source.label}：{source.value}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function WebsiteRuleValueList({ items }: { items: WebsiteRuleValueItem[] }) {
  return (
    <div data-slot="website-rule-value-list" className={websiteRuleValueListSlots.root}>
      {items.map((item, index) => (
        <div key={index} data-slot="website-rule-value-item" className={websiteRuleValueListSlots.item}>
          <div className={websiteRuleValueListSlots.itemHeader}>
            <p className={websiteRuleValueListSlots.title}>{item.title}</p>
            {item.meta ? (
              <span className={websiteRuleValueListSlots.meta}>
                {item.meta}
              </span>
            ) : null}
          </div>
          {item.description ? <p className={websiteRuleValueListSlots.text}>{item.description}</p> : null}
          {item.value ? <p className={websiteRuleValueListSlots.text}>{item.value}</p> : null}
        </div>
      ))}
    </div>
  )
}

export {
  WebsiteRulePanel,
  WebsiteRulePopover,
  WebsiteRuleValueList,
  websiteRulePanelSlots,
  websiteRulePopoverSlots,
  websiteRuleValueListSlots,
  type WebsiteRulePanelProps,
  type WebsiteRulePopoverProps,
  type WebsiteRulePanelSource,
  type WebsiteRuleValueItem,
}
