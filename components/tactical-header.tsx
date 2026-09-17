"use client"

import { motion } from "motion/react"
import { RadarScanner } from "./radar-scanner"

export function TacticalHeader({
  scanning,
  fetchedAt,
}: {
  scanning: boolean
  fetchedAt: string | null
}) {
  return (
    <header className="sticky top-0 z-30">
      <div className="glass-strong px-4 py-3">
        <div className="flex items-center gap-3">
          <RadarScanner active={scanning} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-[15px] font-black tracking-tight text-foreground">
                ROK ARMY 언론 모니터링
              </h1>
              <span className="hidden shrink-0 rounded-md border border-olive-400/30 bg-olive-600/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-olive-300 sm:inline">
                INTEL
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-emerald-glow"
                  animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                  }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-glow" />
              </span>
              <p className="truncate font-mono text-[10px] text-neutral-ink">
                {scanning
                  ? "실시간 첩보 수집 중…"
                  : fetchedAt
                    ? `최종 갱신 ${new Date(fetchedAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}`
                    : "대기 중 · STANDBY"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
