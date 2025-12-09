"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface FrameRateStats {
  fps: number
  avgFps: number
  minFps: number
  maxFps: number
  frameTime: number
}

export function useFrameRate(enabled = true): FrameRateStats {
  const [stats, setStats] = useState<FrameRateStats>({
    fps: 60,
    avgFps: 60,
    minFps: 60,
    maxFps: 60,
    frameTime: 16.67,
  })

  const frameTimesRef = useRef<number[]>([])
  const lastTimeRef = useRef<number>(performance.now())
  const frameCountRef = useRef<number>(0)
  const rafIdRef = useRef<number>(0)

  const measureFrame = useCallback(() => {
    if (!enabled) return

    const now = performance.now()
    const delta = now - lastTimeRef.current
    lastTimeRef.current = now

    frameTimesRef.current.push(delta)

    // Keep last 60 frames for averaging
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift()
    }

    frameCountRef.current++

    // Update stats every 30 frames
    if (frameCountRef.current % 30 === 0) {
      const times = frameTimesRef.current
      const avgFrameTime = times.reduce((a, b) => a + b, 0) / times.length
      const minFrameTime = Math.min(...times)
      const maxFrameTime = Math.max(...times)

      setStats({
        fps: Math.round(1000 / delta),
        avgFps: Math.round(1000 / avgFrameTime),
        minFps: Math.round(1000 / maxFrameTime),
        maxFps: Math.round(1000 / minFrameTime),
        frameTime: avgFrameTime,
      })
    }

    rafIdRef.current = requestAnimationFrame(measureFrame)
  }, [enabled])

  useEffect(() => {
    if (enabled) {
      rafIdRef.current = requestAnimationFrame(measureFrame)
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [enabled, measureFrame])

  return stats
}
