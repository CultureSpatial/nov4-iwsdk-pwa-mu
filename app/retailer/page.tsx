"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RetailerDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 to-black p-4">
      <div className="max-w-6xl mx-auto pt-10">
        <h1 className="text-3xl font-bold text-amber-100 mb-8">Retailer Partnership Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-amber-900/20 border-amber-700">
            <h3 className="text-lg font-semibold text-amber-100 mb-2">Active Locations</h3>
            <div className="text-3xl font-bold text-amber-400">5</div>
          </Card>

          <Card className="p-6 bg-amber-900/20 border-amber-700">
            <h3 className="text-lg font-semibold text-amber-100 mb-2">AR Scans</h3>
            <div className="text-3xl font-bold text-amber-400">--</div>
          </Card>

          <Card className="p-6 bg-amber-900/20 border-amber-700">
            <h3 className="text-lg font-semibold text-amber-100 mb-2">Sell-Through</h3>
            <div className="text-3xl font-bold text-amber-400">--</div>
          </Card>
        </div>

        <Card className="p-6 bg-amber-900/20 border-amber-700 mb-6">
          <h2 className="text-xl font-semibold text-amber-100 mb-4">On-Shelf AR Prompts</h2>
          <p className="text-amber-200 mb-4">Generate QR codes for in-store AR activations</p>
          <Button className="bg-amber-600 hover:bg-amber-700">Generate QR Code</Button>
        </Card>

        <Card className="p-6 bg-amber-900/20 border-amber-700">
          <h2 className="text-xl font-semibold text-amber-100 mb-4">Partner Locations</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-amber-950/30 rounded">
                <div className="text-amber-200">Retailer {i}</div>
                <Button variant="outline" size="sm" className="border-amber-700 text-amber-300 bg-transparent">
                  View Stats
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
