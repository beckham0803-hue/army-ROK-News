"use client"

import { AnimatePresence, motion } from "motion/react"
import { Sparkles, X, Loader2, ClipboardCopy, Check } from "lucide-react"
import { useState } from "react"
import type { Article } from "@/lib/types"

function renderBriefing(text: string) {
  const lines = text.split("\n")
  return lines.map((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) return <div key={i} className="h-1.5" />
    if (trimmed.startsWith("## ")) {
      return (
        <h3
          key={i}
          className="mt-4 flex items-center gap-2 text-[13px] font-black text-emerald-300 first:mt-0"
        >
          <span className="h-3 w-1 rounded-full bg-emerald-400" />
          {trimmed.replace(/^##\s*/, "")}
        </h3>
      )
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return (
        <div key={i} className="mt-1.5 flex gap-2 pl-1">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-olive-300" />
          <span className="text-[13px] leading-relaxed text-foreground/90">
            {trimmed.replace(/^[-*]\s*/, "")}
          </span>
        </div>
      )
    }
    return (
      <p key={i} className="mt-1.5 text-[13px] leading-relaxed text-foreground/90">
        {trimmed}
      </p>
    )
  })
}

export function AiBriefing({
  open,
  onClose,
  loading,
  briefing,
  error,
  basket,
}: {
  open: boolean
  onClose: () => void
  loading: boolean
  briefing: string | null
  error: string | null
  basket: Article[]
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (!briefing) return
    try {
      await navigator.clipboard.writeText(briefing)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* noop */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose()
            }}
            className="glass-strong fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-3xl"
            role="dialog"
            aria-modal="true"
            aria-label="AI 지휘관 분석 브리핑"
          >
            <div className="flex justify-center pt-3">
              <span className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center justify-between px-5 pb-3 pt-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/15">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-300" strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-[15px] font-black text-foreground">AI 지휘관 분석 브리핑</h2>
                  <p className="font-mono text-[10px] text-neutral-ink">
                    분석 대상 {basket.length}건 · CONFIDENTIAL
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {briefing && !loading && (
                  <motion.button
                    type="button"
                    onClick={copy}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-neutral-ink"
                    aria-label="브리핑 복사"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-300" strokeWidth={2.6} />
                    ) : (
                      <ClipboardCopy className="h-4 w-4" strokeWidth={2.2} />
                    )}
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-neutral-ink"
                  aria-label="닫기"
                >
                  <X className="h-4 w-4" strokeWidth={2.4} />
                </motion.button>
              </div>
            </div>

            <div className="max-h-[calc(85vh-84px)] overflow-y-auto px-5 pb-8">
              {loading && (
                <div className="flex flex-col items-center py-14">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Loader2 className="h-7 w-7 text-emerald-300" strokeWidth={2.4} />
                  </motion.div>
                  <p className="mt-4 text-[13px] font-semibold text-foreground">
                    지휘관 브리핑 생성 중…
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-neutral-ink">
                    AI 분석 참모가 첩보를 평가하고 있습니다
                  </p>
                </div>
              )}

              {error && !loading && (
                <div className="glass rounded-2xl px-4 py-8 text-center">
                  <p className="text-[13px] font-semibold text-red-300">{error}</p>
                </div>
              )}

              {briefing && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-4"
                >
                  {renderBriefing(briefing)}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
