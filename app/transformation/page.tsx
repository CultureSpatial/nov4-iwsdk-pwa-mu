import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Rocket, Zap, CheckCircle2, Video, Globe, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TransformationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-purple-950 to-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Platform Transformation Journey
          </h1>
          <p className="text-xl text-emerald-200">Scaffold → Transmutation → Stabilization</p>
          <p className="text-sm text-emerald-300">From WebXR PWA to Meta Horizon Native with Tavus.io Video AI</p>
        </div>

        <Alert className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/50">
          <Rocket className="h-5 w-5 text-purple-300" />
          <AlertDescription className="text-white">
            <div className="space-y-2">
              <div className="font-bold text-lg">Strategic Vision: Zero Cash, Maximum Reach</div>
              <p className="text-purple-100">
                Leveraging Meta's mobile-first ecosystem to reach 3B+ users through Instagram/Facebook distribution,
                enhanced with Tavus.io AI video for crisp interactive content. Target launch: Dec 15, 2025.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          <Card className="bg-emerald-900/30 border-emerald-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                <div>
                  <CardTitle className="text-2xl text-white">Stage 1: Scaffold (Complete)</CardTitle>
                  <CardDescription className="text-emerald-200">Nov 4, 2024 - WebXR PWA Foundation</CardDescription>
                </div>
                <Badge className="ml-auto bg-emerald-600">✓ Complete</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-100">
                Rapid prototype using WebXR and Progressive Web App technologies to validate core features and user
                flows with minimal investment.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-emerald-300">Technical Foundation</h4>
                  <ul className="text-sm space-y-1 text-emerald-200">
                    <li>• Next.js 16 + React 19.2 PWA</li>
                    <li>• IWSDK integration for Meta Horizon</li>
                    <li>• Universal AR (Zappar/Mattercraft)</li>
                    <li>• Three.js 3D rendering</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-emerald-300">Validated Features</h4>
                  <ul className="text-sm space-y-1 text-emerald-200">
                    <li>• Photo booth with AR frames</li>
                    <li>• Interactive cocktail menu</li>
                    <li>• MR demo with hand tracking</li>
                    <li>• Analytics and conversion tracking</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-900/30 border-yellow-600/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
                <div>
                  <CardTitle className="text-2xl text-white">Stage 2: Transmutation (In Progress)</CardTitle>
                  <CardDescription className="text-yellow-200">
                    Now - Dec 15, 2025 - Meta Horizon Native Conversion
                  </CardDescription>
                </div>
                <Badge className="ml-auto bg-yellow-600 animate-pulse">→ Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-yellow-100">
                Converting WebXR scaffolding to Meta Horizon native deployment using TypeScript ECS architecture.
                Enhanced with Tavus.io AI video for interactive educational content.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-purple-950/30 p-4 rounded-lg border border-purple-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-purple-400" />
                    <h4 className="font-semibold text-purple-300">Meta Horizon Desktop Editor</h4>
                  </div>
                  <ul className="text-sm space-y-1 text-purple-200">
                    <li>• TypeScript scripting (ECS)</li>
                    <li>• Mobile + MR + VR support</li>
                    <li>• Asset import pipeline</li>
                    <li>• Native gizmo components</li>
                  </ul>
                </div>

                <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="h-5 w-5 text-blue-400" />
                    <h4 className="font-semibold text-blue-300">Tavus.io Integration</h4>
                  </div>
                  <ul className="text-sm space-y-1 text-blue-200">
                    <li>• AI-generated video content</li>
                    <li>• Interactive AR plane overlay</li>
                    <li>• Customer education flow</li>
                    <li>• Crisp, professional delivery</li>
                  </ul>
                </div>

                <div className="bg-emerald-950/30 p-4 rounded-lg border border-emerald-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <h4 className="font-semibold text-emerald-300">Distribution Strategy</h4>
                  </div>
                  <ul className="text-sm space-y-1 text-emerald-200">
                    <li>• Instagram/Facebook reach</li>
                    <li>• 3B+ potential users</li>
                    <li>• Zero hosting costs</li>
                    <li>• Viral sharing built-in</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700/50">
                <h4 className="font-semibold text-yellow-300 mb-3">Current Work (6-Week Sprint)</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-yellow-200 font-semibold mb-1">Weeks 1-2: Foundation</div>
                    <ul className="space-y-0.5 text-yellow-200/80">
                      <li>✓ Gizmo component mapping documented</li>
                      <li>✓ Asset conversion pipeline defined</li>
                      <li>→ TypeScript templates created</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-yellow-200 font-semibold mb-1">Weeks 3-4: Implementation</div>
                    <ul className="space-y-0.5 text-yellow-200/80">
                      <li>→ Photo booth + cocktail menu ported</li>
                      <li>→ Tavus.io video integration</li>
                      <li>→ Mobile testing on iOS/Android</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-yellow-200 font-semibold mb-1">Weeks 5-6: Polish & Deploy</div>
                    <ul className="space-y-0.5 text-yellow-200/80">
                      <li>→ Social sharing optimization</li>
                      <li>→ Analytics integration</li>
                      <li>→ Dec 15 soft launch prep</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-yellow-200 font-semibold mb-1">Documentation</div>
                    <ul className="space-y-0.5 text-yellow-200/80">
                      <li>✓ Meta Horizon gizmo mapping</li>
                      <li>✓ Transformation roadmap</li>
                      <li>→ Customer narrative guide</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/20 border-purple-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Rocket className="h-8 w-8 text-purple-400" />
                <div>
                  <CardTitle className="text-2xl text-white">Stage 3: Stabilization (Target)</CardTitle>
                  <CardDescription className="text-purple-200">Dec 15, 2025 - Production Launch</CardDescription>
                </div>
                <Badge variant="outline" className="ml-auto border-purple-500 text-purple-300">
                  Target
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-purple-100">
                Native Meta Horizon deployment ready for Digital Royal Wardrobe soft launch with full mobile support,
                interactive video, and social distribution.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-300">Technical Stability</h4>
                  <ul className="text-sm space-y-1 text-purple-200">
                    <li>• Native iOS + Android AR</li>
                    <li>• Optimized mobile performance</li>
                    <li>• Production monitoring</li>
                    <li>• Analytics dashboards</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-300">Business Outcomes</h4>
                  <ul className="text-sm space-y-1 text-purple-200">
                    <li>• 285% ROI validated</li>
                    <li>• 50+ attendees at launch</li>
                    <li>• 3-venue expansion ready</li>
                    <li>• $2.5M contest eligibility</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-emerald-900/20 to-purple-900/20 border-emerald-700/50">
          <CardHeader>
            <CardTitle className="text-white">Technical Documentation & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/docs/META_HORIZON_GIZMO_MAPPING.md">
                <Button
                  variant="outline"
                  className="w-full border-purple-600 text-purple-200 hover:bg-purple-900/50 bg-transparent"
                >
                  Gizmo Mapping Guide
                </Button>
              </Link>
              <Link href="/docs/TRANSFORMATION_ROADMAP.md">
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-200 hover:bg-blue-900/50 bg-transparent"
                >
                  Transformation Roadmap
                </Button>
              </Link>
              <Link href="/docs/6_WEEK_META_HORIZON_SPRINT.md">
                <Button
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-200 hover:bg-emerald-900/50 bg-transparent"
                >
                  6-Week Sprint Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
