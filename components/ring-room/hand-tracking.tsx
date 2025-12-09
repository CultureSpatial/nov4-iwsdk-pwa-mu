"use client"

import { useRef, useEffect, useState } from "react"
import { Text } from "@react-three/drei"
import { Analytics } from "@/lib/analytics"

interface HandTrackingProps {
  onPinchStart?: (hand: "left" | "right", position: [number, number, number]) => void
  onPinchEnd?: (hand: "left" | "right") => void
  onPointStart?: (hand: "left" | "right", direction: [number, number, number]) => void
  showVisualFeedback?: boolean
  isPresenting?: boolean
}

export function HandTracking({
  onPinchStart,
  onPinchEnd,
  onPointStart,
  showVisualFeedback = true,
  isPresenting = false,
}: HandTrackingProps) {
  const [leftPinching, setLeftPinching] = useState(false)
  const [rightPinching, setRightPinching] = useState(false)
  const [handTrackingAvailable, setHandTrackingAvailable] = useState(false)
  const lastGestureTime = useRef<number>(0)

  useEffect(() => {
    // Check hand tracking availability
    async function checkHandTracking() {
      if (!navigator.xr) return

      try {
        // Hand tracking is typically available on Quest devices
        const isQuest = /Quest/i.test(navigator.userAgent)
        setHandTrackingAvailable(isQuest)

        if (isQuest) {
          console.log("[v0] HandTracking: Hand tracking available")
        }
      } catch (error) {
        console.log("[v0] HandTracking: Could not detect hand tracking support")
      }
    }

    checkHandTracking()
  }, [])

  // Debounced gesture tracking
  const trackGesture = (gestureType: string) => {
    const now = Date.now()
    if (now - lastGestureTime.current > 1000) {
      Analytics.gesturePerformed("web", gestureType)
      lastGestureTime.current = now
    }
  }

  if (!isPresenting || !handTrackingAvailable) {
    return null
  }

  return (
    <>
      {showVisualFeedback && (
        <>
          {/* Left hand pinch indicator */}
          {leftPinching && (
            <mesh position={[-0.3, 1.2, -0.5]}>
              <sphereGeometry args={[0.02, 16, 16]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
          )}

          {/* Right hand pinch indicator */}
          {rightPinching && (
            <mesh position={[0.3, 1.2, -0.5]}>
              <sphereGeometry args={[0.02, 16, 16]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
          )}

          {/* Hand tracking status */}
          <Text position={[0, 2.0, -1]} fontSize={0.04} color="#10B981" anchorX="center">
            Hand Tracking Available
          </Text>
        </>
      )}
    </>
  )
}
