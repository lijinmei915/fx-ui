import { useContext, type ReactNode } from "react";
import { PageLead as FxPageLead } from "@/components/fx/page-lead";
import { getDisplayTitle, PageTitleMetaContext } from "@/lib/page-title-meta";

export function DocumentPageLead({
  crumb,
  title,
  titleMeta,
  lead,
  actions,
}: {
  crumb: string;
  title: string;
  titleMeta?: string;
  lead: ReactNode;
  actions: ReactNode;
}) {
  const contextTitleMeta = useContext(PageTitleMetaContext);
  const resolvedTitleMeta = titleMeta ?? contextTitleMeta;
  return (
    <FxPageLead
      crumb={crumb}
      title={getDisplayTitle(title, resolvedTitleMeta)}
      titleMeta={resolvedTitleMeta}
      lead={lead}
      actions={actions}
    />
  );
}
