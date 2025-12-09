"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw, Monitor } from "lucide-react"
import { Analytics } from "@/lib/analytics"

export default function RingRoomError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Analytics.errorOccurred("ring_room", error.message, "ring-room-page")
    console.error("[v0] Ring Room error:", error)
  }, [error])

  const isWebGLError = error.message.toLowerCase().includes("webgl") || error.message.toLowerCase().includes("context")
  const isXRError = error.message.toLowerCase().includes("xr") || error.message.toLowerCase().includes("session")

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur rounded-2xl p-8 text-center border border-slate-700">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-400" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          {isWebGLError ? "3D Graphics Issue" : isXRError ? "XR Session Error" : "Ring Room Error"}
        </h1>

        <p className="text-slate-400 mb-6">
          {isWebGLError
            ? "Your device may not support 3D graphics, or the graphics context was lost. Try refreshing the page."
            : isXRError
              ? "The XR session encountered an issue. Please exit XR mode and try again."
              : "Something went wrong while loading the Ring Room. Please try again."}
        </p>

        {isWebGLError && (
          <div className="mb-6 p-4 bg-slate-900/50 rounded-lg text-left">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4" aria-hidden="true" />
              Troubleshooting Tips
            </h3>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Close other browser tabs using 3D graphics</li>
              <li>Update your browser to the latest version</li>
              <li>Try disabling hardware acceleration extensions</li>
              <li>On mobile, close background apps</li>
            </ul>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            variant="outline"
            className="gap-2 bg-transparent border-slate-600 text-white hover:bg-slate-700"
            aria-label="Try again"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            aria-label="Go to home page"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
