/**
 * 客户360简报的数据契约。
 *
 * 字段与命名 1:1 对齐外部 `customer_briefing_standard_version` skill 的
 * R01-R09 规则输出契约（YAML，见该 skill 的 `rules/R0x_*.md`）。
 * 刻意保留 snake_case 字段名、保留 `r0x_xxx` 这层外壳——
 * 这样 skill 产出的数据可以直接传进来渲染，不需要一层"改名转换"。
 * 转换层本身就是一个新的维护点，容易和契约本身脱节（参考本项目 token 漂移的教训）。
 *
 * 以后契约改了，直接对照 skill 的 R0x 规则文件改这里，保持两边一致。
 */

type Confidence = "confirmed" | "inferred" | "unknown"

// ---------------------------------------------------------------------------
// R01 客户画像
// ---------------------------------------------------------------------------

export interface R01CustomerProfile {
  customer_id: string
  customer_name: string
  industry: string
  segment: string
  employee_count: string
  revenue_band: string
  location: string
  deal_status: string
  account_source: string
  create_time: string
  last_followed_time: string
  last_deal_closed_time: string
  business_description: string
  strategic_signals: Array<{
    signal: string
    source: string
    confidence: Confidence
  }>
  data_gaps: string[]
}

// ---------------------------------------------------------------------------
// R02 博弈时间线
// ---------------------------------------------------------------------------

export interface R02Timeline {
  time_range: string
  events: Array<{
    date: string
    event: string
    source: string
    our_action: string
    customer_reaction: string
    relationship_change: string
    impact: string
    confidence: Confidence
  }>
  key_turning_points: Array<{
    date: string
    turning_point: string
    reason: string
  }>
  data_gaps: string[]
}

// ---------------------------------------------------------------------------
// R03 关系温度
// ---------------------------------------------------------------------------

export interface R03RelationshipTemperature {
  overall_temperature: string
  trend: "warming" | "cooling" | "stable" | "unknown"
  reason: string
  key_people: Array<{
    name: string
    title: string
    role: string
    temperature: string
    trend: string
    evidence: string
    last_contact_time: string
    confidence: Confidence
  }>
  risk_people: Array<{
    name: string
    reason: string
    impact: string
  }>
}

// ---------------------------------------------------------------------------
// R04 决策链全貌（含人力地图 people_map）
// ---------------------------------------------------------------------------

type DecisionChainRole =
  | "EB"
  | "EB候选"
  | "TB"
  | "UX"
  | "Coach"
  | "Gatekeeper"
  | "Influencer"
  | "Unknown"

type Attitude = "support" | "neutral" | "doubtful" | "opposed" | "unknown"
type InfluenceLevel = "high" | "medium" | "low" | "unknown"

export interface R04DecisionChain {
  eb: {
    name: string
    confidence: string
    evidence: string
  }
  key_people: Array<{
    name: string
    title: string
    role: string
    influence_level: InfluenceLevel
    attitude: Attitude
    last_seen: string
    evidence: string
  }>
  political_map: {
    alliances: Array<{ description: string }>
    conflicts: Array<{ description: string }>
    access_paths: Array<{ path: string }>
  }
  coverage_analysis: {
    covered_roles: Array<{ role: string; people: string }>
    missing_roles: Array<{ role: string; why_it_matters: string }>
    coverage_ratio: string
    key_gap: string
    leverage_path: string
  }
  risk_kps: Array<{
    name: string
    risk: string
    impact: string
  }>
  data_gaps: string[]
}

export interface PeopleMap {
  core_people: Array<{
    name: string
    title: string
    role: DecisionChainRole
    attitude: Attitude
    influence_level: InfluenceLevel
    influence_path: string
    risk_or_value: string
    confidence: Confidence
  }>
  missing_people: Array<{
    role: string
    why_needed: string
    suggested_verification: string
  }>
}

// ---------------------------------------------------------------------------
// R05 项目背景与商机全貌
// ---------------------------------------------------------------------------

type Priority = "P0" | "P1" | "P2" | "unknown"
type SatisfactionLevel = "high" | "medium" | "low" | "unknown"

export interface R05OpportunityOverview {
  project_background: {
    origin: string
    customer_goals: Array<{
      goal: string
      business_value: string
      confidence: Confidence
    }>
    must_have_requirements: Array<{
      requirement: string
      impact: string
      confidence: Confidence
    }>
    budget_and_approval: {
      budget_range: string
      approval_chain: string
      decision_timeline: string
      current_stage: string
      confidence: Confidence
    }
  }
  it_landscape: {
    systems: Array<{
      name: string
      purpose: string
      satisfaction: SatisfactionLevel
      key_issue: string
      integration_relevance: string
    }>
    opportunity_points: Array<{
      point: string
      reason: string
      confidence: Confidence
    }>
  }
  usage_scope: {
    user_groups: Array<{
      group: string
      scale: string
      core_need: string
      priority: Priority
      confidence: Confidence
    }>
  }
  active_opportunities: Array<{
    opportunity_id: string
    name: string
    stage: string
    status: string
    amount: string
    probability: string
    close_date: string
    budget_status: string
    next_milestone: string
    main_blocker: string
    confidence: Confidence
  }>
  historical_opportunities: Array<{
    name: string
    status: string
    result: string
    reason: string
    lesson: string
  }>
  expansion_signals: Array<{
    signal: string
    source: string
    confidence: Confidence
  }>
  data_gaps: string[]
}

// ---------------------------------------------------------------------------
// R06 痛点地图
// ---------------------------------------------------------------------------

export interface R06PainMap {
  confirmed_pains: Array<{
    pain: string
    business_impact: string
    evidence: string
    source: string
    evidence_level: "E1" | "E2"
    owner: string
  }>
  inferred_pains: Array<{
    pain: string
    reasoning: string
    source: string
    confidence: "inferred"
    validation_question: string
  }>
  assumptions: Array<{
    assumption: string
    benchmark_source: string
    validation_question: string
  }>
  non_pains: Array<{
    item: string
    reason: string
  }>
  data_gaps: string[]
}

// ---------------------------------------------------------------------------
// R07 竞品全貌
// ---------------------------------------------------------------------------

export interface R07CompetitiveOverview {
  competitors: Array<{
    name: string
    stage: "C0" | "C1" | "C2" | "C3" | "C4"
    evidence: string
    quoted_amount: string
    customer_reason_to_compare: string
    our_advantage: string
    our_weakness: string
    confidence: Confidence
  }>
  competitive_history: Array<{
    date: string
    competitor: string
    result: string
    reason: string
  }>
  current_position: {
    summary: string
    confidence: string
  }
  data_gaps: string[]
}

// ---------------------------------------------------------------------------
// R08 开放问题与档案组装（结论摘要 + 风险矩阵 + 行动建议）
// ---------------------------------------------------------------------------

type RiskLevel = "high" | "medium" | "low" | "unknown"

interface ConclusionWithConfidence {
  conclusion: string
  confidence: Confidence
}

export interface R08OpenQuestions {
  information_completeness: "complete" | "partial" | "insufficient"
  executive_summary: {
    one_sentence_conclusion: string
    customer_status: ConclusionWithConfidence
    main_opportunity: ConclusionWithConfidence
    main_risk: ConclusionWithConfidence
    decision_chain: ConclusionWithConfidence
    relationship_temperature: ConclusionWithConfidence
    biggest_gap: ConclusionWithConfidence
    focus_points: Array<{
      focus: string
      reason: string
    }>
  }
  key_unknowns: Array<{
    question: string
    why_it_matters: string
    source_rule: string
    suggested_source: "CRM" | "Memory" | "customer" | "public_info" | "internal_team"
  }>
  risk_matrix: Array<{
    risk: string
    level: RiskLevel
    impact: string
    trigger: string
    mitigation_direction: string
    confidence: Confidence
  }>
  conflicting_facts: Array<{
    conflict: string
    sources: string
    resolution_needed: string
  }>
  next_best_actions: Array<{
    action: string
    purpose: string
    owner_or_role: string
    timing: string
    confidence: Confidence
  }>
  follow_up_focus: Array<{
    focus: string
    reason: string
  }>
}

// ---------------------------------------------------------------------------
// R09 历史合作、财务与客户健康（仅 --full 模式才会产出）
// ---------------------------------------------------------------------------

type LifecycleStage =
  | "new"
  | "active"
  | "renewal"
  | "expansion"
  | "dormant"
  | "churned"
  | "unknown"

export interface R09HistoryFinancial {
  lifecycle_summary: {
    first_contract_date: string
    latest_contract_date: string
    contract_count: string
    total_contract_amount: string
    total_order_amount: string
    total_payment_amount: string
    receivable_amount: string
    lifecycle_stage: LifecycleStage
  }
  contracts: Array<{
    name: string
    amount: string
    started_time: string
    expired_time: string
    status: string
  }>
  orders: Array<{
    name: string
    order_amount: string
    order_status: string
    payment_amount: string
    receivable_amount: string
  }>
  health_risks: Array<{
    risk: string
    source: string
    severity: RiskLevel
    impact: string
  }>
  churn_reasons: Array<{
    reason: string
    source: string
    confidence: Confidence
  }>
  renewal_or_expansion_signals: Array<{
    signal: string
    source: string
    confidence: Confidence
  }>
  data_gaps: string[]
}

// ---------------------------------------------------------------------------
// 顶层数据契约
// ---------------------------------------------------------------------------

export interface CustomerBriefingData {
  r01_customer_profile: R01CustomerProfile
  r02_timeline: R02Timeline
  r03_relationship_temperature: R03RelationshipTemperature
  r04_decision_chain: R04DecisionChain
  people_map: PeopleMap
  r05_opportunity_overview: R05OpportunityOverview
  r06_pain_map: R06PainMap
  r07_competitive_overview: R07CompetitiveOverview
  r08_open_questions: R08OpenQuestions
  /** 仅 `/intake [客户名] --full` 模式下才会产出，标准模式下可能不存在 */
  r09_history_financial?: R09HistoryFinancial
}
