// Cross-platform event tracking bridge

import type { CrossPlatformEvent, Platform } from "./types"

export class EventBridge {
  private eventQueue: CrossPlatformEvent[] = []
  private readonly MAX_QUEUE_SIZE = 100

  // Track event from any platform
  async trackEvent(
    userId: string,
    eventName: string,
    platform: Platform,
    properties: Record<string, any> = {},
  ): Promise<void> {
    const event: CrossPlatformEvent = {
      userId,
      eventName,
      platform,
      properties,
      timestamp: new Date(),
    }

    console.log(`[v0] Tracking event: ${eventName} from ${platform}`)

    // Add to queue
    this.eventQueue.push(event)
    if (this.eventQueue.length > this.MAX_QUEUE_SIZE) {
      await this.flushEvents()
    }
  }

  // Flush events to Customer.io
  async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return

    console.log(`[v0] Flushing ${this.eventQueue.length} events to Customer.io`)

    try {
      // Send to Customer.io Pipeline API
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: this.eventQueue,
          batch: true,
        }),
      })

      // Clear queue after successful flush
      this.eventQueue = []
    } catch (error) {
      console.error("[v0] Failed to flush events:", error)
    }
  }

  // Get pending event count
  getPendingEventCount(): number {
    return this.eventQueue.length
  }
}

export const eventBridge = new EventBridge()
