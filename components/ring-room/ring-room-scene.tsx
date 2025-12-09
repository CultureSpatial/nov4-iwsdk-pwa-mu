"use client"

import { Suspense, useState, useMemo, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, Html } from "@react-three/drei"
import { RingModel } from "./ring-model"
import { RingDetailPanel } from "./ring-detail-panel"
import { ShortlistTray } from "./shortlist-tray"
import { RING_CATALOG, createShortlistManager } from "@/lib/ring-data"
import { useSyncExternalStore } from "react"

// Create singleton shortlist manager
const shortlistManager = createShortlistManager()

function useShortlist() {
  return useSyncExternalStore(shortlistManager.subscribe, shortlistManager.getItems, shortlistManager.getItems)
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

export function RingRoomScene() {
  const [selectedRingId, setSelectedRingId] = useState<string | null>(null)
  const [isDraggingAny, setIsDraggingAny] = useState(false)
  const [showAddedFeedback, setShowAddedFeedback] = useState<string | null>(null)
  const shortlistItems = useShortlist()

  const selectedRing = useMemo(() => RING_CATALOG.find((r) => r.id === selectedRingId), [selectedRingId])

  const isInShortlist = useCallback(
    (ringId: string) => shortlistItems.some((item) => item.ring.id === ringId),
    [shortlistItems],
  )

  const handleDragToShortlist = useCallback(
    (ring: (typeof RING_CATALOG)[0]) => {
      if (!isInShortlist(ring.id)) {
        shortlistManager.add(ring)
        setShowAddedFeedback(ring.id)
        setTimeout(() => setShowAddedFeedback(null), 1500)
      }
    },
    [isInShortlist],
  )

  // Position rings in a semi-circle
  const ringPositions: [number, number, number][] = [
    [-1.2, 0, 0],
    [0, 0, -0.5],
    [1.2, 0, 0],
  ]

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* 3D Canvas */}
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={0.5} />
        <pointLight position={[0, 3, 0]} intensity={0.3} color="#fff5e6" />

        {/* Environment for reflections */}
        <Environment preset="studio" />

        <Suspense fallback={<LoadingFallback />}>
          {/* Ring models */}
          {RING_CATALOG.map((ring, index) => (
            <RingModel
              key={ring.id}
              ring={ring}
              position={ringPositions[index]}
              isSelected={selectedRingId === ring.id}
              onSelect={() => setSelectedRingId(selectedRingId === ring.id ? null : ring.id)}
              onDragToShortlist={() => handleDragToShortlist(ring)}
            />
          ))}

          {/* Display surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.4} />
          </mesh>

          {/* Drop zone indicator */}
          <DropZoneIndicator isActive={isDraggingAny} />

          {/* Contact shadows */}
          <ContactShadows position={[0, -0.14, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>

        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* UI Overlays */}
      {selectedRing && (
        <RingDetailPanel
          ring={selectedRing}
          onClose={() => setSelectedRingId(null)}
          onAddToShortlist={() => {
            if (isInShortlist(selectedRing.id)) {
              shortlistManager.remove(selectedRing.id)
            } else {
              shortlistManager.add(selectedRing)
            }
          }}
          isInShortlist={isInShortlist(selectedRing.id)}
        />
      )}

      <ShortlistTray
        items={shortlistItems}
        onRemove={(ringId) => shortlistManager.remove(ringId)}
        onSelectRing={(ringId) => setSelectedRingId(ringId)}
      />

      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-white">Ring Room</h1>
        <p className="text-sm text-white/70">Tap a ring to view details | Drag down to shortlist</p>
      </div>

      {/* Added to shortlist feedback */}
      {showAddedFeedback && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl text-lg font-semibold animate-pulse shadow-lg">
            Added to Shortlist!
          </div>
        </div>
      )}

      {/* Instructions overlay for first-time users */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-black/50 text-white/80 px-4 py-2 rounded-full text-sm">
          Orbit: drag background | Zoom: pinch or scroll
        </div>
      </div>
    </div>
  )
}
