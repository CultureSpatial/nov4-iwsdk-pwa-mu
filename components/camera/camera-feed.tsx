"use client"

import { useEffect, useRef, useState } from "react"
import { getCameraManager } from "@/lib/camera-manager"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CameraOff, RefreshCw, SwitchCamera } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CameraFeedProps {
  facingMode?: "user" | "environment"
  onStreamReady?: (stream: MediaStream) => void
  showControls?: boolean
  className?: string
}

export function CameraFeed({
  facingMode = "user",
  onStreamReady,
  showControls = true,
  className = "",
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [currentFacingMode, setCurrentFacingMode] = useState(facingMode)
  const [fps, setFps] = useState(0)

  const cameraManager = getCameraManager()

  const initializeCamera = async () => {
    if (!videoRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const stream = await cameraManager.initializeCamera(videoRef.current, currentFacingMode)
      setIsActive(true)
      onStreamReady?.(stream)

      // Monitor FPS
      const fpsInterval = setInterval(() => {
        const metrics = cameraManager.getPerformanceMetrics()
        setFps(metrics.fps)
      }, 1000)

      return () => clearInterval(fpsInterval)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to access camera"
      setError(errorMessage)
      setIsActive(false)
      console.error("[v0] Camera initialization failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchCamera = async () => {
    try {
      await cameraManager.switchCamera()
      setCurrentFacingMode(cameraManager.getFacingMode())
    } catch (err) {
      setError("Failed to switch camera")
      console.error("[v0] Camera switch failed:", err)
    }
  }

  const handleStopCamera = () => {
    cameraManager.stopCamera()
    setIsActive(false)
    setFps(0)
  }

  const handleRetry = () => {
    setError(null)
    initializeCamera()
  }

  useEffect(() => {
    initializeCamera()

    return () => {
      cameraManager.stopCamera()
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Video Feed */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        playsInline
        muted
        style={{ transform: currentFacingMode === "user" ? "scaleX(-1)" : "none" }}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-center text-white">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p>Initializing camera...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg p-4">
          <div className="text-center max-w-sm">
            <Alert variant="destructive" className="mb-4">
              <CameraOff className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button onClick={handleRetry} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <p className="text-xs text-muted-foreground">Please allow camera access in your browser settings</p>
            </div>
          </div>
        </div>
      )}

      {/* Live Indicator & FPS */}
      {isActive && !error && (
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="destructive" className="animate-pulse">
            <div className="w-2 h-2 rounded-full bg-white mr-2" />
            LIVE
          </Badge>
          {fps > 0 && <Badge variant="secondary">{fps} FPS</Badge>}
        </div>
      )}

      {/* Controls */}
      {showControls && isActive && !error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <Button onClick={handleSwitchCamera} size="sm" variant="secondary">
            <SwitchCamera className="w-4 h-4 mr-2" />
            Switch
          </Button>
          <Button onClick={handleStopCamera} size="sm" variant="destructive">
            <CameraOff className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      )}
    </div>
  )
}
