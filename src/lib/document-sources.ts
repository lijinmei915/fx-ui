import buttonMarkdown from "../../docs/components/button.md?raw";
import iconMarkdown from "../../docs/components/icon.md?raw";
import tokensMarkdown from "../../docs/TOKENS.md?raw";
import siteDesignMarkdown from "../../docs/DOC_SITE_DESIGN.md?raw";

export const docsByPage = {
  button: {
    title: "Button",
    path: "docs/components/button.md",
    markdown: buttonMarkdown,
  },
  icon: {
    title: "Icon",
    path: "docs/components/icon.md",
    markdown: iconMarkdown,
  },
  tokens: {
    title: "Tokens",
    path: "docs/TOKENS.md",
    markdown: tokensMarkdown,
  },
} as const;

export const websiteStandardsDoc = {
  title: "Website Standards",
  path: "docs/DOC_SITE_DESIGN.md",
  markdown: siteDesignMarkdown,
} as const;

export type DocPage = keyof typeof docsByPage;

export function isDocPage(page: string): page is DocPage {
  return page in docsByPage;
}
