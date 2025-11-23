export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, userId, event, properties, traits } = body

    if (type === "identify") {
      // Identify user in Customer.io
      const response = await fetch("https://cdp.customer.io/v1/identify", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID}:${process.env.CUSTOMERIO_API_KEY}`,
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          traits: {
            ...traits,
            last_seen: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Customer.io identify failed: ${response.statusText}`)
      }

      return Response.json({ success: true, type: "identify" })
    }

    if (type === "delete_user_data") {
      console.log(`[Compliance] Data deletion requested for user: ${userId}`)

      // 1. Delete from Customer.io
      const cioResponse = await fetch(`https://cdp.customer.io/v1/customers/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID}:${process.env.CUSTOMERIO_API_KEY}`,
          ).toString("base64")}`,
        },
      })

      if (!cioResponse.ok) {
        console.error(`[Compliance] Customer.io deletion failed: ${cioResponse.statusText}`)
        // We don't throw here to ensure we try other cleanup if possible, or we might want to retry
      }

      // 2. (Optional) Log to internal audit table

      return Response.json({ success: true, type: "delete_user_data" })
    }

    // Track event in Customer.io
    const response = await fetch("https://cdp.customer.io/v1/track", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID}:${process.env.CUSTOMERIO_API_KEY}`,
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId || "anonymous",
        event,
        properties: {
          ...properties,
          tracked_at: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Customer.io track failed: ${response.statusText}`)
    }

    return Response.json({ success: true, type: "track", event })
  } catch (error) {
    console.error("[v0] Track API error:", error)
    return Response.json(
      { error: "Failed to track event", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
