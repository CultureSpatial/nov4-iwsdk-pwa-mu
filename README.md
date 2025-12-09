# Emerald Gem AR Platform

A phygital AR experience for cultural hospitality, built with Next.js 16, React 19, and Three.js.

## Features

- **Ring Room**: Interactive 3D ring showcase with WebXR support
- **Photo Booth**: AR photo capture with filters
- **Cocktail Menu**: AR-enhanced drink menu
- **IWSDK Integration**: Meta Spatial SDK for spatial anchors

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

## Project Structure

\`\`\`
├── app/                  # Next.js App Router pages
│   ├── ring-room/        # 3D ring showcase
│   ├── ar/               # AR experiences
│   └── test/             # Test pages
├── components/           # React components
│   ├── ring-room/        # Ring room components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities
│   ├── analytics.ts      # Vercel Analytics
│   ├── iwsdk-integration.ts  # IWSDK wrapper
│   └── shortlist-manager.ts  # Ring shortlist
└── docs/                 # Documentation
\`\`\`

## Environment Variables

Required variables (add in Vercel or `.env.local`):

<!-- Removed Amplitude, only Vercel Analytics (zero-config) -->
\`\`\`bash
# Event Configuration
NEXT_PUBLIC_EVENT_NAME="Your Event Name"
NEXT_PUBLIC_EVENT_DATE="2025-12-15"

# Feature Flags
NEXT_PUBLIC_ENABLE_PHOTO_BOOTH=true
NEXT_PUBLIC_ENABLE_COCKTAIL_MENU=true
\`\`\`

## Analytics

This project uses **Vercel Analytics** for tracking. It's zero-config and automatically enabled when deployed to Vercel.

Events are tracked via `lib/analytics.ts`:

\`\`\`typescript
import { Analytics } from '@/lib/analytics'

// Track ring interactions
Analytics.ringViewed('web', 'ring-001', 'Emerald Solitaire')
Analytics.ringShortlisted('web', 'ring-001', 'Emerald Solitaire')

// Track XR events
Analytics.xrModeEntered('web', 'vr')
\`\`\`

## Testing

### Ring Room
1. Navigate to `/ring-room`
2. Verify gold test box is visible (Phase 1 verification)
3. Click rings to view details
4. Add rings to shortlist
5. Test XR button (disabled due to library issues)

### IWSDK Test
1. Navigate to `/test/iwsdk`
2. Check device capabilities
3. Test spatial anchor creation

## Known Issues

- `@react-three/xr` has internal errors - XR features temporarily disabled
- Hand tracking requires Quest device for testing

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4, shadcn/ui
- **3D**: Three.js, React Three Fiber, React Three Drei
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## License

MIT
