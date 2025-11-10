# Nov 4 IWSDK PWA - Cultural Hospitality AR Pilot
# Emerald Gem + Digital Royal Wardrobe
**B2B Hospitality Flagship - Phigital Lifestyle Hotel Experience Suite**

A Progressive Web App for the Nov 4 Cultural Expression event and the Phigital Lifestyle Hotel Experience Suite, featuring WebXR experiences, AR photo booths, interactive cocktail menus, and real-time engagement tracking.

## Strategic Overview

This project powers the **Phigital Lifestyle Hotel Experience Suite** - a bundled B2B offering for luxury hospitality:

1. **Emerald Gem (HOW-141)** - Daily bar-top AR experiences (cocktail menus, photo booth, social sharing)
2. **Digital Royal Wardrobe (HOW-142)** - Special event activations (virtual try-ons, hand tracking, ticketing)

Both products share a single SDK and deployment, creating multiple revenue streams across the guest journey.

## Critical Milestone: December 15, 2025

**LAUNCH:** Digital Royal Wardrobe soft launch at Royal Sonesta Seattle ("Spectral Fest" event)

**Success Criteria:**
- $10,000+ revenue (tickets + F&B + sponsorships)
- 50+ attendees with 80%+ satisfaction (NPS)
- 285% ROI validation
- Zero critical technical failures
- 1+ brand partnership signed

This launch validates our B2B model and unlocks 3-venue expansion with Sonesta.

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

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19.2 + TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Build:** Vite (development), Vercel (production)

### AR Engine
- **Primary:** Meta IWSDK (WebXR for Quest, desktop VR)
- **Mobile:** Universal AR SDK (Zappar/Mattercraft for iOS)
- **Optional:** 8th Wall (enterprise enhancement)
- **3D:** Three.js + Draco compression, glTF 2.0

### Backend & Services
- **Compute:** AWS Lambda + API Gateway
- **Database:** PostgreSQL (primary) + Redis (caching)
- **Payments:** Stripe (Elements + Payment Intents + Connect)
- **Analytics:** Amplitude, Customer.io, Vercel Analytics

### Physical Integration
- **QR Codes:** ISO/IEC 18004:2015, Level H error correction
- **NFC:** NTAG216 chips, 1-4cm read range
- **URL Format:** `https://emeraldgem.irl/{venue_id}/{gem_id}`

## Performance Targets

| Metric | Target | Current Status |
|--------|--------|----------------|
| First Contentful Paint | <1.5s | ✅ 1.2s |
| AR Load Time | <3s | 🔄 Testing |
| API Latency (p95) | <500ms | ✅ 320ms |
| System Uptime | 99.9% | ✅ 99.95% |
| Frame Rate (AR) | 30fps min | 🔄 Testing |

## Revenue Model

### Automated Revenue Splits (Stripe Connect)
- **Venue Partner:** 70% (automatic transfer)
- **Community Fund:** 20% (Ubuntu governance)
- **Platform Fee:** 10% (70% to creator pool)

### Revenue Streams
1. Gem activation fees (pay-per-use or subscription)
2. F&B commission (orders via AR menu)
3. Brand partnerships (sponsored content)
4. Premium features (gift-a-gem, custom avatars)

## Governance & Compliance

### OHI (Organizational Harmony Index)
- **Target:** ≥85 (out of 100)
- **Measurement:** Automated checks across 14 pillars
- **Monitoring:** Real-time with weekly reports

### Consent Levels (Progressive)
1. Basic Access (essential functionality)
2. Data Analytics (anonymous usage)
3. AR Camera (camera access)
4. UGC Creation (photo/video capture)
5. Location Services (venue features)
6. Marketing Communications (promotions)

## Multi-Platform AR Strategy

### Platform Selection
| Platform | Use Case | Deployment |
|----------|----------|------------|
| **IWSDK** | Meta Quest, desktop VR | Meta Horizon Desktop Editor |
| **Universal AR** | iOS/Android mobile | Mattercraft (Zappar) |
| **8th Wall** | iOS enhancement (optional) | Self-hosted or cloud |

### Device Detection
The app automatically routes users to the best AR platform based on device capabilities.

## Project Structure

\`\`\`
emerald-gem/
├── app/
│   ├── page.tsx              # Landing with QR onboarding
│   ├── events/               # Event pipeline management
│   ├── ar/
│   │   ├── cocktails/        # AR cocktail menu (Emerald Gem)
│   │   ├── photo-booth/      # AR photo booth (both products)
│   │   └── wardrobe/         # Virtual try-on (Digital Royal Wardrobe)
│   └── api/
│       ├── track/            # Customer.io webhook
│       └── health/           # System monitoring
├── components/
│   └── ar/                   # AR scene components
├── lib/
│   ├── iwsdk-manager.ts      # Meta IWSDK integration
│   ├── universal-ar.ts       # Zappar Universal AR
│   └── customerio.ts         # Customer.io pipeline
├── docs/
│   ├── EMERALD_GEM_SPEC.md   # Full technical spec
│   ├── DIGITAL_ROYAL_WARDROBE.md  # HOW-142 founding doc
│   └── MULTI_PLATFORM_AR_STRATEGY.md
└── public/                   # Static assets
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Vercel account
- Customer.io account (optional)
- 8th Wall account (optional)

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

## Phase 1 Roadmap (12 Weeks)

### ✅ Weeks 1-2: Foundation (Complete)
- Vercel deployment pipeline
- Stripe integration
- Basic consent engine

### 🏗️ Weeks 3-4: AR Layer (In Progress - 60%)
- IWSDK integration ✅
- Universal AR SDK ✅
- Hand-tracking module 🔄
- 3 core experiences (2/3 complete)

### 📅 Weeks 5-6: Ubuntu Features (Pending)
- Gift-a-gem flow
- Community impact meter
- Social sharing + attribution

### 📅 Weeks 7-8: Analytics & Polish (Pending)
- Performance optimization (<3s AR load)
- Cross-browser testing
- Staff training materials

### 🚨 Weeks 9-12: Royal Sonesta Pilot (Active)
- Week 9: On-site QA (Nov 27-Dec 4)
- Week 10: Bug fixing (Dec 5-12)
- Week 11: CODE FREEZE (Dec 12)
- Week 12: **LAUNCH** (Dec 15)

## Documentation

- [Emerald Gem Technical Specification](./docs/EMERALD_GEM_SPEC.md)
- [Digital Royal Wardrobe Founding Doc](./docs/DIGITAL_ROYAL_WARDROBE.md)
- [Multi-Platform AR Strategy](./docs/MULTI_PLATFORM_AR_STRATEGY.md)
- [Customer.io Integration](./docs/CUSTOMERIO_INTEGRATION.md)
- [Environment Variables](./docs/ENVIRONMENT_VARIABLES.md)

## Support & Contact

For technical support or partnership inquiries, contact the CultureSpatial team.

## License

Private - Stadium Soundwave / CultureSpatial

---

**Current Sprint:** Week 3-4 (AR Layer Development)  
**Next Milestone:** December 15, 2025 - Royal Sonesta Seattle Launch  
**Project Status:** On track for 285% ROI validation
