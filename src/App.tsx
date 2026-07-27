import { useEffect, useMemo, useRef, useState } from "react";
import { getPageFromHash } from "@/app/hash-routing";
import { DocsSidebar } from "@/app/docs-sidebar";
import { SiteNavigation } from "@/app/site-navigation";
import { DocsSiteShell } from "@/app/site-shell";
import {
  createSearchItems,
  getFooterNavigationPair,
  getNavigationItemFromHash,
  getNavigationItemFromPage,
} from "@/app/docs-navigation";
import {
  resolvePageSlug as resolveRegisteredPageSlug,
} from "@/lib/page-registry";
import { createPageRegistry } from "@/lib/page-registry-config";
import { PageTitleMetaContext } from "@/lib/page-title-meta";
import {
  getLabel,
  getThemeRuntimeStyle,
  normalizeThemeConfig,
  type ThemeConfig,
  uiText,
} from "@/lib/theme-runtime";
import { CopyPageAction as DocumentCopyPageAction, PageActions as DocumentPageActions, PageActionsShell as DocumentPageActionsShell, PageStepActions as DocumentPageStepActions } from "@/lib/document-page-actions";
import { RightRail } from "@/lib/right-rail";
import { MarkdownPage, PlaceholderPage } from "@/lib/utility-pages";
import {
  topNav,
  docsNav,
  componentIndexSections,
  tokenNavSections,
  layoutNavSections,
  foundationNavSections,
  pageNavSections,
  governanceNavSections,
  footerNavItems,
} from "@/lib/site-navigation";
import { docsByPage, isDocPage, type DocPage } from "@/lib/document-sources";
import { GettingStartedPageAdapter } from "@/pages/docs/getting-started/getting-started-page-adapter";
import designTokensManifestRaw from "../docs/data/design-tokens.json?raw";

type Lang = "zh" | "en";

type DesignTokenManifestEntry = {
  name: string;
  value: string;
  category: string;
  usage: string;
};

type DesignTokensManifest = {
  updatedAt: string;
  primitive: DesignTokenManifestEntry[];
  semantic: DesignTokenManifestEntry[];
  componentUsage: unknown[];
  typography: {
    roles: { id: string; utility: string; tailwind: [string, string]; usage: string; avoid: string }[];
    conventions: { id: string; rule: string; usage: string; tailwind?: string[]; prohibited?: string[]; examples?: string[] }[];
  };
};

const designTokensManifest = JSON.parse(designTokensManifestRaw) as DesignTokensManifest;

type ViewMode = "page" | "markdown";

const pageRegistry = createPageRegistry(
  designTokensManifest,
  componentIndexSections,
  (actions, lang, page) => <GettingStartedPageAdapter actions={actions} page={page} lang={lang} />,
)
// 折叠 #slug-anchor → slug：优先精确命中，否则取最长前缀匹配（保证 tokens-colors 不被 tokens 抢）
function resolvePageSlug(hash: string): string {
  return resolveRegisteredPageSlug(hash, pageRegistry)
}

function App() {
  const [page, setPage] = useState(() => getPageFromHash(window.location.hash, resolvePageSlug));
  const [activeHash, setActiveHash] = useState(() => window.location.hash || "#intro");
  const [activeAnchor, setActiveAnchor] = useState("#overview");
  const [viewMode, setViewMode] = useState<ViewMode>("page");
  const [searchOpen, setSearchOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(() => {
    const saved = window.localStorage.getItem("fx-ui-lang");
    return saved === "en" ? "en" : "zh";
  });
  const [dark, setDark] = useState<boolean>(() => window.localStorage.getItem("fx-ui-theme") === "dark");
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    const saved = normalizeThemeConfig(window.localStorage.getItem("fx-ui-theme-config"));
    const savedMode = window.localStorage.getItem("fx-ui-theme") === "dark" ? "dark" : "light";
    return { ...saved, mode: savedMode };
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("fx-ui-theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => {
    setDark(themeConfig.mode === "dark");
    window.localStorage.setItem("fx-ui-theme-config", JSON.stringify(themeConfig));
  }, [themeConfig]);
  useEffect(() => {
    const root = document.documentElement;
    const runtimeStyle = getThemeRuntimeStyle(themeConfig, lang) as Record<string, string>;

    Object.entries(runtimeStyle).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    return () => {
      Object.keys(runtimeStyle).forEach((key) => {
        root.style.removeProperty(key);
      });
    };
  }, [themeConfig, lang]);
  const mainRef = useRef<HTMLElement>(null);

  // 全站可搜索项：所有导航页面（顶部入口 + 左侧分组），模糊搜索 + Enter 跳 hash
  const searchItems = useMemo(
    () => createSearchItems(topNav, docsNav, lang, (href) => { window.location.hash = href }),
    [lang],
  );

  // ⌘K / Ctrl+K 打开命令面板
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTargetIntoMain = (target: HTMLElement, behavior: ScrollBehavior = "smooth") => {
    const main = mainRef.current;
    if (!main) return;

    const scrollOnce = (nextBehavior: ScrollBehavior) => {
      const mainTop = main.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;

      main.scrollTo({
        top: main.scrollTop + targetTop - mainTop - 28,
        behavior: nextBehavior
      });
    };

    scrollOnce(behavior);
    window.setTimeout(() => scrollOnce("auto"), 180);
  };

  useEffect(() => {
    const onHashChange = () => {
      const nextHash = window.location.hash || "#intro";

      setActiveHash(nextHash);
      setPage(getPageFromHash(nextHash, resolvePageSlug));
      setViewMode("page");
    };

    onHashChange();
    window.addEventListener("hashchange", onHashChange);

    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("fx-ui-lang", lang);
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  }, [lang]);

  useEffect(() => {
    const viewMarkdown = () => setViewMode("markdown");

    window.addEventListener("fx-ui:view-markdown", viewMarkdown);
    return () => window.removeEventListener("fx-ui:view-markdown", viewMarkdown);
  }, []);

  // 分组判定（用于顶栏高亮、footer 等），不是逐页重复，保留
  const isComponentsIndexPage = page === "components";
  const isGettingStartedPage = page === "intro" || page === "install" || page === "theme";
  const isGovernancePage = page === "governance-map" || page === "ai-rules" || page === "documentation" || page === "website-standards" || page === "checks";
  const isTokenArea = page === "tokens" || tokenNavSections.some((section) =>
  section.items.some((item) => getPageFromHash(item.href, resolvePageSlug) === page)
  );
  const isLayoutArea = layoutNavSections.some((section) =>
  section.items.some((item) => getPageFromHash(item.href, resolvePageSlug) === page)
  );
  const isFoundationArea = isTokenArea || isLayoutArea;
  const isPageArea = pageNavSections.some((section) =>
  section.items.some((item) => getPageFromHash(item.href, resolvePageSlug) === page)
  );
  const isComponentArea =
  isComponentsIndexPage ||
  componentIndexSections.some((section) =>
  section.items.some((item) => getPageFromHash(item.href, resolvePageSlug) === page)
  );
  const sidebarSections = isFoundationArea ? foundationNavSections : isComponentArea ? componentIndexSections : isPageArea ? pageNavSections : isGovernancePage ? governanceNavSections : docsNav;
  // 当前页条目 = 唯一真相源 pageRegistry 查表
  const pageEntry = pageRegistry[page];
  const anchors = pageEntry?.anchors ?? [];
  const docKey: DocPage | null = isDocPage(page) ? page : null;
  const currentDoc = docKey ? docsByPage[docKey] : null;
  const placeholderItem = getNavigationItemFromHash(activeHash, topNav, docsNav);
  const currentNavItem = getNavigationItemFromPage(page, topNav, docsNav, resolvePageSlug);
  const footerNav = getFooterNavigationPair(page, footerNavItems, resolvePageSlug);
  const navActions = <DocumentPageStepActions previous={footerNav.previous} next={footerNav.next} lang={lang} />;

  useEffect(() => {
    const main = mainRef.current;
    if (!main || viewMode === "markdown") return undefined;

    const syncActiveAnchor = () => {
      const mainTop = main.getBoundingClientRect().top;
      let nextActive = anchors[0]?.href ?? "#components";

      for (const item of anchors) {
        const target = document.getElementById(item.href.slice(1));
        if (!target) continue;

        const offset = target.getBoundingClientRect().top - mainTop;
        if (offset <= 160) {
          nextActive = item.href;
        }
      }

      const isScrollable = main.scrollHeight > main.clientHeight + 2;
      const isAtBottom = main.scrollTop + main.clientHeight >= main.scrollHeight - 2;
      if (isScrollable && isAtBottom) {
        const lastExistingAnchor = [...anchors].reverse().find((item) => document.getElementById(item.href.slice(1)));
        if (lastExistingAnchor) {
          nextActive = lastExistingAnchor.href;
        }
      }

      setActiveAnchor(nextActive);
    };

    syncActiveAnchor();
    main.addEventListener("scroll", syncActiveAnchor, { passive: true });

    return () => main.removeEventListener("scroll", syncActiveAnchor);
  }, [anchors, viewMode]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main || viewMode === "markdown") return;

    const id = activeHash.slice(1);
    const isPageRootHash = activeHash === `#${page}`;
    const isPageAnchor = anchors.some((item) => item.href === activeHash);
    if (!id) return;

    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) {
        if (!isPageAnchor) {
          main.scrollTo({ top: 0, behavior: "smooth" });
          setActiveAnchor(anchors[0]?.href ?? "#components");
        }
        return;
      }

      if (isPageRootHash) {
        main.scrollTo({ top: 0, behavior: "smooth" });
        setActiveAnchor(anchors[0]?.href ?? activeHash);
        return;
      }

      if (anchors[0]?.href === activeHash) {
        main.scrollTo({ top: 0, behavior: "smooth" });
        setActiveAnchor(activeHash);
        return;
      }

      scrollTargetIntoMain(target);
      setActiveAnchor(isPageAnchor ? activeHash : anchors[0]?.href ?? activeHash);
    });
  }, [activeHash, anchors, viewMode]);

  const scrollToAnchor = (href: string) => {
    const main = mainRef.current;
    const target = document.getElementById(href.slice(1));
    if (!main || !target) return;

    window.history.pushState(null, "", href);
    setActiveHash(href);
    setActiveAnchor(href);
    if (anchors[0]?.href === href) {
      main.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    scrollTargetIntoMain(target);
  };

  const pageActions = currentDoc ?
  <DocumentPageActions
    doc={currentDoc}
    lang={lang}
    labels={uiText[lang]}
    navActions={navActions}
    viewMode={viewMode}
    onViewModeChange={setViewMode} /> :


  <DocumentPageActionsShell navActions={navActions}>
      <DocumentCopyPageAction lang={lang} labels={uiText[lang]} />
    </DocumentPageActionsShell>;


  return (
    <DocsSiteShell
      motion={themeConfig.animationStyle}
      runtimeStyle={getThemeRuntimeStyle(themeConfig, lang)}>

      <SiteNavigation
        page={page}
        lang={lang}
        dark={dark}
        themeConfig={themeConfig}
        setLang={setLang}
        setThemeConfig={setThemeConfig}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        themeOpen={themeOpen}
        setThemeOpen={setThemeOpen}
        searchItems={searchItems}
        isGettingStartedPage={isGettingStartedPage}
        isFoundationArea={isFoundationArea}
        isComponentArea={isComponentArea}
        isPageArea={isPageArea}
        isGovernancePage={isGovernancePage} />
      <div className={isGettingStartedPage ? "grid h-[calc(100dvh-var(--fx-topbar-height))] min-h-0 grid-cols-1 overflow-hidden bg-background" : "grid h-[calc(100dvh-var(--fx-topbar-height))] min-h-0 overflow-hidden bg-background lg:grid-cols-[240px_minmax(0,1fr)]"}>
        <DocsSidebar isHidden={isGettingStartedPage} sections={sidebarSections} activeHash={activeHash} lang={lang} onOpenSearch={() => setSearchOpen(true)} />

        <main ref={mainRef} className="fx-doc-static h-full w-full min-w-0 max-w-full overflow-y-auto overflow-x-hidden">
          <div
            className={
            pageEntry?.fullBleed ?
            "mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-10 px-6 py-8 xl:px-8" :
            "mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-10 px-6 py-10 2xl:grid-cols-[minmax(0,1080px)_220px] 2xl:justify-center 2xl:gap-16 2xl:px-8"
            }>

            <article
              className="w-full min-w-0 break-words"
              style={{ maxWidth: "calc(100vw - 3rem)" }}>

              {viewMode === "markdown" && currentDoc ?
              <MarkdownPage doc={currentDoc} actions={pageActions} lead={uiText[lang].markdownLead} /> :
              pageEntry ?
              <PageTitleMetaContext.Provider value={lang === "en" ? undefined : currentNavItem?.labelEn}>
                {pageEntry.render(pageActions, lang, page, currentNavItem?.labelEn)}
              </PageTitleMetaContext.Provider> :

              <PlaceholderPage
                actions={pageActions}
                hash={activeHash}
                item={placeholderItem}
                lang={lang} />

              }
            </article>

            {pageEntry?.fullBleed ? null :
            <RightRail
              activeAnchor={activeAnchor}
              anchors={anchors}
              lang={lang}
              tocLabel={uiText[lang].toc}
              getLabel={(item, currentLang) => getLabel(item, currentLang)}
              onAnchorSelect={scrollToAnchor} />

            }
          </div>
        </main>
      </div>
    </DocsSiteShell>);

}

export default App;
