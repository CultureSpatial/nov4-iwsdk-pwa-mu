"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Bubble {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  opacity: number
  glowIntensity: number
}

export default function BubblesDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize bubbles
    const bubbleCount = 20
    for (let i = 0; i < bubbleCount; i++) {
      bubblesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 30 + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1, // Slight upward bias
        opacity: Math.random() * 0.5 + 0.3,
        glowIntensity: Math.random() * 0.5 + 0.5,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      bubblesRef.current.forEach((bubble) => {
        // Update position
        bubble.x += bubble.vx
        bubble.y += bubble.vy

        // Bounce off edges
        if (bubble.x < 0 || bubble.x > canvas.width) bubble.vx *= -1
        if (bubble.y < 0 || bubble.y > canvas.height) bubble.vy *= -1

        // Keep in bounds
        bubble.x = Math.max(0, Math.min(canvas.width, bubble.x))
        bubble.y = Math.max(0, Math.min(canvas.height, bubble.y))

        // Animate glow
        bubble.glowIntensity = 0.5 + Math.sin(Date.now() * 0.001 + bubble.x) * 0.3

        // Draw bubble with emerald glow
        const gradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.radius)
        gradient.addColorStop(0, `rgba(16, 185, 129, ${bubble.opacity * bubble.glowIntensity})`)
        gradient.addColorStop(0.5, `rgba(5, 150, 105, ${bubble.opacity * 0.6})`)
        gradient.addColorStop(1, `rgba(4, 120, 87, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw bubble outline
        ctx.strokeStyle = `rgba(16, 185, 129, ${bubble.opacity * 0.8})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius * 0.8, 0, Math.PI * 2)
        ctx.stroke()

        // Draw highlight
        const highlightGradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          0,
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.5,
        )
        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity * 0.6})`)
        highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.fillStyle = highlightGradient
        ctx.beginPath()
        ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.5, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute top-4 left-4 z-10">
        <Button asChild variant="outline" className="bg-emerald-900/80 border-emerald-600 text-white">
          <Link href="/effects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Effects
          </Link>
        </Button>
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-10 text-center">
        <div className="bg-emerald-900/80 backdrop-blur-sm border border-emerald-600 rounded-lg p-4 inline-block">
          <h2 className="text-xl font-bold text-white mb-2">Emerald Bubble Effect</h2>
          <p className="text-emerald-200 text-sm">Floating bubbles with physics simulation and dynamic glow</p>
        </div>
      </div>
    </div>
  )
}
