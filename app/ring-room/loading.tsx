export default function RingRoomLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        {/* Animated ring loader */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-amber-500 animate-spin"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          />
          <div
            className="absolute inset-4 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"
            style={{ animationDuration: "2s" }}
          />
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">Loading Ring Room</h2>
        <p className="text-slate-400 text-sm">Preparing your immersive experience...</p>

        {/* Progress indicators */}
        <div className="mt-6 space-y-2 max-w-xs mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Loading 3D assets</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <span>Initializing WebXR</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
            <span>Checking device capabilities</span>
          </div>
        </div>
      </div>
    </div>
  )
}
