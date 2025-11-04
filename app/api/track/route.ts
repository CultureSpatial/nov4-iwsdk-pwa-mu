import { type NextRequest, NextResponse } from "next/server"

const CUSTOMERIO_SITE_ID = process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID
const CUSTOMERIO_API_KEY = process.env.CUSTOMERIO_API_KEY
const CUSTOMERIO_TRACK_URL = "https://track.customer.io/api/v1"

interface TrackEventPayload {
  userId?: string
  anonymousId?: string
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

interface IdentifyPayload {
  userId: string
  traits: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...payload } = body

    // Validate required config
    if (!CUSTOMERIO_SITE_ID || !CUSTOMERIO_API_KEY) {
      console.log("[v0] Customer.io not configured, skipping tracking")
      return NextResponse.json({ success: true, skipped: true })
    }

    // Handle different event types
    if (type === "identify") {
      await handleIdentify(payload as IdentifyPayload)
    } else if (type === "track") {
      await handleTrack(payload as TrackEventPayload)
    } else {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Track API error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}

async function handleIdentify(payload: IdentifyPayload) {
  const { userId, traits } = payload

  const response = await fetch(`${CUSTOMERIO_TRACK_URL}/customers/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${CUSTOMERIO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...traits,
      created_at: traits.created_at || Math.floor(Date.now() / 1000),
    }),
  })

  if (!response.ok) {
    throw new Error(`Customer.io identify failed: ${response.statusText}`)
  }
}

async function handleTrack(payload: TrackEventPayload) {
  const { userId, anonymousId, event, properties, timestamp } = payload

  // Use userId if available, otherwise anonymousId
  const customerId = userId || anonymousId

  if (!customerId) {
    throw new Error("Either userId or anonymousId is required")
  }

  const response = await fetch(`${CUSTOMERIO_TRACK_URL}/customers/${customerId}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CUSTOMERIO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: event,
      data: properties || {},
      timestamp: timestamp || Math.floor(Date.now() / 1000),
    }),
  })

  if (!response.ok) {
    throw new Error(`Customer.io track failed: ${response.statusText}`)
  }
}
