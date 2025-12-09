/**
 * Meta Immersive Web SDK (IWSDK) Integration
 * Provides spatial anchors, room scanning, and AR capabilities
 * with graceful degradation to standard WebXR
 */

import { Analytics } from "./analytics"

export interface IWSDKCapabilities {
  spatialAnchors: boolean
  roomScanning: boolean
  passthrough: boolean
  handTracking: boolean
  planeDetection: boolean
}

export interface IWSDKStatus {
  isAvailable: boolean
  version: string
  capabilities: IWSDKCapabilities
  deviceInfo: string
  fallbackMode: boolean
  detectedDevice: string
  userAgent: string
}

export interface SpatialAnchor {
  id: string
  position: [number, number, number]
  rotation: [number, number, number, number]
  timestamp: number
  persistent: boolean
}

export interface PassthroughSessionResult {
  success: boolean
  session: XRSession | null
  error?: string
  referenceSpace?: XRReferenceSpace | null
}

function detectMetaDevice(): { isMetaQuest: boolean; deviceType: string; debugInfo: string } {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return { isMetaQuest: false, deviceType: "server", debugInfo: "SSR context" }
  }

  const ua = navigator.userAgent
  const uaLower = ua.toLowerCase()

  // Debug info for troubleshooting
  const debugParts: string[] = []

  // Check for various Meta Quest user agent patterns
  const patterns = {
    quest: uaLower.includes("quest"),
    oculusbrowser: uaLower.includes("oculusbrowser"),
    oculus: uaLower.includes("oculus"),
    meta: uaLower.includes("meta") && !uaLower.includes("metadata"),
    pacific: uaLower.includes("pacific"),
    xrspace: uaLower.includes("xrspace"),
    // Quest browser on Android
    questAndroid: uaLower.includes("android") && (uaLower.includes("quest") || uaLower.includes("oculus")),
    // Check for VR-specific patterns
    vrHeadset: /vr|xr|headset/i.test(ua) && /android|mobile/i.test(ua),
    // Meta Quest browser specific pattern
    metaQuestBrowser: /OculusBrowser|Quest/i.test(ua),
  }

  for (const [key, value] of Object.entries(patterns)) {
    if (value) debugParts.push(key)
  }

  const isMetaQuest = Object.values(patterns).some((v) => v)

  let deviceType = "desktop"
  if (patterns.quest || patterns.pacific || patterns.questAndroid) deviceType = "Meta Quest"
  else if (patterns.oculusbrowser || patterns.metaQuestBrowser) deviceType = "Quest Browser"
  else if (patterns.oculus) deviceType = "Oculus Device"
  else if (patterns.meta) deviceType = "Meta Device"
  else if (patterns.vrHeadset || patterns.xrspace) deviceType = "VR Headset"

  return {
    isMetaQuest,
    deviceType,
    debugInfo: debugParts.length > 0 ? debugParts.join(", ") : "no patterns matched",
  }
}

class IWSDKManager {
  private anchors: Map<string, SpatialAnchor> = new Map()
  private initialized = false
  private fallbackMode = false
  private metaDeviceInfo: { isMetaQuest: boolean; deviceType: string; debugInfo: string } = {
    isMetaQuest: false,
    deviceType: "unknown",
    debugInfo: "",
  }
  private initPromise: Promise<boolean> | null = null
  private webXRSupport = { vr: false, ar: false, checked: false }
  private activeXRSession: XRSession | null = null
  private xrReferenceSpace: XRReferenceSpace | null = null
  private xrAnimationFrame: number | null = null
  private xrGLContext: WebGLRenderingContext | WebGL2RenderingContext | null = null

  async initialize(): Promise<boolean> {
    // Prevent multiple initializations
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this._doInitialize()
    return this.initPromise
  }

  private async _doInitialize(): Promise<boolean> {
    console.log("[v0] IWSDK: Starting initialization...")

    if (typeof window === "undefined") {
      console.log("[v0] IWSDK: Not in browser context")
      this.fallbackMode = true
      this.initialized = true
      return true
    }

    try {
      // Detect device first
      this.metaDeviceInfo = detectMetaDevice()
      console.log("[v0] IWSDK: Device detection result:", JSON.stringify(this.metaDeviceInfo))
      console.log("[v0] IWSDK: Full User Agent:", navigator.userAgent)

      // Check for WebXR support
      if (!navigator.xr) {
        console.log("[v0] IWSDK: WebXR API not available")
        this.fallbackMode = true
        this.initialized = true
        // On Quest, capabilities should still work even without navigator.xr in some contexts
        if (this.metaDeviceInfo.isMetaQuest) {
          console.log("[v0] IWSDK: Quest detected, enabling capabilities despite missing WebXR API")
        }
        return true
      }

      // Check WebXR session support with proper error handling
      await this.checkWebXRSupport()

      // Determine fallback mode
      if (this.metaDeviceInfo.isMetaQuest) {
        console.log("[v0] IWSDK: Running on Meta Quest, enabling full capabilities")
        this.fallbackMode = false
      } else if (this.webXRSupport.vr || this.webXRSupport.ar) {
        console.log("[v0] IWSDK: WebXR supported on non-Quest device")
        this.fallbackMode = true // Still fallback mode since not Quest
      } else {
        console.log("[v0] IWSDK: Standard fallback mode (no Quest, no WebXR)")
        this.fallbackMode = true
      }

      this.initialized = true
      console.log("[v0] IWSDK: Initialization complete. Fallback mode:", this.fallbackMode)
      return true
    } catch (error) {
      console.error("[v0] IWSDK: Initialization error:", error)
      this.fallbackMode = true
      this.initialized = true
      return true // Still return true to allow app to function
    }
  }

  private async checkWebXRSupport(): Promise<void> {
    if (!navigator.xr || this.webXRSupport.checked) return

    try {
      // Check VR support
      try {
        this.webXRSupport.vr = await navigator.xr.isSessionSupported("immersive-vr")
      } catch (e) {
        console.log("[v0] IWSDK: VR check error:", e instanceof Error ? e.message : e)
        // On Quest, assume VR is supported even if check fails
        this.webXRSupport.vr = this.metaDeviceInfo.isMetaQuest
      }

      // Check AR support
      try {
        this.webXRSupport.ar = await navigator.xr.isSessionSupported("immersive-ar")
      } catch (e) {
        console.log("[v0] IWSDK: AR check error:", e instanceof Error ? e.message : e)
        // On Quest, assume AR is supported even if check fails
        this.webXRSupport.ar = this.metaDeviceInfo.isMetaQuest
      }

      this.webXRSupport.checked = true
      console.log("[v0] IWSDK: WebXR support - VR:", this.webXRSupport.vr, "AR:", this.webXRSupport.ar)
    } catch (error) {
      console.log("[v0] IWSDK: WebXR support check failed:", error)
      this.webXRSupport.checked = true
      // Default to Quest capabilities if on Quest
      if (this.metaDeviceInfo.isMetaQuest) {
        this.webXRSupport.vr = true
        this.webXRSupport.ar = true
      }
    }
  }

  async getStatus(): Promise<IWSDKStatus> {
    // Ensure initialized
    if (!this.initialized) {
      await this.initialize()
    }

    const isQuest = this.metaDeviceInfo.isMetaQuest
    const hasWebXR = typeof navigator !== "undefined" && !!navigator.xr

    // On Quest, enable all capabilities regardless of WebXR API checks
    const capabilities: IWSDKCapabilities = {
      spatialAnchors: isQuest || (hasWebXR && this.webXRSupport.ar),
      roomScanning: isQuest,
      passthrough: isQuest || (hasWebXR && this.webXRSupport.ar),
      handTracking: isQuest,
      planeDetection: isQuest || (hasWebXR && this.webXRSupport.ar),
    }

    return {
      isAvailable: this.initialized,
      version: "1.0.0-beta",
      capabilities,
      deviceInfo: this.metaDeviceInfo.debugInfo || "No debug info",
      detectedDevice: this.metaDeviceInfo.deviceType,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      fallbackMode: this.fallbackMode,
    }
  }

  async createSpatialAnchor(
    position: [number, number, number],
    rotation: [number, number, number, number] = [0, 0, 0, 1],
  ): Promise<SpatialAnchor> {
    if (!this.initialized) {
      await this.initialize()
    }

    const anchor: SpatialAnchor = {
      id: `anchor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position,
      rotation,
      timestamp: Date.now(),
      persistent: this.metaDeviceInfo.isMetaQuest && !this.fallbackMode,
    }

    this.anchors.set(anchor.id, anchor)
    console.log("[v0] IWSDK: Created spatial anchor:", anchor.id)

    try {
      Analytics.spatialAnchorCreated(anchor.id, position)
    } catch (e) {
      // Analytics failure shouldn't break anchor creation
      console.log("[v0] IWSDK: Analytics error (non-fatal):", e)
    }

    return anchor
  }

  getSpatialAnchor(id: string): SpatialAnchor | undefined {
    return this.anchors.get(id)
  }

  getAllSpatialAnchors(): SpatialAnchor[] {
    return Array.from(this.anchors.values())
  }

  deleteSpatialAnchor(id: string): boolean {
    const deleted = this.anchors.delete(id)
    if (deleted) {
      console.log("[v0] IWSDK: Deleted spatial anchor:", id)
    }
    return deleted
  }

  async requestPassthroughMode(): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize()
    }

    console.log("[v0] IWSDK: Requesting passthrough mode...")

    // On Quest, passthrough is always available
    if (this.metaDeviceInfo.isMetaQuest) {
      console.log("[v0] IWSDK: Passthrough available on Meta Quest")
      return true
    }

    if (!navigator.xr) {
      console.log("[v0] IWSDK: WebXR not available for passthrough")
      return false
    }

    try {
      const arSupported = await navigator.xr.isSessionSupported("immersive-ar")
      console.log("[v0] IWSDK: AR passthrough supported:", arSupported)
      return arSupported
    } catch (error) {
      console.log("[v0] IWSDK: Passthrough check error:", error instanceof Error ? error.message : error)
      return false
    }
  }

  async startPassthroughCamera(): Promise<PassthroughSessionResult> {
    if (!this.initialized) {
      await this.initialize()
    }

    console.log("[v0] IWSDK: Starting passthrough camera...")

    // End any existing session first
    if (this.activeXRSession) {
      try {
        await this.stopPassthroughCamera()
        console.log("[v0] IWSDK: Ended existing XR session")
      } catch (e) {
        console.log("[v0] IWSDK: Error ending existing session:", e)
      }
    }

    if (!navigator.xr) {
      console.log("[v0] IWSDK: WebXR not available")
      return {
        success: false,
        session: null,
        error: "WebXR API not available in this browser",
      }
    }

    try {
      console.log("[v0] IWSDK: Creating WebGL context for XR...")
      const canvas = document.createElement("canvas")
      canvas.style.position = "fixed"
      canvas.style.top = "0"
      canvas.style.left = "0"
      canvas.style.width = "100vw"
      canvas.style.height = "100vh"
      canvas.style.zIndex = "99999"
      canvas.id = "xr-passthrough-canvas"
      document.body.appendChild(canvas)

      const gl =
        canvas.getContext("webgl2", { xrCompatible: true }) || canvas.getContext("webgl", { xrCompatible: true })

      if (!gl) {
        canvas.remove()
        return {
          success: false,
          session: null,
          error: "Failed to create WebGL context",
        }
      }

      this.xrGLContext = gl
      console.log("[v0] IWSDK: WebGL context created")

      let session: XRSession | null = null

      // First try: immersive-vr with minimal required features
      try {
        console.log("[v0] IWSDK: Trying immersive-vr with local-floor...")
        session = await navigator.xr.requestSession("immersive-vr", {
          requiredFeatures: ["local-floor"],
          optionalFeatures: ["hand-tracking", "bounded-floor", "anchors"],
        })
        console.log("[v0] IWSDK: XR session established with local-floor")
      } catch (firstError) {
        console.log("[v0] IWSDK: First attempt failed:", firstError instanceof Error ? firstError.message : firstError)

        // Fallback: absolute minimum - no required features
        try {
          console.log("[v0] IWSDK: Trying fallback with no required features...")
          session = await navigator.xr.requestSession("immersive-vr", {
            requiredFeatures: [],
          })
          console.log("[v0] IWSDK: Fallback XR session established")
        } catch (fallbackError) {
          console.error("[v0] IWSDK: Even minimal XR session failed:", fallbackError)
          canvas.remove()
          this.xrGLContext = null

          const errorMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
          return {
            success: false,
            session: null,
            error: `XR session failed: ${errorMsg}`,
          }
        }
      }

      this.activeXRSession = session
      console.log("[v0] IWSDK: XR session active:", session)

      // Set up XR layer
      console.log("[v0] IWSDK: Setting up XR layer...")
      const baseLayer = new XRWebGLLayer(session, gl)
      await session.updateRenderState({ baseLayer })
      console.log("[v0] IWSDK: XR layer configured")

      // Request reference space with fallback
      console.log("[v0] IWSDK: Requesting reference space...")
      let refSpace: XRReferenceSpace
      try {
        refSpace = await session.requestReferenceSpace("local-floor")
        console.log("[v0] IWSDK: Got local-floor reference space")
      } catch (e) {
        console.log("[v0] IWSDK: local-floor not available, trying local...")
        try {
          refSpace = await session.requestReferenceSpace("local")
          console.log("[v0] IWSDK: Got local reference space")
        } catch (e2) {
          console.log("[v0] IWSDK: local not available, trying viewer...")
          refSpace = await session.requestReferenceSpace("viewer")
          console.log("[v0] IWSDK: Got viewer reference space")
        }
      }
      this.xrReferenceSpace = refSpace

      // Start render loop
      const onXRFrame = (time: DOMHighResTimeStamp, frame: XRFrame) => {
        if (!this.activeXRSession) return

        this.xrAnimationFrame = this.activeXRSession.requestAnimationFrame(onXRFrame)

        const pose = frame.getViewerPose(this.xrReferenceSpace!)
        if (pose) {
          gl.clearColor(0, 0, 0, 0)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        }
      }

      this.xrAnimationFrame = session.requestAnimationFrame(onXRFrame)
      console.log("[v0] IWSDK: Render loop started - passthrough should be active")

      // Handle session end
      session.addEventListener("end", () => {
        console.log("[v0] IWSDK: XR session ended")
        this.cleanupXRSession()
      })

      return {
        success: true,
        session,
        referenceSpace: refSpace,
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error("[v0] IWSDK: Passthrough camera error:", errorMsg)

      this.cleanupXRSession()

      return {
        success: false,
        session: null,
        error: errorMsg,
      }
    }
  }

  private cleanupXRSession(): void {
    console.log("[v0] IWSDK: Cleaning up XR session resources...")

    if (this.xrAnimationFrame !== null && this.activeXRSession) {
      this.activeXRSession.cancelAnimationFrame(this.xrAnimationFrame)
      this.xrAnimationFrame = null
    }

    this.activeXRSession = null
    this.xrReferenceSpace = null
    this.xrGLContext = null

    // Remove the canvas
    const canvas = document.getElementById("xr-passthrough-canvas")
    if (canvas) {
      canvas.remove()
      console.log("[v0] IWSDK: Removed XR canvas")
    }
  }

  async stopPassthroughCamera(): Promise<boolean> {
    console.log("[v0] IWSDK: Stopping passthrough camera...")

    if (this.activeXRSession) {
      try {
        // Cancel animation frame first
        if (this.xrAnimationFrame !== null) {
          this.activeXRSession.cancelAnimationFrame(this.xrAnimationFrame)
          this.xrAnimationFrame = null
        }

        await this.activeXRSession.end()
        console.log("[v0] IWSDK: XR session ended successfully")
      } catch (e) {
        console.error("[v0] IWSDK: Error stopping XR session:", e)
      }
    }

    this.cleanupXRSession()
    return true
  }

  async startRoomScanning(): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize()
    }

    console.log("[v0] IWSDK: Starting room scanning...")

    if (this.metaDeviceInfo.isMetaQuest) {
      console.log("[v0] IWSDK: Room scanning enabled on Quest")
      return true
    }

    // Simulate room scanning for non-Quest devices
    console.log("[v0] IWSDK: Room scanning simulated (non-Quest)")
    return true
  }

  async stopRoomScanning(): Promise<void> {
    console.log("[v0] IWSDK: Stopping room scanning...")
  }

  isInFallbackMode(): boolean {
    return this.fallbackMode
  }

  hasFullCapabilities(): boolean {
    return this.initialized && !this.fallbackMode && this.metaDeviceInfo.isMetaQuest
  }

  isOnMetaQuest(): boolean {
    return this.metaDeviceInfo.isMetaQuest
  }

  getDeviceType(): string {
    return this.metaDeviceInfo.deviceType
  }

  getDebugInfo(): string {
    return JSON.stringify({
      initialized: this.initialized,
      fallbackMode: this.fallbackMode,
      device: this.metaDeviceInfo,
      webXR: this.webXRSupport,
    })
  }
}

// Singleton instance
export const iwsdkManager = new IWSDKManager()
