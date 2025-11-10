# Emerald Gem AR Platform - Task Breakdown

Generated from PROJECT_SPEC.md and TECHNICAL_PLAN.md using GitHub Spec Kit methodology.

## Critical Path Tasks (December 9 Competition)

### TASK-001: Join Meta Horizon Start Program
**Track:** Competition  
**Priority:** P0-Critical  
**Size:** 1 point  
**Deadline:** December 5, 2025

**Description:**
Complete application to Meta Horizon Start Program to qualify for competition submission.

**Acceptance Criteria:**
- [ ] Application submitted to Meta
- [ ] Confirmation email received
- [ ] Developer console access verified
- [ ] Competition eligibility confirmed

**Dependencies:** None  
**Assignee:** TBD  
**Labels:** `competition`, `P0-critical`, `administrative`

---

### TASK-002: Produce Competition Demo Video
**Track:** Competition  
**Priority:** P0-Critical  
**Size:** 5 points  
**Deadline:** December 8, 2025

**Description:**
Create 3-5 minute demo video showcasing AR try-on flows, Passthrough Camera + AI features, and lifestyle track positioning.

**Acceptance Criteria:**
- [ ] Script written emphasizing Lifestyle Track
- [ ] Screen recordings of PWA on mobile
- [ ] Passthrough Camera footage (if available)
- [ ] Tavus.io AI integration demonstrated
- [ ] Royal Sonesta launch mentioned
- [ ] Video edited to 3-5 minutes
- [ ] Uploaded to YouTube (unlisted)

**Dependencies:** TASK-003 (camera system must work)  
**Assignee:** TBD  
**Labels:** `competition`, `P0-critical`, `content`

---

### TASK-003: Harden Front-Facing Camera System
**Track:** Web PWA  
**Priority:** P0-Critical  
**Size:** 8 points  
**Deadline:** December 6, 2025

**Description:**
Ensure camera system achieves 95%+ initialization success rate across device matrix with graceful fallbacks.

**Acceptance Criteria:**
- [ ] Progressive fallback tested (60fps→30fps→basic)
- [ ] Error recovery UI polished
- [ ] Performance monitoring dashboard functional
- [ ] Tested on iPhone 14, iPhone 12, Pixel 7, Quest 3
- [ ] FPS counter displays accurately
- [ ] Retry logic with exponential backoff verified
- [ ] Mirror mode for selfies works correctly

**Dependencies:** None  
**Assignee:** TBD  
**Labels:** `web`, `P0-critical`, `camera`, `testing`

**Technical Notes:**
- Uses `lib/camera-manager.ts` and `components/camera/camera-feed.tsx`
- Fallback chain defined in camera architecture doc
- Must integrate with analytics (Amplitude + Customer.io)

---

### TASK-004: Integrate Amplitude Analytics
**Track:** Analytics  
**Priority:** P0-Critical  
**Size:** 3 points  
**Deadline:** December 6, 2025

**Description:**
Configure Amplitude SDK and implement preset tracking functions across all AR experiences.

**Acceptance Criteria:**
- [ ] `NEXT_PUBLIC_AMPLITUDE_API_KEY` environment variable added
- [ ] Amplitude SDK initialized in `app/layout-client.tsx`
- [ ] `lib/analytics.ts` preset functions tested
- [ ] Camera lifecycle events tracked
- [ ] AR interaction events tracked
- [ ] Photo capture events tracked
- [ ] Dashboard displays real-time Amplitude data

**Dependencies:** None  
**Assignee:** TBD  
**Labels:** `analytics`, `P0-critical`, `integration`

**Technical Notes:**
- Dual-write to Amplitude (client) + Customer.io (server)
- Event taxonomy documented in `docs/DUAL_ANALYTICS_STRATEGY.md`

---

### TASK-005: Integrate Customer.io Pipeline API
**Track:** Analytics  
**Priority:** P0-Critical  
**Size:** 3 points  
**Deadline:** December 6, 2025

**Description:**
Configure Customer.io Pipeline API and implement server-side event tracking via `/api/track` endpoint.

**Acceptance Criteria:**
- [ ] `CUSTOMERIO_API_KEY` environment variable added (server-only)
- [ ] `NEXT_PUBLIC_CUSTOMERIO_SITE_ID` environment variable added
- [ ] `/api/track` route handler tested
- [ ] Events visible in Customer.io dashboard
- [ ] Horizon VR events successfully bridged
- [ ] User identification working
- [ ] Error handling implemented

**Dependencies:** None  
**Assignee:** TBD  
**Labels:** `analytics`, `P0-critical`, `integration`

---

## Critical Path Tasks (December 15 Launch)

### TASK-006: Build AR Cocktail Try-On Experience
**Track:** Web PWA  
**Priority:** P1-High  
**Size:** 8 points  
**Deadline:** December 12, 2025

**Description:**
Implement interactive 3D cocktail menu with AR hand overlay visualization.

**Acceptance Criteria:**
- [ ] 3D cocktail models loaded (GLB format)
- [ ] Carousel navigation functional
- [ ] AR hand overlay renders correctly
- [ ] Nutritional info displays
- [ ] "Order Now" button triggers Customer.io event
- [ ] Performance: <100ms interaction latency

**Dependencies:** TASK-003 (camera), TASK-004/005 (analytics)  
**Assignee:** TBD  
**Labels:** `web`, `P1-high`, `ar-experience`, `3d`

---

### TASK-007: Build Photo Booth Experience
**Track:** Web PWA  
**Priority:** P1-High  
**Size:** 5 points  
**Deadline:** December 12, 2025

**Description:**
Implement photo capture with AR frame overlays (Glinda avatar, emerald frames).

**Acceptance Criteria:**
- [ ] Frame selection UI implemented
- [ ] AR overlay compositing works
- [ ] Photo capture button functional
- [ ] Share/download options available
- [ ] Photos saved locally (no server storage)
- [ ] Analytics events tracked

**Dependencies:** TASK-003 (camera), TASK-004/005 (analytics)  
**Assignee:** TBD  
**Labels:** `web`, `P1-high`, `ar-experience`, `photo`

---

### TASK-008: Create Day-Of Runbook
**Track:** Launch Ops  
**Priority:** P0-Critical  
**Size:** 2 points  
**Deadline:** December 13, 2025

**Description:**
Document step-by-step launch procedures, troubleshooting guide, and recovery protocols for Royal Sonesta staff.

**Acceptance Criteria:**
- [ ] Setup checklist (device prep, network validation)
- [ ] Troubleshooting decision tree
- [ ] Common error messages + solutions
- [ ] Emergency contact escalation path
- [ ] Backup procedures documented
- [ ] Staff training materials created

**Dependencies:** All web PWA tasks complete  
**Assignee:** TBD  
**Labels:** `launch`, `P0-critical`, `documentation`, `operations`

---

### TASK-009: Royal Sonesta Device Testing
**Track:** Launch Ops  
**Priority:** P0-Critical  
**Size:** 3 points  
**Deadline:** December 14, 2025

**Description:**
On-site testing at Royal Sonesta Seattle to validate network, devices, and user flows.

**Acceptance Criteria:**
- [ ] WiFi speed/stability tested
- [ ] Devices charged and configured
- [ ] QR codes printed and placed
- [ ] Full user journey walkthrough completed
- [ ] Staff trained on troubleshooting
- [ ] Backup devices prepared

**Dependencies:** TASK-006, TASK-007, TASK-008  
**Assignee:** TBD  
**Labels:** `launch`, `P0-critical`, `on-site`, `testing`

---

## Secondary Tasks (Post-Launch Optimization)

### TASK-010: Implement Emerald Glow Entry Animation
**Track:** Web PWA  
**Priority:** P2-Medium  
**Size:** 3 points  
**Deadline:** December 20, 2025

**Description:**
Add immersive entry animation with emerald glow particle effects.

**Acceptance Criteria:**
- [ ] Particle system implemented
- [ ] Animation plays on first load
- [ ] Performance: <16ms frame time
- [ ] Skip button available
- [ ] Animation cached for repeat visits

**Dependencies:** None  
**Assignee:** TBD  
**Labels:** `web`, `P2-medium`, `effects`, `design`

---

### TASK-011: Optimize Bundle Size
**Track:** Infrastructure  
**Priority:** P2-Medium  
**Size:** 3 points  
**Deadline:** December 22, 2025

**Description:**
Reduce initial bundle size to <500KB for faster load times.

**Acceptance Criteria:**
- [ ] Bundle analysis performed
- [ ] Code-splitting implemented for heavy modules
- [ ] Images optimized (WebP format)
- [ ] Tree-shaking verified
- [ ] Lighthouse score: 90+ on mobile

**Dependencies:** None  
**Assignee:** TBD  
**Labels:** `infrastructure`, `P2-medium`, `performance`

---

## Meta Horizon Tasks (Parallel Track)

### TASK-012: Setup Meta Horizon Desktop Editor
**Track:** Meta Horizon  
**Priority:** P1-High  
**Size:** 2 points  
**Deadline:** December 7, 2025

**Description:**
Install and configure Meta Horizon Desktop Editor for world creation.

**Acceptance Criteria:**
- [ ] Desktop Editor downloaded and installed
- [ ] Meta account linked
- [ ] New project created
- [ ] Test world published (private)
- [ ] Asset Library access verified

**Dependencies:** TASK-001 (Horizon Start Program)  
**Assignee:** TBD  
**Labels:** `horizon`, `P1-high`, `setup`

---

### TASK-013: Convert 3D Assets for Horizon
**Track:** Meta Horizon  
**Priority:** P1-High  
**Size:** 5 points  
**Deadline:** December 10, 2025

**Description:**
Convert web GLB models to FBX format and optimize for Horizon Asset Library.

**Acceptance Criteria:**
- [ ] Cocktail models converted (GLB→FBX)
- [ ] Textures optimized (PNG, <2MB each)
- [ ] Audio files prepared (MP3, <5MB each)
- [ ] Assets uploaded to Horizon Asset Library
- [ ] Intersection layer monitors sync status

**Dependencies:** TASK-012  
**Assignee:** TBD  
**Labels:** `horizon`, `P1-high`, `assets`, `3d`

**Technical Notes:**
- Use `intersection/asset-bridge.ts` for automation
- Document manual conversion steps for reference

---

### TASK-014: Implement Horizon TypeScript Gizmos
**Track:** Meta Horizon  
**Priority:** P1-High  
**Size:** 8 points  
**Deadline:** December 14, 2025

**Description:**
Create TypeScript scripts for interactive cocktail carousel, photo capture, and analytics tracking in Horizon World.

**Acceptance Criteria:**
- [ ] Carousel navigation script (prev/next buttons)
- [ ] Photo capture script (hand trigger + save)
- [ ] Analytics bridge script (POST to /api/track)
- [ ] UI panels for text/buttons
- [ ] Hand tracking interactions tested
- [ ] Events visible in web analytics dashboard

**Dependencies:** TASK-013  
**Assignee:** TBD  
**Labels:** `horizon`, `P1-high`, `scripting`, `typescript`

**Technical Notes:**
- Reference `docs/META_HORIZON_GIZMO_MAPPING.md`
- Use templates from `lib/horizon-gizmo-templates.ts`

---

## Spec Kit Integration Tasks

### TASK-015: Document Spec-Plan-Task Workflow
**Track:** Infrastructure  
**Priority:** P3-Low  
**Size:** 2 points  
**Deadline:** December 30, 2025

**Description:**
Create documentation showing how GitHub Spec Kit integrates with existing GitHub Projects workflow.

**Acceptance Criteria:**
- [ ] Workflow diagram created
- [ ] Example spec→plan→task flow documented
- [ ] AI coding agent integration explained
- [ ] Added to README.md

**Dependencies:** None  
**Assignee:** TBD  
**Labels:** `infrastructure`, `P3-low`, `documentation`, `process`

---

## Task Summary

**Total Tasks:** 15  
**Total Story Points:** 61

**By Priority:**
- P0-Critical: 8 tasks (28 points)
- P1-High: 5 tasks (26 points)
- P2-Medium: 2 tasks (6 points)
- P3-Low: 1 task (2 points)

**By Track:**
- Web PWA: 5 tasks (27 points)
- Analytics: 2 tasks (6 points)
- Competition: 2 tasks (6 points)
- Launch Ops: 2 tasks (5 points)
- Meta Horizon: 3 tasks (15 points)
- Infrastructure: 2 tasks (5 points)

**Critical Path for Dec 9 Competition:**
TASK-001 → TASK-003 → TASK-004/005 → TASK-002 (Submit)

**Critical Path for Dec 15 Launch:**
TASK-003 → TASK-006/007 → TASK-008 → TASK-009 (Launch)

---

*Tasks generated by GitHub Spec Kit AI agent. Review and refine before implementation.*
