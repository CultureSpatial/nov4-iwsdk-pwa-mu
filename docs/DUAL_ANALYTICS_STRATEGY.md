# Dual Analytics Strategy: Amplitude + Customer.io

## Overview

The Emerald Gem platform uses a dual analytics approach to maximize insights across all platforms (Web PWA, Mobile AR, Meta Horizon VR).

**Amplitude**: Product analytics, user behavior, funnels, retention
**Customer.io**: Marketing automation, personalized messaging, lifecycle campaigns

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
└─────────┬───────────────────────────────┬───────────┘
          │                               │
          ▼                               ▼
┌──────────────────────┐      ┌──────────────────────┐
│  Amplitude           │      │  Customer.io         │
│  (Client-side)       │      │  (Server-side API)   │
│  • Product analytics │      │  • Identify users    │
│  • User behavior     │      │  • Track events      │
│  • Funnels           │      │  • Trigger campaigns │
└──────────────────────┘      └──────────────────────┘
\`\`\`

## Event Taxonomy

All events follow a consistent naming convention across platforms:

### AR Experience Events
- `ar_session_started` - User enters AR experience
- `ar_session_ended` - User exits AR experience (includes duration)
- `gesture_performed` - Hand gesture detected (platform: web, horizon, mobile)

### Photo Booth Events
- `photo_captured` - Photo taken with optional filter
- `photo_shared` - Photo shared via social/download

### Cocktail Menu Events
- `cocktail_viewed` - User views cocktail in AR
- `cocktail_ordered` - User places order

### Conversion Events
- `gem_scanned` - Physical gem scanned (QR/NFC)
- `checkout_started` - User begins checkout
- `purchase_completed` - Order completed (revenue tracking)

### Horizon-Specific Events
- `horizon_world_entered` - User enters VR world
- `horizon_interaction` - User interacts with VR object

## Platform Detection

All events automatically include platform context:
- `web` - Web PWA on desktop/mobile browser
- `horizon` - Meta Horizon Worlds VR experience
- `mobile` - Mobile AR via Universal AR SDK

## Implementation

### Web PWA (Client-side)

\`\`\`typescript
import { Analytics, identifyUser } from '@/lib/analytics'

// Initialize on app load (automatic in layout.tsx)
// Track events
Analytics.photoCaptured('web', 'emerald_glow')
Analytics.cocktailViewed('web', 'cocktail_123', 'Emerald Martini')

// Identify users
identifyUser('user_123', {
  name: 'Jane Doe',
  email: 'jane@example.com',
  venue_id: 'royal_sonesta_seattle'
})
\`\`\`

### Meta Horizon VR (TypeScript)

\`\`\`typescript
// In Horizon script
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
trackHorizonEvent('photo_captured', { filter_id: 'vr_frame_001' })
\`\`\`

## Environment Variables

Add these to your Vercel project:

\`\`\`bash
# Amplitude (use your own API key from amplitude.com)
NEXT_PUBLIC_AMPLITUDE_API_KEY=

# Customer.io (existing)
NEXT_PUBLIC_CUSTOMERIO_SITE_ID=
CUSTOMERIO_API_KEY=
\`\`\`

## Analytics Use Cases

### Amplitude: Product Insights
- Conversion funnels: gem scan → AR view → order → purchase
- User retention: DAU/WAU/MAU across platforms
- Feature adoption: AR vs standard menu, gesture controls usage
- Platform comparison: web vs horizon engagement metrics
- Cohort analysis: venue performance, time-of-day patterns

### Customer.io: Marketing Automation
- Welcome series: First gem scan triggers onboarding flow
- Re-engagement: Users who viewed but didn't order
- VIP recognition: High-value customer rewards
- Venue-specific campaigns: Location-based promotions
- Cross-platform nudges: "Try our VR lounge" for web users

## Dashboard Integration

The `/dashboard` page displays unified metrics from both platforms:

\`\`\`typescript
{
  amplitude: {
    dau: 245,
    conversions: 67,
    revenue: 4280
  },
  customerio: {
    campaigns_sent: 12,
    opens: 156,
    clicks: 89
  }
}
\`\`\`

## Best Practices

1. **Consistent Naming**: Always use preset Analytics.* functions
2. **Platform Context**: Include platform in all events
3. **User Identification**: Call identifyUser() after auth/registration
4. **Revenue Tracking**: Use purchase_completed for all transactions
5. **Error Handling**: Both systems fail gracefully if APIs are down

## Testing

### Local Development
\`\`\`bash
# Set env vars in .env.local or Vercel Vars section
# Get your Amplitude key from https://amplitude.com

NEXT_PUBLIC_AMPLITUDE_API_KEY=test_key
NEXT_PUBLIC_CUSTOMERIO_SITE_ID=test_site_id
CUSTOMERIO_API_KEY=test_api_key

# Check browser console for tracking logs
[v0] Event tracked: photo_captured { filter_id: 'emerald_glow', platform: 'web' }
\`\`\`

### Vercel Preview/Production
Events automatically flow to production Amplitude and Customer.io projects.

## Migration from Single to Dual Analytics

Existing Customer.io events continue to work. Amplitude adds:
- Real-time dashboards
- Advanced funnel analysis  
- Cohort comparisons
- Retention curves
- A/B test result tracking

Both platforms receive the same events via the unified `trackEvent()` function.

## Support

- Amplitude Docs: https://amplitude.com/docs
- Customer.io Docs: https://customer.io/docs
- Integration Issues: Check `/dashboard` health panel
