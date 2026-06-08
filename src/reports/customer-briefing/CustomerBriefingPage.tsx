import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { CustomerBriefingData } from "./types"

/**
 * 客户360简报渲染页骨架。
 * 目标：吃下 `customer_briefing_standard_version` skill 产出的结构化数据（见 types.ts），
 * 用 fx-ui 真正的组件和公司 token 画出来，替代该 skill 现在自带的 R10 临时 HTML 渲染。
 * 当前只是骨架占位，具体每个分区的视觉设计待后续按 docs/REPORTS.md 的规划逐步补全。
 */
export function CustomerBriefingPage({ data }: { data: CustomerBriefingData }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>{data.profile.customerName}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {data.profile.industry} · {data.profile.segment}
        </CardContent>
      </Card>

      {/* TODO：按 docs/REPORTS.md 的分区规划，逐个补齐时间线/决策链/痛点/竞品等分区 */}
    </div>
  )
}
