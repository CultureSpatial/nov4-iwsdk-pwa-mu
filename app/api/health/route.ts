import { NextResponse } from "next/server"

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.VERCEL_GIT_COMMIT_SHA || "development",
    environment: process.env.NODE_ENV,
    analytics: {
      enabled: true,
      provider: "vercel",
    },
  }

  return NextResponse.json(health)
}
