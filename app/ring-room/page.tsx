import { RingRoomScene } from "@/components/ring-room/ring-room-scene"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Ring Room - Engagement Ring Consultation | Emerald Gem",
  description:
    "Explore engagement rings in immersive 3D WebXR. View details, compare styles, and create your shortlist. Optimized for Meta Quest.",
  keywords: ["engagement rings", "WebXR", "3D jewelry", "Meta Quest", "virtual consultation"],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
}

export default function RingRoomPage() {
  return <RingRoomScene />
}
