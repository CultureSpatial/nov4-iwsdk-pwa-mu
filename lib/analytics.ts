"use client"

import * as amplitude from "@amplitude/analytics-browser"

let amplitudeInitialized = false

export function initializeAmplitude() {
  if (typeof window === "undefined" || amplitudeInitialized) return

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
  if (apiKey) {
    amplitude.init(apiKey, {
      defaultTracking: {
        sessions: true,
        pageViews: true,
        formInteractions: true,
        fileDownloads: true,
      },
    })
    amplitudeInitialized = true
    console.log("[v0] Amplitude initialized")
  }
}

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  platform?: "web" | "horizon" | "mobile"
}

export function trackEvent(data: AnalyticsEvent) {
  const { event, properties = {}, userId, platform = "web" } = data

  // Add platform context
  const enrichedProperties = {
    ...properties,
    platform,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : undefined,
  }

  // Track to Amplitude
  if (amplitudeInitialized) {
    if (userId) {
      amplitude.setUserId(userId)
    }
    amplitude.track(event, enrichedProperties)
  }

  // Track to Customer.io via API route
  if (typeof window !== "undefined") {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId || "anonymous",
        event,
        properties: enrichedProperties,
      }),
    }).catch((error) => {
      console.error("[v0] Failed to track to Customer.io:", error)
    })
  }

  console.log("[v0] Event tracked:", event, enrichedProperties)
}

export function identifyUser(userId: string, traits?: Record<string, any>) {
  // Amplitude identification
  if (amplitudeInitialized) {
    amplitude.setUserId(userId)
    if (traits) {
      const identify = new amplitude.Identify()
      Object.entries(traits).forEach(([key, value]) => {
        identify.set(key, value)
      })
      amplitude.identify(identify)
    }
  }

  // Customer.io identification via API
  if (typeof window !== "undefined") {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "identify",
        userId,
        traits: {
          ...traits,
          platform: "web",
          identified_at: new Date().toISOString(),
        },
      }),
    }).catch((error) => {
      console.error("[v0] Failed to identify user to Customer.io:", error)
    })
  }

  console.log("[v0] User identified:", userId, traits)
}

export const Analytics = {
  // AR Experience Events
  arSessionStarted: (platform: "web" | "horizon" | "mobile", sessionId: string) =>
    trackEvent({
      event: "ar_session_started",
      properties: { session_id: sessionId },
      platform,
    }),

  arSessionEnded: (platform: "web" | "horizon" | "mobile", sessionId: string, duration: number) =>
    trackEvent({
      event: "ar_session_ended",
      properties: { session_id: sessionId, duration_seconds: duration },
      platform,
    }),

  // Photo Booth Events
  photoCaptured: (platform: "web" | "horizon" | "mobile", filterId?: string) =>
    trackEvent({
      event: "photo_captured",
      properties: { filter_id: filterId },
      platform,
    }),

  photoShared: (platform: "web" | "horizon" | "mobile", shareMethod: string) =>
    trackEvent({
      event: "photo_shared",
      properties: { share_method: shareMethod },
      platform,
    }),

  // Cocktail Menu Events
  cocktailViewed: (platform: "web" | "horizon" | "mobile", cocktailId: string, cocktailName: string) =>
    trackEvent({
      event: "cocktail_viewed",
      properties: { cocktail_id: cocktailId, cocktail_name: cocktailName },
      platform,
    }),

  cocktailOrdered: (platform: "web" | "horizon" | "mobile", cocktailId: string, cocktailName: string, price: number) =>
    trackEvent({
      event: "cocktail_ordered",
      properties: { cocktail_id: cocktailId, cocktail_name: cocktailName, price },
      platform,
    }),

  // Gesture Interaction Events
  gesturePerformed: (platform: "web" | "horizon" | "mobile", gestureType: string) =>
    trackEvent({
      event: "gesture_performed",
      properties: { gesture_type: gestureType },
      platform,
    }),

  // Conversion Events
  gemScanned: (venueId: string, gemId: string) =>
    trackEvent({
      event: "gem_scanned",
      properties: { venue_id: venueId, gem_id: gemId },
      platform: "web",
    }),

  checkoutStarted: (amount: number, items: any[]) =>
    trackEvent({
      event: "checkout_started",
      properties: { amount, items },
      platform: "web",
    }),

  purchaseCompleted: (amount: number, orderId: string) =>
    trackEvent({
      event: "purchase_completed",
      properties: { amount, order_id: orderId, revenue: amount },
      platform: "web",
    }),

  // Horizon-specific Events
  horizonWorldEntered: (worldId: string, userId?: string) =>
    trackEvent({
      event: "horizon_world_entered",
      properties: { world_id: worldId },
      userId,
      platform: "horizon",
    }),

  horizonInteraction: (objectId: string, interactionType: string) =>
    trackEvent({
      event: "horizon_interaction",
      properties: { object_id: objectId, interaction_type: interactionType },
      platform: "horizon",
    }),
}
