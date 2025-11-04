import { track } from "@vercel/analytics"

/**
 * Analytics utility for tracking Cultural AR Pilot events
 * Tracks technical metrics, engagement analytics, and success indicators
 */

// ============================================================================
// TECHNICAL METRICS
// ============================================================================

export function trackFrameRate(fps: number) {
  track("technical_frame_rate", {
    fps,
    target: 60,
    status: fps >= 60 ? "optimal" : fps >= 30 ? "acceptable" : "poor",
  })
}

export function trackTrackingAccuracy(driftMm: number) {
  track("technical_tracking_accuracy", {
    drift_mm: driftMm,
    target: 5,
    status: driftMm < 5 ? "optimal" : driftMm < 10 ? "acceptable" : "poor",
  })
}

export function trackLoadTime(assetName: string, loadTimeMs: number) {
  track("technical_load_time", {
    asset: assetName,
    load_time_ms: loadTimeMs,
    load_time_s: (loadTimeMs / 1000).toFixed(2),
    target_s: 3,
    status: loadTimeMs < 3000 ? "optimal" : loadTimeMs < 5000 ? "acceptable" : "poor",
  })
}

export function trackNetworkLatency(latencyMs: number) {
  track("technical_network_latency", {
    latency_ms: latencyMs,
    target_ms: 50,
    status: latencyMs < 50 ? "optimal" : latencyMs < 100 ? "acceptable" : "poor",
  })
}

// ============================================================================
// ENGAGEMENT ANALYTICS
// ============================================================================

export function trackSessionStart(
  sessionId: string,
  deviceInfo: {
    userAgent: string
    platform: string
    webxrSupported: boolean
  },
) {
  track("engagement_session_start", {
    session_id: sessionId,
    ...deviceInfo,
    timestamp: new Date().toISOString(),
  })
}

export function trackSessionEnd(sessionId: string, durationSeconds: number) {
  track("engagement_session_end", {
    session_id: sessionId,
    duration_seconds: durationSeconds,
    duration_minutes: (durationSeconds / 60).toFixed(2),
    timestamp: new Date().toISOString(),
  })
}

export function trackInteraction(interactionType: string, details?: Record<string, any>) {
  track("engagement_interaction", {
    type: interactionType,
    ...details,
    timestamp: new Date().toISOString(),
  })
}

export function trackQuestionSubmitted(question: string, quality: "high" | "medium" | "low") {
  track("engagement_question_submitted", {
    question_length: question.length,
    quality,
    timestamp: new Date().toISOString(),
  })
}

export function trackFollowUpRequest(requestType: string) {
  track("engagement_follow_up_request", {
    type: requestType,
    timestamp: new Date().toISOString(),
  })
}

// ============================================================================
// EXPERIENCE EVENTS
// ============================================================================

export function trackPWAInstalled() {
  track("pwa_installed", {
    timestamp: new Date().toISOString(),
  })
}

export function trackExperienceStarted(experienceType: "webxr" | "2d_fallback") {
  track("experience_started", {
    type: experienceType,
    timestamp: new Date().toISOString(),
  })
}

export function trackPhotoCaptured(filterUsed?: string) {
  track("photo_captured", {
    filter: filterUsed || "none",
    timestamp: new Date().toISOString(),
  })
}

export function trackMenuItemViewed(itemName: string) {
  track("menu_item_viewed", {
    item: itemName,
    timestamp: new Date().toISOString(),
  })
}

export function trackPollVoted(pollId: string, option: string) {
  track("poll_voted", {
    poll_id: pollId,
    option,
    timestamp: new Date().toISOString(),
  })
}

export function trackShareClicked(shareType: "photo" | "experience" | "menu") {
  track("share_clicked", {
    type: shareType,
    timestamp: new Date().toISOString(),
  })
}

// ============================================================================
// SUCCESS INDICATORS
// ============================================================================

export function trackTechnicalInterruption(errorType: string, errorMessage: string) {
  track("technical_interruption", {
    error_type: errorType,
    error_message: errorMessage,
    timestamp: new Date().toISOString(),
  })
}

export function trackEngagementScore(score: number, maxScore = 5) {
  track("engagement_score", {
    score,
    max_score: maxScore,
    percentage: ((score / maxScore) * 100).toFixed(1),
    timestamp: new Date().toISOString(),
  })
}

export function trackFeedback(rating: number, comment?: string) {
  track("feedback_submitted", {
    rating,
    max_rating: 5,
    has_comment: !!comment,
    sentiment: rating >= 4 ? "positive" : rating >= 3 ? "neutral" : "negative",
    timestamp: new Date().toISOString(),
  })
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get device information for analytics
 */
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    webxrSupported: "xr" in navigator,
  }
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private frameCount = 0
  private lastFrameTime = performance.now()
  private fpsHistory: number[] = []

  startFrameRateMonitoring(intervalMs = 1000) {
    setInterval(() => {
      const currentTime = performance.now()
      const deltaTime = currentTime - this.lastFrameTime
      const fps = Math.round((this.frameCount * 1000) / deltaTime)

      this.fpsHistory.push(fps)
      if (this.fpsHistory.length > 10) {
        this.fpsHistory.shift()
      }

      trackFrameRate(fps)

      this.frameCount = 0
      this.lastFrameTime = currentTime
    }, intervalMs)
  }

  recordFrame() {
    this.frameCount++
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0
    return Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length)
  }
}

/**
 * Session tracking utility
 */
export class SessionTracker {
  private sessionId: string
  private startTime: number
  private interactionCount = 0

  constructor() {
    this.sessionId = generateSessionId()
    this.startTime = Date.now()
    trackSessionStart(this.sessionId, getDeviceInfo())
  }

  recordInteraction(type: string, details?: Record<string, any>) {
    this.interactionCount++
    trackInteraction(type, {
      ...details,
      interaction_number: this.interactionCount,
    })
  }

  endSession() {
    const durationSeconds = Math.round((Date.now() - this.startTime) / 1000)
    trackSessionEnd(this.sessionId, durationSeconds)
  }

  getSessionId(): string {
    return this.sessionId
  }

  getInteractionCount(): number {
    return this.interactionCount
  }
}
