/**
 * QR Code Generation Utilities
 * Generates QR codes with UTM parameters for the Nov 4 event
 */

export interface QRCodeConfig {
  baseUrl: string
  utmCampaign?: string
  utmSource?: string
  utmMedium?: string
  scene?: string
}

/**
 * Generate a URL with UTM parameters for QR code
 */
export function generateQRUrl(config: QRCodeConfig): string {
  const { baseUrl, utmCampaign = "nov4_event", utmSource = "qr", utmMedium = "print", scene } = config

  const params = new URLSearchParams({
    utm_campaign: utmCampaign,
    utm_source: utmSource,
    utm_medium: utmMedium,
  })

  if (scene) {
    params.append("scene", scene)
  }

  return `${baseUrl}?${params.toString()}`
}

/**
 * Generate QR code URLs for all scenes
 */
export function generateAllQRUrls(baseUrl: string) {
  const scenes = [
    { id: "general", name: "General Entry", scene: undefined },
    { id: "photo_booth", name: "Photo Booth", scene: "photo_booth" },
    { id: "cocktails", name: "Cocktail Menu", scene: "cocktails" },
    { id: "scan", name: "AR Scan", scene: "scan" },
    { id: "mr_demo", name: "MR Demo", scene: "mr_demo" },
  ]

  return scenes.map((scene) => ({
    ...scene,
    url: generateQRUrl({
      baseUrl,
      scene: scene.scene,
    }),
  }))
}

/**
 * Generate QR code image URL using a QR code API
 * Uses qrcode.react or similar library in production
 */
export function generateQRImageUrl(url: string, size = 300): string {
  // Using a public QR code API for demonstration
  // In production, use a library like qrcode.react or generate server-side
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
}

/**
 * Parse UTM parameters from URL
 */
export function parseUTMParams(url: string) {
  const urlObj = new URL(url)
  return {
    campaign: urlObj.searchParams.get("utm_campaign"),
    source: urlObj.searchParams.get("utm_source"),
    medium: urlObj.searchParams.get("utm_medium"),
    scene: urlObj.searchParams.get("scene"),
  }
}
