"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IWSDKManager } from "@/lib/iwsdk-manager"
import { UniversalARManager } from "@/lib/universal-ar"
import { trackEvent } from "@/lib/analytics"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "running" | "passed" | "failed"
  message?: string
  duration?: number
}

export default function IWSDKTestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "IWSDK Runtime Initialization", status: "pending" },
    { name: "Universal AR SDK Initialization", status: "pending" },
    { name: "Hand Tracking System", status: "pending" },
    { name: "Controller Input System", status: "pending" },
    { name: "Physics Engine", status: "pending" },
    { name: "Locomotion System", status: "pending" },
    { name: "Instant Tracking", status: "pending" },
    { name: "Image Target Tracking", status: "pending" },
    { name: "Integration Test: IWSDK + Universal AR", status: "pending" },
  ])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests((prev) => prev.map((test, idx) => (idx === index ? { ...test, ...updates } : test)))
  }

  const runTests = async () => {
    setIsRunning(true)
    trackEvent("iwsdk_test_suite_started", { timestamp: new Date().toISOString() })

    // Test 1: IWSDK Runtime Initialization
    updateTest(0, { status: "running" })
    const startTime0 = Date.now()
    try {
      const iwsdk = IWSDKManager.getInstance()
      await iwsdk.initialize({
        enableInput: true,
        enablePhysics: true,
        enableLocomotion: true,
      })
      updateTest(0, {
        status: "passed",
        message: "IWSDK runtime initialized successfully",
        duration: Date.now() - startTime0,
      })
    } catch (error) {
      updateTest(0, {
        status: "failed",
        message: `Failed: ${error}`,
        duration: Date.now() - startTime0,
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 2: Universal AR SDK Initialization
    updateTest(1, { status: "running" })
    const startTime1 = Date.now()
    try {
      const universalAR = UniversalARManager.getInstance()
      await universalAR.initialize({
        imageTargets: [],
        faceTracking: false,
        instantTracking: true,
      })
      updateTest(1, {
        status: "passed",
        message: "Universal AR SDK initialized successfully",
        duration: Date.now() - startTime1,
      })
    } catch (error) {
      updateTest(1, {
        status: "failed",
        message: `Failed: ${error}`,
        duration: Date.now() - startTime1,
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 3: Hand Tracking System
    updateTest(2, { status: "running" })
    const startTime2 = Date.now()
    try {
      const iwsdk = IWSDKManager.getInstance()
      iwsdk.enableHandTracking()
      updateTest(2, {
        status: "passed",
        message: "Hand tracking enabled",
        duration: Date.now() - startTime2,
      })
    } catch (error) {
      updateTest(2, {
        status: "failed",
        message: `Failed: ${error}`,
        duration: Date.now() - startTime2,
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 4: Controller Input System
    updateTest(3, { status: "running" })
    const startTime3 = Date.now()
    try {
      const iwsdk = IWSDKManager.getInstance()
      iwsdk.enableControllerInput()
      updateTest(3, {
        status: "passed",
        message: "Controller input enabled",
        duration: Date.now() - startTime3,
      })
    } catch (error) {
      updateTest(3, {
        status: "failed",
        message: `Failed: ${error}`,
        duration: Date.now() - startTime3,
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 5: Physics Engine
    updateTest(4, { status: "running" })
    const startTime4 = Date.now()
    try {
      const iwsdk = IWSDKManager.getInstance()
      iwsdk.enablePhysics()
      updateTest(4, {
        status: "passed",
        message: "Physics engine enabled",
        duration: Date.now() - startTime4,
      })
    } catch (error) {
      updateTest(4, {
        status: "failed",
        message: `Failed: ${error}`,
        duration: Date.now() - startTime4,
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 6: Locomotion System
    updateTest(5, { status: "running" })
    const startTime5 = Date.now()
    try {
      const iwsdk = IWSDKManager.getInstance()
      iwsdk.enableTeleportation()
      updateTest(5, {
        status: "passed",
        message: "Locomotion system enabled",
        duration: Date.now() - startTime5,
      })
    } catch (error) {
      updateTest(5, {
        status: "failed",
        message: `Failed: ${error}`,
        duration: Date.now() - startTime5,
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 7: Instant Tracking
    updateTest(6, { status: "running" })
    const startTime6 = Date.now()
    try {
      const universalAR = UniversalARManager.getInstance()
      await universalAR.startInstantTracking()
      updateTest(6, {
        status: "passed",
        message: "Instant tracking started",
        duration: Date.now() - startTime6,
      })
    } catch (error) {
      updateTest(6, {
        status: "failed",
        message: `Failed: ${error}`,
        duration: Date.now() - startTime6,
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 8: Image Target Tracking
    updateTest(7, { status: "running" })
    const startTime7 = Date.now()
    try {
      const universalAR = UniversalARManager.getInstance()
      await universalAR.startImageTracking()
      updateTest(7, {
        status: "passed",
        message: "Image tracking started",
        duration: Date.now() - startTime7,
      })
    } catch (error) {
      updateTest(7, {
        status: "failed",
        message: `Failed: ${error}`,
        duration: Date.now() - startTime7,
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 9: Integration Test
    updateTest(8, { status: "running" })
    const startTime8 = Date.now()
    try {
      const iwsdk = IWSDKManager.getInstance()
      const universalAR = UniversalARManager.getInstance()

      if (iwsdk.isInitialized() && universalAR.isInitialized()) {
        updateTest(8, {
          status: "passed",
          message: "IWSDK and Universal AR integration verified",
          duration: Date.now() - startTime8,
        })
      } else {
        throw new Error("One or more systems not initialized")
      }
    } catch (error) {
      updateTest(8, {
        status: "failed",
        message: `Failed: ${error}`,
        duration: Date.now() - startTime8,
      })
    }

    setIsRunning(false)
    trackEvent("iwsdk_test_suite_completed", {
      timestamp: new Date().toISOString(),
      results: tests.map((t) => ({ name: t.name, status: t.status })),
    })
  }

  const passedTests = tests.filter((t) => t.status === "passed").length
  const failedTests = tests.filter((t) => t.status === "failed").length
  const totalTests = tests.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">IWSDK Integration Test Suite</h1>
            <p className="text-blue-200">Validate IWSDK + Universal AR integration</p>
          </div>
          <Button onClick={runTests} disabled={isRunning} size="lg">
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              "Run All Tests"
            )}
          </Button>
        </div>

        <Card className="p-6 bg-slate-800/50 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div>
                <div className="text-sm text-slate-400">Total Tests</div>
                <div className="text-2xl font-bold text-white">{totalTests}</div>
              </div>
              <div>
                <div className="text-sm text-emerald-400">Passed</div>
                <div className="text-2xl font-bold text-emerald-400">{passedTests}</div>
              </div>
              <div>
                <div className="text-sm text-red-400">Failed</div>
                <div className="text-2xl font-bold text-red-400">{failedTests}</div>
              </div>
            </div>
            <Badge variant={failedTests === 0 && passedTests === totalTests ? "default" : "secondary"}>
              {failedTests === 0 && passedTests === totalTests ? "All Tests Passed" : "In Progress"}
            </Badge>
          </div>
        </Card>

        <div className="space-y-3">
          {tests.map((test, idx) => (
            <Card key={idx} className="p-4 bg-slate-800/50 border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {test.status === "pending" && (
                    <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 text-xs font-semibold">
                      {idx + 1}
                    </div>
                  )}
                  {test.status === "running" && <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />}
                  {test.status === "passed" && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                  {test.status === "failed" && <XCircle className="w-6 h-6 text-red-400" />}
                  <div>
                    <div className="font-semibold text-white">{test.name}</div>
                    {test.message && (
                      <div
                        className={`text-sm ${
                          test.status === "passed"
                            ? "text-emerald-300"
                            : test.status === "failed"
                              ? "text-red-300"
                              : "text-slate-400"
                        }`}
                      >
                        {test.message}
                      </div>
                    )}
                  </div>
                </div>
                {test.duration && <div className="text-sm text-slate-400">{test.duration}ms</div>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
