import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"

type StatusCard = { title: string; valueKey: string; desc: string }

export function GovernanceStatusCards({ cards, snapshot }: { cards: StatusCard[]; snapshot: Record<string, string> }) {
  return <div className="grid gap-4 md:grid-cols-3">{cards.map((card) => <WebsiteCardContainer key={card.title}><CardHeader><CardDescription>{card.title}</CardDescription><CardTitle className="text-2xl">{snapshot[card.valueKey] ?? "-"}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{card.desc}</CardContent></WebsiteCardContainer>)}</div>
}
