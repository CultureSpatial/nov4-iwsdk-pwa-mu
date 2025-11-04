# Customer.io Integration Guide

## Overview

This project uses a webhook-based approach for Customer.io integration, keeping API keys secure on the server while providing simple client-side tracking.

## Architecture

\`\`\`
Client → /api/track webhook → Customer.io Track API
\`\`\`

### Benefits
- API keys stay on server (more secure)
- Simple client-side code
- Server-side validation and sanitization
- Easy to add logging/analytics
- No third-party scripts loaded on client

## Required Environment Variables

### Client-side (optional for display)
\`\`\`bash
NEXT_PUBLIC_CUSTOMERIO_SITE_ID=your_site_id
\`\`\`

### Server-side (required for tracking)
\`\`\`bash
CUSTOMERIO_API_KEY=your_api_key
\`\`\`

## Usage

### Identify Users
\`\`\`typescript
import { identifyUser } from '@/lib/customerio'

// Identify a user with attributes
await identifyUser('user_123', {
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'premium',
  created_at: Math.floor(Date.now() / 1000)
})
\`\`\`

### Track Events
\`\`\`typescript
import { trackCustomerIOEvent } from '@/lib/customerio'

// Track an event
await trackCustomerIOEvent('photo_captured', {
  filter: 'emerald_glow',
  location: 'photo_booth',
  device: 'mobile'
})
\`\`\`

### Send Transactional Emails (Server-side only)
\`\`\`typescript
import { sendTransactionalEmail } from '@/lib/customerio'

// Send a transactional email
await sendTransactionalEmail(
  'user_123',
  'welcome_email_id',
  {
    user_name: 'John',
    activation_link: 'https://example.com/activate'
  }
)
\`\`\`

### Add to Segments (Server-side only)
\`\`\`typescript
import { addToSegment } from '@/lib/customerio'

// Add user to a segment
await addToSegment('user_123', 'vip_users')
\`\`\`

## Webhook Endpoint

The `/api/track` endpoint handles all tracking requests:

### Identify Request
\`\`\`json
POST /api/track
{
  "type": "identify",
  "userId": "user_123",
  "traits": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
\`\`\`

### Track Event Request
\`\`\`json
POST /api/track
{
  "type": "track",
  "userId": "user_123",
  "anonymousId": "anon_abc123",
  "event": "photo_captured",
  "properties": {
    "filter": "emerald_glow"
  },
  "timestamp": 1699564800
}
\`\`\`

## Anonymous Tracking

The system automatically generates and stores an anonymous ID in localStorage for users who haven't been identified yet. This allows tracking before user identification.

## Error Handling

- If Customer.io is not configured (missing env vars), tracking calls are silently skipped
- All errors are logged to console with `[v0]` prefix
- Failed tracking calls don't block user experience

## Testing

To test the integration:

1. Set environment variables in Vercel dashboard
2. Deploy the application
3. Open browser console
4. Trigger events (photo capture, cocktail view, etc.)
5. Check Customer.io dashboard for events

## Conversion Tracking

The system includes pre-built conversion tracking for:

- **Influencer conversions** - Track influencer engagement and tier
- **AR scan conversions** - Track scan-to-purchase flow
- **Event RSVPs** - Track event registrations
- **Engagement scoring** - Calculate weighted engagement scores

See `lib/conversion-tracking.ts` for implementation details.

## Customer Journeys

Recommended journey setup in Customer.io:

1. **Welcome Journey** - Triggered on first event
2. **Engagement Journey** - Based on engagement score
3. **D7 Follow-up** - 7 days after event attendance
4. **D30 Re-engagement** - 30 days after last activity
5. **VIP Upgrade** - For high-engagement users

## Security Notes

- Never expose `CUSTOMERIO_API_KEY` to client
- Use `NEXT_PUBLIC_` prefix only for site ID (safe to expose)
- Webhook endpoint validates all incoming data
- Rate limiting recommended for production
\`\`\`

```typescript file="" isHidden
