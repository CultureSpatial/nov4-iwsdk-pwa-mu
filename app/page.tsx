"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { trackPWAInstalled, trackExperienceStarted, SessionTracker, getDeviceInfo } from "@/lib/analytics"
import { Camera, Wine, Scan, Activity, Presentation, TestTube, Download, AlertCircle } from "lucide-react"

export default function LandingPage() {
  const searchParams = useSearchParams()
  const [sessionTracker] = useState(() => new SessionTracker())
  const [deviceInfo, setDeviceInfo] = useState<{
    platform: string
    webxrSupported: boolean
  } | null>(null)
  const [showPWAPrompt, setShowPWAPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  const utmCampaign = searchParams.get("utm_campaign")
  const utmSource = searchParams.get("utm_source")
  const utmMedium = searchParams.get("utm_medium")
  const sceneRoute = searchParams.get("scene")

  useEffect(() => {
    // Detect device capabilities
    const info = getDeviceInfo()
    setDeviceInfo({
      platform: info.platform,
      webxrSupported: info.webxrSupported,
    })

    if (utmCampaign || utmSource || utmMedium) {
      console.log("[v0] UTM tracking:", { utmCampaign, utmSource, utmMedium })
      sessionTracker.recordInteraction("utm_landing", {
        campaign: utmCampaign,
        source: utmSource,
        medium: utmMedium,
      })
    }

    if (sceneRoute) {
      console.log("[v0] Deep-link routing to scene:", sceneRoute)
      const sceneMap: Record<string, string> = {
        photo_booth: "/ar/photo-booth",
        cocktails: "/ar/cocktails",
        scan: "/ar/scan",
        iwsdk: "/ar/iwsdk",
        mr_demo: "/mr-demo",
      }
      const targetRoute = sceneMap[sceneRoute]
      if (targetRoute) {
        // Delay navigation to allow analytics to fire
        setTimeout(() => {
          window.location.href = targetRoute
        }, 500)
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show PWA prompt for mobile devices
      if (deviceInfo?.platform === "iOS" || deviceInfo?.platform === "Android") {
        setShowPWAPrompt(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", () => {
      trackPWAInstalled()
      setShowPWAPrompt(false)
    })

    return () => {
      sessionTracker.endSession()
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [sessionTracker, utmCampaign, utmSource, utmMedium, sceneRoute])

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      // iOS fallback instructions
      if (deviceInfo?.platform === "iOS") {
        alert(
          'To install this app on iOS:\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"',
        )
      }
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log("[v0] PWA install outcome:", outcome)
    setDeferredPrompt(null)
    setShowPWAPrompt(false)
  }

  const handleStartExperience = (type: "webxr" | "2d_fallback") => {
    trackExperienceStarted(type)
    sessionTracker.recordInteraction("start_experience", { type })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-emerald-900/30 border-emerald-700">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">71%</div>
                  <div className="text-sm text-emerald-200">of travelers find AR previews useful</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400">80%</div>
                  <div className="text-sm text-emerald-200">appreciate AR entertainment options</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400">25%</div>
                  <div className="text-sm text-emerald-200">increase in engagement with AR menus</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {showPWAPrompt && (
            <Alert className="bg-emerald-800 border-emerald-600">
              <Download className="h-4 w-4" />
              <AlertDescription className="text-white">
                <div className="flex items-center justify-between">
                  <span>Install this app for the best experience</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleInstallPWA} className="bg-emerald-600 hover:bg-emerald-700">
                      Install
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPWAPrompt(false)}
                      className="text-white hover:bg-emerald-700"
                    >
                      Later
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {utmCampaign && (
            <Alert className="bg-emerald-900/50 border-emerald-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-emerald-100">
                Welcome from campaign: <strong>{utmCampaign}</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-balance">Cultural Hospitality AR Pilot</h1>
            <p className="text-xl text-emerald-200 text-balance">
              Experience the future of mise en scène with digital drops
            </p>
            <p className="text-sm text-emerald-300">Nov 4 Event • Seattle • Easy to use, no app required</p>
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
                {!deviceInfo.webxrSupported && (
                  <p className="text-sm text-emerald-300 mt-2">
                    WebXR not available. You'll see 2D fallback experiences.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Innovative AR Experiences</h2>
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
