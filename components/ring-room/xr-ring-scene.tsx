"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Text } from "@react-three/drei"
import { RingModel } from "./ring-model"
import { RING_CATALOG, createShortlistManager } from "@/lib/ring-data"
import { useSyncExternalStore } from "react"

// Singleton shortlist manager
const shortlistManager = createShortlistManager()

function useShortlist() {
  return useSyncExternalStore(shortlistManager.subscribe, shortlistManager.getItems, shortlistManager.getItems)
}

// XR-specific ring positioning (in front of user)
function XRRingDisplay() {
  const [selectedRingId, setSelectedRingId] = useState<string | null>(null)
  const shortlistItems = useShortlist()

  // Position rings in an arc in front of user at standing height
  const ringPositions: [number, number, number][] = [
    [-0.4, 1.2, -0.8],
    [0, 1.3, -1],
    [0.4, 1.2, -0.8],
  ]

  const isInShortlist = useCallback(
    (ringId: string) => shortlistItems.some((item) => item.ring.id === ringId),
    [shortlistItems],
  )

  return (
    <>
      {/* Display platform */}
      <mesh position={[0, 0.8, -0.9]} rotation={[-Math.PI / 6, 0, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.6]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rings */}
      {RING_CATALOG.map((ring, index) => (
        <RingModel
          key={ring.id}
          ring={ring}
          position={ringPositions[index]}
          isSelected={selectedRingId === ring.id}
          onSelect={() => setSelectedRingId(selectedRingId === ring.id ? null : ring.id)}
          onDragToShortlist={() => {
            if (!isInShortlist(ring.id)) {
              shortlistManager.add(ring)
            }
          }}
        />
      ))}

      {/* Shortlist display (floating panel to the side) */}
      {shortlistItems.length > 0 && (
        <group position={[0.8, 1.4, -0.6]} rotation={[0, -0.3, 0]}>
          <mesh>
            <planeGeometry args={[0.4, 0.3]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </mesh>
          <Text position={[0, 0.1, 0.01]} fontSize={0.04} color="#10B981" anchorX="center">
            Shortlist
          </Text>
          <Text position={[0, 0, 0.01]} fontSize={0.06} color="#ffffff" anchorX="center">
            {shortlistItems.length} {shortlistItems.length === 1 ? "ring" : "rings"}
          </Text>
          <Text position={[0, -0.08, 0.01]} fontSize={0.03} color="#ffffff" anchorX="center">
            ${shortlistItems.reduce((sum, item) => sum + item.ring.price, 0).toLocaleString()}
          </Text>
        </group>
      )}

      {/* Instructions */}
      <Text position={[0, 1.6, -1]} fontSize={0.05} color="#ffffff" anchorX="center">
        Point and tap to select a ring
      </Text>
    </>
  )
}

function XRScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight position={[2, 3, 2]} angle={0.4} penumbra={1} intensity={1} />
      <spotLight position={[-2, 3, 2]} angle={0.4} penumbra={1} intensity={0.5} />

      {/* Environment */}
      <Environment preset="studio" />

      {/* Floor reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.5} />
      </mesh>

      {/* Ring display */}
      <XRRingDisplay />
    </>
  )
}

interface XRRingSceneProps {
  xrSession: XRSession | null
  onSessionEnd: () => void
}

export function XRRingScene({ xrSession, onSessionEnd }: XRRingSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (xrSession) {
      const handleEnd = () => {
        console.log("[v0] XR session ended")
        onSessionEnd()
      }
      xrSession.addEventListener("end", handleEnd)
      return () => {
        xrSession.removeEventListener("end", handleEnd)
      }
    }
  }, [xrSession, onSessionEnd])

  return (
    <div className="w-full h-screen">
      <Canvas
        ref={canvasRef}
        gl={{ antialias: true, alpha: true, xr: { enabled: true } }}
        camera={{ position: [0, 1.6, 0], fov: 70 }}
      >
        <XRScene />
      </Canvas>
    </div>
  )
}
