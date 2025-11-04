"use client"

import { useEffect, useState } from "react"

interface EmeraldGlowOverlayProps {
  show: boolean
  duration?: number
  onComplete?: () => void
}

export function EmeraldGlowOverlay({ show, duration = 2000, onComplete }: EmeraldGlowOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none animate-fade-in">
      <div className="absolute inset-0 bg-gradient-radial from-emerald-500/40 via-emerald-600/20 to-transparent animate-pulse-slow" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-emerald-400/10 to-emerald-900/30 animate-spin-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/30 rounded-full blur-3xl animate-pulse" />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
