# Emerald Gem - Project Specification

**Project:** Cultural Hospitality AR Platform
**Competition:** Meta Horizon Start Developer Competition 2025
**Launch:** Royal Sonesta Seattle - December 15, 2025
**Spec Version:** 1.0

## Executive Summary

The Emerald Gem platform transforms luxury hotel experiences through immersive AR/VR try-on flows, enabling guests to preview and order signature cocktails, capture branded photo moments, and engage with venue-specific content across Web PWA, Meta Horizon VR, and mobile AR platforms.

## User Journeys

### Journey 1: Guest Onboarding (Mobile Web)
**Persona:** Hotel guest with smartphone in lobby/room
**Goal:** Quick discovery and engagement with AR experiences

1. Guest scans QR code from lobby display or in-room card
2. Landing page detects device capabilities (iOS/Android/Quest)
3. Auto-routes to appropriate platform:
   - iOS → Universal AR (Mattercraft/Zappar)
   - Android → WebXR native
   - Quest → IWSDK VR mode
4. One-tap "Start Experience" (no app install)
5. Camera permission prompt with clear value prop
6. Emerald glow entry animation plays

**Success Metrics:**
- QR scan → AR launch < 15 seconds
- Camera permission acceptance > 75%
- Session completion > 60%

### Journey 2: Virtual Cocktail Try-On (AR)
**Persona:** Guest exploring cocktail menu
**Goal:** Preview drinks before ordering via front-facing camera

1. Front-facing camera activates automatically
2. Cocktail carousel displays 6 signature drinks
3. User selects drink card
4. 3D cocktail glass appears in AR at mouth level
5. Face tracking positions glass naturally (60fps)
6. User can:
   - Rotate/zoom cocktail visualization
   - View ingredients & allergens
   - Add to order queue
   - Capture photo with drink overlay
7. Tavus.io AI avatar explains drink origin/flavor profile
8. "Order Now" button sends to kitchen/bar via integrated POS

**Success Metrics:**
- Try-on → Order conversion > 35%
- Average drinks previewed: 3.2
- Photo capture rate > 50%

### Journey 3: Photo Booth with Branded Frames
**Persona:** Guest wanting social shareable content
**Goal:** Create memorable branded photos with AR effects

1. Access "Photo Moment" from main menu
2. Select from 4 venue-themed frames:
   - Emerald City skyline
   - Luxury hotel branding
   - Event-specific overlay
   - Seasonal theme
3. Front camera shows live preview with frame
4. Apply filters (optional): glow, sparkle, color grading
5. Capture photo with tap or voice command
6. Immediate preview with edit options
7. Share flow:
   - Instagram Stories (direct)
   - Download to camera roll
   - Email to self
   - QR code for desktop transfer
8. Customer.io captures event for follow-up marketing

**Success Metrics:**
- Photo capture → Share rate > 40%
- Social media mentions +285%
- Email capture rate for follow-up: 55%

### Journey 4: VR Station Demo (Meta Quest)
**Persona:** Event attendee at hotel demo station
**Goal:** Immersive brand experience in VR environment

1. Staff helps guest don Quest headset
2. Auto-launches Emerald Gem world
3. Spawns in branded virtual lobby
4. Hand tracking tutorial (5 seconds)
5. Interactive elements:
   - Virtual cocktail bar with 3D models
   - Photo booth portal
   - Event space previews
   - Menu browsing in 3D space
6. Passthrough mode for hybrid AR/VR
7. Session auto-ends after 3 minutes
8. QR code displayed in headset to continue on mobile

**Success Metrics:**
- VR demo → Mobile conversion > 30%
- Average session time: 2.5 min
- Follow-up inquiry rate: 25%

### Journey 5: Competition Submission (Developer)
**Persona:** Meta Horizon Start Program member
**Goal:** Submit polished experience to competition

1. Review spec-kit documentation
2. Verify eligibility requirements
3. Complete technical checklist:
   - ✓ Passthrough Camera Access implementation
   - ✓ Hand Interactions in VR mode
   - ✓ AI integration (Tavus.io)
   - ✓ Mobile optimization (60fps target)
   - ✓ Cross-platform compatibility
4. Package submission materials:
   - Demo video (2 min)
   - Technical architecture doc
   - Live deployment URL
   - Meta Horizon world link
5. Submit via Devpost before Dec 9
6. Monitor for judging updates

**Success Metrics:**
- Submission completeness: 100%
- Category fit: Lifestyle + Special Awards
- Live customer deployment: Royal Sonesta

## Desired Outcomes

### Business Outcomes
1. **Revenue Impact:** 285% increase in cocktail sales at launch venue
2. **Customer Acquisition:** 500+ email captures in first 30 days
3. **Brand Awareness:** 10,000+ social media impressions
4. **Competition Win:** Top 3 in Lifestyle Track or Special Award ($50K-$100K prize)
5. **Expansion:** 3 additional hotel contracts Q1 2026

### Technical Outcomes
1. **Performance:** 60fps camera tracking on flagship devices
2. **Reliability:** 99.5% uptime during launch period
3. **Compatibility:** Works on 95%+ of mobile devices (iOS/Android)
4. **Scalability:** Handle 200 concurrent users per venue
5. **Analytics:** Real-time event tracking to Amplitude + Customer.io

### User Experience Outcomes
1. **Engagement:** Average session time > 3 minutes
2. **Conversion:** Try-on → Order rate > 35%
3. **Satisfaction:** NPS score > 8/10
4. **Virality:** 40% of users share photo content
5. **Retention:** 20% return within 7 days

## Technical Constraints

### Platform Requirements
- **Web PWA:** Next.js 16, React 19.2, TypeScript
- **AR Frameworks:** IWSDK, Universal AR SDK, WebXR
- **Analytics:** Amplitude (product) + Customer.io (marketing)
- **AI/Video:** Tavus.io for avatar content
- **Camera:** Front-facing 60fps minimum
- **Deployment:** Vercel with GitHub integration

### Device Support Matrix
| Platform | Technology | Support Level |
|----------|-----------|---------------|
| iOS Safari | Universal AR (Zappar) | Priority 1 |
| Android Chrome | WebXR native | Priority 1 |
| Meta Quest 3/3S | IWSDK + Horizon | Priority 2 |
| Desktop | WebXR fallback | Priority 3 |

### Performance Budgets
- Initial page load: < 3 seconds
- Time to interactive: < 5 seconds
- Camera initialization: < 2 seconds
- AR frame rate: 60fps (degrade to 30fps gracefully)
- Bundle size: < 2MB (excluding 3D assets)
- 3D asset loading: Progressive/lazy

### Security & Privacy
- Camera access with explicit permission
- No persistent video recording
- GDPR-compliant data collection
- SOC 2 Type II hosting (Vercel)
- Customer.io data encryption at rest

### Integration Points
- Hotel POS system (REST API)
- Customer.io Pipeline API
- Amplitude SDK (client + server)
- Tavus.io video API
- Meta Horizon Creator Program APIs

## Timeline & Milestones

### Phase 1: Pre-Competition (Nov 20 - Dec 9)
- Week 1: Camera system hardening + front-facing optimization
- Week 2: Horizon world build + asset sync via intersection layer
- Week 3: Competition submission package + demo video

### Phase 2: Soft Launch (Dec 10 - Dec 14)
- Final QA on target devices
- Staff training at Royal Sonesta
- Customer.io campaign setup
- Analytics validation

### Phase 3: Launch (Dec 15)
- Go-live at Royal Sonesta Seattle
- Real-time monitoring dashboard
- Support team on standby
- Social media amplification

### Phase 4: Scale (Dec 16 - Jan 31)
- Performance optimization based on live data
- Additional venue onboarding
- Competition judging period
- Feature iteration based on customer feedback

## Success Criteria

### MVP Launch (Dec 15)
- [ ] Camera system operational 99.5%+ uptime
- [ ] All 4 user journeys functional
- [ ] Analytics pipeline capturing events
- [ ] 50+ guest interactions Day 1
- [ ] Zero critical bugs

### Competition Submission (Dec 9)
- [ ] Devpost submission complete
- [ ] Demo video showcases all features
- [ ] Live deployment URL accessible
- [ ] Technical documentation comprehensive
- [ ] Eligibility verified (MHCP member)

### 30-Day Post-Launch
- [ ] 500+ unique users
- [ ] 285% cocktail sales increase
- [ ] 40% photo share rate
- [ ] 8+ NPS score
- [ ] 3 new hotel contracts in pipeline

---

**Next:** See TECHNICAL_PLAN.md for implementation architecture
