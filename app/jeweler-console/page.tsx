"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Users,
  Activity,
  Clock,
  Eye,
  Hand,
  Heart,
  Pause,
  Square,
  FileText,
  Sparkles,
  Lock,
  Gem,
  TrendingUp,
  MessageSquare,
} from "lucide-react"

// Mock session data
const SESSION_ID = "RR-2024-0612-A7X9"

const PARTICIPANTS = [
  { id: 1, name: "Sarah M.", role: "Primary Shopper", status: "active", avatar: "SM" },
  { id: 2, name: "James M.", role: "Partner", status: "active", avatar: "JM" },
  { id: 3, name: "David Chen", role: "Jeweler (Host)", status: "hosting", avatar: "DC" },
]

const INITIAL_ACTIVITY = [
  { id: 1, time: "14:32:15", event: "Session started", type: "system" },
  { id: 2, time: "14:32:45", event: "Sarah M. joined from Quest 3", type: "join" },
  { id: 3, time: "14:33:02", event: "James M. joined from Quest 3", type: "join" },
  { id: 4, time: "14:33:18", event: "Consultation mode: Discovery", type: "mode" },
  { id: 5, time: "14:34:22", event: "Sarah viewed Tiffany Solitaire", type: "view" },
  { id: 6, time: "14:35:01", event: "Virtual try-on: Tiffany Solitaire", type: "tryon" },
  { id: 7, time: "14:36:15", event: "Added to shortlist: Tiffany Solitaire", type: "shortlist" },
  { id: 8, time: "14:37:42", event: "Sarah viewed Cartier Love Ring", type: "view" },
  { id: 9, time: "14:38:30", event: "Virtual try-on: Cartier Love Ring", type: "tryon" },
]

const SKU_ENGAGEMENT = [
  {
    sku: "TIF-SOL-2CT",
    name: "Tiffany Solitaire 2ct",
    views: 12,
    tryOns: 4,
    dwellTime: 145,
    shortlisted: true,
    engagement: 85,
  },
  {
    sku: "CAR-LOVE-PT",
    name: "Cartier Love Ring Platinum",
    views: 8,
    tryOns: 3,
    dwellTime: 98,
    shortlisted: true,
    engagement: 72,
  },
  {
    sku: "HW-ROUND-1.5",
    name: "Harry Winston Round 1.5ct",
    views: 6,
    tryOns: 2,
    dwellTime: 67,
    shortlisted: false,
    engagement: 58,
  },
  {
    sku: "VCA-ALH-DIA",
    name: "Van Cleef Alhambra Diamond",
    views: 4,
    tryOns: 1,
    dwellTime: 34,
    shortlisted: false,
    engagement: 35,
  },
  {
    sku: "BVL-SERP-RG",
    name: "Bulgari Serpenti Rose Gold",
    views: 2,
    tryOns: 0,
    dwellTime: 12,
    shortlisted: false,
    engagement: 15,
  },
]

const CONSULTATION_MODES = [
  { id: "discovery", label: "Discovery", description: "Open browsing, full catalog access" },
  { id: "shortlist", label: "Shortlist Review", description: "Focus on saved items" },
  { id: "decision", label: "Decision", description: "Side-by-side comparison mode" },
]

export default function JewelerConsolePage() {
  const [sessionTime, setSessionTime] = useState(387) // 6:27 in seconds
  const [activeMode, setActiveMode] = useState("discovery")
  const [activity, setActivity] = useState(INITIAL_ACTIVITY)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-update session timer
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isPaused])

  // Simulate live activity feed
  useEffect(() => {
    if (isPaused) return
    const activities = [
      "Sarah zoomed in on ring details",
      "James requested side view",
      "Sarah compared two rings",
      "Virtual lighting adjusted",
      "Sarah captured screenshot",
      "James asked about pricing",
    ]
    const interval = setInterval(() => {
      const newEvent = {
        id: Date.now(),
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        event: activities[Math.floor(Math.random() * activities.length)],
        type: "interaction",
      }
      setActivity((prev) => [...prev.slice(-8), newEvent])
    }, 8000)
    return () => clearInterval(interval)
  }, [isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "view":
        return <Eye className="h-3 w-3" />
      case "tryon":
        return <Hand className="h-3 w-3" />
      case "shortlist":
        return <Heart className="h-3 w-3" />
      case "join":
        return <Users className="h-3 w-3" />
      case "mode":
        return <Sparkles className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500"
      case "hosting":
        return "bg-purple-500"
      case "idle":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
        {/* Header */}
        <header className="border-b border-purple-900/30 bg-[#0f0f18]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Gem className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-semibold text-white">Ring Room</span>
              </div>
              <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300">
                Control Plane
              </Badge>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Session:</span>
                <code className="rounded bg-purple-500/20 px-2 py-1 font-mono text-purple-300">{SESSION_ID}</code>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isPaused ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}`} />
                <span className="text-sm text-gray-400">{isPaused ? "Paused" : "Live"}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-transparent border-b border-purple-900/30 rounded-none h-auto p-0 gap-6">
                <TabsTrigger
                  value="overview"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-1 pb-3 text-gray-400 data-[state=active]:text-purple-300"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-1 pb-3 text-gray-400 data-[state=active]:text-purple-300"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-1 pb-3 text-gray-400 data-[state=active]:text-purple-300"
                >
                  Inventory
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none px-1 pb-3 text-gray-400 data-[state=active]:text-purple-300"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Participants & Activity */}
            <div className="col-span-3 space-y-6">
              {/* Participants Card */}
              <Card className="border-purple-900/30 bg-[#0f0f18]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-white">
                    <Users className="h-4 w-4 text-purple-400" />
                    Participants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {PARTICIPANTS.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 text-sm font-medium text-purple-300">
                          {p.avatar}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0f0f18] ${getStatusColor(p.status)}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.role}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Live Activity Feed */}
              <Card className="border-purple-900/30 bg-[#0f0f18]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-white">
                    <Activity className="h-4 w-4 text-purple-400" />
                    Live Activity
                    <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[280px] pr-4">
                    <div className="space-y-2">
                      {activity.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-2 text-xs animate-in fade-in slide-in-from-top-1 duration-300"
                        >
                          <span className="text-gray-600 font-mono shrink-0">{item.time}</span>
                          <span className="text-purple-400 shrink-0">{getEventIcon(item.type)}</span>
                          <span className="text-gray-400">{item.event}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Center Column - Stats & SKU Engagement */}
            <div className="col-span-6 space-y-6">
              {/* Session Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="border-purple-900/30 bg-[#0f0f18]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Clock className="h-3 w-3" />
                      Duration
                    </div>
                    <p className="text-2xl font-semibold text-white font-mono">{formatTime(sessionTime)}</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-900/30 bg-[#0f0f18]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Eye className="h-3 w-3" />
                      Items Viewed
                    </div>
                    <p className="text-2xl font-semibold text-white">32</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-900/30 bg-[#0f0f18]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Hand className="h-3 w-3" />
                      Try-Ons
                    </div>
                    <p className="text-2xl font-semibold text-white">10</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-900/30 bg-[#0f0f18]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Heart className="h-3 w-3" />
                      Shortlisted
                    </div>
                    <p className="text-2xl font-semibold text-white">2</p>
                  </CardContent>
                </Card>
              </div>

              {/* SKU Engagement Board */}
              <Card className="border-purple-900/30 bg-[#0f0f18]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    SKU Engagement
                  </CardTitle>
                  <CardDescription className="text-gray-500">Real-time product interaction metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {SKU_ENGAGEMENT.map((item) => (
                      <div key={item.sku} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{item.name}</span>
                            {item.shortlisted && <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {item.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hand className="h-3 w-3" /> {item.tryOns}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {item.dwellTime}s
                            </span>
                          </div>
                        </div>
                        <Progress value={item.engagement} className="h-2 bg-purple-900/30" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Controls */}
            <div className="col-span-3 space-y-6">
              {/* Consultation Mode */}
              <Card className="border-purple-900/30 bg-[#0f0f18]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-white">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    Consultation Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {CONSULTATION_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setActiveMode(mode.id)}
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        activeMode === mode.id
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-purple-900/30 bg-transparent hover:border-purple-500/50"
                      }`}
                    >
                      <p className={`text-sm font-medium ${activeMode === mode.id ? "text-purple-300" : "text-white"}`}>
                        {mode.label}
                      </p>
                      <p className="text-xs text-gray-500">{mode.description}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Merchandising Controls (Phase 2) */}
              <Card className="border-purple-900/30 bg-[#0f0f18] opacity-60">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-white">
                    <Gem className="h-4 w-4 text-gray-500" />
                    Merchandising
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="ml-auto border-gray-700 text-gray-500 text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Phase 2
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#1a1a24] border-purple-900/30 text-gray-300">
                        Coming in Phase 2: Push featured items, adjust pricing display, and more.
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-800 bg-transparent text-gray-600"
                    disabled
                  >
                    Push Featured Item
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-800 bg-transparent text-gray-600"
                    disabled
                  >
                    Adjust Lighting
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-800 bg-transparent text-gray-600"
                    disabled
                  >
                    Show Price Comparison
                  </Button>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="border-purple-900/30 bg-[#0f0f18]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white">Session Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Trigger Summary
                  </Button>
                  <Button
                    variant="outline"
                    className={`w-full border-purple-900/50 ${isPaused ? "bg-amber-500/20 text-amber-300 border-amber-500/50" : "bg-transparent text-gray-300 hover:text-white"}`}
                    onClick={() => setIsPaused(!isPaused)}
                  >
                    {isPaused ? <Activity className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                    {isPaused ? "Resume Session" : "Pause Session"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-900/50 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    End & Export
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 border-t border-purple-900/30 bg-[#0a0a0f]/95 backdrop-blur px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Ring Room Control Plane v0.7</span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Voice channel active
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>Quest 3 Connected (2)</span>
              <span className="text-gray-700">|</span>
              <span>
                WebSocket: <span className="text-emerald-500">Connected</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
