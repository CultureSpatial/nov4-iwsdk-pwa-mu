export default function EventsPage() {
  const events = [
    {
      id: "nov4-2024",
      name: "Nov 4 Cultural Hospitality AR Pilot",
      status: "active",
      date: "November 4, 2024",
      venue: "TBD",
      features: ["Photo Booth", "Cocktails Menu", "MR Demo", "QR Onboarding"],
    },
    {
      id: "nov21-2025",
      name: "Emerald City Premiere - Wicked Movie Night",
      status: "in-development",
      date: "November 21, 2025",
      venue: "The Alexis Royal Sonesta",
      location: "Author's Corner AR Social Lounge",
      features: ["Photo Booth", "Themed Cocktails", "Glinda Avatar", "AR Frames"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Event Pipeline</h1>
          <p className="text-emerald-300">Manage and track AR experiences across events</p>
        </div>

        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
                  <div className="space-y-1 text-emerald-300">
                    <p className="text-lg">{event.date}</p>
                    <p>{event.venue}</p>
                    {event.location && <p className="text-sm italic">{event.location}</p>}
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    event.status === "active"
                      ? "bg-green-500/20 text-green-300 border border-green-500/50"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                  }`}
                >
                  {event.status === "active" ? "🟢 Active" : "🔨 In Development"}
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
      </div>
    </div>
  )
}
