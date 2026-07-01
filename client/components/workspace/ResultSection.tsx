"use client";

import Link from "next/link";

import type { DiagnosticResult } from "@/lib/schemas/diagnostic.schema";
import { routes } from "@/lib/constants/routes";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ResultSectionProps = {
  projectId: string;
  diagnosticResult: DiagnosticResult | null;
};

export function ResultSection({ projectId, diagnosticResult }: ResultSectionProps) {
  return (
    <WorkspaceSection
      id="result"
      title="Result"
      description="Review AFML diagnostics, risk warnings, and backtest statistics."
    >
      {!diagnosticResult ? (
        <div className="text-sm text-neutral-500">
          No diagnostic result yet. Run the AFML diagnostic first.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Metric label="P[y=1]" value={`${diagnosticResult.probabilities.pUp}`} />
            <Metric label="P[y=0]" value={`${diagnosticResult.probabilities.pFlat}`} />
            <Metric label="P[y=-1]" value={`${diagnosticResult.probabilities.pDown}`} />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Metric label="Sharpe" value={`${diagnosticResult.metrics.sharpe}`} />
            <Metric label="PSR" value={`${diagnosticResult.metrics.psr}`} />
            <Metric
              label="DSR"
              value={diagnosticResult.metrics.dsrPass ? "Pass" : "Fail"}
            />
            <Metric
              label="Avg Uniqueness"
              value={`${diagnosticResult.metrics.averageUniqueness}`}
            />
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
            <p className="mb-3 text-sm font-medium text-neutral-300">Risk Flags</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                leakage: {diagnosticResult.risks.leakageRisk}
              </Badge>
              <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                overfitting: {diagnosticResult.risks.overfittingRisk}
              </Badge>
              <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                data: {diagnosticResult.risks.dataRisk}
              </Badge>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
            <p className="mb-3 text-sm font-medium text-neutral-300">Warnings</p>
            <ul className="space-y-2 text-sm text-neutral-400">
              {diagnosticResult.warnings.map((warning) => (
                <li key={warning}>• {warning}</li>
              ))}
            </ul>
          </div>

          <Button asChild>
            <Link href={routes.projectReport(projectId)}>Write Report</Link>
          </Button>
        </div>
      )}
    </WorkspaceSection>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-neutral-100">{value}</p>
    </div>
  );
}