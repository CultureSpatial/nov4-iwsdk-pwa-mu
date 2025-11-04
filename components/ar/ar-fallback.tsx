"use client"

import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface ARFallbackProps {
  children: ReactNode
  feature: string
}

export function ARFallback({ children, feature }: ARFallbackProps) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <Card className="bg-amber-900/90 border-amber-700 p-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-100 font-medium">AR Mode Unavailable</p>
              <p className="text-xs text-amber-200 mt-1">
                Your device doesn't support WebXR. Showing 2D experience instead.
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="pt-20">{children}</div>
    </div>
  )
}
