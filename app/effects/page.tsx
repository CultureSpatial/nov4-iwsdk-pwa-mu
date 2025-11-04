"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sparkles, ImageIcon, User, Wine, Camera, Zap, CheckCircle2, Circle, AlertCircle } from "lucide-react"

type EffectStatus = "completed" | "in-progress" | "planned" | "blocked"

interface Effect {
  id: string
  name: string
  description: string
  priority: number
  status: EffectStatus
  icon: any
  demoUrl?: string
  notes?: string
}

export default function EffectsPage() {
  const [effects] = useState<Effect[]>([
    {
      id: "bubble-effect",
      name: "Bubble Effect",
      description: "Floating emerald bubbles with physics and glow",
      priority: 1,
      status: "completed",
      icon: Sparkles,
      demoUrl: "/effects/bubbles",
    },
    {
      id: "emerald-glow",
      name: "Emerald Glow Entry Overlay",
      description: "Animated glow effect when entering AR experiences",
      priority: 1,
      status: "completed",
      icon: Zap,
      demoUrl: "/effects/glow",
    },
    {
      id: "glinda-avatar",
      name: "Glinda Avatar Rig",
      description: "Greeting animation with Glinda character",
      priority: 2,
      status: "planned",
      icon: User,
      notes: "Requires 3D model asset",
    },
    {
      id: "drink-cards",
      name: "Drink Menu Scan Cards",
      description: "5 Wicked-themed cocktail cards with AR interactions",
      priority: 2,
      status: "in-progress",
      icon: Wine,
      demoUrl: "/ar/cocktails",
    },
    {
      id: "photo-frame",
      name: "Photo Moment AR Frame",
      description: "Emerald City themed AR frame for photo booth",
      priority: 2,
      status: "completed",
      icon: Camera,
      demoUrl: "/ar/photo-booth",
    },
    {
      id: "qr-generation",
      name: "QR Code Generation",
      description: "Generate QR codes with UTM tracking for all experiences",
      priority: 3,
      status: "completed",
      icon: ImageIcon,
      demoUrl: "/qr-codes",
    },
  ])

  const getStatusIcon = (status: EffectStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case "in-progress":
        return <Circle className="h-5 w-5 text-yellow-500 animate-pulse" />
      case "planned":
        return <Circle className="h-5 w-5 text-gray-400" />
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusBadge = (status: EffectStatus) => {
    const variants: Record<EffectStatus, string> = {
      completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      "in-progress": "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      planned: "bg-gray-500/20 text-gray-300 border-gray-500/50",
      blocked: "bg-red-500/20 text-red-300 border-red-500/50",
    }
    return (
      <Badge className={variants[status]} variant="outline">
        {status.replace("-", " ")}
      </Badge>
    )
  }

  const completedCount = effects.filter((e) => e.status === "completed").length
  const totalCount = effects.length
  const progressPercent = (completedCount / totalCount) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-balance">Effects & Assets Tracker</h1>
          <p className="text-emerald-200 text-balance">
            Visual effects and assets for the Nov 4 Cultural Hospitality AR Pilot
          </p>
        </div>

        <Card className="bg-emerald-900/50 border-emerald-700">
          <CardHeader>
            <CardTitle className="text-white">Overall Progress</CardTitle>
            <CardDescription className="text-emerald-200">
              {completedCount} of {totalCount} effects completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercent} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">
                  {effects.filter((e) => e.status === "completed").length}
                </div>
                <div className="text-sm text-emerald-200">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {effects.filter((e) => e.status === "in-progress").length}
                </div>
                <div className="text-sm text-emerald-200">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400">
                  {effects.filter((e) => e.status === "planned").length}
                </div>
                <div className="text-sm text-emerald-200">Planned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {effects.filter((e) => e.status === "blocked").length}
                </div>
                <div className="text-sm text-emerald-200">Blocked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Effects List</h2>
          <div className="grid gap-4">
            {effects
              .sort((a, b) => a.priority - b.priority)
              .map((effect) => {
                const Icon = effect.icon
                return (
                  <Card key={effect.id} className="bg-emerald-900/30 border-emerald-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(effect.status)}
                          <Icon className="h-6 w-6 text-emerald-400" />
                          <div>
                            <CardTitle className="text-white">{effect.name}</CardTitle>
                            <CardDescription className="text-emerald-200">{effect.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-emerald-600 text-emerald-300">
                            P{effect.priority}
                          </Badge>
                          {getStatusBadge(effect.status)}
                        </div>
                      </div>
                    </CardHeader>
                    {(effect.demoUrl || effect.notes) && (
                      <CardContent className="flex items-center justify-between">
                        {effect.notes && <p className="text-sm text-emerald-300 italic">{effect.notes}</p>}
                        {effect.demoUrl && (
                          <Button
                            asChild
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={effect.status === "planned"}
                          >
                            <a href={effect.demoUrl}>View Demo</a>
                          </Button>
                        )}
                      </CardContent>
                    )}
                  </Card>
                )
              })}
          </div>
        </div>

        <Card className="bg-emerald-900/30 border-emerald-700">
          <CardHeader>
            <CardTitle className="text-white">8th Wall Integration Plan</CardTitle>
            <CardDescription className="text-emerald-200">iOS WebXR fallback strategy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-emerald-100">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Why 8th Wall?</h3>
              <p className="text-sm">
                WebXR is not supported on iOS Safari. 8th Wall provides a WebAR solution that works across iOS and
                Android without requiring app installation.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Implementation Steps:</h3>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Create 8th Wall account and project</li>
                <li>Integrate 8th Wall SDK into Next.js app</li>
                <li>Detect iOS devices and route to 8th Wall experiences</li>
                <li>Maintain feature parity between WebXR and 8th Wall versions</li>
                <li>Test on iOS Safari 17+ and Android Chrome 125+</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Status:</h3>
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                Planned - Requires 8th Wall License
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
