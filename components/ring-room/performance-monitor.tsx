"use client"

import { useFrameRate } from "@/hooks/use-frame-rate"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

interface PerformanceMonitorProps {
  enabled?: boolean
  showDetails?: boolean
}

export function PerformanceMonitor({ enabled = true, showDetails = false }: PerformanceMonitorProps) {
  const stats = useFrameRate(enabled)

  if (!enabled) return null

  // Color based on performance
  const getColor = (fps: number) => {
    if (fps >= 55) return "bg-emerald-500"
    if (fps >= 45) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className={`${getColor(stats.fps)} text-white gap-1`}>
        <Activity className="h-3 w-3" />
        {stats.fps} FPS
      </Badge>

      {showDetails && (
        <div className="text-xs text-white/60 space-x-2">
          <span>Avg: {stats.avgFps}</span>
          <span>Min: {stats.minFps}</span>
          <span>Frame: {stats.frameTime.toFixed(1)}ms</span>
        </div>
      )}
    </div>
  )
}
