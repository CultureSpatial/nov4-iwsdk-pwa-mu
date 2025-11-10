/**
 * Camera Manager - Isolated, production-ready camera system
 * Critical for AR try-on flows with front-facing camera priority
 */

export type CameraFacing = "user" | "environment"
export type CameraState = "idle" | "requesting" | "active" | "error" | "denied"

export interface CameraPerformanceMetrics {
  fps: number
  latency: number
  droppedFrames: number
  resolution: { width: number; height: number }
}

export interface CameraConfig {
  facing: CameraFacing
  width?: number
  height?: number
  aspectRatio?: number
  frameRate?: number
  enablePixelAccess?: boolean // For face landmark precision
  mirrorDisplay?: boolean // For selfie mirror effect
  pauseOnHidden?: boolean // Performance optimization
}

export interface CameraError {
  code: string
  message: string
  userMessage: string
  recoverable: boolean
}

export class CameraManager {
  private stream: MediaStream | null = null
  private state: CameraState = "idle"
  private config: CameraConfig
  private errorCallbacks: ((error: CameraError) => void)[] = []
  private stateCallbacks: ((state: CameraState) => void)[] = []
  private retryCount = 0
  private maxRetries = 3
  private performanceMonitor: PerformanceMonitor | null = null

  constructor(config: Partial<CameraConfig> = {}) {
    this.config = {
      facing: "user", // FRONT-FACING by default for try-on
      width: 1280, // Balanced for mobile performance
      height: 720,
      aspectRatio: 16 / 9,
      frameRate: 30, // Target 30fps for AR stability
      enablePixelAccess: true, // Enable for face tracking
      mirrorDisplay: true, // Mirror for selfie UX
      pauseOnHidden: true, // Pause when tab hidden
      ...config,
    }
  }

  /**
   * Initialize camera with robust error handling
   */
  async initialize(): Promise<MediaStream> {
    if (this.stream && this.stream.active) {
      console.log("[v0] Camera already active")
      return this.stream
    }

    this.setState("requesting")

    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        throw this.createError("NOT_SUPPORTED", "Camera API not supported in this browser", false)
      }

      // Request camera with progressive fallback
      this.stream = await this.requestCameraWithFallback()

      this.setState("active")
      this.retryCount = 0

      console.log("[v0] Camera initialized successfully", {
        facing: this.config.facing,
        tracks: this.stream.getVideoTracks().map((t) => ({
          label: t.label,
          settings: t.getSettings(),
        })),
      })

      return this.stream
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Request camera with progressive fallback constraints
   * Aligned with 8th Wall and Meta Horizon OS best practices
   */
  private async requestCameraWithFallback(): Promise<MediaStream> {
    const constraints = this.buildConstraints()

    try {
      // Try ideal constraints first (60fps for face tracking if supported)
      return await navigator.mediaDevices.getUserMedia(constraints.ideal)
    } catch (error) {
      console.warn("[v0] Ideal constraints failed, trying optimized...", error)

      try {
        return await navigator.mediaDevices.getUserMedia(constraints.optimized)
      } catch (fallbackError) {
        console.warn("[v0] Optimized constraints failed, trying basic...", fallbackError)

        try {
          // Fallback to basic constraints
          return await navigator.mediaDevices.getUserMedia(constraints.basic)
        } catch (basicError) {
          console.error("[v0] Basic constraints also failed", basicError)

          // Last resort: any video
          try {
            return await navigator.mediaDevices.getUserMedia({ video: true })
          } catch (lastError) {
            throw this.createError("CAMERA_UNAVAILABLE", "Could not access camera with any configuration", false)
          }
        }
      }
    }
  }

  /**
   * Build progressive constraint sets
   * Following industry best practices from 8th Wall and WebAR SDKs
   */
  private buildConstraints() {
    const idealConstraints: MediaStreamConstraints = {
      video: {
        facingMode: { ideal: this.config.facing },
        width: { ideal: this.config.width },
        height: { ideal: this.config.height },
        aspectRatio: { ideal: this.config.aspectRatio },
        frameRate: { ideal: 60 }, // 60fps for smoothest face tracking
      },
      audio: false,
    }

    const optimizedConstraints: MediaStreamConstraints = {
      video: {
        facingMode: { exact: this.config.facing },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      },
      audio: false,
    }

    const basicConstraints: MediaStreamConstraints = {
      video: {
        facingMode: this.config.facing,
      },
      audio: false,
    }

    return {
      ideal: idealConstraints,
      optimized: optimizedConstraints,
      basic: basicConstraints,
    }
  }

  /**
   * Switch between front/rear cameras
   */
  async switchCamera(facing?: CameraFacing): Promise<MediaStream> {
    if (facing) {
      this.config.facing = facing
    } else {
      // Toggle
      this.config.facing = this.config.facing === "user" ? "environment" : "user"
    }

    console.log("[v0] Switching camera to:", this.config.facing)

    // Stop current stream
    this.stop()

    // Reinitialize with new facing mode
    return this.initialize()
  }

  /**
   * Attach stream to video element with optimizations
   */
  attachToVideo(videoElement: HTMLVideoElement): void {
    if (!this.stream) {
      throw this.createError("NO_STREAM", "No active camera stream to attach", true)
    }

    videoElement.srcObject = this.stream
    videoElement.playsInline = true
    videoElement.muted = true

    if (this.config.facing === "user" && this.config.mirrorDisplay) {
      videoElement.style.transform = "scaleX(-1)"
    }

    videoElement.style.willChange = "transform"

    if (!this.performanceMonitor) {
      this.performanceMonitor = new PerformanceMonitor(videoElement)
    }

    // Auto-play with error handling
    videoElement.play().catch((error) => {
      console.error("[v0] Video play failed:", error)
      if (error.name === "NotAllowedError") {
        this.handleError(this.createError("AUTOPLAY_BLOCKED", "Autoplay was blocked. User interaction required.", true))
      }
    })
  }

  /**
   * Get current video track settings
   */
  getSettings(): MediaTrackSettings | null {
    const videoTrack = this.stream?.getVideoTracks()[0]
    return videoTrack?.getSettings() || null
  }

  /**
   * Get available camera devices
   */
  async getAvailableDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices.filter((device) => device.kind === "videoinput")
    } catch (error) {
      console.error("[v0] Failed to enumerate devices:", error)
      return []
    }
  }

  /**
   * Check if front camera is available
   */
  async hasFrontCamera(): Promise<boolean> {
    const devices = await this.getAvailableDevices()
    return devices.some((device) => device.label.toLowerCase().includes("front"))
  }

  /**
   * Stop camera stream
   */
  stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop()
        console.log("[v0] Stopped track:", track.label)
      })
      this.stream = null
      this.setState("idle")
    }
  }

  /**
   * State management
   */
  private setState(newState: CameraState): void {
    this.state = newState
    this.stateCallbacks.forEach((cb) => cb(newState))
  }

  getState(): CameraState {
    return this.state
  }

  onStateChange(callback: (state: CameraState) => void): () => void {
    this.stateCallbacks.push(callback)
    return () => {
      this.stateCallbacks = this.stateCallbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * Error handling
   */
  private createError(code: string, message: string, recoverable: boolean): CameraError {
    const userMessages: Record<string, string> = {
      NOT_SUPPORTED: "Your browser doesn't support camera access. Please use a modern browser.",
      CAMERA_UNAVAILABLE: "Could not access your camera. Please check permissions and try again.",
      PERMISSION_DENIED: "Camera access was denied. Please enable camera permissions in your browser settings.",
      CAMERA_IN_USE: "Camera is already in use by another application.",
      AUTOPLAY_BLOCKED: "Please tap to start the camera.",
      NO_STREAM: "No camera stream available.",
    }

    return {
      code,
      message,
      userMessage: userMessages[code] || "An error occurred with the camera.",
      recoverable,
    }
  }

  private handleError(error: any): void {
    let cameraError: CameraError

    if (error instanceof Error) {
      const errorName = error.name

      switch (errorName) {
        case "NotAllowedError":
        case "PermissionDeniedError":
          cameraError = this.createError("PERMISSION_DENIED", error.message, false)
          this.setState("denied")
          break

        case "NotFoundError":
        case "DevicesNotFoundError":
          cameraError = this.createError("CAMERA_UNAVAILABLE", error.message, true)
          this.setState("error")
          break

        case "NotReadableError":
        case "TrackStartError":
          cameraError = this.createError("CAMERA_IN_USE", error.message, true)
          this.setState("error")
          break

        default:
          cameraError = this.createError("UNKNOWN", error.message, true)
          this.setState("error")
      }
    } else if (typeof error === "object" && "code" in error) {
      cameraError = error as CameraError
    } else {
      cameraError = this.createError("UNKNOWN", String(error), true)
      this.setState("error")
    }

    console.error("[v0] Camera error:", cameraError)
    this.errorCallbacks.forEach((cb) => cb(cameraError))

    // Auto-retry for recoverable errors
    if (cameraError.recoverable && this.retryCount < this.maxRetries) {
      this.retryCount++
      console.log(`[v0] Retrying camera initialization (${this.retryCount}/${this.maxRetries})`)
      setTimeout(() => {
        this.initialize().catch(() => {
          // Final retry failed, error already handled
        })
      }, 1000 * this.retryCount)
    }
  }

  onError(callback: (error: CameraError) => void): () => void {
    this.errorCallbacks.push(callback)
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * Get real-time performance metrics
   * Critical for maintaining 30-60fps for smooth AR experiences
   */
  getPerformanceMetrics(): CameraPerformanceMetrics | null {
    return this.performanceMonitor?.getMetrics() || null
  }

  /**
   * Cleanup with performance monitoring cleanup
   */
  destroy(): void {
    this.stop()
    if (this.performanceMonitor) {
      this.performanceMonitor.destroy()
      this.performanceMonitor = null
    }
    this.errorCallbacks = []
    this.stateCallbacks = []
  }
}

// Singleton instance for app-wide use
let globalCameraManager: CameraManager | null = null

export function getCameraManager(config?: Partial<CameraConfig>): CameraManager {
  if (!globalCameraManager) {
    globalCameraManager = new CameraManager(config)
  }
  return globalCameraManager
}

export function resetCameraManager(): void {
  if (globalCameraManager) {
    globalCameraManager.destroy()
    globalCameraManager = null
  }
}

class PerformanceMonitor {
  private videoElement: HTMLVideoElement
  private frameCount = 0
  private startTime = performance.now()
  private lastFrameTime = performance.now()
  private droppedFrames = 0
  private rafId: number | null = null

  constructor(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement
    this.startMonitoring()
  }

  private startMonitoring(): void {
    const monitor = () => {
      const currentTime = performance.now()
      const deltaTime = currentTime - this.lastFrameTime

      // Track dropped frames (>33ms = dropped frame at 30fps)
      if (deltaTime > 33) {
        this.droppedFrames++
      }

      this.frameCount++
      this.lastFrameTime = currentTime

      this.rafId = requestAnimationFrame(monitor)
    }

    this.rafId = requestAnimationFrame(monitor)
  }

  getMetrics(): CameraPerformanceMetrics {
    const elapsedTime = (performance.now() - this.startTime) / 1000
    const fps = Math.round(this.frameCount / elapsedTime)

    return {
      fps,
      latency: performance.now() - this.lastFrameTime,
      droppedFrames: this.droppedFrames,
      resolution: {
        width: this.videoElement.videoWidth,
        height: this.videoElement.videoHeight,
      },
    }
  }

  destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
    }
  }
}
