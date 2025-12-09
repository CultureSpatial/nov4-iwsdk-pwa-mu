"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Headset, Smartphone, AlertCircle, Loader2 } from "lucide-react"
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
  const [arSupport, setArSupport] = useState<XRSupport>("checking")
  const [activeSession, setActiveSession] = useState<XRSession | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEntering, setIsEntering] = useState(false)
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

      Analytics.xrDeviceCapabilities({
        vr: vrSupport === "supported",
        ar: arSupport === "supported",
        iwsdk: initialized,
      })
    }

    checkXRSupport()
  }, [])

  const enterVR = useCallback(async () => {
    if (!navigator.xr) return

    try {
      setError(null)
      setIsEntering(true)
      console.log("[v0] XRButton: Requesting VR session with IWSDK support...")

      const session = await navigator.xr.requestSession("immersive-vr", {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking", "layers"],
      })

      session.addEventListener("end", () => {
        setActiveSession(null)
        onExitXR()
        console.log("[v0] XRButton: VR session ended")
      })

      setActiveSession(session)
      onEnterXR(session)
      Analytics.xrModeEntered("vr", navigator.userAgent.includes("Quest") ? "quest" : "desktop")
      console.log("[v0] XRButton: VR session started successfully")
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to enter VR"
      setError(errorMsg)
      Analytics.xrSessionFailed("vr", errorMsg)
      console.error("[v0] XRButton: VR session failed:", errorMsg)
    } finally {
      setIsEntering(false)
    }
  }, [onEnterXR, onExitXR])

  const enterAR = useCallback(async () => {
    if (!navigator.xr) return

    try {
      setError(null)
      setIsEntering(true)
      console.log("[v0] XRButton: Requesting AR session with IWSDK support...")

      const session = await navigator.xr.requestSession("immersive-ar", {
        optionalFeatures: ["local-floor", "hit-test", "dom-overlay", "anchors", "plane-detection"],
        domOverlay: { root: document.body },
      })

      session.addEventListener("end", () => {
        setActiveSession(null)
        onExitXR()
        console.log("[v0] XRButton: AR session ended")
      })

      setActiveSession(session)
      onEnterXR(session)
      Analytics.xrModeEntered("ar", navigator.userAgent.includes("Quest") ? "quest" : "mobile")
      console.log("[v0] XRButton: AR session started successfully")
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to enter AR"
      setError(errorMsg)
      Analytics.xrSessionFailed("ar", errorMsg)
      console.error("[v0] XRButton: AR session failed:", errorMsg)
    } finally {
      setIsEntering(false)
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
      <Button onClick={exitXR} variant="destructive" size="lg" className="gap-2" aria-label="Exit XR mode">
        Exit XR
      </Button>
    )
  }

  const hasXRSupport = vrSupport === "supported" || arSupport === "supported"
  const isChecking = vrSupport === "checking" || arSupport === "checking"

  if (isChecking) {
    return (
      <Button disabled size="lg" className="gap-2" aria-busy="true">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>Checking XR support...</span>
      </Button>
    )
  }

  if (!hasXRSupport) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button disabled size="lg" variant="outline" className="gap-2 bg-transparent" aria-disabled="true">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
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
    <div className="flex flex-col gap-2" role="group" aria-label="XR mode options">
      {error && (
        <p className="text-xs text-red-400 text-center mb-1" role="alert">
          {error}
        </p>
      )}
      {iwsdkReady && <p className="text-xs text-center text-green-400">IWSDK Active</p>}

      <div className="flex gap-2">
        {vrSupport === "supported" && (
          <Button
            onClick={enterVR}
            size="lg"
            className="gap-2 bg-purple-600 hover:bg-purple-700"
            disabled={isEntering}
            aria-label="Enter VR mode"
          >
            {isEntering ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Headset className="h-4 w-4" aria-hidden="true" />
            )}
            Enter VR
          </Button>
        )}

        {arSupport === "supported" && (
          <Button
            onClick={enterAR}
            size="lg"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            disabled={isEntering}
            aria-label="Enter AR mode"
          >
            {isEntering ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Smartphone className="h-4 w-4" aria-hidden="true" />
            )}
            Enter AR
          </Button>
        )}
      </div>
    </div>
  )
}
