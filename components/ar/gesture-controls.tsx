"use client"

import { useRef, useEffect, type ReactNode } from "react"
import { trackEvent } from "@/lib/analytics"

interface GestureControlsProps {
  children: ReactNode
  onTap?: (x: number, y: number) => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onHold?: (x: number, y: number) => void
}

export function GestureControls({
  children,
  onTap,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onHold,
}: GestureControlsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        }

        // Start hold timer
        if (onHold) {
          holdTimerRef.current = setTimeout(() => {
            if (touchStartRef.current) {
              onHold(touchStartRef.current.x, touchStartRef.current.y)
              trackEvent("gesture_detected", { type: "hold" })
            }
          }, 500)
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Cancel hold timer on move
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
        holdTimerRef.current = null
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      // Cancel hold timer
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
        holdTimerRef.current = null
      }

      if (!touchStartRef.current) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      const deltaTime = Date.now() - touchStartRef.current.time

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const isSwipe = distance > 50 && deltaTime < 300

      if (isSwipe) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
            trackEvent("gesture_detected", { type: "swipe_right" })
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
            trackEvent("gesture_detected", { type: "swipe_left" })
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown()
            trackEvent("gesture_detected", { type: "swipe_down" })
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp()
            trackEvent("gesture_detected", { type: "swipe_up" })
          }
        }
      } else if (distance < 10 && deltaTime < 300 && onTap) {
        // Tap
        onTap(touch.clientX, touch.clientY)
        trackEvent("gesture_detected", { type: "tap" })
      }

      touchStartRef.current = null
    }

    container.addEventListener("touchstart", handleTouchStart)
    container.addEventListener("touchmove", handleTouchMove)
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
      }
    }
  }, [onTap, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onHold])

  return (
    <div ref={containerRef} className="touch-none">
      {children}
    </div>
  )
}
