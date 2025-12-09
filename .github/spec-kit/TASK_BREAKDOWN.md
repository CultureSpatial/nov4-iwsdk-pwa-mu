# Emerald Gem AR Platform - Task Breakdown

## Priority Legend
- **P0:** Critical (launch blockers)
- **P1:** High (competition, key features)
- **P2:** Medium (enhancements)
- **P3:** Low (nice-to-have)

## Status Legend
- **✅ Done:** Completed and deployed
- **🚧 In Progress:** Currently being worked on
- **📋 Ready:** Ready to start
- **⏸️ Blocked:** Waiting on dependencies

---

## Track 1: Web PWA (Foundation)

### Task 1.1: Camera System [P0] ✅
**Status:** Done
**Owner:** Primary Development
**Story Points:** 8 (XL)

**Description:**
Implement robust front-facing camera system with progressive fallback and performance monitoring.

**Acceptance Criteria:**
- [x] getUserMedia() implementation with error handling
- [x] Progressive fallback: 60fps → 30fps → basic
- [x] Retry logic with exponential backoff
- [x] Performance monitoring (FPS, latency, dropped frames)
- [x] Camera switch capability (front/back)
- [x] Analytics integration (camera lifecycle events)

**Files:**
- `lib/camera-manager.ts`
- `components/camera/camera-feed.tsx`
- `docs/CAMERA_ARCHITECTURE.md`

---

### Task 1.2: AR Photo Booth [P0] ✅
**Status:** Done (Mock implementation, needs real filters)
**Owner:** AR Development
**Story Points:** 5 (L)

**Description:**
Build AR photo booth with filters, capture, and social sharing.

**Acceptance Criteria:**
- [x] Camera feed integration
- [ ] AR filter overlay system
- [ ] Photo capture functionality
- [ ] Download + social sharing
- [ ] Analytics tracking per filter
- [ ] Mobile-optimized UI

**Files:**
- `app/ar/photo-booth/page.tsx`
- `components/ar/photo-capture.tsx`
- `lib/ar-filters.ts` (needs creation)

**Remaining Work:**
- Implement real AR filters (face tracking, overlay)
- Social sharing API integration
- Filter selection UI

---

### Task 1.3: Cocktail Menu AR [P0] 📋
**Status:** Ready
**Owner:** 3D Development
**Story Points:** 5 (L)

**Description:**
3D cocktail visualization with WebGL/Three.js in AR space.

**Acceptance Criteria:**
- [ ] Three.js scene setup
- [ ] GLTF model loading and rendering
- [ ] AR placement and interaction (rotate, zoom)
- [ ] Cocktail data API integration
- [ ] "Order Now" CTA with analytics
- [ ] Performance optimization (< 30ms frame time)

**Files:**
- `app/ar/cocktails/page.tsx`
- `components/ar/cocktail-viewer.tsx`
- `lib/three-scene.ts`
- `app/api/cocktails/route.ts`

**Dependencies:**
- 3D cocktail models (GLTF format)
- Cocktail data structure

---

### Task 1.4: Analytics Integration [P0] ✅
**Status:** Done
**Owner:** Data Team
**Story Points:** 3 (M)

**Description:**
Dual analytics stack with Amplitude and Customer.io.

**Acceptance Criteria:**
- [x] Amplitude SDK initialization
- [x] Customer.io CDP integration via /api/track
- [x] Unified trackEvent() function
- [x] Cross-platform event taxonomy
- [x] User identification flow
- [x] Error handling and retry logic

**Files:**
- `lib/analytics.ts`
- `app/api/track/route.ts`
- `app/layout-client.tsx`
- `docs/DUAL_ANALYTICS_STRATEGY.md`

---

### Task 1.5: Photo Upload & Storage [P1] 📋
**Status:** Ready
**Owner:** Backend Development
**Story Points:** 3 (M)

**Description:**
Upload captured AR photos to cloud storage with sharing URLs.

**Acceptance Criteria:**
- [ ] /api/photos/upload endpoint
- [ ] Cloud storage integration (Vercel Blob or S3)
- [ ] Image optimization (resize, compress)
- [ ] Generate shareable URLs
- [ ] Analytics tracking (upload success/failure)

**Files:**
- `app/api/photos/upload/route.ts`
- `lib/photo-storage.ts`

**Integration Options:**
- Vercel Blob (recommended, easiest)
- AWS S3 + CloudFront
- Cloudinary

---

## Track 2: Meta Horizon (Transmutation)

### Task 2.1: Horizon World Base Environment [P1] 📋
**Status:** Ready
**Owner:** VR Development
**Story Points:** 8 (XL)

**Description:**
Create Horizon world with Royal Sonesta-themed lounge environment.

**Acceptance Criteria:**
- [ ] World created in Horizon Desktop Editor
- [ ] Environment design (lounge aesthetic)
- [ ] Mobile + VR support enabled
- [ ] Basic navigation and interactions
- [ ] Published to Horizon catalog

**Tools:**
- Horizon Desktop Editor
- 3D modeling software (Blender recommended)

**Resources:**
- Royal Sonesta brand guidelines
- Reference photos of venue

---

### Task 2.2: Passthrough Camera Integration [P1] 📋
**Status:** Ready (Requires Quest 3/3S hardware)
**Owner:** VR Development
**Story Points:** 5 (L)

**Description:**
Implement passthrough camera for VR photo booth experience.

**Acceptance Criteria:**
- [ ] Passthrough Camera API integration
- [ ] Camera permission flow in VR
- [ ] Real-time camera feed rendering
- [ ] Photo capture in VR
- [ ] Analytics tracking

**API Requirements:**
- Horizon OS v74+
- Quest 3 or Quest 3S device
- "horizonos.permission.HEADSET_CAMERA" permission

**Files:**
- Horizon TypeScript scripts
- Gizmo components for camera UI

---

### Task 2.3: VR Photo Booth Gizmos [P1] 📋
**Status:** Ready (Blocked by 2.2)
**Owner:** VR Development
**Story Points:** 5 (L)

**Description:**
Build UI gizmos for VR photo booth (buttons, frames, sharing).

**Acceptance Criteria:**
- [ ] UI panel for photo booth controls
- [ ] Filter selection gizmo
- [ ] Capture button gizmo
- [ ] Preview panel gizmo
- [ ] Share/download functionality
- [ ] Hand interaction support

**Dependencies:**
- Task 2.2 (Passthrough Camera)

---

### Task 2.4: Horizon Analytics Bridge [P1] 📋
**Status:** Ready
**Owner:** Integration Team
**Story Points:** 3 (M)

**Description:**
Connect Horizon world events to web analytics pipeline.

**Acceptance Criteria:**
- [ ] TypeScript fetch() to /api/track
- [ ] Event tracking from Horizon scripts
- [ ] Player ID as userId
- [ ] Platform detection (platform: 'horizon')
- [ ] Error handling and retry

**Files:**
- Horizon TypeScript scripts
- `intersection/event-bridge.ts` (web side)

**Example Events:**
- `horizon_world_entered`
- `horizon_interaction`
- `photo_captured` (from VR)

---

## Track 3: Competition (Meta Horizon Start)

### Task 3.1: Join Meta Horizon Start Program [P0] 📋
**Status:** Ready (User action required)
**Owner:** Project Lead
**Story Points:** 1 (XS)

**Description:**
Apply and get accepted to Meta Horizon Start Program.

**Acceptance Criteria:**
- [ ] Application submitted
- [ ] Approval received
- [ ] Account credentials configured

**Timeline:**
- Submit by Dec 4 (allows 3-5 day approval buffer)

**Link:** https://developer.meta.com/horizon/start

---

### Task 3.2: Demo Video Production [P1] 📋
**Status:** Ready (Blocked by 2.1, 2.2)
**Owner:** Marketing/Video Team
**Story Points:** 3 (M)

**Description:**
Create < 3 min demo video showcasing Passthrough Camera + AI innovation.

**Acceptance Criteria:**
- [ ] Script written
- [ ] Footage captured (VR, mobile, web)
- [ ] Editing and post-production
- [ ] Voice-over and captions
- [ ] < 3 minutes duration
- [ ] Uploaded to YouTube/Vimeo

**Key Highlights:**
- Front-facing camera innovation
- Cross-platform experience (VR + mobile + web)
- Royal Sonesta deployment
- Business ROI model

**Dependencies:**
- Task 2.1 (Horizon world)
- Task 2.2 (Passthrough camera)

---

### Task 3.3: Technical Documentation [P1] 📋
**Status:** Ready (Partially done)
**Owner:** Documentation Team
**Story Points:** 2 (S)

**Description:**
Write technical documentation for competition submission.

**Acceptance Criteria:**
- [ ] Architecture diagram
- [ ] README with setup instructions
- [ ] Innovation highlights writeup
- [ ] API documentation
- [ ] Deployment guide

**Files:**
- `README.md` (update)
- `docs/ARCHITECTURE.md` (create)
- `docs/COMPETITION_SUBMISSION.md` (create)

**Status:**
- ✅ DUAL_ANALYTICS_STRATEGY.md
- ✅ CAMERA_ARCHITECTURE.md
- ✅ META_HORIZON_CHALLENGE_STRATEGY.md
- [ ] Final competition-specific docs

---

### Task 3.4: Competition Submission Form [P0] 📋
**Status:** Ready (Dec 8-9)
**Owner:** Project Lead
**Story Points:** 1 (XS)

**Description:**
Complete and submit Devpost competition form.

**Acceptance Criteria:**
- [ ] All form fields completed
- [ ] Demo video linked
- [ ] Horizon world URL provided
- [ ] Technical docs linked
- [ ] Submitted before Dec 9 11:59 PM

**Deadline:** December 9, 2025

---

## Track 4: Launch Operations (Royal Sonesta)

### Task 4.1: Venue WiFi Audit [P0] 📋
**Status:** Ready
**Owner:** Operations Team
**Story Points:** 2 (S)

**Description:**
Test and optimize venue WiFi for AR experience.

**Acceptance Criteria:**
- [ ] WiFi speed test at multiple venue locations
- [ ] Coverage map created
- [ ] Bandwidth requirements documented
- [ ] Recommendations for venue IT team
- [ ] Load testing (simulate 50+ concurrent users)

**Minimum Requirements:**
- 10 Mbps per device
- < 50ms latency
- 95%+ coverage in guest areas

---

### Task 4.2: Physical Gem Deployment [P0] 📋
**Status:** Ready
**Owner:** Operations Team
**Story Points:** 2 (S)

**Description:**
Create and deploy physical "Emerald Gems" (QR codes/NFC tags).

**Acceptance Criteria:**
- [ ] QR code design (branded, clear CTA)
- [ ] NFC tag programming (if applicable)
- [ ] Placement strategy (high-traffic areas)
- [ ] Print and mount physical gems
- [ ] Test scans from guest devices

**Locations:**
- Hotel lobby
- Bar area
- Restaurant tables
- Guest rooms (optional)

---

### Task 4.3: Staff Training Materials [P0] 📋
**Status:** Ready
**Owner:** Operations Team
**Story Points:** 2 (S)

**Description:**
Create training materials for venue staff.

**Acceptance Criteria:**
- [ ] Quick-start guide (< 1 page)
- [ ] Video tutorial (< 5 min)
- [ ] Troubleshooting checklist
- [ ] FAQ document
- [ ] Practice session scheduled

**Topics:**
- How to scan gem
- How to use AR features
- Common guest questions
- Technical troubleshooting
- Order fulfillment process

---

### Task 4.4: Launch Day Monitoring [P0] 📋
**Status:** Ready (Dec 15)
**Owner:** Full Team
**Story Points:** 3 (M)

**Description:**
Monitor and support launch day operations.

**Acceptance Criteria:**
- [ ] Real-time dashboard monitoring
- [ ] On-site technical support
- [ ] Guest feedback collection
- [ ] Issue tracking and rapid response
- [ ] Post-launch debrief

**Schedule:**
- Pre-launch checks (Dec 14)
- Launch day support (Dec 15, 8am-11pm)
- Post-launch review (Dec 16)

---

## Track 5: Infrastructure

### Task 5.1: Environment Variable Setup [P0] 📋
**Status:** Ready (User action required)
**Owner:** DevOps
**Story Points:** 1 (XS)

**Description:**
Configure environment variables in Vercel.

**Acceptance Criteria:**
- [ ] Amplitude API key added
- [ ] Customer.io credentials added
- [ ] Feature flags configured
- [ ] Event metadata set
- [ ] Verified in deployed preview

**Variables:**
See docs/ENVIRONMENT_VARIABLES.md for required variables list

---

### Task 5.2: Error Monitoring [P1] 📋
**Status:** Ready
**Owner:** DevOps
**Story Points:** 2 (S)

**Description:**
Set up error tracking and alerting.

**Acceptance Criteria:**
- [ ] Error tracking service integrated (Sentry recommended)
- [ ] Alert rules configured
- [ ] Slack/email notifications
- [ ] Error dashboard accessible

**Integration Options:**
- Sentry (recommended)
- Vercel built-in monitoring
- Rollbar

---

### Task 5.3: Performance Monitoring [P2] 📋
**Status:** Ready
**Owner:** DevOps
**Story Points:** 2 (S)

**Description:**
Set up performance monitoring and optimization.

**Acceptance Criteria:**
- [ ] Lighthouse CI in GitHub Actions
- [ ] Web Vitals tracking
- [ ] Performance budget alerts
- [ ] Regular performance audits

**Metrics:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Camera FPS > 30

---

## Track 6: Analytics & Optimization

### Task 6.1: Analytics Dashboard [P1] 📋
**Status:** Partially done (needs real data)
**Owner:** Data Team
**Story Points:** 3 (M)

**Description:**
Build analytics dashboard for venue managers.

**Acceptance Criteria:**
- [ ] Real-time metrics display
- [ ] Conversion funnel visualization
- [ ] Platform comparison (web/mobile/VR)
- [ ] Revenue tracking
- [ ] Export reports functionality

**Files:**
- `app/dashboard/page.tsx` (exists, needs enhancement)

**Metrics:**
- DAU/MAU
- Scan-to-engagement rate
- Photo capture rate
- Cocktail order conversion
- Revenue per user

---

### Task 6.2: Conversion Funnel Optimization [P2] ⏸️
**Status:** Blocked (needs launch data)
**Owner:** Data Team
**Story Points:** 3 (M)

**Description:**
Analyze and optimize conversion funnels post-launch.

**Acceptance Criteria:**
- [ ] Funnel analysis in Amplitude
- [ ] Drop-off point identification
- [ ] A/B test hypotheses
- [ ] Optimization experiments
- [ ] ROI improvement tracking

**Timeline:**
- Start 1 week post-launch (Dec 22)

**Dependencies:**
- Task 4.4 (Launch data collection)

---

## Summary

### By Priority

**P0 (Critical):**
- 1.1 Camera System ✅
- 1.2 AR Photo Booth ✅ (needs real filters)
- 1.3 Cocktail Menu AR 📋
- 1.4 Analytics Integration ✅
- 3.1 Join Meta Horizon Start 📋
- 3.4 Competition Submission 📋
- 4.1 Venue WiFi Audit 📋
- 4.2 Physical Gem Deployment 📋
- 4.3 Staff Training 📋
- 4.4 Launch Day Monitoring 📋
- 5.1 Environment Variables 📋

**P1 (High):**
- 1.5 Photo Upload 📋
- 2.1 Horizon World 📋
- 2.2 Passthrough Camera 📋
- 2.3 VR Photo Booth 📋
- 2.4 Horizon Analytics 📋
- 3.2 Demo Video 📋
- 3.3 Technical Docs 📋
- 5.2 Error Monitoring 📋
- 6.1 Analytics Dashboard 📋

**P2 (Medium):**
- 5.3 Performance Monitoring 📋
- 6.2 Conversion Optimization ⏸️

### By Status

- ✅ Done: 3 tasks
- 🚧 In Progress: 0 tasks
- 📋 Ready: 18 tasks
- ⏸️ Blocked: 1 task

### Critical Path to Dec 9

1. Join Meta Horizon Start (Task 3.1) - **Start immediately**
2. Horizon World Base (Task 2.1) - **5 days**
3. Passthrough Camera (Task 2.2) - **3 days**
4. Demo Video (Task 3.2) - **2 days**
5. Competition Submission (Task 3.4) - **Dec 9**

### Critical Path to Dec 15

1. Cocktail Menu AR (Task 1.3) - **3 days**
2. Photo Upload (Task 1.5) - **2 days**
3. Venue WiFi Audit (Task 4.1) - **1 day**
4. Physical Gem Deployment (Task 4.2) - **2 days**
5. Staff Training (Task 4.3) - **1 day**
6. Launch Day Monitoring (Task 4.4) - **Dec 15**
