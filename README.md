# Emerald Gem AR Platform

Multi-platform immersive hospitality experiences powered by WebXR, Meta Horizon, and Universal AR.

## 🎯 Mission

Transform hospitality through augmented reality experiences that bridge physical and digital worlds, creating memorable guest interactions and new revenue streams for venues.

## 🚀 Launch Timeline

- **December 9, 2025**: Meta Horizon Start Developer Competition submission deadline
- **December 15, 2025**: Royal Sonesta Seattle production launch
- **Q1 2026**: Multi-venue expansion

## 🏗️ Architecture

### Three-Phase Transformation

1. **Scaffold Phase**: Web PWA with IWSDK + Universal AR SDK
2. **Transmutation Phase**: Meta Horizon VR/Mobile experiences
3. **Stabilization Phase**: Intersection layer unifying all platforms

### Platform Stack

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Guest Experience Layer                             │
│  • Web PWA (mobile browsers)                        │
│  • Meta Horizon (VR/mobile)                         │
│  • Mobile AR (iOS/Android)                          │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Intersection Layer                                 │
│  • Event Bridge (unified analytics)                 │
│  • Asset Bridge (cross-platform sync)               │
│  • State Management (shared data)                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Core Services                                      │
│  • Camera Manager (60fps front-facing)              │
│  • Analytics (Amplitude + Customer.io)              │
│  • AR Rendering (Three.js + WebXR)                  │
└─────────────────────────────────────────────────────┘
\`\`\`

## 🎨 Features

### AR Photo Booth
- 60fps front-facing camera with progressive fallback
- Themed AR frames and filters
- Instant social sharing
- Performance monitoring (FPS tracking)

### AR Cocktail Menu
- 3D drink visualization
- Interactive ordering
- Nutritional information
- Price display

### Gesture Controls
- Hand tracking for interactions
- VR controller support
- Touch fallback for mobile

### Digital Royal Wardrobe
- Virtual try-on experiences
- 285% projected ROI
- Cross-venue scalability

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19.2)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **AR**: Three.js, IWSDK, Universal AR SDK

### Backend
- **Runtime**: Next.js API Routes (server-side)
- **Deployment**: Vercel
- **Analytics**: Amplitude + Customer.io

### Platform SDKs
- **Web**: Immersive Web SDK (IWSDK)
- **Mobile**: Universal AR SDK (Zappar)
- **VR**: Meta Horizon TypeScript API

## 📊 Analytics Strategy

### Dual Stack Approach

**Amplitude** (Product Analytics)
- User behavior tracking
- Funnel analysis
- Retention curves
- A/B testing

**Customer.io** (Marketing Automation)
- User identification
- Lifecycle campaigns
- Segmentation
- Re-engagement flows

### Event Taxonomy

All events follow consistent naming across platforms:

\`\`\`typescript
// AR Experience
ar_session_started
ar_session_ended
gesture_performed

// Photo Booth
photo_captured
photo_shared

// Cocktail Menu
cocktail_viewed
cocktail_ordered

// Conversion
gem_scanned
checkout_started
purchase_completed

// Horizon VR
horizon_world_entered
horizon_interaction
\`\`\`

## 🎥 Camera System

### Mission-Critical Component

Front-facing camera is the **primary input** for AR try-on flows:

- 60fps target (8th Wall standard)
- Progressive fallback (60fps → 30fps → basic)
- Automatic retry with exponential backoff
- Comprehensive error recovery
- Real-time performance monitoring

### Implementation

\`\`\`typescript
import { getCameraManager } from '@/lib/camera-manager'

const camera = getCameraManager()
await camera.initializeCamera(videoElement, 'user')

// Metrics
const metrics = camera.getPerformanceMetrics()
console.log(`FPS: ${metrics.fps}`)
\`\`\`

## 📁 Project Structure

\`\`\`
emerald-gem-ar/
├── app/                      # Next.js pages
│   ├── page.tsx             # Homepage
│   ├── api/track/           # Analytics endpoint
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── camera/              # Camera system UI
│   └── ui/                  # shadcn components
├── lib/                     # Core libraries
│   ├── analytics.ts         # Dual analytics
│   └── camera-manager.ts    # Camera system
├── intersection/            # Cross-platform layer
│   └── event-bridge.ts      # Unified events
├── docs/                    # Documentation
│   ├── CAMERA_ARCHITECTURE.md
│   ├── DUAL_ANALYTICS_STRATEGY.md
│   ├── META_HORIZON_CHALLENGE_STRATEGY.md
│   └── GITHUB_PROJECTS_STRUCTURE.md
└── .github/                 # GitHub config
    ├── spec-kit/            # Spec-driven dev
    └── ISSUE_TEMPLATE/      # Issue templates
\`\`\`

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Modern browser with WebXR support

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/your-org/emerald-gem-ar.git
cd emerald-gem-ar

# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env.local
# Add your API keys (see docs/ENVIRONMENT_VARIABLES.md)

# Run development server
pnpm dev
\`\`\`

Visit `http://localhost:3000` to see the app.

### Environment Variables

Required variables (add in Vercel or `.env.local`):

\`\`\`bash
# Analytics
NEXT_PUBLIC_AMPLITUDE_API_KEY=your_amplitude_key
CUSTOMERIO_API_KEY=your_customerio_key
NEXT_PUBLIC_CUSTOMERIO_SITE_ID=your_site_id

# Event Configuration
NEXT_PUBLIC_EVENT_NAME=Royal Sonesta Seattle Launch
NEXT_PUBLIC_EVENT_DATE=2025-12-15

# Feature Flags
NEXT_PUBLIC_ENABLE_PHOTO_BOOTH=true
NEXT_PUBLIC_ENABLE_COCKTAIL_MENU=true
\`\`\`

See `docs/ENVIRONMENT_VARIABLES.md` for details.

## 🏆 Meta Horizon Competition

### Eligibility Status

✅ **Qualified for:**
- Lifestyle Track (hospitality innovation)
- Immersive Web SDK Special Award
- Passthrough Camera + AI Special Award

### Competitive Advantages

1. **Real Customer**: Royal Sonesta Seattle deployment (Dec 15)
2. **Revenue Model**: Digital Royal Wardrobe (285% ROI)
3. **Multi-Platform**: Web + Mobile + VR (not VR-only)
4. **Production-Ready**: Launching 6 days after submission

### Submission Strategy

- **Primary Path**: Submit existing IWSDK Web PWA
- **Backup Path**: Build minimal Horizon World (2 days)
- **Decision Gate**: December 2 (assess feasibility)

See `docs/META_HORIZON_CHALLENGE_STRATEGY.md` for full analysis.

## 📈 Business Model

### Digital Royal Wardrobe

**Concept**: Virtual try-on for hotel-branded merchandise

**Economics**:
- Development cost: $12,000
- Revenue projection: $46,200 (year 1)
- ROI: 285%
- Scalability: Multi-venue franchise model

### Revenue Streams

1. **Per-venue licensing**: $500-1000/month
2. **Digital merchandise sales**: 15% commission
3. **Premium AR features**: $50-100/venue/month
4. **Analytics insights**: Enterprise tier

## 🤝 Contributing

This project uses GitHub Projects for management:

- **6 Parallel Tracks**: Web PWA, Meta Horizon, Competition, Launch Ops, Infrastructure, Analytics
- **Spec-Kit Integration**: Spec-driven development workflow
- **Issue Templates**: Feature, bug, competition tasks

See `.github/ISSUE_TEMPLATE/` and `docs/GITHUB_PROJECTS_STRUCTURE.md`.

## 📚 Documentation

### Core Guides
- [Camera Architecture](docs/CAMERA_ARCHITECTURE.md)
- [Dual Analytics Strategy](docs/DUAL_ANALYTICS_STRATEGY.md)
- [Meta Horizon Integration](docs/HORIZON_ANALYTICS_INTEGRATION.md)
- [GitHub Projects Setup](docs/GITHUB_PROJECTS_STRUCTURE.md)

### Competition Docs
- [Challenge Strategy](docs/META_HORIZON_CHALLENGE_STRATEGY.md)
- [Eligibility Analysis](docs/META_HORIZON_ELIGIBILITY_ANALYSIS.md)
- [Customer.io Feasibility](docs/CUSTOMERIO_HORIZON_FEASIBILITY.md)

### Technical Specs
- [Camera Cross-Platform Alignment](docs/CAMERA_CROSS_PLATFORM_ALIGNMENT.md)
- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md)

## 🎯 Roadmap

### Phase 1: MVP (Complete)
- ✅ Web PWA scaffolding
- ✅ Camera system (60fps)
- ✅ Analytics integration
- ✅ GitHub Projects setup

### Phase 2: Launch Prep (Nov 29 - Dec 15)
- [ ] Royal Sonesta content integration
- [ ] Photo booth filters
- [ ] Cocktail menu 3D models
- [ ] Production deployment
- [ ] Staff training

### Phase 3: Competition (Optional, Dec 2-9)
- [ ] Proof-of-concept Horizon world
- [ ] Demo video production
- [ ] Submission package
- [ ] Technical documentation

### Phase 4: Post-Launch (Q1 2026)
- [ ] User feedback integration
- [ ] Face tracking (MediaPipe)
- [ ] Multi-venue expansion
- [ ] Meta Horizon native app

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Meta Horizon Start Program
- Royal Sonesta Seattle
- v0 by Vercel (development platform)
- 8th Wall (AR standards inspiration)
- Amplitude & Customer.io (analytics partners)

## 📞 Contact

For partnership inquiries: [Contact information]

---

**Built with ❤️ for the future of hospitality**
