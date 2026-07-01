"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AlphaCase } from "@/lib/schemas/alpha-case.schema";
import { runDiagnostic } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";

type RunDiagnosticSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

export function RunDiagnosticSection({
  projectId,
  alphaCase,
}: RunDiagnosticSectionProps) {
  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore((state) => state.unlockAndFocusSection);

  const mutation = useMutation({
    mutationFn: () => runDiagnostic(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnostic-result", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      unlockAndFocusSection("result");
      document.getElementById("result")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
  });

  return (
    <WorkspaceSection
      id="run-diagnostic"
      title="Run Diagnostic"
      description="Confirm the ML diagnostic setup and run the mock AFML analysis."
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm font-medium text-neutral-300">
            Training Structure
          </p>

          <div className="mt-3 space-y-2 font-mono text-sm text-neutral-400">
            <p>X_train = alpha features</p>
            <p>y_train = triple-barrier labels</p>
            <p>sample_weight = AFML weights</p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-400">
          <p>Expression: {alphaCase.expression}</p>
          <p className="mt-1">
            Bet sizing method: {alphaCase.betSizingMethod.replaceAll("_", " ")}
          </p>
        </div>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Running..." : "Run AFML Diagnostic"}
        </Button>
      </div>
    </WorkspaceSection>
  );
}