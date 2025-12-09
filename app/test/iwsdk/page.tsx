"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { iwsdkManager, type IWSDKStatus, type SpatialAnchor } from "@/lib/iwsdk-integration"
import { CheckCircle2, XCircle, AlertCircle, Box, Anchor, Eye, Hand, Grid3x3 } from "lucide-react"
import Link from "next/link"

export default function IWSDKTestPage() {
  const [status, setStatus] = useState<IWSDKStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [anchors, setAnchors] = useState<SpatialAnchor[]>([])
  const [passthroughSupported, setPassthroughSupported] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    async function initializeTests() {
      setLoading(true)
      setTestResults([])

      // Test 1: Initialize IWSDK
      addTestResult("Initializing IWSDK...")
      const initialized = await iwsdkManager.initialize()
      addTestResult(initialized ? "✓ IWSDK initialized" : "✗ IWSDK initialization failed")

      // Test 2: Get status
      addTestResult("Fetching IWSDK status...")
      const iwsdkStatus = await iwsdkManager.getStatus()
      setStatus(iwsdkStatus)
      addTestResult(`✓ Status retrieved: ${iwsdkStatus.isAvailable ? "Available" : "Not Available"}`)

      // Test 3: Check passthrough
      addTestResult("Checking passthrough mode...")
      const passthrough = await iwsdkManager.requestPassthroughMode()
      setPassthroughSupported(passthrough)
      addTestResult(passthrough ? "✓ Passthrough supported" : "✗ Passthrough not supported")

      // Test 4: Check WebXR capabilities
      addTestResult("Checking WebXR capabilities...")
      if (navigator.xr) {
        const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
        const arSupported = await navigator.xr.isSessionSupported("immersive-ar")
        addTestResult(`✓ WebXR VR: ${vrSupported ? "Yes" : "No"}, AR: ${arSupported ? "Yes" : "No"}`)
      } else {
        addTestResult("✗ WebXR not available")
      }

      setLoading(false)
    }

    initializeTests()
  }, [])

  function addTestResult(message: string) {
    setTestResults((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  async function createTestAnchor() {
    const anchor = await iwsdkManager.createSpatialAnchor([0, 1.5, -1.2])
    setAnchors(iwsdkManager.getAllSpatialAnchors())
    addTestResult(`✓ Created spatial anchor: ${anchor.id}`)
  }

  async function clearAnchors() {
    const allAnchors = iwsdkManager.getAllSpatialAnchors()
    allAnchors.forEach((anchor) => iwsdkManager.deleteSpatialAnchor(anchor.id))
    setAnchors([])
    addTestResult("✓ Cleared all spatial anchors")
  }

  async function testRoomScanning() {
    addTestResult("Starting room scanning test...")
    const started = await iwsdkManager.startRoomScanning()
    addTestResult(started ? "✓ Room scanning started" : "✗ Room scanning failed")

    setTimeout(async () => {
      await iwsdkManager.stopRoomScanning()
      addTestResult("✓ Room scanning stopped")
    }, 3000)
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
          <h1 className="text-4xl font-bold text-white">IWSDK Test Suite</h1>
          <p className="text-slate-400">Meta Immersive Web SDK Integration Verification</p>
          <Link href="/ring-room">
            <Button variant="outline" className="mt-4 bg-transparent">
              Go to Ring Room
            </Button>
          </Link>
        </div>

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
                  <p className="text-sm text-muted-foreground mb-2">Device Info</p>
                  <p className="text-xs font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded">{status.deviceInfo}</p>
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
              <p className="text-sm font-medium mb-2">Passthrough Mode</p>
              <Badge variant={passthroughSupported ? "default" : "secondary"}>
                {passthroughSupported ? "Supported" : "Not Supported"}
              </Badge>
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
              {testResults.map((result, i) => (
                <div key={i}>{result}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
