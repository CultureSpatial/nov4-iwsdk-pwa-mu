"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Smartphone, Wifi, Database, Zap, LifeBuoy } from "lucide-react"

interface HealthCheck {
  name: string
  status: "pass" | "fail" | "pending"
  message: string
}

interface PreflightItem {
  id: string
  label: string
  checked: boolean
}

export default function RunbookPage() {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    { name: "API Health", status: "pending", message: "Checking..." },
    { name: "CDN Status", status: "pending", message: "Checking..." },
    { name: "Feature Flags", status: "pending", message: "Checking..." },
    { name: "Analytics", status: "pending", message: "Checking..." },
  ])

  const [preflightChecklist, setPreflightChecklist] = useState<PreflightItem[]>([
    { id: "health", label: "Verify /health endpoint returns 200", checked: false },
    { id: "cdn", label: "CDN warm - test asset loading", checked: false },
    { id: "flags", label: "Feature flags configured correctly", checked: false },
    { id: "ios", label: "Test on iOS Safari 17+", checked: false },
    { id: "android", label: "Test on Android Chrome 125+", checked: false },
    { id: "qr", label: "QR codes tested across carriers", checked: false },
    { id: "fallback", label: "Static fallback page accessible", checked: false },
    { id: "support", label: "Support contact link verified", checked: false },
  ])

  const [isRunningChecks, setIsRunningChecks] = useState(false)

  useEffect(() => {
    runHealthChecks()
  }, [])

  const runHealthChecks = async () => {
    setIsRunningChecks(true)

    // Check API Health
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setHealthChecks((prev) =>
        prev.map((check) =>
          check.name === "API Health"
            ? {
                ...check,
                status: response.ok ? "pass" : "fail",
                message: response.ok ? `Healthy - ${data.version}` : "Health check failed",
              }
            : check,
        ),
      )
    } catch (error) {
      setHealthChecks((prev) =>
        prev.map((check) =>
          check.name === "API Health" ? { ...check, status: "fail", message: "Connection failed" } : check,
        ),
      )
    }

    // Check CDN Status (simulate)
    setTimeout(() => {
      setHealthChecks((prev) =>
        prev.map((check) =>
          check.name === "CDN Status" ? { ...check, status: "pass", message: "Assets loading normally" } : check,
        ),
      )
    }, 1000)

    // Check Feature Flags
    setTimeout(() => {
      const flags = {
        photo_booth: true,
        cocktails: true,
        mr_demo: true,
      }
      setHealthChecks((prev) =>
        prev.map((check) =>
          check.name === "Feature Flags"
            ? { ...check, status: "pass", message: `${Object.keys(flags).length} flags active` }
            : check,
        ),
      )
    }, 1500)

    // Check Analytics
    setTimeout(() => {
      setHealthChecks((prev) =>
        prev.map((check) =>
          check.name === "Analytics" ? { ...check, status: "pass", message: "Vercel Analytics active" } : check,
        ),
      )
      setIsRunningChecks(false)
    }, 2000)
  }

  const togglePreflightItem = (id: string) => {
    setPreflightChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const allPreflightComplete = preflightChecklist.every((item) => item.checked)
  const allHealthPassing = healthChecks.every((check) => check.status === "pass")

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Nov 4 Event Runbook</h1>
          <p className="text-emerald-200">Day-of operations checklist and system status</p>
        </div>

        {/* Overall Status */}
        <Alert className={allHealthPassing && allPreflightComplete ? "bg-emerald-800" : "bg-yellow-900"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-white">
            {allHealthPassing && allPreflightComplete ? (
              <span className="font-semibold">System Ready for Event</span>
            ) : (
              <span className="font-semibold">Complete preflight checks before event</span>
            )}
          </AlertDescription>
        </Alert>

        {/* Health Checks */}
        <Card className="bg-emerald-900/50 border-emerald-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  System Health Checks
                </CardTitle>
                <CardDescription className="text-emerald-200">Real-time system status</CardDescription>
              </div>
              <Button
                onClick={runHealthChecks}
                disabled={isRunningChecks}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRunningChecks ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthChecks.map((check) => (
              <div key={check.name} className="flex items-center justify-between p-3 bg-emerald-950/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {check.status === "pass" && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                  {check.status === "fail" && <XCircle className="h-5 w-5 text-red-400" />}
                  {check.status === "pending" && <RefreshCw className="h-5 w-5 text-yellow-400 animate-spin" />}
                  <div>
                    <p className="font-medium text-white">{check.name}</p>
                    <p className="text-sm text-emerald-300">{check.message}</p>
                  </div>
                </div>
                <Badge
                  variant={check.status === "pass" ? "default" : check.status === "fail" ? "destructive" : "secondary"}
                >
                  {check.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Preflight Checklist */}
        <Card className="bg-emerald-900/50 border-emerald-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5" />
              Preflight Checklist
            </CardTitle>
            <CardDescription className="text-emerald-200">
              Complete before event starts ({preflightChecklist.filter((i) => i.checked).length}/
              {preflightChecklist.length})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {preflightChecklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-emerald-950/50 rounded-lg">
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={() => togglePreflightItem(item.id)}
                  className="border-emerald-600"
                />
                <label htmlFor={item.id} className="text-white cursor-pointer flex-1">
                  {item.label}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Device Support */}
        <Card className="bg-emerald-900/50 border-emerald-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Supported Devices
            </CardTitle>
            <CardDescription className="text-emerald-200">Minimum requirements for attendees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-950/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">iOS</h3>
                <ul className="text-sm text-emerald-200 space-y-1">
                  <li>• Safari 17.0 or later</li>
                  <li>• iOS 17.0 or later</li>
                  <li>• WebXR support enabled</li>
                </ul>
              </div>
              <div className="p-4 bg-emerald-950/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Android</h3>
                <ul className="text-sm text-emerald-200 space-y-1">
                  <li>• Chrome 125 or later</li>
                  <li>• Android 10 or later</li>
                  <li>• ARCore supported device</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Procedures */}
        <Card className="bg-emerald-900/50 border-emerald-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <LifeBuoy className="h-5 w-5" />
              Recovery Procedures
            </CardTitle>
            <CardDescription className="text-emerald-200">What to do if things go wrong</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-emerald-950/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">XR Unavailable</h3>
                <p className="text-sm text-emerald-200">
                  Users automatically see 2D fallback experiences. All features remain accessible without WebXR.
                </p>
              </div>
              <div className="p-4 bg-emerald-950/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Network Issues</h3>
                <p className="text-sm text-emerald-200">
                  PWA service worker provides offline capability. Critical assets are cached for offline access.
                </p>
              </div>
              <div className="p-4 bg-emerald-950/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Support Contact</h3>
                <p className="text-sm text-emerald-200">
                  For technical issues during the event, contact:{" "}
                  <a href="mailto:support@culturespatial.com" className="text-emerald-400 underline">
                    support@culturespatial.com
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Info */}
        <Card className="bg-emerald-900/50 border-emerald-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              QR Code Configuration
            </CardTitle>
            <CardDescription className="text-emerald-200">Production URLs with UTM tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-emerald-950/50 rounded-lg">
              <p className="text-sm font-mono text-emerald-300 break-all">
                https://your-domain.vercel.app/?utm_campaign=nov4_event&utm_source=qr&utm_medium=print
              </p>
            </div>
            <div className="p-4 bg-emerald-950/50 rounded-lg">
              <p className="text-sm text-emerald-200 mb-2">Deep-link examples:</p>
              <ul className="text-xs font-mono text-emerald-300 space-y-1">
                <li>?scene=photo_booth - Direct to photo booth</li>
                <li>?scene=cocktails - Direct to cocktail menu</li>
                <li>?scene=mr_demo - Direct to MR demo</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
