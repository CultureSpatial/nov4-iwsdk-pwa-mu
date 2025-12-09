# Ring Room AR Demo - Technical Plan

## Architecture Overview

### Ring Room Demo Flow

\`\`\`
┌─────────────────────────────────────────────────┐
│  User Entry Points                               │
│  • QR Code Scan (Physical Ring Display)         │
│  • Direct URL (Marketing)                       │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Platform Detection & Routing                    │
│  lib/device-detection.ts                        │
│  • WebXR capable → Web AR Experience            │
│  • Mobile → IWSDK Integration                   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│  Ring Room Experience                            │
│  (React + Three.js + IWSDK)                     │
│                                                  │
│  • 3D Ring Visualization                        │
│  • Try-On AR Experience                         │
│  • Shortlist Management                         │
│  • Analytics Tracking                           │
└──────────────────────────────────────────────────┘
\`\`\`

## Tech Stack

### Web Application

**Framework:** Next.js 16.0.0 (App Router)
- React 19.2 (Server Components + Client Components)
- TypeScript 5.x
- Tailwind CSS 4.x

**AR/3D:**
- IWSDK (Immersive Web SDK)
- Three.js (3D rendering)
- Native WebRTC (getUserMedia API)

**State Management:**
- React useState/useReducer (local state)
- SWR (data fetching + caching)
- Context API (global state where needed)

**Analytics:**
- @vercel/analytics (built-in, zero-config)

**Deployment:**
- Vercel (Next.js hosting)
- Edge Functions (API routes)
- CDN (static assets, 3D models)

## Data Flow

### Ring Room Experience

\`\`\`
User enters Ring Room
       ↓
Load Ring Data (lib/ring-data.ts)
       ↓
Initialize 3D Scene (Three.js)
       ↓
IWSDK AR Integration
       ↓
User Interaction:
• Browse rings
• Try on via AR
• Add to shortlist
       ↓
Analytics tracking
\`\`\`

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
AR Overlay (Three.js)
       ↓
Display + Capture
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
  platform: 'web' | 'mobile'
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

## Environment Variables

### Required

\`\`\`bash
# Event Configuration
NEXT_PUBLIC_EVENT_NAME="Ring Room Demo"
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

### Server-Side Only

Server-side API keys should be configured directly in the Vercel dashboard and never committed to code.

## File Structure

\`\`\`
ring-room-demo/
├── app/
│   ├── api/
│   │   └── track/route.ts
│   ├── ring-room/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── test/
│   │   └── iwsdk/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ring-room/
│   │   ├── ring-room-scene.tsx
│   │   ├── shortlist-tray.tsx
│   │   └── xr-ring-scene.tsx
│   ├── camera/
│   │   └── camera-feed.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── analytics.ts
│   ├── ring-data.ts
│   ├── shortlist-manager.ts
│   ├── iwsdk-integration.ts
│   ├── camera-manager.ts
│   └── device-detection.ts
├── docs/
│   └── (documentation files)
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
- Configure sensitive keys via Vercel dashboard only

### Camera Permissions
- Request permissions with clear explanation
- Handle denial gracefully
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
