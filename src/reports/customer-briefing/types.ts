/**
 * 客户360简报的数据契约。
 * 字段结构对齐外部 `customer_briefing_standard_version` skill 的 R01-R09 输出契约（YAML），
 * 以便该 skill 产出的数据可以直接喂给 `CustomerBriefingPage` 渲染，不需要中间转换层。
 * 字段细节以 skill 的 rules/R0x_*.md 为准，这里先占位骨架，后续补全时同步过去对照。
 */

export interface CustomerProfile {
  customerId: string
  customerName: string
  industry: string
  segment: string
}

export interface TimelineEvent {
  date: string
  event: string
}

export interface RelationshipTemperature {
  overallScore: number
  trend: string
}

export interface DecisionChainPerson {
  name: string
  role: "EB" | "TB" | "UX" | "Coach" | "Gatekeeper" | "Influencer" | "Unknown"
  notes: string
}

export interface OpportunityOverview {
  projectBackground: {
    origin: string
  }
}

export interface PainPoint {
  description: string
  evidenceLevel: "E1" | "E2" | "E3"
}

export interface CompetitorOverview {
  name: string
  stage: "C0" | "C1" | "C2" | "C3"
}

export interface OpenQuestion {
  question: string
  confidence: "confirmed" | "inferred" | "unknown"
}

export interface CustomerBriefingData {
  profile: CustomerProfile
  timeline: TimelineEvent[]
  relationshipTemperature: RelationshipTemperature
  decisionChain: DecisionChainPerson[]
  opportunityOverview: OpportunityOverview
  painPoints: PainPoint[]
  competitors: CompetitorOverview[]
  openQuestions: OpenQuestion[]
}
