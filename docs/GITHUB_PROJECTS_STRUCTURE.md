# GitHub Projects Management Structure

## Overview

This repository uses GitHub Projects to manage the Emerald Gem AR Platform development across 7 parallel tracks, aligned with the December 9 Meta Horizon Start Developer Competition deadline and December 15 Royal Sonesta launch.

## Project Board Structure

### Board: Emerald Gem AR Platform

**Views:**
1. **Sprint Board** - Kanban by status (Backlog, Ready, In Progress, Review, Done)
2. **Track View** - Grouped by development track
3. **Timeline** - Gantt chart view by milestone
4. **Priority Matrix** - 2x2 matrix (Impact vs Effort)

### Development Tracks

#### Track 1: Web PWA (Foundation)
- Status: Active - Production Ready
- Owner: Primary Development
- Tech: Next.js 16, React 19, WebXR, IWSDK, Universal AR SDK
- Priority: P0 - Critical for Dec 15 launch

**Key Components:**
- Front-facing camera system (60fps, auto-fallback)
- AR photo booth with filters
- Cocktail menu with 3D visualization
- Analytics integration (Amplitude + Customer.io)
- Progressive Web App deployment

#### Track 2: Meta Horizon (Transmutation)
- Status: Planning - Competition Focus
- Owner: VR Development
- Tech: Horizon Desktop Editor, TypeScript Gizmos
- Priority: P1 - Competition entry

**Key Components:**
- VR world environment
- Mobile AR companion experience
- Asset bridge to web PWA
- Gizmo mappings from React components
- Cross-platform analytics

#### Track 3: Competition (Meta Horizon Start)
- Status: Active - Dec 9 Deadline
- Owner: Competition Team
- Track: Lifestyle + Passthrough Camera/AI Special Award
- Prize: Share of $1.5M

**Submission Requirements:**
- Proof-of-concept Horizon world
- Mobile AR experience
- Documentation and demo video
- Technical architecture explanation
- Customer deployment proof (Royal Sonesta)

#### Track 4: Launch Operations (Royal Sonesta)
- Status: Active - Dec 15 Deadline
- Owner: Operations Team
- Venue: Royal Sonesta Seattle
- Priority: P0 - Revenue Critical

**Launch Checklist:**
- Venue WiFi testing and optimization
- Staff training materials
- Guest onboarding flow
- QR code/NFC gem deployment
- Analytics dashboard for venue managers
- Support escalation process

#### Track 5: Infrastructure
- Status: Ongoing
- Owner: DevOps
- Platform: Vercel + Next.js
- Priority: P1

**Components:**
- Vercel deployment pipeline
- Environment variable management
- Analytics integration (Amplitude, Customer.io)
- Performance monitoring
- Error tracking and alerts
- Database connections (if needed)

#### Track 6: Analytics & Optimization
- Status: Active
- Owner: Data Team
- Tools: Amplitude, Customer.io, Interpretation Layer
- Priority: P1

**Metrics:**
- User engagement (DAU/MAU)
- Conversion funnels (scan → view → order)
- Platform comparison (web vs mobile vs VR)
- Venue-specific performance
- ROI tracking (285% target)

#### Track 7: AI Asset Pipeline (New)
- Status: Research / Planning
- Owner: AI Team
- Tech: Meta SAM 3D, Vespa.ai, Vapi.ai
- Priority: P2 (P1 for Competition Award)

**Key Components:**
- SAM 3D integration for automated asset segmentation
- Semantic labeling pipeline
- Interpretation Layer schema implementation
- Context-aware voice triggers (Ruby NPC)

## Issue Templates

### Feature Request (.github/ISSUE_TEMPLATE/feature.md)
\`\`\`yaml
name: Feature Request
about: Propose new functionality
title: '[FEATURE] '
labels: ['enhancement', 'needs-triage']
assignees: ''
\`\`\`

### Bug Report (.github/ISSUE_TEMPLATE/bug.md)
\`\`\`yaml
name: Bug Report
about: Report an issue
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: ''
\`\`\`

### Competition Task (.github/ISSUE_TEMPLATE/competition.md)
\`\`\`yaml
name: Competition Task
about: Meta Horizon Start Developer Competition task
title: '[COMPETITION] '
labels: ['competition', 'deadline:dec-9']
assignees: ''
\`\`\`

### AI Asset Pipeline Task (.github/ISSUE_TEMPLATE/ai-asset-pipeline.md)
\`\`\`yaml
name: AI Asset Pipeline Task
about: Task related to AI Asset Pipeline
title: '[AI ASSET] '
labels: ['ai-asset', 'needs-triage']
assignees: ''
\`\`\`

## Spec-Kit Integration

This project uses GitHub Spec Kit for AI-assisted development. Spec-kit documents are located in `.github/spec-kit/`:

1. **PROJECT_SPEC.md** - High-level user journeys and outcomes
2. **TECHNICAL_PLAN.md** - Architecture, stack, constraints
3. **TASK_BREAKDOWN.md** - Granular implementation tasks

### Spec-Kit Workflow

**Phase 1: Specify** - Define what to build
- User journeys (AR try-on, photo booth, cocktail ordering)
- Platform requirements (web, mobile, VR)
- Success metrics

**Phase 2: Plan** - Technical architecture
- Stack decisions (Next.js, IWSDK, Horizon)
- API contracts
- Data flow and state management
- Integration points (analytics, camera)

**Phase 3: Tasks** - Break into implementable units
- Each task = 1 GitHub Issue
- Tasks map to development tracks
- Clear acceptance criteria
- Dependencies identified

**Phase 4: Implement** - AI agent execution
- Autonomous agents use spec-kit as source of truth
- Changes reviewed against spec
- Continuous alignment verification

## Labels

### Priority
- `P0` - Critical (launch blockers)
- `P1` - High (competition, key features)
- `P2` - Medium (enhancements)
- `P3` - Low (nice-to-have)

### Track
- `track:web-pwa`
- `track:meta-horizon`
- `track:competition`
- `track:launch-ops`
- `track:infrastructure`
- `track:analytics`
- `track:ai-asset-pipeline`

### Status
- `status:backlog`
- `status:ready`
- `status:in-progress`
- `status:blocked`
- `status:review`
- `status:done`

### Type
- `bug`
- `enhancement`
- `documentation`
- `research`
- `competition`
- `ai-asset`

### Deadlines
- `deadline:dec-9` - Competition submission
- `deadline:dec-15` - Royal Sonesta launch
- `deadline:q1-2026` - Next competition cycle

## Milestones

### Milestone 1: Web PWA MVP (Completed)
- Camera system with 60fps fallback
- AR photo booth
- Cocktail menu
- Analytics integration
- Vercel deployment

### Milestone 2: Competition Submission (Dec 9)
- Horizon world proof-of-concept
- Mobile AR experience
- Documentation package
- Demo video
- Join Meta Horizon Start Program

### Milestone 3: Royal Sonesta Launch (Dec 15)
- Venue WiFi optimization
- Staff training
- Guest onboarding
- Physical gem deployment
- Live monitoring dashboard

### Milestone 4: Post-Launch Optimization (Dec 16-31)
- Performance tuning
- User feedback integration
- Analytics review
- ROI measurement
- Q1 2026 competition planning

## Automation Rules

### Auto-labeling
- Issues with "bug" in title → add `bug` label
- Issues with "competition" in title → add `competition` + `deadline:dec-9` labels
- Issues with "ai asset" in title → add `ai-asset` label
- PRs targeting `main` → require review

### Status Transitions
- Issue assigned → move to "In Progress"
- PR opened → move issue to "Review"
- PR merged → move issue to "Done"

### Notifications
- P0 issues → notify all team members
- Deadline approaching (3 days) → daily reminders
- Blocked issues → escalate to project lead

## Daily Standup Template

**Track Progress:**
- Web PWA: [status]
- Meta Horizon: [status]
- Competition: [status]
- Launch Ops: [status]
- Infrastructure: [status]
- Analytics: [status]
- AI Asset Pipeline: [status]

**Completed Yesterday:**
- [Issue #] - Description

**Today's Focus:**
- [Issue #] - Description

**Blockers:**
- [Issue #] - Description + escalation needed

**Metrics:**
- Sprint velocity: [points/week]
- Issues closed: [#]
- Days to Dec 9: [#]
- Days to Dec 15: [#]

## Velocity Tracking

**Sprint Duration:** 1 week (Mon-Fri)

**Story Points:**
- XS: 1 point (< 2 hours)
- S: 2 points (2-4 hours)
- M: 3 points (4-8 hours)
- L: 5 points (1-2 days)
- XL: 8 points (3-5 days)

**Team Capacity:**
- Target: 20-25 points/sprint/developer
- Track separately by development track

## GitHub Integration

### Connect to v0 Project
1. Push code to GitHub using v0's GitHub button
2. Create GitHub Project in repository
3. Import milestones and labels
4. Set up automation rules
5. Link issues to v0 tasks

### Sync with v0 Workspace
- v0 workspace: "Cultural hospitality AR Pilot"
- GitHub repo: [your-org/emerald-gem-ar]
- Auto-deploy: Vercel connected to main branch
- Environment variables synced via Vercel

## Resources

- **Documentation:** `/docs` directory
- **Spec-Kit:** `.github/spec-kit/`
- **Issue Templates:** `.github/ISSUE_TEMPLATE/`
- **Competition Details:** `docs/META_HORIZON_CHALLENGE_STRATEGY.md`
- **Analytics Strategy:** `docs/DUAL_ANALYTICS_STRATEGY.md`
- **Camera Architecture:** `docs/CAMERA_ARCHITECTURE.md`
- **AI Asset Pipeline Strategy:** `docs/AI_ASSET_PIPELINE_STRATEGY.md`
