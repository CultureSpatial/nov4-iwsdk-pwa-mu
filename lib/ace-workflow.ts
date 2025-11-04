import { trackEvent } from "./analytics"

// ACE-Driven Orchestration: Assess → Control → Execute
export interface ACEWorkflowStep {
  phase: "assess" | "control" | "execute"
  action: string
  timestamp: Date
  evidence?: string
  status: "pending" | "in-progress" | "complete" | "blocked"
  blockers?: string[]
  sdkImplementations?: string[]
}

export interface DecisionLogEntry {
  id: string
  timestamp: Date
  category: "integration" | "validation" | "platform" | "asset" | "api"
  summary: string
  evidence: {
    implementation: string[]
    testResults: string[]
    outletCompatibility: Record<string, "pass" | "fail" | "pending">
  }
  deviations?: string[]
  hitlReview?: {
    required: boolean
    status: "pending" | "approved" | "rejected"
    reviewer?: string
    notes?: string
  }
}

class ACEWorkflowManager {
  private steps: ACEWorkflowStep[] = []
  private decisionLog: DecisionLogEntry[] = []

  // Assess: Evaluate requirements and platform capabilities
  assess(action: string, sdkImplementations: string[]): ACEWorkflowStep {
    const step: ACEWorkflowStep = {
      phase: "assess",
      action,
      timestamp: new Date(),
      status: "in-progress",
      sdkImplementations,
    }
    this.steps.push(step)
    trackEvent("ace_workflow_assess", { action, sdks: sdkImplementations })
    return step
  }

  // Control: Validate and prepare for execution
  control(action: string, evidence: string): ACEWorkflowStep {
    const step: ACEWorkflowStep = {
      phase: "control",
      action,
      timestamp: new Date(),
      status: "in-progress",
      evidence,
    }
    this.steps.push(step)
    trackEvent("ace_workflow_control", { action })
    return step
  }

  // Execute: Perform the action and log results
  execute(action: string, evidence: string, blockers?: string[]): ACEWorkflowStep {
    const step: ACEWorkflowStep = {
      phase: "execute",
      action,
      timestamp: new Date(),
      status: blockers && blockers.length > 0 ? "blocked" : "complete",
      evidence,
      blockers,
    }
    this.steps.push(step)
    trackEvent("ace_workflow_execute", {
      action,
      status: step.status,
      hasBlockers: !!blockers?.length,
    })
    return step
  }

  // Log decision with evidence for HITL review
  logDecision(entry: Omit<DecisionLogEntry, "id" | "timestamp">): DecisionLogEntry {
    const logEntry: DecisionLogEntry = {
      ...entry,
      id: `decision-${Date.now()}`,
      timestamp: new Date(),
    }
    this.decisionLog.push(logEntry)

    trackEvent("decision_logged", {
      category: entry.category,
      requiresHITL: entry.hitlReview?.required,
    })

    return logEntry
  }

  // Get workflow summary for reporting
  getWorkflowSummary() {
    return {
      totalSteps: this.steps.length,
      byPhase: {
        assess: this.steps.filter((s) => s.phase === "assess").length,
        control: this.steps.filter((s) => s.phase === "control").length,
        execute: this.steps.filter((s) => s.phase === "execute").length,
      },
      byStatus: {
        pending: this.steps.filter((s) => s.status === "pending").length,
        inProgress: this.steps.filter((s) => s.status === "in-progress").length,
        complete: this.steps.filter((s) => s.status === "complete").length,
        blocked: this.steps.filter((s) => s.status === "blocked").length,
      },
      blockers: this.steps.filter((s) => s.blockers && s.blockers.length > 0),
    }
  }

  // Get decision log for HITL review
  getDecisionLog(requiresReview?: boolean) {
    if (requiresReview !== undefined) {
      return this.decisionLog.filter((d) => d.hitlReview?.required === requiresReview)
    }
    return this.decisionLog
  }

  // Export evidence for documentation
  exportEvidence() {
    return {
      workflow: this.steps,
      decisions: this.decisionLog,
      summary: this.getWorkflowSummary(),
      exportedAt: new Date().toISOString(),
    }
  }
}

export const aceWorkflow = new ACEWorkflowManager()
