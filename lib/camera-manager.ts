"use client"

import { Analytics } from "./analytics"

export interface CameraConfig {
  facingMode: "user" | "environment"
  width: { ideal: number; max?: number }
  height: { ideal: number; max?: number }
  frameRate: { ideal: number; max?: number }
}

export interface CameraConstraints {
  video: MediaTrackConstraints
}

export interface CameraPerformanceMetrics {
  fps: number
  latency: number
  droppedFrames: number
  timestamp: number
}

export class CameraManager {
  private stream: MediaStream | null = null
  private videoElement: HTMLVideoElement | null = null
  private facingMode: "user" | "environment" = "user"
  private retryCount = 0
  private maxRetries = 3
  private retryDelay = 1000
  private performanceMetrics: CameraPerformanceMetrics = {
    fps: 0,
    latency: 0,
    droppedFrames: 0,
    timestamp: Date.now(),
  }
  private lastFrameTime = 0
  private frameCount = 0

  // Progressive fallback configurations aligned with 8th Wall (60fps) and Meta Horizon standards
  private readonly configs: CameraConfig[] = [
    // Ideal: 60fps front-facing for premium AR experiences (8th Wall standard)
    {
      facingMode: "user",
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 60, max: 60 },
    },
    // Optimized: 30fps balanced performance
    {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30, max: 30 },
    },
    // Basic: Guaranteed compatibility
    {
      facingMode: "user",
      width: { ideal: 640 },
      height: { ideal: 480 },
      frameRate: { ideal: 30 },
    },
  ]

  async initializeCamera(
    videoElement: HTMLVideoElement,
    preferredFacingMode: "user" | "environment" = "user",
  ): Promise<MediaStream> {
    this.videoElement = videoElement
    this.facingMode = preferredFacingMode

    // Try progressive fallback through quality tiers
    for (let i = 0; i < this.configs.length; i++) {
      try {
        const config = { ...this.configs[i], facingMode: this.facingMode }
        const stream = await this.requestCameraAccess(config)

        if (stream) {
          this.stream = stream
          this.attachStreamToVideo(stream, videoElement)
          this.startPerformanceMonitoring()

          // Track successful initialization
          Analytics.trackEvent({
            event: "camera_initialized",
            properties: {
              facing_mode: this.facingMode,
              config_tier: i === 0 ? "ideal_60fps" : i === 1 ? "optimized_30fps" : "basic",
              width: config.width.ideal,
              height: config.height.ideal,
              frame_rate: config.frameRate.ideal,
            },
            platform: "web",
          })

          console.log(`[v0] Camera initialized with config tier ${i}:`, config)
          return stream
        }
      } catch (error) {
        console.error(`[v0] Camera config ${i} failed:`, error)
        if (i === this.configs.length - 1) {
          throw new Error("All camera configurations failed")
        }
      }
    }

    throw new Error("Failed to initialize camera")
  }

  private async requestCameraAccess(config: CameraConfig): Promise<MediaStream | null> {
    const constraints: CameraConstraints = {
      video: {
        facingMode: { ideal: config.facingMode },
        width: config.width,
        height: config.height,
        frameRate: config.frameRate,
      },
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      return stream
    } catch (error) {
      // Exponential backoff retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        const delay = this.retryDelay * Math.pow(2, this.retryCount - 1)
        console.log(`[v0] Retrying camera access in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`)
        await this.sleep(delay)
        return this.requestCameraAccess(config)
      }
      throw error
    }
  }

  private attachStreamToVideo(stream: MediaStream, videoElement: HTMLVideoElement): void {
    videoElement.srcObject = stream
    videoElement.playsInline = true
    videoElement.muted = true

    videoElement.onloadedmetadata = () => {
      videoElement.play().catch((error) => {
        console.error("[v0] Video playback failed:", error)
        Analytics.trackEvent({
          event: "camera_playback_failed",
          properties: { error: error.message },
          platform: "web",
        })
      })
    }
  }

  async switchCamera(): Promise<void> {
    if (!this.videoElement) {
      throw new Error("No video element attached")
    }

    // Toggle facing mode
    this.facingMode = this.facingMode === "user" ? "environment" : "user"

    // Stop current stream
    this.stopCamera()

    // Reinitialize with new facing mode
    await this.initializeCamera(this.videoElement, this.facingMode)

    Analytics.trackEvent({
      event: "camera_switched",
      properties: { new_facing_mode: this.facingMode },
      platform: "web",
    })
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null
    }

    this.stopPerformanceMonitoring()

    Analytics.trackEvent({
      event: "camera_stopped",
      properties: { facing_mode: this.facingMode },
      platform: "web",
    })
  }

  getCurrentStream(): MediaStream | null {
    return this.stream
  }

  getFacingMode(): "user" | "environment" {
    return this.facingMode
  }

  // Performance monitoring aligned with 8th Wall's 60fps standard
  private startPerformanceMonitoring(): void {
    this.lastFrameTime = performance.now()
    this.frameCount = 0

    const monitorFrame = () => {
      if (!this.stream) return

      const now = performance.now()
      const delta = now - this.lastFrameTime
      this.frameCount++

      // Calculate FPS every second
      if (delta >= 1000) {
        this.performanceMetrics.fps = Math.round((this.frameCount * 1000) / delta)
        this.performanceMetrics.latency = delta / this.frameCount
        this.performanceMetrics.timestamp = Date.now()

        // Track performance degradation
        if (this.performanceMetrics.fps < 24) {
          Analytics.trackEvent({
            event: "camera_performance_degraded",
            properties: {
              fps: this.performanceMetrics.fps,
              latency: this.performanceMetrics.latency,
            },
            platform: "web",
          })
        }

        this.lastFrameTime = now
        this.frameCount = 0
      }

      requestAnimationFrame(monitorFrame)
    }

    requestAnimationFrame(monitorFrame)
  }

  private stopPerformanceMonitoring(): void {
    // Reset metrics
    this.performanceMetrics = {
      fps: 0,
      latency: 0,
      droppedFrames: 0,
      timestamp: Date.now(),
    }
  }

  getPerformanceMetrics(): CameraPerformanceMetrics {
    return { ...this.performanceMetrics }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Error recovery
  async handleError(error: Error): Promise<void> {
    console.error("[v0] Camera error:", error)

    Analytics.trackEvent({
      event: "camera_error",
      properties: {
        error: error.message,
        facing_mode: this.facingMode,
        retry_count: this.retryCount,
      },
      platform: "web",
    })

    // Attempt recovery
    if (this.videoElement && this.retryCount < this.maxRetries) {
      await this.initializeCamera(this.videoElement, this.facingMode)
    }
  }
}

// Singleton instance
let cameraManagerInstance: CameraManager | null = null

export function getCameraManager(): CameraManager {
  if (!cameraManagerInstance) {
    cameraManagerInstance = new CameraManager()
  }
  return cameraManagerInstance
}
