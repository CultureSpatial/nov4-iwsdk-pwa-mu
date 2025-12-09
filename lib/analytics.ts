"use client"

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  platform?: "web" | "horizon" | "mobile"
  sovereigntyCompliant?: boolean
  enableLDU?: boolean
}

export function initializeAmplitude() {
  // No-op - analytics removed
}

export function trackEvent(data: AnalyticsEvent) {
  const { event, properties = {} } = data
  console.log("[v0] Event tracked (local only):", event, properties)
}

export function identifyUser(userId: string, traits?: Record<string, any>) {
  console.log("[v0] User identified (local only):", userId, traits)
}

export function requestDataDeletion(userId: string) {
  console.log("[v0] Data deletion requested (local only):", userId)
}

export const Analytics = {
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

  gesturePerformed: (platform: "web" | "horizon" | "mobile", gestureType: string) =>
    trackEvent({
      event: "gesture_performed",
      properties: { gesture_type: gestureType },
      platform,
    }),

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
