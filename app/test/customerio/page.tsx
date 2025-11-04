"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function CustomerIOTestPage() {
  const [identifyData, setIdentifyData] = useState({
    userId: "test_user_" + Date.now(),
    name: "Test User",
    email: "test@example.com",
  })

  const [trackData, setTrackData] = useState({
    userId: "test_user_" + Date.now(),
    event: "test_event",
    properties: '{"source": "test_page", "value": 100}',
  })

  const [identifyStatus, setIdentifyStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [trackStatus, setTrackStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [identifyError, setIdentifyError] = useState("")
  const [trackError, setTrackError] = useState("")

  const handleIdentify = async () => {
    setIdentifyStatus("loading")
    setIdentifyError("")

    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "identify",
          userId: identifyData.userId,
          traits: {
            name: identifyData.name,
            email: identifyData.email,
          },
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to identify user")
      }

      setIdentifyStatus("success")
      setTimeout(() => setIdentifyStatus("idle"), 3000)
    } catch (error) {
      setIdentifyStatus("error")
      setIdentifyError(error instanceof Error ? error.message : "Unknown error")
    }
  }

  const handleTrack = async () => {
    setTrackStatus("loading")
    setTrackError("")

    try {
      let properties = {}
      try {
        properties = JSON.parse(trackData.properties)
      } catch {
        throw new Error("Invalid JSON in properties field")
      }

      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "track",
          userId: trackData.userId,
          event: trackData.event,
          properties,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to track event")
      }

      setTrackStatus("success")
      setTimeout(() => setTrackStatus("idle"), 3000)
    } catch (error) {
      setTrackStatus("error")
      setTrackError(error instanceof Error ? error.message : "Unknown error")
    }
  }

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "loading") return <Loader2 className="h-4 w-4 animate-spin" />
    if (status === "success") return <CheckCircle2 className="h-4 w-4 text-green-500" />
    if (status === "error") return <XCircle className="h-4 w-4 text-red-500" />
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-black p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-400">Customer.io Integration Test</h1>
          <p className="mt-2 text-emerald-200">Test identify and track events</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Identify Test */}
          <Card className="border-emerald-800 bg-emerald-950/50">
            <CardHeader>
              <CardTitle className="text-emerald-400">Identify User</CardTitle>
              <CardDescription className="text-emerald-200">
                Send user identification data to Customer.io
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-emerald-300">
                  User ID
                </Label>
                <Input
                  id="userId"
                  value={identifyData.userId}
                  onChange={(e) => setIdentifyData({ ...identifyData, userId: e.target.value })}
                  className="border-emerald-700 bg-emerald-900/50 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-emerald-300">
                  Name
                </Label>
                <Input
                  id="name"
                  value={identifyData.name}
                  onChange={(e) => setIdentifyData({ ...identifyData, name: e.target.value })}
                  className="border-emerald-700 bg-emerald-900/50 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-emerald-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={identifyData.email}
                  onChange={(e) => setIdentifyData({ ...identifyData, email: e.target.value })}
                  className="border-emerald-700 bg-emerald-900/50 text-white"
                />
              </div>

              <Button
                onClick={handleIdentify}
                disabled={identifyStatus === "loading"}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {identifyStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Identify"
                )}
              </Button>

              {identifyStatus !== "idle" && (
                <div className="flex items-center gap-2 rounded-md border border-emerald-700 bg-emerald-900/30 p-3">
                  <StatusIcon status={identifyStatus} />
                  <span className="text-sm text-emerald-200">
                    {identifyStatus === "loading" && "Sending..."}
                    {identifyStatus === "success" && "User identified successfully!"}
                    {identifyStatus === "error" && `Error: ${identifyError}`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Track Event Test */}
          <Card className="border-emerald-800 bg-emerald-950/50">
            <CardHeader>
              <CardTitle className="text-emerald-400">Track Event</CardTitle>
              <CardDescription className="text-emerald-200">Send custom event data to Customer.io</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackUserId" className="text-emerald-300">
                  User ID
                </Label>
                <Input
                  id="trackUserId"
                  value={trackData.userId}
                  onChange={(e) => setTrackData({ ...trackData, userId: e.target.value })}
                  className="border-emerald-700 bg-emerald-900/50 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event" className="text-emerald-300">
                  Event Name
                </Label>
                <Input
                  id="event"
                  value={trackData.event}
                  onChange={(e) => setTrackData({ ...trackData, event: e.target.value })}
                  className="border-emerald-700 bg-emerald-900/50 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="properties" className="text-emerald-300">
                  Properties (JSON)
                </Label>
                <Textarea
                  id="properties"
                  value={trackData.properties}
                  onChange={(e) => setTrackData({ ...trackData, properties: e.target.value })}
                  className="border-emerald-700 bg-emerald-900/50 font-mono text-sm text-white"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleTrack}
                disabled={trackStatus === "loading"}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {trackStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Event"
                )}
              </Button>

              {trackStatus !== "idle" && (
                <div className="flex items-center gap-2 rounded-md border border-emerald-700 bg-emerald-900/30 p-3">
                  <StatusIcon status={trackStatus} />
                  <span className="text-sm text-emerald-200">
                    {trackStatus === "loading" && "Sending..."}
                    {trackStatus === "success" && "Event tracked successfully!"}
                    {trackStatus === "error" && `Error: ${trackError}`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-800 bg-emerald-950/50">
          <CardHeader>
            <CardTitle className="text-emerald-400">Configuration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-emerald-200">
              <div className="flex items-center justify-between">
                <span>Site ID:</span>
                <span className="font-mono">
                  {process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID ? "✓ Configured" : "✗ Missing"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>API Key:</span>
                <span className="font-mono">Server-side only</span>
              </div>
              <div className="mt-4 rounded-md border border-emerald-700 bg-emerald-900/30 p-3">
                <p className="text-xs">
                  Add NEXT_PUBLIC_CUSTOMERIO_SITE_ID and CUSTOMERIO_API_KEY in the Vars section to enable tracking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
