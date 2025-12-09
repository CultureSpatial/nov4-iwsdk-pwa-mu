"use client"

import { useRef, useState, useCallback } from "react"
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
}

export function RingModel({ ring, position, isSelected, onSelect, onDragToShortlist }: RingModelProps) {
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

  const handlePointerDown = useCallback(
    (e: THREE.Event) => {
      e.stopPropagation()
      if (groupRef.current) {
        setIsDragging(true)
        dragStartPos.current = groupRef.current.position.clone()
        gl.domElement.style.cursor = "grabbing"
        // Capture pointer for drag tracking
        ;(e as any).target?.setPointerCapture?.((e as any).pointerId)
      }
    },
    [gl],
  )

  const handlePointerUp = useCallback(
    (e: THREE.Event) => {
      if (isDragging && groupRef.current) {
        // Check if dragged to bottom of screen (shortlist zone)
        const dragDistance = dragStartPos.current ? groupRef.current.position.distanceTo(dragStartPos.current) : 0

        // If minimal movement, treat as click/tap
        if (dragDistance < 0.1) {
          onSelect()
        } else if (groupRef.current.position.y < -0.5 && onDragToShortlist) {
          // Dragged down to shortlist zone
          onDragToShortlist()
        }

        // Reset position with animation
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
        // Get pointer position in normalized device coordinates
        const rect = gl.domElement.getBoundingClientRect()
        const x = (((e as any).clientX - rect.left) / rect.width) * 2 - 1
        const y = -(((e as any).clientY - rect.top) / rect.height) * 2 + 1

        // Project to 3D space at ring's depth
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

  // Animation frame
  useFrame((state) => {
    if (!groupRef.current) return

    // Base position
    const baseX = position[0] + dragOffset[0]
    const baseY = position[1] + dragOffset[1]

    // Hover lift effect (when not dragging)
    const targetY = baseY + (hovered && !isDragging ? 0.1 : 0)
    groupRef.current.position.x = baseX
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.15
    groupRef.current.position.z = position[2]

    // Rotation based on state
    if (isSelected) {
      // Selected: slow showcase rotation
      groupRef.current.rotation.y += 0.008
    } else if (isDragging) {
      // Dragging: tilt based on movement
      groupRef.current.rotation.z = dragOffset[0] * 0.3
      groupRef.current.rotation.x = -dragOffset[1] * 0.2
    } else {
      // Idle: gentle floating animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.15
      groupRef.current.rotation.z *= 0.9 // Smooth return to neutral
      groupRef.current.rotation.x *= 0.9
    }

    // Stone sparkle effect on hover
    if (stoneRef.current) {
      if (hovered || isSelected) {
        stoneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.08
        stoneRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 3) * 0.05
      }
    }
  })

  // Visual feedback for drag-to-shortlist zone
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
      {/* Ring Band */}
      <mesh ref={bandRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, 32, 64]} />
        <meshStandardMaterial color={ring.colors.metal} metalness={0.9} roughness={0.1} envMapIntensity={1.5} />
      </mesh>

      {/* Center Stone */}
      <mesh ref={stoneRef} position={[0, 0.15, 0]} scale={hovered || isSelected ? 1.1 : 1}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshPhysicalMaterial
          color={ring.colors.stone}
          metalness={0.1}
          roughness={0.05}
          transmission={0.9}
          thickness={0.5}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0}
          ior={2.4}
        />
      </mesh>

      {/* Prongs */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i * Math.PI) / 2) * 0.08, 0.08, Math.sin((i * Math.PI) / 2) * 0.08]}
          rotation={[0.3, (i * Math.PI) / 2, 0]}
        >
          <cylinderGeometry args={[0.01, 0.015, 0.1, 8]} />
          <meshStandardMaterial color={ring.colors.metal} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Selection ring indicator */}
      {isSelected && (
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, 32]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Drop zone indicator when dragging */}
      {isInDropZone && (
        <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Hover tooltip */}
      {hovered && !isSelected && !isDragging && (
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
            {isInDropZone ? "Release to add to shortlist!" : "Drag down to shortlist"}
          </div>
        </Html>
      )}
    </group>
  )
}
