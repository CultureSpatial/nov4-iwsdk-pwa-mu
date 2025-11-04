"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { PerspectiveCamera, Grid } from "@react-three/drei"
import * as THREE from "three"
import { IWSDKManager } from "@/lib/iwsdk-manager"
import { UniversalARManager } from "@/lib/universal-ar"

interface MRDemoSceneProps {
  controls: {
    move: boolean
    rotate: boolean
    scale: boolean
    physics: boolean
  }
}

function InteractivePlane({ controls }: MRDemoSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { camera, gl } = useThree()

  useFrame((state) => {
    if (!meshRef.current) return

    // Gentle floating animation when not being interacted with
    if (!isDragging) {
      meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime) * 0.1
      meshRef.current.rotation.y += 0.005
    }

    // Pulsing glow effect
    const material = meshRef.current.material as THREE.MeshStandardMaterial
    material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1
  })

  const handlePointerDown = (e: THREE.Event) => {
    if (!controls.move) return
    e.stopPropagation()
    setIsDragging(true)
    gl.domElement.style.cursor = "grabbing"
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    gl.domElement.style.cursor = isHovered ? "grab" : "auto"
  }

  const handlePointerMove = (e: THREE.Event) => {
    if (!isDragging || !meshRef.current || !controls.move) return
    e.stopPropagation()

    // Move plane based on pointer position
    const point = e.point
    meshRef.current.position.x = point.x
    meshRef.current.position.z = point.z
  }

  const handleWheel = (e: WheelEvent) => {
    if (!meshRef.current || !controls.scale) return
    e.preventDefault()

    // Scale with mouse wheel
    const scaleDelta = e.deltaY * -0.001
    const newScale = Math.max(0.5, Math.min(3, meshRef.current.scale.x + scaleDelta))
    meshRef.current.scale.setScalar(newScale)
  }

  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener("wheel", handleWheel, { passive: false })
    return () => canvas.removeEventListener("wheel", handleWheel)
  }, [gl, controls.scale])

  return (
    <mesh
      ref={meshRef}
      position={[0, 1, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        setIsHovered(true)
        gl.domElement.style.cursor = "grab"
      }}
      onPointerLeave={() => {
        setIsHovered(false)
        gl.domElement.style.cursor = "auto"
      }}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={isHovered ? "#10b981" : "#8b5cf6"}
        emissive={isHovered ? "#10b981" : "#8b5cf6"}
        emissiveIntensity={0.2}
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
      />
      {/* Edge glow */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(1, 1)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </lineSegments>
    </mesh>
  )
}

function AREnvironment() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={0.3} />

      {/* Grid floor */}
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6366f1"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#8b5cf6"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />

      {/* Reference objects */}
      <mesh position={[-2, 0.5, -2]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[2, 0.5, -2]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[0, 0.5, -3]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 32]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </>
  )
}

export function MRDemoScene({ controls }: MRDemoSceneProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAR = async () => {
      try {
        console.log("[v0] Initializing MR Demo systems")

        const iwsdk = IWSDKManager.getInstance()
        await iwsdk.initialize({
          enableInput: true,
          enablePhysics: controls.physics,
          enableLocomotion: true,
        })

        const universalAR = UniversalARManager.getInstance()
        await universalAR.initialize({
          imageTargets: [],
          faceTracking: false,
          instantTracking: true,
        })

        if (controls.physics) {
          iwsdk.enablePhysics()
        }

        console.log("[v0] MR Demo systems initialized successfully")
        setIsInitialized(true)
      } catch (error) {
        console.error("[v0] Failed to initialize MR Demo:", error)
      }
    }

    initializeAR()
  }, [controls.physics])

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={60} />
        <AREnvironment />
        {isInitialized && <InteractivePlane controls={controls} />}
      </Canvas>
    </div>
  )
}
