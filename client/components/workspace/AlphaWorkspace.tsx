"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/layout/AppShell";
import { getAlphaCase, getProject, getDiagnosticResult } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { ProjectSummarySection } from "@/components/workspace/ProjectSummarySection";
import { ExpressionSection } from "@/components/workspace/ExpressionSection";
import { TripleBarrierSection } from "@/components/workspace/TripleBarrierSection";
import { RunDiagnosticSection } from "@/components/workspace/RunDiagnosticSection";
import { ResultSection } from "@/components/workspace/ResultSection";

type AlphaWorkspaceProps = {
  projectId: string;
};

export function AlphaWorkspace({ projectId }: AlphaWorkspaceProps) {
  const setActiveProjectId = useUiStore((state) => state.setActiveProjectId);

  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  const { data: alphaCase, isLoading: isAlphaCaseLoading } = useQuery({
    queryKey: ["alpha-case", projectId],
    queryFn: () => getAlphaCase(projectId),
  });

  const { data: diagnosticResult } = useQuery({
    queryKey: ["diagnostic-result", projectId],
    queryFn: () => getDiagnosticResult(projectId),
    retry: false,
  });

  useEffect(() => {
    setActiveProjectId(projectId);
  }, [projectId, setActiveProjectId]);

  if (isProjectLoading || isAlphaCaseLoading) {
    return (
      <AppShell>
        <div className="px-8 py-10 text-neutral-400">Loading workspace...</div>
      </AppShell>
    );
  }

  if (!project || !alphaCase) {
    return (
      <AppShell>
        <div className="px-8 py-10 text-neutral-400">Project not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="mb-10">
          <p className="text-sm text-neutral-500">Alpha Case Workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-50">
            {project.name}
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-400">
            Configure a WorldQuant-style expression and run an AFML-style
            diagnostic workflow.
          </p>
        </div>

        <div className="space-y-5">
          <ProjectSummarySection project={project} alphaCase={alphaCase} />
          <ExpressionSection projectId={projectId} alphaCase={alphaCase} />
          <TripleBarrierSection projectId={projectId} alphaCase={alphaCase} />
          <RunDiagnosticSection projectId={projectId} alphaCase={alphaCase} />
          <ResultSection
            projectId={projectId}
            diagnosticResult={diagnosticResult ?? null}
          />
        </div>
      </div>
    </AppShell>
  );
}