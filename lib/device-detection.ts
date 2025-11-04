// Enhanced device detection with multi-platform routing

export interface DeviceCapabilities {
  platform: "ios" | "android" | "desktop" | "vr" | "unknown"
  browser: string
  webxrSupported: boolean
  recommendedSDK: "meta-iwsdk" | "universal-ar" | "8thwall" | "static"
  deploymentTarget: "meta-horizon" | "mattercraft" | "8thwall-cloud" | "web"
}

export async function detectDeviceCapabilities(): Promise<DeviceCapabilities> {
  const userAgent = navigator.userAgent.toLowerCase()

  // Detect platform
  let platform: DeviceCapabilities["platform"] = "unknown"
  if (/quest|oculus/i.test(userAgent)) {
    platform = "vr"
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    platform = "ios"
  } else if (/android/i.test(userAgent)) {
    platform = "android"
  } else {
    platform = "desktop"
  }

  // Detect browser
  let browser = "unknown"
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = "safari"
  } else if (/chrome/i.test(userAgent)) {
    browser = "chrome"
  } else if (/firefox/i.test(userAgent)) {
    browser = "firefox"
  }

  // Check WebXR support
  let webxrSupported = false
  try {
    if ("xr" in navigator) {
      webxrSupported = await (navigator as any).xr.isSessionSupported("immersive-ar")
    }
  } catch (error) {
    console.log("[v0] WebXR check failed:", error)
  }

  // Determine recommended SDK and deployment target
  let recommendedSDK: DeviceCapabilities["recommendedSDK"] = "static"
  let deploymentTarget: DeviceCapabilities["deploymentTarget"] = "web"

  if (platform === "vr" || (platform === "desktop" && webxrSupported)) {
    recommendedSDK = "meta-iwsdk"
    deploymentTarget = "meta-horizon"
  } else if (platform === "ios" || platform === "android") {
    // Mobile devices → Mattercraft (Universal AR)
    recommendedSDK = "universal-ar"
    deploymentTarget = "mattercraft"
  }

  return {
    platform,
    browser,
    webxrSupported,
    recommendedSDK,
    deploymentTarget,
  }
}

export function getDeploymentURL(target: DeviceCapabilities["deploymentTarget"]): string {
  switch (target) {
    case "meta-horizon":
      return process.env.NEXT_PUBLIC_META_HORIZON_URL || "/ar/iwsdk"
    case "mattercraft":
      return process.env.NEXT_PUBLIC_MATTERCRAFT_URL || "/ar/demo"
    case "8thwall-cloud":
      return process.env.NEXT_PUBLIC_8THWALL_URL || "/ar/8thwall"
    case "web":
    default:
      return "/"
  }
}
