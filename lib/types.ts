export type Sentiment = "positive" | "neutral" | "alert"

export interface Article {
  id: string
  title: string
  description: string
  pubDate: string
  link: string
  media: string
  keyword: string
  sentiment: Sentiment
}

export interface NewsResponse {
  query: string
  total: number
  fetchedAt: string
  articles: Article[]
}

export interface KeywordChip {
  name: string
  icon: string
}

export const DEFAULT_KEYWORDS: KeywordChip[] = [
  { name: "육군", icon: "shield" },
  { name: "K2전차", icon: "truck" },
  { name: "국방혁신", icon: "cpu" },
  { name: "병영복지", icon: "heart" },
  { name: "연합훈련", icon: "crosshair" },
  { name: "한미동맹", icon: "handshake" },
  { name: "예비군", icon: "users" },
  { name: "방위산업", icon: "factory" },
]

export const SENTIMENT_META: Record<
  Sentiment,
  { label: string; color: string; ring: string; dot: string }
> = {
  positive: {
    label: "긍정",
    color: "text-emerald-300",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },
  neutral: {
    label: "중립",
    color: "text-slate-300",
    ring: "ring-slate-400/20",
    dot: "bg-slate-400",
  },
  alert: {
    label: "주의",
    color: "text-red-300",
    ring: "ring-red-400/30",
    dot: "bg-red-400",
  },
}
