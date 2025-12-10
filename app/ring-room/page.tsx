import { RingRoomScene } from "@/components/ring-room/ring-room-scene"
import type { Metadata, Viewport } from "next"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Ring Room - Engagement Ring AR Consultation | Emerald Gem",
  description:
    "Explore engagement rings in immersive 3D and AR. View details, compare styles, try on virtually, and create your shortlist. Optimized for Meta Quest and mobile AR.",
  keywords: [
    "engagement rings",
    "WebXR",
    "AR try-on",
    "3D jewelry",
    "Meta Quest",
    "virtual consultation",
    "diamond rings",
    "wedding rings",
    "ring shopping",
  ],
  openGraph: {
    title: "Ring Room - Emerald Gem AR Experience",
    description: "Try on engagement rings in augmented reality. Browse, compare, and find your perfect ring.",
    type: "website",
    images: [
      {
        url: "/og-ring-room.jpg",
        width: 1200,
        height: 630,
        alt: "Emerald Gem Ring Room AR Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ring Room AR Experience",
    description: "Explore engagement rings in immersive AR/VR",
    images: ["/og-ring-room.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
}

export default function RingRoomPage() {
  return (
    <main role="main" aria-label="Ring Room AR Experience" className="relative">
      <div className="absolute top-4 left-4 z-50">
        <Badge className="bg-amber-600 hover:bg-amber-700 text-white text-xs shadow-lg">Cultural Tooling</Badge>
      </div>
      <RingRoomScene />
    </main>
  )
}
