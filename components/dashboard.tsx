"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Sparkles } from "lucide-react"
import { TacticalHeader } from "./tactical-header"
import { KpiGrid } from "./kpi-grid"
import { KeywordChips } from "./keyword-chips"
import { SearchBar } from "./search-bar"
import { SentimentBar } from "./sentiment-bar"
import { NewsFeed } from "./news-feed"
import { AiBriefing } from "./ai-briefing"
import { DEFAULT_KEYWORDS, type Article, type NewsResponse } from "@/lib/types"

export function Dashboard() {
  const [activeTopic, setActiveTopic] = useState("육군")
  const [sort, setSort] = useState<"date" | "sim">("date")
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchedAt, setFetchedAt] = useState<string | null>(null)

  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [basket, setBasket] = useState<Article[]>([])

  const [briefingOpen, setBriefingOpen] = useState(false)
  const [briefingLoading, setBriefingLoading] = useState(false)
  const [briefing, setBriefing] = useState<string | null>(null)
  const [briefingError, setBriefingError] = useState<string | null>(null)

  const fetchNews = useCallback(
    async (query: string, sortMode: "date" | "sim") => {
      const q = query.trim() || "육군"
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/news?query=${encodeURIComponent(q)}&display=40&sort=${sortMode}`,
        )
        const data = (await res.json()) as NewsResponse & { message?: string }
        if (!res.ok) {
          throw new Error(data.message || "첩보 수집에 실패했습니다.")
        }
        setArticles(data.articles || [])
        setFetchedAt(data.fetchedAt || new Date().toISOString())
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
        setArticles([])
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchNews("육군", "date")
  }, [fetchNews])

  function handleTopic(name: string) {
    setActiveTopic(name)
    fetchNews(name, sort)
  }

  function handleSearch(query: string) {
    const q = query.trim()
    if (!q) {
      fetchNews(activeTopic, sort)
      return
    }
    setActiveTopic(q)
    fetchNews(q, sort)
  }

  function handleSort(next: "date" | "sim") {
    setSort(next)
    fetchNews(activeTopic, next)
  }

  function toggleBookmark(id: string) {
    setBookmarks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleBasket(article: Article) {
    setBasket((prev) => {
      const exists = prev.some((a) => a.id === article.id)
      if (exists) return prev.filter((a) => a.id !== article.id)
      return [...prev, article]
    })
  }

  const basketIds = new Set(basket.map((a) => a.id))

  async function generateBriefing() {
    const source = basket.length > 0 ? basket : articles
    if (source.length === 0) return
    setBriefingOpen(true)
    setBriefingLoading(true)
    setBriefing(null)
    setBriefingError(null)
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: activeTopic,
          articles: source.map((a) => ({
            title: a.title,
            description: a.description,
            media: a.media,
            sentiment: a.sentiment,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "AI 분석 생성에 실패했습니다.")
      setBriefing(data.briefing)
    } catch (err) {
      setBriefingError(err instanceof Error ? err.message : "AI 분석 생성에 실패했습니다.")
    } finally {
      setBriefingLoading(false)
    }
  }

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-lg">
      <div className="tactical-grid pointer-events-none fixed inset-0 -z-10" />

      <TacticalHeader scanning={loading} fetchedAt={fetchedAt} />

      <main className="space-y-4 px-4 pb-32 pt-4">
        <SearchBar
          onSearch={handleSearch}
          scanning={loading}
          sort={sort}
          onSortChange={handleSort}
        />

        <KeywordChips
          keywords={DEFAULT_KEYWORDS}
          active={activeTopic}
          onSelect={handleTopic}
        />

        <KpiGrid articles={articles} activeTopic={activeTopic} />

        <SentimentBar articles={articles} />

        <div className="flex items-center justify-between pt-1">
          <h2 className="flex items-center gap-2 text-[13px] font-black text-foreground">
            <span className="h-3.5 w-1 rounded-full bg-olive-400" />
            실시간 첩보 피드
          </h2>
          <span className="font-mono text-[10px] text-neutral-ink">
            {sort === "date" ? "최신순" : "정확도순"}
          </span>
        </div>

        <NewsFeed
          articles={articles}
          loading={loading}
          error={error}
          bookmarks={bookmarks}
          basketIds={basketIds}
          onBookmark={toggleBookmark}
          onBasket={toggleBasket}
        />
      </main>

      {/* Floating AI briefing button */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg px-4 pb-6">
        <AnimatePresence>
          {!briefingOpen && (
            <motion.button
              type="button"
              onClick={generateBriefing}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileTap={{ scale: 0.96 }}
              disabled={articles.length === 0}
              className="glass-strong pointer-events-auto flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-[15px] font-black text-emerald-100 shadow-[0_0_28px_rgba(52,211,153,0.25)] disabled:opacity-50"
            >
              <motion.span
                animate={{ scale: [1, 1.18, 1], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
              >
                <Sparkles className="h-5 w-5 text-emerald-300" strokeWidth={2.4} />
              </motion.span>
              AI 지휘관 분석 브리핑
              {basket.length > 0 && (
                <span className="rounded-full bg-emerald-400/25 px-2 py-0.5 font-mono text-[11px] text-emerald-200">
                  {basket.length}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AiBriefing
        open={briefingOpen}
        onClose={() => setBriefingOpen(false)}
        loading={briefingLoading}
        briefing={briefing}
        error={briefingError}
        basket={basket.length > 0 ? basket : articles}
      />
    </div>
  )
}
