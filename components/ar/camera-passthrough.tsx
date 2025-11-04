"use client"

import { useEffect, useRef, useState } from "react"
import { trackEvent } from "@/lib/analytics"

interface CameraPassthroughProps {
  onReady?: () => void
  onError?: (error: Error) => void
}

export function CameraPassthrough({ onReady, onError }: CameraPassthroughProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    let stream: MediaStream | null = null
    mountedRef.current = true

    const startCamera = async () => {
      try {
        console.log("[v0] Requesting camera access for passthrough")

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Use back camera on mobile
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60 },
          },
          audio: false,
        })

        if (videoRef.current && mountedRef.current) {
          videoRef.current.srcObject = stream

          try {
            await videoRef.current.play()
          } catch (playError) {
            if ((playError as Error).name !== "AbortError") {
              throw playError
            }
            console.log("[v0] Video play interrupted (expected during navigation)")
            return
          }

          videoRef.current.onloadedmetadata = () => {
            if (!mountedRef.current) return

            console.log("[v0] Camera passthrough ready")
            setIsReady(true)
            trackEvent("camera_passthrough_started", {
              width: videoRef.current?.videoWidth,
              height: videoRef.current?.videoHeight,
            })
            onReady?.()
          }
        }
      } catch (err) {
        if (!mountedRef.current) return

        const error = err as Error
        console.error("[v0] Camera passthrough failed:", error)
        setError(error.message)
        trackEvent("camera_passthrough_error", { error: error.message })
        onError?.(error)
      }
    }

    startCamera()

    return () => {
      mountedRef.current = false

      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        console.log("[v0] Camera passthrough stopped")
      }
    }
  }, [onReady, onError])

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
        <div className="text-center p-6">
          <div className="text-red-400 text-lg font-semibold mb-2">Camera Access Error</div>
          <div className="text-slate-300 text-sm">{error}</div>
          <div className="text-slate-400 text-xs mt-4">Please allow camera access to use AR features</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: "scaleX(-1)", // Mirror for front camera
        }}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-white text-lg">Initializing Camera...</div>
          </div>
        </div>
      )}
    </>
  )
}
