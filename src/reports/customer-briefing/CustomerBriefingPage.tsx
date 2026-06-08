import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { CustomerBriefingData } from "./types"

/**
 * 客户360简报渲染页骨架。
 * 目标：吃下 `customer_briefing_standard_version` skill 产出的结构化数据（见 types.ts，
 * 字段 1:1 对齐该 skill 的 R01-R09 输出契约），用 fx-ui 真正的组件和公司 token 画出来，
 * 替代该 skill 现在自带的 R10 临时 HTML 渲染。
 * 当前只画了开篇的客户画像分区作为占位，其余分区待按 docs/REPORTS.md 的规划逐步补全。
 */
export function CustomerBriefingPage({ data }: { data: CustomerBriefingData }) {
  const profile = data.r01_customer_profile

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>{profile.customer_name}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {profile.industry} · {profile.segment} · {profile.location}
        </CardContent>
      </Card>

      {/*
        TODO：按 docs/REPORTS.md 的分区规划，逐个补齐：
        - r02_timeline 博弈时间线
        - r03_relationship_temperature 关系温度
        - r04_decision_chain / people_map 决策链与人力地图
        - r05_opportunity_overview 项目背景与商机全貌
        - r06_pain_map 痛点地图
        - r07_competitive_overview 竞品全貌
        - r08_open_questions 结论摘要 / 风险矩阵 / 行动建议
        - r09_history_financial（仅 full 模式存在时渲染）
      */}
    </div>
  )
}
