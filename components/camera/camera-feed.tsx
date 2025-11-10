"use client"

import { useEffect, useRef, useState } from "react"
import { CameraManager, type CameraState, type CameraError, type CameraFacing } from "@/lib/camera-manager"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, CameraOff, RefreshCw, SwitchCamera } from "lucide-react"

interface CameraFeedProps {
  facing?: CameraFacing
  onReady?: (stream: MediaStream) => void
  onError?: (error: CameraError) => void
  className?: string
  showControls?: boolean
}

export function CameraFeed({
  facing = "user",
  onReady,
  onError,
  className = "",
  showControls = true,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cameraManagerRef = useRef<CameraManager | null>(null)
  const [state, setState] = useState<CameraState>("idle")
  const [error, setError] = useState<CameraError | null>(null)
  const [currentFacing, setCurrentFacing] = useState<CameraFacing>(facing)

  useEffect(() => {
    // Initialize camera manager
    const manager = new CameraManager({ facing })
    cameraManagerRef.current = manager

    // Subscribe to state changes
    const unsubscribeState = manager.onStateChange(setState)
    const unsubscribeError = manager.onError((err) => {
      setError(err)
      onError?.(err)
    })

    // Start camera
    startCamera()

    return () => {
      unsubscribeState()
      unsubscribeError()
      manager.destroy()
    }
  }, [])

  const startCamera = async () => {
    const manager = cameraManagerRef.current
    if (!manager) return

    try {
      const stream = await manager.initialize()

      if (videoRef.current) {
        manager.attachToVideo(videoRef.current)
      }

      onReady?.(stream)
    } catch (err) {
      console.error("[v0] Camera start failed:", err)
    }
  }

  const handleRetry = () => {
    setError(null)
    startCamera()
  }

  const handleSwitchCamera = async () => {
    const manager = cameraManagerRef.current
    if (!manager) return

    try {
      const newFacing = currentFacing === "user" ? "environment" : "user"
      await manager.switchCamera(newFacing)
      setCurrentFacing(newFacing)

      if (videoRef.current) {
        manager.attachToVideo(videoRef.current)
      }
    } catch (err) {
      console.error("[v0] Camera switch failed:", err)
    }
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Video feed */}
      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />

      {/* Loading state */}
      {state === "requesting" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p>Initializing camera...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4">
          <Alert variant="destructive" className="max-w-md">
            <CameraOff className="h-4 w-4" />
            <AlertTitle>Camera Error</AlertTitle>
            <AlertDescription>
              {error.userMessage}
              {error.recoverable && (
                <Button onClick={handleRetry} variant="outline" size="sm" className="mt-4 w-full bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Camera controls */}
      {showControls && state === "active" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <Button onClick={handleSwitchCamera} variant="secondary" size="icon" className="rounded-full">
            <SwitchCamera className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Camera indicator */}
      {state === "active" && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
          <Camera className="w-4 h-4" />
          <span>Live</span>
        </div>
      )}
    </div>
  )
}
