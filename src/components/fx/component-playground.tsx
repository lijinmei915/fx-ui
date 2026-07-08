import { Fragment, type ReactNode, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckIcon, Code2Icon, CopyIcon, EyeIcon } from "@/lib/icons"

export type ComponentPlaygroundLang = "zh" | "en"
export type ComponentPlaygroundValues = Record<string, string>
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
export type ComponentPlaygroundPropDef =
  | { key: string; zh: string; en: string; propName: string; type: "segment"; options: ComponentPlaygroundOption[]; hasAll?: boolean; disabledWhen?: (v: ComponentPlaygroundValues) => boolean; hiddenWhen?: (v: ComponentPlaygroundValues) => boolean }
  | { key: string; zh: string; en: string; propName: string; type: "text"; bilingual?: boolean; disabledWhen?: (v: ComponentPlaygroundValues) => boolean; hiddenWhen?: (v: ComponentPlaygroundValues) => boolean }
export type ComponentPlaygroundConfig = {
  props: ComponentPlaygroundPropDef[]
  initial: ComponentPlaygroundValues
  guidanceKey?: string
  previewClassName?: string
  previewItemsClassName?: string
  onValueChange?: (next: ComponentPlaygroundValues, key: string, value: string) => ComponentPlaygroundValues
  renderOne: (v: ComponentPlaygroundValues, lang: ComponentPlaygroundLang) => ReactNode
  genCode: (v: ComponentPlaygroundValues, lang: ComponentPlaygroundLang) => string
}

function PlaygroundSectionTitle({ dot, children }: { dot: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-(--fx-control-gap-tight) text-xs font-normal text-[var(--fx-neutrals-10)]">
      <span className={`size-1.5 rounded-full ${dot}`} />
      {children}
    </div>
  )
}

function PlaygroundPropLabel({ zh }: { zh: string }) {
  return (
    <label className="flex items-center gap-(--fx-control-gap-tight) text-sm font-medium text-foreground-secondary">
      {zh}
    </label>
  )
}

function PgSeg({ active, disabled, isAll, label, title, onClick }: { active: boolean; disabled?: boolean; isAll?: boolean; label: string; title?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`min-h-(--fx-control-xs-height) rounded-xs px-(--fx-control-px-xs) py-1 text-sm font-medium transition-all ${
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

function PgSegmented({ value, onChange, options, allLabel, disabled }: { value: string; onChange: (v: string) => void; options: { value: string; label: string; title?: string }[]; allLabel?: string; disabled?: boolean }) {
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

export function ComponentPlayground({ config, lang }: { config: ComponentPlaygroundConfig; lang: ComponentPlaygroundLang }) {
  const [v, setV] = useState<ComponentPlaygroundValues>(config.initial)
  const [tab, setTab] = useState("preview")
  const [copied, setCopied] = useState(false)
  const [activeGuidanceKey, setActiveGuidanceKey] = useState(config.guidanceKey ?? config.props.find((p) => p.type === "segment")?.key)
  const allLabel = lang === "en" ? "All" : "全部"
  const set = (key: string, val: string) => setV((prev) => {
    setActiveGuidanceKey(key)
    const next = { ...prev, [key]: val }
    return config.onValueChange?.(next, key, val) ?? next
  })
  const guidanceProp = activeGuidanceKey ? config.props.find((p) => p.type === "segment" && p.key === activeGuidanceKey) : undefined
  const guidanceOption = guidanceProp?.type === "segment" ? guidanceProp.options.find((o) => o.value === v[guidanceProp.key]) : undefined
  const isAllGuidance = guidanceProp?.type === "segment" && guidanceProp.hasAll && v[guidanceProp.key] === "all"
  const intentText = isAllGuidance
    ? lang === "en" ? "Preview all values in this dimension to compare the component states side by side." : "同时预览这一维度下的所有取值，用来横向比较组件状态。"
    : guidanceOption
    ? lang === "en" ? (guidanceOption.intentEn ?? guidanceOption.intent) : guidanceOption.intent
    : lang === "en" ? "Select a concrete variant to see the recommended usage." : "选择具体场景后查看推荐用法。"
  const constraintText = isAllGuidance
    ? lang === "en" ? "“All” is only for matrix preview. Choose one concrete value before copying code; do not pass an all prop." : "“全部”只用于矩阵预览；需要复制代码时先选一个具体取值，不传 all 这类伪属性。"
    : guidanceOption
    ? lang === "en" ? (guidanceOption.constraintEn ?? guidanceOption.constraint) : guidanceOption.constraint
    : lang === "en" ? "Keep props aligned with the component source. Do not invent local-only variants." : "调试项必须和组件源码能力一致，不发明局部变体。"
  const visibleProps = config.props.filter((p) => !(p.hiddenWhen?.(v) ?? false))

  let combos: ComponentPlaygroundValues[] = [v]
  for (const p of config.props) {
    if (p.type === "segment" && p.hasAll && v[p.key] === "all") {
      const next: ComponentPlaygroundValues[] = []
      for (const c of combos) {
        for (const o of p.options.filter((option) => !(option.hiddenWhen?.(c) ?? false))) {
          next.push({ ...c, [p.key]: o.value })
        }
      }
      combos = next
    }
  }
  const items = combos.map((c, i) => <Fragment key={i}>{config.renderOne(c, lang)}</Fragment>)
  const isMatrix = items.length > 1
  const activeTab = isMatrix ? "preview" : tab
  const tabs: { value: string; icon: ReactNode; label: string }[] = [
    { value: "preview", icon: <EyeIcon className="size-4" />, label: lang === "en" ? "Preview" : "预览" },
    ...(isMatrix ? [] : [{ value: "code", icon: <Code2Icon className="size-4" />, label: lang === "en" ? "Code" : "代码" }]),
  ]
  const code = config.genCode(combos[0], lang)
  const copy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      data-slot="card"
      className="overflow-hidden rounded-xl border border-border-container bg-card shadow-l1 [--card-spacing:var(--fx-panel-padding)] [--playground-gap:var(--fx-panel-gap)]"
    >
      <div className="border-b border-border-subtle bg-card p-(--card-spacing)">
        <div className="grid gap-(--playground-gap) xl:grid-cols-2">
          <div className="flex flex-col gap-(--playground-gap)">
            <PlaygroundSectionTitle dot="bg-primary">{lang === "en" ? "Interactive props" : "实时属性"}</PlaygroundSectionTitle>
            {visibleProps.map((p) => (
              <div key={p.key} className="flex flex-col gap-(--fx-control-gap-tight)">
                <PlaygroundPropLabel zh={lang === "en" ? p.en : p.zh} />
                {p.type === "text" ? (
                  <Input
                    value={(p.bilingual && lang === "en" ? v[`${p.key}En`] : v[p.key]) ?? ""}
                    disabled={p.disabledWhen?.(v) ?? false}
                    onChange={(e) => set(p.bilingual && lang === "en" ? `${p.key}En` : p.key, e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <PgSegmented
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
          <div className="border-l border-border-subtle pl-(--card-spacing)">
            <div className="space-y-(--playground-gap)">
              <div>
                <div className="mb-1">
                  <PlaygroundSectionTitle dot="bg-primary">{lang === "en" ? "Intent" : "使用意图"}</PlaygroundSectionTitle>
                </div>
                <p className="text-sm leading-relaxed text-foreground-secondary">
                  {intentText}
                </p>
              </div>
              {constraintText ? (
                <div>
                  <div className="mb-1">
                    <PlaygroundSectionTitle dot="bg-primary">{lang === "en" ? "Constraint" : "约束"}</PlaygroundSectionTitle>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground-secondary">{constraintText}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[calc(var(--fx-control-lg-height)+12px)] items-center justify-between bg-background px-(--card-spacing)">
        <div className="flex h-full items-center gap-1">
          {tabs.map(({ value: t, icon, label }) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex h-full items-center gap-(--fx-control-gap-tight) border-b-2 px-(--fx-control-px-xs) text-sm font-medium transition-colors ${
                activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {icon}{label}
            </button>
          ))}
        </div>
        {isMatrix ? null : (
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <CheckIcon data-icon="inline-start" className="text-success" /> : <CopyIcon data-icon="inline-start" />}
            {copied ? (lang === "en" ? "Copied" : "已复制") : (lang === "en" ? "Copy" : "复制")}
          </Button>
        )}
      </div>
      {activeTab === "preview" ? (
        <div className={config.previewClassName ?? "flex min-h-[200px] items-center justify-center bg-card p-[calc(var(--card-spacing)*2)]"}>
          <div className={config.previewItemsClassName ?? (isMatrix ? "flex flex-wrap items-center justify-center gap-(--playground-gap)" : "")}>{items}</div>
        </div>
      ) : (
        <div className="min-h-[200px] overflow-x-auto bg-foreground p-[calc(var(--card-spacing)*2)]">
          <pre className="font-mono text-sm leading-relaxed text-background/85"><code>{code}</code></pre>
        </div>
      )}
    </div>
  )
}
