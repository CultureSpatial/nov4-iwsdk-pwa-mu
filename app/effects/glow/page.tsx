"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GlowDemo() {
  const [showGlow, setShowGlow] = useState(false)

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Emerald Glow Overlay */}
      {showGlow && (
        <div className="absolute inset-0 z-20 pointer-events-none animate-fade-in">
          <div className="absolute inset-0 bg-gradient-radial from-emerald-500/40 via-emerald-600/20 to-transparent animate-pulse-slow" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-emerald-400/10 to-emerald-900/30 animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/30 rounded-full blur-3xl animate-pulse" />
        </div>
      )}

      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900 to-black" />

      {/* Controls */}
      <div className="absolute top-4 left-4 z-30">
        <Button asChild variant="outline" className="bg-emerald-900/80 border-emerald-600 text-white">
          <Link href="/effects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Effects
          </Link>
        </Button>
      </div>

      {/* Demo content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white text-balance">Emerald Glow Entry Overlay</h1>
            <p className="text-xl text-emerald-200 text-balance">Animated glow effect for AR experience transitions</p>
          </div>

          <Button
            size="lg"
            onClick={() => {
              setShowGlow(true)
              setTimeout(() => setShowGlow(false), 3000)
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg"
          >
            Trigger Glow Effect
          </Button>

          <div className="text-sm text-emerald-300 space-y-2">
            <p>Click the button to see the entry overlay animation</p>
            <p className="text-xs text-emerald-400">Effect duration: 3 seconds</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}
