"use client"

import { useRef, useState, useCallback, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import type { Mesh, Group } from "three"
import * as THREE from "three"
import type { RingData } from "@/lib/ring-data"

interface RingModelProps {
  ring: RingData
  position: [number, number, number]
  isSelected: boolean
  onSelect: () => void
  onDragToShortlist?: () => void
  quality?: "high" | "medium" | "low"
}

export function RingModel({
  ring,
  position,
  isSelected,
  onSelect,
  onDragToShortlist,
  quality = "high",
}: RingModelProps) {
  const groupRef = useRef<Group>(null)
  const bandRef = useRef<Mesh>(null)
  const stoneRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<[number, number, number]>([0, 0, 0])
  const { camera, gl } = useThree()

  // Track drag position for shortlist drop zone detection
  const dragStartPos = useRef<THREE.Vector3 | null>(null)
  const currentDragPos = useRef<THREE.Vector3>(new THREE.Vector3())

  const geoSegments = useMemo(() => {
    switch (quality) {
      case "low":
        return { torus: [16, 32], octa: 0, cylinder: 4 }
      case "medium":
        return { torus: [24, 48], octa: 0, cylinder: 6 }
      default:
        return { torus: [32, 64], octa: 0, cylinder: 8 }
    }
  }, [quality])

  const handlePointerDown = useCallback(
    (e: THREE.Event) => {
      e.stopPropagation()
      if (groupRef.current) {
        setIsDragging(true)
        dragStartPos.current = groupRef.current.position.clone()
        gl.domElement.style.cursor = "grabbing"
        ;(e as any).target?.setPointerCapture?.((e as any).pointerId)
      }
    },
    [gl],
  )

  const handlePointerUp = useCallback(
    (e: THREE.Event) => {
      if (isDragging && groupRef.current) {
        const dragDistance = dragStartPos.current ? groupRef.current.position.distanceTo(dragStartPos.current) : 0

        if (dragDistance < 0.1) {
          onSelect()
        } else if (groupRef.current.position.y < -0.5 && onDragToShortlist) {
          onDragToShortlist()
        }

        setDragOffset([0, 0, 0])
        setIsDragging(false)
        gl.domElement.style.cursor = hovered ? "pointer" : "auto"
        ;(e as any).target?.releasePointerCapture?.((e as any).pointerId)
      }
    },
    [isDragging, onSelect, onDragToShortlist, gl, hovered],
  )

  const handlePointerMove = useCallback(
    (e: THREE.Event) => {
      if (isDragging && groupRef.current) {
        const rect = gl.domElement.getBoundingClientRect()
        const x = (((e as any).clientX - rect.left) / rect.width) * 2 - 1
        const y = -(((e as any).clientY - rect.top) / rect.height) * 2 + 1

        const vector = new THREE.Vector3(x, y, 0.5)
        vector.unproject(camera)
        const dir = vector.sub(camera.position).normalize()
        const distance = (position[2] - camera.position.z) / dir.z
        const pos = camera.position.clone().add(dir.multiplyScalar(distance))

        currentDragPos.current.set(pos.x - position[0], pos.y - position[1], 0)
        setDragOffset([currentDragPos.current.x, currentDragPos.current.y, 0])
      }
    },
    [isDragging, camera, gl, position],
  )

  useFrame((state) => {
    if (!groupRef.current) return

    const baseX = position[0] + dragOffset[0]
    const baseY = position[1] + dragOffset[1]
    const targetY = baseY + (hovered && !isDragging ? 0.1 : 0)

    // Smooth position interpolation
    groupRef.current.position.x = baseX
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.15
    groupRef.current.position.z = position[2]

    // Simplified rotation logic
    if (isSelected) {
      groupRef.current.rotation.y += 0.008
    } else if (isDragging) {
      groupRef.current.rotation.z = dragOffset[0] * 0.3
      groupRef.current.rotation.x = -dragOffset[1] * 0.2
    } else {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.12
      groupRef.current.rotation.z *= 0.92
      groupRef.current.rotation.x *= 0.92
    }

    if (stoneRef.current && (hovered || isSelected)) {
      stoneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.06
    }
  })

  const isInDropZone = isDragging && dragOffset[1] < -0.3

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={() => {
        setHovered(true)
        if (!isDragging) gl.domElement.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setHovered(false)
        if (!isDragging) gl.domElement.style.cursor = "auto"
      }}
    >
      {/* Ring Band - optimized geometry */}
      <mesh ref={bandRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, geoSegments.torus[0], geoSegments.torus[1]]} />
        <meshStandardMaterial color={ring.colors.metal} metalness={0.9} roughness={0.1} envMapIntensity={1.5} />
      </mesh>

      {/* Center Stone - optimized material */}
      <mesh ref={stoneRef} position={[0, 0.15, 0]} scale={hovered || isSelected ? 1.1 : 1}>
        <octahedronGeometry args={[0.12, geoSegments.octa]} />
        <meshPhysicalMaterial
          color={ring.colors.stone}
          metalness={0.1}
          roughness={0.05}
          transmission={quality === "low" ? 0.7 : 0.9}
          thickness={quality === "low" ? 0.3 : 0.5}
          envMapIntensity={quality === "low" ? 1 : 2}
          clearcoat={quality === "low" ? 0 : 1}
          clearcoatRoughness={0}
          ior={2.4}
        />
      </mesh>

      {/* Prongs - reduced count on low quality */}
      {(quality === "low" ? [0, 2] : [0, 1, 2, 3]).map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i * Math.PI) / 2) * 0.08, 0.08, Math.sin((i * Math.PI) / 2) * 0.08]}
          rotation={[0.3, (i * Math.PI) / 2, 0]}
        >
          <cylinderGeometry args={[0.01, 0.015, 0.1, geoSegments.cylinder]} />
          <meshStandardMaterial color={ring.colors.metal} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, quality === "low" ? 16 : 32]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Drop zone indicator */}
      {isInDropZone && (
        <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, quality === "low" ? 16 : 32]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Hover tooltip - only show on non-low quality */}
      {hovered && !isSelected && !isDragging && quality !== "low" && (
        <Html position={[0, 0.5, 0]} center>
          <div className="bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap pointer-events-none">
            <div className="font-medium">{ring.name}</div>
            <div className="text-xs text-white/70">Tap to view | Drag to shortlist</div>
          </div>
        </Html>
      )}

      {/* Drag feedback */}
      {isDragging && (
        <Html position={[0, 0.6, 0]} center>
          <div
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap pointer-events-none transition-colors ${
              isInDropZone ? "bg-emerald-500 text-white" : "bg-black/80 text-white"
            }`}
          >
            {isInDropZone ? "Release to add!" : "Drag down"}
          </div>
        </Html>
      )}
    </group>
  )
}
