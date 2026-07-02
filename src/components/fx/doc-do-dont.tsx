import { CheckCircleIcon, AlertTriangleIcon } from "@/lib/icons"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocSurfaceCard } from "@/components/fx/doc-surface"

type DocDoDontRow = {
  do: string
  dont: string
  doEn?: string
  dontEn?: string
}

type DocDoDontProps = {
  lang?: "zh" | "en"
  rows: DocDoDontRow[]
  elevated?: boolean
}

function DocDoDont({ lang = "zh", rows, elevated = false }: DocDoDontProps) {
  const isEnglish = lang === "en"

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DocSurfaceCard elevated={elevated}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-foreground">
            <CheckCircleIcon className="size-[18px] text-success" />
            <span>{isEnglish ? "Do" : "推荐 Do"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          {rows.map((row) => (
            <div key={`do-${row.do}-${row.dont}`} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-success" />
              <span>{isEnglish ? row.doEn ?? row.do : row.do}</span>
            </div>
          ))}
        </CardContent>
      </DocSurfaceCard>

      <DocSurfaceCard elevated={elevated}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-foreground">
            <AlertTriangleIcon className="size-[18px] text-destructive" />
            <span>{isEnglish ? "Don’t" : "避免 Don't"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          {rows.map((row) => (
            <div key={`dont-${row.do}-${row.dont}`} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
              <span>{isEnglish ? row.dontEn ?? row.dont : row.dont}</span>
            </div>
          ))}
        </CardContent>
      </DocSurfaceCard>
    </div>
  )
}

export { DocDoDont, type DocDoDontRow, type DocDoDontProps }
