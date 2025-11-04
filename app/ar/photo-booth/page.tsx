"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhotoCapture } from "@/components/ar/photo-capture"
import { ARFallback } from "@/components/ar/ar-fallback"
import { trackEvent } from "@/lib/analytics"

export default function PhotoBoothPage() {
  const [isXRSupported, setIsXRSupported] = useState<boolean | null>(null)
  const [sessionStarted, setSessionStarted] = useState(false)

  useEffect(() => {
    // Check WebXR support
    if ("xr" in navigator) {
      navigator.xr?.isSessionSupported("immersive-ar").then((supported) => {
        setIsXRSupported(supported)
        trackEvent("photo_booth_loaded", { xr_supported: supported })
      })
    } else {
      setIsXRSupported(false)
      trackEvent("photo_booth_loaded", { xr_supported: false })
    }
  }, [])

  const handleStartSession = () => {
    setSessionStarted(true)
    trackEvent("photo_booth_started", { mode: isXRSupported ? "xr" : "fallback" })
  }

  if (isXRSupported === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950">
        <div className="text-center text-emerald-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4" />
          <p>Checking AR capabilities...</p>
        </div>
      </div>
    )
  }

  if (!sessionStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 p-4">
        <Card className="max-w-md w-full p-6 bg-emerald-950/50 border-emerald-700">
          <h1 className="text-3xl font-bold text-emerald-100 mb-4 text-center">Emerald City Photo Booth</h1>
          <p className="text-emerald-200 mb-6 text-center">
            {isXRSupported
              ? "Step into the world of Wicked with AR photo frames and filters"
              : "Capture magical moments with themed photo frames"}
          </p>
          <Button
            onClick={handleStartSession}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
          >
            Start Photo Booth
          </Button>
        </Card>
      </div>
    )
  }

  return isXRSupported ? (
    <PhotoCapture mode="xr" />
  ) : (
    <ARFallback feature="photo-booth">
      <PhotoCapture mode="2d" />
    </ARFallback>
  )
}
