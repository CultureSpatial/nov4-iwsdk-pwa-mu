"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { trackEvent } from "@/lib/analytics"

// Tap ripple with haptic feedback
export function TapRipple({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  useEffect(() => {
    // Trigger haptic feedback if available
    if ("vibrate" in navigator) {
      navigator.vibrate(10)
    }
    trackEvent("micro_interaction_tap_ripple", { x, y })
  }, [x, y])

  return (
    <motion.div
      className="absolute pointer-events-none rounded-full bg-primary/30"
      style={{ left: x - 20, top: y - 20 }}
      initial={{ width: 40, height: 40, opacity: 1 }}
      animate={{ width: 100, height: 100, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onAnimationComplete={onComplete}
    />
  )
}

// Progress momentum ring
export function ProgressRing({ progress, label }: { progress: number; label?: string }) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (progress / 100) * circumference

  useEffect(() => {
    if (progress === 100) {
      trackEvent("progress_complete", { label })
      if ("vibrate" in navigator) {
        navigator.vibrate([50, 30, 50])
      }
    }
  }, [progress, label])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90">
        <circle cx="48" cy="48" r="45" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted" />
        <motion.circle
          cx="48"
          cy="48"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-primary"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute text-sm font-medium">{Math.round(progress)}%</div>
      {progress === 100 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-2xl">✓</div>
        </motion.div>
      )}
    </div>
  )
}

// AR anchor lock confirmation
export function AnchorLockFeedback({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  useEffect(() => {
    trackEvent("ar_anchor_locked", { x, y })
    if ("vibrate" in navigator) {
      navigator.vibrate([30, 20, 30])
    }
  }, [x, y])

  return (
    <motion.div className="absolute pointer-events-none" style={{ left: x, top: y }} onAnimationComplete={onComplete}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-primary"
          style={{ left: -20, top: -20 }}
          initial={{ width: 40, height: 40, opacity: 0.8 }}
          animate={{
            width: 120,
            height: 120,
            opacity: 0,
            left: -60,
            top: -60,
          }}
          transition={{
            duration: 1,
            delay: i * 0.2,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  )
}

// Micro-confetti burst for milestones
export function MicroConfetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (trigger) {
      trackEvent("milestone_celebration", {})
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      }))
      setParticles(newParticles)
      setTimeout(() => setParticles([]), 1000)
    }
  }, [trigger])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{ left: "50%", top: "50%" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: 0,
              scale: 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hold-to-confirm glow
export function HoldToConfirm({
  onConfirm,
  duration = 1000,
  label = "Hold to confirm",
}: {
  onConfirm: () => void
  duration?: number
  label?: string
}) {
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!holding) {
      setProgress(0)
      return
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(interval)
        onConfirm()
        trackEvent("hold_to_confirm_complete", { duration })
        if ("vibrate" in navigator) {
          navigator.vibrate(50)
        }
      }
    }, 16)

    return () => clearInterval(interval)
  }, [holding, duration, onConfirm])

  return (
    <motion.button
      className="relative px-6 py-3 rounded-lg bg-primary text-primary-foreground overflow-hidden"
      onPointerDown={() => setHolding(true)}
      onPointerUp={() => setHolding(false)}
      onPointerLeave={() => setHolding(false)}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-primary-foreground/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        style={{ transformOrigin: "left" }}
      />
      <span className="relative z-10">{label}</span>
    </motion.button>
  )
}
