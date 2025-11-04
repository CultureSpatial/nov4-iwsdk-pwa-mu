"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { IWSDKManager } from "@/lib/iwsdk-manager"
import { UniversalARManager } from "@/lib/universal-ar"
import { trackEvent } from "@/lib/analytics"
import { Play, Pause, SkipForward, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react"

const DEMO_SCRIPT = [
  {
    id: "intro",
    title: "Introduction",
    duration: 180,
    description: "Welcome and context setting, Universal AR SDK + Zapbox overview",
    actions: ["Welcome audience", "Brief overview", "Safety instructions"],
  },
  {
    id: "content-creation",
    title: "Content Creation Demo",
    duration: 300,
    description: "Live content creation using Scenario.com and Ghost CMS approval",
    actions: ["Show Scenario.com", "Ghost CMS approval", "Universal AR anchor placement"],
  },
  {
    id: "mr-experience",
    title: "MR Experience",
    duration: 480,
    description: "Zapbox headset demo with spatial interactions",
    actions: ["Don Zapbox headset", "Load AR content", "Demonstrate interactions", "Audience Q&A"],
  },
  {
    id: "wrap-up",
    title: "Wrap-up",
    duration: 120,
    description: "Key takeaways and follow-up information",
    actions: ["Key takeaways", "Technical specs", "Contact information"],
  },
]

export default function PresenterDashboard() {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [systemStatus, setSystemStatus] = useState({
    iwsdk: false,
    universalAR: false,
    handTracking: false,
    physics: false,
  })
  const [checklist, setChecklist] = useState({
    equipment: false,
    wifi: false,
    content: false,
    casting: false,
    seating: false,
    team: false,
  })

  useEffect(() => {
    initializeSystems()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const initializeSystems = async () => {
    try {
      const iwsdk = IWSDKManager.getInstance()
      await iwsdk.initialize({
        enableInput: true,
        enablePhysics: true,
        enableLocomotion: true,
      })
      setSystemStatus((prev) => ({ ...prev, iwsdk: true }))

      const universalAR = UniversalARManager.getInstance()
      await universalAR.initialize({
        imageTargets: [],
        faceTracking: false,
        instantTracking: true,
      })
      setSystemStatus((prev) => ({ ...prev, universalAR: true }))

      trackEvent("presenter_dashboard_initialized", { timestamp: new Date().toISOString() })
    } catch (error) {
      console.error("[v0] Failed to initialize systems:", error)
    }
  }

  const startDemo = () => {
    setIsRunning(true)
    setElapsedTime(0)
    setCurrentPhase(0)
    trackEvent("demo_started", { timestamp: new Date().toISOString() })
  }

  const pauseDemo = () => {
    setIsRunning(false)
    trackEvent("demo_paused", { phase: DEMO_SCRIPT[currentPhase].id, elapsed: elapsedTime })
  }

  const nextPhase = () => {
    if (currentPhase < DEMO_SCRIPT.length - 1) {
      setCurrentPhase((prev) => prev + 1)
      trackEvent("demo_phase_advanced", {
        from: DEMO_SCRIPT[currentPhase].id,
        to: DEMO_SCRIPT[currentPhase + 1].id,
      })
    }
  }

  const resetDemo = () => {
    setIsRunning(false)
    setElapsedTime(0)
    setCurrentPhase(0)
    trackEvent("demo_reset", { timestamp: new Date().toISOString() })
  }

  const enableHandTracking = () => {
    const iwsdk = IWSDKManager.getInstance()
    iwsdk.enableHandTracking()
    setSystemStatus((prev) => ({ ...prev, handTracking: true }))
    trackEvent("hand_tracking_enabled", { timestamp: new Date().toISOString() })
  }

  const enablePhysics = () => {
    const iwsdk = IWSDKManager.getInstance()
    iwsdk.enablePhysics()
    setSystemStatus((prev) => ({ ...prev, physics: true }))
    trackEvent("physics_enabled", { timestamp: new Date().toISOString() })
  }

  const toggleChecklistItem = (item: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  const currentScript = DEMO_SCRIPT[currentPhase]
  const totalDuration = DEMO_SCRIPT.reduce((sum, phase) => sum + phase.duration, 0)
  const progress = (elapsedTime / totalDuration) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">MR Demo Presenter Dashboard</h1>
            <p className="text-purple-200">Nov 4 Event - Universal AR + Zapbox</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={systemStatus.iwsdk ? "default" : "secondary"}>
              IWSDK {systemStatus.iwsdk ? "Ready" : "Offline"}
            </Badge>
            <Badge variant={systemStatus.universalAR ? "default" : "secondary"}>
              Universal AR {systemStatus.universalAR ? "Ready" : "Offline"}
            </Badge>
          </div>
        </div>

        {/* Pre-Demo Checklist */}
        <Card className="p-6 bg-slate-800/50 border-purple-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Pre-Demo Checklist (30 min before)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(checklist).map(([key, checked]) => (
              <button
                key={key}
                onClick={() => toggleChecklistItem(key as keyof typeof checklist)}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  checked ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700/50 text-slate-300"
                }`}
              >
                {checked ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Demo Controls */}
        <Card className="p-6 bg-slate-800/50 border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Demo Controls</h2>
            <div className="text-2xl font-mono text-purple-300">
              {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, "0")} /{" "}
              {Math.floor(totalDuration / 60)}:00
            </div>
          </div>

          <Progress value={progress} className="mb-4" />

          <div className="flex gap-3">
            {!isRunning ? (
              <Button onClick={startDemo} className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Start Demo
              </Button>
            ) : (
              <Button onClick={pauseDemo} variant="secondary" className="flex-1">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={nextPhase} variant="outline" disabled={currentPhase >= DEMO_SCRIPT.length - 1}>
              <SkipForward className="w-4 h-4 mr-2" />
              Next Phase
            </Button>
            <Button onClick={resetDemo} variant="destructive">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </Card>

        {/* Current Phase */}
        <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-slate-800/50 border-purple-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className="mb-2">
                Phase {currentPhase + 1} of {DEMO_SCRIPT.length}
              </Badge>
              <h2 className="text-2xl font-bold text-white">{currentScript.title}</h2>
              <p className="text-purple-200 mt-1">{currentScript.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-300">Duration</div>
              <div className="text-xl font-semibold text-white">{Math.floor(currentScript.duration / 60)} min</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-purple-300 uppercase">Actions</h3>
            {currentScript.actions.map((action, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                {action}
              </div>
            ))}
          </div>
        </Card>

        {/* IWSDK Controls */}
        <Card className="p-6 bg-slate-800/50 border-purple-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">IWSDK Features</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={enableHandTracking}
              variant={systemStatus.handTracking ? "default" : "outline"}
              disabled={systemStatus.handTracking}
            >
              {systemStatus.handTracking ? "Hand Tracking Active" : "Enable Hand Tracking"}
            </Button>
            <Button
              onClick={enablePhysics}
              variant={systemStatus.physics ? "default" : "outline"}
              disabled={systemStatus.physics}
            >
              {systemStatus.physics ? "Physics Active" : "Enable Physics"}
            </Button>
          </div>
        </Card>

        {/* All Phases Overview */}
        <Card className="p-6 bg-slate-800/50 border-purple-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Demo Timeline</h2>
          <div className="space-y-3">
            {DEMO_SCRIPT.map((phase, idx) => (
              <div
                key={phase.id}
                className={`p-4 rounded-lg transition-all ${
                  idx === currentPhase
                    ? "bg-purple-500/20 border-2 border-purple-500"
                    : idx < currentPhase
                      ? "bg-emerald-500/10 border border-emerald-500/30"
                      : "bg-slate-700/30 border border-slate-600/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        idx === currentPhase
                          ? "bg-purple-500 text-white"
                          : idx < currentPhase
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-600 text-slate-300"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{phase.title}</div>
                      <div className="text-sm text-slate-300">{phase.description}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">{Math.floor(phase.duration / 60)} min</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
