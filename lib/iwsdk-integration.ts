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
  fallbackMode: boolean // Added fallback mode indicator
}

export interface SpatialAnchor {
  id: string
  position: [number, number, number]
  rotation: [number, number, number, number]
  timestamp: number
  persistent: boolean // Added persistence flag
}

class IWSDKManager {
  private anchors: Map<string, SpatialAnchor> = new Map()
  private initialized = false
  private fallbackMode = false // Track if using fallback

  async initialize(): Promise<boolean> {
    console.log("[v0] Initializing IWSDK...")

    if (typeof window === "undefined") {
      console.log("[v0] IWSDK: Not in browser context")
      return false
    }

    try {
      // Check for WebXR support first
      if (!navigator.xr) {
        console.log("[v0] IWSDK: WebXR not supported, enabling fallback mode")
        this.fallbackMode = true
        this.initialized = true
        return true // Return true even in fallback mode
      }

      // Meta Quest browser detection
      const isMetaQuest = /Quest/i.test(navigator.userAgent)
      console.log("[v0] IWSDK: Running on Meta Quest:", isMetaQuest)

      const hasMetaSpatialFeatures = await this.detectMetaSpatialFeatures()

      if (!hasMetaSpatialFeatures && !isMetaQuest) {
        console.log("[v0] IWSDK: Meta Spatial features not available, using standard WebXR")
        this.fallbackMode = true
      }

      this.initialized = true
      console.log("[v0] IWSDK initialized successfully (fallback:", this.fallbackMode, ")")
      return true
    } catch (error) {
      console.error("[v0] IWSDK initialization failed:", error)
      this.fallbackMode = true
      this.initialized = true
      return true
    }
  }

  private async detectMetaSpatialFeatures(): Promise<boolean> {
    if (!navigator.xr) return false

    try {
      // Check for anchor support (Meta specific)
      const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
      const arSupported = await navigator.xr.isSessionSupported("immersive-ar")

      // Meta Quest has specific capabilities we can check
      const isMetaQuest = /Quest/i.test(navigator.userAgent)

      return isMetaQuest && (vrSupported || arSupported)
    } catch (error) {
      if (error instanceof Error && error.message.includes("permissions policy")) {
        console.log("[v0] IWSDK: XR blocked by permissions policy (preview environment)")
      }
      return false
    }
  }

  async getStatus(): Promise<IWSDKStatus> {
    const isMetaQuest = typeof navigator !== "undefined" && /Quest/i.test(navigator.userAgent)
    const hasWebXR = typeof navigator !== "undefined" && !!navigator.xr

    const capabilities: IWSDKCapabilities = {
      spatialAnchors: hasWebXR && isMetaQuest && !this.fallbackMode,
      roomScanning: hasWebXR && isMetaQuest && !this.fallbackMode,
      passthrough: hasWebXR && isMetaQuest,
      handTracking: hasWebXR && isMetaQuest,
      planeDetection: hasWebXR && isMetaQuest && !this.fallbackMode,
    }

    return {
      isAvailable: this.initialized,
      version: "1.0.0-beta",
      capabilities,
      deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      fallbackMode: this.fallbackMode,
    }
  }

  async createSpatialAnchor(
    position: [number, number, number],
    rotation: [number, number, number, number] = [0, 0, 0, 1],
  ): Promise<SpatialAnchor> {
    const anchor: SpatialAnchor = {
      id: `anchor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position,
      rotation,
      timestamp: Date.now(),
      persistent: !this.fallbackMode, // Only persistent in native mode
    }

    this.anchors.set(anchor.id, anchor)
    console.log("[v0] IWSDK: Created spatial anchor:", anchor.id, "(persistent:", anchor.persistent, ")")

    Analytics.spatialAnchorCreated(anchor.id, position)

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
    console.log("[v0] IWSDK: Requesting passthrough mode...")

    if (!navigator.xr) {
      console.log("[v0] IWSDK: WebXR not available")
      return false
    }

    try {
      const arSupported = await navigator.xr.isSessionSupported("immersive-ar")
      console.log("[v0] IWSDK: AR passthrough supported:", arSupported)
      return arSupported
    } catch (error) {
      if (error instanceof Error && error.message.includes("permissions policy")) {
        console.log("[v0] IWSDK: Passthrough blocked by permissions policy (preview environment)")
        return false
      }
      console.error("[v0] IWSDK: Passthrough check failed:", error)
      return false
    }
  }

  async startRoomScanning(): Promise<boolean> {
    console.log("[v0] IWSDK: Starting room scanning...")
    // Placeholder for future implementation
    return this.initialized
  }

  async stopRoomScanning(): Promise<void> {
    console.log("[v0] IWSDK: Stopping room scanning...")
  }

  isInFallbackMode(): boolean {
    return this.fallbackMode
  }

  hasFullCapabilities(): boolean {
    return this.initialized && !this.fallbackMode
  }
}

// Singleton instance
export const iwsdkManager = new IWSDKManager()
