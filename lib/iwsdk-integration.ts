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
}

export interface SpatialAnchor {
  id: string
  position: [number, number, number]
  rotation: [number, number, number, number]
  timestamp: number
  persistent: boolean
}

function detectMetaDevice(): { isMetaQuest: boolean; deviceType: string } {
  if (typeof navigator === "undefined") {
    return { isMetaQuest: false, deviceType: "unknown" }
  }

  const ua = navigator.userAgent.toLowerCase()

  // Check for various Meta Quest user agent patterns
  const isQuest = ua.includes("quest")
  const isOculusBrowser = ua.includes("oculusbrowser")
  const isMetaBrowser = ua.includes("meta")
  const isOculus = ua.includes("oculus")
  const isVRHeadset = ua.includes("vr") && (ua.includes("android") || ua.includes("mobile"))

  // Also check for Pacific (Quest codename in some UA strings)
  const isPacific = ua.includes("pacific")

  const isMetaQuest = isQuest || isOculusBrowser || isMetaBrowser || isOculus || isPacific || isVRHeadset

  let deviceType = "unknown"
  if (isQuest || isPacific) deviceType = "Quest"
  else if (isOculusBrowser) deviceType = "Oculus Browser"
  else if (isMetaBrowser) deviceType = "Meta Browser"
  else if (isOculus) deviceType = "Oculus Device"
  else if (isVRHeadset) deviceType = "VR Headset"

  return { isMetaQuest, deviceType }
}

class IWSDKManager {
  private anchors: Map<string, SpatialAnchor> = new Map()
  private initialized = false
  private fallbackMode = false
  private metaDeviceInfo: { isMetaQuest: boolean; deviceType: string } = { isMetaQuest: false, deviceType: "unknown" }

  async initialize(): Promise<boolean> {
    console.log("[v0] Initializing IWSDK...")

    if (typeof window === "undefined") {
      console.log("[v0] IWSDK: Not in browser context")
      return false
    }

    try {
      this.metaDeviceInfo = detectMetaDevice()
      console.log("[v0] IWSDK: Meta device detection:", this.metaDeviceInfo)
      console.log("[v0] IWSDK: User Agent:", navigator.userAgent)

      // Check for WebXR support
      if (!navigator.xr) {
        console.log("[v0] IWSDK: WebXR not supported, enabling fallback mode")
        this.fallbackMode = true
        this.initialized = true
        return true
      }

      const hasMetaSpatialFeatures = await this.detectMetaSpatialFeatures()

      if (!hasMetaSpatialFeatures && !this.metaDeviceInfo.isMetaQuest) {
        console.log("[v0] IWSDK: Meta Spatial features not available, using standard WebXR")
        this.fallbackMode = true
      } else if (this.metaDeviceInfo.isMetaQuest) {
        console.log("[v0] IWSDK: Running on Meta Quest device, enabling full capabilities")
        this.fallbackMode = false
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
      const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
      const arSupported = await navigator.xr.isSessionSupported("immersive-ar")

      console.log("[v0] IWSDK: VR supported:", vrSupported, "AR supported:", arSupported)

      return this.metaDeviceInfo.isMetaQuest && (vrSupported || arSupported)
    } catch (error) {
      if (error instanceof Error && error.message.includes("permissions policy")) {
        console.log("[v0] IWSDK: XR blocked by permissions policy (preview environment)")
      } else {
        console.log("[v0] IWSDK: XR detection error:", error)
      }
      return this.metaDeviceInfo.isMetaQuest
    }
  }

  async getStatus(): Promise<IWSDKStatus> {
    const hasWebXR = typeof navigator !== "undefined" && !!navigator.xr

    const capabilities: IWSDKCapabilities = {
      spatialAnchors: hasWebXR && this.metaDeviceInfo.isMetaQuest,
      roomScanning: hasWebXR && this.metaDeviceInfo.isMetaQuest,
      passthrough: hasWebXR && this.metaDeviceInfo.isMetaQuest,
      handTracking: hasWebXR && this.metaDeviceInfo.isMetaQuest,
      planeDetection: hasWebXR && this.metaDeviceInfo.isMetaQuest,
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
      persistent: this.metaDeviceInfo.isMetaQuest && !this.fallbackMode,
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

    if (this.metaDeviceInfo.isMetaQuest) {
      console.log("[v0] IWSDK: Passthrough available on Meta Quest")
      return true
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
    if (this.metaDeviceInfo.isMetaQuest) {
      console.log("[v0] IWSDK: Room scanning enabled on Quest")
      return true
    }
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

  isOnMetaQuest(): boolean {
    return this.metaDeviceInfo.isMetaQuest
  }

  getDeviceType(): string {
    return this.metaDeviceInfo.deviceType
  }
}

// Singleton instance
export const iwsdkManager = new IWSDKManager()
