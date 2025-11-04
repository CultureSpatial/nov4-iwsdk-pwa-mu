# Nov 4 IWSDK PWA - Cultural Hospitality AR Pilot

A Progressive Web App for the Nov 4 Cultural Expression event, featuring WebXR experiences, AR photo booth, interactive cocktail menu, and real-time engagement tracking.

## Overview

This project powers a 20-minute immersive AR experience for 15-20 seated participants, combining mobile WebXR with comprehensive analytics tracking. The experience includes Emerald City/Wicked themed content, photo booth capabilities, and interactive menu exploration.

## Features

- **Progressive Web App (PWA)** - Installable on iOS Safari 17+ and Android Chrome 125+
- **WebXR Support** - Immersive AR experiences with 2D fallback for non-XR devices
- **AR Photo Booth** - Camera capture with themed filters and social sharing
- **Interactive Cocktail Menu** - Wicked/Emerald City themed menu exploration
- **Vercel Analytics** - Comprehensive event tracking and engagement metrics
- **Customer.io Integration** - User journey mapping and post-event follow-up
- **Health Monitoring** - Real-time system status and version tracking

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19.2, Tailwind CSS v4, shadcn/ui
- **Analytics:** Vercel Analytics, Customer.io
- **AR:** WebXR API (Meta IWSDK compatible)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- Vercel account (for deployment and analytics)
- Customer.io account (optional, for engagement tracking)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/CultureSpatial/nov4-iwsdk-pwa.git
cd nov4-iwsdk-pwa
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
# or
npm install
\`\`\`

3. Set up environment variables (see `.env.example`):
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Run the development server:
\`\`\`bash
pnpm dev
# or
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Adding Components

This project uses shadcn/ui. To add components:

\`\`\`bash
npx shadcn add button
# or from a v0 chat
npx shadcn add "https://v0.app/chat/b/..."
\`\`\`

## Project Structure

\`\`\`
nov4-iwsdk-pwa/
├── app/
│   ├── page.tsx              # Landing page with QR onboarding
│   ├── layout.tsx            # Root layout with analytics
│   ├── globals.css           # Global styles and design tokens
│   └── api/
│       ├── health/           # Health check endpoint
│       └── version/          # Version info endpoint
├── components/
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── analytics.ts          # Vercel Analytics utilities
│   └── utils.ts              # Utility functions
├── public/                   # Static assets
└── hooks/                    # React hooks
\`\`\`

## Analytics Events

The app tracks the following custom events:

### Technical Metrics
- `session_started` - User begins session
- `session_ended` - User ends session
- `frame_rate_measured` - Performance tracking
- `tracking_accuracy_measured` - AR tracking quality
- `page_load_time` - Load performance
- `network_latency_measured` - Network performance

### Engagement Analytics
- `interaction_recorded` - User interactions
- `question_submitted` - Q&A participation
- `poll_voted` - Poll engagement
- `photo_captured` - Photo booth usage
- `menu_item_viewed` - Cocktail menu exploration

### Success Indicators
- `technical_interruption` - System issues
- `engagement_score_calculated` - User engagement level
- `feedback_submitted` - User feedback

## Environment Variables

See `.env.example` for required variables:

- `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` - Auto-provided by Vercel
- `NEXT_PUBLIC_CUSTOMERIO_SITE_ID` - Customer.io site ID (optional)
- `CUSTOMERIO_API_KEY` - Customer.io API key (optional)
- Feature flags for enabling/disabling features

## Deployment

### Deploy to Vercel

1. Push code to GitHub:
\`\`\`bash
git push origin main
\`\`\`

2. Connect repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import the `CultureSpatial/nov4-iwsdk-pwa` repository
   - Configure environment variables
   - Deploy

3. Vercel Analytics will be automatically enabled.

### Manual Deployment

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## API Endpoints

- `GET /api/health` - System health check
- `GET /api/version` - Build version and metadata

## Browser Support

- **iOS:** Safari 17+ (WebXR support)
- **Android:** Chrome 125+ (WebXR support)
- **Fallback:** 2D experience for non-XR browsers

## Development

### Running Tests

\`\`\`bash
pnpm test
\`\`\`

### Linting

\`\`\`bash
pnpm lint
\`\`\`

### Building for Production

\`\`\`bash
pnpm build
\`\`\`

## Event Configuration

For the Nov 4 event:
- **Duration:** 20-minute demo slot
- **Participants:** 15-20 seated attendees
- **Entry:** QR code scan → PWA install → AR experience
- **Theme:** Emerald City/Wicked

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - CultureSpatial

## Support

For issues or questions, contact the CultureSpatial team.

## Acknowledgments

- Built with [v0](https://v0.dev) by Vercel
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Analytics powered by [Vercel Analytics](https://vercel.com/analytics)
