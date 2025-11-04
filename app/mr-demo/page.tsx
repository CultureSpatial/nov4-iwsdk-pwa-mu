"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MRDemoScene } from "@/components/ar/mr-demo-scene"
import { trackEvent } from "@/lib/analytics"
import { Play, Hand, Maximize2, RotateCw, Move } from "lucide-react"

export default function MRDemoPage() {
  const [isActive, setIsActive] = useState(false)
  const [controls, setControls] = useState({
    move: true,
    rotate: true,
    scale: true,
    physics: false,
  })

  const startDemo = () => {
    setIsActive(true)
    trackEvent("mr_demo_started", { timestamp: new Date().toISOString() })
  }

  const toggleControl = (control: keyof typeof controls) => {
    setControls((prev) => ({ ...prev, [control]: !prev[control] }))
    trackEvent("mr_demo_control_toggled", { control, enabled: !controls[control] })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {!isActive ? (
        <div className="flex items-center justify-center min-h-screen p-6">
          <Card className="max-w-2xl w-full p-8 bg-slate-800/50 border-purple-500/20">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Hand className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">MR Demo Experience</h1>
                <p className="text-purple-200">Interactive spatial plane with hand tracking and touch controls</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <Move className="w-6 h-6 text-emerald-400 mb-2" />
                  <div className="text-sm font-semibold text-white">Move</div>
                  <div className="text-xs text-slate-300">Drag to reposition</div>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <RotateCw className="w-6 h-6 text-purple-400 mb-2" />
                  <div className="text-sm font-semibold text-white">Rotate</div>
                  <div className="text-xs text-slate-300">Two-finger twist</div>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <Maximize2 className="w-6 h-6 text-blue-400 mb-2" />
                  <div className="text-sm font-semibold text-white">Scale</div>
                  <div className="text-xs text-slate-300">Pinch to resize</div>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <Hand className="w-6 h-6 text-pink-400 mb-2" />
                  <div className="text-sm font-semibold text-white">Hand Track</div>
                  <div className="text-xs text-slate-300">Use hand gestures</div>
                </div>
              </div>

              <Button onClick={startDemo} size="lg" className="w-full">
                <Play className="w-5 h-5 mr-2" />
                Start MR Demo
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="relative w-full h-screen">
          <MRDemoScene controls={controls} />

          {/* Control Panel */}
          <div className="absolute top-4 right-4 space-y-2">
            <Badge className="bg-emerald-500 text-white">MR Demo Active</Badge>
            <Card className="p-4 bg-slate-800/90 border-purple-500/20 space-y-2">
              <div className="text-sm font-semibold text-white mb-2">Controls</div>
              {Object.entries(controls).map(([key, enabled]) => (
                <Button
                  key={key}
                  onClick={() => toggleControl(key as keyof typeof controls)}
                  variant={enabled ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Button>
              ))}
            </Card>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Card className="px-6 py-3 bg-slate-800/90 border-purple-500/20">
              <p className="text-sm text-white">
                <span className="font-semibold">Touch:</span> Drag to move • Pinch to scale • Two fingers to rotate
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
