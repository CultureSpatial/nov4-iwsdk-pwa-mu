# Emerald Gem AR Platform - Project Specification

## Vision

Transform hospitality experiences through immersive AR/VR technology that bridges physical venues with digital engagement, creating memorable customer interactions while driving measurable business outcomes.

## Target Launch

- **Competition Deadline:** December 9, 2025 (Meta Horizon Start Developer Competition)
- **Customer Launch:** December 15, 2025 (Royal Sonesta Seattle)
- **Platform:** Multi-platform (Web PWA, Mobile AR, Meta Horizon VR)

## User Journeys

### Journey 1: Guest AR Experience (Primary)

**Actor:** Hotel guest or venue visitor

**Flow:**
1. Guest scans physical "Emerald Gem" (QR code/NFC tag) at venue
2. Web PWA loads instantly on their mobile device
3. Front-facing camera activates (60fps optimized)
4. Guest sees AR photo booth with themed frames/filters
5. Guest views cocktail menu with 3D drink visualizations in AR
6. Guest captures photo with AR filter, shares to social media
7. Guest orders cocktail through AR interface
8. Analytics tracks engagement, conversion, and revenue

**Success Metrics:**
- 70%+ scan-to-engagement rate
- 30%+ photo capture rate
- 15%+ cocktail order conversion
- < 3 second AR initialization time
- 60fps camera performance on 80%+ devices

### Journey 2: VR Immersive Experience (Competition Focus)

**Actor:** Meta Quest user or Instagram/Facebook mobile user

**Flow:**
1. User discovers Horizon world via Instagram/Facebook promotion
2. Launches on Quest VR headset OR mobile device
3. Enters virtual lounge environment themed to venue
4. Interacts with VR photo booth using passthrough camera
5. Views 3D cocktail models in immersive space
6. Captures VR selfie with AI-enhanced filters
7. Receives QR code to visit physical venue
8. Cross-platform analytics tracks VR→venue conversion

**Success Metrics:**
- 1000+ Horizon world visits by Dec 9
- 40%+ mobile-to-VR conversion rate
- 5%+ VR→physical venue visit rate
- Qualifies for Passthrough Camera + AI special award

### Journey 3: Venue Staff Operations

**Actor:** Hotel staff, bar staff, venue manager

**Flow:**
1. Staff accesses analytics dashboard
2. Views real-time engagement metrics
3. Sees cocktail order queue from AR interface
4. Fulfills orders with kitchen/bar integration
5. Monitors guest satisfaction and conversion rates
6. Generates reports for management

**Success Metrics:**
- < 30 second staff onboarding time
- Real-time order notifications
- 95%+ order fulfillment rate
- Daily/weekly automated reports

## Key Features

### Web PWA (Foundation - Complete)

1. **Front-Facing Camera System**
   - 60fps target with auto-fallback (60fps → 30fps → basic)
   - Progressive quality degradation
   - Performance monitoring
   - Cross-browser compatibility (iOS Safari, Chrome, Firefox)

2. **AR Photo Booth**
   - Multiple themed frames/filters
   - Real-time face tracking
   - Instant preview
   - Social sharing (download, Instagram, Facebook)
   - Analytics tracking per filter

3. **AR Cocktail Menu**
   - 3D drink models with WebGL/Three.js
   - Interactive rotation and zoom
   - Ingredient information overlay
   - Price display
   - "Order Now" CTA with analytics

4. **Analytics Integration**
   - Dual stack: Amplitude (product) + Customer.io (marketing)
   - Cross-platform event tracking
   - User identification and segmentation
   - Conversion funnel analysis
   - Revenue attribution

### Meta Horizon (Transmutation - In Progress)

1. **VR Lounge Environment**
   - Themed to Royal Sonesta aesthetic
   - Passthrough camera integration
   - Hand interaction controls
   - Mobile + VR support

2. **Asset Bridge**
   - Sync 3D models between web and Horizon
   - Unified content management
   - Cross-platform state sync

3. **VR Photo Booth**
   - Passthrough camera with AI filters
   - VR selfie capture
   - Social sharing from VR

### Intersection Layer (Stabilization)

1. **Cross-Platform Analytics**
   - Unified event taxonomy
   - Platform detection (web/mobile/VR)
   - User journey tracking across platforms

2. **Asset Management**
   - Shared 3D model library
   - Automated format conversion
   - Version control

3. **State Synchronization**
   - User preferences across platforms
   - Order history
   - Photo gallery

## Technical Constraints

### Must Have
- Next.js 16 + React 19.2
- TypeScript
- Vercel deployment
- Mobile-first responsive design
- < 3s initial load time
- WCAG 2.1 AA accessibility
- HTTPS only

### Performance Targets
- 60fps camera on flagship devices (iPhone 14+, Pixel 7+)
- 30fps minimum on mid-range devices
- < 100ms interaction latency
- Lighthouse score > 90

### Browser Support
- iOS Safari 16+
- Chrome 120+
- Firefox 120+
- Edge 120+

### Platform Support
- Web PWA (all modern browsers)
- Meta Horizon VR (Quest 3, Quest 3S)
- Meta Horizon Mobile (iOS + Android)

## Success Criteria

### Competition (Dec 9)
- [ ] Functional Horizon world build
- [ ] Mobile AR companion experience
- [ ] Passthrough camera + AI demonstration
- [ ] Documentation and demo video
- [ ] Submission completed

### Launch (Dec 15)
- [ ] Web PWA deployed to production
- [ ] Royal Sonesta venue setup complete
- [ ] Staff trained
- [ ] Analytics dashboard live
- [ ] 50+ guest interactions on day 1

### Business (3 months post-launch)
- [ ] 285% ROI (Digital Royal Wardrobe model)
- [ ] 1000+ unique users
- [ ] 500+ cocktail orders via AR
- [ ] 5000+ photo captures
- [ ] 80%+ guest satisfaction score

## Out of Scope (V1)

- Payment processing (manual order fulfillment)
- User accounts / authentication
- Multi-venue deployment
- Native mobile apps
- AR try-on for physical products beyond cocktails
- Advanced AI features (recommendation engine, personalization)

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Camera permission denial | Medium | High | Clear permission prompts, fallback to menu-only mode |
| Poor WiFi at venue | Medium | High | Aggressive caching, offline mode, venue WiFi audit |
| Competition deadline missed | Low | Medium | Prioritize proof-of-concept over polish |
| Launch deadline missed | Low | Critical | Daily standup, P0 focus, feature freeze Dec 10 |
| Low user adoption | Medium | High | Staff training, QR code placement, guest incentives |

## Dependencies

- Amplitude account (product analytics)
- Customer.io account (marketing automation)
- Vercel account (hosting)
- Meta Horizon Start Program membership (competition)
- Royal Sonesta partnership (venue access)
