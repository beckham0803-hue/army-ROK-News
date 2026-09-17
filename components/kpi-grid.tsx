"use client"

import { motion } from "motion/react"
import { Newspaper, TrendingUp, Minus, TriangleAlert } from "lucide-react"
import type { Article } from "@/lib/types"

export function KpiGrid({
  articles,
  activeTopic,
}: {
  articles: Article[]
  activeTopic: string
}) {
  const total = articles.length
  const positive = articles.filter((a) => a.sentiment === "positive").length
  const neutral = articles.filter((a) => a.sentiment === "neutral").length
  const alert = articles.filter((a) => a.sentiment === "alert").length

  const cards = [
    {
      label: "수집 첩보",
      value: total,
      icon: Newspaper,
      accent: "text-olive-300",
      glow: "shadow-[0_0_18px_rgba(82,110,51,0.25)]",
      sub: activeTopic,
    },
    {
      label: "긍정 기류",
      value: positive,
      icon: TrendingUp,
      accent: "text-emerald-300",
      glow: "shadow-[0_0_18px_rgba(52,211,153,0.22)]",
      sub: total ? `${Math.round((positive / total) * 100)}%` : "0%",
    },
    {
      label: "중립",
      value: neutral,
      icon: Minus,
      accent: "text-slate-300",
      glow: "",
      sub: total ? `${Math.round((neutral / total) * 100)}%` : "0%",
    },
    {
      label: "주의 신호",
      value: alert,
      icon: TriangleAlert,
      accent: "text-red-300",
      glow: alert > 0 ? "shadow-[0_0_18px_rgba(248,113,113,0.28)]" : "",
      sub: total ? `${Math.round((alert / total) * 100)}%` : "0%",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {cards.map((c, i) => {
        const Icon = c.icon
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 22 }}
            whileTap={{ scale: 0.97 }}
            className={`glass rounded-2xl p-3.5 ${c.glow}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-neutral-ink">{c.label}</span>
              <Icon className={`h-4 w-4 ${c.accent}`} strokeWidth={2.2} />
            </div>
            <div className="mt-2 flex items-end gap-1.5">
              <motion.span
                key={c.value}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-2xl font-black leading-none text-foreground"
              >
                {c.value}
              </motion.span>
              <span className={`mb-0.5 truncate text-[10px] font-semibold ${c.accent}`}>
                {c.sub}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
