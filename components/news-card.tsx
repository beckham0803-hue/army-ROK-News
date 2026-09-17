"use client"

import { motion } from "motion/react"
import { ExternalLink, Bookmark, Plus, Check } from "lucide-react"
import { SENTIMENT_META, type Article } from "@/lib/types"

function timeAgo(pubDate: string): string {
  const then = new Date(pubDate).getTime()
  if (Number.isNaN(then)) return ""
  const diff = Date.now() - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "방금 전"
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

export function NewsCard({
  article,
  index,
  bookmarked,
  inBasket,
  onBookmark,
  onBasket,
}: {
  article: Article
  index: number
  bookmarked: boolean
  inBasket: boolean
  onBookmark: (id: string) => void
  onBasket: (article: Article) => void
}) {
  const meta = SENTIMENT_META[article.sentiment]

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: Math.min(index * 0.035, 0.4), type: "spring", stiffness: 240, damping: 24 }}
      whileHover={{ y: -3 }}
      className={`glass group relative overflow-hidden rounded-2xl p-4 ring-1 ${meta.ring}`}
    >
      {/* sentiment accent bar */}
      <span
        className={`absolute left-0 top-0 h-full w-1 ${meta.dot}`}
        style={{ opacity: 0.85 }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground/80">
            {article.media}
          </span>
          <span className={`flex items-center gap-1 text-[10px] font-bold ${meta.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>
        <span className="font-mono text-[10px] text-neutral-ink">{timeAgo(article.pubDate)}</span>
      </div>

      <a
        href={article.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 block"
      >
        <h3 className="text-[15px] font-bold leading-snug text-foreground transition-colors group-hover:text-olive-200">
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-neutral-ink">
          {article.description}
        </p>
      </a>

      <div className="mt-3 flex items-center justify-between">
        <a
          href={article.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-semibold text-olive-300 transition-colors hover:text-emerald-300"
        >
          원문 보기
          <ExternalLink className="h-3 w-3" strokeWidth={2.4} />
        </a>

        <div className="flex items-center gap-1.5">
          <motion.button
            type="button"
            onClick={() => onBasket(article)}
            whileTap={{ scale: 0.85 }}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
              inBasket
                ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-300"
                : "border-white/10 bg-white/[0.04] text-neutral-ink hover:text-foreground"
            }`}
            aria-label={inBasket ? "브리핑 대상에서 제외" : "AI 브리핑 대상에 추가"}
          >
            {inBasket ? (
              <Check className="h-4 w-4" strokeWidth={2.6} />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={2.4} />
            )}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onBookmark(article.id)}
            whileTap={{ scale: 0.85 }}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
              bookmarked
                ? "border-olive-400/40 bg-olive-500/20 text-olive-200"
                : "border-white/10 bg-white/[0.04] text-neutral-ink hover:text-foreground"
            }`}
            aria-label={bookmarked ? "북마크 해제" : "북마크"}
          >
            <Bookmark
              className="h-4 w-4"
              strokeWidth={2.2}
              fill={bookmarked ? "currentColor" : "none"}
            />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
