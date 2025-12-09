# Project Structure Documentation

## Overview

**Project Name:** Ring Room - Engagement Ring Consultation MVP  
**Platform:** Meta Immersive Web SDK (IWSDK) compatible via WebXR API  
**Framework:** Next.js 16.0.7 + React 19.2 + Three.js (via @react-three/fiber)  
**Entry Point:** `/ring-room`

---

## Directory Structure

\`\`\`
/
├── app/
│   ├── ring-room/
│   │   └── page.tsx              # Ring Room route entry point
│   ├── page.tsx                  # Main homepage
│   ├── layout.tsx                # Root layout with metadata
│   ├── layout-client.tsx         # Client-side layout wrapper
│   └── api/
│       └── track/route.ts        # Analytics tracking endpoint
│
├── components/
│   ├── ring-room/                # Ring Room WebXR components
│   │   ├── ring-room-scene.tsx   # Main 3D scene (flat mode)
│   │   ├── xr-ring-scene.tsx     # Immersive VR/AR scene
│   │   ├── ring-model.tsx        # Procedural 3D ring component
│   │   ├── ring-detail-panel.tsx # SKU info panel UI
│   │   ├── shortlist-tray.tsx    # Bottom shortlist UI
│   │   ├── xr-button.tsx         # WebXR session management
│   │   └── performance-monitor.tsx # FPS monitoring
│   ├── camera/
│   │   └── camera-feed.tsx       # AR camera integration
│   └── ui/                       # shadcn/ui components
│
├── lib/
│   ├── ring-data.ts              # Ring catalog + shortlist manager
│   ├── analytics.ts              # Dual analytics (Amplitude + Customer.io)
│   ├── camera-manager.ts         # Camera system for AR
│   └── utils.ts                  # Utility functions
│
├── hooks/
│   ├── use-frame-rate.ts         # FPS monitoring hook
│   └── use-mobile.ts             # Mobile detection
│
├── intersection/
│   └── event-bridge.ts           # Cross-platform event routing
│
└── docs/                         # Documentation
\`\`\`

---

## WebXR / IWSDK Architecture

### Where WebXR is Initialized

**File:** `components/ring-room/xr-button.tsx`

\`\`\`typescript
// WebXR capability detection
useEffect(() => {
  async function checkXRSupport() {
    if (!navigator.xr) {
      // No WebXR API available
      return
    }
    
    // Check VR support
    const vrSupported = await navigator.xr.isSessionSupported("immersive-vr")
    
    // Check AR support
    const arSupported = await navigator.xr.isSessionSupported("immersive-ar")
  }
  checkXRSupport()
}, [])
\`\`\`

### How WebXR Session Starts

**File:** `components/ring-room/xr-button.tsx`

\`\`\`typescript
// VR Session Request
const enterVR = async () => {
  const session = await navigator.xr.requestSession("immersive-vr", {
    optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
  })
  
  session.addEventListener("end", () => {
    // Handle session end
  })
  
  onEnterXR(session)
}

// AR Session Request
const enterAR = async () => {
  const session = await navigator.xr.requestSession("immersive-ar", {
    optionalFeatures: ["local-floor", "hit-test", "dom-overlay"],
    domOverlay: { root: document.body },
  })
  
  onEnterXR(session)
}
\`\`\`

### Session State Management

**File:** `components/ring-room/ring-room-scene.tsx`

\`\`\`typescript
const [xrSession, setXrSession] = useState<XRSession | null>(null)
const [isInXR, setIsInXR] = useState(false)

const handleEnterXR = useCallback((session: XRSession) => {
  setXrSession(session)
  setIsInXR(true)
}, [])

const handleExitXR = useCallback(() => {
  setXrSession(null)
  setIsInXR(false)
}, [])

// Conditional rendering based on XR state
if (isInXR) {
  return <XRRingScene xrSession={xrSession} onSessionEnd={handleExitXR} />
}
\`\`\`

---

## Three.js Scene Architecture

### Core Dependencies

\`\`\`json
{
  "@react-three/fiber": "9.4.2",   // React renderer for Three.js
  "@react-three/drei": "10.7.7",  // Helper components
  "@react-three/xr": "6.6.28",    // WebXR integration
  "three": "0.181.2"              // Three.js core
}
\`\`\`

### Flat Mode Scene (Desktop/Mobile)

**File:** `components/ring-room/ring-room-scene.tsx`

\`\`\`typescript
<Canvas
  gl={{
    antialias: !isQuest,           // Disable AA on Quest
    powerPreference: "high-performance",
    alpha: false,
  }}
  dpr={isQuest ? 1 : [1, 2]}       // Fixed DPR on Quest
>
  <PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={50} />
  
  {/* Lighting */}
  <ambientLight intensity={0.4} />
  <spotLight position={[5, 5, 5]} castShadow />
  
  {/* Environment */}
  <Environment preset="studio" />
  
  {/* Ring models */}
  {RING_CATALOG.map((ring, index) => (
    <RingModel key={ring.id} ring={ring} position={positions[index]} />
  ))}
  
  {/* Camera controls */}
  <OrbitControls enablePan={false} />
</Canvas>
\`\`\`

### Immersive XR Scene

**File:** `components/ring-room/xr-ring-scene.tsx`

\`\`\`typescript
<Canvas gl={{ antialias: true, alpha: true }} camera={{ position: [0, 1.6, 0], fov: 70 }}>
  <XR>
    <Controllers />     {/* Quest controller rendering */}
    <Hands />           {/* Hand tracking support */}
    <XROrigin>
      <XRRingDisplay /> {/* Rings positioned at standing height */}
    </XROrigin>
  </XR>
</Canvas>
\`\`\`

---

## Ring Room Integration Entry Point

### Route Configuration

**File:** `app/ring-room/page.tsx`

\`\`\`typescript
import { RingRoomScene } from "@/components/ring-room/ring-room-scene"

export const metadata = {
  title: "Ring Room - Engagement Ring Consultation | Emerald Gem",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,     // Important for XR
  themeColor: "#0f172a",
}

export default function RingRoomPage() {
  return <RingRoomScene />
}
\`\`\`

### Access URL

\`\`\`
/ring-room
\`\`\`

---

## Quest Optimization Layer

### Device Detection

**File:** `components/ring-room/ring-room-scene.tsx`

\`\`\`typescript
function useQuestDetection() {
  const [isQuest, setIsQuest] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    const isQuestBrowser = ua.includes("quest") || ua.includes("oculus")
    setIsQuest(isQuestBrowser)
  }, [])

  return isQuest
}
\`\`\`

### Performance Adaptations

| Feature | Desktop | Quest |
|---------|---------|-------|
| Antialiasing | Enabled | Disabled |
| DPR | [1, 2] | 1 (fixed) |
| Shadows | Enabled | Disabled |
| Contact Shadows | Enabled | Disabled |
| Environment Preset | "studio" | "apartment" |
| Orbit Damping | Enabled | Disabled |
| Ring Geometry Segments | High (64) | Medium (32) |

---

## Data Flow

### Ring Data

**File:** `lib/ring-data.ts`

\`\`\`
RING_CATALOG (static) ──► RingModel (3D) ──► RingDetailPanel (UI)
                                    │
                                    ▼
                          ShortlistManager (state)
                                    │
                                    ▼
                          ShortlistTray (UI)
\`\`\`

### Event Flow

\`\`\`
User Tap ──► RingModel.onSelect() ──► setSelectedRingId()
                                              │
                                              ▼
                                      RingDetailPanel (shown)

User Drag ──► RingModel.onDragToShortlist() ──► shortlistManager.add()
                                                        │
                                                        ▼
                                                ShortlistTray (updated)
\`\`\`

---

## IWSDK Compatibility Notes

### Current Implementation

This project uses the **WebXR Device API** directly via `@react-three/xr`, which is compatible with:
- Meta Quest Browser (primary target)
- Chrome for Android with ARCore
- Edge with Windows Mixed Reality

### Meta Immersive Web SDK

The Meta IWSDK provides additional features on top of WebXR:
- Enhanced hand tracking
- Passthrough API
- Spatial anchors
- Scene understanding

**Integration Path:** To add full IWSDK support, install `@meta-quest/immersive-web-sdk` and enhance the XR scene with Meta-specific features.

\`\`\`typescript
// Future IWSDK integration point
import { ImmersiveSession } from "@meta-quest/immersive-web-sdk"

// In xr-ring-scene.tsx, wrap with IWSDK features
\`\`\`

---

## Key Files Summary

| File | Purpose |
|------|---------|
| `app/ring-room/page.tsx` | Route entry point |
| `components/ring-room/ring-room-scene.tsx` | Main scene orchestrator |
| `components/ring-room/xr-ring-scene.tsx` | Immersive XR scene |
| `components/ring-room/xr-button.tsx` | WebXR session management |
| `components/ring-room/ring-model.tsx` | 3D ring with interactions |
| `lib/ring-data.ts` | Data + shortlist state |

---

## Development Commands

\`\`\`bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Deploy to Vercel
vercel deploy
\`\`\`

**Testing URL:** Open `/ring-room` in Meta Quest Browser for full XR testing.
