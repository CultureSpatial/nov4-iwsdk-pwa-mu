## 🤖 AI-Driven Development with GitHub Spec Kit

This project leverages **GitHub Spec Kit** for spec-driven development, enabling AI coding agents to systematically implement features through a structured workflow.

### Spec Kit Workflow

**Phase 1: Specify** (`.github/spec-kit/PROJECT_SPEC.md`)
- High-level user journeys and desired outcomes
- Success criteria and launch milestones
- Living contract updated as project evolves

**Phase 2: Plan** (`.github/spec-kit/TECHNICAL_PLAN.md`)
- Technical architecture and stack decisions
- API endpoints and data models
- Performance requirements and constraints

**Phase 3: Tasks** (`.github/spec-kit/TASK_BREAKDOWN.md`)
- Granular, reviewable implementation tasks
- Priority and dependency mapping
- Story point estimates for velocity tracking

**Phase 4: Implement**
- AI agents execute tasks from breakdown
- Developers review focused code changes
- GitHub Projects tracks progress across 6 parallel tracks

### Using Spec Kit with v0

When working with v0 (this AI assistant):

1. **Reference the spec:** "Implement TASK-003 from spec-kit breakdown"
2. **Validate against plan:** v0 checks technical plan for constraints
3. **Update spec on changes:** Major pivots update PROJECT_SPEC.md
4. **Track in GitHub Projects:** Link issues to spec-kit tasks

### Parallel Development Tracks

Using GitHub Projects + Spec Kit enables simultaneous work across:
- Web PWA (camera, AR experiences)
- Meta Horizon (VR world, TypeScript gizmos)
- Competition submission (demo video, documentation)
- Launch operations (runbook, device testing)
- Infrastructure (deployment, monitoring)
- Analytics (Amplitude, Customer.io integration)

See `.github/spec-kit/` for complete specifications.
