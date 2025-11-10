export default function EventsPage() {
  const events = [
    {
      id: "nov4-2024",
      name: "Nov 4 Cultural Hospitality AR Pilot",
      status: "active" as const,
      date: "November 4, 2024",
      venue: "TBD",
      features: ["Photo Booth", "Cocktails Menu", "MR Demo", "QR Onboarding"],
      progress: 100,
    },
    {
      id: "dec15-2025",
      name: "Digital Royal Wardrobe - Spectral Fest",
      status: "critical" as const,
      date: "December 15, 2025",
      venue: "The Royal Sonesta Seattle",
      location: "Event Space",
      features: ["Hand Tracking", "Virtual Try-On", "Ticketing", "Brand Partnerships"],
      progress: 35,
      deadline: "14 days",
      roi: "285%",
      revenue: "$10K+ target",
    },
    {
      id: "nov21-2025",
      name: "Emerald Gem - Bar Top Experience",
      status: "in-development" as const,
      date: "November 21, 2025",
      venue: "The Alexis Royal Sonesta",
      location: "Author's Corner AR Social Lounge",
      features: ["Photo Booth", "AR Cocktail Menu", "Glinda Avatar", "AR Frames"],
      progress: 60,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Event Pipeline</h1>
          <p className="text-emerald-300">B2B Hospitality Flagship Strategy - Bundled Offering Model</p>
        </div>

        <div className="bg-red-900/30 border-2 border-red-500/50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🚨</div>
            <div>
              <h2 className="text-2xl font-bold text-red-300 mb-2">CRITICAL LAUNCH: December 15, 2025</h2>
              <p className="text-red-200 mb-3">
                Digital Royal Wardrobe (HOW-142) soft launch at Royal Sonesta Seattle. This is the flagship B2B pilot
                that validates our 285% ROI model and unlocks 3-venue expansion.
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-red-400 font-semibold">Target Revenue</div>
                  <div className="text-xl font-bold">$10,000+</div>
                </div>
                <div>
                  <div className="text-red-400 font-semibold">Expected Attendees</div>
                  <div className="text-xl font-bold">50+</div>
                </div>
                <div>
                  <div className="text-red-400 font-semibold">Time Remaining</div>
                  <div className="text-xl font-bold">14 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-6 ${
                event.status === "critical"
                  ? "bg-red-900/20 border-red-500/50"
                  : "bg-emerald-900/30 border-emerald-700/50"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
                  <div className="space-y-1 text-emerald-300">
                    <p className="text-lg">{event.date}</p>
                    <p>{event.venue}</p>
                    {event.location && <p className="text-sm italic">{event.location}</p>}
                  </div>

                  {event.roi && (
                    <div className="mt-3 flex gap-4 text-sm">
                      <div>
                        <span className="text-emerald-400">ROI:</span> <span className="font-bold">{event.roi}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400">Revenue Target:</span>{" "}
                        <span className="font-bold">{event.revenue}</span>
                      </div>
                      {event.deadline && (
                        <div>
                          <span className="text-red-400">Deadline:</span>{" "}
                          <span className="font-bold text-red-300">{event.deadline}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                    event.status === "active"
                      ? "bg-green-500/20 text-green-300 border border-green-500/50"
                      : event.status === "critical"
                        ? "bg-red-500/20 text-red-300 border border-red-500/50"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                  }`}
                >
                  {event.status === "active"
                    ? "🟢 Active"
                    : event.status === "critical"
                      ? "🚨 Critical Launch"
                      : "🔨 In Development"}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-emerald-400">Progress</span>
                  <span className="font-semibold">{event.progress}%</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${event.status === "critical" ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{ width: `${event.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-emerald-400 mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {event.features.map((feature) => (
                    <span key={feature} className="px-3 py-1 bg-emerald-800/50 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Bundled Offering Strategy</h2>
          <p className="text-emerald-300 mb-4">
            The <strong>Phigital Lifestyle Hotel Experience Suite</strong> combines two complementary products powered
            by a single SDK:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Digital Royal Wardrobe (Events)</h3>
              <p className="text-sm text-emerald-300">
                Special activations and themed events. Revenue from ticket sales, sponsorships, and brand partnerships.
              </p>
            </div>
            <div className="bg-emerald-950/50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Emerald Gem (Bar Top)</h3>
              <p className="text-sm text-emerald-300">
                Daily bar and restaurant AR experiences. Revenue from F&B uplift, subscriptions, and repeat engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
