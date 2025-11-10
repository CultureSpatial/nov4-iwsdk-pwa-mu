# Emerald Gem - Technical Plan

**Based on:** PROJECT_SPEC.md v1.0
**Stack:** Next.js 16, React 19.2, TypeScript, IWSDK, Universal AR, Amplitude, Customer.io
**Architecture:** Hybrid Web PWA + Meta Horizon VR
**Plan Version:** 1.0

## System Architecture

### High-Level Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  iOS Safari  │ Android Web  │  Meta Quest  │    Desktop     │
│  (Universal  │   (WebXR)    │   (IWSDK)    │  (Fallback)    │
│     AR)      │              │              │                │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       └──────────────┴──────────────┴────────────────┘
                      │
         ┌────────────▼────────────┐
         │   Device Detection      │
         │   (lib/device-detection)│
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │  Camera Manager (60fps) │
         │  (lib/camera-manager)   │
         └────────────┬────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
┌────────┐      ┌──────────┐     ┌──────────┐
│ IWSDK  │      │Universal │     │  WebXR   │
│Manager │      │AR Scene  │     │ Fallback │
└───┬────┘      └────┬─────┘     └────┬─────┘
    │                │                 │
    └────────────────┼─────────────────┘
                     │
         ┌───────────▼──────────┐
         │  Analytics Pipeline   │
         │  (lib/analytics)      │
         └───────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼─────┐          ┌─────▼─────┐
    │Amplitude │          │Customer.io│
    │(Product) │          │(Marketing)│
    └──────────┘          └───────────┘
                     │
         ┌───────────▼──────────┐
         │  Intersection Layer   │
         │  Web ↔ Horizon Sync   │
         └───────────┬───────────┘
                     │
         ┌───────────▼──────────┐
         │   Meta Horizon World  │
         │   (TypeScript/Gizmos) │
         └───────────────────────┘
\`\`\`

## Data Flow & API Architecture

### 1. Camera Access Flow
\`\`\`typescript
// lib/camera-manager.ts
User Action → getUserMedia() → Progressive Fallback
  ├─ Attempt 1: 60fps ideal (1280x720, front-facing)
  ├─ Attempt 2: 30fps optimized (640x480, front-facing)
  └─ Attempt 3: Basic (any resolution, front-facing)
     → Success: Stream to AR framework
     → Failure: Show permission/error UI
\`\`\`

**API Endpoints:**
- N/A (browser WebRTC API only)

**State Management:**
\`\`\`typescript
interface CameraState {
  stream: MediaStream | null;
  status: 'idle' | 'requesting' | 'active' | 'error';
  error: CameraError | null;
  metrics: {
    fps: number;
    latency: number;
    droppedFrames: number;
  };
}
\`\`\`

### 2. Analytics Event Flow
\`\`\`typescript
// User Interaction → Analytics Pipeline → Dual Write

Component Event
  → trackEvent(eventName, properties)
    → Amplitude.track() [client-side]
    → POST /api/track [server-side]
      → Customer.io Pipeline API
\`\`\`

**API Endpoint:**
\`\`\`typescript
// POST /api/track
Request Body: {
  eventName: string;
  properties: Record<string, any>;
  userId?: string;
  timestamp: number;
  platform: 'web' | 'mobile' | 'vr';
}

Response: {
  success: boolean;
  amplitudeStatus: 'sent' | 'error';
  customerioStatus: 'sent' | 'error';
}
\`\`\`

**Event Taxonomy:**
\`\`\`typescript
// Preset Events (lib/analytics.ts)
- ar_session_start
- camera_initialized
- cocktail_viewed
- cocktail_try_on
- photo_captured
- photo_shared
- order_placed
- session_ended
\`\`\`

### 3. Asset Sync Flow (Intersection Layer)
\`\`\`typescript
// Web PWA → Meta Horizon Asset Bridge

Web Component Change
  → intersection/asset-bridge.ts
    → Convert GLB → FBX
    → Upload to CDN
    → Update Horizon world manifest
    → Trigger Horizon Desktop Editor refresh
\`\`\`

**Data Schema:**
\`\`\`typescript
interface Asset {
  id: string;
  name: string;
  type: 'model' | 'texture' | 'audio';
  webFormat: string; // .glb, .png, .mp3
  horizonFormat: string; // .fbx, .png, .mp3
  webUrl: string;
  horizonUrl: string;
  syncStatus: 'pending' | 'synced' | 'error';
  lastSync: Date;
}
\`\`\`

### 4. Customer.io Integration
\`\`\`typescript
// Server-side only (security)

// POST /api/track → Customer.io Pipeline
const response = await fetch('https://cdp.customer.io/v1/events', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${base64(siteId:apiKey)}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: userId,
    name: eventName,
    data: properties,
    timestamp: Date.now() / 1000
  })
});
\`\`\`

## Stack Details

### Frontend (Next.js 16 + React 19.2)
\`\`\`json
{
  "core": {
    "next": "16.0.0",
    "react": "19.2.0",
    "typescript": "^5"
  },
  "ar": {
    "@iwsdk/core": "latest",
    "@zappar/universal-ar": "^1.0.0",
    "three": "latest",
    "@react-three/fiber": "latest",
    "@react-three/drei": "latest"
  },
  "analytics": {
    "@amplitude/analytics-browser": "^2.0.0"
  },
  "ui": {
    "tailwindcss": "^4.0.0",
    "framer-motion": "latest"
  }
}
\`\`\`

### Backend (Next.js API Routes)
\`\`\`typescript
// app/api/track/route.ts - Customer.io integration
// app/api/health/route.ts - System health checks
// app/api/version/route.ts - Deployment tracking
\`\`\`

### Database & Storage
- **Primary:** Vercel KV (Redis) for session state
- **Assets:** Vercel Blob for 3D models/images
- **Analytics:** Amplitude + Customer.io (external)

### Deployment (Vercel)
\`\`\`yaml
# vercel.json
{
  "buildCommand": "pnpm build",
  "framework": "nextjs",
  "regions": ["iad1"], # Washington DC (Royal Sonesta proximity)
  "env": {
    "NEXT_PUBLIC_AMPLITUDE_API_KEY": "@amplitude_key",
    "CUSTOMERIO_API_KEY": "@customerio_key",
    "NEXT_PUBLIC_CUSTOMERIO_SITE_ID": "@customerio_site_id"
  }
}
\`\`\`

## Component Architecture

### Camera System
\`\`\`typescript
// lib/camera-manager.ts (Singleton)
export class CameraManager {
  async initialize(): Promise<MediaStream>
  async switchCamera(direction: 'front' | 'back'): Promise<void>
  getMetrics(): CameraMetrics
  destroy(): void
}

// components/camera/camera-feed.tsx (React UI)
<CameraFeed
  onStreamReady={(stream) => {}}
  onError={(error) => {}}
  targetFPS={60}
  preferredResolution={{ width: 1280, height: 720 }}
/>
\`\`\`

### AR Scenes
\`\`\`typescript
// components/ar/iwsdk-ar-scene.tsx (Meta Quest)
// components/ar/universal-ar-scene.tsx (iOS)
// components/ar/mr-demo-scene.tsx (Android WebXR)

// Shared interface
interface ARScene {
  initialize(): Promise<void>;
  loadAsset(url: string): Promise<Object3D>;
  placeObject(object: Object3D, position: Vector3): void;
  capturePhoto(): Promise<Blob>;
  destroy(): void;
}
\`\`\`

### Analytics Wrapper
\`\`\`typescript
// lib/analytics.ts
export const analytics = {
  // Preset functions
  trackARSession: (platform: Platform) => void;
  trackCocktailView: (cocktailId: string) => void;
  trackPhotoCapture: (frameId: string) => void;
  trackOrder: (items: OrderItem[]) => void;
  
  // Generic
  track: (event: string, props: Record) => void;
};
\`\`\`

## Constraints & Requirements

### Performance Budgets
\`\`\`yaml
Initial Load:
  - HTML: < 50KB
  - CSS: < 100KB
  - JS (first chunk): < 500KB
  - Total FCP: < 3s

Runtime:
  - Camera FPS: 60 (degrade to 30)
  - Memory: < 150MB
  - Battery drain: < 15%/hour
  - Network: Works on 3G (600kbps min)
\`\`\`

### Browser Support
\`\`\`yaml
Tier 1 (Priority):
  - iOS Safari 15+
  - Android Chrome 100+
  - Meta Quest Browser

Tier 2 (Fallback):
  - Desktop Chrome 100+
  - Desktop Safari 15+
  - Edge 100+
\`\`\`

### Security & Privacy
\`\`\`yaml
Camera:
  - Explicit permission prompt
  - No persistent video recording
  - Stream destroyed on unmount

Analytics:
  - PII hashed before transmission
  - GDPR consent banner (EU users)
  - Data retention: 90 days

API Keys:
  - Client: NEXT_PUBLIC_* (Amplitude)
  - Server: CUSTOMERIO_API_KEY (API routes only)
\`\`\`

## Error Handling & Monitoring

### Error Boundaries
\`\`\`typescript
// app/error.tsx - Global error boundary
// components/ar/*-scene.tsx - AR-specific errors
// lib/camera-manager.ts - Camera-specific errors
\`\`\`

### Monitoring Stack
\`\`\`yaml
Real-time:
  - Amplitude (user behavior)
  - Customer.io (event pipeline)
  - Vercel Analytics (web vitals)

Dashboard:
  - /dashboard - Custom metrics UI
  - intersection/transformation-monitor.ts - Pipeline health
\`\`\`

### Alerting Thresholds
\`\`\`yaml
Critical:
  - Camera init failure rate > 10%
  - API error rate > 5%
  - Page load time > 5s (p95)
  - Session completion rate < 40%

Warning:
  - FPS < 30 for > 50% of users
  - Memory usage > 200MB
  - Asset load time > 10s
\`\`\`

## Development Workflow

### Local Development
\`\`\`bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev # → http://localhost:3000

# Run Horizon Desktop Editor (parallel)
# Set API endpoint: http://localhost:3000
\`\`\`

### Testing Strategy
\`\`\`yaml
Unit Tests:
  - lib/camera-manager.test.ts
  - lib/analytics.test.ts
  - intersection/*.test.ts

Integration Tests:
  - Camera → AR scene flow
  - Analytics → Customer.io flow
  - Asset sync flow

E2E Tests (Playwright):
  - Full user journey tests
  - Cross-browser compatibility
  - Performance benchmarks
\`\`\`

### Deployment Pipeline
\`\`\`yaml
1. Code → GitHub (main branch)
2. Vercel auto-deploy → preview URL
3. QA validation on target devices
4. Merge to production → vercel.app domain
5. Custom domain: emeraldgem.royalsonesta.com
\`\`\`

## Integration Points

### Horizon World ↔ Web PWA
\`\`\`typescript
// Horizon TypeScript → Web API
const response = await fetch('https://emeraldgem.app/api/track', {
  method: 'POST',
  body: JSON.stringify({
    eventName: 'vr_session_started',
    properties: { worldId: 'emerald-gem-v1' },
    platform: 'vr'
  })
});
\`\`\`

### Tavus.io Integration (Future Phase 2)
\`\`\`typescript
// AI Avatar video overlay
const avatar = await tavus.createAvatar({
  script: cocktailDescription,
  voice: 'professional-female',
  duration: 15
});

// Overlay on AR scene
arScene.playVideo(avatar.videoUrl);
\`\`\`

---

**Next:** See TASK_BREAKDOWN.md for implementation tasks
