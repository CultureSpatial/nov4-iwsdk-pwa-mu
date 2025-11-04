"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { IWSDKManager } from "@/lib/iwsdk-manager"
import { UniversalARManager } from "@/lib/universal-ar"
import { trackEvent } from "@/lib/analytics"

export function IWSDKARScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isARActive, setIsARActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeSDKs = async () => {
      try {
        // Initialize IWSDK
        const iwsdk = IWSDKManager.getInstance()
        await iwsdk.initialize({
          enableInput: true,
          enablePhysics: true,
          enableLocomotion: true,
        })

        // Initialize Universal AR
        const universalAR = UniversalARManager.getInstance()
        await universalAR.initialize({
          imageTargets: [],
          faceTracking: false,
          instantTracking: true,
        })

        setIsReady(true)
        trackEvent("iwsdk_initialized", { timestamp: new Date().toISOString() })
      } catch (err) {
        console.error("[v0] SDK initialization failed:", err)
        setError("Failed to initialize AR systems")
      }
    }

    initializeSDKs()
  }, [])

  const startARExperience = async () => {
    try {
      console.log("[v0] Starting integrated AR experience")

      const iwsdk = IWSDKManager.getInstance()
      iwsdk.enableHandTracking()
      iwsdk.enablePhysics()

      const universalAR = UniversalARManager.getInstance()
      await universalAR.startInstantTracking()

      setIsARActive(true)
      trackEvent("ar_experience_started", {
        timestamp: new Date().toISOString(),
        mode: "instant_tracking",
      })
    } catch (err) {
      console.error("[v0] Failed to start AR:", err)
      setError("Failed to start AR experience")
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.6, 3]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* AR Content */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </Canvas>

      {/* UI Overlay */}
      {!isARActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center space-y-4">
            {error ? (
              <div className="text-red-500 text-lg">{error}</div>
            ) : !isReady ? (
              <div className="text-white text-lg">Initializing AR systems...</div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">IWSDK + Universal AR</h2>
                <p className="text-gray-300">Ready to start AR experience</p>
                <button
                  onClick={startARExperience}
                  className="px-8 py-4 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Start AR Experience
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* AR Active Indicator */}
      {isARActive && (
        <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold">
          AR Active
        </div>
      )}
    </div>
  )
}
