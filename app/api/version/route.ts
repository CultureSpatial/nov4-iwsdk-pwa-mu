import { NextResponse } from "next/server"

export async function GET() {
  const version = {
    commit: process.env.VERCEL_GIT_COMMIT_SHA || "development",
    branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
    timestamp: new Date().toISOString(),
    project: "nov4-iwsdk-pwa",
    event: "nov4_cultural_ar_pilot",
  }

  return NextResponse.json(version)
}
