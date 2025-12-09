"use client"

import { useState, useCallback, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { iwsdkManager } from "@/lib/iwsdk-integration"
import { Analytics } from "@/lib/analytics"
import type { Ring } from "@/lib/ring-data"

interface ARPlacementProps {
  ring: Ring
  onPlaced?: (position: [number, number, number]) => void
  onReset?: () => void
  isPresenting?: boolean
}

interface PlacedRing {
  id: string
  ringId: string
  position: [number, number, number]
  rotation: number
  scale: number
  anchorId?: string
}

export function ARPlacement({ ring, onPlaced, onReset, isPresenting = false }: ARPlacementProps) {
  const [placedRings, setPlacedRings] = useState<PlacedRing[]>([])
  const [reticleVisible, setReticleVisible] = useState(false)
  const reticleRef = useRef<any>(null)

  // Animate reticle
  useFrame((state) => {
    if (reticleRef.current && reticleVisible) {
      reticleRef.current.rotation.y += 0.02
    }
  })

  const placeRing = useCallback(
    async (position: [number, number, number]) => {
      if (placedRings.length >= 3) return

      let anchorId: string | undefined

      // Create spatial anchor if IWSDK available
      if (iwsdkManager.hasFullCapabilities()) {
        const anchor = await iwsdkManager.createSpatialAnchor(position)
        anchorId = anchor.id
      }

      const newPlacedRing: PlacedRing = {
        id: `placed_${Date.now()}`,
        ringId: ring.id,
        position,
        rotation: 0,
        scale: 1,
        anchorId,
      }

      setPlacedRings((prev) => [...prev, newPlacedRing])
      onPlaced?.(position)

      Analytics.ringPlacedInAR(ring.id, ring.name, position, !!anchorId)
      console.log("[v0] ARPlacement: Ring placed at", position, "with anchor:", anchorId)
    },
    [placedRings.length, ring, onPlaced],
  )

  const resetPlacements = useCallback(() => {
    // Delete spatial anchors
    placedRings.forEach((placed) => {
      if (placed.anchorId) {
        iwsdkManager.deleteSpatialAnchor(placed.anchorId)
      }
    })

    setPlacedRings([])
    onReset?.()
    console.log("[v0] ARPlacement: All placements reset")
  }, [placedRings, onReset])

  if (!isPresenting) return null

  return (
    <>
      {/* Placement reticle */}
      <group ref={reticleRef} visible={reticleVisible}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.1, 32]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.02, 32]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
      </group>

      {/* Placed rings */}
      {placedRings.map((placed) => (
        <group key={placed.id} position={placed.position}>
          <mesh rotation={[0, placed.rotation, 0]} scale={placed.scale}>
            <torusGeometry args={[0.015, 0.004, 32, 64]} />
            <meshStandardMaterial
              color={ring.metal === "platinum" ? "#E5E4E2" : ring.metal === "gold" ? "#FFD700" : "#FFB7C5"}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Anchor indicator */}
          {placed.anchorId && (
            <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.005, 16, 16]} />
              <meshBasicMaterial color="#00FF41" />
            </mesh>
          )}
        </group>
      ))}

      {/* Instructions */}
      <Text position={[0, 1.8, -0.8]} fontSize={0.05} color="#ffffff" anchorX="center">
        {placedRings.length >= 3
          ? "Maximum 3 rings placed"
          : reticleVisible
            ? "Tap to place ring"
            : "Point at a surface to place ring"}
      </Text>

      {/* Placement count */}
      <Text position={[0, 1.7, -0.8]} fontSize={0.04} color="#10B981" anchorX="center">
        {placedRings.length}/3 rings placed
      </Text>
    </>
  )
}
