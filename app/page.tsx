import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Smartphone, Headset, Zap, Calendar } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-600">
            <Sparkles className="w-3 h-3 mr-1" />
            Scaffold → Transmutation → Stabilization
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Emerald Gem AR Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Multi-platform immersive hospitality experiences powered by WebXR, Meta Horizon, and Universal AR
          </p>

          {/* Critical Launch Date */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span className="text-lg font-semibold">
              Target Launch: <span className="text-emerald-600">December 15, 2025</span>
            </span>
            <Badge variant="outline" className="ml-2">
              Royal Sonesta Seattle
            </Badge>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/ar/photo-booth">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Smartphone className="w-5 h-5 mr-2" />
                Try AR Photo Booth
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Meta Horizon Competition Section */}
        <div className="mb-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 border-2 border-purple-200">
          <div className="text-center mb-6">
            <Badge className="mb-2 bg-purple-600">
              <Zap className="w-3 h-3 mr-1" />
              Competition Opportunity
            </Badge>
            <h2 className="text-3xl font-bold mb-2">Meta Horizon Start Developer Competition</h2>
            <p className="text-muted-foreground">$1.5M Prize Pool • Deadline: December 9, 2025</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-purple-600">Lifestyle Track</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hospitality innovation with AR try-on flows, photo booth, and cocktail menus
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-purple-600">Special Award</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Passthrough Camera + AI: 60fps camera system with Tavus.io concierge integration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-purple-600">Immersive Web SDK</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Current PWA qualifies: IWSDK + Universal AR SDK multi-platform architecture
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-4">Competitive Advantages</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-1">
                  ✓
                </Badge>
                <div>
                  <p className="font-medium">Real Customer</p>
                  <p className="text-sm text-muted-foreground">Royal Sonesta Seattle launch Dec 15</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-1">
                  ✓
                </Badge>
                <div>
                  <p className="font-medium">Revenue Model</p>
                  <p className="text-sm text-muted-foreground">Digital Royal Wardrobe 285% ROI</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-1">
                  ✓
                </Badge>
                <div>
                  <p className="font-medium">Multi-Platform</p>
                  <p className="text-sm text-muted-foreground">Web PWA + Meta Horizon + Mobile AR</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-1">
                  ✓
                </Badge>
                <div>
                  <p className="font-medium">60fps Camera</p>
                  <p className="text-sm text-muted-foreground">8th Wall standard with progressive fallback</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Strategy */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Multi-Platform Strategy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <Smartphone className="w-10 h-10 text-emerald-600 mb-2" />
                <CardTitle>Web PWA</CardTitle>
                <CardDescription>Scaffold Phase</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  React + Next.js 16 progressive web app with WebXR and Universal AR SDK for mobile browsers
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">IWSDK</Badge>
                  <Badge variant="secondary">Universal AR</Badge>
                  <Badge variant="secondary">Three.js</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 ring-2 ring-emerald-600">
              <CardHeader>
                <Headset className="w-10 h-10 text-emerald-600 mb-2" />
                <CardTitle>Meta Horizon</CardTitle>
                <CardDescription>Transmutation Phase</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Native VR/MR/Mobile experiences via Meta Horizon Desktop Editor and TypeScript API
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Quest VR</Badge>
                  <Badge variant="secondary">Mobile AR</Badge>
                  <Badge variant="secondary">3B+ Users</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardHeader>
                <Zap className="w-10 h-10 text-emerald-600 mb-2" />
                <CardTitle>Intersection Layer</CardTitle>
                <CardDescription>Stabilization Phase</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Cross-platform asset bridge, state sync, and unified analytics pipeline
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Asset Bridge</Badge>
                  <Badge variant="secondary">State Sync</Badge>
                  <Badge variant="secondary">Analytics</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Meta Horizon Opportunity</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-emerald-600">3B+</CardTitle>
                <CardDescription>Potential Reach</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Instagram + Facebook distribution</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-emerald-600">4x</CardTitle>
                <CardDescription>Mobile Engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Mobile vs VR-only experiences</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-emerald-600">$1.5M</CardTitle>
                <CardDescription>Competition Prize</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Meta Horizon Start competition</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-emerald-600">285%</CardTitle>
                <CardDescription>Target ROI</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Digital Royal Wardrobe</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">AR Experiences</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/ar/photo-booth">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>Photo Booth</CardTitle>
                  <CardDescription>AR frames and filters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Capture memories with themed AR frames and share instantly
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ar/cocktails">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>Cocktail Menu</CardTitle>
                  <CardDescription>3D drink visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View cocktails in AR before ordering</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/mr-demo">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>MR Demo</CardTitle>
                  <CardDescription>Mixed reality showcase</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Full immersive experience demo</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/events">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>Events</CardTitle>
                  <CardDescription>Upcoming launches</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Track progress and event timeline</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>Transmutation monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Real-time analytics and health metrics</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/test/iwsdk">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>IWSDK Test</CardTitle>
                  <CardDescription>Platform testing</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Test WebXR and device capabilities</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Analytics Stack */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Unified Analytics</h2>
          <p className="text-muted-foreground mb-6">
            Dual analytics stack with Amplitude (product insights) and Customer.io (marketing automation)
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Badge variant="outline">Amplitude</Badge>
            <Badge variant="outline">Customer.io</Badge>
            <Badge variant="outline">Cross-platform Events</Badge>
            <Badge variant="outline">Unified User Profiles</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
