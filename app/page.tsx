"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { trackPWAInstalled, trackExperienceStarted, SessionTracker, getDeviceInfo } from "@/lib/analytics"
import {
  Camera,
  Wine,
  Scan,
  Activity,
  Presentation,
  TestTube,
  Download,
  AlertCircle,
  Rocket,
  Zap,
  TrendingUp,
  Globe,
  Video,
} from "lucide-react"

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
          <Alert className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/50">
            <Rocket className="h-4 w-4 text-purple-300" />
            <AlertDescription className="text-white">
              <div className="space-y-2">
                <div className="font-bold text-lg">🚀 Platform Evolution: Meta Horizon Mobile-First</div>
                <p className="text-purple-100 text-sm">
                  Transforming from WebXR scaffolding → Meta Horizon native deployment.
                  <strong className="text-purple-300"> Zero cash investment.</strong> 3B+ social reach. Enhanced with{" "}
                  <strong className="text-blue-300">Tavus.io video AI</strong> for crisp interactive content.
                </p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-purple-300">📱 iOS + Android Native</span>
                  <span className="text-blue-300">🎥 AI Video Integration</span>
                  <span className="text-emerald-300">⚡ 4x Mobile Engagement</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Card className="bg-gradient-to-r from-emerald-900/30 to-purple-900/30 border-emerald-700/50">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-emerald-200 mb-2">Transformation Journey</h3>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Badge variant="secondary" className="bg-emerald-600">
                    ✓ Scaffold
                  </Badge>
                  <div className="w-8 h-0.5 bg-emerald-500"></div>
                  <Badge variant="secondary" className="bg-yellow-600 animate-pulse">
                    → Transmutation
                  </Badge>
                  <div className="w-8 h-0.5 bg-gray-600"></div>
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    Stabilization
                  </Badge>
                </div>
                <p className="text-xs text-emerald-300 mt-2">
                  Active: Converting WebXR scaffolding to Meta Horizon native deployment with Tavus.io enhancement
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-900/30 border-emerald-700">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <div className="text-3xl font-bold text-blue-400">3B+</div>
                  </div>
                  <div className="text-sm text-blue-200">Meta social platform reach</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <div className="text-3xl font-bold text-yellow-400">4x</div>
                  </div>
                  <div className="text-sm text-yellow-200">Mobile engagement vs desktop</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <div className="text-3xl font-bold text-emerald-400">285%</div>
                  </div>
                  <div className="text-sm text-emerald-200">Target ROI with AR experiences</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Video className="h-5 w-5 text-purple-400" />
                    <div className="text-3xl font-bold text-purple-400">AI</div>
                  </div>
                  <div className="text-sm text-purple-200">Tavus.io video enhancement</div>
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
            <h1 className="text-5xl font-bold text-balance bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cultural Hospitality AR Platform
            </h1>
            <p className="text-xl text-emerald-200 text-balance">
              Meta Horizon Mobile-First • Tavus.io Enhanced • Zero Cash Investment
            </p>
            <p className="text-sm text-emerald-300">Scaffold (Nov 4) → Transmutation → Stabilization (Dec 15 Launch)</p>
          </div>

          {/* Device Info Card */}
          {deviceInfo && (
            <Card className="bg-emerald-900/50 border-emerald-700">
              <CardHeader>
                <CardTitle className="text-white">Device Status</CardTitle>
                <CardDescription className="text-emerald-200">
                  Platform detection for WebXR, Meta Horizon, and Universal AR routing
                </CardDescription>
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
                  <p className="text-sm text-blue-300 mt-2">
                    iOS detected. Meta Horizon native deployment will provide full AR capabilities.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">WebXR Scaffold Experiences (Current Stage)</h2>
            <p className="text-center text-sm text-emerald-300">
              These experiences are being transmuted to Meta Horizon native with Tavus.io enhancement
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/ar/photo-booth" onClick={() => handleStartExperience("webxr")}>
                <Card className="bg-emerald-900/50 border-emerald-700 hover:bg-emerald-900/70 transition-colors h-full cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      <CardTitle className="text-white">Photo Booth</CardTitle>
                      <Badge variant="outline" className="ml-auto text-xs border-purple-500 text-purple-300">
                        → Horizon
                      </Badge>
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
                      <Badge variant="outline" className="ml-auto text-xs border-blue-500 text-blue-300">
                        + Tavus AI
                      </Badge>
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
                      <Badge variant="outline" className="ml-auto text-xs border-purple-500 text-purple-300">
                        → Horizon
                      </Badge>
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
                      <Badge variant="outline" className="ml-auto text-xs border-purple-500 text-purple-300">
                        → Horizon
                      </Badge>
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
                      Control the demo with phase-by-phase guidance and transformation tracking
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
                      <CardTitle className="text-white">Platform Tests</CardTitle>
                    </div>
                    <CardDescription className="text-emerald-200">
                      Validate WebXR scaffold and Meta Horizon readiness
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

          <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Rocket className="h-5 w-5 text-purple-400" />
                Platform Transformation Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Badge className="bg-emerald-600">Stage 1: Scaffold</Badge>
                <p className="text-emerald-200">
                  WebXR PWA foundation (Nov 4) - Validates features and user flows with minimal investment
                </p>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-yellow-600">Stage 2: Transmutation</Badge>
                <p className="text-yellow-200">
                  Converting to Meta Horizon native with Tavus.io video AI - Zero cash, 3B+ reach via IG/FB
                </p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="border-purple-500 text-purple-300">
                  Stage 3: Stabilization
                </Badge>
                <p className="text-purple-200">
                  Dec 15 launch ready with native mobile AR, interactive video, and social distribution
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <div className="text-center text-emerald-300 text-sm space-y-1">
            <p>Session ID: {sessionTracker.getSessionId()}</p>
            <p className="text-xs text-emerald-400">Use the menu button (top right) to access all features</p>
            <p className="text-xs text-purple-400">
              Documentation: See /docs for transformation guides and technical architecture
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
