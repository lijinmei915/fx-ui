import { ButtonPlayground } from "@/pages/docs/components/button-playground"

type WebsiteStandardsPlaygroundProps = {
  lang: "zh" | "en"
  componentKey: "button"
}

/** Renders the website standards playground from the manifest-selected component. */
export function WebsiteStandardsPlayground({ lang, componentKey }: WebsiteStandardsPlaygroundProps) {
  return (
    <div className="grid gap-3">
      {componentKey === "button" ? <ButtonPlayground lang={lang} /> : null}
    </div>
  )
}
