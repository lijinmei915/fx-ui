import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CopyIcon,
  FileCodeIcon,
  FileTextIcon,
} from "@/lib/icons";

export type DocumentActionLang = "zh" | "en";
export type DocumentPageActionText = {
  copyPage: string;
  moreActions: string;
  viewMarkdown: string;
  viewPage: string;
};
export type DocumentNavItem = { label: string; labelEn?: string; href: string };
export type DocumentPageSource = { path: string; markdown: string };

function getLabel(item: DocumentNavItem, lang: DocumentActionLang) {
  return lang === "en" && item.labelEn ? item.labelEn : item.label;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function PageActions({
  doc,
  demo = false,
  lang,
  labels,
  navActions,
  viewMode,
  onViewModeChange,
}: {
  doc: DocumentPageSource;
  demo?: boolean;
  lang: DocumentActionLang;
  labels: DocumentPageActionText;
  navActions: React.ReactNode;
  viewMode: "page" | "markdown";
  onViewModeChange: (mode: "page" | "markdown") => void;
}) {
  void lang;
  const copyCurrentPage = () => {
    if (!demo) void copyText(doc.markdown);
  };

  return (
    <PageActionsShell navActions={navActions}>
      <DropdownMenu>
        <ButtonGroup>
          <Button variant="secondary" size="toolbar" onClick={copyCurrentPage}>
            <CopyIcon data-icon="inline-start" />
            {labels.copyPage}
          </Button>
          <ButtonGroupSeparator />
          <DropdownMenuTrigger
            render={
              <Button
                variant="secondary"
                size="toolbar-icon"
                aria-label={labels.moreActions}
              />
            }
          >
            <ChevronDownIcon />
          </DropdownMenuTrigger>
        </ButtonGroup>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
            {doc.path}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (!demo)
                onViewModeChange(viewMode === "markdown" ? "page" : "markdown");
            }}
          >
            {viewMode === "markdown" ? <FileTextIcon /> : <FileCodeIcon />}
            {viewMode === "markdown" ? labels.viewPage : labels.viewMarkdown}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </PageActionsShell>
  );
}

export function PageActionsShell({
  children,
  navActions,
}: {
  children: React.ReactNode;
  navActions: React.ReactNode;
}) {
  return (
    <div
      data-slot="document-page-actions"
      className="flex flex-wrap items-center gap-2"
    >
      {children}
      {navActions}
    </div>
  );
}

export function PageStepActions({
  demo = false,
  lang,
  next,
  previous,
}: {
  demo?: boolean;
  lang: DocumentActionLang;
  next: DocumentNavItem | null;
  previous: DocumentNavItem | null;
}) {
  const preventDemoNavigation = (event: React.MouseEvent) => {
    if (demo) event.preventDefault();
  };
  return (
    <div
      className="flex items-center gap-2"
      aria-label={lang === "en" ? "Page navigation" : "页面导航"}
    >
      <Button
        variant="secondary"
        size="toolbar-icon"
        nativeButton={!previous}
        onClick={preventDemoNavigation}
        disabled={!previous}
        render={
          previous ? (
            <a
              href={previous.href}
              aria-label={
                lang === "en"
                  ? `Previous: ${getLabel(previous, lang)}`
                  : `上一篇：${getLabel(previous, lang)}`
              }
            />
          ) : undefined
        }
      >
        <ArrowLeftIcon />
      </Button>
      <Button
        variant="secondary"
        size="toolbar-icon"
        nativeButton={!next}
        onClick={preventDemoNavigation}
        disabled={!next}
        render={
          next ? (
            <a
              href={next.href}
              aria-label={
                lang === "en"
                  ? `Next: ${getLabel(next, lang)}`
                  : `下一篇：${getLabel(next, lang)}`
              }
            />
          ) : undefined
        }
      >
        <ArrowRightIcon />
      </Button>
    </div>
  );
}

export function CopyPageAction({
  lang,
  labels,
}: {
  lang: DocumentActionLang;
  labels: DocumentPageActionText;
}) {
  void lang;
  const copyCurrentPage = () =>
    void copyText(
      document.querySelector("article")?.textContent?.trim() ||
        window.location.href,
    );
  return (
    <Button variant="secondary" size="toolbar" onClick={copyCurrentPage}>
      <CopyIcon data-icon="inline-start" />
      {labels.copyPage}
    </Button>
  );
}
