"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Heart, Share2, Ruler, ChevronLeft, ChevronRight, Smartphone } from "lucide-react"
import type { RingData } from "@/lib/ring-data"
import { RING_CATALOG } from "@/lib/ring-data"
import { Analytics } from "@/lib/analytics"
import * as THREE from "three"

interface RingDetailPanelProps {
  ring: RingData
  onClose: () => void
  onAddToShortlist: () => void
  isInShortlist: boolean
  onNavigate?: (ringId: string) => void
}

function Ring360Viewer({ ring }: { ring: RingData }) {
  const controlsRef = useRef<any>(null)
  const rotationRef = useRef(0)

  useEffect(() => {
    // Track rotation for analytics
    const interval = setInterval(() => {
      if (controlsRef.current) {
        const newRotation = controlsRef.current.getAzimuthalAngle()
        const rotationDelta = Math.abs(newRotation - rotationRef.current)
        if (rotationDelta > 0.5) {
          Analytics.ringRotated(ring.id, Math.round(THREE.MathUtils.radToDeg(rotationDelta)))
          rotationRef.current = newRotation
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [ring.id])

  return (
    <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 2]} fov={45} />
      <ambientLight intensity={0.6} />
      <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} />
      <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={0.5} />
      <Environment preset="studio" />

      {/* Ring Band */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.08, 32, 64]} />
        <meshStandardMaterial color={ring.colors.metal} metalness={0.9} roughness={0.1} envMapIntensity={1.5} />
      </mesh>

      {/* Center Stone */}
      <mesh position={[0, 0.25, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshPhysicalMaterial
          color={ring.colors.stone}
          metalness={0.1}
          roughness={0.05}
          transmission={0.9}
          thickness={0.5}
          envMapIntensity={2}
          clearcoat={1}
          ior={2.4}
        />
      </mesh>

      {/* Prongs */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i * Math.PI) / 2) * 0.12, 0.12, Math.sin((i * Math.PI) / 2) * 0.12]}
          rotation={[0.3, (i * Math.PI) / 2, 0]}
        >
          <cylinderGeometry args={[0.015, 0.02, 0.15, 8]} />
          <meshStandardMaterial color={ring.colors.metal} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={4}
        autoRotate
        autoRotateSpeed={2}
      />
    </Canvas>
  )
}

export function RingDetailPanel({ ring, onClose, onAddToShortlist, isInShortlist, onNavigate }: RingDetailPanelProps) {
  const [startTime] = useState(Date.now())
  const [touchStart, setTouchStart] = useState<number | null>(null)

  useEffect(() => {
    Analytics.ringDetailOpened(ring.id, ring.name)
  }, [ring.id, ring.name])

  const handleClose = useCallback(() => {
    const timeSpent = Date.now() - startTime
    Analytics.ringDetailClosed(ring.id, ring.name, timeSpent)
    onClose()
  }, [ring.id, ring.name, startTime, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const currentIndex = RING_CATALOG.findIndex((r) => r.id === ring.id)
        const nextIndex =
          e.key === "ArrowLeft"
            ? (currentIndex - 1 + RING_CATALOG.length) % RING_CATALOG.length
            : (currentIndex + 1) % RING_CATALOG.length
        onNavigate?.(RING_CATALOG[nextIndex].id)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [ring.id, handleClose, onNavigate])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      const currentIndex = RING_CATALOG.findIndex((r) => r.id === ring.id)
      const nextIndex =
        diff > 0
          ? (currentIndex + 1) % RING_CATALOG.length
          : (currentIndex - 1 + RING_CATALOG.length) % RING_CATALOG.length
      onNavigate?.(RING_CATALOG[nextIndex].id)
    }

    setTouchStart(null)
  }

  const currentIndex = RING_CATALOG.findIndex((r) => r.id === ring.id)
  const prevRing = RING_CATALOG[(currentIndex - 1 + RING_CATALOG.length) % RING_CATALOG.length]
  const nextRing = RING_CATALOG[(currentIndex + 1) % RING_CATALOG.length]

  const handleTryInAR = () => {
    Analytics.tryInArClicked(ring.id, ring.name)
    // Would launch XR mode focused on this ring
    console.log("[v0] Try in AR clicked for:", ring.id)
  }

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(50)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* 360 Viewer Section */}
        <div className="flex-1 relative bg-gradient-to-b from-slate-900 to-slate-800">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
            onClick={() => {
              triggerHaptic()
              onNavigate?.(prevRing.id)
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
            onClick={() => {
              triggerHaptic()
              onNavigate?.(nextRing.id)
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* 360 Ring viewer */}
          <div className="w-full h-full min-h-[300px] md:min-h-full">
            <Suspense
              fallback={<div className="flex items-center justify-center h-full text-white">Loading 360° view...</div>}
            >
              <Ring360Viewer ring={ring} />
            </Suspense>
          </div>

          {/* Rotation hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            Drag to rotate | Pinch to zoom
          </div>

          {/* Ring counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm">
            {currentIndex + 1} / {RING_CATALOG.length}
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-96 bg-background overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold">{ring.name}</h2>
            <p className="text-sm text-muted-foreground">SKU: {ring.sku}</p>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-emerald-600">${ring.price.toLocaleString()}</div>

          {/* Description */}
          <p className="text-muted-foreground">{ring.description}</p>

          {/* Stone Details */}
          <div className="space-y-3">
            <h4 className="font-semibold">Center Stone</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-muted-foreground block text-xs">Type</span>
                <span className="capitalize font-medium">{ring.centerStone.type}</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-muted-foreground block text-xs">Carat</span>
                <span className="font-medium">{ring.centerStone.carat}ct</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-muted-foreground block text-xs">Cut</span>
                <span className="font-medium">{ring.centerStone.cut}</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-muted-foreground block text-xs">Clarity</span>
                <span className="font-medium">{ring.centerStone.clarity}</span>
              </div>
            </div>
          </div>

          {/* Metal */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Metal:</span>
            <Badge variant="secondary" className="capitalize">
              {ring.metal.replace("-", " ")}
            </Badge>
          </div>

          {/* Available Sizes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Available Sizes</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {ring.ringSize.map((size) => (
                <Badge key={size} variant="outline" className="text-sm px-3 py-1">
                  {size}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              className={`w-full ${isInShortlist ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
              size="lg"
              onClick={() => {
                triggerHaptic()
                onAddToShortlist()
              }}
            >
              <Heart className={`h-5 w-5 mr-2 ${isInShortlist ? "fill-current" : ""}`} />
              {isInShortlist ? "In Shortlist" : "Add to Shortlist"}
            </Button>

            <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={handleTryInAR}>
              <Smartphone className="h-5 w-5 mr-2" />
              Try in AR
            </Button>

            <Button variant="ghost" className="w-full" size="lg">
              <Share2 className="h-5 w-5 mr-2" />
              Share This Ring
            </Button>
          </div>

          {/* Swipe hint for mobile */}
          <p className="text-center text-xs text-muted-foreground md:hidden">Swipe left or right to see other rings</p>
        </div>
      </div>
    </div>
  )
}
