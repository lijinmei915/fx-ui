import { useState } from "react";
import type { ReactNode } from "react";

import { PageLead } from "@/components/fx/page-lead";
import { SectionLead } from "@/components/fx/section-lead";
import { EditFormBlock, type EditFormValues } from "@/components/recipes/edit-form-block";
import { docsSpacing } from "@/lib/docs-spacing";

type Lang = "zh" | "en";

const fields = [
  { name: "name", label: "客户名称", required: true, placeholder: "例如：Acme Corporation" },
  { name: "owner", label: "负责人", required: true, placeholder: "例如：李明" },
  { name: "notes", label: "备注", type: "textarea" as const, description: "补充上下文，保存后会同步到客户记录。" },
];

export const editFormBlockAnchors = [
  { label: "已验证区块", labelEn: "Verified block", href: "#template-edit-form-playground" },
];

export function EditFormBlockPage({ actions, lang }: { actions: ReactNode; lang: Lang }) {
  const [lastSaved, setLastSaved] = useState<EditFormValues | null>(null);

  return (
    <div className={docsSpacing.pageStack}>
      <section id="template-edit-form" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Pages / Edit Form" : "页面 / 编辑表单"}
          title={lang === "en" ? "Edit Form Block" : "编辑表单区块"}
          lead={lang === "en" ? "A schema-driven form block with validation, focus management, loading, and dirty-state cancellation." : "由字段 schema 驱动的表单区块，内置校验、错误聚焦、提交 loading 和脏状态取消。"}
          actions={actions}
        />
      </section>
      <section id="template-edit-form-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Verified block" : "已验证区块"} description={lang === "en" ? "The page only provides data and callbacks; form structure remains inside EditFormBlock." : "页面只注入字段数据和回调，表单结构统一由 EditFormBlock 提供。"} />
        <EditFormBlock
          fields={fields}
          description="所有必填项会在提交时集中校验，并把焦点移到第一个错误字段。"
          onSubmit={(values) => setLastSaved(values)}
          onCancel={() => setLastSaved(null)}
        />
        {lastSaved ? <p className="text-sm text-muted-foreground" data-edit-form-saved>最近保存：{lastSaved.name}</p> : null}
      </section>
    </div>
  );
}
