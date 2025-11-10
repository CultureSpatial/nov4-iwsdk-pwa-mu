# GitHub Projects Management Structure

## Overview

This document outlines the GitHub Projects structure for managing parallel development tracks: Web PWA, Meta Horizon Transmutation, Competition Submission, and Royal Sonesta Launch.

## Project Board Structure

### Board 1: 🚀 Emerald Gem Launch (Main)

**View Type:** Board with Status columns

**Columns:**
- 📋 Backlog
- 🎯 Ready
- 🔨 In Progress
- 👀 Review
- ✅ Done
- 🚫 Blocked

**Custom Fields:**
- **Track** (Single Select): Web PWA, Meta Horizon, Competition, Launch Ops, Infrastructure, Analytics
- **Priority** (Single Select): P0-Critical, P1-High, P2-Medium, P3-Low
- **Deadline** (Date): Track deadline dependencies
- **Size** (Number): Story points (1, 2, 3, 5, 8)
- **Platform** (Multi-Select): Web, Mobile, VR, Desktop

---

### Board 2: 📅 Timeline View

**View Type:** Roadmap (Timeline)

**Swimlanes by Track:**
1. Web PWA Track
2. Meta Horizon Track  
3. Competition Track (Dec 9)
4. Launch Ops Track (Dec 15)
5. Infrastructure Track
6. Analytics Track

**Milestones:**
- Dec 3: Competition submission draft complete
- Dec 9: Meta Horizon Start Competition deadline
- Dec 13: Royal Sonesta dry run
- Dec 15: Royal Sonesta soft launch
- Q1 2026: Next Meta competition

---

## Track Breakdown

### 🌐 Web PWA Track

**Epic Issues:**

1. **Camera System Hardening**
   - [ ] Front-facing camera fallback testing
   - [ ] Performance monitoring (60fps target)
   - [ ] Multi-device compatibility matrix
   - [ ] Error recovery UI polish
   - Labels: `web`, `P0-critical`, `camera`

2. **AR Try-On Experience**
   - [ ] Cocktail menu 3D models
   - [ ] Photo booth frame overlays
   - [ ] Glinda avatar integration
   - [ ] Emerald glow effects
   - Labels: `web`, `P1-high`, `ar-experience`

3. **Analytics Integration**
   - [ ] Amplitude SDK configuration
   - [ ] Customer.io webhook testing
   - [ ] Dashboard real-time monitoring
   - [ ] Cross-platform event unification
   - Labels: `web`, `P1-high`, `analytics`

4. **PWA Installation Flow**
   - [ ] QR code onboarding
   - [ ] Deep-link routing
   - [ ] Add to Home Screen prompts
   - [ ] Offline fallback
   - Labels: `web`, `P2-medium`, `pwa`

---

### 🥽 Meta Horizon Track

**Epic Issues:**

1. **Horizon World Setup**
   - [ ] Join Meta Horizon Start Program
   - [ ] Desktop Editor installation
   - [ ] Project scaffolding
   - [ ] Publishing pipeline
   - Labels: `horizon`, `P1-high`, `setup`

2. **Asset Transmutation**
   - [ ] 3D model conversion (GLB→FBX)
   - [ ] Texture optimization
   - [ ] Audio asset preparation
   - [ ] Upload to Asset Library
   - Labels: `horizon`, `P1-high`, `assets`

3. **TypeScript Gizmo Implementation**
   - [ ] Cocktail carousel script
   - [ ] Photo capture script
   - [ ] Analytics event tracking
   - [ ] UI panels + input handling
   - Labels: `horizon`, `P0-critical`, `scripting`

4. **Intersection Layer**
   - [ ] State sync mechanism
   - [ ] Event bridge to Customer.io
   - [ ] Asset pipeline monitoring
   - [ ] Cross-platform testing
   - Labels: `horizon`, `P1-high`, `integration`

---

### 🏆 Competition Track (Dec 9 Deadline)

**Epic Issues:**

1. **Submission Requirements**
   - [ ] Join Meta Horizon Start Program (URGENT)
   - [ ] Build demo video (3-5 min)
   - [ ] Write project description
   - [ ] Document special features (Passthrough Camera + AI)
   - Labels: `competition`, `P0-critical`, `documentation`

2. **Demo Polish**
   - [ ] Lifestyle Track positioning
   - [ ] Passthrough Camera showcase
   - [ ] Tavus.io AI integration demo
   - [ ] User flow documentation
   - Labels: `competition`, `P0-critical`, `demo`

3. **Competitive Positioning**
   - [ ] Highlight hotel/hospitality use case
   - [ ] Emphasize multi-platform strategy
   - [ ] Show customer validation (Dec 15 launch)
   - [ ] Document technical innovation
   - Labels: `competition`, `P1-high`, `strategy`

---

### 🏨 Launch Ops Track (Dec 15 Deadline)

**Epic Issues:**

1. **Royal Sonesta Preparation**
   - [ ] Device procurement/testing
   - [ ] Network/WiFi validation
   - [ ] Staff training materials
   - [ ] Backup procedures
   - Labels: `launch`, `P0-critical`, `operations`

2. **Day-Of Runbook**
   - [ ] Setup checklist
   - [ ] Troubleshooting guide
   - [ ] Recovery procedures
   - [ ] Contact escalation
   - Labels: `launch`, `P0-critical`, `documentation`

3. **Customer Success**
   - [ ] Onboarding flow testing
   - [ ] Feedback collection mechanism
   - [ ] Success metrics dashboard
   - [ ] Post-event analysis plan
   - Labels: `launch`, `P1-high`, `customer-success`

---

### ⚙️ Infrastructure Track

**Epic Issues:**

1. **Deployment Pipeline**
   - [ ] Vercel production config
   - [ ] Environment variable management
   - [ ] GitHub Actions CI/CD
   - [ ] Monitoring/alerting
   - Labels: `infrastructure`, `P1-high`, `devops`

2. **Performance Optimization**
   - [ ] Bundle size analysis
   - [ ] Image optimization
   - [ ] API response caching
   - [ ] CDN configuration
   - Labels: `infrastructure`, `P2-medium`, `performance`

---

### 📊 Analytics Track

**Epic Issues:**

1. **Unified Analytics**
   - [ ] Amplitude configuration
   - [ ] Customer.io Pipeline API
   - [ ] Dashboard integration
   - [ ] Cross-platform event taxonomy
   - Labels: `analytics`, `P1-high`, `tracking`

2. **Monitoring & Observability**
   - [ ] Error tracking (Sentry/similar)
   - [ ] Performance monitoring
   - [ ] User session replay
   - [ ] A/B testing framework
   - Labels: `analytics`, `P2-medium`, `monitoring`

---

## Issue Templates

### Template 1: Feature Issue

\`\`\`markdown
## Description
Brief description of the feature

## Track
- [ ] Web PWA
- [ ] Meta Horizon
- [ ] Competition
- [ ] Launch Ops
- [ ] Infrastructure
- [ ] Analytics

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes
Implementation details, dependencies, risks

## Testing Plan
How to verify this works

## Labels
`track-name`, `priority`, `platform`
\`\`\`

### Template 2: Bug Report

\`\`\`markdown
## Bug Description
What's broken?

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Platform: Web/Mobile/VR
- Device: 
- Browser/OS:
- Version:

## Screenshots/Logs
Attach evidence

## Priority
- [ ] P0-Critical (Blocks launch)
- [ ] P1-High
- [ ] P2-Medium
- [ ] P3-Low

## Labels
`bug`, `track-name`, `priority`
\`\`\`

### Template 3: Competition Task

\`\`\`markdown
## Competition Deliverable
What needs to be submitted

## Deadline
December 9, 2025

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Submission Checklist
- [ ] Content created
- [ ] Review completed
- [ ] Uploaded to Devpost
- [ ] Confirmation received

## Labels
`competition`, `P0-critical`, `documentation`
\`\`\`

---

## Workflow Automation

### Automation Rules

1. **Auto-label by Track**
   - When issue title contains "[Web]" → Add `web` label
   - When issue title contains "[Horizon]" → Add `horizon` label
   - When issue title contains "[Competition]" → Add `competition` label

2. **Auto-move to Review**
   - When PR is opened → Move linked issue to "Review" column

3. **Auto-close on Merge**
   - When PR is merged → Move issue to "Done" column

4. **Deadline Alerts**
   - 3 days before deadline → Add comment reminder
   - 1 day before deadline → Notify in Slack/Discord

5. **Blocked Items**
   - When labeled `blocked` → Move to "Blocked" column
   - When `blocked` label removed → Move back to "In Progress"

---

## Labels Taxonomy

### Priority
- `P0-critical` - Blocks launch (red)
- `P1-high` - Important for launch (orange)
- `P2-medium` - Nice to have (yellow)
- `P3-low` - Future enhancement (gray)

### Track
- `web` - Web PWA development (blue)
- `horizon` - Meta Horizon work (purple)
- `competition` - Competition submission (gold)
- `launch` - Launch operations (green)
- `infrastructure` - DevOps/infra (cyan)
- `analytics` - Tracking/monitoring (pink)

### Platform
- `mobile` - Mobile-specific
- `desktop` - Desktop-specific
- `vr` - VR headset-specific
- `cross-platform` - Multi-platform

### Type
- `feature` - New functionality
- `bug` - Something broken
- `documentation` - Docs/guides
- `testing` - QA/testing work
- `performance` - Optimization
- `security` - Security fix

---

## Milestone Structure

### Milestone 1: Competition Submission (Dec 9)
**Goals:**
- Join Meta Horizon Start Program
- Complete demo video
- Submit to Devpost
- Document special features

### Milestone 2: Royal Sonesta Launch (Dec 15)
**Goals:**
- Camera system production-ready
- AR try-on experiences live
- Analytics fully operational
- Day-of runbook complete

### Milestone 3: Post-Launch Optimization (Dec 16-31)
**Goals:**
- Analyze launch metrics
- Implement user feedback
- Optimize performance
- Plan Q1 2026 competition

### Milestone 4: Q1 2026 Competition Prep
**Goals:**
- Gather customer validation metrics
- Build case studies
- Enhanced feature set
- Submit to next Meta competition

---

## Daily Standup Template

**What did you complete yesterday?**
- Issue #123: Camera fallback logic
- Issue #124: Amplitude integration

**What are you working on today?**
- Issue #125: Photo booth frame overlays
- Issue #126: Horizon world setup

**Any blockers?**
- Waiting for Meta Horizon Start Program approval
- Need design assets for emerald glow effect

---

## Weekly Review Template

**Week of [Date]**

**Velocity:** [Story points completed]

**Completed:**
- ✅ Issue #123 (Web PWA, 5pts)
- ✅ Issue #124 (Analytics, 3pts)

**In Progress:**
- 🔨 Issue #125 (Horizon, 8pts) - 60% complete
- 🔨 Issue #126 (Competition, 5pts) - 30% complete

**Blocked:**
- 🚫 Issue #127 (Infrastructure) - Waiting on API key

**Risks:**
- Dec 9 deadline approaching - need to accelerate competition tasks
- Camera performance on iPhone 12 needs optimization

**Next Week Priorities:**
1. Complete competition submission
2. Finalize camera system
3. Begin Horizon world scripting

---

## Integration with Existing Docs

This GitHub Projects structure ties directly to:

- `/docs/TRANSFORMATION_ROADMAP.md` - Technical architecture
- `/docs/META_HORIZON_CHALLENGE_STRATEGY.md` - Competition strategy
- `/docs/CAMERA_ARCHITECTURE.md` - Camera implementation
- `/docs/DUAL_ANALYTICS_STRATEGY.md` - Analytics approach
- `/app/dashboard/page.tsx` - Real-time monitoring

All issues should reference relevant documentation for context.

---

## Getting Started

1. **Create GitHub Project**
   - Go to repository → Projects → New Project
   - Select "Board" template
   - Add custom fields (Track, Priority, Deadline, Size, Platform)

2. **Create Initial Issues**
   - Use templates above
   - Assign to tracks
   - Set priorities and deadlines

3. **Set Up Automation**
   - Configure auto-labeling
   - Set deadline reminders
   - Connect PR workflow

4. **Daily Updates**
   - Move cards as work progresses
   - Update issue comments with progress
   - Tag blockers immediately

5. **Weekly Reviews**
   - Assess velocity
   - Adjust priorities
   - Refine estimates

---

## Success Metrics

**Track by Track:**

- **Web PWA:** Camera uptime %, AR interaction rate
- **Meta Horizon:** Asset conversion success rate, gizmo completion
- **Competition:** Submission quality score, judge feedback
- **Launch Ops:** Customer satisfaction, zero critical bugs
- **Infrastructure:** Deployment frequency, build success rate
- **Analytics:** Event capture rate, dashboard usage

Monitor these via `/dashboard` and weekly reviews.
