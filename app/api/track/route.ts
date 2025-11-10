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
