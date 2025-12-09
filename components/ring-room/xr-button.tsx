"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Headset, Smartphone, AlertCircle } from "lucide-react"
import { iwsdkManager } from "@/lib/iwsdk-integration"

interface XRButtonProps {
  onEnterXR: (session: XRSession) => void
  onExitXR: () => void
  autoStartOnQuest?: boolean
}

type XRSupport = "supported" | "not-supported" | "checking" | "error"

export function XRButton({ onEnterXR, onExitXR, autoStartOnQuest = true }: XRButtonProps) {
  const [vrSupport, setVrSupport] = useState<XRSupport>("checking")
  const [arSupport, setArSupport] = useState<XRSupport>("checking")
  const [activeSession, setActiveSession] = useState<XRSession | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [autoStartAttempted, setAutoStartAttempted] = useState(false)
  const [iwsdkReady, setIwsdkReady] = useState(false)

  useEffect(() => {
    async function checkXRSupport() {
      console.log("[v0] XRButton: Initializing IWSDK...")
      const initialized = await iwsdkManager.initialize()
      setIwsdkReady(initialized)

      if (!navigator.xr) {
        setVrSupport("not-supported")
        setArSupport("not-supported")
        return
      }

      try {
        const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
        setVrSupport(vrSupported ? "supported" : "not-supported")
        console.log("[v0] XRButton: VR supported:", vrSupported)
      } catch (e) {
        setVrSupport("error")
      }

      try {
        const arSupported = await navigator.xr.isSessionSupported("immersive-ar")
        setArSupport(arSupported ? "supported" : "not-supported")
        console.log("[v0] XRButton: AR supported:", arSupported)
      } catch (e) {
        setArSupport("error")
      }
    }

    checkXRSupport()
  }, [])

  const enterVR = useCallback(async () => {
    if (!navigator.xr) return

    try {
      setError(null)
      console.log("[v0] XRButton: Requesting VR session with IWSDK support...")

      const session = await navigator.xr.requestSession("immersive-vr", {
        optionalFeatures: [
          "local-floor",
          "bounded-floor",
          "hand-tracking",
          "layers", // Add layers for better passthrough support
        ],
      })

      session.addEventListener("end", () => {
        setActiveSession(null)
        onExitXR()
        console.log("[v0] XRButton: VR session ended")
      })

      setActiveSession(session)
      onEnterXR(session)
      console.log("[v0] XRButton: VR session started successfully")
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to enter VR"
      setError(errorMsg)
      console.error("[v0] XRButton: VR session failed:", errorMsg)
    }
  }, [onEnterXR, onExitXR])

  const enterAR = useCallback(async () => {
    if (!navigator.xr) return

    try {
      setError(null)
      console.log("[v0] XRButton: Requesting AR session with IWSDK support...")

      const session = await navigator.xr.requestSession("immersive-ar", {
        optionalFeatures: [
          "local-floor",
          "hit-test",
          "dom-overlay",
          "anchors", // Add anchors for spatial anchor support
          "plane-detection",
        ],
        domOverlay: { root: document.body },
      })

      session.addEventListener("end", () => {
        setActiveSession(null)
        onExitXR()
        console.log("[v0] XRButton: AR session ended")
      })

      setActiveSession(session)
      onEnterXR(session)
      console.log("[v0] XRButton: AR session started successfully")
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to enter AR"
      setError(errorMsg)
      console.error("[v0] XRButton: AR session failed:", errorMsg)
    }
  }, [onEnterXR, onExitXR])

  const exitXR = useCallback(async () => {
    if (activeSession) {
      await activeSession.end()
      setActiveSession(null)
      onExitXR()
    }
  }, [activeSession, onExitXR])

  if (activeSession) {
    return (
      <Button onClick={exitXR} variant="destructive" size="lg" className="gap-2">
        Exit XR
      </Button>
    )
  }

  const hasXRSupport = vrSupport === "supported" || arSupport === "supported"
  const isChecking = vrSupport === "checking" || arSupport === "checking"

  if (isChecking) {
    return (
      <Button disabled size="lg" className="gap-2">
        <span className="animate-pulse">Checking XR support...</span>
      </Button>
    )
  }

  if (!hasXRSupport) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button disabled size="lg" variant="outline" className="gap-2 bg-transparent">
          <AlertCircle className="h-4 w-4" />
          WebXR Not Available
        </Button>
        <p className="text-xs text-white/60 max-w-[200px] text-center">
          Open in Meta Quest Browser or WebXR-enabled device
        </p>
        {iwsdkReady && <p className="text-xs text-green-400">IWSDK Ready</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-xs text-red-400 text-center mb-1">{error}</p>}
      {iwsdkReady && <p className="text-xs text-center text-green-400">✓ IWSDK Active</p>}

      <div className="flex gap-2">
        {vrSupport === "supported" && (
          <Button onClick={enterVR} size="lg" className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Headset className="h-4 w-4" />
            Enter VR
          </Button>
        )}

        {arSupport === "supported" && (
          <Button onClick={enterAR} size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Smartphone className="h-4 w-4" />
            Enter AR
          </Button>
        )}
      </div>
    </div>
  )
}
