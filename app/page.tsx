import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gem, Sparkles, Settings } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-600">
            <Sparkles className="w-3 h-3 mr-1" />
            AR Ring Consultation Experience
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ring Room Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Interactive 3D engagement ring consultation with WebXR support. View, compare, and shortlist rings in an
            immersive experience.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/ring-room">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Gem className="w-5 h-5 mr-2" />
                Enter Ring Room
              </Button>
            </Link>
            <Link href="/test/iwsdk">
              <Button size="lg" variant="outline">
                <Settings className="w-5 h-5 mr-2" />
                IWSDK Test Suite
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>3D Ring Visualization</CardTitle>
                <CardDescription>Interactive 3D models</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View detailed engagement rings from every angle with realistic materials and lighting.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>WebXR Support</CardTitle>
                <CardDescription>Immersive experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enter VR/AR mode on supported devices for a fully immersive ring consultation experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>Shortlist & Compare</CardTitle>
                <CardDescription>Save your favorites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build a shortlist of your favorite rings and share them with others via a unique link.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Start */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
          <div className="max-w-xl mx-auto bg-slate-100 dark:bg-slate-800 rounded-lg p-6 text-left">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Click "Enter Ring Room" to launch the demo</li>
              <li>Browse available engagement rings in the carousel</li>
              <li>Select a ring to view it in 3D detail</li>
              <li>Add favorites to your shortlist</li>
              <li>On supported devices, enter XR mode for immersive viewing</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
