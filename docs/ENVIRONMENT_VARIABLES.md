# Environment Variables Configuration

## Required Variables

Add these environment variables in the **Vars** section of the v0 sidebar:

### Analytics (Dual Stack)

\`\`\`bash
# Amplitude - Product Analytics
NEXT_PUBLIC_AMPLITUDE_API_KEY=your_amplitude_api_key_here

# Customer.io - Marketing Automation (already configured)
NEXT_PUBLIC_CUSTOMERIO_SITE_ID=your_customerio_site_id
CUSTOMERIO_API_KEY=your_customerio_api_key
\`\`\`

### Optional (8th Wall - iOS AR Fallback)

\`\`\`bash
NEXT_PUBLIC_8THWALL_APP_KEY=your_8thwall_app_key
\`\`\`

## How to Get API Keys

### Amplitude
1. Go to https://amplitude.com
2. Sign up or log in
3. Create a new project or select existing
4. Go to Settings → Projects → [Your Project]
5. Copy the API Key
6. Paste as `NEXT_PUBLIC_AMPLITUDE_API_KEY`

### Customer.io (Already Setup)
Your Customer.io integration is already configured via the existing environment variables.

### 8th Wall (Optional)
Only needed if you want iOS Safari AR support:
1. Go to https://www.8thwall.com
2. Create account and workspace
3. Create new project
4. Copy App Key from project settings
5. Add approved domains in project settings

## How to Add Variables in v0

1. Click the **sidebar icon** (left side of chat)
2. Select **"Vars"**
3. Click **"Add Variable"**
4. Enter variable name (e.g., `NEXT_PUBLIC_AMPLITUDE_API_KEY`)
5. Paste your API key value
6. Click **Save**

Variables are immediately available to your deployed app - no restart needed.

## Verification

After adding variables, check the browser console on your deployed site:

\`\`\`
[v0] Amplitude initialized
[v0] Event tracked: ar_session_started
\`\`\`

Visit `/dashboard` to see unified analytics from both platforms.

## Security Notes

- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for client-side SDKs)
- `CUSTOMERIO_API_KEY` (without NEXT_PUBLIC_) stays server-side only
- Never commit API keys to git - use v0 Vars or Vercel environment variables

## Platform-Specific Setup

### Meta Horizon
No additional environment variables needed. Horizon scripts call your web API endpoints using the production URL.

### Universal AR (Zappar Mattercraft)
Uses the same web-based analytics - no separate API keys required.
