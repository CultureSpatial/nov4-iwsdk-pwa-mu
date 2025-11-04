"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"

export function UniversalARScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isARSupported, setIsARSupported] = useState(false)
  const [isARActive, setIsARActive] = useState(false)

  useEffect(() => {
    const checkARSupport = async () => {
      try {
        if (typeof navigator !== "undefined" && "xr" in navigator) {
          const supported = await navigator.xr?.isSessionSupported("immersive-ar")
          setIsARSupported(supported || false)
        }
      } catch (error) {
        console.log("[v0] XR check failed (likely permissions policy):", error)
        setIsARSupported(false)
      }
    }
    checkARSupport()
  }, [])

  const startAR = async () => {
    try {
      // Universal AR initialization will go here
      console.log("[v0] Starting Universal AR session")
      setIsARActive(true)
    } catch (error) {
      console.error("[v0] Failed to start AR:", error)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Placeholder 3D content */}
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      </Canvas>

      {!isARActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <button
            onClick={startAR}
            disabled={!isARSupported}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
          >
            {isARSupported ? "Start AR Experience" : "AR Not Supported"}
          </button>
        </div>
      )}
    </div>
  )
}
