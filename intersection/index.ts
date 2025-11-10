// Main intersection layer export

export * from "./types"
export { assetBridge } from "./asset-bridge"
export { stateSync } from "./state-sync"
export { eventBridge } from "./event-bridge"
export { transformationMonitor } from "./transformation-monitor"

// Convenience function to initialize intersection layer
export async function initializeIntersection() {
  console.log("[v0] Initializing intersection layer...")

  // Start periodic event flushing (every 30 seconds)
  setInterval(async () => {
    const { eventBridge } = await import("./event-bridge")
    await eventBridge.flushEvents()
  }, 30000)

  // Start periodic asset sync (every 2 minutes)
  setInterval(async () => {
    const { assetBridge } = await import("./asset-bridge")
    await assetBridge.processSyncQueue()
  }, 120000)

  console.log("[v0] Intersection layer initialized")
}
