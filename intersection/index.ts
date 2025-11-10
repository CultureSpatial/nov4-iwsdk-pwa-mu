// Main intersection layer export

export * from "@/intersection/types"
export { assetBridge } from "@/intersection/asset-bridge"
export { stateSync } from "@/intersection/state-sync"
export { eventBridge } from "@/intersection/event-bridge"
export { transformationMonitor } from "@/intersection/transformation-monitor"

// Convenience function to initialize intersection layer
export async function initializeIntersection() {
  console.log("[v0] Initializing intersection layer...")

  // Start periodic event flushing (every 30 seconds)
  setInterval(async () => {
    const { eventBridge } = await import("@/intersection/event-bridge")
    await eventBridge.flushEvents()
  }, 30000)

  // Start periodic asset sync (every 2 minutes)
  setInterval(async () => {
    const { assetBridge } = await import("@/intersection/asset-bridge")
    await assetBridge.processSyncQueue()
  }, 120000)

  console.log("[v0] Intersection layer initialized")
}
