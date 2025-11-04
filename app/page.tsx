"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { trackPWAInstalled, trackExperienceStarted, SessionTracker, getDeviceInfo } from "@/lib/analytics"
import { Camera, Wine, Scan, Activity, Presentation, TestTube } from "lucide-react"

export default function LandingPage() {
  const [sessionTracker] = useState(() => new SessionTracker())
  const [deviceInfo, setDeviceInfo] = useState<{
    platform: string
    webxrSupported: boolean
  } | null>(null)

  useEffect(() => {
    // Detect device capabilities
    const info = getDeviceInfo()
    setDeviceInfo({
      platform: info.platform,
      webxrSupported: info.webxrSupported,
    })

    // Track PWA installation
    window.addEventListener("appinstalled", () => {
      trackPWAInstalled()
    })

    // Cleanup session on unmount
    return () => {
      sessionTracker.endSession()
    }
  }, [sessionTracker])

  const handleStartExperience = (type: "webxr" | "2d_fallback") => {
    trackExperienceStarted(type)
    sessionTracker.recordInteraction("start_experience", { type })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-black text-white">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-balance">Cultural Hospitality AR Pilot</h1>
            <p className="text-xl text-emerald-200 text-balance">
              Experience the future of mise en scène with digital drops
            </p>
            <p className="text-sm text-emerald-300">Nov 4 Event • Seattle</p>
          </div>

          {/* Device Info Card */}
          {deviceInfo && (
            <Card className="bg-emerald-900/50 border-emerald-700">
              <CardHeader>
                <CardTitle className="text-white">Device Status</CardTitle>
                <CardDescription className="text-emerald-200">Your device capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100">Platform:</span>
                  <Badge variant="secondary">{deviceInfo.platform}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100">WebXR Support:</span>
                  <Badge variant={deviceInfo.webxrSupported ? "default" : "destructive"}>
                    {deviceInfo.webxrSupported ? "Supported" : "Not Supported"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">AR Experiences</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/ar/photo-booth" onClick={() => handleStartExperience("webxr")}>
                <Card className="bg-emerald-900/50 border-emerald-700 hover:bg-emerald-900/70 transition-colors h-full cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      <CardTitle className="text-white">Photo Booth</CardTitle>
                    </div>
                    <CardDescription className="text-emerald-200">
                      Capture moments with AR filters and Emerald City frames
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Open Photo Booth</Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/ar/cocktails" onClick={() => handleStartExperience("webxr")}>
                <Card className="bg-emerald-900/50 border-emerald-700 hover:bg-emerald-900/70 transition-colors h-full cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Wine className="h-5 w-5" />
                      <CardTitle className="text-white">Cocktail Menu</CardTitle>
                    </div>
                    <CardDescription className="text-emerald-200">
                      Explore Wicked-themed drinks with interactive 3D models
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Menu</Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/ar/scan" onClick={() => handleStartExperience("webxr")}>
                <Card className="bg-emerald-900/50 border-emerald-700 hover:bg-emerald-900/70 transition-colors h-full cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Scan className="h-5 w-5" />
                      <CardTitle className="text-white">AR Label Scan</CardTitle>
                    </div>
                    <CardDescription className="text-emerald-200">
                      Scan labels to unlock AR experiences and stories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Start Scanning</Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/ar/iwsdk" onClick={() => handleStartExperience("webxr")}>
                <Card className="bg-emerald-900/50 border-emerald-700 hover:bg-emerald-900/70 transition-colors h-full cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      <CardTitle className="text-white">IWSDK Demo</CardTitle>
                    </div>
                    <CardDescription className="text-emerald-200">
                      Full immersive AR with hand tracking and physics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={!deviceInfo?.webxrSupported}
                    >
                      {deviceInfo?.webxrSupported ? "Launch IWSDK" : "WebXR Not Available"}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Presenter & Admin Tools</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/presenter">
                <Card className="bg-emerald-900/30 border-emerald-700 hover:bg-emerald-900/50 transition-colors h-full cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Presentation className="h-5 w-5" />
                      <CardTitle className="text-white">Presenter Dashboard</CardTitle>
                    </div>
                    <CardDescription className="text-emerald-200">
                      Control the Nov 4 demo with phase-by-phase guidance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-100 hover:bg-emerald-900 bg-transparent"
                    >
                      Open Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/test/iwsdk">
                <Card className="bg-emerald-900/30 border-emerald-700 hover:bg-emerald-900/50 transition-colors h-full cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TestTube className="h-5 w-5" />
                      <CardTitle className="text-white">IWSDK Tests</CardTitle>
                    </div>
                    <CardDescription className="text-emerald-200">
                      Validate AR systems and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-100 hover:bg-emerald-900 bg-transparent"
                    >
                      Run Tests
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Session Info */}
          <div className="text-center text-emerald-300 text-sm space-y-1">
            <p>Session ID: {sessionTracker.getSessionId()}</p>
            <p className="text-xs text-emerald-400">Use the menu button (top right) to access all features</p>
          </div>
        </div>
      </div>
    </div>
  )
}
