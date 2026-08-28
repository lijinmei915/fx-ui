import { Fragment, type ReactNode, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { CheckCircleIcon, CheckIcon, Code2Icon, ComponentsIcon, CopyIcon, EyeIcon, PaletteIcon, PencilIcon } from "@/lib/icons"

export type ComponentPlaygroundLang = "zh" | "en"
export type ComponentPlaygroundValues = Record<string, string>
export type ComponentPlaygroundStory = {
  id: string
  values: ComponentPlaygroundValues
  matchKeys?: string[]
  title?: string
  titleEn?: string
  intent?: string
  intentEn?: string
  constraint?: string
  constraintEn?: string
}
export type ComponentPlaygroundOption = {
  value: string
  label: string
  labelEn?: string
  title?: string
  titleEn?: string
  intent?: string
  intentEn?: string
  constraint?: string
  constraintEn?: string
  hiddenWhen?: (v: ComponentPlaygroundValues) => boolean
}
export type ComponentPlaygroundControlGroup = "content" | "appearance" | "behavior" | "structure" | "semantics"
export type ComponentPlaygroundLeadingControl = {
  key: string
  zh: string
  en: string
  control: ReactNode
}
export type ComponentPlaygroundPropDef =
  | { key: string; zh: string; en: string; propName: string; type: "segment"; options: ComponentPlaygroundOption[]; hasAll?: boolean; owner?: string | string[]; group?: "props" | "tokens"; controlGroup?: ComponentPlaygroundControlGroup; defaultVisible?: boolean; defaultOrder?: number; disabledWhen?: (v: ComponentPlaygroundValues) => boolean; hiddenWhen?: (v: ComponentPlaygroundValues) => boolean }
  | { key: string; zh: string; en: string; propName: string; type: "text"; bilingual?: boolean; owner?: string | string[]; group?: "props" | "tokens"; controlGroup?: ComponentPlaygroundControlGroup; defaultVisible?: boolean; defaultOrder?: number; disabledWhen?: (v: ComponentPlaygroundValues) => boolean; hiddenWhen?: (v: ComponentPlaygroundValues) => boolean }
export type ComponentPlaygroundWorkbenchNode = {
  key: string
  zh: string
  en: string
  component: string
  kind?: "component" | "tokens" | "states"
  hiddenWhen?: (v: ComponentPlaygroundValues) => boolean
}
export type ComponentPlaygroundStateAssignment = {
  key: string
  zh: string
  en: string
  propertyZh: string
  propertyEn: string
  token: string
  cssVar: string
  palette: string
  preview: { key: string; value: string }
}
export type ComponentPlaygroundWorkbenchCheck = {
  key: string
  zh: string
  en: string
}
export type ComponentPlaygroundWorkbenchValidation = {
  passed: boolean
  detail: string
  detailEn?: string
}
export type ComponentPlaygroundWorkbenchConfig = {
  nodes: ComponentPlaygroundWorkbenchNode[]
  checks: ComponentPlaygroundWorkbenchCheck[]
  stateAssignments?: ComponentPlaygroundStateAssignment[]
  inspectSlot: string
  validate: (v: ComponentPlaygroundValues) => Record<string, ComponentPlaygroundWorkbenchValidation>
}
export type ComponentPlaygroundConfig = {
  props: ComponentPlaygroundPropDef[]
  initial: ComponentPlaygroundValues
  leadingControls?: ComponentPlaygroundLeadingControl[]
  stories?: ComponentPlaygroundStory[]
  storyPresentation?: "presets" | "examples"
  storySource?: string
  guidanceKey?: string
  previewClassName?: string
  previewItemsClassName?: string
  workbench?: ComponentPlaygroundWorkbenchConfig
  onValueChange?: (next: ComponentPlaygroundValues, key: string, value: string) => ComponentPlaygroundValues
  renderOne: (v: ComponentPlaygroundValues, lang: ComponentPlaygroundLang) => ReactNode
  genCode: (v: ComponentPlaygroundValues, lang: ComponentPlaygroundLang) => string
}

/**
 * Expands a playground value set into deterministic preview stories.
 *
 * A prop marked with `hasAll` is only expanded when its current value is
 * `all`; `all` remains a preview-only control and never reaches generated
 * component code.
 */
export function buildPlaygroundStories(
  props: ComponentPlaygroundPropDef[],
  values: ComponentPlaygroundValues,
): ComponentPlaygroundStory[] {
  let stories: ComponentPlaygroundValues[] = [values]
  for (const prop of props) {
    if (prop.type !== "segment" || !prop.hasAll || values[prop.key] !== "all") continue
    const next: ComponentPlaygroundValues[] = []
    for (const story of stories) {
      for (const option of prop.options.filter((item) => !(item.hiddenWhen?.(story) ?? false))) {
        next.push({ ...story, [prop.key]: option.value })
      }
    }
    stories = next
  }
  return stories.map((story) => ({
    id: Object.entries(story)
      .map(([key, value]) => `${key}:${value}`)
      .join("|")
      .replace(/[^a-zA-Z0-9:_|.-]+/g, "-") || "default",
    values: story,
  }))
}

function PlaygroundSectionTitle({ dot, children }: { dot: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-(--fds-g-spacing-control-gap-tight) text-xs font-normal text-[var(--fds-g-color-text-subtle)]">
      <span className={`size-1.5 rounded-full ${dot}`} />
      {children}
    </div>
  )
}

function PlaygroundPropLabel({ zh }: { zh: string }) {
  return (
    <label className="flex items-center gap-(--fds-g-spacing-control-gap-tight) text-sm font-medium text-foreground-secondary">
      {zh}
    </label>
  )
}

const controlGroupOrder: ComponentPlaygroundControlGroup[] = ["content", "structure", "appearance", "behavior", "semantics"]

function PgSeg({ active, disabled, isAll, label, title, onClick }: { active: boolean; disabled?: boolean; isAll?: boolean; label: string; title?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`min-h-(--fds-g-sizing-control-block-xs) rounded-xs px-(--fds-g-spacing-control-inline-xs) py-1 text-sm font-medium transition-all ${
        disabled
          ? "cursor-not-allowed text-foreground-disabled"
          :
        active
          ? `bg-card shadow-l1 ${isAll ? "text-primary" : "text-foreground"}`
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )
}

export function PlaygroundSegmentedControl({ value, onChange, options, allLabel, disabled }: { value: string; onChange: (v: string) => void; options: { value: string; label: string; title?: string }[]; allLabel?: string; disabled?: boolean }) {
  return (
    <div className="flex max-w-full flex-wrap items-center gap-0.5 self-start rounded-md border border-border-subtle bg-muted p-0.5 data-[disabled=true]:opacity-70" data-disabled={disabled ? "true" : undefined}>
      {allLabel ? (
        <>
          <PgSeg active={value === "all"} disabled={disabled} isAll label={allLabel} onClick={() => onChange("all")} />
          <div className="mx-0.5 my-1 w-px self-stretch bg-border" />
        </>
      ) : null}
      {options.map((o) => (
        <PgSeg key={o.value} active={value === o.value} disabled={disabled} label={o.label} title={o.title} onClick={() => onChange(o.value)} />
      ))}
    </div>
  )
}

function PlaygroundStateAssignmentRow({ assignment, active, lang, onPreview }: { assignment: ComponentPlaygroundStateAssignment; active: boolean; lang: ComponentPlaygroundLang; onPreview: () => void }) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className="w-full justify-start"
      onClick={onPreview}
    >
      <span className="w-16 shrink-0 text-left">{lang === "en" ? assignment.en : assignment.zh}</span>
      <span className="w-12 shrink-0 text-left text-muted-foreground">{lang === "en" ? assignment.propertyEn : assignment.propertyZh}</span>
      <code className="min-w-0 flex-1 truncate text-left text-xs text-foreground-secondary">{assignment.token}</code>
      <span
        aria-hidden="true"
        className="size-3 shrink-0 rounded-xs border border-border-subtle"
        style={{ backgroundColor: `var(${assignment.cssVar})` }}
      />
      <span className="w-24 shrink-0 text-left text-xs text-muted-foreground" title={`${assignment.token} -> ${assignment.palette}`}>{assignment.palette}</span>
    </Button>
  )
}

export function ComponentPlayground({ config, lang, value, onValueChange }: { config: ComponentPlaygroundConfig; lang: ComponentPlaygroundLang; value?: ComponentPlaygroundValues; onValueChange?: (value: ComponentPlaygroundValues) => void }) {
  const [internalValue, setInternalValue] = useState<ComponentPlaygroundValues>(config.initial)
  const v = value ?? internalValue
  const setV = (next: ComponentPlaygroundValues | ((current: ComponentPlaygroundValues) => ComponentPlaygroundValues)) => {
    const resolved = typeof next === "function" ? next(v) : next
    if (value === undefined) setInternalValue(resolved)
    onValueChange?.(resolved)
  }
  const [tab, setTab] = useState("preview")
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [activeStoryId, setActiveStoryId] = useState<string | undefined>(config.stories?.[0]?.id)
  const [activeGuidanceKey, setActiveGuidanceKey] = useState(config.guidanceKey ?? config.props.find((p) => p.type === "segment")?.key)
  const [selectedNode, setSelectedNode] = useState(config.workbench?.nodes[0]?.key ?? "")
  const [inspection, setInspection] = useState<{ slot: string; height: string; background: string; borderColor: string } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const preEditRef = useRef<{ values: ComponentPlaygroundValues; guidanceKey?: string; tab: string } | null>(null)
  const allLabel = lang === "en" ? "All" : "全部"
  const set = (key: string, val: string) => setV((prev) => {
    setActiveGuidanceKey(key)
    const next = { ...prev, [key]: val }
    const resolved = config.onValueChange?.(next, key, val) ?? next
    const activeStory = activeStoryId ? config.stories?.find((story) => story.id === activeStoryId) : undefined
    const keepsStory = activeStory?.matchKeys?.every((matchKey) => activeStory.values[matchKey] === resolved[matchKey]) ?? false
    if (!keepsStory) setActiveStoryId(undefined)
    return resolved
  })
  const guidanceProp = activeGuidanceKey ? config.props.find((p) => p.type === "segment" && p.key === activeGuidanceKey) : undefined
  const guidanceOption = guidanceProp?.type === "segment" ? guidanceProp.options.find((o) => o.value === v[guidanceProp.key]) : undefined
  const activeStory = activeStoryId ? config.stories?.find((story) => story.id === activeStoryId) : undefined
  const showStories = (config.stories?.length ?? 0) > 1
  const storyPresentation = config.storyPresentation ?? "presets"
  const isAllGuidance = guidanceProp?.type === "segment" && guidanceProp.hasAll && v[guidanceProp.key] === "all"
  const intentText = activeStory
    ? lang === "en" ? (activeStory.intentEn ?? activeStory.intent) : activeStory.intent
    : isAllGuidance
    ? lang === "en" ? "Preview all values in this dimension to compare the component states side by side." : "同时预览这一维度下的所有取值，用来横向比较组件状态。"
    : guidanceOption
    ? lang === "en" ? (guidanceOption.intentEn ?? guidanceOption.intent) : guidanceOption.intent
    : lang === "en" ? "Select a concrete variant to see the recommended usage." : "选择具体场景后查看推荐用法。"
  const constraintText = activeStory?.constraint
    ? lang === "en" ? (activeStory.constraintEn ?? activeStory.constraint) : activeStory.constraint
    : isAllGuidance
    ? lang === "en" ? "“All” is only for matrix preview. Choose one concrete value before copying code; do not pass an all prop." : "“全部”只用于矩阵预览；需要复制代码时先选一个具体取值，不传 all 这类伪属性。"
    : guidanceOption
    ? lang === "en" ? (guidanceOption.constraintEn ?? guidanceOption.constraint) : guidanceOption.constraint
    : lang === "en" ? "Keep props aligned with the component source. Do not invent local-only variants." : "调试项必须和组件源码能力一致，不发明局部变体。"
  const showGuidance = !isAllGuidance
  const visibleNodes = config.workbench?.nodes.filter((node) => !(node.hiddenWhen?.(v) ?? false)) ?? []
  const activeNode = visibleNodes.find((node) => node.key === selectedNode) ?? visibleNodes[0]
  const workbenchActive = Boolean(config.workbench && editing)
  const visibleProps = config.props.filter((p) => {
    if (p.hiddenWhen?.(v) ?? false) return false
    if (config.workbench && !workbenchActive) {
      const owner = Array.isArray(p.owner) ? p.owner : p.owner ? [p.owner] : []
      return p.defaultVisible ?? (p.group !== "tokens" && (owner.length === 0 || owner.includes("root")))
    }
    if (!workbenchActive || !activeNode || !p.owner) return true
    return Array.isArray(p.owner) ? p.owner.includes(activeNode.key) : p.owner === activeNode.key
  }).sort((a, b) => workbenchActive ? 0 : (a.defaultOrder ?? Number.MAX_SAFE_INTEGER) - (b.defaultOrder ?? Number.MAX_SAFE_INTEGER))
  const hasControlGroups = visibleProps.some((prop) => prop.controlGroup)
  const orderedVisibleProps = hasControlGroups
    ? controlGroupOrder.flatMap((group) => visibleProps.filter((prop) => prop.controlGroup === group))
    : visibleProps

  useEffect(() => {
    if (!config.workbench || !activeNode || activeNode.key === selectedNode) return
    setSelectedNode(activeNode.key)
  }, [activeNode, config.workbench, selectedNode])

  const matrixStories = buildPlaygroundStories(config.props, v)
  const items = matrixStories.map((story) => (
    <Fragment key={matrixStories.length === 1 ? "single-preview" : story.id}>
      {config.renderOne(story.values, lang)}
    </Fragment>
  ))
  const isMatrix = matrixStories.length > 1
  const activeTab = isMatrix ? "preview" : tab
  const tabs: { value: string; icon: ReactNode; label: string }[] = [
    { value: "preview", icon: <EyeIcon className="size-[1.125rem]" />, label: lang === "en" ? "Preview" : "预览" },
    ...(isMatrix ? [] : [{ value: "code", icon: <Code2Icon className="size-[1.125rem]" />, label: lang === "en" ? "Code" : "代码" }]),
  ]
  const code = config.genCode(matrixStories[0]?.values ?? v, lang)
  const validations = config.workbench?.validate(v) ?? {}

  useEffect(() => {
    if (!workbenchActive || activeTab !== "preview") {
      setInspection(null)
      return
    }
    let inspectedElement: HTMLElement | null = null
    const readInspection = () => {
      if (!inspectedElement) return
      const style = getComputedStyle(inspectedElement)
      setInspection({
        slot: inspectedElement.dataset.slot ?? "",
        height: style.height,
        background: style.backgroundColor,
        borderColor: style.borderColor,
      })
    }
    const frame = requestAnimationFrame(() => {
      inspectedElement = previewRef.current?.querySelector<HTMLElement>(`[data-slot="${config.workbench?.inspectSlot}"]`)
        ?? previewRef.current?.querySelector<HTMLElement>("[data-slot=input]")
        ?? null
      if (!inspectedElement) {
        setInspection(null)
        return
      }
      readInspection()
      inspectedElement.addEventListener("transitionend", readInspection)
      inspectedElement.addEventListener("transitioncancel", readInspection)
    })
    return () => {
      cancelAnimationFrame(frame)
      inspectedElement?.removeEventListener("transitionend", readInspection)
      inspectedElement?.removeEventListener("transitioncancel", readInspection)
    }
  }, [activeTab, config.workbench, v, workbenchActive])
  const copy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const toggleEditing = () => {
    if (editing) {
      const beforeEdit = preEditRef.current
      if (beforeEdit) {
        setV(beforeEdit.values)
        setActiveGuidanceKey(beforeEdit.guidanceKey)
        setTab(beforeEdit.tab)
      }
      preEditRef.current = null
      setSelectedNode(config.workbench?.nodes[0]?.key ?? "")
      setEditing(false)
      return
    }

    preEditRef.current = {
      values: { ...v },
      guidanceKey: activeGuidanceKey,
      tab,
    }
    setEditing(true)
  }

  const selectStory = (id: string) => {
    const story = config.stories?.find((item) => item.id === id)
    if (!story) return
    setV({ ...config.initial, ...story.values })
    setActiveStoryId(story.id)
    setActiveGuidanceKey(config.guidanceKey ?? config.props.find((p) => p.type === "segment")?.key)
    setTab("preview")
  }

  return (
    <WebsiteCardContainer
      padding="none"
      size="lg"
      data-slot="component-playground"
      data-story-source={config.storySource}
      data-story-count={config.stories?.length || undefined}
      className="[--playground-gap:var(--fds-g-spacing-panel-gap)]"
    >
      <div className="overflow-x-auto border-b border-border-subtle bg-card">
        <div className={workbenchActive ? "grid min-w-[1120px] grid-cols-[220px_minmax(360px,1fr)_minmax(320px,0.8fr)] gap-(--playground-gap) p-(--card-spacing)" : "grid grid-cols-[repeat(2,minmax(min-content,1fr))] gap-(--playground-gap) p-(--card-spacing) max-[900px]:grid-cols-1"}>
          {workbenchActive ? (
            <div data-slot="component-playground-structure" className="flex flex-col gap-(--fds-g-spacing-control-gap)">
              <PlaygroundSectionTitle dot="bg-primary">{lang === "en" ? "Structure" : "组件结构"}</PlaygroundSectionTitle>
              <div className="flex flex-col gap-1" role="tree" aria-label={lang === "en" ? "Component structure" : "组件结构"}>
                {visibleNodes.map((node, index) => (
                  <Button
                    key={node.key}
                    type="button"
                    role="treeitem"
                    aria-selected={activeNode?.key === node.key}
                    variant={activeNode?.key === node.key ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedNode(node.key)}
                  >
                    {node.kind === "tokens" || node.kind === "states" ? <PaletteIcon data-icon="inline-start" /> : <ComponentsIcon data-icon="inline-start" />}
                    <span className="min-w-0 flex-1 truncate text-left">{lang === "en" ? node.en : node.zh}</span>
                    {index === 0 ? null : <span className="text-xs text-muted-foreground">{node.component}</span>}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
          <div className="flex flex-col gap-(--playground-gap)">
            {showStories ? (
              <div data-slot="component-playground-stories" className="flex flex-col gap-(--fds-g-spacing-control-gap-tight)">
                <PlaygroundPropLabel zh={lang === "en" ? (storyPresentation === "examples" ? "Examples" : "Presets") : (storyPresentation === "examples" ? "结构示例" : "场景预设")} />
                <PlaygroundSegmentedControl
                  value={activeStoryId ?? ""}
                  onChange={selectStory}
                  options={config.stories!.map((story) => ({ value: story.id, label: lang === "en" ? (story.titleEn ?? story.title ?? story.id) : (story.title ?? story.id) }))}
                />
              </div>
            ) : null}
            <PlaygroundSectionTitle dot="bg-primary">{lang === "en" ? "Interactive props" : "实时属性"}</PlaygroundSectionTitle>
            {config.leadingControls?.map((item) => (
              <div key={item.key} className="flex flex-col gap-(--fds-g-spacing-control-gap-tight)" data-slot="component-playground-leading-control">
                <PlaygroundPropLabel zh={lang === "en" ? item.en : item.zh} />
                <div className="flex flex-wrap items-center gap-(--fds-g-spacing-control-gap-tight)">{item.control}</div>
              </div>
            ))}
            {workbenchActive && activeNode ? (
              <div className="flex items-center gap-(--fds-g-spacing-control-gap-tight) text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{lang === "en" ? activeNode.en : activeNode.zh}</span>
                <span>{activeNode.component}</span>
              </div>
            ) : null}
            {activeNode?.kind === "states" ? (
              <div className="flex flex-col gap-1" data-slot="component-playground-state-assignments">
                {config.workbench?.stateAssignments?.map((assignment) => (
                  <PlaygroundStateAssignmentRow
                    key={assignment.key}
                    assignment={assignment}
                    active={v[assignment.preview.key] === assignment.preview.value}
                    lang={lang}
                    onPreview={() => set(assignment.preview.key, assignment.preview.value)}
                  />
                ))}
              </div>
            ) : orderedVisibleProps.map((p) => (
              <div key={p.key} className="flex flex-col gap-(--fds-g-spacing-control-gap-tight)">
                <PlaygroundPropLabel zh={lang === "en" ? p.en : p.zh} />
                {p.type === "text" ? (
                  <Input
                    value={(p.bilingual && lang === "en" ? v[`${p.key}En`] : v[p.key]) ?? ""}
                    disabled={p.disabledWhen?.(v) ?? false}
                    onChange={(e) => set(p.bilingual && lang === "en" ? `${p.key}En` : p.key, e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <PlaygroundSegmentedControl
                    value={v[p.key]}
                    disabled={p.disabledWhen?.(v) ?? false}
                    onChange={(val) => set(p.key, val)}
                    options={p.options
                      .filter((o) => !(o.hiddenWhen?.(v) ?? false))
                      .map((o) => ({ value: o.value, label: lang === "en" ? (o.labelEn ?? o.label) : o.label, title: lang === "en" ? (o.titleEn ?? o.title) : o.title }))}
                    allLabel={p.hasAll ? allLabel : undefined}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="border-l border-border-subtle pl-(--card-spacing) max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pl-0 max-[900px]:pt-(--card-spacing)">
            <div className="flex flex-col gap-(--playground-gap)">
              {showGuidance && intentText ? (
                <div>
                  <div className="mb-1">
                    <PlaygroundSectionTitle dot="bg-primary">{lang === "en" ? "Intent" : "使用意图"}</PlaygroundSectionTitle>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground-secondary">
                    {intentText}
                  </p>
                </div>
              ) : null}
              {showGuidance && constraintText ? (
                <div>
                  <div className="mb-1">
                    <PlaygroundSectionTitle dot="bg-primary">{lang === "en" ? "Constraint" : "约束"}</PlaygroundSectionTitle>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground-secondary">{constraintText}</p>
                </div>
              ) : null}
              {workbenchActive && config.workbench ? (
                <div data-slot="component-playground-validation" className="flex flex-col gap-(--fds-g-spacing-control-gap)">
                  <PlaygroundSectionTitle dot="bg-success">{lang === "en" ? "Effective state" : "生效确认"}</PlaygroundSectionTitle>
                  <div className="flex flex-col gap-(--fds-g-spacing-control-gap-tight)">
                    {config.workbench.checks.map((check) => {
                      const result = validations[check.key]
                      return (
                        <div key={check.key} className="flex items-start gap-(--fds-g-spacing-control-gap-tight) text-sm">
                          <CheckCircleIcon className={result?.passed ? "mt-0.5 size-4 shrink-0 text-success" : "mt-0.5 size-4 shrink-0 text-destructive"} />
                          <div className="min-w-0">
                            <div className="font-medium text-foreground">{lang === "en" ? check.en : check.zh}</div>
                            <div className="text-xs text-muted-foreground">{lang === "en" ? (result?.detailEn ?? result?.detail) : result?.detail}</div>
                          </div>
                        </div>
                      )
                    })}
                    {inspection ? (
                      <div className="rounded-md border border-border-subtle bg-muted p-(--fds-g-spacing-control-inline-xs) font-mono text-xs leading-relaxed text-muted-foreground">
                        <div>data-slot=&quot;{inspection.slot}&quot;</div>
                        <div>height: {inspection.height}</div>
                        <div>background: {inspection.background}</div>
                        <div>border: {inspection.borderColor}</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[calc(var(--fds-g-sizing-control-block-lg)+12px)] items-center justify-between bg-[var(--fds-g-color-surface-subtle)] px-(--card-spacing)">
        <div className="flex h-full items-center gap-1">
          {tabs.map(({ value: t, icon, label }) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex h-full items-center gap-2 border-b-2 px-(--fds-g-spacing-control-inline-md) text-sm font-medium transition-colors ${
                activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {icon}{label}
            </button>
          ))}
        </div>
        {isMatrix ? null : (
          <div className="flex items-center gap-(--fds-g-spacing-control-gap-tight)">
            {config.workbench ? (
              <Button
                variant={workbenchActive ? "secondary" : "outline"}
                size="sm"
                onClick={toggleEditing}
              >
                {workbenchActive ? <CheckIcon data-icon="inline-start" /> : <PencilIcon data-icon="inline-start" />}
                {workbenchActive ? (lang === "en" ? "Finish editing" : "完成编辑") : (lang === "en" ? "Edit component" : "编辑组件")}
              </Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? <CheckIcon data-icon="inline-start" className="text-success" /> : <CopyIcon data-icon="inline-start" />}
              {copied ? (lang === "en" ? "Copied" : "已复制") : (lang === "en" ? "Copy" : "复制")}
            </Button>
          </div>
        )}
      </div>
      {activeTab === "preview" ? (
        <div ref={previewRef} className={config.previewClassName ?? "flex min-h-[200px] items-center justify-center bg-card p-[calc(var(--card-spacing)*2)]"}>
          <div className={config.previewItemsClassName ?? (isMatrix ? "flex flex-wrap items-center justify-center gap-(--playground-gap)" : "")}>{items}</div>
        </div>
      ) : (
        <div className="min-h-[200px] overflow-x-auto bg-foreground p-[calc(var(--card-spacing)*2)]">
          <pre className="font-mono text-sm leading-relaxed text-background/85"><code>{code}</code></pre>
        </div>
      )}
    </WebsiteCardContainer>
  )
}
