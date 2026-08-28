import { lazy, Suspense } from "react"

import { ComponentPlayground } from "@/components/fx/component-playground"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { CardContent } from "@/components/ui/card"
import { standardScenarioExamplesFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { finalizePageRegistry, type PageEntry } from "@/lib/page-registry"
import { DatePickerPage, datePickerAnchors, datePickerDoDontRows, datePickerPropRows, datePickerSemanticDomRows } from "@/pages/docs/components/date-picker-page"
import { ColorPickerPage, colorPickerAnchors } from "@/pages/docs/components/color-picker-page"
import { IconPickerPage, iconPickerAnchors } from "@/pages/docs/components/icon-picker-page"
import { TransferPage, transferAnchors } from "@/pages/docs/components/transfer-page"
import { ConditionBuilderPage, conditionBuilderAnchors } from "@/pages/docs/components/condition-builder-page"
import { PeoplePickerPage, peoplePickerAnchors } from "@/pages/docs/components/people-picker-page"
import { ComboboxPage, comboboxAnchors } from "@/pages/docs/components/combobox-page"
import { DateTimePickerPage, dateTimePickerAnchors, dateTimePickerDoDontRows, dateTimePickerPropRows, dateTimePickerSemanticDomRows } from "@/pages/docs/components/date-time-picker-page"
import { TimePickerPage, timePickerAnchors, timePickerDoDontRows, timePickerPlaygroundConfig, timePickerPropRows, timePickerSemanticDomRows, timePickerImportCodeForPlayground } from "@/pages/docs/components/time-picker-page"
import { selectPlaygroundConfig as manifestSelectPlaygroundConfig } from "@/pages/docs/components/select-playground"
import { inputPlaygroundConfig as manifestInputPlaygroundConfig } from "@/pages/docs/components/input-playground"
import { CalendarPage, calendarAnchors, calendarDoDontRows, calendarPropRows, calendarSemanticDomRows } from "@/pages/docs/components/calendar-page"
import { CollapsiblePage, collapsibleAnchors, collapsibleDoDontRows, collapsiblePropRows, collapsibleSemanticDomRows } from "@/pages/docs/components/collapsible-page"
import { PopoverPage, popoverAnchors, popoverDoDontRows, popoverPropRows, popoverSemanticDomRows } from "@/pages/docs/components/popover-page"
import { SeparatorPage, separatorAnchors, separatorDoDontRows, separatorPropRows, separatorSemanticDomRows } from "@/pages/docs/components/separator-page"
import { SliderPage, sliderAnchors } from "@/pages/docs/components/slider-page"
import { LinkPage, linkAnchors, linkDoDontRows, linkPlaygroundConfig, linkPropRows, linkSemanticDomRows } from "@/pages/docs/components/link-page"
import { SidebarPage, sidebarAnchors, sidebarDoDontRows, sidebarPropRows, sidebarSemanticDomRows } from "@/pages/docs/components/sidebar-page"
import { SpinnerPage, spinnerAnchors, spinnerDoDontRows, spinnerPropRows, spinnerSemanticDomRows } from "@/pages/docs/components/spinner-page"
import { ToastPage, toastAnchors, toastDoDontRows, toastPropRows, toastSemanticDomRows } from "@/pages/docs/components/toast-page"
import { TabsPage, tabsAnchors, tabsDoDontRows, tabsPropRows, tabsSemanticDomRows } from "@/pages/docs/components/tabs-page"
import { TogglePage, toggleAnchors, toggleDoDontRows, togglePropRows, toggleSemanticDomRows } from "@/pages/docs/components/toggle-page"
import { ToggleGroupPage, toggleGroupAnchors, toggleGroupDoDontRows, toggleGroupPropRows, toggleGroupSemanticDomRows } from "@/pages/docs/components/toggle-group-page"
import { TopBarPage as TopBarDocPage, topBarAnchors, topBarDoDontRows, topBarPropRows, topBarSemanticDomRows } from "@/pages/docs/components/top-bar-page"
import { BadgePage as BadgeDocPage, badgeAnchors, badgeDoDontRows, badgePropRows, badgeSemanticDomRows } from "@/pages/docs/components/badge-page"
import { TagPage as TagDocPage, tagAnchors, tagColorList, tagDoDontRows, tagPropRows, tagSemanticDomRows, tagVariantRows } from "@/pages/docs/components/tag-page"
import { CardPage as CardDocPage, cardAnchors, cardDoDontRows, cardPropRows, cardSemanticDomRows } from "@/pages/docs/components/card-page"
import { ButtonGroupPage as ButtonGroupDocPage, buttonGroupAnchors, buttonGroupDoDontRows, buttonGroupPropRows, buttonGroupSemanticDomRows } from "@/pages/docs/components/button-group-page"
import { ButtonPage as ButtonDocPage, buttonAnchors, buttonDoDontRows, buttonPropRows, buttonSemanticDomRows } from "@/pages/docs/components/button-page"
import { InputPage as InputDocPage, inputAnchors, inputDoDontRows, inputPropRows, inputSemanticDomRows } from "@/pages/docs/components/input-page"
import { FieldPage, fieldAnchors } from "@/pages/docs/components/field-page"
import { LabelPage, labelAnchors } from "@/pages/docs/components/label-page"
import { SelectPage as SelectDocPage, selectAnchors, selectDoDontRows, selectPropRows, selectSemanticDomRows } from "@/pages/docs/components/select-page"
import { CheckboxPage as CheckboxDocPage, checkboxAnchors, checkboxDoDontRows, checkboxPropRows, checkboxSemanticDomRows } from "@/pages/docs/components/checkbox-page"
import { SwitchPage as SwitchDocPage, switchAnchors } from "@/pages/docs/components/switch-page"
import { TextareaPage as TextareaDocPage, textareaAnchors, textareaDoDontRows, textareaPropRows, textareaSemanticDomRows } from "@/pages/docs/components/textarea-page"
import { SignaturePage, signatureAnchors } from "@/pages/docs/components/signature-page"
import { UploadPage, uploadAnchors } from "@/pages/docs/components/upload-page"
import { CommandPage as CommandDocPage, commandAnchors, commandDoDontRows, commandPropRows, commandSemanticDomRows } from "@/pages/docs/components/command-page"
import { CommandDemo } from "@/pages/docs/components/command-demo"
import { DialogPage as DialogDocPage, dialogAnchors } from "@/pages/docs/components/dialog-page"
import { AlertDialogPage as AlertDialogDocPage, alertDialogAnchors } from "@/pages/docs/components/alert-dialog-page"
import { AlertPage, alertAnchors } from "@/pages/docs/components/alert-page"
import { EmptyPage, emptyAnchors } from "@/pages/docs/components/empty-page"
import { ScrollAreaPage, scrollAreaAnchors } from "@/pages/docs/components/scroll-area-page"
import { SheetPage as SheetDocPage, sheetAnchors } from "@/pages/docs/components/sheet-page"
import { SkeletonPage as SkeletonDocPage, skeletonAnchors } from "@/pages/docs/components/skeleton-page"
import { PaginationPage as PaginationDocPage, paginationAnchors } from "@/pages/docs/components/pagination-page"
import { TooltipPage as TooltipDocPage, tooltipAnchors } from "@/pages/docs/components/tooltip-page"
import { AvatarPage as AvatarDocPage, avatarAnchors } from "@/pages/docs/components/avatar-page"
import { BreadcrumbPage as BreadcrumbDocPage, breadcrumbAnchors } from "@/pages/docs/components/breadcrumb-page"
import { TablePage as TableDocPage, tableAnchors, tableDoDontRows, tablePropRows, tableSemanticDomRows } from "@/pages/docs/components/table-page"
import { DropdownMenuPage as DropdownMenuDocPage, dropdownMenuAnchors, dropdownMenuDoDontRows, dropdownMenuPropRows, dropdownMenuScenarioFilters, dropdownMenuSemanticDomRows } from "@/pages/docs/components/dropdown-menu-page"
import { tablePlaygroundConfig } from "@/pages/docs/components/table-playground"
import { TokensColorsPage as TokensColorsDocPage, tokenColorsAnchors, semanticTokenGroups, renderTokenExample } from "@/pages/docs/tokens/tokens-colors-page"
import { SeedPreview } from "@/pages/docs/tokens/color-seed-preview"
import { ColorPaletteWithTabs } from "@/pages/docs/tokens/color-palette-with-tabs"
import { TokensTypographyPage as TokensTypographyDocPage, tokenTypographyAnchors, typeSizeTokens, typeWeightTokens, typeFamilyTokens } from "@/pages/docs/tokens/tokens-typography-page"
import { TokensRadiusPage as TokensRadiusDocPage, tokenRadiusAnchors, radiusTokens } from "@/pages/docs/tokens/tokens-radius-page"
import { TokensSpacingPage as TokensSpacingDocPage, tokenSpacingAnchors, spacingTokens } from "@/pages/docs/tokens/tokens-spacing-page"
import { TokensShadowPage as TokensShadowDocPage, tokenShadowAnchors, shadowTokens } from "@/pages/docs/tokens/tokens-shadow-page"
import { TokensMotionPage as TokensMotionDocPage, tokenMotionAnchors, motionTokens } from "@/pages/docs/tokens/tokens-motion-page"
import { TokensLayerPage as TokensLayerDocPage, tokenLayerAnchors, layerTokens } from "@/pages/docs/tokens/tokens-layer-page"
import { TokensIconsPage, tokenIconAnchors } from "@/pages/docs/tokens/tokens-icons-page"
import { ComponentsIndexPage, componentsIndexAnchors, type ComponentsIndexSection } from "@/pages/docs/components/components-index-page"
import { GridPage, gridAnchors } from "@/pages/docs/foundations/grid-page"
import { tokenAnchors } from "@/pages/docs/tokens/tokens-page"
import { TokensPageAdapter } from "@/pages/docs/tokens/tokens-page-adapter"
import { LayoutPage, layoutAnchors } from "@/pages/docs/foundations/layout-page"
import { NavMenuPage, navMenuAnchors, navMenuDoDontRows, navMenuPropRows, navMenuSemanticDomRows } from "@/pages/docs/components/nav-menu-page"
import { IconPage, iconAnchors } from "@/pages/docs/foundations/icon-page"
import { AgentSurfacePage, agentSurfaceAnchors } from "@/pages/docs/components/agent-surface-page"
import { CustomerListTemplate } from "@/pages/templates/customer-list-template"
import { CustomerListCalibrationPage } from "@/pages/docs/governance/customer-list-calibration-page"
import { PageBuilderPage } from "@/pages/docs/governance/page-builder-page"
import { EditFormBlockPage, editFormBlockAnchors } from "@/pages/templates/edit-form-block-page"
import { DetailPageBlockPage, detailPageBlockAnchors } from "@/pages/templates/detail-page-block-page"
import { RadioGroupPage, radioGroupAnchors } from "@/pages/docs/components/radio-group-page"
import { gettingStartedAnchors, gettingStartedSlugs, type GettingStartedPage } from "@/pages/docs/getting-started/getting-started-navigation"
import { mockCustomerBriefingData } from "@/reports/customer-briefing/mock-data"
import { CustomerBriefingPage } from "@/reports/customer-briefing/CustomerBriefingPage"

import componentPlaygroundsManifestRaw from "../../docs/data/component-playgrounds.manifest.json?raw"

type Lang = "zh" | "en"

type DesignTokenManifest = {
  foundation: {
    groups: { id: string; label: string; count: number; tokens: string[] }[]
  }
  typography: {
    roles: { id: string; utility: string; tailwind: [string, string]; usage: string; avoid: string }[]
    conventions: { id: string; rule: string; usage: string; tailwind?: string[]; prohibited?: string[]; examples?: string[] }[]
  }
}

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest

export function createPageRegistry(
  designTokensManifest: DesignTokenManifest,
  componentIndexSections: ComponentsIndexSection[],
  renderGettingStartedPage: (actions: React.ReactNode, lang: Lang, page: GettingStartedPage) => React.ReactNode,
): Record<string, PageEntry> {
  const LazyChartPage = lazy(() => import("@/pages/docs/components/chart-page").then(({ ChartPage }) => ({ default: ChartPage })))

  return finalizePageRegistry({
    components: { anchors: componentsIndexAnchors, render: (a, l) => <ComponentsIndexPage actions={a} lang={l} sections={componentIndexSections} /> },
    tokens: { anchors: tokenAnchors, render: (a, l) => <TokensPageAdapter actions={a} lang={l} foundationGroups={designTokensManifest.foundation.groups} /> },
    "tokens-colors": { anchors: tokenColorsAnchors, render: (a, l) => <TokensColorsDocPage actions={a} lang={l} SeedPreview={SeedPreview} ColorPaletteWithTabs={ColorPaletteWithTabs} semanticTokenGroups={semanticTokenGroups} getTokenExample={renderTokenExample} /> },
    "tokens-typography": { anchors: tokenTypographyAnchors, render: (a, l) => <TokensTypographyDocPage actions={a} lang={l} roles={designTokensManifest.typography.roles} conventions={designTokensManifest.typography.conventions} sizeTokens={typeSizeTokens} weightTokens={typeWeightTokens} familyTokens={typeFamilyTokens} /> },
    "tokens-icons": { anchors: tokenIconAnchors, render: (a, l) => <TokensIconsPage actions={a} lang={l} /> },
    "tokens-radius": { anchors: tokenRadiusAnchors, render: (a, l) => <TokensRadiusDocPage actions={a} lang={l} radiusTokens={radiusTokens} /> },
    "tokens-spacing": { anchors: tokenSpacingAnchors, render: (a, l) => <TokensSpacingDocPage actions={a} lang={l} spacingTokens={spacingTokens} /> },
    "tokens-shadow": { anchors: tokenShadowAnchors, render: (a, l) => <TokensShadowDocPage actions={a} lang={l} shadowTokens={shadowTokens} /> },
    "tokens-motion": { anchors: tokenMotionAnchors, render: (a, l) => <TokensMotionDocPage actions={a} lang={l} motionTokens={motionTokens} /> },
    "tokens-layer": { anchors: tokenLayerAnchors, render: (a, l) => <TokensLayerDocPage actions={a} lang={l} layerTokens={layerTokens} /> },
    icon: { anchors: iconAnchors, render: (a, l) => <IconPage actions={a} lang={l} /> },
    grid: { anchors: gridAnchors, render: (a, l) => <GridPage actions={a} lang={l} /> },
    layout: { anchors: layoutAnchors, render: (a, l) => <LayoutPage actions={a} lang={l} /> },
    "top-bar": { anchors: topBarAnchors, render: (a, l) => <TopBarDocPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "top-bar")} propRows={topBarPropRows} semanticDomRows={topBarSemanticDomRows} doDontRows={topBarDoDontRows} /> },
    "nav-menu": { anchors: navMenuAnchors, render: (a, l) => <NavMenuPage actions={a} lang={l} propRows={navMenuPropRows} semanticDomRows={navMenuSemanticDomRows} doDontRows={navMenuDoDontRows} /> },
    button: { anchors: buttonAnchors, render: (a, l) => <ButtonDocPage actions={a} lang={l} propRows={buttonPropRows} semanticDomRows={buttonSemanticDomRows} doDontRows={buttonDoDontRows} /> },
    input: { anchors: inputAnchors, render: (a, l) => <InputDocPage actions={a} lang={l} playground={<ComponentPlayground config={manifestInputPlaygroundConfig} lang={l} />} propRows={inputPropRows} semanticDomRows={inputSemanticDomRows} doDontRows={inputDoDontRows} /> },
    field: { anchors: fieldAnchors, render: (a, l) => <FieldPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "field")} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    label: { anchors: labelAnchors, render: (a, l) => <LabelPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "label")} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    select: { anchors: selectAnchors, render: (a, l) => <SelectDocPage actions={a} lang={l} playground={<ComponentPlayground config={manifestSelectPlaygroundConfig} lang={l} />} propRows={selectPropRows} semanticDomRows={selectSemanticDomRows} doDontRows={selectDoDontRows} /> },
    combobox: { anchors: comboboxAnchors, render: (a, l) => <ComboboxPage actions={a} lang={l} /> },
    "time-picker": { anchors: timePickerAnchors, render: (a, l) => <TimePickerPage actions={a} lang={l} playgroundConfig={timePickerPlaygroundConfig} importCode={timePickerImportCodeForPlayground} propRows={timePickerPropRows} semanticDomRows={timePickerSemanticDomRows} doDontRows={timePickerDoDontRows} /> },
    "date-picker": { anchors: datePickerAnchors, render: (a, l) => <DatePickerPage actions={a} lang={l} propRows={datePickerPropRows} semanticDomRows={datePickerSemanticDomRows} doDontRows={datePickerDoDontRows} /> },
    "date-time-picker": { anchors: dateTimePickerAnchors, render: (a, l) => <DateTimePickerPage actions={a} lang={l} propRows={dateTimePickerPropRows} semanticDomRows={dateTimePickerSemanticDomRows} doDontRows={dateTimePickerDoDontRows} /> },
    "color-picker": { anchors: colorPickerAnchors, render: (a, l) => <ColorPickerPage actions={a} lang={l} /> },
    "icon-picker": { anchors: iconPickerAnchors, render: (a, l) => <IconPickerPage actions={a} lang={l} /> },
    transfer: { anchors: transferAnchors, render: (a, l) => <TransferPage actions={a} lang={l} /> },
    "condition-builder": { anchors: conditionBuilderAnchors, render: (a, l) => <ConditionBuilderPage actions={a} lang={l} /> },
    "people-picker": { anchors: peoplePickerAnchors, render: (a, l) => <PeoplePickerPage actions={a} lang={l} /> },
    checkbox: { anchors: checkboxAnchors, render: (a, l) => <CheckboxDocPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "checkbox")} propRows={checkboxPropRows} semanticDomRows={checkboxSemanticDomRows} doDontRows={checkboxDoDontRows} /> },
    "radio-group": { anchors: radioGroupAnchors, render: (a, l) => <RadioGroupPage actions={a} lang={l} /> },
    switch: { anchors: switchAnchors, render: (a, l) => <SwitchDocPage actions={a} lang={l} /> },
    textarea: { anchors: textareaAnchors, render: (a, l) => <TextareaDocPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "textarea")} propRows={textareaPropRows} semanticDomRows={textareaSemanticDomRows} doDontRows={textareaDoDontRows} /> },
    signature: { anchors: signatureAnchors, render: (a, l) => <SignaturePage actions={a} lang={l} /> },
    upload: { anchors: uploadAnchors, render: (a, l) => <UploadPage actions={a} lang={l} /> },
    table: { anchors: tableAnchors, render: (a, l) => <TableDocPage actions={a} lang={l} playground={<ComponentPlayground config={tablePlaygroundConfig} lang={l} />} propRows={tablePropRows} semanticDomRows={tableSemanticDomRows} doDontRows={tableDoDontRows} /> },
    card: { anchors: cardAnchors, render: (a, l) => <CardDocPage actions={a} lang={l} propRows={cardPropRows} semanticDomRows={cardSemanticDomRows} doDontRows={cardDoDontRows} /> },
    badge: { anchors: badgeAnchors, render: (a, l) => <BadgeDocPage actions={a} lang={l} propRows={badgePropRows} semanticDomRows={badgeSemanticDomRows} doDontRows={badgeDoDontRows} /> },
    tag: { anchors: tagAnchors, render: (a, l) => <TagDocPage actions={a} lang={l} variantRows={tagVariantRows} colorList={tagColorList} propRows={tagPropRows} semanticDomRows={tagSemanticDomRows} doDontRows={tagDoDontRows} /> },
    tooltip: { anchors: tooltipAnchors, render: (a, l) => <TooltipDocPage actions={a} lang={l} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    dialog: { anchors: dialogAnchors, render: (a, l) => <DialogDocPage actions={a} lang={l} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    "alert-dialog": { anchors: alertDialogAnchors, render: (a, l) => <AlertDialogDocPage actions={a} lang={l} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    alert: { anchors: alertAnchors, render: (a, l) => <AlertPage actions={a} lang={l} /> },
    empty: { anchors: emptyAnchors, render: (a, l) => <EmptyPage actions={a} lang={l} /> },
    "scroll-area": { anchors: scrollAreaAnchors, render: (a, l) => <ScrollAreaPage actions={a} lang={l} /> },
    sheet: { anchors: sheetAnchors, render: (a, l) => <SheetDocPage actions={a} lang={l} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    skeleton: { anchors: skeletonAnchors, render: (a, l) => <SkeletonDocPage actions={a} lang={l} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    avatar: { anchors: avatarAnchors, render: (a, l) => <AvatarDocPage actions={a} lang={l} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    breadcrumb: { anchors: breadcrumbAnchors, render: (a, l) => <BreadcrumbDocPage actions={a} lang={l} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    "button-group": { anchors: buttonGroupAnchors, render: (a, l) => <ButtonGroupDocPage actions={a} lang={l} propRows={buttonGroupPropRows} semanticDomRows={buttonGroupSemanticDomRows} doDontRows={buttonGroupDoDontRows} /> },
    calendar: { anchors: calendarAnchors, render: (a, l) => <CalendarPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "calendar")} propRows={calendarPropRows} semanticDomRows={calendarSemanticDomRows} doDontRows={calendarDoDontRows} /> },
    collapsible: { anchors: collapsibleAnchors, render: (a, l) => <CollapsiblePage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "collapsible")} propRows={collapsiblePropRows} semanticDomRows={collapsibleSemanticDomRows} doDontRows={collapsibleDoDontRows} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    "dropdown-menu": { anchors: dropdownMenuAnchors, render: (a, l) => <DropdownMenuDocPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "dropdown-menu")} scenarioFilters={dropdownMenuScenarioFilters} propRows={dropdownMenuPropRows} semanticDomRows={dropdownMenuSemanticDomRows} doDontRows={dropdownMenuDoDontRows} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    pagination: { anchors: paginationAnchors, render: (a, l) => <PaginationDocPage actions={a} lang={l} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    command: { anchors: commandAnchors, render: (a, l) => <CommandDocPage actions={a} lang={l} overview={<WebsiteCardContainer><CardContent className="flex items-center gap-3 p-6"><CommandDemo /></CardContent></WebsiteCardContainer>} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "command")} renderScenarioPreview={() => <CommandDemo />} propRows={commandPropRows} semanticDomRows={commandSemanticDomRows} doDontRows={commandDoDontRows} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    popover: { anchors: popoverAnchors, render: (a, l) => <PopoverPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "popover")} propRows={popoverPropRows} semanticDomRows={popoverSemanticDomRows} doDontRows={popoverDoDontRows} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    separator: { anchors: separatorAnchors, render: (a, l) => <SeparatorPage actions={a} lang={l} propRows={separatorPropRows} semanticDomRows={separatorSemanticDomRows} doDontRows={separatorDoDontRows} /> },
    slider: { anchors: sliderAnchors, render: (a, l) => <SliderPage actions={a} lang={l} /> },
    link: { anchors: linkAnchors, render: (a, l) => <LinkPage actions={a} lang={l} playgroundConfig={linkPlaygroundConfig} propRows={linkPropRows} semanticDomRows={linkSemanticDomRows} doDontRows={linkDoDontRows} /> },
    sidebar: { anchors: sidebarAnchors, render: (a, l) => <SidebarPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "sidebar")} propRows={sidebarPropRows} semanticDomRows={sidebarSemanticDomRows} doDontRows={sidebarDoDontRows} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    spinner: { anchors: spinnerAnchors, render: (a, l) => <SpinnerPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "spinner")} propRows={spinnerPropRows} semanticDomRows={spinnerSemanticDomRows} doDontRows={spinnerDoDontRows} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    toast: { anchors: toastAnchors, render: (a, l) => <ToastPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "toast")} propRows={toastPropRows} semanticDomRows={toastSemanticDomRows} doDontRows={toastDoDontRows} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    tabs: { anchors: tabsAnchors, render: (a, l) => <TabsPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "tabs")} propRows={tabsPropRows} semanticDomRows={tabsSemanticDomRows} doDontRows={tabsDoDontRows} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    toggle: { anchors: toggleAnchors, render: (a, l) => <TogglePage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "toggle")} propRows={togglePropRows} semanticDomRows={toggleSemanticDomRows} doDontRows={toggleDoDontRows} /> },
    "toggle-group": { anchors: toggleGroupAnchors, render: (a, l) => <ToggleGroupPage actions={a} lang={l} scenarioExamples={standardScenarioExamplesFromManifest(componentPlaygroundsManifest, "toggle-group")} propRows={toggleGroupPropRows} semanticDomRows={toggleGroupSemanticDomRows} doDontRows={toggleGroupDoDontRows} autoScenarioSlugs={componentPlaygroundsManifest.autoScenarioComponents ?? []} /> },
    "agent-surface": { anchors: agentSurfaceAnchors, render: (a, l) => <AgentSurfacePage actions={a} lang={l} /> },
    chart: { anchors: [], render: (a, l) => <Suspense fallback={<div className="min-h-24" />}><LazyChartPage actions={a} lang={l} /></Suspense> },
    "list-page": { anchors: [], fullBleed: true, render: (a, l) => <CustomerListTemplate actions={a} lang={l} /> },
    "template-customer-list": { anchors: [], fullBleed: true, render: (a, l) => <CustomerListTemplate actions={a} lang={l} /> },
    "customer-list-calibration": { anchors: [], render: (a, l) => <CustomerListCalibrationPage actions={a} lang={l} /> },
    "page-builder": { anchors: [], fullBleed: true, workspace: true, render: () => <PageBuilderPage /> },
    "template-edit-form": { anchors: editFormBlockAnchors, render: (a, l) => <EditFormBlockPage actions={a} lang={l} /> },
    "template-detail": { anchors: detailPageBlockAnchors, render: (a, l) => <DetailPageBlockPage actions={a} lang={l} /> },
    "customer-briefing": { anchors: [], render: () => <CustomerBriefingPage data={mockCustomerBriefingData} /> },
    ...Object.fromEntries(gettingStartedSlugs.map((slug) => [slug, {
      anchors: gettingStartedAnchors[slug],
      render: (a: React.ReactNode, l: Lang, p: string) => renderGettingStartedPage(a, l, p as GettingStartedPage),
    } satisfies PageEntry])),
  }, componentPlaygroundsManifest.autoScenarioComponents ?? [])
}
