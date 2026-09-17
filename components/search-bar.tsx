"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Search, RefreshCw, ArrowDownUp } from "lucide-react"

export function SearchBar({
  onSearch,
  scanning,
  sort,
  onSortChange,
}: {
  onSearch: (query: string) => void
  scanning: boolean
  sort: "date" | "sim"
  onSortChange: (sort: "date" | "sim") => void
}) {
  const [value, setValue] = useState("")

  function submit() {
    onSearch(value.trim())
  }

  return (
    <div className="flex items-center gap-2">
      <div className="glass flex flex-1 items-center gap-2 rounded-2xl px-3.5 py-1">
        <Search className="h-4 w-4 shrink-0 text-neutral-ink" strokeWidth={2.2} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              submit()
            }
          }}
          inputMode="search"
          enterKeyHint="search"
          placeholder="키워드 검색 (예: 육군, 국방혁신)"
          className="w-full bg-transparent py-3 text-[16px] text-foreground outline-none placeholder:text-neutral-ink/60"
          aria-label="뉴스 키워드 검색"
        />
      </div>

      <motion.button
        type="button"
        onClick={() => onSortChange(sort === "date" ? "sim" : "date")}
        whileTap={{ scale: 0.92 }}
        className="glass flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl text-neutral-ink"
        aria-label={sort === "date" ? "최신순 정렬 (탭하여 정확도순)" : "정확도순 정렬 (탭하여 최신순)"}
        title={sort === "date" ? "최신순" : "정확도순"}
      >
        <ArrowDownUp className="h-4.5 w-4.5" strokeWidth={2.2} />
      </motion.button>

      <motion.button
        type="button"
        onClick={submit}
        disabled={scanning}
        whileTap={{ scale: 0.92 }}
        className="glass-strong flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl text-emerald-200 disabled:opacity-60"
        aria-label="첩보 수집 실행"
      >
        <motion.span
          animate={scanning ? { rotate: 360 } : { rotate: 0 }}
          transition={
            scanning
              ? { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
              : {}
          }
        >
          <RefreshCw className="h-5 w-5" strokeWidth={2.4} />
        </motion.span>
      </motion.button>
    </div>
  )
}
