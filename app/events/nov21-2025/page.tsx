import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Sparkles } from "lucide-react"

export default function Nov21EventPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-emerald-700/50 bg-emerald-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto p-6">
          <Link href="/events" className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <div className="inline-block px-4 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded-full text-sm font-semibold mb-4">
            🔨 In Development
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent">
            ✨ The Alexis Royal Sonesta ✨
          </h1>
          <h2 className="text-3xl font-bold mb-2">EMERALD CITY PREMIERE</h2>
          <h3 className="text-2xl text-emerald-300 mb-4">WICKED MOVIE NIGHT</h3>
          <div className="flex flex-wrap gap-4 text-emerald-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>November 21, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Author's Corner AR Social Lounge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Event Overview */}
          <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Event Overview
            </h3>
            <p className="text-emerald-200 mb-4">
              Experience the magic of Wicked in an immersive AR social lounge at The Alexis Royal Sonesta. Join us for a
              premiere movie night celebration featuring interactive AR experiences, themed cocktails, and photo
              opportunities.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-emerald-400">Venue:</span>
                <span>The Alexis Royal Sonesta</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400">Location:</span>
                <span>Author's Corner AR Social Lounge</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400">Date:</span>
                <span>November 21, 2025</span>
              </div>
            </div>
          </div>

          {/* Development Status */}
          <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Development Status</h3>
            <div className="space-y-3">
              {[
                { name: "Photo Booth AR Frame", status: "planned", progress: 0 },
                { name: "Glinda Avatar Greeting", status: "planned", progress: 0 },
                { name: "Themed Cocktail Menu", status: "in-progress", progress: 60 },
                { name: "Emerald Glow Effects", status: "completed", progress: 100 },
                { name: "QR Onboarding Flow", status: "completed", progress: 100 },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span
                      className={
                        item.status === "completed"
                          ? "text-green-400"
                          : item.status === "in-progress"
                            ? "text-amber-400"
                            : "text-gray-400"
                      }
                    >
                      {item.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-emerald-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : item.status === "in-progress"
                            ? "bg-amber-500"
                            : "bg-gray-600"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Planned Features */}
        <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Planned AR Experiences</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Photo Booth",
                description: "Wicked-themed AR frames and filters",
                icon: "📸",
              },
              {
                title: "Glinda Avatar",
                description: "Interactive greeting animation",
                icon: "✨",
              },
              {
                title: "Cocktail Menu",
                description: "5 themed drinks with AR visualization",
                icon: "🍸",
              },
              {
                title: "Bubble Effects",
                description: "Floating emerald bubbles throughout venue",
                icon: "🫧",
              },
              {
                title: "Social Sharing",
                description: "Instant photo sharing with event branding",
                icon: "📱",
              },
              {
                title: "QR Onboarding",
                description: "Seamless entry with deep-link routing",
                icon: "📲",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-emerald-800/30 border border-emerald-700/30 rounded-lg p-4">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-emerald-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
