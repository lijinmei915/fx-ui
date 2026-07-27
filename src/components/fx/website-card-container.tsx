import type { ComponentProps } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const websiteCardContainerSlots = {
  root: "rounded-xl border border-border-container bg-card shadow-l1",
  stack: "grid gap-4",
  headerBlock: "h-14 rounded-lg bg-muted",
  innerPanel: "rounded-lg border border-border-subtle bg-background p-4",
  divider: "border-t border-border-subtle",
  controlShell: "h-10 rounded-md border border-border-subtle bg-muted",
  elevatedPanel: "rounded-lg border border-border bg-card p-4 shadow-l1",
  label: "text-sm font-medium text-muted-foreground",
} as const;

const websiteCardContainerTones = {
  default: "",
  accent: "border-primary bg-accent",
  muted: "bg-muted",
} as const;

type WebsiteCardContainerProps = Omit<
  ComponentProps<typeof Card>,
  "variant" | "className"
> & {
  className?: string;
  padding?: "default" | "none";
  tone?: keyof typeof websiteCardContainerTones;
};

type WebsiteCardContainerPreviewProps = {
  label: string;
};

function WebsiteCardContainer({
  className,
  padding = "default",
  tone = "default",
  ...props
}: WebsiteCardContainerProps) {
  return (
    <Card
      data-website-card-container
      variant="elevated"
      // Website cards always use the site elevation token. Layout callers may
      // adjust size and placement, but cannot accidentally remove the shared shadow.
      className={cn(websiteCardContainerTones[tone], padding === "none" && "gap-0 py-0", className)}
      {...props}
    />
  );
}

function WebsiteCardContainerPreview({
  label,
}: WebsiteCardContainerPreviewProps) {
  return (
    <WebsiteCardContainer>
      <CardContent>
        <div className={websiteCardContainerSlots.stack}>
          <div className={websiteCardContainerSlots.headerBlock} />
          <div
            data-slot="website-card-inner-panel"
            className={websiteCardContainerSlots.innerPanel}
          >
            <div className={websiteCardContainerSlots.stack}>
              <p className={websiteCardContainerSlots.label}>{label}</p>
              <div
                data-slot="website-card-divider"
                className={websiteCardContainerSlots.divider}
              />
              <div
                data-slot="website-card-control-shell"
                className={websiteCardContainerSlots.controlShell}
              />
            </div>
          </div>
          <div
            data-slot="website-card-elevated-panel"
            className={websiteCardContainerSlots.elevatedPanel}
          >
            <div className={websiteCardContainerSlots.controlShell} />
          </div>
        </div>
      </CardContent>
    </WebsiteCardContainer>
  );
}

export {
  WebsiteCardContainer,
  WebsiteCardContainerPreview,
  websiteCardContainerSlots,
  websiteCardContainerTones,
  type WebsiteCardContainerProps,
  type WebsiteCardContainerPreviewProps,
};
