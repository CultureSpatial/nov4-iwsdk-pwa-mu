"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { trackPWAInstalled, trackExperienceStarted, SessionTracker, getDeviceInfo } from "@/lib/analytics"

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
    // Navigate to experience (to be implemented)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-balance">Cultural Hospitality AR Pilot</h1>
            <p className="text-xl text-emerald-200 text-balance">
              Experience the future of mise en scène with digital drops
            </p>
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

          {/* Experience Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-emerald-900/50 border-emerald-700 hover:bg-emerald-900/70 transition-colors">
              <CardHeader>
                <CardTitle className="text-white">WebXR Experience</CardTitle>
                <CardDescription className="text-emerald-200">Immersive AR with full spatial tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleStartExperience("webxr")}
                  disabled={!deviceInfo?.webxrSupported}
                >
                  {deviceInfo?.webxrSupported ? "Start AR Experience" : "WebXR Not Available"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-emerald-900/50 border-emerald-700 hover:bg-emerald-900/70 transition-colors">
              <CardHeader>
                <CardTitle className="text-white">2D Experience</CardTitle>
                <CardDescription className="text-emerald-200">Interactive mobile experience</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleStartExperience("2d_fallback")}
                >
                  Start 2D Experience
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-emerald-900/30 border-emerald-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Photo Booth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-200 text-sm">Capture moments with AR filters</p>
              </CardContent>
            </Card>

            <Card className="bg-emerald-900/30 border-emerald-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Cocktail Menu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-200 text-sm">Explore Wicked-themed drinks</p>
              </CardContent>
            </Card>

            <Card className="bg-emerald-900/30 border-emerald-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Interactive Polls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-200 text-sm">Engage with real-time voting</p>
              </CardContent>
            </Card>
          </div>

          {/* Session Info */}
          <div className="text-center text-emerald-300 text-sm">Session ID: {sessionTracker.getSessionId()}</div>
        </div>
      </div>
    </div>
  )
}
