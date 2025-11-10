# Emerald Gem Technical Specification v1.0

**Version:** 1.0  
**Date:** November 5, 2025  
**Status:** Phase 1 Implementation

---

## System Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ GUEST LAYER                                                  │
│ Physical Gems (QR/NFC) → Mobile Web App → AR Experience     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ APPLICATION LAYER                                            │
│ Ordering | AR Engine | Ubuntu | Analytics                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ INTEGRATION LAYER                                            │
│ POS/KDS | Payments | CRM | Attribution                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ GOVERNANCE LAYER                                             │
│ Consent Engine | OHI | AU Token Ledger                      │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19.2 + TypeScript
- **Styling:** Tailwind CSS v4
- **Build:** Vite (for development speed)
- **Deployment:** Vercel

### AR Engine
- **WebXR:** Meta IWSDK (Meta Horizon Desktop Editor compatible)
- **3D Graphics:** Three.js with Draco compression
- **Format:** glTF 2.0 (optimized for mobile)
- **Fallback Platforms:**
  - Universal AR SDK (Zappar/Mattercraft) for iOS
  - 8th Wall (optional enterprise enhancement)

### Backend
- **Compute:** AWS Lambda + API Gateway
- **Database:** PostgreSQL (primary) + Redis (caching)
- **Storage:** AWS S3 for assets

### Payments
- **Provider:** Stripe
- **Implementation:** Elements + Payment Intents API
- **Revenue Splits:** Automated via Stripe Connect

### Analytics & CRM
- **Analytics:** Amplitude (product analytics)
- **Engagement:** Customer.io (journey mapping + automation)
- **Monitoring:** Vercel Analytics (web vitals)

## Physical Gem Specifications

### QR Codes
- **Standard:** ISO/IEC 18004:2015
- **Error Correction:** Level H (30% damage tolerance)
- **URL Format:** `https://emeraldgem.irl/{venue_id}/{gem_id}`
- **Size:** Minimum 3cm × 3cm for reliable scanning

### NFC Chips
- **Chip Type:** NTAG216 (888 bytes capacity)
- **Read Range:** 1-4cm optimal
- **Protocol:** ISO/IEC 14443 Type A
- **URL Storage:** Same format as QR codes

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | <1.5s | Lighthouse |
| AR Load Time | <3s | Custom timing |
| API Latency (p95) | <500ms | Datadog |
| System Uptime | 99.9% | Uptime monitoring |
| Frame Rate (AR) | 30fps min | AR engine telemetry |

## Revenue Model

### Automated Revenue Splits
| Recipient | Percentage | Distribution Method |
|-----------|-----------|---------------------|
| Venue Partner | 70% | Stripe Connect |
| Community Fund | 20% | Smart contract / escrow |
| Platform Fee | 10% | Stripe standard |
| Creator Pool | 7% (70% of platform fee) | Monthly distribution |

### Revenue Streams
1. **Gem Activation Fees** - Pay-per-experience or subscriptions
2. **F&B Uplift** - Commission on orders placed via AR menu
3. **Brand Partnerships** - Sponsored content and integrations
4. **Premium Features** - Gift-a-gem, custom avatars, etc.

## Governance Framework

### OHI (Organizational Harmony Index)
- **Target:** ≥85 (out of 100)
- **Measurement:** Automated compliance checks across 14 pillars
- **Frequency:** Real-time monitoring with weekly reports

### Consent Levels (Progressive)
1. **Basic Access** - Essential functionality only
2. **Data Analytics** - Anonymous usage tracking
3. **AR Camera** - Camera access for AR experiences
4. **UGC Creation** - Photo/video capture and sharing
5. **Location Services** - Venue-specific features
6. **Marketing Communications** - Promotional messages

### 14 Pillars (Automated Compliance)
1. Data Privacy
2. Consent Management
3. Accessibility
4. Environmental Impact
5. Financial Transparency
6. Labor Standards
7. Community Benefit
8. Content Moderation
9. Security Standards
10. Ethical AI
11. Cultural Sensitivity
12. Age Appropriateness
13. Health & Safety
14. Truth in Advertising

## Phase 1 Roadmap (12 Weeks)

### Weeks 1-2: Foundation
- [x] Vercel deployment pipeline
- [x] Stripe integration (test mode)
- [ ] POS system integration (Square/Toast)
- [ ] Basic consent engine

### Weeks 3-4: AR Layer
- [x] IWSDK integration
- [x] Universal AR SDK integration
- [ ] 3 core AR experiences:
  - [x] Photo booth with themed filters
  - [x] Interactive cocktail menu
  - [ ] Hand-tracking "try-on" experience

### Weeks 5-6: Ubuntu (Community Features)
- [ ] Gift-a-gem flow
- [ ] Community impact meter
- [ ] Social sharing + attribution
- [ ] Creator revenue dashboard

### Weeks 7-8: Analytics & Polish
- [x] Customer.io integration
- [x] Amplitude event tracking
- [ ] Performance optimization (<3s AR load)
- [ ] Cross-browser testing

### Weeks 9-12: Royal Sonesta Seattle Pilot
- [ ] On-site QA and device testing
- [ ] Staff training materials
- [ ] Marketing assets (QR codes, signage)
- [ ] Soft launch (December 15)
- [ ] Data collection and iteration

## Success Criteria (Pilot Launch)

### Technical KPIs
- ✅ 99.9% uptime during event hours
- ⏱️ <3s AR experience load time
- 🎯 Zero P0/P1 bugs during launch event
- 📊 100% event data captured

### Business KPIs
- 💰 $60K total revenue (ticket sales + F&B uplift + sponsorships)
- 🎟️ 50+ event attendees
- 📈 15%+ conversion rate (scan → purchase)
- 🔁 30%+ repeat engagement rate

### Governance KPIs
- 🛡️ OHI score ≥85
- ⚖️ Zero compliance violations
- 🤝 80%+ guest satisfaction (NPS)
- 🌍 Measurable community impact (Ubuntu fund)

### Failure Modes (Red Flags)
- ❌ Critical AR failure during event
- ❌ Payment processing downtime
- ❌ Data breach or privacy violation
- ❌ OHI score <85
- ❌ Guest satisfaction <70%

## Integration Specifications

### POS/KDS Integration
- **Supported Systems:** Square, Toast, Clover
- **Method:** API-based order injection
- **Data Flow:** AR Menu → Order API → POS → Kitchen Display

### Customer.io Pipeline
- **Endpoint:** `https://cdp.customer.io/v1/{identify|track}`
- **Authentication:** Basic Auth (base64 encoded siteId:apiKey)
- **Events:** Session start, AR interactions, purchases, feedback

### Stripe Connect
- **Account Type:** Express accounts for venue partners
- **Split Method:** Destination charges with application fees
- **Payout Schedule:** Weekly automatic transfers

## Security & Compliance

### Data Protection
- **Encryption:** TLS 1.3 for all data in transit
- **Storage:** AES-256 encryption at rest
- **Retention:** 90 days for personal data (GDPR compliant)
- **Deletion:** Right to be forgotten implemented

### Content Security
- **CSP Headers:** Strict content security policy
- **CORS:** Whitelisted domains only
- **Rate Limiting:** API throttling to prevent abuse

### AR Camera Privacy
- **Processing:** Client-side only (no server uploads without consent)
- **Storage:** Temporary (cleared on session end)
- **Permissions:** Explicit camera consent required

## Monitoring & Observability

### Real-Time Dashboards
- **Uptime:** Status page with 1-minute resolution
- **Performance:** Web Vitals (LCP, FID, CLS)
- **Errors:** Sentry for exception tracking
- **Business:** Stripe dashboard for revenue metrics

### Alerting Thresholds
- **Downtime:** Alert after 2 consecutive failed health checks
- **Latency:** Alert if p95 >1s
- **Error Rate:** Alert if >5% of requests fail
- **Revenue:** Alert if daily revenue <$500 (pilot period)

## Deployment Strategy

### Environments
1. **Development:** Local + Vercel preview branches
2. **Staging:** Main branch → staging.emeraldgem.irl
3. **Production:** Release tags → emeraldgem.irl

### CI/CD Pipeline
- **Tests:** Unit + integration tests on every PR
- **Previews:** Automatic preview URLs for all branches
- **Deployments:** Automatic on merge to main
- **Rollbacks:** One-click rollback via Vercel

### Device Testing Matrix
- iOS Safari 17+ (iPhone 12+)
- Android Chrome 125+ (Pixel 6+, Galaxy S21+)
- Meta Quest 2/3 (Quest Browser)
- Desktop (Chrome, Firefox for admin dashboards)

---

**Full Technical Documentation:** [Link to detailed API specs, schemas, and implementation guides]

**Project Status:** Phase 1 (Weeks 1-4 complete, Weeks 5-12 in progress)

**Next Milestone:** December 15, 2025 - Royal Sonesta Seattle Soft Launch
