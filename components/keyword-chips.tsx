"use client"

import { motion } from "motion/react"
import {
  Shield,
  Truck,
  Cpu,
  Heart,
  Crosshair,
  Handshake,
  Users,
  Factory,
  type LucideIcon,
} from "lucide-react"
import type { KeywordChip } from "@/lib/types"

const ICONS: Record<string, LucideIcon> = {
  shield: Shield,
  truck: Truck,
  cpu: Cpu,
  heart: Heart,
  crosshair: Crosshair,
  handshake: Handshake,
  users: Users,
  factory: Factory,
}

export function KeywordChips({
  keywords,
  active,
  onSelect,
}: {
  keywords: KeywordChip[]
  active: string
  onSelect: (name: string) => void
}) {
  return (
    <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 py-1">
      {keywords.map((k, i) => {
        const Icon = ICONS[k.icon] || Shield
        const isActive = active === k.name
        return (
          <motion.button
            key={k.name}
            type="button"
            onClick={() => onSelect(k.name)}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.94 }}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors duration-200 ${
              isActive
                ? "border-olive-400/50 bg-olive-500/25 text-olive-200 shadow-[0_0_16px_rgba(82,110,51,0.3)]"
                : "border-white/10 bg-white/[0.04] text-neutral-ink hover:text-foreground"
            }`}
          >
            <Icon
              className={`h-3.5 w-3.5 ${isActive ? "text-emerald-300" : ""}`}
              strokeWidth={2.2}
            />
            {k.name}
          </motion.button>
        )
      })}
    </div>
  )
}
