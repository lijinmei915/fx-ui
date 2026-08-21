import { useState } from "react"

import { PageBuilder, type PageBuilderTemplate, type PageBuilderValue } from "@/components/recipes/page-builder"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { FileTextIcon } from "@/lib/icons"
import { customerListBlockIds, CustomerListFrame, type CustomerListBlockId } from "@/pages/templates/customer-list-template"

import pageBuilderManifestRaw from "../../../../docs/data/page-builder.manifest.json?raw"

type PageBuilderManifest = { templates: PageBuilderTemplate[] }
const pageBuilderManifest = JSON.parse(pageBuilderManifestRaw) as PageBuilderManifest
const customerListTemplate = pageBuilderManifest.templates.find((template) => template.id === "customer-list")!
const blankPageTemplate = pageBuilderManifest.templates.find((template) => template.id === "blank-page")!
const standardPreset = customerListTemplate.presets.find((preset) => preset.id === "standard")!
const blankPreset = blankPageTemplate.presets.find((preset) => preset.id === "blank")!

export function PageBuilderPage() {
  const [template, setTemplate] = useState(customerListTemplate)
  const [value, setValue] = useState<PageBuilderValue>({ blocks: [...standardPreset.blocks], properties: { ...standardPreset.properties } })

  const createBlankPage = () => {
    setTemplate(blankPageTemplate)
    setValue({ blocks: [...blankPreset.blocks], properties: { ...blankPreset.properties } })
  }

  return (
    <section id="page-builder-workspace" className="h-full min-h-0">
        <PageBuilder
          key={template.id}
          template={template}
          value={value}
          onValueChange={setValue}
          onCreateBlankPage={createBlankPage}
          renderPreview={(preview, controls) => preview.blocks.length === 0 ? <Empty className="min-h-[520px]"><EmptyHeader><EmptyMedia variant="icon"><FileTextIcon /></EmptyMedia><EmptyTitle>空白页面</EmptyTitle><EmptyDescription>尚未添加页面区块</EmptyDescription></EmptyHeader></Empty> : <CustomerListFrame blocks={preview.blocks.filter((block): block is CustomerListBlockId => customerListBlockIds.includes(block as CustomerListBlockId))} title={preview.properties.title} frame={preview.properties.frame as "inset" | "continuous"} density={preview.properties.density as "default" | "compact"} columnSet={preview.properties.columnSet as "standard" | "essential"} rowActions={preview.properties.rowActions as "show" | "hide"} permission={preview.properties.permission as "editable" | "readonly"} height={520} builder={{ selected: controls.selected as CustomerListBlockId | "page", onSelect: controls.onSelect, onRemove: controls.onRemove }} />}
        />
    </section>
  )
}
