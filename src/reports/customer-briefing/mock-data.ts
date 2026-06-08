import type { CustomerBriefingData } from "./types"

/**
 * 用于本地预览 `CustomerBriefingPage` 渲染效果的示例数据。
 * 字段值是占位内容，不对应真实客户。
 */
export const mockCustomerBriefingData: CustomerBriefingData = {
  profile: {
    customerId: "C-0001",
    customerName: "示例科技有限公司",
    industry: "制造业",
    segment: "中型企业",
  },
  timeline: [
    { date: "2026-01-10", event: "首次接触，交流产品需求" },
    { date: "2026-03-02", event: "完成 POC 验证" },
  ],
  relationshipTemperature: {
    overallScore: 3,
    trend: "上升",
  },
  decisionChain: [
    { name: "张某", role: "EB", notes: "预算拍板人，态度积极" },
    { name: "李某", role: "TB", notes: "技术评估负责人" },
  ],
  opportunityOverview: {
    projectBackground: {
      origin: "客户内部数字化转型项目启动",
    },
  },
  painPoints: [
    { description: "现有系统集成成本高", evidenceLevel: "E1" },
  ],
  competitors: [
    { name: "竞品 A", stage: "C2" },
  ],
  openQuestions: [
    { question: "预算审批流程尚未明确", confidence: "unknown" },
  ],
}
