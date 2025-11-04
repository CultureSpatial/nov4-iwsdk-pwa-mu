"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { generateAllQRUrls, generateQRImageUrl } from "@/lib/qr-generator"
import { Download, Copy, CheckCircle2, QrCode } from "lucide-react"

export default function QRCodesPage() {
  const [baseUrl, setBaseUrl] = useState("https://your-domain.vercel.app")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const qrCodes = generateAllQRUrls(baseUrl)

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const downloadQRCode = (url: string, filename: string) => {
    const qrImageUrl = generateQRImageUrl(url, 1000)
    const link = document.createElement("a")
    link.href = qrImageUrl
    link.download = `${filename}.png`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <QrCode className="h-8 w-8" />
            QR Code Generator
          </h1>
          <p className="text-emerald-200">Generate QR codes with UTM tracking for the Nov 4 event</p>
        </div>

        {/* Base URL Configuration */}
        <Card className="bg-emerald-900/50 border-emerald-700">
          <CardHeader>
            <CardTitle className="text-white">Production Domain</CardTitle>
            <CardDescription className="text-emerald-200">Enter your Vercel deployment URL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="baseUrl" className="text-white">
                Base URL
              </Label>
              <Input
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://your-domain.vercel.app"
                className="bg-emerald-950/50 border-emerald-700 text-white"
              />
              <p className="text-xs text-emerald-300">
                All QR codes will use this base URL with UTM parameters: utm_campaign=nov4_event
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Generated QR Codes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Generated QR Codes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {qrCodes.map((qr) => (
              <Card key={qr.id} className="bg-emerald-900/50 border-emerald-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{qr.name}</CardTitle>
                    {qr.scene && <Badge variant="secondary">{qr.scene}</Badge>}
                  </div>
                  <CardDescription className="text-emerald-200">
                    {qr.scene ? `Direct link to ${qr.name}` : "General entry point"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* QR Code Image */}
                  <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                    <img
                      src={generateQRImageUrl(qr.url, 300) || "/placeholder.svg"}
                      alt={`QR code for ${qr.name}`}
                      className="w-full max-w-[300px]"
                    />
                  </div>

                  {/* URL Display */}
                  <div className="p-3 bg-emerald-950/50 rounded-lg">
                    <p className="text-xs font-mono text-emerald-300 break-all">{qr.url}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(qr.url, qr.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                    >
                      {copiedId === qr.id ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => downloadQRCode(qr.url, `qr-${qr.id}`)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Usage Instructions */}
        <Card className="bg-emerald-900/50 border-emerald-700">
          <CardHeader>
            <CardTitle className="text-white">Usage Instructions</CardTitle>
            <CardDescription className="text-emerald-200">How to use these QR codes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-emerald-950/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">1. Print QR Codes</h3>
                <p className="text-sm text-emerald-200">
                  Download high-resolution QR codes (1000x1000px) and print them for the event venue.
                </p>
              </div>
              <div className="p-4 bg-emerald-950/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">2. Place Strategically</h3>
                <p className="text-sm text-emerald-200">
                  Position QR codes at entry points, near the photo booth, at the bar for cocktail menu, etc.
                </p>
              </div>
              <div className="p-4 bg-emerald-950/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">3. Test Before Event</h3>
                <p className="text-sm text-emerald-200">
                  Scan each QR code on iOS Safari 17+ and Android Chrome 125+ to verify routing works correctly.
                </p>
              </div>
              <div className="p-4 bg-emerald-950/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">4. Monitor Analytics</h3>
                <p className="text-sm text-emerald-200">
                  UTM parameters (utm_campaign=nov4_event) allow tracking which QR codes are being scanned.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
