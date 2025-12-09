export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, userId, event, properties } = body

    console.log("[v0] Track API called (local only):", { type, userId, event, properties })

    return Response.json({ success: true, type: type || "track", event })
  } catch (error) {
    console.error("[v0] Track API error:", error)
    return Response.json(
      { error: "Failed to track event", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
