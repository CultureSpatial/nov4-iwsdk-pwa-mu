"use client"

import { useEffect, useRef, useState } from "react"
import { useFrameRate } from "@/hooks/use-frame-rate"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle } from "lucide-react"
import { Analytics } from "@/lib/analytics"

interface PerformanceMonitorProps {
  enabled?: boolean
  showDetails?: boolean
  onPerformanceDegraded?: (level: "medium" | "low") => void
}

export function PerformanceMonitor({
  enabled = true,
  showDetails = false,
  onPerformanceDegraded,
}: PerformanceMonitorProps) {
  const stats = useFrameRate(enabled)
  const [performanceMode, setPerformanceMode] = useState<"high" | "medium" | "low">("high")
  const lowFpsStartRef = useRef<number | null>(null)
  const hasReportedRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    // Detect sustained low FPS
    if (stats.avgFps < 30) {
      if (lowFpsStartRef.current === null) {
        lowFpsStartRef.current = Date.now()
      } else {
        const duration = (Date.now() - lowFpsStartRef.current) / 1000

        // Report to analytics if sustained for 3+ seconds
        if (duration >= 3 && !hasReportedRef.current) {
          Analytics.fpsDropDetected(stats.avgFps, stats.minFps, duration)
          hasReportedRef.current = true
        }

        // Progressive degradation
        if (duration >= 2 && stats.avgFps < 20 && performanceMode !== "low") {
          setPerformanceMode("low")
          onPerformanceDegraded?.("low")
          Analytics.performanceModeEnabled("fps_below_20")
          console.log("[v0] Performance mode: LOW - disabling reflections")
        } else if (duration >= 1 && stats.avgFps < 30 && performanceMode === "high") {
          setPerformanceMode("medium")
          onPerformanceDegraded?.("medium")
          Analytics.performanceModeEnabled("fps_below_30")
          console.log("[v0] Performance mode: MEDIUM - reducing shadows")
        }
      }
    } else {
      // Reset tracking when FPS recovers
      lowFpsStartRef.current = null
      hasReportedRef.current = false
    }
  }, [stats.avgFps, stats.minFps, enabled, performanceMode, onPerformanceDegraded])

  if (!enabled) return null

  // Color based on performance
  const getColor = (fps: number) => {
    if (fps >= 55) return "bg-emerald-500"
    if (fps >= 45) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className={`${getColor(stats.fps)} text-white gap-1`}>
          <Activity className="h-3 w-3" />
          {stats.fps} FPS
        </Badge>

        {performanceMode !== "high" && (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600 gap-1">
            <AlertTriangle className="h-3 w-3" />
            {performanceMode === "medium" ? "Reduced Quality" : "Low Quality"}
          </Badge>
        )}
      </div>

      {showDetails && (
        <div className="text-xs text-white/60 space-x-2 bg-black/30 px-2 py-1 rounded">
          <span>Avg: {stats.avgFps}</span>
          <span>Min: {stats.minFps}</span>
          <span>Frame: {stats.frameTime.toFixed(1)}ms</span>
        </div>
      )}
    </div>
  )
}
