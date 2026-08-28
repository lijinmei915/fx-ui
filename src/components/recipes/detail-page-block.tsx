import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteCardContainer } from "@/components/fx/website-card-container";

export type DetailBreadcrumb = { label: string; href?: string };
export type DetailField = { label: string; value?: ReactNode };
export type DetailTimelineItem = { date: string; title: string; description?: ReactNode; tone?: "default" | "muted" };
export type DetailRelatedRecord = { title: string; description?: ReactNode; meta?: ReactNode };
export type DetailTab = { id: string; label: string; content: ReactNode };

export type DetailPageBlockProps = {
  breadcrumbs?: DetailBreadcrumb[];
  title: ReactNode;
  subtitle?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  fields?: DetailField[];
  tabs?: DetailTab[];
  timeline?: DetailTimelineItem[];
  relatedRecords?: DetailRelatedRecord[];
  onEdit?: () => void;
  editLabel?: string;
};

function EmptyState({ children = "暂无数据" }: { children?: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function Breadcrumbs({ items }: { items: DetailBreadcrumb[] }) {
  if (items.length === 0) return null;
  const lastIndex = items.length - 1;
  return (
    <Breadcrumb>
      <BreadcrumbList size="sm">
        {items.map((item, index) => (
          <BreadcrumbItem key={`${item.label}-${index}`}>
            {index === lastIndex ? <BreadcrumbPage>{item.label}</BreadcrumbPage> : <BreadcrumbLink href={item.href ?? "#"}>{item.label}</BreadcrumbLink>}
            {index < lastIndex ? <BreadcrumbSeparator /> : null}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function DetailPageBlock({
  breadcrumbs = [],
  title,
  subtitle,
  status,
  actions,
  fields = [],
  tabs = [],
  timeline = [],
  relatedRecords = [],
  onEdit,
  editLabel = "编辑",
}: DetailPageBlockProps) {
  const tabbed = tabs.length > 0;
  return (
    <div data-slot="detail-page-block" className="flex flex-col gap-(--fds-g-spacing-panel-gap)">
      <WebsiteCardContainer data-slot="detail-page-header">
        <CardHeader>
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><CardTitle className="text-xl">{title}</CardTitle>{status}</div>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-(--fds-g-spacing-control-gap)">{onEdit ? <Button onClick={onEdit}>{editLabel}</Button> : null}{actions}</div>
          </div>
        </CardHeader>
      </WebsiteCardContainer>

      {fields.length > 0 ? <WebsiteCardContainer data-slot="detail-page-fields"><CardHeader><CardTitle className="text-base">基本信息</CardTitle></CardHeader><CardContent><dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">{fields.map((field) => <div key={field.label} className="min-w-0"><dt className="text-xs text-muted-foreground">{field.label}</dt><dd className="mt-1 break-words text-sm font-medium text-foreground">{field.value ?? <span className="font-normal text-muted-foreground">暂无</span>}</dd></div>)}</dl></CardContent></WebsiteCardContainer> : null}

      {tabbed ? <WebsiteCardContainer data-slot="detail-page-tabs" padding="none"><Tabs defaultValue={tabs[0].id} className="p-(--fds-g-spacing-panel-padding)"><TabsList>{tabs.map((tab) => <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>)}</TabsList>{tabs.map((tab) => <TabsContent key={tab.id} value={tab.id} className="pt-(--fds-g-spacing-panel-gap)">{tab.content}</TabsContent>)}</Tabs></WebsiteCardContainer> : null}

      <div className="grid gap-(--fds-g-spacing-panel-gap) lg:grid-cols-2">
        <WebsiteCardContainer data-slot="detail-page-timeline"><CardHeader><CardTitle className="text-base">活动时间线</CardTitle></CardHeader><CardContent>{timeline.length === 0 ? <EmptyState /> : <ol className="flex flex-col">{timeline.map((item, index) => <li key={`${item.date}-${item.title}-${index}`} className="flex gap-3 pb-4 last:pb-0"><div className="w-20 shrink-0 text-xs text-muted-foreground">{item.date}</div><div className="min-w-0 flex-1 border-l border-border pl-3"><p className="text-sm font-medium text-foreground">{item.title}</p>{item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}{index < timeline.length - 1 ? <Separator className="mt-4" /> : null}</div></li>)}</ol>}</CardContent></WebsiteCardContainer>
        <WebsiteCardContainer data-slot="detail-page-related"><CardHeader><CardTitle className="text-base">关联记录</CardTitle></CardHeader><CardContent>{relatedRecords.length === 0 ? <EmptyState /> : <div className="flex flex-col gap-3">{relatedRecords.map((record) => <div key={record.title} className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-medium text-foreground">{record.title}</p>{record.description ? <p className="mt-1 text-sm text-muted-foreground">{record.description}</p> : null}</div>{record.meta ? <span className="shrink-0 text-xs text-muted-foreground">{record.meta}</span> : null}</div>)}</div>}</CardContent></WebsiteCardContainer>
      </div>
    </div>
  );
}
