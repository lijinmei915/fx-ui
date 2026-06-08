import type { CustomerBriefingData } from "./types"

/**
 * 用于本地预览 `CustomerBriefingPage` 渲染效果的示例数据。
 * 字段值是占位内容，不对应真实客户；结构 1:1 对齐 types.ts 的契约定义。
 * 非必现字段（如各分区的 data_gaps）允许留空数组，渲染页应能处理空值。
 */
export const mockCustomerBriefingData: CustomerBriefingData = {
  r01_customer_profile: {
    customer_id: "C-0001",
    customer_name: "示例科技有限公司",
    industry: "制造业",
    segment: "中型企业",
    employee_count: "500-1000",
    revenue_band: "1-5亿",
    location: "上海",
    deal_status: "商机推进中",
    account_source: "渠道推荐",
    create_time: "2025-09-01",
    last_followed_time: "2026-06-01",
    last_deal_closed_time: "未成交",
    business_description: "面向制造业的设备管理与生产调度数字化转型项目",
    strategic_signals: [
      { signal: "新任 CIO 推动数字化转型", source: "公开信息", confidence: "confirmed" },
    ],
    data_gaps: ["营收区间需要进一步核实"],
  },

  r02_timeline: {
    time_range: "2026-01 至今",
    events: [
      {
        date: "2026-01-10",
        event: "首次接触，交流产品需求",
        source: "拜访记录",
        our_action: "上门交流需求",
        customer_reaction: "表达兴趣，希望看演示",
        relationship_change: "建立初步联系",
        impact: "进入需求调研阶段",
        confidence: "confirmed",
      },
      {
        date: "2026-03-02",
        event: "完成 POC 验证",
        source: "CRM 跟进记录",
        our_action: "组织 POC 演示",
        customer_reaction: "技术团队认可方案可行性",
        relationship_change: "信任度提升",
        impact: "推进到方案评估阶段",
        confidence: "confirmed",
      },
    ],
    key_turning_points: [
      { date: "2026-03-02", turning_point: "POC 通过", reason: "证明方案可落地，客户态度转为积极" },
    ],
    data_gaps: [],
  },

  r03_relationship_temperature: {
    overall_temperature: "+3",
    trend: "warming",
    reason: "近期互动频繁，关键人主动提供内部信息",
    key_people: [
      {
        name: "张某",
        title: "信息中心总监",
        role: "EB",
        temperature: "+3",
        trend: "上升",
        evidence: "主动安排内部会议，介绍预算情况",
        last_contact_time: "2026-06-01",
        confidence: "confirmed",
      },
    ],
    risk_people: [
      { name: "王某", reason: "对现有供应商有路径依赖", impact: "可能拖慢决策进度" },
    ],
  },

  r04_decision_chain: {
    eb: { name: "张某", confidence: "confirmed", evidence: "多次会议中明确表示拍板权" },
    key_people: [
      {
        name: "张某",
        title: "信息中心总监",
        role: "EB",
        influence_level: "high",
        attitude: "support",
        last_seen: "2026-06-01",
        evidence: "主导预算审批流程",
      },
      {
        name: "李某",
        title: "技术经理",
        role: "TB",
        influence_level: "medium",
        attitude: "neutral",
        last_seen: "2026-05-20",
        evidence: "负责技术选型评估",
      },
    ],
    political_map: {
      alliances: [{ description: "信息中心和业务部门在数字化转型目标上一致" }],
      conflicts: [{ description: "采购部门倾向于现有供应商续约" }],
      access_paths: [{ path: "通过技术经理李某接触到 EB 张某" }],
    },
    coverage_analysis: {
      covered_roles: [{ role: "EB", people: "张某" }, { role: "TB", people: "李某" }],
      missing_roles: [{ role: "Coach", why_it_matters: "缺少内部支持者推动决策加速" }],
      coverage_ratio: "2/4",
      key_gap: "尚未接触到业务侧实际使用者（UX）",
      leverage_path: "可通过李某引荐业务部门负责人",
    },
    risk_kps: [
      { name: "王某", risk: "对现供应商有路径依赖，可能阻碍决策", impact: "拖慢采购流程" },
    ],
    data_gaps: ["业务部门关键人身份尚未确认"],
  },

  people_map: {
    core_people: [
      {
        name: "张某",
        title: "信息中心总监",
        role: "EB",
        attitude: "support",
        influence_level: "high",
        influence_path: "直接影响预算审批和最终决策",
        risk_or_value: "核心支持者，价值高",
        confidence: "confirmed",
      },
    ],
    missing_people: [
      { role: "UX", why_needed: "缺少业务侧使用者视角，影响需求判断准确性", suggested_verification: "请技术经理引荐业务负责人" },
    ],
  },

  r05_opportunity_overview: {
    project_background: {
      origin: "客户内部数字化转型项目启动",
      customer_goals: [
        { goal: "提升设备利用率", business_value: "预计降低 15% 运维成本", confidence: "inferred" },
      ],
      must_have_requirements: [
        { requirement: "支持现有 ERP 系统集成", impact: "决定方案是否可落地", confidence: "confirmed" },
      ],
      budget_and_approval: {
        budget_range: "200-300 万",
        approval_chain: "信息中心总监 → 财务负责人 → 总经理",
        decision_timeline: "预计 Q3 完成审批",
        current_stage: "方案评估阶段",
        confidence: "inferred",
      },
    },
    it_landscape: {
      systems: [
        { name: "现有 MES 系统", purpose: "生产调度", satisfaction: "low", key_issue: "数据孤岛严重", integration_relevance: "需要打通设备数据" },
      ],
      opportunity_points: [
        { point: "现有系统满意度低，存在替换窗口", reason: "客户多次表达对现状不满", confidence: "confirmed" },
      ],
    },
    usage_scope: {
      user_groups: [
        { group: "生产一线班组长", scale: "约 50 人", core_need: "实时设备状态查看", priority: "P0", confidence: "inferred" },
      ],
    },
    active_opportunities: [
      {
        opportunity_id: "OP-2026-0031",
        name: "设备管理数字化项目",
        stage: "方案评估",
        status: "推进中",
        amount: "约 250 万",
        probability: "60%",
        close_date: "2026-09-30",
        budget_status: "已立项，待审批",
        next_milestone: "完成方案汇报",
        main_blocker: "采购部门对现供应商的路径依赖",
        confidence: "inferred",
      },
    ],
    historical_opportunities: [],
    expansion_signals: [
      { signal: "客户提及未来希望拓展到仓储管理场景", source: "拜访记录", confidence: "inferred" },
    ],
    data_gaps: ["预算审批的具体时间表尚未确认"],
  },

  r06_pain_map: {
    confirmed_pains: [
      {
        pain: "现有系统集成成本高",
        business_impact: "新系统上线周期被拉长",
        evidence: "客户在两次会议中明确提到集成困难",
        source: "拜访记录",
        evidence_level: "E1",
        owner: "信息中心",
      },
    ],
    inferred_pains: [
      {
        pain: "一线班组长缺乏实时数据支撑决策",
        reasoning: "从客户对'实时看板'功能的反复追问推断",
        source: "需求调研",
        confidence: "inferred",
        validation_question: "确认一线班组长当前获取设备状态的方式和频率",
      },
    ],
    assumptions: [
      { assumption: "制造业普遍存在设备数据孤岛问题", benchmark_source: "行业基准参考", validation_question: "确认该客户是否有跨系统数据打通的历史尝试" },
    ],
    non_pains: [
      { item: "人员培训成本", reason: "客户明确表示已有成熟的内部培训体系，不构成顾虑" },
    ],
    data_gaps: [],
  },

  r07_competitive_overview: {
    competitors: [
      {
        name: "竞品 A",
        stage: "C2",
        evidence: "客户在商机备注中提到正在对比竞品 A 的方案",
        quoted_amount: "约 220 万",
        customer_reason_to_compare: "竞品 A 是现有供应商，替换成本是关键考量",
        our_advantage: "集成能力更强，实施周期更短",
        our_weakness: "品牌知名度和案例数量不及对方",
        confidence: "confirmed",
      },
    ],
    competitive_history: [],
    current_position: { summary: "处于竞争中，技术方案占优但品牌信任度需要加强", confidence: "inferred" },
    data_gaps: ["竞品 A 的具体报价细节尚未确认"],
  },

  r08_open_questions: {
    information_completeness: "partial",
    executive_summary: {
      one_sentence_conclusion: "客户处于方案评估阶段，态度积极但决策链覆盖仍有缺口",
      customer_status: { conclusion: "数字化转型需求明确，预算已立项", confidence: "confirmed" },
      main_opportunity: { conclusion: "现有系统满意度低，存在替换窗口", confidence: "confirmed" },
      main_risk: { conclusion: "采购部门对现供应商存在路径依赖", confidence: "inferred" },
      decision_chain: { conclusion: "已接触 EB 和 TB，业务侧使用者尚未覆盖", confidence: "confirmed" },
      relationship_temperature: { conclusion: "关系处于上升期，关键人主动配合", confidence: "confirmed" },
      biggest_gap: { conclusion: "缺少业务侧 Coach，难以从内部推动决策加速", confidence: "inferred" },
      focus_points: [
        { focus: "尽快接触业务部门负责人", reason: "补齐决策链覆盖缺口，建立内部支持者" },
      ],
    },
    key_unknowns: [
      {
        question: "采购部门的最终决策权重有多大",
        why_it_matters: "直接影响竞争策略和推进节奏",
        source_rule: "R04",
        suggested_source: "internal_team",
      },
    ],
    risk_matrix: [
      {
        risk: "采购部门倾向现供应商续约",
        level: "medium",
        impact: "可能导致方案评估阶段被拖延或否决",
        trigger: "采购部门介入最终决策评审",
        mitigation_direction: "通过 EB 和 TB 强化技术优势认知，提前对齐采购关注点",
        confidence: "inferred",
      },
    ],
    conflicting_facts: [],
    next_best_actions: [
      {
        action: "安排业务部门负责人参与下一轮方案演示",
        purpose: "补齐决策链覆盖，验证业务侧真实需求",
        owner_or_role: "销售负责人",
        timing: "两周内",
        confidence: "inferred",
      },
    ],
    follow_up_focus: [
      { focus: "跟进预算审批进度", reason: "判断商机是否会在 Q3 如期推进" },
    ],
  },
}
