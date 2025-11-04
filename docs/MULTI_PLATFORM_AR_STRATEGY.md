# Multi-Platform AR Deployment Strategy

## Overview

This project uses a **three-platform approach** to maximize device reach and overcome WebXR limitations on mobile web browsers (especially iOS Safari).

## The Three Platforms

### 1. Meta IWSDK → Meta Horizon
**Purpose:** Desktop VR and Meta Quest devices

**Deployment Target:** Meta Horizon
- Meta Quest 2/3/Pro
- Desktop VR (SteamVR, Oculus Rift)
- WebXR-compatible browsers on desktop

**Features:**
- Hand tracking
- Controller input
- Physics simulation
- Teleportation/locomotion
- Spatial UI

**Dev & Deploy Hooks:**
- Development: Local testing with Meta Quest Browser
- Deployment: Meta Horizon platform
- Distribution: Meta Horizon Store or direct links

**Implementation:**
\`\`\`typescript
import { IWSDKManager } from '@/lib/iwsdk-manager'

const iwsdk = IWSDKManager.getInstance()
await iwsdk.initialize({
  enableInput: true,
  enablePhysics: true,
  enableLocomotion: true
})
\`\`\`

### 2. Universal AR SDK → Mattercraft (Zappar)
**Purpose:** Mobile AR (iOS and Android)

**Deployment Target:** Mattercraft by Zappar
- iOS Safari (WebAR)
- Android Chrome (WebAR)
- Mobile web browsers

**Features:**
- Image tracking (scan cocktail menus, posters)
- Face tracking (AR filters, effects)
- Instant tracking (place objects in space)
- World tracking

**Dev & Deploy Hooks:**
- Development: Zappar CLI and local testing
- Deployment: Mattercraft platform
- Distribution: QR codes, web links

**Implementation:**
\`\`\`typescript
import { UniversalARManager } from '@/lib/universal-ar'

const universalAR = UniversalARManager.getInstance()
await universalAR.initialize({
  imageTargets: ['cocktail-menu', 'event-poster'],
  faceTracking: true,
  instantTracking: true
})
\`\`\`

### 3. 8th Wall (Optional Enhancement)
**Purpose:** Additional iOS support and enterprise features

**Deployment Target:** 8th Wall Cloud or Self-Hosted
- iOS Safari (enhanced support)
- Android Chrome
- Enterprise features (custom domains, analytics)

**When to Use:**
- Need custom domain branding
- Require advanced analytics
- Want 8th Wall's optimized iOS performance
- Enterprise deployment requirements

**Implementation:**
\`\`\`typescript
import { XR8Scripts, useXR8Ready } from 'react-8thwall-aframe'

// Add to layout
<XR8Scripts xr8ApiKey={process.env.NEXT_PUBLIC_8THWALL_API_KEY} />

// Use in components
const { xrReady, dracoReady, error } = useXR8Ready()
\`\`\`

## Device Detection & Routing

The platform automatically detects device capabilities and routes to the best AR platform:

\`\`\`typescript
// lib/platform-agnostic-ar.ts
export type ARSDKImplementation =
  | "meta-iwsdk"      // Meta Horizon (Quest, desktop VR)
  | "universal-ar"    // Mattercraft (mobile AR)
  | "mattercraft"     // Alias for universal-ar
  | "8thwall"         // Optional iOS enhancement
  | "immersal"        // Future: indoor mapping
  | "niantic"         // Future: Lightship
  | "google-geospatial" // Future: Google ARCore

// Automatic SDK selection based on capabilities
const sdk = platformAgnosticAR.getBestSDK({
  worldMapping: true,
  handTracking: false,
  imageTracking: true
})
\`\`\`

## Deployment Workflow

### Development Phase
1. **Local Development**
   - Test IWSDK features with Meta Quest Browser
   - Test Universal AR with mobile device + Zappar CLI
   - Use device authorization for wireless debugging

2. **Integration Testing**
   - Run `/test/iwsdk` test suite
   - Verify IWSDK + Universal AR integration
   - Test on target devices (Quest, iOS, Android)

### Deployment Phase

#### Meta Horizon Deployment (IWSDK)
1. Build production bundle with IWSDK enabled
2. Upload to Meta Horizon Developer Portal
3. Configure app settings and permissions
4. Submit for review (if publishing to store)
5. Get distribution link or store listing

#### Mattercraft Deployment (Universal AR)
1. Build with Universal AR SDK
2. Deploy to Mattercraft platform via Zappar CLI
3. Configure image targets and tracking settings
4. Generate QR codes for distribution
5. Get web link for mobile access

#### 8th Wall Deployment (Optional)
1. Create 8th Wall project and get API key
2. Add API key to environment variables
3. Configure approved domains for self-hosting
4. Deploy to Vercel with 8th Wall integration
5. Connect custom domain if needed

## Platform Comparison

| Platform | Target Devices | WebXR Required | iOS Support | Deployment |
|----------|---------------|----------------|-------------|------------|
| **IWSDK** | Quest, Desktop VR | Yes | No | Meta Horizon |
| **Universal AR** | Mobile (iOS/Android) | No | Yes | Mattercraft |
| **8th Wall** | Mobile (iOS/Android) | No | Yes | Cloud/Self-hosted |

## Cost Analysis

### IWSDK (Meta Horizon)
- **Development:** Free
- **Deployment:** Free (Meta Horizon hosting)
- **Distribution:** Free (direct links) or store fees

### Universal AR (Mattercraft)
- **Development:** Free tier available
- **Deployment:** Paid plans for production
- **Distribution:** Included in plan

### 8th Wall
- **Development:** Free trial
- **Deployment:** $99-$499/month (Pro/Enterprise)
- **Self-hosting:** Enterprise plan required
- **Distribution:** Included in plan

## Recommended Strategy

### For Nov 4 Event (Current)
1. **Primary:** Universal AR → Mattercraft (mobile guests)
2. **Secondary:** IWSDK → Meta Horizon (VR demo station)
3. **Fallback:** Static web experience

### For Nov 21 Event (Future)
1. **Primary:** Universal AR → Mattercraft (mobile guests)
2. **Enhanced:** 8th Wall (if budget allows for custom domain)
3. **VR Station:** IWSDK → Meta Horizon (immersive demo)

## Environment Variables

\`\`\`bash
# IWSDK (Meta Horizon)
NEXT_PUBLIC_META_APP_ID=your_meta_app_id

# Universal AR (Mattercraft)
NEXT_PUBLIC_ZAPPAR_PROJECT_KEY=your_zappar_key

# 8th Wall (Optional)
NEXT_PUBLIC_8THWALL_API_KEY=your_8thwall_key
\`\`\`

## Testing Checklist

- [ ] IWSDK initializes on Meta Quest Browser
- [ ] Universal AR works on iOS Safari
- [ ] Universal AR works on Android Chrome
- [ ] Image tracking detects cocktail menu
- [ ] Face tracking works for photo booth
- [ ] Hand tracking works in VR mode
- [ ] Fallback works when AR unavailable
- [ ] QR codes route to correct platform
- [ ] Analytics tracking works across platforms

## Support & Resources

- **IWSDK:** [Meta Developer Docs](https://developers.meta.com/horizon/develop/web)
- **Universal AR:** [Zappar Docs](https://docs.zap.works/universal-ar/)
- **Mattercraft:** [Mattercraft Platform](https://mattercraft.io/)
- **8th Wall:** [8th Wall Docs](https://www.8thwall.com/docs)
</parameter>
