# Analytics Strategy: Vercel Analytics

## Overview

The Emerald Gem platform uses **Vercel Analytics** for unified product analytics across all platforms (Web PWA, Mobile AR, Meta Horizon VR).

<!-- Complete rewrite to reflect Vercel Analytics only -->

## Architecture

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Event Sources                                       │
│  • Web PWA (React/Next.js)                          │
│  • Mobile AR (Universal AR SDK)                     │
│  • Meta Horizon VR (TypeScript Scripts)            │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  lib/analytics.ts (Unified Tracking Layer)         │
│  • trackEvent()                                     │
│  • identifyUser()                                   │
│  • Analytics.* preset functions                    │
└─────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Vercel Analytics                                   │
│  • Zero-config setup                               │
│  • Automatic Web Vitals                            │
│  • Custom event tracking                           │
│  • Built-in dashboard                              │
└─────────────────────────────────────────────────────┘
\`\`\`

## Event Taxonomy

All events follow a consistent naming convention across platforms:

### AR Experience Events
- `ar_session_started` - User enters AR experience
- `ar_session_ended` - User exits AR experience (includes duration)
- `gesture_performed` - Hand gesture detected (platform: web, horizon, mobile)

### Ring Room Events
- `ring_viewed` - User views ring details
- `ring_selected` - User selects a ring
- `ring_shortlisted` - User adds ring to shortlist
- `ring_removed_from_shortlist` - User removes ring

### Photo Booth Events
- `photo_captured` - Photo taken with optional filter
- `photo_shared` - Photo shared via social/download

### Cocktail Menu Events
- `cocktail_viewed` - User views cocktail in AR
- `cocktail_ordered` - User places order

### XR Events
- `xr_mode_entered` - User enters VR/AR mode
- `xr_mode_exited` - User exits VR/AR mode
- `iwsdk_initialized` - IWSDK successfully loaded
- `spatial_anchor_created` - Spatial anchor placed

### Performance Events
- `fps_drop_detected` - Frame rate dropped below threshold
- `performance_mode_enabled` - Quality degradation triggered

## Platform Detection

All events automatically include platform context:
- `web` - Web PWA on desktop/mobile browser
- `horizon` - Meta Horizon Worlds VR experience
- `mobile` - Mobile AR via Universal AR SDK

## Implementation

### Web PWA (Client-side)

\`\`\`typescript
import { Analytics, identifyUser } from '@/lib/analytics'

// Track events
Analytics.ringViewed('web', 'ring_123', 'Emerald Solitaire')
Analytics.photoCaptured('web', 'emerald_glow')

// Identify users (optional)
identifyUser('user_123', {
  name: 'Jane Doe',
  venue_id: 'royal_sonesta_seattle'
})
\`\`\`

### Meta Horizon VR (TypeScript)

\`\`\`typescript
// In Horizon script - call web API endpoint
async function trackHorizonEvent(event: string, properties: any) {
  await fetch('https://your-domain.vercel.app/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: hz.world.playerId,
      event,
      properties: {
        ...properties,
        platform: 'horizon'
      }
    })
  })
}

// Track VR events
trackHorizonEvent('horizon_world_entered', { world_id: 'emerald_lounge' })
\`\`\`

## Environment Variables

**No API keys required!** Vercel Analytics is zero-config when deployed to Vercel.

For local development, events are logged to console:
\`\`\`
[v0 Analytics] ring_viewed { ring_id: 'ring_123', platform: 'web' }
\`\`\`

## Analytics Use Cases

### Product Insights
- Conversion funnels: ring view → shortlist → purchase
- User retention: DAU/WAU/MAU across platforms
- Feature adoption: AR vs standard view, gesture controls usage
- Platform comparison: web vs horizon engagement metrics
- Performance monitoring: FPS drops, load times

### Dashboard

View analytics at: https://vercel.com/[your-project]/analytics

Metrics available:
- Page views and unique visitors
- Custom events and conversions
- Web Vitals (LCP, FID, CLS)
- Geographic distribution
- Device and browser breakdown

## Best Practices

1. **Consistent Naming**: Always use preset Analytics.* functions
2. **Platform Context**: Include platform in all events
3. **User Identification**: Call identifyUser() after auth (optional)
4. **Error Handling**: Analytics fails gracefully if unavailable

## Testing

### Local Development
Events are logged to browser console:
\`\`\`
[v0 Analytics] ring_viewed { ring_id: 'ring_123', ring_name: 'Emerald Solitaire', platform: 'web' }
\`\`\`

### Production
Events automatically flow to Vercel Analytics dashboard.

## Support

- Vercel Analytics Docs: https://vercel.com/docs/analytics
- Integration Issues: Check browser console for `[v0 Analytics]` logs
