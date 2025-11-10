# Emerald Gem AR Platform - Technical Plan

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5+ (strict mode)
- **UI Library:** React 19.2 with Server Components
- **Styling:** Tailwind CSS v4
- **3D Graphics:** Three.js + React Three Fiber + Drei
- **AR SDKs:**
  - IWSDK (Immersive Web SDK) for Meta Horizon OS
  - Universal AR (@zappar/universal-ar) for mobile
  - Native WebXR for Android/desktop

### Backend
- **Runtime:** Next.js API Routes (server-side)
- **Database:** Supabase (PostgreSQL) - SQL scripts in /scripts
- **Analytics:**
  - Amplitude (client-side product analytics)
  - Customer.io (server-side marketing automation)
- **AI:** Tavus.io video API for concierge avatars

### DevOps
- **Hosting:** Vercel (production + preview)
- **Version Control:** GitHub with Projects + Spec Kit
- **CI/CD:** GitHub Actions (automated testing + deployment)
- **Monitoring:** Amplitude dashboards + Customer.io pipelines

### Meta Horizon
- **Platform:** Meta Horizon Worlds (Desktop Editor)
- **Scripting:** TypeScript (horizon/core module)
- **Assets:** FBX models, PNG textures, MP3 audio
- **Distribution:** Meta Horizon mobile + Quest 3/3S VR

## Architecture

### System Components

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                     User Devices                        │
│  Mobile Browser │ Desktop Browser │ Quest 3 Headset    │
└──────────┬──────┴────────┬────────┴──────────┬─────────┘
           │               │                    │
    ┌──────▼──────┐ ┌─────▼──────┐   ┌────────▼────────┐
    │  PWA (Web)  │ │ PWA (Web)  │   │ Horizon World   │
    │  Universal  │ │  WebXR     │   │   TypeScript    │
    │     AR      │ │   IWSDK    │   │    Gizmos       │
    └──────┬──────┘ └─────┬──────┘   └────────┬────────┘
           │               │                    │
           └───────────────┼────────────────────┘
                           │
                ┌──────────▼──────────┐
                │  Intersection Layer  │
                │   (State Sync +      │
                │    Event Bridge)     │
                └──────────┬───────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                  │
    ┌────▼────┐      ┌─────▼──────┐    ┌────▼─────┐
    │Amplitude│      │Customer.io │    │ Supabase │
    │Analytics│      │  Pipeline  │    │ Database │
    └─────────┘      └────────────┘    └──────────┘
\`\`\`

### Camera System Architecture

\`\`\`
Camera Manager (lib/camera-manager.ts)
├─ Phase 1: Device enumeration
├─ Phase 2: Constraint application
│  ├─ Tier 1: 60fps, 1920x1080, front-facing
│  ├─ Tier 2: 30fps, 1280x720, front-facing
│  └─ Tier 3: Basic constraints, any camera
├─ Phase 3: Stream initialization
├─ Phase 4: Performance monitoring
│  ├─ FPS tracking
│  ├─ Latency measurement
│  └─ Frame drop detection
└─ Phase 5: Error recovery
   ├─ Auto-retry with exponential backoff
   ├─ Fallback to lower tier
   └─ User-friendly error UI
\`\`\`

### Analytics Pipeline

\`\`\`
Event Sources:
├─ Web PWA (client): trackARInteraction(), trackPhotoCapture()
├─ Horizon VR (server): fetch('/api/track', { method: 'POST' })
└─ Mobile AR (client): trackCocktailOrder(), trackCameraInit()

                    ▼
             
          lib/analytics.ts
          (Dual-write orchestration)
          
          ▼                    ▼
          
   Amplitude SDK        Customer.io Pipeline API
   (Browser)            (app/api/track/route.ts)
   
   - User properties    - Event data + metadata
   - Session tracking   - User identification
   - Funnel analysis    - Journey automation
\`\`\`

### Intersection Layer (Web ↔ Horizon)

**Purpose:** Enable seamless transmutation from web scaffold → Horizon stabilization

**Components:**
- `intersection/asset-bridge.ts` - GLB→FBX conversion, texture optimization
- `intersection/state-sync.ts` - Cross-platform state management
- `intersection/event-bridge.ts` - Unified event tracking
- `intersection/transformation-monitor.ts` - Pipeline health monitoring

**Data Flow:**
1. Developer updates 3D model in web (`/public/models/cocktail.glb`)
2. Asset bridge detects change, converts to FBX
3. Uploads to Horizon Asset Library via Meta API
4. Transformation monitor logs sync status
5. Dashboard displays real-time sync metrics

## API Endpoints

### Web API Routes

**POST /api/track**
\`\`\`typescript
// Purpose: Unified event tracking for Amplitude + Customer.io
// Request: { event: string, properties: object, userId?: string }
// Response: { success: boolean, errors?: string[] }
// Used by: Web PWA, Horizon VR scripts, Mobile AR
\`\`\`

**GET /api/health**
\`\`\`typescript
// Purpose: System health check
// Response: { status: 'healthy' | 'degraded', uptime: number }
\`\`\`

**POST /api/customerio/webhook**
\`\`\`typescript
// Purpose: Receive Customer.io webhook events (future)
// Request: Customer.io webhook payload
// Response: { received: boolean }
\`\`\`

### Horizon TypeScript → Web API

**Pattern:**
\`\`\`typescript
// In Horizon TypeScript script
async function trackEvent(eventName: string, properties: object) {
  await fetch('https://yourdomain.com/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: eventName,
      properties: { ...properties, platform: 'horizon-vr' },
      userId: getCurrentUserId()
    })
  });
}
\`\`\`

## Data Models

### User Profile (Supabase)
\`\`\`sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  name TEXT,
  hotel_guest_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_seen TIMESTAMP
);
\`\`\`

### AR Session (Supabase)
\`\`\`sql
CREATE TABLE ar_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  platform TEXT, -- 'web', 'mobile', 'vr'
  device_type TEXT,
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  interactions JSONB
);
\`\`\`

### Analytics Event Schema
\`\`\`typescript
interface AnalyticsEvent {
  event: string;
  userId?: string;
  timestamp: number;
  properties: {
    platform: 'web' | 'mobile' | 'vr' | 'horizon';
    deviceType?: string;
    sessionId: string;
    [key: string]: any;
  };
}
\`\`\`

## Performance Requirements

### Camera System
- **Target:** 60fps on iPhone 14+, Pixel 7+, Quest 3
- **Acceptable:** 30fps on iPhone 12+, Pixel 5+
- **Minimum:** 15fps with degraded UX warning
- **Initialization:** <1s on modern devices, <3s on older devices
- **Success Rate:** 95%+ across device matrix

### Web PWA
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <2.5s
- **Bundle Size:** <500KB initial, <2MB total
- **Lighthouse Score:** 90+ on mobile

### Meta Horizon
- **Frame Rate:** 72fps on Quest 3, 60fps on Quest 2
- **Load Time:** <5s world load
- **Asset Size:** <100MB total world size
- **Tracking:** 60fps hand tracking for interactions

## Security & Privacy

### Environment Variables
- **Public (client-side):** `NEXT_PUBLIC_AMPLITUDE_API_KEY`, `NEXT_PUBLIC_CUSTOMERIO_SITE_ID`
- **Private (server-only):** `CUSTOMERIO_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Camera Permissions
- Request with clear user explanation
- Graceful degradation if denied
- No recording without explicit consent
- Delete photos on user request

### Data Handling
- GDPR/CCPA compliant
- No PII in analytics without consent
- Secure transmission (HTTPS only)
- 30-day data retention policy

## Constraints & Trade-offs

### Constraint 1: iOS WebXR Limitation
**Issue:** iOS Safari doesn't support WebXR
**Solution:** Universal AR (Zappar Mattercraft) for iOS, native WebXR for Android
**Trade-off:** Dual AR implementation path increases complexity

### Constraint 2: December 9 Competition Deadline
**Issue:** Only 4 days to submit
**Solution:** Use existing IWSDK web app as submission, defer full Horizon world
**Trade-off:** Miss potential VR-specific judging criteria

### Constraint 3: Front Camera Performance
**Issue:** Older devices struggle with 60fps
**Solution:** Progressive fallback (60→30→15fps) with transparent UX
**Trade-off:** Inconsistent experience across devices

### Constraint 4: Cross-Platform Analytics
**Issue:** Horizon VR can't run browser analytics SDKs
**Solution:** Server-side API bridge via /api/track endpoint
**Trade-off:** Slight latency in event tracking

## Dependencies

### External Services
- Amplitude (analytics) - Status: Pending API key
- Customer.io (marketing automation) - Status: Pending API key
- Tavus.io (AI video avatars) - Status: To be integrated
- Supabase (database) - Status: Connected
- Vercel (hosting) - Status: Active

### Internal Modules
- `lib/camera-manager.ts` → `components/camera/camera-feed.tsx`
- `lib/analytics.ts` → All pages/components
- `intersection/*` → Dashboard monitoring
- AR components → IWSDK, Universal AR, Three.js

### Third-Party Packages
\`\`\`json
{
  "@amplitude/analytics-browser": "^2.x",
  "@zappar/universal-ar": "^1.0.0",
  "@iwsdk/core": "latest",
  "three": "latest",
  "@react-three/fiber": "latest",
  "@react-three/drei": "latest"
}
\`\`\`

## Testing Strategy

### Unit Tests
- Camera manager fallback logic
- Analytics dual-write mechanism
- Asset bridge conversion functions

### Integration Tests
- PWA installation flow end-to-end
- AR session lifecycle
- Cross-platform event tracking

### Manual QA Matrix
| Device | Browser | PWA | AR | Camera | Photo |
|--------|---------|-----|----|----|-------|
| iPhone 14 Pro | Safari | ✅ | ✅ | ✅ | ✅ |
| iPhone 12 | Safari | ✅ | ✅ | ⚠️ | ✅ |
| Pixel 7 | Chrome | ✅ | ✅ | ✅ | ✅ |
| Quest 3 | Horizon | N/A | ✅ | ✅ | ✅ |

### Performance Testing
- Camera FPS under various lighting
- PWA load time on 3G/4G/5G
- Horizon world frame rate with multiple users

## Rollout Plan

### Phase 1: Web PWA MVP (Dec 3-8)
- Camera system hardened
- AR try-on flows functional
- Analytics integrated
- Competition submission ready

### Phase 2: Competition Submission (Dec 9)
- Demo video produced
- Devpost submission complete
- Meta Horizon Start Program joined

### Phase 3: Royal Sonesta Launch (Dec 10-15)
- Device testing at venue
- Staff training completed
- Day-of runbook distributed
- Soft launch on December 15

### Phase 4: Post-Launch Optimization (Dec 16-31)
- User feedback analysis
- Performance tuning
- Bug fixes
- Horizon world stabilization

### Phase 5: Scale Preparation (Jan 2026)
- Additional hotel contracts
- Q1 Meta competition submission
- Feature expansion based on metrics

---

*This technical plan aligns with PROJECT_SPEC.md and serves as the AI coding agent's implementation guide.*
