// Customer.io integration for user journey tracking and engagement
// Requires: NEXT_PUBLIC_CUSTOMERIO_SITE_ID and CUSTOMERIO_API_KEY

interface CustomerIOEvent {
  name: string
  data: Record<string, any>
}

interface CustomerIOIdentify {
  id: string
  email?: string
  created_at?: number
  [key: string]: any
}

// Client-side tracking using webhook-based tracking
export async function identifyUser(userId: string, attributes: Record<string, any>) {
  if (typeof window === "undefined") return

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "identify",
        userId,
        traits: {
          ...attributes,
          created_at: attributes.created_at || Math.floor(Date.now() / 1000),
        },
      }),
    })
  } catch (error) {
    console.error("[v0] Failed to identify user:", error)
  }
}

// Client-side event tracking using webhook endpoint
export async function trackCustomerIOEvent(eventName: string, data: Record<string, any> = {}) {
  if (typeof window === "undefined") return

  // Get or generate anonymous ID
  let anonymousId = localStorage.getItem("cio_anonymous_id")
  if (!anonymousId) {
    anonymousId = `anon_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("cio_anonymous_id", anonymousId)
  }

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "track",
        anonymousId,
        event: eventName,
        properties: data,
        timestamp: Math.floor(Date.now() / 1000),
      }),
    })
  } catch (error) {
    console.error("[v0] Failed to track event:", error)
  }
}

// Server-side API calls for campaigns and transactional messages
export async function sendTransactionalEmail(
  userId: string,
  transactionalMessageId: string,
  data: Record<string, any> = {},
) {
  const apiKey = process.env.CUSTOMERIO_API_KEY
  const siteId = process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID

  if (!apiKey || !siteId) {
    console.warn("[v0] Customer.io API key not configured")
    return { success: false, error: "API key not configured" }
  }

  const authToken = Buffer.from(`${siteId}:${apiKey}`).toString("base64")

  try {
    const response = await fetch(`https://api.customer.io/v1/send/email`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: userId,
        transactional_message_id: transactionalMessageId,
        message_data: data,
        identifiers: {
          id: userId,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Customer.io API error: ${response.statusText}`)
    }

    return { success: true, data: await response.json() }
  } catch (error) {
    console.error("[v0] Customer.io API error:", error)
    return { success: false, error }
  }
}

// Add user to a segment for targeted campaigns
export async function addToSegment(userId: string, segmentId: string) {
  const apiKey = process.env.CUSTOMERIO_API_KEY
  const siteId = process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID

  if (!apiKey || !siteId) {
    console.warn("[v0] Customer.io API key not configured")
    return { success: false, error: "API key not configured" }
  }

  const authToken = Buffer.from(`${siteId}:${apiKey}`).toString("base64")

  try {
    const response = await fetch(`https://track.customer.io/api/v1/customers/${userId}/segments/${segmentId}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Customer.io API error: ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Customer.io API error:", error)
    return { success: false, error }
  }
}
