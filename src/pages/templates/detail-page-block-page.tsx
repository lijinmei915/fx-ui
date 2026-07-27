import type { ReactNode } from "react";

import { PageLead } from "@/components/fx/page-lead";
import { SectionLead } from "@/components/fx/section-lead";
import { DetailPageBlock } from "@/components/recipes/detail-page-block";
import { Tag } from "@/components/ui/tag";
import { docsSpacing } from "@/lib/docs-spacing";

type Lang = "zh" | "en";

export const detailPageBlockAnchors = [
  { label: "已验证区块", labelEn: "Verified block", href: "#template-detail-playground" },
];

export function DetailPageBlockPage({ actions, lang }: { actions: ReactNode; lang: Lang }) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="template-detail" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Pages / Detail" : "页面 / 详情"}
          title={lang === "en" ? "Detail Page Block" : "详情页区块"}
          lead={lang === "en" ? "A reusable object detail block with identity, fields, tabs, activity timeline, related records, and empty states." : "可复用的对象详情区块，统一承载身份信息、字段、标签页、活动时间线、关联记录和空态。"}
          actions={actions}
        />
      </section>
      <section id="template-detail-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Verified block" : "已验证区块"} description={lang === "en" ? "The page supplies object data; DetailPageBlock owns the page structure and responsive behavior." : "页面只提供对象数据，详情页结构和响应式行为由 DetailPageBlock 统一负责。"} />
        <DetailPageBlock
          breadcrumbs={[{ label: "客户", href: "#template-customer-list" }, { label: "Acme Corporation" }]}
          title="Acme Corporation"
          subtitle="制造业 · 华东 · 最近跟进 2026-07-18"
          status={<Tag variant="secondary">推进中</Tag>}
          fields={[
            { label: "客户编号", value: "CUS-2048" },
            { label: "负责人", value: "李明" },
            { label: "员工规模", value: "500-1,000" },
            { label: "预计金额", value: "¥1,280,000" },
          ]}
          tabs={[{ id: "overview", label: "概览", content: <p className="text-sm text-muted-foreground">对象摘要、关键判断和下一步动作由业务页面注入。</p> }, { id: "notes", label: "备注", content: <p className="text-sm text-muted-foreground">暂无额外备注。</p> }]}
          timeline={[{ date: "07-18", title: "完成方案评审", description: "客户确认采购范围，进入商务谈判。" }, { date: "07-12", title: "提交技术方案", description: "已邀请 IT 和业务负责人参加评审。" }]}
          relatedRecords={[{ title: "Q3 制造数字化项目", description: "商机 · 预计 ¥1,280,000", meta: "推进中" }, { title: "Acme 采购联系人", description: "联系人 · 王晓" }]}
        />
      </section>
    </div>
  );
}
