"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  GitBranch,
  GitCommit,
  Loader2,
  RefreshCw,
  Zap,
  Upload,
  AlertTriangle,
  Bell,
  Settings,
  Github,
  XCircle,
} from "lucide-react"

type Phase = "scaffolding" | "transmutation" | "stabilization"
type Status = "healthy" | "warning" | "critical" | "offline"

interface Agent {
  id: string
  name: string
  description: string
  status: Status
  lastExecution: Date
  avgExecutionTime: number
  errorCount: number
}

interface AssetPipeline {
  id: string
  name: string
  step: string
  progress: number
  status: Status
  estimatedCompletion?: Date
}

interface APIMetric {
  endpoint: string
  latency: number
  errorRate: number
  uptime: number
  throughput: number
}

interface EventLog {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error"
  source: string
  message: string
}

interface GitHubSync {
  commitHash: string
  branch: string
  commitTime: Date
  syncStatus: "success" | "in-progress" | "failed"
  pendingChanges: number
}

export default function TransmutationDashboard() {
  const [currentPhase, setCurrentPhase] = useState<Phase>("transmutation")
  const [phaseProgress, setPhaseProgress] = useState(65)
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Asset Converter",
      description: "Converts Three.js assets to Horizon gizmos",
      status: "healthy",
      lastExecution: new Date(Date.now() - 120000),
      avgExecutionTime: 2.3,
      errorCount: 0,
    },
    {
      id: "2",
      name: "Video Pipeline",
      description: "Tavus.io video processing and optimization",
      status: "healthy",
      lastExecution: new Date(Date.now() - 60000),
      avgExecutionTime: 5.8,
      errorCount: 0,
    },
    {
      id: "3",
      name: "TypeScript Transmuter",
      description: "React → Horizon TypeScript code generation",
      status: "warning",
      lastExecution: new Date(Date.now() - 300000),
      avgExecutionTime: 8.2,
      errorCount: 2,
    },
    {
      id: "4",
      name: "Analytics Sync",
      description: "Customer.io event pipeline synchronization",
      status: "healthy",
      lastExecution: new Date(Date.now() - 30000),
      avgExecutionTime: 1.1,
      errorCount: 0,
    },
  ])

  const [assetPipelines, setAssetPipelines] = useState<AssetPipeline[]>([
    {
      id: "1",
      name: "Cocktail Menu GLB",
      step: "Texture Optimization",
      progress: 75,
      status: "healthy",
      estimatedCompletion: new Date(Date.now() + 600000),
    },
    {
      id: "2",
      name: "Photo Booth Frames",
      step: "Asset Library Import",
      progress: 100,
      status: "healthy",
    },
    {
      id: "3",
      name: "Emerald Glow Particles",
      step: "Gizmo Configuration",
      progress: 45,
      status: "warning",
      estimatedCompletion: new Date(Date.now() + 1200000),
    },
  ])

  const [apiMetrics, setApiMetrics] = useState<APIMetric[]>([
    { endpoint: "/api/track", latency: 42, errorRate: 0.1, uptime: 99.9, throughput: 1250 },
    { endpoint: "/api/health", latency: 18, errorRate: 0, uptime: 100, throughput: 850 },
    { endpoint: "/api/version", latency: 12, errorRate: 0, uptime: 100, throughput: 420 },
  ])

  const [eventLogs, setEventLogs] = useState<EventLog[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 120000),
      level: "info",
      source: "Asset Converter",
      message: "Successfully converted cocktail-menu.glb to Horizon format",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 90000),
      level: "warning",
      source: "TypeScript Transmuter",
      message: "Type mismatch detected in AR scene component - manual review required",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 60000),
      level: "info",
      source: "GitHub Sync",
      message: "Commit f322fdb successfully synced to Horizon workspace",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 30000),
      level: "error",
      source: "Video Pipeline",
      message: "Tavus.io API rate limit approaching - throttling enabled",
    },
  ])

  const [githubSync, setGithubSync] = useState<GitHubSync>({
    commitHash: "f322fdb",
    branch: "ops",
    commitTime: new Date(Date.now() - 3600000),
    syncStatus: "success",
    pendingChanges: 0,
  })

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "healthy":
        return "text-emerald-400"
      case "warning":
        return "text-yellow-400"
      case "critical":
        return "text-red-400"
      case "offline":
        return "text-gray-400"
    }
  }

  const getStatusBadge = (status: Status) => {
    const variants = {
      healthy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
      warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      critical: "bg-red-500/20 text-red-400 border-red-500/50",
      offline: "bg-gray-500/20 text-gray-400 border-gray-500/50",
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const handleForceSync = () => {
    setGithubSync((prev) => ({ ...prev, syncStatus: "in-progress" }))
    setTimeout(() => {
      setGithubSync((prev) => ({ ...prev, syncStatus: "success", commitTime: new Date() }))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Transmutation Dashboard</h1>
            <p className="text-emerald-200">Real-time monitoring for PWA → Meta Horizon transformation</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="bg-emerald-900/50 border-emerald-700">
              <Bell className="h-5 w-5 text-emerald-400" />
            </Button>
            <Button variant="outline" size="icon" className="bg-emerald-900/50 border-emerald-700">
              <Settings className="h-5 w-5 text-emerald-400" />
            </Button>
          </div>
        </div>

        {/* Overall Project Status */}
        <Card className="bg-slate-900/50 border-emerald-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              Overall Project Status
            </CardTitle>
            <CardDescription className="text-emerald-200">
              Current Phase: <span className="font-bold text-emerald-400 uppercase">{currentPhase}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-emerald-200 mb-2">
                <span>Phase Progress</span>
                <span>{phaseProgress}%</span>
              </div>
              <Progress value={phaseProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-700/30">
                <div className="text-2xl font-bold text-white">
                  {agents.filter((a) => a.status === "healthy").length}/{agents.length}
                </div>
                <div className="text-sm text-emerald-200">Active Agents</div>
              </div>
              <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-700/30">
                <div className="text-2xl font-bold text-white">{assetPipelines.length}</div>
                <div className="text-sm text-emerald-200">Asset Pipelines</div>
              </div>
              <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-700/30">
                <div className="text-2xl font-bold text-white">
                  {apiMetrics.reduce((sum, m) => sum + m.throughput, 0)}
                </div>
                <div className="text-sm text-emerald-200">API Req/min</div>
              </div>
              <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-700/30">
                <div className="text-2xl font-bold text-white">{githubSync.pendingChanges}</div>
                <div className="text-sm text-emerald-200">Pending Changes</div>
              </div>
              <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-700/30">
                <div className="text-2xl font-bold text-white">Dec 15</div>
                <div className="text-sm text-emerald-200">Target Launch</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="agents" className="space-y-4">
          <TabsList className="bg-slate-900/50 border border-emerald-700/30">
            <TabsTrigger value="agents">Autonomous Agents</TabsTrigger>
            <TabsTrigger value="assets">Asset Pipeline</TabsTrigger>
            <TabsTrigger value="api">API Health</TabsTrigger>
            <TabsTrigger value="github">Version Control</TabsTrigger>
            <TabsTrigger value="logs">Event Logs</TabsTrigger>
          </TabsList>

          {/* Autonomous Agents */}
          <TabsContent value="agents" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {agents.map((agent) => (
                <Card key={agent.id} className="bg-slate-900/50 border-emerald-700/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                        <CardDescription className="text-emerald-200">{agent.description}</CardDescription>
                      </div>
                      {getStatusBadge(agent.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200">Last Execution:</span>
                      <span className="text-white">{formatTimeAgo(agent.lastExecution)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200">Avg Execution:</span>
                      <span className="text-white">{agent.avgExecutionTime}s</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200">Error Count:</span>
                      <span className={agent.errorCount > 0 ? "text-red-400" : "text-emerald-400"}>
                        {agent.errorCount}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-emerald-700 text-emerald-400 bg-transparent"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Asset Pipeline */}
          <TabsContent value="assets" className="space-y-4">
            {assetPipelines.map((pipeline) => (
              <Card key={pipeline.id} className="bg-slate-900/50 border-emerald-700/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{pipeline.name}</CardTitle>
                      <CardDescription className="text-emerald-200">Current Step: {pipeline.step}</CardDescription>
                    </div>
                    {getStatusBadge(pipeline.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-emerald-200 mb-2">
                      <span>Progress</span>
                      <span>{pipeline.progress}%</span>
                    </div>
                    <Progress value={pipeline.progress} className="h-2" />
                  </div>
                  {pipeline.estimatedCompletion && (
                    <div className="flex items-center gap-2 text-sm text-emerald-200">
                      <Clock className="h-4 w-4" />
                      <span>Est. Completion: {formatTimeAgo(pipeline.estimatedCompletion)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* API Health */}
          <TabsContent value="api" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {apiMetrics.map((metric, idx) => (
                <Card key={idx} className="bg-slate-900/50 border-emerald-700/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{metric.endpoint}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200">Latency:</span>
                      <span className="text-white font-mono">{metric.latency}ms</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200">Error Rate:</span>
                      <span className={metric.errorRate > 1 ? "text-red-400" : "text-emerald-400"}>
                        {metric.errorRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200">Uptime:</span>
                      <span className="text-emerald-400">{metric.uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-200">Throughput:</span>
                      <span className="text-white font-mono">{metric.throughput}/min</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* GitHub Version Control Sync */}
          <TabsContent value="github" className="space-y-4">
            <Card className="bg-slate-900/50 border-emerald-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Github className="h-5 w-5 text-emerald-400" />
                  GitHub Integration Status
                </CardTitle>
                <CardDescription className="text-emerald-200">
                  Synchronization between GitHub repository and Horizon Desktop Editor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-700/30">
                    <div className="flex items-center gap-2 text-emerald-200 text-sm mb-2">
                      <GitCommit className="h-4 w-4" />
                      Latest Commit
                    </div>
                    <div className="text-xl font-mono text-white">{githubSync.commitHash}</div>
                    <div className="text-sm text-emerald-200 mt-1">{formatTimeAgo(githubSync.commitTime)}</div>
                  </div>
                  <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-700/30">
                    <div className="flex items-center gap-2 text-emerald-200 text-sm mb-2">
                      <GitBranch className="h-4 w-4" />
                      Branch
                    </div>
                    <div className="text-xl font-mono text-white">{githubSync.branch}</div>
                  </div>
                  <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-700/30">
                    <div className="flex items-center gap-2 text-emerald-200 text-sm mb-2">
                      <Activity className="h-4 w-4" />
                      Sync Status
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {githubSync.syncStatus === "success" && (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Synced</span>
                        </>
                      )}
                      {githubSync.syncStatus === "in-progress" && (
                        <>
                          <Loader2 className="h-5 w-5 text-yellow-400 animate-spin" />
                          <span className="text-yellow-400 font-semibold">Syncing...</span>
                        </>
                      )}
                      {githubSync.syncStatus === "failed" && (
                        <>
                          <XCircle className="h-5 w-5 text-red-400" />
                          <span className="text-red-400 font-semibold">Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleForceSync}
                    disabled={githubSync.syncStatus === "in-progress"}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Force Sync
                  </Button>
                  <Button variant="outline" className="border-emerald-700 text-emerald-400 bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    View Pending Changes
                  </Button>
                </div>

                {githubSync.pendingChanges > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">{githubSync.pendingChanges} pending changes</span>
                    </div>
                    <p className="text-sm text-yellow-200 mt-2">
                      Changes detected in repository but not yet synced to Horizon workspace
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Logs */}
          <TabsContent value="logs" className="space-y-4">
            <Card className="bg-slate-900/50 border-emerald-700/30">
              <CardHeader>
                <CardTitle className="text-white">Event Log & Error Alerts Console</CardTitle>
                <CardDescription className="text-emerald-200">
                  Real-time system events and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {eventLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg border ${
                        log.level === "error"
                          ? "bg-red-500/10 border-red-500/30"
                          : log.level === "warning"
                            ? "bg-yellow-500/10 border-yellow-500/30"
                            : "bg-emerald-500/10 border-emerald-500/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {log.level === "error" && <AlertCircle className="h-5 w-5 text-red-400" />}
                          {log.level === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                          {log.level === "info" && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white text-sm">{log.source}</span>
                            <span className="text-xs text-emerald-200">{formatTimeAgo(log.timestamp)}</span>
                          </div>
                          <p className="text-sm text-emerald-100">{log.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Gaps and Anomaly Detector */}
        <Card className="bg-slate-900/50 border-yellow-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Gaps & Anomaly Detector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-yellow-400">Asset Import Delay Detected</div>
                  <p className="text-sm text-yellow-200 mt-1">
                    12-minute lag between Git commit and asset import for Emerald Glow Particles
                  </p>
                  <Button variant="link" className="text-yellow-400 p-0 h-auto mt-2">
                    Create Task →
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
