# Emerald Gem AR Platform - Technical Plan

## Architecture Overview

### Multi-Platform Strategy

\`\`\`
┌─────────────────────────────────────────────────┐
│  User Entry Points                               │
│  • QR Code Scan (Physical Gem)                  │
│  • Direct URL (Marketing)                       │
│  • Meta Horizon World (VR/Mobile)               │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Platform Detection & Routing                    │
│  lib/device-detection.ts                        │
│  • WebXR capable → Web PWA                      │
│  • Meta Quest → Horizon VR                      │
│  • Mobile → Universal AR SDK                    │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┬───────────┐
        │                   │           │
        ▼                   ▼           ▼
┌──────────────┐  ┌─────────────┐  ┌──────────────┐
│  Web PWA     │  │ Meta Horizon│  │ Intersection │
│  (React)     │  │ (TypeScript)│  │ Layer        │
│              │  │             │  │              │
│ • Camera     │  │ • VR World  │  │ • Asset      │
│ • AR Booth   │  │ • Passthrough│  │   Bridge     │
│ • Menu       │  │ • Gizmos    │  │ • State Sync │
│ • Analytics  │  │ • Mobile AR │  │ • Analytics  │
└──────┬───────┘  └──────┬──────┘  └──────┬───────┘
       │                 │                │
       └─────────────────┴────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  Unified Analytics     │
            │  • Vercel Analytics    │
            │  • Cross-platform      │
            └────────────────────────┘
\`\`\`

## Tech Stack

### Web PWA (Foundation)

**Framework:** Next.js 16.0.0 (App Router)
- React 19.2 (Server Components + Client Components)
- TypeScript 5.x
- Tailwind CSS 4.x

**AR/Camera:**
- Native WebRTC (getUserMedia API)
- IWSDK (Immersive Web SDK)
- Universal AR SDK (Zappar Mattercraft)
- Three.js (3D rendering)

**State Management:**
- React useState/useReducer (local state)
- SWR (data fetching + caching)
- Context API (global state where needed)

**Analytics:**
<!-- Updated to Vercel Analytics only -->
- @vercel/analytics (built-in, zero-config)

**Deployment:**
- Vercel (Next.js hosting)
- Edge Functions (API routes)
- CDN (static assets, 3D models)

### Meta Horizon (Transmutation)

**Platform:** Meta Horizon Worlds
- Horizon Desktop Editor
- TypeScript Gizmo Scripts
- Mobile + VR support

**API Access:**
- Passthrough Camera API (experimental, Quest 3/3S)
- Hand Interactions
- UI Gizmos (panels, buttons, text)

**Asset Pipeline:**
- GLTF/GLB 3D models
- Shared asset library with Web PWA
- Format conversion tools

### Intersection Layer

**Purpose:** Bridge Web ↔ Horizon
- Asset synchronization
- State management
- Analytics unification
- Cross-platform event bus

**Implementation:**
- `/intersection/asset-bridge.ts`
- `/intersection/state-sync.ts`
- `/intersection/event-bridge.ts`

## Data Flow

### Camera System

\`\`\`
User Device Camera
       ↓
getUserMedia() (browser API)
       ↓
lib/camera-manager.ts
       ↓
Progressive Fallback:
• Try 60fps (ideal: { width: 1920, height: 1080, frameRate: 60 })
• Fallback 30fps (optimized: { frameRate: 30 })
• Fallback basic (any available stream)
       ↓
<video> element (ref)
       ↓
Canvas/WebGL (for filters)
       ↓
Display + Capture
\`\`\`

### Analytics Flow

<!-- Simplified to Vercel Analytics only -->
\`\`\`
User Action (web, mobile, VR)
       ↓
trackEvent() [lib/analytics.ts]
       ↓
Vercel Analytics track()
       ↓
Vercel Dashboard
       ↓
Product Insights
\`\`\`

### AR Content Rendering

\`\`\`
Cocktail Data (JSON)
       ↓
SWR fetch (/api/cocktails)
       ↓
Three.js Scene Setup
       ↓
Load GLTF Model
       ↓
Position in AR Space
       ↓
User Interaction (rotate, zoom)
       ↓
Analytics tracking
\`\`\`

## API Endpoints

### /api/track (POST)
**Purpose:** Unified analytics tracking endpoint

**Request:**
\`\`\`typescript
{
  userId?: string
  event: string
  properties: Record<string, any>
  type?: 'track' | 'identify'
  traits?: Record<string, any>
  platform: 'web' | 'horizon' | 'mobile'
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: boolean
  type: 'track' | 'identify'
  event?: string
}
\`\`\`

**Implementation:**
- Forwards to Vercel Analytics
- Error handling and retry logic
- Rate limiting (1000 req/min)

### /api/cocktails (GET)
**Purpose:** Fetch cocktail menu data

**Response:**
\`\`\`typescript
{
  cocktails: Array<{
    id: string
    name: string
    description: string
    price: number
    ingredients: string[]
    model3d: string // URL to GLTF model
    image: string
    category: 'signature' | 'classic' | 'seasonal'
  }>
}
\`\`\`

### /api/photos/upload (POST)
**Purpose:** Upload captured AR photos

**Request:** FormData with image blob

**Response:**
\`\`\`typescript
{
  success: boolean
  url: string
  shareUrl: string
}
\`\`\`

## Environment Variables

### Required

<!-- Removed Amplitude, using Vercel Analytics (zero-config) -->
\`\`\`bash
# Event Configuration
NEXT_PUBLIC_EVENT_NAME="Royal Sonesta Seattle Launch"
NEXT_PUBLIC_EVENT_DATE="2025-12-15"

# Feature Flags
NEXT_PUBLIC_ENABLE_PHOTO_BOOTH=true
NEXT_PUBLIC_ENABLE_COCKTAIL_MENU=true
NEXT_PUBLIC_ENABLE_POLLS=false
NEXT_PUBLIC_ENABLE_QA=false

# Git Info (Auto-set by Vercel)
VERCEL_GIT_COMMIT_SHA=<commit_hash>
VERCEL_GIT_COMMIT_REF=<branch_name>
\`\`\`

### Optional

\`\`\`bash
# 8th Wall (iOS Safari fallback)
NEXT_PUBLIC_8THWALL_APP_KEY=<8thwall_key>
\`\`\`

## File Structure

\`\`\`
emerald-gem-ar/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── feature.md
│   │   ├── bug.md
│   │   └── competition.md
│   └── spec-kit/
│       ├── PROJECT_SPEC.md
│       ├── TECHNICAL_PLAN.md
│       └── TASK_BREAKDOWN.md
├── app/
│   ├── api/
│   │   ├── track/route.ts
│   │   ├── cocktails/route.ts
│   │   └── photos/upload/route.ts
│   ├── ar/
│   │   ├── photo-booth/page.tsx
│   │   └── cocktails/page.tsx
│   ├── dashboard/page.tsx
│   ├── transformation/page.tsx
│   ├── layout.tsx
│   ├── layout-client.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── camera/
│   │   └── camera-feed.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── analytics.ts
│   ├── camera-manager.ts
│   └── device-detection.ts
├── intersection/
│   ├── asset-bridge.ts
│   ├── state-sync.ts
│   └── event-bridge.ts
├── docs/
│   ├── CAMERA_ARCHITECTURE.md
│   ├── META_HORIZON_CHALLENGE_STRATEGY.md
│   └── GITHUB_PROJECTS_STRUCTURE.md
├── public/
│   ├── models/ (GLTF 3D assets)
│   └── images/
└── package.json
\`\`\`

## Security

### Client-Side Safety
- NEXT_PUBLIC_* variables exposed (by design)
- Vercel Analytics is zero-config (no API keys needed)

### Server-Side Protection
- Server-only secrets have no NEXT_PUBLIC_ prefix
- Only accessible in API routes
- Never sent to client bundle

### Camera Permissions
- Request permissions with clear explanation
- Handle denial gracefully (fallback to menu-only)
- No video recording, only real-time stream

## Performance Optimization

### Camera
- Progressive quality fallback
- Auto-detect device capabilities
- Retry logic with exponential backoff
- Performance monitoring (FPS, latency, drops)

### 3D Assets
- GLTF/GLB compression
- Draco mesh compression
- Texture optimization
- Lazy loading
- CDN caching

### Code Splitting
- Route-based code splitting (Next.js automatic)
- Dynamic imports for heavy components
- Separate bundles for AR features

### Caching
- SWR for data fetching
- Service Worker (PWA)
- CDN for static assets
- Browser caching headers

## Testing Strategy

### Manual Testing
- Device matrix (iOS/Android, flagship/mid-range)
- Browser compatibility
- Camera permission flows
- AR performance benchmarks

### Automated Testing
- Unit tests (Jest + React Testing Library)
- E2E tests (Playwright)
- Performance monitoring (Lighthouse CI)

### Staging Environment
- Vercel Preview deployments
- Feature flags for gradual rollout
- A/B testing infrastructure

## Deployment

### Vercel Configuration
\`\`\`javascript
// next.config.mjs
export default {
  reactStrictMode: true,
  experimental: {
    cacheComponents: true,
    reactCompiler: true
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(self), microphone=()' }
      ]
    }
  ]
}
\`\`\`

### Continuous Deployment
- Push to `main` → Vercel auto-deploys
- Preview deployments for PRs
- Environment variables via Vercel dashboard

## Monitoring

### Metrics
- Vercel Analytics: DAU, MAU, funnels, Web Vitals, performance
- Custom: Camera FPS, AR initialization time

### Alerts
- Error rate > 1%
- Camera initialization failure > 10%
- API latency > 500ms
- Daily active users < threshold

## Competition Submission Requirements

### Deliverables
1. Horizon world build (published, accessible)
2. Mobile AR experience (iOS + Android)
3. Documentation (README, architecture diagram)
4. Demo video (< 3 min, showcasing Passthrough Camera + AI)
5. Technical writeup (innovation highlights)

### Meta Horizon Start Program
- Enrollment required before Dec 9
- Application: https://developer.meta.com/horizon/start
- Approval time: 1-3 days

### Judging Criteria
- Innovation (Passthrough Camera + AI usage)
- User experience (mobile + VR)
- Technical execution (performance, polish)
- Real-world deployment (Royal Sonesta proof)
- Business viability (ROI model, scalability)
