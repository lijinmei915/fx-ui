import { PageHeader } from "@/components/fx/page-header"
import { PageShell } from "@/components/fx/page-shell"
import { SearchToolbar } from "@/components/fx/search-toolbar"
import { ConfirmDangerDialog } from "@/components/fx/confirm-danger-dialog"
import { ActionRow, PageActions } from "@/components/fx/page-actions"
import { SectionLead } from "@/components/fx/section-lead"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontalIcon, PlusIcon } from "@/lib/icons"

export function FxInternalComponentsBaseline({ lang }: { lang: "zh" | "en" }) {
  const isEnglish = lang === "en"
  return (
    <section id="website-standards-fx-internal" className="flex flex-col gap-4">
      <SectionLead
        title={isEnglish ? "Internal fx components" : "内部 fx 组件"}
        description={isEnglish ? "Real component compositions used as the baseline for internal assets." : "未被业务页面直接使用的内部资产，也必须通过真实组件组合和页面基线验证。"}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <WebsiteCardContainer>
          <CardContent className="p-5">
            <PageHeader
              eyebrow={isEnglish ? "Customers" : "客户管理"}
              title={isEnglish ? "Customer list" : "客户列表"}
              description={isEnglish ? "PageHeader owns the title hierarchy and action slot." : "PageHeader 统一承载标题层级和右侧动作插槽。"}
              actions={<Button size="sm">{isEnglish ? "Create" : "新建"}</Button>}
            />
          </CardContent>
        </WebsiteCardContainer>

        <WebsiteCardContainer>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="text-sm font-medium text-foreground">{isEnglish ? "Action row" : "业务操作区"}</div>
            <ActionRow
              primary={<Button><PlusIcon data-icon="inline-start" />{isEnglish ? "Create" : "新建"}</Button>}
              secondary={[<Button key="import" variant="outline">{isEnglish ? "Import" : "导入"}</Button>]}
              more={<Button variant="outline" size="icon-sm" aria-label={isEnglish ? "More actions" : "更多操作"}><MoreHorizontalIcon /></Button>}
            />
          </CardContent>
        </WebsiteCardContainer>

        <WebsiteCardContainer>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="text-sm font-medium text-foreground">{isEnglish ? "Page actions" : "页面动作"}</div>
            <PageActions
              copyLabel={isEnglish ? "Copy page" : "复制当前页"}
              copyLinkLabel={isEnglish ? "Copy link" : "复制链接"}
              moreLabel={isEnglish ? "More actions" : "更多页面操作"}
              previousLabel={isEnglish ? "Previous" : "上一篇"}
              nextLabel={isEnglish ? "Next" : "下一篇"}
              previousHref="#documentation"
              nextHref="#checks"
            />
          </CardContent>
        </WebsiteCardContainer>

        <SearchToolbar actions={<Button variant="secondary" size="sm">{isEnglish ? "Search" : "查询"}</Button>}>
          <div className="grid gap-1.5">
            <Label htmlFor="fx-baseline-search">{isEnglish ? "Keyword" : "关键词"}</Label>
            <Input id="fx-baseline-search" placeholder={isEnglish ? "Search customers" : "搜索客户"} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="fx-baseline-status">{isEnglish ? "Status" : "状态"}</Label>
            <Input id="fx-baseline-status" placeholder={isEnglish ? "All statuses" : "全部状态"} />
          </div>
        </SearchToolbar>

        <WebsiteCardContainer>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="text-sm font-medium text-foreground">{isEnglish ? "Danger confirmation" : "危险操作确认"}</div>
            <p className="text-sm text-muted-foreground">{isEnglish ? "ConfirmDangerDialog composes the existing AlertDialog contract." : "ConfirmDangerDialog 复用现有 AlertDialog 契约，不在页面临时拼弹窗。"}</p>
            <ConfirmDangerDialog
              trigger={<Button variant="destructive" size="sm">{isEnglish ? "Delete customer" : "删除客户"}</Button>}
              title={isEnglish ? "Delete customer?" : "确认删除客户？"}
              description={isEnglish ? "This action cannot be undone." : "删除后无法恢复，请确认操作。"}
            />
          </CardContent>
        </WebsiteCardContainer>

        <WebsiteCardContainer>
          <CardContent className="overflow-hidden p-0">
            <PageShell className="min-h-0 px-5 py-5">
              <div className="rounded-lg border border-border-subtle bg-card p-4 text-sm text-muted-foreground">
                {isEnglish ? "PageShell provides the page frame and content width." : "PageShell 提供页面外壳、背景和内容最大宽度。"}
              </div>
            </PageShell>
          </CardContent>
        </WebsiteCardContainer>
      </div>
    </section>
  )
}
