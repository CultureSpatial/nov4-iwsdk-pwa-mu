// Cross-platform state synchronization

import type { ComponentState, Platform } from "@/intersection/types"

export class StateSyncManager {
  private stateCache: Map<string, ComponentState> = new Map()
  private subscribers: Map<string, Set<(state: ComponentState) => void>> = new Map()

  // Update component state from any platform
  updateState(componentId: string, platform: Platform, newState: Record<string, any>): void {
    console.log(`[v0] Updating state for ${componentId} from ${platform}`)

    const componentState: ComponentState = {
      id: componentId,
      platform,
      type: this.inferComponentType(componentId),
      state: newState,
      lastUpdated: new Date(),
    }

    this.stateCache.set(componentId, componentState)
    this.notifySubscribers(componentId, componentState)
  }

  // Subscribe to state changes
  subscribe(componentId: string, callback: (state: ComponentState) => void): () => void {
    if (!this.subscribers.has(componentId)) {
      this.subscribers.set(componentId, new Set())
    }
    this.subscribers.get(componentId)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.subscribers.get(componentId)?.delete(callback)
    }
  }

  // Get current state
  getState(componentId: string): ComponentState | null {
    return this.stateCache.get(componentId) || null
  }

  private notifySubscribers(componentId: string, state: ComponentState): void {
    const subs = this.subscribers.get(componentId)
    if (subs) {
      subs.forEach((callback) => callback(state))
    }
  }

  private inferComponentType(componentId: string): ComponentState["type"] {
    if (componentId.includes("photo")) return "photo-booth"
    if (componentId.includes("cocktail")) return "cocktail-menu"
    if (componentId.includes("video")) return "video-player"
    return "interactive-plane"
  }
}

export const stateSync = new StateSyncManager()
