"use client"

import { motion } from "motion/react"
import type { Article } from "@/lib/types"

export function SentimentBar({ articles }: { articles: Article[] }) {
  const total = articles.length || 1
  const positive = articles.filter((a) => a.sentiment === "positive").length
  const neutral = articles.filter((a) => a.sentiment === "neutral").length
  const alert = articles.filter((a) => a.sentiment === "alert").length

  const segments = [
    { key: "positive", pct: (positive / total) * 100, color: "#34d399", label: "긍정" },
    { key: "neutral", pct: (neutral / total) * 100, color: "#94a3b8", label: "중립" },
    { key: "alert", pct: (alert / total) * 100, color: "#f87171", label: "주의" },
  ]

  return (
    <div className="glass rounded-2xl p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-neutral-ink">여론 기류 분포</span>
        <span className="font-mono text-[10px] text-neutral-ink">{articles.length} 건</span>
      </div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        {segments.map((s) => (
          <motion.div
            key={s.key}
            initial={{ width: 0 }}
            animate={{ width: `${s.pct}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundColor: s.color }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-3">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[10px] text-neutral-ink">
              {s.label} {Math.round(s.pct)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
