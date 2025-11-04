import { trackEvent } from "./analytics"

interface Asset {
  id: string
  name: string
  path: string
  format: string
  size: number
  checksum?: string
  approved: boolean
}

interface AssetManifest {
  version: string
  lastUpdated: string
  assets: {
    "3d_models": Asset[]
    overlays: Asset[]
    textures: Asset[]
  }
  scenes: Record<string, { name: string; assets: string[]; preload: boolean }>
}

class AssetLoader {
  private manifest: AssetManifest | null = null
  private loadedAssets: Map<string, any> = new Map()
  private loadingPromises: Map<string, Promise<any>> = new Map()

  async loadManifest(): Promise<AssetManifest> {
    if (this.manifest) return this.manifest

    try {
      const response = await fetch("/assets/manifest.json")
      this.manifest = await response.json()
      trackEvent("asset_manifest_loaded", {
        version: this.manifest.version,
        asset_count: this.getTotalAssetCount(),
      })
      return this.manifest
    } catch (error) {
      console.error("Failed to load asset manifest:", error)
      throw error
    }
  }

  private getTotalAssetCount(): number {
    if (!this.manifest) return 0
    return (
      this.manifest.assets["3d_models"].length +
      this.manifest.assets.overlays.length +
      this.manifest.assets.textures.length
    )
  }

  async loadAsset(assetId: string): Promise<any> {
    // Return cached asset if already loaded
    if (this.loadedAssets.has(assetId)) {
      return this.loadedAssets.get(assetId)
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(assetId)) {
      return this.loadingPromises.get(assetId)
    }

    // Start loading
    const loadPromise = this._loadAsset(assetId)
    this.loadingPromises.set(assetId, loadPromise)

    try {
      const asset = await loadPromise
      this.loadedAssets.set(assetId, asset)
      this.loadingPromises.delete(assetId)
      return asset
    } catch (error) {
      this.loadingPromises.delete(assetId)
      throw error
    }
  }

  private async _loadAsset(assetId: string): Promise<any> {
    if (!this.manifest) {
      await this.loadManifest()
    }

    const asset = this.findAsset(assetId)
    if (!asset) {
      throw new Error(`Asset not found: ${assetId}`)
    }

    if (!asset.approved) {
      console.warn(`Asset ${assetId} is not approved, using fallback`)
      trackEvent("asset_not_approved", { asset_id: assetId })
      return this.getFallbackAsset(asset.format)
    }

    const startTime = Date.now()

    try {
      const response = await fetch(asset.path)
      if (!response.ok) {
        throw new Error(`Failed to fetch asset: ${response.statusText}`)
      }

      let loadedAsset: any

      if (asset.format === "glb" || asset.format === "gltf") {
        // For 3D models, return the URL for Three.js loaders
        loadedAsset = asset.path
      } else if (asset.format === "png" || asset.format === "jpg") {
        // For images, create an Image object
        loadedAsset = await this.loadImage(asset.path)
      } else {
        // For other formats, return the blob
        loadedAsset = await response.blob()
      }

      const loadTime = Date.now() - startTime
      trackEvent("asset_loaded", {
        asset_id: assetId,
        format: asset.format,
        size: asset.size,
        load_time: loadTime,
      })

      return loadedAsset
    } catch (error) {
      console.error(`Failed to load asset ${assetId}:`, error)
      trackEvent("asset_load_error", {
        asset_id: assetId,
        error: String(error),
      })
      return this.getFallbackAsset(asset.format)
    }
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  private findAsset(assetId: string): Asset | null {
    if (!this.manifest) return null

    for (const category of Object.values(this.manifest.assets)) {
      const asset = category.find((a) => a.id === assetId)
      if (asset) return asset
    }

    return null
  }

  private getFallbackAsset(format: string): any {
    // Return placeholder assets based on format
    if (format === "glb" || format === "gltf") {
      return "/assets/3d/duck.glb" // Use the built-in duck model
    } else if (format === "png" || format === "jpg") {
      return "/fallback-mechanism.png"
    }
    return null
  }

  async preloadScene(sceneId: string): Promise<void> {
    if (!this.manifest) {
      await this.loadManifest()
    }

    const scene = this.manifest?.scenes[sceneId]
    if (!scene) {
      console.warn(`Scene not found: ${sceneId}`)
      return
    }

    if (!scene.preload) {
      return
    }

    const startTime = Date.now()
    const assetPromises = scene.assets.map((assetId) => this.loadAsset(assetId))

    try {
      await Promise.all(assetPromises)
      const loadTime = Date.now() - startTime
      trackEvent("scene_preloaded", {
        scene_id: sceneId,
        asset_count: scene.assets.length,
        load_time: loadTime,
      })
    } catch (error) {
      console.error(`Failed to preload scene ${sceneId}:`, error)
      trackEvent("scene_preload_error", {
        scene_id: sceneId,
        error: String(error),
      })
    }
  }

  clearCache(): void {
    this.loadedAssets.clear()
    this.loadingPromises.clear()
    trackEvent("asset_cache_cleared", {})
  }
}

export const assetLoader = new AssetLoader()
