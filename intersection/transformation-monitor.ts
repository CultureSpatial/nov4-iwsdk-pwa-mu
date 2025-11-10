// Monitors the PWA → Horizon transformation pipeline

import type { TransformationStatus, TransformationError } from "@/intersection/types"
import { assetBridge } from "@/intersection/asset-bridge"
import { eventBridge } from "@/intersection/event-bridge"

export class TransformationMonitor {
  private status: TransformationStatus = {
    phase: "transmutation",
    progress: 0,
    lastSync: new Date(),
    pendingChanges: 0,
    errors: [],
  }

  // Update transformation phase
  setPhase(phase: TransformationStatus["phase"]): void {
    console.log(`[v0] Transformation phase changed: ${this.status.phase} → ${phase}`)
    this.status.phase = phase
    this.status.lastSync = new Date()
  }

  // Update progress (0-100)
  setProgress(progress: number): void {
    this.status.progress = Math.min(100, Math.max(0, progress))
  }

  // Log transformation error
  logError(error: Omit<TransformationError, "id" | "timestamp">): void {
    const fullError: TransformationError = {
      ...error,
      id: `err_${Date.now()}`,
      timestamp: new Date(),
    }

    console.error(`[v0] Transformation error:`, fullError)
    this.status.errors.push(fullError)

    // Track critical errors
    if (error.severity === "critical") {
      eventBridge.trackEvent("system", "transformation_error", "web", {
        error: fullError,
      })
    }
  }

  // Get current status
  getStatus(): TransformationStatus {
    // Update pending changes from asset bridge
    this.status.pendingChanges = assetBridge.getSyncQueueStatus().pending

    return { ...this.status }
  }

  // Get errors by severity
  getErrorsBySeverity(severity?: TransformationError["severity"]): TransformationError[] {
    if (!severity) return this.status.errors

    return this.status.errors.filter((err) => err.severity === severity)
  }

  // Clear errors
  clearErrors(): void {
    this.status.errors = []
  }

  // Run health check
  async runHealthCheck(): Promise<{
    healthy: boolean
    issues: string[]
  }> {
    const issues: string[] = []

    // Check for critical errors
    const criticalErrors = this.getErrorsBySeverity("critical")
    if (criticalErrors.length > 0) {
      issues.push(`${criticalErrors.length} critical errors detected`)
    }

    // Check asset sync queue
    const syncStatus = assetBridge.getSyncQueueStatus()
    if (syncStatus.pending > 10) {
      issues.push(`${syncStatus.pending} assets pending sync`)
    }

    // Check event queue
    const pendingEvents = eventBridge.getPendingEventCount()
    if (pendingEvents > 50) {
      issues.push(`${pendingEvents} events pending flush`)
    }

    return {
      healthy: issues.length === 0,
      issues,
    }
  }
}

export const transformationMonitor = new TransformationMonitor()
