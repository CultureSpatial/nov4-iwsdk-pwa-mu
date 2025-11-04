"use client"

import { useEffect, useState } from "react"
import { aceWorkflow } from "@/lib/ace-workflow"
import { platformAgnosticAR } from "@/lib/platform-agnostic-ar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ACEWorkflowDashboard() {
  const [summary, setSummary] = useState(aceWorkflow.getWorkflowSummary())
  const [decisions, setDecisions] = useState(aceWorkflow.getDecisionLog())
  const [validations, setValidations] = useState(platformAgnosticAR.getValidationSummary())

  useEffect(() => {
    // Example: Register SDK implementations for validation
    platformAgnosticAR.registerImplementation({
      sdk: "meta-iwsdk",
      capabilities: {
        worldMapping: true,
        anchorPlacement: true,
        handTracking: true,
        imageTracking: false,
        instantTracking: true,
        spatialUI: true,
      },
      testResults: {
        web: "pass",
        mobile: "pass",
        headset: "pass",
      },
    })

    platformAgnosticAR.registerImplementation({
      sdk: "universal-ar",
      capabilities: {
        worldMapping: true,
        anchorPlacement: true,
        handTracking: false,
        imageTracking: true,
        instantTracking: true,
        spatialUI: false,
      },
      testResults: {
        web: "pass",
        mobile: "pass",
        headset: "pending",
      },
    })

    // Refresh data
    setSummary(aceWorkflow.getWorkflowSummary())
    setDecisions(aceWorkflow.getDecisionLog())
    setValidations(platformAgnosticAR.getValidationSummary())
  }, [])

  const exportEvidence = () => {
    const evidence = aceWorkflow.exportEvidence()
    const blob = new Blob([JSON.stringify(evidence, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ace-evidence-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ACE Workflow Dashboard</h1>
          <p className="text-muted-foreground">Assess → Control → Execute orchestration</p>
        </div>
        <Button onClick={exportEvidence}>Export Evidence</Button>
      </div>

      {/* Workflow Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Steps</CardTitle>
            <CardDescription>Total: {summary.totalSteps}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Assess:</span>
              <Badge variant="secondary">{summary.byPhase.assess}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Control:</span>
              <Badge variant="secondary">{summary.byPhase.control}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Execute:</span>
              <Badge variant="secondary">{summary.byPhase.execute}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Current state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Complete:</span>
              <Badge variant="default">{summary.byStatus.complete}</Badge>
            </div>
            <div className="flex justify-between">
              <span>In Progress:</span>
              <Badge variant="secondary">{summary.byStatus.inProgress}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Blocked:</span>
              <Badge variant="destructive">{summary.byStatus.blocked}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Agnosticism</CardTitle>
            <CardDescription>SDK implementations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Implementations:</span>
                <Badge variant={validations.length >= 2 ? "default" : "destructive"}>{validations.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {validations.length >= 2 ? "✓ Meets ≥2 requirement" : "✗ Needs more SDKs"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SDK Validations */}
      <Card>
        <CardHeader>
          <CardTitle>SDK Validations</CardTitle>
          <CardDescription>Platform compatibility testing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {validations.map((validation) => (
              <div key={validation.sdk} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{validation.sdk}</h3>
                  <div className="flex gap-2">
                    <Badge variant={validation.testResults.web === "pass" ? "default" : "secondary"}>
                      Web: {validation.testResults.web}
                    </Badge>
                    <Badge variant={validation.testResults.mobile === "pass" ? "default" : "secondary"}>
                      Mobile: {validation.testResults.mobile}
                    </Badge>
                    <Badge variant={validation.testResults.headset === "pass" ? "default" : "secondary"}>
                      Headset: {validation.testResults.headset}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Capabilities:{" "}
                  {Object.entries(validation.capabilities)
                    .filter(([_, enabled]) => enabled)
                    .map(([cap]) => cap)
                    .join(", ")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Decision Log */}
      <Card>
        <CardHeader>
          <CardTitle>Decision Log</CardTitle>
          <CardDescription>Evidence and HITL review items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {decisions.map((decision) => (
              <div key={decision.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{decision.summary}</h3>
                    <p className="text-sm text-muted-foreground">{decision.timestamp.toLocaleString()}</p>
                  </div>
                  <Badge variant={decision.hitlReview?.required ? "destructive" : "default"}>
                    {decision.hitlReview?.required ? "HITL Required" : "Auto-approved"}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">Implementations:</span> {decision.evidence.implementation.join(", ")}
                  </div>
                  {decision.deviations && decision.deviations.length > 0 && (
                    <div className="text-destructive">
                      <span className="font-medium">Deviations:</span> {decision.deviations.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
