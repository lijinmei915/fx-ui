import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { CustomerBriefingData } from "./types"

/**
 * 客户360简报渲染页。
 *
 * 吃下 `customer_briefing_standard_version` skill 产出的结构化数据（见 types.ts，
 * 字段 1:1 对齐该 skill 的 R01-R09 输出契约），用 fx-ui 真正的组件和公司 token 画出来，
 * 替代该 skill 现在自带的 R10 临时 HTML 渲染——这样对外的客户简报和公司产品视觉调性一致，
 * 换肤时也会自动跟着变。
 *
 * 渲染顺序大体遵循 R01→R08 的分析顺序：先建立客户认知（画像/时间线/关系），
 * 再看商业全貌（商机/痛点/竞品），最后看综合判断（结论摘要/风险/行动建议）。
 */
export function CustomerBriefingPage({ data }: { data: CustomerBriefingData }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 lg:px-8">
      <ProfileSection profile={data.r01_customer_profile} />
      <ExecutiveSummarySection summary={data.r08_open_questions.executive_summary} />
      <TimelineSection timeline={data.r02_timeline} />
      <RelationshipSection temperature={data.r03_relationship_temperature} />
      <DecisionChainSection decisionChain={data.r04_decision_chain} peopleMap={data.people_map} />
      <OpportunitySection overview={data.r05_opportunity_overview} />
      <PainMapSection painMap={data.r06_pain_map} />
      <CompetitiveSection competitive={data.r07_competitive_overview} />
      <RiskAndActionsSection openQuestions={data.r08_open_questions} />
      {data.r09_history_financial ? (
        <HistoryFinancialSection history={data.r09_history_financial} />
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 通用小件：把契约里的枚举值映射成带颜色含义的 Badge
// ---------------------------------------------------------------------------

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    confirmed: { label: "已确认", variant: "default" },
    inferred: { label: "推断", variant: "secondary" },
    unknown: { label: "未知", variant: "outline" },
  }
  const item = map[confidence] ?? { label: confidence, variant: "outline" as const }
  return <Badge variant={item.variant}>{item.label}</Badge>
}

function LevelBadge({ level }: { level: string }) {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    high: { label: "高", variant: "destructive" },
    medium: { label: "中", variant: "secondary" },
    low: { label: "低", variant: "outline" },
    unknown: { label: "未知", variant: "outline" },
  }
  const item = map[level] ?? { label: level, variant: "outline" as const }
  return <Badge variant={item.variant}>{item.label}</Badge>
}

function AttitudeBadge({ attitude }: { attitude: string }) {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    support: { label: "支持", variant: "default" },
    neutral: { label: "中立", variant: "secondary" },
    doubtful: { label: "摇摆", variant: "outline" },
    opposed: { label: "阻碍", variant: "destructive" },
    unknown: { label: "未知", variant: "outline" },
  }
  const item = map[attitude] ?? { label: attitude, variant: "outline" as const }
  return <Badge variant={item.variant}>{item.label}</Badge>
}

function StageBadge({ stage }: { stage: string }) {
  return <Badge variant="outline">{stage}</Badge>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <CardTitle className="text-base">{children}</CardTitle>
}

function Empty({ children = "暂无数据" }: { children?: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

// ---------------------------------------------------------------------------
// R01 客户画像
// ---------------------------------------------------------------------------

function ProfileSection({ profile }: { profile: CustomerBriefingData["r01_customer_profile"] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-xl">{profile.customer_name}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.industry} · {profile.segment} · {profile.location}
          </p>
        </div>
        <Badge variant="secondary">{profile.deal_status}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-foreground">{profile.business_description}</p>
        <Separator />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
          <ProfileField label="员工规模" value={profile.employee_count} />
          <ProfileField label="营收区间" value={profile.revenue_band} />
          <ProfileField label="客户来源" value={profile.account_source} />
          <ProfileField label="最近跟进" value={profile.last_followed_time} />
        </dl>
        {profile.strategic_signals.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">战略信号</p>
            <ul className="flex flex-col gap-1">
              {profile.strategic_signals.map((signal, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ConfidenceBadge confidence={signal.confidence} />
                  <span>{signal.signal}</span>
                  <span className="text-xs text-muted-foreground/70">（来源：{signal.source}）</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}

// ---------------------------------------------------------------------------
// R08 结论摘要（提前到时间线之前，先给"一句话结论"建立整体认知）
// ---------------------------------------------------------------------------

function ExecutiveSummarySection({
  summary,
}: {
  summary: CustomerBriefingData["r08_open_questions"]["executive_summary"]
}) {
  const rows: Array<{ label: string; item: { conclusion: string; confidence: string } }> = [
    { label: "客户现状", item: summary.customer_status },
    { label: "主要机会", item: summary.main_opportunity },
    { label: "主要风险", item: summary.main_risk },
    { label: "决策链", item: summary.decision_chain },
    { label: "关系温度", item: summary.relationship_temperature },
    { label: "最大缺口", item: summary.biggest_gap },
  ]

  return (
    <Card>
      <CardHeader>
        <SectionTitle>结论摘要</SectionTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-base font-medium text-foreground">{summary.one_sentence_conclusion}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{row.label}</p>
                <ConfidenceBadge confidence={row.item.confidence} />
              </div>
              <p className="text-sm text-foreground">{row.item.conclusion}</p>
            </div>
          ))}
        </div>
        {summary.focus_points.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">关注重点</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {summary.focus_points.map((point, index) => (
                <li key={index}>
                  <span className="text-foreground">{point.focus}</span> — {point.reason}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// R02 博弈时间线
// ---------------------------------------------------------------------------

function TimelineSection({ timeline }: { timeline: CustomerBriefingData["r02_timeline"] }) {
  return (
    <Card>
      <CardHeader>
        <SectionTitle>博弈时间线</SectionTitle>
        <p className="text-xs text-muted-foreground">{timeline.time_range}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {timeline.events.length === 0 ? (
          <Empty />
        ) : (
          <ol className="flex flex-col gap-3">
            {timeline.events.map((event, index) => (
              <li key={index} className="flex gap-3">
                <div className="w-20 shrink-0 text-xs text-muted-foreground">{event.date}</div>
                <div className="flex flex-1 flex-col gap-1 border-l border-border pl-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{event.event}</p>
                    <ConfidenceBadge confidence={event.confidence} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    我方动作：{event.our_action} · 客户反应：{event.customer_reaction}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
        {timeline.key_turning_points.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">关键转折点</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {timeline.key_turning_points.map((point, index) => (
                <li key={index}>
                  <span className="text-foreground">{point.date} · {point.turning_point}</span> — {point.reason}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// R03 关系温度
// ---------------------------------------------------------------------------

function RelationshipSection({
  temperature,
}: {
  temperature: CustomerBriefingData["r03_relationship_temperature"]
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <SectionTitle>关系温度</SectionTitle>
        <Badge variant="secondary">总体温度 {temperature.overall_temperature} · {temperature.trend}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{temperature.reason}</p>
        {temperature.key_people.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>关键人</TableHead>
                <TableHead>职务</TableHead>
                <TableHead>温度 / 趋势</TableHead>
                <TableHead>证据</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {temperature.key_people.map((person, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-foreground">{person.name}</TableCell>
                  <TableCell className="text-muted-foreground">{person.title}</TableCell>
                  <TableCell className="text-muted-foreground">{person.temperature} · {person.trend}</TableCell>
                  <TableCell className="text-muted-foreground">{person.evidence}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
        {temperature.risk_people.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">风险人员</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {temperature.risk_people.map((person, index) => (
                <li key={index}>
                  <span className="text-foreground">{person.name}</span> — {person.reason}（{person.impact}）
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// R04 决策链与人力地图
// ---------------------------------------------------------------------------

function DecisionChainSection({
  decisionChain,
  peopleMap,
}: {
  decisionChain: CustomerBriefingData["r04_decision_chain"]
  peopleMap: CustomerBriefingData["people_map"]
}) {
  const { coverage_analysis: coverage } = decisionChain

  return (
    <Card>
      <CardHeader>
        <SectionTitle>决策链与人力地图</SectionTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">EB（预算拍板人）</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{decisionChain.eb.name}</p>
            <ConfidenceBadge confidence={decisionChain.eb.confidence} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{decisionChain.eb.evidence}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>人员</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>影响力</TableHead>
              <TableHead>态度</TableHead>
              <TableHead>证据</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {decisionChain.key_people.map((person, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-foreground">
                  {person.name}
                  <span className="ml-1 text-xs text-muted-foreground">{person.title}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{person.role}</Badge>
                </TableCell>
                <TableCell>
                  <LevelBadge level={person.influence_level} />
                </TableCell>
                <TableCell>
                  <AttitudeBadge attitude={person.attitude} />
                </TableCell>
                <TableCell className="text-muted-foreground">{person.evidence}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">组织政治</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {decisionChain.political_map.alliances.map((item, index) => (
                <li key={`alliance-${index}`}>支持路径：{item.description}</li>
              ))}
              {decisionChain.political_map.conflicts.map((item, index) => (
                <li key={`conflict-${index}`}>冲突/阻碍：{item.description}</li>
              ))}
              {decisionChain.political_map.access_paths.map((item, index) => (
                <li key={`path-${index}`}>进入路径：{item.path}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-3">
            <p className="text-sm font-medium text-foreground">决策链覆盖分析</p>
            <dl className="flex flex-col gap-1 text-sm">
              <CoverageRow label="覆盖率" value={coverage.coverage_ratio} />
              <CoverageRow label="最大缺口" value={coverage.key_gap} />
              <CoverageRow label="可借力路径" value={coverage.leverage_path} />
            </dl>
          </div>
        </div>

        {peopleMap.missing_people.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">人力地图缺口</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {peopleMap.missing_people.map((person, index) => (
                <li key={index}>
                  <span className="text-foreground">{person.role}</span> — {person.why_needed}
                  {person.suggested_verification ? `（建议：${person.suggested_verification}）` : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function CoverageRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{value}</dd>
    </div>
  )
}

// ---------------------------------------------------------------------------
// R05 项目背景与商机全貌
// ---------------------------------------------------------------------------

function OpportunitySection({
  overview,
}: {
  overview: CustomerBriefingData["r05_opportunity_overview"]
}) {
  const { project_background: background } = overview

  return (
    <Card>
      <CardHeader>
        <SectionTitle>项目背景与商机全貌</SectionTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-foreground">项目起源</p>
          <p className="text-sm text-muted-foreground">{background.origin}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-sm font-medium text-foreground">预算与审批</p>
          <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-4">
            <ProfileField label="预算区间" value={background.budget_and_approval.budget_range} />
            <ProfileField label="审批链路" value={background.budget_and_approval.approval_chain} />
            <ProfileField label="决策时间表" value={background.budget_and_approval.decision_timeline} />
            <ProfileField label="当前阶段" value={background.budget_and_approval.current_stage} />
          </dl>
        </div>

        {overview.active_opportunities.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商机</TableHead>
                <TableHead>阶段</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>赢率</TableHead>
                <TableHead>主要阻碍</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overview.active_opportunities.map((opportunity) => (
                <TableRow key={opportunity.opportunity_id}>
                  <TableCell className="font-medium text-foreground">{opportunity.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{opportunity.stage}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{opportunity.amount}</TableCell>
                  <TableCell className="text-muted-foreground">{opportunity.probability}</TableCell>
                  <TableCell className="text-muted-foreground">{opportunity.main_blocker}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty>暂无活跃商机</Empty>
        )}

        {overview.usage_scope.user_groups.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">使用范围</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {overview.usage_scope.user_groups.map((group, index) => (
                <li key={index}>
                  <span className="text-foreground">{group.group}</span>（{group.scale}）— {group.core_need}
                  <Badge variant="outline" className="ml-2">{group.priority}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// R06 痛点地图
// ---------------------------------------------------------------------------

function PainMapSection({ painMap }: { painMap: CustomerBriefingData["r06_pain_map"] }) {
  return (
    <Card>
      <CardHeader>
        <SectionTitle>痛点地图</SectionTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <PainList
          title="已确认痛点"
          items={painMap.confirmed_pains.map((pain) => ({
            text: pain.pain,
            badge: pain.evidence_level,
            detail: pain.business_impact,
          }))}
        />
        <PainList
          title="推断痛点（待验证）"
          items={painMap.inferred_pains.map((pain) => ({
            text: pain.pain,
            badge: "推断",
            detail: pain.validation_question,
          }))}
        />
        {painMap.non_pains.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">已排除项</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {painMap.non_pains.map((item, index) => (
                <li key={index}>
                  <span className="text-foreground">{item.item}</span> — {item.reason}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function PainList({
  title,
  items,
}: {
  title: string
  items: Array<{ text: string; badge: string; detail: string }>
}) {
  if (items.length === 0) return null
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Badge variant="outline" className="mt-0.5 shrink-0">{item.badge}</Badge>
            <div>
              <span className="text-foreground">{item.text}</span>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// R07 竞品全貌
// ---------------------------------------------------------------------------

function CompetitiveSection({
  competitive,
}: {
  competitive: CustomerBriefingData["r07_competitive_overview"]
}) {
  return (
    <Card>
      <CardHeader>
        <SectionTitle>竞品全貌</SectionTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{competitive.current_position.summary}</p>
        {competitive.competitors.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>竞品</TableHead>
                <TableHead>阶段</TableHead>
                <TableHead>我方优势</TableHead>
                <TableHead>我方劣势</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitive.competitors.map((competitor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-foreground">{competitor.name}</TableCell>
                  <TableCell>
                    <StageBadge stage={competitor.stage} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{competitor.our_advantage}</TableCell>
                  <TableCell className="text-muted-foreground">{competitor.our_weakness}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty>暂无竞品信息</Empty>
        )}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// R08 风险矩阵与行动建议
// ---------------------------------------------------------------------------

function RiskAndActionsSection({
  openQuestions,
}: {
  openQuestions: CustomerBriefingData["r08_open_questions"]
}) {
  return (
    <Card>
      <CardHeader>
        <SectionTitle>风险矩阵与行动建议</SectionTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {openQuestions.risk_matrix.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">风险矩阵</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>风险</TableHead>
                  <TableHead>等级</TableHead>
                  <TableHead>触发条件</TableHead>
                  <TableHead>应对方向</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openQuestions.risk_matrix.map((risk, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-foreground">{risk.risk}</TableCell>
                    <TableCell>
                      <LevelBadge level={risk.level} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{risk.trigger}</TableCell>
                    <TableCell className="text-muted-foreground">{risk.mitigation_direction}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        {openQuestions.next_best_actions.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">下一步行动建议</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {openQuestions.next_best_actions.map((action, index) => (
                <li key={index}>
                  <span className="text-foreground">{action.action}</span> — {action.purpose}
                  <span className="text-xs text-muted-foreground/70">
                    {" "}
                    （负责：{action.owner_or_role} · 时间：{action.timing}）
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {openQuestions.key_unknowns.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">关键未知项</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {openQuestions.key_unknowns.map((item, index) => (
                <li key={index}>
                  <span className="text-foreground">{item.question}</span> — {item.why_it_matters}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// R09 历史合作、财务与客户健康（仅 full 模式）
// ---------------------------------------------------------------------------

function HistoryFinancialSection({
  history,
}: {
  history: NonNullable<CustomerBriefingData["r09_history_financial"]>
}) {
  const { lifecycle_summary: lifecycle } = history

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <SectionTitle>历史合作与财务健康</SectionTitle>
        <Badge variant="secondary">{lifecycle.lifecycle_stage}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
          <ProfileField label="合同数量" value={lifecycle.contract_count} />
          <ProfileField label="合同总额" value={lifecycle.total_contract_amount} />
          <ProfileField label="累计回款" value={lifecycle.total_payment_amount} />
          <ProfileField label="应收账款" value={lifecycle.receivable_amount} />
        </dl>

        {history.health_risks.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">客户健康风险</p>
            <ul className="flex flex-col gap-1.5">
              {history.health_risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <LevelBadge level={risk.severity} />
                  <div>
                    <span className="text-foreground">{risk.risk}</span>
                    <p className="text-xs text-muted-foreground">{risk.impact}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
