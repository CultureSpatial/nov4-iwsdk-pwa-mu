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

// Client-side tracking using Customer.io JavaScript snippet
export function identifyUser(userId: string, attributes: Omit<CustomerIOIdentify, "id">) {
  if (typeof window === "undefined") return

  const siteId = process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID
  if (!siteId) {
    console.warn("[v0] Customer.io site ID not configured")
    return
  }

  // Initialize Customer.io if not already loaded
  if (!(window as any)._cio) {
    const script = document.createElement("script")
    script.src = `https://assets.customer.io/assets/track-eu.js`
    script.async = true
    script.onload = () => {
      ;(window as any)._cio = (window as any)._cio || []
      ;(() => {
        const a = (f: any) => () => {
          ;(window as any)._cio.push([f].concat(Array.prototype.slice.call(arguments, 0)))
        }
        const b = ["load", "identify", "sidentify", "track", "page"]
        for (let i = 0; i < b.length; i++) {
          ;(window as any)._cio[b[i]] = a(b[i])
        }
      })()
      ;(window as any)._cio.load(siteId)
      ;(window as any)._cio.identify({
        id: userId,
        ...attributes,
      })
    }
    document.head.appendChild(script)
  } else {
    ;(window as any)._cio.identify({
      id: userId,
      ...attributes,
    })
  }
}

// Client-side event tracking
export function trackCustomerIOEvent(eventName: string, data: Record<string, any> = {}) {
  if (typeof window === "undefined") return

  if (!(window as any)._cio) {
    console.warn("[v0] Customer.io not initialized")
    return
  }
  ;(window as any)._cio.track(eventName, data)
}

// Server-side API calls for campaigns and transactional messages
export async function sendTransactionalEmail(
  userId: string,
  transactionalMessageId: string,
  data: Record<string, any> = {},
) {
  const apiKey = process.env.CUSTOMERIO_API_KEY
  if (!apiKey) {
    console.warn("[v0] Customer.io API key not configured")
    return { success: false, error: "API key not configured" }
  }

  try {
    const response = await fetch(`https://api.customer.io/v1/send/email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
  if (!apiKey) {
    console.warn("[v0] Customer.io API key not configured")
    return { success: false, error: "API key not configured" }
  }

  try {
    const response = await fetch(`https://track.customer.io/api/v1/customers/${userId}/segments/${segmentId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
