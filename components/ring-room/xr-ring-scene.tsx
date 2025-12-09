"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { XR, Controllers, Hands, useXR, useHitTest } from "@react-three/xr"
import { Environment, Text } from "@react-three/drei"
import { RingModel } from "./ring-model"
import { HandTracking } from "./hand-tracking"
import { RING_CATALOG, createShortlistManager } from "@/lib/ring-data"
import { useSyncExternalStore } from "react"
import { iwsdkManager } from "@/lib/iwsdk-integration"
import { Analytics } from "@/lib/analytics"

// Singleton shortlist manager
const shortlistManager = createShortlistManager()

function useShortlist() {
  return useSyncExternalStore(shortlistManager.subscribe, shortlistManager.getItems, shortlistManager.getItems)
}

function RotatingGoldBox() {
  const meshRef = useRef<any>(null)

  useFrame(() => {
    if (meshRef.current) {
      // 0.5 RPM rotation
      meshRef.current.rotation.y += (Math.PI / 60) * (1 / 60) * 2
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 1.8, -0.5]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.9}
        roughness={0.1}
        emissive="#FFD700"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

// XR-specific ring positioning (in front of user)
function XRRingDisplay() {
  const [selectedRingId, setSelectedRingId] = useState<string | null>(null)
  const [placedRings, setPlacedRings] = useState<PlacedRing[]>([])
  const shortlistItems = useShortlist()
  const [iwsdkReady, setIwsdkReady] = useState(false)
  const [iwsdkCapabilities, setIwsdkCapabilities] = useState<string[]>([])
  const { isPresenting, session } = useXR()
  const [isARMode, setIsARMode] = useState(false)

  useEffect(() => {
    async function initIWSDK() {
      const ready = await iwsdkManager.initialize()
      setIwsdkReady(ready)

      if (ready) {
        const status = await iwsdkManager.getStatus()
        const caps = Object.entries(status.capabilities)
          .filter(([_, v]) => v)
          .map(([k]) => k)
        setIwsdkCapabilities(caps)
        Analytics.iwsdkInitialized(ready, caps)
      }
    }
    initIWSDK()
  }, [])

  useEffect(() => {
    if (session) {
      // @ts-ignore - session.mode exists on XRSession
      const mode = session.mode || "immersive-vr"
      setIsARMode(mode === "immersive-ar")
      console.log("[v0] XRRingScene: Session mode:", mode)
    }
  }, [session])

  const handleARPlace = useCallback(
    async (position: [number, number, number]) => {
      if (placedRings.length >= 3) return

      const selectedRing = selectedRingId ? RING_CATALOG.find((r) => r.id === selectedRingId) : RING_CATALOG[0]

      if (!selectedRing) return

      let anchorId: string | undefined

      if (iwsdkManager.hasFullCapabilities()) {
        const anchor = await iwsdkManager.createSpatialAnchor(position)
        anchorId = anchor.id
      }

      const newPlaced: PlacedRing = {
        id: `placed_${Date.now()}`,
        position,
        ringData: selectedRing,
        anchorId,
      }

      setPlacedRings((prev) => [...prev, newPlaced])
      Analytics.ringPlacedInAR(selectedRing.id, selectedRing.name, position, !!anchorId)

      // Haptic feedback
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(50)
      }
    },
    [placedRings.length, selectedRingId],
  )

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
      <RotatingGoldBox />

      {/* Gold test box label */}
      <Text position={[0, 2.4, -0.5]} fontSize={0.08} color="#FFD700" anchorX="center">
        Phase 1: IWSDK Test
      </Text>

      {/* IWSDK Status indicator */}
      <Text position={[0, 2.25, -0.5]} fontSize={0.05} color={iwsdkReady ? "#00FF41" : "#FF4444"} anchorX="center">
        {iwsdkReady ? "IWSDK Active" : "IWSDK Inactive"}
      </Text>

      {isARMode && (
        <>
          <Text position={[0, 2.1, -0.5]} fontSize={0.04} color="#10B981" anchorX="center">
            AR Mode - Tap surfaces to place rings ({placedRings.length}/3)
          </Text>
          <ARReticle onPlace={handleARPlace} />
        </>
      )}

      {/* Display platform - hide in AR mode */}
      {!isARMode && (
        <mesh position={[0, 0.8, -0.9]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.6]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.3} />
        </mesh>
      )}

      {/* Catalog Rings - show in VR mode */}
      {!isARMode &&
        RING_CATALOG.map((ring, index) => (
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

      {placedRings.map((placed) => (
        <group key={placed.id} position={placed.position}>
          <mesh>
            <torusGeometry args={[0.015, 0.004, 32, 64]} />
            <meshStandardMaterial
              color={
                placed.ringData.metal === "platinum"
                  ? "#E5E4E2"
                  : placed.ringData.metal === "gold"
                    ? "#FFD700"
                    : "#FFB7C5"
              }
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {placed.anchorId && (
            <mesh position={[0, 0.03, 0]}>
              <sphereGeometry args={[0.003, 16, 16]} />
              <meshBasicMaterial color="#00FF41" />
            </mesh>
          )}
        </group>
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
        {isARMode ? "Point at surfaces and tap to place rings" : "Point and tap to select a ring"}
      </Text>

      <HandTracking showVisualFeedback={true} />
    </>
  )
}

function XRScene() {
  const { isPresenting } = useXR()

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

      {/* XRRingDisplay */}
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

  return (
    <div className="w-full h-screen" role="application" aria-label="3D Ring Room XR Experience">
      <Canvas ref={canvasRef} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 1.6, 0], fov: 70 }}>
        <XR>
          <Controllers />
          <Hands />
          <XRScene />
        </XR>
      </Canvas>
    </div>
  )
}

// AR reticle component for hit-test placement
function ARReticle({ onPlace }: { onPlace: (position: [number, number, number]) => void }) {
  const reticleRef = useRef<any>(null)
  const [visible, setVisible] = useState(false)

  useHitTest((hitMatrix) => {
    if (reticleRef.current) {
      hitMatrix.decompose(reticleRef.current.position, reticleRef.current.quaternion, reticleRef.current.scale)
      setVisible(true)
    }
  })

  useFrame(() => {
    if (reticleRef.current && visible) {
      reticleRef.current.rotation.y += 0.02
    }
  })

  const handleClick = useCallback(() => {
    if (reticleRef.current && visible) {
      const pos = reticleRef.current.position
      onPlace([pos.x, pos.y, pos.z])
    }
  }, [visible, onPlace])

  return (
    <group ref={reticleRef} visible={visible} onClick={handleClick}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.02, 32]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
    </group>
  )
}

// Interface for placed rings
interface PlacedRing {
  id: string
  position: [number, number, number]
  ringData: (typeof RING_CATALOG)[0]
  anchorId?: string
}
