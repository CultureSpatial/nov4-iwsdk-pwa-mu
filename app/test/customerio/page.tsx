"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function CustomerIOTestPage() {
  const [userId, setUserId] = useState("test-user-" + Date.now())
  const [email, setEmail] = useState("test@example.com")
  const [name, setName] = useState("Test User")
  const [eventName, setEventName] = useState("photo_captured")
  const [eventProperties, setEventProperties] = useState('{"filter": "emerald_glow"}')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Array<{ type: string; success: boolean; message: string }>>([])

  const testIdentify = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "identify",
          userId,
          traits: { name, email },
        }),
      })

      const data = await response.json()
      setResults((prev) => [
        ...prev,
        {
          type: "identify",
          success: response.ok,
          message: response.ok ? "User identified successfully" : data.error || "Failed to identify user",
        },
      ])
    } catch (error) {
      setResults((prev) => [
        ...prev,
        {
          type: "identify",
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const testTrackEvent = async () => {
    setLoading(true)
    try {
      let properties = {}
      try {
        properties = JSON.parse(eventProperties)
      } catch {
        properties = { raw: eventProperties }
      }

      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "track",
          userId,
          event: eventName,
          properties,
        }),
      })

      const data = await response.json()
      setResults((prev) => [
        ...prev,
        {
          type: "track",
          success: response.ok,
          message: response.ok ? `Event "${eventName}" tracked successfully` : data.error || "Failed to track event",
        },
      ])
    } catch (error) {
      setResults((prev) => [
        ...prev,
        {
          type: "track",
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const testFullFlow = async () => {
    setResults([])
    await testIdentify()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await testTrackEvent()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-emerald-400">Customer.io Webhook Test</h1>
          <p className="text-emerald-200">Test the webhook integration with Customer.io CDP API</p>
        </div>

        <Card className="bg-emerald-950/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-emerald-400">User Identification</CardTitle>
            <CardDescription className="text-emerald-300">
              Send user data to Customer.io via /api/track webhook
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-emerald-200">
                User ID
              </Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="bg-emerald-900/50 border-emerald-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-emerald-200">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-emerald-900/50 border-emerald-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-emerald-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-emerald-900/50 border-emerald-700 text-white"
              />
            </div>
            <Button onClick={testIdentify} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Test Identify
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-emerald-950/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-emerald-400">Event Tracking</CardTitle>
            <CardDescription className="text-emerald-300">Send custom events to Customer.io</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventName" className="text-emerald-200">
                Event Name
              </Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="bg-emerald-900/50 border-emerald-700 text-white"
                placeholder="photo_captured"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventProperties" className="text-emerald-200">
                Event Properties (JSON)
              </Label>
              <Textarea
                id="eventProperties"
                value={eventProperties}
                onChange={(e) => setEventProperties(e.target.value)}
                className="bg-emerald-900/50 border-emerald-700 text-white font-mono text-sm"
                rows={4}
                placeholder='{"filter": "emerald_glow", "timestamp": 1234567890}'
              />
            </div>
            <Button onClick={testTrackEvent} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Test Track Event
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-emerald-950/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-emerald-400">Full Flow Test</CardTitle>
            <CardDescription className="text-emerald-300">Test identify + track event in sequence</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={testFullFlow}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            >
              Run Full Test
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card className="bg-emerald-950/50 border-emerald-800">
            <CardHeader>
              <CardTitle className="text-emerald-400">Test Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-emerald-900/30 border border-emerald-800"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={result.success ? "default" : "destructive"}
                      className={result.success ? "bg-emerald-600" : ""}
                    >
                      {result.type}
                    </Badge>
                    <span className="text-emerald-200">{result.message}</span>
                  </div>
                  <span className="text-2xl">{result.success ? "✓" : "✗"}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="bg-emerald-950/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-emerald-400">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between text-emerald-200">
              <span>Webhook Endpoint:</span>
              <code className="text-emerald-400">/api/track</code>
            </div>
            <div className="flex justify-between text-emerald-200">
              <span>Customer.io Site ID:</span>
              <code className="text-emerald-400">{process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID || "Not configured"}</code>
            </div>
            <div className="flex justify-between text-emerald-200">
              <span>API Key Status:</span>
              <Badge variant={process.env.CUSTOMERIO_API_KEY ? "default" : "destructive"}>
                {process.env.CUSTOMERIO_API_KEY ? "Configured" : "Missing"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
