import { RingRoomScene } from '@/components/ring-room/ring-room-scene'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ring Room - Engagement Ring Consultation | Emerald Gem',
  description: 'Explore engagement rings in immersive 3D. View details, compare styles, and create your shortlist.',
}

export default function RingRoomPage() {
  return <RingRoomScene />
}
