# Environment Variables Configuration

## Required Variables

Add these environment variables in the **Vars** section of the v0 sidebar or Vercel dashboard:

<!-- Removed Amplitude completely, updated to Vercel Analytics (zero-config) -->

### Event Configuration

\`\`\`bash
# Event details
NEXT_PUBLIC_EVENT_NAME="Your Event Name"
NEXT_PUBLIC_EVENT_DATE="2025-12-15"
\`\`\`

### Feature Flags

\`\`\`bash
# Enable/disable features
NEXT_PUBLIC_ENABLE_PHOTO_BOOTH=true
NEXT_PUBLIC_ENABLE_COCKTAIL_MENU=true
NEXT_PUBLIC_ENABLE_POLLS=false
NEXT_PUBLIC_ENABLE_QA=false
\`\`\`

## Analytics

**No configuration needed!** This project uses **Vercel Analytics** which is automatically enabled when deployed to Vercel.

- Zero API keys required
- Automatic Web Vitals tracking
- Custom events via `lib/analytics.ts`
- Dashboard at vercel.com/[project]/analytics

## How to Add Variables in v0

1. Click the **sidebar icon** (left side of chat)
2. Select **"Vars"**
3. Click **"Add Variable"**
4. Enter variable name (e.g., `NEXT_PUBLIC_EVENT_NAME`)
5. Enter the value
6. Click **Save**

Variables are immediately available to your deployed app - no restart needed.

## Verification

After deployment, check the browser console:

\`\`\`
[v0 Analytics] session_start { platform: 'web' }
[v0 Analytics] ring_viewed { ring_id: 'ring_123' }
\`\`\`

## Security Notes

- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for client-side config)
- Server-only secrets should NOT have `NEXT_PUBLIC_` prefix
- Never commit secrets to git - use v0 Vars or Vercel environment variables

## Platform-Specific Setup

### Meta Horizon
No additional environment variables needed. Horizon scripts call your web API endpoints using the production URL.

### Universal AR (Zappar Mattercraft)
Uses the same web-based analytics - no separate configuration required.
