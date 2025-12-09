"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Headset, Smartphone, AlertCircle } from "lucide-react"

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

  useEffect(() => {
    async function checkXRSupport() {
      if (!navigator.xr) {
        setVrSupport("not-supported")
        setArSupport("not-supported")
        return
      }

      try {
        const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
        setVrSupport(vrSupported ? "supported" : "not-supported")
      } catch (e) {
        setVrSupport("error")
      }

      try {
        const arSupported = await navigator.xr.isSessionSupported("immersive-ar")
        setArSupport(arSupported ? "supported" : "not-supported")
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
      const session = await navigator.xr.requestSession("immersive-vr", {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
      })

      session.addEventListener("end", () => {
        setActiveSession(null)
        onExitXR()
      })

      setActiveSession(session)
      onEnterXR(session)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to enter VR")
    }
  }, [onEnterXR, onExitXR])

  useEffect(() => {
    if (autoStartOnQuest && !autoStartAttempted && vrSupport === "supported" && /Quest/i.test(navigator.userAgent)) {
      setAutoStartAttempted(true)
      console.log("[v0] Auto-starting VR on Quest browser")
      enterVR()
    }
  }, [autoStartOnQuest, autoStartAttempted, vrSupport, enterVR])

  const enterAR = useCallback(async () => {
    if (!navigator.xr) return

    try {
      setError(null)
      const session = await navigator.xr.requestSession("immersive-ar", {
        optionalFeatures: ["local-floor", "hit-test", "dom-overlay"],
        domOverlay: { root: document.body },
      })

      session.addEventListener("end", () => {
        setActiveSession(null)
        onExitXR()
      })

      setActiveSession(session)
      onEnterXR(session)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to enter AR")
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
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-xs text-red-400 text-center mb-1">{error}</p>}

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
