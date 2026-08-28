import type { ReactNode } from "react"

import foundationManifestRaw from "../../../../docs/data/fds-foundation.manifest.json?raw"
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { PageLead } from "@/components/fx/page-lead"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { docsSpacing } from "@/lib/docs-spacing"
import { HomeIcon } from "@/lib/icons"

type FoundationToken = {
  name: string
  value: string
  path: string
}

type FoundationManifest = {
  tokens: FoundationToken[]
}

const foundationManifest = JSON.parse(foundationManifestRaw) as FoundationManifest
const tokensByName = new Map(foundationManifest.tokens.map((token) => [token.name, token]))

const iconSizeUsage = [
  { name: "--fds-g-sizing-12", usage: "内联图标、徽标", usageEn: "Inline icons and badges" },
  { name: "--fds-g-sizing-14", usage: "紧凑型控件", usageEn: "Compact controls" },
  { name: "--fds-g-sizing-16", usage: "默认控件图标", usageEn: "Default control icons" },
  { name: "--fds-g-sizing-20", usage: "列表与强调图标", usageEn: "List and emphasis icons" },
  { name: "--fds-g-sizing-24", usage: "页面级与空状态图标", usageEn: "Page-level and empty-state icons" },
]

const iconSizeTokens = iconSizeUsage.map((item) => ({
  ...item,
  token: tokensByName.get(item.name),
})).filter((item): item is typeof item & { token: FoundationToken } => Boolean(item.token))

const iconStrokeUsage: Record<string, { usage: string; usageEn: string }> = {
  "--fds-g-icon-stroke-150": { usage: "轻量展示备选", usageEn: "Lightweight display option" },
  "--fds-g-icon-stroke-175": { usage: "FDS 默认线宽", usageEn: "FDS default stroke" },
  "--fds-g-icon-stroke-200": { usage: "高对比展示备选", usageEn: "High-contrast display option" },
}

const iconStrokeTokens = foundationManifest.tokens
  .filter((token) => token.path.startsWith("icon.stroke."))
  .map((token) => ({ ...token, ...iconStrokeUsage[token.name] }))
  .filter((token) => token.usage)

export const tokenIconAnchors = [
  { label: "尺寸档位", labelEn: "Size scale", href: "#tokens-icons-size" },
  { label: "线宽档位", labelEn: "Stroke scale", href: "#tokens-icons-stroke" },
  { label: "使用边界", labelEn: "Usage boundaries", href: "#tokens-icons-rules" },
]

export function TokensIconsPage({ actions, lang }: { actions: ReactNode; lang: "zh" | "en" }) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="tokens-icons" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Design Tokens / Icons" : "设计令牌 / 图标"}
          title={lang === "en" ? "Icons" : "图标"}
          lead={lang === "en" ? "A shared icon language governs size, stroke, shape, and color ownership without exposing component playgrounds." : "统一图标语言管理尺寸、线宽、形态与颜色归属，不混入组件调试能力。"}
          actions={actions}
        />
      </section>

      <section id="tokens-icons-size" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <div className="flex flex-col gap-1">
          <h2 className="text-section-title">{lang === "en" ? "Size scale" : "尺寸档位"}</h2>
          <p className="text-body text-muted-foreground">{lang === "en" ? "Icon sizes reuse the governed sizing scale. Components own the final size mapping." : "图标尺寸复用受治理的尺寸刻度；最终使用哪一档由组件契约决定。"}</p>
        </div>
        <DocSurfaceTableCard>
          <Table className="min-w-[680px]">
            <TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead>{lang === "en" ? "Preview" : "预览"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Intent" : "使用意图"}</TableHead></TableRow></TableHeader>
            <TableBody>{iconSizeTokens.map(({ token, usage, usageEn }) => <TableRow key={token.name} className="hover:bg-transparent">
              <TableCell className="pl-4"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{token.name}</code></TableCell>
              <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{token.value}</code></TableCell>
              <TableCell><div className="flex h-10 w-16 items-center justify-center text-foreground"><HomeIcon aria-hidden="true" style={{ width: `var(${token.name})`, height: `var(${token.name})` }} /></div></TableCell>
              <TableCell className="pr-4">{lang === "en" ? usageEn : usage}</TableCell>
            </TableRow>)}</TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="tokens-icons-stroke" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <div className="flex flex-col gap-1">
          <h2 className="text-section-title">{lang === "en" ? "Stroke scale" : "线宽档位"}</h2>
          <p className="text-body text-muted-foreground">{lang === "en" ? "The global default is 1.75. Alternative steps are governed options, not per-icon adjustments." : "全局默认使用 1.75；其余档位是受治理备选，不允许逐个图标随意调整。"}</p>
        </div>
        <DocSurfaceTableCard>
          <Table className="min-w-[680px]">
            <TableHeader><TableRow><TableHead className="pl-4">Token</TableHead><TableHead>{lang === "en" ? "Value" : "值"}</TableHead><TableHead>{lang === "en" ? "Preview" : "预览"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Intent" : "使用意图"}</TableHead></TableRow></TableHeader>
            <TableBody>{iconStrokeTokens.map((token) => <TableRow key={token.name} className="hover:bg-transparent">
              <TableCell className="pl-4"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{token.name}</code></TableCell>
              <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{token.value}</code></TableCell>
              <TableCell><div className="flex h-10 w-16 items-center justify-center text-foreground"><HomeIcon aria-hidden="true" className="size-6" style={{ strokeWidth: `var(${token.name})` }} /></div></TableCell>
              <TableCell className="pr-4">{lang === "en" ? token.usageEn : token.usage}</TableCell>
            </TableRow>)}</TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="tokens-icons-rules" className={`${docsSpacing.sectionStack} scroll-mt-24`}>
        <div className="flex flex-col gap-1">
          <h2 className="text-section-title">{lang === "en" ? "Usage boundaries" : "使用边界"}</h2>
          <p className="text-body text-muted-foreground">{lang === "en" ? "Foundation defines the visual language; semantic color and component placement stay with their owning layers." : "Foundation 只定义视觉语言；语义颜色与组件内位置仍由各自上层负责。"}</p>
        </div>
        <DocSurfaceCard className="p-5">
          <div className="grid gap-4 text-body md:grid-cols-3">
            <div><p className="text-label">{lang === "en" ? "Shape" : "形态"}</p><p className="mt-1 text-muted-foreground">{lang === "en" ? "Line icons by default; filled variants indicate selected or emphasized states." : "默认使用线性图标；选中或强调态才切换面型。"}</p></div>
            <div><p className="text-label">{lang === "en" ? "Color" : "颜色"}</p><p className="mt-1 text-muted-foreground">{lang === "en" ? "Use currentColor and semantic text roles. Foundation does not create icon-specific semantic colors." : "使用 currentColor 跟随语义文字色，不另建图标专属语义色。"}</p></div>
            <div><p className="text-label">{lang === "en" ? "Components" : "组件"}</p><p className="mt-1 text-muted-foreground">{lang === "en" ? "Buttons and other controls own icon placement and final dimensions through their existing APIs." : "按钮等控件通过既有 API 管理图标位置与最终尺寸。"}</p></div>
          </div>
        </DocSurfaceCard>
      </section>
    </div>
  )
}
