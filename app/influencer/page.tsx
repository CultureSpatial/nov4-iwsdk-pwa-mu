"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

export default function InfluencerPreviewPage() {
  const handleGenerateCode = () => {
    trackEvent("influencer_code_generated", { tier: "micro" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black p-4">
      <div className="max-w-4xl mx-auto pt-10">
        <h1 className="text-3xl font-bold text-purple-100 mb-8">Influencer Preview Kit</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-purple-900/20 border-purple-700">
            <h2 className="text-xl font-semibold text-purple-100 mb-4">AR Demo Assets</h2>
            <p className="text-purple-200 mb-4">Download AR scan demos and unboxing content</p>
            <Button className="bg-purple-600 hover:bg-purple-700">Download Kit</Button>
          </Card>

          <Card className="p-6 bg-purple-900/20 border-purple-700">
            <h2 className="text-xl font-semibold text-purple-100 mb-4">Trackable Codes</h2>
            <p className="text-purple-200 mb-4">Generate unique codes for conversion tracking</p>
            <Button onClick={handleGenerateCode} className="bg-purple-600 hover:bg-purple-700">
              Generate Code
            </Button>
          </Card>

          <Card className="p-6 bg-purple-900/20 border-purple-700">
            <h2 className="text-xl font-semibold text-purple-100 mb-4">Content Guidelines</h2>
            <ul className="text-purple-200 space-y-2 text-sm">
              <li>• Unbox + scan label + pairing moment</li>
              <li>• 2-3 posts with whitelisting rights</li>
              <li>• Include DTC link and promo code</li>
            </ul>
          </Card>

          <Card className="p-6 bg-purple-900/20 border-purple-700">
            <h2 className="text-xl font-semibold text-purple-100 mb-4">Performance Metrics</h2>
            <div className="space-y-2 text-purple-200">
              <div>Engagement Rate: --</div>
              <div>Conversion Rate: --</div>
              <div>CAC: --</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
