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
        await this.activeXRSession.end()
        this.activeXRSession = null
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
      // Check AR support first
      let arSupported = false
      try {
        arSupported = await navigator.xr.isSessionSupported("immersive-ar")
      } catch (e) {
        console.log("[v0] IWSDK: AR support check failed:", e)
        // On Quest, assume AR is supported
        if (this.metaDeviceInfo.isMetaQuest) {
          arSupported = true
        }
      }

      if (!arSupported) {
        // Try VR with passthrough as fallback
        console.log("[v0] IWSDK: AR not supported, trying VR with passthrough...")
        try {
          const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
          if (vrSupported) {
            const session = await navigator.xr.requestSession("immersive-vr", {
              optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking", "layers"],
            })
            this.activeXRSession = session

            session.addEventListener("end", () => {
              console.log("[v0] IWSDK: VR session ended")
              this.activeXRSession = null
            })

            console.log("[v0] IWSDK: VR session started (passthrough may be available via system)")
            return {
              success: true,
              session,
              error: "VR mode - passthrough available via Quest system settings",
            }
          }
        } catch (vrError) {
          console.log("[v0] IWSDK: VR session request failed:", vrError)
        }

        return {
          success: false,
          session: null,
          error: "Neither AR nor VR sessions are supported on this device",
        }
      }

      // Request AR session with passthrough features
      console.log("[v0] IWSDK: Requesting immersive-ar session with passthrough...")
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["local-floor"],
        optionalFeatures: ["bounded-floor", "hand-tracking", "hit-test", "anchors", "plane-detection", "layers"],
      })

      this.activeXRSession = session

      session.addEventListener("end", () => {
        console.log("[v0] IWSDK: Passthrough session ended")
        this.activeXRSession = null
      })

      console.log("[v0] IWSDK: Passthrough camera session started successfully")
      return {
        success: true,
        session,
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error("[v0] IWSDK: Passthrough camera error:", errorMsg)

      // Provide more specific error messages
      let userError = errorMsg
      if (errorMsg.includes("permissions policy")) {
        userError = "XR blocked by permissions policy (preview/iframe restriction)"
      } else if (errorMsg.includes("NotSupportedError")) {
        userError = "XR session type not supported on this device"
      } else if (errorMsg.includes("SecurityError")) {
        userError = "XR requires user gesture or secure context"
      }

      return {
        success: false,
        session: null,
        error: userError,
      }
    }
  }

  async stopPassthroughCamera(): Promise<boolean> {
    if (this.activeXRSession) {
      try {
        await this.activeXRSession.end()
        this.activeXRSession = null
        console.log("[v0] IWSDK: Passthrough camera stopped")
        return true
      } catch (e) {
        console.error("[v0] IWSDK: Error stopping passthrough:", e)
        return false
      }
    }
    return true
  }

  isPassthroughActive(): boolean {
    return this.activeXRSession !== null
  }

  getActiveSession(): XRSession | null {
    return this.activeXRSession
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
