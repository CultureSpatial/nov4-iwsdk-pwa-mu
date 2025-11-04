"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { trackEvent } from "@/lib/analytics"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera } from "lucide-react"

export default function ARScanPage() {
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)
    trackEvent("ar_scan_started", { source: "label" })

    // TODO: Integrate Universal AR SDK for label scanning
    setTimeout(() => {
      setScanning(false)
      trackEvent("ar_scan_completed", { success: true })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-black p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card className="p-6 bg-emerald-900/20 border-emerald-700">
          <h1 className="text-2xl font-bold text-emerald-100 mb-4">Scan Wine Label</h1>
          <p className="text-emerald-200 mb-6">Point your camera at the wine label to unlock the AR experience</p>

          <div className="aspect-square bg-emerald-950/80 border-2 border-emerald-700 border-dashed rounded-lg mb-6 flex items-center justify-center">
            {scanning ? (
              <div className="text-center">
                <Camera className="h-12 w-12 text-emerald-400 mx-auto mb-2 animate-pulse" />
                <div className="text-emerald-400">Scanning...</div>
              </div>
            ) : (
              <div className="text-center p-4">
                <Camera className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                <div className="text-emerald-600 text-sm">Camera Preview</div>
                <div className="text-emerald-700 text-xs mt-1">(Placeholder)</div>
              </div>
            )}
          </div>

          <Alert className="mb-4 bg-emerald-900/30 border-emerald-700">
            <AlertDescription className="text-emerald-200 text-sm">
              Camera integration pending. Universal AR SDK will be added for live label scanning.
            </AlertDescription>
          </Alert>

          <Button onClick={handleScan} disabled={scanning} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {scanning ? "Scanning..." : "Start Scan (Demo)"}
          </Button>
        </Card>
      </div>
    </div>
  )
}
