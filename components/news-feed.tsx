"use client"

import { AnimatePresence, motion } from "motion/react"
import { Inbox, RadioTower } from "lucide-react"
import { NewsCard } from "./news-card"
import type { Article } from "@/lib/types"

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="skeleton-shimmer h-4 w-16 rounded-md" />
        <div className="skeleton-shimmer h-3 w-10 rounded-md" />
      </div>
      <div className="skeleton-shimmer mt-3 h-4 w-full rounded-md" />
      <div className="skeleton-shimmer mt-2 h-4 w-3/4 rounded-md" />
      <div className="skeleton-shimmer mt-3 h-3 w-full rounded-md" />
    </div>
  )
}

export function NewsFeed({
  articles,
  loading,
  error,
  bookmarks,
  basketIds,
  onBookmark,
  onBasket,
}: {
  articles: Article[]
  loading: boolean
  error: string | null
  bookmarks: Set<string>
  basketIds: Set<string>
  onBookmark: (id: string) => void
  onBasket: (article: Article) => void
}) {
  if (loading && articles.length === 0) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass flex flex-col items-center rounded-2xl px-6 py-12 text-center"
      >
        <RadioTower className="h-8 w-8 text-red-300" strokeWidth={1.8} />
        <p className="mt-3 text-sm font-bold text-foreground">첩보 수집 실패</p>
        <p className="mt-1 text-[12px] leading-relaxed text-neutral-ink">{error}</p>
      </motion.div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="glass flex flex-col items-center rounded-2xl px-6 py-12 text-center">
        <Inbox className="h-8 w-8 text-neutral-ink" strokeWidth={1.8} />
        <p className="mt-3 text-sm font-bold text-foreground">수집된 첩보 없음</p>
        <p className="mt-1 text-[12px] text-neutral-ink">
          키워드를 선택하거나 검색하여 첩보를 수집하십시오.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <AnimatePresence mode="popLayout">
        {articles.map((article, i) => (
          <NewsCard
            key={article.id}
            article={article}
            index={i}
            bookmarked={bookmarks.has(article.id)}
            inBasket={basketIds.has(article.id)}
            onBookmark={onBookmark}
            onBasket={onBasket}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
