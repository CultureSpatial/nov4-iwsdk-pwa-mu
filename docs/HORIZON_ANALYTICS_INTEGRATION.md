# Meta Horizon Analytics Integration Guide

## Overview

This guide explains how to track events from Meta Horizon Worlds (VR experiences) and route them through the Vercel Analytics pipeline.

## Architecture

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Meta Horizon World (TypeScript)                    │
│  • Photo booth gizmos                               │
│  • Cocktail menu interactions                       │
│  • Gesture detection                                │
└─────────────────┬───────────────────────────────────┘
                  │ HTTP POST
                  ▼
┌─────────────────────────────────────────────────────┐
│  Web API: /api/track (Next.js)                      │
│  • Validates event data                             │
│  • Enriches with platform context                   │
│  • Routes to Vercel Analytics                       │
└─────────────────────────────────────────────────────┘
\`\`\`

## Unified Event Taxonomy

All events use consistent naming across Web PWA, Mobile AR, and Meta Horizon VR:

### AR Experience Events
- `ar_session_started` - User enters AR/VR experience
- `ar_session_ended` - User exits (includes duration)
- `gesture_performed` - Hand gesture detected

### Photo Booth Events
- `photo_captured` - Photo taken (with optional filter)
- `photo_shared` - Photo shared via social/download

### Cocktail Menu Events
- `cocktail_viewed` - User views cocktail in AR/VR
- `cocktail_ordered` - User places order

### Conversion Events
- `gem_scanned` - Physical gem/QR code scanned
- `checkout_started` - User begins purchase flow
- `purchase_completed` - Order finalized

### Horizon-Specific Events
- `horizon_world_entered` - User enters VR world
- `horizon_interaction` - User interacts with VR object

## Implementation: Horizon World → Web API

### 1. Horizon TypeScript Script

\`\`\`typescript
// In your Horizon World script
import * as hz from 'horizon/core';

// Configuration
const API_ENDPOINT = 'https://your-app.vercel.app/api/track';
const WORLD_ID = 'emerald-lounge-vr';

// Track event from Horizon
async function trackHorizonEvent(
  event: string,
  properties: Record<string, any> = {}
) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        properties: {
          ...properties,
          platform: 'horizon',
          world_id: WORLD_ID,
          timestamp: Date.now(),
        },
      }),
    });

    if (!response.ok) {
      console.error('Failed to track event:', response.statusText);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

// Example: Track world entry
class WorldEntryScript extends hz.Component<typeof WorldEntryScript> {
  static propsDefinition = {};

  start() {
    trackHorizonEvent('horizon_world_entered', {
      entry_point: 'main_portal',
    });
  }
}
hz.Component.register(WorldEntryScript);
\`\`\`

### 2. Photo Booth in Horizon

\`\`\`typescript
// Photo booth gizmo script
class PhotoBoothScript extends hz.Component<typeof PhotoBoothScript> {
  static propsDefinition = {
    filterId: { type: hz.PropTypes.String },
  };

  onPhotoCapture() {
    trackHorizonEvent('photo_captured', {
      filter_id: this.props.filterId,
      location: 'vr_photo_booth',
    });

    this.capturePhoto();
  }

  capturePhoto() {
    // Horizon photo capture implementation
  }
}
hz.Component.register(PhotoBoothScript);
\`\`\`

### 3. Cocktail Menu in Horizon

\`\`\`typescript
// Cocktail menu interaction script
class CocktailMenuScript extends hz.Component<typeof CocktailMenuScript> {
  static propsDefinition = {
    cocktailId: { type: hz.PropTypes.String },
    cocktailName: { type: hz.PropTypes.String },
    price: { type: hz.PropTypes.Number },
  };

  onCocktailView() {
    trackHorizonEvent('cocktail_viewed', {
      cocktail_id: this.props.cocktailId,
      cocktail_name: this.props.cocktailName,
      view_method: 'vr_hand_point',
    });
  }

  onCocktailOrder() {
    trackHorizonEvent('cocktail_ordered', {
      cocktail_id: this.props.cocktailId,
      cocktail_name: this.props.cocktailName,
      price: this.props.price,
      order_method: 'vr_button',
    });

    this.processOrder();
  }
}
hz.Component.register(CocktailMenuScript);
\`\`\`

### 4. Gesture Tracking in Horizon

\`\`\`typescript
// Hand gesture detection script
class GestureScript extends hz.Component<typeof GestureScript> {
  static propsDefinition = {};

  onGestureDetected(gestureType: string) {
    trackHorizonEvent('gesture_performed', {
      gesture_type: gestureType,
      hand: 'right',
    });
  }

  onPinch() {
    this.onGestureDetected('pinch');
  }

  onWave() {
    this.onGestureDetected('wave');
  }
}
hz.Component.register(GestureScript);
\`\`\`

## Web API Endpoint

The `/api/track` route handles events from all platforms using Vercel Analytics:

\`\`\`typescript
// app/api/track/route.ts
import { track } from '@vercel/analytics/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, properties } = body;

    // Track event via Vercel Analytics
    await track(event, {
      ...properties,
      tracked_at: new Date().toISOString(),
    });

    return Response.json({ success: true, event });
  } catch (error) {
    console.error('[v0] Track API error:', error);
    return Response.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
\`\`\`

## Platform Detection

All events automatically include `platform` property:
- `web` - Web PWA (browser)
- `horizon` - Meta Horizon VR
- `mobile` - Mobile AR (8th Wall / Universal AR)

This enables cross-platform analysis in Vercel Analytics dashboards.

## Testing

### Local Development

1. **Run Web API Locally:**
   \`\`\`bash
   npm run dev
   # API available at http://localhost:3000/api/track
   \`\`\`

2. **Set Horizon Endpoint:**
   \`\`\`typescript
   const API_ENDPOINT = 'http://localhost:3000/api/track';
   // Or use ngrok for public URL during dev
   \`\`\`

3. **Test Event:**
   \`\`\`bash
   curl -X POST http://localhost:3000/api/track \
     -H "Content-Type: application/json" \
     -d '{
       "event": "horizon_world_entered",
       "properties": {
         "platform": "horizon",
         "world_id": "test_world"
       }
     }'
   \`\`\`

### Production Testing

1. **Deploy to Vercel:**
   \`\`\`bash
   vercel deploy --prod
   \`\`\`

2. **Update Horizon Script:**
   \`\`\`typescript
   const API_ENDPOINT = 'https://your-app.vercel.app/api/track';
   \`\`\`

3. **Test in Horizon World:**
   - Enter VR world
   - Interact with gizmos
   - Check Vercel Analytics dashboard for events

## Error Handling

### Network Failures
\`\`\`typescript
async function trackHorizonEvent(event: string, properties: any) {
  try {
    await fetch(API_ENDPOINT, { /* ... */ });
  } catch (error) {
    // Log locally, don't block user experience
    console.error('Analytics failed:', error);
  }
}
\`\`\`

### Rate Limiting
\`\`\`typescript
// Debounce high-frequency events
let lastTrackTime = 0;
const TRACK_COOLDOWN = 1000; // 1 second

function trackWithCooldown(event: string, properties: any) {
  const now = Date.now();
  if (now - lastTrackTime < TRACK_COOLDOWN) {
    return;
  }
  lastTrackTime = now;
  trackHorizonEvent(event, properties);
}
\`\`\`

## Best Practices

1. **Consistent Event Names:** Use the same event taxonomy across all platforms
2. **Enrich Properties:** Add platform-specific context (world_id, device_type, etc.)
3. **User Privacy:** Respect GDPR/CCPA - don't track PII without consent
4. **Error Handling:** Never block user experience due to analytics failure
5. **Rate Limiting:** Debounce high-frequency events (e.g., gesture tracking)
6. **Testing:** Test in local dev before deploying to production Horizon world

## Summary

**How it works:**
1. User interacts in Meta Horizon World (VR)
2. Horizon TypeScript script calls `trackHorizonEvent()`
3. Event POSTs to `/api/track` (Next.js API route)
4. API route forwards to Vercel Analytics
5. Dashboard displays unified cross-platform analytics

**Key benefit:** Same analytics pipeline for Web PWA, Mobile AR, and Meta Horizon VR - no separate integrations needed.
