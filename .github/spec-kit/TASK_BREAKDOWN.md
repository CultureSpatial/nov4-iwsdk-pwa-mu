# Emerald Gem - Task Breakdown

**Based on:** PROJECT_SPEC.md + TECHNICAL_PLAN.md
**Sprint:** Pre-Competition (Nov 20 - Dec 9, 2025)
**Methodology:** Spec-driven development with AI coding agents

## Task Priority Matrix

| Priority | Category | Task Count | Deadline |
|----------|----------|------------|----------|
| P0 (Critical) | Camera + Competition | 5 | Dec 2 |
| P1 (High) | Horizon + Analytics | 4 | Dec 6 |
| P2 (Medium) | Polish + Docs | 3 | Dec 9 |
| P3 (Low) | Future enhancements | 3 | Post-launch |

---

## P0 Tasks (Critical - Dec 2 Deadline)

### Task 1: Camera System Hardening
**Status:** In Progress
**Assignee:** AI Agent + Developer Review
**Estimated Time:** 8 hours

**Description:**
Ensure front-facing camera system meets 60fps performance target with robust error handling for try-on flows.

**Acceptance Criteria:**
- [ ] 60fps achieved on iPhone 13+ and Galaxy S21+
- [ ] Graceful degradation to 30fps on older devices
- [ ] < 2 second initialization time (p95)
- [ ] Camera permission acceptance rate > 75%
- [ ] Auto-retry logic with exponential backoff
- [ ] Performance metrics logged to Amplitude

**Implementation Steps:**
1. Review existing `lib/camera-manager.ts`
2. Add performance monitoring hooks
3. Implement progressive fallback (60→30→basic fps)
4. Add user-friendly error messages for all failure modes
5. Test on 5 target devices (iOS/Android mix)

**Files to Modify:**
- `lib/camera-manager.ts` - Core logic
- `components/camera/camera-feed.tsx` - UI component
- `docs/CAMERA_ARCHITECTURE.md` - Documentation

**Testing:**
\`\`\`bash
# Manual test on devices
iPhone 13 Pro (iOS 17)
Galaxy S23 (Android 14)
Pixel 7 (Android 13)
iPhone 11 (iOS 16) # Older device test
Galaxy S20 (Android 12) # Older device test
\`\`\`

---

### Task 2: Competition Submission Package
**Status:** Not Started
**Assignee:** Developer
**Estimated Time:** 6 hours

**Description:**
Prepare all materials for Meta Horizon Start Developer Competition submission.

**Acceptance Criteria:**
- [ ] 2-minute demo video showcasing all features
- [ ] Devpost submission form completed
- [ ] Live deployment URL (vercel.app)
- [ ] Technical architecture document (PDF)
- [ ] Meta Horizon world published and linked
- [ ] Eligibility verified (MHCP membership confirmed)

**Deliverables:**
1. **Demo Video (2 min):**
   - 0:00-0:15: Problem statement (luxury hotel engagement)
   - 0:15-0:45: Cocktail try-on demo (front camera)
   - 0:45-1:15: Photo booth + social sharing
   - 1:15-1:30: VR station demo (Quest 3)
   - 1:30-2:00: Impact metrics + CTA

2. **Technical Doc (PDF):**
   - System architecture diagram
   - Technology stack breakdown
   - Passthrough Camera implementation details
   - AI integration (Tavus.io)
   - Performance metrics
   - Scalability approach

3. **Live URLs:**
   - Web PWA: https://emeraldgem.vercel.app
   - GitHub: https://github.com/CultureSpatial/emerald-gem
   - Meta Horizon World: [TBD - publish world]

**Files to Create:**
- `docs/COMPETITION_SUBMISSION.md`
- `assets/demo-video.mp4`
- `assets/technical-doc.pdf`

---

### Task 3: Horizon World MVP Build
**Status:** Not Started
**Assignee:** Developer (Horizon Desktop Editor)
**Estimated Time:** 12 hours

**Description:**
Build minimal viable world in Meta Horizon Desktop Editor with cocktail bar and photo booth.

**Acceptance Criteria:**
- [ ] World loads on Quest 3 in < 5 seconds
- [ ] 3 signature cocktails as 3D models
- [ ] Interactive photo booth portal
- [ ] Hand tracking for object interaction
- [ ] Passthrough mode enabled
- [ ] Analytics events POST to web API
- [ ] QR code to mobile experience

**Gizmo Structure:**
\`\`\`
Emerald Gem World/
├── Spawn Point (entry)
├── Lobby Area
│   ├── Welcome Text Gizmo
│   ├── Tutorial UI Panel
│   └── Navigation Menu
├── Cocktail Bar
│   ├── Bar Counter (3D model)
│   ├── Cocktail Display Pedestals (x3)
│   │   ├── Emerald Mule (GLB)
│   │   ├── Royal Fizz (GLB)
│   │   └── Sapphire Sour (GLB)
│   ├── Info Panels (Text Gizmos)
│   └── Order Button (UI Gizmo)
├── Photo Booth Portal
│   ├── Frame Display (x4)
│   ├── Capture Trigger (Code Block)
│   └── Share QR Gizmo
└── Analytics Script (TypeScript)
    ├── Track VR sessions
    ├── Track interactions
    └── POST to web API
\`\`\`

**TypeScript Scripts:**
- `VRAnalyticsScript.ts` - Event tracking
- `CocktailInteractionScript.ts` - Hand tracking
- `PhotoBoothScript.ts` - Capture logic

**Assets Required:**
- 3x cocktail GLB models → Convert to FBX
- 4x photo frame textures
- Brand logo textures
- Ambient audio

---

### Task 4: Analytics Pipeline Validation
**Status:** In Progress
**Assignee:** AI Agent
**Estimated Time:** 4 hours

**Description:**
Verify dual analytics pipeline (Amplitude + Customer.io) correctly tracks all events from all platforms.

**Acceptance Criteria:**
- [ ] All preset events appear in Amplitude dashboard
- [ ] All events flow to Customer.io Pipeline
- [ ] VR events from Horizon POST successfully
- [ ] No duplicate events
- [ ] Event properties schema validated
- [ ] User identification working (anonymous → identified)

**Test Matrix:**
| Event | Web | Mobile | VR | Amplitude | Customer.io |
|-------|-----|--------|-----|-----------|-------------|
| ar_session_start | ✓ | ✓ | ✓ | ✓ | ✓ |
| camera_initialized | ✓ | ✓ | ✗ | ✓ | ✓ |
| cocktail_viewed | ✓ | ✓ | ✓ | ✓ | ✓ |
| photo_captured | ✓ | ✓ | ✓ | ✓ | ✓ |
| order_placed | ✓ | ✓ | ✓ | ✓ | ✓ |

**Files to Review:**
- `lib/analytics.ts`
- `app/api/track/route.ts`
- `docs/DUAL_ANALYTICS_STRATEGY.md`

---

### Task 5: Environment Variables Setup
**Status:** Blocked
**Assignee:** Developer (manual Vercel config)
**Estimated Time:** 1 hour

**Description:**
Configure correct environment variable names in Vercel dashboard.

**Required Variables:**
\`\`\`bash
# Client-side (NEXT_PUBLIC_*)
NEXT_PUBLIC_AMPLITUDE_API_KEY=[from Amplitude dashboard]
NEXT_PUBLIC_CUSTOMERIO_SITE_ID=[from Customer.io]
NEXT_PUBLIC_EVENT_NAME="Royal Sonesta Seattle Soft Launch"
NEXT_PUBLIC_EVENT_DATE="2025-12-15"

# Server-side (no prefix)
CUSTOMERIO_API_KEY=[from Customer.io - KEEP SECRET]

# Optional features (toggle)
NEXT_PUBLIC_ENABLE_PHOTO_BOOTH=true
NEXT_PUBLIC_ENABLE_COCKTAIL_MENU=true
NEXT_PUBLIC_ENABLE_POLLS=false
NEXT_PUBLIC_ENABLE_QA=false
\`\`\`

**Action:**
1. Developer logs into Vercel dashboard
2. Navigate to Project Settings → Environment Variables
3. Add all variables above
4. Trigger redeploy
5. Verify in preview deployment

---

## P1 Tasks (High Priority - Dec 6 Deadline)

### Task 6: Asset Pipeline Automation
**Status:** Not Started
**Assignee:** AI Agent
**Estimated Time:** 6 hours

**Description:**
Automate asset conversion and sync between Web PWA and Horizon world.

**Acceptance Criteria:**
- [ ] GLB → FBX conversion on asset upload
- [ ] Automatic CDN deployment (Vercel Blob)
- [ ] Horizon world manifest auto-updates
- [ ] Dashboard shows sync status
- [ ] Rollback capability for bad assets

**Implementation:**
\`\`\`typescript
// intersection/asset-bridge.ts enhancements
- Add GLB → FBX converter (WASM library)
- Implement webhook for asset changes
- Create sync queue with retry logic
- Add dashboard UI for monitoring
\`\`\`

---

### Task 7: Dashboard Enhancements
**Status:** In Progress
**Assignee:** AI Agent
**Estimated Time:** 4 hours

**Description:**
Improve `/dashboard` with real-time metrics for launch day monitoring.

**Acceptance Criteria:**
- [ ] Live user count (WebSocket or polling)
- [ ] Camera success/failure rate (realtime)
- [ ] Order conversion funnel visualization
- [ ] Platform breakdown (iOS/Android/VR)
- [ ] Alert thresholds with notifications

**New Metrics:**
- Active sessions (last 5 min)
- Camera init success rate (%)
- Try-on → Order conversion (%)
- Photo share rate (%)
- Average session duration (seconds)

---

### Task 8: Error Recovery UX
**Status:** Not Started
**Assignee:** AI Agent
**Estimated Time:** 3 hours

**Description:**
Add user-friendly error recovery flows for common failure modes.

**Acceptance Criteria:**
- [ ] Camera permission denied → Inline instructions
- [ ] Network error → Retry button + offline mode
- [ ] Asset load failure → Fallback placeholders
- [ ] Analytics failure → Silent fallback (no user impact)

---

### Task 9: Mobile Optimization Pass
**Status:** Not Started
**Assignee:** AI Agent
**Estimated Time:** 5 hours

**Description:**
Optimize for mobile performance and battery life.

**Acceptance Criteria:**
- [ ] Lazy load 3D assets (progressive)
- [ ] Reduce bundle size < 2MB
- [ ] Battery drain < 15%/hour
- [ ] Works on 3G (600kbps)
- [ ] Lighthouse score > 90

---

## P2 Tasks (Medium Priority - Dec 9 Deadline)

### Task 10: Documentation Completeness
**Status:** In Progress
**Assignee:** AI Agent
**Estimated Time:** 3 hours

**Description:**
Ensure all documentation is complete for competition judges and future developers.

**Checklist:**
- [x] PROJECT_SPEC.md
- [x] TECHNICAL_PLAN.md
- [x] TASK_BREAKDOWN.md
- [x] CAMERA_ARCHITECTURE.md
- [x] DUAL_ANALYTICS_STRATEGY.md
- [ ] API_DOCUMENTATION.md
- [ ] DEPLOYMENT_GUIDE.md
- [ ] TROUBLESHOOTING.md

---

### Task 11: Social Sharing Optimization
**Status:** Not Started
**Assignee:** AI Agent
**Estimated Time:** 4 hours

**Description:**
Optimize photo sharing flow for maximum virality.

**Features:**
- [ ] Instagram Stories direct integration
- [ ] Auto-hashtag suggestions (#EmeraldGem, #RoyalSonesta)
- [ ] QR code for desktop transfer
- [ ] Email-to-self option
- [ ] Analytics on share completion

---

### Task 12: Staff Training Materials
**Status:** Not Started
**Assignee:** Developer
**Estimated Time:** 2 hours

**Description:**
Create training guide for Royal Sonesta staff.

**Deliverables:**
- PDF guide with screenshots
- Video walkthrough (5 min)
- Troubleshooting FAQ
- Contact info for tech support

---

## P3 Tasks (Low Priority - Post-Launch)

### Task 13: Tavus.io AI Avatar Integration
**Status:** Future
**Estimated Time:** 8 hours

**Description:**
Add AI-generated avatar videos explaining cocktails.

---

### Task 14: Multi-Language Support
**Status:** Future
**Estimated Time:** 6 hours

**Description:**
i18n for English, Spanish, Japanese.

---

### Task 15: Advanced Analytics Dashboard
**Status:** Future
**Estimated Time:** 10 hours

**Description:**
Build admin dashboard for hotel managers.

---

## Task Dependencies

\`\`\`mermaid
graph TD
    T1[Task 1: Camera] --> T3[Task 3: Horizon World]
    T1 --> T2[Task 2: Competition]
    T4[Task 4: Analytics] --> T2
    T5[Task 5: Env Vars] --> T4
    T5 --> T1
    T3 --> T6[Task 6: Asset Pipeline]
    T4 --> T7[Task 7: Dashboard]
    T1 --> T8[Task 8: Error Recovery]
    T1 --> T9[Task 9: Mobile Optimization]
    T2 --> T10[Task 10: Documentation]
    T9 --> T11[Task 11: Social Sharing]
    T10 --> T12[Task 12: Training Materials]
\`\`\`

---

## GitHub Issues Integration

**How to use this breakdown:**

1. Each task = 1 GitHub Issue
2. Use labels: `priority:P0`, `track:competition`, `track:camera`, etc.
3. Link to spec files in issue description
4. Add to GitHub Projects board
5. AI agent picks up tasks from board

**Example Issue Template:**
\`\`\`markdown
**Spec Reference:** .github/spec-kit/TASK_BREAKDOWN.md - Task 1
**Priority:** P0
**Track:** Camera
**Estimated Time:** 8 hours

[Copy acceptance criteria from above]

**Implementation Notes:**
[AI agent fills this in during execution]
\`\`\`

---

**Status:** 5/15 tasks complete | 10 tasks remaining | Dec 9 deadline
