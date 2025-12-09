"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Headset, Loader2 } from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)
  const [iwsdkReady, setIwsdkReady] = useState(false)

  useEffect(() => {
    async function checkXRSupport() {
      console.log("[v0] XRButton: Initializing IWSDK...")
      const initialized = await iwsdkManager.initialize()
      setIwsdkReady(initialized)

      if (!navigator.xr) {
        setVrSupport("not-supported")
        return
      }

      try {
        const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
        setVrSupport(vrSupported ? "supported" : "not-supported")
        console.log("[v0] XRButton: VR supported:", vrSupported)
      } catch (e) {
        setVrSupport("error")
      }

      Analytics.xrDeviceCapabilities({
        vr: vrSupport === "supported",
        ar: false,
        iwsdk: initialized,
      })
    }

    checkXRSupport()
  }, [])

  const isChecking = vrSupport === "checking"

  if (isChecking) {
    return (
      <Button disabled size="lg" className="gap-2" aria-busy="true">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>Checking XR support...</span>
      </Button>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        disabled
        size="lg"
        variant="outline"
        className="gap-2 bg-transparent border-yellow-500/50"
        aria-disabled="true"
      >
        <Headset className="h-4 w-4 text-yellow-500" aria-hidden="true" />
        <span className="text-yellow-500">XR Coming Soon</span>
      </Button>
      <p className="text-xs text-white/60 max-w-[200px] text-center">WebXR integration temporarily unavailable</p>
      {iwsdkReady && <p className="text-xs text-green-400">IWSDK Ready</p>}
      {vrSupport === "supported" && <p className="text-xs text-blue-400">Device supports VR</p>}
    </div>
  )
}
