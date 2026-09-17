"use client"

import { motion } from "motion/react"

export function RadarScanner({ active }: { active: boolean }) {
  return (
    <div className="relative h-10 w-10 shrink-0" aria-hidden="true">
      {/* concentric rings */}
      <div className="absolute inset-0 rounded-full border border-olive-400/30" />
      <div className="absolute inset-[6px] rounded-full border border-olive-400/20" />
      <div className="absolute inset-[12px] rounded-full border border-olive-400/15" />
      {/* crosshair */}
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-olive-400/15" />
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-olive-400/15" />

      {/* sweep */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        animate={active ? { rotate: 360 } : { rotate: 0 }}
        transition={
          active
            ? { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
            : { duration: 0.4 }
        }
        style={{
          background:
            "conic-gradient(from 0deg, rgba(52,211,153,0.55) 0deg, rgba(52,211,153,0.08) 40deg, transparent 90deg)",
          maskImage: "radial-gradient(circle, black 60%, transparent 62%)",
          WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 62%)",
        }}
      />

      {/* center blip */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-glow"
        animate={
          active
            ? { scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }
            : { scale: 1, opacity: 0.7 }
        }
        transition={{ duration: 1.2, repeat: active ? Number.POSITIVE_INFINITY : 0 }}
        style={{ boxShadow: "0 0 8px rgba(52,211,153,0.9)" }}
      />
    </div>
  )
}
