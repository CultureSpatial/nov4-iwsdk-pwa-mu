import { trackEvent } from "./analytics"
import { identifyUser, trackCustomerIOEvent, addToSegment } from "./customerio"

export interface ConversionMetrics {
  influencerTier: "micro" | "macro" | "authority"
  engagementRate: number
  conversionRate: number
  cac: number
  scanToPurchaseRatio: number
}

export async function trackInfluencerConversion(
  influencerId: string,
  tier: ConversionMetrics["influencerTier"],
  code: string,
) {
  trackEvent("influencer_conversion", {
    influencerId,
    tier,
    code,
    timestamp: Date.now(),
  })

  trackCustomerIOEvent("influencer_conversion", {
    influencer_id: influencerId,
    tier,
    code,
    timestamp: Date.now(),
  })

  // Add to influencer segment for targeted campaigns
  await addToSegment(influencerId, `influencer_${tier}`)
}

export async function trackARScanConversion(scanId: string, purchased: boolean, retailerId?: string) {
  trackEvent("ar_scan_conversion", {
    scanId,
    purchased,
    retailerId,
    timestamp: Date.now(),
  })

  trackCustomerIOEvent("ar_scan_conversion", {
    scan_id: scanId,
    purchased,
    retailer_id: retailerId,
    timestamp: Date.now(),
  })

  if (purchased) {
    trackCustomerIOEvent("purchase_completed", {
      scan_id: scanId,
      retailer_id: retailerId,
    })
  }
}

export async function trackEventRSVP(email: string, type: "in-person" | "virtual") {
  trackEvent("event_rsvp_conversion", {
    email,
    type,
    timestamp: Date.now(),
  })

  const userId = email.replace("@", "_at_").replace(/\./g, "_")

  identifyUser(userId, {
    email,
    event_rsvp_type: type,
    event_rsvp_date: new Date().toISOString(),
    created_at: Math.floor(Date.now() / 1000),
  })

  trackCustomerIOEvent("event_rsvp", {
    type,
    timestamp: Date.now(),
  })

  // Add to appropriate segment for follow-up
  await addToSegment(userId, `event_attendee_${type}`)
}

export function calculateEngagementScore(metrics: {
  scans: number
  shares: number
  purchases: number
  duration: number
}): number {
  // Weighted scoring: purchases (40%), scans (30%), shares (20%), duration (10%)
  const purchaseScore = metrics.purchases * 40
  const scanScore = Math.min(metrics.scans * 3, 30) // Cap at 30 points
  const shareScore = Math.min(metrics.shares * 5, 20) // Cap at 20 points
  const durationScore = Math.min(metrics.duration / 60, 10) // 1 point per minute, cap at 10

  return Math.round(purchaseScore + scanScore + shareScore + durationScore)
}
