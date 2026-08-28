import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

export function ThemePanelHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return <h3 className="flex items-center gap-(--fds-g-spacing-control-gap) text-sm font-medium text-foreground"><span className="flex size-4 items-center justify-center text-muted-foreground [&_svg]:size-4">{icon}</span>{title}</h3>
}

export function ThemeChoiceButton({ selected, label, desc, optionId, style, onClick }: { selected: boolean; label: string; desc: ReactNode; optionId?: string; style?: CSSProperties; onClick: () => void }) {
  return <button type="button" aria-pressed={selected} data-theme-option={optionId} onClick={onClick} style={style} className={cn("flex min-h-[calc(var(--fds-g-sizing-control-block-lg)+8px)] flex-col justify-center rounded-lg border px-(--fds-g-spacing-control-inline-sm) py-(--fds-g-spacing-control-inline-xs) text-left outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50", selected ? "border-foreground bg-muted text-foreground" : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground")}><span className="text-xs font-bold">{label}</span><span className="mt-0.5 text-[11px] text-muted-foreground">{desc}</span></button>
}

export function ThemeChoiceSection<T extends string>({ icon, title, options, value, onChange, columns = 2 }: { icon: ReactNode; title: string; options: { id: T; label: string; desc: string }[]; value: T; onChange: (value: T) => void; columns?: 2 | 3 | 4 }) {
  return <section className="flex flex-col gap-(--fds-g-spacing-control-gap)"><ThemePanelHeading icon={icon} title={title} /><div className={cn("grid gap-(--fds-g-spacing-control-gap)", columns === 2 && "grid-cols-2", columns === 3 && "grid-cols-3", columns === 4 && "grid-cols-4")}>{options.map((item) => <ThemeChoiceButton key={item.id} selected={value === item.id} label={item.label} desc={item.desc} optionId={item.id} onClick={() => onChange(item.id)} />)}</div></section>
}
