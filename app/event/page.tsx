"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

export default function HybridEventPage() {
  const handleRSVP = () => {
    trackEvent("event_rsvp", { type: "hybrid" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-950 to-black p-4">
      <div className="max-w-4xl mx-auto pt-10">
        <h1 className="text-3xl font-bold text-rose-100 mb-4">Hybrid Tasting Experience</h1>
        <p className="text-rose-200 mb-8">Join us for an immersive AR wine tasting event</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-rose-900/20 border-rose-700">
            <h2 className="text-xl font-semibold text-rose-100 mb-4">Event Details</h2>
            <div className="space-y-2 text-rose-200">
              <div>Date: Nov 4, 2025</div>
              <div>Time: 7:00 PM - 9:00 PM</div>
              <div>Capacity: 15-20 guests</div>
              <div>Format: Hybrid (In-person + Virtual)</div>
            </div>
          </Card>

          <Card className="p-6 bg-rose-900/20 border-rose-700">
            <h2 className="text-xl font-semibold text-rose-100 mb-4">AR Stations</h2>
            <ul className="space-y-2 text-rose-200">
              <li>• Label scanning experience</li>
              <li>• Interactive tasting notes</li>
              <li>• Photo booth with AR filters</li>
              <li>• Virtual sommelier guide</li>
            </ul>
          </Card>
        </div>

        <Card className="p-6 bg-rose-900/20 border-rose-700 mb-6">
          <h2 className="text-xl font-semibold text-rose-100 mb-4">RSVP & Waitlist</h2>
          <p className="text-rose-200 mb-4">Reserve your spot for the exclusive tasting experience</p>
          <Button onClick={handleRSVP} className="bg-rose-600 hover:bg-rose-700">
            Join Waitlist
          </Button>
        </Card>

        <Card className="p-6 bg-rose-900/20 border-rose-700">
          <h2 className="text-xl font-semibold text-rose-100 mb-4">What to Expect</h2>
          <div className="space-y-3 text-rose-200">
            <p>Experience wine like never before with AR-enhanced storytelling</p>
            <p>Connect with fellow enthusiasts and industry experts</p>
            <p>Exclusive access to limited releases and special offers</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
