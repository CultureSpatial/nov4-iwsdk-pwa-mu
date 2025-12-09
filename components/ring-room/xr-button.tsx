"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Headset, Loader2, X } from "lucide-react"
import { iwsdkManager } from "@/lib/iwsdk-integration"
import { Analytics } from "@/lib/analytics"

interface XRButtonProps {
  onEnterXR: (session: XRSession) => void
  onExitXR: () => void
  autoStartOnQuest?: boolean
}

type XRSupport = "supported" | "not-supported" | "checking" | "error"

export function XRButton({ onEnterXR, onExitXR, autoStartOnQuest = true }: XRButtonProps) {
  const [vrSupport, setVrSupport] = useState<XRSupport>("checking")
  const [isInSession, setIsInSession] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [iwsdkReady, setIwsdkReady] = useState(false)
  const [currentSession, setCurrentSession] = useState<XRSession | null>(null)

  useEffect(() => {
    async function checkXRSupport() {
      console.log("[v0] XRButton: Initializing IWSDK...")
      const initialized = await iwsdkManager.initialize()
      setIwsdkReady(initialized)

      if (!navigator.xr) {
        console.log("[v0] XRButton: WebXR not available")
        setVrSupport("not-supported")
        return
      }

      try {
        const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
        setVrSupport(vrSupported ? "supported" : "not-supported")
        console.log("[v0] XRButton: VR supported:", vrSupported)

        // Auto-start on Quest if enabled
        if (vrSupported && autoStartOnQuest && iwsdkManager.isOnMetaQuest()) {
          console.log("[v0] XRButton: Auto-starting XR on Quest...")
          handleEnterXR()
        }
      } catch (e) {
        console.log("[v0] XRButton: Error checking XR support:", e)
        setVrSupport("error")
        setError("Unable to check XR support")
      }

      Analytics.xrDeviceCapabilities({
        vr: vrSupport === "supported",
        ar: false,
        iwsdk: initialized,
      })
    }

    checkXRSupport()
  }, [autoStartOnQuest])

  const handleEnterXR = async () => {
    if (!navigator.xr) return

    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] XRButton: Requesting immersive-vr session...")

      const session = await navigator.xr.requestSession("immersive-vr", {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking", "layers"],
      })

      session.addEventListener("end", () => {
        console.log("[v0] XRButton: Session ended")
        setIsInSession(false)
        setCurrentSession(null)
        onExitXR()
      })

      setCurrentSession(session)
      setIsInSession(true)
      console.log("[v0] XRButton: XR session started successfully")

      Analytics.track("xr_session_started", {
        iwsdkReady,
        isQuest: iwsdkManager.isOnMetaQuest(),
      })

      onEnterXR(session)
    } catch (e) {
      console.error("[v0] XRButton: Failed to start XR session:", e)
      setError(e instanceof Error ? e.message : "Failed to start XR session")

      Analytics.track("xr_session_error", {
        error: e instanceof Error ? e.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExitXR = async () => {
    if (currentSession) {
      console.log("[v0] XRButton: Ending XR session...")
      await currentSession.end()
    }
  }

  const isChecking = vrSupport === "checking"

  if (isChecking) {
    return (
      <Button disabled size="lg" className="gap-2" aria-busy="true">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>Checking XR support...</span>
      </Button>
    )
  }

  if (isInSession) {
    return (
      <Button onClick={handleExitXR} size="lg" variant="destructive" className="gap-2">
        <X className="h-4 w-4" aria-hidden="true" />
        <span>Exit XR</span>
      </Button>
    )
  }

  if (vrSupport === "supported") {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleEnterXR}
          disabled={isLoading}
          size="lg"
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Headset className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{isLoading ? "Starting XR..." : "Enter XR Mode"}</span>
        </Button>
        {iwsdkReady && <p className="text-xs text-green-400">IWSDK Ready</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        disabled
        size="lg"
        variant="outline"
        className="gap-2 bg-transparent border-white/20"
        aria-disabled="true"
      >
        <Headset className="h-4 w-4 text-white/50" aria-hidden="true" />
        <span className="text-white/50">XR Not Available on Desktop Mode</span>
      </Button>
      <p className="text-xs text-white/60 max-w-[200px] text-center">
        {vrSupport === "error" ? "XR blocked by browser policy" : "Open on a WebXR-compatible device like Meta Quest"}
      </p>
      {iwsdkReady && <p className="text-xs text-green-400">IWSDK Ready</p>}
    </div>
  )
}
