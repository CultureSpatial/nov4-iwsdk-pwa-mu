"use client"

import { track } from "@vercel/analytics"

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  platform?: "web" | "horizon" | "mobile"
  timestamp?: number
  sessionId?: string
}

// Session management
let currentSessionId: string | null = null
let sessionStartTime = 0
const ringsViewedInSession: Set<string> = new Set()

function getSessionId(): string {
  if (!currentSessionId) {
    currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStartTime = Date.now()
  }
  return currentSessionId
}

function getDeviceType(): string {
  if (typeof navigator === "undefined") return "unknown"
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes("quest") || ua.includes("oculus")) return "quest"
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return "mobile"
  return "desktop"
}

export async function trackEvent(data: AnalyticsEvent): Promise<void> {
  const enrichedProperties = {
    ...data.properties,
    device_type: getDeviceType(),
    session_id: getSessionId(),
    platform: data.platform || "web",
    timestamp: Date.now(),
  }

  // Send to Vercel Analytics
  track(data.event, enrichedProperties)

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log("[v0 Analytics]", data.event, enrichedProperties)
  }
}

export function initializeAnalytics(): void {
  console.log("[v0 Analytics] Initialized with Vercel Analytics")
}

// User identification (stored in session for enrichment)
let currentUserId: string | null = null
export function identifyUser(userId: string, traits?: Record<string, any>): void {
  currentUserId = userId
  trackEvent({
    event: "user_identified",
    userId,
    properties: traits,
    platform: "web",
  })
}

// Data deletion request (GDPR compliance)
export function requestDataDeletion(userId: string): void {
  trackEvent({
    event: "data_deletion_requested",
    userId,
    platform: "web",
  })
}

// Analytics helper object with all event methods
export const Analytics = {
  // ===== SESSION EVENTS =====
  sessionStart: (entryPoint: "qr" | "url" | "meta_horizon") => {
    sessionStartTime = Date.now()
    ringsViewedInSession.clear()
    trackEvent({
      event: "session_start",
      properties: {
        entry_point: entryPoint,
        device_type: getDeviceType(),
      },
      platform: "web",
    })
  },

  sessionEnd: () => {
    const duration = Math.round((Date.now() - sessionStartTime) / 1000)
    trackEvent({
      event: "session_end",
      properties: {
        duration_seconds: duration,
        rings_viewed: ringsViewedInSession.size,
      },
      platform: "web",
    })
    currentSessionId = null
  },

  // ===== RING INTERACTION EVENTS =====
  ringViewed: (ringId: string, ringName: string, viewDurationMs: number) => {
    ringsViewedInSession.add(ringId)
    trackEvent({
      event: "ring_viewed",
      properties: {
        ring_id: ringId,
        ring_name: ringName,
        view_duration_ms: viewDurationMs,
      },
      platform: "web",
    })
  },

  ringSelected: (ringId: string, ringName: string, source: "tap" | "click" | "voice") => {
    trackEvent({
      event: "ring_selected",
      properties: {
        ring_id: ringId,
        ring_name: ringName,
        source,
      },
      platform: "web",
    })
  },

  ringDetailOpened: (ringId: string, ringName: string, previousRingId?: string) => {
    trackEvent({
      event: "ring_detail_opened",
      properties: {
        ring_id: ringId,
        ring_name: ringName,
        previous_ring_id: previousRingId,
      },
      platform: "web",
    })
  },

  ringDetailClosed: (ringId: string, ringName: string, timeSpentMs: number) => {
    trackEvent({
      event: "ring_detail_closed",
      properties: {
        ring_id: ringId,
        ring_name: ringName,
        time_spent_ms: timeSpentMs,
      },
      platform: "web",
    })
  },

  ringRotated: (ringId: string, rotationDegrees: number) => {
    trackEvent({
      event: "ring_rotated",
      properties: {
        ring_id: ringId,
        rotation_degrees: rotationDegrees,
      },
      platform: "web",
    })
  },

  // ===== SHORTLIST EVENTS =====
  ringShortlisted: (ringId: string, ringName: string, method: "button" | "drag") => {
    trackEvent({
      event: "ring_shortlisted",
      properties: {
        ring_id: ringId,
        ring_name: ringName,
        method,
      },
      platform: "web",
    })
  },

  ringRemovedFromShortlist: (ringId: string, ringName: string) => {
    trackEvent({
      event: "ring_removed_from_shortlist",
      properties: {
        ring_id: ringId,
        ring_name: ringName,
      },
      platform: "web",
    })
  },

  shortlistViewed: (ringCount: number) => {
    trackEvent({
      event: "shortlist_viewed",
      properties: {
        ring_count: ringCount,
      },
      platform: "web",
    })
  },

  shortlistCleared: (ringCount: number) => {
    trackEvent({
      event: "shortlist_cleared",
      properties: {
        ring_count: ringCount,
      },
      platform: "web",
    })
  },

  shortlistShared: (ringCount: number, shareMethod: string) => {
    trackEvent({
      event: "shortlist_shared",
      properties: {
        ring_count: ringCount,
        share_method: shareMethod,
      },
      platform: "web",
    })
  },

  // ===== AR/XR EVENTS =====
  xrModeEntered: (mode: "ar" | "vr", deviceType: string) => {
    trackEvent({
      event: "xr_mode_entered",
      properties: {
        mode,
        device_type: deviceType,
      },
      platform: "web",
    })
  },

  xrModeExited: (durationMs: number) => {
    trackEvent({
      event: "xr_mode_exited",
      properties: {
        duration_ms: durationMs,
      },
      platform: "web",
    })
  },

  tryInArClicked: (ringId: string, ringName: string) => {
    trackEvent({
      event: "try_in_ar_clicked",
      properties: {
        ring_id: ringId,
        ring_name: ringName,
      },
      platform: "web",
    })
  },

  // ===== CAMERA/PERMISSION EVENTS =====
  cameraPermissionRequested: () => {
    trackEvent({
      event: "camera_permission_requested",
      properties: {},
      platform: "web",
    })
  },

  cameraPermissionGranted: () => {
    trackEvent({
      event: "camera_permission_granted",
      properties: {},
      platform: "web",
    })
  },

  cameraPermissionDenied: () => {
    trackEvent({
      event: "camera_permission_denied",
      properties: {},
      platform: "web",
    })
  },

  // ===== PERFORMANCE EVENTS =====
  fpsDropDetected: (avgFps: number, minFps: number, duration: number) => {
    trackEvent({
      event: "fps_drop_detected",
      properties: {
        avg_fps: avgFps,
        min_fps: minFps,
        duration_seconds: duration,
      },
      platform: "web",
    })
  },

  performanceModeEnabled: (reason: string) => {
    trackEvent({
      event: "performance_mode_enabled",
      properties: {
        reason,
      },
      platform: "web",
    })
  },

  // ===== CONVERSION EVENTS =====
  contactInitiated: (method: "email" | "phone" | "chat") => {
    trackEvent({
      event: "contact_initiated",
      properties: {
        method,
      },
      platform: "web",
    })
  },

  appointmentRequested: (ringIds: string[]) => {
    trackEvent({
      event: "appointment_requested",
      properties: {
        ring_ids: ringIds,
        ring_count: ringIds.length,
      },
      platform: "web",
    })
  },

  // ===== LEGACY EVENTS (kept for compatibility) =====
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

  // ===== IWSDK-SPECIFIC EVENTS =====
  iwsdkInitialized: (success: boolean, capabilities: string[]) => {
    trackEvent({
      event: "iwsdk_initialized",
      properties: {
        success,
        capabilities,
        capability_count: capabilities.length,
      },
      platform: "web",
    })
  },

  spatialAnchorCreated: (anchorId: string, position: [number, number, number]) => {
    trackEvent({
      event: "spatial_anchor_created",
      properties: {
        anchor_id: anchorId,
        position_x: position[0],
        position_y: position[1],
        position_z: position[2],
      },
      platform: "web",
    })
  },

  // ===== PHASE 3+4 ANALYTICS EVENTS =====
  // ===== ERROR EVENTS =====
  errorOccurred: (errorType: string, errorMessage: string, component: string) => {
    trackEvent({
      event: "error_occurred",
      properties: {
        error_type: errorType,
        error_message: errorMessage,
        component,
      },
      platform: "web",
    })
  },

  errorBoundaryTriggered: (errorMessage: string, errorStack?: string) => {
    trackEvent({
      event: "error_boundary_triggered",
      properties: {
        error_message: errorMessage,
        error_stack: errorStack?.slice(0, 500),
      },
      platform: "web",
    })
  },

  webglContextLost: () => {
    trackEvent({
      event: "webgl_context_lost",
      properties: {},
      platform: "web",
    })
  },

  // ===== AR PLACEMENT EVENTS =====
  ringPlacedInAR: (ringId: string, ringName: string, position: [number, number, number], hasSpatialAnchor: boolean) => {
    trackEvent({
      event: "ring_placed_in_ar",
      properties: {
        ring_id: ringId,
        ring_name: ringName,
        position_x: position[0],
        position_y: position[1],
        position_z: position[2],
        has_spatial_anchor: hasSpatialAnchor,
      },
      platform: "web",
    })
  },

  arPlacementReset: (ringCount: number) => {
    trackEvent({
      event: "ar_placement_reset",
      properties: {
        ring_count: ringCount,
      },
      platform: "web",
    })
  },

  hitTestStarted: () => {
    trackEvent({
      event: "hit_test_started",
      properties: {},
      platform: "web",
    })
  },

  surfaceDetected: (surfaceType: "horizontal" | "vertical" | "unknown") => {
    trackEvent({
      event: "surface_detected",
      properties: {
        surface_type: surfaceType,
      },
      platform: "web",
    })
  },

  // ===== HAND TRACKING EVENTS =====
  handTrackingStarted: () => {
    trackEvent({
      event: "hand_tracking_started",
      properties: {},
      platform: "web",
    })
  },

  handTrackingLost: () => {
    trackEvent({
      event: "hand_tracking_lost",
      properties: {},
      platform: "web",
    })
  },

  // ===== USER ENGAGEMENT EVENTS =====
  featureDiscovered: (featureName: string) => {
    trackEvent({
      event: "feature_discovered",
      properties: {
        feature_name: featureName,
      },
      platform: "web",
    })
  },

  tooltipViewed: (tooltipId: string) => {
    trackEvent({
      event: "tooltip_viewed",
      properties: {
        tooltip_id: tooltipId,
      },
      platform: "web",
    })
  },

  helpAccessed: (helpTopic: string) => {
    trackEvent({
      event: "help_accessed",
      properties: {
        help_topic: helpTopic,
      },
      platform: "web",
    })
  },

  userIdle: (idleDurationMs: number) => {
    trackEvent({
      event: "user_idle",
      properties: {
        idle_duration_ms: idleDurationMs,
      },
      platform: "web",
    })
  },

  // ===== XR SESSION EVENTS =====
  xrSessionFailed: (mode: "ar" | "vr", errorMessage: string) => {
    trackEvent({
      event: "xr_session_failed",
      properties: {
        mode,
        error_message: errorMessage,
      },
      platform: "web",
    })
  },

  xrDeviceCapabilities: (capabilities: Record<string, boolean>) => {
    trackEvent({
      event: "xr_device_capabilities",
      properties: capabilities,
      platform: "web",
    })
  },

  track: (eventName: string, properties?: Record<string, any>) => {
    trackEvent({
      event: eventName,
      properties,
      platform: "web",
    })
  },
}
