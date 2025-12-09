"use client"

/**
 * Intersection Layer: Event Bridge
 *
 * Unified event routing between Web PWA, Meta Horizon, and Mobile AR platforms.
 * All events flow through this bridge to Amplitude + Customer.io.
 */

import { Analytics } from "@/lib/analytics"

export interface BridgedEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  platform: "web" | "horizon" | "mobile"
  timestamp?: number
}

export class EventBridge {
  private static instance: EventBridge | null = null
  private eventQueue: BridgedEvent[] = []
  private isOnline = true

  private constructor() {
    // Monitor online/offline status
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.isOnline = true
        this.flushQueue()
      })
      window.addEventListener("offline", () => {
        this.isOnline = false
      })
    }
  }

  static getInstance(): EventBridge {
    if (!EventBridge.instance) {
      EventBridge.instance = new EventBridge()
    }
    return EventBridge.instance
  }

  /**
   * Track event from any platform
   */
  async trackEvent(event: BridgedEvent): Promise<void> {
    // Enrich with timestamp if not provided
    const enrichedEvent: BridgedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
    }

    // Queue if offline
    if (!this.isOnline) {
      this.eventQueue.push(enrichedEvent)
      console.log("[v0] Event queued (offline):", enrichedEvent.event)
      return
    }

    try {
      // Route to analytics
      Analytics.trackEvent({
        event: enrichedEvent.event,
        properties: enrichedEvent.properties,
        userId: enrichedEvent.userId,
        platform: enrichedEvent.platform,
      })

      console.log("[v0] Event bridged:", enrichedEvent.event, enrichedEvent.platform)
    } catch (error) {
      console.error("[v0] Event bridge error:", error)
      // Queue for retry
      this.eventQueue.push(enrichedEvent)
    }
  }

  /**
   * Flush queued events when back online
   */
  private async flushQueue(): Promise<void> {
    console.log(`[v0] Flushing ${this.eventQueue.length} queued events`)

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()
      if (event) {
        await this.trackEvent(event)
      }
    }
  }

  /**
   * Platform-specific helpers
   */

  // Web PWA events
  trackWebEvent(event: string, properties?: Record<string, any>, userId?: string): void {
    this.trackEvent({
      event,
      properties,
      userId,
      platform: "web",
    })
  }

  // Meta Horizon VR events
  trackHorizonEvent(event: string, properties?: Record<string, any>, userId?: string): void {
    this.trackEvent({
      event,
      properties,
      userId,
      platform: "horizon",
    })
  }

  // Mobile AR events
  trackMobileEvent(event: string, properties?: Record<string, any>, userId?: string): void {
    this.trackEvent({
      event,
      properties,
      userId,
      platform: "mobile",
    })
  }

  /**
   * Common event patterns
   */

  // AR Session lifecycle
  trackSessionStart(platform: "web" | "horizon" | "mobile", sessionId: string, userId?: string): void {
    this.trackEvent({
      event: "ar_session_started",
      properties: { session_id: sessionId },
      userId,
      platform,
    })
  }

  trackSessionEnd(platform: "web" | "horizon" | "mobile", sessionId: string, duration: number, userId?: string): void {
    this.trackEvent({
      event: "ar_session_ended",
      properties: { session_id: sessionId, duration_seconds: duration },
      userId,
      platform,
    })
  }

  // Photo booth
  trackPhotoCapture(platform: "web" | "horizon" | "mobile", filterId?: string, userId?: string): void {
    this.trackEvent({
      event: "photo_captured",
      properties: { filter_id: filterId },
      userId,
      platform,
    })
  }

  trackPhotoShare(platform: "web" | "horizon" | "mobile", shareMethod: string, userId?: string): void {
    this.trackEvent({
      event: "photo_shared",
      properties: { share_method: shareMethod },
      userId,
      platform,
    })
  }

  // Cocktail menu
  trackCocktailView(
    platform: "web" | "horizon" | "mobile",
    cocktailId: string,
    cocktailName: string,
    userId?: string,
  ): void {
    this.trackEvent({
      event: "cocktail_viewed",
      properties: { cocktail_id: cocktailId, cocktail_name: cocktailName },
      userId,
      platform,
    })
  }

  trackCocktailOrder(
    platform: "web" | "horizon" | "mobile",
    cocktailId: string,
    cocktailName: string,
    price: number,
    userId?: string,
  ): void {
    this.trackEvent({
      event: "cocktail_ordered",
      properties: { cocktail_id: cocktailId, cocktail_name: cocktailName, price },
      userId,
      platform,
    })
  }

  // Gestures
  trackGesture(platform: "web" | "horizon" | "mobile", gestureType: string, userId?: string): void {
    this.trackEvent({
      event: "gesture_performed",
      properties: { gesture_type: gestureType },
      userId,
      platform,
    })
  }

  // Conversion funnel
  trackGemScan(venueId: string, gemId: string, userId?: string): void {
    this.trackEvent({
      event: "gem_scanned",
      properties: { venue_id: venueId, gem_id: gemId },
      userId,
      platform: "web", // Gem scans typically on web
    })
  }

  trackCheckoutStart(amount: number, items: any[], userId?: string): void {
    this.trackEvent({
      event: "checkout_started",
      properties: { amount, items },
      userId,
      platform: "web",
    })
  }

  trackPurchaseComplete(amount: number, orderId: string, userId?: string): void {
    this.trackEvent({
      event: "purchase_completed",
      properties: { amount, order_id: orderId, revenue: amount },
      userId,
      platform: "web",
    })
  }
}

// Export singleton instance
export const eventBridge = EventBridge.getInstance()
