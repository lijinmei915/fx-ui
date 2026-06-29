import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CopyIcon,
  LinkIcon,
} from "@/lib/icons"

type PageActionsProps = {
  copyLabel: string
  copyLinkLabel: string
  moreLabel: string
  previousLabel: string
  nextLabel: string
  previousHref?: string
  nextHref?: string
  onCopyPage?: () => void
  onCopyLink?: () => void
}

function PageActions({
  copyLabel,
  copyLinkLabel,
  moreLabel,
  previousLabel,
  nextLabel,
  previousHref,
  nextHref,
  onCopyPage,
  onCopyLink,
}: PageActionsProps) {
  return (
    <PageActionsShell
      navActions={
        <PageStepActions
          previousHref={previousHref}
          nextHref={nextHref}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
        />
      }
    >
      <CopyPageAction
        copyLabel={copyLabel}
        copyLinkLabel={copyLinkLabel}
        moreLabel={moreLabel}
        onCopyPage={onCopyPage}
        onCopyLink={onCopyLink}
      />
    </PageActionsShell>
  )
}

function PageActionsShell({
  children,
  navActions,
}: {
  children: React.ReactNode
  navActions: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      {navActions}
    </div>
  )
}

function CopyPageAction({
  copyLabel,
  copyLinkLabel,
  moreLabel,
  onCopyPage,
  onCopyLink,
}: {
  copyLabel: string
  copyLinkLabel: string
  moreLabel: string
  onCopyPage?: () => void
  onCopyLink?: () => void
}) {
  return (
    <DropdownMenu>
      <ButtonGroup>
        <Button variant="secondary" size="sm" onClick={onCopyPage}>
          <CopyIcon data-icon="inline-start" />
          {copyLabel}
        </Button>
        <DropdownMenuTrigger
          render={
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label={moreLabel}
            />
          }
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
      </ButtonGroup>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onCopyLink}>
          <LinkIcon />
          {copyLinkLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PageStepActions({
  previousHref,
  nextHref,
  previousLabel,
  nextLabel,
}: {
  previousHref?: string
  nextHref?: string
  previousLabel: string
  nextLabel: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="icon-sm"
        disabled={!previousHref}
        render={previousHref ? <a href={previousHref} aria-label={previousLabel} /> : undefined}
      >
        <ArrowLeftIcon />
      </Button>
      <Button
        variant="secondary"
        size="icon-sm"
        disabled={!nextHref}
        render={nextHref ? <a href={nextHref} aria-label={nextLabel} /> : undefined}
      >
        <ArrowRightIcon />
      </Button>
    </div>
  )
}

export {
  PageActions,
  PageActionsShell,
  CopyPageAction,
  PageStepActions,
  type PageActionsProps,
}
