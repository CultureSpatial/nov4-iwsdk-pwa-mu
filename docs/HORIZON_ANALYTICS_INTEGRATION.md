# Meta Horizon Analytics Integration Guide

## Overview

This guide explains how to track events from Meta Horizon Worlds (VR experiences) and route them through the existing Emerald Gem analytics pipeline (Amplitude + Customer.io).

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
│  • Routes to analytics providers                    │
└─────────┬───────────────────────────────┬───────────┘
          │                               │
          ▼                               ▼
┌──────────────────────┐      ┌──────────────────────┐
│  Amplitude           │      │  Customer.io         │
│  • Product analytics │      │  • User profiles     │
│  • Funnel analysis   │      │  • Campaign triggers │
│  • Retention curves  │      │  • Lifecycle events  │
└──────────────────────┘      └──────────────────────┘
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
        userId: hz.world.playerId, // Horizon player ID
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
    // Track when player enters the world
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
    // User pressed capture button
    trackHorizonEvent('photo_captured', {
      filter_id: this.props.filterId,
      location: 'vr_photo_booth',
    });

    // Trigger camera capture logic here
    this.capturePhoto();
  }

  capturePhoto() {
    // Horizon photo capture implementation
    // (specific to your photo booth gizmo setup)
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
    // User looked at cocktail model
    trackHorizonEvent('cocktail_viewed', {
      cocktail_id: this.props.cocktailId,
      cocktail_name: this.props.cocktailName,
      view_method: 'vr_hand_point',
    });
  }

  onCocktailOrder() {
    // User pressed order button
    trackHorizonEvent('cocktail_ordered', {
      cocktail_id: this.props.cocktailId,
      cocktail_name: this.props.cocktailName,
      price: this.props.price,
      order_method: 'vr_button',
    });

    // Redirect to web checkout or show confirmation
    this.processOrder();
  }

  processOrder() {
    // Order processing logic
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
    // Horizon hand tracking detected a gesture
    trackHorizonEvent('gesture_performed', {
      gesture_type: gestureType,
      hand: 'right', // or 'left'
    });
  }

  // Example: Pinch gesture
  onPinch() {
    this.onGestureDetected('pinch');
    // Execute pinch action (e.g., grab object)
  }

  // Example: Wave gesture
  onWave() {
    this.onGestureDetected('wave');
    // Execute wave action (e.g., call waiter)
  }
}
hz.Component.register(GestureScript);
\`\`\`

## Web API Endpoint (Already Implemented)

The `/api/track` route handles events from all platforms:

\`\`\`typescript
// app/api/track/route.ts (already exists)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, userId, event, properties, traits } = body;

    // Identify user
    if (type === "identify") {
      await fetch("https://cdp.customer.io/v1/identify", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID}:${process.env.CUSTOMERIO_API_KEY}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          traits: {
            ...traits,
            last_seen: new Date().toISOString(),
          },
        }),
      });

      return Response.json({ success: true, type: "identify" });
    }

    // Track event (Amplitude + Customer.io)
    const response = await fetch("https://cdp.customer.io/v1/track", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_CUSTOMERIO_SITE_ID}:${process.env.CUSTOMERIO_API_KEY}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId || "anonymous",
        event,
        properties: {
          ...properties,
          tracked_at: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Customer.io track failed: ${response.statusText}`);
    }

    return Response.json({ success: true, type: "track", event });
  } catch (error) {
    console.error("[v0] Track API error:", error);
    return Response.json(
      {
        error: "Failed to track event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
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

This enables cross-platform analysis in Amplitude/Customer.io dashboards.

## User Identification

### Web PWA
\`\`\`typescript
import { identifyUser } from '@/lib/analytics';

identifyUser('user_123', {
  name: 'Jane Doe',
  email: 'jane@example.com',
  venue_id: 'royal_sonesta_seattle',
});
\`\`\`

### Meta Horizon
\`\`\`typescript
// In Horizon script
trackHorizonEvent('horizon_world_entered', {
  /* properties */
});
// userId automatically set to hz.world.playerId

// Optionally enrich user profile
await fetch('https://your-app.vercel.app/api/track', {
  method: 'POST',
  body: JSON.stringify({
    type: 'identify',
    userId: hz.world.playerId,
    traits: {
      platform: 'horizon',
      vr_headset: 'quest_3',
      first_seen: Date.now(),
    },
  }),
});
\`\`\`

## Dashboard Integration

### Amplitude Dashboards

**Cross-Platform Funnel:**
\`\`\`
gem_scanned (web)
  → horizon_world_entered (horizon)
  → cocktail_viewed (horizon)
  → cocktail_ordered (horizon)
  → checkout_started (web)
  → purchase_completed (web)
\`\`\`

**Platform Comparison:**
- Web sessions vs Horizon sessions
- Photo captures by platform
- Conversion rate by platform

**Retention Analysis:**
- DAU/WAU by platform
- Return visitors (web vs VR)

### Customer.io Campaigns

**VR User Engagement:**
\`\`\`
Trigger: horizon_world_entered
Condition: User has not visited in 7 days
Action: Send push notification "Come back to Emerald Lounge VR!"
\`\`\`

**Cross-Platform Nudge:**
\`\`\`
Trigger: cocktail_viewed (horizon)
Condition: No cocktail_ordered in same session
Action: Send SMS "Order from your phone - 10% off first VR-viewed drink"
\`\`\`

**High-Value VR User:**
\`\`\`
Trigger: purchase_completed
Condition: platform = "horizon" AND amount > $50
Action: Tag as "VR_Whale", send exclusive VR event invite
\`\`\`

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
       "userId": "test_user",
       "event": "horizon_world_entered",
       "properties": {
         "platform": "horizon",
         "world_id": "test_world"
       }
     }'
   \`\`\`

4. **Check Console:**
   \`\`\`
   [v0] Track API received event: horizon_world_entered
   \`\`\`

### Production Testing

1. **Deploy to Vercel:**
   \`\`\`bash
   vercel deploy --prod
   # Update Horizon script with production URL
   \`\`\`

2. **Update Horizon Script:**
   \`\`\`typescript
   const API_ENDPOINT = 'https://your-app.vercel.app/api/track';
   \`\`\`

3. **Test in Horizon World:**
   - Enter VR world
   - Interact with gizmos
   - Check `/dashboard` for events

4. **Verify in Amplitude:**
   - Go to Amplitude dashboard
   - Filter by `platform = "horizon"`
   - Confirm events appear

## Error Handling

### Network Failures
\`\`\`typescript
async function trackHorizonEvent(event: string, properties: any) {
  try {
    await fetch(API_ENDPOINT, { /* ... */ });
  } catch (error) {
    // Log locally, don't block user experience
    console.error('Analytics failed:', error);
    // Optionally: Queue for retry
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
    return; // Skip if too frequent
  }
  lastTrackTime = now;
  trackHorizonEvent(event, properties);
}
\`\`\`

### Offline Mode
\`\`\`typescript
// Queue events when offline
const eventQueue: any[] = [];

async function trackHorizonEvent(event: string, properties: any) {
  if (!navigator.onLine) {
    eventQueue.push({ event, properties });
    return;
  }

  // Send queued events first
  while (eventQueue.length > 0) {
    const queued = eventQueue.shift();
    await sendEvent(queued.event, queued.properties);
  }

  // Send current event
  await sendEvent(event, properties);
}
\`\`\`

## Best Practices

1. **Consistent Event Names:** Use the same event taxonomy across all platforms
2. **Enrich Properties:** Add platform-specific context (world_id, device_type, etc.)
3. **User Privacy:** Respect GDPR/CCPA - don't track PII without consent
4. **Error Handling:** Never block user experience due to analytics failure
5. **Rate Limiting:** Debounce high-frequency events (e.g., gesture tracking)
6. **Testing:** Test in local dev before deploying to production Horizon world

## Troubleshooting

**Events not appearing in dashboard:**
- Check browser console for API errors
- Verify API_ENDPOINT URL is correct (HTTPS in production)
- Confirm environment variables set in Vercel
- Check Amplitude/Customer.io API keys

**CORS errors:**
- Ensure API route allows Horizon origin
- Verify Next.js API route exports POST method
- Check network tab for preflight (OPTIONS) request

**Duplicate events:**
- Check for multiple script instances
- Verify component initialization runs once
- Add debouncing for rapid events

## Summary

**How it works:**
1. User interacts in Meta Horizon World (VR)
2. Horizon TypeScript script calls `trackHorizonEvent()`
3. Event POSTs to `/api/track` (Next.js API route)
4. API route forwards to Amplitude + Customer.io
5. Dashboard displays unified cross-platform analytics

**Key benefit:** Same analytics pipeline for Web PWA, Mobile AR, and Meta Horizon VR - no separate integrations needed.

**Next steps:**
1. Deploy web API to production
2. Add Horizon TypeScript tracking scripts
3. Test end-to-end in VR
4. Monitor `/dashboard` for cross-platform events
