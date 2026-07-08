const websiteSpacingRhythmSlots = {
  root: "rounded-lg border border-border bg-card p-5",
  viewport: "rounded-xl border border-border-subtle bg-background p-4 md:p-6",
  page: "grid gap-6 md:grid-cols-[0.95fr_1.05fr_1fr]",
  column: "flex min-w-0 flex-col",
  module: "rounded-xl bg-muted",
  moduleLarge: "h-20",
  moduleMedium: "h-14",
  moduleSmall: "h-10",
  pagePaddingMeasure: "mt-3 h-3 rounded-full bg-primary-light",
  titleToSectionMeasure: "my-4 h-10 rounded-xl border border-dashed border-primary bg-primary-light",
  sectionGapMeasure: "my-4 h-10 rounded-xl border border-dashed border-border bg-muted",
  label: "mt-4 text-sm font-medium text-muted-foreground",
} as const

type WebsiteSpacingRhythmItem = {
  label: string
}

type WebsiteSpacingRhythmProps = {
  items: WebsiteSpacingRhythmItem[]
}

function WebsiteSpacingRhythm({ items }: WebsiteSpacingRhythmProps) {
  const pagePaddingLabel = items[0]?.label
  const titleToSectionLabel = items[1]?.label
  const sectionGapLabel = items[2]?.label

  return (
    <div data-slot="website-spacing-rhythm" className={websiteSpacingRhythmSlots.root}>
      <div data-slot="website-spacing-rhythm-viewport" className={websiteSpacingRhythmSlots.viewport}>
        <div className={websiteSpacingRhythmSlots.page}>
          <div className={websiteSpacingRhythmSlots.column}>
            <div className={`${websiteSpacingRhythmSlots.module} ${websiteSpacingRhythmSlots.moduleLarge}`} />
            <div data-slot="website-spacing-page-padding" className={websiteSpacingRhythmSlots.pagePaddingMeasure} />
            {pagePaddingLabel ? <p className={websiteSpacingRhythmSlots.label}>{pagePaddingLabel}</p> : null}
          </div>

          <div className={websiteSpacingRhythmSlots.column}>
            <div className={`${websiteSpacingRhythmSlots.module} ${websiteSpacingRhythmSlots.moduleSmall}`} />
            <div data-slot="website-spacing-title-to-section" className={websiteSpacingRhythmSlots.titleToSectionMeasure} />
            <div className={`${websiteSpacingRhythmSlots.module} ${websiteSpacingRhythmSlots.moduleMedium}`} />
            {titleToSectionLabel ? <p className={websiteSpacingRhythmSlots.label}>{titleToSectionLabel}</p> : null}
          </div>

          <div className={websiteSpacingRhythmSlots.column}>
            <div className={`${websiteSpacingRhythmSlots.module} ${websiteSpacingRhythmSlots.moduleSmall}`} />
            <div data-slot="website-spacing-section-gap" className={websiteSpacingRhythmSlots.sectionGapMeasure} />
            <div className={`${websiteSpacingRhythmSlots.module} ${websiteSpacingRhythmSlots.moduleSmall}`} />
            {sectionGapLabel ? <p className={websiteSpacingRhythmSlots.label}>{sectionGapLabel}</p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  WebsiteSpacingRhythm,
  websiteSpacingRhythmSlots,
  type WebsiteSpacingRhythmItem,
  type WebsiteSpacingRhythmProps,
}
