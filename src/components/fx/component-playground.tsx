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
}
export type ComponentPlaygroundPropDef =
  | { key: string; zh: string; en: string; propName: string; type: "segment"; options: ComponentPlaygroundOption[]; hasAll?: boolean; disabledWhen?: (v: ComponentPlaygroundValues) => boolean }
  | { key: string; zh: string; en: string; propName: string; type: "text"; bilingual?: boolean; disabledWhen?: (v: ComponentPlaygroundValues) => boolean }
export type ComponentPlaygroundScenario = { id: string; zh: string; en: string; intent: string; intentEn: string; values: ComponentPlaygroundValues }
export type ComponentPlaygroundConfig = {
  scenarios?: ComponentPlaygroundScenario[]
  props: ComponentPlaygroundPropDef[]
  initial: ComponentPlaygroundValues
  guidanceKey?: string
  previewClassName?: string
  previewItemsClassName?: string
  onValueChange?: (next: ComponentPlaygroundValues, key: string, value: string) => ComponentPlaygroundValues
  renderOne: (v: ComponentPlaygroundValues, lang: ComponentPlaygroundLang) => ReactNode
  genCode: (v: ComponentPlaygroundValues, lang: ComponentPlaygroundLang) => string
}

function PlaygroundEyebrow({ dot, zh, en }: { dot: string; zh: string; en: string }) {
  return (
    <div className="mb-(--playground-gap) flex items-center gap-(--fx-control-gap-tight) text-[max(12px,var(--fx-text-xs))] font-semibold tracking-wider text-[var(--fx-neutrals-10)] uppercase">
      <span className={`size-1.5 rounded-full ${dot}`} />
      {zh} <span className="font-normal text-[var(--fx-neutrals-10)]">({en})</span>
    </div>
  )
}

function PlaygroundSectionTitle({ dot, children }: { dot: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-(--fx-control-gap-tight) text-[max(12px,var(--fx-text-xs))] font-semibold text-[var(--fx-neutrals-10)]">
      <span className={`size-1.5 rounded-full ${dot}`} />
      {children}
    </div>
  )
}

function PlaygroundPropLabel({ zh }: { zh: string }) {
  return (
    <label className="flex items-center gap-(--fx-control-gap-tight) text-sm font-semibold text-foreground-secondary">
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
  const segKeys = config.props.filter((p) => p.type === "segment").map((p) => p.key)
  const activeSc = config.scenarios?.find((sc) => segKeys.every((key) => sc.values[key] === v[key]))
  const guidanceProp = activeGuidanceKey ? config.props.find((p) => p.type === "segment" && p.key === activeGuidanceKey) : undefined
  const guidanceOption = guidanceProp?.type === "segment" ? guidanceProp.options.find((o) => o.value === v[guidanceProp.key]) : undefined
  const intentText = guidanceOption
    ? lang === "en" ? (guidanceOption.intentEn ?? guidanceOption.intent) : guidanceOption.intent
    : lang === "en" ? "Select a concrete variant to see the recommended usage." : "选择具体场景后查看推荐用法。"
  const constraintText = guidanceOption
    ? lang === "en" ? (guidanceOption.constraintEn ?? guidanceOption.constraint) : guidanceOption.constraint
    : lang === "en" ? "Keep props aligned with the component source. Do not invent local-only variants." : "调试项必须和组件源码能力一致，不发明局部变体。"

  let combos: ComponentPlaygroundValues[] = [v]
  for (const p of config.props) {
    if (p.type === "segment" && p.hasAll && v[p.key] === "all") {
      const next: ComponentPlaygroundValues[] = []
      for (const c of combos) for (const o of p.options) next.push({ ...c, [p.key]: o.value })
      combos = next
    }
  }
  const items = combos.map((c, i) => <Fragment key={i}>{config.renderOne(c, lang)}</Fragment>)
  const isMatrix = items.length > 1
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
      {config.scenarios ? (
        <div className="flex flex-col border-b border-border-subtle bg-card xl:flex-row">
          <div className="flex-1 border-b border-border-subtle p-(--card-spacing) xl:border-r xl:border-b-0">
            <PlaygroundEyebrow dot="bg-info" zh={lang === "en" ? "Scenarios" : "场景预设"} en="SCENARIOS" />
            <PgSegmented
              value={activeSc?.id ?? ""}
              onChange={(id) => { const sc = config.scenarios?.find((x) => x.id === id); if (sc) setV(sc.values) }}
              options={config.scenarios.map((sc) => ({ value: sc.id, label: lang === "en" ? sc.en : sc.zh }))}
            />
            {activeSc ? (
              <div className="mt-(--playground-gap) space-y-(--fx-control-gap) rounded-xl border border-border-subtle bg-card p-(--card-spacing) shadow-l1">
                <div>
                  <div className="mb-1 text-[max(12px,var(--fx-text-xs))] font-semibold tracking-wider text-[var(--fx-neutrals-10)] uppercase">{lang === "en" ? "Intent" : "使用意图"}</div>
                  <p className="text-base leading-relaxed text-foreground-secondary">{lang === "en" ? activeSc.intentEn : activeSc.intent}</p>
                </div>
                <div>
                  <div className="mb-1 text-[max(12px,var(--fx-text-xs))] font-semibold tracking-wider text-[var(--fx-neutrals-10)] uppercase">{lang === "en" ? "Recommended Code" : "推荐写法"}</div>
                  <code className="block rounded border border-border-subtle bg-muted px-(--fx-control-px-sm) py-(--fx-control-px-xs) font-mono text-sm break-words whitespace-pre-wrap text-foreground-secondary">{code}</code>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col gap-(--playground-gap) p-(--card-spacing)">
            <PlaygroundEyebrow dot="bg-primary" zh={lang === "en" ? "Interactive props" : "实时属性"} en="INTERACTIVE PROPS" />
            {config.props.map((p) => (
              <div key={p.key} className="flex flex-col gap-(--fx-control-gap-tight)">
                <PlaygroundPropLabel zh={lang === "en" ? p.en : p.zh} />
                {p.type === "text" ? (
                  <Input
                    value={(p.bilingual && lang === "en" ? v[`${p.key}En`] : v[p.key]) ?? ""}
                    disabled={p.disabledWhen?.(v) ?? false}
                    onChange={(e) => set(p.bilingual && lang === "en" ? `${p.key}En` : p.key, e.target.value)}
                    className="w-full max-w-72"
                  />
                ) : (
                  <PgSegmented value={v[p.key]} disabled={p.disabledWhen?.(v) ?? false} onChange={(val) => set(p.key, val)} options={p.options.map((o) => ({ value: o.value, label: lang === "en" ? (o.labelEn ?? o.label) : o.label, title: lang === "en" ? (o.titleEn ?? o.title) : o.title }))} allLabel={p.hasAll ? allLabel : undefined} />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-b border-border-subtle bg-card p-(--card-spacing)">
          <div className="grid gap-(--playground-gap) xl:grid-cols-2">
            <div className="flex flex-col gap-(--playground-gap)">
              <PlaygroundSectionTitle dot="bg-primary">{lang === "en" ? "Interactive props" : "实时属性"}</PlaygroundSectionTitle>
              {config.props.map((p) => (
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
                      options={p.options.map((o) => ({ value: o.value, label: lang === "en" ? (o.labelEn ?? o.label) : o.label, title: lang === "en" ? (o.titleEn ?? o.title) : o.title }))}
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
                  <p className="text-base leading-relaxed text-foreground-secondary">
                    {intentText}
                  </p>
                </div>
                {constraintText ? (
                  <div>
                    <div className="mb-1">
                      <PlaygroundSectionTitle dot="bg-primary">{lang === "en" ? "Constraint" : "约束"}</PlaygroundSectionTitle>
                    </div>
                    <p className="text-base leading-relaxed text-foreground-secondary">{constraintText}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex h-[calc(var(--fx-control-lg-height)+12px)] items-center justify-between bg-background px-(--card-spacing)">
        <div className="flex h-full items-center gap-1">
          {([["preview", <EyeIcon className="size-4" />, lang === "en" ? "Preview" : "预览"], ["code", <Code2Icon className="size-4" />, lang === "en" ? "Code" : "代码"]] as const).map(([t, icon, label]) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex h-full items-center gap-(--fx-control-gap-tight) border-b-2 px-(--fx-control-px-xs) text-sm font-medium transition-colors ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {icon}{label}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <CheckIcon data-icon="inline-start" className="text-success" /> : <CopyIcon data-icon="inline-start" />}
          {copied ? (lang === "en" ? "Copied" : "已复制") : (lang === "en" ? "Copy" : "复制")}
        </Button>
      </div>
      {tab === "preview" ? (
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
