"use client"

import { Suspense, useState, useMemo, useCallback, useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Html,
  AdaptiveDpr,
  Text,
} from "@react-three/drei"
import { RingModel } from "./ring-model"
import { RingDetailPanel } from "./ring-detail-panel"
import { ShortlistTray } from "./shortlist-tray"
import { PerformanceMonitor } from "./performance-monitor"
import { XRButton } from "./xr-button"
import { RING_CATALOG } from "@/lib/ring-data"
import { shortlistManager } from "@/lib/shortlist-manager"
import { Analytics } from "@/lib/analytics"
import { useSyncExternalStore } from "react"

function useShortlist() {
  return useSyncExternalStore(
    shortlistManager.subscribe.bind(shortlistManager),
    shortlistManager.getAll.bind(shortlistManager),
    shortlistManager.getAll.bind(shortlistManager),
  )
}

function useQuestDetection() {
  const [isQuest, setIsQuest] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    const isQuestBrowser = ua.includes("quest") || ua.includes("oculus")
    setIsQuest(isQuestBrowser)
  }, [])

  return isQuest
}

function DropZoneIndicator({ isActive }: { isActive: boolean }) {
  if (!isActive) return null

  return (
    <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4, 0.8]} />
      <meshBasicMaterial color="#10B981" transparent opacity={0.3} />
    </mesh>
  )
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-white text-lg">Loading rings...</div>
    </Html>
  )
}

function GoldTestBox() {
  const meshRef = useRef<any>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // 0.5 RPM = 0.5/60 rotations per second = PI/60 radians per second
      meshRef.current.rotation.y += (Math.PI / 60) * (1 / 60) * 2
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, 1.2, -0.25]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          emissive="#FFD700"
          emissiveIntensity={0.3}
        />
      </mesh>
      <Text position={[0, 1.6, -0.25]} fontSize={0.08} color="#FFD700" anchorX="center">
        Phase 1: IWSDK Test
      </Text>
    </group>
  )
}

export function RingRoomScene() {
  const [selectedRingId, setSelectedRingId] = useState<string | null>(null)
  const [isDraggingAny, setIsDraggingAny] = useState(false)
  const [showAddedFeedback, setShowAddedFeedback] = useState<string | null>(null)
  const [showPerf, setShowPerf] = useState(false)
  const [qualityLevel, setQualityLevel] = useState<"high" | "medium" | "low">("high")
  const shortlistItems = useShortlist()
  const isQuest = useQuestDetection()

  useEffect(() => {
    shortlistManager.hydrate(RING_CATALOG)
    Analytics.sessionStart("url")

    return () => {
      Analytics.sessionEnd()
    }
  }, [])

  const quality = isQuest ? "medium" : qualityLevel

  const selectedRing = useMemo(() => RING_CATALOG.find((r) => r.id === selectedRingId), [selectedRingId])

  const isInShortlist = useCallback((ringId: string) => shortlistManager.has(ringId), [shortlistItems])

  const handleDragToShortlist = useCallback((ring: (typeof RING_CATALOG)[0]) => {
    const added = shortlistManager.add(ring, "drag")
    if (added) {
      setShowAddedFeedback(ring.id)
      setTimeout(() => setShowAddedFeedback(null), 1500)
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(100)
      }
    }
  }, [])

  const handleRingSelect = useCallback(
    (ringId: string) => {
      const ring = RING_CATALOG.find((r) => r.id === ringId)
      if (ring) {
        Analytics.ringSelected(ringId, ring.name, "click")
      }
      setSelectedRingId(selectedRingId === ringId ? null : ringId)
    },
    [selectedRingId],
  )

  const handleNavigate = useCallback((ringId: string) => {
    setSelectedRingId(ringId)
  }, [])

  const handlePerformanceDegraded = useCallback((level: "medium" | "low") => {
    setQualityLevel(level)
  }, [])

  const handleEnterXR = useCallback((session: XRSession) => {
    console.log("[v0] XR session requested but temporarily disabled")
  }, [])

  const handleExitXR = useCallback(() => {
    console.log("[v0] XR exit requested")
  }, [])

  const ringPositions: [number, number, number][] = [
    [-1.2, 0, 0],
    [0, 0, -0.5],
    [1.2, 0, 0],
  ]

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {!isQuest && (
        <div className="absolute top-20 left-4 z-10 bg-blue-500/20 text-blue-200 px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
          Desktop Mode: Use mouse to orbit and zoom
        </div>
      )}

      <Canvas
        gl={{
          antialias: quality !== "low",
          powerPreference: "high-performance",
          alpha: false,
        }}
        dpr={isQuest ? 1 : [1, 2]}
      >
        <AdaptiveDpr pixelated />

        <PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={50} />

        <ambientLight intensity={quality === "low" ? 0.6 : 0.4} />
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} castShadow={quality === "high"} />
        {quality !== "low" && <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={0.5} />}
        {quality === "high" && <pointLight position={[0, 3, 0]} intensity={0.3} color="#fff5e6" />}

        <Environment preset={quality === "low" ? "apartment" : "studio"} />

        <Suspense fallback={<LoadingFallback />}>
          <GoldTestBox />

          {RING_CATALOG.map((ring, index) => (
            <RingModel
              key={ring.id}
              ring={ring}
              position={ringPositions[index]}
              isSelected={selectedRingId === ring.id}
              onSelect={() => handleRingSelect(ring.id)}
              onDragToShortlist={() => handleDragToShortlist(ring)}
              quality={quality}
            />
          ))}

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow={quality === "high"}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.4} />
          </mesh>

          <DropZoneIndicator isActive={isDraggingAny} />

          {quality === "high" && <ContactShadows position={[0, -0.14, 0]} opacity={0.5} scale={10} blur={2} far={4} />}
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
          enableDamping={quality !== "low"}
        />
      </Canvas>

      {selectedRing && (
        <RingDetailPanel
          ring={selectedRing}
          onClose={() => setSelectedRingId(null)}
          onAddToShortlist={() => {
            shortlistManager.toggle(selectedRing.id, selectedRing, "button")
          }}
          isInShortlist={isInShortlist(selectedRing.id)}
          onNavigate={handleNavigate}
        />
      )}

      <ShortlistTray
        items={shortlistItems}
        onRemove={(ringId) => shortlistManager.remove(ringId)}
        onSelectRing={(ringId) => setSelectedRingId(ringId)}
        onClear={() => shortlistManager.clear()}
      />

      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-white">Ring Room</h1>
        <p className="text-sm text-white/70">Tap a ring to view details | Drag down to shortlist</p>
        {isQuest && <p className="text-xs text-emerald-400 mt-1">Quest Mode: Optimized Performance</p>}
        {qualityLevel !== "high" && !isQuest && (
          <p className="text-xs text-yellow-400 mt-1">
            Performance Mode: {qualityLevel === "medium" ? "Reduced" : "Low"} Quality
          </p>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        <XRButton onEnterXR={handleEnterXR} onExitXR={handleExitXR} autoStartOnQuest={false} />
        <button
          onClick={() => setShowPerf(!showPerf)}
          className="text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          {showPerf ? "Hide" : "Show"} FPS
        </button>
        {showPerf && <PerformanceMonitor enabled showDetails onPerformanceDegraded={handlePerformanceDegraded} />}
      </div>

      {showAddedFeedback && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl text-lg font-semibold animate-pulse shadow-lg">
            Added to Shortlist!
          </div>
        </div>
      )}

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-black/50 text-white/80 px-4 py-2 rounded-full text-sm">
          Orbit: drag background | Zoom: pinch or scroll | Keyboard: Esc to close, arrows to navigate
        </div>
      </div>
    </div>
  )
}
