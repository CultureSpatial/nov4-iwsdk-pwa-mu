// Shared types between Web PWA and Meta Horizon platforms
// This serves as the contract layer for cross-platform compatibility

// Platform identifier
export type Platform = "web" | "horizon" | "mobile-ar" | "vr"

// Asset format mappings
export interface AssetMapping {
  web: {
    format: "glb" | "gltf" | "fbx"
    path: string
  }
  horizon: {
    format: "fbx" | "obj"
    assetLibraryId: string
  }
  metadata: {
    name: string
    size: number
    optimized: boolean
    lastSync: Date
  }
}

// Component state synchronization
export interface ComponentState {
  id: string
  platform: Platform
  type: "photo-booth" | "cocktail-menu" | "interactive-plane" | "video-player"
  state: Record<string, any>
  lastUpdated: Date
}

// Event tracking schema (Customer.io compatible)
export interface CrossPlatformEvent {
  userId: string
  eventName: string
  platform: Platform
  properties: Record<string, any>
  timestamp: Date
}

// Video content (Tavus.io)
export interface VideoContent {
  id: string
  tavusPersonaId: string
  sourceUrl: string
  optimizedUrl: {
    web: string
    horizon: string
  }
  transcoding: {
    status: "pending" | "processing" | "complete" | "failed"
    progress: number
  }
}

// Transformation pipeline status
export interface TransformationStatus {
  phase: "scaffolding" | "transmutation" | "stabilization"
  progress: number
  lastSync: Date
  pendingChanges: number
  errors: TransformationError[]
}

export interface TransformationError {
  id: string
  severity: "low" | "medium" | "high" | "critical"
  source: "asset" | "code" | "sync" | "api"
  message: string
  timestamp: Date
}
