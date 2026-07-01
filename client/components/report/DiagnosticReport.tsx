"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";

import {
  getAlphaCase,
  getDiagnosticResult,
  getProject,
} from "@/lib/api/mock-api";
import { routes } from "@/lib/constants/routes";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DiagnosticReportProps = {
  projectId: string;
};

type RiskLevel = "low" | "medium" | "high" | "extreme";

export function DiagnosticReport({ projectId }: DiagnosticReportProps) {
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  const { data: alphaCase, isLoading: isAlphaCaseLoading } = useQuery({
    queryKey: ["alpha-case", projectId],
    queryFn: () => getAlphaCase(projectId),
  });

  const {
    data: diagnosticResult,
    isLoading: isDiagnosticLoading,
    isError: isDiagnosticError,
  } = useQuery({
    queryKey: ["diagnostic-result", projectId],
    queryFn: () => getDiagnosticResult(projectId),
    retry: false,
  });

  const isLoading =
    isProjectLoading || isAlphaCaseLoading || isDiagnosticLoading;

  if (isLoading) {
    return (
      <AppShell>
        <div className="px-8 py-10 text-neutral-400">Loading report...</div>
      </AppShell>
    );
  }

  if (!project || !alphaCase || isDiagnosticError || !diagnosticResult) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl px-8 py-10">
          <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
            <CardHeader>
              <CardTitle>No diagnostic report yet</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm text-neutral-400">
              <p>
                Run the AFML diagnostic in the workspace before opening the
                report page.
              </p>

              <Button asChild>
                <Link href={routes.projectWorkspace(projectId)}>
                  Back to workspace
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const overallRisk = getOverallRiskLevel(diagnosticResult.risks);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-8 py-10">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <Button
              asChild
              variant="ghost"
              className="mb-4 px-0 text-neutral-400 hover:text-neutral-50"
            >
              <Link href={routes.projectWorkspace(projectId)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to workspace
              </Link>
            </Button>

            <p className="text-sm text-neutral-500">AFML Diagnostic Report</p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-50">
              {project.name}
            </h1>

            <p className="mt-3 max-w-2xl text-neutral-400">
              Screenshot-friendly report for evaluating whether an alpha
              expression appears reliable, overfit, leaky, redundant, or
              unstable.
            </p>
          </div>

          <Button variant="outline" className="border-neutral-800">
            <ExternalLink className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Executive Summary</CardTitle>
                <RiskBadge risk={overallRisk} />
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Hypothesis
                </p>
                <p className="mt-2 text-sm text-neutral-300">
                  {alphaCase.hypothesis || "No hypothesis provided."}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Expression
                </p>
                <pre className="mt-2 overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-sm text-neutral-200">
                  {alphaCase.expression}
                </pre>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Interpretation
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-300">
                  This expression is treated as an engineered alpha score
                  feature. The AFML diagnostic layer tests whether this signal
                  appears predictive of triple-barrier labels and whether the
                  resulting performance is reliable after accounting for sample
                  overlap, validation leakage, and Sharpe inflation risk.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Sharpe"
              value={diagnosticResult.metrics.sharpe.toFixed(2)}
            />
            <MetricCard
              label="PSR"
              value={diagnosticResult.metrics.psr.toFixed(2)}
            />
            <MetricCard
              label="DSR"
              value={diagnosticResult.metrics.dsrPass ? "Pass" : "Fail"}
            />
            <MetricCard
              label="Avg uniqueness"
              value={diagnosticResult.metrics.averageUniqueness.toFixed(2)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Returns"
              value={`${diagnosticResult.metrics.returns.toFixed(2)}%`}
            />
            <MetricCard
              label="Drawdown"
              value={`${diagnosticResult.metrics.drawdown.toFixed(2)}%`}
            />
            <MetricCard
              label="Turnover"
              value={`${diagnosticResult.metrics.turnover.toFixed(2)}%`}
            />
            <MetricCard
              label="P[y=1]"
              value={diagnosticResult.probabilities.pUp.toFixed(2)}
            />
          </div>

          <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
            <CardHeader>
              <CardTitle>Risk Flags</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                <RiskBadge
                  label="Leakage"
                  risk={diagnosticResult.risks.leakageRisk}
                />
                <RiskBadge
                  label="Overfitting"
                  risk={diagnosticResult.risks.overfittingRisk}
                />
                <RiskBadge
                  label="Feature redundancy"
                  risk={diagnosticResult.risks.featureRedundancyRisk}
                />
                <RiskBadge label="Data" risk={diagnosticResult.risks.dataRisk} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
              <CardHeader>
                <CardTitle>Key Warnings</CardTitle>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 text-sm text-neutral-400">
                  {diagnosticResult.warnings.map((warning) => (
                    <li key={warning} className="leading-6">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
              <CardHeader>
                <CardTitle>Recommended Fixes</CardTitle>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 text-sm text-neutral-400">
                  {diagnosticResult.recommendedFixes.map((fix) => (
                    <li key={fix} className="leading-6">
                      • {fix}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
            <CardHeader>
              <CardTitle>AFML Concepts Triggered</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <ConceptCard
                  title="Triple-barrier labeling"
                  description="Future price path is converted into y ∈ {-1, 0, 1}."
                />
                <ConceptCard
                  title="Average uniqueness"
                  description="Overlapping labeled events reduce independent information."
                />
                <ConceptCard
                  title="Purged CV + embargo"
                  description="Validation must control for label overlap and leakage."
                />
                <ConceptCard
                  title="Probability bet sizing"
                  description="Prediction confidence is translated into position size."
                />
                <ConceptCard
                  title="PSR"
                  description="Observed Sharpe is adjusted for non-normality and sample length."
                />
                <ConceptCard
                  title="DSR"
                  description="Sharpe threshold is adjusted for multiple trials and selection bias."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
      <CardContent className="p-4">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-neutral-100">{value}</p>
      </CardContent>
    </Card>
  );
}

function RiskBadge({
  label,
  risk,
}: {
  label?: string;
  risk: RiskLevel;
}) {
  const className =
    risk === "low"
      ? "border-emerald-800 bg-emerald-950 text-emerald-300"
      : risk === "medium"
        ? "border-yellow-800 bg-yellow-950 text-yellow-300"
        : risk === "high"
          ? "border-orange-800 bg-orange-950 text-orange-300"
          : "border-red-800 bg-red-950 text-red-300";

  return (
    <Badge variant="outline" className={className}>
      {label ? `${label}: ${risk}` : `Overall risk: ${risk}`}
    </Badge>
  );
}

function ConceptCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <p className="text-sm font-medium text-neutral-200">{title}</p>
      <p className="mt-2 text-xs leading-5 text-neutral-500">{description}</p>
    </div>
  );
}

function getOverallRiskLevel(risks: {
  leakageRisk: RiskLevel;
  overfittingRisk: RiskLevel;
  featureRedundancyRisk: RiskLevel;
  dataRisk: RiskLevel;
}) {
  const values = Object.values(risks);

  if (values.includes("extreme")) return "extreme";
  if (values.includes("high")) return "high";
  if (values.includes("medium")) return "medium";

  return "low";
}