"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { iwsdkManager, type IWSDKStatus, type SpatialAnchor } from "@/lib/iwsdk-integration"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Box,
  Anchor,
  Eye,
  Hand,
  Grid3x3,
  AlertTriangle,
  Home,
  Camera,
  StopCircle,
} from "lucide-react"
import Link from "next/link"

export default function IWSDKTestPage() {
  const [status, setStatus] = useState<IWSDKStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [anchors, setAnchors] = useState<SpatialAnchor[]>([])
  const [passthroughSupported, setPassthroughSupported] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [passthroughActive, setPassthroughActive] = useState(false)
  const [passthroughLoading, setPassthroughLoading] = useState(false)
  const [xrDiagnostics, setXrDiagnostics] = useState<{
    hasNavigatorXR: boolean
    immersiveVRSupported: boolean | null
    immersiveARSupported: boolean | null
    inlineSupported: boolean | null
    xrObject: string
    error: string | null
  } | null>(null)

  useEffect(() => {
    let mounted = true

    async function initializeTests() {
      if (!mounted) return

      setLoading(true)
      setTestResults([])
      setError(null)

      try {
        addTestResult("Running XR diagnostics...")
        await runXRDiagnostics()

        // Test 1: Initialize IWSDK
        addTestResult("Initializing IWSDK...")
        const initialized = await iwsdkManager.initialize()
        if (!mounted) return
        addTestResult(initialized ? "IWSDK initialized" : "IWSDK initialization failed (continuing anyway)")

        // Test 2: Get status
        addTestResult("Fetching IWSDK status...")
        const iwsdkStatus = await iwsdkManager.getStatus()
        if (!mounted) return
        setStatus(iwsdkStatus)
        addTestResult(`Status: ${iwsdkStatus.isAvailable ? "Available" : "Not Available"}`)
        addTestResult(`Detected Device: ${iwsdkStatus.detectedDevice}`)
        addTestResult(`Debug Info: ${iwsdkStatus.deviceInfo}`)

        if (iwsdkStatus.fallbackMode) {
          addTestResult("Running in fallback mode (standard WebXR)")
        }

        // Test 3: Check passthrough
        addTestResult("Checking passthrough mode...")
        try {
          const passthrough = await iwsdkManager.requestPassthroughMode()
          if (!mounted) return
          setPassthroughSupported(passthrough)
          addTestResult(passthrough ? "Passthrough supported" : "Passthrough not available")
        } catch (e) {
          addTestResult(`Passthrough check error: ${e instanceof Error ? e.message : "Unknown"}`)
          setPassthroughSupported(false)
        }

        // Test 4: Check WebXR capabilities
        addTestResult("Checking WebXR capabilities...")
        if (typeof navigator !== "undefined" && navigator.xr) {
          try {
            const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
            const arSupported = await navigator.xr.isSessionSupported("immersive-ar")
            if (!mounted) return
            addTestResult(`WebXR VR: ${vrSupported ? "Yes" : "No"}, AR: ${arSupported ? "Yes" : "No"}`)
          } catch (xrError) {
            const msg = xrError instanceof Error ? xrError.message : "Unknown error"
            if (msg.includes("permissions policy")) {
              addTestResult("WebXR blocked by permissions policy (preview environment)")
            } else {
              addTestResult(`WebXR check error: ${msg}`)
            }
          }
        } else {
          addTestResult("WebXR API not available in this browser")
        }

        // Test 5: Device-specific info
        addTestResult(`Running on Meta Quest: ${iwsdkManager.isOnMetaQuest() ? "Yes" : "No"}`)
        addTestResult(`Device Type: ${iwsdkManager.getDeviceType()}`)
        addTestResult("Tests complete")
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error"
        console.error("[v0] IWSDK Test Error:", err)
        if (mounted) {
          setError(errorMsg)
          addTestResult(`ERROR: ${errorMsg}`)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    async function runXRDiagnostics() {
      const diagnostics: typeof xrDiagnostics = {
        hasNavigatorXR: false,
        immersiveVRSupported: null,
        immersiveARSupported: null,
        inlineSupported: null,
        xrObject: "Not available",
        error: null,
      }

      try {
        // Check if navigator.xr exists
        if (typeof navigator === "undefined") {
          diagnostics.error = "Navigator not available (SSR)"
          setXrDiagnostics(diagnostics)
          addTestResult("XR Diagnostics: Navigator not available")
          return
        }

        diagnostics.hasNavigatorXR = !!navigator.xr
        console.log("[v0] XR Diagnostics: navigator.xr exists:", diagnostics.hasNavigatorXR)
        addTestResult(`navigator.xr exists: ${diagnostics.hasNavigatorXR}`)

        if (!navigator.xr) {
          diagnostics.error = "WebXR not supported in this browser"
          setXrDiagnostics(diagnostics)
          addTestResult("XR Diagnostics: WebXR not supported")
          return
        }

        // Log the XR object details
        diagnostics.xrObject = JSON.stringify(Object.keys(navigator.xr))
        console.log("[v0] XR Diagnostics: navigator.xr object:", navigator.xr)
        console.log("[v0] XR Diagnostics: Available methods:", Object.keys(navigator.xr))
        addTestResult(`XR methods: ${diagnostics.xrObject}`)

        // Check immersive-vr support with detailed logging
        try {
          console.log("[v0] XR Diagnostics: Checking immersive-vr support...")
          const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
          diagnostics.immersiveVRSupported = vrSupported
          console.log("[v0] XR Diagnostics: immersive-vr supported:", vrSupported)
          addTestResult(`immersive-vr supported: ${vrSupported}`)

          if (vrSupported) {
            console.log("[v0] XR Diagnostics: Available features:", navigator.xr)
            addTestResult("VR is supported - can attempt requestSession")
          }
        } catch (vrError) {
          const msg = vrError instanceof Error ? vrError.message : String(vrError)
          console.error("[v0] XR Diagnostics: immersive-vr check failed:", msg)
          diagnostics.immersiveVRSupported = false
          addTestResult(`immersive-vr check error: ${msg}`)
        }

        // Check immersive-ar support
        try {
          console.log("[v0] XR Diagnostics: Checking immersive-ar support...")
          const arSupported = await navigator.xr.isSessionSupported("immersive-ar")
          diagnostics.immersiveARSupported = arSupported
          console.log("[v0] XR Diagnostics: immersive-ar supported:", arSupported)
          addTestResult(`immersive-ar supported: ${arSupported}`)
        } catch (arError) {
          const msg = arError instanceof Error ? arError.message : String(arError)
          console.error("[v0] XR Diagnostics: immersive-ar check failed:", msg)
          diagnostics.immersiveARSupported = false
          addTestResult(`immersive-ar check error: ${msg}`)
        }

        // Check inline support
        try {
          console.log("[v0] XR Diagnostics: Checking inline support...")
          const inlineSupported = await navigator.xr.isSessionSupported("inline")
          diagnostics.inlineSupported = inlineSupported
          console.log("[v0] XR Diagnostics: inline supported:", inlineSupported)
          addTestResult(`inline supported: ${inlineSupported}`)
        } catch (inlineError) {
          const msg = inlineError instanceof Error ? inlineError.message : String(inlineError)
          console.error("[v0] XR Diagnostics: inline check failed:", msg)
          diagnostics.inlineSupported = false
        }

        setXrDiagnostics(diagnostics)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error("[v0] XR Diagnostics error:", msg)
        diagnostics.error = msg
        setXrDiagnostics(diagnostics)
        addTestResult(`XR Diagnostics error: ${msg}`)
      }
    }

    initializeTests()

    return () => {
      mounted = false
    }
  }, [])

  function addTestResult(message: string) {
    const timestamp = new Date().toLocaleTimeString()
    setTestResults((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  async function createTestAnchor() {
    try {
      addTestResult("Creating test anchor...")
      const anchor = await iwsdkManager.createSpatialAnchor([0, 1.5, -1.2])
      setAnchors(iwsdkManager.getAllSpatialAnchors())
      addTestResult(`Created spatial anchor: ${anchor.id}`)
    } catch (e) {
      addTestResult(`Anchor creation error: ${e instanceof Error ? e.message : "Unknown"}`)
    }
  }

  async function clearAnchors() {
    try {
      const allAnchors = iwsdkManager.getAllSpatialAnchors()
      allAnchors.forEach((anchor) => iwsdkManager.deleteSpatialAnchor(anchor.id))
      setAnchors([])
      addTestResult("Cleared all spatial anchors")
    } catch (e) {
      addTestResult(`Clear anchors error: ${e instanceof Error ? e.message : "Unknown"}`)
    }
  }

  async function testRoomScanning() {
    try {
      addTestResult("Starting room scanning test...")
      const started = await iwsdkManager.startRoomScanning()
      addTestResult(started ? "Room scanning started" : "Room scanning failed to start")

      setTimeout(async () => {
        try {
          await iwsdkManager.stopRoomScanning()
          addTestResult("Room scanning stopped")
        } catch (e) {
          addTestResult(`Stop scanning error: ${e instanceof Error ? e.message : "Unknown"}`)
        }
      }, 3000)
    } catch (e) {
      addTestResult(`Room scanning error: ${e instanceof Error ? e.message : "Unknown"}`)
    }
  }

  async function testPassthroughCamera() {
    setPassthroughLoading(true)
    try {
      if (passthroughActive) {
        // Stop passthrough
        addTestResult("Stopping passthrough camera...")
        const stopped = await iwsdkManager.stopPassthroughCamera()
        setPassthroughActive(false)
        addTestResult(stopped ? "Passthrough camera stopped" : "Failed to stop passthrough")
      } else {
        // Start passthrough
        addTestResult("Initiating passthrough camera...")
        console.log("[v0] Starting passthrough - checking XR state first...")

        if (navigator.xr) {
          try {
            const vrCheck = await navigator.xr.isSessionSupported("immersive-vr")
            console.log("[v0] Pre-passthrough VR check:", vrCheck)
            addTestResult(`Pre-check: immersive-vr = ${vrCheck}`)
          } catch (e) {
            console.log("[v0] Pre-passthrough VR check error:", e)
          }
        }

        const result = await iwsdkManager.startPassthroughCamera()
        setPassthroughActive(result.success)

        if (result.success) {
          addTestResult("Passthrough camera STARTED successfully!")
          addTestResult(`Session: ${result.session ? "Active" : "No session object"}`)
          addTestResult(`Reference Space: ${result.referenceSpace ? "Available" : "Not available"}`)
          if (result.error) {
            addTestResult(`Note: ${result.error}`)
          }
        } else {
          addTestResult(`Passthrough camera FAILED: ${result.error || "Unknown error"}`)
        }
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      addTestResult(`Passthrough error: ${errorMsg}`)
      setPassthroughActive(false)
    } finally {
      setPassthroughLoading(false)
    }
  }

  async function testManualXRSession() {
    addTestResult("Testing manual XR session request...")
    console.log("[v0] Manual XR Session Test starting...")

    if (!navigator.xr) {
      addTestResult("ERROR: navigator.xr not available")
      return
    }

    try {
      // Test 1: Check support first
      console.log("[v0] Checking immersive-vr support...")
      const supported = await navigator.xr.isSessionSupported("immersive-vr")
      console.log("[v0] immersive-vr supported:", supported)
      addTestResult(`Support check: ${supported}`)

      if (!supported) {
        addTestResult("immersive-vr not supported - cannot proceed")
        return
      }

      // Test 2: Try minimal session request
      console.log("[v0] Requesting minimal immersive-vr session...")
      addTestResult("Requesting session with no required features...")

      const session = await navigator.xr.requestSession("immersive-vr", {
        requiredFeatures: [],
      })

      console.log("[v0] Session obtained:", session)
      addTestResult(`Session obtained: ${!!session}`)
      addTestResult(`Session mode: ${session.mode || "unknown"}`)

      // End session after brief delay
      setTimeout(async () => {
        try {
          await session.end()
          addTestResult("Test session ended successfully")
          console.log("[v0] Test session ended")
        } catch (e) {
          console.log("[v0] Session end error:", e)
        }
      }, 2000)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error("[v0] Manual XR session error:", e)
      addTestResult(`Session request FAILED: ${msg}`)
    }
  }

  const CapabilityBadge = ({ enabled, label }: { enabled: boolean; label: string }) => (
    <Badge variant={enabled ? "default" : "secondary"} className="gap-1">
      {enabled ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}
    </Badge>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-2 mb-4">
            <Badge className="bg-amber-600 hover:bg-amber-700 text-white">Cultural Tooling</Badge>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white">IWSDK Test Suite</h1>
          <p className="text-slate-400">Meta Immersive Web SDK Integration Verification</p>
          <Link href="/ring-room">
            <Button variant="outline" className="mt-4 bg-transparent">
              Go to Ring Room
            </Button>
          </Link>
        </div>

        {error && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-200">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {status?.fallbackMode && (
          <Alert className="border-yellow-500 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              <strong>Fallback Mode Active:</strong> Running with standard WebXR. For full IWSDK features, use a Meta
              Quest device.
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-blue-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              XR Diagnostics
            </CardTitle>
            <CardDescription>Detailed WebXR API status and session support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {xrDiagnostics ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">navigator.xr</p>
                  <Badge variant={xrDiagnostics.hasNavigatorXR ? "default" : "destructive"}>
                    {xrDiagnostics.hasNavigatorXR ? "Available" : "Not Available"}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">immersive-vr</p>
                  <Badge variant={xrDiagnostics.immersiveVRSupported ? "default" : "secondary"}>
                    {xrDiagnostics.immersiveVRSupported === null
                      ? "Not checked"
                      : xrDiagnostics.immersiveVRSupported
                        ? "Supported"
                        : "Not Supported"}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">immersive-ar</p>
                  <Badge variant={xrDiagnostics.immersiveARSupported ? "default" : "secondary"}>
                    {xrDiagnostics.immersiveARSupported === null
                      ? "Not checked"
                      : xrDiagnostics.immersiveARSupported
                        ? "Supported"
                        : "Not Supported"}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">inline</p>
                  <Badge variant={xrDiagnostics.inlineSupported ? "default" : "secondary"}>
                    {xrDiagnostics.inlineSupported === null
                      ? "Not checked"
                      : xrDiagnostics.inlineSupported
                        ? "Supported"
                        : "Not Supported"}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Running diagnostics...</div>
            )}

            {xrDiagnostics?.error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">{xrDiagnostics.error}</AlertDescription>
              </Alert>
            )}

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">Manual XR Session Test</p>
              <Button onClick={testManualXRSession} variant="outline" className="gap-2 bg-transparent">
                <Box className="h-4 w-4" />
                Test Manual XR Session
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Attempts to start a minimal immersive-vr session with no required features.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              IWSDK Status
            </CardTitle>
            <CardDescription>System information and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : status ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      {status.isAvailable ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          Available
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          Not Available
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="text-lg font-semibold">{status.version}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Detected Device</p>
                  <Badge variant="outline" className="text-sm">
                    {status.detectedDevice}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Device Info</p>
                  <p className="text-xs font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded">{status.deviceInfo}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">User Agent</p>
                  <p className="text-xs font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded break-all">
                    {status.userAgent}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    <CapabilityBadge enabled={status.capabilities.spatialAnchors} label="Spatial Anchors" />
                    <CapabilityBadge enabled={status.capabilities.roomScanning} label="Room Scanning" />
                    <CapabilityBadge enabled={status.capabilities.passthrough} label="Passthrough" />
                    <CapabilityBadge enabled={status.capabilities.handTracking} label="Hand Tracking" />
                    <CapabilityBadge enabled={status.capabilities.planeDetection} label="Plane Detection" />
                  </div>
                </div>
              </>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to load IWSDK status</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Spatial Anchors Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Anchor className="h-5 w-5" />
              Spatial Anchors
            </CardTitle>
            <CardDescription>Create and manage spatial anchors in the scene</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={createTestAnchor} size="sm">
                Create Test Anchor
              </Button>
              <Button onClick={clearAnchors} variant="outline" size="sm" disabled={anchors.length === 0}>
                Clear All ({anchors.length})
              </Button>
            </div>

            {anchors.length > 0 && (
              <div className="space-y-2">
                {anchors.map((anchor) => (
                  <div key={anchor.id} className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                    <p className="font-mono text-xs text-muted-foreground">{anchor.id}</p>
                    <p className="text-xs mt-1">Position: [{anchor.position.map((v) => v.toFixed(2)).join(", ")}]</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3x3 className="h-5 w-5" />
              Additional Tests
            </CardTitle>
            <CardDescription>Room scanning and other IWSDK features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button onClick={testRoomScanning} variant="outline" className="gap-2 bg-transparent">
                <Eye className="h-4 w-4" />
                Test Room Scanning
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent" disabled>
                <Hand className="h-4 w-4" />
                Test Hand Tracking
              </Button>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">Passthrough Mode</p>
              <Badge variant={passthroughSupported ? "default" : "secondary"}>
                {passthroughSupported ? "Supported" : "Not Supported"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Passthrough Camera Test */}
        <Card className="border-purple-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-500" />
              Passthrough Camera Test
            </CardTitle>
            <CardDescription>Test initiating the Quest passthrough camera in AR/MR mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert
              className={passthroughActive ? "border-green-500 bg-green-500/10" : "border-slate-500 bg-slate-500/10"}
            >
              <AlertCircle className={`h-4 w-4 ${passthroughActive ? "text-green-500" : "text-slate-400"}`} />
              <AlertDescription className={passthroughActive ? "text-green-200" : "text-slate-300"}>
                {passthroughActive
                  ? "Passthrough camera is ACTIVE. You should see your real environment through the headset."
                  : "Passthrough camera is inactive. Click the button below to start it."}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                onClick={testPassthroughCamera}
                disabled={passthroughLoading}
                variant={passthroughActive ? "destructive" : "default"}
                className="gap-2 flex-1"
              >
                {passthroughLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    {passthroughActive ? "Stopping..." : "Starting..."}
                  </>
                ) : passthroughActive ? (
                  <>
                    <StopCircle className="h-4 w-4" />
                    Stop Passthrough Camera
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Start Passthrough Camera
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Requirements:</strong>
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Meta Quest device with passthrough capability</li>
                <li>Quest Browser or compatible WebXR browser</li>
                <li>Page must be served over HTTPS (or localhost)</li>
                <li>User must grant XR permissions when prompted</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Gold Test Box Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5 text-yellow-500" />
              Gold Test Box Verification
            </CardTitle>
            <CardDescription>Visual verification checklist for XR scene</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <strong>To verify the gold test box:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Navigate to the Ring Room page</li>
                  <li>Enter VR/XR mode on a Meta Quest device</li>
                  <li>Look for a 1x1x1 metallic gold cube floating above the platform</li>
                  <li>Verify "IWSDK Test Box" label appears above it</li>
                  <li>Check IWSDK status indicator (green = active)</li>
                </ol>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Test Log */}
        <Card>
          <CardHeader>
            <CardTitle>Test Log</CardTitle>
            <CardDescription>Real-time test execution results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 text-green-400 font-mono text-xs p-4 rounded max-h-64 overflow-y-auto space-y-1">
              {testResults.length === 0 ? (
                <div className="text-slate-500">Waiting for tests to run...</div>
              ) : (
                testResults.map((result, i) => <div key={i}>{result}</div>)
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
